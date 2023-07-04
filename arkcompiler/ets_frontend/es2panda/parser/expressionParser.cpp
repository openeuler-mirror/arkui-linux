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

#include <ir/astNode.h>
#include <ir/base/classDefinition.h>
#include <ir/base/decorator.h>
#include <ir/base/metaProperty.h>
#include <ir/base/methodDefinition.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/base/templateElement.h>
#include <ir/expression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/arrowFunctionExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/awaitExpression.h>
#include <ir/expressions/binaryExpression.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/chainExpression.h>
#include <ir/expressions/classExpression.h>
#include <ir/expressions/conditionalExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/importExpression.h>
#include <ir/expressions/literals/bigIntLiteral.h>
#include <ir/expressions/literals/booleanLiteral.h>
#include <ir/expressions/literals/nullLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/regExpLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/newExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/omittedExpression.h>
#include <ir/expressions/sequenceExpression.h>
#include <ir/expressions/superExpression.h>
#include <ir/expressions/taggedTemplateExpression.h>
#include <ir/expressions/templateLiteral.h>
#include <ir/expressions/thisExpression.h>
#include <ir/expressions/unaryExpression.h>
#include <ir/expressions/updateExpression.h>
#include <ir/expressions/yieldExpression.h>
#include <ir/statements/blockStatement.h>
#include <ir/ts/tsAsExpression.h>
#include <ir/ts/tsNonNullExpression.h>
#include <ir/ts/tsPrivateIdentifier.h>
#include <ir/ts/tsTypeAssertion.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>
#include <ir/ts/tsTypeParameterInstantiation.h>
#include <ir/ts/tsTypeReference.h>
#include <ir/validationInfo.h>
#include <lexer/lexer.h>
#include <lexer/regexp/regexp.h>
#include <lexer/token/letters.h>
#include <lexer/token/sourceLocation.h>
#include <lexer/token/token.h>
#include <macros.h>

#include <memory>

#include "parserImpl.h"

namespace panda::es2panda::parser {

ir::YieldExpression *ParserImpl::ParseYieldExpression()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::KEYW_YIELD);

    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    lexer::SourcePosition endLoc = lexer_->GetToken().End();

    if (lexer_->GetToken().Flags() & lexer::TokenFlags::HAS_ESCAPE) {
        ThrowSyntaxError("Unexpected identifier");
    }

    lexer_->NextToken();

    bool isDelegate = false;
    ir::Expression *argument = nullptr;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MULTIPLY && !lexer_->GetToken().NewLine()) {
        isDelegate = true;
        lexer_->NextToken();

        argument = ParseExpression();
        endLoc = argument->End();
    } else if (!lexer_->GetToken().NewLine() && lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SEMI_COLON &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON &&
               lexer_->GetToken().Type() != lexer::TokenType::EOS) {
        argument = ParseExpression();
        endLoc = argument->End();
    }

    auto *yieldNode = AllocNode<ir::YieldExpression>(argument, isDelegate);
    yieldNode->SetRange({startLoc, endLoc});

    return yieldNode;
}

ir::Expression *ParserImpl::ParsePotentialExpressionSequence(ir::Expression *expr, ExpressionParseFlags flags)
{
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA &&
        (flags & ExpressionParseFlags::ACCEPT_COMMA)) {
        return ParseSequenceExpression(expr, (flags & ExpressionParseFlags::ACCEPT_REST));
    }

    return expr;
}

ir::TSAsExpression *ParserImpl::ParseTsAsExpression(ir::Expression *expr, [[maybe_unused]] ExpressionParseFlags flags)
{
    lexer_->NextToken();  // eat 'as'
    TypeAnnotationParsingOptions options =
        TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::ALLOW_CONST;
    ir::Expression *typeAnnotation = ParseTsTypeAnnotation(&options);

    bool isConst = false;
    if (typeAnnotation->IsTSTypeReference() && typeAnnotation->AsTSTypeReference()->TypeName()->IsIdentifier()) {
        const util::StringView &refName = typeAnnotation->AsTSTypeReference()->TypeName()->AsIdentifier()->Name();
        if (refName.Is("const")) {
            isConst = true;
        }
    }

    lexer::SourcePosition startLoc = expr->Start();
    auto *asExpr = AllocNode<ir::TSAsExpression>(expr, typeAnnotation, isConst);
    asExpr->SetRange({startLoc, lexer_->GetToken().End()});

    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT &&
        lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_AS &&
        !(flags & ExpressionParseFlags::EXP_DISALLOW_AS)) {
        return ParseTsAsExpression(asExpr, flags);
    }

    return asExpr;
}

ir::Expression *ParserImpl::ParseExpression(ExpressionParseFlags flags)
{
    if (lexer_->GetToken().Type() == lexer::TokenType::KEYW_YIELD && !(flags & ExpressionParseFlags::DISALLOW_YIELD)) {
        ir::YieldExpression *yieldExpr = ParseYieldExpression();

        return ParsePotentialExpressionSequence(yieldExpr, flags);
    }

    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        const auto startPos = lexer_->Save();

        // TODO(rsipka): ParseTsGenericArrowFunction and ParseTsTypeAssertion might be in a common function
        ir::Expression *expr = ParseTsGenericArrowFunction();
        if (expr != nullptr) {
            return expr;
        }
        lexer_->Rewind(startPos);
    }

    ir::Expression *unaryExpressionNode = ParseUnaryOrPrefixUpdateExpression(flags);
    ir::Expression *assignmentExpression = ParseAssignmentExpression(unaryExpressionNode, flags);

    if (lexer_->GetToken().NewLine()) {
        return assignmentExpression;
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA &&
        (flags & ExpressionParseFlags::ACCEPT_COMMA)) {
        return ParseSequenceExpression(assignmentExpression, (flags & ExpressionParseFlags::ACCEPT_REST),
                                       flags & ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN);
    }

    return assignmentExpression;
}

ir::Expression *ParserImpl::ParseArrayExpression(ExpressionParseFlags flags)
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    ArenaVector<ir::Expression *> elements(Allocator()->Adapter());

    lexer_->NextToken();

    bool trailingComma = false;
    bool inPattern = (flags & ExpressionParseFlags::MUST_BE_PATTERN);

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            auto *omitted = AllocNode<ir::OmittedExpression>();
            omitted->SetRange(lexer_->GetToken().Loc());
            elements.push_back(omitted);
            lexer_->NextToken();
            continue;
        }

        ir::Expression *element {};
        if (inPattern) {
            element = ParsePatternElement();
        } else if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
            element = ParseSpreadElement(ExpressionParseFlags::POTENTIALLY_IN_PATTERN);
        } else {
            element = ParseExpression(ExpressionParseFlags::POTENTIALLY_IN_PATTERN);
        }

        bool containsRest = element->IsRestElement();

        elements.push_back(element);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            if (containsRest) {
                ThrowSyntaxError("Rest element must be last element", startLoc);
            }

            lexer_->NextToken();  // eat comma

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
                trailingComma = true;
                break;
            }

            continue;
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
            ThrowSyntaxError("Unexpected token, expected ',' or ']'");
        }
    }

    auto nodeType = inPattern ? ir::AstNodeType::ARRAY_PATTERN : ir::AstNodeType::ARRAY_EXPRESSION;
    auto *arrayExpressionNode = AllocNode<ir::ArrayExpression>(nodeType, std::move(elements), trailingComma);
    arrayExpressionNode->SetRange({startLoc, lexer_->GetToken().End()});
    lexer_->NextToken();

    if (inPattern) {
        arrayExpressionNode->SetDeclaration();
    }

    if (Extension() == ScriptExtension::TS && (flags & ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN) &&
        lexer::Token::IsTsParamToken(lexer_->GetToken().Type())) {
        context_.Status() |= ParserStatus::FUNCTION_PARAM;
        ParsePotentialTsFunctionParameter(ExpressionParseFlags::NO_OPTS, arrayExpressionNode);
    }

    if (!(flags & ExpressionParseFlags::POTENTIALLY_IN_PATTERN)) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SUBSTITUTION &&
            !arrayExpressionNode->ConvertibleToArrayPattern()) {
            ThrowSyntaxError("Invalid left-hand side in array destructuring pattern", arrayExpressionNode->Start());
        } else if (!inPattern && lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
            ir::ValidationInfo info = arrayExpressionNode->ValidateExpression();
            if (info.Fail()) {
                ThrowSyntaxError(info.msg.Utf8(), info.pos);
            }
        }
    }

    return arrayExpressionNode;
}

