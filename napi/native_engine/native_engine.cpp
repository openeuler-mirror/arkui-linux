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

#include "native_engine.h"
#include "native_engine/native_engine_interface.h"
#include "utils/log.h"

static GetContainerScopeIdCallback getContainerScopeIdFunc_;
static ContainerScopeCallback initContainerScopeFunc_;
static ContainerScopeCallback finishContainerScopeFunc_;

NativeEngine::NativeEngine(void* jsEngine) : jsEngine_(jsEngine) {}

NativeEngine::~NativeEngine()
{
    std::lock_guard<std::mutex> insLock(instanceDataLock_);
    FinalizerInstanceData();
}

NativeScopeManager* NativeEngine::GetScopeManager()
{
    return nativeEngineImpl_->GetScopeManager();
}

NativeReferenceManager* NativeEngine::GetReferenceManager()
{
    return nativeEngineImpl_->GetReferenceManager();
}

NativeModuleManager* NativeEngine::GetModuleManager()
{
    return nativeEngineImpl_->GetModuleManager();
}

NativeCallbackScopeManager* NativeEngine::GetCallbackScopeManager()
{
    return nativeEngineImpl_->GetCallbackScopeManager();
}

uv_loop_t* NativeEngine::GetUVLoop() const
{
    return nativeEngineImpl_->GetUVLoop();
}

pthread_t NativeEngine::GetTid() const
{
    return nativeEngineImpl_->GetTid();
}

bool NativeEngine::ReinitUVLoop()
{
    return nativeEngineImpl_->ReinitUVLoop();
}

void NativeEngine::Loop(LoopMode mode, bool needSync)
{
    nativeEngineImpl_->Loop(mode, needSync);
}

NativeAsyncWork* NativeEngine::CreateAsyncWork(NativeValue* asyncResource, NativeValue* asyncResourceName,
    NativeAsyncExecuteCallback execute, NativeAsyncCompleteCallback complete, void* data)
{
    return nativeEngineImpl_->CreateAsyncWork(this, asyncResource, asyncResourceName, execute, complete, data);
}

NativeAsyncWork* NativeEngine::CreateAsyncWork(const std::string& asyncResourceName, NativeAsyncExecuteCallback execute,
    NativeAsyncCompleteCallback complete, void* data)
{
    return nativeEngineImpl_->CreateAsyncWork(this, asyncResourceName, execute, complete, data);
}

NativeSafeAsyncWork* NativeEngine::CreateSafeAsyncWork(NativeValue* func, NativeValue* asyncResource,
    NativeValue* asyncResourceName, size_t maxQueueSize, size_t threadCount, void* finalizeData,
    NativeFinalize finalizeCallback, void* context, NativeThreadSafeFunctionCallJs callJsCallback)
{
    return nativeEngineImpl_->CreateSafeAsyncWork(this, func, asyncResource, asyncResourceName, maxQueueSize,
        threadCount, finalizeData, finalizeCallback, context, callJsCallback);
}

NativeErrorExtendedInfo* NativeEngine::GetLastError()
{
    return nativeEngineImpl_->GetLastError();
}

void NativeEngine::SetLastError(int errorCode, uint32_t engineErrorCode, void* engineReserved)
{
    nativeEngineImpl_->SetLastError(errorCode, engineErrorCode, engineReserved);
}

void NativeEngine::ClearLastError()
{
    nativeEngineImpl_->ClearLastError();
}

void NativeEngine::EncodeToUtf8(
    NativeValue* nativeValue, char* buffer, int32_t* written, size_t bufferSize, int32_t* nchars)
{
    nativeEngineImpl_->EncodeToUtf8(nativeValue, buffer, written, bufferSize, nchars);
}

void NativeEngine::EncodeToChinese(NativeValue* nativeValue, std::string& buffer, const std::string& encoding)
{
    nativeEngineImpl_->EncodeToChinese(nativeValue, buffer, encoding);
}

#if !defined(PREVIEW)
void NativeEngine::CheckUVLoop()
{
    nativeEngineImpl_->CheckUVLoop();
}

