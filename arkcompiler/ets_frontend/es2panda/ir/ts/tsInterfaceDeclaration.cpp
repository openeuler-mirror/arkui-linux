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

#include "tsInterfaceDeclaration.h"

#include <binder/declaration.h>
#include <binder/scope.h>
#include <binder/variable.h>
#include <typescript/checker.h>
#include <ir/astDump.h>
#include <ir/expressions/identifier.h>
#include <ir/ts/tsInterfaceBody.h>
#include <ir/ts/tsInterfaceHeritage.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>

namespace panda::es2panda::ir {

void TSInterfaceDeclaration::Iterate(const NodeTraverser &cb) const
{
    cb(id_);

    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : extends_) {
        cb(it);
    }

    cb(body_);
}

void TSInterfaceDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSInterfaceDeclaration"},
                 {"body", body_},
                 {"id", id_},
                 {"extends", extends_},
                 {"typeParameters", AstDumper::Optional(typeParams_)}});
}

void TSInterfaceDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

void CheckInheritedPropertiesAreIdentical(checker::Checker *checker, checker::InterfaceType *type,
                                          const lexer::SourcePosition &locInfo)
{
    checker->GetBaseTypes(type);

    size_t constexpr BASE_SIZE_LIMIT = 2;
    if (type->Bases().size() < BASE_SIZE_LIMIT) {
        return;
    }

    checker->ResolveDeclaredMembers(type);

    checker::InterfacePropertyMap properties;

    for (auto *it : type->Properties()) {
        properties.insert({it->Name(), {it, type}});
    }

    for (auto *base : type->Bases()) {
        checker->ResolveStructuredTypeMembers(base);
        ArenaVector<binder::LocalVariable *> inheritedProperties(checker->Allocator()->Adapter());
        base->AsInterfaceType()->CollectProperties(&inheritedProperties);

        for (auto *inheritedProp : inheritedProperties) {
            auto res = properties.find(inheritedProp->Name());
            if (res == properties.end()) {
                properties.insert({inheritedProp->Name(), {inheritedProp, base->AsInterfaceType()}});
            } else if (res->second.second != type) {
                checker::Type *sourceType = checker->GetTypeOfVariable(inheritedProp);
                checker::Type *targetType = checker->GetTypeOfVariable(res->second.first);
                checker->IsTypeIdenticalTo(sourceType, targetType,
                                           {"Interface '", type, "' cannot simultaneously extend types '",
                                            res->second.second, "' and '", base->AsInterfaceType(), "'."},
                                           locInfo);
            }
        }
    }
}

checker::Type *TSInterfaceDeclaration::Check(checker::Checker *checker) const
{
    binder::Variable *var = id_->Variable();
    ASSERT(var->Declaration()->Node() && var->Declaration()->Node()->IsTSInterfaceDeclaration());

    if (this == var->Declaration()->Node()) {
        checker::Type *resolvedType = var->TsType();

        if (!resolvedType) {
            checker::ObjectDescriptor *desc =
                checker->Allocator()->New<checker::ObjectDescriptor>(checker->Allocator());
            resolvedType = checker->Allocator()->New<checker::InterfaceType>(checker->Allocator(), id_->Name(), desc);
            resolvedType->SetVariable(var);
            var->SetTsType(resolvedType);
        }

        checker::InterfaceType *resolvedInterface = resolvedType->AsObjectType()->AsInterfaceType();
        CheckInheritedPropertiesAreIdentical(checker, resolvedInterface, id_->Start());

        for (auto *base : resolvedInterface->Bases()) {
            checker->IsTypeAssignableTo(resolvedInterface, base,
                                        {"Interface '", id_->Name(), "' incorrectly extends interface '", base, "'"},
                                        id_->Start());
        }

        checker->CheckIndexConstraints(resolvedInterface);
    }

    body_->Check(checker);

    return nullptr;
}

void TSInterfaceDeclaration::UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder)
{
    id_ = std::get<ir::AstNode *>(cb(id_))->AsIdentifier();

    if (typeParams_) {
        typeParams_ = std::get<ir::AstNode *>(cb(typeParams_))->AsTSTypeParameterDeclaration();
    }

    for (auto iter = extends_.begin(); iter != extends_.end(); iter++) {
        *iter = std::get<ir::AstNode *>(cb(*iter))->AsTSInterfaceHeritage();
    }

    body_ = std::get<ir::AstNode *>(cb(body_))->AsTSInterfaceBody();
}

}  // namespace panda::es2panda::ir
