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

#include "ark_native_engine_impl.h"

#include "ark_native_deferred.h"
#include "ark_native_reference.h"
#include "scope_manager/native_scope_manager.h"

#ifdef ENABLE_CONTAINER_SCOPE
#include "core/common/container_scope.h"
#endif

#include "native_engine/native_property.h"

#include "ark_native_engine.h"
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

#ifdef ENABLE_HITRACE
#include "hitrace_meter.h"
#endif
#ifndef PREVIEW
#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
#include "parameters.h"
#endif
#endif
#include "securec.h"
#include "utils/log.h"
#ifdef ENABLE_HITRACE
#include "parameter.h"
#endif

using panda::JsiRuntimeCallInfo;
using panda::BooleanRef;
using panda::ObjectRef;
using panda::StringRef;
using panda::FunctionRef;
using panda::PrimitiveRef;
using panda::JSValueRef;
using panda::ArrayBufferRef;
using panda::TypedArrayRef;
using panda::PromiseCapabilityRef;
using panda::NativePointerRef;
using panda::SymbolRef;
using panda::IntegerRef;
using panda::DateRef;
using panda::BigIntRef;
static constexpr auto PANDA_MAIN_FUNCTION = "_GLOBAL::func_main_0";
#ifdef ENABLE_HITRACE
constexpr auto NAPI_PROFILER_PARAM_SIZE = 10;
#endif

bool ArkNativeEngineImpl::napiProfilerEnabled {false};
bool ArkNativeEngineImpl::napiProfilerParamReaded {false};
std::string ArkNativeEngineImpl::tempModuleName_ {""};

struct MoudleNameLocker {
    explicit MoudleNameLocker(std::string moduleName)
    {
        ArkNativeEngineImpl::tempModuleName_ = moduleName;
    }
    ~MoudleNameLocker()
    {
        ArkNativeEngineImpl::tempModuleName_ = "";
    }
};

ArkNativeEngineImpl::ArkNativeEngineImpl(
    EcmaVM* vm, NativeEngine* engine, void* jsEngine) : NativeEngineInterface(engine, jsEngine),
    vm_(vm), topScope_(vm)
{
#ifdef ENABLE_HITRACE
    if (!ArkNativeEngineImpl::napiProfilerParamReaded) {
        char napiProfilerParam[NAPI_PROFILER_PARAM_SIZE] = {0};
        int ret = GetParameter("persist.hiviewdfx.napiprofiler.enabled", "false",
            napiProfilerParam, sizeof(napiProfilerParam));
        if (ret > 0 && strcmp(napiProfilerParam, "true") == 0) {
            ArkNativeEngineImpl::napiProfilerEnabled = true;
        }
        ArkNativeEngineImpl::napiProfilerParamReaded = true;
    }
#endif
    Local<StringRef> requireInternalName = StringRef::NewFromUtf8(vm, "requireInternal");
    void* requireData = static_cast<void*>(this);

    Local<FunctionRef> requireNapi =
        FunctionRef::New(
            vm,
            [](JsiRuntimeCallInfo *info) -> Local<JSValueRef> {
                EcmaVM *ecmaVm = info->GetVM();
                panda::EscapeLocalScope scope(ecmaVm);
                NativeModuleManager* moduleManager = NativeModuleManager::GetInstance();
                ArkNativeEngineImpl* engineImpl = static_cast<ArkNativeEngineImpl*>(info->GetData());
                Local<StringRef> moduleName(info->GetCallArgRef(0));
                bool isAppModule = false;
                const uint32_t lengthMax = 2;
                if (info->GetArgsNumber() >= lengthMax) {
                    Local<BooleanRef> ret(info->GetCallArgRef(1));
                    isAppModule = ret->Value();
                }
                NativeModule* module;
                if (info->GetArgsNumber() == 3) {
                    Local<StringRef> path(info->GetCallArgRef(2));
                    module =
                        moduleManager->LoadNativeModule(moduleName->ToString().c_str(), path->ToString().c_str(),
                            isAppModule, false, true);
                } else {
                    module =
                        moduleManager->LoadNativeModule(moduleName->ToString().c_str(), nullptr, isAppModule, false,
                            true);
                }
                    
                Local<JSValueRef> exports(JSValueRef::Undefined(ecmaVm));
                if (module != nullptr) {
                    auto it = engineImpl->loadedModules_.find(module);
                    if (it != engineImpl->loadedModules_.end()) {
                        return scope.Escape(it->second.ToLocal(ecmaVm));
                    }
                    ArkNativeEngine* nativeEngine = new ArkNativeEngine(engineImpl, engineImpl->GetJsEngine(),
                        isAppModule);
                    std::string strModuleName = moduleName->ToString();
                    moduleManager->SetNativeEngine(strModuleName, nativeEngine);
                    MoudleNameLocker nameLocker(strModuleName);
                    if (module->jsCode != nullptr) {
                        char fileName[NAPI_PATH_MAX] = { 0 };
                        const char* name = module->name;
                        if (sprintf_s(fileName, sizeof(fileName), "lib%s.z.so/%s.js", name, name) == -1) {
                            HILOG_ERROR("sprintf_s file name failed");
                            return scope.Escape(exports);
                        }
                        HILOG_DEBUG("load js code from %{public}s", fileName);
                        NativeValue* exportObject = nativeEngine->LoadArkModule(module->jsCode,
                            module->jsCodeLen, fileName);
                        if (exportObject == nullptr) {
                            HILOG_ERROR("load module failed");
                            return scope.Escape(exports);
                        } else {
                            Global<JSValueRef> globalExports = *exportObject;
                            exports = globalExports.ToLocal(ecmaVm);
                            engineImpl->loadedModules_[module] = Global<JSValueRef>(ecmaVm, exports);
                        }
                    } else if (module->registerCallback != nullptr) {
                        NativeValue* exportObject = nativeEngine->CreateObject();
                        auto arkNativeEngine = static_cast<ArkNativeEngine*>(engineImpl->GetRootNativeEngine());
                        if (!arkNativeEngine) {
                            HILOG_ERROR("init module failed");
                            return scope.Escape(exports);
                        }
#ifdef ENABLE_HITRACE
                        StartTrace(HITRACE_TAG_ACE, "NAPI module init, name = " + std::string(module->name));
#endif
                        ArkNativeObject* exportObj = reinterpret_cast<ArkNativeObject*>(exportObject);
                        engineImpl->SetModuleName(exportObj, module->name);
                        module->registerCallback(arkNativeEngine, exportObject);
#ifdef ENABLE_HITRACE
                        FinishTrace(HITRACE_TAG_ACE);
#endif
                        Global<JSValueRef> globalExports = *exportObject;
                        exports = globalExports.ToLocal(ecmaVm);
                        engineImpl->loadedModules_[module] = Global<JSValueRef>(ecmaVm, exports);
                    } else {
                        HILOG_ERROR("init module failed");
                        return scope.Escape(exports);
                    }
                }
                return scope.Escape(exports);
            },
            nullptr,
            requireData);

    Local<FunctionRef> requireInternal =
        FunctionRef::New(
            vm,
            [](JsiRuntimeCallInfo *info) -> Local<JSValueRef> {
                EcmaVM *ecmaVm = info->GetVM();
                panda::EscapeLocalScope scope(ecmaVm);
                NativeModuleManager* moduleManager = NativeModuleManager::GetInstance();
                ArkNativeEngineImpl* engineImpl = static_cast<ArkNativeEngineImpl*>(info->GetData());
                Local<StringRef> moduleName(info->GetCallArgRef(0));
                NativeModule* module = moduleManager->LoadNativeModule(moduleName->ToString().c_str(), nullptr, false);
                Local<JSValueRef> exports(JSValueRef::Undefined(ecmaVm));
                MoudleNameLocker nameLocker(moduleName->ToString());
                if (module != nullptr && engineImpl) {
                    auto it = engineImpl->loadedModules_.find(module);
                    if (it != engineImpl->loadedModules_.end()) {
                        return scope.Escape(it->second.ToLocal(ecmaVm));
                    }
                    ArkNativeEngine* nativeEngine = new ArkNativeEngine(engineImpl, engineImpl->GetJsEngine(), false);
                    std::string strModuleName = moduleName->ToString();
                    moduleManager->SetNativeEngine(strModuleName, nativeEngine);

                    NativeValue* exportObject = nativeEngine->CreateObject();
                    if (exportObject != nullptr) {
                        auto arkNativeEngine = static_cast<ArkNativeEngine*>(engineImpl->GetRootNativeEngine());
                        if (!arkNativeEngine) {
                            HILOG_ERROR("exportObject is nullptr");
                            return scope.Escape(exports);
                        }
                        ArkNativeObject* exportObj = reinterpret_cast<ArkNativeObject*>(exportObject);
                        engineImpl->SetModuleName(exportObj, module->name);
                        module->registerCallback(arkNativeEngine, exportObject);
                        Global<JSValueRef> globalExports = *exportObject;
                        exports = globalExports.ToLocal(ecmaVm);
                        engineImpl->loadedModules_[module] = Global<JSValueRef>(ecmaVm, exports);
                    } else {
                        HILOG_ERROR("exportObject is nullptr");
                        return scope.Escape(exports);
                    }
                }
                return scope.Escape(exports);
            },
            nullptr,
            requireData);

    Local<ObjectRef> global = panda::JSNApi::GetGlobalObject(vm);
#if !defined(PREVIEW)
    Local<StringRef> requireName = StringRef::NewFromUtf8(vm, "requireNapi");
    global->Set(vm, requireName, requireNapi);
#else
    Local<StringRef> requireNapiPreview = StringRef::NewFromUtf8(vm, "requireNapiPreview");
    global->Set(vm, requireNapiPreview, requireNapi);
#endif
    global->Set(vm, requireInternalName, requireInternal);
    JSNApi::SetNativePtrGetter(vm, reinterpret_cast<void*>(ArkNativeFunction::GetNativePtrCallBack));
    // need to call init of base class.
    Init();
    panda::JSNApi::SetLoop(vm, loop_);
}

