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

#include "native_module_manager.h"

#include <dirent.h>
#include <mutex>

#ifdef ENABLE_HITRACE
#include "hitrace_meter.h"
#endif
#include "native_engine/native_engine.h"
#include "securec.h"
#include "utils/log.h"

namespace {
constexpr static int32_t NATIVE_PATH_NUMBER = 2;
} // namespace

NativeModuleManager* NativeModuleManager::instance_ = NULL;
std::mutex g_instanceMutex;

NativeModuleManager::NativeModuleManager()
{
    pthread_mutex_init(&mutex_, nullptr);
    moduleLoadChecker_ = new ModuleLoadChecker();
}

NativeModuleManager::~NativeModuleManager()
{
    NativeModule* nativeModule = firstNativeModule_;
    while (nativeModule != nullptr) {
        nativeModule = nativeModule->next;
        if (firstNativeModule_->isAppModule) {
            delete[] firstNativeModule_->name;
        }
        delete firstNativeModule_;
        firstNativeModule_ = nativeModule;
    }
    firstNativeModule_ = nullptr;
    lastNativeModule_ = nullptr;
    if (appLibPath_) {
        delete[] appLibPath_;
    }

    for (const auto& item : appLibPathMap_) {
        delete[] item.second;
    }
    std::map<std::string, char*>().swap(appLibPathMap_);

    while (nativeEngineList_.size() > 0) {
        NativeEngine* wraper = nativeEngineList_.begin()->second;
        if (wraper != nullptr) {
            delete wraper;
            wraper = nullptr;
        }
        nativeEngineList_.erase(nativeEngineList_.begin());
    }
    if (moduleLoadChecker_) {
        delete moduleLoadChecker_;
    }
    pthread_mutex_destroy(&mutex_);
}

NativeModuleManager* NativeModuleManager::GetInstance()
{
    if (instance_ == NULL) {
        std::lock_guard<std::mutex> lock(g_instanceMutex);
        if (instance_ == NULL) {
            instance_ = new NativeModuleManager();
        }
    }
    return instance_;
}

void NativeModuleManager::SetNativeEngine(std::string moduleName, NativeEngine* nativeEngine)
{
    HILOG_DEBUG("%{public}s", __func__);
    std::lock_guard<std::mutex> lock(nativeEngineListMutex_);
    nativeEngineList_.emplace(moduleName, nativeEngine);
}

const char* NativeModuleManager::GetModuleFileName(const char* moduleName, bool isAppModule)
{
    HILOG_INFO("%{public}s, start. moduleName:%{public}s", __func__, moduleName);
    NativeModule* module = FindNativeModuleByCache(moduleName);
    if (module != nullptr) {
        char nativeModulePath[NATIVE_PATH_NUMBER][NAPI_PATH_MAX];
        if (!GetNativeModulePath(moduleName, "default", isAppModule, nativeModulePath, NAPI_PATH_MAX)) {
            HILOG_ERROR("%{public}s, get module filed", __func__);
            return nullptr;
        }
        const char* loadPath = nativeModulePath[0];
        return loadPath;
    }
    HILOG_ERROR("%{public}s, module is nullptr", __func__);
    return nullptr;
}

