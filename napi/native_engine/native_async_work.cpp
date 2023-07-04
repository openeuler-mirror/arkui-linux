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

#include "native_async_work.h"

#ifdef ENABLE_HITRACE
#include "hitrace/trace.h"
#include "hitrace_meter.h"
#include "parameter.h"
#include <securec.h>
#endif
#ifdef ENABLE_CONTAINER_SCOPE
#include "core/common/container_scope.h"
#endif

#include "napi/native_api.h"
#include "native_engine.h"
#include "utils/log.h"

#ifdef ENABLE_CONTAINER_SCOPE
using OHOS::Ace::ContainerScope;
#endif

#ifdef ENABLE_HITRACE
bool g_napiTraceIdEnabled = false;
bool g_ParamUpdated = false;
constexpr size_t TRACE_BUFFER_SIZE = 120;
constexpr size_t TRACEID_PARAM_SIZE = 10;
#endif

NativeAsyncWork::NativeAsyncWork(NativeEngine* engine,
                                 NativeAsyncExecuteCallback execute,
                                 NativeAsyncCompleteCallback complete,
                                 const std::string &asyncResourceName,
                                 void* data)
    : work_({ 0 }), engine_(engine), execute_(execute), complete_(complete), data_(data)
{
    work_.data = this;
    (void)asyncResourceName;
#ifdef ENABLE_HITRACE
    if (!g_ParamUpdated) {
        char napiTraceIdEnabled[TRACEID_PARAM_SIZE] = {0};
        int ret = GetParameter("persist.hiviewdfx.napitraceid.enabled", "false",
            napiTraceIdEnabled, sizeof(napiTraceIdEnabled));
        if (ret > 0 && strcmp(napiTraceIdEnabled, "true") == 0) {
            g_napiTraceIdEnabled = true;
        }
        g_ParamUpdated = true;
    }
    bool createdTraceId = false;
    traceId_ = std::make_unique<OHOS::HiviewDFX::HiTraceId>(OHOS::HiviewDFX::HiTraceChain::GetId());
    if (g_napiTraceIdEnabled && (!traceId_ || !traceId_->IsValid())) {
        traceId_ = std::make_unique<OHOS::HiviewDFX::HiTraceId>(
            OHOS::HiviewDFX::HiTraceChain::Begin("New NativeAsyncWork", 0));
        createdTraceId = true;
    }
    char traceStr[TRACE_BUFFER_SIZE] = {0};
    if (sprintf_s(traceStr, sizeof(traceStr),
        "name:%s, traceid:0x%x", asyncResourceName.c_str(), traceId_->GetChainId()) < 0) {
        HILOG_ERROR("Get traceStr fail");
    }
    traceDescription_ = traceStr;
    if (createdTraceId) {
        OHOS::HiviewDFX::HiTraceChain::ClearId();
    }
#endif
#ifdef ENABLE_CONTAINER_SCOPE
    containerScopeId_ = ContainerScope::CurrentId();
#endif
}

NativeAsyncWork::~NativeAsyncWork() = default;

bool NativeAsyncWork::Queue()
{
    uv_loop_t* loop = engine_->GetUVLoop();
    if (loop == nullptr) {
        HILOG_ERROR("Get loop failed");
        return false;
    }
#ifdef ENABLE_HITRACE
    StartTrace(HITRACE_TAG_ACE, "Napi queue, " + this->GetTraceDescription());
#endif
    int status = uv_queue_work(loop, &work_, AsyncWorkCallback, AsyncAfterWorkCallback);
#ifdef ENABLE_HITRACE
    FinishTrace(HITRACE_TAG_ACE);
#endif
    if (status != 0) {
        HILOG_ERROR("uv_queue_work failed");
        return false;
    }
    return true;
}

bool NativeAsyncWork::Cancel()
{
    int status = uv_cancel((uv_req_t*)&work_);
    if (status != 0) {
        HILOG_ERROR("uv_cancel failed");
        return false;
    }
    return true;
}

void NativeAsyncWork::AsyncWorkCallback(uv_work_t* req)
{
    if (req == nullptr) {
        HILOG_ERROR("req is nullptr");
        return;
    }

    auto that = reinterpret_cast<NativeAsyncWork*>(req->data);

#ifdef ENABLE_CONTAINER_SCOPE
    ContainerScope containerScope(that->containerScopeId_);
#endif
#ifdef ENABLE_HITRACE
    StartTrace(HITRACE_TAG_ACE, "Napi execute, " + that->GetTraceDescription());
    if (that->traceId_ && that->traceId_->IsValid()) {
        OHOS::HiviewDFX::HiTraceChain::SetId(*(that->traceId_.get()));
        that->execute_(that->engine_, that->data_);
        FinishTrace(HITRACE_TAG_ACE);
        OHOS::HiviewDFX::HiTraceChain::ClearId();
        return;
    }
    FinishTrace(HITRACE_TAG_ACE);
#endif
    that->execute_(that->engine_, that->data_);
}

void NativeAsyncWork::AsyncAfterWorkCallback(uv_work_t* req, int status)
{
    if (req == nullptr) {
        HILOG_ERROR("req is nullptr");
        return;
    }

    auto that = reinterpret_cast<NativeAsyncWork*>(req->data);

    NativeScopeManager* scopeManager = that->engine_->GetScopeManager();
    if (scopeManager == nullptr) {
        HILOG_ERROR("Get scope manager failed");
        return;
    }

    NativeScope* scope = scopeManager->Open();
    if (scope == nullptr) {
        HILOG_ERROR("Open scope failed");
        return;
    }

    napi_status nstatus = napi_generic_failure;

    switch (status) {
        case 0:
            nstatus = napi_ok;
            break;
        case (int)UV_EINVAL:
            nstatus = napi_invalid_arg;
            break;
        case (int)UV_ECANCELED:
            nstatus = napi_cancelled;
            break;
        default:
            nstatus = napi_generic_failure;
    }
#ifdef ENABLE_CONTAINER_SCOPE
    ContainerScope containerScope(that->containerScopeId_);
#endif
#ifdef ENABLE_HITRACE
    StartTrace(HITRACE_TAG_ACE, "Napi complete, " + that->GetTraceDescription());
    if (that->traceId_ && that->traceId_->IsValid()) {
        OHOS::HiviewDFX::HiTraceChain::SetId(*(that->traceId_.get()));
        that->complete_(that->engine_, nstatus, that->data_);
        FinishTrace(HITRACE_TAG_ACE);
        OHOS::HiviewDFX::HiTraceChain::ClearId();
        scopeManager->Close(scope);
        return;
    }
    FinishTrace(HITRACE_TAG_ACE);
#endif
    that->complete_(that->engine_, nstatus, that->data_);
    scopeManager->Close(scope);
}

std::string NativeAsyncWork::GetTraceDescription()
{
    return traceDescription_;
}
