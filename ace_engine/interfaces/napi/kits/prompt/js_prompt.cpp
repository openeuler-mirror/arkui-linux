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

#include <string>
#include <uv.h>

#include "interfaces/napi/kits/utils/napi_utils.h"
#include "napi/native_api.h"
#include "native_engine/native_value.h"
#include "napi/native_node_api.h"

#include "base/subwindow/subwindow_manager.h"
#include "base/utils/system_properties.h"
#include "bridge/common/utils/engine_helper.h"
#include "bridge/js_frontend/engine/common/js_engine.h"

namespace OHOS::Ace::Napi {
namespace {

const int SHOW_DIALOG_BUTTON_NUM_MAX = 3;
const int SHOW_ACTION_MENU_BUTTON_NUM_MAX = 6;
constexpr char DEFAULT_FONT_COLOR_STRING_VALUE[] = "#ff007dff";

#ifdef OHOS_STANDARD_SYSTEM
bool ContainerIsService()
{
    auto containerId = Container::CurrentId();
    // Get active container when current instanceid is less than 0
    if (containerId < 0) {
        auto container = Container::GetActive();
        if (container) {
            containerId = container->GetInstanceId();
        }
    }
    // for pa service
    return containerId >= MIN_PA_SERVICE_ID || containerId < 0;
}
#endif

} // namespace

napi_value GetReturnObject(napi_env env, std::string callbackString)
{
    napi_value result = nullptr;
    napi_value returnObj = nullptr;
    napi_create_object(env, &returnObj);
    napi_create_string_utf8(env, callbackString.c_str(), NAPI_AUTO_LENGTH, &result);
    napi_set_named_property(env, returnObj, "errMsg", result);
    return returnObj;
}

void GetNapiString(napi_env env, napi_value value, std::string& retStr)
{
    size_t ret = 0;
    napi_valuetype valueType = napi_undefined;
    napi_typeof(env, value, &valueType);
    if (valueType == napi_string) {
        size_t valueLen = GetParamLen(value) + 1;
        std::unique_ptr<char[]> titleChar = std::make_unique<char[]>(valueLen);
        napi_get_value_string_utf8(env, value, titleChar.get(), valueLen, &ret);
        retStr = titleChar.get();
    } else if (valueType == napi_object) {
        int32_t id = 0;
        int32_t type = 0;
        std::vector<std::string> params;
        if (ParseResourceParam(env, value, id, type, params)) {
            ParseString(id, type, params, retStr);
        }
    }
}

static napi_value JSPromptShowToast(napi_env env, napi_callback_info info)
{
    size_t requireArgc = 1;
    size_t argc = 1;
    napi_value argv = nullptr;
    napi_value thisVar = nullptr;
    void* data = nullptr;
    napi_get_cb_info(env, info, &argc, &argv, &thisVar, &data);
    if (argc != requireArgc) {
        NapiThrow(env, "The number of parameters must be equal to 1.", Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    }

    napi_value messageNApi = nullptr;
    napi_value durationNApi = nullptr;
    napi_value bottomNApi = nullptr;
    std::string messageString;
    std::string bottomString;

    napi_valuetype valueType = napi_undefined;
    napi_typeof(env, argv, &valueType);
    if (valueType == napi_object) {
        napi_get_named_property(env, argv, "message", &messageNApi);
        napi_get_named_property(env, argv, "duration", &durationNApi);
        napi_get_named_property(env, argv, "bottom", &bottomNApi);
    } else {
        NapiThrow(env, "The type of parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    }
    size_t ret = 0;
    napi_typeof(env, messageNApi, &valueType);
    if (valueType == napi_string) {
        size_t messageLen = GetParamLen(messageNApi) + 1;
        std::unique_ptr<char[]> message = std::make_unique<char[]>(messageLen);
        napi_get_value_string_utf8(env, messageNApi, message.get(), messageLen, &ret);
        messageString = message.get();
    } else if (valueType == napi_object) {
        int32_t id = 0;
        int32_t type = 0;
        std::vector<std::string> params;
        if (!ParseResourceParam(env, messageNApi, id, type, params)) {
            LOGE("can not parse resource info from input params.");
            NapiThrow(env, "Can not parse resource info from input params.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
        if (!ParseString(id, type, params, messageString)) {
            LOGE("can not get message from resource manager.");
            NapiThrow(env, "Can not get message from resource manager.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
    } else if (valueType == napi_undefined) {
        NapiThrow(env, "Required input parameters are missing.", Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    } else {
        LOGE("The parameter type is incorrect.");
        NapiThrow(env, "The type of message is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    }

    int32_t duration = -1;
    std::string durationStr;
    napi_typeof(env, durationNApi, &valueType);
    if (valueType == napi_number) {
        napi_get_value_int32(env, durationNApi, &duration);
    } else if (valueType == napi_object) {
        int32_t id = 0;
        int32_t type = 0;
        std::vector<std::string> params;
        if (!ParseResourceParam(env, durationNApi, id, type, params)) {
            LOGE("can not parse resource info from input params.");
            NapiThrow(env, "Can not parse resource info from input params.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
        if (!ParseString(id, type, params, durationStr)) {
            LOGE("can not get message from resource manager.");
            NapiThrow(env, "Can not get message from resource manager.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
        duration = StringUtils::StringToInt(durationStr);
    }

    napi_typeof(env, bottomNApi, &valueType);
    if (valueType == napi_string) {
        size_t bottomLen = GetParamLen(bottomNApi) + 1;
        std::unique_ptr<char[]> bottom = std::make_unique<char[]>(bottomLen);
        napi_get_value_string_utf8(env, bottomNApi, bottom.get(), bottomLen, &ret);
        bottomString = bottom.get();
    } else if (valueType == napi_number) {
        double bottom = 0.0;
        napi_get_value_double(env, bottomNApi, &bottom);
        bottomString = std::to_string(bottom);
    } else if (valueType == napi_object) {
        int32_t id = 0;
        int32_t type = 0;
        std::vector<std::string> params;
        if (!ParseResourceParam(env, bottomNApi, id, type, params)) {
            LOGE("can not parse resource info from input params.");
            NapiThrow(env, "Can not parse resource info from input params.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
        if (!ParseString(id, type, params, bottomString)) {
            LOGE("can not get message from resource manager.");
            NapiThrow(env, "Can not get message from resource manager.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
    }
#ifdef OHOS_STANDARD_SYSTEM
    if (SystemProperties::GetExtSurfaceEnabled() || !ContainerIsService()) {
        auto delegate = EngineHelper::GetCurrentDelegate();
        if (!delegate) {
            LOGE("can not get delegate.");
            NapiThrow(env, "Can not get delegate.", Framework::ERROR_CODE_INTERNAL_ERROR);
            return nullptr;
        }
        delegate->ShowToast(messageString, duration, bottomString);
    } else if (SubwindowManager::GetInstance() != nullptr) {
        SubwindowManager::GetInstance()->ShowToast(messageString, duration, bottomString);
    }
#else
    auto delegate = EngineHelper::GetCurrentDelegate();
    if (!delegate) {
        LOGE("can not get delegate.");
        NapiThrow(env, "UI execution context not found.", Framework::ERROR_CODE_INTERNAL_ERROR);
        return nullptr;
    }
    delegate->ShowToast(messageString, duration, bottomString);
#endif

    return nullptr;
}

struct PromptAsyncContext {
    napi_env env = nullptr;
    napi_async_work work = nullptr;
    napi_value titleNApi = nullptr;
    napi_value messageNApi = nullptr;
    napi_value buttonsNApi = nullptr;
    napi_value autoCancel = nullptr;
    napi_ref callbackSuccess = nullptr;
    napi_ref callbackCancel = nullptr;
    napi_ref callbackComplete = nullptr;
    std::string titleString;
    std::string messageString;
    std::vector<ButtonInfo> buttons;
    bool autoCancelBool = true;
    std::set<std::string> callbacks;
    std::string callbackSuccessString;
    std::string callbackCancelString;
    std::string callbackCompleteString;
    napi_deferred deferred = nullptr;
    napi_ref callbackRef = nullptr;
    int32_t callbackType = -1;
    int32_t successType = -1;
    bool valid = true;
};

static napi_value JSPromptShowDialog(napi_env env, napi_callback_info info)
{
    size_t requireArgc = 1;
    size_t argc = 2;
    napi_value argv[3] = { 0 };
    napi_value thisVar = nullptr;
    void* data = nullptr;
    napi_get_cb_info(env, info, &argc, argv, &thisVar, &data);
    if (argc < requireArgc) {
        NapiThrow(env, "The number of parameters must be greater than or equal to 1.",
            Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    }
    if (thisVar == nullptr) {
        LOGE("%{public}s, This argument is nullptr.", __func__);
        return nullptr;
    }
    napi_valuetype valueTypeOfThis = napi_undefined;
    napi_typeof(env, thisVar, &valueTypeOfThis);
    if (valueTypeOfThis == napi_undefined) {
        LOGE("%{public}s, Wrong this value.", __func__);
        return nullptr;
    }

    auto asyncContext = new PromptAsyncContext();
    asyncContext->env = env;
    for (size_t i = 0; i < argc; i++) {
        napi_valuetype valueType = napi_undefined;
        napi_typeof(env, argv[i], &valueType);
        if (i == 0) {
            if (valueType != napi_object) {
                delete asyncContext;
                asyncContext = nullptr;
                NapiThrow(env, "The type of parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
                return nullptr;
            }
            napi_get_named_property(env, argv[0], "title", &asyncContext->titleNApi);
            napi_get_named_property(env, argv[0], "message", &asyncContext->messageNApi);
            napi_get_named_property(env, argv[0], "buttons", &asyncContext->buttonsNApi);
            napi_get_named_property(env, argv[0], "autoCancel", &asyncContext->autoCancel);
            GetNapiString(env, asyncContext->titleNApi, asyncContext->titleString);
            GetNapiString(env, asyncContext->messageNApi, asyncContext->messageString);
            bool isBool = false;
            napi_is_array(env, asyncContext->buttonsNApi, &isBool);
            napi_typeof(env, asyncContext->buttonsNApi, &valueType);
            if (valueType == napi_object && isBool) {
                uint32_t buttonsLen = 0;
                napi_value buttonArray = nullptr;
                napi_value textNApi = nullptr;
                napi_value colorNApi = nullptr;

                uint32_t index = 0;
                napi_get_array_length(env, asyncContext->buttonsNApi, &buttonsLen);
                uint32_t buttonsLenInt = buttonsLen;
                if (buttonsLenInt > SHOW_DIALOG_BUTTON_NUM_MAX) {
                    buttonsLenInt = SHOW_DIALOG_BUTTON_NUM_MAX;
                    LOGE("Supports 1 - 3 buttons");
                }
                for (uint32_t j = 0; j < buttonsLenInt; j++) {
                    napi_get_element(env, asyncContext->buttonsNApi, index, &buttonArray);
                    index++;
                    napi_get_named_property(env, buttonArray, "text", &textNApi);
                    napi_get_named_property(env, buttonArray, "color", &colorNApi);
                    std::string textString;
                    std::string colorString;
                    GetNapiString(env, textNApi, textString);
                    GetNapiString(env, colorNApi, colorString);
                    ButtonInfo buttonInfo = { .text = textString, .textColor = colorString };
                    asyncContext->buttons.emplace_back(buttonInfo);
                }
            }
            napi_typeof(env, asyncContext->autoCancel, &valueType);
            if (valueType == napi_boolean) {
                napi_get_value_bool(env, asyncContext->autoCancel, &asyncContext->autoCancelBool);
            }
        } else if (valueType == napi_function) {
            napi_create_reference(env, argv[i], 1, &asyncContext->callbackRef);
        } else {
            delete asyncContext;
            asyncContext = nullptr;
            NapiThrow(env, "The type of parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
            return nullptr;
        }
    }
    napi_value result = nullptr;
    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &asyncContext->deferred, &result);
    } else {
        napi_get_undefined(env, &result);
    }
    asyncContext->callbacks.emplace("success");
    asyncContext->callbacks.emplace("cancel");

    auto callBack = [asyncContext](int32_t callbackType, int32_t successType) {
        uv_loop_s* loop = nullptr;
        if (asyncContext == nullptr) {
            return;
        }

        asyncContext->callbackType = callbackType;
        asyncContext->successType = successType;
        napi_get_uv_event_loop(asyncContext->env, &loop);
        uv_work_t* work = new uv_work_t;
        work->data = (void*)asyncContext;
        int rev = uv_queue_work(
            loop, work, [](uv_work_t* work) {},
            [](uv_work_t* work, int status) {
                if (work == nullptr) {
                    return;
                }

                PromptAsyncContext* asyncContext = (PromptAsyncContext*)work->data;
                if (asyncContext == nullptr) {
                    LOGE("%{public}s, asyncContext is nullptr.", __func__);
                    delete work;
                    work = nullptr;
                    return;
                }

                if (!asyncContext->valid) {
                    LOGE("%{public}s, module exported object is invalid.", __func__);
                    delete asyncContext;
                    delete work;
                    work = nullptr;
                    return;
                }

                napi_handle_scope scope = nullptr;
                napi_open_handle_scope(asyncContext->env, &scope);
                if (scope == nullptr) {
                    LOGE("%{public}s, open handle scope failed.", __func__);
                    delete asyncContext;
                    delete work;
                    work = nullptr;
                    return;
                }

                napi_value ret;
                napi_value successIndex = nullptr;
                napi_create_int32(asyncContext->env, asyncContext->successType, &successIndex);
                napi_value indexObj = nullptr;
                napi_create_object(asyncContext->env, &indexObj);
                napi_set_named_property(asyncContext->env, indexObj, "index", successIndex);
                napi_value result[2] = { 0 };
                napi_create_object(asyncContext->env, &result[1]);
                napi_set_named_property(asyncContext->env, result[1], "index", successIndex);
                bool dialogResult = true;
                switch (asyncContext->callbackType) {
                    case 0:
                        napi_get_undefined(asyncContext->env, &result[0]);
                        dialogResult = true;
                        break;
                    case 1:
                        napi_value message = nullptr;
                        napi_create_string_utf8(asyncContext->env, "cancel", strlen("cancel"), &message);
                        napi_create_error(asyncContext->env, nullptr, message, &result[0]);
                        dialogResult = false;
                        break;
                }
                if (asyncContext->deferred) {
                    if (dialogResult) {
                        napi_resolve_deferred(asyncContext->env, asyncContext->deferred, result[1]);
                    } else {
                        napi_reject_deferred(asyncContext->env, asyncContext->deferred, result[0]);
                    }
                } else {
                    napi_value callback = nullptr;
                    napi_get_reference_value(asyncContext->env, asyncContext->callbackRef, &callback);
                    napi_call_function(
                        asyncContext->env, nullptr, callback, sizeof(result) / sizeof(result[0]), result, &ret);
                    napi_delete_reference(asyncContext->env, asyncContext->callbackRef);
                }
                napi_delete_async_work(asyncContext->env, asyncContext->work);
                napi_close_handle_scope(asyncContext->env, scope);
                delete asyncContext;
                delete work;
                work = nullptr;
            });
        if (rev != 0) {
            if (work != nullptr) {
                delete work;
                work = nullptr;
            }
        }
    };

    napi_wrap(env, thisVar, (void*)asyncContext, [](napi_env env, void* data, void* hint) {
        PromptAsyncContext* cbInfo = (PromptAsyncContext*)data;
        if (cbInfo != nullptr) {
            LOGE("%{public}s, thisVar JavaScript object is ready for garbage-collection.", __func__);
            cbInfo->valid = false;
        }
    }, nullptr, nullptr);
#ifdef OHOS_STANDARD_SYSTEM
    // NG
    if (SystemProperties::GetExtSurfaceEnabled() || !ContainerIsService()) {
        auto delegate = EngineHelper::GetCurrentDelegate();
        if (delegate) {
            delegate->ShowDialog(asyncContext->titleString, asyncContext->messageString, asyncContext->buttons,
                asyncContext->autoCancelBool, std::move(callBack), asyncContext->callbacks);
        } else {
            LOGE("delegate is null");
            // throw internal error
            napi_value code = nullptr;
            std::string strCode = std::to_string(Framework::ERROR_CODE_INTERNAL_ERROR);
            napi_create_string_utf8(env, strCode.c_str(), strCode.length(), &code);
            napi_value msg = nullptr;
            std::string strMsg = ErrorToMessage(Framework::ERROR_CODE_INTERNAL_ERROR) + "Can not get delegate.";
            napi_create_string_utf8(env, strMsg.c_str(), strMsg.length(), &msg);
            napi_value error = nullptr;
            napi_create_error(env, code, msg, &error);

            if (asyncContext->deferred) {
                napi_reject_deferred(env, asyncContext->deferred, error);
            } else {
                napi_value ret1;
                napi_value callback = nullptr;
                napi_get_reference_value(env, asyncContext->callbackRef, &callback);
                napi_call_function(env, nullptr, callback, 1, &error, &ret1);
                napi_delete_reference(env, asyncContext->callbackRef);
            }
        }
    } else if (SubwindowManager::GetInstance() != nullptr) {
        SubwindowManager::GetInstance()->ShowDialog(asyncContext->titleString, asyncContext->messageString,
            asyncContext->buttons, asyncContext->autoCancelBool, std::move(callBack), asyncContext->callbacks);
    }
#else
    auto delegate = EngineHelper::GetCurrentDelegate();
    if (delegate) {
        delegate->ShowDialog(asyncContext->titleString, asyncContext->messageString,
            asyncContext->buttons, asyncContext->autoCancelBool, std::move(callBack), asyncContext->callbacks);
    } else {
        LOGE("delegate is null");
        // throw internal error
        napi_value code = nullptr;
        std::string strCode = std::to_string(Framework::ERROR_CODE_INTERNAL_ERROR);
        napi_create_string_utf8(env, strCode.c_str(), strCode.length(), &code);
        napi_value msg = nullptr;
        std::string strMsg = ErrorToMessage(Framework::ERROR_CODE_INTERNAL_ERROR)
            + "UI execution context not found.";
        napi_create_string_utf8(env, strMsg.c_str(), strMsg.length(), &msg);
        napi_value error = nullptr;
        napi_create_error(env, code, msg, &error);

        if (asyncContext->deferred) {
            napi_reject_deferred(env, asyncContext->deferred, error);
        } else {
            napi_value ret1;
            napi_value callback = nullptr;
            napi_get_reference_value(env, asyncContext->callbackRef, &callback);
            napi_call_function(env, nullptr, callback, 1, &error, &ret1);
            napi_delete_reference(env, asyncContext->callbackRef);
        }
    }
#endif
    return result;
}

struct ShowActionMenuAsyncContext {
    napi_env env = nullptr;
    napi_async_work work = nullptr;
    napi_value titleNApi = nullptr;
    napi_value buttonsNApi = nullptr;
    napi_ref callbackSuccess = nullptr;
    napi_ref callbackFail = nullptr;
    napi_ref callbackComplete = nullptr;
    std::string titleString;
    std::vector<ButtonInfo> buttons;
    std::string callbackSuccessString;
    std::string callbackFailString;
    std::string callbackCompleteString;
    napi_deferred deferred = nullptr;
    napi_ref callbackRef = nullptr;
    int32_t callbackType = -1;
    int32_t successType = -1;
    bool valid = true;
};

static napi_value JSPromptShowActionMenu(napi_env env, napi_callback_info info)
{
    size_t requireArgc = 1;
    size_t argc = 2;
    napi_value argv[3] = { 0 };
    napi_value thisVar = nullptr;
    void* data = nullptr;
    napi_get_cb_info(env, info, &argc, argv, &thisVar, &data);
    if (argc < requireArgc) {
        NapiThrow(env, "The number of parameters must be greater than or equal to 1.",
            Framework::ERROR_CODE_PARAM_INVALID);
        return nullptr;
    }
    if (thisVar == nullptr) {
        LOGE("%{public}s, This argument is nullptr.", __func__);
        return nullptr;
    }
    napi_valuetype valueTypeOfThis = napi_undefined;
    napi_typeof(env, thisVar, &valueTypeOfThis);
    if (valueTypeOfThis == napi_undefined) {
        LOGE("%{public}s, Wrong this value.", __func__);
        return nullptr;
    }

    auto asyncContext = new ShowActionMenuAsyncContext();
    asyncContext->env = env;
    for (size_t i = 0; i < argc; i++) {
        size_t ret = 0;
        napi_valuetype valueType = napi_undefined;
        napi_typeof(env, argv[i], &valueType);
        if (i == 0) {
            if (valueType != napi_object) {
                delete asyncContext;
                asyncContext = nullptr;
                NapiThrow(env, "The type of parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
                return nullptr;
            }
            napi_get_named_property(env, argv[0], "title", &asyncContext->titleNApi);
            napi_get_named_property(env, argv[0], "buttons", &asyncContext->buttonsNApi);
            GetNapiString(env, asyncContext->titleNApi, asyncContext->titleString);
            bool isBool = false;
            napi_is_array(env, asyncContext->buttonsNApi, &isBool);
            napi_typeof(env, asyncContext->buttonsNApi, &valueType);
            if (valueType == napi_object && isBool) {
                uint32_t buttonsLen = 0;
                napi_value buttonArray = nullptr;
                napi_value textNApi = nullptr;
                napi_value colorNApi = nullptr;
                uint32_t index = 0;
                napi_get_array_length(env, asyncContext->buttonsNApi, &buttonsLen);
                uint32_t buttonsLenInt = buttonsLen;
                if (buttonsLenInt > SHOW_ACTION_MENU_BUTTON_NUM_MAX) {
                    buttonsLenInt = SHOW_ACTION_MENU_BUTTON_NUM_MAX;
                    LOGE("Supports 1 - 6 buttons");
                }
                for (uint32_t j = 0; j < buttonsLenInt; j++) {
                    napi_get_element(env, asyncContext->buttonsNApi, index, &buttonArray);
                    index++;
                    napi_get_named_property(env, buttonArray, "text", &textNApi);
                    napi_get_named_property(env, buttonArray, "color", &colorNApi);
                    std::string textString;
                    std::string colorString;
                    napi_typeof(env, textNApi, &valueType);
                    if (valueType == napi_string) {
                        size_t textLen = GetParamLen(textNApi) + 1;
                        std::unique_ptr<char[]> text = std::make_unique<char[]>(textLen + 1);
                        napi_get_value_string_utf8(env, textNApi, text.get(), textLen, &ret);
                        textString = text.get();
                    } else if (valueType == napi_object) {
                        int32_t id = 0;
                        int32_t type = 0;
                        std::vector<std::string> params;
                        if (ParseResourceParam(env, textNApi, id, type, params)) {
                            ParseString(id, type, params, textString);
                        }
                    } else {
                        delete asyncContext;
                        asyncContext = nullptr;
                        if (valueType == napi_undefined) {
                            NapiThrow(
                                env, "Required input parameters are missing.", Framework::ERROR_CODE_PARAM_INVALID);
                        } else {
                            NapiThrow(env, "The type of the button text parameter is incorrect.",
                                Framework::ERROR_CODE_PARAM_INVALID);
                        }
                        return nullptr;
                    }
                    napi_typeof(env, colorNApi, &valueType);
                    if (valueType == napi_string) {
                        size_t colorLen = GetParamLen(colorNApi) + 1;
                        char color[colorLen + 1];
                        napi_get_value_string_utf8(env, colorNApi, color, colorLen, &ret);
                        colorString = color;
                    } else if (valueType == napi_object) {
                        int32_t id = 0;
                        int32_t type = 0;
                        std::vector<std::string> params;
                        if (ParseResourceParam(env, colorNApi, id, type, params)) {
                            ParseString(id, type, params, colorString);
                        }
                    } else if (valueType == napi_undefined) {
                        colorString = DEFAULT_FONT_COLOR_STRING_VALUE;
                    } else {
                        delete asyncContext;
                        asyncContext = nullptr;
                        NapiThrow(env, "The type of the button color parameter is incorrect.",
                            Framework::ERROR_CODE_PARAM_INVALID);
                        return nullptr;
                    }
                    ButtonInfo buttonInfo = { .text = textString, .textColor = colorString };
                    asyncContext->buttons.emplace_back(buttonInfo);
                }
            } else {
                delete asyncContext;
                asyncContext = nullptr;
                if (valueType == napi_undefined) {
                    NapiThrow(env, "Required input parameters are missing.", Framework::ERROR_CODE_PARAM_INVALID);
                } else {
                    NapiThrow(
                        env, "The type of the button parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
                }
                return nullptr;
            }
        } else if (valueType == napi_function) {
            napi_create_reference(env, argv[i], 1, &asyncContext->callbackRef);
        } else {
            delete asyncContext;
            asyncContext = nullptr;
            NapiThrow(env, "The type of parameters is incorrect.", Framework::ERROR_CODE_PARAM_INVALID);
            return nullptr;
        }
    }
    napi_value result = nullptr;
    if (asyncContext->callbackRef == nullptr) {
        napi_create_promise(env, &asyncContext->deferred, &result);
    } else {
        napi_get_undefined(env, &result);
    }

    auto callBack = [asyncContext](int32_t callbackType, int32_t successType) {
        uv_loop_s* loop = nullptr;
        if (asyncContext == nullptr) {
            return;
        }

        asyncContext->callbackType = callbackType;
        asyncContext->successType = successType;
        napi_get_uv_event_loop(asyncContext->env, &loop);
        uv_work_t* work = new uv_work_t;
        work->data = (void*)asyncContext;
        int rev = uv_queue_work(
            loop, work, [](uv_work_t* work) {},
            [](uv_work_t* work, int status) {
                if (work == nullptr) {
                    return;
                }

                ShowActionMenuAsyncContext* asyncContext = (ShowActionMenuAsyncContext*)work->data;
                if (asyncContext == nullptr) {
                    LOGE("%{public}s, asyncContext is nullptr.", __func__);
                    delete work;
                    work = nullptr;
                    return;
                }

                if (!asyncContext->valid) {
                    LOGE("%{public}s, module exported object is invalid.", __func__);
                    delete asyncContext;
                    delete work;
                    work = nullptr;
                    return;
                }

                napi_handle_scope scope = nullptr;
                napi_open_handle_scope(asyncContext->env, &scope);
                if (scope == nullptr) {
                    LOGE("%{public}s, open handle scope failed.", __func__);
                    delete asyncContext;
                    delete work;
                    work = nullptr;
                    return;
                }

                napi_value ret;
                napi_value successIndex = nullptr;
                napi_create_int32(asyncContext->env, asyncContext->successType, &successIndex);
                asyncContext->callbackSuccessString = "showActionMenu:ok";
                napi_value indexObj = GetReturnObject(asyncContext->env, asyncContext->callbackSuccessString);
                napi_set_named_property(asyncContext->env, indexObj, "index", successIndex);
                napi_value result[2] = { 0 };
                napi_create_object(asyncContext->env, &result[1]);
                napi_set_named_property(asyncContext->env, result[1], "index", successIndex);
                bool dialogResult = true;
                switch (asyncContext->callbackType) {
                    case 0:
                        napi_get_undefined(asyncContext->env, &result[0]);
                        dialogResult = true;
                        break;
                    case 1:
                        napi_value message = nullptr;
                        napi_create_string_utf8(asyncContext->env, "cancel", strlen("cancel"), &message);
                        napi_create_error(asyncContext->env, nullptr, message, &result[0]);
                        dialogResult = false;
                        break;
                }
                if (asyncContext->deferred) {
                    if (dialogResult) {
                        napi_resolve_deferred(asyncContext->env, asyncContext->deferred, result[1]);
                    } else {
                        napi_reject_deferred(asyncContext->env, asyncContext->deferred, result[0]);
                    }
                } else {
                    napi_value callback = nullptr;
                    napi_get_reference_value(asyncContext->env, asyncContext->callbackRef, &callback);
                    napi_call_function(
                        asyncContext->env, nullptr, callback, sizeof(result) / sizeof(result[0]), result, &ret);
                    napi_delete_reference(asyncContext->env, asyncContext->callbackRef);
                }
                napi_delete_async_work(asyncContext->env, asyncContext->work);
                napi_close_handle_scope(asyncContext->env, scope);
                delete asyncContext;
                delete work;
                work = nullptr;
            });
        if (rev != 0) {
            if (work != nullptr) {
                delete work;
                work = nullptr;
            }
        }
    };

    napi_wrap(env, thisVar, (void*)asyncContext, [](napi_env env, void* data, void* hint) {
        ShowActionMenuAsyncContext* cbInfo = (ShowActionMenuAsyncContext*)data;
        if (cbInfo != nullptr) {
            LOGE("%{public}s, thisVar JavaScript object is ready for garbage-collection.", __func__);
            cbInfo->valid = false;
        }
    }, nullptr, nullptr);
#ifdef OHOS_STANDARD_SYSTEM
    if (SystemProperties::GetExtSurfaceEnabled() || !ContainerIsService()) {
        auto delegate = EngineHelper::GetCurrentDelegate();
        if (delegate) {
            delegate->ShowActionMenu(asyncContext->titleString, asyncContext->buttons, std::move(callBack));
        } else {
            LOGE("delegate is null");
            napi_value code = nullptr;
            std::string strCode = std::to_string(Framework::ERROR_CODE_INTERNAL_ERROR);
            napi_create_string_utf8(env, strCode.c_str(), strCode.length(), &code);
            napi_value msg = nullptr;
            std::string strMsg = ErrorToMessage(Framework::ERROR_CODE_INTERNAL_ERROR) + "Can not get delegate.";
            napi_create_string_utf8(env, strMsg.c_str(), strMsg.length(), &msg);
            napi_value error = nullptr;
            napi_create_error(env, code, msg, &error);

            if (asyncContext->deferred) {
                napi_reject_deferred(env, asyncContext->deferred, error);
            } else {
                napi_value ret1;
                napi_value callback = nullptr;
                napi_get_reference_value(env, asyncContext->callbackRef, &callback);
                napi_call_function(env, nullptr, callback, 1, &error, &ret1);
                napi_delete_reference(env, asyncContext->callbackRef);
            }
        }
    } else if (SubwindowManager::GetInstance() != nullptr) {
        SubwindowManager::GetInstance()->ShowActionMenu(
            asyncContext->titleString, asyncContext->buttons, std::move(callBack));
    }
#else
    auto delegate = EngineHelper::GetCurrentDelegate();
    if (delegate) {
        delegate->ShowActionMenu(asyncContext->titleString, asyncContext->buttons, std::move(callBack));
    } else {
        LOGE("delegate is null");
        napi_value code = nullptr;
        std::string strCode = std::to_string(Framework::ERROR_CODE_INTERNAL_ERROR);
        napi_create_string_utf8(env, strCode.c_str(), strCode.length(), &code);
        napi_value msg = nullptr;
        std::string strMsg = ErrorToMessage(Framework::ERROR_CODE_INTERNAL_ERROR)
            + "UI execution context not found.";
        napi_create_string_utf8(env, strMsg.c_str(), strMsg.length(), &msg);
        napi_value error = nullptr;
        napi_create_error(env, code, msg, &error);

        if (asyncContext->deferred) {
            napi_reject_deferred(env, asyncContext->deferred, error);
        } else {
            napi_value ret1;
            napi_value callback = nullptr;
            napi_get_reference_value(env, asyncContext->callbackRef, &callback);
            napi_call_function(env, nullptr, callback, 1, &error, &ret1);
            napi_delete_reference(env, asyncContext->callbackRef);
        }
    }
#endif
    return result;
}

static napi_value PromptExport(napi_env env, napi_value exports)
{
    napi_property_descriptor promptDesc[] = {
        DECLARE_NAPI_FUNCTION("showToast", JSPromptShowToast),
        DECLARE_NAPI_FUNCTION("showDialog", JSPromptShowDialog),
        DECLARE_NAPI_FUNCTION("showActionMenu", JSPromptShowActionMenu),
    };
    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(promptDesc) / sizeof(promptDesc[0]), promptDesc));
    return exports;
}

static napi_module promptModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = PromptExport,
    .nm_modname = "prompt",
    .nm_priv = ((void*)0),
    .reserved = { 0 },
};

static napi_module promptActionModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = PromptExport,
    .nm_modname = "promptAction",
    .nm_priv = ((void*)0),
    .reserved = { 0 },
};

extern "C" __attribute__((constructor)) void PromptRegister()
{
    napi_module_register(&promptModule);
    napi_module_register(&promptActionModule);
}

} // namespace OHOS::Ace::Napi
