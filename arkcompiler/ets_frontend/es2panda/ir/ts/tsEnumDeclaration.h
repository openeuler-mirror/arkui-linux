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

#ifndef ES2PANDA_IR_TS_ENUM_DECLARATION_H
#define ES2PANDA_IR_TS_ENUM_DECLARATION_H

#include <ir/statement.h>
#include <binder/enumMemberResult.h>

namespace panda::es2panda::binder {
class LocalScope;
class EnumVariable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class Identifier;
class TSEnumMember;

class TSEnumDeclaration : public Statement {
public:
    explicit TSEnumDeclaration(binder::LocalScope *scope, Identifier *key, ArenaVector<TSEnumMember *> &&members,
                               bool isConst)
        : Statement(AstNodeType::TS_ENUM_DECLARATION),
          scope_(scope),
          key_(key),
          members_(std::move(members)),
          isConst_(isConst)
    {
    }

    binder::LocalScope *Scope() const
    {
        return scope_;
    }

    const Identifier *Key() const
    {
        return key_;
    }

    const ArenaVector<TSEnumMember *> &Members() const
    {
        return members_;
    }

    bool IsConst() const
    {
        return isConst_;
    }

    static binder::EnumMemberResult EvaluateEnumMember(checker::Checker *checker, binder::EnumVariable *enumVar,
                                                       const ir::AstNode *expr);
    checker::Type *InferType(checker::Checker *checker, bool isConst) const;

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    binder::LocalScope *scope_;
    Identifier *key_;
    ArenaVector<TSEnumMember *> members_;
    bool isConst_;
};

}  // namespace panda::es2panda::ir

#endif
