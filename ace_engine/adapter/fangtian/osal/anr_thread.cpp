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

#include "base/utils/utils.h"
#include "core/common/anr_thread.h"

// #include "xcollie/watchdog.h"

namespace OHOS::Ace {
namespace  {
const std::string ARKUI_WATCH_DOG("ArkUIWatchdog");
//constexpr uint64_t SECOND_TO_MILLISECOND = 1000;
} // namespace

void AnrThread::Start() {}

void AnrThread::Stop() {}

bool AnrThread::PostTaskToTaskRunner(Task&& task, uint32_t delayTime)
{
    CHECK_NULL_RETURN_NOLOG(task, false);
    /* TODO
    if (delayTime > 0) {
        OHOS::HiviewDFX::Watchdog::GetInstance().RunOneShotTask(
            ARKUI_WATCH_DOG, std::move(task), delayTime * SECOND_TO_MILLISECOND);
    } else {
        OHOS::HiviewDFX::Watchdog::GetInstance().RunOneShotTask(ARKUI_WATCH_DOG, std::move(task));
    }
    */
    return true;
}
} // namespace OHOS::Ace