ArkNativeEngineImpl::~ArkNativeEngineImpl()
{
    // need to call deinit before base class.
    HILOG_INFO("ArkNativeEngineImpl::~ArkNativeEngineImpl");
    Deinit();

    // Free cached objects
    for (auto&& [module, exportObj] : loadedModules_) {
        exportObj.FreeGlobalHandleAddr();
    }
    // Free callbackRef
    if (promiseRejectCallbackRef_ != nullptr) {
        delete promiseRejectCallbackRef_;
    }
    if (checkCallbackRef_ != nullptr) {
        delete checkCallbackRef_;
    }
}

panda::Local<panda::ObjectRef> ArkNativeEngineImpl::GetModuleFromName(NativeEngine* engine,
    const std::string& moduleName, bool isAppModule, const std::string& id, const std::string& param,
    const std::string& instanceName, void** instance)
{
    panda::EscapeLocalScope scope(vm_);
    Local<ObjectRef> exports(JSValueRef::Undefined(vm_));
    NativeModuleManager* moduleManager = NativeModuleManager::GetInstance();
    NativeModule* module = moduleManager->LoadNativeModule(moduleName.c_str(), nullptr, isAppModule);
    if (module != nullptr) {
        NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
        NativeValue* idValue = chunk.New<ArkNativeString>(static_cast<ArkNativeEngine*>(engine), id.c_str(), id.size());
        NativeValue* paramValue = chunk.New<ArkNativeString>(
            static_cast<ArkNativeEngine*>(engine), param.c_str(), param.size());
        NativeValue* exportObject = chunk.New<ArkNativeObject>(static_cast<ArkNativeEngine*>(engine));

        NativePropertyDescriptor idProperty, paramProperty;
        idProperty.utf8name = "id";
        idProperty.value = idValue;
        paramProperty.utf8name = "param";
        paramProperty.value = paramValue;

        ArkNativeObject* exportObj = reinterpret_cast<ArkNativeObject*>(exportObject);
        SetModuleName(exportObj, module->name);
        exportObj->DefineProperty(idProperty);
        exportObj->DefineProperty(paramProperty);
        MoudleNameLocker nameLocker(module->name);
        module->registerCallback(engine, exportObject);

        napi_value nExport = reinterpret_cast<napi_value>(exportObject);
        napi_value exportInstance = nullptr;
        napi_status status = napi_get_named_property(
            reinterpret_cast<napi_env>(engine), nExport, instanceName.c_str(), &exportInstance);
        if (status != napi_ok) {
            HILOG_ERROR("GetModuleFromName napi_get_named_property status != napi_ok");
        }

        status = napi_unwrap(reinterpret_cast<napi_env>(engine), exportInstance, reinterpret_cast<void**>(instance));
        if (status != napi_ok) {
            HILOG_ERROR("GetModuleFromName napi_unwrap status != napi_ok");
        }

        Global<ObjectRef> globalExports = *exportObject;
        exports = globalExports.ToLocal(vm_);
    }
    return scope.Escape(exports);
}