void NativeModuleManager::Register(NativeModule* nativeModule)
{
    if (nativeModule == nullptr) {
        HILOG_ERROR("nativeModule value is null");
        return;
    }

    if (firstNativeModule_ == lastNativeModule_ && lastNativeModule_ == nullptr) {
        firstNativeModule_ = new NativeModule();
        if (firstNativeModule_ == nullptr) {
            HILOG_ERROR("first NativeModule create failed");
            return;
        }
        lastNativeModule_ = firstNativeModule_;
    } else {
        auto next = new NativeModule();
        if (next == nullptr) {
            HILOG_ERROR("next NativeModule create failed");
            return;
        }
        if (lastNativeModule_) {
            lastNativeModule_->next = next;
            lastNativeModule_ = lastNativeModule_->next;
        }
    }

    char* moduleName;
    if (isAppModule_) {
        auto tmp = prefix_ + "/" + nativeModule->name;
        moduleName = new char[NAPI_PATH_MAX];
        errno_t err = EOK;
        err = memset_s(moduleName, NAPI_PATH_MAX, 0, NAPI_PATH_MAX);
        if (err != EOK) {
            delete[] moduleName;
            return;
        }
        err = strcpy_s(moduleName, NAPI_PATH_MAX, tmp.c_str());
        if (err != EOK) {
            delete[] moduleName;
            return;
        }
    }

    if (lastNativeModule_) {
        lastNativeModule_->version = nativeModule->version;
        lastNativeModule_->fileName = nativeModule->fileName;
        lastNativeModule_->isAppModule = isAppModule_;
        lastNativeModule_->name = isAppModule_ ? moduleName : nativeModule->name;
        lastNativeModule_->refCount = nativeModule->refCount;
        lastNativeModule_->registerCallback = nativeModule->registerCallback;
        lastNativeModule_->next = nullptr;
#ifdef IOS_PLATFORM
        // For iOS, force make module loaded, should support `GetJSCode` later
        lastNativeModule_->moduleLoaded = true;
#endif
    }
}

#if !defined(WINDOWS_PLATFORM) && !defined(MAC_PLATFORM) && !defined(__BIONIC__) && !defined(IOS_PLATFORM) && \
    !defined(LINUX_PLATFORM)
char* NativeModuleManager::FormatString()
{
    const char* allowList[] = {
        // bionic library
        "libc.so",
        "libdl.so",
        "libm.so",
        "libz.so",
	"libclang_rt.asan.so",
        // z library
        "libace_napi.z.so",
        "libace_ndk.z.so",
        "libbundle_ndk.z.so",
        "libdeviceinfo_ndk.z.so",
        "libEGL.so",
        "libGLESv3.so",
        "libhiappevent_ndk.z.so",
        "libhilog_ndk.z.so",
        "libhuks_ndk.z.so",
        "libhukssdk.z.so",
        "libnative_drawing.so",
        "libnative_window.so",
        "libnative_vsync.so",
        "libOpenSLES.so",
        "libpixelmap_ndk.z.so",
        "librawfile.z.so",
        "libuv.so",
        "libhilog.so",
        "libnative_image.so",
        "libnative_media_adec.so",
        "libnative_media_aenc.so",
        "libnative_media_codecbase.so",
        "libnative_media_core.so",
        "libnative_media_vdec.so",
        "libnative_media_venc.so",
        // adaptor library
        "libohosadaptor.so",
    };

    size_t allowListLength = sizeof(allowList) / sizeof(char*);
    int32_t sharedLibsSonamesLength = 1;
    for (int32_t i = 0; i < allowListLength; i++) {
        sharedLibsSonamesLength += strlen(allowList[i]) + 1;
    }
    char* sharedLibsSonames = new char[sharedLibsSonamesLength];
    int32_t cursor = 0;
    for (int32_t i = 0; i < allowListLength; i++) {
        if (sprintf_s(sharedLibsSonames + cursor, sharedLibsSonamesLength - cursor, "%s:", allowList[i]) == -1) {
            delete[] sharedLibsSonames;
            return nullptr;
        }
        cursor += strlen(allowList[i]) + 1;
    }
    sharedLibsSonames[cursor] = '\0';
    return sharedLibsSonames;
}
#endif

void NativeModuleManager::CreateLdNamespace(const std::string moduleName, const char* lib_ld_path)
{
#if !defined(WINDOWS_PLATFORM) && !defined(MAC_PLATFORM) && !defined(__BIONIC__) && !defined(IOS_PLATFORM) && \
    !defined(LINUX_PLATFORM)
    Dl_namespace current_ns;
    Dl_namespace ns;
    std::string nsName = "arkUI_" + moduleName;
    dlns_init(&ns, nsName.c_str());
    dlns_get(nullptr, &current_ns);
    dlns_create2(&ns, lib_ld_path, 0);
    dlns_inherit(&ns, &current_ns, FormatString());
    nsMap_[moduleName] = ns;
    HILOG_INFO("CreateLdNamespace success, path: %{private}s", lib_ld_path);
#endif
}

