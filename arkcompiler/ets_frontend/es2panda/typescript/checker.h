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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_CHECKER_H
#define ES2PANDA_COMPILER_TYPESCRIPT_CHECKER_H

#include <binder/enumMemberResult.h>
#include <typescript/types/globalTypesHolder.h>
#include <typescript/types/typeRelation.h>
#include <typescript/types/types.h>
#include <typescript/core/checkerContext.h>
#include <macros.h>
#include <util/enumbitops.h>
#include <util/ustring.h>

#include <cstdint>
#include <initializer_list>
#include <unordered_map>
#include <unordered_set>

namespace panda::es2panda::binder {
class Binder;
class Decl;
class EnumVariable;
class FunctionDecl;
class LocalVariable;
class Scope;
class Variable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::ir {
class AstNode;
class SpreadElement;
class AssignmentExpression;
class Property;
class Expression;
class ScriptFunction;
class UnaryExpression;
class BinaryExpression;
class Identifier;
class MemberExpression;
class TSEnumDeclaration;
class TSInterfaceDeclaration;
class ObjectExpression;
class TSArrayType;
class TSUnionType;
class TSFunctionType;
class TSConstructorType;
class TSTypeLiteral;
class TSTypeReference;
class TSQualifiedName;
class TSIndexedAccessType;
class TSInterfaceHeritage;
class TSTypeQuery;
class TSTupleType;
class ArrayExpression;
class Statement;
class TSTypeParameterDeclaration;
class TSTypeParameterInstantiation;
class BlockStatement;
class VariableDeclaration;
class IfStatement;
class DoWhileStatement;
class WhileStatement;
class ForUpdateStatement;
class ForInStatement;
class ForOfStatement;
class ReturnStatement;
class SwitchStatement;
class LabelledStatement;
class ThrowStatement;
class TryStatement;
class TSTypeAliasDeclaration;
class TSAsExpression;
class ThisExpression;
class NewExpression;
class FunctionExpression;
class AwaitExpression;
class UpdateExpression;
class ConditionalExpression;
class YieldExpression;
class ArrowFunctionExpression;
class TemplateLiteral;
class TaggedTemplateExpression;
class TSIndexSignature;
class TSSignatureDeclaration;
class TSPropertySignature;
class TSMethodSignature;
class ChainExpression;
class VariableDeclarator;

enum class AstNodeType;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::checker {

using StringLiteralPool = std::unordered_map<util::StringView, Type *>;
using NumberLiteralPool = std::unordered_map<double, Type *>;
using FunctionParamsResolveResult = std::variant<std::vector<binder::LocalVariable *> &, bool>;
using InterfacePropertyMap = std::unordered_map<util::StringView, std::pair<binder::LocalVariable *, InterfaceType *>>;
using TypeOrNode = std::variant<Type *, const ir::AstNode *>;
using IndexInfoTypePair = std::pair<Type *, Type *>;
using PropertyMap = std::unordered_map<util::StringView, binder::LocalVariable *>;
using ArgRange = std::pair<uint32_t, uint32_t>;

class Checker {
public:
    explicit Checker(ArenaAllocator *allocator, binder::Binder *binder);
    ~Checker() = default;
    NO_COPY_SEMANTIC(Checker);
    NO_MOVE_SEMANTIC(Checker);

    ArenaAllocator *Allocator() const
    {
        return allocator_;
    }

    binder::Binder *Binder()
    {
        return binder_;
    }

    binder::Scope *Scope() const
    {
        return scope_;
    }

    Type *GlobalNumberType()
    {
        return globalTypes_->GlobalNumberType();
    }

    Type *GlobalAnyType()
    {
        return globalTypes_->GlobalAnyType();
    }

    Type *GlobalStringType()
    {
        return globalTypes_->GlobalStringType();
    }

    Type *GlobalSymbolType()
    {
        return globalTypes_->GlobalSymbolType();
    }

    Type *GlobalBooleanType()
    {
        return globalTypes_->GlobalBooleanType();
    }