panda::Local<panda::ObjectRef> ArkNativeEngineImpl::LoadModuleByName(ArkNativeEngine* engine,
    const std::string& moduleName, bool isAppModule, const std::string& param, const std::string& instanceName,
    void* instance, const std::string& path)
{
    panda::EscapeLocalScope scope(vm_);
    Local<ObjectRef> exports(JSValueRef::Undefined(vm_));
    NativeModuleManager* moduleManager = NativeModuleManager::GetInstance();
    NativeModule* module =
        moduleManager->LoadNativeModule(moduleName.c_str(), path.empty() ? nullptr : path.c_str(), isAppModule);
    if (module != nullptr) {
        NativeValue* exportObject = new ArkNativeObject(static_cast<ArkNativeEngine*>(engine));
        ArkNativeObject* exportObj = reinterpret_cast<ArkNativeObject*>(exportObject);

        NativePropertyDescriptor paramProperty, instanceProperty;

        NativeValue* paramValue =
            new ArkNativeString(static_cast<ArkNativeEngine*>(engine), param.c_str(), param.size());
        paramProperty.utf8name = "param";
        paramProperty.value = paramValue;

        auto instanceValue = new ArkNativeObject(static_cast<ArkNativeEngine*>(engine));
        instanceValue->SetNativePointer(instance, nullptr, nullptr);
        instanceProperty.utf8name = instanceName.c_str();
        instanceProperty.value = instanceValue;

        SetModuleName(exportObj, module->name);
        exportObj->DefineProperty(paramProperty);
        exportObj->DefineProperty(instanceProperty);

        MoudleNameLocker nameLocker(module->name);
        module->registerCallback(engine, exportObject);
        Global<ObjectRef> globalExports = *exportObject;
        exports = globalExports.ToLocal(vm_);
    }
    return scope.Escape(exports);
}

void ArkNativeEngineImpl::Loop(LoopMode mode, bool needSync)
{
    LocalScope scope(vm_);
    NativeEngineInterface::Loop(mode, needSync);
    panda::JSNApi::ExecutePendingJob(vm_);
}

NativeValue* ArkNativeEngineImpl::GetGlobal(NativeEngine* engine)
{
    LocalScope scope(vm_);
    Local<ObjectRef> value = panda::JSNApi::GetGlobalObject(vm_);
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateNull(NativeEngine* engine)
{
    LocalScope scope(vm_);
    Local<PrimitiveRef> value = JSValueRef::Null(vm_);
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeValue>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateUndefined(NativeEngine* engine)
{
    LocalScope scope(vm_);
    Local<PrimitiveRef> value = JSValueRef::Undefined(vm_);
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeValue>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateBoolean(NativeEngine* engine, bool value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeBoolean>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateNumber(NativeEngine* engine, int32_t value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeNumber>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateNumber(NativeEngine* engine, uint32_t value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeNumber>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateNumber(NativeEngine* engine, int64_t value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeNumber>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateNumber(NativeEngine* engine, double value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeNumber>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateBigInt(NativeEngine* engine, int64_t value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeBigInt>(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::CreateBigInt(NativeEngine* engine, uint64_t value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeBigInt>(static_cast<ArkNativeEngine*>(engine), value, true);
}

NativeValue* ArkNativeEngineImpl::CreateString(NativeEngine* engine, const char* value, size_t length)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeString>(static_cast<ArkNativeEngine*>(engine), value, length);
}

NativeValue* ArkNativeEngineImpl::CreateString16(NativeEngine* engine, const char16_t* value, size_t length)
{
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::CreateSymbol(NativeEngine* engine, NativeValue* value)
{
    LocalScope scope(vm_);
    Global<StringRef> str = *value;
    Local<SymbolRef> symbol = SymbolRef::New(vm_, str.ToLocal(vm_));
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeValue>(static_cast<ArkNativeEngine*>(engine), symbol);
}

NativeValue* ArkNativeEngineImpl::CreateExternal(NativeEngine* engine, void* value, NativeFinalize callback,
    void* hint, size_t nativeBindingSize)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeExternal>(
        static_cast<ArkNativeEngine*>(engine), value, callback, hint, nativeBindingSize);
}

NativeValue* ArkNativeEngineImpl::CreateObject(NativeEngine* engine)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeObject>(static_cast<ArkNativeEngine*>(engine));
}

NativeValue* ArkNativeEngineImpl::CreateNativeBindingObject(NativeEngine* engine, void* detach, void* attach)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeObject>(static_cast<ArkNativeEngine*>(engine), detach, attach);
}

NativeValue* ArkNativeEngineImpl::CreateNBObject(NativeEngine* engine, DetachCallback detach, AttachCallback attach)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeObject>(static_cast<ArkNativeEngine*>(engine), detach, attach);
}

NativeValue* ArkNativeEngineImpl::CreateFunction(
    NativeEngine* engine, const char* name, size_t length, NativeCallback cb, void* value)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeFunction>(static_cast<ArkNativeEngine*>(engine), name, length, cb, value);
}

NativeValue* ArkNativeEngineImpl::CreateArray(NativeEngine* engine, size_t length)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeArray>(static_cast<ArkNativeEngine*>(engine), length);
}

NativeValue* ArkNativeEngineImpl::CreateArrayBuffer(NativeEngine* engine, void** value, size_t length)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeArrayBuffer>(static_cast<ArkNativeEngine*>(engine), (uint8_t**)value, length);
}

NativeValue* ArkNativeEngineImpl::CreateArrayBufferExternal(
    NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeArrayBuffer>(static_cast<ArkNativeEngine*>(engine), (uint8_t*)value, length, cb, hint);
}

NativeValue* ArkNativeEngineImpl::CreateTypedArray(
    NativeEngine* engine, NativeTypedArrayType type, NativeValue* value, size_t length, size_t offset)
{
    LocalScope scope(vm_);
    Global<ArrayBufferRef> globalBuffer = *value;
    Local<ArrayBufferRef> buffer = globalBuffer.ToLocal(vm_);
    Local<TypedArrayRef> typedArray(JSValueRef::Undefined(vm_));

    switch (type) {
        case NATIVE_INT8_ARRAY:
            typedArray = panda::Int8ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_UINT8_ARRAY:
            typedArray = panda::Uint8ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_UINT8_CLAMPED_ARRAY:
            typedArray = panda::Uint8ClampedArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_INT16_ARRAY:
            typedArray = panda::Int16ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_UINT16_ARRAY:
            typedArray = panda::Uint16ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_INT32_ARRAY:
            typedArray = panda::Int32ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_UINT32_ARRAY:
            typedArray = panda::Uint32ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_FLOAT32_ARRAY:
            typedArray = panda::Float32ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_FLOAT64_ARRAY:
            typedArray = panda::Float64ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_BIGINT64_ARRAY:
            typedArray = panda::BigInt64ArrayRef::New(vm_, buffer, offset, length);
            break;
        case NATIVE_BIGUINT64_ARRAY:
            typedArray = panda::BigUint64ArrayRef::New(vm_, buffer, offset, length);
            break;
        default:
            return nullptr;
    }
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeTypedArray>(static_cast<ArkNativeEngine*>(engine), typedArray);
}

NativeValue* ArkNativeEngineImpl::CreateDataView(NativeEngine* engine, NativeValue* value, size_t length, size_t offset)
{
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeDataView>(static_cast<ArkNativeEngine*>(engine), value, length, offset);
}

NativeValue* ArkNativeEngineImpl::CreatePromise(NativeEngine* engine, NativeDeferred** deferred)
{
    LocalScope scope(vm_);
    Local<PromiseCapabilityRef> capability = PromiseCapabilityRef::New(vm_);
    *deferred = new ArkNativeDeferred(static_cast<ArkNativeEngine*>(engine), capability);

    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeObject>(static_cast<ArkNativeEngine*>(engine), capability->GetPromise(vm_));
}

NativeValue* ArkNativeEngineImpl::CreateError(NativeEngine* engine, NativeValue* code, NativeValue* message)
{
    LocalScope scope(vm_);
    Local<JSValueRef> errorVal = panda::Exception::Error(vm_, *message);
    if (code != nullptr) {
        Local<StringRef> codeKey = StringRef::NewFromUtf8(vm_, "code");
        Local<ObjectRef> errorObj(errorVal);
        errorObj->Set(vm_, codeKey, *code);
    }
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), errorVal);
}

static void ConcurrentCallbackFunc(Local<JSValueRef> val, Local<JSValueRef> hint, void *data)
{
    if (data == nullptr) {
        return;
    }

    auto engine = static_cast<ArkNativeEngine *>(data);
    ArkNativeEngineImpl* engineImpl = static_cast<ArkNativeEngineImpl*>(engine->GetNativeEngineImpl());
    auto concurrentCallbackFunc = engineImpl->GetConcurrentCallbackFunc();
    if (concurrentCallbackFunc == nullptr) {
        return;
    }

    auto value = ArkNativeEngineImpl::ArkValueToNativeValue(engine, val);
    auto hintVal = ArkNativeEngineImpl::ArkValueToNativeValue(engine, hint);
    concurrentCallbackFunc(engine, value, hintVal);
}

bool ArkNativeEngineImpl::InitTaskPoolThread(NativeEngine* engine, NapiConcurrentCallback callback)
{
    concurrentCallbackFunc_ = callback;
    return JSNApi::InitForConcurrentThread(vm_, ConcurrentCallbackFunc, static_cast<void *>(engine));
}

bool ArkNativeEngineImpl::InitTaskPoolFunc(NativeEngine* engine, NativeValue* func)
{
    if (func == nullptr) {
        return false;
    }
    LocalScope scope(vm_);
    Local<JSValueRef> function = JSValueRef::Undefined(vm_);
    if (func != nullptr) {
        Global<JSValueRef> globalObj = *func;
        function = globalObj.ToLocal(vm_);
    }
    return JSNApi::InitForConcurrentFunction(vm_, function);
}

NativeValue* ArkNativeEngineImpl::CallFunction(
    NativeEngine* engine, NativeValue* thisVar, NativeValue* function, NativeValue* const *argv, size_t argc)
{
    if (function == nullptr) {
        return nullptr;
    }
    LocalScope scope(vm_);
    NativeScopeManager* scopeManager = engine->GetScopeManager();
    if (scopeManager == nullptr) {
        HILOG_ERROR("scope manager is null");
        return nullptr;
    }
    NativeScope* nativeScope = scopeManager->Open();
    Local<JSValueRef> thisObj = JSValueRef::Undefined(vm_);
    if (thisVar != nullptr) {
        Global<JSValueRef> globalObj = *thisVar;
        thisObj = globalObj.ToLocal(vm_);
    }
    Global<FunctionRef> funcObj = *function;
#ifdef ENABLE_CONTAINER_SCOPE
    auto nativeFunction = static_cast<NativeFunction*>(function->GetInterface(NativeFunction::INTERFACE_ID));
    if (nativeFunction == nullptr) {
        HILOG_ERROR("nativeFunction is null");
        return nullptr;
    }
    auto arkNativeFunc = static_cast<ArkNativeFunction*>(nativeFunction);
    OHOS::Ace::ContainerScope containerScope(arkNativeFunc->GetScopeId());
#endif
    std::vector<Local<JSValueRef>> args;
    args.reserve(argc);
    for (size_t i = 0; i < argc; i++) {
        if (argv[i] != nullptr) {
            Global<JSValueRef> arg = *argv[i];
            args.emplace_back(arg.ToLocal(vm_));
        } else {
            args.emplace_back(JSValueRef::Undefined(vm_));
        }
    }

    Local<JSValueRef> value = funcObj->Call(vm_, thisObj, args.data(), argc);
    if (panda::JSNApi::HasPendingException(vm_)) {
        HandleUncaughtException(engine);
        return nullptr;
    }

    scopeManager->Close(nativeScope);
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), value);
}