void NativeModuleManager::SetAppLibPath(const std::string& moduleName, const std::vector<std::string>& appLibPath)
{
    char* tmp = new char[NAPI_PATH_MAX];
    errno_t err = EOK;
    err = memset_s(tmp, NAPI_PATH_MAX, 0, NAPI_PATH_MAX);
    if (err != EOK) {
        delete[] tmp;
        return;
    }

    std::string tmpPath = "";
    for (int i = 0; i < appLibPath.size(); i++) {
        if (appLibPath[i].empty()) {
            continue;
        }
        tmpPath += appLibPath[i];
        tmpPath += ":";
    }
    if (tmpPath.back() == ':') {
        tmpPath.pop_back();
    }

    err = strcpy_s(tmp, NAPI_PATH_MAX, tmpPath.c_str());
    if (err != EOK) {
        delete[] tmp;
        return;
    }

    if (appLibPathMap_[moduleName] != nullptr) {
        delete[] appLibPathMap_[moduleName];
    }

    appLibPathMap_[moduleName] = tmp;
    CreateLdNamespace(moduleName, tmp);
    HILOG_INFO("create ld namespace, path: %{private}s", appLibPathMap_[moduleName]);
}

NativeModule* NativeModuleManager::LoadNativeModule(
    const char* moduleName, const char* path, bool isAppModule, bool internal, bool isArk)
{
    if (moduleName == nullptr) {
        HILOG_ERROR("moduleName value is null");
        return nullptr;
    }

#ifdef ANDROID_PLATFORM
    std::string strModule(moduleName);
    std::string strCutName =
        strModule.find(".") == std::string::npos ?
            strModule :
            strModule.substr(0, strModule.find(".")) + "_" + strModule.substr(strModule.find(".") + 1);
    HILOG_INFO("strCutName value is %{public}s", strCutName.c_str());
#endif

    if (pthread_mutex_lock(&mutex_) != 0) {
        HILOG_ERROR("pthread_mutex_lock is failed");
        return nullptr;
    }

#ifdef ANDROID_PLATFORM
    NativeModule* nativeModule = FindNativeModuleByCache(strCutName.c_str());
#else
    std::string key(moduleName);
    isAppModule_ = isAppModule;
    if (isAppModule) {
        prefix_ = "default";
        if (path && IsExistedPath(path)) {
            prefix_ = path;
        }
        key = prefix_ + '/' + moduleName;
    }
    NativeModule* nativeModule = FindNativeModuleByCache(key.c_str());
#endif

#ifndef IOS_PLATFORM
    if (nativeModule == nullptr) {
#ifdef ANDROID_PLATFORM
        HILOG_INFO("not in cache: moduleName: %{public}s", strCutName.c_str());
        nativeModule = FindNativeModuleByDisk(strCutName.c_str(), "default", internal, isAppModule, isArk);
#else
        HILOG_INFO("not in cache: moduleName: %{public}s", moduleName);
        nativeModule = FindNativeModuleByDisk(moduleName, prefix_.c_str(), internal, isAppModule, isArk);
#endif
    }
#endif

    if (pthread_mutex_unlock(&mutex_) != 0) {
        HILOG_ERROR("pthread_mutex_unlock is failed");
        return nullptr;
    }

    return nativeModule;
}

