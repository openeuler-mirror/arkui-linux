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

#include "ark_native_function.h"

#ifdef ENABLE_CONTAINER_SCOPE
#include "core/common/container_scope.h"
#endif

#include "utils/log.h"

using panda::ArrayRef;
using panda::NativePointerRef;
using panda::FunctionRef;
using panda::StringRef;
using panda::JsiRuntimeCallInfo;
static constexpr uint32_t MAX_CHUNK_ARRAY_SIZE = 10;

ArkNativeFunction::ArkNativeFunction(ArkNativeEngine* engine, Local<JSValueRef> value) : ArkNativeObject(engine, value)
{
#ifdef ENABLE_CONTAINER_SCOPE
    scopeId_ = OHOS::Ace::ContainerScope::CurrentId();
#endif
}

// common function
ArkNativeFunction::ArkNativeFunction(ArkNativeEngine* engine,
                                     const char* name,
                                     size_t length,
                                     NativeCallback cb,
                                     void* value)
    : ArkNativeFunction(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    auto vm = const_cast<EcmaVM*>(engine->GetEcmaVm());
    LocalScope scope(vm);

    NativeFunctionInfo* funcInfo = NativeFunctionInfo::CreateNewInstance();
    if (funcInfo == nullptr) {
        HILOG_ERROR("funcInfo is nullptr");
        return;
    }
    funcInfo->engine = engine;
    funcInfo->callback = cb;
    funcInfo->data = value;

    Local<FunctionRef> fn = FunctionRef::New(vm, NativeFunctionCallBack,
                                             [](void* externalPointer, void* data) {
                                                auto info = reinterpret_cast<NativeFunctionInfo*>(data);
                                                if (info != nullptr) {
                                                    delete info;
                                                }
                                             },
                                             reinterpret_cast<void*>(funcInfo), true);
    Local<StringRef> fnName = StringRef::NewFromUtf8(vm, name);
    fn->SetName(vm, fnName);

    Global<JSValueRef> globalFn(vm, fn);
    value_ = globalFn;
}


// class function
ArkNativeFunction::ArkNativeFunction(ArkNativeEngine* engine,
                                     const char* name,
                                     NativeCallback cb,
                                     void* value)
    : ArkNativeFunction(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    auto vm = const_cast<EcmaVM*>(engine->GetEcmaVm());
    LocalScope scope(vm);

    NativeFunctionInfo* funcInfo = NativeFunctionInfo::CreateNewInstance();
    if (funcInfo == nullptr) {
        HILOG_ERROR("funcInfo is nullptr");
        return;
    }
    funcInfo->engine = engine;
    funcInfo->callback = cb;
    funcInfo->data = value;

    Local<FunctionRef> fn = FunctionRef::NewClassFunction(vm, NativeFunctionCallBack,
                                                          [](void* externalPointer, void* data) {
                                                              auto info = reinterpret_cast<NativeFunctionInfo*>(data);
                                                              if (info != nullptr) {
                                                                 delete info;
                                                              }
                                                          },
                                                          reinterpret_cast<void*>(funcInfo), true);
    Local<StringRef> fnName = StringRef::NewFromUtf8(vm, name);
    fn->SetName(vm, fnName);

    Global<JSValueRef> globalFn(vm, fn);
    value_ = globalFn;
}

ArkNativeFunction::~ArkNativeFunction()
{
}

void* ArkNativeFunction::GetInterface(int interfaceId)
{
    return (NativeFunction::INTERFACE_ID == interfaceId) ? (NativeFunction*)this
                                                         : ArkNativeObject::GetInterface(interfaceId);
}

