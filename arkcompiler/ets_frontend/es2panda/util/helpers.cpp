/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.Apache.Org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "helpers.h"

#include <es2panda.h>
#include <ir/base/classDefinition.h>
#include <ir/base/classProperty.h>
#include <ir/base/methodDefinition.h>
#include <ir/base/property.h>
#include <ir/base/scriptFunction.h>
#include <ir/base/spreadElement.h>
#include <ir/expressions/arrayExpression.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/expressions/objectExpression.h>
#include <ir/statements/variableDeclaration.h>
#include <ir/statements/variableDeclarator.h>
#include <ir/ts/tsParameterProperty.h>
#include <parser/module/sourceTextModuleRecord.h>

#ifdef ENABLE_BYTECODE_OPT
#include <bytecode_optimizer/bytecodeopt_options.h>
#include <bytecode_optimizer/optimize_bytecode.h>
#else
#include <assembly-type.h>
#include <assembly-program.h>
#include <assembly-emitter.h>
#endif

#ifdef PANDA_TARGET_WINDOWS
#include <windows.h>
#undef ERROR
#else
#include <unistd.h>
#endif
#include <fstream>

namespace panda::es2panda::util {

// Helpers

bool Helpers::IsGlobalIdentifier(const util::StringView &str)
{
    return (str.Is("NaN") || str.Is("undefined") || str.Is("Infinity"));
}

bool Helpers::ContainSpreadElement(const ArenaVector<ir::Expression *> &args)
{
    return std::any_of(args.begin(), args.end(), [](const auto *it) { return it->IsSpreadElement(); });
}

util::StringView Helpers::LiteralToPropName(const ir::Expression *lit)
{
    switch (lit->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            return lit->AsIdentifier()->Name();
        }
        case ir::AstNodeType::STRING_LITERAL: {
            return lit->AsStringLiteral()->Str();
        }
        case ir::AstNodeType::NUMBER_LITERAL: {
            return lit->AsNumberLiteral()->Str();
        }
        case ir::AstNodeType::NULL_LITERAL: {
            return "null";
        }
        default: {
            UNREACHABLE();
        }
    }
}

bool Helpers::IsIndex(double number)
{
    if (number >= 0 && number < static_cast<double>(INVALID_INDEX)) {
        auto intNum = static_cast<uint32_t>(number);

        if (static_cast<double>(intNum) == number) {
            return true;
        }
    }

    return false;
}

static bool IsDigit(char c)
{
    return (c >= '0' && c <= '9');
}

int64_t Helpers::GetIndex(const util::StringView &str)
{
    const auto &s = str.Utf8();

    if (s.empty() || (*s.begin() == '0' && s.length() > 1)) {
        return INVALID_INDEX;
    }

    int64_t value = 0;
    for (const auto c : s) {
        if (!IsDigit(c)) {
            return INVALID_INDEX;
        }

        constexpr auto MULTIPLIER = 10;
        value *= MULTIPLIER;
        value += (c - '0');

        if (value >= INVALID_INDEX) {
            return INVALID_INDEX;
        }
    }

    return value;
}

std::string Helpers::ToString(double number)
{
    std::string str;

    if (Helpers::IsInteger<int32_t>(number)) {
        str = std::to_string(static_cast<int32_t>(number));
    } else {
        str = std::to_string(number);
    }

    return str;
}

util::StringView Helpers::ToStringView(ArenaAllocator *allocator, double number)
{
    util::UString str(ToString(number), allocator);
    return str.View();
}

util::StringView Helpers::ToStringView(ArenaAllocator *allocator, uint32_t number)
{
    ASSERT(number <= static_cast<uint32_t>(std::numeric_limits<int32_t>::max()));
    return ToStringView(allocator, static_cast<int32_t>(number));
}

util::StringView Helpers::ToStringView(ArenaAllocator *allocator, int32_t number)
{
    util::UString str(ToString(number), allocator);
    return str.View();
}

const ir::ScriptFunction *Helpers::GetContainingConstructor(const ir::AstNode *node)
{
    const ir::ScriptFunction *iter = GetContainingFunction(node);

    while (iter != nullptr) {
        if (iter->IsConstructor()) {
            return iter;
        }

        if (!iter->IsArrow()) {
            return nullptr;
        }

        iter = GetContainingFunction(iter);
    }

    return iter;
}

const ir::ScriptFunction *Helpers::GetContainingConstructor(const ir::ClassProperty *node)
{
    for (const auto *parent = node->Parent(); parent != nullptr; parent = parent->Parent()) {
        if (parent->IsClassDefinition()) {
            return parent->AsClassDefinition()->Ctor()->Function();
        }
    }

    return nullptr;
}