ParserStatus ParserImpl::ValidateArrowParameter(ir::Expression *expr)
{
    switch (expr->Type()) {
        case ir::AstNodeType::SPREAD_ELEMENT: {
            if (!expr->AsSpreadElement()->ConvertibleToRest(true)) {
                ThrowSyntaxError("Invalid rest element.");
            }

            [[fallthrough]];
        }
        case ir::AstNodeType::REST_ELEMENT: {
            ValidateArrowParameterBindings(expr->AsRestElement()->Argument());
            return ParserStatus::HAS_COMPLEX_PARAM;
        }
        case ir::AstNodeType::IDENTIFIER: {
            const util::StringView &identifier = expr->AsIdentifier()->Name();

            if (identifier.Is("arguments")) {
                ThrowSyntaxError("Binding 'arguments' in strict mode is invalid");
            } else if (identifier.Is("eval")) {
                ThrowSyntaxError("Binding 'eval' in strict mode is invalid");
            }

            ValidateArrowParameterBindings(expr);
            return ParserStatus::NO_OPTS;
        }
        case ir::AstNodeType::OBJECT_EXPRESSION: {
            ir::ObjectExpression *objectPattern = expr->AsObjectExpression();

            if (!objectPattern->ConvertibleToObjectPattern()) {
                ThrowSyntaxError("Invalid destructuring assignment target");
            }

            ValidateArrowParameterBindings(expr);
            return ParserStatus::HAS_COMPLEX_PARAM;
        }
        case ir::AstNodeType::ARRAY_EXPRESSION: {
            ir::ArrayExpression *arrayPattern = expr->AsArrayExpression();

            if (!arrayPattern->ConvertibleToArrayPattern()) {
                ThrowSyntaxError("Invalid destructuring assignment target");
            }

            ValidateArrowParameterBindings(expr);
            return ParserStatus::HAS_COMPLEX_PARAM;
        }
        case ir::AstNodeType::ASSIGNMENT_EXPRESSION: {
            auto *assignmentExpr = expr->AsAssignmentExpression();
            if (assignmentExpr->Right()->IsYieldExpression()) {
                ThrowSyntaxError("yield is not allowed in arrow function parameters");
            }

            if (assignmentExpr->Right()->IsAwaitExpression()) {
                ThrowSyntaxError("await is not allowed in arrow function parameters");
            }

            if (!assignmentExpr->ConvertibleToAssignmentPattern()) {
                ThrowSyntaxError("Invalid destructuring assignment target");
            }

            ValidateArrowParameterBindings(expr);
            return ParserStatus::HAS_COMPLEX_PARAM;
        }
        default: {
            break;
        }
    }
    ThrowSyntaxError("Insufficient formal parameter in arrow function.");
    return ParserStatus::NO_OPTS;
}

ir::ArrowFunctionExpression *ParserImpl::ParseArrowFunctionExpressionBody(ArrowFunctionContext *arrowFunctionContext,
                                                                          binder::FunctionScope *functionScope,
                                                                          ArrowFunctionDescriptor *desc,
                                                                          ir::TSTypeParameterDeclaration *typeParamDecl,
                                                                          ir::Expression *returnTypeAnnotation)
{
    context_.Status() |= desc->newStatus;

    functionScope->BindParamScope(desc->paramScope);
    desc->paramScope->BindFunctionScope(functionScope);

    lexer_->NextToken();  // eat '=>'
    ir::ScriptFunction *funcNode {};

    ir::AstNode *body = nullptr;
    lexer::SourcePosition endLoc;
    lexer::SourcePosition bodyStart = lexer_->GetToken().Start();

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
        body = ParseExpression();
        endLoc = body->AsExpression()->End();
        arrowFunctionContext->AddFlag(ir::ScriptFunctionFlags::EXPRESSION);
    } else {
        lexer_->NextToken();
        auto statements = ParseStatementList();
        body = AllocNode<ir::BlockStatement>(functionScope, std::move(statements));
        body->SetRange({bodyStart, lexer_->GetToken().End()});

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
            ThrowSyntaxError("Expected a '}'");
        }

        lexer_->NextToken();
        endLoc = body->End();
    }

    funcNode = AllocNode<ir::ScriptFunction>(functionScope, std::move(desc->params), typeParamDecl, body,
                                             returnTypeAnnotation, arrowFunctionContext->Flags(), false,
                                             Extension() == ScriptExtension::TS);
    funcNode->SetRange({desc->startLoc, endLoc});
    functionScope->BindNode(funcNode);
    desc->paramScope->BindNode(funcNode);

    auto *arrowFuncNode = AllocNode<ir::ArrowFunctionExpression>(funcNode);
    arrowFuncNode->SetRange(funcNode->Range());

    return arrowFuncNode;
}

ArrowFunctionDescriptor ParserImpl::ConvertToArrowParameter(ir::Expression *expr, bool isAsync,
                                                            binder::FunctionParamScope *paramScope)
{
    auto arrowStatus = isAsync ? ParserStatus::ASYNC_FUNCTION : ParserStatus::NO_OPTS;
    ArenaVector<ir::Expression *> params(Allocator()->Adapter());

    if (!expr) {
        return ArrowFunctionDescriptor {std::move(params), paramScope, lexer_->GetToken().Start(), arrowStatus};
    }

    switch (expr->Type()) {
        case ir::AstNodeType::REST_ELEMENT:
        case ir::AstNodeType::IDENTIFIER:
        case ir::AstNodeType::OBJECT_EXPRESSION:
        case ir::AstNodeType::ASSIGNMENT_EXPRESSION:
        case ir::AstNodeType::ARRAY_EXPRESSION: {
            arrowStatus |= ValidateArrowParameter(expr);

            params.push_back(expr);
            break;
        }
        case ir::AstNodeType::SEQUENCE_EXPRESSION: {
            auto &sequence = expr->AsSequenceExpression()->Sequence();

            for (auto *it : sequence) {
                arrowStatus |= ValidateArrowParameter(it);
            }

            params.swap(sequence);
            break;
        }
        case ir::AstNodeType::CALL_EXPRESSION: {
            if (isAsync) {
                auto &arguments = expr->AsCallExpression()->Arguments();

                for (auto *it : arguments) {
                    arrowStatus |= ValidateArrowParameter(it);
                }

                params.swap(arguments);
                break;
            }

            [[fallthrough]];
        }
        default: {
            ThrowSyntaxError("Unexpected token, arrow (=>)");
        }
    }

    for (const auto *param : params) {
        Binder()->AddParamDecl(param);
    }

    return ArrowFunctionDescriptor {std::move(params), paramScope, expr->Start(), arrowStatus};
}

ir::ArrowFunctionExpression *ParserImpl::ParseArrowFunctionExpression(ir::Expression *expr,
                                                                      ir::TSTypeParameterDeclaration *typeParamDecl,
                                                                      ir::Expression *returnTypeAnnotation,
                                                                      bool isAsync)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_ARROW);

    if (lexer_->GetToken().NewLine()) {
        ThrowSyntaxError(
            "expected '=>' on the same line after an argument list, "
            "got line terminator");
    }

    ArrowFunctionContext arrowFunctionContext(this, isAsync);
    FunctionParameterContext functionParamContext(&context_, Binder());
    ArrowFunctionDescriptor desc =
        ConvertToArrowParameter(expr, isAsync, functionParamContext.LexicalScope().GetScope());

    auto functionCtx = binder::LexicalScope<binder::FunctionScope>(Binder());
    return ParseArrowFunctionExpressionBody(&arrowFunctionContext, functionCtx.GetScope(), &desc, typeParamDecl,
                                            returnTypeAnnotation);
}

ir::ArrowFunctionExpression *ParserImpl::ParseTsGenericArrowFunction()
{
    ArrowFunctionContext arrowFunctionContext(this, false);

    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN);
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    ir::TSTypeParameterDeclaration *typeParamDecl = ParseTsTypeParameterDeclaration(false);

    if (typeParamDecl == nullptr || lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        return nullptr;
    }

    FunctionParameterContext funcParamContext(&context_, Binder());
    ArenaVector<ir::Expression *> params = ParseFunctionParams(true);

    ParserStatus arrowStatus = ParserStatus::NO_OPTS;

    if (std::any_of(params.begin(), params.end(), [](const auto *param) { return !param->IsIdentifier(); })) {
        arrowStatus = ParserStatus::HAS_COMPLEX_PARAM;
    }

    ir::Expression *returnTypeAnnotation = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
        returnTypeAnnotation = ParseTsTypeAnnotation(&options);
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
        return nullptr;
    }

    ArrowFunctionDescriptor desc(std::move(params), funcParamContext.LexicalScope().GetScope(), startLoc, arrowStatus);

    auto functionCtx = binder::LexicalScope<binder::FunctionScope>(Binder());
    return ParseArrowFunctionExpressionBody(&arrowFunctionContext, functionCtx.GetScope(), &desc, typeParamDecl,
                                            returnTypeAnnotation);
}

ir::TSTypeAssertion *ParserImpl::ParseTsTypeAssertion(ExpressionParseFlags flags)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN);
    lexer::SourcePosition start = lexer_->GetToken().Start();
    lexer_->NextToken();  // eat '<'

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
    ir::Expression *typeAnnotation = ParseTsTypeAnnotation(&options);

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_GREATER_THAN) {
        return nullptr;
    }

    lexer_->NextToken();  // eat '>'
    ir::Expression *expression = ParseUnaryOrPrefixUpdateExpression(flags);
    auto *typeAssertion = AllocNode<ir::TSTypeAssertion>(typeAnnotation, expression);
    typeAssertion->SetRange({start, lexer_->GetToken().End()});

    return typeAssertion;
}

