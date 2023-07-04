/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_IR_AST_NODE_MAPPING_H
#define ES2PANDA_IR_AST_NODE_MAPPING_H

#define AST_NODE_MAPPING(_)                                          \
    _(ARROW_FUNCTION_EXPRESSION, ArrowFunctionExpression)            \
    _(AWAIT_EXPRESSION, AwaitExpression)                             \
    _(BIGINT_LITERAL, BigIntLiteral)                                 \
    _(BINARY_EXPRESSION, BinaryExpression)                           \
    _(BLOCK_STATEMENT, BlockStatement)                               \
    _(BOOLEAN_LITERAL, BooleanLiteral)                               \
    _(BREAK_STATEMENT, BreakStatement)                               \
    _(CALL_EXPRESSION, CallExpression)                               \
    _(CATCH_CLAUSE, CatchClause)                                     \
    _(CHAIN_EXPRESSION, ChainExpression)                             \
    _(CLASS_DEFINITION, ClassDefinition)                             \
    _(CLASS_DECLARATION, ClassDeclaration)                           \
    _(CLASS_EXPRESSION, ClassExpression)                             \
    _(CLASS_PROPERTY, ClassProperty)                                 \
    _(CONDITIONAL_EXPRESSION, ConditionalExpression)                 \
    _(CONTINUE_STATEMENT, ContinueStatement)                         \
    _(DEBUGGER_STATEMENT, DebuggerStatement)                         \
    _(DECORATOR, Decorator)                                          \
    _(DO_WHILE_STATEMENT, DoWhileStatement)                          \
    _(EMPTY_STATEMENT, EmptyStatement)                               \
    _(EXPORT_ALL_DECLARATION, ExportAllDeclaration)                  \
    _(EXPORT_DEFAULT_DECLARATION, ExportDefaultDeclaration)          \
    _(EXPORT_NAMED_DECLARATION, ExportNamedDeclaration)              \
    _(EXPORT_SPECIFIER, ExportSpecifier)                             \
    _(EXPRESSION_STATEMENT, ExpressionStatement)                     \
    _(FOR_IN_STATEMENT, ForInStatement)                              \
    _(FOR_OF_STATEMENT, ForOfStatement)                              \
    _(FOR_UPDATE_STATEMENT, ForUpdateStatement)                      \
    _(FUNCTION_DECLARATION, FunctionDeclaration)                     \
    _(FUNCTION_EXPRESSION, FunctionExpression)                       \
    _(IDENTIFIER, Identifier)                                        \
    _(IF_STATEMENT, IfStatement)                                     \
    _(IMPORT_DECLARATION, ImportDeclaration)                         \
    _(IMPORT_EXPRESSION, ImportExpression)                           \
    _(IMPORT_DEFAULT_SPECIFIER, ImportDefaultSpecifier)              \
    _(IMPORT_NAMESPACE_SPECIFIER, ImportNamespaceSpecifier)          \
    _(IMPORT_SPECIFIER, ImportSpecifier)                             \
    _(LABELLED_STATEMENT, LabelledStatement)                         \
    _(MEMBER_EXPRESSION, MemberExpression)                           \
    _(META_PROPERTY_EXPRESSION, MetaProperty)                        \
    _(METHOD_DEFINITION, MethodDefinition)                           \
    _(NEW_EXPRESSION, NewExpression)                                 \
    _(NULL_LITERAL, NullLiteral)                                     \
    _(NUMBER_LITERAL, NumberLiteral)                                 \
    _(OMITTED_EXPRESSION, OmittedExpression)                         \
    _(PROPERTY, Property)                                            \
    _(REGEXP_LITERAL, RegExpLiteral)                                 \
    _(RETURN_STATEMENT, ReturnStatement)                             \
    _(SCRIPT_FUNCTION, ScriptFunction)                               \
    _(SEQUENCE_EXPRESSION, SequenceExpression)                       \
    _(STRING_LITERAL, StringLiteral)                                 \
    _(SUPER_EXPRESSION, SuperExpression)                             \
    _(SWITCH_CASE_STATEMENT, SwitchCaseStatement)                    \
    _(SWITCH_STATEMENT, SwitchStatement)                             \
    _(TS_ENUM_DECLARATION, TSEnumDeclaration)                        \
    _(TS_ENUM_MEMBER, TSEnumMember)                                  \
    _(TS_EXTERNAL_MODULE_REFERENCE, TSExternalModuleReference)       \
    _(TS_PRIVATE_IDENTIFIER, TSPrivateIdentifier)                    \
    _(TS_NUMBER_KEYWORD, TSNumberKeyword)                            \
    _(TS_ANY_KEYWORD, TSAnyKeyword)                                  \
    _(TS_STRING_KEYWORD, TSStringKeyword)                            \
    _(TS_SYMBOL_KEYWORD, TSSymbolKeyword)                            \
    _(TS_BOOLEAN_KEYWORD, TSBooleanKeyword)                          \
    _(TS_VOID_KEYWORD, TSVoidKeyword)                                \
    _(TS_UNDEFINED_KEYWORD, TSUndefinedKeyword)                      \
    _(TS_UNKNOWN_KEYWORD, TSUnknownKeyword)                          \
    _(TS_OBJECT_KEYWORD, TSObjectKeyword)                            \
    _(TS_BIGINT_KEYWORD, TSBigintKeyword)                            \
    _(TS_NEVER_KEYWORD, TSNeverKeyword)                              \
    _(TS_NON_NULL_EXPRESSION, TSNonNullExpression)                   \
    _(TS_NULL_KEYWORD, TSNullKeyword)                                \
    _(TS_OPTIONAL_TYPE, TSOptionalType)                              \
    _(TS_REST_TYPE, TSRestType)                                      \
    _(TS_ARRAY_TYPE, TSArrayType)                                    \
    _(TS_UNION_TYPE, TSUnionType)                                    \
    _(TS_TYPE_LITERAL, TSTypeLiteral)                                \
    _(TS_PROPERTY_SIGNATURE, TSPropertySignature)                    \
    _(TS_METHOD_SIGNATURE, TSMethodSignature)                        \
    _(TS_SIGNATURE_DECLARATION, TSSignatureDeclaration)              \
    _(TS_PARENT_TYPE, TSParenthesizedType)                           \
    _(TS_LITERAL_TYPE, TSLiteralType)                                \
    _(TS_TEMPLATE_LITERAL_TYPE, TSTemplateLiteralType)               \
    _(TS_INFER_TYPE, TSInferType)                                    \
    _(TS_CONDITIONAL_TYPE, TSConditionalType)                        \
    _(TS_IMPORT_TYPE, TSImportType)                                  \
    _(TS_INTERSECTION_TYPE, TSIntersectionType)                      \
    _(TS_MAPPED_TYPE, TSMappedType)                                  \
    _(TS_MODULE_BLOCK, TSModuleBlock)                                \
    _(TS_THIS_TYPE, TSThisType)                                      \
    _(TS_TYPE_OPERATOR, TSTypeOperator)                              \
    _(TS_TYPE_PARAMETER, TSTypeParameter)                            \
    _(TS_TYPE_PARAMETER_DECLARATION, TSTypeParameterDeclaration)     \
    _(TS_TYPE_PARAMETER_INSTANTIATION, TSTypeParameterInstantiation) \
    _(TS_TYPE_PREDICATE, TSTypePredicate)                            \
    _(TS_PARAMETER_PROPERTY, TSParameterProperty)                    \
    _(TS_MODULE_DECLARATION, TSModuleDeclaration)                    \
    _(TS_IMPORT_EQUALS_DECLARATION, TSImportEqualsDeclaration)       \
    _(TS_FUNCTION_TYPE, TSFunctionType)                              \
    _(TS_CONSTRUCTOR_TYPE, TSConstructorType)                        \
    _(TS_TYPE_ALIAS_DECLARATION, TSTypeAliasDeclaration)             \
    _(TS_TYPE_REFERENCE, TSTypeReference)                            \
    _(TS_QUALIFIED_NAME, TSQualifiedName)                            \
    _(TS_INDEXED_ACCESS_TYPE, TSIndexedAccessType)                   \
    _(TS_INTERFACE_DECLARATION, TSInterfaceDeclaration)              \
    _(TS_INTERFACE_BODY, TSInterfaceBody)                            \
    _(TS_INTERFACE_HERITAGE, TSInterfaceHeritage)                    \
    _(TS_TUPLE_TYPE, TSTupleType)                                    \
    _(TS_NAMED_TUPLE_MEMBER, TSNamedTupleMember)                     \
    _(TS_INDEX_SIGNATURE, TSIndexSignature)                          \
    _(TS_TYPE_QUERY, TSTypeQuery)                                    \
    _(TS_AS_EXPRESSION, TSAsExpression)                              \
    _(TS_CLASS_IMPLEMENTS, TSClassImplements)                        \
    _(TS_TYPE_ASSERTION, TSTypeAssertion)                            \
    _(TAGGED_TEMPLATE_EXPRESSION, TaggedTemplateExpression)          \
    _(TAGGED_LITERAL, TaggedLiteral)                                 \
    _(TEMPLATE_ELEMENT, TemplateElement)                             \
    _(TEMPLATE_LITERAL, TemplateLiteral)                             \
    _(THIS_EXPRESSION, ThisExpression)                               \
    _(THROW_STATEMENT, ThrowStatement)                               \
    _(TRY_STATEMENT, TryStatement)                                   \
    _(UNARY_EXPRESSION, UnaryExpression)                             \
    _(UPDATE_EXPRESSION, UpdateExpression)                           \
    _(VARIABLE_DECLARATION, VariableDeclaration)                     \
    _(VARIABLE_DECLARATOR, VariableDeclarator)                       \
    _(WHILE_STATEMENT, WhileStatement)                               \
    _(WITH_STATEMENT, WithStatement)                                 \
    _(YIELD_EXPRESSION, YieldExpression)

#define AST_NODE_REINTERPRET_MAPPING(_)                                                   \
    _(ARRAY_EXPRESSION, ARRAY_PATTERN, ArrayExpression, ArrayPattern)                     \
    _(ASSIGNMENT_EXPRESSION, ASSIGNMENT_PATTERN, AssignmentExpression, AssignmentPattern) \
    _(OBJECT_EXPRESSION, OBJECT_PATTERN, ObjectExpression, ObjectPattern)                 \
    _(SPREAD_ELEMENT, REST_ELEMENT, SpreadElement, RestElement)

#endif
