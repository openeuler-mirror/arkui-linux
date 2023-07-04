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

#include "quickjs_native_engine.h"

#include <js_native_api.h>

#include "quickjs_native_engine_impl.h"
#include "native_engine/native_engine.h"
#include "native_engine/native_property.h"
#include "native_value/quickjs_native_array.h"
#include "native_value/quickjs_native_array_buffer.h"
#include "native_value/quickjs_native_big_int.h"
#include "native_value/quickjs_native_boolean.h"
#include "native_value/quickjs_native_buffer.h"
#include "native_value/quickjs_native_data_view.h"
#include "native_value/quickjs_native_date.h"
#include "native_value/quickjs_native_external.h"
#include "native_value/quickjs_native_function.h"
#include "native_value/quickjs_native_number.h"
#include "native_value/quickjs_native_object.h"
#include "native_value/quickjs_native_string.h"
#include "native_value/quickjs_native_typed_array.h"
#include "quickjs_native_deferred.h"
#include "quickjs_native_reference.h"
#include "securec.h"
#include "utils/assert.h"
#include "utils/log.h"

QuickJSNativeEngine::QuickJSNativeEngine(JSRuntime* runtime, JSContext* context, void* jsEngine)
    : NativeEngine(jsEngine)
{
    jsEngine_ = jsEngine;
    nativeEngineImpl_ = new QuickJSNativeEngineImpl(runtime, context, this, jsEngine);
    HILOG_INFO("QuickJSNativeEngine::QuickJSNativeEngine");
}

QuickJSNativeEngine::QuickJSNativeEngine(NativeEngineInterface* engineImpl, void* jsEngine, bool isAppModule)
    : NativeEngine(jsEngine)
{
    nativeEngineImpl_ = engineImpl;
    isAppModule_ = isAppModule;
    HILOG_INFO("QuickJSNativeEngine::QuickJSNativeEngine 2");
}

QuickJSNativeEngine::~QuickJSNativeEngine()
{
    HILOG_INFO("QuickJSNativeEngine::~QuickJSNativeEngine");
}

JSValue QuickJSNativeEngine::GetModuleFromName(
    const std::string& moduleName, bool isAppModule, const std::string& id, const std::string& param,
    const std::string& instanceName, void** instance)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->GetModuleFromName(this, moduleName, isAppModule, id, param, instanceName, instance);
}

JSValue QuickJSNativeEngine::LoadModuleByName(
    const std::string& moduleName, bool isAppModule, const std::string& param,
    const std::string& instanceName, void* instance)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->LoadModuleByName(this, moduleName, isAppModule, param, instanceName, instance);
}

JSRuntime* QuickJSNativeEngine::GetRuntime()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->GetRuntime();
}

JSContext* QuickJSNativeEngine::GetContext()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->GetContext();
}

void QuickJSNativeEngine::Loop(LoopMode mode, bool needSync)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->Loop(mode, needSync);
}

NativeValue* QuickJSNativeEngine::GetGlobal()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->GetGlobal(this);
}

NativeValue* QuickJSNativeEngine::CreateNull()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNull(this);
}

NativeValue* QuickJSNativeEngine::CreateUndefined()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateUndefined(this);
}

NativeValue* QuickJSNativeEngine::CreateBoolean(bool value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBoolean(this, value);
}

