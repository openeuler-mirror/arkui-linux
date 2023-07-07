/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
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
#include "adapter/ohos/entrance/pa_engine/backend_delegate_impl.h"

#include <atomic>
#include <string>

#include "ability.h"
#include "ability_info.h"

#include "base/log/ace_trace.h"
#include "base/log/event_report.h"
#include "base/utils/utils.h"
#include "core/common/ace_application_info.h"
#include "core/common/platform_bridge.h"
#include "core/components/dialog/dialog_component.h"
#include "core/components/toast/toast_component.h"
#include "frameworks/bridge/common/manifest/manifest_parser.h"
#include "frameworks/bridge/common/utils/utils.h"

namespace OHOS::Ace {
namespace {
const char PA_MANIFEST_JSON[] = "manifest.json";
} // namespace

BackendDelegateImpl::BackendDelegateImpl(const BackendDelegateImplBuilder& builder)
    : loadJs_(builder.loadCallback), dispatcherCallback_(builder.transferCallback),
      asyncEvent_(builder.asyncEventCallback), syncEvent_(builder.syncEventCallback), insert_(builder.insertCallback),
      call_(builder.callCallback), query_(builder.queryCallback), update_(builder.updateCallback),
      delete_(builder.deleteCallback), batchInsert_(builder.batchInsertCallback), getType_(builder.getTypeCallback),
      getFileTypes_(builder.getFileTypesCallback), openFile_(builder.openFileCallback),
      openRawFile_(builder.openRawFileCallback), normalizeUri_(builder.normalizeUriCallback),
      denormalizeUri_(builder.denormalizeUriCallback), destroyApplication_(builder.destroyApplicationCallback),
      commandApplication_(builder.commandApplicationCallback), connectCallback_(builder.connectCallback),
      disConnectCallback_(builder.disConnectCallback), createCallback_(builder.createFormCallback),
      deleteCallback_(builder.deleteFormCallback), triggerEventCallback_(builder.triggerEventCallback),
      updateCallback_(builder.updateFormCallback), castTemptoNormalCallback_(builder.castTemptoNormalCallback),
      visibilityChangedCallback_(builder.visibilityChangedCallback),
      acquireStateCallback_(builder.acquireStateCallback), commandCallback_(builder.commandCallback),
      shareFormCallback_(builder.shareFormCallback), dumpHeapSnapshotCallback_(builder.dumpHeapSnapshotCallback),
      manifestParser_(AceType::MakeRefPtr<Framework::ManifestParser>()), type_(builder.type),
      taskExecutor_(builder.taskExecutor)
{}

void BackendDelegateImpl::ParseManifest()
{
    std::call_once(onceFlag_, [this]() {
        std::string jsonContent;
        if (!GetAssetContent(PA_MANIFEST_JSON, jsonContent)) {
            LOGE("RunPa parse manifest.json failed");
            EventReport::SendFormException(FormExcepType::RUN_PAGE_ERR);
            return;
        }
        manifestParser_->Parse(jsonContent);
    });
}

void BackendDelegateImpl::RunPa(const std::string& url, const OHOS::AAFwk::Want& want)
{
    ACE_SCOPED_TRACE("BackendDelegateImpl::RunService");
    LOGD("dDelegateImpl RunService url=%{private}s", url.c_str());
    ParseManifest();
    // if mutli pa in one hap should parse manifest get right url
    LoadPa(url, want);
}

void BackendDelegateImpl::SetJsMessageDispatcher(const RefPtr<JsMessageDispatcher>& dispatcher) const
{
    taskExecutor_->PostTask([dispatcherCallback = dispatcherCallback_, dispatcher] { dispatcherCallback(dispatcher); },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::SetCallBackResult(const std::string& callBackId, const std::string& result)
{
    jsCallBackResult_.try_emplace(Framework::StringToInt(callBackId), result);
}

void BackendDelegateImpl::PostJsTask(std::function<void()>&& task)
{
    taskExecutor_->PostTask(task, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::PostDelayedJsTask(std::function<void()>&& task, uint32_t delayTime)
{
    taskExecutor_->PostDelayedTask(task, TaskExecutor::TaskType::JS, delayTime);
}

bool BackendDelegateImpl::GetAssetContent(const std::string& url, std::string& content)
{
    return Framework::GetAssetContentImpl(assetManager_, url, content);
}

bool BackendDelegateImpl::GetAssetContent(const std::string& url, std::vector<uint8_t>& content)
{
    return Framework::GetAssetContentImpl(assetManager_, url, content);
}

std::string BackendDelegateImpl::GetAssetPath(const std::string& url)
{
    return Framework::GetAssetPathImpl(assetManager_, url);
}

void BackendDelegateImpl::LoadPa(const std::string& url, const OHOS::AAFwk::Want& want)
{
    LOGD("BackendDelegateImpl LoadPa: %{private}s.", url.c_str());

    std::unique_lock<std::mutex> lock(LoadPaMutex_);
    if (isStagingPageExist_) {
        if (condition_.wait_for(lock, std::chrono::seconds(1)) == std::cv_status::timeout) {
            LOGE("BackendDelegateImpl, load page failed, waiting for current page loading finish.");
            return;
        }
    }

    isStagingPageExist_ = true;

    if (GetType() == BackendType::FORM) {
        taskExecutor_->PostSyncTask(
            [weak = AceType::WeakClaim(this), url, want] {
                auto delegate = weak.Upgrade();
                if (!delegate) {
                    return;
                }
                delegate->loadJs_(url, want);
            },
            TaskExecutor::TaskType::JS);
    } else {
        taskExecutor_->PostTask(
            [weak = AceType::WeakClaim(this), url, want] {
                auto delegate = weak.Upgrade();
                CHECK_NULL_VOID_NOLOG(delegate);
                delegate->loadJs_(url, want);
            },
            TaskExecutor::TaskType::JS);
    }
}

void BackendDelegateImpl::TransferJsResponseData(int32_t callbackId, int32_t code, std::vector<uint8_t>&& data) const
{
    LOGI("BackendDelegateImpl TransferJsResponseData");
    auto weak = AceType::WeakClaim(AceType::RawPtr(groupJsBridge_));
    taskExecutor_->PostTask(
        [callbackId, code, data = std::move(data), weak]() mutable {
            auto groupJsBridge = weak.Upgrade();
            if (groupJsBridge) {
                groupJsBridge->TriggerModuleJsCallback(callbackId, code, std::move(data));
            }
        },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::TransferJsPluginGetError(
    int32_t callbackId, int32_t errorCode, std::string&& errorMessage) const
{
    LOGI("BackendDelegateImpl TransferJsPluginGetError");
    auto weak = AceType::WeakClaim(AceType::RawPtr(groupJsBridge_));
    taskExecutor_->PostTask(
        [callbackId, errorCode, errorMessage = std::move(errorMessage), weak]() mutable {
            auto groupJsBridge = weak.Upgrade();
            if (groupJsBridge) {
                groupJsBridge->TriggerModulePluginGetErrorCallback(callbackId, errorCode, std::move(errorMessage));
            }
        },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::TransferJsEventData(int32_t callbackId, int32_t code, std::vector<uint8_t>&& data) const
{
    LOGI("BackendDelegateImpl TransferJsEventData");
    auto weak = AceType::WeakClaim(AceType::RawPtr(groupJsBridge_));
    taskExecutor_->PostTask(
        [callbackId, code, data = std::move(data), weak]() mutable {
            auto groupJsBridge = weak.Upgrade();
            if (groupJsBridge) {
                groupJsBridge->TriggerEventJsCallback(callbackId, code, std::move(data));
            }
        },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::LoadPluginJsCode(std::string&& jsCode) const
{
    LOGI("BackendDelegateImpl LoadPluginJsCode");
    auto weak = AceType::WeakClaim(AceType::RawPtr(groupJsBridge_));
    taskExecutor_->PostTask(
        [jsCode = std::move(jsCode), weak]() mutable {
            auto groupJsBridge = weak.Upgrade();
            if (groupJsBridge) {
                groupJsBridge->LoadPluginJsCode(std::move(jsCode));
            }
        },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::LoadPluginJsByteCode(std::vector<uint8_t>&& jsCode, std::vector<int32_t>&& jsCodeLen) const
{
    LOGI("BackendDelegateImpl LoadPluginJsByteCode");
    auto weak = AceType::WeakClaim(AceType::RawPtr(groupJsBridge_));
    taskExecutor_->PostTask(
        [jsCode = std::move(jsCode), jsCodeLen = std::move(jsCodeLen), weak]() mutable {
            auto groupJsBridge = weak.Upgrade();
            if (groupJsBridge) {
                groupJsBridge->LoadPluginJsByteCode(std::move(jsCode), std::move(jsCodeLen));
            }
        },
        TaskExecutor::TaskType::JS);
}

SingleTaskExecutor BackendDelegateImpl::GetAnimationJsTask()
{
    return SingleTaskExecutor::Make(taskExecutor_, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::AddTaskObserver(std::function<void()>&& task)
{
    taskExecutor_->AddTaskObserver(std::move(task));
}

void BackendDelegateImpl::RemoveTaskObserver()
{
    taskExecutor_->RemoveTaskObserver();
}

void BackendDelegateImpl::FireAsyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs)
{
    LOGD("FireAsyncEvent eventId: %{public}s", eventId.c_str());
    std::string args = param;
    args.append(",null").append(",null"); // callback and dom changes
    if (!jsonArgs.empty()) {
        args.append(",").append(jsonArgs); // method args
    }
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), eventId, args = std::move(args)] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->asyncEvent_(eventId, args);
            }
        },
        TaskExecutor::TaskType::JS);
}

bool BackendDelegateImpl::FireSyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs)
{
    std::string resultStr;
    FireSyncEvent(eventId, param, jsonArgs, resultStr);
    return (resultStr == "true");
}

void BackendDelegateImpl::FireSyncEvent(
    const std::string& eventId, const std::string& param, const std::string& jsonArgs, std::string& result)
{
    int32_t callbackId = callbackCnt_++;
    std::string args = param;
    args.append("{\"_callbackId\":\"").append(std::to_string(callbackId)).append("\"}").append(",null");
    if (!jsonArgs.empty()) {
        args.append(",").append(jsonArgs); // method args
    }
    taskExecutor_->PostSyncTask(
        [weak = AceType::WeakClaim(this), eventId, args = std::move(args)] {
            auto delegate = weak.Upgrade();
            if (delegate) {
                delegate->syncEvent_(eventId, args);
            }
        },
        TaskExecutor::TaskType::JS);

    result = jsCallBackResult_[callbackId];
    LOGD("FireSyncEvent eventId: %{public}s, callbackId: %{public}d", eventId.c_str(), callbackId);
    jsCallBackResult_.erase(callbackId);
}

void BackendDelegateImpl::OnApplicationDestroy(const std::string& packageName)
{
    taskExecutor_->PostSyncTask(
        [destroyApplication = destroyApplication_, packageName] { destroyApplication(packageName); },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnApplicationCommand(const std::string& intent, int startId)
{
    taskExecutor_->PostTask(
        [weak = AceType::WeakClaim(this), intent, startId] {
            auto delegate = weak.Upgrade();
            CHECK_NULL_VOID_NOLOG(delegate);
            delegate->commandApplication_(intent, startId);
        },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::MethodChannel(const std::string& methodName, std::string& jsonStr)
{
    std::string resultStr;
    FireSyncEvent("_root", std::string("\"").append(methodName).append("\","), jsonStr, resultStr);
    jsonStr.assign(resultStr);
}

int32_t BackendDelegateImpl::Insert(const Uri& uri, const OHOS::NativeRdb::ValuesBucket& value)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl Insert get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [insert = insert_, &ret, uri, value, callingInfo] { ret = insert(uri, value, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

std::shared_ptr<AppExecFwk::PacMap> BackendDelegateImpl::Call(
    const Uri& uri, const std::string& method, const std::string& arg, const AppExecFwk::PacMap& pacMap)
{
    std::shared_ptr<AppExecFwk::PacMap> ret = nullptr;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl Call get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [call = call_, &ret, method, arg, pacMap, callingInfo] { ret = call(method, arg, pacMap, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

std::shared_ptr<OHOS::NativeRdb::AbsSharedResultSet> BackendDelegateImpl::Query(
    const Uri& uri, const std::vector<std::string>& columns, const OHOS::NativeRdb::DataAbilityPredicates& predicates)
{
    std::shared_ptr<OHOS::NativeRdb::AbsSharedResultSet> ret;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl Query get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask([query = query_, &ret, uri, columns, predicates,
                                    callingInfo] { ret = query(uri, columns, predicates, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

int32_t BackendDelegateImpl::Update(const Uri& uri, const OHOS::NativeRdb::ValuesBucket& value,
    const OHOS::NativeRdb::DataAbilityPredicates& predicates)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl Update get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask([update = update_, &ret, uri, value, predicates,
                                    callingInfo] { ret = update(uri, value, predicates, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

int32_t BackendDelegateImpl::Delete(const Uri& uri, const OHOS::NativeRdb::DataAbilityPredicates& predicates)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl Delete get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask([deleteCallback = delete_, &ret, uri, predicates,
                                    callingInfo] { ret = deleteCallback(uri, predicates, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

int32_t BackendDelegateImpl::BatchInsert(const Uri& uri, const std::vector<OHOS::NativeRdb::ValuesBucket>& values)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl BatchInsert get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [batchInsert = batchInsert_, &ret, uri, values, callingInfo] { ret = batchInsert(uri, values, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

std::string BackendDelegateImpl::GetType(const Uri& uri)
{
    std::string ret;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl GetType get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [getType = getType_, &ret, uri, callingInfo] { ret = getType(uri, callingInfo); }, TaskExecutor::TaskType::JS);
    return ret;
}

std::vector<std::string> BackendDelegateImpl::GetFileTypes(const Uri& uri, const std::string& mimeTypeFilter)
{
    std::vector<std::string> ret;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl GetFileTypes get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask([getFileTypes = getFileTypes_, &ret, uri, mimeTypeFilter,
                                    callingInfo] { ret = getFileTypes(uri, mimeTypeFilter, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

int32_t BackendDelegateImpl::OpenFile(const Uri& uri, const std::string& mode)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl OpenFile get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [openFile = openFile_, &ret, uri, mode, callingInfo] { ret = openFile(uri, mode, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

int32_t BackendDelegateImpl::OpenRawFile(const Uri& uri, const std::string& mode)
{
    int32_t ret = 0;
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl OpenRawFile get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [openRawFile = openRawFile_, &ret, uri, mode, callingInfo] { ret = openRawFile(uri, mode, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

Uri BackendDelegateImpl::NormalizeUri(const Uri& uri)
{
    Uri ret("");
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl NormalizeUri get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [normalizeUri = normalizeUri_, &ret, uri, callingInfo] { ret = normalizeUri(uri, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

Uri BackendDelegateImpl::DenormalizeUri(const Uri& uri)
{
    Uri ret("");
    CallingInfo callingInfo;
    NAPI_RemoteObject_getCallingInfo(callingInfo);
    LOGD("BackendDelegateImpl DenormalizeUri get callingInfo is %{public}u", callingInfo.callingTokenId);
    taskExecutor_->PostSyncTask(
        [denormalizeUri = denormalizeUri_, &ret, uri, callingInfo] { ret = denormalizeUri(uri, callingInfo); },
        TaskExecutor::TaskType::JS);
    return ret;
}

sptr<IRemoteObject> BackendDelegateImpl::OnConnect(const OHOS::AAFwk::Want& want)
{
    sptr<IRemoteObject> ret = nullptr;
    taskExecutor_->PostSyncTask([connectCallback = connectCallback_, want, &ret]() { ret = connectCallback(want); },
        TaskExecutor::TaskType::JS);
    return ret;
}

void BackendDelegateImpl::OnDisConnect(const OHOS::AAFwk::Want& want)
{
    taskExecutor_->PostTask(
        [disConnectCallback = disConnectCallback_, want] { disConnectCallback(want); }, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnCreate(const OHOS::AAFwk::Want& want)
{
    taskExecutor_->PostSyncTask(
        [createCallback = createCallback_, want] { createCallback(want); }, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnDelete(const int64_t formId)
{
    taskExecutor_->PostTask(
        [deleteCallback = deleteCallback_, formId] { deleteCallback(formId); }, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnTriggerEvent(const int64_t formId, const std::string& message)
{
    taskExecutor_->PostTask(
        [triggerEventCallback = triggerEventCallback_, formId, message] { triggerEventCallback(formId, message); },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnUpdate(const int64_t formId)
{
    taskExecutor_->PostTask(
        [updateCallback = updateCallback_, formId] { updateCallback(formId); }, TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnCastTemptoNormal(const int64_t formId)
{
    taskExecutor_->PostTask(
        [castTemptoNormalCallback = castTemptoNormalCallback_, formId] { castTemptoNormalCallback(formId); },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::OnVisibilityChanged(const std::map<int64_t, int32_t>& formEventsMap)
{
    taskExecutor_->PostTask([visibilityChangedCallback = visibilityChangedCallback_,
                                formEventsMap] { visibilityChangedCallback(formEventsMap); },
        TaskExecutor::TaskType::JS);
}

int32_t BackendDelegateImpl::OnAcquireFormState(const OHOS::AAFwk::Want& want)
{
    auto ret = (int32_t)AppExecFwk::FormState::UNKNOWN;
    taskExecutor_->PostSyncTask(
        [acquireStateCallback = acquireStateCallback_, &ret, want] { ret = acquireStateCallback(want); },
        TaskExecutor::TaskType::JS);
    return ret;
}

void BackendDelegateImpl::OnCommand(const OHOS::AAFwk::Want& want, int startId)
{
    taskExecutor_->PostTask([commandCallback = commandCallback_, want, startId] { commandCallback(want, startId); },
        TaskExecutor::TaskType::JS);
}

void BackendDelegateImpl::DumpHeapSnapshot(bool isPrivate)
{
    taskExecutor_->PostTask(
        [dumpHeapSnapshotCallback = dumpHeapSnapshotCallback_, isPrivate] { dumpHeapSnapshotCallback(isPrivate); },
        TaskExecutor::TaskType::JS);
}

bool BackendDelegateImpl::ParseFileUri(
    const RefPtr<AssetManager>& assetManager, const std::string& fileUri, std::string& assetsFilePath)
{
    if (!assetManager || fileUri.empty() || (fileUri.length() > PATH_MAX)) {
        return false;
    }

    std::string fileName;
    std::string filePath;
    size_t slashPos = fileUri.find_last_of("/");
    if (slashPos == std::string::npos) {
        fileName = fileUri;
    } else {
        fileName = fileUri.substr(slashPos + 1);
        filePath = fileUri.substr(0, slashPos);
    }

    if (Framework::StartWith(filePath, "/")) {
        filePath = filePath.substr(1);
    }

    std::vector<std::string> files;
    assetManager->GetAssetList(filePath, files);

    bool fileExist = false;
    for (const auto& file : files) {
        bool startWithSlash = Framework::StartWith(file, "/");
        if ((startWithSlash && (file.substr(1) == fileName)) || (!startWithSlash && (file == fileName))) {
            assetsFilePath = filePath + file;
            fileExist = true;
            break;
        }
    }

    return fileExist;
}

bool BackendDelegateImpl::GetResourceData(const std::string& fileUri, std::vector<uint8_t>& content, std::string& ami)
{
    std::string targetFilePath;
    if (!ParseFileUri(assetManager_, fileUri, targetFilePath)) {
        LOGE("GetResourceData parse file uri failed.");
        return false;
    }
    ami = assetManager_->GetAssetPath(targetFilePath) + targetFilePath;
    if (!Framework::GetAssetContentAllowEmpty(assetManager_, targetFilePath, content)) {
        LOGE("GetResourceData GetAssetContent failed.");
        return false;
    }

    return true;
}

bool BackendDelegateImpl::OnShare(int64_t formId, OHOS::AAFwk::WantParams& wantParams)
{
    bool result = false;
    taskExecutor_->PostSyncTask([shareFormCallback = shareFormCallback_, formId, &wantParams,
                                    &result]() { result = shareFormCallback(formId, wantParams); },
        TaskExecutor::TaskType::JS);

    return result;
}
} // namespace OHOS::Ace