NativeValue* ArkNativeEngineImpl::RunScript(NativeEngine* engine, NativeValue* script)
{
    // not support yet
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::RunScriptPath(NativeEngine* engine, const char* path)
{
    panda::JSExecutionScope executionScope(vm_);
    LocalScope scope(vm_);
    [[maybe_unused]] bool ret = panda::JSNApi::Execute(vm_, path, PANDA_MAIN_FUNCTION);

    if (panda::JSNApi::HasPendingException(vm_)) {
        HandleUncaughtException(engine);
        return nullptr;
    }
    return CreateUndefined(engine);
}

NativeValue* ArkNativeEngineImpl::RunScriptBuffer(
    NativeEngine* engine, const char* path, std::vector<uint8_t>& buffer, bool isBundle)
{
    panda::JSExecutionScope executionScope(vm_);
    LocalScope scope(vm_);
    [[maybe_unused]] bool ret = false;
    if (isBundle) {
        ret = panda::JSNApi::Execute(vm_, buffer.data(), buffer.size(), PANDA_MAIN_FUNCTION, path);
    } else {
        ret = panda::JSNApi::ExecuteModuleBuffer(vm_, buffer.data(), buffer.size(), path);
    }
    
    if (panda::JSNApi::HasPendingException(vm_)) {
        HandleUncaughtException(engine);
        return nullptr;
    }
    return CreateUndefined(engine);
}

void ArkNativeEngineImpl::SetPackagePath(const std::string appLibPathKey, const std::vector<std::string>& packagePath)
{
    auto moduleManager = NativeModuleManager::GetInstance();
    if (moduleManager && !packagePath.empty()) {
        moduleManager->SetAppLibPath(appLibPathKey, packagePath);
    }
}

NativeValue* ArkNativeEngineImpl::DefineClass(NativeEngine* engine, const char* name,
    NativeCallback callback, void* data, const NativePropertyDescriptor* properties, size_t length)
{
    LocalScope scope(vm_);
    std::string className(name);
    if (ArkNativeEngineImpl::napiProfilerEnabled) {
        className = ArkNativeEngineImpl::tempModuleName_ + "." + name;
    }
    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    auto classConstructor = chunk.New<ArkNativeFunction>(static_cast<ArkNativeEngine*>(engine),
        className.c_str(), callback, data);
    SetModuleName(classConstructor, className);
    auto classPrototype = classConstructor->GetFunctionPrototype();

    for (size_t i = 0; i < length; i++) {
        if (properties[i].attributes & NATIVE_STATIC) {
            classConstructor->DefineProperty(properties[i]);
        } else {
            if (classPrototype == nullptr) {
                HILOG_ERROR("ArkNativeEngineImpl::Class's prototype is null");
                continue;
            }
            ArkNativeObject* arkNativeobj = static_cast<ArkNativeObject*>(classPrototype);
            SetModuleName(arkNativeobj, className);
            arkNativeobj->DefineProperty(properties[i]);
        }
    }

    return classConstructor;
}

NativeValue* ArkNativeEngineImpl::CreateInstance(
    NativeEngine* engine, NativeValue* constructor, NativeValue* const *argv, size_t argc)
{
    if (constructor == nullptr) {
        return nullptr;
    }
    LocalScope scope(vm_);
    Global<FunctionRef> value = *constructor;

    std::vector<Local<JSValueRef>> args;
    args.reserve(argc);
    for (size_t i = 0; i < argc; i++) {
        if (argv[i] != nullptr) {
            Global<JSValueRef> arg = *argv[i];
            args.emplace_back(arg.ToLocal(vm_));
        } else {
            args.emplace_back(JSValueRef::Undefined(vm_));
        }
    }
    Local<JSValueRef> instance = value->Constructor(vm_, args.data(), argc);
    Local<ObjectRef> excep = panda::JSNApi::GetUncaughtException(vm_);
    if (!excep.IsNull()) {
        HILOG_ERROR("ArkNativeEngineImpl::CreateInstance occur Exception");
        return nullptr;
    }
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), instance);
}

