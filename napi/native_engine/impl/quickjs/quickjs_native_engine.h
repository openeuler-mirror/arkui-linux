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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_QUICKJS_QUICKJS_NATIVE_ENGINE_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_QUICKJS_QUICKJS_NATIVE_ENGINE_H

#include "native_engine/native_engine.h"
#include "quickjs_headers.h"

class QuickJSNativeEngine : public NativeEngine {
public:
    QuickJSNativeEngine(JSRuntime* runtime, JSContext* contex, void* jsEngine);
    QuickJSNativeEngine(NativeEngineInterface* engineImpl, void* jsEngine, bool isAppModule);
    virtual ~QuickJSNativeEngine();

    JSRuntime* GetRuntime();
    JSContext* GetContext();

    void Loop(LoopMode mode, bool needSync = false) override;

    NativeValue* GetGlobal() override;
    NativeValue* CreateNull() override;
    NativeValue* CreateUndefined() override;
    NativeValue* CreateBoolean(bool value) override;
    NativeValue* CreateNumber(int32_t value) override;
    NativeValue* CreateNumber(uint32_t value) override;
    NativeValue* CreateNumber(int64_t value) override;
    NativeValue* CreateNumber(double value) override;
    NativeValue* CreateBigInt(int64_t value) override;
    NativeValue* CreateBigInt(uint64_t value) override;
    NativeValue* CreateString(const char* value, size_t length) override;
    NativeValue* CreateString16(const char16_t* value, size_t length) override;
    NativeValue* CreateSymbol(NativeValue* value) override;
    NativeValue* CreateExternal(void* value, NativeFinalize callback, void* hint,
        size_t nativeBindingSize = 0) override;

    NativeValue* CreateObject() override;
    NativeValue* CreateNativeBindingObject(void* detach, void* attach) override;
    NativeValue* CreateNBObject(DetachCallback detach, AttachCallback attach) override { return nullptr; }
    NativeValue* CreateFunction(const char* name, size_t length, NativeCallback cb, void* value) override;
    NativeValue* CreateArray(size_t length) override;

    NativeValue* CreateArrayBuffer(void** value, size_t length) override;
    NativeValue* CreateArrayBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) override;
    NativeValue* CreateBuffer(void** value, size_t length) override;
    NativeValue* CreateBufferCopy(void** value, size_t length, const void* data) override;
    NativeValue* CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint) override;
    NativeValue* CreateTypedArray(NativeTypedArrayType type,
                                          NativeValue* value,
                                          size_t length,
                                          size_t offset) override;
    NativeValue* CreateDataView(NativeValue* value, size_t length, size_t offset) override;
    NativeValue* CreatePromise(NativeDeferred** deferred) override;
    void SetPromiseRejectCallback(NativeReference* rejectCallbackRef,
                                          NativeReference* checkCallbackRef) override;

    NativeValue* CreateError(NativeValue* code, NativeValue* Message) override;
    NativeValue* CreateInstance(NativeValue* constructor, NativeValue* const* argv, size_t argc) override;

    NativeReference* CreateReference(NativeValue* value, uint32_t initialRefcount,
        NativeFinalize callback = nullptr, void* data = nullptr, void* hint = nullptr) override;
    bool CallInitTaskFunc(NativeEngine* engine, NativeValue* func) override
    {
        return false;
    }
    NativeValue* CallFunction(
        NativeValue* thisVar, NativeValue* function, NativeValue* const* argv, size_t argc) override;

    NativeValue* DefineClass(const char* name, NativeCallback callback, void* data,
        const NativePropertyDescriptor* properties, size_t length) override;

    NativeValue* RunScript(NativeValue* script) override;
    NativeValue* RunScriptPath(const char* path) override
    {
        return nullptr;
    }
    NativeValue* RunScriptBuffer(const char* path, std::vector<uint8_t>& buffer, bool isBundle) override
    {
        return nullptr;
    }
    NativeValue* RunBufferScript(std::vector<uint8_t>& buffer) override;
    NativeValue* RunActor(std::vector<uint8_t>& buffer, const char *descriptor) override;

    void SetPackagePath(const std::vector<std::string>& packagePath);

    bool Throw(NativeValue* error) override;
    bool Throw(NativeErrorType type, const char* code, const char* message) override;

    void* CreateRuntime() override;
    bool CheckTransferList(JSValue transferList);
    bool DetachTransferList(JSValue transferList);
    NativeValue* Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer) override;
    NativeValue* Deserialize(NativeEngine* context, NativeValue* recorder) override;
    void DeleteSerializationData(NativeValue* value) const override;
    ExceptionInfo* GetExceptionForWorker() const override;
    NativeValue* LoadModule(NativeValue* str, const std::string& fileName) override;

    static NativeValue* JSValueToNativeValue(QuickJSNativeEngine* engine, JSValue value);
    NativeValue* ValueToNativeValue(JSValueWrapper& value) override;
    JSValue GetModuleFromName(
        const std::string& moduleName, bool isAppModule, const std::string& id, const std::string& param,
        const std::string& instanceName, void** instance);
    JSValue LoadModuleByName(
        const std::string& moduleName, bool isAppModule, const std::string& param,
        const std::string& instanceName, void* instance);

    NativeValue* CreateDate(double time) override;
    NativeValue* CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words) override;
    bool TriggerFatalException(NativeValue* error) override;
    bool AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue) override;

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
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_QUICKJS_QUICKJS_NATIVE_ENGINE_H */
