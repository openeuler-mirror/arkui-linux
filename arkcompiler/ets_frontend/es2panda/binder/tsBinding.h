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

#ifndef ES2PANDA_BINDER_TS_BINDING_H
#define ES2PANDA_BINDER_TS_BINDING_H

#include <util/ustring.h>

#include <variant>

namespace panda::es2panda::binder {
// Note: if the bool operand is present, the expression cannot be evaluated during compilation
using EnumMemberResult = std::variant<double, util::StringView, bool>;

class TSBinding : public util::UString {
public:
    explicit TSBinding(ArenaAllocator *allocator, util::StringView name)
        : util::UString(std::string {TS_PREFIX}, allocator)
    {
        Append(name);
    }

    static std::string ToTSBinding(util::StringView name)
    {
        return std::string {TS_PREFIX}.append(name.Utf8());
    }

    static constexpr std::string_view TS_PREFIX = "#";
};
}  // namespace panda::es2panda::binder

#endif