const ir::ScriptFunction *Helpers::GetContainingFunction(const ir::AstNode *node)
{
    for (const auto *parent = node->Parent(); parent != nullptr; parent = parent->Parent()) {
        if (parent->IsScriptFunction()) {
            return parent->AsScriptFunction();
        }
    }

    return nullptr;
}

const ir::ClassDefinition *Helpers::GetClassDefiniton(const ir::ScriptFunction *node)
{
    ASSERT(node->IsConstructor());
    ASSERT(node->Parent()->IsFunctionExpression());
    ASSERT(node->Parent()->Parent()->IsMethodDefinition());
    ASSERT(node->Parent()->Parent()->Parent()->IsClassDefinition());

    return node->Parent()->Parent()->Parent()->AsClassDefinition();
}

bool Helpers::IsSpecialPropertyKey(const ir::Expression *expr)
{
    if (!expr->IsStringLiteral()) {
        return false;
    }

    auto *lit = expr->AsStringLiteral();
    return lit->Str().Is("prototype") || lit->Str().Is("constructor");
}

bool Helpers::IsConstantPropertyKey(const ir::Expression *expr, bool isComputed)
{
    switch (expr->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            return !isComputed;
        }
        case ir::AstNodeType::NUMBER_LITERAL:
        case ir::AstNodeType::STRING_LITERAL:
        case ir::AstNodeType::BOOLEAN_LITERAL:
        case ir::AstNodeType::NULL_LITERAL: {
            return true;
        }
        default:
            break;
    }

    return false;
}

bool Helpers::IsConstantExpr(const ir::Expression *expr)
{
    switch (expr->Type()) {
        case ir::AstNodeType::NUMBER_LITERAL:
        case ir::AstNodeType::STRING_LITERAL:
        case ir::AstNodeType::BOOLEAN_LITERAL:
        case ir::AstNodeType::NULL_LITERAL: {
            return true;
        }
        default:
            break;
    }

    return false;
}

bool Helpers::IsBindingPattern(const ir::AstNode *node)
{
    return node->IsArrayPattern() || node->IsObjectPattern();
}

bool Helpers::IsPattern(const ir::AstNode *node)
{
    return node->IsArrayPattern() || node->IsObjectPattern() || node->IsAssignmentPattern();
}

static void CollectBindingName(const ir::AstNode *node, std::vector<const ir::Identifier *> *bindings)
{
    switch (node->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            if (!Helpers::IsGlobalIdentifier(node->AsIdentifier()->Name())) {
                bindings->push_back(node->AsIdentifier());
            }

            break;
        }
        case ir::AstNodeType::OBJECT_PATTERN: {
            for (const auto *prop : node->AsObjectPattern()->Properties()) {
                CollectBindingName(prop, bindings);
            }
            break;
        }
        case ir::AstNodeType::ARRAY_PATTERN: {
            for (const auto *element : node->AsArrayPattern()->Elements()) {
                CollectBindingName(element, bindings);
            }
            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            CollectBindingName(node->AsAssignmentPattern()->Left(), bindings);
            break;
        }
        case ir::AstNodeType::PROPERTY: {
            CollectBindingName(node->AsProperty()->Value(), bindings);
            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            CollectBindingName(node->AsRestElement()->Argument(), bindings);
            break;
        }
        default:
            break;
    }
}

std::vector<const ir::Identifier *> Helpers::CollectBindingNames(const ir::AstNode *node)
{
    std::vector<const ir::Identifier *> bindings;
    CollectBindingName(node, &bindings);
    return bindings;
}

util::StringView Helpers::FunctionName(const ir::ScriptFunction *func)
{
    if (func->Id()) {
        return func->Id()->Name();
    }

    if (func->Parent()->IsFunctionDeclaration()) {
        return parser::SourceTextModuleRecord::DEFAULT_EXTERNAL_NAME;
    }

    const ir::AstNode *parent = func->Parent()->Parent();

    if (func->IsConstructor()) {
        parent = parent->Parent();
        if (parent->AsClassDefinition()->Ident()) {
            return parent->AsClassDefinition()->Ident()->Name();
        }

        parent = parent->Parent()->Parent();
    }

    switch (parent->Type()) {
        case ir::AstNodeType::VARIABLE_DECLARATOR: {
            const ir::VariableDeclarator *varDecl = parent->AsVariableDeclarator();

            if (varDecl->Id()->IsIdentifier()) {
                return varDecl->Id()->AsIdentifier()->Name();
            }

            break;
        }
        case ir::AstNodeType::METHOD_DEFINITION: {
            const ir::MethodDefinition *methodDef = parent->AsMethodDefinition();

            if (methodDef->Key()->IsIdentifier()) {
                return methodDef->Key()->AsIdentifier()->Name();
            }

            break;
        }
        case ir::AstNodeType::ASSIGNMENT_EXPRESSION: {
            const ir::AssignmentExpression *assignment = parent->AsAssignmentExpression();

            if (assignment->Left()->IsIdentifier()) {
                return assignment->Left()->AsIdentifier()->Name();
            }

            break;
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            const ir::AssignmentExpression *assignment = parent->AsAssignmentPattern();

            if (assignment->Left()->IsIdentifier()) {
                return assignment->Left()->AsIdentifier()->Name();
            }

            break;
        }
        case ir::AstNodeType::PROPERTY: {
            const ir::Property *prop = parent->AsProperty();

            if (prop->Kind() != ir::PropertyKind::PROTO &&
                Helpers::IsConstantPropertyKey(prop->Key(), prop->IsComputed())) {
                return Helpers::LiteralToPropName(prop->Key());
            }

            break;
        }
        case ir::AstNodeType::EXPORT_DEFAULT_DECLARATION: {
            return parser::SourceTextModuleRecord::DEFAULT_EXTERNAL_NAME;
        }
        default:
            break;
    }

    return util::StringView();
}

std::tuple<util::StringView, bool> Helpers::ParamName(ArenaAllocator *allocator, const ir::AstNode *param,
                                                      uint32_t index)
{
    switch (param->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            return {param->AsIdentifier()->Name(), false};
        }
        case ir::AstNodeType::ASSIGNMENT_PATTERN: {
            const auto *lhs = param->AsAssignmentPattern()->Left();
            if (lhs->IsIdentifier()) {
                return {param->AsAssignmentPattern()->Left()->AsIdentifier()->Name(), false};
            }
            break;
        }
        case ir::AstNodeType::REST_ELEMENT: {
            if (param->AsRestElement()->Argument()->IsIdentifier()) {
                return {param->AsRestElement()->Argument()->AsIdentifier()->Name(), false};
            }
            break;
        }
        case ir::AstNodeType::TS_PARAMETER_PROPERTY: {
            return ParamName(allocator, param->AsTSParameterProperty()->Parameter(), index);
        }
        default:
            break;
    }

    return {Helpers::ToStringView(allocator, index), true};
}

bool Helpers::IsChild(const ir::AstNode *parent, const ir::AstNode *child)
{
    while (child) {
        if (child == parent) {
            return true;
        }

        child = child->Parent();
    }

    return false;
}

bool Helpers::IsObjectPropertyValue(const ir::ObjectExpression *object, const ir::AstNode *ident)
{
    for (const auto *prop : object->Properties()) {
        if (prop->AsProperty()->Value() == ident) {
            return true;
        }
    }

    return false;
}

void Helpers::OptimizeProgram(panda::pandasm::Program *prog,  const std::string &inputFile)
{
    std::map<std::string, size_t> stat;
    std::map<std::string, size_t> *statp = &stat;
    panda::pandasm::AsmEmitter::PandaFileToPandaAsmMaps maps{};
    panda::pandasm::AsmEmitter::PandaFileToPandaAsmMaps *mapsp = &maps;

#ifdef PANDA_WITH_BYTECODE_OPTIMIZER
    const uint32_t COMPONENT_MASK = panda::Logger::Component::ASSEMBLER |
                                    panda::Logger::Component::BYTECODE_OPTIMIZER |
                                    panda::Logger::Component::COMPILER;
    panda::Logger::InitializeStdLogging(panda::Logger::Level::ERROR, COMPONENT_MASK);

    std::string pid;
#ifdef PANDA_TARGET_WINDOWS
    pid = std::to_string(GetCurrentProcessId());
#else
    pid = std::to_string(getpid());
#endif
    const std::string outputSuffix = ".unopt.abc";
    std::string tempOutput = panda::os::file::File::GetExtendedFilePath(inputFile + pid + outputSuffix);
    if (panda::pandasm::AsmEmitter::Emit(tempOutput, *prog, statp, mapsp, true)) {
        panda::bytecodeopt::OptimizeBytecode(prog, mapsp, tempOutput, true, true);
    }

    std::remove(tempOutput.c_str());
#endif
}

bool Helpers::ReadFileToBuffer(const std::string &file, std::stringstream &ss)
{
    std::ifstream inputStream(panda::os::file::File::GetExtendedFilePath(file), std::ios::binary);
    if (inputStream.fail()) {
        std::cerr << "Failed to read file to buffer: " << file << std::endl;
        return false;
    }
    ss << inputStream.rdbuf();
    return true;
}

}  // namespace panda::es2panda::util
