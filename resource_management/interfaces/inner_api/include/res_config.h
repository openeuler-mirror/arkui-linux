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
#ifndef OHOS_RESOURCE_MANAGER_RESCONFIG_H
#define OHOS_RESOURCE_MANAGER_RESCONFIG_H

#ifdef SUPPORT_GRAPHICS
#include <unicode/locid.h>
#endif
#include <vector>
#include "res_common.h"
#include "rstate.h"
#ifdef SUPPORT_GRAPHICS
using icu::Locale;
#endif
namespace OHOS {
namespace Global {
namespace Resource {
class ResConfig {
public:
    virtual RState SetLocaleInfo(const char *language, const char *script, const char *region) = 0;

#ifdef SUPPORT_GRAPHICS
    virtual RState SetLocaleInfo(Locale &localeInfo) = 0;
#endif

    virtual void SetDeviceType(DeviceType deviceType) = 0;

    virtual void SetDirection(Direction direction) = 0;

    virtual void SetScreenDensity(float screenDensity) = 0;

    virtual void SetColorMode(ColorMode colorMode) = 0;

    virtual void SetMcc(uint32_t mcc) = 0;

    virtual void SetMnc(uint32_t mnc) = 0;

#ifdef SUPPORT_GRAPHICS
    virtual const Locale *GetLocaleInfo() const = 0;
#endif

    virtual Direction GetDirection() const = 0;

    virtual float GetScreenDensity() const = 0;

    virtual DeviceType GetDeviceType() const = 0;

    virtual ColorMode GetColorMode() const = 0;

    virtual uint32_t GetMcc() const = 0;

    virtual uint32_t GetMnc() const = 0;

    virtual bool Copy(ResConfig &other) = 0;
	
    virtual void SetInputDevice(InputDevice inputDevice) = 0;
	
    virtual InputDevice GetInputDevice() const = 0;

    virtual ~ResConfig() {}
};

EXPORT_FUNC ResConfig *CreateResConfig();

#ifdef SUPPORT_GRAPHICS
EXPORT_FUNC const Locale *GetSysDefault();

EXPORT_FUNC void UpdateSysDefault(const Locale &localeInfo, bool needNotify);

EXPORT_FUNC Locale *BuildFromString(const char *str, char sep, RState &rState);

EXPORT_FUNC Locale *BuildFromParts(const char *language, const char *script, const char *region, RState &rState);
#endif

void FindAndSort(const std::string localeStr, std::vector<std::string> &candidateLocale,
    std::vector<std::string> &outValue);
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif