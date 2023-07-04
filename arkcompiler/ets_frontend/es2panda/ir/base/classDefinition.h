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

#ifndef ES2PANDA_PARSER_INCLUDE_AST_CLASS_DEFINITION_H
#define ES2PANDA_PARSER_INCLUDE_AST_CLASS_DEFINITION_H

#include <binder/variable.h>
#include <ir/astNode.h>
#include <util/bitset.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::binder {
class LocalScope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {

class Statement;
class Identifier;
class MethodDefinition;
class TSTypeParameterDeclaration;
class TSTypeParameterInstantiation;
class TSClassImplements;
class TSIndexSignature;

class ClassDefinition : public AstNode {
public:
    explicit ClassDefinition(binder::LocalScope *scope, Identifier *ident, TSTypeParameterDeclaration *typeParams,
                             TSTypeParameterInstantiation *superTypeParams,
                             ArenaVector<TSClassImplements *> &&implements, MethodDefinition *ctor,
                             Expression *superClass, ArenaVector<Statement *> &&body,
                             ArenaVector<TSIndexSignature *> &&indexSignatures, bool declare, bool abstract)
        : AstNode(AstNodeType::CLASS_DEFINITION),
          scope_(scope),
          ident_(ident),
          typeParams_(typeParams),
          superTypeParams_(superTypeParams),
          implements_(std::move(implements)),
          ctor_(ctor),
          superClass_(superClass),
          body_(std::move(body)),
          indexSignatures_(std::move(indexSignatures)),
          declare_(declare),
          abstract_(abstract),
          exportDefault_(false)
    {
    }

    binder::LocalScope *Scope() const
    {
        return scope_;
    }

    const Identifier *Ident() const
    {
        return ident_;
    }

    Expression *Super()
    {
        return superClass_;
    }

    const Expression *Super() const
    {
        return superClass_;
    }

    bool Declare() const
    {
        return declare_;
    }

    bool Abstract() const
    {
        return abstract_;
    }

    void SetAsExportDefault()
    {
        exportDefault_ = true;
    }

    ArenaVector<Statement *> &Body()
    {
        return body_;
    }

    const ArenaVector<Statement *> &Body() const
    {
        return body_;
    }

    ArenaVector<TSClassImplements *> &Implements()
    {
        return implements_;
    }

    const ArenaVector<TSClassImplements *> &Implements() const
    {
        return implements_;
    }

    MethodDefinition *Ctor()
    {
        ASSERT(ctor_ != nullptr);
        return ctor_;
    }

    const FunctionExpression *Ctor() const;

    util::StringView GetName() const;

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile(compiler::PandaGen *pg) const override;
    checker::Type *Check(checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, binder::Binder *binder) override;

private:
    compiler::VReg CompileHeritageClause(compiler::PandaGen *pg) const;
    void InitializeClassName(compiler::PandaGen *pg) const;
    int32_t CreateClassStaticProperties(compiler::PandaGen *pg, util::BitSet &compiled) const;
    void CompileMissingProperties(compiler::PandaGen *pg, const util::BitSet &compiled, compiler::VReg classReg) const;

    binder::LocalScope *scope_;
    Identifier *ident_;
    TSTypeParameterDeclaration *typeParams_;
    TSTypeParameterInstantiation *superTypeParams_;
    ArenaVector<TSClassImplements *> implements_;
    MethodDefinition *ctor_;
    Expression *superClass_;
    ArenaVector<Statement *> body_;
    ArenaVector<TSIndexSignature *> indexSignatures_;
    bool declare_;
    bool abstract_;
    bool exportDefault_;
};

}  // namespace panda::es2panda::ir

#endif
