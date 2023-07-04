/*
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

#include <binder/binder.h>
#include <ir/base/scriptFunction.h>
#include <ir/expression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/memberExpression.h>
#include <ir/statements/expressionStatement.h>
#include <ir/statements/blockStatement.h>

#include <string_view>
#include <vector>

#include "parserImpl.h"

namespace panda::es2panda::parser {
static std::vector<std::string_view> cjsMandatoryParams = {binder::Binder::CJS_MANDATORY_PARAM_EXPORTS,
                                                           binder::Binder::CJS_MANDATORY_PARAM_REQUIRE,
                                                           binder::Binder::CJS_MANDATORY_PARAM_MODULE,
                                                           binder::Binder::CJS_MANDATORY_PARAM_FILENAME,
                                                           binder::Binder::CJS_MANDATORY_PARAM_DIRNAME};

void ParserImpl::AddCommonjsParams(ArenaVector<ir::Expression *> &params)
{
    for (auto paramName : cjsMandatoryParams) {
        ir::Expression *param = AllocNode<ir::Identifier>(paramName, Allocator());
        param->AsIdentifier()->SetReference();
        Binder()->AddParamDecl(param);
        params.push_back(param);
    }
}

void ParserImpl::AddReflectApplyArgs(ArenaVector<ir::Expression *> &args, ir::FunctionExpression *wrapper)
{
    ASSERT(wrapper != nullptr);
    // wrapper
    args.push_back(wrapper);
    // thisValue
    ir::Expression *thisValue = AllocNode<ir::Identifier>(binder::Binder::CJS_MANDATORY_PARAM_EXPORTS, Allocator());
    thisValue->AsIdentifier()->SetReference();
    args.push_back(thisValue);
    // wrapper's arguments
    ArenaVector<ir::Expression *> elements(Allocator()->Adapter());
    for (auto argName : cjsMandatoryParams) {
        ir::Expression *arg = AllocNode<ir::Identifier>(argName, Allocator());
        arg->AsIdentifier()->SetReference();
        elements.push_back(arg);
    }
    ir::ArrayExpression *wrapperArgsArray =
        AllocNode<ir::ArrayExpression>(ir::AstNodeType::ARRAY_EXPRESSION, std::move(elements), false);
    args.push_back(wrapperArgsArray);
}

void ParserImpl::ParseCommonjs()
{
    // create FunctionExpression as callee
    ir::FunctionExpression *wrapper = nullptr;
    {
        FunctionContext functionContext(this, ParserStatus::FUNCTION | ParserStatus::ALLOW_NEW_TARGET);
        FunctionParameterContext funcParamContext(&context_, Binder());
        auto *funcParamScope = funcParamContext.LexicalScope().GetScope();

        ArenaVector<ir::Expression *> params(Allocator()->Adapter());
        AddCommonjsParams(params);

        auto functionCtx = binder::LexicalScope<binder::FunctionScope>(Binder());
        auto *functionScope = functionCtx.GetScope();
        functionScope->BindParamScope(funcParamScope);
        funcParamScope->BindFunctionScope(functionScope);

        ParseProgram(ScriptKind::COMMONJS);

        auto *funcNode =
            AllocNode<ir::ScriptFunction>(functionScope, std::move(params), nullptr, program_.Ast(), nullptr,
                                          functionContext.Flags(), false, Extension() == ScriptExtension::TS);
        functionScope->BindNode(funcNode);
        funcParamScope->BindNode(funcNode);

        wrapper = AllocNode<ir::FunctionExpression>(funcNode);
    }

    // create CallExpression
    ArenaVector<ir::Expression *> arguments(Allocator()->Adapter());
    AddReflectApplyArgs(arguments, wrapper);

    auto *apply = AllocNode<ir::Identifier>("apply", Allocator());
    auto *reflect = AllocNode<ir::Identifier>("Reflect", Allocator());
    auto *reflectApply = AllocNode<ir::MemberExpression>(reflect, apply,
        ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, false);

    auto *callExpr = AllocNode<ir::CallExpression>(reflectApply, std::move(arguments), nullptr, false);
    // create ExpressionStatement
    auto *exprStatementNode = AllocNode<ir::ExpressionStatement>(callExpr);

    ArenaVector<ir::Statement *> statements(Allocator()->Adapter());
    statements.push_back(exprStatementNode);

    auto *blockStmt = AllocNode<ir::BlockStatement>(Binder()->GetScope(), std::move(statements));
    Binder()->GetScope()->BindNode(blockStmt);

    program_.SetAst(blockStmt);
}
}  // namespace panda::es2panda::parser