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

#include "parserImpl.h"

#include <binder/scope.h>
#include <binder/tsBinding.h>
#include <ir/astDump.h>
#include <ir/astNode.h>
#include <ir/base/classDefinition.h>
#include <ir/base/classProperty.h>
#include <ir/base/decorator.h>
#include <ir/base/methodDefinition.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/expression.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/callExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/bigIntLiteral.h>
#include <ir/expressions/literals/booleanLiteral.h>
#include <ir/expressions/literals/nullLiteral.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/objectExpression.h>
#include <ir/expressions/superExpression.h>
#include <ir/module/exportDefaultDeclaration.h>
#include <ir/module/exportNamedDeclaration.h>
#include <ir/module/exportSpecifier.h>
#include <ir/statements/blockStatement.h>
#include <ir/statements/emptyStatement.h>
#include <ir/statements/expressionStatement.h>
#include <ir/statements/functionDeclaration.h>
#include <ir/ts/tsAnyKeyword.h>
#include <ir/ts/tsArrayType.h>
#include <ir/ts/tsBigintKeyword.h>
#include <ir/ts/tsBooleanKeyword.h>
#include <ir/ts/tsClassImplements.h>
#include <ir/ts/tsConditionalType.h>
#include <ir/ts/tsConstructorType.h>
#include <ir/ts/tsEnumDeclaration.h>
#include <ir/ts/tsEnumMember.h>
#include <ir/ts/tsFunctionType.h>
#include <ir/ts/tsImportType.h>
#include <ir/ts/tsIndexSignature.h>
#include <ir/ts/tsIndexedAccessType.h>
#include <ir/ts/tsInferType.h>
#include <ir/ts/tsIntersectionType.h>
#include <ir/ts/tsLiteralType.h>
#include <ir/ts/tsMappedType.h>
#include <ir/ts/tsMethodSignature.h>
#include <ir/ts/tsNamedTupleMember.h>
#include <ir/ts/tsNeverKeyword.h>
#include <ir/ts/tsNullKeyword.h>
#include <ir/ts/tsNumberKeyword.h>
#include <ir/ts/tsObjectKeyword.h>
#include <ir/ts/tsOptionalType.h>
#include <ir/ts/tsParameterProperty.h>
#include <ir/ts/tsParenthesizedType.h>
#include <ir/ts/tsPrivateIdentifier.h>
#include <ir/ts/tsPropertySignature.h>
#include <ir/ts/tsQualifiedName.h>
#include <ir/ts/tsRestType.h>
#include <ir/ts/tsSignatureDeclaration.h>
#include <ir/ts/tsStringKeyword.h>
#include <ir/ts/tsSymbolKeyword.h>
#include <ir/ts/tsTemplateLiteralType.h>
#include <ir/ts/tsThisType.h>
#include <ir/ts/tsTupleType.h>
#include <ir/ts/tsTypeLiteral.h>
#include <ir/ts/tsTypeOperator.h>
#include <ir/ts/tsTypeParameterDeclaration.h>
#include <ir/ts/tsTypeParameterInstantiation.h>
#include <ir/ts/tsTypePredicate.h>
#include <ir/ts/tsTypeQuery.h>
#include <ir/ts/tsTypeReference.h>
#include <ir/ts/tsUndefinedKeyword.h>
#include <ir/ts/tsUnionType.h>
#include <ir/ts/tsUnknownKeyword.h>
#include <ir/ts/tsVoidKeyword.h>
#include <lexer/lexer.h>
#include <lexer/token/letters.h>
#include <lexer/token/sourceLocation.h>
#include <mem/pool_manager.h>

namespace panda::es2panda::parser {

ParserImpl::ParserImpl(ScriptExtension extension) : program_(extension), context_(&program_) {}

template <class T>
bool IsSuffix(T const &filename, T const &suffix)
{
    return (filename.length() > suffix.length()) &&
        (filename.rfind(suffix) == (filename.length() - suffix.length()));
}

std::unique_ptr<lexer::Lexer> ParserImpl::InitLexer(const std::string &fileName, const std::string &source)
{
    bool isDtsFile = false;
    if (Extension() == ScriptExtension::TS) {
        isDtsFile = IsSuffix(fileName, std::string(".d.ts"));
    }
    program_.SetSource(source, fileName, isDtsFile);
    auto lexer = std::make_unique<lexer::Lexer>(&context_);
    lexer_ = lexer.get();

    return lexer;
}

Program ParserImpl::Parse(const std::string &fileName, const std::string &source,
                          const std::string &recordName, ScriptKind kind)
{
    program_.SetKind(kind);
    program_.SetRecordName(recordName);

    /*
     * In order to make the lexer's memory alive, the return value 'lexer' can not be omitted.
     */
    auto lexer = InitLexer(fileName, source);
    switch (kind) {
        case ScriptKind::SCRIPT: {
            ParseScript();
            break;
        }
        case ScriptKind::MODULE: {
            ParseModule();
            break;
        }
        case ScriptKind::COMMONJS: {
            ParseCommonjs();
            break;
        }
        default: {
            UNREACHABLE();
        }
    }
    binder::ResolveBindingFlags bindFlags = binder::ResolveBindingFlags::ALL;
    if (Extension() == ScriptExtension::TS) {
        bindFlags = binder::ResolveBindingFlags::TS_BEFORE_TRANSFORM;
    }
    Binder()->IdentifierAnalysis(bindFlags);
    return std::move(program_);
}

void ParserImpl::ParseScript()
{
    ParseProgram(ScriptKind::SCRIPT);
}

void ParserImpl::ParseModule()
{
    context_.Status() |= (ParserStatus::MODULE);
    ParseProgram(ScriptKind::MODULE);
}

void ParserImpl::ParseProgram(ScriptKind kind)
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    lexer_->NextToken();

    auto statements = ParseStatementList(StatementParsingFlags::STMT_GLOBAL_LEXICAL);

    auto *blockStmt = AllocNode<ir::BlockStatement>(Binder()->GetScope(), std::move(statements));
    Binder()->GetScope()->BindNode(blockStmt);
    blockStmt->SetRange({startLoc, lexer_->GetToken().End()});

    program_.SetAst(blockStmt);
}

/*
 * Definitions of private methods
 */
ExpressionParseFlags ParserImpl::CarryExpressionParserFlag(ExpressionParseFlags origin, ExpressionParseFlags carry)
{
    return static_cast<ExpressionParseFlags>(origin & carry);
}

ExpressionParseFlags ParserImpl::CarryPatternFlags(ExpressionParseFlags flags)
{
    return CarryExpressionParserFlag(flags, ExpressionParseFlags::POTENTIALLY_IN_PATTERN |
                                                ExpressionParseFlags::OBJECT_PATTERN);
}

bool ParserImpl::CurrentLiteralIsBasicType()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT ||
           lexer_->GetToken().Type() == lexer::TokenType::KEYW_EXTENDS);

    switch (lexer_->GetToken().KeywordType()) {
        case lexer::TokenType::KEYW_ANY:
        case lexer::TokenType::KEYW_BOOLEAN:
        case lexer::TokenType::KEYW_NUMBER:
        case lexer::TokenType::KEYW_STRING:
        case lexer::TokenType::KEYW_SYMBOL:
        case lexer::TokenType::KEYW_UNKNOWN:
        case lexer::TokenType::KEYW_UNDEFINED:
        case lexer::TokenType::KEYW_NEVER:
        case lexer::TokenType::KEYW_OBJECT:
        case lexer::TokenType::KEYW_BIGINT: {
            return true;
        }
        default: {
            break;
        }
    }

    return false;
}
bool ParserImpl::CurrentIsBasicType()
{
    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::PUNCTUATOR_MINUS:
        case lexer::TokenType::LITERAL_NUMBER:
        case lexer::TokenType::LITERAL_STRING:
        case lexer::TokenType::LITERAL_FALSE:
        case lexer::TokenType::LITERAL_TRUE:
        case lexer::TokenType::LITERAL_NULL:
        case lexer::TokenType::KEYW_VOID: {
            return true;
        }
        case lexer::TokenType::LITERAL_IDENT: {
            return CurrentLiteralIsBasicType();
        }
        default: {
            break;
        }
    }

    return false;
}

ir::TSTypeReference *ParserImpl::ParseTsConstExpression()
{
    auto *identRef = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
    identRef->SetReference();
    identRef->SetRange(lexer_->GetToken().Loc());

    auto *typeReference = AllocNode<ir::TSTypeReference>(identRef, nullptr);
    typeReference->SetRange(lexer_->GetToken().Loc());

    lexer_->NextToken();

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SEMI_COLON &&
        lexer_->GetToken().Type() != lexer::TokenType::EOS &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET &&
        !(lexer_->GetToken().Flags() & lexer::TokenFlags::NEW_LINE)) {
        ThrowSyntaxError("Unexpected token.");
    }

    return typeReference;
}

ir::Expression *ParserImpl::ParseTsIdentifierReference()
{
    if (CurrentLiteralIsBasicType() && lexer_->Lookahead() != LEX_CHAR_DOT) {
        return ParseTsBasicType();
    }

    return ParseTsTypeReferenceOrQuery();
}

bool ParserImpl::IsStartOfMappedType() const
{
    auto pos = lexer_->Save();
    lexer_->NextToken();
    bool result = false;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MINUS ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PLUS) {
        lexer_->NextToken();
        result = lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_READONLY;
        lexer_->Rewind(pos);
        return result;
    }

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_READONLY) {
        lexer_->NextToken();
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET) {
        lexer_->Rewind(pos);
        return false;
    }

    lexer_->NextToken();

    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        lexer_->Rewind(pos);
        return false;
    }

    lexer_->NextToken();

    result = lexer_->GetToken().Type() == lexer::TokenType::KEYW_IN;

    lexer_->Rewind(pos);
    return result;
}

bool ParserImpl::IsStartOfTsTypePredicate() const
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT ||
           lexer_->GetToken().Type() == lexer::TokenType::KEYW_THIS);

    auto pos = lexer_->Save();
    bool isAsserts = lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ASSERTS;
    if (isAsserts) {
        lexer_->NextToken();
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT &&
        lexer_->GetToken().Type() != lexer::TokenType::KEYW_THIS) {
        lexer_->Rewind(pos);
        return false;
    }

    if (isAsserts) {
        lexer_->Rewind(pos);
        return true;
    }

    lexer_->NextToken();

    bool result = !lexer_->GetToken().NewLine() && (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_IS);
    lexer_->Rewind(pos);
    return result;
}

bool ParserImpl::IsStartOfAbstractConstructorType() const
{
    if (lexer_->GetToken().KeywordType() != lexer::TokenType::KEYW_ABSTRACT) {
        return false;
    }

    lexer::LexerPosition pos = lexer_->Save();
    lexer_->NextToken();  // eat 'abstract'
    bool result = lexer_->GetToken().Type() == lexer::TokenType::KEYW_NEW;

    lexer_->Rewind(pos);

    return result;
}

ir::Expression *ParserImpl::ParseTsTypeLiteralOrTsMappedType(ir::Expression *typeAnnotation)
{
    if (typeAnnotation) {
        return nullptr;
    }

    if (IsStartOfMappedType()) {
        return ParseTsMappedType();
    }

    lexer::SourcePosition bodyStart = lexer_->GetToken().Start();
    auto members = ParseTsTypeLiteralOrInterface();
    lexer::SourcePosition bodyEnd = lexer_->GetToken().End();
    lexer_->NextToken();

    auto *literalType = AllocNode<ir::TSTypeLiteral>(std::move(members));
    auto *typeVar = binder::Scope::CreateVar(Allocator(), "__type", binder::VariableFlags::TYPE, literalType);
    literalType->SetVariable(typeVar);
    literalType->SetRange({bodyStart, bodyEnd});
    return literalType;
}

ir::Expression *ParserImpl::ParseTsTypeReferenceOrTsTypePredicate(ir::Expression *typeAnnotation,
                                                                  bool canBeTsTypePredicate)
{
    if (typeAnnotation) {
        return nullptr;
    }

    if (canBeTsTypePredicate && IsStartOfTsTypePredicate()) {
        return ParseTsTypePredicate();
    }

    return ParseTsTypeOperatorOrTypeReference();
}

ir::Expression *ParserImpl::ParseTsThisTypeOrTsTypePredicate(ir::Expression *typeAnnotation, bool canBeTsTypePredicate,
                                                             bool throwError)
{
    if (typeAnnotation) {
        return nullptr;
    }

    if (canBeTsTypePredicate && IsStartOfTsTypePredicate()) {
        return ParseTsTypePredicate();
    }

    return ParseTsThisType(throwError);
}

ir::Expression *ParserImpl::ParseTsTemplateLiteralType()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_BACK_TICK);
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    ArenaVector<ir::TemplateElement *> quasis(Allocator()->Adapter());
    ArenaVector<ir::Expression *> references(Allocator()->Adapter());

    while (true) {
        lexer_->ResetTokenEnd();
        const auto startPos = lexer_->Save();

        lexer_->ScanString<LEX_CHAR_BACK_TICK>();
        util::StringView cooked = lexer_->GetToken().String();

        lexer_->Rewind(startPos);
        auto [raw, end, scanExpression] = lexer_->ScanTemplateString();

        auto *element = AllocNode<ir::TemplateElement>(raw.View(), cooked);
        element->SetRange({lexer::SourcePosition{startPos.iterator.Index(), startPos.line},
                           lexer::SourcePosition{end, lexer_->Line()}});
        quasis.push_back(element);

        if (!scanExpression) {
            lexer_->ScanTemplateStringEnd();
            break;
        }

        ir::Expression *reference = nullptr;

        {
            lexer::TemplateLiteralParserContext ctx(lexer_);
            lexer_->PushTemplateContext(&ctx);
            lexer_->NextToken();
            TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
            reference = ParseTsTypeAnnotation(&options);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
            ThrowSyntaxError("Unexpected token, expected '}'.");
        }

        references.push_back(reference);
    }

    ir::Expression *typeAnnotation = AllocNode<ir::TSTemplateLiteralType>(std::move(quasis), std::move(references));
    typeAnnotation->SetRange({startLoc, lexer_->GetToken().End()});

    lexer_->NextToken();

    return typeAnnotation;
}

