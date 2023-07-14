/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
#ifndef OHOS_RESOURCE_MANAGER_RESCONFIG_IMPL_H
#define OHOS_RESOURCE_MANAGER_RESCONFIG_IMPL_H

#include <stdint.h>
#include "res_locale.h"
#include "res_common.h"
#include "res_config.h"

#ifdef SUPPORT_GRAPHICS
using icu::Locale;
#endif
namespace OHOS {
namespace Global {
namespace Resource {
class ResConfigImpl : public ResConfig {
public:
    ResConfigImpl();

    /**
     * Whether this resConfig more match request resConfig
     * @param other the other resConfig
     * @param request  the request resConfig
     * @param density the input screen density
     * @return true if this resConfig more match request resConfig than other resConfig, else false
     */
    bool IsMoreSuitable(const ResConfigImpl *other, const ResConfigImpl *request, uint32_t density = 0) const;

    /**
     * Set locale information
     * @param language the locale language
     * @param script  the locale script
     * @param region  the locale region
     * @return SUCCESS if set locale information success, else false
     */
    RState SetLocaleInfo(const char *language, const char *script, const char *region);

#ifdef SUPPORT_GRAPHICS
    RState SetLocaleInfo(Locale &localeInfo);
#endif
    /**
     * Set resConfig device type
     * @param deviceType the device type
     */
    void SetDeviceType(DeviceType deviceType);

    /**
     * Set resConfig direction
     * @param direction the resConfig direction
     */
    void SetDirection(Direction direction);

    /**
     * Set resConfig colorMode
     * @param colorMode the resConfig colorMode
     */
    void SetColorMode(ColorMode colorMode);

    /**
     * Set resConfig mcc
     * @param mcc the resConfig mcc
     */
    void SetMcc(uint32_t mcc);

    /**
     * Set resConfig mnc
     * @param mnc the resConfig mnc
     */
    void SetMnc(uint32_t mnc);

    /**
     * Set resConfig screenDensity
     * @param screenDensity the resConfig screenDensity
     */
    void SetScreenDensity(float screenDensity);

#ifdef SUPPORT_GRAPHICS
    const Locale *GetLocaleInfo() const;
#endif

    const ResLocale *GetResLocale() const;

    Direction GetDirection() const;

    float GetScreenDensity() const;

    ColorMode GetColorMode() const;

    uint32_t GetMcc() const;

    uint32_t GetMnc() const;

    DeviceType GetDeviceType() const;

    /**
     * Whether this resConfig match other resConfig
     * @param other the other resConfig
     * @return true if this resConfig match other resConfig, else false
     */
    bool Match(const ResConfigImpl *other) const;

    /**
     * Copy other resConfig to this resConfig
     * @param other the other resConfig
     * @return true if copy other resConfig to this resConfig success, else false
     */
    bool Copy(ResConfig &other);

    /**
     * Complete the local script
     */
    void CompleteScript();

    /**
     * Whether this resLocal script completed
     * @return true if resLocal script completed, else false
     */
    bool IsCompletedScript() const;
	
    /**
     * Set resConfig input device
     * @param inputDevice the resConfig input device
     */
    void SetInputDevice(InputDevice inputDevice);
	
    /**
     * Get resConfig input device
     * @return the resConfig input device
     */
    InputDevice GetInputDevice() const;

    virtual ~ResConfigImpl();

private:
    bool IsMoreSpecificThan(const ResConfigImpl *other, uint32_t density = 0) const;

    bool CopyLocale(ResConfig &other);

    bool IsMccMncMatch(uint32_t mcc,  uint32_t mnc) const;

    bool IsDirectionMatch(Direction direction) const;

    bool IsDeviceTypeMatch(DeviceType deviceType) const;

    bool IsColorModeMatch(ColorMode colorMode) const;

    bool IsInputDeviceMatch(InputDevice inputDevice) const;

    int IsMccMncMoreSuitable(uint32_t otherMcc, uint32_t otherMnc, uint32_t requestMcc, uint32_t requestMnc) const;

    int IsDensityMoreSuitable(ScreenDensity otherDensity, ScreenDensity requestDensity, uint32_t density = 0) const;

    bool IsDensityMoreSuitable(int thisDistance, int otherDistance) const;

    int IsDensityMoreSpecificThan(ScreenDensity otherDensity, uint32_t density = 0) const;

    ScreenDensity ConvertDensity(float density);
private:
    ResLocale *resLocale_;
    Direction direction_;
    float density_;
    ScreenDensity screenDensityDpi_;
    ColorMode colorMode_;
    uint32_t mcc_;
    uint32_t mnc_;
    DeviceType deviceType_;
    InputDevice inputDevice_;
#ifdef SUPPORT_GRAPHICS
    Locale *localeInfo_;
#endif
    bool isCompletedScript_;
};
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif