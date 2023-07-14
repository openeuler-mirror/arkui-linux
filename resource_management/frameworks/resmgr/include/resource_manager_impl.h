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
#ifndef OHOS_RESOURCE_MANAGER_RESOURCEMANAGERIMPL_H
#define OHOS_RESOURCE_MANAGER_RESOURCEMANAGERIMPL_H

#include <map>
#include <string>
#include <vector>
#include "hap_manager.h"
#include "resource_manager.h"
#include "utils/psue_manager.h"

namespace OHOS {
namespace Global {
namespace Resource {
class ResourceManagerImpl : public ResourceManager {
public:
    ResourceManagerImpl();

    ~ResourceManagerImpl();

    bool Init();

    /**
     * Add resource path to hap paths
     * @param path the resource path
     * @return true if add resource path success, else false
     */
    virtual bool AddResource(const char *path);

    /**
     * Add resource path to overlay paths
     * @param path the resource path
     * @param overlayPaths the exist overlay resource path
     * @return true if add resource path success, else false
     */
    virtual bool AddResource(const std::string &path, const std::vector<std::string> &overlayPaths);

    /**
     * Update the resConfig
     * @param resConfig the resource config
     * @return SUCCESS if the resConfig updated success, else HAP_INIT_FAILED
     */
    virtual RState UpdateResConfig(ResConfig &resConfig);

    /**
     * Get the resConfig
     * @param resConfig the resource config
     */
    virtual void GetResConfig(ResConfig &resConfig);

