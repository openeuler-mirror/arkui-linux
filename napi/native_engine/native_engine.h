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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_H

#include <functional>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

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
#include "native_engine_interface.h"

typedef int32_t (*GetContainerScopeIdCallback)(void);
typedef void (*ContainerScopeCallback)(int32_t);

using PostTask = std::function<void(bool needSync)>;
using CleanEnv = std::function<void()>;
using InitWorkerFunc = std::function<void(NativeEngine* engine)>;
using GetAssetFunc = std::function<void(const std::string& uri, std::vector<uint8_t>& content, std::string& ami)>;
using OffWorkerFunc = std::function<void(NativeEngine* engine)>;
using DebuggerPostTask = std::function<void(std::function<void()>&&)>;
using UncaughtExceptionCallback = std::function<void(NativeValue* value)>;

class NAPI_EXPORT NativeEngine {
public:
    explicit NativeEngine(void* jsEngine);
    virtual ~NativeEngine();

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
    virtual void DeleteEngine();

    virtual NativeValue* GetGlobal() = 0;

    virtual NativeValue* CreateNull() = 0;
    virtual NativeValue* CreateUndefined() = 0;
    virtual NativeValue* CreateBoolean(bool value) = 0;
    virtual NativeValue* CreateNumber(int32_t value) = 0;
    virtual NativeValue* CreateNumber(uint32_t value) = 0;
    virtual NativeValue* CreateNumber(int64_t value) = 0;
    virtual NativeValue* CreateNumber(double value) = 0;
    virtual NativeValue* CreateBigInt(int64_t value) = 0;
    virtual NativeValue* CreateBigInt(uint64_t value) = 0;
    virtual NativeValue* CreateString(const char* value, size_t length) = 0;
    virtual NativeValue* CreateString16(const char16_t* value, size_t length) = 0;

    virtual NativeValue* CreateSymbol(NativeValue* value) = 0;
    virtual NativeValue* CreateExternal(void* value, NativeFinalize callback, void* hint,
        size_t nativeBindingSize = 0) = 0;

