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

#ifndef FOUNDATION_ACE_NAPI_SCOPE_MANAGER_NATIVE_SCOPE_MANAGER_H
#define FOUNDATION_ACE_NAPI_SCOPE_MANAGER_NATIVE_SCOPE_MANAGER_H

#include <cstddef>
#include <cstdlib>
#include <cstdint>
#include <vector>

#ifdef ENABLE_MEMLEAK_DEBUG
#include <atomic>
#endif

#ifdef ENABLE_MEMLEAK_DEBUG
#include <string>
#include <vector>
#endif

class NativeValue;
struct NativeHandle;
#ifdef ENABLE_MEMLEAK_DEBUG
struct StructVma {
    uint64_t begin = 0;
    uint64_t end = 0;
    std::string path;
};
#endif

struct NativeScope {
    static NativeScope* CreateNewInstance()
    {
        return new NativeScope();
    }

    NativeHandle* handlePtr = nullptr;
    size_t handleCount = 0;
    bool escaped = false;
    bool escapeCalled = false;

    NativeScope* child = nullptr;
    NativeScope* parent = nullptr;
};

class NativeChunk {
public:
    static constexpr size_t CHUNK_PAGE_SIZE = 8 * 1024;

    NativeChunk() {};
    ~NativeChunk()
    {
        for (auto iter = usedPage_.begin(); iter != usedPage_.end(); iter++) {
            free(*iter);
        }
        usedPage_.clear();
    }

    template<class T>
    [[nodiscard]] T *NewArray(size_t size)
    {
        return static_cast<T *>(Allocate(size * sizeof(T)));
    }

    template<typename T, typename... Args>
    [[nodiscard]] T *New(Args &&... args)
    {
        auto p = reinterpret_cast<void *>(Allocate(sizeof(T)));
        new (p) T(std::forward<Args>(args)...);
        return reinterpret_cast<T *>(p);
    }

    template<class T>
    void Delete(T *ptr)
    {
        if (!useChunk_) {
            delete ptr;
            return;
        }

        if (std::is_class<T>::value) {
            ptr->~T();
        }
    }

    void PushChunkStats(NativeScope* scope)
    {
        ChunkStats stats(scope, currentHandleStorageIndex_, ptr_, end_);
        chunkStats_.emplace_back(stats);
    }

    void PopChunkStats()
    {
        chunkStats_.pop_back();
    }

    void RemoveStats(NativeScope* scope)
    {
        for (auto iter = chunkStats_.begin(); iter != chunkStats_.end(); iter++) {
            if (iter->scope_ == scope) {
                chunkStats_.erase(iter);
                return;
            }
        }
    }

    void PopChunkStatsAndReset()
    {
        ChunkStats& stats = chunkStats_.back();
        ChunkReset(stats.prevScopeIndex_, stats.prevNext_, stats.prevEnd_);
        int index = static_cast<int>(usedPage_.size()) - 1;
        if (index < 0) {
            return;
        }
        for (; index > stats.prevScopeIndex_; index--) {
            free(usedPage_[index]);
            usedPage_.pop_back();
        }
        chunkStats_.pop_back();
    }

private:
    class ChunkStats {
    public:
        ChunkStats(NativeScope* scope, uint32_t index, uintptr_t begin, uintptr_t end)
            : scope_(scope), prevScopeIndex_(index), prevNext_(begin), prevEnd_(end) {}

        NativeScope* scope_ {nullptr};
        int32_t prevScopeIndex_ {-1};
        uintptr_t prevNext_ {0};
        uintptr_t prevEnd_ {0};
    };

    void ChunkReset(int32_t prevIndex, uintptr_t prevNext, uintptr_t prevEnd)
    {
        currentHandleStorageIndex_ = prevIndex;
        ptr_ = prevNext;
        end_ = prevEnd;
    }

    void *Allocate(size_t size)
    {
        uintptr_t result = ptr_;
        if (size > end_ - ptr_) {
            result = Expand();
        }
        ptr_ += size;
        return reinterpret_cast<void *>(result);
    }

    uintptr_t Expand()
    {
        void *ptr = malloc(CHUNK_PAGE_SIZE);
        if (ptr == nullptr) {
            std::abort();
        }
        usedPage_.emplace_back(ptr);
        currentHandleStorageIndex_++;
        useChunk_ = true;
        ptr_ = reinterpret_cast<uintptr_t>(ptr);
        end_ = ptr_ + CHUNK_PAGE_SIZE;
        return ptr_;
    }

    uintptr_t ptr_ {0};
    uintptr_t end_ {0};
    int32_t currentHandleStorageIndex_ {-1};
    bool useChunk_ {false};
    std::vector<void *> usedPage_ {};
    std::vector<ChunkStats> chunkStats_ {};
};

class NativeScopeManager {
public:
    NativeScopeManager();
    virtual ~NativeScopeManager();

    virtual NativeScope* Open();
    virtual void Close(NativeScope* scope, bool needReset = true);

    virtual NativeScope* OpenEscape();
    virtual void CloseEscape(NativeScope* scope);

    virtual void CreateHandle(NativeValue* value);
    virtual NativeValue* Escape(NativeScope* scope, NativeValue* value);

    NativeChunk& GetNativeChunk()
    {
        return nativeChunk_;
    }

    NativeScopeManager(NativeScopeManager&) = delete;
    virtual NativeScopeManager& operator=(NativeScopeManager&) = delete;

#ifdef ENABLE_MEMLEAK_DEBUG
    static const int MAPINFO_SIZE = 256;
    static const int NAME_LEN = 128;
    static const int DEBUG_MEMLEAK;
    static const int BACKTRACE_DEPTH;
#endif

private:
#ifdef ENABLE_MEMLEAK_DEBUG
    static std::atomic<std::vector<struct StructVma>*> vmas;
#endif
    NativeScope* root_;
    NativeScope* current_;
    NativeChunk nativeChunk_;
};

#endif /* FOUNDATION_ACE_NAPI_SCOPE_MANAGER_NATIVE_SCOPE_MANAGER_H */