ir::Expression *ParserImpl::ParseTsTypeAnnotationElement(ir::Expression *typeAnnotation,
                                                         TypeAnnotationParsingOptions *options)
{
    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR: {
            if (*options & (TypeAnnotationParsingOptions::IN_MODIFIER | TypeAnnotationParsingOptions::IN_UNION |
                TypeAnnotationParsingOptions::IN_INTERSECTION)) {
                break;
            }

            return ParseTsUnionType(typeAnnotation, *options & TypeAnnotationParsingOptions::RESTRICT_EXTENDS);
        }
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND: {
            if (*options & (TypeAnnotationParsingOptions::IN_MODIFIER |
	        TypeAnnotationParsingOptions::IN_INTERSECTION)) {
                break;
            }

            return ParseTsIntersectionType(typeAnnotation, *options & TypeAnnotationParsingOptions::IN_UNION,
                                           *options & TypeAnnotationParsingOptions::RESTRICT_EXTENDS);
        }
        case lexer::TokenType::PUNCTUATOR_LESS_THAN:
        case lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS:
        case lexer::TokenType::KEYW_NEW: {
            return ParseTsParenthesizedOrFunctionType(typeAnnotation,
                                                      *options & TypeAnnotationParsingOptions::THROW_ERROR);
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
            if (typeAnnotation) {
                if (lexer_->Lookahead() == LEX_CHAR_RIGHT_SQUARE) {
                    return ParseTsArrayType(typeAnnotation);
                }

                return ParseTsIndexAccessType(typeAnnotation);
            }

            return ParseTsTupleType();
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_BRACE: {
            return ParseTsTypeLiteralOrTsMappedType(typeAnnotation);
        }
        case lexer::TokenType::PUNCTUATOR_MINUS:
        case lexer::TokenType::LITERAL_NUMBER:
        case lexer::TokenType::LITERAL_STRING:
        case lexer::TokenType::LITERAL_FALSE:
        case lexer::TokenType::LITERAL_TRUE:
        case lexer::TokenType::LITERAL_NULL:
        case lexer::TokenType::KEYW_VOID: {
            if (typeAnnotation) {
                break;
            }

            return ParseTsBasicType();
        }
        case lexer::TokenType::KEYW_TYPEOF: {
            if (typeAnnotation) {
                break;
            }

            return ParseTsTypeReferenceOrQuery(true);
        }
        case lexer::TokenType::KEYW_IMPORT: {
            if (typeAnnotation) {
                break;
            }

            lexer::SourcePosition startLoc = lexer_->GetToken().Start();
            return ParseTsImportType(startLoc);
        }
        case lexer::TokenType::KEYW_CONST: {
            if (!(*options & TypeAnnotationParsingOptions::ALLOW_CONST)) {
                break;
            }

            *options &= ~TypeAnnotationParsingOptions::ALLOW_CONST;
            return ParseTsConstExpression();
        }
        case lexer::TokenType::LITERAL_IDENT: {
            if (IsStartOfAbstractConstructorType()) {
                return ParseTsParenthesizedOrFunctionType(typeAnnotation,
                                                          *options & TypeAnnotationParsingOptions::THROW_ERROR);
            }

            return ParseTsTypeReferenceOrTsTypePredicate(
                typeAnnotation, *options & TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE);
        }
        case lexer::TokenType::KEYW_EXTENDS: {
            if (*options & (TypeAnnotationParsingOptions::IN_UNION | TypeAnnotationParsingOptions::IN_INTERSECTION)) {
                break;
            }

            if (!typeAnnotation) {
                return ParseTsIdentifierReference();
            }

            return ParseTsConditionalType(typeAnnotation, *options & TypeAnnotationParsingOptions::RESTRICT_EXTENDS);
        }
        case lexer::TokenType::KEYW_THIS: {
            return ParseTsThisTypeOrTsTypePredicate(typeAnnotation,
                                                    *options & TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE,
                                                    *options & TypeAnnotationParsingOptions::THROW_ERROR);
        }
        case lexer::TokenType::PUNCTUATOR_BACK_TICK: {
            return ParseTsTemplateLiteralType();
        }
        default: {
            break;
        }
    }

    if (!typeAnnotation && (*options & TypeAnnotationParsingOptions::THROW_ERROR)) {
        ThrowSyntaxError("Type expected");
    }

    return nullptr;
}

ir::TSImportType *ParserImpl::ParseTsImportType(const lexer::SourcePosition &startLoc, bool isTypeof)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::KEYW_IMPORT);

    lexer_->NextToken();

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        ThrowSyntaxError("'(' expected");
    }

    lexer_->NextToken();

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
    ir::Expression *param = ParseTsTypeAnnotation(&options);

    if (!param->IsTSLiteralType() || !param->AsTSLiteralType()->Literal()->IsStringLiteral()) {
        ThrowSyntaxError("String literal expected");
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ThrowSyntaxError("')' expected");
    }

    lexer_->NextToken();

    ir::Expression *qualifier = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD) {
        lexer_->NextToken();

        if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
            ThrowSyntaxError("Identifier expected");
        }

        qualifier = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
        qualifier->SetRange(lexer_->GetToken().Loc());

        lexer_->NextToken();

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD) {
            qualifier = ParseTsQualifiedReference(qualifier);
        }
    }

    ir::TSTypeParameterInstantiation *typeParams = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
            lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
        }

        typeParams = ParseTsTypeParameterInstantiation();
    }

    auto *importType = AllocNode<ir::TSImportType>(param, typeParams, qualifier, isTypeof);

    importType->SetRange({startLoc, lexer_->GetToken().End()});

    return importType;
}

ir::Expression *ParserImpl::ParseTsThisType(bool throwError)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::KEYW_THIS);

    if (throwError && !(context_.Status() & ParserStatus::ALLOW_THIS_TYPE)) {
        ThrowSyntaxError(
            "A 'this' type is available only in a non-static member "
            "of a class or interface.");
    }

    auto *returnType = AllocNode<ir::TSThisType>();
    returnType->SetRange(lexer_->GetToken().Loc());

    lexer_->NextToken();

    return returnType;
}

ir::Expression *ParserImpl::ParseTsConditionalType(ir::Expression *checkType, bool restrictExtends)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::KEYW_EXTENDS);
    if (restrictExtends) {
        ThrowSyntaxError("'?' expected.");
    }

    lexer::SourcePosition startLoc = checkType->Start();

    lexer_->NextToken();  // eat 'extends'

    ParserStatus savedStatus = context_.Status();
    context_.Status() |= ParserStatus::IN_EXTENDS;

    TypeAnnotationParsingOptions options =
        TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::RESTRICT_EXTENDS;
    auto *extendsType = ParseTsTypeAnnotation(&options);

    context_.Status() = savedStatus;

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
        ThrowSyntaxError("'?' expected.");
    }

    lexer_->NextToken();  // eat '?'

    options &= ~TypeAnnotationParsingOptions::RESTRICT_EXTENDS;
    auto *trueType = ParseTsTypeAnnotation(&options);

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
        ThrowSyntaxError("':' expected.");
    }

    lexer_->NextToken();  // eat ':'

    auto *falseType = ParseTsTypeAnnotation(&options);

    lexer::SourcePosition endLoc = falseType->End();

    auto *conditionalType = AllocNode<ir::TSConditionalType>(checkType, extendsType, trueType, falseType);

    conditionalType->SetRange({startLoc, endLoc});

    return conditionalType;
}

ir::Expression *ParserImpl::ParseTsTypeAnnotation(TypeAnnotationParsingOptions *options)
{
    ir::Expression *typeAnnotation = nullptr;

    while (true) {
        ir::Expression *element = ParseTsTypeAnnotationElement(typeAnnotation, options);

        *options &= ~TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE;

        if (!element) {
            break;
        }

        typeAnnotation = element;

        if ((*options & TypeAnnotationParsingOptions::BREAK_AT_NEW_LINE) && lexer_->GetToken().NewLine()) {
            break;
        }
    }

    return typeAnnotation;
}

ir::Expression *ParserImpl::ParseTsTypeOperatorOrTypeReference()
{
    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_READONLY) {
        lexer::SourcePosition typeOperatorStart = lexer_->GetToken().Start();
        lexer_->NextToken();

        options |= TypeAnnotationParsingOptions::IN_MODIFIER;
        ir::Expression *type = ParseTsTypeAnnotation(&options);
        ASSERT(type != nullptr);

        if (!type->IsTSArrayType() && !type->IsTSTupleType()) {
            ThrowSyntaxError(
                "'readonly' type modifier is only permitted on array "
                "and tuple literal types.");
        }

        auto *typeOperator = AllocNode<ir::TSTypeOperator>(type, ir::TSOperatorType::READONLY);

        typeOperator->SetRange({typeOperatorStart, type->End()});

        return typeOperator;
    }

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_KEYOF) {
        lexer::SourcePosition typeOperatorStart = lexer_->GetToken().Start();
        lexer_->NextToken();

        options |= TypeAnnotationParsingOptions::IN_MODIFIER;
        ir::Expression *type = ParseTsTypeAnnotation(&options);
        ASSERT(type != nullptr);

        auto *typeOperator = AllocNode<ir::TSTypeOperator>(type, ir::TSOperatorType::KEYOF);

        typeOperator->SetRange({typeOperatorStart, type->End()});

        return typeOperator;
    }

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_UNIQUE) {
        lexer::SourcePosition typeOperatorStart = lexer_->GetToken().Start();
        lexer_->NextToken();

        ir::Expression *type = ParseTsTypeAnnotation(&options);
        ASSERT(type != nullptr);

        auto *typeOperator = AllocNode<ir::TSTypeOperator>(type, ir::TSOperatorType::UNIQUE);

        typeOperator->SetRange({typeOperatorStart, type->End()});

        return typeOperator;
    }

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_INFER) {
        if (!(context_.Status() & ParserStatus::IN_EXTENDS)) {
            ThrowSyntaxError(
                "'infer' declarations are only permitted in the "
                "'extends' clause of a conditional type.");
        }

        lexer::SourcePosition inferStart = lexer_->GetToken().Start();
        lexer_->NextToken();

        ir::TSTypeParameter *typeParam = ParseTsTypeParameter(true);

        auto *inferType = AllocNode<ir::TSInferType>(typeParam);

        inferType->SetRange({inferStart, lexer_->GetToken().End()});

        return inferType;
    }

    return ParseTsIdentifierReference();
}

bool ParserImpl::IsTSNamedTupleMember()
{
    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        return false;
    }
    const auto savePos = lexer_->Save();
    bool isNamedMember = false;
    lexer_->NextToken();
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON ||
        (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK &&
         lexer_->Lookahead() == LEX_CHAR_COLON)) {
            isNamedMember = true;
    }
    lexer_->Rewind(savePos);
    return isNamedMember;
}

ir::Expression *ParserImpl::ParseTsTupleElement(ir::TSTupleKind *kind, bool *seenOptional)
{
    lexer::SourcePosition startPos = lexer_->GetToken().Start();
    ir::Expression *element = nullptr;
    bool isOptional = false;
    bool isRestType = false;
    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD) {
        isRestType = true;
        lexer_->NextToken();  // eat '...'
    }

    if (IsTSNamedTupleMember()) {
        if (*kind == ir::TSTupleKind::DEFAULT) {
            ThrowSyntaxError("Tuple members must all have or haven't names");
        }
        *kind = ir::TSTupleKind::NAMED;

        auto *elementIdent = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
        elementIdent->SetRange(lexer_->GetToken().Loc());
        lexer_->NextToken();  // eat identifier

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
            lexer_->NextToken();  // eat '?'
            isOptional = true;
            *seenOptional = true;
        } else if (*seenOptional) {
            ThrowSyntaxError("A required element cannot follow an optional element");
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
            ThrowSyntaxError("':' expected");
        }

        lexer_->NextToken();  // eat ':'
        auto *elementType = ParseTsTypeAnnotation(&options);
        ASSERT(elementType != nullptr);

        element = AllocNode<ir::TSNamedTupleMember>(elementIdent, elementType, isOptional, isRestType);
        element->SetRange({startPos, elementType->End()});
    } else {
        if (*kind == ir::TSTupleKind::NAMED) {
            ThrowSyntaxError("Tuple members must all have or haven't names");
        }
        *kind = ir::TSTupleKind::DEFAULT;

        element = ParseTsTypeAnnotation(&options);
        ASSERT(element != nullptr);
        if (element && isRestType) {
            lexer::SourcePosition endPos = element->End();
            element = AllocNode<ir::TSRestType>(std::move(element));
            element->SetRange({startPos, endPos});
        }

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
            lexer::SourcePosition elementStartPos = element->Start();
            element = AllocNode<ir::TSOptionalType>(std::move(element));
            element->SetRange({elementStartPos, lexer_->GetToken().End()});
            lexer_->NextToken();  // eat '?'
        }
    }
    return element;
}

ir::TSTupleType *ParserImpl::ParseTsTupleType()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET);
    lexer::SourcePosition tupleStart = lexer_->GetToken().Start();
    ArenaVector<ir::Expression *> elements(Allocator()->Adapter());
    ir::TSTupleKind kind = ir::TSTupleKind::NONE;
    bool seenOptional = false;

    lexer_->NextToken();  // eat '['

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
        ir::Expression *element = ParseTsTupleElement(&kind, &seenOptional);

        elements.push_back(element);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
            break;
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA) {
            ThrowSyntaxError("',' expected.");
        }

        lexer_->NextToken();  // eat ','
    }

    lexer::SourcePosition tupleEnd = lexer_->GetToken().End();
    lexer_->NextToken();  // eat ']'

    auto *tupleType = AllocNode<ir::TSTupleType>(std::move(elements));
    tupleType->SetRange({tupleStart, tupleEnd});
    return tupleType;
}

ir::Expression *ParserImpl::ParseTsQualifiedReference(ir::Expression *typeName)
{
    lexer::SourcePosition startLoc = typeName->Start();

    do {
        lexer_->NextToken();  // eat '.'

        if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
            ThrowSyntaxError("Identifier expected");
        }

        auto *propName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
        propName->SetRange(lexer_->GetToken().Loc());

        typeName = AllocNode<ir::TSQualifiedName>(typeName, propName);
        typeName->SetRange({typeName->AsTSQualifiedName()->Left()->Start(), lexer_->GetToken().End()});

        lexer_->NextToken();
    } while (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD);

    typeName->SetRange({startLoc, lexer_->GetToken().End()});

    return typeName;
}

ir::Expression *ParserImpl::ParseTsIndexAccessType(ir::Expression *typeName)
{
    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;

    do {
        lexer_->NextToken();  // eat '['

        ir::Expression *indexType = ParseTsTypeAnnotation(&options);

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
            ThrowSyntaxError("']' exprected");
        }

        lexer_->NextToken();  // eat ']'

        typeName = AllocNode<ir::TSIndexedAccessType>(typeName, indexType);
        typeName->SetRange({typeName->AsTSIndexedAccessType()->ObjectType()->Start(), lexer_->GetToken().End()});
    } while (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET &&
             lexer_->Lookahead() != LEX_CHAR_RIGHT_SQUARE);

    return typeName;
}

