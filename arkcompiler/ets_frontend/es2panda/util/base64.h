/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_UTIL_BASE64_H
#define ES2PANDA_UTIL_BASE64_H

#include <iostream>
#include <string>

namespace panda::es2panda::util {

constexpr size_t TO_TRANSFORM_CHAR_NUM = 3;
constexpr size_t TRANSFORMED_CHAR_NUM = 4;

std::string Base64Encode(const std::string &inputString);
std::string Base64Decode(const std::string &base64String);

}  // namespace panda::es2panda::util

#endif
