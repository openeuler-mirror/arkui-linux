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

#include "native_scope_manager.h"

#ifdef ENABLE_MEMLEAK_DEBUG
#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <securec.h>
#include <thread>
#include <unistd.h>
// for libunwind.h empty struct has size 0 in c, size 1 in c++
#define UNW_EMPTY_STRUCT uint8_t unused;
#include <libunwind.h>
#endif

#include "native_engine/native_value.h"
#ifdef ENABLE_MEMLEAK_DEBUG
#include "parameters.h"
#endif
#include <cstddef>

#include "utils/log.h"

struct NativeHandle {
    NativeValue* value = nullptr;
    NativeHandle* sibling = nullptr;
};

#ifdef ENABLE_MEMLEAK_DEBUG
using OHOS::system::GetIntParameter;
const int NativeScopeManager::DEBUG_MEMLEAK = OHOS::system::GetIntParameter<int>("persist.napi.memleak.debug", 0);
// 100 for the default depth.
const int NativeScopeManager::BACKTRACE_DEPTH = OHOS::system::GetIntParameter<int>("persist.napi.memleak.depth", 100);
std::atomic<std::vector<struct StructVma>*> NativeScopeManager::vmas(nullptr);

static void TrimAndDupStr(const std::string& source, std::string& str)
{
    auto const firstPos = source.find_first_not_of(' ');
    if (firstPos == std::string::npos) {
        return;
    }
    auto len = source.find_last_not_of(' ') - firstPos + 1;
    if (len > NativeScopeManager::MAPINFO_SIZE) {
        len = NativeScopeManager::MAPINFO_SIZE;
    }
    str = source.substr(firstPos, len);
}

static bool CreateVma(struct StructVma& vma, const std::string& mapInfo)
{
    int pos = 0;
    uint64_t begin = 0;
    uint64_t end = 0;
    uint64_t offset = 0;
    char perms[5] = { 0 }; // 5:rwxp

    if (sscanf_s(mapInfo.c_str(), "%" SCNxPTR "-%" SCNxPTR " %4s %" SCNxPTR " %*x:%*x %*d%n", &begin, &end, &perms,
            sizeof(perms), &offset, &pos) != 4) { // 4:scan size
        return false;
    }
    vma.begin = begin;
    vma.end = end;
    TrimAndDupStr(mapInfo.substr(pos), vma.path);
    return true;
}

static void CreateVmas(int pid, std::vector<struct StructVma>& vmas)
{
    if (pid <= 0) {
        return;
    }
    char path[NativeScopeManager::NAME_LEN] = { 0 };
    if (snprintf_s(path, sizeof(path), sizeof(path) - 1, "/proc/%d/maps", pid) <= 0) {
        return;
    }
    char realPath[PATH_MAX] = { 0 };
    if (realpath(path, realPath) == nullptr) {
        return;
    }
    FILE* fp = fopen(realPath, "r");
    if (fp == nullptr) {
        return;
    }
    char mapInfo[NativeScopeManager::MAPINFO_SIZE] = { 0 };
    while (fgets(mapInfo, sizeof(mapInfo), fp) != nullptr) {
        struct StructVma vma;
        std::string info(mapInfo);
        if (CreateVma(vma, info)) {
            vmas.push_back(vma);
        }
    }
    (void)fclose(fp);
}

static void ResetVmas(std::atomic<std::vector<struct StructVma>*>& vmas)
{
    std::vector<struct StructVma>* new_vmas = new std::vector<struct StructVma>();
    if (new_vmas == nullptr) {
        return;
    }
    CreateVmas(getpid(), *new_vmas);
    new_vmas = vmas.exchange(new_vmas);
    if (new_vmas != nullptr) {
        delete new_vmas;
    }
}

static const struct StructVma* FindMapByAddr(uintptr_t address, const std::vector<struct StructVma>& vmas)
{
    for (auto iter = vmas.begin(); iter != vmas.end(); iter++) {
        if (((*iter).begin <= address) && ((*iter).end > address)) {
            return &(*iter);
        }
    }
    return nullptr;
}

static bool BackTrace(const std::vector<struct StructVma>& vmas)
{
    bool hasUnknowMap = false;
    int depth = 0;
    unw_cursor_t cursor;
    unw_context_t context;
    unw_getcontext(&context);
    unw_init_local(&cursor, &context);
    while (unw_step(&cursor) > 0) {
        unw_word_t offset, pc;
        unw_get_reg(&cursor, UNW_REG_IP, &pc);
        if (pc == 0 || ++depth > NativeScopeManager::BACKTRACE_DEPTH) {
            break;
        }
        char sym[512]; // 512:max length of a symbol.
        const struct StructVma* vma = FindMapByAddr(pc, vmas);
        if (vma == nullptr) {
            hasUnknowMap = true;
        }
        int ret = unw_get_proc_name(&cursor, sym, sizeof(sym), &offset);
        if (ret == 0) {
            HILOG_ERROR("MEMLEAK: %{public}s +0x%{public}" SCNxPTR ", %{public}s\n", sym, offset,
                (vma != nullptr) ? vma->path.c_str() : "unknow_path");
        } else {
            HILOG_ERROR("MEMLEAK: unknow(%{public}d) pc=0x%{public}" SCNxPTR ", %{public}s\n", ret, pc,
                (vma != nullptr) ? vma->path.c_str() : "unknow_path");
        }
    }
    return hasUnknowMap;
}
#endif

