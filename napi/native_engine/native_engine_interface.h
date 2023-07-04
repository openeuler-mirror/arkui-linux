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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_INTERFACE_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_INTERFACE_H

#include <functional>
#include <unordered_set>
#include <vector>
#ifdef LINUX_PLATFORM
#include<atomic>
#endif

#include "callback_scope_manager/native_callback_scope_manager.h"
#include "module_manager/native_module_manager.h"
#include "native_engine/native_async_work.h"
#include "native_engine/native_deferred.h"
#include "native_engine/native_reference.h"
#include "native_engine/native_safe_async_work.h"
#include "native_engine/native_value.h"
#include "native_property.h"
#include "reference_manager/native_reference_manager.h"
#include "scope_manager/native_scope_manager.h"
#include "utils/macros.h"

typedef struct uv_loop_s uv_loop_t;

struct NativeErrorExtendedInfo {
    const char* message = nullptr;
    void* reserved = nullptr;
    uint32_t engineErrorCode = 0;
    int errorCode = 0;
};

struct ExceptionInfo {
    const char* message_ = nullptr;
    int32_t lineno_ = 0;
    int32_t colno_ = 0;

    ~ExceptionInfo()
    {
        if (message_ != nullptr) {
            delete[] message_;
        }
    }
};

enum LoopMode {
    LOOP_DEFAULT, LOOP_ONCE, LOOP_NOWAIT
};

enum class DumpFormat {
    JSON, BINARY, OTHER
};

class CleanupHookCallback {
public:
    using Callback = void (*)(void*);

    CleanupHookCallback(Callback fn, void* arg, uint64_t insertion_order_counter)
        : fn_(fn), arg_(arg), insertion_order_counter_(insertion_order_counter)
    {}

    struct Hash {
        inline size_t operator()(const CleanupHookCallback& cb) const
        {
            return std::hash<void*>()(cb.arg_);
        }
    };
    struct Equal {
        inline bool operator()(const CleanupHookCallback& a, const CleanupHookCallback& b) const
        {
            return a.fn_ == b.fn_ && a.arg_ == b.arg_;
        };
    };

private:
    friend class NativeEngineInterface;
    Callback fn_;
    void* arg_;
    uint64_t insertion_order_counter_;
};

using PostTask = std::function<void(bool needSync)>;
using CleanEnv = std::function<void()>;
using UncaughtExceptionCallback = std::function<void(NativeValue* value)>;
using NapiConcurrentCallback = void (*)(NativeEngine* engine, NativeValue* value, NativeValue* data);

class NAPI_EXPORT NativeEngineInterface {
public:
    NativeEngineInterface(NativeEngine* engine, void* jsEngineInterface);
    virtual ~NativeEngineInterface();

    virtual NativeScopeManager* GetScopeManager();
    virtual NativeModuleManager* GetModuleManager();
    virtual NativeReferenceManager* GetReferenceManager();
    virtual NativeCallbackScopeManager* GetCallbackScopeManager();
    virtual uv_loop_t* GetUVLoop() const;
    virtual pthread_t GetTid() const;

    virtual bool ReinitUVLoop();

    virtual void Loop(LoopMode mode, bool needSync = false);
    virtual void SetPostTask(PostTask postTask);
    virtual void TriggerPostTask();
#if !defined(PREVIEW)
    virtual void CheckUVLoop();
    virtual void CancelCheckUVLoop();
#endif
    virtual void* GetJsEngine();

    virtual NativeValue* GetGlobal(NativeEngine* engine) = 0;

    virtual NativeValue* CreateNull(NativeEngine* engine) = 0;
    virtual NativeValue* CreateUndefined(NativeEngine* engine) = 0;
    virtual NativeValue* CreateBoolean(NativeEngine* engine, bool value) = 0;
    virtual NativeValue* CreateNumber(NativeEngine* engine, int32_t value) = 0;
    virtual NativeValue* CreateNumber(NativeEngine* engine, uint32_t value) = 0;
    virtual NativeValue* CreateNumber(NativeEngine* engine, int64_t value) = 0;
    virtual NativeValue* CreateNumber(NativeEngine* engine, double value) = 0;
    virtual NativeValue* CreateBigInt(NativeEngine* engine, int64_t value) = 0;
    virtual NativeValue* CreateBigInt(NativeEngine* engine, uint64_t value) = 0;
    virtual NativeValue* CreateString(NativeEngine* engine, const char* value, size_t length) = 0;
    virtual NativeValue* CreateString16(NativeEngine* engine, const char16_t* value, size_t length) = 0;

    virtual NativeValue* CreateSymbol(NativeEngine* engine, NativeValue* value) = 0;
    virtual NativeValue* CreateExternal(NativeEngine* engine, void* value, NativeFinalize callback,
        void* hint, size_t nativeBindingSize = 0) = 0;

