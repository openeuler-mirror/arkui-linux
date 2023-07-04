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

#include "ark_native_engine.h"

#include "ark_native_deferred.h"
#include "ark_native_engine_impl.h"
#include "ark_native_reference.h"

#ifdef ENABLE_CONTAINER_SCOPE
#include "core/common/container_scope.h"
#endif

#include "native_engine/native_property.h"

#include "native_value/ark_native_array.h"
#include "native_value/ark_native_array_buffer.h"
#include "native_value/ark_native_big_int.h"
#include "native_value/ark_native_boolean.h"
#include "native_value/ark_native_data_view.h"
#include "native_value/ark_native_external.h"
#include "native_value/ark_native_function.h"
#include "native_value/ark_native_number.h"
#include "native_value/ark_native_object.h"
#include "native_value/ark_native_string.h"
#include "native_value/ark_native_typed_array.h"
#include "native_value/ark_native_date.h"

#ifndef PREVIEW
#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
#include "parameters.h"
#endif
#endif
#include "securec.h"
#include "utils/log.h"

ArkNativeEngine::ArkNativeEngine(EcmaVM* vm, void* jsEngine) : NativeEngine(jsEngine)
{
    HILOG_DEBUG("ArkNativeEngine::ArkNativeEngine");
    nativeEngineImpl_ = new ArkNativeEngineImpl(vm, this, jsEngine);
}

ArkNativeEngine::ArkNativeEngine(NativeEngineInterface* engineImpl, void* jsEngine, bool isAppModule)
    : NativeEngine(jsEngine)
{
    nativeEngineImpl_ = engineImpl;
    isAppModule_ = isAppModule;
    HILOG_DEBUG("ArkNativeEngine::ArkNativeEngine");
}

ArkNativeEngine::~ArkNativeEngine()
{
    HILOG_INFO("ArkNativeEngine::~ArkNativeEngine");
}

const EcmaVM* ArkNativeEngine::GetEcmaVm() const
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetEcmaVm();
}

panda::Local<panda::ObjectRef> ArkNativeEngine::GetModuleFromName(
    const std::string& moduleName, bool isAppModule, const std::string& id, const std::string& param,
    const std::string& instanceName, void** instance)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetModuleFromName(this, moduleName, isAppModule, id, param, instanceName, instance);
}

panda::Local<panda::ObjectRef> ArkNativeEngine::LoadModuleByName(const std::string& moduleName, bool isAppModule,
    const std::string& param, const std::string& instanceName, void* instance, const std::string& path)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->LoadModuleByName(this, moduleName, isAppModule, param, instanceName, instance, path);
}

void ArkNativeEngine::Loop(LoopMode mode, bool needSync)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->Loop(mode, needSync);
}

NativeValue* ArkNativeEngine::GetGlobal()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetGlobal(this);
}

NativeValue* ArkNativeEngine::CreateNull()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNull(this);
}

NativeValue* ArkNativeEngine::CreateUndefined()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateUndefined(this);
}

NativeValue* ArkNativeEngine::CreateBoolean(bool value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBoolean(this, value);
}

NativeValue* ArkNativeEngine::CreateNumber(int32_t value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* ArkNativeEngine::CreateNumber(uint32_t value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* ArkNativeEngine::CreateNumber(int64_t value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* ArkNativeEngine::CreateNumber(double value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNumber(this, value);
}

NativeValue* ArkNativeEngine::CreateBigInt(int64_t value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* ArkNativeEngine::CreateBigInt(uint64_t value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBigInt(this, value);
}

NativeValue* ArkNativeEngine::CreateString(const char* value, size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateString(this, value, length);
}

NativeValue* ArkNativeEngine::CreateString16(const char16_t* value, size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateString16(this, value, length);
}

NativeValue* ArkNativeEngine::CreateSymbol(NativeValue* value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateSymbol(this, value);
}

NativeValue* ArkNativeEngine::CreateExternal(void* value, NativeFinalize callback, void* hint,
    size_t nativeBindingSize)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateExternal(this, value, callback, hint, nativeBindingSize);
}

NativeValue* ArkNativeEngine::CreateObject()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateObject(this);
}

NativeValue* ArkNativeEngine::CreateNativeBindingObject(void* detach, void* attach)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNativeBindingObject(this, detach, attach);
}

NativeValue* ArkNativeEngine::CreateNBObject(DetachCallback detach, AttachCallback attach)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateNBObject(this, detach, attach);
}

