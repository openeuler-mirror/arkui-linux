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

#ifndef ES2PANDA_IR_TS_METHOD_SIGNATURE_H
#define ES2PANDA_IR_TS_METHOD_SIGNATURE_H

#include <ir/expression.h>

namespace panda::es2panda::binder {
class Scope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class TSTypeParameterDeclaration;

class TSMethodSignature : public Expression {
public:
    explicit TSMethodSignature(binder::Scope *scope, Expression *key, TSTypeParameterDeclaration *typeParams,
                               ArenaVector<Expression *> &&params, Expression *returnTypeAnnotation, bool computed,
                               bool optional)
        : Expression(AstNodeType::TS_METHOD_SIGNATURE),
          scope_(scope),
          key_(key),
          typeParams_(typeParams),
          params_(std::move(params)),
          returnTypeAnnotation_(returnTypeAnnotation),
          computed_(computed),
          optional_(optional)
    {
    }

    binder::Scope *Scope() const
    {
        return scope_;
    }

    const Expression *Key() const
    {
        return key_;
    }

    Expression *Key()
    {
        return key_;
    }

    const TSTypeParameterDeclaration *TypeParams() const
    {
        return typeParams_;
    }

    const ArenaVector<Expression *> &Params() const
    {
        return params_;
    }

    const Expression *ReturnTypeAnnotation() const
    {
        return returnTypeAnnotation_;
    }

    bool Computed() const
    {
        return computed_;
    }

    bool Optional() const
    {
        return optional_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, binder::Binder *binder) override;

private:
    binder::Scope *scope_;
    Expression *key_;
    TSTypeParameterDeclaration *typeParams_;
    ArenaVector<Expression *> params_;
    Expression *returnTypeAnnotation_;
    bool computed_;
    bool optional_;
};

}  // namespace panda::es2panda::ir

#endif
