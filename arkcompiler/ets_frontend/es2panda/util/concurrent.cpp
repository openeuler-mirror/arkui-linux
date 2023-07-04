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

#include "concurrent.h"

#include <binder/scope.h>
#include <compiler/core/compilerContext.h>
#include <compiler/core/pandagen.h>
#include <ir/astNode.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/statements/blockStatement.h>
#include <ir/statements/expressionStatement.h>
#include <lexer/token/sourceLocation.h>

namespace panda::es2panda::util {

void Concurrent::SetConcurrent(ir::ScriptFunction *func, const lexer::LineIndex &lineIndex)
{
    auto *body = func->Body();
    if (!body) {
        return;
    }

    if (body->IsExpression()) {
        return;
    }

    auto &statements = body->AsBlockStatement()->Statements();
    if (statements.empty()) {
        return;
    }

    /**
     * verify the firstStmt
     * if IsExpressionStatement(firstStmt) == false
     *      return;
     * else
     *      if (firstStmt->IsStringLiteral() && strVal == "use concurrent")
     *          [fall through]
     *      else
     *          return
     */
    const auto *stmt = statements.front();
    if (!stmt->IsExpressionStatement()) {
        return;
    }

    auto *expr = stmt->AsExpressionStatement()->GetExpression();
    if (!expr->IsStringLiteral()) {
        return;
    }

    if (!expr->AsStringLiteral()->Str().Is(USE_CONCURRENT)) {
        return;
    }

    // concurrent function should only be function declaration
    if (!func->CanBeConcurrent()) {
        ThrowInvalidConcurrentFunction(lineIndex, stmt, ConcurrentInvalidFlag::NOT_ORDINARY_FUNCTION);
    }

    func->AddFlag(ir::ScriptFunctionFlags::CONCURRENT);
}

void Concurrent::ThrowInvalidConcurrentFunction(const lexer::LineIndex &lineIndex, const ir::AstNode *expr,
                                     ConcurrentInvalidFlag errFlag)
{
    auto line = expr->Range().start.line;
    auto column = (const_cast<lexer::LineIndex &>(lineIndex)).GetLocation(expr->Range().start).col - 1;
    switch (errFlag) {
        case ConcurrentInvalidFlag::NOT_ORDINARY_FUNCTION: {
            throw Error {ErrorType::GENERIC, "Concurrent function should only be function declaration", line,
                         column};
            break;
        }
        case ConcurrentInvalidFlag::NOT_IMPORT_VARIABLE: {
            throw Error {ErrorType::GENERIC, "Concurrent function should only use import variable or local variable",
                         line, column};
            break;
        }
        default:
            break;
    }
}

void Concurrent::VerifyImportVarForConcurrentFunction(const lexer::LineIndex &lineIndex, const ir::AstNode *node,
                                                      const binder::ScopeFindResult &result)
{
    if (!result.crossConcurrent) {
        return;
    }

    if (result.variable->IsModuleVariable() && result.variable->Declaration()->IsImportDecl()) {
        return;
    }

    ThrowInvalidConcurrentFunction(lineIndex, node, ConcurrentInvalidFlag::NOT_IMPORT_VARIABLE);
}

} // namespace panda::es2panda::util