ir::Expression *ParserImpl::ParseTsTypeReferenceOrQuery(bool parseQuery)
{
    lexer::SourcePosition referenceStartLoc = lexer_->GetToken().Start();

    if (parseQuery) {
        ASSERT(lexer_->GetToken().Type() == lexer::TokenType::KEYW_TYPEOF);
        lexer_->NextToken();  // eat 'typeof'

        if (lexer_->GetToken().Type() == lexer::TokenType::KEYW_IMPORT) {
            lexer::SourcePosition &startLoc = referenceStartLoc;
            return ParseTsImportType(startLoc, true);
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
            ThrowSyntaxError("Identifier expected.");
        }
    }

    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT ||
           lexer_->GetToken().Type() == lexer::TokenType::KEYW_EXTENDS);

    ir::Expression *typeName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
    typeName->SetRange(lexer_->GetToken().Loc());
    typeName->AsIdentifier()->SetReference();

    if (lexer_->Lookahead() == LEX_CHAR_LESS_THAN) {
        lexer_->ForwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
    } else {
        lexer_->NextToken();
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD) {
        typeName = ParseTsQualifiedReference(typeName);
    }

    ir::TSTypeParameterInstantiation *typeParamInst = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        if (parseQuery) {
            ThrowSyntaxError("Unexpected token.");
        }

        typeParamInst = ParseTsTypeParameterInstantiation();
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET &&
        lexer_->Lookahead() != LEX_CHAR_RIGHT_SQUARE) {
        if (parseQuery) {
            typeName = AllocNode<ir::TSTypeQuery>(typeName);
        } else {
            typeName = AllocNode<ir::TSTypeReference>(typeName, typeParamInst);
        }

        typeName->SetRange({referenceStartLoc, lexer_->GetToken().End()});

        return ParseTsIndexAccessType(typeName);
    }

    ir::Expression *returnNode = nullptr;

    lexer::SourcePosition referenceEndLoc = typeName->End();

    if (parseQuery) {
        returnNode = AllocNode<ir::TSTypeQuery>(typeName);
    } else {
        returnNode = AllocNode<ir::TSTypeReference>(typeName, typeParamInst);
    }

    returnNode->SetRange({referenceStartLoc, referenceEndLoc});

    return returnNode;
}

ir::TSTypeParameter *ParserImpl::ParseTsMappedTypeParameter()
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    auto *paramName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
    paramName->SetRange({lexer_->GetToken().Start(), lexer_->GetToken().End()});

    lexer_->NextToken();

    lexer_->NextToken();  // eat 'in'

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
    ir::Expression *constraint = ParseTsTypeAnnotation(&options);

    lexer::SourcePosition endLoc = constraint->End();

    auto *typeParameter = AllocNode<ir::TSTypeParameter>(paramName, constraint, nullptr);

    typeParameter->SetRange({startLoc, endLoc});

    return typeParameter;
}

ir::MappedOption ParserImpl::ParseMappedOption(lexer::TokenType tokenType)
{
    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_MINUS &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_PLUS &&
        lexer_->GetToken().KeywordType() != tokenType && lexer_->GetToken().Type() != tokenType) {
        return ir::MappedOption::NO_OPTS;
    }

    auto result = lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MINUS ? ir::MappedOption::MINUS
                                                                                  : ir::MappedOption::PLUS;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MINUS ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PLUS) {
        lexer_->NextToken();
    }

    if (lexer_->GetToken().KeywordType() != tokenType && lexer_->GetToken().Type() != tokenType) {
        ThrowSyntaxError({"'", TokenToString(tokenType), "' expected."});
    }

    lexer_->NextToken();

    return result;
}

ir::TSMappedType *ParserImpl::ParseTsMappedType()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_BRACE);

    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat '{'

    ir::MappedOption readonly = ParseMappedOption(lexer::TokenType::KEYW_READONLY);

    lexer_->NextToken();  // eat '['

    ir::TSTypeParameter *typeParameter = ParseTsMappedTypeParameter();

    ir::Expression *nameKeyType = nullptr;
    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_AS) {
        lexer_->NextToken();  // eat 'as'
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
        nameKeyType = ParseTsTypeAnnotation(&options);
        ASSERT(nameKeyType != nullptr);
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
        ThrowSyntaxError("']' expected");
    }

    lexer_->NextToken();  // eat ']'

    ir::MappedOption optional = ParseMappedOption(lexer::TokenType::PUNCTUATOR_QUESTION_MARK);

    ir::Expression *typeAnnotation = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
        typeAnnotation = ParseTsTypeAnnotation(&options);
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SEMI_COLON &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ThrowSyntaxError("';' expected");
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SEMI_COLON) {
        lexer_->NextToken();  // eat ';'
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ThrowSyntaxError("'}' expected");
    }

    auto *mappedType = AllocNode<ir::TSMappedType>(typeParameter, nameKeyType, typeAnnotation, readonly, optional);

    mappedType->SetRange({startLoc, lexer_->GetToken().End()});

    lexer_->NextToken();  // eat '}'

    return mappedType;
}

ir::TSTypePredicate *ParserImpl::ParseTsTypePredicate()
{
    auto pos = lexer_->Save();
    lexer::SourcePosition startPos = lexer_->GetToken().Start();
    bool isAsserts = lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ASSERTS;
    if (isAsserts) {
        lexer_->NextToken();  // eat 'asserts'
        if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_IS) {
            isAsserts = false;
            lexer_->Rewind(pos);
        }
    }

    ir::Expression *parameterName = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT) {
        parameterName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
    } else {
        parameterName = AllocNode<ir::TSThisType>();
    }

    parameterName->SetRange({lexer_->GetToken().Start(), lexer_->GetToken().End()});

    lexer_->NextToken();

    ir::Expression *typeAnnotation = nullptr;
    lexer::SourcePosition endPos;
    ir::TSTypePredicate *result = nullptr;

    if (isAsserts && lexer_->GetToken().KeywordType() != lexer::TokenType::KEYW_IS) {
        endPos = parameterName->End();
        result = AllocNode<ir::TSTypePredicate>(parameterName, typeAnnotation, isAsserts);
        result->SetRange({startPos, endPos});
        return result;
    }

    lexer_->NextToken();  // eat 'is'

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
    typeAnnotation = ParseTsTypeAnnotation(&options);
    endPos = typeAnnotation->End();

    result = AllocNode<ir::TSTypePredicate>(parameterName, typeAnnotation, isAsserts);

    result->SetRange({startPos, endPos});

    return result;
}

ir::Expression *ParserImpl::ParseTsTypeLiteralOrInterfaceKey(bool *computed, bool *signature, bool *isIndexSignature)
{
    ir::Expression *key = nullptr;

    if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT &&
        (lexer_->GetToken().KeywordType() != lexer::TokenType::KEYW_NEW ||
         (lexer_->Lookahead() != LEX_CHAR_LEFT_PAREN && lexer_->Lookahead() != LEX_CHAR_LESS_THAN))) {
        key = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
        key->SetRange(lexer_->GetToken().Loc());
        lexer_->NextToken();
    } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_NUMBER) {
        if (lexer_->GetToken().Flags() & lexer::TokenFlags::NUMBER_BIGINT) {
            key = AllocNode<ir::BigIntLiteral>(lexer_->GetToken().BigInt());
        } else {
            key = AllocNode<ir::NumberLiteral>(lexer_->GetToken().Number(), lexer_->GetToken().String());
        }

        key->SetRange(lexer_->GetToken().Loc());
        lexer_->NextToken();
    } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_STRING) {
        key = AllocNode<ir::StringLiteral>(lexer_->GetToken().String());
        key->SetRange(lexer_->GetToken().Loc());
        lexer_->NextToken();
    } else if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET) {
        *computed = true;
        lexer_->NextToken();  // eat '['

        if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT && lexer_->Lookahead() == LEX_CHAR_COLON) {
            *isIndexSignature = true;
            key = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            key->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();  // eat param

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
                ThrowSyntaxError("':' expected");
            }

            lexer_->NextToken();  // eat ':'

            TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
            ir::Expression *typeAnnotation = ParseTsTypeAnnotation(&options);

            if (!typeAnnotation->IsTSNumberKeyword() && !typeAnnotation->IsTSStringKeyword()) {
                ThrowSyntaxError(
                    "An index signature parameter type must be either "
                    "'string' or 'number'");
            }

            key->SetTsTypeAnnotation(typeAnnotation);
        } else {
            key = ParseExpression();
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
            ThrowSyntaxError("']' expected");
        }

        lexer_->NextToken();  // eat ']'
    } else if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
               lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LESS_THAN &&
               lexer_->GetToken().KeywordType() != lexer::TokenType::KEYW_NEW) {
        ThrowSyntaxError("Unexpected token");
    } else {
        *signature = true;
    }

    return key;
}

void ParserImpl::CreateTSVariableForProperty(ir::AstNode *node, const ir::Expression *key, binder::VariableFlags flags)
{
    binder::Variable *propVar = nullptr;
    bool isMethod = flags & binder::VariableFlags::METHOD;
    util::StringView propName = "__computed";

    switch (key->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            propName = key->AsIdentifier()->Name();
            break;
        }
        case ir::AstNodeType::NUMBER_LITERAL: {
            propName = key->AsNumberLiteral()->Str();
            flags |= binder::VariableFlags::NUMERIC_NAME;
            break;
        }
        case ir::AstNodeType::STRING_LITERAL: {
            propName = key->AsStringLiteral()->Str();
            break;
        }
        default: {
            flags |= binder::VariableFlags::COMPUTED;
            break;
        }
    }

    propVar = isMethod ? binder::Scope::CreateVar<binder::MethodDecl>(Allocator(), propName, flags, node)
                       : binder::Scope::CreateVar<binder::PropertyDecl>(Allocator(), propName, flags, node);

    node->SetVariable(propVar);
}

ir::Expression *ParserImpl::ParseTsTypeLiteralOrInterfaceMember()
{
    bool computed = false;
    bool optional = false;
    bool signature = false;
    bool readonly = false;
    bool isConstructSignature = false;
    bool isIndexSignature = false;
    lexer::SourcePosition memberStartLoc = lexer_->GetToken().Start();
    char32_t nextToken = lexer_->Lookahead();
    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_READONLY && nextToken != LEX_CHAR_LEFT_PAREN &&
        nextToken != LEX_CHAR_COLON && nextToken != LEX_CHAR_COMMA && nextToken != LEX_CHAR_LESS_THAN &&
        nextToken != LEX_CHAR_SEMICOLON) {
        readonly = true;
        lexer_->NextToken();
    }

    ir::Expression *key = ParseTsTypeLiteralOrInterfaceKey(&computed, &signature, &isIndexSignature);

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
        if (isIndexSignature) {
            ThrowSyntaxError("';' expected");
        }

        optional = true;
        lexer_->NextToken();  // eat '?'
    }

    if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_NEW && signature) {
        lexer_->NextToken();  // eat 'new'

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
            lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LESS_THAN) {
            ThrowSyntaxError("'(' expected");
        }

        isConstructSignature = true;
    }

    ir::TSTypeParameterDeclaration *typeParamDecl = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        if (isIndexSignature) {
            ThrowSyntaxError("';' expected");
        }

        typeParamDecl = ParseTsTypeParameterDeclaration();

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
            ThrowSyntaxError("'(' expected");
        }
    }

    ir::Expression *member = nullptr;
    ir::Expression *typeAnnotation = nullptr;
    binder::VariableFlags flags = binder::VariableFlags::NONE;

    if (optional) {
        flags |= binder::VariableFlags::OPTIONAL;
    }

    if (readonly) {
        flags |= binder::VariableFlags::READONLY;
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS && !isIndexSignature) {
        FunctionParameterContext funcParamContext(&context_, Binder());
        auto *funcParamScope = funcParamContext.LexicalScope().GetScope();
        ArenaVector<ir::Expression *> params = ParseFunctionParams(true);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
            lexer_->NextToken();  // eat ':'
            TypeAnnotationParsingOptions options =
                TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE;
            typeAnnotation = ParseTsTypeAnnotation(&options);
        }

        if (signature) {
            auto kind = isConstructSignature
                            ? ir::TSSignatureDeclaration::TSSignatureDeclarationKind::CONSTRUCT_SIGNATURE
                            : ir::TSSignatureDeclaration::TSSignatureDeclarationKind::CALL_SIGNATURE;
            member = AllocNode<ir::TSSignatureDeclaration>(funcParamScope, kind, typeParamDecl, std::move(params),
                                                           typeAnnotation);
            funcParamScope->BindNode(member);
        } else {
            member = AllocNode<ir::TSMethodSignature>(funcParamScope, key, typeParamDecl, std::move(params),
                                                      typeAnnotation, computed, optional);
            funcParamScope->BindNode(member);
            CreateTSVariableForProperty(member, key, flags | binder::VariableFlags::METHOD);
        }
    } else if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options =
            TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::BREAK_AT_NEW_LINE;
        typeAnnotation = ParseTsTypeAnnotation(&options);
    } else if (isIndexSignature) {
        ThrowSyntaxError("An index signature must have a type annotation.", memberStartLoc);
    }

    if (!member && isIndexSignature) {
        member = AllocNode<ir::TSIndexSignature>(key, typeAnnotation, readonly);
    } else if (!member) {
        member = AllocNode<ir::TSPropertySignature>(key, typeAnnotation, computed, optional, readonly);
        CreateTSVariableForProperty(member, key, flags | binder::VariableFlags::PROPERTY);
    } else if (readonly) {
        ThrowSyntaxError(
            "'readonly' modifier can only appear on a property "
            "declaration or index signature.",
            memberStartLoc);
    }

    member->SetRange({memberStartLoc, lexer_->GetToken().End()});

    return member;
}

util::StringView GetTSPropertyName(ir::Expression *key)
{
    switch (key->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            return key->AsIdentifier()->Name();
        }
        case ir::AstNodeType::NUMBER_LITERAL: {
            return key->AsNumberLiteral()->Str();
        }
        case ir::AstNodeType::STRING_LITERAL: {
            return key->AsStringLiteral()->Str();
        }
        default: {
            UNREACHABLE();
        }
    }
}

void ParserImpl::CheckObjectTypeForDuplicatedProperties(ir::Expression *member, ArenaVector<ir::Expression *> const &members)
{
    ir::Expression *key = nullptr;

    if (member->IsTSPropertySignature()) {
        key = member->AsTSPropertySignature()->Key();
    } else if (member->IsTSMethodSignature()) {
        key = member->AsTSMethodSignature()->Key();
    } else {
        return;
    }

    if (!key->IsIdentifier() && !key->IsNumberLiteral() && !key->IsStringLiteral()) {
        return;
    }

    for (auto *it : members) {
        ir::Expression *compare = nullptr;

        switch (it->Type()) {
            case ir::AstNodeType::TS_PROPERTY_SIGNATURE: {
                compare = it->AsTSPropertySignature()->Key();
                break;
            }
            case ir::AstNodeType::TS_METHOD_SIGNATURE: {
                compare = it->AsTSMethodSignature()->Key();
                break;
            }
            default: {
                continue;
            }
        }

        if (!compare->IsIdentifier() && !compare->IsNumberLiteral() && !compare->IsStringLiteral()) {
            continue;
        }

        if (member->IsTSMethodSignature() && it->Type() == ir::AstNodeType::TS_METHOD_SIGNATURE) {
            continue;
        }

        if (GetTSPropertyName(key) == GetTSPropertyName(compare)) {
            ThrowSyntaxError("Duplicated identifier", key->Start());
        }
    }
}

