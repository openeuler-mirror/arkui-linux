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

#include "base/log/log_wrapper.h"
#include "hilog/log.h"
#include <cstring>

#ifdef ACE_INSTANCE_LOG
#include "core/common/container.h"
#endif


extern "C" {
OHOS::HiviewDFX::HiLogLabel label {LOG_CORE, 0xD001444, "ArkUI"};
constexpr int MAX_LOG_LENGTH = 2048;
bool HiLogPrintArgs(LogType type, LogLevel level, unsigned int domain, const char* tag, const char* fmt, va_list ap)
{
    char logStr[MAX_LOG_LENGTH] = {0};
    if (vsprintf(logStr, fmt, ap) < 0) {
        return false;
    }

    switch (level) {
        case LOG_ERROR:
            OHOS::HiviewDFX::HiLog::Error(label, "%{public}s", logStr);
            break;
        case LOG_WARN:
            OHOS::HiviewDFX::HiLog::Warn(label, "%{public}s", logStr);
            break;
        case LOG_INFO:
            OHOS::HiviewDFX::HiLog::Info(label, "%{public}s", logStr);
            break;
        case LOG_DEBUG:
            OHOS::HiviewDFX::HiLog::Debug(label, "%{public}s", logStr);
            break;
        case LOG_FATAL:
            OHOS::HiviewDFX::HiLog::Fatal(label, "%{public}s", logStr);
            break;
        default:
            break;
    }
    return true;
}
}

namespace OHOS::Ace {

namespace {


const ::LogLevel LOG_LEVELS[] = {
    LOG_DEBUG,
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,
    LOG_FATAL,
};

const char* LOG_TAGS[] = {
    "Ace",
    "JSApp",
};

constexpr uint32_t LOG_DOMAINS[] = {
    0xD003900,
    0xC0D0,
};

constexpr LogType LOG_TYPES[] = {
    LOG_CORE,
    LOG_APP,
};

}

// initial static member object
LogLevel LogWrapper::level_ = LogLevel::DEBUG;

char LogWrapper::GetSeparatorCharacter()
{
    return '/';
}

void LogWrapper::PrintLog(LogDomain domain, LogLevel level, const char* fmt, va_list args)
{
    std::string newFmt(fmt);
    ReplaceFormatString("{private}", "", newFmt);
    ReplaceFormatString("{public}", "", newFmt);
    newFmt += "\n";
    (void)HiLogPrintArgs(LOG_TYPES[static_cast<uint32_t>(domain)], LOG_LEVELS[static_cast<uint32_t>(level)],
        LOG_DOMAINS[static_cast<uint32_t>(domain)], LOG_TAGS[static_cast<uint32_t>(domain)], newFmt.c_str(), args);
}

int32_t LogWrapper::GetId()
{
#ifdef ACE_INSTANCE_LOG
    return Container::CurrentId();
#else
    return 0;
#endif
}

} // namespace OHOS::Ace
