/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
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

#include "base/log/ace_trace.h"

#include "trace.h"

#include "base/log/log.h"
#include "base/utils/macros.h"
#include "base/utils/system_properties.h"
#include "base/utils/utils.h"

namespace OHOS::Ace {

bool AceTraceEnabled()
{
    return true;
}

void AceTraceBegin(const char* name)
{
    CHECK_NULL_VOID_NOLOG(name);
    std::string nameStr(name);
    StartTrace(HITRACE_TAG_ACE, nameStr);
}

void AceTraceEnd()
{
    FinishTrace(HITRACE_TAG_ACE);
}

void AceAsyncTraceBegin(int32_t taskId, const char* name)
{
    CHECK_NULL_VOID_NOLOG(name);
    std::string nameStr(name);
    StartAsyncTrace(HITRACE_TAG_ACE, nameStr, taskId);
}

void AceAsyncTraceEnd(int32_t taskId, const char* name)
{
    CHECK_NULL_VOID_NOLOG(name);
    std::string nameStr(name);
    FinishAsyncTrace(HITRACE_TAG_ACE, nameStr, taskId);
}
} // namespace OHOS::Ace