NativeReference* ArkNativeEngineImpl::CreateReference(
    NativeEngine* engine, NativeValue* value, uint32_t initialRefcount, NativeFinalize callback, void* data, void* hint)
{
    return new ArkNativeReference(static_cast<ArkNativeEngine*>(engine), value, initialRefcount, false);
}

bool ArkNativeEngineImpl::IsExceptionPending() const
{
    return lastException_ != nullptr;
}

NativeValue* ArkNativeEngineImpl::GetAndClearLastException(NativeEngine* engine)
{
    NativeValue* temp = lastException_;
    lastException_ = nullptr;
    if (IsMainThread() || temp != nullptr) {
        return temp;
    }

    // Worker need handle all exception
    LocalScope scope(vm_);
    Local<ObjectRef> exception = panda::JSNApi::GetAndClearUncaughtException(vm_);
    if (exception.IsNull()) {
        return nullptr;
    }

    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), exception);
}

bool ArkNativeEngineImpl::Throw(NativeValue* error)
{
    LocalScope scope(vm_);
    Global<JSValueRef> errorVal = *error;
    panda::JSNApi::ThrowException(vm_, errorVal.ToLocal(vm_));
    lastException_ = error;
    return true;
}

bool ArkNativeEngineImpl::Throw(NativeEngine* engine, NativeErrorType type, const char* code, const char* message)
{
    LocalScope scope(vm_);
    Local<JSValueRef> error(JSValueRef::Undefined(vm_));
    switch (type) {
        case NATIVE_COMMON_ERROR:
            error = panda::Exception::Error(vm_, StringRef::NewFromUtf8(vm_, message));
            break;
        case NATIVE_TYPE_ERROR:
            error = panda::Exception::TypeError(vm_, StringRef::NewFromUtf8(vm_, message));
            break;
        case NATIVE_RANGE_ERROR:
            error = panda::Exception::RangeError(vm_, StringRef::NewFromUtf8(vm_, message));
            break;
        default:
            return false;
    }
    if (code != nullptr) {
        Local<JSValueRef> codeKey = StringRef::NewFromUtf8(vm_, "code");
        Local<JSValueRef> codeValue = StringRef::NewFromUtf8(vm_, code);
        Local<ObjectRef> errorObj(error);
        errorObj->Set(vm_, codeKey, codeValue);
    }

    panda::JSNApi::ThrowException(vm_, error);
    lastException_ = ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), error);
    return true;
}

NativeEngine* ArkNativeEngineImpl::CreateRuntimeFunc(NativeEngine* engine, void* jsEngine)
{
    panda::RuntimeOption option;
#if defined(OHOS_PLATFORM) && !defined(IOS_PLATFORM)
    int arkProperties = OHOS::system::GetIntParameter<int>("persist.ark.properties", -1);
    std::string bundleName = OHOS::system::GetParameter("persist.ark.arkbundlename", "");
    size_t gcThreadNum = OHOS::system::GetUintParameter<size_t>("persist.ark.gcthreads", 7);
    size_t longPauseTime = OHOS::system::GetUintParameter<size_t>("persist.ark.longpausetime", 40);
    bool asmInterpreterEnabled = OHOS::system::GetBoolParameter("persist.ark.asminterpreter", true);
    std::string asmOpcodeDisableRange = OHOS::system::GetParameter("persist.ark.asmopcodedisablerange", "");
    option.SetArkProperties(arkProperties);
    option.SetArkBundleName(bundleName);
    option.SetGcThreadNum(gcThreadNum);
    option.SetLongPauseTime(longPauseTime);
    option.SetEnableAsmInterpreter(asmInterpreterEnabled);
    option.SetAsmOpcodeDisableRange(asmOpcodeDisableRange);
    option.SetIsWorker();
    HILOG_INFO("ArkNativeEngineImpl::CreateRuntimeFunc ark properties = %{public}d, bundlename = %{public}s",
        arkProperties, bundleName.c_str());
#endif
    option.SetGcType(panda::RuntimeOption::GC_TYPE::GEN_GC);
    const int64_t poolSize = 0x1000000;
    option.SetGcPoolSize(poolSize);
#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
    option.SetLogLevel(panda::RuntimeOption::LOG_LEVEL::INFO);
#endif
    option.SetDebuggerLibraryPath("");
    EcmaVM* vm = panda::JSNApi::CreateJSVM(option);
    if (vm == nullptr) {
        return nullptr;
    }
    // worker adaptation mergeabc
    const panda::ecmascript::EcmaVM* hostVM = reinterpret_cast<ArkNativeEngine*>(engine)->GetEcmaVm();
    panda::JSNApi::SetBundle(vm, panda::JSNApi::IsBundle(const_cast<EcmaVM*>(hostVM)));
    panda::JSNApi::SetBundleName(vm, panda::JSNApi::GetBundleName(const_cast<EcmaVM*>(hostVM)));
    panda::JSNApi::SetModuleName(vm, panda::JSNApi::GetModuleName(const_cast<EcmaVM*>(hostVM)));
    panda::JSNApi::SetAssetPath(vm, panda::JSNApi::GetAssetPath(const_cast<EcmaVM*>(hostVM)));
    ArkNativeEngine* arkEngine = new ArkNativeEngine(vm, jsEngine);
    // init callback
    arkEngine->RegisterWorkerFunction(engine);

    auto cleanEnv = [vm]() {
        if (vm != nullptr) {
            HILOG_INFO("cleanEnv is called");
            panda::JSNApi::DestroyJSVM(vm);
        }
    };
    arkEngine->SetCleanEnv(cleanEnv);

    if (hostVM != nullptr) {
        panda::JSNApi::addWorker(const_cast<EcmaVM*>(hostVM), vm);
    }
    return arkEngine;
}

