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

#ifndef OHOS_RESOURCE_MANAGER_DFX_HISYSEVENT_ADAPTER_H
#define OHOS_RESOURCE_MANAGER_DFX_HISYSEVENT_ADAPTER_H

#include <string>

namespace OHOS {
namespace Global {
namespace Resource {
void ReportInitResourceManagerFail(const std::string& bundleName, const std::string& errMsg);

void ReportGetResourceByIdFail(int32_t resId, const std::string& result, const std::string& errMsg);

void ReportGetResourceByNameFail(const std::string& resName, const std::string& result, const std::string& errMsg);

void ReportAddResourcePathFail(const char* resourcePath, const std::string& errMsg);
} // Resource
} // Global
} // OHOS
#endif // OHOS_RESOURCE_MANAGER_DFX_HISYSEVENT_ADAPTER_H
