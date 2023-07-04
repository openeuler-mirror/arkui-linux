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

#ifndef ES2PANDA_PARSER_CORE_PARSER_IMPL_H
#define ES2PANDA_PARSER_CORE_PARSER_IMPL_H

#include <binder/binder.h>
#include <es2panda.h>
#include <ir/astNode.h>
#include <lexer/token/sourceLocation.h>
#include <macros.h>
#include <mem/arena_allocator.h>
#include <parser/context/parserContext.h>
#include <parser/module/sourceTextModuleRecord.h>
#include <parser/parserFlags.h>
#include <parser/program/program.h>
#include <util/enumbitops.h>
#include <util/ustring.h>

#include <memory>
#include <sstream>
#include <unordered_map>
#include <unordered_set>

namespace panda::es2panda::lexer {
enum class TokenFlags;
enum class TokenType;
class LexerPosition;
class Token;
class Lexer;
}  // namespace panda::es2panda::lexer

namespace panda::es2panda::ir {
class ArrowFunctionExpression;
class AstNode;
class BlockStatement;
class BreakStatement;
class CallExpression;
class ClassDeclaration;
class ClassDefinition;
class ContinueStatement;
class DoWhileStatement;
class ExportAllDeclaration;
class ExportDefaultDeclaration;
class ExportNamedDeclaration;
class ExportNamedDeclaration;
class Expression;
class FunctionDeclaration;
class FunctionExpression;
class Identifier;
class IfStatement;
class ImportDeclaration;
class LabelledStatement;
class NewExpression;
class ObjectExpression;
class ReturnStatement;
class ScriptFunction;
class SequenceExpression;
class SpreadElement;
class Statement;
class StringLiteral;
class SwitchCaseStatement;
class SwitchStatement;
class TSArrayType;
class TSEnumDeclaration;
class TSFunctionType;
class TSInterfaceDeclaration;
class TSIntersectionType;
class TSTupleType;
class TSTypeAliasDeclaration;
class TSUnionType;
class TSImportType;
class TemplateLiteral;
class ThrowStatement;
class TryStatement;
class VariableDeclaration;
class WhileStatement;
class WithStatement;
class TSTypeParameter;
class TSTypeParameterDeclaration;
class MemberExpression;
class MethodDefinition;
class TSTypeReference;
class TSMappedType;
class TSTypePredicate;
class Decorator;
class TSIndexSignature;
class Property;
class TSTypeParameterInstantiation;
class TSParameterProperty;
class TSTypeAssertion;
class TSAsExpression;
class YieldExpression;
class MetaProperty;
class TSModuleDeclaration;
class TSImportEqualsDeclaration;
class TSModuleBlock;
class EmptyStatement;
class DebuggerStatement;
class CatchClause;
class VariableDeclarator;

enum class PropertyKind;
enum class TSTupleKind;
enum class MethodDefinitionKind;
enum class ModifierFlags;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::parser {

class Program;
class ParserContext;

class ClassElmentDescriptor {
public:
    ir::MethodDefinitionKind methodKind {};
    ParserStatus newStatus {};
    ir::ModifierFlags modifiers {};
    lexer::SourcePosition methodStart {};
    lexer::SourcePosition propStart {};
    bool isPrivateIdent {};
    bool hasSuperClass {};
    bool isGenerator {};
    bool invalidComputedProperty {};
    bool isComputed {};
    bool isIndexSignature {};
    bool classMethod {};
    bool classField {};
};

class ArrowFunctionDescriptor {
public:
    explicit ArrowFunctionDescriptor(ArenaVector<ir::Expression *> &&p, binder::FunctionParamScope *ps,
                                     lexer::SourcePosition sl, ParserStatus ns)
        : params(p), paramScope(ps), startLoc(sl), newStatus(ns)
    {
    }