void* ArkNativeEngineImpl::CreateRuntime(NativeEngine* engine)
{
    return ArkNativeEngineImpl::CreateRuntimeFunc(engine, jsEngineInterface_);
}

NativeValue* ArkNativeEngineImpl::Serialize(NativeEngine* context, NativeValue* value, NativeValue* transfer)
{
    const panda::ecmascript::EcmaVM* vm = reinterpret_cast<ArkNativeEngine*>(context)->GetEcmaVm();
    LocalScope scope(vm);
    Global<JSValueRef> arkValue = *value;
    Global<JSValueRef> arkTransfer = *transfer;
    void* result = panda::JSNApi::SerializeValue(vm, arkValue.ToLocal(vm), arkTransfer.ToLocal(vm));
    return reinterpret_cast<NativeValue*>(result);
}

NativeValue* ArkNativeEngineImpl::Deserialize(NativeEngine* engine, NativeEngine* context, NativeValue* recorder)
{
    const panda::ecmascript::EcmaVM* vm = reinterpret_cast<ArkNativeEngine*>(context)->GetEcmaVm();
    LocalScope scope(vm);
    Local<JSValueRef> result = panda::JSNApi::DeserializeValue(vm, recorder, reinterpret_cast<void*>(context));
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), result);
}

void ArkNativeEngineImpl::DeleteSerializationData(NativeValue* value) const
{
    void* data = reinterpret_cast<void*>(value);
    panda::JSNApi::DeleteSerializationData(data);
}

#if defined(ECMASCRIPT_SUPPORT_CPUPROFILER)
void ArkNativeEngineImpl::StartCpuProfiler(const std::string& fileName)
{
    JSNApi::SetNativePtrGetter(vm_, reinterpret_cast<void*>(ArkNativeFunction::GetNativePtrCallBack));
    DFXJSNApi::StartCpuProfilerForFile(vm_, fileName);
}

void ArkNativeEngineImpl::StopCpuProfiler()
{
    DFXJSNApi::StopCpuProfilerForFile(vm_);
    JSNApi::SetNativePtrGetter(vm_, nullptr);
}
#else
void ArkNativeEngineImpl::StartCpuProfiler(const std::string& fileName)
{
    HILOG_WARN("ARKCpuProfiler is not supported on windows");
}

void ArkNativeEngineImpl::StopCpuProfiler()
{
    HILOG_WARN("ARKCpuProfiler is not supported on windows");
}
#endif
#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
void ArkNativeEngineImpl::ResumeVM()
{
    DFXJSNApi::ResumeVM(vm_);
}

bool ArkNativeEngineImpl::SuspendVM()
{
    return DFXJSNApi::SuspendVM(vm_);
}

bool ArkNativeEngineImpl::IsSuspended()
{
    return DFXJSNApi::IsSuspended(vm_);
}

bool ArkNativeEngineImpl::CheckSafepoint()
{
    return DFXJSNApi::CheckSafepoint(vm_);
}
#else
void ArkNativeEngineImpl::ResumeVM()
{
    HILOG_WARN("ARK Snapshot is not supported on windows");
}

bool ArkNativeEngineImpl::SuspendVM()
{
    HILOG_WARN("ARK Snapshot is not supported on windows");
    return false;
}

bool ArkNativeEngineImpl::IsSuspended()
{
    HILOG_WARN("ARK Snapshot is not supported on windows");
    return false;
}

bool ArkNativeEngineImpl::CheckSafepoint()
{
    HILOG_WARN("ARK Snapshot is not supported on windows");
    return false;
}
#endif

NativeValue* ArkNativeEngineImpl::RunBufferScript(NativeEngine* engine, std::vector<uint8_t>& buffer)
{
    panda::JSExecutionScope executionScope(vm_);
    LocalScope scope(vm_);
    [[maybe_unused]] bool ret = panda::JSNApi::Execute(vm_, buffer.data(), buffer.size(), PANDA_MAIN_FUNCTION);

    if (panda::JSNApi::HasPendingException(vm_)) {
        HandleUncaughtException(engine);
        return nullptr;
    }
    return CreateUndefined(engine);
}

NativeValue* ArkNativeEngineImpl::RunActor(NativeEngine* engine, std::vector<uint8_t>& buffer, const char* descriptor)
{
    panda::JSExecutionScope executionScope(vm_);
    LocalScope scope(vm_);
    std::string desc(descriptor);
    [[maybe_unused]] bool ret = false;
    if (panda::JSNApi::IsBundle(vm_)) {
        ret = panda::JSNApi::Execute(vm_, buffer.data(), buffer.size(), PANDA_MAIN_FUNCTION, desc);
    } else {
        ret = panda::JSNApi::Execute(vm_, desc, PANDA_MAIN_FUNCTION);
    }

    if (panda::JSNApi::HasPendingException(vm_)) {
        HandleUncaughtException(engine);
        return nullptr;
    }
    return CreateUndefined(engine);
}

NativeValue* ArkNativeEngineImpl::LoadArkModule(
    NativeEngine* engine, const char* str, int32_t len, const std::string& fileName)
{
    HILOG_DEBUG("ArkNativeEngineImpl::LoadModule start, buffer = %{public}s", str);
    if (str == nullptr || len <= 0 || fileName.empty()) {
        HILOG_ERROR("fileName is nullptr or source code is nullptr");
        return nullptr;
    }

    bool res = JSNApi::ExecuteModuleFromBuffer(vm_, str, len, fileName);
    if (!res) {
        HILOG_ERROR("Execute module failed");
        return nullptr;
    }

    LocalScope scope(vm_);
    Local<ObjectRef> exportObj = JSNApi::GetExportObjectFromBuffer(vm_, fileName, "default");
    if (exportObj->IsNull()) {
        HILOG_ERROR("Get export object failed");
        return nullptr;
    }

    HILOG_DEBUG("ArkNativeEngineImpl::LoadModule end");
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), exportObj);
}

NativeValue* ArkNativeEngineImpl::LoadModule(NativeEngine* engine, NativeValue* str, const std::string& fileName)
{
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::ArkValueToNativeValue(ArkNativeEngine* engine, Local<JSValueRef> value)
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
    } else {
        result = chunk.New<ArkNativeValue>(engine, value);
    }
    return result;
}