NativeValue* QuickJSNativeEngine::CreateNumber(int32_t value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* QuickJSNativeEngine::CreateNumber(uint32_t value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* QuickJSNativeEngine::CreateNumber(int64_t value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* QuickJSNativeEngine::CreateNumber(double value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* QuickJSNativeEngine::CreateBigInt(int64_t value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* QuickJSNativeEngine::CreateBigInt(uint64_t value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* QuickJSNativeEngine::CreateString(const char* value, size_t length)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateString(this, value, length);
}

NativeValue* QuickJSNativeEngine::CreateString16(const char16_t* value, size_t length)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateString16(this, value, length);
}

NativeValue* QuickJSNativeEngine::CreateSymbol(NativeValue* value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateSymbol(this, value);
}

NativeValue* QuickJSNativeEngine::CreateFunction(const char* name, size_t length, NativeCallback cb, void* value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateFunction(this, name, length, cb, value);
}

NativeValue* QuickJSNativeEngine::CreateExternal(void* value, NativeFinalize callback, void* hint,
    size_t nativeBindingSize)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateExternal(this, value, callback, hint, nativeBindingSize);
}

NativeValue* QuickJSNativeEngine::CreateObject()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateObject(this);
}

NativeValue* QuickJSNativeEngine::CreateNativeBindingObject(void* detach, void* attach)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateNativeBindingObject(this, detach, attach);
}

NativeValue* QuickJSNativeEngine::CreateArrayBuffer(void** value, size_t length)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateArrayBuffer(this, value, length);
}

NativeValue* QuickJSNativeEngine::CreateArrayBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateArrayBufferExternal(this, value, length, cb, hint);
}

NativeValue* QuickJSNativeEngine::CreateArray(size_t length)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateArray(this, length);
}

NativeValue* QuickJSNativeEngine::CreateDataView(NativeValue* value, size_t length, size_t offset)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateDataView(this, value, length, offset);
}

NativeValue* QuickJSNativeEngine::CreateTypedArray(NativeTypedArrayType type,
                                                   NativeValue* value,
                                                   size_t length,
                                                   size_t offset)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateTypedArray(this, type, value, length, offset);
}

NativeValue* QuickJSNativeEngine::CreatePromise(NativeDeferred** deferred)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreatePromise(this, deferred);
}

NativeValue* QuickJSNativeEngine::CreateError(NativeValue* code, NativeValue* message)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateError(this, code, message);
}

NativeValue* QuickJSNativeEngine::CreateInstance(NativeValue* constructor, NativeValue* const *argv, size_t argc)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateInstance(this, constructor, argv, argc);
}

NativeReference* QuickJSNativeEngine::CreateReference(NativeValue* value, uint32_t initialRefcount,
    NativeFinalize callback, void* data, void* hint)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateReference(this, value, initialRefcount, callback, data, hint);
}

NativeValue* QuickJSNativeEngine::CallFunction(NativeValue* thisVar,
                                               NativeValue* function,
                                               NativeValue* const *argv,
                                               size_t argc)
{
    return nativeEngineImpl_->CallFunction(this, thisVar, function, argv, argc);
}

NativeValue* QuickJSNativeEngine::RunScript(NativeValue* script)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->RunScript(this, script);
}

void QuickJSNativeEngine::SetPackagePath(const std::vector<std::string>& packagePath)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->SetPackagePath(packagePath);
}

NativeValue* QuickJSNativeEngine::RunBufferScript(std::vector<uint8_t>& buffer)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->RunBufferScript(this, buffer);
}

NativeValue* QuickJSNativeEngine::RunActor(std::vector<uint8_t>& buffer, const char *descriptor)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->RunActor(this, buffer, descriptor);
}

NativeValue* QuickJSNativeEngine::LoadModule(NativeValue* str, const std::string& fileName)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->LoadModule(this, str, fileName);
}

NativeValue* QuickJSNativeEngine::DefineClass(
    const char* name, NativeCallback callback, void* data, const NativePropertyDescriptor* properties, size_t length)
{
    auto qjsNativeEngineImpl = reinterpret_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->DefineClass(this, name, callback, data, properties, length);
}

bool QuickJSNativeEngine::Throw(NativeValue* error)
{
    return nativeEngineImpl_->Throw(error);
}

bool QuickJSNativeEngine::Throw(NativeErrorType type, const char* code, const char* message)
{
    return nativeEngineImpl_->Throw(this, type, code, message);
}

