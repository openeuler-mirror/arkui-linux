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

#ifndef FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_ARK_NATIVE_VALUE_ARK_NATIVE_FUNCTION_H
#define FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_ARK_NATIVE_VALUE_ARK_NATIVE_FUNCTION_H

#include "ark_native_object.h"

#ifdef ENABLE_HITRACE
#include <sys/prctl.h>
#include "hitrace_meter.h"
#include "ark_native_engine_impl.h"
#endif

class ArkNativeFunction : public ArkNativeObject, public NativeFunction {
public:
    ArkNativeFunction(ArkNativeEngine* engine, Local<JSValueRef> value);
    ArkNativeFunction(ArkNativeEngine* engine, const char* name, size_t length, NativeCallback cb, void* value);
    ArkNativeFunction(ArkNativeEngine* engine, const char* name, NativeCallback cb, void* value);  // Used for class
    ~ArkNativeFunction() override;

    void* GetInterface(int interfaceId) override;

    static void* GetNativePtrCallBack(void* data);

    NativeValue* GetFunctionPrototype();

    std::string GetSourceCodeInfo(ErrorPos pos) override;

#ifdef ENABLE_CONTAINER_SCOPE
    inline int32_t GetScopeId()
    {
        return scopeId_;
    }
#endif

private:
    static Local<JSValueRef> NativeFunctionCallBack(panda::JsiRuntimeCallInfo *info);
#ifdef ENABLE_CONTAINER_SCOPE
    int32_t scopeId_ = -1;
#endif

    static inline void StartNapiProfilerTrace(panda::JsiRuntimeCallInfo *runtimeInfo)
    {
#ifdef ENABLE_HITRACE
        if (ArkNativeEngineImpl::napiProfilerEnabled) {
            EcmaVM *vm = runtimeInfo->GetVM();
            LocalScope scope(vm);
            Local<panda::FunctionRef> fn = runtimeInfo->GetFunctionRef();
            Local<panda::StringRef> nameRef = fn->GetName(vm);
            char threadName[128];
            prctl(PR_GET_NAME, threadName);
            StartTraceArgs(HITRACE_TAG_ACE, "Napi called:%s, tname:%s", nameRef->ToString().c_str(), threadName);
        }
#endif
    }

    static inline void FinishNapiProfilerTrace()
    {
#ifdef ENABLE_HITRACE
        if (ArkNativeEngineImpl::napiProfilerEnabled) {
            FinishTrace(HITRACE_TAG_ACE);
        }
#endif
    }
};

#endif /* FOUNDATION_ACE_NAPI_NATIVE_ENGINE_IMPL_ARK_NATIVE_VALUE_ARK_NATIVE_FUNCTION_H */
