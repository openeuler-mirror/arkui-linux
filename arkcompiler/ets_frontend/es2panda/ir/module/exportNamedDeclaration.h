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

#ifndef ES2PANDA_IR_MODULE_EXPORT_DECLARATION_H
#define ES2PANDA_IR_MODULE_EXPORT_DECLARATION_H

#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class StringLiteral;
class ExportSpecifier;

class ExportNamedDeclaration : public Statement {
public:
    explicit ExportNamedDeclaration(StringLiteral *source, ArenaVector<ExportSpecifier *> &&specifiers)
        : Statement(AstNodeType::EXPORT_NAMED_DECLARATION),
          source_(source),
          decl_(nullptr),
          specifiers_(std::move(specifiers))
    {
    }

    explicit ExportNamedDeclaration(Statement *decl, ArenaVector<ExportSpecifier *> &&specifiers)
        : Statement(AstNodeType::EXPORT_NAMED_DECLARATION),
          source_(nullptr),
          decl_(decl),
          specifiers_(std::move(specifiers))
    {
    }

    const Statement *Decl() const
    {
        return decl_;
    }

    Statement *Decl()
    {
        return decl_;
    }

    const StringLiteral *Source() const
    {
        return source_;
    }

    const ArenaVector<ExportSpecifier *> &Specifiers() const
    {
        return specifiers_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) override;

private:
    StringLiteral *source_;
    Statement *decl_;
    ArenaVector<ExportSpecifier *> specifiers_;
};

}  // namespace panda::es2panda::ir

#endif