    Type *GlobalVoidType()
    {
        return globalTypes_->GlobalVoidType();
    }

    Type *GlobalNullType()
    {
        return globalTypes_->GlobalNullType();
    }

    Type *GlobalUndefinedType()
    {
        return globalTypes_->GlobalUndefinedType();
    }

    Type *GlobalUnknownType()
    {
        return globalTypes_->GlobalUnknownType();
    }

    Type *GlobalNeverType()
    {
        return globalTypes_->GlobalNeverType();
    }

    Type *GlobalNonPrimitiveType()
    {
        return globalTypes_->GlobalNonPrimitiveType();
    }

    Type *GlobalBigintType()
    {
        return globalTypes_->GlobalBigintType();
    }

    Type *GlobalFalseType()
    {
        return globalTypes_->GlobalFalseType();
    }

    Type *GlobalTrueType()
    {
        return globalTypes_->GlobalTrueType();
    }

    Type *GlobalNumberOrBigintType()
    {
        return globalTypes_->GlobalNumberOrBigintType();
    }

    Type *GlobalStringOrNumberType()
    {
        return globalTypes_->GlobalStringOrNumberType();
    }

    Type *GlobalZeroType()
    {
        return globalTypes_->GlobalZeroType();
    }

    Type *GlobalEmptyStringType()
    {
        return globalTypes_->GlobalEmptyStringType();
    }

    Type *GlobalZeroBigintType()
    {
        return globalTypes_->GlobalZeroBigintType();
    }

    Type *GlobalPrimitiveType()
    {
        return globalTypes_->GlobalPrimitiveType();
    }

    Type *GlobalEmptyTupleType()
    {
        return globalTypes_->GlobalEmptyTupleType();
    }

    Type *GlobalEmptyObjectType()
    {
        return globalTypes_->GlobalEmptyObjectType();
    }

    Type *GlobalResolvingReturnType()
    {
        return globalTypes_->GlobalResolvingReturnType();
    }

    Type *GlobalErrorType()
    {
        return globalTypes_->GlobalErrorType();
    }

    CheckerContext Context() const
    {
        return context_;
    }

    bool HasStatus(CheckerStatus status)
    {
        return (context_.Status() & status) != 0;
    }

    void RemoveStatus(CheckerStatus status)
    {
        context_.Status() &= ~status;
    }

    void AddStatus(CheckerStatus status)
    {
        context_.Status() |= status;
    }

    NumberLiteralPool &NumberLiteralMap()
    {
        return numberLiteralMap_;
    }

    StringLiteralPool &StringLiteralMap()
    {
        return stringLiteralMap_;
    }

    StringLiteralPool &BigintLiteralMap()
    {
        return bigintLiteralMap_;
    }

    TypeRelation *Relation()
    {
        return relation_;
    }

    RelationHolder &IdenticalResults()
    {
        return identicalResults_;
    }

    RelationHolder &AssignableResults()
    {
        return assignableResults_;
    }

    RelationHolder &ComparableResults()
    {
        return comparableResults_;
    }

    std::unordered_set<const void *> &TypeStack()
    {
        return typeStack_;
    }

    std::unordered_map<const ir::AstNode *, Type *> &NodeCache()
    {
        return nodeCache_;
    }

    void StartChecker();

    Type *CheckTypeCached(const ir::Expression *expr);

    [[noreturn]] void ThrowTypeError(std::string_view message, const lexer::SourcePosition &pos);
    [[noreturn]] void ThrowTypeError(std::initializer_list<TypeErrorMessageElement> list,
                                     const lexer::SourcePosition &pos);

