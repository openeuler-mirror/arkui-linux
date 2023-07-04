# Copyright (c) 2021-2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cmake_minimum_required (VERSION 3.5.0)

project (es2panda)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(OUTPUT_DIR ${CMAKE_CURRENT_BINARY_DIR}/out)
set(GENERATED_DIR ${OUTPUT_DIR}/gen)
set(GENERATED_STAMP ${OUTPUT_DIR}/gen_dir.stamp)
add_custom_target(es2panda-gen)

add_custom_command(
  OUTPUT ${GENERATED_STAMP}
  COMMAND ${CMAKE_COMMAND} -E make_directory ${OUTPUT_DIR}
  COMMAND ${CMAKE_COMMAND} -E make_directory ${GENERATED_DIR}
  COMMAND ${CMAKE_COMMAND} -E touch ${GENERATED_STAMP}
)

set(TEMPLATES
  isa.h.erb
  formats.h.erb
)

panda_isa_gen(
  TEMPLATES ${TEMPLATES}
  SOURCE ${CMAKE_CURRENT_LIST_DIR}/compiler/templates
  DESTINATION ${GENERATED_DIR}
  EXTRA_DEPENDENCIES ${GENERATED_STAMP}
)

add_dependencies(es2panda-gen isa_gen_es2panda)

function(gen_keywords TEMPLATE OUT_DIR)
  set(TEMPLATE_FILE ${CMAKE_CURRENT_SOURCE_DIR}/lexer/templates/${TEMPLATE})

  string(REGEX REPLACE "\.erb$" "" NAME ${TEMPLATE})
  string(REPLACE "\." "_" CUSTOM_TARGET ${NAME})
  string(REPLACE "/" "_" CUSTOM_TARGET ${CUSTOM_TARGET})
  set(CUSTOM_TARGET "panda_es2panda_parser_gen_${CUSTOM_TARGET}")

  set(OUT_FILE ${OUT_DIR}/${NAME})
  set(GENERATOR ${CMAKE_CURRENT_SOURCE_DIR}/lexer/scripts/keywords.rb)

  add_custom_command(OUTPUT ${OUT_FILE}
    COMMAND ruby ${GENERATOR} ${TEMPLATE_FILE} ${OUT_FILE}
    DEPENDS ${GENERATED_STAMP} ${GENERATOR} ${TEMPLATE_FILE}
  )

  add_custom_target(${CUSTOM_TARGET} DEPENDS ${OUT_FILE})
  add_dependencies(es2panda-gen ${CUSTOM_TARGET})
endfunction()

gen_keywords(keywords.h.erb ${GENERATED_DIR})
gen_keywords(keywordsMap.h.erb ${GENERATED_DIR})