ArenaVector<ir::Expression *> ParserImpl::ParseTsTypeLiteralOrInterface()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_BRACE);

    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat '{'

    ArenaVector<ir::Expression *> members(Allocator()->Adapter());

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ir::Expression *member = ParseTsTypeLiteralOrInterfaceMember();

        CheckObjectTypeForDuplicatedProperties(member, members);

        members.push_back(member);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
            break;
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
            lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SEMI_COLON) {
            if (!lexer_->GetToken().NewLine()) {
                ThrowSyntaxError("',' expected");
            }

            if (lexer_->GetToken().IsKeyword()) {
                lexer_->GetToken().SetTokenType(lexer::TokenType::LITERAL_IDENT);
            }

            continue;
        }

        lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
    }

    return members;
}

ir::TSArrayType *ParserImpl::ParseTsArrayType(ir::Expression *elementType)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET);
    lexer_->NextToken();  // eat '['

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
        ThrowSyntaxError("']' expected");
    }

    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    lexer_->NextToken();  // eat ']'

    lexer::SourcePosition startLoc = elementType->Start();
    auto *arrayType = AllocNode<ir::TSArrayType>(elementType);
    arrayType->SetRange({startLoc, endLoc});

    return arrayType;
}

ir::TSUnionType *ParserImpl::ParseTsUnionType(ir::Expression *type, bool restrictExtends)
{
    ArenaVector<ir::Expression *> types(Allocator()->Adapter());
    lexer::SourcePosition startLoc;

    TypeAnnotationParsingOptions options =
        TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::IN_UNION;

    if (restrictExtends) {
        options |= TypeAnnotationParsingOptions::RESTRICT_EXTENDS;
    }

    if (type) {
        startLoc = type->Start();
        types.push_back(type);
    } else {
        startLoc = lexer_->GetToken().Start();
    }

    while (true) {
        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_BITWISE_OR) {
            break;
        }

        lexer_->NextToken();  // eat '|'

        types.push_back(ParseTsTypeAnnotation(&options));
    }

    lexer::SourcePosition endLoc = types.back()->End();

    auto *unionType = AllocNode<ir::TSUnionType>(std::move(types));
    auto *typeVar = binder::Scope::CreateVar(Allocator(), "__type", binder::VariableFlags::TYPE, unionType);
    unionType->SetVariable(typeVar);
    unionType->SetRange({startLoc, endLoc});

    return unionType;
}

ir::TSIntersectionType *ParserImpl::ParseTsIntersectionType(ir::Expression *type, bool inUnion, bool restrictExtends)
{
    ArenaVector<ir::Expression *> types(Allocator()->Adapter());
    lexer::SourcePosition startLoc;

    TypeAnnotationParsingOptions options =
        TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::IN_INTERSECTION;

    if (restrictExtends) {
        options |= TypeAnnotationParsingOptions::RESTRICT_EXTENDS;
    }

    if (inUnion) {
        options |= TypeAnnotationParsingOptions::IN_UNION;
    }

    if (type) {
        startLoc = type->Start();
        types.push_back(type);
    } else {
        startLoc = lexer_->GetToken().Start();
    }

    while (true) {
        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_BITWISE_AND) {
            break;
        }

        lexer_->NextToken();  // eat '&'

        types.push_back(ParseTsTypeAnnotation(&options));
    }

    lexer::SourcePosition endLoc = types.back()->End();

    auto *intersectionType = AllocNode<ir::TSIntersectionType>(std::move(types));
    auto *typeVar = binder::Scope::CreateVar(Allocator(), "__type", binder::VariableFlags::TYPE, intersectionType);
    intersectionType->SetVariable(typeVar);
    intersectionType->SetRange({startLoc, endLoc});

    return intersectionType;
}

ir::Expression *ParserImpl::ParseTsParenthesizedOrFunctionType(ir::Expression *typeAnnotation, bool throwError)
{
    if (typeAnnotation) {
        return nullptr;
    }

    lexer::SourcePosition typeStart = lexer_->GetToken().Start();

    bool abstractConstructor = lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ABSTRACT;
    if (abstractConstructor) {
        lexer_->NextToken();  // eat 'abstract'
    }

    bool isConstructionType = false;

    if (lexer_->GetToken().Type() == lexer::TokenType::KEYW_NEW) {
        lexer_->NextToken();  // eat 'new'
        isConstructionType = true;

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS &&
            lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LESS_THAN) {
            ThrowSyntaxError("'(' expected");
        }
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN || isConstructionType) {
        return ParseTsFunctionType(typeStart, isConstructionType, throwError, abstractConstructor);
    }

    const auto startPos = lexer_->Save();
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS);
    lexer_->NextToken();  // eat '('

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::NO_OPTS;
    ir::Expression *type = ParseTsTypeAnnotation(&options);

    if (!type) {
        lexer_->Rewind(startPos);
        return ParseTsFunctionType(typeStart, false, throwError);
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK ||
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->Rewind(startPos);
        return ParseTsFunctionType(typeStart, false, throwError);
    }

    if (throwError && lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ThrowSyntaxError("')' expected");
    }

    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    lexer_->NextToken();  // eat ')'

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_ARROW) {
        lexer_->Rewind(startPos);

        return ParseTsFunctionType(typeStart, false, throwError);
    }

    auto *result = AllocNode<ir::TSParenthesizedType>(type);
    result->SetRange({typeStart, endLoc});

    return result;
}

ir::Expression *ParserImpl::ParseTsFunctionType(lexer::SourcePosition startLoc, bool isConstructionType,
                                                bool throwError, bool abstractConstructor)
{
    ir::TSTypeParameterDeclaration *typeParamDecl = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        typeParamDecl = ParseTsTypeParameterDeclaration(throwError);

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
            if (!throwError) {
                return nullptr;
            }

            ThrowSyntaxError("'(' expected");
        }
    }

    FunctionParameterContext funcParamContext(&context_, Binder());
    auto *funcParamScope = funcParamContext.LexicalScope().GetScope();
    ArenaVector<ir::Expression *> params = ParseFunctionParams(true);

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_ARROW) {
        ThrowSyntaxError("'=>' expected");
    }

    lexer_->NextToken();  // eat '=>'

    TypeAnnotationParsingOptions options =
        TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE;
    ir::Expression *returnTypeAnnotation = ParseTsTypeAnnotation(&options);

    ir::Expression *funcType = nullptr;

    if (isConstructionType) {
        funcType = AllocNode<ir::TSConstructorType>(funcParamScope, std::move(params), typeParamDecl,
                                                    returnTypeAnnotation, abstractConstructor);
    } else {
        funcType =
            AllocNode<ir::TSFunctionType>(funcParamScope, std::move(params), typeParamDecl, returnTypeAnnotation);
    }

    funcType->SetRange({startLoc, returnTypeAnnotation->End()});
    funcParamScope->BindNode(funcType);

    return funcType;
}

ir::Expression *ParserImpl::ParseTsBasicType()
{
    ir::Expression *typeAnnotation = nullptr;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_MINUS) {
        lexer_->NextToken();

        if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_NUMBER) {
            ThrowSyntaxError("Type expected");
        }
    }
    if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_NUMBER) {
        if (lexer_->GetToken().Flags() & lexer::TokenFlags::NUMBER_BIGINT) {
            auto *bigintNode = AllocNode<ir::BigIntLiteral>(lexer_->GetToken().BigInt());
            bigintNode->SetRange(lexer_->GetToken().Loc());

            typeAnnotation = AllocNode<ir::TSLiteralType>(bigintNode);
        } else {
            auto *numberNode = AllocNode<ir::NumberLiteral>(lexer_->GetToken().Number(), lexer_->GetToken().String());
            numberNode->SetRange(lexer_->GetToken().Loc());

            typeAnnotation = AllocNode<ir::TSLiteralType>(numberNode);
        }
    } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_STRING) {
        auto *stringNode = AllocNode<ir::StringLiteral>(lexer_->GetToken().String());
        stringNode->SetRange(lexer_->GetToken().Loc());

        typeAnnotation = AllocNode<ir::TSLiteralType>(stringNode);
    } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_TRUE) {
        auto *booleanLiteral = AllocNode<ir::BooleanLiteral>(true);
        booleanLiteral->SetRange(lexer_->GetToken().Loc());

        typeAnnotation = AllocNode<ir::TSLiteralType>(booleanLiteral);
    } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_FALSE) {
        auto *booleanLiteral = AllocNode<ir::BooleanLiteral>(false);
        booleanLiteral->SetRange(lexer_->GetToken().Loc());

        typeAnnotation = AllocNode<ir::TSLiteralType>(booleanLiteral);
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ANY) {
        typeAnnotation = AllocNode<ir::TSAnyKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_BOOLEAN) {
        typeAnnotation = AllocNode<ir::TSBooleanKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_NUMBER) {
        typeAnnotation = AllocNode<ir::TSNumberKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_STRING) {
        typeAnnotation = AllocNode<ir::TSStringKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_UNKNOWN) {
        typeAnnotation = AllocNode<ir::TSUnknownKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_VOID) {
        typeAnnotation = AllocNode<ir::TSVoidKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::LITERAL_NULL) {
        typeAnnotation = AllocNode<ir::TSNullKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_UNDEFINED) {
        typeAnnotation = AllocNode<ir::TSUndefinedKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_NEVER) {
        typeAnnotation = AllocNode<ir::TSNeverKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_OBJECT) {
        typeAnnotation = AllocNode<ir::TSObjectKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_BIGINT) {
        typeAnnotation = AllocNode<ir::TSBigintKeyword>();
    } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_SYMBOL) {
        typeAnnotation = AllocNode<ir::TSSymbolKeyword>();
    } else {
        ThrowSyntaxError("Unexpected type");
    }

    typeAnnotation->SetRange(lexer_->GetToken().Loc());

    lexer_->NextToken();
    return typeAnnotation;
}

static ir::ModifierFlags GetAccessability(ir::ModifierFlags modifiers)
{
    if (modifiers & ir::ModifierFlags::PUBLIC) {
        return ir::ModifierFlags::PUBLIC;
    }

    if (modifiers & ir::ModifierFlags::PRIVATE) {
        return ir::ModifierFlags::PRIVATE;
    }

    if (modifiers & ir::ModifierFlags::PROTECTED) {
        return ir::ModifierFlags::PROTECTED;
    }

    return ir::ModifierFlags::NONE;
}

static bool IsModifierKind(const lexer::Token &token)
{
    if (token.Type() == lexer::TokenType::LITERAL_IDENT) {
        switch (token.KeywordType()) {
            case lexer::TokenType::KEYW_PUBLIC:
            case lexer::TokenType::KEYW_PRIVATE:
            case lexer::TokenType::KEYW_PROTECTED:
            case lexer::TokenType::KEYW_STATIC:
            case lexer::TokenType::KEYW_ASYNC:
            case lexer::TokenType::KEYW_ABSTRACT:
            case lexer::TokenType::KEYW_DECLARE:
            case lexer::TokenType::KEYW_READONLY:
                return true;
            default:
                return false;
        }
    }

    return false;
}

ir::ModifierFlags ParserImpl::ParseModifiers()
{
    ir::ModifierFlags resultStatus = ir::ModifierFlags::NONE;
    ir::ModifierFlags prevStatus = ir::ModifierFlags::ALL;

    while (IsModifierKind(lexer_->GetToken())) {
        char32_t nextCp = lexer_->Lookahead();
        if (!((Extension() == ScriptExtension::JS && nextCp != LEX_CHAR_LEFT_PAREN) ||
              (Extension() == ScriptExtension::TS && nextCp != LEX_CHAR_EQUALS && nextCp != LEX_CHAR_SEMICOLON &&
               nextCp != LEX_CHAR_COMMA && nextCp != LEX_CHAR_LEFT_PAREN))) {
            break;
        }

        lexer::TokenFlags tokenFlags = lexer_->GetToken().Flags();
        if (tokenFlags & lexer::TokenFlags::HAS_ESCAPE) {
            ThrowSyntaxError("Keyword must not contain escaped characters");
        }

        ir::ModifierFlags actualStatus = ir::ModifierFlags::NONE;
        ir::ModifierFlags nextStatus = ir::ModifierFlags::NONE;

        switch (lexer_->GetToken().KeywordType()) {
            case lexer::TokenType::KEYW_PUBLIC: {
                actualStatus = ir::ModifierFlags::PUBLIC;
                nextStatus = ir::ModifierFlags::ASYNC | ir::ModifierFlags::STATIC | ir::ModifierFlags::READONLY |
                             ir::ModifierFlags::DECLARE | ir::ModifierFlags::ABSTRACT;
                break;
            }
            case lexer::TokenType::KEYW_PRIVATE: {
                actualStatus = ir::ModifierFlags::PRIVATE;
                nextStatus = ir::ModifierFlags::ASYNC | ir::ModifierFlags::STATIC | ir::ModifierFlags::READONLY |
                             ir::ModifierFlags::DECLARE | ir::ModifierFlags::ABSTRACT;
                break;
            }
            case lexer::TokenType::KEYW_PROTECTED: {
                actualStatus = ir::ModifierFlags::PROTECTED;
                nextStatus = ir::ModifierFlags::ASYNC | ir::ModifierFlags::STATIC | ir::ModifierFlags::READONLY |
                             ir::ModifierFlags::DECLARE | ir::ModifierFlags::ABSTRACT;
                break;
            }
            case lexer::TokenType::KEYW_STATIC: {
                actualStatus = ir::ModifierFlags::STATIC;
                nextStatus = ir::ModifierFlags::ASYNC | ir::ModifierFlags::READONLY | ir::ModifierFlags::DECLARE |
                             ir::ModifierFlags::ABSTRACT;
                break;
            }
            case lexer::TokenType::KEYW_ASYNC: {
                actualStatus = ir::ModifierFlags::ASYNC;
                nextStatus = ir::ModifierFlags::READONLY | ir::ModifierFlags::DECLARE | ir::ModifierFlags::ABSTRACT;
                break;
            }
            case lexer::TokenType::KEYW_ABSTRACT: {
                actualStatus = ir::ModifierFlags::ABSTRACT;
                nextStatus = ir::ModifierFlags::ACCESS | ir::ModifierFlags::ASYNC | ir::ModifierFlags::STATIC |
                             ir::ModifierFlags::READONLY | ir::ModifierFlags::DECLARE;
                break;
            }
            case lexer::TokenType::KEYW_DECLARE: {
                actualStatus = ir::ModifierFlags::DECLARE;
                nextStatus = ir::ModifierFlags::ACCESS | ir::ModifierFlags::ASYNC | ir::ModifierFlags::STATIC |
                             ir::ModifierFlags::READONLY;
                break;
            }
            case lexer::TokenType::KEYW_READONLY: {
                actualStatus = ir::ModifierFlags::READONLY;
                nextStatus = ir::ModifierFlags::ASYNC | ir::ModifierFlags::DECLARE | ir::ModifierFlags::ABSTRACT;
                break;
            }
            default: {
                UNREACHABLE();
            }
        }

        if (lexer_->Lookahead() == LEX_CHAR_COLON || lexer_->Lookahead() == LEX_CHAR_COMMA ||
            lexer_->Lookahead() == LEX_CHAR_RIGHT_PAREN || lexer_->Lookahead() == LEX_CHAR_QUESTION ||
            lexer_->Lookahead() == LEX_CHAR_RIGHT_BRACE || lexer_->Lookahead() == LEX_CHAR_LESS_THAN) {
            break;
        }

        auto pos = lexer_->Save();
        lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

        if ((prevStatus & actualStatus) == 0) {
            lexer_->Rewind(pos);
            ThrowSyntaxError("Unexpected modifier");
        }

        if ((resultStatus & actualStatus) != 0) {
            lexer_->Rewind(pos);
            ThrowSyntaxError("Duplicated modifier is not allowed");
        }

        if ((context_.Status() & ParserStatus::CONSTRUCTOR_FUNCTION) &&
            (actualStatus & ~ir::ModifierFlags::ALLOWED_IN_CTOR_PARAMETER)) {
            lexer_->Rewind(pos);
            ThrowParameterModifierError(actualStatus);
        }

        resultStatus |= actualStatus;
        prevStatus = nextStatus;
    }

    return resultStatus;
}