void NativeEngine::CancelCheckUVLoop()
{
    nativeEngineImpl_->CancelCheckUVLoop();
}
#endif

void NativeEngine::SetPostTask(PostTask postTask)
{
    nativeEngineImpl_->SetPostTask(postTask);
}

void NativeEngine::TriggerPostTask()
{
    nativeEngineImpl_->TriggerPostTask();
}

void* NativeEngine::GetJsEngine()
{
    return nativeEngineImpl_->GetJsEngine();
}

// register init worker func
void NativeEngine::SetInitWorkerFunc(InitWorkerFunc func)
{
    initWorkerFunc_ = func;
}
void NativeEngine::SetGetAssetFunc(GetAssetFunc func)
{
    getAssetFunc_ = func;
}
void NativeEngine::SetOffWorkerFunc(OffWorkerFunc func)
{
    offWorkerFunc_ = func;
}
// call init worker func
bool NativeEngine::CallInitWorkerFunc(NativeEngine* engine)
{
    if (initWorkerFunc_ != nullptr) {
        initWorkerFunc_(engine);
        return true;
    }
    return false;
}
bool NativeEngine::CallGetAssetFunc(const std::string& uri, std::vector<uint8_t>& content, std::string& ami)
{
    if (getAssetFunc_ != nullptr) {
        getAssetFunc_(uri, content, ami);
        return true;
    }
    return false;
}
bool NativeEngine::CallOffWorkerFunc(NativeEngine* engine)
{
    if (offWorkerFunc_ != nullptr) {
        offWorkerFunc_(engine);
        return true;
    }
    return false;
}

// adapt worker to ace container
void NativeEngine::SetGetContainerScopeIdFunc(GetContainerScopeIdCallback func)
{
    getContainerScopeIdFunc_ = func;
}
void NativeEngine::SetInitContainerScopeFunc(ContainerScopeCallback func)
{
    initContainerScopeFunc_ = func;
}
void NativeEngine::SetFinishContainerScopeFunc(ContainerScopeCallback func)
{
    finishContainerScopeFunc_ = func;
}
int32_t NativeEngine::GetContainerScopeIdFunc()
{
    int32_t scopeId = -1;
    if (getContainerScopeIdFunc_ != nullptr) {
        scopeId = getContainerScopeIdFunc_();
    }
    return scopeId;
}
bool NativeEngine::InitContainerScopeFunc(int32_t id)
{
    if (initContainerScopeFunc_ != nullptr) {
        initContainerScopeFunc_(id);
        return true;
    }
    return false;
}
bool NativeEngine::FinishContainerScopeFunc(int32_t id)
{
    if (finishContainerScopeFunc_ != nullptr) {
        finishContainerScopeFunc_(id);
        return true;
    }
    return false;
}

#if !defined(PREVIEW)
void NativeEngine::CallDebuggerPostTaskFunc(std::function<void()>&& task)
{
    if (debuggerPostTaskFunc_ != nullptr) {
        debuggerPostTaskFunc_(std::move(task));
    }
}

void NativeEngine::SetDebuggerPostTaskFunc(DebuggerPostTask func)
{
    debuggerPostTaskFunc_ = func;
}
#endif

void NativeEngine::AddCleanupHook(CleanupCallback fun, void* arg)
{
    nativeEngineImpl_->AddCleanupHook(fun, arg);
}

void NativeEngine::RemoveCleanupHook(CleanupCallback fun, void* arg)
{
    nativeEngineImpl_->RemoveCleanupHook(fun, arg);
}

void NativeEngine::RunCleanup()
{
    nativeEngineImpl_->RunCleanup();
}

void NativeEngine::CleanupHandles()
{
    nativeEngineImpl_->CleanupHandles();
}

void NativeEngine::IncreaseWaitingRequestCounter()
{
    nativeEngineImpl_->IncreaseWaitingRequestCounter();
}