    // Util
    static bool InAssignment(const ir::AstNode *node);
    static bool IsAssignmentOperator(lexer::TokenType op);
    static bool IsLiteralType(const Type *type);
    static const ir::AstNode *FindAncestorGivenByType(const ir::AstNode *node, ir::AstNodeType type);
    static const ir::AstNode *FindAncestorUntilGivenType(const ir::AstNode *node, ir::AstNodeType stop);
    static bool MaybeTypeOfKind(const Type *type, TypeFlag flags);
    static bool MaybeTypeOfKind(const Type *type, ObjectType::ObjectTypeKind kind);
    static bool IsConstantMemberAccess(const ir::Expression *expr);
    static bool IsStringLike(const ir::Expression *expr);
    static const ir::TSQualifiedName *ResolveLeftMostQualifiedName(const ir::TSQualifiedName *qualifiedName);
    static const ir::MemberExpression *ResolveLeftMostMemberExpression(const ir::MemberExpression *expr);

    // Helpers
    void CheckTruthinessOfType(Type *type, lexer::SourcePosition lineInfo);
    Type *CheckNonNullType(Type *type, lexer::SourcePosition lineInfo);
    Type *GetBaseTypeOfLiteralType(Type *type);
    void CheckReferenceExpression(const ir::Expression *expr, const char *invalidReferenceMsg,
                                  const char *invalidOptionalChainMsg);
    void CheckTestingKnownTruthyCallableOrAwaitableType(const ir::Expression *condExpr, Type *type,
                                                        const ir::AstNode *body);
    Type *ExtractDefinitelyFalsyTypes(Type *type);
    Type *RemoveDefinitelyFalsyTypes(Type *type);
    TypeFlag GetFalsyFlags(Type *type);
    bool IsVariableUsedInConditionBody(const ir::AstNode *parent, binder::Variable *searchVar);
    bool FindVariableInBinaryExpressionChain(const ir::AstNode *parent, binder::Variable *searchVar);
    bool IsVariableUsedInBinaryExpressionChain(const ir::AstNode *parent, binder::Variable *searchVar);
    [[noreturn]] void ThrowBinaryLikeError(lexer::TokenType op, Type *leftType, Type *rightType,
                                           lexer::SourcePosition lineInfo);
    [[noreturn]] void ThrowAssignmentError(Type *source, Type *target, lexer::SourcePosition lineInfo,
                                           bool isAsSrcLeftType = false);
    void ElaborateElementwise(Type *targetType, const ir::Expression *sourceNode, const lexer::SourcePosition &pos);
    void InferSimpleVariableDeclaratorType(const ir::VariableDeclarator *declarator);
    Type *GetTypeOfVariable(binder::Variable *var);
    Type *GetUnaryResultType(Type *operandType);
    Type *GetTypeFromClassOrInterfaceReference(const ir::TSTypeReference *node, binder::Variable *var);
    Type *GetTypeFromTypeAliasReference(const ir::TSTypeReference *node, binder::Variable *var);
    Type *GetTypeReferenceType(const ir::TSTypeReference *node, binder::Variable *var);

    // Type creation
    Type *CreateNumberLiteralType(double value);
    Type *CreateBigintLiteralType(const util::StringView &str, bool negative);
    Type *CreateStringLiteralType(const util::StringView &str);
    Type *CreateFunctionTypeWithSignature(Signature *callSignature);
    Type *CreateConstructorTypeWithSignature(Signature *constructSignature);
    Type *CreateTupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags, ElementFlags combinedFlags,
                          uint32_t minLength, uint32_t fixedLength, bool readonly);
    Type *CreateTupleType(ObjectDescriptor *desc, ArenaVector<ElementFlags> &&elementFlags, ElementFlags combinedFlags,
                          uint32_t minLength, uint32_t fixedLength, bool readonly, NamedTupleMemberPool &&namedMembers);
    Type *CreateUnionType(std::initializer_list<Type *> constituentTypes);
    Type *CreateUnionType(ArenaVector<Type *> &&constituentTypes);
    Type *CreateUnionType(ArenaVector<Type *> &constituentTypes);
    Type *CreateObjectTypeWithCallSignature(Signature *callSignature);
    Type *CreateObjectTypeWithConstructSignature(Signature *constructSignature);

