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

#ifndef RESOURCE_MANAGER_ZIPARCHIVE_H
#define RESOURCE_MANAGER_ZIPARCHIVE_H

#include <cstdint>
#include <cstdio>
#include <string>
#include <unzip.h>
#include "res_desc.h"
#include "res_config_impl.h"
#include "resource_manager.h"

namespace OHOS {
namespace Global {
namespace Resource {
class HapParser {
public:
    /**
     * Read specified file in zip to buffer
     * @param uf
     * @param fileName  file name in zip which we will read
     * @param buffer    bytes will write to buffer
     * @param bufLen    the file length in bytes
     * @return
     */
    static int32_t ReadFileFromZip(unzFile &uf, const char *fileName, std::unique_ptr<uint8_t[]> &buffer,
                                  size_t &bufLen);

    /**
     * Read resource.index in hap to buffer
     * @param zipFile hap file path
     * @param buffer  bytes will write to buffer
     * @param bufLen  length in bytes
     * @return
     */
    static int32_t ReadIndexFromFile(const char *zipFile, std::unique_ptr<uint8_t[]> &buffer, size_t &bufLen);

    /**
     * Read rawfile from hap
     * @param zipFile hap file path
     * @param buffer  bytes will write to buffer
     * @param bufLen  length in bytes
     * @param rawFilePath the path of rawfile
     * @param rawFile the rawfile info write to
     * @return
     */
    static int32_t ReadRawFileFromHap(const char *zipFile, std::unique_ptr<uint8_t[]> &buffer, size_t &bufLen,
                            const std::string &rawFilePath, std::unique_ptr<ResourceManager::RawFile> &rawFile);

    /**
     * Whether the hap is STAGE MODE or not
     * @param hapPath hap hap path
     * @return true if the hap is STAGE MODE, else false
     */
    static bool IsStageMode(unzFile &uf);

    /**
     * Parse resource hex to resDesc
     * @param buffer the resource bytes
     * @param bufLen length in bytes
     * @param resDesc index file in hap
     * @param defaultConfig the default config
     * @return OK if the resource hex parse success, else SYS_ERROR
     */
    static int32_t ParseResHex(const char *buffer, const size_t bufLen, ResDesc &resDesc,
                               const ResConfigImpl *defaultConfig = nullptr);

    /**
     * Create resource config from KeyParams
     * @param keyParams the keyParams contain type and value
     * @return the resource config related to the keyParams
     */
    static ResConfigImpl *CreateResConfigFromKeyParams(const std::vector<KeyParam *> &keyParams);

    /**
     * To resource folder path
     * @param keyParams the keyParams contain type and value
     * @return the resources folder path
     */
    static std::string ToFolderPath(const std::vector<KeyParam *> &keyParams);

    /**
     * Get screen density
     * @param value the type of screen density
     * @return the screen density related to the value
     */
    static ScreenDensity GetScreenDensity(uint32_t value);

    /**
     * Get device type
     * @param value the type of device
     * @return the device type related to the value
     */
    static DeviceType GetDeviceType(uint32_t value);

    /**
     * Get color mode
     * @param value the type of device
     * @return the color mode related to the value
     */
    static ColorMode GetColorMode(uint32_t value);

    /**
     * Get mcc
     * @param value the type of mcc
     * @return the mcc related to the value
     */
    static uint32_t GetMcc(uint32_t value);

    /**
     * Get mnc
     * @param value the type of mnc
     * @return the mnc related to the value
     */
    static uint32_t GetMnc(uint32_t value);
	
    /**
     * Get input device
     * @param value the type of input device
     * @return the input device related to the value
     */
    static InputDevice GetInputDevice(uint32_t value);

private:
    static const char *RES_FILE_NAME;
    struct Determiner {
        std::string mcc;
        std::string mnc;
        std::string language;
        std::string script;
        std::string region;
        std::string direction;
        std::string deviceType;
        std::string colorMode;
        std::string inputDevice;
        std::string screenDensity;
    };

    struct ResConfigKey {
        const char *language = nullptr;
        const char *script = nullptr;
        const char *region = nullptr;
        ScreenDensity screenDensity = SCREEN_DENSITY_NOT_SET;
        Direction direction = DIRECTION_NOT_SET;
        DeviceType deviceType = DEVICE_NOT_SET;
        ColorMode colorMode = COLOR_MODE_NOT_SET;
        InputDevice inputDevice = INPUTDEVICE_NOT_SET;
        uint32_t mcc = MCC_UNDEFINED;
        uint32_t mnc = MNC_UNDEFINED;
    };

    static std::string BuildFolderPath(Determiner *determiner);
    static ResConfigImpl *BuildResConfig(ResConfigKey *configKey);
};
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif
