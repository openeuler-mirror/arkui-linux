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
#include "dumper.h"

namespace panda::es2panda::util {

void Dumper::DumpLiterals(std::map<std::string, panda::pandasm::LiteralArray> const &literalTable)
{
    std::cout << "======> literal array buffer <======" << std::endl;
    for (auto it : literalTable) {
        std::cout << "------------------------------------" << std::endl;
        std::cout << "slot " << it.first << std::endl;
        int count = 0;
        for (auto literal : it.second.literals_) {
            std::cout << "{" << std::endl;
            std::cout << "  index: " << count++ << std::endl;
            std::cout << "    tag: " <<
                unsigned(static_cast<std::underlying_type<panda::panda_file::LiteralTag>::type>(literal.tag_)) <<
                std::endl;
            std::visit([](auto&& element) {
                if constexpr (std::is_same_v<decltype(element), unsigned char &>) {
                    std::cout << "    val: " << unsigned(element) << std::endl;
                } else {
                    std::cout << "    val: " << element << std::endl;
                }
            }, literal.value_);
            std::cout << "}," << std::endl;
        }
    }
}

}  // namespace panda::es2panda::util

