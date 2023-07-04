/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "destructuring.h"

#include <util/helpers.h>
#include <compiler/base/iterators.h>
#include <compiler/base/lreference.h>
#include <compiler/base/catchTable.h>
#include <compiler/core/pandagen.h>
#include <ir/base/property.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/objectExpression.h>

namespace panda::es2panda::compiler {

static void GenRestElement(PandaGen *pg, const ir::SpreadElement *restElement,
                           const DestructuringIterator &destIterator, bool isDeclaration)
{
    VReg array = pg->AllocReg();
    VReg index = pg->AllocReg();

    auto *next = pg->AllocLabel();
    auto *done = pg->AllocLabel();

    DestructuringRestIterator iterator(destIterator);

    // create left reference for rest element
    LReference lref = LReference::CreateLRef(pg, restElement, isDeclaration);

    // create an empty array first
    pg->CreateEmptyArray(restElement);
    pg->StoreAccumulator(restElement, array);

    // index = 0
    pg->LoadAccumulatorInt(restElement, 0);
    pg->StoreAccumulator(restElement, index);

    pg->SetLabel(restElement, next);

    iterator.Step(done);
    pg->StoreObjByValue(restElement, array, index);

    // index++
    pg->LoadAccumulatorInt(restElement, 1);
    pg->Binary(restElement, lexer::TokenType::PUNCTUATOR_PLUS, index);
    pg->StoreAccumulator(restElement, index);

    pg->Branch(restElement, next);

    pg->SetLabel(restElement, done);
    pg->LoadAccumulator(restElement, array);

    lref.SetValue();
}

static void GenArray(PandaGen *pg, const ir::ArrayExpression *array)
{
    DestructuringIterator iterator(pg, array);

    if (array->Elements().empty()) {
        iterator.Close(false);
        return;
    }

    DestructuringIteratorContext dstrCtx(pg, iterator);

    for (const auto *element : array->Elements()) {
        RegScope ers(pg);

        if (element->IsRestElement()) {
            GenRestElement(pg, element->AsRestElement(), iterator, array->IsDeclaration());
            break;
        }

        // if a hole exist, just let the iterator step ahead
        if (element->IsOmittedExpression()) {
            iterator.Step();
            continue;
        }

        const ir::Expression *init = nullptr;
        const ir::Expression *target = element;

        if (element->IsAssignmentPattern() || element->IsAssignmentExpression()) {
            auto *assignment = element->IsAssignmentPattern() ? element->AsAssignmentPattern() :
                                                                element->AsAssignmentExpression();
            target = assignment->Left();
            init = assignment->Right();
        }

        LReference lref = LReference::CreateLRef(pg, target, array->IsDeclaration());
        iterator.Step();

        if (init) {
            auto *assingValue = pg->AllocLabel();
            auto *defaultInit = pg->AllocLabel();
            pg->BranchIfStrictUndefined(element, defaultInit);
            pg->LoadAccumulator(element, iterator.Result());
            pg->Branch(element, assingValue);

            pg->SetLabel(element, defaultInit);
            init->Compile(pg);
            pg->SetLabel(element, assingValue);
        }

        lref.SetValue();
    }
}

static void GenObjectProperty(PandaGen *pg, const ir::ObjectExpression *object,
                              const ir::Expression *element, VReg value)
{
    RegScope propScope(pg);

    const ir::Property *propExpr = element->AsProperty();

    const ir::Expression *init = nullptr;
    const ir::Expression *key = propExpr->Key();
    const ir::Expression *target = propExpr->Value();

    if (target->IsAssignmentPattern() || target->IsAssignmentExpression()) {
        auto *assignment = target->IsAssignmentPattern() ? target->AsAssignmentPattern() :
                                                           target->AsAssignmentExpression();
        init = assignment->Right();
        target = assignment->Left();
    }

    LReference lref = LReference::CreateLRef(pg, target, object->IsDeclaration());

    // load obj property from rhs, return undefined if no corresponding property exists
    if (key->IsIdentifier()) {
        pg->LoadObjByName(element, value, key->AsIdentifier()->Name());
    } else {
        key->Compile(pg);
        pg->LoadObjByValue(element, value);
    }

    if (init != nullptr) {
        VReg loadedValue = pg->AllocReg();
        pg->StoreAccumulator(element, loadedValue);
        auto *getDefault = pg->AllocLabel();
        auto *store = pg->AllocLabel();

        pg->BranchIfStrictUndefined(element, getDefault);
        pg->LoadAccumulator(element, loadedValue);
        pg->Branch(element, store);

        // load default value
        pg->SetLabel(element, getDefault);
        init->Compile(pg);

        pg->SetLabel(element, store);
    }

    lref.SetValue();
}

static void GenObjectWithRest(PandaGen *pg, const ir::ObjectExpression *object, VReg rhs)
{
    const auto &properties = object->Properties();

    RegScope rs(pg);

    if (properties.size() == 1) {
        auto *element = properties[0];
        ASSERT(element->IsRestElement());
        VReg defaultProp = pg->AllocReg();
        LReference lref = LReference::CreateLRef(pg, element, object->IsDeclaration());
        pg->CreateObjectWithExcludedKeys(element, rhs, defaultProp, 0);
        lref.SetValue();
        return;
    }

    VReg propStart = pg->NextReg();

    for (const auto *element : properties) {
        if (element->IsRestElement()) {
            RegScope restScope(pg);
            LReference lref = LReference::CreateLRef(pg, element, object->IsDeclaration());
            pg->CreateObjectWithExcludedKeys(element, rhs, propStart, properties.size() - 1);
            lref.SetValue();
            break;
        }

        VReg propName = pg->AllocReg();
        const ir::Expression *key = element->AsProperty()->Key();
        if (key->IsIdentifier()) {
            pg->LoadAccumulatorString(key, key->AsIdentifier()->Name());
        } else {
            key->Compile(pg);
        }
        pg->StoreAccumulator(element, propName);

        GenObjectProperty(pg, object, element, rhs);
    }
}

static void GenObject(PandaGen *pg, const ir::ObjectExpression *object, VReg rhs)
{
    const auto &properties = object->Properties();

    if (properties.empty() || properties.back()->IsRestElement()) {
        auto *notNullish = pg->AllocLabel();
        auto *nullish = pg->AllocLabel();

        pg->LoadConst(object, Constant::JS_NULL);
        pg->Condition(object, lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL, rhs, nullish);
        pg->LoadConst(object, Constant::JS_UNDEFINED);
        pg->Condition(object, lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL, rhs, nullish);
        pg->Branch(object, notNullish);

        pg->SetLabel(object, nullish);
        pg->ThrowObjectNonCoercible(object);

        pg->SetLabel(object, notNullish);

        if (!properties.empty()) {
            return GenObjectWithRest(pg, object, rhs);
        }
    }

    for (const auto *element : properties) {
        GenObjectProperty(pg, object, element, rhs);
    }
}

void Destructuring::Compile(PandaGen *pg, const ir::Expression *pattern)
{
    RegScope rs(pg);

    VReg rhs = pg->AllocReg();
    pg->StoreAccumulator(pattern, rhs);

    if (pattern->IsArrayPattern() || pattern->IsArrayExpression()) {
        auto *arrExpr = pattern->IsArrayPattern() ? pattern->AsArrayPattern() :
                        pattern->AsArrayExpression();
        GenArray(pg, arrExpr);
    } else {
        auto *objExpr = pattern->IsObjectPattern() ? pattern->AsObjectPattern() :
                        pattern->AsObjectExpression();
        GenObject(pg, objExpr, rhs);
    }

    pg->LoadAccumulator(pattern, rhs);
}

}  // namespace panda::es2panda::compiler