void ParserImpl::CheckAccessorPair(const ArenaVector<ir::Statement *> &properties, const ir::Expression *propName,
                                   ir::MethodDefinitionKind methodKind, ir::ModifierFlags access, bool hasDecorator,
                                   lexer::SourcePosition errorInfo)
{
    for (const auto &it : properties) {
        if (!it->IsMethodDefinition() || (!hasDecorator && it->AsMethodDefinition()->Kind() != methodKind)) {
            continue;
        }

        const ir::Expression *key = it->AsMethodDefinition()->Key();

        if (key->Type() != propName->Type()) {
            continue;
        }

        bool keyIsSame = false;

        if (key->IsIdentifier()) {
            const util::StringView &strName = propName->AsIdentifier()->Name();
            const util::StringView &compareName = (key->AsIdentifier()->Name());

            keyIsSame = strName == compareName;
        } else if (key->IsNumberLiteral()) {
            keyIsSame = *key->AsNumberLiteral() == *propName->AsNumberLiteral();
        } else if (key->IsStringLiteral()) {
            keyIsSame = *key->AsStringLiteral() == *propName->AsStringLiteral();
        }

        if (!keyIsSame) {
            continue;
        }

        if (hasDecorator &&
            (it->AsMethodDefinition()->Kind() == ir::MethodDefinitionKind::GET ||
             it->AsMethodDefinition()->Kind() == ir::MethodDefinitionKind::SET) &&
            !it->AsMethodDefinition()->Decorators().empty()) {
            ThrowSyntaxError("Decorators cannot be applied to multiple get/set accessors of the same name.", errorInfo);
        }

        if (it->AsMethodDefinition()->Kind() != methodKind) {
            continue;
        }

        ir::ModifierFlags getAccess = ir::ModifierFlags::NONE;
        ir::ModifierFlags setAccess = ir::ModifierFlags::NONE;

        if (methodKind == ir::MethodDefinitionKind::GET) {
            setAccess = access;
            getAccess = GetAccessability(it->AsMethodDefinition()->Modifiers());
        } else {
            getAccess = access;
            setAccess = GetAccessability(it->AsMethodDefinition()->Modifiers());
        }

        if ((setAccess == ir::ModifierFlags::NONE && getAccess > ir::ModifierFlags::PUBLIC) ||
            (setAccess != ir::ModifierFlags::NONE && getAccess > setAccess)) {
            ThrowSyntaxError("A get accessor must be at least as accessible as the setter", key->Start());
        }
    }
}

void ParserImpl::ParseClassKeyModifiers(ClassElmentDescriptor *desc)
{
    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        return;
    }

    char32_t nextCp = lexer_->Lookahead();

    if ((Extension() == ScriptExtension::JS && nextCp != LEX_CHAR_LEFT_PAREN) ||
        (Extension() == ScriptExtension::TS && nextCp != LEX_CHAR_EQUALS && nextCp != LEX_CHAR_SEMICOLON &&
         nextCp != LEX_CHAR_LEFT_PAREN)) {
        if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_GET) {
            if (desc->isPrivateIdent) {
                ThrowSyntaxError("Private identifier can not be getter");
            }

            if (lexer_->GetToken().Flags() & lexer::TokenFlags::HAS_ESCAPE) {
                ThrowSyntaxError("Keyword must not contain escaped characters");
            }

            desc->methodKind = ir::MethodDefinitionKind::GET;
            desc->methodStart = lexer_->GetToken().Start();

            lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
        } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_SET) {
            if (desc->isPrivateIdent) {
                ThrowSyntaxError("Private identifier can not be setter");
            }

            if (lexer_->GetToken().Flags() & lexer::TokenFlags::HAS_ESCAPE) {
                ThrowSyntaxError("Keyword must not contain escaped characters");
            }

            desc->methodKind = ir::MethodDefinitionKind::SET;
            desc->methodStart = lexer_->GetToken().Start();

            lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
        }
    }
}

void ParserImpl::ThrowIfPrivateIdent(ClassElmentDescriptor *desc, const char *msg)
{
    if (desc->isPrivateIdent) {
        ThrowSyntaxError(msg);
    }
}

void ParserImpl::ValidateClassKey(ClassElmentDescriptor *desc, bool isDeclare)
{
    if ((desc->modifiers & ir::ModifierFlags::ASYNC) &&
        (desc->methodKind == ir::MethodDefinitionKind::GET || desc->methodKind == ir::MethodDefinitionKind::SET)) {
        ThrowSyntaxError("Async method can not be getter nor setter");
    }

    const util::StringView &propNameStr = lexer_->GetToken().Ident();

    if (propNameStr.Is("constructor")) {
        ThrowIfPrivateIdent(desc, "Private identifier can not be constructor");

        if (!(desc->modifiers & ir::ModifierFlags::STATIC)) {
            if ((desc->modifiers & ir::ModifierFlags::ASYNC) || desc->methodKind == ir::MethodDefinitionKind::GET ||
                desc->methodKind == ir::MethodDefinitionKind::SET || desc->isGenerator) {
                ThrowSyntaxError("Constructor can not be special method");
            }

            desc->methodKind = ir::MethodDefinitionKind::CONSTRUCTOR;
            desc->methodStart = lexer_->GetToken().Start();
            desc->newStatus |= ParserStatus::CONSTRUCTOR_FUNCTION;

            if (desc->hasSuperClass) {
                desc->newStatus |= ParserStatus::ALLOW_SUPER_CALL;
            }
        } else if (Extension() == ScriptExtension::TS) {
            ThrowSyntaxError("Static modifier can not appear on a constructor");
        }
    } else if (!isDeclare && propNameStr.Is("prototype") && (desc->modifiers & ir::ModifierFlags::STATIC)) {
        ThrowSyntaxError("Classes may not have static property named prototype");
    }
}

ir::Expression *ParserImpl::ParseClassKey(ClassElmentDescriptor *desc, bool isDeclare)
{
    ir::Expression *propName = nullptr;
    if (lexer_->GetToken().IsKeyword()) {
        lexer_->GetToken().SetTokenType(lexer::TokenType::LITERAL_IDENT);
    }

    switch (lexer_->GetToken().Type()) {
        case lexer::TokenType::LITERAL_IDENT: {
            ValidateClassKey(desc, isDeclare);

            propName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            propName->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::LITERAL_STRING: {
            ThrowIfPrivateIdent(desc, "Private identifier name can not be string");

            propName = AllocNode<ir::StringLiteral>(lexer_->GetToken().String());
            propName->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::LITERAL_NUMBER: {
            ThrowIfPrivateIdent(desc, "Private identifier name can not be number");

            if (lexer_->GetToken().Flags() & lexer::TokenFlags::NUMBER_BIGINT) {
                propName = AllocNode<ir::BigIntLiteral>(lexer_->GetToken().BigInt());
            } else {
                propName = AllocNode<ir::NumberLiteral>(lexer_->GetToken().Number(), lexer_->GetToken().String());
            }

            propName->SetRange(lexer_->GetToken().Loc());
            break;
        }
        case lexer::TokenType::PUNCTUATOR_LEFT_SQUARE_BRACKET: {
            ThrowIfPrivateIdent(desc, "Unexpected character in private identifier");

            lexer_->NextToken();  // eat left square bracket

            if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT &&
                lexer_->Lookahead() == LEX_CHAR_COLON) {
                desc->isIndexSignature = true;

                propName = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
                propName->SetRange(lexer_->GetToken().Loc());

                lexer_->NextToken();  // eat param

                if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COLON) {
                    ThrowSyntaxError("':' expected");
                }

                lexer_->NextToken();  // eat ':'
                TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
                ir::Expression *typeAnnotation = ParseTsTypeAnnotation(&options);

                if (!typeAnnotation->IsTSNumberKeyword() && !typeAnnotation->IsTSStringKeyword()) {
                    ThrowSyntaxError(
                        "An index signature parameter type must be either "
                        "'string' or 'number'");
                }

                propName->SetTsTypeAnnotation(typeAnnotation);

                if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
                    ThrowSyntaxError("']' expected");
                }

                lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

                return propName;
            }

            desc->isComputed = true;

            propName = ParseExpression(ExpressionParseFlags::ACCEPT_COMMA);

            if (Extension() == ScriptExtension::TS) {
                desc->invalidComputedProperty =
                    !propName->IsNumberLiteral() && !propName->IsStringLiteral() &&
                    !(propName->IsMemberExpression() && propName->AsMemberExpression()->Object()->IsIdentifier() &&
                      propName->AsMemberExpression()->Object()->AsIdentifier()->Name().Is("Symbol")) &&
                    !propName->IsIdentifier();
            }

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_SQUARE_BRACKET) {
                ThrowSyntaxError("Unexpected token, expected ']'");
            }
            break;
        }
        default: {
            ThrowSyntaxError("Unexpected token in class property");
        }
    }

    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

    return propName;
}

void ParserImpl::ValidateClassMethodStart(ClassElmentDescriptor *desc, ir::Expression *typeAnnotation)
{
    if (Extension() == ScriptExtension::JS) {
        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
            return;
        }
        desc->classMethod = true;
    }

    if (Extension() == ScriptExtension::TS &&
        lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS && desc->isPrivateIdent) {
        ThrowSyntaxError("A method cannot be named with a private identifier");
    }

    if (Extension() == ScriptExtension::TS) {
        if (!typeAnnotation && (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS ||
                                lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN)) {
            if ((desc->modifiers & (ir::ModifierFlags::DECLARE | ir::ModifierFlags::READONLY))) {
                ThrowSyntaxError("Class method can not be declare nor readonly");
            }
            desc->classMethod = true;
        } else {
            if ((desc->modifiers & ir::ModifierFlags::ASYNC) || desc->isGenerator) {
                ThrowSyntaxError("Expected '('");
            }
            desc->classField = true;

            if (desc->invalidComputedProperty) {
                ThrowSyntaxError(
                    "Computed property name must refer to a symbol or "
                    "literal expression whos value is "
                    "number or string");
            }
        }
    }

    if (desc->modifiers & ir::ModifierFlags::ASYNC) {
        desc->newStatus |= ParserStatus::ASYNC_FUNCTION;
    }

    if (desc->isGenerator) {
        desc->newStatus |= ParserStatus::GENERATOR_FUNCTION;
    }
}

void ParserImpl::ValidateClassSetter(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                                     ir::Expression *propName, ir::ScriptFunction *func, bool hasDecorator,
                                     lexer::SourcePosition errorInfo)
{
    if (func->Params().size() != 1) {
        ThrowSyntaxError("Setter must have exactly one formal parameter");
    }

    if (Extension() == ScriptExtension::TS && !(desc->modifiers & ir::ModifierFlags::STATIC)) {
        ir::ModifierFlags access = GetAccessability(desc->modifiers);
        CheckAccessorPair(properties, propName, ir::MethodDefinitionKind::GET, access, hasDecorator, errorInfo);
    }
}

void ParserImpl::ValidateClassGetter(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                                     ir::Expression *propName, ir::ScriptFunction *func, bool hasDecorator,
                                     lexer::SourcePosition errorInfo)
{
    if (!func->Params().empty()) {
        ThrowSyntaxError("Getter must not have formal parameters");
    }

    if (Extension() == ScriptExtension::TS && !(desc->modifiers & ir::ModifierFlags::STATIC)) {
        ir::ModifierFlags access = GetAccessability(desc->modifiers);

        CheckAccessorPair(properties, propName, ir::MethodDefinitionKind::SET, access, hasDecorator, errorInfo);
    }
}

ir::MethodDefinition *ParserImpl::ParseClassMethod(ClassElmentDescriptor *desc,
                                                   const ArenaVector<ir::Statement *> &properties,
                                                   ir::Expression *propName, lexer::SourcePosition *propEnd,
                                                   ArenaVector<ir::Decorator *> &&decorators, bool isDeclare)
{
    if (Extension() == ScriptExtension::TS) {
        if (desc->methodKind == ir::MethodDefinitionKind::SET || desc->methodKind == ir::MethodDefinitionKind::GET) {
            desc->newStatus |= ParserStatus::ACCESSOR_FUNCTION;
        }

        desc->newStatus |= ParserStatus::IN_METHOD_DEFINITION;
    }

    if (isDeclare && (desc->newStatus & ParserStatus::ASYNC_FUNCTION)) {
        ThrowSyntaxError("'async' modifier cannot be used in an ambient context.");
    }

    if (isDeclare && desc->isGenerator) {
        ThrowSyntaxError("Generators are not allowed in an ambient context.");
    }

    ir::ScriptFunction *func = ParseFunction(desc->newStatus, isDeclare);
    if (func->Body() != nullptr) {
        lexer_->NextToken();
    }

    if (func->IsOverload() && !decorators.empty()) {
        ThrowSyntaxError("A decorator can only decorate a method implementation, not an overload.",
                         decorators.front()->Start());
    }

    auto *funcExpr = AllocNode<ir::FunctionExpression>(func);
    funcExpr->SetRange(func->Range());

    lexer::SourcePosition errorInfo = decorators.empty() ? func->Start() : decorators[0]->Start();

    if (desc->methodKind == ir::MethodDefinitionKind::SET) {
        ValidateClassSetter(desc, properties, propName, func, !decorators.empty(), errorInfo);
    } else if (desc->methodKind == ir::MethodDefinitionKind::GET) {
        ValidateClassGetter(desc, properties, propName, func, !decorators.empty(), errorInfo);
    }

    *propEnd = func->End();
    func->AddFlag(ir::ScriptFunctionFlags::METHOD);
    auto *method = AllocNode<ir::MethodDefinition>(desc->methodKind, propName, funcExpr, desc->modifiers, Allocator(),
                                                   std::move(decorators), desc->isComputed);
    method->SetRange(funcExpr->Range());
    return method;
}