set(ES2PANDA_LIB_SRC
  es2panda.cpp
  binder/binder.cpp
  binder/declaration.cpp
  binder/scope.cpp
  binder/variable.cpp
  compiler/base/catchTable.cpp
  compiler/base/condition.cpp
  compiler/base/destructuring.cpp
  compiler/base/hoisting.cpp
  compiler/base/iterators.cpp
  compiler/base/lexenv.cpp
  compiler/base/literals.cpp
  compiler/base/lreference.cpp
  compiler/core/compileQueue.cpp
  compiler/core/compilerContext.cpp
  compiler/core/compilerImpl.cpp
  compiler/core/dynamicContext.cpp
  compiler/core/emitter.cpp
  compiler/core/envScope.cpp
  compiler/core/function.cpp
  compiler/core/inlineCache.cpp
  compiler/core/labelTarget.cpp
  compiler/core/moduleContext.cpp
  compiler/core/pandagen.cpp
  compiler/core/regAllocator.cpp
  compiler/core/regScope.cpp
  compiler/core/switchBuilder.cpp
  compiler/debugger/debuginfoDumper.cpp
  compiler/function/asyncFunctionBuilder.cpp
  compiler/function/asyncGeneratorFunctionBuilder.cpp
  compiler/function/functionBuilder.cpp
  compiler/function/generatorFunctionBuilder.cpp
  ir/astDump.cpp
  ir/base/catchClause.cpp
  ir/base/classDefinition.cpp
  ir/base/classProperty.cpp
  ir/base/decorator.cpp
  ir/base/metaProperty.cpp
  ir/base/methodDefinition.cpp
  ir/base/property.cpp
  ir/base/scriptFunction.cpp
  ir/base/spreadElement.cpp
  ir/base/templateElement.cpp
  ir/expression.cpp
  ir/expressions/arrayExpression.cpp
  ir/expressions/arrowFunctionExpression.cpp
  ir/expressions/assignmentExpression.cpp
  ir/expressions/awaitExpression.cpp
  ir/expressions/binaryExpression.cpp
  ir/expressions/callExpression.cpp
  ir/expressions/chainExpression.cpp
  ir/expressions/classExpression.cpp
  ir/expressions/conditionalExpression.cpp
  ir/expressions/functionExpression.cpp
  ir/expressions/identifier.cpp
  ir/expressions/importExpression.cpp
  ir/expressions/literal.cpp
  ir/expressions/literals/bigIntLiteral.cpp
  ir/expressions/literals/booleanLiteral.cpp
  ir/expressions/literals/nullLiteral.cpp
  ir/expressions/literals/numberLiteral.cpp
  ir/expressions/literals/regExpLiteral.cpp
  ir/expressions/literals/stringLiteral.cpp
  ir/expressions/literals/taggedLiteral.cpp
  ir/expressions/memberExpression.cpp
  ir/expressions/newExpression.cpp
  ir/expressions/objectExpression.cpp
  ir/expressions/omittedExpression.cpp
  ir/expressions/sequenceExpression.cpp
  ir/expressions/superExpression.cpp
  ir/expressions/taggedTemplateExpression.cpp
  ir/expressions/templateLiteral.cpp
  ir/expressions/thisExpression.cpp
  ir/expressions/unaryExpression.cpp
  ir/expressions/updateExpression.cpp
  ir/expressions/yieldExpression.cpp
  ir/module/exportAllDeclaration.cpp
  ir/module/exportDefaultDeclaration.cpp
  ir/module/exportNamedDeclaration.cpp
  ir/module/exportSpecifier.cpp
  ir/module/importDeclaration.cpp
  ir/module/importDefaultSpecifier.cpp
  ir/module/importNamespaceSpecifier.cpp
  ir/module/importSpecifier.cpp
  ir/statement.cpp
  ir/statements/blockStatement.cpp
  ir/statements/breakStatement.cpp
  ir/statements/classDeclaration.cpp
  ir/statements/continueStatement.cpp
  ir/statements/debuggerStatement.cpp
  ir/statements/doWhileStatement.cpp
  ir/statements/emptyStatement.cpp
  ir/statements/expressionStatement.cpp
  ir/statements/forInStatement.cpp
  ir/statements/forOfStatement.cpp
  ir/statements/forUpdateStatement.cpp
  ir/statements/functionDeclaration.cpp
  ir/statements/ifStatement.cpp
  ir/statements/labelledStatement.cpp
  ir/statements/loopStatement.cpp
  ir/statements/returnStatement.cpp
  ir/statements/switchCaseStatement.cpp
  ir/statements/switchStatement.cpp
  ir/statements/throwStatement.cpp
  ir/statements/tryStatement.cpp
  ir/statements/variableDeclaration.cpp
  ir/statements/variableDeclarator.cpp
  ir/statements/whileStatement.cpp
  ir/ts/tsAnyKeyword.cpp
  ir/ts/tsArrayType.cpp
  ir/ts/tsAsExpression.cpp
  ir/ts/tsBigintKeyword.cpp
  ir/ts/tsBooleanKeyword.cpp
  ir/ts/tsClassImplements.cpp
  ir/ts/tsConditionalType.cpp
  ir/ts/tsConstructorType.cpp
  ir/ts/tsEnumDeclaration.cpp
  ir/ts/tsEnumMember.cpp
  ir/ts/tsExternalModuleReference.cpp
  ir/ts/tsFunctionType.cpp
  ir/ts/tsImportEqualsDeclaration.cpp
  ir/ts/tsImportType.cpp
  ir/ts/tsIndexSignature.cpp
  ir/ts/tsIndexedAccessType.cpp
  ir/ts/tsInferType.cpp
  ir/ts/tsInterfaceBody.cpp
  ir/ts/tsInterfaceDeclaration.cpp
  ir/ts/tsInterfaceHeritage.cpp
  ir/ts/tsIntersectionType.cpp
  ir/ts/tsLiteralType.cpp
  ir/ts/tsMappedType.cpp
  ir/ts/tsMethodSignature.cpp
  ir/ts/tsModuleBlock.cpp
  ir/ts/tsModuleDeclaration.cpp
  ir/ts/tsNamedTupleMember.cpp
  ir/ts/tsNeverKeyword.cpp
  ir/ts/tsNonNullExpression.cpp
  ir/ts/tsNullKeyword.cpp
  ir/ts/tsNumberKeyword.cpp
  ir/ts/tsObjectKeyword.cpp
  ir/ts/tsOptionalType.cpp
  ir/ts/tsParameterProperty.cpp
  ir/ts/tsParenthesizedType.cpp
  ir/ts/tsPrivateIdentifier.cpp
  ir/ts/tsPropertySignature.cpp
  ir/ts/tsQualifiedName.cpp
  ir/ts/tsRestType.cpp
  ir/ts/tsSignatureDeclaration.cpp
  ir/ts/tsStringKeyword.cpp
  ir/ts/tsSymbolKeyword.cpp
  ir/ts/tsTemplateLiteralType.cpp
  ir/ts/tsThisType.cpp
  ir/ts/tsTupleType.cpp
  ir/ts/tsTypeAliasDeclaration.cpp
  ir/ts/tsTypeAssertion.cpp
  ir/ts/tsTypeLiteral.cpp
  ir/ts/tsTypeOperator.cpp
  ir/ts/tsTypeParameter.cpp
  ir/ts/tsTypeParameterDeclaration.cpp
  ir/ts/tsTypeParameterInstantiation.cpp
  ir/ts/tsTypePredicate.cpp
  ir/ts/tsTypeQuery.cpp
  ir/ts/tsTypeReference.cpp
  ir/ts/tsUndefinedKeyword.cpp
  ir/ts/tsUnionType.cpp
  ir/ts/tsUnknownKeyword.cpp
  ir/ts/tsVoidKeyword.cpp
  lexer/keywordsUtil.cpp
  lexer/lexer.cpp
  lexer/regexp/regexp.cpp
  lexer/token/sourceLocation.cpp
  lexer/token/token.cpp
  parser/context/parserContext.cpp
  parser/expressionParser.cpp
  parser/parserImpl.cpp
  parser/program/program.cpp
  parser/statementParser.cpp
  parser/transformer/transformer.cpp
  typescript/checker.cpp
  typescript/core/binaryLikeExpression.cpp
  typescript/core/destructuringContext.cpp
  typescript/core/function.cpp
  typescript/core/helpers.cpp
  typescript/core/object.cpp
  typescript/core/typeCreation.cpp
  typescript/core/typeElaborationContext.cpp
  typescript/core/typeRelation.cpp
  typescript/core/util.cpp
  typescript/types/anyType.cpp
  typescript/types/arrayType.cpp
  typescript/types/bigintLiteralType.cpp
  typescript/types/bigintType.cpp
  typescript/types/booleanLiteralType.cpp
  typescript/types/booleanType.cpp
  typescript/types/constructorType.cpp
  typescript/types/enumLiteralType.cpp
  typescript/types/enumType.cpp
  typescript/types/functionType.cpp
  typescript/types/globalTypesHolder.cpp
  typescript/types/indexInfo.cpp
  typescript/types/interfaceType.cpp
  typescript/types/neverType.cpp
  typescript/types/nonPrimitiveType.cpp
  typescript/types/nullType.cpp
  typescript/types/numberLiteralType.cpp
  typescript/types/numberType.cpp
  typescript/types/objectDescriptor.cpp
  typescript/types/objectLiteralType.cpp
  typescript/types/objectType.cpp
  typescript/types/signature.cpp
  typescript/types/stringLiteralType.cpp
  typescript/types/stringType.cpp
  typescript/types/symbolType.cpp
  typescript/types/tupleType.cpp
  typescript/types/type.cpp
  typescript/types/typeParameter.cpp
  typescript/types/typeReference.cpp
  typescript/types/typeRelation.cpp
  typescript/types/undefinedType.cpp
  typescript/types/unionType.cpp
  typescript/types/unknownType.cpp
  typescript/types/voidType.cpp
  util/bitset.cpp
  util/helpers.cpp
  util/ustring.cpp
)