NativeValue* ArkNativeEngine::CreateFunction(const char* name, size_t length, NativeCallback cb, void* value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateFunction(this, name, length, cb, value);
}

NativeValue* ArkNativeEngine::CreateArray(size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateArray(this, length);
}

NativeValue* ArkNativeEngine::CreateArrayBuffer(void** value, size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateArrayBuffer(this, value, length);
}

NativeValue* ArkNativeEngine::CreateArrayBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateArrayBufferExternal(this, value, length, cb, hint);
}

NativeValue* ArkNativeEngine::CreateTypedArray(NativeTypedArrayType type,
                                               NativeValue* value,
                                               size_t length,
                                               size_t offset)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateTypedArray(this, type, value, length, offset);
}

NativeValue* ArkNativeEngine::CreateDataView(NativeValue* value, size_t length, size_t offset)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateDataView(this, value, length, offset);
}

NativeValue* ArkNativeEngine::CreatePromise(NativeDeferred** deferred)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreatePromise(this, deferred);
}

NativeValue* ArkNativeEngine::CreateError(NativeValue* code, NativeValue* message)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateError(this, code, message);
}

bool ArkNativeEngine::InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->InitTaskPoolThread(this, callback);
}

bool ArkNativeEngine::InitTaskPoolFunc(NativeEngine* engine, NativeValue* func)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->InitTaskPoolFunc(this, func);
}

NativeValue* ArkNativeEngine::CallFunction(
    NativeValue* thisVar, NativeValue* function, NativeValue* const* argv, size_t argc)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CallFunction(this, thisVar, function, argv, argc);
}

NativeValue* ArkNativeEngine::RunScript(NativeValue* script)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RunScript(this, script);
}

NativeValue* ArkNativeEngine::RunScriptPath(const char* path)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RunScriptPath(this, path);
}

NativeValue* ArkNativeEngine::RunScriptBuffer(const char* path, std::vector<uint8_t>& buffer, bool isBundle)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RunScriptBuffer(this, path, buffer, isBundle);
}

void ArkNativeEngine::SetPackagePath(const std::string appLinPathKey, const std::vector<std::string>& packagePath)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->SetPackagePath(appLinPathKey, packagePath);
}

NativeValue* ArkNativeEngine::DefineClass(const char* name,
                                          NativeCallback callback,
                                          void* data,
                                          const NativePropertyDescriptor* properties,
                                          size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->DefineClass(this, name, callback, data, properties, length);
}

NativeValue* ArkNativeEngine::CreateInstance(NativeValue* constructor, NativeValue* const *argv, size_t argc)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateInstance(this, constructor, argv, argc);
}

NativeReference* ArkNativeEngine::CreateReference(NativeValue* value, uint32_t initialRefcount,
    NativeFinalize callback, void* data, void* hint)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateReference(this, value, initialRefcount, callback, data, hint);
}

bool ArkNativeEngine::IsExceptionPending() const
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->IsExceptionPending();
}

NativeValue* ArkNativeEngine::GetAndClearLastException()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetAndClearLastException(this);
}

bool ArkNativeEngine::Throw(NativeValue* error)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->Throw(error);
}

bool ArkNativeEngine::Throw(NativeErrorType type, const char* code, const char* message)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->Throw(this, type, code, message);
}

void* ArkNativeEngine::CreateRuntime()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateRuntime(this);
}

NativeValue* ArkNativeEngine::Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->Serialize(context, value, transfer);
}

NativeValue* ArkNativeEngine::Deserialize(NativeEngine* context, NativeValue* recorder)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->Deserialize(this, context, recorder);
}

void ArkNativeEngine::DeleteSerializationData(NativeValue* value) const
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->DeleteSerializationData(value);
}

