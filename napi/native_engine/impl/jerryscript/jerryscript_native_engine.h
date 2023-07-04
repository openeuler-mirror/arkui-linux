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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_H

#include "jerryscript_headers.h"
#include "native_engine/native_engine.h"

class JerryScriptNativeEngine : public NativeEngine {
public:
    JerryScriptNativeEngine(void* jsEngine);
    JerryScriptNativeEngine(NativeEngineInterface* engineImpl, void* jsEngine, bool isAppModule);
    virtual ~JerryScriptNativeEngine();

    virtual void Loop(LoopMode mode, bool needSync = false) override;

    virtual NativeValue* GetGlobal() override;
    virtual NativeValue* CreateNull() override;
    virtual NativeValue* CreateUndefined() override;
    virtual NativeValue* CreateBoolean(bool value) override;
    virtual NativeValue* CreateNumber(int32_t value) override;
    virtual NativeValue* CreateNumber(uint32_t value) override;
    virtual NativeValue* CreateNumber(int64_t value) override;
    virtual NativeValue* CreateNumber(double value) override;
    virtual NativeValue* CreateBigInt(int64_t value) override;
    virtual NativeValue* CreateBigInt(uint64_t value) override;
    virtual NativeValue* CreateString(const char* value, size_t length) override;
    virtual NativeValue* CreateString16(const char16_t* value, size_t length) override;

    virtual NativeValue* CreateSymbol(NativeValue* value) override;
    virtual NativeValue* CreateExternal(void* value, NativeFinalize callback, void* hint,
        size_t nativeBindingSize = 0) override;

    virtual NativeValue* CreateObject() override;
    virtual NativeValue* CreateNativeBindingObject(void* detach, void* attach) override;
    virtual NativeValue* CreateNBObject(DetachCallback detach, AttachCallback attach) override { return nullptr; };
    virtual NativeValue* CreateFunction(const char* name, size_t length, NativeCallback cb, void* value) override;
    virtual NativeValue* CreateArray(size_t length) override;
    virtual NativeValue* CreateBuffer(void** value, size_t length) override;
    virtual NativeValue* CreateBufferCopy(void** value, size_t length, const void* data) override;
    virtual NativeValue* CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) override;
    virtual NativeValue* CreateArrayBuffer(void** value, size_t length) override;
    virtual NativeValue* CreateArrayBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) override;

    virtual NativeValue* CreateTypedArray(NativeTypedArrayType type,
                                          NativeValue* value,
                                          size_t length,
                                          size_t offset) override;
    virtual NativeValue* CreateDataView(NativeValue* value, size_t length, size_t offset) override;
    virtual NativeValue* CreatePromise(NativeDeferred** deferred) override;
    virtual void SetPromiseRejectCallback(NativeReference* rejectCallbackRef,
                                          NativeReference* checkCallbackRef) override;
    virtual NativeValue* CreateError(NativeValue* code, NativeValue* Message) override;

    virtual bool InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback) override;
    virtual bool InitTaskPoolFunc(NativeEngine* engine, NativeValue* func) override;

    virtual NativeValue* CallFunction(NativeValue* thisVar,
                                      NativeValue* function,
                                      NativeValue* const* argv,
                                      size_t argc) override;
    virtual NativeValue* RunScript(NativeValue* script) override;
    virtual NativeValue* RunScriptPath(const char* path) override
    {
        return nullptr;
    }
    virtual NativeValue* RunScriptBuffer(const char* path, std::vector<uint8_t>& buffer, bool isBundle) override
    {
        return nullptr;
    }
    virtual NativeValue* RunBufferScript(std::vector<uint8_t>& buffer) override;
    virtual NativeValue* RunActor(std::vector<uint8_t>& buffer, const char *descriptor) override;
    virtual NativeValue* DefineClass(const char* name,
                                     NativeCallback callback,
                                     void* data,
                                     const NativePropertyDescriptor* properties,
                                     size_t length) override;

    virtual NativeValue* CreateInstance(NativeValue* constructor,
                                        NativeValue* const* argv,
                                        size_t argc) override;

    virtual NativeReference* CreateReference(NativeValue* value, uint32_t initialRefcount,
        NativeFinalize callback = nullptr, void* data = nullptr, void* hint = nullptr) override;

    virtual bool Throw(NativeValue* error) override;
    virtual bool Throw(NativeErrorType type, const char* code, const char* message) override;

    virtual void* CreateRuntime() override;
    virtual NativeValue* Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer) override;
    virtual NativeValue* Deserialize(NativeEngine* context, NativeValue* recorder) override;
    virtual void DeleteSerializationData(NativeValue* value) const override;

    virtual NativeValue* LoadModule(NativeValue* str, const std::string& fileName) override;

    static NativeValue* JerryValueToNativeValue(JerryScriptNativeEngine* engine, jerry_value_t value);
    virtual NativeValue* ValueToNativeValue(JSValueWrapper& value) override;
    virtual bool TriggerFatalException(NativeValue* error) override;
    virtual bool AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue) override;
    virtual NativeValue* CreateDate(double time) override;
    virtual NativeValue* CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words) override;

    void StartCpuProfiler(const std::string& fileName = "") override;
    void StopCpuProfiler() override;

    void ResumeVM() override;
    bool SuspendVM() override;
    bool IsSuspended() override;
    bool CheckSafepoint() override;

    void DumpHeapSnapshot(const std::string& path, bool isVmMode = true,
        DumpFormat dumpFormat = DumpFormat::JSON) override;
    void DumpHeapSnapshot(bool isVmMode = true, DumpFormat dumpFormat = DumpFormat::JSON,
        bool isPrivate = false) override;
    bool BuildNativeAndJsStackTrace(std::string& stackTraceStr) override;
    bool BuildJsStackTrace(std::string& stackTraceStr) override;
    bool BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames) override;
    bool DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine) override;
    bool StartHeapTracking(double timeInterval, bool isVmMode = true) override;
    bool StopHeapTracking(const std::string& filePath) override;

    void PrintStatisticResult() override;
    void StartRuntimeStat() override;
    void StopRuntimeStat() override;
    size_t GetArrayBufferSize() override;
    size_t GetHeapTotalSize() override;
    size_t GetHeapUsedSize() override;
    void NotifyApplicationState(bool inBackground) override {}
    void NotifyIdleTime(int idleMicroSec) override {}
    void NotifyMemoryPressure(bool inHighMemoryPressure = false) override {}

    void RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback) override;
    void HandleUncaughtException() override;
    bool HasPendingException() override;
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_H_ */