NativeValue* ArkNativeEngineImpl::ValueToNativeValue(NativeEngine* engine, JSValueWrapper& value)
{
    LocalScope scope(vm_);
    Global<JSValueRef> arkValue = value;
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), arkValue.ToLocal(vm_));
}

bool ArkNativeEngineImpl::ExecuteJsBin(const std::string& fileName)
{
    panda::JSExecutionScope executionScope(vm_);
    LocalScope scope(vm_);
    bool ret = JSNApi::Execute(vm_, fileName, PANDA_MAIN_FUNCTION);
    return ret;
}

NativeValue* ArkNativeEngineImpl::CreateBuffer(NativeEngine* engine, void** value, size_t length)
{
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::CreateBufferCopy(NativeEngine* engine, void** value, size_t length, const void* data)
{
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::CreateBufferExternal(
    NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint)
{
    return nullptr;
}

NativeValue* ArkNativeEngineImpl::CreateDate(NativeEngine* engine, double value)
{
    LocalScope scope(vm_);
    return ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), DateRef::New(vm_, value));
}

NativeValue* ArkNativeEngineImpl::CreateBigWords(
    NativeEngine* engine, int sign_bit, size_t word_count, const uint64_t* words)
{
    constexpr int bigintMod = 2; // 2 : used for even number judgment
    bool sign = false;
    if ((sign_bit % bigintMod) == 1) {
        sign = true;
    }
    uint32_t size = (uint32_t)word_count;

    LocalScope scope(vm_);
    Local<JSValueRef> value = BigIntRef::CreateBigWords(vm_, sign, size, words);

    NativeChunk& chunk = static_cast<ArkNativeEngine*>(engine)->GetNativeChunk();
    return chunk.New<ArkNativeBigInt>(static_cast<ArkNativeEngine*>(engine), value);
}

bool ArkNativeEngineImpl::TriggerFatalException(NativeValue* error)
{
    return true;
}

bool ArkNativeEngineImpl::AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue)
{
    return true;
}

void ArkNativeEngineImpl::SetPromiseRejectCallback(
    NativeEngine* engine, NativeReference* rejectCallbackRef, NativeReference* checkCallbackRef)
{
    if (rejectCallbackRef == nullptr || checkCallbackRef == nullptr) {
        HILOG_ERROR("rejectCallbackRef or checkCallbackRef is nullptr");
        return;
    }
    promiseRejectCallbackRef_ = rejectCallbackRef;
    checkCallbackRef_ = checkCallbackRef;
    JSNApi::SetHostPromiseRejectionTracker(
        vm_, reinterpret_cast<void*>(PromiseRejectCallback), reinterpret_cast<void*>(engine));
}

void ArkNativeEngineImpl::PromiseRejectCallback(void* info)
{
    panda::PromiseRejectInfo* promiseRejectInfo = reinterpret_cast<panda::PromiseRejectInfo*>(info);
    ArkNativeEngine* env = reinterpret_cast<ArkNativeEngine*>(promiseRejectInfo->GetData());

    if (env == nullptr) {
        HILOG_ERROR("engine is nullptr");
        return;
    }

    ArkNativeEngineImpl* engineImpl = static_cast<ArkNativeEngineImpl*>(env->GetNativeEngineImpl());
    if (engineImpl == nullptr) {
        HILOG_ERROR("engine impl is nullptr");
        return;
    }
    if (engineImpl->promiseRejectCallbackRef_ == nullptr || engineImpl->checkCallbackRef_ == nullptr) {
        HILOG_ERROR("promiseRejectCallbackRef or checkCallbackRef is nullptr");
        return;
    }

    panda::ecmascript::EcmaVM* vm = engineImpl->GetEcmaVm();
    LocalScope scope(vm);
    Local<JSValueRef> promise = promiseRejectInfo->GetPromise();
    Local<JSValueRef> reason = promiseRejectInfo->GetReason();
    panda::PromiseRejectInfo::PROMISE_REJECTION_EVENT operation = promiseRejectInfo->GetOperation();
    Local<JSValueRef> type(IntegerRef::New(vm, static_cast<int32_t>(operation)));

    Local<JSValueRef> args[] = {type, promise, reason};
    Global<FunctionRef> promiseRejectCallback = *(engineImpl->promiseRejectCallbackRef_->Get());
    if (!promiseRejectCallback.IsEmpty()) {
        promiseRejectCallback->Call(vm, JSValueRef::Undefined(vm), args, 3); // 3 args size
    }

    if (operation == panda::PromiseRejectInfo::PROMISE_REJECTION_EVENT::REJECT) {
        Global<JSValueRef> checkCallback = *(engineImpl->checkCallbackRef_->Get());
        if (!checkCallback.IsEmpty()) {
            JSNApi::SetHostEnqueueJob(vm, checkCallback.ToLocal(vm));
        }
    }
}

#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
void ArkNativeEngineImpl::DumpHeapSnapshot(const std::string& path, bool isVmMode, DumpFormat dumpFormat)
{
    if (dumpFormat == DumpFormat::JSON) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 0, path, isVmMode);
    }
    if (dumpFormat == DumpFormat::BINARY) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 1, path, isVmMode);
    }
    if (dumpFormat == DumpFormat::OTHER) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 2, path, isVmMode); // 2:enum is 2
    }
}

void ArkNativeEngineImpl::DumpHeapSnapshotExt(bool isVmMode, DumpFormat dumpFormat, bool isPrivate)
{
    if (dumpFormat == DumpFormat::JSON) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 0, isVmMode, isPrivate);
    }
    if (dumpFormat == DumpFormat::BINARY) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 1, isVmMode, isPrivate);
    }
    if (dumpFormat == DumpFormat::OTHER) {
        DFXJSNApi::DumpHeapSnapshot(vm_, 2, isVmMode, isPrivate); // 2:enum is 2
    }
}
#else
void ArkNativeEngineImpl::DumpHeapSnapshot(const std::string& path, bool isVmMode, DumpFormat dumpFormat)
{
    HILOG_WARN("ARK does not support snapshot on windows");
}

void ArkNativeEngineImpl::DumpHeapSnapshotExt(bool isVmMode, DumpFormat dumpFormat, bool isPrivate)
{
    HILOG_WARN("ARK does not support snapshot on windows");
}
#endif

#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
bool ArkNativeEngineImpl::BuildNativeAndJsStackTrace(std::string& stackTraceStr)
{
    return DFXJSNApi::BuildNativeAndJsStackTrace(vm_, stackTraceStr);
}
#else
bool ArkNativeEngineImpl::BuildNativeAndJsStackTrace(std::string& stackTraceStr)
{
    HILOG_WARN("ARK does not support dfx on windows");
    return false;
}
#endif

