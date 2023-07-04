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

#ifndef ES2PANDA_UTIL_HELPERS_H
#define ES2PANDA_UTIL_HELPERS_H

#include <binder/variableFlags.h>
#include <mem/arena_allocator.h>
#include <os/file.h>
#include <util/ustring.h>

#include <cmath>

namespace panda::es2panda::ir {
class Expression;
class ScriptFunction;
class ClassDefinition;
class ClassProperty;
class Identifier;
class AstNode;
class ObjectExpression;
}  // namespace panda::es2panda::ir

namespace panda::es2panda {
struct CompilerOptions;
}  // namespace panda::es2panda

namespace panda::pandasm {
struct Program;
}  // namespace panda::pandasm


namespace panda::es2panda::util {

class Helpers {
public:
    Helpers() = delete;

    static bool IsGlobalIdentifier(const util::StringView &str);
    static bool ContainSpreadElement(const ArenaVector<ir::Expression *> &args);
    static util::StringView LiteralToPropName(const ir::Expression *lit);

    template <typename T>
    static bool IsInteger(double number);
    static bool IsIndex(double number);
    static int64_t GetIndex(const util::StringView &str);

    static std::string ToString(double number);
    static util::StringView ToStringView(ArenaAllocator *allocator, double number);
    static util::StringView ToStringView(ArenaAllocator *allocator, int32_t number);
    static util::StringView ToStringView(ArenaAllocator *allocator, uint32_t number);

    static const ir::ScriptFunction *GetContainingConstructor(const ir::AstNode *node);
    static const ir::ScriptFunction *GetContainingConstructor(const ir::ClassProperty *node);
    static const ir::ScriptFunction *GetContainingFunction(const ir::AstNode *node);
    static const ir::ClassDefinition *GetClassDefiniton(const ir::ScriptFunction *node);
    static bool IsSpecialPropertyKey(const ir::Expression *expr);
    static bool IsConstantPropertyKey(const ir::Expression *expr, bool isComputed);
    static bool IsConstantExpr(const ir::Expression *expr);
    static bool IsBindingPattern(const ir::AstNode *node);
    static bool IsPattern(const ir::AstNode *node);
    static std::vector<const ir::Identifier *> CollectBindingNames(const ir::AstNode *node);
    static util::StringView FunctionName(const ir::ScriptFunction *func);
    static std::tuple<util::StringView, bool> ParamName(ArenaAllocator *allocator, const ir::AstNode *param,
                                                        uint32_t index);
    static bool IsChild(const ir::AstNode *parent, const ir::AstNode *child);
    static bool IsObjectPropertyValue(const ir::ObjectExpression *object, const ir::AstNode *ident);

    static void OptimizeProgram(panda::pandasm::Program *prog, const std::string &inputFile);
    template <typename T>
    static T BaseName(T const &path, T const &delims = std::string(panda::os::file::File::GetPathDelim()));
    static bool ReadFileToBuffer(const std::string &file, std::stringstream &ss);

    static const uint32_t INVALID_INDEX = 4294967295L;
    static const uint32_t MAX_INT32 = 2147483647;
    static const uint32_t MAX_INT16 = std::numeric_limits<int16_t>::max();
    static const uint32_t MAX_INT8 = std::numeric_limits<int8_t>::max();
};

template <typename T>
bool Helpers::IsInteger(double number)
{
    if (std::fabs(number) <= static_cast<double>(std::numeric_limits<T>::max())) {
        T intNum = static_cast<T>(number);

        if (static_cast<double>(intNum) == number) {
            return true;
        }
    }

    return false;
}

template <class T>
T Helpers::BaseName(T const &path, T const &delims)
{
    return path.substr(path.find_last_of(delims) + 1);
}

}  // namespace panda::es2panda::util

#endif