void NativeEngine::DecreaseWaitingRequestCounter()
{
    nativeEngineImpl_->DecreaseWaitingRequestCounter();
}

void NativeEngine::RegisterWorkerFunction(const NativeEngine* engine)
{
    if (engine == nullptr) {
        return;
    }
    SetInitWorkerFunc(engine->initWorkerFunc_);
    SetGetAssetFunc(engine->getAssetFunc_);
    SetOffWorkerFunc(engine->offWorkerFunc_);
}

NativeValue* NativeEngine::RunScript(const char* path)
{
    std::vector<uint8_t> scriptContent;
    std::string pathStr(path);
    std::string ami;
    if (!CallGetAssetFunc(pathStr, scriptContent, ami)) {
        HILOG_ERROR("Get asset error");
        return nullptr;
    }
    HILOG_INFO("asset size is %{public}zu", scriptContent.size());
    return RunActor(scriptContent, ami.c_str());
}

NativeEngineInterface* NativeEngine::GetNativeEngineImpl()
{
    return nativeEngineImpl_;
}

void NativeEngine::SetInstanceData(void* data, NativeFinalize finalize_cb, void* hint)
{
    HILOG_INFO("NativeEngineWraper::%{public}s, start.", __func__);
    std::lock_guard<std::mutex> insLock(instanceDataLock_);
    FinalizerInstanceData();
    instanceDataInfo_.engine = this;
    instanceDataInfo_.callback = finalize_cb;
    instanceDataInfo_.nativeObject = data;
    instanceDataInfo_.hint = hint;
}

void NativeEngine::GetInstanceData(void** data)
{
    HILOG_INFO("NativeEngineWraper::%{public}s, start.", __func__);
    std::lock_guard<std::mutex> insLock(instanceDataLock_);
    if (data) {
        *data = instanceDataInfo_.nativeObject;
    }
}

void NativeEngine::FinalizerInstanceData(void)
{
    if (instanceDataInfo_.engine != nullptr && instanceDataInfo_.callback != nullptr) {
        instanceDataInfo_.callback(instanceDataInfo_.engine, instanceDataInfo_.nativeObject, instanceDataInfo_.hint);
    }
    instanceDataInfo_.engine = nullptr;
    instanceDataInfo_.callback = nullptr;
    instanceDataInfo_.nativeObject = nullptr;
    instanceDataInfo_.hint = nullptr;
}

const char* NativeEngine::GetModuleFileName()
{
    HILOG_INFO("%{public}s, start.", __func__);
    NativeModuleManager* moduleManager = nativeEngineImpl_->GetModuleManager();
    HILOG_INFO("NativeEngineWraper::GetFileName GetModuleManager");
    if (moduleManager != nullptr) {
        const char* moduleFileName = moduleManager->GetModuleFileName(moduleName_.c_str(), isAppModule_);
        HILOG_INFO("NativeEngineWraper::GetFileName end filename:%{public}s", moduleFileName);
        return moduleFileName;
    }
    return nullptr;
}

void NativeEngine::SetModuleFileName(std::string& moduleName)
{
    moduleName_ = moduleName;
}

void NativeEngine::DeleteEngine()
{
    if (nativeEngineImpl_) {
        delete nativeEngineImpl_;
        nativeEngineImpl_ = nullptr;
    }
}

void NativeEngine::SetExtensionInfos(std::unordered_map<std::string, int32_t>&& extensionInfos)
{
    extensionInfos_ = extensionInfos;
}

const std::unordered_map<std::string, int32_t>& NativeEngine::GetExtensionInfos()
{
    return extensionInfos_;
}

void NativeEngine::SetModuleBlocklist(std::unordered_map<int32_t, std::unordered_set<std::string>>&& blocklist)
{
    if (!nativeEngineImpl_) {
        return;
    }
    NativeModuleManager* moduleManager = nativeEngineImpl_->GetModuleManager();
    if (!moduleManager) {
        return;
    }
    moduleManager->SetModuleBlocklist(std::forward<decltype(blocklist)>(blocklist));
}