#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
bool ArkNativeEngineImpl::BuildJsStackTrace(std::string& stackTraceStr)
{
    return DFXJSNApi::BuildJsStackTrace(vm_, stackTraceStr);
}
#else
bool ArkNativeEngineImpl::BuildJsStackTrace(std::string& stackTraceStr)
{
    HILOG_WARN("ARK does not support dfx on windows");
    return false;
}
#endif

#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
bool ArkNativeEngineImpl::BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames)
{
    std::vector<ArkJsFrameInfo> arkJsFrames;
    bool sign = DFXJSNApi::BuildJsStackInfoList(vm_, tid, arkJsFrames);
    for (auto jf : arkJsFrames) {
        struct JsFrameInfo jsframe;
        jsframe.fileName = jf.fileName;
        jsframe.functionName = jf.functionName;
        jsframe.pos = jf.pos;
        jsframe.nativePointer = jf.nativePointer;
        jsFrames.emplace_back(jsframe);
    }
    return sign;
}
#else
bool ArkNativeEngineImpl::BuildJsStackInfoList(uint32_t tid, std::vector<JsFrameInfo>& jsFrames)
{
    HILOG_WARN("ARK does not support dfx on windows");
    return false;
}
#endif

#if !defined(PREVIEW)
bool ArkNativeEngineImpl::DeleteWorker(NativeEngine* hostEngine, NativeEngine* workerEngine)
{
    const panda::ecmascript::EcmaVM* hostVM = reinterpret_cast<ArkNativeEngine*>(hostEngine)->GetEcmaVm();
    const panda::ecmascript::EcmaVM* workerVM = reinterpret_cast<ArkNativeEngine*>(workerEngine)->GetEcmaVm();
    if (hostVM != nullptr && workerVM != nullptr) {
        return panda::JSNApi::DeleteWorker(const_cast<EcmaVM*>(hostVM), const_cast<EcmaVM*>(workerVM));
    }
    return false;
}
#else
bool ArkNativeEngineImpl::DeleteWorker(NativeEngine* engine, NativeEngine* workerEngine)
{
    HILOG_WARN("ARK does not support dfx on windows");
    return false;
}
#endif

#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
bool ArkNativeEngineImpl::StartHeapTracking(double timeInterval, bool isVmMode)
{
    return DFXJSNApi::StartHeapTracking(vm_, timeInterval, isVmMode);
}
#else
bool ArkNativeEngineImpl::StartHeapTracking(double timeInterval, bool isVmMode)
{
    HILOG_WARN("ARK does not support snapshot on windows");
    return false;
}
#endif

#if defined(ECMASCRIPT_SUPPORT_SNAPSHOT)
bool ArkNativeEngineImpl::StopHeapTracking(const std::string& filePath)
{
    return DFXJSNApi::StopHeapTracking(vm_, filePath);
}
#else
bool ArkNativeEngineImpl::StopHeapTracking(const std::string& filePath)
{
    HILOG_WARN("ARK does not support snapshot on windows");
    return false;
}
#endif

#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
void ArkNativeEngineImpl::PrintStatisticResult()
{
    DFXJSNApi::PrintStatisticResult(vm_);
}

void ArkNativeEngineImpl::StartRuntimeStat()
{
    DFXJSNApi::StartRuntimeStat(vm_);
}

void ArkNativeEngineImpl::StopRuntimeStat()
{
    DFXJSNApi::StopRuntimeStat(vm_);
}

size_t ArkNativeEngineImpl::GetArrayBufferSize()
{
    return DFXJSNApi::GetArrayBufferSize(vm_);
}

size_t ArkNativeEngineImpl::GetHeapTotalSize()
{
    return DFXJSNApi::GetHeapTotalSize(vm_);
}

size_t ArkNativeEngineImpl::GetHeapUsedSize()
{
    return DFXJSNApi::GetHeapUsedSize(vm_);
}

void ArkNativeEngineImpl::NotifyApplicationState(bool inBackground)
{
    DFXJSNApi::NotifyApplicationState(vm_, inBackground);
}

void ArkNativeEngineImpl::NotifyIdleTime(int idleMicroSec)
{
    DFXJSNApi::NotifyIdleTime(vm_, idleMicroSec);
}

void ArkNativeEngineImpl::NotifyMemoryPressure(bool inHighMemoryPressure)
{
    DFXJSNApi::NotifyMemoryPressure(vm_, inHighMemoryPressure);
}
#else
void ArkNativeEngineImpl::PrintStatisticResult()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngineImpl::StartRuntimeStat()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngineImpl::StopRuntimeStat()
{
    HILOG_WARN("ARK does not support dfx on windows");
}

size_t ArkNativeEngineImpl::GetArrayBufferSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

size_t ArkNativeEngineImpl::GetHeapTotalSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

size_t ArkNativeEngineImpl::GetHeapUsedSize()
{
    HILOG_WARN("ARK does not support dfx on windows");
    return 0;
}

void ArkNativeEngineImpl::NotifyApplicationState([[maybe_unused]] bool inBackground)
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngineImpl::NotifyIdleTime([[maybe_unused]] int idleMicroSec)
{
    HILOG_WARN("ARK does not support dfx on windows");
}

void ArkNativeEngineImpl::NotifyMemoryPressure([[maybe_unused]] bool inHighMemoryPressure)
{
    HILOG_WARN("ARK does not support dfx on windows");
}
#endif

void ArkNativeEngineImpl::RegisterUncaughtExceptionHandler(UncaughtExceptionCallback callback)
{
    JSNApi::EnableUserUncaughtErrorHandler(vm_);
    uncaughtExceptionCallback_ = callback;
}

void ArkNativeEngineImpl::HandleUncaughtException(NativeEngine* engine)
{
    if (uncaughtExceptionCallback_ == nullptr) {
        return;
    }

    LocalScope scope(vm_);
    Local<ObjectRef> exception = JSNApi::GetAndClearUncaughtException(vm_);
    if (!exception.IsEmpty() && !exception->IsHole()) {
        uncaughtExceptionCallback_(ArkValueToNativeValue(static_cast<ArkNativeEngine*>(engine), exception));
    }
}

bool ArkNativeEngineImpl::HasPendingException()
{
    return panda::JSNApi::HasPendingException(vm_);
}

inline void ArkNativeEngineImpl::SetModuleName(ArkNativeObject *nativeObj, std::string moduleName)
{
#ifdef ENABLE_HITRACE
    if (ArkNativeEngineImpl::napiProfilerEnabled) {
        nativeObj->SetModuleName(moduleName);
    }
#endif
}

bool ArkNativeEngineImpl::IsMixedDebugEnabled()
{
    return JSNApi::IsMixedDebugEnabled(vm_);
}

void ArkNativeEngineImpl::NotifyNativeCalling(const void *nativeAddress)
{
    JSNApi::NotifyNativeCalling(vm_, nativeAddress);
}