ir::Expression *ParserImpl::ParseCoverParenthesizedExpressionAndArrowParameterList()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS);
    lexer::SourcePosition start = lexer_->GetToken().Start();
    lexer_->NextToken();
    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
        ir::SpreadElement *restElement = ParseSpreadElement(ExpressionParseFlags::MUST_BE_PATTERN);

        restElement->SetGrouped();
        restElement->SetStart(start);

        if (Extension() == ScriptExtension::TS && lexer::Token::IsTsParamToken(lexer_->GetToken().Type())) {
            ParsePotentialTsFunctionParameter(ExpressionParseFlags::IN_REST, restElement);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
            ThrowSyntaxError("Rest parameter must be last formal parameter");
        }

        lexer_->NextToken();

        ir::Expression *returnTypeAnnotation = nullptr;
        if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
            lexer_->NextToken();  // eat ':'
            returnTypeAnnotation = ParseTsTypeAnnotation(&options);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
            ThrowSyntaxError("Unexpected token");
        }

        return ParseArrowFunctionExpression(restElement, nullptr, returnTypeAnnotation, false);
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        lexer_->NextToken();

        ir::Expression *returnTypeAnnotation = nullptr;
        if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
            lexer_->NextToken();  // eat ':'
            returnTypeAnnotation = ParseTsTypeAnnotation(&options);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
            ThrowSyntaxError("Unexpected token");
        }

        auto *arrowExpr = ParseArrowFunctionExpression(nullptr, nullptr, returnTypeAnnotation, false);
        arrowExpr->SetStart(start);
        arrowExpr->AsArrowFunctionExpression()->Function()->SetStart(start);

        return arrowExpr;
    }

    ir::Expression *expr =
        ParseExpression(ExpressionParseFlags::ACCEPT_COMMA | ExpressionParseFlags::ACCEPT_REST |
                        ExpressionParseFlags::POTENTIALLY_IN_PATTERN | ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN);

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ThrowSyntaxError("Unexpected token, expected ')'");
    }

    expr->SetGrouped();
    expr->SetRange({start, lexer_->GetToken().End()});
    lexer_->NextToken();

    if (Extension() == ScriptExtension::TS && ((context_.Status() & ParserStatus::FUNCTION_PARAM) ||
                                               lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON)) {
        context_.Status() &= ~ParserStatus::FUNCTION_PARAM;

        ir::Expression *returnTypeAnnotation = nullptr;
        const auto startPos = lexer_->Save();

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
            lexer_->NextToken();  // eat ':'
            options = ~TypeAnnotationParsingOptions::THROW_ERROR;
            returnTypeAnnotation = ParseTsTypeAnnotation(&options);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
            lexer_->Rewind(startPos);
            return expr;
        }

        return ParseArrowFunctionExpression(expr, nullptr, returnTypeAnnotation, false);
    }

    return expr;
}

void ParserImpl::CheckInvalidDestructuring(const ir::AstNode *object) const
{
    object->Iterate([this](ir::AstNode *childNode) -> void {
        switch (childNode->Type()) {
            case ir::AstNodeType::ASSIGNMENT_PATTERN: {
                ThrowSyntaxError("Invalid property initializer");
                break;
            }
            case ir::AstNodeType::REST_ELEMENT:
            case ir::AstNodeType::PROPERTY:
            case ir::AstNodeType::OBJECT_EXPRESSION: {
                CheckInvalidDestructuring(childNode);
                break;
            }
            default: {
                break;
            }
        }
    });
}

void ParserImpl::ValidateParenthesizedExpression(ir::Expression *lhsExpression)
{
    switch (lhsExpression->Type()) {
        case ir::AstNodeType::IDENTIFIER:
        case ir::AstNodeType::MEMBER_EXPRESSION: {
            break;
        }
        case ir::AstNodeType::ARRAY_EXPRESSION: {
            auto info = lhsExpression->AsArrayExpression()->ValidateExpression();
            if (info.Fail()) {
                ThrowSyntaxError(info.msg.Utf8(), info.pos);
            }
            break;
        }
        case ir::AstNodeType::OBJECT_EXPRESSION: {
            auto info = lhsExpression->AsObjectExpression()->ValidateExpression();
            if (info.Fail()) {
                ThrowSyntaxError(info.msg.Utf8(), info.pos);
            }
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_EXPRESSION: {
            if (lhsExpression->AsAssignmentExpression()->ConvertibleToAssignmentPattern(false)) {
                break;
            }
            [[fallthrough]];
        }
        case ir::AstNodeType::SPREAD_ELEMENT: {
            ThrowSyntaxError("Invalid left-hand side in assignment expression");
        }
        default: {
            break;
        }
    }
}

ir::Expression *ParserImpl::ParseAssignmentExpression(ir::Expression *lhsExpression, ExpressionParseFlags flags)
{
    lexer::TokenType tokenType = lexer_->GetToken().Type();
    if (lhsExpression->IsGrouped() && tokenType != lexer::TokenType::PUNCTUATOR_ARROW) {
        if (lhsExpression->IsSequenceExpression()) {
            for (auto *seq : lhsExpression->AsSequenceExpression()->Sequence()) {
                ValidateParenthesizedExpression(seq);
            }
        } else {
            ValidateParenthesizedExpression(lhsExpression);
        }
    }

    switch (tokenType) {
        case lexer::TokenType::PUNCTUATOR_QUESTION_MARK: {
            lexer_->NextToken();
            ir::Expression *consequent = ParseExpression();

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
                ThrowSyntaxError("Unexpected token, expected ':'");
            }

            lexer_->NextToken();
            ir::Expression *alternate = ParseExpression();

            auto *conditionalExpr = AllocNode<ir::ConditionalExpression>(lhsExpression, consequent, alternate);
            conditionalExpr->SetRange({lhsExpression->Start(), alternate->End()});
            return conditionalExpr;
        }
        case lexer::TokenType::PUNCTUATOR_ARROW: {
            if (lexer_->GetToken().NewLine()) {
                ThrowSyntaxError("Uncaught SyntaxError: expected expression, got '=>'");
            }

            return ParseArrowFunctionExpression(lhsExpression, nullptr, nullptr, false);
        }
        case lexer::TokenType::KEYW_IN: {
            if (flags & ExpressionParseFlags::STOP_AT_IN) {
                break;
            }

            [[fallthrough]];
        }
        case lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING:
        case lexer::TokenType::PUNCTUATOR_LOGICAL_OR:
        case lexer::TokenType::PUNCTUATOR_LOGICAL_AND:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND:
        case lexer::TokenType::PUNCTUATOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LESS_THAN:
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_PLUS:
        case lexer::TokenType::PUNCTUATOR_MINUS:
        case lexer::TokenType::PUNCTUATOR_MULTIPLY:
        case lexer::TokenType::PUNCTUATOR_DIVIDE:
        case lexer::TokenType::PUNCTUATOR_MOD:
        case lexer::TokenType::KEYW_INSTANCEOF:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION: {
            ir::Expression *binaryExpression = ParseBinaryExpression(lhsExpression);

            return ParseAssignmentExpression(binaryExpression);
        }
        case lexer::TokenType::PUNCTUATOR_SUBSTITUTION: {
            ValidateAssignmentTarget(flags, lhsExpression);

            lexer_->NextToken();
            ir::Expression *assignmentExpression = ParseExpression(CarryPatternFlags(flags));

            auto *binaryAssignmentExpression =
                AllocNode<ir::AssignmentExpression>(lhsExpression, assignmentExpression, tokenType);

            binaryAssignmentExpression->SetRange({lhsExpression->Start(), assignmentExpression->End()});
            return binaryAssignmentExpression;
        }
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_PLUS_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MINUS_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MULTIPLY_EQUAL:
        case lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MOD_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LOGICAL_AND_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LOGICAL_OR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LOGICAL_NULLISH_EQUAL:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL: {
            ValidateLvalueAssignmentTarget(lhsExpression);

            lexer_->NextToken();
            ir::Expression *assignmentExpression = ParseExpression(CarryPatternFlags(flags));

            auto *binaryAssignmentExpression =
                AllocNode<ir::AssignmentExpression>(lhsExpression, assignmentExpression, tokenType);

            binaryAssignmentExpression->SetRange({lhsExpression->Start(), assignmentExpression->End()});
            return binaryAssignmentExpression;
        }
        case lexer::TokenType::LITERAL_IDENT: {
            if (Extension() == ScriptExtension::TS && lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_AS &&
                !(flags & ExpressionParseFlags::EXP_DISALLOW_AS) && !lexer_->GetToken().NewLine()) {
                ir::Expression *asExpression = ParseTsAsExpression(lhsExpression, flags);
                return ParseAssignmentExpression(asExpression);
            }
            break;
        }
        default:
            break;
    }

    return lhsExpression;
}

ir::TemplateLiteral *ParserImpl::ParseTemplateLiteral()
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    ArenaVector<ir::TemplateElement *> quasis(Allocator()->Adapter());
    ArenaVector<ir::Expression *> expressions(Allocator()->Adapter());

    while (true) {
        lexer_->ResetTokenEnd();
        const auto startPos = lexer_->Save();

        lexer_->ScanString<LEX_CHAR_BACK_TICK>();
        util::StringView cooked = lexer_->GetToken().String();

        lexer_->Rewind(startPos);
        auto [raw, end, scanExpression] = lexer_->ScanTemplateString();

        auto *element = AllocNode<ir::TemplateElement>(raw.View(), cooked);
        element->SetRange({lexer::SourcePosition {startPos.iterator.Index(), startPos.line},
                           lexer::SourcePosition {end, lexer_->Line()}});
        quasis.push_back(element);

        if (!scanExpression) {
            lexer_->ScanTemplateStringEnd();
            break;
        }

        ir::Expression *expression = nullptr;

        {
            lexer::TemplateLiteralParserContext ctx(lexer_);
            lexer_->PushTemplateContext(&ctx);
            lexer_->NextToken();
            expression = ParseExpression();
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
            ThrowSyntaxError("Unexpected token, expected '}'.");
        }

        expressions.push_back(expression);
    }

    auto *templateNode = AllocNode<ir::TemplateLiteral>(std::move(quasis), std::move(expressions));
    templateNode->SetRange({startLoc, lexer_->GetToken().End()});

    lexer_->NextToken();

    return templateNode;
}