bool NativeModuleManager::GetNativeModulePath(const char* moduleName, const char* path, bool isAppModule,
    char nativeModulePath[][NAPI_PATH_MAX], int32_t pathLength)
{
#ifdef WINDOWS_PLATFORM
    const char* soPostfix = ".dll";
    const char* sysPrefix = "./module";
    const char* zfix = "";
#elif defined(MAC_PLATFORM)
    const char* soPostfix = ".dylib";
    const char* sysPrefix = "./module";
    const char* zfix = "";
#elif defined(_ARM64_) || defined(SIMULATOR)
    const char* soPostfix = ".so";
    const char* sysPrefix = "/system/lib64/module";
    const char* zfix = ".z";
#elif defined(LINUX_PLATFORM)
    const char* soPostfix = ".so";
    const char* sysPrefix = "./module";
    const char* zfix = "";
#else
    const char* soPostfix = ".so";
    const char* sysPrefix = "/system/lib/module";
    const char* zfix = ".z";
#endif

#ifdef ANDROID_PLATFORM
    isAppModule = true;
#endif
    int32_t lengthOfModuleName = strlen(moduleName);
    char dupModuleName[NAPI_PATH_MAX] = { 0 };
    if (strcpy_s(dupModuleName, NAPI_PATH_MAX, moduleName) != 0) {
        HILOG_ERROR("strcpy moduleName failed");
        return false;
    }

    const char* prefix = nullptr;
    if (isAppModule && IsExistedPath(path)) {
        prefix = appLibPathMap_[path];
#ifdef ANDROID_PLATFORM
        for (int32_t i = 0; i < lengthOfModuleName; i++) {
            dupModuleName[i] = tolower(dupModuleName[i]);
        }
#endif
    } else {
        prefix = sysPrefix;
        for (int32_t i = 0; i < lengthOfModuleName; i++) {
            dupModuleName[i] = tolower(dupModuleName[i]);
        }
    }

    int32_t lengthOfPostfix = strlen(soPostfix);
    if ((lengthOfModuleName > lengthOfPostfix) &&
        (strcmp(dupModuleName + lengthOfModuleName - lengthOfPostfix, soPostfix) == 0)) {
        if (sprintf_s(nativeModulePath[0], pathLength, "%s/%s", prefix, dupModuleName) == -1) {
            return false;
        }
        return true;
    }

    char* lastDot = strrchr(dupModuleName, '.');
    if (lastDot == nullptr) {
        if (!isAppModule || !IsExistedPath(path)) {
            if (sprintf_s(nativeModulePath[0], pathLength, "%s/lib%s%s%s",
                prefix, dupModuleName, zfix, soPostfix) == -1) {
                return false;
            }
            if (sprintf_s(nativeModulePath[1], pathLength, "%s/lib%s_napi%s%s",
                prefix, dupModuleName, zfix, soPostfix) == -1) {
                return false;
            }
        } else {
#if !defined(WINDOWS_PLATFORM) && !defined(MAC_PLATFORM) && !defined(__BIONIC__) && !defined(IOS_PLATFORM) && \
    !defined(LINUX_PLATFORM)
            if (sprintf_s(nativeModulePath[0], pathLength, "lib%s%s", dupModuleName, soPostfix) == -1) {
                return false;
            }
#else
            if (sprintf_s(nativeModulePath[0], pathLength, "%s/lib%s%s", prefix, dupModuleName, soPostfix) == -1) {
                return false;
            }
#endif
#ifdef ANDROID_PLATFORM
            if (sprintf_s(nativeModulePath[1], pathLength, "%s/lib%s%s", prefix, moduleName, soPostfix) == -1) {
                return false;
            }
#endif
        }
    } else {
        char* afterDot = lastDot + 1;
        if (*afterDot == '\0') {
            return false;
        }
        *lastDot = '\0';
        lengthOfModuleName = strlen(dupModuleName);
        for (int32_t i = 0; i < lengthOfModuleName; i++) {
            if (*(dupModuleName + i) == '.') {
                *(dupModuleName + i) = '/';
            }
        }
        if (!isAppModule || !IsExistedPath(path)) {
            if (sprintf_s(nativeModulePath[0], pathLength, "%s/%s/lib%s%s%s",
                prefix, dupModuleName, afterDot, zfix, soPostfix) == -1) {
                return false;
            }
            if (sprintf_s(nativeModulePath[1], pathLength, "%s/%s/lib%s_napi%s%s",
                prefix, dupModuleName, afterDot, zfix, soPostfix) == -1) {
                return false;
            }
        } else {
#if !defined(WINDOWS_PLATFORM) && !defined(MAC_PLATFORM) && !defined(__BIONIC__) && !defined(IOS_PLATFORM) && \
    !defined(LINUX_PLATFORM)
            if (sprintf_s(nativeModulePath[0], pathLength, "lib%s%s", afterDot, soPostfix) == -1) {
                return false;
            }
#else
            if (sprintf_s(nativeModulePath[0], pathLength, "%s/%s/lib%s%s",
                prefix, dupModuleName, afterDot, soPostfix) == -1) {
                return false;
            }
#endif
#ifdef ANDROID_PLATFORM
            if (sprintf_s(nativeModulePath[1], pathLength, "%s/%s/lib%s%s",
                prefix, moduleName, afterDot, soPostfix) == -1) {
                return false;
            }
#endif
        }
    }
    return true;
}

