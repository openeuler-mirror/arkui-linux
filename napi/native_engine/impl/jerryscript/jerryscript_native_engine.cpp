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

#include "jerryscript_native_engine.h"

#include "jerryscript-ext/handler.h"
#include "jerryscript_native_deferred.h"
#include "jerryscript_native_reference.h"
#include "jerryscript_native_engine_impl.h"

#include "native_value/jerryscript_native_array.h"
#include "native_value/jerryscript_native_array_buffer.h"
#include "native_value/jerryscript_native_big_int.h"
#include "native_value/jerryscript_native_boolean.h"
#include "native_value/jerryscript_native_buffer.h"
#include "native_value/jerryscript_native_data_view.h"
#include "native_value/jerryscript_native_date.h"
#include "native_value/jerryscript_native_external.h"
#include "native_value/jerryscript_native_function.h"
#include "native_value/jerryscript_native_number.h"
#include "native_value/jerryscript_native_object.h"
#include "native_value/jerryscript_native_string.h"
#include "native_value/jerryscript_native_typed_array.h"
#include "utils/log.h"

JerryScriptNativeEngine::JerryScriptNativeEngine(void* jsEngine) : NativeEngine(jsEngine)
{
    nativeEngineImpl_ = new JerryScriptNativeEngineImpl(this, jsEngine);
}

JerryScriptNativeEngine::JerryScriptNativeEngine(NativeEngineInterface* engineImpl,
    void* jsEngine, bool isAppModule) : NativeEngine(jsEngine)
{
    nativeEngineImpl_ = engineImpl;
    isAppModule_ = isAppModule;
}

JerryScriptNativeEngine::~JerryScriptNativeEngine()
{
    HILOG_INFO("JerryScriptNativeEngine::~JerryScriptNativeEngine");
}

void JerryScriptNativeEngine::Loop(LoopMode mode, bool needSync)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->Loop(mode, needSync);
}

NativeValue* JerryScriptNativeEngine::GetGlobal()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->GetGlobal(this);
}

NativeValue* JerryScriptNativeEngine::CreateNull()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNull(this);
}

NativeValue* JerryScriptNativeEngine::CreateUndefined()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateUndefined(this);
}

NativeValue* JerryScriptNativeEngine::CreateBoolean(bool value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBoolean(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateNumber(int32_t value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateNumber(uint32_t value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateNumber(int64_t value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateNumber(double value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateString(const char* value, size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateString(this, value, length);
}

NativeValue* JerryScriptNativeEngine::CreateSymbol(NativeValue* value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateSymbol(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateExternal(void* value, NativeFinalize callback, void* hint,
    size_t nativeBindingSize)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateExternal(this, value, callback, hint, nativeBindingSize);
}

NativeValue* JerryScriptNativeEngine::CreateObject()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateObject(this);
}

NativeValue* JerryScriptNativeEngine::CreateNativeBindingObject(void* detach, void* attach)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateNativeBindingObject(this, detach, attach);
}

NativeValue* JerryScriptNativeEngine::CreateFunction(const char* name, size_t length, NativeCallback cb, void* value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateFunction(this, name, length, cb, value);
}

NativeValue* JerryScriptNativeEngine::CreateArray(size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateArray(this, length);
}

NativeValue* JerryScriptNativeEngine::CreateArrayBuffer(void** value, size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateArrayBuffer(this, value, length);
}

NativeValue* JerryScriptNativeEngine::CreateArrayBufferExternal(
    void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateArrayBufferExternal(this, value, length, cb, hint);
}

NativeValue* JerryScriptNativeEngine::CreateBuffer(void** value, size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBuffer(this, value, length);
}

NativeValue* JerryScriptNativeEngine::CreateBufferCopy(void** value, size_t length, const void* data)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBufferCopy(this, value, length, data);
}

NativeValue* JerryScriptNativeEngine::CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBufferExternal(this, value, length, cb, hint);
}

NativeValue* JerryScriptNativeEngine::CreateTypedArray(
    NativeTypedArrayType type, NativeValue* value, size_t length, size_t offset)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateTypedArray(this, type, value, length, offset);
}

NativeValue* JerryScriptNativeEngine::CreateDataView(NativeValue* value, size_t length, size_t offset)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateDataView(this, value, length, offset);
}

NativeValue* JerryScriptNativeEngine::CreatePromise(NativeDeferred** deferred)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreatePromise(this, deferred);
}