add_library(es2panda-lib ${PANDA_DEFAULT_LIB_TYPE} ${ES2PANDA_LIB_SRC})
add_dependencies(es2panda-lib es2panda-gen)

set(ICU_INCLUDE_DIRS
    ${PANDA_THIRD_PARTY_SOURCES_DIR}/icu/icu4c/source/common
    ${PANDA_THIRD_PARTY_SOURCES_DIR}/icu/icu4c/source/i18n
    ${PANDA_THIRD_PARTY_SOURCES_DIR}/icu/icu4c/source
)

target_include_directories(es2panda-lib
  PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}
  PRIVATE ${OUTPUT_DIR}
  PRIVATE ${ICU_INCLUDE_DIRS}
)

target_compile_options(es2panda-lib
  PRIVATE -fexceptions -Werror=shadow
)

target_link_libraries(es2panda-lib
  PUBLIC arkbase hmicuuc.z
  PRIVATE arkassembler
)

if (PANDA_FUZZILLI)
  target_compile_options(es2panda-lib
      PRIVATE -fPIC
  )
endif()

panda_add_sanitizers(TARGET es2panda-lib SANITIZERS ${PANDA_SANITIZERS_LIST})
panda_add_to_clang_tidy(TARGET es2panda-lib CHECKS
    "-modernize-use-trailing-return-type"
    "-llvmlibc-restrict-system-libc-headers"
    "-llvmlibc-callee-namespace"
    "-cert-dcl21-cpp"
    "-cppcoreguidelines-macro-usage"
    "-cppcoreguidelines-pro-bounds-pointer-arithmetic"
    "-fuchsia-default-arguments-calls"
    "-fuchsia-default-arguments-declarations"
    "-readability-implicit-bool-conversion"
    "-misc-non-private-member-variables-in-classes"
    "-hicpp-signed-bitwise"
    "-altera-struct-pack-align"
)

add_subdirectory(aot)