LIBHANDLE NativeModuleManager::LoadModuleLibrary(const char* path, const char* pathKey, const bool isAppModule)
{
    if (strlen(path) == 0) {
        HILOG_ERROR("primary module path is empty");
        return nullptr;
    }
    LIBHANDLE lib = nullptr;
#ifdef ENABLE_HITRACE
    StartTrace(HITRACE_TAG_ACE, path);
#endif
#if defined(WINDOWS_PLATFORM)
    lib = LoadLibrary(path);
    if (lib == nullptr) {
        HILOG_WARN("LoadLibrary failed, error: %{public}d", GetLastError());
    }
#elif defined(MAC_PLATFORM) || defined(__BIONIC__) || defined(LINUX_PLATFORM)
    lib = dlopen(path, RTLD_LAZY);
    if (lib == nullptr) {
        HILOG_WARN("dlopen failed: %{public}s", dlerror());
    }

#elif defined(IOS_PLATFORM)
    lib = nullptr;
#else
    if (isAppModule && IsExistedPath(pathKey)) {
        Dl_namespace ns = nsMap_[pathKey];
        lib = dlopen_ns(&ns, path, RTLD_LAZY);
    } else {
        lib = dlopen(path, RTLD_LAZY);
    }
    if (lib == nullptr) {
        HILOG_WARN("dlopen failed: %{public}s", dlerror());
    }
#endif
#ifdef ENABLE_HITRACE
    FinishTrace(HITRACE_TAG_ACE);
#endif
    return lib;
}