ir::Statement *ParserImpl::ParseClassProperty(ClassElmentDescriptor *desc,
                                              const ArenaVector<ir::Statement *> &properties, ir::Expression *propName,
                                              ir::Expression *typeAnnotation, ArenaVector<ir::Decorator *> &&decorators,
                                              bool isDeclare)
{
    lexer::SourcePosition propEnd = propName->End();
    ir::Statement *property = nullptr;

    if (desc->classMethod) {
        property = ParseClassMethod(desc, properties, propName, &propEnd, std::move(decorators), isDeclare);
        property->SetRange({desc->propStart, propEnd});
        return property;
    }

    ir::Expression *value = nullptr;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        lexer_->NextToken();  // eat equals

        if (isDeclare) {
            ThrowSyntaxError("Initializers are not allowed in ambient contexts.");
        }
        value = ParseExpression();
        propEnd = value->End();
    }

    ir::Expression *privateId = nullptr;

    if (Extension() == ScriptExtension::JS) {
        if (desc->isPrivateIdent) {
            ThrowSyntaxError("Private js fields are not supported");
        }
    } else {
        if (desc->isPrivateIdent) {
            privateId = AllocNode<ir::TSPrivateIdentifier>(propName, value, typeAnnotation);
            privateId->SetRange({desc->propStart, propName->End()});
        }
    }

    property = AllocNode<ir::ClassProperty>(desc->isPrivateIdent ? privateId : propName, value, typeAnnotation,
                                            desc->modifiers, std::move(decorators), desc->isComputed,
                                            desc->modifiers & ir::ModifierFlags::DEFINITE);

    property->SetRange({desc->propStart, propEnd});
    return property;
}

void ParserImpl::CheckClassGeneratorMethod(ClassElmentDescriptor *desc)
{
    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_MULTIPLY) {
        return;
    }

    ThrowIfPrivateIdent(desc, "Unexpected character in private identifier");

    desc->isGenerator = true;
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
}

void ParserImpl::CheckClassPrivateIdentifier(ClassElmentDescriptor *desc)
{
    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_HASH_MARK) {
        return;
    }

    if (Extension() == ScriptExtension::JS) {
        ThrowSyntaxError("JS private class fields are not supported.");
    }

    if (Extension() == ScriptExtension::AS) {
        return;
    }

    if (desc->modifiers != ir::ModifierFlags::NONE) {
        ThrowSyntaxError("Unexpected modifier on private identifier");
    }

    desc->isPrivateIdent = true;
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
}

ir::Expression *ParserImpl::ParseClassKeyAnnotation()
{
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options =
            TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::BREAK_AT_NEW_LINE;
        return ParseTsTypeAnnotation(&options);
    }

    return nullptr;
}

ir::Decorator *ParserImpl::ParseDecorator()
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_AT);

    lexer::SourcePosition start = lexer_->GetToken().Start();
    lexer_->NextToken();  // eat '@'

    ir::Expression *expr = ParseLeftHandSideExpression();
    auto *result = AllocNode<ir::Decorator>(expr);
    result->SetRange({start, expr->End()});

    return result;
}

ArenaVector<ir::Decorator *> ParserImpl::ParseDecorators()
{
    ArenaVector<ir::Decorator *> decorators(Allocator()->Adapter());
    auto savedStatus = context_.Status();
    context_.Status() |= ParserStatus::IN_DECORATOR;

    while (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_AT) {
        decorators.push_back(ParseDecorator());
    }

    if (!decorators.empty() && lexer_->GetToken().Type() != lexer::TokenType::KEYW_CLASS &&
        (context_.Status() & ParserStatus::IN_CLASS_BODY) == 0 &&
        lexer_->GetToken().Type() != lexer::TokenType::KEYW_EXPORT &&
        !(lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT &&
          lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_DECLARE)) {
        ThrowSyntaxError("Decorators are not valid here.", decorators.front()->Start());
    }

    context_.Status() = savedStatus;
    return decorators;
}

ir::Statement *ParserImpl::ParseClassElement(const ArenaVector<ir::Statement *> &properties,
                                             ArenaVector<ir::TSIndexSignature *> *indexSignatures, bool hasSuperClass,
                                             bool isDeclare, bool isAbstractClass)
{
    ClassElmentDescriptor desc;

    desc.methodKind = ir::MethodDefinitionKind::METHOD;
    desc.newStatus = ParserStatus::ALLOW_SUPER;
    desc.hasSuperClass = hasSuperClass;
    desc.propStart = lexer_->GetToken().Start();

    auto decorators = ParseDecorators();

    desc.modifiers = ParseModifiers();

    if ((desc.modifiers & ir::ModifierFlags::ABSTRACT) && !isAbstractClass) {
        ThrowSyntaxError("Abstract methods can only appear within an abstract class.");
    }

    CheckClassPrivateIdentifier(&desc);
    CheckClassGeneratorMethod(&desc);
    ParseClassKeyModifiers(&desc);

    if (!(desc.modifiers & ir::ModifierFlags::STATIC)) {
        context_.Status() |= ParserStatus::ALLOW_THIS_TYPE;
    }

    ir::Expression *propName = ParseClassKey(&desc, isDeclare);

    if (desc.methodKind == ir::MethodDefinitionKind::CONSTRUCTOR && !decorators.empty()) {
        ThrowSyntaxError("Decorators are not valid here.", decorators.front()->Start());
    }

    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_QUESTION_MARK) {
        if (desc.isIndexSignature) {
            ThrowSyntaxError("';' expected");
        }

        if (desc.methodKind == ir::MethodDefinitionKind::CONSTRUCTOR) {
            ThrowSyntaxError("'(' expected");
        }

        desc.modifiers |= ir::ModifierFlags::OPTIONAL;
        lexer_->NextToken();
    } else if (Extension() == ScriptExtension::TS &&
               lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_EXCLAMATION_MARK) {
        if (desc.isIndexSignature || lexer_->Lookahead() != LEX_CHAR_COLON) {
            ThrowSyntaxError("';' expected");
        }

        desc.modifiers |= ir::ModifierFlags::DEFINITE;
        lexer_->NextToken();
    }

    ir::Expression *typeAnnotation = ParseClassKeyAnnotation();

    ir::Statement *property = nullptr;
    if (desc.isIndexSignature) {
        if (!decorators.empty()) {
            ThrowSyntaxError("Decorators are not valid here.", decorators.front()->Start());
        }

        if (!typeAnnotation) {
            ThrowSyntaxError("An index signature must have a type annotation");
        }

        auto *indexSignature =
            AllocNode<ir::TSIndexSignature>(propName, typeAnnotation, desc.modifiers & ir::ModifierFlags::READONLY);

        indexSignature->SetRange({indexSignature->Param()->Start(), indexSignature->TypeAnnotation()->End()});

        indexSignatures->push_back(indexSignature);

        property = AllocNode<ir::EmptyStatement>();
    } else {
        ValidateClassMethodStart(&desc, typeAnnotation);
        property = ParseClassProperty(&desc, properties, propName, typeAnnotation, std::move(decorators),
                                      isDeclare || (desc.modifiers & ir::ModifierFlags::DECLARE));
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_SEMI_COLON &&
        lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE &&
        !(lexer_->GetToken().Flags() & lexer::TokenFlags::NEW_LINE) &&
        !(property->IsMethodDefinition() && property->AsMethodDefinition()->Value()->Function()->Body())) {
        ThrowSyntaxError("';' expected.");
    }

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SEMI_COLON) {
        lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);
    }

    context_.Status() &= ~ParserStatus::ALLOW_THIS_TYPE;

    return property;
}

static bool IsConstructor(ir::Statement *stmt)
{
    if (!stmt->IsMethodDefinition()) {
        return false;
    }

    ir::MethodDefinition *def = stmt->AsMethodDefinition();
    return def->Kind() == ir::MethodDefinitionKind::CONSTRUCTOR;
}

ir::MethodDefinition *ParserImpl::CreateImplicitConstructor(bool hasSuperClass, bool isDeclare)
{
    ArenaVector<ir::Expression *> params(Allocator()->Adapter());
    ArenaVector<ir::Statement *> statements(Allocator()->Adapter());

    auto *paramScope = Binder()->Allocator()->New<binder::FunctionParamScope>(Allocator(), Binder()->GetScope());
    auto *scope = Binder()->Allocator()->New<binder::FunctionScope>(Allocator(), paramScope);

    if (hasSuperClass) {
        util::StringView argsStr = "args";
        params.push_back(AllocNode<ir::SpreadElement>(ir::AstNodeType::REST_ELEMENT,
                                                      AllocNode<ir::Identifier>(argsStr, Allocator())));
        paramScope->AddParamDecl(Allocator(), params.back());

        ArenaVector<ir::Expression *> callArgs(Allocator()->Adapter());
        auto *superExpr = AllocNode<ir::SuperExpression>();
        callArgs.push_back(AllocNode<ir::SpreadElement>(ir::AstNodeType::SPREAD_ELEMENT,
                                                        AllocNode<ir::Identifier>(argsStr, Allocator())));

        auto *callExpr = AllocNode<ir::CallExpression>(superExpr, std::move(callArgs), nullptr, false);
        statements.push_back(AllocNode<ir::ExpressionStatement>(callExpr));
    }

    auto *body = AllocNode<ir::BlockStatement>(scope, std::move(statements));
    auto *func = AllocNode<ir::ScriptFunction>(scope, std::move(params), nullptr, isDeclare ? nullptr : body, nullptr,
                                               ir::ScriptFunctionFlags::CONSTRUCTOR, isDeclare,
                                               Extension() == ScriptExtension::TS);
    scope->BindNode(func);
    paramScope->BindNode(func);
    scope->BindParamScope(paramScope);
    paramScope->BindFunctionScope(scope);

    auto *funcExpr = AllocNode<ir::FunctionExpression>(func);
    auto *key = AllocNode<ir::Identifier>("constructor", Allocator());

    ArenaVector<ir::Decorator *> decorators(Allocator()->Adapter());

    auto *ctor = AllocNode<ir::MethodDefinition>(ir::MethodDefinitionKind::CONSTRUCTOR, key, funcExpr,
                                                 ir::ModifierFlags::NONE, Allocator(), std::move(decorators), false);

    return ctor;
}

bool ParserImpl::IsPropertyKeysAreSame(const ir::Expression *exp1, const ir::Expression *exp2)
{
    if (exp1->IsIdentifier() && exp2->IsIdentifier()) {
        return exp1->AsIdentifier()->Name() == exp2->AsIdentifier()->Name();
    }

    if (exp1->IsIdentifier() && exp2->IsStringLiteral()) {
        return exp1->AsIdentifier()->Name() == exp2->AsStringLiteral()->Str();
    }

    if (exp1->IsStringLiteral() && exp2->IsStringLiteral()) {
        return *exp1->AsStringLiteral() == *exp2->AsStringLiteral();
    }

    if (exp1->IsStringLiteral() && exp2->IsIdentifier()) {
        return exp1->AsStringLiteral()->Str() == exp2->AsIdentifier()->Name();
    }

    if (exp1->IsStringLiteral() && exp2->IsNumberLiteral()) {
        std::string exp2String = std::to_string(exp2->AsNumberLiteral()->Number<double>());
        exp2String.erase(exp2String.find_last_not_of('0'), std::string::npos);
        return exp1->AsStringLiteral()->Str().Utf8() == exp2String;
    }

    if (exp1->IsNumberLiteral() && exp2->IsNumberLiteral()) {
        return exp1->AsNumberLiteral()->Number<double>() == exp2->AsNumberLiteral()->Number<double>();
    }

    if (exp1->IsNumberLiteral() && exp2->IsStringLiteral()) {
        std::string exp1String = std::to_string(exp1->AsNumberLiteral()->Number<double>());
        exp1String.erase(exp1String.find_last_not_of('0'), std::string::npos);
        return exp1String == exp2->AsStringLiteral()->Str().Utf8();
    }

    return false;
}

bool ParserImpl::IsMemberExpressionsAreSame(const ir::MemberExpression *mExp1, const ir::MemberExpression *mExp2)
{
    if (!IsPropertyKeysAreSame(mExp1->Property(), mExp2->Property())) {
        return false;
    }

    if (mExp1->Object()->IsMemberExpression() && mExp2->Object()->IsMemberExpression()) {
        return IsMemberExpressionsAreSame(mExp1->Object()->AsMemberExpression(), mExp2->Object()->AsMemberExpression());
    }

    return IsPropertyKeysAreSame(mExp1->Object(), mExp2->Object());
}

bool ParserImpl::IsMethodDefinitionsAreSame(const ir::MethodDefinition *property, ir::MethodDefinition *overload)
{
    if (property->Kind() != overload->Kind() || property->IsStatic() != overload->IsStatic()) {
        return false;
    }

    if (property->Key()->IsMemberExpression() && overload->Key()->IsMemberExpression()) {
        return IsMemberExpressionsAreSame(property->Key()->AsMemberExpression(), overload->Key()->AsMemberExpression());
    }

    return IsPropertyKeysAreSame(property->Key(), overload->Key());
}

ir::Identifier *ParserImpl::SetIdentNodeInClassDefinition()
{
    lexer::TokenType keywType = lexer_->GetToken().KeywordType();
    CheckStrictReservedWord();

    if (keywType == lexer::TokenType::KEYW_AWAIT && context_.IsModule()) {
        ThrowSyntaxError("Unexpected reserved word");
    }

    const util::StringView &identStr = lexer_->GetToken().Ident();

    Binder()->AddDecl<binder::ConstDecl>(lexer_->GetToken().Start(), identStr);

    auto *identNode = AllocNode<ir::Identifier>(identStr, Allocator());
    identNode->SetRange(lexer_->GetToken().Loc());

    lexer_->NextToken();

    return identNode;
}