NativeValue* QuickJSNativeEngine::JSValueToNativeValue(QuickJSNativeEngine* engine, JSValue value)
{
    NativeValue* result = nullptr;
    int tag = JS_VALUE_GET_NORM_TAG(value);
    switch (tag) {
        case JS_TAG_BIG_INT:
            result = new QuickJSNativeBigInt(engine, value);
            break;
        case JS_TAG_BIG_FLOAT:
            result = new QuickJSNativeObject(engine, value);
            break;
        case JS_TAG_SYMBOL:
            result = new QuickJSNativeValue(engine, value);
            break;
        case JS_TAG_STRING:
            result = new QuickJSNativeString(engine, value);
            break;
        case JS_TAG_OBJECT:
            if (JS_IsArray(engine->GetContext(), value)) {
                result = new QuickJSNativeArray(engine, value);
            } else if (JS_IsError(engine->GetContext(), value)) {
                result = new QuickJSNativeValue(engine, value);
            } else if (JS_IsPromise(engine->GetContext(), value)) {
                result = new QuickJSNativeValue(engine, value);
            } else if (JS_IsArrayBuffer(engine->GetContext(), value)) {
                result = new QuickJSNativeArrayBuffer(engine, value);
            } else if (JS_IsBuffer(engine->GetContext(), value)) {
                result = new QuickJSNativeBuffer(engine, value);
            } else if (JS_IsDataView(engine->GetContext(), value)) {
                result = new QuickJSNativeDataView(engine, value);
            } else if (JS_IsTypedArray(engine->GetContext(), value)) {
                result = new QuickJSNativeTypedArray(engine, value);
            } else if (JS_IsExternal(engine->GetContext(), value)) {
                result = new QuickJSNativeExternal(engine, value);
            } else if (JS_IsFunction(engine->GetContext(), value)) {
                result = new QuickJSNativeFunction(engine, value);
            } else if (JS_IsDate(engine->GetContext(), value)) {
                result = new QuickJSNativeDate(engine, value);
            } else {
                result = new QuickJSNativeObject(engine, value);
            }
            break;
        case JS_TAG_BOOL:
            result = new QuickJSNativeBoolean(engine, value);
            break;
        case JS_TAG_NULL:
        case JS_TAG_UNDEFINED:
        case JS_TAG_UNINITIALIZED:
        case JS_TAG_CATCH_OFFSET:
        case JS_TAG_EXCEPTION:
            result = new QuickJSNativeValue(engine, value);
            break;
        case JS_TAG_INT:
        case JS_TAG_FLOAT64:
            result = new QuickJSNativeNumber(engine, value);
            break;
        default:
            HILOG_DEBUG("JS_VALUE_GET_NORM_TAG %{public}d", tag);
    }
    return result;
}

void* QuickJSNativeEngine::CreateRuntime()
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateRuntime(this);
}

bool QuickJSNativeEngine::CheckTransferList(JSValue transferList)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CheckTransferList(transferList);
}

bool QuickJSNativeEngine::DetachTransferList(JSValue transferList)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->DetachTransferList(transferList);
}

NativeValue* QuickJSNativeEngine::Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->Serialize(context, value, transfer);
}

NativeValue* QuickJSNativeEngine::Deserialize(NativeEngine* context, NativeValue* recorder)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->Deserialize(this, context, recorder);
}

void QuickJSNativeEngine::DeleteSerializationData(NativeValue* value) const
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->DeleteSerializationData(value);
}

ExceptionInfo* QuickJSNativeEngine::GetExceptionForWorker() const
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->GetExceptionForWorker();
}

NativeValue* QuickJSNativeEngine::ValueToNativeValue(JSValueWrapper& value)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->ValueToNativeValue(this, value);
}

NativeValue* QuickJSNativeEngine::CreateBuffer(void** value, size_t length)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBuffer(this, value, length);
}

NativeValue* QuickJSNativeEngine::CreateBufferCopy(void** value, size_t length, const void* data)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBufferCopy(this, value, length, data);
}

NativeValue* QuickJSNativeEngine::CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBufferExternal(this, value, length, cb, hint);
}

NativeValue* QuickJSNativeEngine::CreateDate(double time)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateDate(this, time);
}

NativeValue* QuickJSNativeEngine::CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->CreateBigWords(this, sign_bit, word_count, words);
}

