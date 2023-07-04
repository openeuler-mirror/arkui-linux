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

#ifndef FOUNDATION_ACE_NAPI_MODULE_MANAGER_NATIVE_MODULE_MANAGER_H
#define FOUNDATION_ACE_NAPI_MODULE_MANAGER_NATIVE_MODULE_MANAGER_H

#include <cstdint>
#include <map>
#include <mutex>
#include <vector>
#include <string>
#include <pthread.h>

#include "module_load_checker.h"
#include "utils/macros.h"

#ifdef WINDOWS_PLATFORM
#include <winsock2.h>
#include <windows.h>
using LIBHANDLE = HMODULE;
#define LIBFREE FreeLibrary
#define LIBSYM GetProcAddress
#else
#include <dlfcn.h>
using LIBHANDLE = void*;
#define LIBFREE dlclose
#define LIBSYM dlsym
#endif

#define NAPI_PATH_MAX 4096

class NativeValue;

class NativeEngine;

typedef NativeValue* (*RegisterCallback)(NativeEngine*, NativeValue*);

struct NativeModule {
    const char* name = nullptr;
    const char* fileName = nullptr;
    RegisterCallback registerCallback = nullptr;
    int32_t version = 0;
    uint32_t refCount = 0;
    NativeModule* next = nullptr;
    const char* jsCode = nullptr;
    int32_t jsCodeLen = 0;
    bool moduleLoaded = false;
    bool isAppModule = false;
};

class NAPI_EXPORT NativeModuleManager {
public:
    static NativeModuleManager* GetInstance();
    static uint64_t Release();

    void Register(NativeModule* nativeModule);
    void SetAppLibPath(const std::string& moduleName, const std::vector<std::string>& appLibPath);
    NativeModule* LoadNativeModule(const char* moduleName, const char* path, bool isAppModule, bool internal = false,
                                   bool isArk = false);
    void SetNativeEngine(std::string moduleName, NativeEngine* nativeEngine);
    const char* GetModuleFileName(const char* moduleName, bool isAppModule);

    /**
     * @brief Set the Module Blacklist
     *
     * @param blocklist the blocklist
     */
    void SetModuleBlocklist(std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist);

    /**
     * @brief Set the Process Extension Type
     *
     * @param extensionType extension type
     */
    void SetProcessExtensionType(int32_t extensionType);

    /**
     * @brief Get the Process Extension Type
     *
     * @return Process extension type
     */
    int32_t GetProcessExtensionType();

private:
    NativeModuleManager();
    virtual ~NativeModuleManager();

    bool GetNativeModulePath(const char* moduleName, const char* pathKey, bool isAppModule,
        char nativeModulePath[][NAPI_PATH_MAX], int32_t pathLength);
    NativeModule* FindNativeModuleByDisk(const char* moduleName, const char* pathKey, bool internal,
        const bool isAppModule, bool isArk);
    NativeModule* FindNativeModuleByCache(const char* moduleName);
    LIBHANDLE LoadModuleLibrary(const char* path, const char* pathKey, const bool isAppModule);
    void CreateLdNamespace(const std::string moduleName, const char* lib_ld_path);
    bool IsExistedPath(const char* pathKey) const;
#if !defined(WINDOWS_PLATFORM) && !defined(MAC_PLATFORM) && !defined(__BIONIC__) && !defined(IOS_PLATFORM) && \
    !defined(LINUX_PLATFORM)
    char* FormatString();
    std::map<std::string, Dl_namespace> nsMap_;
#endif
    NativeModule* firstNativeModule_ = nullptr;
    NativeModule* lastNativeModule_ = nullptr;
    char* appLibPath_ = nullptr;

    static NativeModuleManager *instance_;
    pthread_mutex_t mutex_;
    std::string prefix_;
    bool isAppModule_ = false;

    std::mutex nativeEngineListMutex_;
    std::map<std::string, NativeEngine*> nativeEngineList_;
    std::map<std::string, char*> appLibPathMap_;
    ModuleLoadChecker* moduleLoadChecker_ = nullptr;
};

#endif /* FOUNDATION_ACE_NAPI_MODULE_MANAGER_NATIVE_MODULE_MANAGER_H */