    virtual NativeValue* CreateObject() = 0;
    virtual NativeValue* CreateNativeBindingObject(void* detach, void* attach) = 0;
    virtual NativeValue* CreateNBObject(DetachCallback detach, AttachCallback attach) = 0;
    virtual NativeValue* CreateFunction(const char* name, size_t length, NativeCallback cb, void* value) = 0;
    virtual NativeValue* CreateArray(size_t length) = 0;
    virtual NativeValue* CreateBuffer(void** value, size_t length) = 0;
    virtual NativeValue* CreateBufferCopy(void** value, size_t length, const void* data) = 0;
    virtual NativeValue* CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) = 0;
    virtual NativeValue* CreateArrayBuffer(void** value, size_t length) = 0;
    virtual NativeValue* CreateArrayBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) = 0;

    virtual NativeValue* CreateTypedArray(NativeTypedArrayType type,
                                          NativeValue* value,
                                          size_t length,
                                          size_t offset) = 0;
    virtual NativeValue* CreateDataView(NativeValue* value, size_t length, size_t offset) = 0;
    virtual NativeValue* CreatePromise(NativeDeferred** deferred) = 0;
    virtual void SetPromiseRejectCallback(NativeReference* rejectCallbackRef, NativeReference* checkCallbackRef) = 0;
    virtual NativeValue* CreateError(NativeValue* code, NativeValue* message) = 0;

    virtual bool InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback) = 0;
    virtual bool InitTaskPoolFunc(NativeEngine* engine, NativeValue* func) = 0;
    virtual NativeValue* CallFunction(NativeValue* thisVar,
                                      NativeValue* function,
                                      NativeValue* const *argv,
                                      size_t argc) = 0;
    virtual NativeValue* RunScript(NativeValue* script) = 0;
    virtual NativeValue* RunScriptPath(const char* path) = 0;
    virtual NativeValue* RunScriptBuffer(const char* path, std::vector<uint8_t>& buffer, bool isBundle) = 0;
    virtual NativeValue* RunBufferScript(std::vector<uint8_t>& buffer) = 0;
    virtual NativeValue* RunActor(std::vector<uint8_t>& buffer, const char* descriptor) = 0;
    virtual NativeValue* DefineClass(const char* name,
                                     NativeCallback callback,
                                     void* data,
                                     const NativePropertyDescriptor* properties,
                                     size_t length) = 0;

    virtual NativeValue* CreateInstance(NativeValue* constructor, NativeValue* const *argv, size_t argc) = 0;

    virtual NativeReference* CreateReference(NativeValue* value, uint32_t initialRefcount,
        NativeFinalize callback = nullptr, void* data = nullptr, void* hint = nullptr) = 0;

    virtual NativeAsyncWork* CreateAsyncWork(NativeValue* asyncResource,
                                             NativeValue* asyncResourceName,
                                             NativeAsyncExecuteCallback execute,
                                             NativeAsyncCompleteCallback complete,
                                             void* data);

    virtual NativeAsyncWork* CreateAsyncWork(const std::string &asyncResourceName,
                                             NativeAsyncExecuteCallback execute,
                                             NativeAsyncCompleteCallback complete,
                                             void* data);
    virtual NativeSafeAsyncWork* CreateSafeAsyncWork(NativeValue* func, NativeValue* asyncResource,
        NativeValue* asyncResourceName, size_t maxQueueSize, size_t threadCount, void* finalizeData,
        NativeFinalize finalizeCallback, void* context, NativeThreadSafeFunctionCallJs callJsCallback);

    virtual bool Throw(NativeValue* error) = 0;
    virtual bool Throw(NativeErrorType type, const char* code, const char* message) = 0;

    virtual void* CreateRuntime() = 0;
    virtual NativeValue* Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer) = 0;
    virtual NativeValue* Deserialize(NativeEngine* context, NativeValue* recorder) = 0;
    virtual void DeleteSerializationData(NativeValue* value) const = 0;
    virtual NativeValue* LoadModule(NativeValue* str, const std::string& fileName) = 0;

    virtual void StartCpuProfiler(const std::string& fileName = "") = 0;
    virtual void StopCpuProfiler() = 0;

    virtual void ResumeVM() = 0;
    virtual bool SuspendVM() = 0;
    virtual bool IsSuspended() = 0;
    virtual bool CheckSafepoint() = 0;

    virtual void DumpHeapSnapshot(const std::string &path, bool isVmMode = true,
        DumpFormat dumpFormat = DumpFormat::JSON) = 0;
    virtual void DumpHeapSnapshot(bool isVmMode = true, DumpFormat dumpFormat = DumpFormat::JSON,
        bool isPrivate = false) = 0;
    virtual bool BuildNativeAndJsStackTrace(std::string &stackTraceStr) = 0;
    virtual bool BuildJsStackTrace(std::string &stackTraceStr) = 0;
    virtual bool BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames) = 0;
    virtual bool DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine) = 0;
    virtual bool StartHeapTracking(double timeInterval, bool isVmMode = true) = 0;
    virtual bool StopHeapTracking(const std::string &filePath) = 0;

    NativeErrorExtendedInfo* GetLastError();
    void SetLastError(int errorCode, uint32_t engineErrorCode = 0, void* engineReserved = nullptr);
    void ClearLastError();
    virtual bool IsExceptionPending() const = 0;
    virtual NativeValue* GetAndClearLastException() = 0;
    void EncodeToUtf8(NativeValue* nativeValue, char* buffer, int32_t* written, size_t bufferSize, int32_t* nchars);
    void EncodeToChinese(NativeValue* nativeValue, std::string& buffer, const std::string& encoding);
    NativeEngine(NativeEngine&) = delete;
    virtual NativeEngine& operator=(NativeEngine&) = delete;

    virtual NativeValue* ValueToNativeValue(JSValueWrapper& value) = 0;
    virtual bool TriggerFatalException(NativeValue* error) = 0;
    virtual bool AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue) = 0;

    void MarkSubThread()
    {
        nativeEngineImpl_->MarkSubThread();
    }

    bool IsMainThread() const
    {
        return nativeEngineImpl_->IsMainThread();
    }

    void SetCleanEnv(CleanEnv cleanEnv)
    {
        nativeEngineImpl_->SetCleanEnv(cleanEnv);
    }

    // register init worker func
    virtual void SetInitWorkerFunc(InitWorkerFunc func);
    virtual void SetGetAssetFunc(GetAssetFunc func);
    virtual void SetOffWorkerFunc(OffWorkerFunc func);

    // call init worker func
    virtual bool CallInitWorkerFunc(NativeEngine* engine);
    virtual bool CallGetAssetFunc(const std::string& uri, std::vector<uint8_t>& content, std::string& ami);
    virtual bool CallOffWorkerFunc(NativeEngine* engine);

    // adapt worker to ace container
    virtual void SetGetContainerScopeIdFunc(GetContainerScopeIdCallback func);
    virtual void SetInitContainerScopeFunc(ContainerScopeCallback func);
    virtual void SetFinishContainerScopeFunc(ContainerScopeCallback func);
    virtual int32_t GetContainerScopeIdFunc();
    virtual bool InitContainerScopeFunc(int32_t id);
    virtual bool FinishContainerScopeFunc(int32_t id);

