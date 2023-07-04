/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_IR_TS_TSTEMPLATELITERALTYPE_H
#define ES2PANDA_IR_TS_TSTEMPLATELITERALTYPE_H

#include <compiler/core/pandagen.h>
#include <ir/base/templateElement.h>
#include <ir/typeNode.h>
#include <typescript/checker.h>
#include <typescript/types/type.h>

namespace panda::es2panda::ir {

class TSTemplateLiteralType : public TypeNode {
public:
    explicit TSTemplateLiteralType(ArenaVector<TemplateElement *> &&quasis, ArenaVector<Expression *> &&references)
        : TypeNode(AstNodeType::TS_TEMPLATE_LITERAL_TYPE),
          quasis_(std::move(quasis)),
          references_(std::move(references)) {}

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    checker::Type *GetType(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    ArenaVector<TemplateElement *> quasis_;
    ArenaVector<Expression *> references_;
};

}  // namespace panda::es2panda::ir

#endif  // ES2PANDA_IR_TS_TSTEMPLATELITERALTYPE_H