bool QuickJSNativeEngine::TriggerFatalException(NativeValue* error)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->TriggerFatalException(error);
}

bool QuickJSNativeEngine::AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->AdjustExternalMemory(ChangeInBytes, AdjustedValue);
}

void QuickJSNativeEngine::SetPromiseRejectCallback(NativeReference* rejectCallbackRef,
                                                   NativeReference* checkCallbackRef)
{
    auto qjsNativeEngineImpl = static_cast<QuickJSNativeEngineImpl*>(nativeEngineImpl_);
    return qjsNativeEngineImpl->SetPromiseRejectCallback(this, rejectCallbackRef, checkCallbackRef);
}

void QuickJSNativeEngine::StartCpuProfiler(const std::string& fileName)
{
    nativeEngineImpl_->StartCpuProfiler();
}
void QuickJSNativeEngine::StopCpuProfiler()
{
    nativeEngineImpl_->StopCpuProfiler();
}

void QuickJSNativeEngine::ResumeVM()
{
    nativeEngineImpl_->ResumeVM();
}
bool QuickJSNativeEngine::SuspendVM()
{
    return nativeEngineImpl_->SuspendVM();
}
bool QuickJSNativeEngine::IsSuspended()
{
    return nativeEngineImpl_->IsSuspended();
}
bool QuickJSNativeEngine::CheckSafepoint()
{
    return nativeEngineImpl_->CheckSafepoint();
}

void QuickJSNativeEngine::DumpHeapSnapshot(const std::string& path, bool isVmMode, DumpFormat dumpFormat)
{
    nativeEngineImpl_->DumpHeapSnapshot(path, isVmMode, dumpFormat);
}

void QuickJSNativeEngine::DumpHeapSnapshot(bool isVmMode, DumpFormat dumpFormat, bool isPrivate)
{
    nativeEngineImpl_->DumpHeapSnapshotExt(isVmMode, dumpFormat, isPrivate);
}

bool QuickJSNativeEngine::BuildNativeAndJsStackTrace(std::string& stackTraceStr)
{
    return nativeEngineImpl_->BuildNativeAndJsStackTrace(stackTraceStr);
}
bool QuickJSNativeEngine::BuildJsStackTrace(std::string& stackTraceStr)
{
    return nativeEngineImpl_->BuildJsStackTrace(stackTraceStr);
}
bool QuickJSNativeEngine::BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames)
{
    return nativeEngineImpl_->BuildJsStackInfoList(tid, jsFrames);
}
bool QuickJSNativeEngine::DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine)
{
    return nativeEngineImpl_->DeleteWorker(hostEngine, workerEngine);
}
bool QuickJSNativeEngine::StartHeapTracking(double timeInterval, bool isVmMode)
{
    return nativeEngineImpl_->StartHeapTracking(timeInterval, isVmMode);
}
bool QuickJSNativeEngine::StopHeapTracking(const std::string& filePath)
{
    return nativeEngineImpl_->StopHeapTracking(filePath);
}

void QuickJSNativeEngine::PrintStatisticResult()
{
    nativeEngineImpl_->PrintStatisticResult();
}
void QuickJSNativeEngine::StartRuntimeStat()
{
    nativeEngineImpl_->StartRuntimeStat();
}
void QuickJSNativeEngine::StopRuntimeStat()
{
    nativeEngineImpl_->StopRuntimeStat();
}
size_t QuickJSNativeEngine::GetArrayBufferSize()
{
    return nativeEngineImpl_->GetArrayBufferSize();
}
size_t QuickJSNativeEngine::GetHeapTotalSize()
{
    return nativeEngineImpl_->GetHeapTotalSize();
}
size_t QuickJSNativeEngine::GetHeapUsedSize()
{
    return nativeEngineImpl_->GetHeapUsedSize();
}

void QuickJSNativeEngine::RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback)
{
    nativeEngineImpl_->RegisterUncaughtExceptionHandler(callback);
}
void QuickJSNativeEngine::HandleUncaughtException()
{
    nativeEngineImpl_->HandleUncaughtException(this);
}