ir::NewExpression *ParserImpl::ParseNewExpression()
{
    lexer::SourcePosition start = lexer_->GetToken().Start();

    lexer_->NextToken();  // eat new

    // parse callee part of NewExpression
    ir::Expression *callee = ParseMemberExpression(true);
    if (callee->IsImportExpression() && !callee->IsGrouped()) {
        ThrowSyntaxError("Cannot use new with import(...)");
    }

    // parse type params of NewExpression
    lexer::SourcePosition endLoc = callee->End();
    ir::TSTypeParameterInstantiation *typeParamInst = nullptr;
    if (Extension() == ScriptExtension::TS) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
            lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
        }
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
            typeParamInst = ParseTsTypeParameterInstantiation();
            if (typeParamInst != nullptr) {
                endLoc = typeParamInst->End();
            }
        }
    }

    ArenaVector<ir::Expression *> arguments(Allocator()->Adapter());

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        auto *newExprNode = AllocNode<ir::NewExpression>(callee, typeParamInst, std::move(arguments));
        newExprNode->SetRange({start, endLoc});

        return newExprNode;
    }

    lexer_->NextToken();  // eat left pranthesis

    // parse argument part of NewExpression
    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ir::Expression *argument = nullptr;

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
            argument = ParseSpreadElement();
        } else {
            argument = ParseExpression();
        }

        arguments.push_back(argument);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            lexer_->NextToken();  // eat comma
        }

        if (lexer_->GetToken().Type() == lexer::TokenType::EOS) {
            ThrowSyntaxError("Unexpected token in argument parsing");
        }
    }

    auto *newExprNode = AllocNode<ir::NewExpression>(callee, typeParamInst, std::move(arguments));
    newExprNode->SetRange({start, lexer_->GetToken().End()});

    lexer_->NextToken();

    return newExprNode;
}

ir::Expression *ParserImpl::ParseLeftHandSideExpression(ExpressionParseFlags flags)
{
    return ParseMemberExpression(false, flags);
}

ir::MetaProperty *ParserImpl::ParsePotentialNewTarget()
{
    lexer::SourceRange loc = lexer_->GetToken().Loc();

    if (lexer_->Lookahead() == LEX_CHAR_DOT) {
        lexer_->NextToken();
        lexer_->NextToken();

        if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT && lexer_->GetToken().Ident().Is("target")) {
            if (!(context_.Status() & ParserStatus::ALLOW_NEW_TARGET)) {
                ThrowSyntaxError("'new.Target' is not allowed here");
            }

            if (lexer_->GetToken().Flags() & lexer::TokenFlags::HAS_ESCAPE) {
                ThrowSyntaxError("'new.Target' must not contain escaped characters");
            }

            auto *metaProperty = AllocNode<ir::MetaProperty>(ir::MetaProperty::MetaPropertyKind::NEW_TARGET);
            metaProperty->SetRange(loc);
            lexer_->NextToken();
            return metaProperty;
        }
    }

    return nullptr;
}

ir::Expression *ParserImpl::ParsePrimaryExpression(ExpressionParseFlags flags)
{
    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::KEYW_IMPORT: {
            return ParseImportExpression();
        }
        case lexer::TokenType::LITERAL_IDENT: {
            auto *identNode = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            identNode->SetReference();
            identNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();

            if (Extension() == ScriptExtension::TS && (flags & ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN) &&
                lexer::Token::IsTsParamToken(lexer_->GetToken().Type())) {
                context_.Status() |= ParserStatus::FUNCTION_PARAM;
                ParsePotentialTsFunctionParameter(ExpressionParseFlags::NO_OPTS, identNode);
            }

            return identNode;
        }
        case lexer::TokenType::LITERAL_TRUE: {
            auto *trueNode = AllocNode<ir::BooleanLiteral>(true);
            trueNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return trueNode;
        }
        case lexer::TokenType::LITERAL_FALSE: {
            auto *falseNode = AllocNode<ir::BooleanLiteral>(false);
            falseNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return falseNode;
        }
        case lexer::TokenType::LITERAL_NULL: {
            auto *nullNode = AllocNode<ir::NullLiteral>();
            nullNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return nullNode;
        }
        case lexer::TokenType::LITERAL_NUMBER: {
            ir::Expression *numberNode = nullptr;

            if (lexer_->GetToken().Flags() & lexer::TokenFlags::NUMBER_BIGINT) {
                numberNode = AllocNode<ir::BigIntLiteral>(lexer_->GetToken().BigInt());
            } else {
                numberNode = AllocNode<ir::NumberLiteral>(lexer_->GetToken().Number(), lexer_->GetToken().String());
            }

            numberNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return numberNode;
        }
        case lexer::TokenType::LITERAL_STRING: {
            auto *stringNode = AllocNode<ir::StringLiteral>(lexer_->GetToken().String());
            stringNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return stringNode;
        }
        case lexer::TokenType::PUNCTUATOR_DIVIDE:
        case lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL: {
            lexer_->ResetTokenEnd();
            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL) {
                lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_DIVIDE, 1);
            }
            auto regexp = lexer_->ScanRegExp();

            lexer::RegExpParser reParser(regexp, Allocator());

            try {
                reParser.ParsePattern();
            } catch (lexer::RegExpError &e) {
                ThrowSyntaxError(e.message.c_str());
            }

            auto *regexpNode = AllocNode<ir::RegExpLiteral>(regexp.patternStr, regexp.flagsStr);
            regexpNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();
            return regexpNode;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
            return ParseArrayExpression(CarryPatternFlags(flags));
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS: {
            return ParseCoverParenthesizedExpressionAndArrowParameterList();
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_BRACE: {
            return ParseObjectExpression(CarryPatternFlags(flags));
        }
        case lexer::TokenType::KEYW_FUNCTION: {
            return ParseFunctionExpression();
        }
        case lexer::TokenType::KEYW_CLASS: {
            lexer::SourcePosition startLoc = lexer_->GetToken().Start();
            ir::ClassDefinition *classDefinition = ParseClassDefinition(false);

            auto *classExpr = AllocNode<ir::ClassExpression>(classDefinition);
            classExpr->SetRange({startLoc, classDefinition->End()});

            return classExpr;
        }
        case lexer::TokenType::KEYW_THIS: {
            auto *thisExprNode = AllocNode<ir::ThisExpression>();
            thisExprNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();  // eat this
            return thisExprNode;
        }
        case lexer::TokenType::KEYW_SUPER: {
            auto *superExprNode = AllocNode<ir::SuperExpression>();
            superExprNode->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();  // eat super

            if ((lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD ||
                 lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET) &&
                (context_.Status() & ParserStatus::ALLOW_SUPER)) {
                return superExprNode;
            }

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
                (context_.Status() & ParserStatus::ALLOW_SUPER_CALL)) {
                return superExprNode;
            }

            ThrowSyntaxError("Unexpected super keyword");
        }
        case lexer::TokenType::KEYW_NEW: {
            ir::MetaProperty *newTarget = ParsePotentialNewTarget();

            if (newTarget) {
                return newTarget;
            }

            return ParseNewExpression();
        }
        case lexer::TokenType::PUNCTUATOR_BACK_TICK: {
            return ParseTemplateLiteral();
        }
        default: {
            break;
        }
    }

    ThrowSyntaxError("Primary expression expected");
    return nullptr;
}