NativeScopeManager::NativeScopeManager()
{
    root_ = NativeScope::CreateNewInstance();
    current_ = root_;
#ifdef ENABLE_MEMLEAK_DEBUG
    if (NativeScopeManager::DEBUG_MEMLEAK != 0 && NativeScopeManager::vmas == nullptr) {
        ResetVmas(NativeScopeManager::vmas);
    }
#endif
}

NativeScopeManager::~NativeScopeManager()
{
    NativeScope* scope = root_;
    while (scope != nullptr) {
        NativeScope* tempScope = scope->child;
        NativeHandle* handle = scope->handlePtr;
        while (handle != nullptr) {
            NativeHandle* tempHandle = handle->sibling;
            nativeChunk_.Delete(handle->value);
            nativeChunk_.Delete(handle);
            handle = tempHandle;
        }
        delete scope;
        scope = tempScope;
    }
    root_ = nullptr;
    current_ = nullptr;
}

NativeScope* NativeScopeManager::Open()
{
    if (current_ == nullptr) {
        HILOG_ERROR("current scope is null when open scope");
        return nullptr;
    }

    auto scope = new NativeScope();
    nativeChunk_.PushChunkStats(current_);
    if (scope != nullptr) {
        current_->child = scope;
        scope->parent = current_;
        current_ = scope;
    }

    return scope;
}

void NativeScopeManager::Close(NativeScope* scope, bool needReset)
{
    if ((scope == nullptr) || (scope == root_)) {
        return;
    }
    bool alreadyPop = false;
    if (scope == current_) {
        current_ = scope->parent;
    } else {
        nativeChunk_.RemoveStats(scope);
        alreadyPop = true;
    }

    scope->parent->child = scope->child;

    NativeHandle* handle = scope->handlePtr;
    while (handle != nullptr) {
        scope->handlePtr = handle->sibling;
        nativeChunk_.Delete(handle->value);
        nativeChunk_.Delete(handle);
        handle = scope->handlePtr;
    }
    if (!alreadyPop) {
        if (needReset) {
            nativeChunk_.PopChunkStatsAndReset();
        } else {
            nativeChunk_.PopChunkStats();
        }
    }
    delete scope;
}

NativeScope* NativeScopeManager::OpenEscape()
{
    NativeScope* scope = Open();
    if (scope != nullptr) {
        scope->escaped = true;
    }
    return scope;
}

void NativeScopeManager::CloseEscape(NativeScope* scope)
{
    if (scope == nullptr) {
        return;
    }
    Close(scope, false);
}

NativeValue* NativeScopeManager::Escape(NativeScope* scope, NativeValue* value)
{
    NativeValue* result = nullptr;

    if ((scope == nullptr) || (value == nullptr)) {
        return result;
    }

    NativeHandle* handle = scope->handlePtr;
    NativeHandle* temp = nullptr;
    while (handle != nullptr && scope->escaped) {
        if (handle->value == value) {
            if (temp == nullptr) {
                scope->handlePtr = handle->sibling;
            } else {
                temp->sibling = handle->sibling;
            }
            if (scope->parent->handlePtr == nullptr) {
                scope->parent->handlePtr = handle;
                handle->sibling = nullptr;
            } else {
                handle->sibling = scope->parent->handlePtr;
                scope->parent->handlePtr = handle;
            }
            scope->handleCount--;
            scope->parent->handleCount++;
            result = scope->parent->handlePtr->value;
            break;
        }
        temp = handle;
        handle = handle->sibling;
    }
    return result;
}

void NativeScopeManager::CreateHandle(NativeValue* value)
{
    if (current_ == nullptr) {
        HILOG_ERROR("current scope is null when create handle");
        return;
    }
    auto handlePtr = nativeChunk_.New<NativeHandle>();
    if (handlePtr == nullptr) {
        HILOG_ERROR("create handle ptr failed");
        return;
    }
    if (current_->handlePtr == nullptr) {
        current_->handlePtr = handlePtr;
        current_->handlePtr->value = value;
        current_->handlePtr->sibling = nullptr;
    } else {
        handlePtr->sibling = current_->handlePtr;
        handlePtr->value = value;
        current_->handlePtr = handlePtr;
    }
    current_->handleCount++;
#ifdef ENABLE_MEMLEAK_DEBUG
    if (NativeScopeManager::DEBUG_MEMLEAK != 0 && current_ == root_) {
        HILOG_ERROR(
            "MEMLEAK: size=%{public}" SCNdPTR ", total=%{public}" SCNdPTR, sizeof(*value), current_->handleCount);
        if (NativeScopeManager::vmas != nullptr && !BackTrace(*NativeScopeManager::vmas)) {
            return;
        }
        ResetVmas(NativeScopeManager::vmas);
    }
#endif
}