    ArenaVector<ir::Expression *> params;
    binder::FunctionParamScope *paramScope;
    lexer::SourcePosition startLoc;
    ParserStatus newStatus;
};

enum class TypeAnnotationParsingOptions {
    NO_OPTS = 0,
    IN_UNION = 1 << 0,
    ALLOW_CONST = 1 << 1,
    IN_INTERSECTION = 1 << 2,
    RESTRICT_EXTENDS = 1 << 3,
    THROW_ERROR = 1 << 4,
    CAN_BE_TS_TYPE_PREDICATE = 1 << 5,
    BREAK_AT_NEW_LINE = 1 << 6,
    IN_MODIFIER = 1 << 7,
};

DEFINE_BITOPS(TypeAnnotationParsingOptions)

class ArrowFunctionContext;

class ParserImpl {
public:
    explicit ParserImpl(es2panda::ScriptExtension extension);
    NO_COPY_SEMANTIC(ParserImpl);
    NO_MOVE_SEMANTIC(ParserImpl);
    ~ParserImpl() = default;

    Program Parse(const std::string &fileName, const std::string &source,
                  const std::string &recordName, ScriptKind kind);

    ScriptExtension Extension() const;

    void AddHotfixHelper(util::Hotfix *hotfixHelper);

    ArenaAllocator *Allocator() const
    {
        return program_.Allocator();
    }

private:
    bool IsStartOfMappedType() const;
    bool IsStartOfTsTypePredicate() const;
    bool IsStartOfAbstractConstructorType() const;

    bool CurrentTokenIsModifier(char32_t nextCp) const;
    [[noreturn]] void ThrowParameterModifierError(ir::ModifierFlags status) const;
    [[noreturn]] void ThrowSyntaxError(std::string_view errorMessage) const;
    [[noreturn]] void ThrowSyntaxError(std::initializer_list<std::string_view> list) const;
    [[noreturn]] void ThrowSyntaxError(std::initializer_list<std::string_view> list,
                                       const lexer::SourcePosition &pos) const;

    [[noreturn]] void ThrowSyntaxError(std::string_view errorMessage, const lexer::SourcePosition &pos) const;

    template <typename T, typename... Args>
    T *AllocNode(Args &&... args)
    {
        auto ret = program_.Allocator()->New<T>(std::forward<Args>(args)...);
        if (ret == nullptr) {
            throw Error(ErrorType::GENERIC, "Unsuccessful allocation during parsing");
        }
        return ret;
    }

    [[nodiscard]] std::unique_ptr<lexer::Lexer> InitLexer(const std::string &fileName, const std::string &source);
    void ParseScript();
    void ParseModule();