static size_t GetOperatorPrecedence(lexer::TokenType operatorType)
{
    ASSERT(lexer::Token::IsBinaryToken(operatorType));

    switch (operatorType) {
        case lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING: {
            constexpr auto precedence = 1;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_LOGICAL_OR: {
            constexpr auto precedence = 2;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_LOGICAL_AND:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR: {
            constexpr auto precedence = 3;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR: {
            constexpr auto precedence = 4;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND: {
            constexpr auto precedence = 5;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_STRICT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL: {
            constexpr auto precedence = 6;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN:
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL:
        case lexer::TokenType::KEYW_INSTANCEOF:
        case lexer::TokenType::KEYW_IN: {
            constexpr auto precedence = 7;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT: {
            constexpr auto precedence = 8;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_PLUS:
        case lexer::TokenType::PUNCTUATOR_MINUS: {
            constexpr auto precedence = 9;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_MULTIPLY:
        case lexer::TokenType::PUNCTUATOR_DIVIDE:
        case lexer::TokenType::PUNCTUATOR_MOD: {
            const auto precedence = 10;
            return precedence;
        }
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION: {
            constexpr auto precedence = 11;
            return precedence;
        }
        default: {
           UNREACHABLE();
        }
    }
}

static inline bool ShouldBinaryExpressionBeAmended(ir::BinaryExpression *binaryExpression,
                                                   lexer::TokenType operatorType)
{
    return GetOperatorPrecedence(binaryExpression->OperatorType()) <= GetOperatorPrecedence(operatorType) &&
           !binaryExpression->IsGrouped() &&
           (operatorType != lexer::TokenType::PUNCTUATOR_EXPONENTIATION ||
            binaryExpression->OperatorType() != lexer::TokenType::PUNCTUATOR_EXPONENTIATION);
}

ir::Expression *ParserImpl::ParseBinaryExpression(ir::Expression *left)
{
    lexer::TokenType operatorType = lexer_->GetToken().Type();
    ASSERT(lexer::Token::IsBinaryToken(operatorType));

    if (operatorType == lexer::TokenType::PUNCTUATOR_EXPONENTIATION) {
        if (left->IsUnaryExpression() && !left->IsGrouped()) {
            ThrowSyntaxError(
                "Illegal expression. Wrap left hand side or entire "
                "exponentiation in parentheses.");
        }
    }

    lexer_->NextToken();

    ir::Expression *rightExprNode = ParseExpression(ExpressionParseFlags::DISALLOW_YIELD);

    ir::Expression *rightExpr = rightExprNode;
    ir::ConditionalExpression *conditionalExpr = nullptr;

    if (rightExpr->IsConditionalExpression() && !rightExpr->IsGrouped()) {
        conditionalExpr = rightExpr->AsConditionalExpression();
        rightExpr = conditionalExpr->Test();
    }

    if (rightExpr->IsBinaryExpression() &&
        ShouldBinaryExpressionBeAmended(rightExpr->AsBinaryExpression(), operatorType)) {
        if ((operatorType == lexer::TokenType::PUNCTUATOR_LOGICAL_OR ||
             operatorType == lexer::TokenType::PUNCTUATOR_LOGICAL_AND) &&
            rightExpr->AsBinaryExpression()->OperatorType() == lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING) {
            ThrowSyntaxError("Nullish coalescing operator ?? requires parens when mixing with logical operators.");
        }

        bool shouldBeAmended = true;

        ir::BinaryExpression *binaryExpression = rightExpr->AsBinaryExpression();
        ir::BinaryExpression *parentExpression = nullptr;

        while (binaryExpression->Left()->IsBinaryExpression() && shouldBeAmended) {
            parentExpression = binaryExpression;
            parentExpression->SetStart(left->Start());
            binaryExpression = binaryExpression->Left()->AsBinaryExpression();
            shouldBeAmended = ShouldBinaryExpressionBeAmended(binaryExpression, operatorType);
        }

        if (shouldBeAmended) {
            auto *leftExprNode = AllocNode<ir::BinaryExpression>(left, binaryExpression->Left(), operatorType);
            leftExprNode->SetRange({left->Start(), binaryExpression->Left()->End()});

            binaryExpression->SetLeft(leftExprNode);
        } else {
            // Transfer the parent's left ownership to right_node
            ir::Expression *rightNode = parentExpression->Left();

            auto *binaryOrLogicalExpressionNode = AllocNode<ir::BinaryExpression>(left, rightNode, operatorType);
            binaryOrLogicalExpressionNode->SetRange({left->Start(), rightNode->End()});

            parentExpression->SetLeft(binaryOrLogicalExpressionNode);
        }
    } else {
        if (operatorType == lexer::TokenType::PUNCTUATOR_NULLISH_COALESCING && rightExpr->IsBinaryExpression() &&
            rightExpr->AsBinaryExpression()->IsLogical() && !rightExpr->IsGrouped()) {
            ThrowSyntaxError("Nullish coalescing operator ?? requires parens when mixing with logical operators.");
        }
        const lexer::SourcePosition &endPos = rightExpr->End();
        rightExpr = AllocNode<ir::BinaryExpression>(left, rightExpr, operatorType);
        rightExpr->SetRange({left->Start(), endPos});
    }

    if (conditionalExpr != nullptr) {
        conditionalExpr->SetStart(rightExpr->Start());
        conditionalExpr->SetTest(rightExpr);
        return conditionalExpr;
    }

    return rightExpr;
}

ir::CallExpression *ParserImpl::ParseCallExpression(ir::Expression *callee, bool isOptionalChain, bool isAsync)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS);

    while (true) {
        lexer_->NextToken();
        ArenaVector<ir::Expression *> arguments(Allocator()->Adapter());

        while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
            ir::Expression *argument = nullptr;
            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
                argument = ParseSpreadElement();
            } else {
                argument = ParseExpression(isAsync ? ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN
                                                   : ExpressionParseFlags::NO_OPTS);
            }

            arguments.push_back(argument);

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
                lexer_->NextToken();
            } else if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
                ThrowSyntaxError("Expected a ')'");
            }
        }

        auto *callExpr = AllocNode<ir::CallExpression>(callee, std::move(arguments), nullptr, isOptionalChain);
        callExpr->SetRange({callee->Start(), lexer_->GetToken().End()});
        isOptionalChain = false;

        lexer_->NextToken();

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
            return callExpr;
        }

        callee = callExpr;
    }

    UNREACHABLE();
    return nullptr;
}

ir::Expression *ParserImpl::ParseOptionalChain(ir::Expression *leftSideExpr)
{
    lexer::TokenType tokenType = lexer_->GetToken().Type();
    ir::Expression *returnExpression = nullptr;

    if (tokenType == lexer::TokenType::LITERAL_IDENT) {
        auto *identNode = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
        identNode->SetReference();
        identNode->SetRange(lexer_->GetToken().Loc());

        returnExpression = AllocNode<ir::MemberExpression>(
            leftSideExpr, identNode, ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false, true);
        returnExpression->SetRange({leftSideExpr->Start(), identNode->End()});
        lexer_->NextToken();
    }

    if (tokenType == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET) {
        lexer_->NextToken();  // eat '['
        ir::Expression *propertyNode = ParseExpression(ExpressionParseFlags::ACCEPT_COMMA);

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
            ThrowSyntaxError("Unexpected token");
        }

        returnExpression = AllocNode<ir::MemberExpression>(
            leftSideExpr, propertyNode, ir::MemberExpression::MemberExpressionKind::ELEMENT_ACCESS, true, true);
        returnExpression->SetRange({leftSideExpr->Start(), lexer_->GetToken().End()});
        lexer_->NextToken();
    }

    if (tokenType == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        returnExpression = ParseCallExpression(leftSideExpr, true);
    }

    // Static semantic
    if (tokenType == lexer::TokenType::PUNCTUATOR_BACK_TICK ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_BACK_TICK) {
        ThrowSyntaxError("Tagged Template Literals are not allowed in optionalChain");
    }

    return returnExpression;
}

ir::ArrowFunctionExpression *ParserImpl::ParsePotentialArrowExpression(ir::Expression **returnExpression,
                                                                       const lexer::SourcePosition &startLoc)
{
    ir::TSTypeParameterDeclaration *typeParamDecl = nullptr;

    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::KEYW_FUNCTION: {
            *returnExpression = ParseFunctionExpression(ParserStatus::ASYNC_FUNCTION);
            (*returnExpression)->SetStart(startLoc);
            break;
        }
        case lexer::TokenType::LITERAL_IDENT: {
            ir::Expression *identRef = ParsePrimaryExpression();
            ASSERT(identRef->IsIdentifier());

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
                ThrowSyntaxError("Unexpected token, expected '=>'");
            }

            ir::ArrowFunctionExpression *arrowFuncExpr = ParseArrowFunctionExpression(identRef, nullptr, nullptr, true);
            arrowFuncExpr->SetStart(startLoc);

            return arrowFuncExpr;
        }
        case lexer::TokenType::PUNCTUATOR_ARROW: {
            ir::ArrowFunctionExpression *arrowFuncExpr =
                ParseArrowFunctionExpression(*returnExpression, nullptr, nullptr, true);
            arrowFuncExpr->SetStart(startLoc);
            return arrowFuncExpr;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT: {
            if (Extension() == ScriptExtension::TS) {
                return nullptr;
            }

            break;
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN: {
            if (Extension() != ScriptExtension::TS) {
                return nullptr;
            }

            const auto savedPos = lexer_->Save();

            typeParamDecl = ParseTsTypeParameterDeclaration(false);
            if (!typeParamDecl) {
                lexer_->Rewind(savedPos);
                return nullptr;
            }

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
                ThrowSyntaxError("'(' expected");
            }

            [[fallthrough]];
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS: {
            ir::CallExpression *callExpression = ParseCallExpression(*returnExpression, false, true);

            ir::Expression *returnTypeAnnotation = nullptr;
            if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
                lexer_->NextToken();  // eat ':'
                TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
                returnTypeAnnotation = ParseTsTypeAnnotation(&options);
            }

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_ARROW) {
                ir::ArrowFunctionExpression *arrowFuncExpr =
                    ParseArrowFunctionExpression(callExpression, typeParamDecl, returnTypeAnnotation, true);
                arrowFuncExpr->SetStart(startLoc);

                return arrowFuncExpr;
            }

            if (Extension() == ScriptExtension::TS && (returnTypeAnnotation || typeParamDecl)) {
                ThrowSyntaxError("'=>' expected");
            }

            *returnExpression = callExpression;
            break;
        }
        default: {
            break;
        }
    }

    return nullptr;
}

bool ParserImpl::ParsePotentialTsGenericFunctionCall(ir::Expression **returnExpression,
                                                     const lexer::SourcePosition &startLoc, bool ignoreCallExpression)
{
    if (Extension() != ScriptExtension::TS || lexer_->Lookahead() == LEX_CHAR_LESS_THAN) {
        return true;
    }

    const auto savedPos = lexer_->Save();

    bool isLeftShift = false;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
        lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
        isLeftShift = true;
    }

    ir::TSTypeParameterInstantiation *typeParams;
    try {
        typeParams = ParseTsTypeParameterInstantiation(false);
    } catch (const Error &e) {
        if (!isLeftShift) {
            throw e;
        }
        typeParams = nullptr;
    }

    if (!typeParams) {
        lexer_->Rewind(savedPos);
        return true;
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::EOS) {
        ThrowSyntaxError("'(' or '`' expected");
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        if (!ignoreCallExpression) {
            *returnExpression = ParseCallExpression(*returnExpression, false);
            (*returnExpression)->AsCallExpression()->SetTypeParams(typeParams);
            return false;
        }
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_BACK_TICK) {
        ir::TemplateLiteral *propertyNode = ParseTemplateLiteral();
        lexer::SourcePosition endLoc = propertyNode->End();

        *returnExpression = AllocNode<ir::TaggedTemplateExpression>(*returnExpression, propertyNode, typeParams);
        (*returnExpression)->SetRange({startLoc, endLoc});
        return false;
    }

    lexer_->Rewind(savedPos);
    return true;
}

