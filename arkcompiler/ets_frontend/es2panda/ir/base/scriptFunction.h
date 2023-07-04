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

#ifndef ES2PANDA_PARSER_INCLUDE_AST_SCRIPT_FUNCTION_H
#define ES2PANDA_PARSER_INCLUDE_AST_SCRIPT_FUNCTION_H

#include <ir/astNode.h>
#include <ir/expressions/identifier.h>
#include <util/enumbitops.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::binder {
class FunctionScope;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {

class TSTypeParameterDeclaration;

class ScriptFunction : public AstNode {
public:
    explicit ScriptFunction(binder::FunctionScope *scope, ArenaVector<Expression *> &&params,
                            TSTypeParameterDeclaration *typeParams, AstNode *body, Expression *returnTypeAnnotation,
                            ir::ScriptFunctionFlags flags, bool declare, bool isTsFunction)
        : AstNode(AstNodeType::SCRIPT_FUNCTION),
          scope_(scope),
          id_(nullptr),
          params_(std::move(params)),
          typeParams_(typeParams),
          body_(body),
          returnTypeAnnotation_(returnTypeAnnotation),
          flags_(flags),
          declare_(declare),
          exportDefault_(false)
    {
        thisParam_ = nullptr;
        if (isTsFunction && !params_.empty()) {
            auto *firstParam = params_.front();
            if (firstParam->IsIdentifier() && firstParam->AsIdentifier()->Name().Is(THIS_PARAM)) {
                thisParam_ = firstParam;
                params_.erase(params_.begin());
                scope_->ParamScope()->RemoveThisParam();
            }
        }
    }

    const Identifier *Id() const
    {
        return id_;
    }

    Identifier *Id()
    {
        return id_;
    }

    const ArenaVector<Expression *> &Params() const
    {
        return params_;
    }

    ArenaVector<Expression *> &Params()
    {
        return params_;
    }

    const TSTypeParameterDeclaration *TypeParams() const
    {
        return typeParams_;
    }

    const AstNode *Body() const
    {
        return body_;
    }

    AstNode *Body()
    {
        return body_;
    }

    const Expression *ReturnTypeAnnotation() const
    {
        return returnTypeAnnotation_;
    }

    Expression *ReturnTypeAnnotation()
    {
        return returnTypeAnnotation_;
    }

    bool IsGenerator() const
    {
        return (flags_ & ir::ScriptFunctionFlags::GENERATOR) != 0;
    }

    bool IsAsync() const
    {
        return (flags_ & ir::ScriptFunctionFlags::ASYNC) != 0;
    }

    bool IsArrow() const
    {
        return (flags_ & ir::ScriptFunctionFlags::ARROW) != 0;
    }

    bool IsOverload() const
    {
        return (flags_ & ir::ScriptFunctionFlags::OVERLOAD) != 0;
    }

    bool IsConstructor() const
    {
        return (flags_ & ir::ScriptFunctionFlags::CONSTRUCTOR) != 0;
    }

    bool IsMethod() const
    {
        return (flags_ & ir::ScriptFunctionFlags::METHOD) != 0;
    }

    bool Declare() const
    {
        return declare_;
    }

    void SetIdent(Identifier *id)
    {
        id_ = id;
    }

    void SetAsExportDefault()
    {
        exportDefault_ = true;
    }

    void AddFlag(ir::ScriptFunctionFlags flags)
    {
        flags_ |= flags;
    }

    size_t FormalParamsLength() const;
    util::StringView GetName() const;

    binder::FunctionScope *Scope() const
    {
        return scope_;
    }

    bool IsConcurrent() const
    {
        return (flags_ & ir::ScriptFunctionFlags::CONCURRENT) != 0;
    }

    bool CanBeConcurrent() const
    {
        return !(IsGenerator() || IsArrow() || IsConstructor() || IsMethod());
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;
    void UpdateSelf(const NodeUpdater &cb, binder::Binder *binder) override;

private:
    static constexpr std::string_view THIS_PARAM = "this";

    binder::FunctionScope *scope_;
    Identifier *id_;
    Expression *thisParam_;
    ArenaVector<Expression *> params_;
    TSTypeParameterDeclaration *typeParams_;
    AstNode *body_;
    Expression *returnTypeAnnotation_;
    ir::ScriptFunctionFlags flags_;
    bool declare_;
    bool exportDefault_;
};

}  // namespace panda::es2panda::ir

#endif
