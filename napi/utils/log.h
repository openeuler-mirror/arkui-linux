/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#ifndef FOUNDATION_ACE_NAPI_UTILS_LOG_H
#define FOUNDATION_ACE_NAPI_UTILS_LOG_H

#ifdef LINUX_PLATFORM
#include <cstring>
#include <cstdint>
#endif
#include <string>

#include "utils/macros.h"

#define __FILENAME__ strrchr(__FILE__, '/') + 1

#if defined(MAC_PLATFORM) || defined(WINDOWS_PLATFORM) || defined(ANDROID_PLATFORM) || defined(IOS_PLATFORM) || \
    defined(LINUX_PLATFORM)
enum class LogLevel : uint32_t {
    Debug = 0,
    Info,
    Warn,
    Error,
    Fatal,
};

NAPI_EXPORT void PrintLog(LogLevel level, const char* fmt, ...);

#define HILOG_PRINT(Level, fmt, ...) \
    PrintLog(LogLevel::Level, "[%-20s(%s)] " fmt, __FILENAME__, __FUNCTION__, ##__VA_ARGS__);

#else

#include "hilog/log.h"

#undef LOG_DOMAIN
#undef LOG_TAG
#undef HILOG_FATAL
#undef HILOG_ERROR
#undef HILOG_WARN
#undef HILOG_INFO
#undef HILOG_DEBUG

#define LOG_DOMAIN 0xD003900
#define LOG_TAG "NAPI"

static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = { LOG_CORE, LOG_DOMAIN, LOG_TAG };

#define HILOG_PRINT(Level, fmt, ...)     \
    (void)OHOS::HiviewDFX::HiLog::Level( \
        LOG_LABEL, "[%{public}s(%{public}s)] " fmt, __FILENAME__, __FUNCTION__, ##__VA_ARGS__)

#endif

// #define HILOG_FATAL(fmt, ...) HILOG_PRINT(Fatal, fmt, ##__VA_ARGS__)
// #define HILOG_ERROR(fmt, ...) HILOG_PRINT(Error, fmt, ##__VA_ARGS__)
// #define HILOG_WARN(fmt, ...) HILOG_PRINT(Warn, fmt, ##__VA_ARGS__)
// #define HILOG_INFO(fmt, ...) HILOG_PRINT(Info, fmt, ##__VA_ARGS__)
// #define HILOG_DEBUG(fmt, ...) HILOG_PRINT(Debug, fmt, ##__VA_ARGS__)

#define HILOG_FATAL(...) 
#define HILOG_ERROR(...) 
#define HILOG_WARN(...) 
#define HILOG_INFO(...) 
#define HILOG_DEBUG(...) 

#endif /* FOUNDATION_ACE_NAPI_UTILS_LOG_H */
