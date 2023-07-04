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

#ifndef ES2PANDA_IR_TS_PRIVATE_IDENTIFIER_H
#define ES2PANDA_IR_TS_PRIVATE_IDENTIFIER_H

#include <ir/expression.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class TSPrivateIdentifier : public Expression {
public:
    explicit TSPrivateIdentifier(Expression *key, Expression *value, Expression *typeAnnotation)
        : Expression(AstNodeType::TS_PRIVATE_IDENTIFIER), key_(key), value_(value), typeAnnotation_(typeAnnotation)
    {
    }

    const Expression *Key() const
    {
        return key_;
    }

    const Expression *Value() const
    {
        return value_;
    }

    const Expression *TypeAnnotation() const
    {
        return typeAnnotation_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Expression *key_;
    Expression *value_;
    Expression *typeAnnotation_;
};

}  // namespace panda::es2panda::ir

#endif