#if !defined(PREVIEW)
    virtual void SetDebuggerPostTaskFunc(DebuggerPostTask func);
    virtual void CallDebuggerPostTaskFunc(std::function<void()>&& task);
#endif
    virtual NativeValue* CreateDate(double value) = 0;
    virtual NativeValue* CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words) = 0;
    using CleanupCallback = CleanupHookCallback::Callback;
    virtual void AddCleanupHook(CleanupCallback fun, void* arg);
    virtual void RemoveCleanupHook(CleanupCallback fun, void* arg);

    void CleanupHandles();
    void IncreaseWaitingRequestCounter();
    void DecreaseWaitingRequestCounter();
    virtual void RunCleanup();

    bool IsStopping() const
    {
        return nativeEngineImpl_->IsStopping();
    }

    void SetStopping(bool value)
    {
        nativeEngineImpl_->SetStopping(value);
    }

    virtual void PrintStatisticResult() = 0;
    virtual void StartRuntimeStat() = 0;
    virtual void StopRuntimeStat() = 0;
    virtual size_t GetArrayBufferSize() = 0;
    virtual size_t GetHeapTotalSize() = 0;
    virtual size_t GetHeapUsedSize() = 0;
    virtual void NotifyApplicationState(bool inBackground) = 0;
    virtual void NotifyIdleTime(int idleMicroSec) = 0;
    virtual void NotifyMemoryPressure(bool inHighMemoryPressure = false) = 0;

    void RegisterWorkerFunction(const NativeEngine* engine);

    virtual void RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback) = 0;
    virtual void HandleUncaughtException() = 0;
    virtual bool HasPendingException()
    {
        return false;
    }
    // run script by path
    NativeValue* RunScript(const char* path);

    NativeEngineInterface* GetNativeEngineImpl();

    const char* GetModuleFileName();

    void SetModuleFileName(std::string &moduleName);

    void SetInstanceData(void* data, NativeFinalize finalize_cb, void* hint);
    void GetInstanceData(void** data);

    /**
     * @brief Set the Extension Infos
     *
     * @param extensionInfos extension infos to set
     */
    void SetExtensionInfos(std::unordered_map<std::string, int32_t>&& extensionInfos);

    /**
     * @brief Get the Extension Infos
     *
     * @return extension infos
     */
    const std::unordered_map<std::string, int32_t>& GetExtensionInfos();

    /**
     * @brief Set the Module Blocklist
     *
     * @param blocklist the blocklist set to native engine
     */
    void SetModuleBlocklist(std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist);

protected:
    void *jsEngine_;

    NativeEngineInterface* nativeEngineImpl_ = nullptr;
    bool isAppModule_ = false;

    // register for worker
    InitWorkerFunc initWorkerFunc_ {nullptr};
    GetAssetFunc getAssetFunc_ {nullptr};
    OffWorkerFunc offWorkerFunc_ {nullptr};
#if !defined(PREVIEW)
    DebuggerPostTask debuggerPostTaskFunc_ {nullptr};
#endif

private:
    std::string moduleName_;
    std::mutex instanceDataLock_;
    NativeObjectInfo instanceDataInfo_;
    void FinalizerInstanceData(void);
    std::unordered_map<std::string, int32_t> extensionInfos_;
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_NATIVE_ENGINE_H */