using NAPIGetJSCode = void (*)(const char** buf, int* bufLen);
NativeModule* NativeModuleManager::FindNativeModuleByDisk(
    const char* moduleName, const char* path, bool internal, const bool isAppModule, bool isArk)
{
    char nativeModulePath[NATIVE_PATH_NUMBER][NAPI_PATH_MAX];
    nativeModulePath[0][0] = 0;
    nativeModulePath[1][0] = 0;
    if (!GetNativeModulePath(moduleName, path, isAppModule, nativeModulePath, NAPI_PATH_MAX)) {
        HILOG_WARN("get module failed, moduleName = %{public}s", moduleName);
        return nullptr;
    }
    if (!moduleLoadChecker_) {
        return nullptr;
    }
    if (!moduleLoadChecker_->CheckModuleLoadable(moduleName)) {
        HILOG_ERROR("module %{public}s is not allow to load", moduleName);
        return nullptr;
    }

    // load primary module path first
    char* loadPath = nativeModulePath[0];
    HILOG_DEBUG("get primary module path: %{public}s", loadPath);
    LIBHANDLE lib = LoadModuleLibrary(loadPath, path, isAppModule);
    if (lib == nullptr) {
        loadPath = nativeModulePath[1];
        HILOG_DEBUG("primary module path load failed, try to load secondary module path: %{public}s", loadPath);
        lib = LoadModuleLibrary(loadPath, path, isAppModule);
        if (lib == nullptr) {
            HILOG_ERROR("primary and secondary module path load failed %{public}s", moduleName);
            return nullptr;
        }
    }

    std::string moduleKey(moduleName);
    if (isAppModule) {
        moduleKey = path;
        moduleKey = moduleKey + '/' + moduleName;
    }

    if (lastNativeModule_ && strcmp(lastNativeModule_->name, moduleKey.c_str())) {
        HILOG_WARN(
            "moduleName '%{public}s' does not match plugin's name '%{public}s'", moduleName, lastNativeModule_->name);
    }

    if (!internal) {
        char symbol[NAPI_PATH_MAX] = { 0 };
        if (!isArk) {
            if (sprintf_s(symbol, sizeof(symbol), "NAPI_%s_GetJSCode", moduleKey.c_str()) == -1) {
                LIBFREE(lib);
                return nullptr;
            }
        } else {
            if (sprintf_s(symbol, sizeof(symbol), "NAPI_%s_GetABCCode", moduleKey.c_str()) == -1) {
                LIBFREE(lib);
                return nullptr;
            }
        }

        // replace '.' with '_'
        for (char* p = strchr(symbol, '.'); p != nullptr; p = strchr(p + 1, '.')) {
            *p = '_';
        }

        auto getJSCode = reinterpret_cast<NAPIGetJSCode>(LIBSYM(lib, symbol));
        if (getJSCode != nullptr) {
            const char* buf = nullptr;
            int bufLen = 0;
            getJSCode(&buf, &bufLen);
            if (lastNativeModule_ != nullptr) {
                HILOG_DEBUG("get js code from module: bufLen: %{public}d", bufLen);
                lastNativeModule_->jsCode = buf;
                lastNativeModule_->jsCodeLen = bufLen;
            }
        } else {
            HILOG_DEBUG("ignore: no %{public}s in %{public}s", symbol, loadPath);
        }
    }
    if (lastNativeModule_) {
        lastNativeModule_->moduleLoaded = true;
    }
    return lastNativeModule_;
}

NativeModule* NativeModuleManager::FindNativeModuleByCache(const char* moduleName)
{
    NativeModule* result = nullptr;
    NativeModule* preNativeModule = nullptr;
    for (NativeModule* temp = firstNativeModule_; temp != nullptr; temp = temp->next) {
        if (!strcasecmp(temp->name, moduleName)) {
            if (strcmp(temp->name, moduleName)) {
                HILOG_WARN("moduleName '%{public}s' does not match plugin's name '%{public}s'", moduleName, temp->name);
            }
            result = temp;
            break;
        }
        preNativeModule = temp;
    }

    if (result && !result->moduleLoaded) {
        if (result == lastNativeModule_) {
            return nullptr;
        }
        if (preNativeModule) {
            preNativeModule->next = result->next;
        } else {
            firstNativeModule_ = firstNativeModule_->next;
        }
        result->next = nullptr;
        lastNativeModule_->next = result;
        lastNativeModule_ = result;
        return nullptr;
    }
    return result;
}

bool NativeModuleManager::IsExistedPath(const char* pathKey) const
{
    return pathKey && appLibPathMap_.find(pathKey) != appLibPathMap_.end();
}

void NativeModuleManager::SetModuleBlocklist(
    std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist)
{
    if (!moduleLoadChecker_) {
        return;
    }
    moduleLoadChecker_->SetModuleBlocklist(std::forward<decltype(blocklist)>(blocklist));
}

void NativeModuleManager::SetProcessExtensionType(int32_t extensionType)
{
    if (!moduleLoadChecker_) {
        return;
    }
    moduleLoadChecker_->SetProcessExtensionType(extensionType);
}

int32_t NativeModuleManager::GetProcessExtensionType()
{
    if (!moduleLoadChecker_) {
        return EXTENSION_TYPE_UNSPECIFIED;
    }
    return moduleLoadChecker_->GetProcessExtensionType();
}