    // Object
    void ResolvePropertiesOfObjectType(ObjectType *type, const ir::Expression *member,
                                       ArenaVector<const ir::TSSignatureDeclaration *> &signatureDeclarations,
                                       ArenaVector<const ir::TSIndexSignature *> &indexDeclarations, bool isInterface);
    void ResolveSignaturesOfObjectType(ObjectType *type,
                                       ArenaVector<const ir::TSSignatureDeclaration *> &signatureDeclarations);
    void ResolveIndexInfosOfObjectType(ObjectType *type, ArenaVector<const ir::TSIndexSignature *> &indexDeclarations);
    void ResolveDeclaredMembers(InterfaceType *type);
    bool ValidateInterfaceMemberRedeclaration(ObjectType *type, binder::Variable *prop,
                                              const lexer::SourcePosition &locInfo);
    binder::Variable *GetPropertyOfType(Type *type, const util::StringView &name, bool getPartial = false,
                                        binder::VariableFlags propagateFlags = binder::VariableFlags::NONE);
    binder::Variable *GetPropertyOfUnionType(UnionType *type, const util::StringView &name, bool getPartial,
                                             binder::VariableFlags propagateFlags);
    void CheckIndexConstraints(Type *type);
    void ResolveStructuredTypeMembers(Type *type);
    void ResolveUnionTypeMembers(UnionType *type);
    void ResolveObjectTypeMembers(ObjectType *type);
    void ResolveInterfaceOrClassTypeMembers(InterfaceType *type);
    Type *CheckComputedPropertyName(const ir::Expression *key);
    Type *GetPropertyTypeForIndexType(Type *type, Type *indexType);
    IndexInfo *GetApplicableIndexInfo(Type *type, Type *indexType);
    ArenaVector<ObjectType *> GetBaseTypes(InterfaceType *type);

    // Function
    Type *HandleFunctionReturn(const ir::ScriptFunction *func);
    void CheckFunctionParameterDeclarations(const ArenaVector<ir::Expression *> &params, SignatureInfo *signatureInfo);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionParameter(
        const ir::Expression *param, SignatureInfo *signatureInfo);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionIdentifierParameter(
        const ir::Identifier *param);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionAssignmentPatternParameter(
        const ir::AssignmentExpression *param);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionRestParameter(
        const ir::SpreadElement *param, SignatureInfo *signatureInfo);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionArrayPatternParameter(
        const ir::ArrayExpression *param);
    std::tuple<binder::LocalVariable *, binder::LocalVariable *, bool> CheckFunctionObjectPatternParameter(
        const ir::ObjectExpression *param);
    void InferFunctionDeclarationType(const binder::FunctionDecl *decl, binder::Variable *funcVar);
    void CollectTypesFromReturnStatements(const ir::AstNode *parent, ArenaVector<Type *> *returnTypes);
    void CheckAllCodePathsInNonVoidFunctionReturnOrThrow(const ir::ScriptFunction *func, lexer::SourcePosition lineInfo,
                                                         const char *errMsg);
    void CreatePatternParameterName(const ir::AstNode *node, std::stringstream &ss);
    void ThrowReturnTypeCircularityError(const ir::ScriptFunction *func);
    ArgRange GetArgRange(const ArenaVector<Signature *> &signatures, ArenaVector<Signature *> *potentialSignatures,
                         uint32_t callArgsSize, bool *haveSignatureWithRest);
    bool CallMatchesSignature(const ArenaVector<ir::Expression *> &args, Signature *signature, bool throwError);
    Type *resolveCallOrNewExpression(const ArenaVector<Signature *> &signatures,
                                     ArenaVector<ir::Expression *> arguments, const lexer::SourcePosition &errPos);
    Type *CreateParameterTypeForArrayAssignmentPattern(const ir::ArrayExpression *arrayPattern, Type *inferedType);
    Type *CreateParameterTypeForObjectAssignmentPattern(const ir::ObjectExpression *objectPattern, Type *inferedType);