void ArkNativeEngine::StartCpuProfiler(const std::string& fileName)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StartCpuProfiler(fileName);
}

void ArkNativeEngine::StopCpuProfiler()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StopCpuProfiler();
}

void ArkNativeEngine::ResumeVM()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->ResumeVM();
}

bool ArkNativeEngine::SuspendVM()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->SuspendVM();
}

bool ArkNativeEngine::IsSuspended()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->IsSuspended();
}

bool ArkNativeEngine::CheckSafepoint()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CheckSafepoint();
}

NativeValue* ArkNativeEngine::RunBufferScript(std::vector<uint8_t>& buffer)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RunBufferScript(this, buffer);
}

NativeValue* ArkNativeEngine::RunActor(std::vector<uint8_t>& buffer, const char* descriptor)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RunActor(this, buffer, descriptor);
}

NativeValue* ArkNativeEngine::LoadArkModule(const char* str, int32_t len, const std::string& fileName)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->LoadArkModule(this, str, len, fileName);
}

NativeValue* ArkNativeEngine::LoadModule(NativeValue* str, const std::string& fileName)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->LoadModule(this, str, fileName);
}

NativeChunk& ArkNativeEngine::GetNativeChunk()
{
    return GetScopeManager()->GetNativeChunk();
}

NativeValue* ArkNativeEngine::ArkValueToNativeValue(ArkNativeEngine* engine, Local<JSValueRef> value)
{
    NativeValue* result = nullptr;
    NativeChunk& chunk = engine->GetNativeChunk();
    if (value->IsNull() || value->IsUndefined() || value->IsSymbol()) {
        result = chunk.New<ArkNativeValue>(engine, value);
    } else if (value->IsNumber()) {
        result = chunk.New<ArkNativeNumber>(engine, value);
    } else if (value->IsString()) {
        result = chunk.New<ArkNativeString>(engine, value);
    } else if (value->IsArray(engine->GetEcmaVm())) {
        result = chunk.New<ArkNativeArray>(engine, value);
    } else if (value->IsFunction()) {
        result = chunk.New<ArkNativeFunction>(engine, value);
    } else if (value->IsArrayBuffer()) {
        result = chunk.New<ArkNativeArrayBuffer>(engine, value);
    } else if (value->IsDataView()) {
        result = chunk.New<ArkNativeDataView>(engine, value);
    } else if (value->IsTypedArray()) {
        result = chunk.New<ArkNativeTypedArray>(engine, value);
    } else if (value->IsNativePointer()) {
        result = chunk.New<ArkNativeExternal>(engine, value);
    } else if (value->IsDate()) {
        result = chunk.New<ArkNativeDate>(engine, value);
    } else if (value->IsBigInt()) {
        result = chunk.New<ArkNativeBigInt>(engine, value);
    } else if (value->IsObject() || value->IsPromise()) {
        result = chunk.New<ArkNativeObject>(engine, value);
    } else if (value->IsBoolean()) {
        result = chunk.New<ArkNativeBoolean>(engine, value);
    }
    return result;
}

NativeValue* ArkNativeEngine::ValueToNativeValue(JSValueWrapper& value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->ValueToNativeValue(this, value);
}

bool ArkNativeEngine::ExecuteJsBin(const std::string& fileName)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->ExecuteJsBin(fileName);
}

NativeValue* ArkNativeEngine::CreateBuffer(void** value, size_t length)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBuffer(this, value, length);
}

NativeValue* ArkNativeEngine::CreateBufferCopy(void** value, size_t length, const void* data)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBufferCopy(this, value, length, data);
}

NativeValue* ArkNativeEngine::CreateBufferExternal(void* value, size_t length, NativeFinalize cb, void* hint)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBufferExternal(this, value, length, cb, hint);
}

NativeValue* ArkNativeEngine::CreateDate(double value)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateDate(this, value);
}

NativeValue* ArkNativeEngine::CreateBigWords(int sign_bit, size_t word_count, const uint64_t* words)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->CreateBigWords(this, sign_bit, word_count, words);
}

bool ArkNativeEngine::TriggerFatalException(NativeValue* error)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->TriggerFatalException(error);
}