    /**
     * Get string resource by Id
     * @param id the resource Id
     * @param outValue the string resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringById(uint32_t id, std::string &outValue);

    /**
     * Get string by resource name
     * @param name the resource name
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringByName(const char *name, std::string &outValue);

    /**
     * Get formatstring by resource id
     * @param id the resource id
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringFormatById(std::string &outValue, uint32_t id, ...);

    /**
     * Get formatstring by resource name
     * @param name the resource name
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringFormatByName(std::string &outValue, const char *name, ...);

    /**
     * Get the STRINGARRAY resource by resource id
     * @param id the resource id
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringArrayById(uint32_t id, std::vector<std::string> &outValue);

    /**
     * Get the STRINGARRAY resource by resource name
     * @param name the resource name
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetStringArrayByName(const char *name, std::vector<std::string> &outValue);

    /**
     * Get the PATTERN resource by resource id
     * @param id the resource id
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPatternById(uint32_t id, std::map<std::string, std::string> &outValue);

    /**
     * Get the PATTERN resource by resource name
     * @param name the resource name
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPatternByName(const char *name, std::map<std::string, std::string> &outValue);

    /**
     * Get the plural string by resource id
     * @param id the resource id
     * @param quantity the language quantity
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPluralStringById(uint32_t id, int quantity, std::string &outValue);

    /**
     * Get the plural string by resource name
     * @param name the resource name
     * @param quantity the language quantity
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPluralStringByName(const char *name, int quantity, std::string &outValue);

    /**
     * Get the plural format string by resource id
     * @param outValue the resource write to
     * @param id the resource id
     * @param quantity the language quantity
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPluralStringByIdFormat(std::string &outValue, uint32_t id, int quantity, ...);

    /**
     * Get the plural format string by resource name
     * @param outValue the resource write to
     * @param id the resource id
     * @param quantity the language quantity
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetPluralStringByNameFormat(std::string &outValue, const char *name, int quantity, ...);

    /**
     * Get the THEME resource by resource id
     * @param id the resource id
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetThemeById(uint32_t id, std::map<std::string, std::string> &outValue);

    /**
     * Get the THEME resource by resource name
     * @param name the resource name
     * @param outValue the resource write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetThemeByName(const char *name, std::map<std::string, std::string> &outValue);

    /**
     * Get the BOOLEAN resource by resource id
     * @param id the resource id
     * @param outValue the obtain boolean value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetBooleanById(uint32_t id, bool &outValue);

    /**
     * Get the BOOLEAN resource by resource name
     * @param name the resource name
     * @param outValue the obtain boolean value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetBooleanByName(const char *name, bool &outValue);

    /**
     * Get the INTEGER resource by resource id
     * @param id the resource id
     * @param outValue the obtain Integer value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetIntegerById(uint32_t id, int &outValue);

    /**
     * Get the INTEGER resource by resource name
     * @param name the resource name
     * @param outValue the obtain Integer value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetIntegerByName(const char *name, int &outValue);

    /**
     * Get the FLOAT resource by resource id
     * @param id the resource id
     * @param outValue the obtain float value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetFloatById(uint32_t id, float &outValue);

    /**
     * Get the FLOAT resource by resource id
     * @param id the resource id
     * @param outValue the obtain float value write to
     * @param unit the unit do not in parsing
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetFloatById(uint32_t id, float &outValue, std::string &unit);

    /**
     * Get the FLOAT resource by resource name
     * @param name the resource name
     * @param outValue the obtain float value write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetFloatByName(const char *name, float &outValue);

    /**
     * Get the FLOAT resource by resource id
     * @param id the resource id
     * @param outValue the obtain float value write to
     * @param unit the string do not in parsing
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetFloatByName(const char *name, float &outValue, std::string &unit);

    /**
     * Get the INTARRAY resource by resource id
     * @param id the resource id
     * @param outValue the obtain resource value convert to vector<int> write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetIntArrayById(uint32_t id, std::vector<int> &outValue);

    /**
     * Get the INTARRAY resource by resource name
     * @param name the resource name
     * @param outValue the obtain resource value convert to vector<int> write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetIntArrayByName(const char *name, std::vector<int> &outValue);

    /**
     * Get the COLOR resource by resource id
     * @param id the resource id
     * @param outValue the obtain resource value convert to uint32_t write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetColorById(uint32_t id, uint32_t &outValue);

    /**
     * Get the COLOR resource by resource name
     * @param name the resource name
     * @param outValue the obtain resource value convert to uint32_t write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetColorByName(const char *name, uint32_t &outValue);

    /**
     * Get the PROF resource by resource id
     * @param id the resource id
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetProfileById(uint32_t id, std::string &outValue);

    /**
     * Get the PROF resource by resource name
     * @param name the resource name
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetProfileByName(const char *name, std::string &outValue);

    /**
     * Get the MEDIA resource by resource id
     * @param id the resource id
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaById(uint32_t id, std::string &outValue);

    /**
     * Get the MEDIA resource by resource id with density
     * @param id the resource id
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaById(uint32_t id, uint32_t density, std::string &outValue);

    /**
     * Get the MEDIA resource by resource name
     * @param name the resource name
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaByName(const char *name, std::string &outValue);

    /**
     * Get the MEDIA resource by resource name with density
     * @param name the resource name
     * @param density the screen density,  within the area of OHOS::Global::Resource::ScreenDensity
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaByName(const char *name, uint32_t density, std::string &outValue);

    /**
     * Get the raw file path by resource name
     * @param name the resource name
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetRawFilePathByName(const std::string &name, std::string &outValue);

    /**
     * Get the rawFile descriptor by resource name
     * @param name the resource name
     * @param descriptor the obtain raw file member fd, length, offet write to
     * @return SUCCESS if resource exist, else ERROR
     */
    virtual RState GetRawFileDescriptor(const std::string &name, RawFileDescriptor &descriptor);

    /**
     * Close rawFile descriptor by resource name
     * @param name the resource name
     * @return SUCCESS if close the rawFile descriptor, else ERROR
     */
    virtual RState CloseRawFileDescriptor(const std::string &name);

    /**
     * Get all resource paths
     * @return The vector of resource paths
     */
    std::vector<std::string> GetResourcePaths();

