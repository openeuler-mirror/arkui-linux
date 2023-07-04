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

#ifndef ES2PANDA_COMPILER_SCOPES_VARIABLE_FLAGS_H
#define ES2PANDA_COMPILER_SCOPES_VARIABLE_FLAGS_H

#include <cstdlib>
#include <util/enumbitops.h>

namespace panda::es2panda::binder {

#define DECLARATION_KINDS(_)             \
    _(VAR, VarDecl)                      \
    _(LET, LetDecl)                      \
    _(CONST, ConstDecl)                  \
    _(CLASS, ClassDecl)                  \
    _(FUNC, FunctionDecl)                \
    _(PARAM, ParameterDecl)              \
    /* TS */                             \
    _(TYPE_ALIAS, TypeAliasDecl)         \
    _(NAMESPACE, NamespaceDecl)          \
    _(INTERFACE, InterfaceDecl)          \
    _(ENUM_LITERAL, EnumLiteralDecl)     \
    _(TYPE_PARAMETER, TypeParameterDecl) \
    _(PROPERTY, PropertyDecl)            \
    _(METHOD, MethodDecl)                \
    _(ENUM, EnumDecl)                    \
    _(IMPORT_EQUALS, ImportEqualsDecl)

enum class DeclType {
    NONE,
#define DECLARE_TYPES(decl_kind, class_name) decl_kind,
    DECLARATION_KINDS(DECLARE_TYPES)
#undef DECLARE_TYPES
};

#define SCOPE_TYPES(_)                    \
    _(PARAM, ParamScope)                  \
    _(CATCH_PARAM, CatchParamScope)       \
    _(FUNCTION_PARAM, FunctionParamScope) \
    _(CATCH, CatchScope)                  \
    _(LOCAL, LocalScope)                  \
    /* Variable Scopes */                 \
    _(LOOP, LoopScope)                    \
    _(FUNCTION, FunctionScope)            \
    _(GLOBAL, GlobalScope)                \
    _(MODULE, ModuleScope)                \
    _(TSMODULE, TSModuleScope)


enum class ScopeType {
#define GEN_SCOPE_TYPES(type, class_name) type,
    SCOPE_TYPES(GEN_SCOPE_TYPES)
#undef GEN_SCOPE_TYPES
};

enum class ResolveBindingOptions {
    BINDINGS = 1U << 0U,
    INTERFACES = 1U << 1U,

    ALL = BINDINGS | INTERFACES,
};

DEFINE_BITOPS(ResolveBindingOptions)

enum class ResolveBindingFlags {
    ALL = 1U << 0U,
    TS_BEFORE_TRANSFORM = 1U << 1U,
};

DEFINE_BITOPS(ResolveBindingFlags)

#define VARIABLE_TYPES(_)                  \
    _(LOCAL, LocalVariable)                \
    _(GLOBAL, GlobalVariable)              \
    _(MODULE, ModuleVariable)              \
    _(ENUM, EnumVariable)                  \
    _(NAMESPACE, NamespaceVariable)        \
    _(IMPORT_EQUALS, ImportEqualsVariable)

enum class VariableType {
#define GEN_VARIABLE_TYPES(type, class_name) type,
    VARIABLE_TYPES(GEN_VARIABLE_TYPES)
#undef GEN_VARIABLE_TYPES
};

enum class VariableKind {
    NONE,
    VAR,
    LEXICAL,
    FUNCTION,
    MODULE,
};

enum class VariableFlags {
    NONE = 0,
    OPTIONAL = 1 << 0,
    PROPERTY = 1 << 1,
    METHOD = 1 << 2,
    TYPE_ALIAS = 1 << 3,
    INTERFACE = 1 << 4,
    ENUM_LITERAL = 1 << 5,
    READONLY = 1 << 6,
    COMPUTED = 1 << 7,
    COMPUTED_IDENT = 1 << 8,
    COMPUTED_INDEX = 1 << 9,
    INDEX_NAME = 1 << 10,
    IMPORT = 1 << 11,
    LOCAL_EXPORT = 1 << 12,
    INFERED_IN_PATTERN = 1 << 13,
    REST_ARG = 1 << 14,
    NUMERIC_NAME = 1 << 15,
    TYPE = 1 << 16,
    NAMESPACE = 1 << 17,
    IMPORT_EQUALS = 1 << 18,

    INDEX_LIKE = COMPUTED_INDEX | INDEX_NAME,

    LOOP_DECL = 1 << 25,
    PER_ITERATION = 1 << 26,
    HOIST = 1 << 27,
    VAR = 1 << 28,
    INITIALIZED = 1 << 29,
    LEXICAL_BOUND = 1 << 30,

    HOIST_VAR = HOIST | VAR,
};

DEFINE_BITOPS(VariableFlags)

enum class LetOrConstStatus {
    INITIALIZED,
    UNINITIALIZED,
};

enum class VariableScopeFlags {
    NONE = 0,
    SET_LEXICAL_FUNCTION = 1U << 0U,
    USE_ARGS = 1U << 2U,
    USE_SUPER = 1U << 3U,
    INNER_ARROW = 1U << 4U,
};

DEFINE_BITOPS(VariableScopeFlags)

enum class DeclarationFlags {
    NONE = 0,
    IMPORT = 1 << 0,
    EXPORT = 1 << 1,
    NAMESPACE_IMPORT = 1 << 2,
};

DEFINE_BITOPS(DeclarationFlags)

enum class TSBindingType : size_t {
    NAMESPACE = 0,
    ENUM,
    INTERFACE,
    IMPORT_EQUALS,
    COUNT,
};

}  // namespace panda::es2panda::binder

#endif
