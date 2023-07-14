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

#include "hap_parser.h"

#include <cstdlib>
#include <string>
#include <fcntl.h>
#include <unzip.h>
#include <unistd.h>

#include "hilog_wrapper.h"
#include "locale_matcher.h"
#if defined(__WINNT__)
#include <cstring>
#else
#include "securec.h"
#endif
#include "utils/errors.h"
#include "utils/string_utils.h"
#include "utils/utils.h"

namespace OHOS {
namespace Global {
namespace Resource {
const char *HapParser::RES_FILE_NAME = "/resources.index";

int32_t LocateFile(unzFile &uf, const char *fileName)
{
    if (unzLocateFile2(uf, fileName, 1)) { // try to locate file inside zip, 1 = case sensitive
        return UNKNOWN_ERROR;
    }
    return OK;
}

int32_t GetCurrentFileInfo(unzFile &uf, unz_file_info &fileInfo)
{
    // obtained the necessary details about file inside zip
    char filenameInzip[256];  // for unzGetCurrentFileInfo
    int err = unzGetCurrentFileInfo(uf, &fileInfo, filenameInzip, sizeof(filenameInzip), nullptr, 0, nullptr, 0);
    if (err != UNZ_OK) {
        HILOG_ERROR("GetCurrentFileInfo failed");
        return UNKNOWN_ERROR;
    }
    return OK;
}

int32_t ReadCurrentFile(unzFile &uf, unz_file_info &fileInfo, std::unique_ptr<uint8_t[]> &buffer,
    size_t &bufLen)
{
    buffer = std::make_unique<uint8_t[]>(fileInfo.uncompressed_size);
    bufLen = fileInfo.uncompressed_size;
    if (buffer == nullptr) {
        HILOG_ERROR("Error allocating memory for read buffer");
        return UNKNOWN_ERROR;
    }

    int err = unzOpenCurrentFilePassword(uf, nullptr);
    if (err != UNZ_OK) {
        HILOG_ERROR("Error %d in unzOpenCurrentFilePassword.", err);
        return UNKNOWN_ERROR;
    } // file inside the zip is open

    err = unzReadCurrentFile(uf, buffer.get(), bufLen);
    if (err < 0) {
        HILOG_ERROR("Error %d in unzReadCurrentFile", err);
        return UNKNOWN_ERROR;
    }

    return OK;
}

int32_t HapParser::ReadFileFromZip(unzFile &uf, const char *fileName, std::unique_ptr<uint8_t[]> &buffer,
    size_t &bufLen)
{
    unz_file_info fileInfo;
    if (LocateFile(uf, fileName) != OK) {
        return UNKNOWN_ERROR;
    }
    if (GetCurrentFileInfo(uf, fileInfo) != OK) {
        return UNKNOWN_ERROR;
    }
    if (ReadCurrentFile(uf, fileInfo, buffer, bufLen) != OK) {
        return UNKNOWN_ERROR;
    }
    return OK;
}

std::string GetModuleName(const char *configStr, size_t len)
{
    if (configStr == nullptr) {
        return std::string();
    }
    std::string config(configStr, len);
    static const char *key = "\"moduleName\"";
    auto idx = config.find(key);
    if (idx == std::string::npos) {
        return std::string();
    }
    auto start = config.find("\"", idx + strlen(key));
    if (start == std::string::npos) {
        return std::string();
    }
    auto end = config.find("\"", start + 1);
    if (end == std::string::npos) {
        return std::string();
    }

    std::string retStr = std::string(configStr + start + 1, end - start - 1);
    return retStr;
}

bool HapParser::IsStageMode(unzFile &uf)
{
    // stage mode contains "module.json", The 1 means the case sensitive
    if (unzLocateFile2(uf, "module.json", 1) != UNZ_OK) {
        return false;
    }
    return true;
}

std::string ParseModuleName(unzFile &uf)
{
    std::unique_ptr<uint8_t[]> tmpBuf;
    int32_t ret = UNZ_OK;
    size_t tmpLen;
    ret = HapParser::ReadFileFromZip(uf, "config.json", tmpBuf, tmpLen);
    if (ret != OK) {
        HILOG_ERROR("read config.json error");
        return std::string();
    }
    // parse config.json
    std::string mName = GetModuleName(reinterpret_cast<char *>(tmpBuf.get()), tmpLen);
    if (mName.size() == 0) {
        HILOG_ERROR("parse moduleName from config.json error");
        return std::string();
    }
    return mName;
}

std::string GetIndexFilePath(unzFile uf)
{
    std::string mName = ParseModuleName(uf);
    std::string indexFilePath = std::string("assets/");
    indexFilePath.append(mName);
    indexFilePath.append("/resources.index");
    return indexFilePath;
}

int32_t ReadFileInfoFromZip(unzFile &uf, const char *fileName, std::unique_ptr<uint8_t[]> &buffer, size_t &bufLen)
{
    int err = HapParser::ReadFileFromZip(uf, fileName, buffer, bufLen);
    if (err < 0) {
        unzClose(uf);
        return UNKNOWN_ERROR;
    }
    unzClose(uf);
    return OK;
}

int32_t HapParser::ReadIndexFromFile(const char *zipFile, std::unique_ptr<uint8_t[]> &buffer,
    size_t &bufLen)
{
    unzFile uf = unzOpen64(zipFile);
    if (uf == nullptr) {
        HILOG_ERROR("Error open %{public}s in ReadIndexFromFile %{public}d", zipFile, errno);
        return UNKNOWN_ERROR;
    } // file is open
    if (IsStageMode(uf)) {
        return ReadFileInfoFromZip(uf, "resources.index", buffer, bufLen);
    }
    std::string indexFilePath = GetIndexFilePath(uf);
    return ReadFileInfoFromZip(uf, indexFilePath.c_str(), buffer, bufLen);
}

int32_t ReadRawFileInfoFromHap(const char *zipFile, unzFile &uf, const char *fileName,
    std::unique_ptr<uint8_t[]> &buffer, size_t &bufLen, std::unique_ptr<ResourceManager::RawFile> &rawFile)
{
    int err = HapParser::ReadFileFromZip(uf, fileName, buffer, bufLen);
    if (err < 0) {
        HILOG_ERROR("Error read %{public}s from %{public}s", fileName, zipFile);
        unzClose(uf);
        return UNKNOWN_ERROR;
    }
    uLong offset = unzGetOffset(uf);
    rawFile->offset = (long)offset;
    unzClose(uf);
    return OK;
}

void GetRawFilePath(const std::string &rawFilePath, std::string &tempRawFilePath)
{
    std::string tempName = rawFilePath;
    const std::string rawFileDirName = "rawfile/";
    if (tempName.length() <= rawFileDirName.length()
    || (tempName.compare(0, rawFileDirName.length(), rawFileDirName) != 0)) {
        tempName = rawFileDirName + tempName;
    }
    tempRawFilePath.append(tempName);
}

std::string GetTempRawFilePath(unzFile uf)
{
    std::string mName = ParseModuleName(uf);
    std::string tempRawFilePath("assets/");
    tempRawFilePath.append(mName);
    tempRawFilePath.append("/resources/");
    return tempRawFilePath;
}

int32_t HapParser::ReadRawFileFromHap(const char *zipFile, std::unique_ptr<uint8_t[]> &buffer, size_t &bufLen,
    const std::string &rawFilePath, std::unique_ptr<ResourceManager::RawFile> &rawFile)
{
    unzFile uf = unzOpen64(zipFile);
    if (uf == nullptr) {
        return UNKNOWN_ERROR;
    }
    if (IsStageMode(uf)) {
        std::string tempRawFilePath("resources/");
        GetRawFilePath(rawFilePath, tempRawFilePath);
        return ReadRawFileInfoFromHap(zipFile, uf, tempRawFilePath.c_str(), buffer, bufLen, rawFile);
    }
    std::string tempRawFilePath = GetTempRawFilePath(uf);
    GetRawFilePath(rawFilePath, tempRawFilePath);
    return ReadRawFileInfoFromHap(zipFile, uf, tempRawFilePath.c_str(), buffer, bufLen, rawFile);
}

/**
 *
 * @param buffer
 * @param offset
 * @param id
 * @param includeTemi dose length include '\0'
 * @return OK or ERROR
 */
int32_t ParseString(const char *buffer, uint32_t &offset, std::string &id, bool includeTemi = true)
{
    uint16_t strLen;
    errno_t eret = memcpy_s(&strLen, sizeof(strLen), buffer + offset, 2);
    if (eret != OK) {
        return SYS_ERROR;
    }
    offset += 2;
    std::string tmp = std::string(const_cast<char *>(buffer) + offset, includeTemi ? (strLen - 1) : strLen);
    offset += includeTemi ? strLen : (strLen + 1);
    id = tmp;
    return OK;
}

/**
 *
 * @param buffer
 * @param offset
 * @param values
 * @return
 */
int32_t ParseStringArray(const char *buffer, uint32_t &offset, std::vector<std::string> &values)
{
    uint16_t arrLen;
    errno_t eret = memcpy_s(&arrLen, sizeof(arrLen), buffer + offset, 2);
    if (eret != OK) {
        return SYS_ERROR;
    }
    offset += 2;
    // next arrLen bytes are several strings. then after, is one '\0'
    uint32_t startOffset = offset;
    while (true) {
        std::string value;
        int32_t ret = ParseString(buffer, offset, value, false);
        if (ret != OK) {
            return ret;
        }
        values.push_back(value);

        uint32_t readSize = offset - startOffset;
        if (readSize + 1 == arrLen) {
            offset += 1; // after arrLen, got '\0'
            break;
        }
        if (readSize + 1 > arrLen) {
            // size not match, cannot > arrLen
            return SYS_ERROR;
        }
    }

    return OK;
}

int32_t ParseIdItem(const char *buffer, uint32_t &offset, IdItem *idItem)
{
    errno_t eret = memcpy_s(idItem, sizeof(IdItem), buffer + offset, IdItem::HEADER_LEN);
    if (eret != OK) {
        return SYS_ERROR;
    }
    offset += IdItem::HEADER_LEN;

    idItem->JudgeArray();
    if (idItem->isArray_) {
        int32_t ret = ParseStringArray(buffer, offset, idItem->values_);
        if (ret != OK) {
            return ret;
        }
    } else {
        std::string value;
        int32_t ret = ParseString(buffer, offset, value);
        if (ret != OK) {
            return ret;
        }
        idItem->value_ = std::string(value);
        idItem->valueLen_ = value.size();
    }
    std::string name;
    int32_t ret = ParseString(buffer, offset, name);
    if (ret != OK) {
        return ret;
    }
    idItem->name_ = std::string(name);
    return OK;
}

int32_t ParseId(const char *buffer, uint32_t &offset, ResId *id)
{
    errno_t eret = memcpy_s(id, sizeof(ResId), buffer + offset, ResId::RESID_HEADER_LEN);
    if (eret != OK) {
        return SYS_ERROR;
    }
    offset += ResId::RESID_HEADER_LEN;
    if (id->tag_[0] != 'I' || id->tag_[1] != 'D'
        || id->tag_[2] != 'S' || id->tag_[3] != 'S') {
        return -1;
    }
    for (uint32_t i = 0; i < id->count_; ++i) {
        IdParam *ip = new (std::nothrow) IdParam();
        if (ip == nullptr) {
            HILOG_ERROR("new IdParam failed when ParseId");
            return SYS_ERROR;
        }
        errno_t eret = memcpy_s(ip, sizeof(IdParam), buffer + offset, ResId::IDPARAM_HEADER_LEN);
        if (eret != OK) {
            delete (ip);
            return SYS_ERROR;
        }
        offset += ResId::IDPARAM_HEADER_LEN;
        IdItem *idItem = new (std::nothrow) IdItem();
        if (idItem == nullptr) {
            HILOG_ERROR("new IdItem failed when ParseId");
            delete (ip);
            return SYS_ERROR;
        }
        uint32_t ipOffset = ip->offset_;
        int32_t ret = ParseIdItem(buffer, ipOffset, idItem);
        if (ret != OK) {
            delete (ip);
            delete (idItem);
            return ret;
        }
        ip->idItem_ = idItem;
        id->idParams_.push_back(ip);
    }

    return OK;
}

bool IsLocaleMatch(const ResConfigImpl *defaultConfig, const std::vector<KeyParam *> &keyParams)
{
    if (defaultConfig == nullptr) {
        return true;
    }
    ResConfigImpl *config = HapParser::CreateResConfigFromKeyParams(keyParams);
    if (config == nullptr) {
        return false;
    }
    if (LocaleMatcher::Match(defaultConfig->GetResLocale(), config->GetResLocale())) {
        delete (config);
        return true;
    }
    HILOG_DEBUG("mismatch, do not parse %s", HapParser::ToFolderPath(keyParams).c_str());
    delete (config);
    return false;
}

int32_t ParseKey(const char *buffer, uint32_t &offset,  ResKey *key,
                 bool &match, const ResConfigImpl *defaultConfig)
{
    errno_t eret = memcpy_s(key, sizeof(ResKey), buffer + offset, ResKey::RESKEY_HEADER_LEN);
    if (eret != OK) {
        return SYS_ERROR;
    }
    offset += ResKey::RESKEY_HEADER_LEN;
    if (key->tag_[0] != 'K' || key->tag_[1] != 'E'
        || key->tag_[2] != 'Y' || key->tag_[3] != 'S') {
        return -1;
    }
    for (uint32_t i = 0; i < key->keyParamsCount_; ++i) {
        KeyParam *kp = new (std::nothrow) KeyParam();
        if (kp == nullptr) {
            HILOG_ERROR("new KeyParam failed when ParseKey");
            return SYS_ERROR;
        }
        errno_t eret = memcpy_s(kp, sizeof(KeyParam), buffer + offset, ResKey::KEYPARAM_HEADER_LEN);
        if (eret != OK) {
            delete (kp);
            return SYS_ERROR;
        }
        offset += ResKey::KEYPARAM_HEADER_LEN;
        kp->InitStr();
        key->keyParams_.push_back(kp);
    }
    match = IsLocaleMatch(defaultConfig, key->keyParams_);
    if (!match) {
        return OK;
    }
    uint32_t idOffset = key->offset_;
    ResId *id = new (std::nothrow) ResId();
    if (id == nullptr) {
        HILOG_ERROR("new ResId failed when ParseKey");
        return SYS_ERROR;
    }
    int32_t ret = ParseId(buffer, idOffset, id);
    if (ret != OK) {
        delete (id);
        return ret;
    }
    key->resId_ = id;
    return OK;
}


int32_t HapParser::ParseResHex(const char *buffer, const size_t bufLen, ResDesc &resDesc,
                               const ResConfigImpl *defaultConfig)
{
    ResHeader *resHeader = new (std::nothrow) ResHeader();
    if (resHeader == nullptr) {
        HILOG_ERROR("new ResHeader failed when ParseResHex");
        return SYS_ERROR;
    }
    uint32_t offset = 0;
    errno_t eret = memcpy_s(resHeader, sizeof(ResHeader), buffer + offset, RES_HEADER_LEN);
    if (eret != OK) {
        delete (resHeader);
        return SYS_ERROR;
    }
    offset += RES_HEADER_LEN;
    if (resHeader->keyCount_ == 0 || resHeader->length_ == 0) {
        delete (resHeader);
        return UNKNOWN_ERROR;
    }

    resDesc.resHeader_ = resHeader;
    for (uint32_t i = 0; i < resHeader->keyCount_; i++) {
        ResKey *key = new (std::nothrow) ResKey();
        if (key == nullptr) {
            HILOG_ERROR("new ResKey failed when ParseResHex");
            return SYS_ERROR;
        }
        bool match = true;
        int32_t ret = ParseKey(buffer, offset, key, match, defaultConfig);
        if (ret != OK) {
            delete (key);
            return ret;
        }
        if (match) {
            resDesc.keys_.push_back(key);
        } else {
            delete (key);
        }
    }
    return OK;
}

ResConfigImpl *HapParser::CreateResConfigFromKeyParams(const std::vector<KeyParam *> &keyParams)
{
    ResConfigImpl *resConfig = new (std::nothrow) ResConfigImpl;
    if (resConfig == nullptr) {
        HILOG_ERROR("new ResConfigImpl failed when CreateResConfigFromKeyParams");
        return nullptr;
    }
    size_t len = keyParams.size();
    // default path
    if (len == 0) {
        resConfig->SetColorMode(COLOR_MODE_NOT_SET);
        return resConfig;
    }
    delete resConfig;
    size_t i = 0;
    ResConfigKey configKey;
    for (i = 0; i < len; ++i) {
        const KeyParam *kp = keyParams.at(i);
        if (kp->type_ == LANGUAGES) {
            configKey.language = kp->GetStr().c_str();
        } else if (kp->type_ == REGION) {
            configKey.region = kp->GetStr().c_str();
        } else if (kp->type_ == SCRIPT) {
            configKey.script = kp->GetStr().c_str();
        } else if (kp->type_ == SCREEN_DENSITY) {
            configKey.screenDensity = GetScreenDensity(kp->value_);
        } else if (kp->type_ == DEVICETYPE) {
            configKey.deviceType = GetDeviceType(kp->value_);
        } else if (kp->type_ == DIRECTION) {
            if (kp->value_ == 0) {
                configKey.direction = DIRECTION_VERTICAL;
            } else {
                configKey.direction = DIRECTION_HORIZONTAL;
            }
        } else if (kp->type_ == INPUTDEVICE) {
            configKey.inputDevice = GetInputDevice(kp->value_);
        } else if (kp->type_ == COLORMODE) {
            configKey.colorMode = GetColorMode(kp->value_);
        } else if (kp->type_ == MCC) {
            configKey.mcc = GetMcc(kp->value_);
        } else if (kp->type_ == MNC) {
            configKey.mnc = GetMnc(kp->value_);
        }
    }

    return BuildResConfig(&configKey);
}

ResConfigImpl *HapParser::BuildResConfig(ResConfigKey *configKey)
{
    if (configKey == nullptr) {
        HILOG_ERROR("configKey is null");
        return nullptr;
    }
    ResConfigImpl *resConfig = new (std::nothrow) ResConfigImpl;
    if (resConfig == nullptr) {
        HILOG_ERROR("new ResConfigImpl failed when BuildResConfig");
        return nullptr;
    }
    resConfig->SetDeviceType(configKey->deviceType);
    resConfig->SetDirection(configKey->direction);
    resConfig->SetColorMode(configKey->colorMode);
    resConfig->SetMcc(configKey->mcc);
    resConfig->SetMnc(configKey->mnc);
    resConfig->SetInputDevice(configKey->inputDevice);
    resConfig->SetScreenDensity((configKey->screenDensity) / Utils::DPI_BASE);
    RState r = resConfig->SetLocaleInfo(configKey->language, configKey->script, configKey->region);
    if (r != SUCCESS) {
        HILOG_ERROR("error set locale,lang %s,script %s,region %s", configKey->language, configKey->script,
            configKey->region);
    }

    return resConfig;
}

DeviceType HapParser::GetDeviceType(uint32_t value)
{
    DeviceType deviceType = DEVICE_NOT_SET;
    if (value == DEVICE_CAR) {
        deviceType = DEVICE_CAR;
    } else if (value == DEVICE_PAD) {
        deviceType = DEVICE_PAD;
    } else if (value == DEVICE_PHONE) {
        deviceType = DEVICE_PHONE;
    } else if (value == DEVICE_TABLET) {
        deviceType = DEVICE_TABLET;
    } else if (value == DEVICE_TV) {
        deviceType = DEVICE_TV;
    } else if (value == DEVICE_WEARABLE) {
        deviceType = DEVICE_WEARABLE;
    }
    return deviceType;
}

uint32_t HapParser::GetMcc(uint32_t value)
{
    return value;
}

uint32_t HapParser::GetMnc(uint32_t value)
{
    return value;
}

ColorMode HapParser::GetColorMode(uint32_t value)
{
    ColorMode colorMode = COLOR_MODE_NOT_SET;
    if (value == DARK) {
        colorMode = DARK;
    } else {
        colorMode = LIGHT;
    }
    return colorMode;
}

InputDevice HapParser::GetInputDevice(uint32_t value)
{
    InputDevice inputDevice = INPUTDEVICE_NOT_SET;
    if (value == INPUTDEVICE_POINTINGDEVICE) {
        inputDevice = INPUTDEVICE_POINTINGDEVICE;
    }
    return inputDevice;
}

ScreenDensity HapParser::GetScreenDensity(uint32_t value)
{
    ScreenDensity screenDensity = SCREEN_DENSITY_NOT_SET;
    if (value == SCREEN_DENSITY_SDPI) {
        screenDensity = SCREEN_DENSITY_SDPI;
    } else if (value == SCREEN_DENSITY_MDPI) {
        screenDensity = SCREEN_DENSITY_MDPI;
    } else if (value == SCREEN_DENSITY_LDPI) {
        screenDensity = SCREEN_DENSITY_LDPI;
    } else if (value == SCREEN_DENSITY_XLDPI) {
        screenDensity = SCREEN_DENSITY_XLDPI;
    } else if (value == SCREEN_DENSITY_XXLDPI) {
        screenDensity = SCREEN_DENSITY_XXLDPI;
    } else if (value == SCREEN_DENSITY_XXXLDPI) {
        screenDensity = SCREEN_DENSITY_XXXLDPI;
    }
    return screenDensity;
}

void PathAppend(std::string &path, const std::string &append, const std::string &connector)
{
    if (append.size() > 0) {
        if (path.size() > 0) {
            path.append(connector);
        }
        path.append(append);
    }
}

std::string HapParser::ToFolderPath(const std::vector<KeyParam *> &keyParams)
{
    if (keyParams.size() == 0) {
        return std::string("default");
    }
    // mcc-mnc-language_script_region-direction-deviceType-colorMode-inputDevice-screenDensity
    Determiner determiner;
    for (size_t i = 0; i < keyParams.size(); ++i) {
        KeyParam *keyParam = keyParams[i];
        switch (keyParam->type_) {
            case KeyType::LANGUAGES:
                determiner.language = keyParam->GetStr();
                break;
            case KeyType::SCRIPT:
                determiner.script = keyParam->GetStr();
                break;
            case KeyType::REGION:
                determiner.region = keyParam->GetStr();
                break;
            case KeyType::DIRECTION:
                determiner.direction = keyParam->GetStr();
                break;
            case KeyType::DEVICETYPE:
                determiner.deviceType = keyParam->GetStr();
                break;
            case KeyType::COLORMODE:
                determiner.colorMode = keyParam->GetStr();
                break;
            case KeyType::INPUTDEVICE:
                determiner.inputDevice = keyParam->GetStr();
                break;
            case KeyType::MCC:
                determiner.mcc = keyParam->GetStr();
                break;
            case KeyType::MNC:
                determiner.mnc = keyParam->GetStr();
                break;
            case KeyType::SCREEN_DENSITY:
                determiner.screenDensity = keyParam->GetStr();
                break;
            default:
                break;
        }
    }

    return BuildFolderPath(&determiner);
}

std::string HapParser::BuildFolderPath(Determiner *determiner)
{
    std::string path;
    if (determiner == nullptr) {
        HILOG_ERROR("determiner is null");
        return path;
    }
    std::string connecter1("_");
    std::string connecter2("-");
    if (determiner->mcc.size() > 0) {
        path.append(determiner->mcc);
        if (determiner->mnc.size() > 0) {
            PathAppend(path, determiner->mnc, connecter1);
        }
        if (determiner->language.size() > 0) {
            PathAppend(path, determiner->language, connecter2);
        }
    } else {
        if (determiner->language.size() > 0) {
            path.append(determiner->language);
        }
    }
    PathAppend(path, determiner->script, connecter1);
    PathAppend(path, determiner->region, connecter1);
    PathAppend(path, determiner->direction, connecter2);
    PathAppend(path, determiner->deviceType, connecter2);
    PathAppend(path, determiner->colorMode, connecter2);
    PathAppend(path, determiner->inputDevice, connecter2);
    PathAppend(path, determiner->screenDensity, connecter2);

    return path;
}
} // namespace Resource
} // namespace Global
} // namespace OHOS