    virtual NativeValue* CreateObject(NativeEngine* engine) = 0;
    virtual NativeValue* CreateNativeBindingObject(NativeEngine* engine, void* detach, void* attach) = 0;
    virtual NativeValue* CreateNBObject(NativeEngine* engine, DetachCallback detach, AttachCallback attach) = 0;
    virtual NativeValue* CreateFunction(
        NativeEngine* engine, const char* name, size_t length, NativeCallback cb, void* value) = 0;
    virtual NativeValue* CreateArray(NativeEngine* engine, size_t length) = 0;
    virtual NativeValue* CreateBuffer(NativeEngine* engine, void** value, size_t length) = 0;
    virtual NativeValue* CreateBufferCopy(NativeEngine* engine, void** value, size_t length, const void* data) = 0;
    virtual NativeValue* CreateBufferExternal(
        NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint) = 0;
    virtual NativeValue* CreateArrayBuffer(NativeEngine* engine, void** value, size_t length) = 0;
    virtual NativeValue* CreateArrayBufferExternal(
        NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint) = 0;

    virtual NativeValue* CreateTypedArray(
        NativeEngine* engine, NativeTypedArrayType type, NativeValue* value, size_t length, size_t offset) = 0;
    virtual NativeValue* CreateDataView(NativeEngine* engine, NativeValue* value, size_t length, size_t offset) = 0;
    virtual NativeValue* CreatePromise(NativeEngine* engine, NativeDeferred** deferred) = 0;
    virtual void SetPromiseRejectCallback(
        NativeEngine* engine, NativeReference* rejectCallbackRef, NativeReference* checkCallbackRef) = 0;
    virtual NativeValue* CreateError(NativeEngine* engine, NativeValue* code, NativeValue* message) = 0;