Local<JSValueRef> ArkNativeFunction::NativeFunctionCallBack(JsiRuntimeCallInfo *runtimeInfo)
{
    EcmaVM *vm = runtimeInfo->GetVM();
    panda::EscapeLocalScope scope(vm);
    auto info = reinterpret_cast<NativeFunctionInfo*>(runtimeInfo->GetData());
    auto engine = reinterpret_cast<ArkNativeEngine*>(info->engine);
    auto cb = info->callback;
    if (engine == nullptr) {
        HILOG_ERROR("native engine is null");
        return JSValueRef::Undefined(vm);
    }

    NativeCallbackInfo cbInfo = { 0 };
    NativeScopeManager* scopeManager = engine->GetScopeManager();
    if (scopeManager == nullptr) {
        HILOG_ERROR("scope manager is null");
        return JSValueRef::Undefined(vm);
    }

    StartNapiProfilerTrace(runtimeInfo);
    NativeScope* nativeScope = scopeManager->Open();
    cbInfo.thisVar = ArkNativeEngine::ArkValueToNativeValue(engine, runtimeInfo->GetThisRef());
    cbInfo.function = ArkNativeEngine::ArkValueToNativeValue(engine, runtimeInfo->GetNewTargetRef());
    cbInfo.argc = static_cast<size_t>(runtimeInfo->GetArgsNumber());
    cbInfo.argv = nullptr;
    cbInfo.functionInfo = info;
    if (cbInfo.argc > 0) {
        if (cbInfo.argc > MAX_CHUNK_ARRAY_SIZE) {
            cbInfo.argv = new NativeValue* [cbInfo.argc];
        } else {
            cbInfo.argv = scopeManager->GetNativeChunk().NewArray<NativeValue *>(cbInfo.argc);
        }
        for (size_t i = 0; i < cbInfo.argc; i++) {
            cbInfo.argv[i] = ArkNativeEngine::ArkValueToNativeValue(engine, runtimeInfo->GetCallArgRef(i));
        }
    }

    if (engine->IsMixedDebugEnabled()) {
        engine->NotifyNativeCalling(reinterpret_cast<void *>(cb));
    }

    NativeValue* result = nullptr;
    if (cb != nullptr) {
        result = cb(engine, &cbInfo);
    }

    if (cbInfo.argv != nullptr) {
        if (cbInfo.argc > MAX_CHUNK_ARRAY_SIZE) {
            delete[] cbInfo.argv;
        } else {
            scopeManager->GetNativeChunk().Delete(cbInfo.argv);
        }
        cbInfo.argv = nullptr;
    }

    Local<JSValueRef> localRet = JSValueRef::Undefined(vm);
    if (result == nullptr) {
        if (engine->IsExceptionPending()) {
            [[maybe_unused]] NativeValue* error = engine->GetAndClearLastException();
        }
    } else {
        Global<JSValueRef> ret = *result;
        localRet = ret.ToLocal(vm);
    }
    scopeManager->Close(nativeScope);
    FinishNapiProfilerTrace();
    if (localRet.IsEmpty()) {
        return scope.Escape(JSValueRef::Undefined(vm));
    }
    return scope.Escape(localRet);
}

void* ArkNativeFunction::GetNativePtrCallBack(void* data)
{
    auto info = reinterpret_cast<NativeFunctionInfo*>(data);
    auto cb = reinterpret_cast<void*>(info->callback);
    return cb;
}

NativeValue* ArkNativeFunction::GetFunctionPrototype()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<FunctionRef> func = value_;
    Local<JSValueRef> prototype = func->GetFunctionPrototype(vm);
    return ArkNativeEngine::ArkValueToNativeValue(engine_, prototype);
}

std::string ArkNativeFunction::GetSourceCodeInfo(ErrorPos pos)
{
    if (pos.first == 0) {
        return "";
    }
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<FunctionRef> func = value_;
    uint32_t line = pos.first;
    uint32_t column = pos.second;
    Local<panda::StringRef> sourceCode = func->GetSourceCode(vm, line);
    std::string sourceCodeStr = sourceCode->ToString();
    if (sourceCodeStr.empty()) {
        return "";
    }
    std::string sourceCodeInfo = "SourceCode:\n";
    sourceCodeInfo.append(sourceCodeStr).append("\n");
    for (uint32_t k = 0; k < column - 1; k++) {
        sourceCodeInfo.push_back(' ');
    }
    sourceCodeInfo.append("^\n");
    return sourceCodeInfo;
}