ir::ClassDefinition *ParserImpl::ParseClassDefinition(bool isDeclaration, bool idRequired, bool isDeclare,
                                                      bool isAbstract)
{
    isDeclare = isDeclare | (context_.Status() & ParserStatus::IN_AMBIENT_CONTEXT);
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    lexer_->NextToken();

    ir::Identifier *identNode = nullptr;

    auto classCtx = binder::LexicalScope<binder::LocalScope>(Binder());

    if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT) {
        identNode = SetIdentNodeInClassDefinition();
    } else if (isDeclaration && idRequired) {
        ThrowSyntaxError("Unexpected token, expected an identifier.");
    }

    ir::TSTypeParameterDeclaration *typeParamDecl = nullptr;
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        typeParamDecl = ParseTsTypeParameterDeclaration();
    }

    // Parse SuperClass
    ir::Expression *superClass = nullptr;
    bool hasSuperClass = false;

    if (lexer_->GetToken().Type() == lexer::TokenType::KEYW_EXTENDS) {
        lexer_->NextToken();
        hasSuperClass = true;
        superClass = ParseLeftHandSideExpression();
    }

    ir::TSTypeParameterInstantiation *superTypeParams = nullptr;
    if (Extension() == ScriptExtension::TS && (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN ||
                                               lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT)) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
            lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
        }

        superTypeParams = ParseTsTypeParameterInstantiation();
    }

    ArenaVector<ir::TSClassImplements *> implements(Allocator()->Adapter());
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_IMPLEMENTS) {
        lexer_->NextToken();

        while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
            lexer::SourcePosition implStart = lexer_->GetToken().Start();

            if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
                ThrowSyntaxError("Identifier expected");
            }

            ir::Expression *expr = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            expr->SetRange(lexer_->GetToken().Loc());

            lexer_->NextToken();

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD) {
                expr = ParseTsQualifiedReference(expr);
            }

            ir::TSTypeParameterInstantiation *implTypeParams = nullptr;
            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
                lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_LESS_THAN, 1);
            }

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN ||
                lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_SHIFT) {
                implTypeParams = ParseTsTypeParameterInstantiation();
            }

            auto *impl = AllocNode<ir::TSClassImplements>(expr, implTypeParams);
            impl->SetRange({implStart, lexer_->GetToken().End()});
            implements.push_back(impl);

            if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
                lexer_->NextToken();
                continue;
            }

            if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
                ThrowSyntaxError("',' expected");
            }
        }

        if (implements.empty()) {
            ThrowSyntaxError("Implements clause can not be empty");
        }
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
        ThrowSyntaxError("Unexpected token, expected '{'");
    }

    // Parse ClassBody
    auto savedStatus = context_.Status();
    context_.Status() |= ParserStatus::IN_CLASS_BODY;
    context_.Status() &= ~(ParserStatus::CONSTRUCTOR_FUNCTION);
    lexer::SourcePosition classBodyStartLoc = lexer_->GetToken().Start();
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);

    ir::MethodDefinition *ctor = nullptr;
    ArenaVector<ir::Statement *> properties(Allocator()->Adapter());
    ArenaVector<ir::TSIndexSignature *> indexSignatures(Allocator()->Adapter());
    bool hasConstructorFuncBody = false;
    bool isCtorContinuousDefined = true;

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SEMI_COLON) {
            lexer_->NextToken();
            continue;
        }

        ir::Statement *property = ParseClassElement(properties, &indexSignatures, hasSuperClass, isDeclare, isAbstract);

        if (property->IsEmptyStatement()) {
            continue;
        }

        if (IsConstructor(property)) {
            if (!isDeclare && !isCtorContinuousDefined) {
                ThrowSyntaxError("Constructor implementation is missing.", property->Start());
            }
  
            if (hasConstructorFuncBody) {
                ThrowSyntaxError("Multiple constructor implementations are not allowed.", property->Start());
            }
            ctor = property->AsMethodDefinition();
            hasConstructorFuncBody = ctor->Value()->Function()->Body() != nullptr;
            continue;
        }
        isCtorContinuousDefined = ctor == nullptr;
        properties.push_back(property);
    }

    context_.Status() = savedStatus;

    lexer::SourcePosition classBodyEndLoc = lexer_->GetToken().End();
    if (ctor == nullptr) {
        ctor = CreateImplicitConstructor(hasSuperClass, isDeclare);
        ctor->SetRange({startLoc, classBodyEndLoc});
        hasConstructorFuncBody = !isDeclare;
    }
    lexer_->NextToken();

    if (!isDeclare && !hasConstructorFuncBody) {
        ThrowSyntaxError("Constructor implementation is missing.", ctor->Start());
    }

    auto *classDefinition = AllocNode<ir::ClassDefinition>(
        classCtx.GetScope(), identNode, typeParamDecl, superTypeParams, std::move(implements), ctor, superClass,
        std::move(properties), std::move(indexSignatures), isDeclare, isAbstract);

    classDefinition->SetRange({classBodyStartLoc, classBodyEndLoc});

    return classDefinition;
}

ir::TSEnumDeclaration *ParserImpl::ParseEnumMembers(ir::Identifier *key, const lexer::SourcePosition &enumStart,
                                                    bool isConst)
{
    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
        ThrowSyntaxError("'{' expected");
    }

    ArenaVector<ir::TSEnumMember *> members(Allocator()->Adapter());
    lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat '{'

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_BRACE) {
        ir::Expression *memberKey = nullptr;
        const auto &keyStartLoc = lexer_->GetToken().Start();
        binder::EnumDecl *decl {};

        if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_IDENT) {
            memberKey = AllocNode<ir::Identifier>(lexer_->GetToken().Ident(), Allocator());
            decl = Binder()->AddDecl<binder::EnumDecl>(keyStartLoc, lexer_->GetToken().Ident());
            memberKey->SetRange(lexer_->GetToken().Loc());
            lexer_->NextToken();
        } else if (lexer_->GetToken().Type() == lexer::TokenType::LITERAL_STRING) {
            decl = Binder()->AddDecl<binder::EnumDecl>(keyStartLoc, lexer_->GetToken().String());
            memberKey = AllocNode<ir::StringLiteral>(lexer_->GetToken().String());
            memberKey->SetRange(lexer_->GetToken().Loc());
            lexer_->NextToken();
        } else {
            ThrowSyntaxError("Unexpected token in enum member");
        }

        ir::Expression *memberInit = nullptr;
        lexer::SourcePosition initStart = lexer_->GetToken().Start();

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
            lexer_->NextToken();  // eat '='
            initStart = lexer_->GetToken().Start();
            memberInit = ParseExpression();
        }

        auto *member = AllocNode<ir::TSEnumMember>(memberKey, memberInit);
        decl->BindNode(member);
        member->SetRange({initStart, lexer_->GetToken().End()});
        members.push_back(member);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            lexer_->NextToken(lexer::LexerNextTokenFlags::KEYWORD_TO_IDENT);  // eat ','
        }
    }

    auto *enumDeclaration =
        AllocNode<ir::TSEnumDeclaration>(Binder()->GetScope()->AsLocalScope(), key, std::move(members), isConst);
    enumDeclaration->SetRange({enumStart, lexer_->GetToken().End()});
    Binder()->GetScope()->BindNode(enumDeclaration);
    lexer_->NextToken();  // eat '}'

    return enumDeclaration;
}

ir::TSEnumDeclaration *ParserImpl::ParseEnumDeclaration(bool isConst)
{
    ASSERT(lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ENUM);
    lexer::SourcePosition enumStart = lexer_->GetToken().Start();
    lexer_->NextToken();  // eat enum keyword

    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        ThrowSyntaxError("Identifier expected");
    }

    const util::StringView &ident = lexer_->GetToken().Ident();
    binder::TSBinding tsBinding(Allocator(), ident);

    auto *key = AllocNode<ir::Identifier>(ident, Allocator());
    key->SetRange(lexer_->GetToken().Loc());
    key->SetReference();
    lexer_->NextToken();

    const auto &bindings = Binder()->GetScope()->Bindings();
    auto res = bindings.find(tsBinding.View());
    binder::EnumLiteralDecl *decl {};

    if (res == bindings.end()) {
        decl = Binder()->AddTsDecl<binder::EnumLiteralDecl>(lexer_->GetToken().Start(), tsBinding.View(), isConst);
        binder::LexicalScope enumCtx = binder::LexicalScope<binder::LocalScope>(Binder());
        decl->AsEnumLiteralDecl()->BindScope(enumCtx.GetScope());
        return ParseEnumMembers(key, enumStart, isConst);
    }

    if (!res->second->Declaration()->IsEnumLiteralDecl() ||
        (isConst ^ res->second->Declaration()->AsEnumLiteralDecl()->IsConst())) {
        Binder()->ThrowRedeclaration(lexer_->GetToken().Start(), ident);
    }

    decl = res->second->Declaration()->AsEnumLiteralDecl();

    auto scopeCtx = binder::LexicalScope<binder::LocalScope>::Enter(Binder(), decl->Scope());
    return ParseEnumMembers(key, enumStart, isConst);
}

void ParserImpl::ValidateFunctionParam(const ArenaVector<ir::Expression *> &params, const ir::Expression *parameter,
                                       bool *seenOptional)
{
    if (!parameter->IsIdentifier()) {
        context_.Status() |= ParserStatus::HAS_COMPLEX_PARAM;
        if (!parameter->IsRestElement()) {
            return;
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
            const char *msg = (Extension() == ScriptExtension::JS ? "Rest parameter must be last formal parameter"
                                                                  : "A rest parameter must be last in parameter list");
            ThrowSyntaxError(msg);
        }
        return;
    }

    if (Extension() != ScriptExtension::TS) {
        return;
    }

    bool currentIsOptinal = parameter->AsIdentifier()->IsOptional();
    if (*seenOptional && !currentIsOptinal) {
        ThrowSyntaxError("A required parameter cannot follow an optional parameter");
    }

    *seenOptional |= currentIsOptinal;
    const util::StringView &paramName = parameter->AsIdentifier()->Name();

    if (paramName.Is("this")) {
        if (!params.empty()) {
            ThrowSyntaxError("A 'this' parameter must be the first parameter");
        }

        if (context_.Status() & ParserStatus::CONSTRUCTOR_FUNCTION) {
            ThrowSyntaxError("A constructor cannot have a 'this' parameter");
        }

        if (context_.Status() & ParserStatus::ARROW_FUNCTION) {
            ThrowSyntaxError("An arrow function cannot have a 'this' parameter");
        }

        if (context_.Status() & ParserStatus::ACCESSOR_FUNCTION) {
            ThrowSyntaxError("'get' and 'set' accessors cannot declare 'this' parameters");
        }
    }

    if (paramName.Is("constructor") && (context_.Status() & ParserStatus::CONSTRUCTOR_FUNCTION)) {
        ThrowSyntaxError("'constructor' cannot be used as a parameter property name");
    }
}

ArenaVector<ir::Expression *> ParserImpl::ParseFunctionParams(bool isDeclare)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS);
    lexer_->NextToken();

    ArenaVector<ir::Expression *> params(Allocator()->Adapter());
    bool seenOptional = false;

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
        ir::Expression *parameter = ParseFunctionParameter(isDeclare);
        ValidateFunctionParam(params, parameter, &seenOptional);

        params.push_back(parameter);

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_COMMA &&
            lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS) {
            ThrowSyntaxError(", expected");
        }

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            lexer_->NextToken();
        }
    }

    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_RIGHT_PARENTHESIS);
    lexer_->NextToken();

    return params;
}

bool ParserImpl::CheckTypeNameIsReserved(const util::StringView &paramName)
{
    return paramName.Is("number") || paramName.Is("any") || paramName.Is("unknown") || paramName.Is("never") ||
           paramName.Is("bigint") || paramName.Is("boolean") || paramName.Is("string") || paramName.Is("string") ||
           paramName.Is("void") || paramName.Is("object");
}

ir::TSTypeParameter *ParserImpl::ParseTsTypeParameter(bool throwError, bool addBinding)
{
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    if (lexer_->GetToken().Type() != lexer::TokenType::LITERAL_IDENT) {
        if (!throwError) {
            return nullptr;
        }

        ThrowSyntaxError("Type parameter declaration expected");
    }

    const auto &ident = lexer_->GetToken().Ident();

    if (CheckTypeNameIsReserved(ident)) {
        if (!throwError) {
            return nullptr;
        }

        ThrowSyntaxError("Invalid type parameter name");
    }

    auto *paramIdent = AllocNode<ir::Identifier>(ident, Allocator());

    if (addBinding) {
        Binder()->AddDecl<binder::LetDecl>(lexer_->GetToken().Start(), ident);
    }

    paramIdent->SetRange({lexer_->GetToken().Start(), lexer_->GetToken().End()});

    lexer_->NextToken();

    TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::NO_OPTS;

    if (throwError) {
        options |= TypeAnnotationParsingOptions::THROW_ERROR;
    }

    ir::Expression *constraint = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::KEYW_EXTENDS) {
        lexer_->NextToken();
        constraint = ParseTsTypeAnnotation(&options);
    }

    ir::Expression *defaultType = nullptr;
    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_SUBSTITUTION) {
        lexer_->NextToken();
        defaultType = ParseTsTypeAnnotation(&options);
    }

    auto *typeParam = AllocNode<ir::TSTypeParameter>(paramIdent, constraint, defaultType);

    typeParam->SetRange({startLoc, lexer_->GetToken().End()});

    return typeParam;
}

ir::TSTypeParameterDeclaration *ParserImpl::ParseTsTypeParameterDeclaration(bool throwError)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN);

    auto localCtx = binder::LexicalScope<binder::LocalScope>(Binder());

    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    ArenaVector<ir::TSTypeParameter *> params(Allocator()->Adapter());
    bool seenDefault = false;
    size_t requiredParams = 0;
    lexer_->NextToken();  // eat '<'

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_GREATER_THAN) {
        ir::TSTypeParameter *currentParam = ParseTsTypeParameter(throwError, true);

        if (!currentParam) {
            ASSERT(!throwError);
            return nullptr;
        }

        if (currentParam->DefaultType()) {
            seenDefault = true;
        } else if (seenDefault) {
            ThrowSyntaxError("Required type parameters may not follow optional type parameters.");
        } else {
            requiredParams++;
        }

        params.push_back(currentParam);

        if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COMMA) {
            lexer_->NextToken();
            continue;
        }

        if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_GREATER_THAN) {
            if (!throwError) {
                return nullptr;
            }

            ThrowSyntaxError("'>' expected");
        }
    }

    if (params.empty()) {
        ThrowSyntaxError("Type parameter list cannot be empty.");
    }

    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    lexer_->NextToken();  // eat '>'

    auto *typeParamDecl =
        AllocNode<ir::TSTypeParameterDeclaration>(localCtx.GetScope(), std::move(params), requiredParams);
    typeParamDecl->SetRange({startLoc, endLoc});
    localCtx.GetScope()->BindNode(typeParamDecl);

    return typeParamDecl;
}