bool ArkNativeEngine::AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->AdjustExternalMemory(ChangeInBytes, AdjustedValue);
}

void ArkNativeEngine::SetPromiseRejectCallback(NativeReference* rejectCallbackRef, NativeReference* checkCallbackRef)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->SetPromiseRejectCallback(this, rejectCallbackRef, checkCallbackRef);
}

void ArkNativeEngine::DumpHeapSnapshot(const std::string& path, bool isVmMode, DumpFormat dumpFormat)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->DumpHeapSnapshot(path, isVmMode, dumpFormat);
}

void ArkNativeEngine::DumpHeapSnapshot(bool isVmMode, DumpFormat dumpFormat, bool isPrivate)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->DumpHeapSnapshotExt(isVmMode, dumpFormat, isPrivate);
}

bool ArkNativeEngine::BuildNativeAndJsStackTrace(std::string& stackTraceStr)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->BuildNativeAndJsStackTrace(stackTraceStr);
}

bool ArkNativeEngine::BuildJsStackTrace(std::string& stackTraceStr)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->BuildJsStackTrace(stackTraceStr);
}

bool ArkNativeEngine::BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->BuildJsStackInfoList(tid, jsFrames);
}

bool ArkNativeEngine::DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    if (hostEngine != nullptr && workerEngine != nullptr) {
        return arkNativeEngineImpl->DeleteWorker(hostEngine, workerEngine);
    }
    return false;
}

bool ArkNativeEngine::StartHeapTracking(double timeInterval, bool isVmMode)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StartHeapTracking(timeInterval, isVmMode);
}

bool ArkNativeEngine::StopHeapTracking(const std::string &filePath)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StopHeapTracking(filePath);
}

#if !defined(PREVIEW)
void ArkNativeEngine::PrintStatisticResult()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->PrintStatisticResult();
}

void ArkNativeEngine::StartRuntimeStat()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StartRuntimeStat();
}

void ArkNativeEngine::StopRuntimeStat()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->StopRuntimeStat();
}

size_t ArkNativeEngine::GetArrayBufferSize()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetArrayBufferSize();
}

size_t ArkNativeEngine::GetHeapTotalSize()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetHeapTotalSize();
}

size_t ArkNativeEngine::GetHeapUsedSize()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->GetHeapUsedSize();
}

void ArkNativeEngine::NotifyApplicationState(bool inBackground)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->NotifyApplicationState(inBackground);
}

void ArkNativeEngine::NotifyIdleTime(int idleMicroSec)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->NotifyIdleTime(idleMicroSec);
}

void ArkNativeEngine::NotifyMemoryPressure(bool inHighMemoryPressure)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->NotifyMemoryPressure(inHighMemoryPressure);
}
#else
void ArkNativeEngine::PrintStatisticResult()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngine::StartRuntimeStat()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngine::StopRuntimeStat()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

size_t ArkNativeEngine::GetArrayBufferSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

size_t ArkNativeEngine::GetHeapTotalSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

size_t ArkNativeEngine::GetHeapUsedSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

void ArkNativeEngine::NotifyApplicationState([[maybe_unused]] bool inBackground)
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngine::NotifyIdleTime([[maybe_unused]] int idleMicroSec)
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngine::NotifyMemoryPressure([[maybe_unused]] bool inHighMemoryPressure)
{
    HILOG_WARN("ARK does not support dfx on windows");
}
#endif

void ArkNativeEngine::RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->RegisterUncaughtExceptionHandler(callback);
}

void ArkNativeEngine::HandleUncaughtException()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->HandleUncaughtException(this);
}

bool ArkNativeEngine::HasPendingException()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->HasPendingException();
}

bool ArkNativeEngine::IsMixedDebugEnabled()
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->IsMixedDebugEnabled();
}

void ArkNativeEngine::NotifyNativeCalling(const void *nativeAddress)
{
    auto arkNativeEngineImpl = static_cast<ArkNativeEngineImpl*>(nativeEngineImpl_);
    return arkNativeEngineImpl->NotifyNativeCalling(nativeAddress);
}