ir::Expression *ParserImpl::ParsePostPrimaryExpression(ir::Expression *primaryExpr, lexer::SourcePosition startLoc,
                                                       bool ignoreCallExpression, bool *isChainExpression)
{
    ir::Expression *returnExpression = primaryExpr;

    while (true) {
        switch (lexer_->GetToken().Type()) {
            case lexer::TokenType::PUNCTUATOR_QUESTION_DOT: {
                *isChainExpression = true;
                lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat ?.
                returnExpression = ParseOptionalChain(returnExpression);
                continue;
            }
            case lexer::TokenType::PUNCTUATOR_PERIOD: {
                lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat period
                bool isPrivate = false;

                lexer::SourcePosition memberStart = lexer_->GetToken().Start();

                if (Extension() == ScriptExtension::TS &&
                    lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_HASH_MARK) {
                    if (!(context_.Status() & ParserStatus::IN_CLASS_BODY)) {
                        ThrowSyntaxError("Private identifiers are not allowed outside class bodies.");
                    }
                    isPrivate = true;
                    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
                }

                if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
                    ThrowSyntaxError("Expected an identifier");
                }

                auto *identNode = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
                identNode->SetRange(lexer_->GetToken().Loc());

                ir::Expression *property = nullptr;
                if (isPrivate) {
                    property = AllocNode<ir::TSPrivateIdentifier>(identNode, nullptr, nullptr);
                    property->SetRange({memberStart, identNode->End()});
                } else {
                    property = identNode;
                }

                const lexer::SourcePosition &startPos = returnExpression->Start();
                returnExpression = AllocNode<ir::MemberExpression>(
                    returnExpression, property, ir::MemberExpression::MemberExpressionKind::PROPERTY_ACCESS, false,
                    false);
                returnExpression->SetRange({startPos, property->End()});
                lexer_->NextToken();
                continue;
            }
            case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
                if (context_.Status() & ParserStatus::IN_DECORATOR) {
                    break;
                }

                lexer_->NextToken();  // eat '['
                ir::Expression *propertyNode = ParseExpression(ExpressionParseFlags::ACCEPT_COMMA);

                if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
                    ThrowSyntaxError("Unexpected token");
                }

                const lexer::SourcePosition &startPos = returnExpression->Start();
                returnExpression = AllocNode<ir::MemberExpression>(
                    returnExpression, propertyNode, ir::MemberExpression::MemberExpressionKind::ELEMENT_ACCESS, true,
                    false);
                returnExpression->SetRange({startPos, lexer_->GetToken().End()});
                lexer_->NextToken();
                continue;
            }
            case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT:
            case lexer::TokenType::PUNCTUATOR_LESS_THAN: {
                bool shouldBreak =
                    ParsePotentialTsGenericFunctionCall(&returnExpression, startLoc, ignoreCallExpression);
                if (shouldBreak) {
                    break;
                }

                continue;
            }
            case lexer::TokenType::PUNCTUATOR_BACK_TICK: {
                ir::TemplateLiteral *propertyNode = ParseTemplateLiteral();
                lexer::SourcePosition endLoc = propertyNode->End();

                returnExpression = AllocNode<ir::TaggedTemplateExpression>(returnExpression, propertyNode, nullptr);
                returnExpression->SetRange({startLoc, endLoc});
                continue;
            }
            case lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS: {
                if (!ignoreCallExpression) {
                    returnExpression = ParseCallExpression(returnExpression, false);
                    continue;
                }
                break;
            }
            case lexer::TokenType::PUNCTUATOR_EXCLAMATION_MARK: {
                if (Extension() != ScriptExtension::TS || !returnExpression || lexer_->GetToken().NewLine()) {
                    break;
                }

                returnExpression = AllocNode<ir::TSNonNullExpression>(returnExpression);
                returnExpression->SetRange({startLoc, lexer_->GetToken().End()});
                lexer_->NextToken();
                continue;
            }
            default: {
                break;
            }
        }

        break;
    }

    return returnExpression;
}

void ParserImpl::ValidateUpdateExpression(ir::Expression *returnExpression, bool isChainExpression)
{
    if ((!returnExpression->IsMemberExpression() && !returnExpression->IsIdentifier() &&
         !returnExpression->IsTSNonNullExpression()) ||
        isChainExpression) {
        ThrowSyntaxError("Invalid left-hand side operator.");
    }

    if (returnExpression->IsIdentifier()) {
        const util::StringView &returnExpressionStr = returnExpression->AsIdentifier()->Name();

        if (returnExpressionStr.Is("eval")) {
            ThrowSyntaxError("Assigning to 'eval' in strict mode is invalid");
        }

        if (returnExpressionStr.Is("arguments")) {
            ThrowSyntaxError("Assigning to 'arguments' in strict mode is invalid");
        }
    }
}

ir::Expression *ParserImpl::ParseMemberExpression(bool ignoreCallExpression, ExpressionParseFlags flags)
{
    bool isAsync = lexer_->GetToken().IsAsyncModifier();
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    ir::Expression *returnExpression = ParsePrimaryExpression(flags);

    if (lexer_->GetToken().NewLine() && returnExpression->IsArrowFunctionExpression()) {
        return returnExpression;
    }

    if (isAsync && !lexer_->GetToken().NewLine()) {
        ir::ArrowFunctionExpression *arrow = ParsePotentialArrowExpression(&returnExpression, startLoc);

        if (arrow) {
            return arrow;
        }
    }

    bool isChainExpression = false;
    returnExpression = ParsePostPrimaryExpression(returnExpression, startLoc, ignoreCallExpression, &isChainExpression);

    if (!lexer_->GetToken().NewLine() && lexer::Token::IsUpdateToken(lexer_->GetToken().Type())) {
        lexer::SourcePosition start = returnExpression->Start();

        ValidateUpdateExpression(returnExpression, isChainExpression);

        returnExpression = AllocNode<ir::UpdateExpression>(returnExpression, lexer_->GetToken().Type(), false);

        returnExpression->SetRange({start, lexer_->GetToken().End()});
        lexer_->NextToken();
    }

    if (isChainExpression) {
        lexer::SourcePosition endLoc = returnExpression->End();
        returnExpression = AllocNode<ir::ChainExpression>(returnExpression);
        returnExpression->SetRange({startLoc, endLoc});
    }

    return returnExpression;
}

void ParserImpl::ParsePotentialTsFunctionParameter(ExpressionParseFlags flags, ir::Expression *returnNode,
                                                   bool isDeclare)
{
    if (Extension() != ScriptExtension::TS || !(context_.Status() & ParserStatus::FUNCTION_PARAM)) {
        return;
    }

    bool isOptional = false;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
        if (flags & ExpressionParseFlags::IN_REST) {
            ThrowSyntaxError("A rest parameter cannot be optional");
        }

        if (!isDeclare && (returnNode->IsArrayPattern() || returnNode->IsObjectPattern())) {
            ThrowSyntaxError(
                "A binding pattern parameter cannot be optional in an "
                "implementation signature");
        }

        ASSERT(returnNode->IsIdentifier() || returnNode->IsObjectPattern() || returnNode->IsArrayPattern());
        if (returnNode->IsIdentifier()) {
            returnNode->AsIdentifier()->SetOptional(true);
        } else if (returnNode->IsObjectPattern()) {
            returnNode->AsObjectPattern()->SetOptional(true);
        } else if (returnNode->IsArrayPattern()) {
            returnNode->AsArrayPattern()->SetOptional(true);
        }

        isOptional = true;
        lexer_->NextToken();  // eat '?'
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
        returnNode->SetTsTypeAnnotation(ParseTsTypeAnnotation(&options));
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        return;
    }

    if (flags & ExpressionParseFlags::IN_REST) {
        ThrowSyntaxError("A rest parameter cannot have an initializer");
    }

    if (returnNode->IsIdentifier() && isOptional) {
        ThrowSyntaxError("Parameter cannot have question mark and initializer");
    }
}

ir::Expression *ParserImpl::ParsePatternElement(ExpressionParseFlags flags, bool allowDefault, bool isDeclare)
{
    ir::Expression *returnNode = nullptr;
    ArenaVector<ir::Decorator *> decorators(Allocator()->Adapter());

    if (context_.Status() & ParserStatus::IN_METHOD_DEFINITION) {
        decorators = ParseDecorators();
    }

    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
            returnNode = ParseArrayExpression(ExpressionParseFlags::MUST_BE_PATTERN);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD: {
            if (flags & ExpressionParseFlags::IN_REST) {
                ThrowSyntaxError("Unexpected token");
            }

            returnNode = ParseSpreadElement(ExpressionParseFlags::MUST_BE_PATTERN);
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_BRACE: {
            returnNode =
                ParseObjectExpression(ExpressionParseFlags::MUST_BE_PATTERN | ExpressionParseFlags::OBJECT_PATTERN);
            break;
        }
        case lexer::TokenType::LITERAL_IDENT: {
            returnNode = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), std::move(decorators));
            returnNode->AsIdentifier()->SetReference();

            if (returnNode->AsIdentifier()->Decorators().empty()) {
                returnNode->SetRange(lexer_->GetToken().Loc());
            } else {
                returnNode->SetRange(
                    {returnNode->AsIdentifier()->Decorators().front()->Start(), lexer_->GetToken().End()});
            }
            lexer_->NextToken();
            break;
        }
        default: {
            ThrowSyntaxError("Unexpected token, expected an identifier.");
        }
    }

    ParsePotentialTsFunctionParameter(flags, returnNode, isDeclare);

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        return returnNode;
    }

    if (flags & ExpressionParseFlags::IN_REST) {
        ThrowSyntaxError("Unexpected token, expected ')'");
    }

    if (!allowDefault) {
        ThrowSyntaxError("Invalid destructuring assignment target");
    }

    lexer_->NextToken();

    if ((context_.Status() & ParserStatus::GENERATOR_FUNCTION) &&
        lexer_->GetToken().Type() == lexer::TokenType::KEYW_YIELD) {
        ThrowSyntaxError("Yield is not allowed in generator parameters");
    }

    ir::Expression *rightNode = ParseExpression();

    auto *assignmentExpression = AllocNode<ir::AssignmentExpression>(
        ir::AstNodeType::ASSIGNMENT_PATTERN, returnNode, rightNode, lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
    assignmentExpression->SetRange({returnNode->Start(), rightNode->End()});

    return assignmentExpression;
}

