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

#ifndef ES2PANDA_IR_TS_LITERAL_TYPE_H
#define ES2PANDA_IR_TS_LITERAL_TYPE_H

#include <ir/typeNode.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class TSLiteralType : public TypeNode {
public:
    explicit TSLiteralType(Expression *literal) : TypeNode(AstNodeType::TS_LITERAL_TYPE), literal_(literal) {}

    const Expression *Literal() const
    {
        return literal_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    checker::Type *GetType(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    Expression *literal_;
};
}  // namespace panda::es2panda::ir

#endif
