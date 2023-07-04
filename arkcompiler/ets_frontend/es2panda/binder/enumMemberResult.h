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

#ifndef ES2PANDA_COMPILER_SCOPES_ENUM_MEMBER_RESULT_H
#define ES2PANDA_COMPILER_SCOPES_ENUM_MEMBER_RESULT_H

#include <util/ustring.h>

#include <variant>

namespace panda::es2panda::binder {

// Note: if the bool operand is present, the expression cannot be evaluated during compliation
using EnumMemberResult = std::variant<double, util::StringView, bool>;

}  // namespace panda::es2panda::binder

#endif
