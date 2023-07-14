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
#include "hap_manager.h"

#include <algorithm>
#include <fstream>
#include <climits>
#include <cstdlib>
#include <fcntl.h>
#include <unistd.h>
#include "utils/errors.h"
#ifdef SUPPORT_GRAPHICS
// #include <ohos/init_data.h>
#include <unicode/unistr.h>
#include <unicode/utypes.h>
#endif

#include "auto_mutex.h"
#include "hilog_wrapper.h"

#include "hap_parser.h"
#include "utils/utils.h"

#ifdef __WINNT__
#include <shlwapi.h>
#include <windows.h>
#else
#include <dlfcn.h>
#endif

#if !defined(__WINNT__) && !defined(__IDE_PREVIEW__) && !defined(__ARKUI_CROSS__)
#include "hisysevent_adapter.h"
#endif

namespace OHOS {
namespace Global {
namespace Resource {
#ifdef SUPPORT_GRAPHICS
constexpr uint32_t PLURAL_CACHE_MAX_COUNT = 3;
#endif
HapManager::HapManager(ResConfigImpl *resConfig)
    : resConfig_(resConfig)
{
}

bool HapManager::icuInitialized = HapManager::Init();

bool HapManager::Init()
{
#ifdef SUPPORT_GRAPHICS
#ifdef __IDE_PREVIEW__
#ifdef __WINNT__
    MEMORY_BASIC_INFORMATION mbi;
    if (::VirtualQuery((LPCVOID)SetHwIcuDirectory, &mbi, sizeof(mbi)) != 0) {
        char path[MAX_PATH] = { 0 };
        GetModuleFileName((HMODULE)mbi.AllocationBase, path, MAX_PATH);
        std::string tempPath(path);
        auto pos = tempPath.rfind('\\');
        if (pos != std::string::npos) {
            u_setDataDirectory(tempPath.substr(0, pos).c_str());
        }
    }
#else
    // Fangtian TODO
    // Dl_info info;
    // if (dladdr((void*)SetHwIcuDirectory, &info) != 0) {
    //     std::string tempPath(info.dli_fname);
    //     auto pos = tempPath.rfind('/');
    //     if (pos != std::string::npos) {
    //         u_setDataDirectory(tempPath.substr(0, pos).c_str());
    //     }
    // }
#endif
#else
#if !defined(__ARKUI_CROSS__)
    SetHwIcuDirectory();
#endif
#endif
#endif
    return true;
}

std::string HapManager::GetPluralRulesAndSelect(int quantity)
{
    std::string defaultRet("other");
#ifdef SUPPORT_GRAPHICS
    AutoMutex mutex(this->lock_);
    if (this->resConfig_ == nullptr || this->resConfig_->GetResLocale() == nullptr ||
        this->resConfig_->GetResLocale()->GetLanguage() == nullptr) {
        HILOG_ERROR("GetPluralRules language is null!");
        return defaultRet;
    }
    std::string language = this->resConfig_->GetResLocale()->GetLanguage();

    icu::PluralRules *pluralRules = nullptr;
    for (uint32_t i = 0; i < plurRulesCache_.size(); i++) {
        auto pair = plurRulesCache_[i];
        if (language == pair.first) {
            // cache hit
            pluralRules = pair.second;
            break;
        }
    }

    if (pluralRules == nullptr) {
        // no cache hit
        icu::Locale locale(language.c_str());
        if (locale.isBogus()) {
            HILOG_ERROR("icu::Locale init error : %s", language.c_str());
            return defaultRet;
        }
        UErrorCode status = U_ZERO_ERROR;
        pluralRules = icu::PluralRules::forLocale(locale, status);
        if (status != U_ZERO_ERROR) {
            HILOG_ERROR("icu::PluralRules::forLocale error : %d", status);
            return defaultRet;
        }
        // after PluralRules created, we add it to cache, if > 3 delete oldest one
        if (plurRulesCache_.size() >= PLURAL_CACHE_MAX_COUNT) {
            HILOG_DEBUG("cache rotate delete plurRulesMap_ %s", plurRulesCache_[0].first.c_str());
            delete (plurRulesCache_[0].second);
            plurRulesCache_.erase(plurRulesCache_.begin());
        }
        auto plPair = std::make_pair(language, pluralRules);
        plurRulesCache_.push_back(plPair);
    }
    std::string converted;
    icu::UnicodeString us = pluralRules->select(quantity);
    us.toUTF8String(converted);
    return converted;
#else
    return defaultRet;
#endif
}

const IdItem *HapManager::FindResourceById(uint32_t id)
{
    auto qualifierValue = FindQualifierValueById(id);
    if (qualifierValue == nullptr) {
        return nullptr;
    }
    return qualifierValue->GetIdItem();
}

const IdItem *HapManager::FindResourceByName(const char *name, const ResType resType)
{
    auto qualifierValue = FindQualifierValueByName(name, resType);
    if (qualifierValue == nullptr) {
        return nullptr;
    }
    return qualifierValue->GetIdItem();
}

const HapResource::ValueUnderQualifierDir *HapManager::FindQualifierValueByName(
    const char *name, const ResType resType, uint32_t density)
{
    AutoMutex mutex(this->lock_);
    std::vector<const HapResource::IdValues *> candidates = this->GetResourceListByName(name, resType);
    if (candidates.size() == 0) {
        return nullptr;
    }
    return this->GetBestMatchResource(candidates, density);
}

const HapResource::ValueUnderQualifierDir *HapManager::FindQualifierValueById(uint32_t id, uint32_t density)
{
    AutoMutex mutex(this->lock_);
    std::vector<const HapResource::IdValues *> candidates = this->GetResourceList(id);
    if (candidates.size() == 0) {
        return nullptr;
    }
    return this->GetBestMatchResource(candidates, density);
}

const HapResource::ValueUnderQualifierDir *HapManager::GetBestMatchResource(std::vector<const HapResource::IdValues *>
    candidates, uint32_t density)
{
    const ResConfigImpl *bestResConfig = nullptr;
    const ResConfigImpl *bestOverlayResConfig = nullptr;
    const HapResource::ValueUnderQualifierDir *result = nullptr;
    const HapResource::ValueUnderQualifierDir *overlayResult = nullptr;
    const ResConfigImpl *currentResConfig = this->resConfig_;
    for (auto iter = candidates.begin(); iter != candidates.end(); iter++) {
        const std::vector<HapResource::ValueUnderQualifierDir *> paths = (*iter)->GetLimitPathsConst();
        size_t len = paths.size();
        size_t i = 0;
        bool isOverlayHapResource = paths[0]->IsOverlay();
        for (i = 0; i < len; i++) {
            HapResource::ValueUnderQualifierDir *path = paths[i];
            const ResConfigImpl *resConfig = path->GetResConfig();
            if (!this->resConfig_->Match(resConfig)) {
                continue;
            }
            if (isOverlayHapResource) {
                if (bestOverlayResConfig == nullptr) {
                    bestOverlayResConfig = resConfig;
                    overlayResult = paths[i];
                    continue;
                }
                if (!bestOverlayResConfig->IsMoreSuitable(resConfig, currentResConfig, density)) {
                    bestOverlayResConfig = resConfig;
                    overlayResult = paths[i];
                }
            } else {
                if (bestResConfig == nullptr) {
                    bestResConfig = resConfig;
                    result = paths[i];
                    continue;
                }
                if (!bestResConfig->IsMoreSuitable(resConfig, currentResConfig, density)) {
                    bestResConfig = resConfig;
                    result = paths[i];
                }
            }
        }
    }
    if (bestOverlayResConfig != nullptr && result != nullptr && result->IsSystemResource()) {
        if (bestOverlayResConfig->IsMoreSuitable(bestResConfig, currentResConfig, density)) {
            return overlayResult;
        }
    }
    return result;
}

RState HapManager::FindRawFile(const std::string &name, std::string &outValue)
{
#ifdef __WINNT__
    char seperator = '\\';
#else
    char seperator = '/';
#endif
    for (auto iter = hapResources_.rbegin(); iter != hapResources_.rend(); iter++) {
        std::string indexPath = (*iter)->GetIndexPath();
        auto index = indexPath.rfind(seperator);
        if (index == std::string::npos) {
            HILOG_ERROR("index path format error, %s", indexPath.c_str());
            continue;
        }
        std::string resourcesIndexPath = indexPath.substr(0, index);
        char tmpPath[PATH_MAX] = {0};
        std::string tempName = name;
        const std::string rawFileDirName = "rawfile/";
        if (tempName.length() <= rawFileDirName.length()
            || (tempName.compare(0, rawFileDirName.length(), rawFileDirName) != 0)) {
            tempName = rawFileDirName + tempName;
        }
#ifdef __WINNT__
        if (!PathCanonicalizeA(tmpPath, (resourcesIndexPath + "/resources/" + tempName).c_str())) {
            continue;
        }
#else
        if (realpath((resourcesIndexPath + "/resources/" + tempName).c_str(), tmpPath) == nullptr) {
            HILOG_ERROR("FindRawFile path to realpath error");
            continue;
        }
#endif
        const std::string realPath = tmpPath;
        if (realPath.length() > resourcesIndexPath.length()
            && (realPath.compare(0, resourcesIndexPath.length(), resourcesIndexPath) == 0)) {
            std::fstream inputFile;
            inputFile.open(realPath, std::ios::in);
            if (inputFile) {
                outValue = realPath;
                return SUCCESS;
            }
        }
    }
    return ERROR_CODE_RES_PATH_INVALID;
}

RState HapManager::UpdateResConfig(ResConfig &resConfig)
{
    AutoMutex mutex(this->lock_);
    this->resConfig_->Copy(resConfig);
    RState rState = this->ReloadAll();
    if (rState != SUCCESS) {
        HILOG_ERROR("ReloadAll() failed when UpdateResConfig!");
    }
    return rState;
}


void HapManager::GetResConfig(ResConfig &resConfig)
{
    AutoMutex mutex(this->lock_);
    resConfig.Copy(*(this->resConfig_));
}

bool HapManager::AddResource(const char *path)
{
    AutoMutex mutex(this->lock_);
    return this->AddResourcePath(path);
}

bool HapManager::AddResource(const std::string &path, const std::vector<std::string> &overlayPaths)
{
    loadedHapPaths_[path] = overlayPaths;
    std::unordered_map<std::string, HapResource *> result = HapResource::LoadOverlays(path, overlayPaths, resConfig_);
    if (result.size() > 0) {
        std::vector<std::string> &validOverlayPaths = loadedHapPaths_[path];
        int i = 0;
        for (auto iter = result.begin(); iter != result.end(); iter++) {
            this->hapResources_.push_back(iter->second);
            if (i > 0) {
                // the first is the target, not the overlay
                validOverlayPaths.push_back(iter->first);
                i++;
            }
        }
        return true;
    }
    return false;
}

HapManager::~HapManager()
{
    for (size_t i = 0; i < hapResources_.size(); ++i) {
        if (hapResources_[i] != nullptr) {
            delete hapResources_[i];
            hapResources_[i] = nullptr;
        }
    }
    if (resConfig_ != nullptr) {
        delete resConfig_;
        resConfig_ = nullptr;
    }

#ifdef SUPPORT_GRAPHICS
    auto iter = plurRulesCache_.begin();
    for (; iter != plurRulesCache_.end(); iter++) {
        HILOG_DEBUG("delete plurRulesMap_ %s", iter->first.c_str());
        if (iter->second != nullptr) {
            auto ptr = iter->second;
            delete (ptr);
            iter->second = nullptr;
        }
    }
#endif
}

std::vector<const HapResource::IdValues *> HapManager::GetResourceList(uint32_t ident) const
{
    std::vector<const HapResource::IdValues *> result;
    // one id only exit in one hap
    for (size_t i = 0; i < hapResources_.size(); ++i) {
        HapResource *pResource = hapResources_[i];
        const HapResource::IdValues *out = pResource->GetIdValues(ident);
        if (out != nullptr) {
            result.emplace_back(out);
        }
    }
    return result;
}

std::vector<const HapResource::IdValues *> HapManager::GetResourceListByName(const char *name,
    const ResType resType) const
{
    std::vector<const HapResource::IdValues *> result;
    // all match will return
    for (size_t i = 0; i < hapResources_.size(); ++i) {
        HapResource *pResource = hapResources_[i];
        const HapResource::IdValues *out = pResource->GetIdValuesByName(std::string(name), resType);
        if (out != nullptr) {
            result.emplace_back(out);
        }
    }
    return result;
}

bool HapManager::AddResourcePath(const char *path)
{
    std::string sPath(path);
    auto it = loadedHapPaths_.find(sPath);
    if (it != loadedHapPaths_.end()) {
        HILOG_ERROR(" %s has already been loaded!", path);
        return false;
    }
    const HapResource *pResource = HapResource::Load(path, resConfig_);
    if (pResource == nullptr) {
#if !defined(__WINNT__) && !defined(__IDE_PREVIEW__) && !defined(__ARKUI_CROSS__)
        ReportAddResourcePathFail(path, "AddResourcePath failed");
#endif
        return false;
    }
    this->hapResources_.push_back(const_cast<HapResource *>(pResource));
    this->loadedHapPaths_[sPath] = std::vector<std::string>();
    return true;
}

void DeleteNewResource(std::vector<HapResource *> &newResources)
{
    for (size_t i = 0; i < newResources.size(); ++i) {
        if (newResources[i] != nullptr) {
            delete (newResources[i]);
            newResources[i] = nullptr;
        }
    }
}

RState HapManager::ReloadAll()
{
    if (hapResources_.size() == 0) {
        return SUCCESS;
    }
    std::vector<HapResource *> newResources;
    for (auto iter = loadedHapPaths_.begin(); iter != loadedHapPaths_.end(); iter++) {
        std::vector<std::string> &overlayPaths = iter->second;
        if (overlayPaths.size() == 0) {
            const HapResource *pResource = HapResource::Load(iter->first.c_str(), resConfig_);
            if (pResource == nullptr) {
                DeleteNewResource(newResources);
                return HAP_INIT_FAILED;
            }
            newResources.push_back(const_cast<HapResource *>(pResource));
            continue;
        }
        std::unordered_map<std::string, HapResource *> result = HapResource::LoadOverlays(iter->first.c_str(),
            overlayPaths, resConfig_);
        if (result.size() == 0) {
            continue;
        }
        for (auto iter = result.begin(); iter != result.end(); iter++) {
            newResources.push_back(iter->second);
        }
    }
    for (size_t i = 0; i < hapResources_.size(); ++i) {
        delete (hapResources_[i]);
    }
    hapResources_ = newResources;
    return SUCCESS;
}

std::vector<std::string> HapManager::GetResourcePaths()
{
    std::vector<std::string> result;
    for (auto iter = hapResources_.rbegin(); iter != hapResources_.rend(); iter++) {
        std::string indexPath = (*iter)->GetIndexPath();
        auto index = indexPath.rfind('/');
        if (index == std::string::npos) {
            HILOG_ERROR("index path format error, %s", indexPath.c_str());
            continue;
        }

        result.emplace_back(indexPath.substr(0, index) + "/resources/");
    }

    return result;
}

bool HapManager::IsLoadHap()
{
    for (auto iter = hapResources_.rbegin(); iter != hapResources_.rend(); iter++) {
        if ((*iter) == nullptr) {
            HILOG_ERROR("the hapResource_ is nullptr");
            return false;
        }
        const std::string hapPath = (*iter)->GetIndexPath();
        if (Utils::ContainsTail(hapPath, Utils::tailSet)) {
            return true;
        }
    }
    return false;
}

std::string GetFilePath(const HapResource::ValueUnderQualifierDir *qd, unzFile &uf, const ResType resType)
{
    std::string filePath;
    if (qd == nullptr) {
        return filePath;
    }
    const IdItem *idItem = qd->GetIdItem();
    if (idItem == nullptr || idItem->resType_ != resType) {
        return filePath;
    }
    if (HapParser::IsStageMode(uf)) {
        std::string tempFilePath(idItem->value_);
        auto index = tempFilePath.find('/');
        if (index == std::string::npos) {
            HILOG_ERROR("resource path format error, %s", tempFilePath.c_str());
            return filePath;
        }
        filePath = idItem->value_.substr(index + 1);
    } else {
        // FA mode
        std::string tempFilePath("assets/");
        tempFilePath.append(idItem->value_);
        filePath = tempFilePath;
    }
    return filePath;
}

std::string GetImageType(const std::string fileName)
{
    auto pos = fileName.find_last_of('.');
    std::string imgType;
    if (pos != std::string::npos) {
        imgType = fileName.substr(pos + 1);
    }
    return imgType;
}

unzFile GetHapUf(const HapResource::ValueUnderQualifierDir *qd)
{
    std::string hapPath = qd->GetHapResource()->GetIndexPath();
    unzFile uf = unzOpen64(hapPath.c_str()); // open zipfile stream
    if (uf == nullptr) {
        HILOG_ERROR("Open the %{public}s failed in GetHapUf", hapPath.c_str());
        return nullptr;
    } // file is open
    return uf;
}

RState HapManager::GetProfileData(const HapResource::ValueUnderQualifierDir *qd, size_t &len,
    std::unique_ptr<uint8_t[]> &outValue)
{
    unzFile uf = GetHapUf(qd);
    if (uf == nullptr) {
        return NOT_FOUND;
    }
    std::string filePath = GetFilePath(qd, uf, ResType::PROF);
    int err = HapParser::ReadFileFromZip(uf, filePath.c_str(), outValue, len);
    if (err < 0) {
        unzClose(uf);
        return NOT_FOUND;
    }
    unzClose(uf);
    return SUCCESS;
}

RState HapManager::GetMediaData(const HapResource::ValueUnderQualifierDir *qd, size_t &len,
    std::unique_ptr<uint8_t[]> &outValue)
{
    unzFile uf = GetHapUf(qd);
    if (uf == nullptr) {
        return NOT_FOUND;
    }
    std::string filePath = GetFilePath(qd, uf, ResType::MEDIA);
    int err = HapParser::ReadFileFromZip(uf, filePath.c_str(), outValue, len);
    if (err < 0) {
        unzClose(uf);
        return NOT_FOUND;
    }
    unzClose(uf);
    return SUCCESS;
}

RState HapManager::GetMediaBase64Data(const HapResource::ValueUnderQualifierDir *qd, std::string &outValue)
{
    unzFile uf = GetHapUf(qd);
    if (uf == nullptr) {
        return NOT_FOUND;
    }
    std::string filePath = GetFilePath(qd, uf, ResType::MEDIA);
    std::unique_ptr<uint8_t[]> buffer;
    size_t tmpLen;
    int err = HapParser::ReadFileFromZip(uf, filePath.c_str(), buffer, tmpLen);
    if (err < 0) {
        unzClose(uf);
        return NOT_FOUND;
    }
    std::string imgType = GetImageType(filePath);
    Utils::EncodeBase64(buffer, tmpLen, imgType, outValue);
    unzClose(uf);
    return SUCCESS;
}

int32_t GetFileFd(const char *zipFile, std::unique_ptr<ResourceManager::RawFile> &rawFile)
{
    int zipFd = open(zipFile, O_RDONLY);
    if (zipFd < 0) {
        HILOG_ERROR("open file failed in GetFileFd");
        return UNKNOWN_ERROR;
    }
    FILE *file = fdopen(zipFd, "r");
    if (file == nullptr) {
        HILOG_ERROR("fdopen the fd failed in GetFileFd");
        close(zipFd);
        return UNKNOWN_ERROR;
    }
    rawFile->pf = file;
    return OK;
}

RState HapManager::FindRawFileFromHap(const std::string &rawFileName,
    std::unique_ptr<ResourceManager::RawFile> &rawFile)
{
    if (rawFile == nullptr) {
        rawFile = std::make_unique<ResourceManager::RawFile>();
    }
    const std::string sysResHap = "SystemResources.hap";
    for (auto iter = hapResources_.rbegin(); iter != hapResources_.rend(); iter++) {
        const std::string hapPath = (*iter)->GetIndexPath();
        if (hapPath.find(sysResHap) != std::string::npos) {
            continue;
        }
        if (Utils::ContainsTail(hapPath, Utils::tailSet)) {
            size_t tmpLen;
            int32_t ret = HapParser::ReadRawFileFromHap(hapPath.c_str(), rawFile->buffer, tmpLen, rawFileName, rawFile);
            if (ret != OK) {
                continue;
            }
            ret = GetFileFd(hapPath.c_str(), rawFile);
            if (ret != OK) {
                return ERROR_CODE_RES_PATH_INVALID;
            }
            rawFile->length = static_cast<long>(tmpLen);
            return SUCCESS;
        }
    }
    return ERROR_CODE_RES_PATH_INVALID;
}
} // namespace Resource
} // namespace Global
} // namespace OHOS
