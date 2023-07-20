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

#include "ui_service_mgr_proxy.h"

#include "errors.h"
#include "string_ex.h"
#include "ui_service_mgr_errors.h"
#include "ui_service_proxy.h"
#include "ui_service_stub.h"

namespace OHOS::Ace {
bool UIServiceMgrProxy::WriteInterfaceToken(MessageParcel& data)
{
    if (!data.WriteInterfaceToken(UIServiceMgrProxy::GetDescriptor())) {
        HILOG_ERROR("write interface token failed");
        return false;
    }
    return true;
}

int32_t UIServiceMgrProxy::RegisterCallBack(const AAFwk::Want& want, const sptr<IUIService>& uiService)
{
    MessageParcel data;
    MessageParcel reply;
    MessageOption option;
    if (!WriteInterfaceToken(data)) {
        return UI_SERVICE_PROXY_INNER_ERR;
    }
    if (!data.WriteParcelable(&want)) {
        HILOG_ERROR("register callback fail, want error");
        return ERR_INVALID_VALUE;
    }
    if (uiService == nullptr) {
        HILOG_ERROR("register callback fail, uiService is nullptr");
        return ERR_INVALID_VALUE;
    }
    if (!data.WriteRemoteObject(uiService->AsObject())) {
        HILOG_ERROR("register callback fail, uiService error");
        return ERR_INVALID_VALUE;
    }
    int32_t error = Remote()->SendRequest(IUIServiceMgr::REGISTER_CALLBACK, data, reply, option);
    if (error != NO_ERROR) {
        HILOG_ERROR("register callback fail, error: %d", error);
        return error;
    }
    return reply.ReadInt32();
}

int32_t UIServiceMgrProxy::UnregisterCallBack(const AAFwk::Want& want)
{
    MessageParcel data;
    MessageParcel reply;
    MessageOption option;

    if (!WriteInterfaceToken(data)) {
        return UI_SERVICE_PROXY_INNER_ERR;
    }
    data.WriteParcelable(&want);
    int32_t error = Remote()->SendRequest(IUIServiceMgr::UNREGISTER_CALLBACK, data, reply, option);
    if (error != NO_ERROR) {
        HILOG_ERROR("unregister callback fail, error: %d", error);
        return error;
    }
    return reply.ReadInt32();
}

int32_t UIServiceMgrProxy::Push(const AAFwk::Want& want, const std::string& name, const std::string& jsonPath,
    const std::string& data, const std::string& extraData)
{
    MessageParcel dataParcel;
    MessageParcel reply;
    MessageOption option;
    if (!WriteInterfaceToken(dataParcel)) {
        return UI_SERVICE_PROXY_INNER_ERR;
    }
    dataParcel.WriteParcelable(&want);
    if (!dataParcel.WriteString(name)) {
        HILOG_ERROR("fail to WriteString name");
        return INVALID_DATA;
    }
    if (!dataParcel.WriteString(jsonPath)) {
        HILOG_ERROR("fail to WriteString jsonPath");
        return INVALID_DATA;
    }
    if (!dataParcel.WriteString(data)) {
        HILOG_ERROR("fail to WriteString data");
        return INVALID_DATA;
    }
    if (!dataParcel.WriteString(extraData)) {
        HILOG_ERROR("fail to WriteString extraData");
        return INVALID_DATA;
    }
    int32_t error = Remote()->SendRequest(IUIServiceMgr::PUSH, dataParcel, reply, option);
    if (error != NO_ERROR) {
        HILOG_ERROR("Push fail, error: %d", error);
        return error;
    }
    return reply.ReadInt32();
}

int32_t UIServiceMgrProxy::Request(const AAFwk::Want& want, const std::string& name, const std::string& data)
{
    MessageParcel dataParcel;
    MessageParcel reply;
    MessageOption option;

    if (!WriteInterfaceToken(dataParcel)) {
        return UI_SERVICE_PROXY_INNER_ERR;
    }
    dataParcel.WriteParcelable(&want);

    if (!dataParcel.WriteString(name)) {
        HILOG_ERROR("fail to WriteString name");
        return INVALID_DATA;
    }

    if (!dataParcel.WriteString(data)) {
        HILOG_ERROR("fail to WriteString data");
        return INVALID_DATA;
    }

    int32_t error = Remote()->SendRequest(IUIServiceMgr::REQUEST, dataParcel, reply, option);
    if (error != NO_ERROR) {
        HILOG_ERROR("Request fail, error: %d", error);
        return error;
    }
    return reply.ReadInt32();
}

int32_t UIServiceMgrProxy::ReturnRequest(const AAFwk::Want& want, const std::string& source, const std::string& data,
    const std::string& extraData)
{
    MessageParcel dataParcel;
    MessageParcel reply;
    MessageOption option;

    if (!WriteInterfaceToken(dataParcel)) {
        return UI_SERVICE_PROXY_INNER_ERR;
    }
    dataParcel.WriteParcelable(&want);

    if (!dataParcel.WriteString(source)) {
        HILOG_ERROR("fail to WriteString source");
        return INVALID_DATA;
    }

    if (!dataParcel.WriteString(data)) {
        HILOG_ERROR("fail to WriteString data");
        return INVALID_DATA;
    }
    if (!dataParcel.WriteString(extraData)) {
        HILOG_ERROR("fail to WriteString extraData");
        return INVALID_DATA;
    }
    int32_t error = Remote()->SendRequest(IUIServiceMgr::RETURN_REQUEST, dataParcel, reply, option);
    if (error != NO_ERROR) {
        HILOG_ERROR("Request fail, error: %d", error);
        return error;
    }
    return reply.ReadInt32();
}
}
