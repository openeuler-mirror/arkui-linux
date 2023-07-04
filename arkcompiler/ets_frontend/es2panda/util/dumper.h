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

#ifndef ES2PANDA_UTIL_DUMPER_H
#define ES2PANDA_UTIL_DUMPER_H

#include <assembly-emitter.h>
#include <iostream>
#include <map>
#include <string>

namespace panda::es2panda::util {

class Dumper {
public:
    static void DumpLiterals(std::map<std::string, panda::pandasm::LiteralArray> const &literalTable);
};

}  // namespace panda::es2panda::util

#endif