    // Type relation
    bool IsTypeIdenticalTo(Type *source, Type *target);
    bool IsTypeIdenticalTo(Type *source, Type *target, const std::string &errMsg, const lexer::SourcePosition &errPos);
    bool IsTypeIdenticalTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                           const lexer::SourcePosition &errPos);
    bool IsTypeAssignableTo(Type *source, Type *target);
    bool IsTypeAssignableTo(Type *source, Type *target, const std::string &errMsg, const lexer::SourcePosition &errPos);
    bool IsTypeAssignableTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                            const lexer::SourcePosition &errPos);
    bool IsTypeComparableTo(Type *source, Type *target);
    bool IsTypeComparableTo(Type *source, Type *target, const std::string &errMsg, const lexer::SourcePosition &errPos);
    bool IsTypeComparableTo(Type *source, Type *target, std::initializer_list<TypeErrorMessageElement> list,
                            const lexer::SourcePosition &errPos);
    bool AreTypesComparable(Type *source, Type *target);
    bool IsTypeEqualityComparableTo(Type *source, Type *target);
    bool IsAllTypesAssignableTo(Type *source, Type *target);

    // Binary like expression
    Type *CheckBinaryOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                              const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op);
    Type *CheckPlusOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                            const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op);
    Type *CheckCompareOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                               const ir::Expression *rightExpr, const ir::AstNode *expr, lexer::TokenType op);
    Type *CheckAndOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr);
    Type *CheckOrOperator(Type *leftType, Type *rightType, const ir::Expression *leftExpr);
    Type *CheckInstanceofExpression(Type *leftType, Type *rightType, const ir::Expression *rightExpr,
                                    const ir::AstNode *expr);
    Type *CheckInExpression(Type *leftType, Type *rightType, const ir::Expression *leftExpr,
                            const ir::Expression *rightExpr, const ir::AstNode *expr);
    void CheckAssignmentOperator(lexer::TokenType op, const ir::Expression *leftExpr, Type *leftType, Type *valueType);

    friend class ScopeContext;
    friend class SavedCheckerContext;

private:
    ArenaAllocator *allocator_;
    binder::Binder *binder_;
    const ir::BlockStatement *rootNode_;
    binder::Scope *scope_;
    CheckerContext context_;
    GlobalTypesHolder *globalTypes_;

    NumberLiteralPool numberLiteralMap_;
    StringLiteralPool stringLiteralMap_;
    StringLiteralPool bigintLiteralMap_;

    TypeRelation *relation_;

    RelationHolder identicalResults_;
    RelationHolder assignableResults_;
    RelationHolder comparableResults_;

    std::unordered_set<const void *> typeStack_;
    std::unordered_map<const ir::AstNode *, Type *> nodeCache_;
    std::vector<binder::Scope *> scopeStack_;
};

class ScopeContext {
public:
    explicit ScopeContext(Checker *checker, binder::Scope *newScope) : checker_(checker), prevScope_(checker_->scope_)
    {
        checker_->scope_ = newScope;
    }

    ~ScopeContext()
    {
        checker_->scope_ = prevScope_;
    }

    NO_COPY_SEMANTIC(ScopeContext);
    NO_MOVE_SEMANTIC(ScopeContext);

private:
    Checker *checker_;
    binder::Scope *prevScope_;
};

class SavedCheckerContext {
public:
    explicit SavedCheckerContext(Checker *checker, CheckerStatus newStatus)
        : checker_(checker), prev_(checker->context_)
    {
        checker_->context_ = CheckerContext(newStatus);
    }

    NO_COPY_SEMANTIC(SavedCheckerContext);
    DEFAULT_MOVE_SEMANTIC(SavedCheckerContext);

    ~SavedCheckerContext()
    {
        checker_->context_ = prev_;
    }

private:
    Checker *checker_;
    CheckerContext prev_;
};

}  // namespace panda::es2panda::checker

#endif /* CHECKER_H */