NativeValue* JerryScriptNativeEngine::CreateError(NativeValue* code, NativeValue* message)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateError(this, code, message);
}

NativeValue* JerryScriptNativeEngine::CallFunction(
    NativeValue* thisVar, NativeValue* function, NativeValue* const *argv, size_t argc)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CallFunction(this, thisVar, function, argv, argc);
}

NativeValue* JerryScriptNativeEngine::RunScript(NativeValue* script)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->RunScript(this, script);
}

NativeValue* JerryScriptNativeEngine::RunBufferScript(std::vector<uint8_t>& buffer)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->RunBufferScript(this, buffer);
}

NativeValue* JerryScriptNativeEngine::RunActor(std::vector<uint8_t>& buffer, const char* descriptor)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->RunActor(this, buffer, descriptor);
}

NativeValue* JerryScriptNativeEngine::DefineClass(
    const char* name, NativeCallback callback, void* data, const NativePropertyDescriptor* properties, size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->DefineClass(this, name, callback, data, properties, length);
}

NativeValue* JerryScriptNativeEngine::CreateInstance(NativeValue* constructor, NativeValue* const *argv, size_t argc)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateInstance(this, constructor, argv, argc);
}

NativeReference* JerryScriptNativeEngine::CreateReference(NativeValue* value, uint32_t initialRefcount,
    NativeFinalize callback, void* data, void* hint)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateReference(this, value, initialRefcount, callback, data, hint);
}

bool JerryScriptNativeEngine::Throw(NativeValue* error)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->Throw(error);
}

bool JerryScriptNativeEngine::Throw(NativeErrorType type, const char* code, const char* message)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->Throw(this, type, code, message);
}

void* JerryScriptNativeEngine::CreateRuntime()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateRuntime(this);
}

NativeValue* JerryScriptNativeEngine::Serialize(NativeEngine* context, NativeValue* value,
    NativeValue* transfer)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->Serialize(context, value, transfer);
}

NativeValue* JerryScriptNativeEngine::Deserialize(NativeEngine* context, NativeValue* recorder)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->Deserialize(this, context, recorder);
}

NativeValue* JerryScriptNativeEngine::LoadModule(NativeValue* str, const std::string& fileName)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->LoadModule(this, str, fileName);
}

NativeValue* JerryScriptNativeEngine::JerryValueToNativeValue(JerryScriptNativeEngine* engine, jerry_value_t value)
{
    NativeValue* result = nullptr;
    switch (jerry_value_get_type(value)) {
        case JERRY_TYPE_NONE:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_UNDEFINED:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_NULL:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_BOOLEAN:
            result = new JerryScriptNativeBoolean(engine, value);
            break;
        case JERRY_TYPE_NUMBER:
            result = new JerryScriptNativeNumber(engine, value);
            break;
        case JERRY_TYPE_STRING:
            result = new JerryScriptNativeString(engine, value);
            break;
        case JERRY_TYPE_OBJECT:
            if (jerry_value_is_array(value)) {
                result = new JerryScriptNativeArray(engine, value);
            } else if (jerry_value_is_arraybuffer(value)) {
                result = new JerryScriptNativeArrayBuffer(engine, value);
            } else if (jerry_value_is_dataview(value)) {
                result = new JerryScriptNativeDataView(engine, value);
            } else if (jerry_value_is_typedarray(value)) {
                result = new JerryScriptNativeTypedArray(engine, value);
            } else if (jerry_value_is_external(value)) {
                result = new JerryScriptNativeExternal(engine, value);
            } else if (jerry_is_date(value)) {
                result = new JerryScriptNativeDate(engine, value);
            } else {
                result = new JerryScriptNativeObject(engine, value);
            }
            break;
        case JERRY_TYPE_FUNCTION:
            result = new JerryScriptNativeFunction(engine, value);
            break;
        case JERRY_TYPE_ERROR:
            result = new JerryScriptNativeObject(engine, value);
            break;
        case JERRY_TYPE_SYMBOL:
            result = new JerryScriptNativeValue(engine, value);
            break;
#if JERRY_API_MINOR_VERSION > 3
        case JERRY_TYPE_BIGINT:
                result = new JerryScriptNativeBigInt(engine, value);
                break;
#endif
        default:;
    }
    return result;
}