    virtual bool InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback) = 0;
    virtual bool InitTaskPoolFunc(NativeEngine* engine, NativeValue* func) = 0;

    virtual NativeValue* CallFunction(
        NativeEngine* engine, NativeValue* thisVar, NativeValue* function, NativeValue* const *argv, size_t argc) = 0;
    virtual NativeValue* RunScript(NativeEngine* engine, NativeValue* script) = 0;
    virtual NativeValue* RunScriptPath(NativeEngine* engine, const char* path) = 0;
    virtual NativeValue* RunScriptBuffer(
        NativeEngine* engine, const char* path, std::vector<uint8_t>& buffer, bool isBundle) = 0;
    virtual NativeValue* RunBufferScript(NativeEngine* engine, std::vector<uint8_t>& buffer) = 0;
    virtual NativeValue* RunActor(NativeEngine* engine, std::vector<uint8_t>& buffer, const char* descriptor) = 0;
    virtual NativeValue* DefineClass(NativeEngine* engine,
                                     const char* name,
                                     NativeCallback callback,
                                     void* data,
                                     const NativePropertyDescriptor* properties,
                                     size_t length) = 0;

    virtual NativeValue* CreateInstance(
        NativeEngine* engine, NativeValue* constructor, NativeValue* const *argv, size_t argc) = 0;

    virtual NativeReference* CreateReference(NativeEngine* engine, NativeValue* value, uint32_t initialRefcount,
        NativeFinalize callback = nullptr, void* data = nullptr, void* hint = nullptr) = 0;

    virtual NativeAsyncWork* CreateAsyncWork(NativeEngine* engine, NativeValue* asyncResource,
        NativeValue* asyncResourceName, NativeAsyncExecuteCallback execute, NativeAsyncCompleteCallback complete,
        void* data);

    virtual NativeAsyncWork* CreateAsyncWork(NativeEngine* engine, const std::string &asyncResourceName,
        NativeAsyncExecuteCallback execute, NativeAsyncCompleteCallback complete, void* data);
    virtual NativeSafeAsyncWork* CreateSafeAsyncWork(NativeEngine* engine, NativeValue* func,
        NativeValue* asyncResource, NativeValue* asyncResourceName, size_t maxQueueSize, size_t threadCount,
        void* finalizeData, NativeFinalize finalizeCallback, void* context,
        NativeThreadSafeFunctionCallJs callJsCallback);

    virtual bool Throw(NativeValue* error) = 0;
    virtual bool Throw(NativeEngine* engine, NativeErrorType type, const char* code, const char* message) = 0;

    virtual void* CreateRuntime(NativeEngine* engine) = 0;
    virtual NativeValue* Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer) = 0;
    virtual NativeValue* Deserialize(NativeEngine* engine, NativeEngine* context, NativeValue* recorder) = 0;
    virtual void DeleteSerializationData(NativeValue* value) const = 0;
    virtual NativeValue* LoadModule(NativeEngine* engine, NativeValue* str, const std::string& fileName) = 0;

    virtual void StartCpuProfiler(const std::string& fileName = "") = 0;
    virtual void StopCpuProfiler() = 0;

    virtual void ResumeVM() = 0;
    virtual bool SuspendVM() = 0;
    virtual bool IsSuspended() = 0;
    virtual bool CheckSafepoint() = 0;

    virtual void DumpHeapSnapshot(const std::string& path, bool isVmMode = true,
        DumpFormat dumpFormat = DumpFormat::JSON) = 0;
    virtual void DumpHeapSnapshotExt(bool isVmMode = true, DumpFormat dumpFormat = DumpFormat::JSON,
        bool isPrivate = false) = 0;
    virtual bool BuildNativeAndJsStackTrace(std::string& stackTraceStr) = 0;
    virtual bool BuildJsStackTrace(std::string& stackTraceStr) = 0;
    virtual bool BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames) = 0;
    virtual bool DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine) = 0;
    virtual bool StartHeapTracking(double timeInterval, bool isVmMode = true) = 0;
    virtual bool StopHeapTracking(const std::string& filePath) = 0;

    NativeErrorExtendedInfo* GetLastError();
    void SetLastError(int errorCode, uint32_t engineErrorCode = 0, void* engineReserved = nullptr);
    void ClearLastError();
    virtual bool IsExceptionPending() const = 0;
    virtual NativeValue* GetAndClearLastException(NativeEngine* engine) = 0;
    void EncodeToUtf8(NativeValue* nativeValue, char* buffer, int32_t* written, size_t bufferSize, int32_t* nchars);
    void EncodeToChinese(NativeValue* nativeValue, std::string& buffer, const std::string& encoding);
    NativeEngineInterface(NativeEngineInterface&) = delete;
    virtual NativeEngineInterface& operator=(NativeEngineInterface&) = delete;

    virtual NativeValue* ValueToNativeValue(NativeEngine* engine, JSValueWrapper& value) = 0;
    virtual bool TriggerFatalException(NativeValue* error) = 0;
    virtual bool AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue) = 0;

    void MarkSubThread()
    {
        isMainThread_ = false;
    }

    bool IsMainThread() const
    {
        return isMainThread_;
    }

    void SetCleanEnv(CleanEnv cleanEnv)
    {
        cleanEnv_ = cleanEnv;
    }

    virtual NativeValue* CreateDate(NativeEngine* engine, double value) = 0;
    virtual NativeValue* CreateBigWords(
        NativeEngine* engine, int sign_bit, size_t word_count, const uint64_t* words) = 0;
    using CleanupCallback = CleanupHookCallback::Callback;
    virtual void AddCleanupHook(CleanupCallback fun, void* arg);
    virtual void RemoveCleanupHook(CleanupCallback fun, void* arg);

    void CleanupHandles();
    void IncreaseWaitingRequestCounter();
    void DecreaseWaitingRequestCounter();
    virtual void RunCleanup();

    bool IsStopping() const
    {
        return isStopping_.load();
    }

    void SetStopping(bool value)
    {
        isStopping_.store(value);
    }

    virtual void PrintStatisticResult() = 0;
    virtual void StartRuntimeStat() = 0;
    virtual void StopRuntimeStat() = 0;
    virtual size_t GetArrayBufferSize() = 0;
    virtual size_t GetHeapTotalSize() = 0;
    virtual size_t GetHeapUsedSize() = 0;
    virtual void NotifyApplicationState([[maybe_unused]] bool inBackground) {}
    virtual void NotifyIdleTime([[maybe_unused]] int idleMicroSec) {}
    virtual void NotifyMemoryPressure([[maybe_unused]] bool inHighMemoryPressure = false) {}

    virtual void RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback) = 0;
    virtual void HandleUncaughtException(NativeEngine* engine) = 0;
    virtual bool HasPendingException() = 0;
    // run script by path
    NativeValue* RunScript(const char* path);
    NativeEngine* GetRootNativeEngine(void);
protected:
    void Init();
    void Deinit();

    NativeModuleManager* moduleManager_ = nullptr;
    NativeScopeManager* scopeManager_ = nullptr;
    NativeReferenceManager* referenceManager_ = nullptr;
    NativeCallbackScopeManager* callbackScopeManager_ = nullptr;

    NativeErrorExtendedInfo lastError_;

    uv_loop_t* loop_ = nullptr;

    void* jsEngineInterface_;
    NativeEngine* rootNativeEngine__;
private:
    bool isMainThread_ { true };

#if !defined(PREVIEW)
    static void UVThreadRunner(void* nativeEngine);
    void PostLoopTask();

    bool checkUVLoop_ = false;
    uv_thread_t uvThread_;
#endif

    PostTask postTask_ = nullptr;
    CleanEnv cleanEnv_ = nullptr;
    uv_sem_t uvSem_;
    uv_async_t uvAsync_;
    std::unordered_set<CleanupHookCallback, CleanupHookCallback::Hash, CleanupHookCallback::Equal> cleanup_hooks_;
    uint64_t cleanup_hook_counter_ = 0;
    int request_waiting_ = 0;
    std::atomic_bool isStopping_ { false };
    pthread_t tid_ = 0;
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_H */
