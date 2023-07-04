/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#include "memberExpression.h"

#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>

namespace panda::es2panda::ir {

void MemberExpression::Iterate(const NodeTraverser &cb) const
{
    cb(object_);
    cb(property_);
}

void MemberExpression::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "MemberExpression"},
                 {"object", object_},
                 {"property", property_},
                 {"computed", computed_},
                 {"optional", optional_}});
}

void MemberExpression::CompileObject(compiler::PandaGen *pg, compiler::VReg dest) const
{
    object_->Compile(pg);
    pg->StoreAccumulator(this, dest);
    pg->GetOptionalChain()->CheckNullish(optional_, dest);
}

compiler::Operand MemberExpression::CompileKey(compiler::PandaGen *pg) const
{
    return pg->ToPropertyKey(property_, computed_);
}

void MemberExpression::Compile(compiler::PandaGen *pg) const
{
    compiler::RegScope rs(pg);
    compiler::VReg objReg = pg->AllocReg();
    Compile(pg, objReg);
}

void MemberExpression::Compile(compiler::PandaGen *pg, compiler::VReg objReg) const
{
    CompileObject(pg, objReg);
    compiler::Operand prop = CompileKey(pg);

    if (object_->IsSuperExpression()) {
        pg->LoadSuperProperty(this, objReg, prop);
    } else {
        pg->LoadObjProperty(this, objReg, prop);
    }
}

checker::Type *MemberExpression::Check(checker::Checker *checker) const
{
    checker::Type *baseType = checker->CheckNonNullType(object_->Check(checker), object_->Start());

    if (computed_) {
        checker::Type *indexType = property_->Check(checker);
        checker::Type *indexedAccessType = checker->GetPropertyTypeForIndexType(baseType, indexType);

        if (indexedAccessType) {
            return indexedAccessType;
        }

        if (!indexType->HasTypeFlag(checker::TypeFlag::STRING_LIKE | checker::TypeFlag::NUMBER_LIKE)) {
            checker->ThrowTypeError({"Type ", indexType, " cannot be used as index type"}, property_->Start());
        }

        if (indexType->IsNumberType()) {
            checker->ThrowTypeError("No index signature with a parameter of type 'string' was found on type this type",
                                    Start());
        }

        if (indexType->IsStringType()) {
            checker->ThrowTypeError("No index signature with a parameter of type 'number' was found on type this type",
                                    Start());
        }

        switch (property_->Type()) {
            case ir::AstNodeType::IDENTIFIER: {
                checker->ThrowTypeError(
                    {"Property ", property_->AsIdentifier()->Name(), " does not exist on this type."},
                    property_->Start());
            }
            case ir::AstNodeType::NUMBER_LITERAL: {
                checker->ThrowTypeError(
                    {"Property ", property_->AsNumberLiteral()->Str(), " does not exist on this type."},
                    property_->Start());
            }
            case ir::AstNodeType::STRING_LITERAL: {
                checker->ThrowTypeError(
                    {"Property ", property_->AsStringLiteral()->Str(), " does not exist on this type."},
                    property_->Start());
            }
            default: {
                UNREACHABLE();
            }
        }
    }

    binder::Variable *prop = checker->GetPropertyOfType(baseType, property_->AsIdentifier()->Name());

    if (prop) {
        checker::Type *propType = checker->GetTypeOfVariable(prop);
        if (prop->HasFlag(binder::VariableFlags::READONLY)) {
            propType->AddTypeFlag(checker::TypeFlag::READONLY);
        }

        return propType;
    }

    if (baseType->IsObjectType()) {
        checker::ObjectType *objType = baseType->AsObjectType();

        if (objType->StringIndexInfo()) {
            checker::Type *indexType = objType->StringIndexInfo()->GetType();
            if (objType->StringIndexInfo()->Readonly()) {
                indexType->AddTypeFlag(checker::TypeFlag::READONLY);
            }

            return indexType;
        }
    }

    checker->ThrowTypeError({"Property ", property_->AsIdentifier()->Name(), " does not exist on this type."},
                            property_->Start());
    return nullptr;
}

void MemberExpression::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    object_ = std::get<ir::AstNode *>(cb(object_))->AsExpression();
    property_ = std::get<ir::AstNode *>(cb(property_))->AsExpression();
}

}  // namespace panda::es2panda::ir