NativeValue* JerryScriptNativeEngine::ValueToNativeValue(JSValueWrapper& value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->ValueToNativeValue(this, value);
}

bool JerryScriptNativeEngine::TriggerFatalException(NativeValue* error)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->TriggerFatalException(error);
}

bool JerryScriptNativeEngine::AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->AdjustExternalMemory(ChangeInBytes, AdjustedValue);
}

NativeValue* JerryScriptNativeEngine::CreateDate(double time)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateDate(this, time);
}

void JerryScriptNativeEngine::SetPromiseRejectCallback(NativeReference* rejectCallbackRef,
                                                       NativeReference* checkCallbackRef)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->SetPromiseRejectCallback(this, rejectCallbackRef, checkCallbackRef);
}

NativeValue* JerryScriptNativeEngine::CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBigWords(this, sign_bit, word_count, words);
}

NativeValue* JerryScriptNativeEngine::CreateBigInt(int64_t value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateBigInt(uint64_t value)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* JerryScriptNativeEngine::CreateString16(const char16_t* value, size_t length)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CreateString16(this, value, length);
}

void JerryScriptNativeEngine::StartCpuProfiler(const std::string& fileName)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->StartCpuProfiler(fileName);
}
void JerryScriptNativeEngine::StopCpuProfiler()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->StopCpuProfiler();
}

void JerryScriptNativeEngine::ResumeVM()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->ResumeVM();
}
bool JerryScriptNativeEngine::SuspendVM()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->SuspendVM();
}
bool JerryScriptNativeEngine::IsSuspended()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->IsSuspended();
}
bool JerryScriptNativeEngine::CheckSafepoint()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->CheckSafepoint();
}

void JerryScriptNativeEngine::DumpHeapSnapshot(
    const std::string& path, bool isVmMode, DumpFormat dumpFormat)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->DumpHeapSnapshot(path, isVmMode, dumpFormat);
}

void JerryScriptNativeEngine::DumpHeapSnapshot(bool isVmMode, DumpFormat dumpFormat, bool isPrivate)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->DumpHeapSnapshotExt(isVmMode, dumpFormat, isPrivate);
}

bool JerryScriptNativeEngine::BuildNativeAndJsStackTrace(std::string& stackTraceStr)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->BuildNativeAndJsStackTrace(stackTraceStr);
}
bool JerryScriptNativeEngine::BuildJsStackTrace(std::string& stackTraceStr)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->BuildJsStackTrace(stackTraceStr);
}
bool JerryScriptNativeEngine::BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->BuildJsStackInfoList(tid, jsFrames);
}
bool JerryScriptNativeEngine::DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->DeleteWorker(hostEngine, workerEngine);
}
bool JerryScriptNativeEngine::StartHeapTracking(double timeInterval, bool isVmMode)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->StartHeapTracking(timeInterval, isVmMode);
}
bool JerryScriptNativeEngine::StopHeapTracking(const std::string& filePath)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->StopHeapTracking(filePath);
}

void JerryScriptNativeEngine::PrintStatisticResult()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->PrintStatisticResult();
}
void JerryScriptNativeEngine::StartRuntimeStat()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->StartRuntimeStat();
}
void JerryScriptNativeEngine::StopRuntimeStat()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->StopRuntimeStat();
}
size_t JerryScriptNativeEngine::GetArrayBufferSize()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->GetArrayBufferSize();
}
size_t JerryScriptNativeEngine::GetHeapTotalSize()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->GetHeapTotalSize();
}
size_t JerryScriptNativeEngine::GetHeapUsedSize()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    return jerryscriptNativeEngineImpl->GetHeapUsedSize();
}

void JerryScriptNativeEngine::RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback)
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->RegisterUncaughtExceptionHandler(callback);
}
void JerryScriptNativeEngine::HandleUncaughtException()
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->HandleUncaughtException(this);
}
bool JerryScriptNativeEngine::HasPendingException()
{
    return false;
}
void JerryScriptNativeEngine::DeleteSerializationData(NativeValue* value) const
{
    auto jerryscriptNativeEngineImpl = static_cast<JerryScriptNativeEngineImpl*>(nativeEngineImpl_);
    jerryscriptNativeEngineImpl->DeleteSerializationData(value);
}