ir::TSTypeParameterInstantiation *ParserImpl::ParseTsTypeParameterInstantiation(bool throwError)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN);
    lexer::SourcePosition startLoc = lexer_->GetToken().Start();
    ArenaVector<ir::Expression *> params(Allocator()->Adapter());
    lexer_->NextToken();  // eat '<'

    while (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_GREATER_THAN) {
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::NO_OPTS;

        if (throwError) {
            options |= TypeAnnotationParsingOptions::THROW_ERROR;
        }

        ir::Expression *currentParam = ParseTsTypeAnnotation(&options);

        if (!currentParam) {
            return nullptr;
        }

        params.push_back(currentParam);

        switch (lexer_->GetToken().Type()) {
            case lexer::TokenType::PUNCTUATOR_COMMA: {
                lexer_->NextToken();
                continue;
            }
            case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT: {
                lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_GREATER_THAN, 1);
                break;
            }
            case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT: {
                lexer_->BackwardToken(lexer::TokenType::PUNCTUATOR_GREATER_THAN, 2);
                break;
            }
            case lexer::TokenType::PUNCTUATOR_GREATER_THAN: {
                break;
            }
            default: {
                if (throwError) {
                    ThrowSyntaxError("'>' expected");
                }

                return nullptr;
            }
        }
    }

    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    lexer_->NextToken();

    auto *typeParamInst = AllocNode<ir::TSTypeParameterInstantiation>(std::move(params));

    typeParamInst->SetRange({startLoc, endLoc});

    return typeParamInst;
}

ir::ScriptFunction *ParserImpl::ParseFunction(ParserStatus newStatus, bool isDeclare)
{
    FunctionContext functionContext(this, newStatus | ParserStatus::FUNCTION | ParserStatus::ALLOW_NEW_TARGET);

    FunctionParameterContext funcParamContext(&context_, Binder());
    auto *funcParamScope = funcParamContext.LexicalScope().GetScope();

    lexer::SourcePosition startLoc = lexer_->GetToken().Start();

    ir::TSTypeParameterDeclaration *typeParamDecl = nullptr;
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_LESS_THAN) {
        typeParamDecl = ParseTsTypeParameterDeclaration();
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_PARENTHESIS) {
        ThrowSyntaxError("Unexpected token, expected '('");
    }

    if (newStatus & (ParserStatus::ASYNC_FUNCTION | ParserStatus::FUNCTION_DECLARATION)) {
        context_.Status() |= ParserStatus::DISALLOW_AWAIT;
    }

    ArenaVector<ir::Expression *> params = ParseFunctionParams(isDeclare);

    ir::Expression *returnTypeAnnotation = nullptr;

    if (Extension() == ScriptExtension::TS && lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options =
            TypeAnnotationParsingOptions::THROW_ERROR | TypeAnnotationParsingOptions::CAN_BE_TS_TYPE_PREDICATE;
        returnTypeAnnotation = ParseTsTypeAnnotation(&options);
    }

    auto functionCtx = binder::LexicalScope<binder::FunctionScope>(Binder());
    auto *functionScope = functionCtx.GetScope();
    functionScope->BindParamScope(funcParamScope);
    funcParamScope->BindFunctionScope(functionScope);

    ir::BlockStatement *body = nullptr;
    lexer::SourcePosition endLoc = lexer_->GetToken().End();
    bool letDeclare = true;

    if (newStatus & ParserStatus::ASYNC_FUNCTION) {
        context_.Status() &= ~ParserStatus::DISALLOW_AWAIT;
    } else {
        context_.Status() |= ParserStatus::DISALLOW_AWAIT;
    }

    if (newStatus & ParserStatus::GENERATOR_FUNCTION) {
        context_.Status() |= ParserStatus::ALLOW_YIELD;
    }

    if (lexer_->GetToken().Type() != lexer::TokenType::PUNCTUATOR_LEFT_BRACE) {
        if (Extension() == ScriptExtension::TS && (newStatus & ParserStatus::FUNCTION_DECLARATION)) {
            ValidateTsFunctionOverloadParams(params);
            functionContext.AddFlag(ir::ScriptFunctionFlags::OVERLOAD);
        } else if (!isDeclare && !(context_.Status() & ParserStatus::IN_METHOD_DEFINITION)) {
            ThrowSyntaxError("Unexpected token, expected '{'");
        } else {
            letDeclare = false;
            functionContext.AddFlag(ir::ScriptFunctionFlags::OVERLOAD);
        }
    } else if (isDeclare) {
        ThrowSyntaxError("An implementation cannot be declared in ambient contexts.");
    } else {
        body = ParseBlockStatement(functionScope);
        endLoc = body->End();
    }

    auto *funcNode =
        AllocNode<ir::ScriptFunction>(functionScope, std::move(params), typeParamDecl, body, returnTypeAnnotation,
                                      functionContext.Flags(), isDeclare && letDeclare,
                                      Extension() == ScriptExtension::TS);
    functionScope->BindNode(funcNode);
    funcParamScope->BindNode(funcNode);
    funcNode->SetRange({startLoc, endLoc});

    return funcNode;
}

void ParserImpl::ValidateTsFunctionOverloadParams(const ArenaVector<ir::Expression *> &params)
{
    for (auto *it : params) {
        if (it->IsAssignmentPattern()) {
            ThrowSyntaxError(
                "A parameter initializer is only allowed in a function "
                "or constructor implementation.",
                it->Start());
        }
    }
}

ir::SpreadElement *ParserImpl::ParseSpreadElement(ExpressionParseFlags flags)
{
    ASSERT(lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_PERIOD_PERIOD_PERIOD);
    lexer::SourcePosition startLocation = lexer_->GetToken().Start();
    bool inPattern = (flags & ExpressionParseFlags::MUST_BE_PATTERN);
    lexer_->NextToken();

    ir::Expression *argument {};
    if (inPattern) {
        argument = ParsePatternElement(ExpressionParseFlags::IN_REST);
        if ((flags & ExpressionParseFlags::OBJECT_PATTERN) && !argument->IsIdentifier()) {
            ThrowSyntaxError("RestParameter must be followed by an identifier in declaration contexts");
        }
    } else {
        argument = ParseExpression(flags);
    }

    ir::Expression *typeAnnotation = nullptr;

    if (lexer_->GetToken().Type() == lexer::TokenType::PUNCTUATOR_COLON) {
        lexer_->NextToken();  // eat ':'
        TypeAnnotationParsingOptions options = TypeAnnotationParsingOptions::THROW_ERROR;
        typeAnnotation = ParseTsTypeAnnotation(&options);
    }

    if (inPattern && argument->IsAssignmentExpression()) {
        ThrowSyntaxError("RestParameter does not support an initializer");
    }

    lexer::SourcePosition endLoc = typeAnnotation ? typeAnnotation->End() : argument->End();

    auto nodeType = inPattern ? ir::AstNodeType::REST_ELEMENT : ir::AstNodeType::SPREAD_ELEMENT;
    auto *spreadElementNode = AllocNode<ir::SpreadElement>(nodeType, argument);
    spreadElementNode->SetRange({startLocation, endLoc});

    if (typeAnnotation) {
        spreadElementNode->SetTsTypeAnnotation(typeAnnotation);
    }

    return spreadElementNode;
}

ir::TSParameterProperty *ParserImpl::CreateTsParameterProperty(ir::Expression *parameter, ir::ModifierFlags modifiers)
{
    auto accessibility = ir::AccessibilityOption::NO_OPTS;
    bool readonly = false;
    bool isStatic = false;
    bool isExport = false;

    if (modifiers & ir::ModifierFlags::PRIVATE) {
        accessibility = ir::AccessibilityOption::PRIVATE;
    } else if ((modifiers & ir::ModifierFlags::PUBLIC)) {
        accessibility = ir::AccessibilityOption::PUBLIC;
    } else if (modifiers & ir::ModifierFlags::PROTECTED) {
        accessibility = ir::AccessibilityOption::PROTECTED;
    }

    if (modifiers & ir::ModifierFlags::READONLY) {
        readonly = true;
    }

    if (modifiers & ir::ModifierFlags::STATIC) {
        isStatic = true;
    }

    // TODO(Csaba Repasi): Handle export property of TSParameterProperty

    return AllocNode<ir::TSParameterProperty>(accessibility, parameter, readonly, isStatic, isExport);
}

ir::Expression *ParserImpl::ParseFunctionParameter(bool isDeclare)
{
    if (Extension() == ScriptExtension::TS && lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_THIS) {
        lexer_->GetToken().SetTokenType(lexer::TokenType::LITERAL_IDENT);
    }

    lexer::SourcePosition parameterStart = lexer_->GetToken().Start();
    ir::ModifierFlags modifiers = ParseModifiers();
    // TODO(Csaba Repasi): throw error if using strick mode reserved keyword here
    if (!(context_.Status() & ParserStatus::CONSTRUCTOR_FUNCTION) && modifiers != ir::ModifierFlags::NONE) {
        ThrowSyntaxError("A parameter property is only allowed in a constructor implementation.", parameterStart);
    }

    lexer::TokenType tokenType = lexer_->GetToken().Type();
    if (tokenType == lexer::TokenType::LITERAL_IDENT &&
        (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ARGUMENTS ||
         lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_EVAL)) {
        ThrowSyntaxError(
            "'eval' or 'arguments' can't be defined or assigned to "
            "in strict mode code",
            lexer_->GetToken().Start());
    }

    ir::Expression *functionParameter = ParsePatternElement(ExpressionParseFlags::NO_OPTS, true, isDeclare);

    if (modifiers != ir::ModifierFlags::NONE && functionParameter->IsRestElement()) {
        ThrowSyntaxError("A parameter property cannot be declared using a rest parameter.", parameterStart);
    }

    if (modifiers != ir::ModifierFlags::NONE &&
        (functionParameter->IsArrayPattern() || functionParameter->IsObjectPattern() ||
         (functionParameter->IsAssignmentPattern() &&
          (functionParameter->AsAssignmentPattern()->Left()->IsArrayPattern() ||
           functionParameter->AsAssignmentPattern()->Left()->IsObjectPattern())))) {
        ThrowSyntaxError("A parameter property may not be declared using a binding pattern.", parameterStart);
    }

    if (modifiers != ir::ModifierFlags::NONE) {
        functionParameter = CreateTsParameterProperty(functionParameter, modifiers);
        functionParameter->SetRange({parameterStart, functionParameter->AsTSParameterProperty()->Parameter()->End()});
    }

    Binder()->AddParamDecl(functionParameter);

    return functionParameter;
}

void ParserImpl::ValidateLvalueAssignmentTarget(ir::Expression *node)
{
    switch (node->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            // Check the prevoius ident keyword type
            if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_ARGUMENTS) {
                ThrowSyntaxError("Assigning to 'arguments' in strict mode is invalid");
            } else if (lexer_->GetToken().KeywordType() == lexer::TokenType::KEYW_EVAL) {
                ThrowSyntaxError("Assigning to 'eval' in strict mode is invalid");
            }
            break;
        }
        case ir::AstNodeType::MEMBER_EXPRESSION: {
            break;
        }
        default: {
            ThrowSyntaxError("Invalid left-hand side in assignment expression");
        }
    }
}

void ParserImpl::ValidateAssignmentTarget(ExpressionParseFlags flags, ir::Expression *node)
{
    switch (node->Type()) {
        case ir::AstNodeType::ARRAY_PATTERN:
        case ir::AstNodeType::OBJECT_PATTERN: {
            break;
        }
        case ir::AstNodeType::ARRAY_EXPRESSION:
        case ir::AstNodeType::OBJECT_EXPRESSION: {
            if (flags & ExpressionParseFlags::POTENTIALLY_IN_PATTERN) {
                return;
            }

            [[fallthrough]];
        }
        default: {
            return ValidateLvalueAssignmentTarget(node);
        }
    }
}

void ParserImpl::ValidateArrowParameterBindings(const ir::Expression *node)
{
    switch (node->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            const util::StringView &identifier = node->AsIdentifier()->Name();

            if (context_.IsAsync() && identifier.Is("await")) {
                ThrowSyntaxError("'await' in formal parameter is invalid.", node->Start());
            }
            break;
        }
        case ir::AstNodeType::OMITTED_EXPRESSION: {
            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            ValidateArrowParameterBindings(node->AsRestElement()->Argument());
            break;
        }
        case ir::AstNodeType::PROPERTY: {
            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            const auto &props = node->AsObjectPattern()->Properties();

            for (auto *it : props) {
                ValidateArrowParameterBindings(it);
            }
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            const auto &elements = node->AsArrayPattern()->Elements();

            for (auto *it : elements) {
                ValidateArrowParameterBindings(it);
            }
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            ValidateArrowParameterBindings(node->AsAssignmentPattern()->Left());
            break;
        }
        default: {
            ThrowSyntaxError("Unexpected ArrowParameter element");
        }
    }
}

bool ParserImpl::CurrentTokenIsModifier(char32_t nextCp) const
{
    return (Extension() == ScriptExtension::TS &&
            (nextCp != LEX_CHAR_EQUALS || nextCp != LEX_CHAR_SEMICOLON || nextCp != LEX_CHAR_LEFT_PAREN));
}

void ParserImpl::ThrowParameterModifierError(ir::ModifierFlags status) const
{
    ThrowSyntaxError(
        {"'", (status & ir::ModifierFlags::STATIC) ? "static" : ((status & ir::ModifierFlags::ASYNC) ? "async" : "declare") ,
         "' modifier cannot appear on a parameter."},
        lexer_->GetToken().Start());
}

void ParserImpl::ThrowSyntaxError(std::string_view errorMessage) const
{
    ThrowSyntaxError(errorMessage, lexer_->GetToken().Start());
}

void ParserImpl::ThrowSyntaxError(std::initializer_list<std::string_view> list) const
{
    ThrowSyntaxError(list, lexer_->GetToken().Start());
}

void ParserImpl::ThrowSyntaxError(std::initializer_list<std::string_view> list, const lexer::SourcePosition &pos) const
{
    std::stringstream ss;

    for (const auto &it : list) {
        ss << it;
    }

    std::string err = ss.str();

    ThrowSyntaxError(std::string_view {err}, pos);
}

void ParserImpl::ThrowSyntaxError(std::string_view errorMessage, const lexer::SourcePosition &pos) const
{
    lexer::LineIndex index(program_.SourceCode());
    lexer::SourceLocation loc = index.GetLocation(pos);

    throw Error {ErrorType::SYNTAX, errorMessage, loc.line, loc.col};
}

ScriptExtension ParserImpl::Extension() const
{
    return program_.Extension();
}

parser::SourceTextModuleRecord *ParserImpl::GetSourceTextModuleRecord()
{
    return Binder()->Program()->ModuleRecord();
}

void ParserImpl::AddHotfixHelper(util::Hotfix *hotfixHelper)
{
    program_.AddHotfixHelper(hotfixHelper);
}

void ParserImpl::CheckStrictReservedWord() const
{
    if (Extension() == ScriptExtension::JS) {
        if (lexer_->GetToken().IsJsStrictReservedWord()) {
            ThrowSyntaxError("Unexpected reserved word in strict mode.");
        }
    } else {
        if (lexer_->GetToken().KeywordType() >= lexer::TokenType::KEYW_ARGUMENTS) {
            ThrowSyntaxError("Unexpected reserved word in strict mode.");
        }
    }
}

}  // namespace panda::es2panda::parser
