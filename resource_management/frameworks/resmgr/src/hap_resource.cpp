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

#include "hap_resource.h"

#include <algorithm>
#include <climits>
#include <cstdlib>
#include <fstream>
#include "utils/utils.h"

#ifdef __WINNT__
#include <shlwapi.h>
#include <windows.h>
#endif

#ifdef __LINUX__
#include <cstring>
#endif

#if !defined(__WINNT__) && !defined(__IDE_PREVIEW__) && !defined(__ARKUI_CROSS__)
#include "hitrace_meter.h"
#endif
#include "hap_parser.h"
#include "hilog_wrapper.h"
#include "utils/errors.h"

namespace OHOS {
namespace Global {
namespace Resource {
HapResource::ValueUnderQualifierDir::ValueUnderQualifierDir(const std::vector<KeyParam *> &keyParams, IdItem *idItem,
    HapResource *hapResource, bool isOverlay, bool systemResource) : hapResource_(hapResource)
{
    keyParams_ = keyParams;
    folder_ = HapParser::ToFolderPath(keyParams_);
    idItem_ = idItem;
    isOverlay_ = isOverlay;
    isSystemResource_ = systemResource;
    InitResConfig();
}

HapResource::ValueUnderQualifierDir::~ValueUnderQualifierDir()
{
    // keyParams_ idItem_ was passed into this, we don't delete them because someone will do
    if (resConfig_ != nullptr) {
        delete (resConfig_);
        resConfig_ = nullptr;
    }
}

void HapResource::ValueUnderQualifierDir::InitResConfig()
{
    resConfig_ = HapParser::CreateResConfigFromKeyParams(keyParams_);
}

// IdValues
HapResource::IdValues::~IdValues()
{
    for (size_t i = 0; i < limitPaths_.size(); ++i) {
        if (limitPaths_[i] != nullptr) {
            delete limitPaths_[i];
            limitPaths_[i] = nullptr;
        }
    }
}

// HapResource
HapResource::HapResource(const std::string path, time_t lastModTime, const ResConfig *defaultConfig, ResDesc *resDes)
    : indexPath_(path), lastModTime_(lastModTime), resDesc_(resDes), defaultConfig_(defaultConfig)
{
}

HapResource::~HapResource()
{
    if (resDesc_ != nullptr) {
        delete (resDesc_);
        resDesc_ = nullptr;
    }
    std::map<uint32_t, IdValues *>::iterator iter;
    for (iter = idValuesMap_.begin(); iter != idValuesMap_.end(); ++iter) {
        if (iter->second != nullptr) {
            IdValues *ptr = iter->second;
            delete (ptr);
            iter->second = nullptr;
        }
    }

    for (size_t i = 0; i < idValuesNameMap_.size(); ++i) {
        if (idValuesNameMap_[i] != nullptr) {
            delete (idValuesNameMap_[i]);
            idValuesNameMap_[i] = nullptr;
        }
    }
    lastModTime_ = 0;
    // defaultConfig_ was passed by constructor, we do not delete it here
    defaultConfig_ = nullptr;
}

void CanonicalizePath(const char *path, char *outPath, size_t len)
{
#if !defined(__WINNT__) && !defined(__IDE_PREVIEW__) && !defined(__ARKUI_CROSS__)
    HITRACE_METER_NAME(HITRACE_TAG_APP, __PRETTY_FUNCTION__);
#endif
    if (path == nullptr) {
        HILOG_ERROR("path is null");
        return;
    }
    if (strlen(path) >= len) {
        HILOG_ERROR("the length of path longer than len");
        return;
    }
#ifdef __WINNT__
    if (!PathCanonicalizeA(outPath, path)) {
        HILOG_ERROR("failed to canonicalize the path");
        return;
    }
#else
    if (realpath(path, outPath) == nullptr) {
        HILOG_ERROR("failed to realpath the path errno:%{public}d", errno);
        return;
    }
#endif
}

const HapResource* HapResource::Load(const char *path, const ResConfigImpl* defaultConfig, bool system)
{
    if (Utils::ContainsTail(path, Utils::tailSet)) {
        return LoadFromHap(path, defaultConfig, system);
    } else {
        return LoadFromIndex(path, defaultConfig, system);
    }
}

const HapResource* HapResource::LoadFromIndex(const char *path, const ResConfigImpl *defaultConfig, bool system)
{
    char outPath[PATH_MAX + 1] = {0};
    CanonicalizePath(path, outPath, PATH_MAX);
    std::ifstream inFile(outPath, std::ios::binary | std::ios::in);
    if (!inFile.good()) {
        return nullptr;
    }
    inFile.seekg(0, std::ios::end);
    int bufLen = inFile.tellg();
    if (bufLen <= 0) {
        HILOG_ERROR("file size is zero");
        inFile.close();
        return nullptr;
    }
    void *buf = malloc(bufLen);
    if (buf == nullptr) {
        HILOG_ERROR("Error allocating memory");
        inFile.close();
        return nullptr;
    }
    inFile.seekg(0, std::ios::beg);
    inFile.read(static_cast<char *>(buf), bufLen);
    inFile.close();

    HILOG_DEBUG("extract success, bufLen:%d", bufLen);

    ResDesc *resDesc = new (std::nothrow) ResDesc();
    if (resDesc == nullptr) {
        HILOG_ERROR("new ResDesc failed when LoadFromIndex");
        free(buf);
        return nullptr;
    }
    int32_t out = HapParser::ParseResHex(static_cast<char *>(buf), bufLen, *resDesc, defaultConfig);
    if (out != OK) {
        delete (resDesc);
        free(buf);
        HILOG_ERROR("ParseResHex failed! retcode:%d", out);
        return nullptr;
    }
    free(buf);

    HapResource *pResource = new (std::nothrow) HapResource(std::string(path), 0, defaultConfig, resDesc);
    if (pResource == nullptr) {
        HILOG_ERROR("new HapResource failed when LoadFromIndex");
        delete (resDesc);
        return nullptr;
    }
    if (!pResource->Init(system)) {
        delete (pResource);
        return nullptr;
    }
    return pResource;
}

const HapResource* HapResource::LoadFromHap(const char *path, const ResConfigImpl *defaultConfig, bool system)
{
    std::unique_ptr<uint8_t[]> tmpBuf;
    size_t tmpLen;
    int32_t ret = HapParser::ReadIndexFromFile(path, tmpBuf, tmpLen);
    if (ret != OK) {
        HILOG_ERROR("read Index from file failed");
        return nullptr;
    }
    ResDesc *resDesc = new (std::nothrow) ResDesc();
    if (resDesc == nullptr) {
        HILOG_ERROR("new ResDesc failed when LoadFromHap");
        return nullptr;
    }
    int32_t out = HapParser::ParseResHex(reinterpret_cast<char *>(tmpBuf.get()), tmpLen, *resDesc, defaultConfig);
    if (out != OK) {
        HILOG_ERROR("ParseResHex failed! retcode:%d", out);
        delete (resDesc);
        return nullptr;
    }

    HapResource *pResource = new (std::nothrow) HapResource(path, 0, defaultConfig, resDesc);
    if (pResource == nullptr) {
        delete (resDesc);
        return nullptr;
    }

    if (!pResource->Init(system)) {
        delete (pResource);
        return nullptr;
    }
    return pResource;
}

const std::unordered_map<std::string, HapResource *> HapResource::LoadOverlays(const std::string &path,
    const std::vector<std::string> &overlayPaths, const ResConfigImpl *defaultConfig)
{
    std::unordered_map<std::string, HapResource *> result;
    do {
        const HapResource *targetResource = Load(path.c_str(), defaultConfig, true);
        if (targetResource == nullptr) {
            HILOG_ERROR("load target failed");
            break;
        }
        result[path] = const_cast<HapResource*>(targetResource);
        bool success = true;
        std::unordered_map<std::string, std::unordered_map<ResType, uint32_t>> mapping =
            targetResource->BuildNameTypeIdMapping();
        for (auto iter = overlayPaths.begin(); iter != overlayPaths.end(); iter++) {
            const HapResource *overlayResource = Load(iter->c_str(), defaultConfig);
            if (overlayResource == nullptr) {
                HILOG_ERROR("load overlay failed");
                success = false;
                break;
            }
            result[*iter] = const_cast<HapResource*>(overlayResource);
        }

        if (!success) {
            HILOG_ERROR("load overlay failed");
            break;
        }

        for (auto iter = result.begin(); iter != result.end(); iter++) {
            auto index = iter->first.find(path);
            if (index == std::string::npos) {
                iter->second->UpdateOverlayInfo(mapping);
            }
        }
        return result;
    } while (false);

    for_each (result.begin(), result.end(), [](auto &iter) {
        delete iter.second;
    });
    return std::unordered_map<std::string, HapResource *>();
}

std::unordered_map<std::string, std::unordered_map<ResType, uint32_t>> HapResource::BuildNameTypeIdMapping() const
{
    std::unordered_map<std::string, std::unordered_map<ResType, uint32_t>> result;
    for (auto iter = idValuesMap_.begin(); iter != idValuesMap_.end(); iter++) {
        const std::vector<ValueUnderQualifierDir *> &limitPaths = iter->second->GetLimitPathsConst();
        if (limitPaths.size() > 0) {
            ValueUnderQualifierDir* value = limitPaths[0];
            result[value->idItem_->name_][value->idItem_->resType_] = value->idItem_->id_;
        }
    }
    return result;
}

void HapResource::UpdateOverlayInfo(std::unordered_map<std::string, std::unordered_map<ResType, uint32_t>> &nameTypeId)
{
    std::map<uint32_t, IdValues *> newIdValuesMap;
    for (auto iter = idValuesMap_.begin(); iter != idValuesMap_.end(); iter++) {
        const std::vector<ValueUnderQualifierDir *> &limitPaths = iter->second->GetLimitPathsConst();
        if (limitPaths.size() > 0) {
            ValueUnderQualifierDir *value = limitPaths[0];
            std::string name = value->idItem_->name_;
            ResType type = value->idItem_->resType_;
            if (nameTypeId.find(name) == nameTypeId.end()) {
                continue;
            }
            auto &typeId = nameTypeId[name];
            if (typeId.find(type) == typeId.end()) {
                continue;
            }
            uint32_t newId = typeId[type];
            for_each(limitPaths.begin(), limitPaths.end(), [&](auto &item) {
                item->idItem_->id_ = newId;
                item->isOverlay_ = true;
            });
            newIdValuesMap[newId] = iter->second;
        }
    }
    idValuesMap_.swap(newIdValuesMap);
}

bool HapResource::Init(bool system)
{
#if !defined(__WINNT__) && !defined(__IDE_PREVIEW__) && !defined(__ARKUI_CROSS__)
    HITRACE_METER_NAME(HITRACE_TAG_APP, __PRETTY_FUNCTION__);
#endif
#ifdef __WINNT__
    char separator = '\\';
#else
    char separator = '/';
#endif
    auto index = indexPath_.rfind(separator);
    if (index == std::string::npos) {
        HILOG_ERROR("index path format error, %s", indexPath_.c_str());
        return false;
    }
#if defined(__IDE_PREVIEW__) || defined(__ARKUI_CROSS__)
    resourcePath_ = indexPath_.substr(0, index + 1);
#else
    index = indexPath_.rfind(separator, index - 1);
    if (index == std::string::npos) {
        HILOG_ERROR("index path format error, %s", indexPath_.c_str());
        return false;
    }
    resourcePath_ = indexPath_.substr(0, index + 1);
#endif
    for (int i = 0; i < ResType::MAX_RES_TYPE; ++i) {
        auto mptr = new (std::nothrow) std::map<std::string, IdValues *>();
        if (mptr == nullptr) {
            HILOG_ERROR("new std::map failed in HapResource::Init");
            return false;
        }
        idValuesNameMap_.push_back(mptr);
    }
    return InitIdList(system);
}

bool HapResource::InitIdList(bool system)
{
    if (resDesc_ == nullptr) {
        HILOG_ERROR("resDesc_ is null ! InitIdList failed");
        return false;
    }
    for (size_t i = 0; i < resDesc_->keys_.size(); i++) {
        ResKey *resKey = resDesc_->keys_[i];

        for (size_t j = 0; j < resKey->resId_->idParams_.size(); ++j) {
            IdParam *idParam = resKey->resId_->idParams_[j];
            uint32_t id = idParam->id_;
            std::map<uint32_t, IdValues *>::iterator iter = idValuesMap_.find(id);
            if (iter == idValuesMap_.end()) {
                auto idValues = new (std::nothrow) HapResource::IdValues();
                if (idValues == nullptr) {
                    HILOG_ERROR("new IdValues failed in HapResource::InitIdList");
                    return false;
                }
                auto limitPath = new (std::nothrow) HapResource::ValueUnderQualifierDir(resKey->keyParams_,
                    idParam->idItem_, this, false, system);
                if (limitPath == nullptr) {
                    HILOG_ERROR("new ValueUnderQualifierDir failed in HapResource::InitIdList");
                    delete (idValues);
                    return false;
                }
                idValues->AddLimitPath(limitPath);
                idValuesMap_.insert(std::make_pair(id, idValues));
                std::string name = std::string(idParam->idItem_->name_);
                idValuesNameMap_[idParam->idItem_->resType_]->insert(std::make_pair(name, idValues));
            } else {
                HapResource::IdValues *idValues = iter->second;
                auto limitPath = new (std::nothrow) HapResource::ValueUnderQualifierDir(resKey->keyParams_,
                    idParam->idItem_, this, false, system);
                if (limitPath == nullptr) {
                    HILOG_ERROR("new ValueUnderQualifierDir failed in HapResource::InitIdList");
                    return false;
                }
                idValues->AddLimitPath(limitPath);
            }
        }
    }
    return true;
};

const HapResource::IdValues *HapResource::GetIdValues(const uint32_t id) const
{
    if (idValuesMap_.empty()) {
        HILOG_ERROR("idValuesMap_ is empty");
        return nullptr;
    }
    uint32_t uid = id;
    std::map<uint32_t, IdValues *>::const_iterator iter = idValuesMap_.find(uid);
    if (iter == idValuesMap_.end()) {
        return nullptr;
    }

    return iter->second;
}

const HapResource::IdValues *HapResource::GetIdValuesByName(
    const std::string name, const ResType resType) const
{
    const std::map<std::string, IdValues *> *map = idValuesNameMap_[resType];
    std::map<std::string, IdValues *>::const_iterator iter = map->find(name);
    if (iter == map->end()) {
        return nullptr;
    }

    return iter->second;
}

int HapResource::GetIdByName(const char *name, const ResType resType) const
{
    if (name == nullptr) {
        return -1;
    }
    const std::map<std::string, IdValues *> *map = idValuesNameMap_[resType];
    std::map<std::string, IdValues *>::const_iterator iter = map->find(name);
    if (iter == map->end()) {
        return OBJ_NOT_FOUND;
    }
    const IdValues *ids = iter->second;

    if (ids->GetLimitPathsConst().size() == 0) {
        HILOG_ERROR("limitPaths empty");
        return UNKNOWN_ERROR;
    }

    if (ids->GetLimitPathsConst()[0]->GetIdItem()->resType_ != resType) {
        HILOG_ERROR("ResType mismatch");
        return UNKNOWN_ERROR;
    }
    return ids->GetLimitPathsConst()[0]->GetIdItem()->id_;
}

const std::vector<std::string> HapResource::GetQualifiers() const
{
    std::vector<std::string> result;
    for (size_t i = 0; i < resDesc_->keys_.size(); i++) {
        result.push_back(resDesc_->keys_[i]->ToString());
    }
    return result;
}
} // namespace Resource
} // namespace Global
} // namespace OHOS