void ParserImpl::CheckPropertyKeyAsycModifier(ParserStatus *methodStatus)
{
    const auto asyncPos = lexer_->Save();
    lexer_->NextToken();

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        if (lexer_->GetToken().NewLine()) {
            ThrowSyntaxError(
                "Async methods cannot have a line terminator between "
                "'async' and the property name");
        }

        *methodStatus |= ParserStatus::ASYNC_FUNCTION;
    } else {
        lexer_->Rewind(asyncPos);
    }
}

static bool IsAccessorDelimiter(char32_t cp)
{
    switch (cp) {
        case LEX_CHAR_LEFT_PAREN:
        case LEX_CHAR_COLON:
        case LEX_CHAR_COMMA:
        case LEX_CHAR_RIGHT_BRACE: {
            return true;
        }
        default: {
            return false;
        }
    }
}

static bool IsShorthandDelimiter(char32_t cp)
{
    switch (cp) {
        case LEX_CHAR_EQUALS:
        case LEX_CHAR_COMMA:
        case LEX_CHAR_RIGHT_BRACE: {
            return true;
        }
        default: {
            return false;
        }
    }
}

void ParserImpl::ValidateAccessor(ExpressionParseFlags flags, lexer::TokenFlags currentTokenFlags)
{
    if (flags & ExpressionParseFlags::MUST_BE_PATTERN) {
        ThrowSyntaxError("Unexpected token");
    }

    if (currentTokenFlags & lexer::TokenFlags::HAS_ESCAPE) {
        ThrowSyntaxError("Keyword must not contain escaped characters");
    }
}

ir::Property *ParserImpl::ParseShorthandProperty(const lexer::LexerPosition *startPos)
{
    char32_t nextCp = lexer_->Lookahead();
    lexer::TokenType keywordType = lexer_->GetToken().KeywordType();

    /* Rewind the lexer to the beginning of the ident to repase as common
     * identifier */
    lexer_->Rewind(*startPos);
    lexer_->NextToken();
    lexer::SourcePosition start = lexer_->GetToken().Start();

    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        ThrowSyntaxError("Expected an identifier");
    }

    if (lexer_->GetToken().KeywordType() >= lexer::TokenType::KEYW_PRIVATE &&
        lexer_->GetToken().KeywordType() <= lexer::TokenType::KEYW_DECLARE) {
        ThrowSyntaxError(" Unexpected reserved word", lexer_->GetToken().Start());
    }

    const util::StringView &ident = lexer_->GetToken().Ident();

    auto *key = AllocNode<ir::Identifier>(ident, Allocator());
    key->SetRange(lexer_->GetToken().Loc());

    ir::Expression *value = AllocNode<ir::Identifier>(ident, Allocator());
    value->AsIdentifier()->SetReference();
    value->SetRange(lexer_->GetToken().Loc());

    lexer::SourcePosition end;

    if (nextCp == LEX_CHAR_EQUALS) {
        if (keywordType == lexer::TokenType::KEYW_EVAL) {
            ThrowSyntaxError("eval can't be defined or assigned to in strict mode code");
        }

        lexer_->NextToken();  // substitution
        lexer_->NextToken();  // eat substitution

        ir::Expression *rightNode = ParseExpression();

        auto *assignmentExpression = AllocNode<ir::AssignmentExpression>(
            ir::AstNodeType::ASSIGNMENT_PATTERN, value, rightNode, lexer::TokenType::PUNCTUATOR_SUBSTITUTION);
        assignmentExpression->SetRange({value->Start(), rightNode->End()});
        end = rightNode->End();
        value = assignmentExpression;
    } else {
        end = lexer_->GetToken().End();
        lexer_->NextToken();
    }

    auto *returnProperty = AllocNode<ir::Property>(key, value);
    returnProperty->SetRange({start, end});

    return returnProperty;
}

bool ParserImpl::ParsePropertyModifiers(ExpressionParseFlags flags, ir::PropertyKind *propertyKind,
                                        ParserStatus *methodStatus)
{
    if (lexer_->GetToken().IsAsyncModifier()) {
        CheckPropertyKeyAsycModifier(methodStatus);
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MULTIPLY) {
        if (flags & ExpressionParseFlags::MUST_BE_PATTERN) {
            ThrowSyntaxError("Unexpected token");
        }

        lexer_->NextToken();
        *methodStatus |= ParserStatus::GENERATOR_FUNCTION;
    }

    lexer::TokenFlags currentTokenFlags = lexer_->GetToken().Flags();
    char32_t nextCp = lexer_->Lookahead();
    lexer::TokenType keywordType = lexer_->GetToken().KeywordType();
    // Parse getter property
    if (keywordType == lexer::TokenType::KEYW_GET && !IsAccessorDelimiter(nextCp)) {
        ValidateAccessor(flags, currentTokenFlags);

        *propertyKind = ir::PropertyKind::GET;
        lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

        return false;
    }

    // Parse setter property
    if (keywordType == lexer::TokenType::KEYW_SET && !IsAccessorDelimiter(nextCp)) {
        ValidateAccessor(flags, currentTokenFlags);

        *propertyKind = ir::PropertyKind::SET;
        lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

        return false;
    }

    // Parse shorthand property or assignment pattern
    return (IsShorthandDelimiter(nextCp) && !(*methodStatus & ParserStatus::ASYNC_FUNCTION));
}

void ParserImpl::ParseGeneratorPropertyModifier(ExpressionParseFlags flags, ParserStatus *methodStatus)
{
    if (flags & ExpressionParseFlags::MUST_BE_PATTERN) {
        ThrowSyntaxError("Unexpected token");
    }

    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
    *methodStatus |= ParserStatus::GENERATOR_FUNCTION;
}

ir::Expression *ParserImpl::ParsePropertyKey(ExpressionParseFlags flags)
{
    ir::Expression *key = nullptr;

    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::LITERAL_IDENT: {
            const util::StringView &ident = lexer_->GetToken().Ident();
            key = AllocNode<ir::Identifier>(ident, Allocator());
            key->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::LITERAL_STRING: {
            const util::StringView &string = lexer_->GetToken().String();
            key = AllocNode<ir::StringLiteral>(string);
            key->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::LITERAL_NUMBER: {
            if (lexer_->GetToken().Flags() & lexer::TokenFlags::NUMBER_BIGINT) {
                key = AllocNode<ir::BigIntLiteral>(lexer_->GetToken().BigInt());
            } else {
                key = AllocNode<ir::NumberLiteral>(lexer_->GetToken().Number(), lexer_->GetToken().String());
            }

            key->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
            lexer_->NextToken();  // eat left square bracket

            key = ParseExpression(flags | ExpressionParseFlags::ACCEPT_COMMA);

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
                ThrowSyntaxError("Unexpected token, expected ']'");
            }
            break;
        }
        default: {
            ThrowSyntaxError("Unexpected token in property key");
        }
    }

    lexer_->NextToken();
    return key;
}

ir::Expression *ParserImpl::ParsePropertyValue(const ir::PropertyKind *propertyKind, const ParserStatus *methodStatus,
                                               ExpressionParseFlags flags)
{
    bool isMethod = *methodStatus & ParserStatus::FUNCTION;
    bool inPattern = (flags & ExpressionParseFlags::MUST_BE_PATTERN);

    if (!isMethod && !ir::Property::IsAccessorKind(*propertyKind)) {
        // If the actual property is not getter/setter nor method, the following
        // token must be ':'
        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
            ThrowSyntaxError("Unexpected token, expected ':'");
        }

        lexer_->NextToken();  // eat colon

        if (!inPattern) {
            return ParseExpression(flags);
        }

        return ParsePatternElement();
    }

    if (inPattern) {
        ThrowSyntaxError("Object pattern can't contain methods");
    }

    ir::ScriptFunction *methodDefinitonNode =
        ParseFunction(*methodStatus | ParserStatus::FUNCTION | ParserStatus::ALLOW_SUPER);
    lexer_->NextToken();
    methodDefinitonNode->AddFlag(ir::ScriptFunctionFlags::METHOD);

    size_t paramsSize = methodDefinitonNode->Params().size();

    auto *value = AllocNode<ir::FunctionExpression>(methodDefinitonNode);
    value->SetRange(methodDefinitonNode->Range());

    if (*propertyKind == ir::PropertyKind::SET && paramsSize != 1) {
        ThrowSyntaxError("Setter must have exactly one formal parameter");
    }

    if (*propertyKind == ir::PropertyKind::GET && paramsSize != 0) {
        ThrowSyntaxError("Getter must not have formal parameters");
    }

    return value;
}

