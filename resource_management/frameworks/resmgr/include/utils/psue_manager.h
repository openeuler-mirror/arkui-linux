/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef UTILS_PUSE_MANAGER_H
#define UTILS_PUSE_MANAGER_H

#include <string>

namespace OHOS {
namespace Global {
namespace Resource {
using namespace std;

class PsueManager {
public:
    PsueManager();
    ~PsueManager();
    std::string Convert(const std::string &src, std::string &dest);
    void SetFakeLocaleLevel(const int level);
private:
    float GetExtendRatio(int32_t len) const;
    void ToAccent(wstring &ws) const;
    std::string ToWstring(wstring &dest, const string &src);
    std::string ToString(string &dest, const wstring &src);
    bool isDigit(const string src);
};
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif