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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_IMPL_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_IMPL_H

#include "jerryscript_headers.h"
#include "jerryscript_native_engine.h"
#include "native_engine/native_engine_interface.h"


class JerryScriptNativeEngineImpl : public NativeEngineInterface {
public:
    explicit JerryScriptNativeEngineImpl(NativeEngine* engine, void* jsEngineInterface);
    virtual ~JerryScriptNativeEngineImpl();

    virtual void Loop(LoopMode mode, bool needSync = false) override;

    virtual NativeValue* GetGlobal(NativeEngine* engine) override;
    virtual NativeValue* CreateNull(NativeEngine* engine) override;
    virtual NativeValue* CreateUndefined(NativeEngine* engine) override;
    virtual NativeValue* CreateBoolean(NativeEngine* engine, bool value) override;
    virtual NativeValue* CreateNumber(NativeEngine* engine, int32_t value) override;
    virtual NativeValue* CreateNumber(NativeEngine* engine, uint32_t value) override;
    virtual NativeValue* CreateNumber(NativeEngine* engine, int64_t value) override;
    virtual NativeValue* CreateNumber(NativeEngine* engine, double value) override;
    virtual NativeValue* CreateBigInt(NativeEngine* engine, int64_t value) override;
    virtual NativeValue* CreateBigInt(NativeEngine* engine, uint64_t value) override;
    virtual NativeValue* CreateString(NativeEngine* engine, const char* value, size_t length) override;
    virtual NativeValue* CreateString16(NativeEngine* engine, const char16_t* value, size_t length) override;

    virtual NativeValue* CreateSymbol(NativeEngine* engine, NativeValue* value) override;
    virtual NativeValue* CreateExternal(NativeEngine* engine, void* value,
        NativeFinalize callback, void* hint, size_t nativeBindingSize = 0) override;

    virtual NativeValue* CreateObject(NativeEngine* engine) override;
    virtual NativeValue* CreateNativeBindingObject(NativeEngine* engine, void* detach, void* attach) override;
    virtual NativeValue* CreateNBObject(NativeEngine* engine, DetachCallback detach, AttachCallback attach) override { return nullptr; };
    virtual NativeValue* CreateFunction(
        NativeEngine* engine, const char* name, size_t length, NativeCallback cb, void* value) override;
    virtual NativeValue* CreateArray(NativeEngine* engine, size_t length) override;
    virtual NativeValue* CreateBuffer(NativeEngine* engine, void** value, size_t length) override;
    virtual NativeValue* CreateBufferCopy(
        NativeEngine* engine, void** value, size_t length, const void* data) override;
    virtual NativeValue* CreateBufferExternal(
        NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint) override;
    virtual NativeValue* CreateArrayBuffer(
        NativeEngine* engine, void** value, size_t length) override;
    virtual NativeValue* CreateArrayBufferExternal(
        NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint) override;
    virtual NativeValue* CreateTypedArray(NativeEngine* engine,
                                          NativeTypedArrayType type,
                                          NativeValue* value,
                                          size_t length,
                                          size_t offset) override;
    virtual NativeValue* CreateDataView(
        NativeEngine* engine, NativeValue* value, size_t length, size_t offset) override;
    virtual NativeValue* CreatePromise(NativeEngine* engine, NativeDeferred** deferred) override;
    virtual void SetPromiseRejectCallback(NativeEngine* engine, NativeReference* rejectCallbackRef,
                                          NativeReference* checkCallbackRef) override;
    virtual NativeValue* CreateError(NativeEngine* engine, NativeValue* code, NativeValue* Message) override;

    virtual bool InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback) override;
    virtual bool InitTaskPoolFunc(NativeEngine* engine, NativeValue* func) override;

    virtual NativeValue* CallFunction(NativeEngine* engine,
                                      NativeValue* thisVar,
                                      NativeValue* function,
                                      NativeValue* const *argv,
                                      size_t argc) override;
    virtual NativeValue* RunScript(NativeEngine* engine, NativeValue* script) override;
    virtual NativeValue* RunScriptPath(NativeEngine* engine, const char* path) override
    {
        return nullptr;
    }
    virtual NativeValue* RunScriptBuffer(
        NativeEngine* engine, const char* path, std::vector<uint8_t>& buffer, bool isBundle) override
    {
        return nullptr;
    }
    RunScriptBuffer(const char* path, std::vector<uint8_t>& buffer, bool isBundle) override;
    virtual NativeValue* RunBufferScript(NativeEngine* engine, std::vector<uint8_t>& buffer) override;
    virtual NativeValue* RunActor(
        NativeEngine* engine, std::vector<uint8_t>& buffer, const char *descriptor) override;
    virtual NativeValue* DefineClass(NativeEngine* engine,
                                     const char* name,
                                     NativeCallback callback,
                                     void* data,
                                     const NativePropertyDescriptor* properties,
                                     size_t length) override;

    virtual NativeValue* CreateInstance(NativeEngine* engine,
                                        NativeValue* constructor,
                                        NativeValue* const *argv,
                                        size_t argc) override;

    virtual NativeReference* CreateReference(NativeEngine* engine, NativeValue* value, uint32_t initialRefcount,
        NativeFinalize callback = nullptr, void* data = nullptr, void* hint = nullptr) override;

    virtual bool Throw(NativeValue* error) override;
    virtual bool Throw(NativeEngine* engine, NativeErrorType type, const char* code, const char* message) override;

    virtual void* CreateRuntime(NativeEngine* engine) override;
    virtual NativeValue* Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer) override;
    virtual NativeValue* Deserialize(NativeEngine* engine, NativeEngine* context, NativeValue* recorder) override;
    virtual void DeleteSerializationData(NativeValue* value) const override {}

    virtual NativeValue* LoadModule(NativeEngine* engine, NativeValue* str, const std::string& fileName) override;

    static NativeValue* JerryValueToNativeValue(JerryScriptNativeEngine* engine, jerry_value_t value);
    virtual NativeValue* ValueToNativeValue(NativeEngine* engine, JSValueWrapper& value) override;
    virtual bool TriggerFatalException(NativeValue* error) override;
    virtual bool AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue) override;
    virtual NativeValue* CreateDate(NativeEngine* engine, double time) override;
    virtual NativeValue* CreateBigWords(
        NativeEngine* engine, int sign_bit, size_t word_count, const uint64_t* words) override;

    void StartCpuProfiler(const std::string& fileName = "") override {}
    void StopCpuProfiler() override {}

    void ResumeVM() override {}
    bool SuspendVM() override
    {
        return false;
    }
    bool IsSuspended() override
    {
        return false;
    }
    bool CheckSafepoint() override
    {
        return false;
    }

    void DumpHeapSnapshot(const std::string& path, bool isVmMode = true,
        DumpFormat dumpFormat = DumpFormat::JSON) override {}
    void DumpHeapSnapshotExt(bool isVmMode = true, DumpFormat dumpFormat = DumpFormat::JSON,
        bool isPrivate = false) override {}
    bool BuildNativeAndJsStackTrace(std::string& stackTraceStr) override
    {
        return false;
    }
    bool BuildJsStackTrace(std::string& stackTraceStr) override
    {
        return false;
    }
    bool BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames) override
    {
        return false;
    }
    bool DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine) override
    {
        return false;
    }
    bool StartHeapTracking(double timeInterval, bool isVmMode = true) override
    {
        return false;
    }
    bool StopHeapTracking(const std::string& filePath) override
    {
        return false;
    }

    void PrintStatisticResult() override {}
    void StartRuntimeStat() override {}
    void StopRuntimeStat() override {}
    size_t GetArrayBufferSize() override
    {
        return 0;
    }
    size_t GetHeapTotalSize() override
    {
        return 0;
    }
    size_t GetHeapUsedSize() override
    {
        return 0;
    }

    void RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback) override {}
    void HandleUncaughtException(NativeEngine* engine) override {}
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_JERRYSCRIPT_JERRYSCRIPT_NATIVE_ENGINE_IMPL_H_ */