ir::Expression *ParserImpl::ParsePropertyDefinition(ExpressionParseFlags flags)
{
    ir::PropertyKind propertyKind = ir::PropertyKind::INIT;
    ParserStatus methodStatus = ParserStatus::NO_OPTS;

    const auto startPos = lexer_->Save();
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
    lexer::SourcePosition start = lexer_->GetToken().Start();

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
        return ParseSpreadElement(flags);
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT) {
        if (ParsePropertyModifiers(flags, &propertyKind, &methodStatus)) {
            return ParseShorthandProperty(&startPos);
        }
    } else if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MULTIPLY) {
        ParseGeneratorPropertyModifier(flags, &methodStatus);
    }

    bool isComputed = lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET;
    ir::Expression *key = ParsePropertyKey(flags);

    // Parse method property
    if ((lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS ||
         lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) &&
        !ir::Property::IsAccessorKind(propertyKind)) {
        methodStatus |= ParserStatus::FUNCTION | ParserStatus::ALLOW_SUPER;
        propertyKind = ir::PropertyKind::INIT;
    } else if (methodStatus & (ParserStatus::GENERATOR_FUNCTION | ParserStatus::ASYNC_FUNCTION)) {
        ThrowSyntaxError("Unexpected identifier");
    }

    ir::Expression *value = ParsePropertyValue(&propertyKind, &methodStatus, flags);
    lexer::SourcePosition end = value->End();

    ASSERT(key);
    ASSERT(value);

    auto *returnProperty =
        AllocNode<ir::Property>(propertyKind, key, value, methodStatus != ParserStatus::NO_OPTS, isComputed);
    returnProperty->SetRange({start, end});

    return returnProperty;
}

bool ParserImpl::ParsePropertyEnd()
{
    // Property definiton must end with ',' or '}' otherwise we throw SyntaxError
    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ThrowSyntaxError("Unexpected token, expected ',' or '}'");
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA &&
        lexer_->Lookahead() == LEX_CHAR_RIGHT_BRACE) {
        lexer_->NextToken();
        return true;
    }

    return false;
}

ir::ObjectExpression *ParserImpl::ParseObjectExpression(ExpressionParseFlags flags)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_BRACE);
    lexer::SourcePosition start = lexer_->GetToken().Start();
    ArenaVector<ir::Expression *> properties(Allocator()->Adapter());
    bool trailingComma = false;
    bool inPattern = (flags & ExpressionParseFlags::MUST_BE_PATTERN);

    if (lexer_->Lookahead() == LEX_CHAR_RIGHT_BRACE) {
        lexer_->NextToken();
    }

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ir::Expression *property = ParsePropertyDefinition(flags | ExpressionParseFlags::POTENTIALLY_IN_PATTERN);
        properties.push_back(property);
        trailingComma = ParsePropertyEnd();
    }

    auto nodeType = inPattern ? ir::AstNodeType::OBJECT_PATTERN : ir::AstNodeType::OBJECT_EXPRESSION;
    auto *objectExpression = AllocNode<ir::ObjectExpression>(nodeType, std::move(properties), trailingComma);
    objectExpression->SetRange({start, lexer_->GetToken().End()});
    lexer_->NextToken();

    if (inPattern) {
        objectExpression->SetDeclaration();
    }

    if (Extension() == ScriptExtension::TS && (flags & ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN) &&
        lexer::Token::IsTsParamToken(lexer_->GetToken().Type())) {
        context_.Status() |= ParserStatus::FUNCTION_PARAM;
        ParsePotentialTsFunctionParameter(ExpressionParseFlags::NO_OPTS, objectExpression);
    }

    if (!(flags & ExpressionParseFlags::POTENTIALLY_IN_PATTERN)) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SUBSTITUTION &&
            !objectExpression->ConvertibleToObjectPattern()) {
            ThrowSyntaxError("Invalid left-hand side in array destructuring pattern", objectExpression->Start());
        } else if (!inPattern && lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
            ir::ValidationInfo info = objectExpression->ValidateExpression();
            if (info.Fail()) {
                ThrowSyntaxError(info.msg.Utf8(), info.pos);
            }
        }
    }

    return objectExpression;
}

ir::SequenceExpression *ParserImpl::ParseSequenceExpression(ir::Expression *startExpr, bool acceptRest,
                                                            bool acceptTsParam)
{
    lexer::SourcePosition start = startExpr->Start();

    ArenaVector<ir::Expression *> sequence(Allocator()->Adapter());
    sequence.push_back(startExpr);

    while (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
        lexer_->NextToken();

        if (acceptRest && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
            ir::SpreadElement *expr = ParseSpreadElement(ExpressionParseFlags::MUST_BE_PATTERN);
            sequence.push_back(expr);
            break;
        }

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS && lexer_->CheckArrow()) {
            break;
        }

        sequence.push_back(ParseExpression(acceptTsParam ? ExpressionParseFlags::ALLOW_TS_PARAM_TOKEN
                                                         : ExpressionParseFlags::NO_OPTS));
    }

    lexer::SourcePosition end = sequence.back()->End();
    auto *sequenceNode = AllocNode<ir::SequenceExpression>(std::move(sequence));
    sequenceNode->SetRange({start, end});

    return sequenceNode;
}

ir::Expression *ParserImpl::ParseUnaryOrPrefixUpdateExpression(ExpressionParseFlags flags)
{
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        // TODO(rsipka): negative cases are not covered, probably this is not a complete solution yet
        return ParseTsTypeAssertion(flags);
    }

    if (!lexer_->GetToken().IsUnary()) {
        return ParseLeftHandSideExpression(flags);
    }

    lexer::TokenType operatorType = lexer_->GetToken().Type();
    lexer::SourcePosition start = lexer_->GetToken().Start();
    lexer_->NextToken();
    ir::Expression *argument = ParseUnaryOrPrefixUpdateExpression();

    if (lexer::Token::IsUpdateToken(operatorType)) {
        if (!argument->IsIdentifier() && !argument->IsMemberExpression() && !argument->IsTSNonNullExpression()) {
            ThrowSyntaxError("Invalid left-hand side in prefix operation");
        }

        if (argument->IsIdentifier()) {
            const util::StringView &argumentStr = argument->AsIdentifier()->Name();

            if (argumentStr.Is("eval")) {
                ThrowSyntaxError("Assigning to 'eval' in strict mode is invalid");
            } else if (argumentStr.Is("arguments")) {
                ThrowSyntaxError("Assigning to 'arguments' in strict mode is invalid");
            }
        }
    }

    if (operatorType == lexer::TokenType::KEYW_DELETE && argument->IsIdentifier()) {
        ThrowSyntaxError("Deleting local variable in strict mode");
    }

    lexer::SourcePosition end = argument->End();

    ir::Expression *returnExpr = nullptr;

    if (lexer::Token::IsUpdateToken(operatorType)) {
        returnExpr = AllocNode<ir::UpdateExpression>(argument, operatorType, true);
    } else if (operatorType == lexer::TokenType::KEYW_AWAIT) {
        returnExpr = AllocNode<ir::AwaitExpression>(argument);
    } else {
        returnExpr = AllocNode<ir::UnaryExpression>(argument, operatorType);
    }

    returnExpr->SetRange({start, end});

    return returnExpr;
}

ir::Expression *ParserImpl::ParseImportExpression()
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    lexer_->NextToken();  // eat import

    // parse import.Meta
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD) {
        if (!context_.IsModule()) {
            ThrowSyntaxError("'import.Meta' may appear only with 'sourceType: module'");
        }

        lexer_->NextToken();  // eat dot

        if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT ||
            lexer_->GetToken().KeywordType() != lexer::TokenType::KEYW_META) {
            ThrowSyntaxError("The only valid meta property for import is import.Meta");
        }

        auto *metaProperty = AllocNode<ir::MetaProperty>(ir::MetaProperty::MetaPropertyKind::IMPORT_META);
        metaProperty->SetRange({startLoc, endLoc});

        lexer_->NextToken();
        return metaProperty;
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        ThrowSyntaxError("Unexpected token");
    }

    lexer_->NextToken();  // eat left parentheses

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
        ThrowSyntaxError("Argument of dynamic import cannot be spread element.");
    }

    ir::Expression *source = ParseExpression();

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
        ThrowSyntaxError(
            "Dynamic imports can only accept a module specifier, optional assertion is not supported yet.");
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ThrowSyntaxError("Unexpected token");
    }

    auto *importExpression = AllocNode<ir::ImportExpression>(source);
    importExpression->SetRange({startLoc, lexer_->GetToken().End()});

    lexer_->NextToken();  // eat right paren
    return importExpression;
}

ir::FunctionExpression *ParserImpl::ParseFunctionExpression(ParserStatus newStatus)
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    ir::Identifier *ident = nullptr;

    if (!(newStatus & ParserStatus::ARROW_FUNCTION)) {
        ParserStatus savedStatus = context_.Status();

        if (newStatus & ParserStatus::ASYNC_FUNCTION) {
            context_.Status() |= (ParserStatus::DISALLOW_AWAIT | ParserStatus::ASYNC_FUNCTION);
        }

        lexer_->NextToken();

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MULTIPLY) {
            newStatus |= ParserStatus::GENERATOR_FUNCTION;
            lexer_->NextToken();
        }

        if ((Extension() == ScriptExtension::JS &&
             lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) ||
            (Extension() == ScriptExtension::TS &&
             lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
             lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LESS_THAN)) {
            if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
                ThrowSyntaxError("Expected an identifier.");
            }

            CheckStrictReservedWord();

            ident = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            ident->SetRange(lexer_->GetToken().Loc());
            lexer_->NextToken();
        }

        context_.Status() = savedStatus;
    }

    ir::ScriptFunction *functionNode = ParseFunction(newStatus);
    if (functionNode->Body() != nullptr) {
        lexer_->NextToken();
    }
    functionNode->SetStart(startLoc);

    if (ident) {
        auto *funcParamScope = functionNode->Scope()->ParamScope();
        funcParamScope->BindName(Allocator(), ident->Name());
        functionNode->SetIdent(ident);
    }

    auto *funcExpr = AllocNode<ir::FunctionExpression>(functionNode);
    funcExpr->SetRange(functionNode->Range());

    return funcExpr;
}

}  // namespace panda::es2panda::parser
