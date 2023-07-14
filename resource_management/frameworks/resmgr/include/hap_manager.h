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
#ifndef OHOS_RESOURCE_MANAGER_HAPMANAGER_H
#define OHOS_RESOURCE_MANAGER_HAPMANAGER_H

#include "res_config_impl.h"
#include "hap_resource.h"
#include "res_desc.h"
#include "resource_manager.h"
#include "lock.h"

#ifdef SUPPORT_GRAPHICS
#include <unicode/plurrule.h>
#endif

namespace OHOS {
namespace Global {
namespace Resource {
class HapManager {
public:
    /**
     * The constructor of HapManager
     */
    explicit HapManager(ResConfigImpl *resConfig);

    /**
     * The destructor of HapManager
     */
    ~HapManager();

    /**
     * Update the resConfig
     * @param resConfig the resource config
     * @return SUCCESS if the resConfig updated success, else HAP_INIT_FAILED
     */
    RState UpdateResConfig(ResConfig &resConfig);

    /**
     * Get the resConfig
     * @param resConfig the resource config
     */
    void GetResConfig(ResConfig &resConfig);

    /**
     * Add resource path to hap paths
     * @param path the resource path
     * @return true if add resource path success, else false
     */
    bool AddResource(const char *path);

    /**
     * Add resource path to overlay paths
     * @param path the resource path
     * @param overlayPaths the exist overlay resource path
     * @return true if add resource path success, else false
     */
    bool AddResource(const std::string &path, const std::vector<std::string> &overlayPaths);

    /**
     * Find resource by resource id
     * @param id the resource id
     * @return the resources related to resource id
     */
    const IdItem *FindResourceById(uint32_t id);

    /**
     * Find resource by resource name
     * @param name the resource name
     * @param resType the resource type
     * @return the resources related to resource name
     */
    const IdItem *FindResourceByName(const char *name, const ResType resType);

    /**
     * Find best resource path by resource id
     * @param id the resource id
     * @param density the input screen density
     * @return the best resource path
     */
    const HapResource::ValueUnderQualifierDir *FindQualifierValueById(uint32_t id, uint32_t density = 0);
    
    /**
     * Find best resource path by resource name
     * @param name the resource name
     * @param resType the resource type
     * @param density the input screen density
     * @return the best resource path
     */
    const HapResource::ValueUnderQualifierDir *FindQualifierValueByName(const char *name, const ResType resType,
        uint32_t density = 0);

    /**
     * Find the raw file path
     * @param name the resource name
     * @param outValue raw file path
     * @return SUCCESS if find the raw file path success, else NOT_FOUND
     */
    RState FindRawFile(const std::string &name, std::string &outValue);

    /**
     * Get the language pluralRule related to quantity
     * @param quantity the language quantity
     * @return the language pluralRule related to quantity
     */
    std::string GetPluralRulesAndSelect(int quantity);

    /**
     * Get resource paths vector
     */
    std::vector<std::string> GetResourcePaths();

    /**
     * Get the media data
     * @param qd the QualifierDir
     * @param len the data len
     * @param outValue the media data
     * @return SUCCESS if get the media data success, else NOT_FOUND
     */
    RState GetMediaData(const HapResource::ValueUnderQualifierDir *qd, size_t& len,
        std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Get the mediabase64 data
     * @param qd the QualifierDir
     * @param outValue the mediabase64 data
     * @return SUCCESS if get the mediabase64 data success, else NOT_FOUND
     */
    RState GetMediaBase64Data(const HapResource::ValueUnderQualifierDir *qd, std::string &outValue);

    /**
     * Get the Profile data
     * @param qd the QualifierDir
     * @param len the data len write to
     * @param outValue the profile data
     * @return SUCCESS if get the profile data success, else NOT_FOUND
     */
    RState GetProfileData(const HapResource::ValueUnderQualifierDir *qd, size_t &len,
        std::unique_ptr<uint8_t[]> &outValue);

    /**
     * Find raw file from hap
     * @param rawFileName the rawFileName
     * @param rawFile the raw file infomation about offset, length, data write to
     * @return SUCCESS if resource exist, else NOT_FOUND
     */
    RState FindRawFileFromHap(const std::string &rawFileName, std::unique_ptr<ResourceManager::RawFile> &rawFile);

    /**
     * Is load hap
     */
    bool IsLoadHap();

private:
    void UpdateResConfigImpl(ResConfigImpl &resConfig);

    void GetResConfigImpl(ResConfigImpl &resConfig);

    std::vector<const HapResource::IdValues *> GetResourceList(uint32_t ident) const;

    std::vector<const HapResource::IdValues *> GetResourceListByName(const char *name, const ResType resType) const;

    const HapResource::ValueUnderQualifierDir *GetBestMatchResource(std::vector<const HapResource::IdValues *>
        candidates, uint32_t density);

    bool AddResourcePath(const char *path);

    // when resConfig_ updated we must call ReloadAll()
    RState ReloadAll();

    static bool Init();

    static bool icuInitialized;

    // app res config
    ResConfigImpl *resConfig_;

    // set of hap Resources
    std::vector<HapResource *> hapResources_;

    // set of loaded hap path
    std::unordered_map<std::string, std::vector<std::string>> loadedHapPaths_;

#ifdef SUPPORT_GRAPHICS
    // key is language
    std::vector<std::pair<std::string, icu::PluralRules *>> plurRulesCache_;
#endif

    Lock lock_;
};
} // namespace Resource
} // namespace Global
} // namespace OHOS
#endif