    /*
     * Transform the commonjs module's AST by wrap the sourceCode & use Reflect.apply to invoke this wrapper with [this]
     * pointing to [exports] object
     *
     * Reflect.apply(function (exports, require, module, __filename, __dirname) {
     *   [SourceCode]
     * }, exports, [exports, require, module, __filename, __dirname]);
     */
    void ParseCommonjs();
    void AddCommonjsParams(ArenaVector<ir::Expression *> &params);
    void AddReflectApplyArgs(ArenaVector<ir::Expression *> &args, ir::FunctionExpression *wrapper);
    void ParseProgram(ScriptKind kind);
    static ExpressionParseFlags CarryExpressionParserFlag(ExpressionParseFlags origin, ExpressionParseFlags carry);
    static ExpressionParseFlags CarryPatternFlags(ExpressionParseFlags flags);
    bool CurrentIsBasicType();
    bool CurrentLiteralIsBasicType();
    static bool CheckTypeNameIsReserved(const util::StringView &paramName);
    static bool IsPropertyKeysAreSame(const ir::Expression *exp1, const ir::Expression *exp2);
    static bool IsMemberExpressionsAreSame(const ir::MemberExpression *mExp1, const ir::MemberExpression *mExp2);
    static bool IsMethodDefinitionsAreSame(const ir::MethodDefinition *property, ir::MethodDefinition *overload);
    ir::TSTypeReference *ParseTsConstExpression();
    ir::Expression *ParseTsTypeOperatorOrTypeReference();
    ir::Expression *ParseTsIdentifierReference();
    ir::Expression *ParseTsBasicType();
    ir::TSIntersectionType *ParseTsIntersectionType(ir::Expression *type, bool inUnion, bool restrictExtends);
    ir::TSUnionType *ParseTsUnionType(ir::Expression *type, bool restrictExtends);
    ir::Expression *ParseTsParenthesizedOrFunctionType(ir::Expression *typeAnnotation, bool throwError);
    ir::TSArrayType *ParseTsArrayType(ir::Expression *elementType);
    ir::Expression *ParseTsFunctionType(lexer::SourcePosition startLoc, bool isConstructionType, bool throwError,
                                        bool abstractConstructor = false);
    ir::TSTypeParameter *ParseTsMappedTypeParameter();
    ir::MappedOption ParseMappedOption(lexer::TokenType tokenType);
    ir::TSMappedType *ParseTsMappedType();
    ir::TSTypePredicate *ParseTsTypePredicate();
    ir::Expression *ParseTsTypeLiteralOrInterfaceKey(bool *computed, bool *signature, bool *isIndexSignature);
    ir::Expression *ParseTsConditionalType(ir::Expression *checkType, bool restrictExtends);
    ir::Expression *ParseTsTypeLiteralOrInterfaceMember();
    ArenaVector<ir::Expression *> ParseTsTypeLiteralOrInterface();
    ir::Expression *ParseTsThisType(bool throwError);
    ir::Expression *ParseTsIndexAccessType(ir::Expression *typeName);
    ir::Expression *ParseTsQualifiedReference(ir::Expression *typeName);
    ir::Expression *ParseTsTypeReferenceOrQuery(bool parseQuery = false);
    bool IsTSNamedTupleMember();
    ir::Expression *ParseTsTupleElement(ir::TSTupleKind *kind, bool *seenOptional);
    ir::TSTupleType *ParseTsTupleType();
    ir::TSImportType *ParseTsImportType(const lexer::SourcePosition &startLoc, bool isTypeof = false);
    ir::Expression *ParseTsTypeAnnotation(TypeAnnotationParsingOptions *options);
    ir::Expression *ParseTsTypeLiteralOrTsMappedType(ir::Expression *typeAnnotation);
    ir::Expression *ParseTsTypeReferenceOrTsTypePredicate(ir::Expression *typeAnnotation, bool canBeTsTypePredicate);
    ir::Expression *ParseTsThisTypeOrTsTypePredicate(ir::Expression *typeAnnotation, bool canBeTsTypePredicate,
                                                     bool throwError);
    ir::Expression *ParseTsTemplateLiteralType();
    ir::Expression *ParseTsTypeAnnotationElement(ir::Expression *typeAnnotation, TypeAnnotationParsingOptions *options);
    ir::ModifierFlags ParseModifiers();

    void ThrowIfPrivateIdent(ClassElmentDescriptor *desc, const char *msg);
    void ValidateClassKey(ClassElmentDescriptor *desc, bool isDeclare);

    void ValidateClassMethodStart(ClassElmentDescriptor *desc, ir::Expression *typeAnnotation);
    ir::Expression *ParseClassKey(ClassElmentDescriptor *desc, bool isDeclare);

    void ValidateClassSetter(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                             ir::Expression *propName, ir::ScriptFunction *func, bool hasDecorator,
                             lexer::SourcePosition errorInfo);
    void ValidateClassGetter(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                             ir::Expression *propName, ir::ScriptFunction *func, bool hasDecorator,
                             lexer::SourcePosition errorInfo);
    ir::MethodDefinition *ParseClassMethod(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                                           ir::Expression *propName, lexer::SourcePosition *propEnd,
                                           ArenaVector<ir::Decorator *> &&decorators, bool isDeclare);
    ir::Statement *ParseClassProperty(ClassElmentDescriptor *desc, const ArenaVector<ir::Statement *> &properties,
                                      ir::Expression *propName, ir::Expression *typeAnnotation,
                                      ArenaVector<ir::Decorator *> &&decorators, bool isDeclare);
    void ParseClassKeyModifiers(ClassElmentDescriptor *desc);
    void CheckClassGeneratorMethod(ClassElmentDescriptor *desc);
    void CheckClassPrivateIdentifier(ClassElmentDescriptor *desc);
    ir::Expression *ParseClassKeyAnnotation();
    ir::Decorator *ParseDecorator();
    ArenaVector<ir::Decorator *> ParseDecorators();
    ir::Statement *ParseClassElement(const ArenaVector<ir::Statement *> &properties,
                                     ArenaVector<ir::TSIndexSignature *> *indexSignatures, bool hasSuperClass,
                                     bool isDeclare, bool isAbstractClass);
    ir::MethodDefinition *CreateImplicitConstructor(bool hasSuperClass, bool isDeclare = false);
    ir::MethodDefinition *CheckClassMethodOverload(ir::Statement *property, ir::MethodDefinition **ctor, bool isDeclare,
                                                   lexer::SourcePosition errorInfo, ir::MethodDefinition *lastOverload,
                                                   bool implExists, bool isAbstract = false);
    ir::Identifier *SetIdentNodeInClassDefinition();
    ir::ClassDefinition *ParseClassDefinition(bool isDeclaration, bool idRequired = true, bool isDeclare = false,
                                              bool isAbstract = false);

    void ValidateAccessor(ExpressionParseFlags flags, lexer::TokenFlags currentTokenFlags);
    void CheckPropertyKeyAsycModifier(ParserStatus *methodStatus);
    ir::Property *ParseShorthandProperty(const lexer::LexerPosition *startPos);
    void ParseGeneratorPropertyModifier(ExpressionParseFlags flags, ParserStatus *methodStatus);
    bool ParsePropertyModifiers(ExpressionParseFlags flags, ir::PropertyKind *propertyKind, ParserStatus *methodStatus);
    ir::Expression *ParsePropertyKey(ExpressionParseFlags flags);
    ir::Expression *ParsePropertyValue(const ir::PropertyKind *propertyKind, const ParserStatus *methodStatus,
                                       ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    bool ParsePropertyEnd();

    ir::Expression *ParsePropertyDefinition(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::TSTypeParameter *ParseTsTypeParameter(bool throwError, bool addBinding = false);
    ir::TSTypeParameterDeclaration *ParseTsTypeParameterDeclaration(bool throwError = true);
    ir::TSTypeParameterInstantiation *ParseTsTypeParameterInstantiation(bool throwError = true);
    ir::ScriptFunction *ParseFunction(ParserStatus newStatus = ParserStatus::NO_OPTS, bool isDeclare = false);
    void ValidateFunctionParam(const ArenaVector<ir::Expression *> &params, const ir::Expression *parameter,
                               bool *seenOptional);
    void ValidateTsFunctionOverloadParams(const ArenaVector<ir::Expression *> &params);
    void CheckAccessorPair(const ArenaVector<ir::Statement *> &properties, const ir::Expression *propName,
                           ir::MethodDefinitionKind methodKind, ir::ModifierFlags access, bool hasDecorator,
                           lexer::SourcePosition errorInfo);
    ArenaVector<ir::Expression *> ParseFunctionParams(bool isDeclare = false);
    ir::SpreadElement *ParseSpreadElement(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::TSParameterProperty *CreateTsParameterProperty(ir::Expression *parameter, ir::ModifierFlags modifiers);
    ir::Expression *ParseFunctionParameter(bool isDeclare);
    void CreateTSVariableForProperty(ir::AstNode *node, const ir::Expression *key, binder::VariableFlags flags);
    void CheckObjectTypeForDuplicatedProperties(ir::Expression *member, ArenaVector<ir::Expression *> const &members);

    // ExpressionParser.Cpp

    ir::Expression *ParseExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::ArrowFunctionExpression *ParseTsGenericArrowFunction();
    ir::TSTypeAssertion *ParseTsTypeAssertion(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::TSAsExpression *ParseTsAsExpression(ir::Expression *expr, ExpressionParseFlags flags);
    ir::Expression *ParseArrayExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::YieldExpression *ParseYieldExpression();
    ir::Expression *ParsePotentialExpressionSequence(ir::Expression *expr, ExpressionParseFlags flags);
    ParserStatus ValidateArrowParameter(ir::Expression *expr);

    ArrowFunctionDescriptor ConvertToArrowParameter(ir::Expression *expr, bool isAsync,
                                                    binder::FunctionParamScope *paramScope);
    ir::ArrowFunctionExpression *ParseArrowFunctionExpressionBody(ArrowFunctionContext *arrowFunctionContext,
                                                                  binder::FunctionScope *functionScope,
                                                                  ArrowFunctionDescriptor *desc,
                                                                  ir::TSTypeParameterDeclaration *typeParamDecl,
                                                                  ir::Expression *returnTypeAnnotation);
    ir::ArrowFunctionExpression *ParseArrowFunctionExpression(ir::Expression *expr,
                                                              ir::TSTypeParameterDeclaration *typeParamDecl,
                                                              ir::Expression *returnTypeAnnotation, bool isAsync);
    ir::Expression *ParseCoverParenthesizedExpressionAndArrowParameterList();
    ir::Expression *ParseKeywordExpression();
    ir::Expression *ParseBinaryExpression(ir::Expression *left);
    ir::CallExpression *ParseCallExpression(ir::Expression *callee, bool isOptionalChain = false, bool isAsync = false);
    ir::ArrowFunctionExpression *ParsePotentialArrowExpression(ir::Expression **returnExpression,
                                                               const lexer::SourcePosition &startLoc);

    void ValidateUpdateExpression(ir::Expression *returnExpression, bool isChainExpression);
    bool ParsePotentialTsGenericFunctionCall(ir::Expression **returnExpression, const lexer::SourcePosition &startLoc,
                                             bool ignoreCallExpression);
    ir::Expression *ParsePostPrimaryExpression(ir::Expression *primaryExpr, lexer::SourcePosition startLoc,
                                               bool ignoreCallExpression, bool *isChainExpression);
    ir::Expression *ParseMemberExpression(bool ignoreCallExpression = false,
                                          ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::ObjectExpression *ParseObjectExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::SequenceExpression *ParseSequenceExpression(ir::Expression *startExpr, bool acceptRest = false,
                                                    bool acceptTsParam = false);
    ir::Expression *ParseUnaryOrPrefixUpdateExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::Expression *ParseLeftHandSideExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::MetaProperty *ParsePotentialNewTarget();
    void CheckInvalidDestructuring(const ir::AstNode *object) const;
    void ValidateParenthesizedExpression(ir::Expression *lhsExpression);
    ir::Expression *ParseAssignmentExpression(ir::Expression *lhsExpression,
                                              ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::Expression *ParsePrimaryExpression(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS);
    ir::NewExpression *ParseNewExpression();
    void ParsePotentialTsFunctionParameter(ExpressionParseFlags flags, ir::Expression *returnNode,
                                           bool isDeclare = false);
    ir::Expression *ParsePatternElement(ExpressionParseFlags flags = ExpressionParseFlags::NO_OPTS,
                                        bool allowDefault = true, bool isDeclare = false);
    ir::TemplateLiteral *ParseTemplateLiteral();
    ir::Expression *ParseImportExpression();
    ir::FunctionExpression *ParseFunctionExpression(ParserStatus newStatus = ParserStatus::NO_OPTS);
    ir::Expression *ParseOptionalChain(ir::Expression *leftSideExpr);
    void ParseNameSpaceImport(ArenaVector<ir::AstNode *> *specifiers);
    ir::Identifier *ParseNamedImport(const lexer::Token &importedToken);

    ir::StringLiteral *ParseFromClause(bool requireFrom = true);
    void ParseNamedImportSpecifiers(ArenaVector<ir::AstNode *> *specifiers);
    ir::Expression *ParseModuleReference();
    ir::AstNode *ParseImportDefaultSpecifier(ArenaVector<ir::AstNode *> *specifiers);
    ir::AstNode *ParseImportSpecifiers(ArenaVector<ir::AstNode *> *specifiers);
    void ValidateAssignmentTarget(ExpressionParseFlags flags, ir::Expression *node);
    void ValidateLvalueAssignmentTarget(ir::Expression *node);
    void ValidateArrowParameterBindings(const ir::Expression *node);

    ir::ExportDefaultDeclaration *ParseExportDefaultDeclaration(const lexer::SourcePosition &startLoc,
                                                                ArenaVector<ir::Decorator *> decorators,
                                                                bool isExportEquals = false);
    ir::ExportAllDeclaration *ParseExportAllDeclaration(const lexer::SourcePosition &startLoc);
    ir::ExportNamedDeclaration *ParseExportNamedSpecifiers(const lexer::SourcePosition &startLoc);
    ir::ExportNamedDeclaration *ParseNamedExportDeclaration(const lexer::SourcePosition &startLoc,
                                                            ArenaVector<ir::Decorator *> &&decorators);
    ir::Identifier *ParseNamedExport(const lexer::Token &exportedToken);
    void CheckStrictReservedWord() const;

    // StatementParser.Cpp

    void ConsumeSemicolon(ir::Statement *statement);
    void CheckFunctionDeclaration(StatementParsingFlags flags);

    void CheckLabelledFunction(const ir::Statement *node);
    void CheckDeclare();

    bool IsLabelFollowedByIterationStatement();

    void AddImportEntryItem(const ir::StringLiteral *source, const ArenaVector<ir::AstNode *> *specifiers);
    void AddExportNamedEntryItem(const ArenaVector<ir::ExportSpecifier *> &specifiers, const ir::StringLiteral *source);
    void AddExportStarEntryItem(const lexer::SourcePosition &startLoc, const ir::StringLiteral *source,
                                const ir::Identifier *exported);
    void AddExportDefaultEntryItem(const ir::AstNode *declNode);
    void AddExportLocalEntryItem(const ir::Statement *declNode, bool isTsModule);
    parser::SourceTextModuleRecord *GetSourceTextModuleRecord();

    bool ParseDirective(ArenaVector<ir::Statement *> *statements);
    void ParseDirectivePrologue(ArenaVector<ir::Statement *> *statements);
    ArenaVector<ir::Statement *> ParseStatementList(StatementParsingFlags flags = StatementParsingFlags::ALLOW_LEXICAL);
    ir::Statement *ParseStatement(StatementParsingFlags flags = StatementParsingFlags::NONE);
    ir::TSModuleDeclaration *ParseTsModuleDeclaration(bool isDeclare, bool isExport = false);
    ir::TSModuleDeclaration *ParseTsAmbientExternalModuleDeclaration(const lexer::SourcePosition &startLoc,
                                                                     bool isDeclare);
    ir::TSModuleDeclaration *ParseTsModuleOrNamespaceDelaration(const lexer::SourcePosition &startLoc,
                                                                bool isDeclare,
                                                                bool isExport);

    ir::TSImportEqualsDeclaration *ParseTsImportEqualsDeclaration(const lexer::SourcePosition &startLoc,
                                                                  bool isExport = false);
    ir::TSModuleBlock *ParseTsModuleBlock();
    ir::BlockStatement *ParseFunctionBody();
    ir::BlockStatement *ParseBlockStatement();
    ir::BlockStatement *ParseBlockStatement(binder::Scope *scope);
    ir::EmptyStatement *ParseEmptyStatement();
    ir::DebuggerStatement *ParseDebuggerStatement();
    ir::BreakStatement *ParseBreakStatement();
    ir::ContinueStatement *ParseContinueStatement();
    ir::DoWhileStatement *ParseDoWhileStatement();
    ir::Statement *ParsePotentialExpressionStatement(StatementParsingFlags flags, bool isDeclare);
    ir::Statement *ParseVarStatement(bool isDeclare);
    ir::Statement *ParseLetStatement(StatementParsingFlags flags, bool isDeclare);
    ir::Statement *ParseConstStatement(StatementParsingFlags flags, bool isDeclare);
    ir::Statement *ParseExpressionStatement(StatementParsingFlags flags = StatementParsingFlags::NONE);
    ir::Statement *ParseFunctionStatement(StatementParsingFlags flags, bool isDeclare);
    ir::FunctionDeclaration *ParseFunctionDeclaration(bool canBeAnonymous = false,
                                                      ParserStatus newStatus = ParserStatus::NO_OPTS,
                                                      bool isDeclare = false);
    ir::Statement *ParseExportDeclaration(StatementParsingFlags flags, ArenaVector<ir::Decorator *> &&decorators);
    std::tuple<ForStatementKind, ir::AstNode *, ir::Expression *, ir::Expression *> ParseForInOf(
        ir::Expression *leftNode, ExpressionParseFlags exprFlags, bool isAwait);
    std::tuple<ForStatementKind, ir::Expression *, ir::Expression *> ParseForInOf(ir::AstNode *initNode,
                                                                                  ExpressionParseFlags exprFlags,
                                                                                  bool isAwait);
    std::tuple<ir::Expression *, ir::Expression *> ParseForUpdate(bool isAwait);
    ir::Statement *ParseForStatement();
    ir::IfStatement *ParseIfStatement();

    ir::Statement *ParseImportDeclaration(StatementParsingFlags flags);
    ir::LabelledStatement *ParseLabelledStatement(const lexer::LexerPosition &pos);
    ir::ReturnStatement *ParseReturnStatement();
    ir::ClassDeclaration *ParseClassStatement(StatementParsingFlags flags, bool isDeclare,
                                              ArenaVector<ir::Decorator *> &&decorators, bool isAbstract = false);
    ir::ClassDeclaration *ParseClassDeclaration(bool idRequired, ArenaVector<ir::Decorator *> &&decorators,
                                                bool isDeclare = false, bool isAbstract = false,
                                                bool isExported = false);
    ir::TSTypeAliasDeclaration *ParseTsTypeAliasDeclaration(bool isDeclare);
    ir::TSEnumDeclaration *ParseEnumMembers(ir::Identifier *key, const lexer::SourcePosition &enumStart, bool isConst);
    ir::TSEnumDeclaration *ParseEnumDeclaration(bool isConst = false);
    ir::TSInterfaceDeclaration *ParseTsInterfaceDeclaration();
    ir::SwitchCaseStatement *ParseSwitchCaseStatement(bool *seenDefault);
    ir::SwitchStatement *ParseSwitchStatement();
    ir::ThrowStatement *ParseThrowStatement();
    ir::Expression *ParseCatchParam();
    ir::CatchClause *ParseCatchClause();
    ir::TryStatement *ParseTryStatement();
    void ValidateDeclaratorId();
    ir::VariableDeclarator *ParseVariableDeclaratorInitializer(ir::Expression *init, VariableParsingFlags flags,
                                                               const lexer::SourcePosition &startLoc, bool isDeclare);
    ir::VariableDeclarator *ParseVariableDeclarator(VariableParsingFlags flags, bool isDeclare);
    ir::Statement *ParseVariableDeclaration(VariableParsingFlags flags = VariableParsingFlags::NO_OPTS,
                                            bool isDeclare = false);
    ir::WhileStatement *ParseWhileStatement();
    ir::VariableDeclaration *ParseContextualLet(VariableParsingFlags flags,
                                                StatementParsingFlags stmFlags = StatementParsingFlags::ALLOW_LEXICAL,
                                                bool isDeclare = false);

    util::StringView GetNamespaceExportInternalName()
    {
        std::string name = std::string(parser::SourceTextModuleRecord::ANONY_NAMESPACE_NAME) +
                           std::to_string(namespaceExportCount_++);
        util::UString internalName(name, Allocator());
        return internalName.View();
    }

    binder::Binder *Binder()
    {
        return program_.Binder();
    }

    friend class Lexer;
    friend class SavedParserContext;
    friend class ArrowFunctionContext;

    Program program_;
    ParserContext context_;
    lexer::Lexer *lexer_ {nullptr};
    size_t namespaceExportCount_ {0};
};

template <ParserStatus status>
class SavedStatusContext {
public:
    explicit SavedStatusContext(ParserContext *ctx)
        // NOLINTNEXTLINE(readability-magic-numbers)
        : ctx_(ctx), savedStatus_(static_cast<ParserStatus>(ctx->Status()))
    {
        // NOLINTNEXTLINE(readability-magic-numbers)
        ctx->Status() |= status;
    }

    NO_COPY_SEMANTIC(SavedStatusContext);
    NO_MOVE_SEMANTIC(SavedStatusContext);

    ~SavedStatusContext()
    {
        ctx_->Status() = savedStatus_;
    }

private:
    ParserContext *ctx_;
    ParserStatus savedStatus_;
};

class SwitchContext : public SavedStatusContext<ParserStatus::IN_SWITCH> {
public:
    explicit SwitchContext(ParserContext *ctx) : SavedStatusContext(ctx) {}
    NO_COPY_SEMANTIC(SwitchContext);
    NO_MOVE_SEMANTIC(SwitchContext);
    ~SwitchContext() = default;
};

template <typename T>
class IterationContext : public SavedStatusContext<ParserStatus::IN_ITERATION> {
public:
    explicit IterationContext(ParserContext *ctx, binder::Binder *binder)
        : SavedStatusContext(ctx), lexicalScope_(binder)
    {
    }

    NO_COPY_SEMANTIC(IterationContext);
    NO_MOVE_SEMANTIC(IterationContext);
    ~IterationContext() = default;

    const auto &LexicalScope() const
    {
        return lexicalScope_;
    }

private:
    binder::LexicalScope<T> lexicalScope_;
};

class FunctionParameterContext : public SavedStatusContext<ParserStatus::FUNCTION_PARAM> {
public:
    explicit FunctionParameterContext(ParserContext *ctx, binder::Binder *binder)
        : SavedStatusContext(ctx), lexicalScope_(binder)
    {
    }

    const auto &LexicalScope() const
    {
        return lexicalScope_;
    }

    NO_COPY_SEMANTIC(FunctionParameterContext);
    NO_MOVE_SEMANTIC(FunctionParameterContext);
    ~FunctionParameterContext() = default;

private:
    binder::LexicalScope<binder::FunctionParamScope> lexicalScope_;
};

class SavedParserContext {
public:
    template <typename... Args>
    explicit SavedParserContext(ParserImpl *parser, Args &&... args) : parser_(parser), prev_(parser->context_)
    {
        parser_->context_ = ParserContext(&prev_, std::forward<Args>(args)...);
    }

    NO_COPY_SEMANTIC(SavedParserContext);
    DEFAULT_MOVE_SEMANTIC(SavedParserContext);

    ~SavedParserContext()
    {
        parser_->context_ = prev_;
    }

protected:
    binder::Binder *Binder()
    {
        return parser_->Binder();
    }

    ParserImpl *parser_;
    ParserContext prev_;
};

class FunctionContext : public SavedParserContext {
public:
    explicit FunctionContext(ParserImpl *parser, ParserStatus newStatus) : SavedParserContext(parser, newStatus)
    {
        if (newStatus & ParserStatus::GENERATOR_FUNCTION) {
            flags_ |= ir::ScriptFunctionFlags::GENERATOR;
        }

        if (newStatus & ParserStatus::ASYNC_FUNCTION) {
            flags_ |= ir::ScriptFunctionFlags::ASYNC;
        }

        if (newStatus & ParserStatus::CONSTRUCTOR_FUNCTION) {
            flags_ |= ir::ScriptFunctionFlags::CONSTRUCTOR;
        }
    }

    ir::ScriptFunctionFlags Flags() const
    {
        return flags_;
    }

    void AddFlag(ir::ScriptFunctionFlags flags)
    {
        flags_ |= flags;
    }

    NO_COPY_SEMANTIC(FunctionContext);
    NO_MOVE_SEMANTIC(FunctionContext);
    ~FunctionContext() = default;

protected:
    ir::ScriptFunctionFlags flags_ {ir::ScriptFunctionFlags::NONE};
};

class ArrowFunctionContext : public FunctionContext {
public:
    explicit ArrowFunctionContext(ParserImpl *parser, bool isAsync)
        : FunctionContext(parser, InitialFlags(parser->context_.Status()))
    {
        if (isAsync) {
            AddFlag(ir::ScriptFunctionFlags::ASYNC);
        }

        AddFlag(ir::ScriptFunctionFlags::ARROW);
    }

    NO_COPY_SEMANTIC(ArrowFunctionContext);
    NO_MOVE_SEMANTIC(ArrowFunctionContext);
    ~ArrowFunctionContext() = default;

private:
    static ParserStatus InitialFlags(ParserStatus currentStatus)
    {
        return ParserStatus::FUNCTION | ParserStatus::ARROW_FUNCTION |
               static_cast<ParserStatus>(currentStatus & (ParserStatus::ALLOW_SUPER | ParserStatus::ALLOW_SUPER_CALL));
    }
};

}  // namespace panda::es2panda::parser

#endif