    /**
     * Get the MEDIA base64 data resource by resource id with density
     * @param id the resource id
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param base64Data the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64ByIdData(uint32_t id, uint32_t density, std::string &base64Data);

    /**
     * Get the MEDIA base64 data resource by resource id with density
     * @param name the resource name
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param base64Data the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64ByNameData(const char *name, uint32_t density, std::string &base64Data);

    /**
     * Get the MEDIA data by resource id
     * @param id the resource id
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaDataById(uint32_t id, size_t &len, std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the MEDIA data by resource name
     * @param name the resource name
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaDataByName(const char *name, size_t &len, std::unique_ptr<uint8_t[]> &outValue);

        /**
     * Get the MEDIA data by resource id with density
     * @param id the resource id
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaDataById(uint32_t id, uint32_t density, size_t &len, std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the MEDIA data by resource name with density
     * @param name the resource name
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaDataByName(const char *name, uint32_t density, size_t &len,
        std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the MEDIA base64 data resource by resource id
     * @param id the resource id
     * @param outValue the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64DataById(uint32_t id, std::string &outValue);

    /**
     * Get the MEDIA base64 data resource by resource id
     * @param name the resource name
     * @param outValue the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64DataByName(const char *name, std::string &outValue);

    /**
     * Get the MEDIA base64 data resource by resource id with density
     * @param id the resource id
     * @param density the screen density, within the area of OHOS::Global::Resource::ScreenDensity
     * @param outValue the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64DataById(uint32_t id, uint32_t density, std::string &outValue);

    /**
     * Get the MEDIA base64 data resource by resource id with density
     * @param name the resource name
     * @param outValue the media base64 data
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetMediaBase64DataByName(const char *name, uint32_t density, std::string &outValue);

    /**
     * Get the PROF resource by resource id
     * @param name the resource id
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetProfileDataById(uint32_t id, size_t &len, std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the PROF resource by resource name
     * @param name the resource name
     * @param len the data len write to
     * @param outValue the obtain resource path write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetProfileDataByName(const char *name, size_t &len, std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the rawFile base64 from hap by rawFile name
     * @param rawFileName the rawFile name
     * @param rawFile the raw file infomation about offset, length, buffer write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetRawFileFromHap(const std::string &rawFileName, std::unique_ptr<RawFile> &rawFile);

    /**
     * Get the rawFile Descriptor from hap by rawFile name
     * @param rawFileName the rawFile name
     * @param descriptor the raw file member fd, length, offet write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    virtual RState GetRawFileDescriptorFromHap(const std::string &rawFileName, RawFileDescriptor &descriptor);

    /**
     * Is load hap
     */
    virtual RState IsLoadHap();

private:
    RState GetString(const IdItem *idItem, std::string &outValue);

    RState GetStringArray(const IdItem *idItem, std::vector<std::string> &outValue);

    RState GetPattern(const IdItem *idItem, std::map<std::string, std::string> &outValue);

    RState GetTheme(const IdItem *idItem, std::map<std::string, std::string> &outValue);

    RState GetPluralString(const HapResource::ValueUnderQualifierDir *vuqd, int quantity, std::string &outValue);

    RState ResolveReference(const std::string value, std::string &outValue);

    RState GetBoolean(const IdItem *idItem, bool &outValue);

    RState ParseFloat(const std::string &strValue, float &result, std::string &unit);

    RState RecalculateFloat(const std::string &unit, float &result);

    RState GetFloat(const IdItem *idItem, float &outValue, std::string &unit);

    RState GetInteger(const IdItem *idItem, int &outValue);

    RState GetColor(const IdItem *idItem, uint32_t &outValue);

    RState GetIntArray(const IdItem *idItem, std::vector<int> &outValue);

    RState GetRawFile(const HapResource::ValueUnderQualifierDir *vuqd, const ResType resType, std::string &outValue);

    void ProcessPsuedoTranslate(std::string &outValue);

    RState ResolveParentReference(const IdItem *idItem, std::map<std::string, std::string> &outValue);

    bool IsDensityValid(uint32_t density);

    bool IsFileExist(const std::string& path);

    HapManager *hapManager_;

    float fontRatio_ = 0.0f;

    bool isFakeLocale = false;

    PsueManager *psueManager_;

    const std::string VIRTUAL_PIXEL = "vp";

    const std::string FONT_SIZE_PIXEL = "fp";

    const std::string SYSTEM_RESOURCE_PATH = "/data/storage/el1/bundle/ohos.global.systemres" \
                                        "/ohos.global.systemres/assets/entry/resources.index";

    const std::string SYSTEM_RESOURCE_PATH_COMPRESSED = "/data/storage/el1/bundle/" \
                                                "systemResources/SystemResources.hap";

    const std::string SYSTEM_RESOURCE_OVERLAY_PATH = "/data/storage/el1/bundle/" \
            "ohos.global.systemres.overlay/ohos.global.systemres.overlay/assets/entry/resources.index";

    const std::string SYSTEM_RESOURCE_OVERLAY_PATH_COMPRESSED = "/data/storage/el1/bundle/" \
            "ohos.global.systemres.overlay/ohos.global.systemres.overlay/SystemResourcesOverlay.hap";

    std::unordered_map<std::string, RawFileDescriptor> rawFileDescriptor_;
};
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif