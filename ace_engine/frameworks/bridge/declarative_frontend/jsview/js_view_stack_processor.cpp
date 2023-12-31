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

#include "bridge/declarative_frontend/jsview/js_view_stack_processor.h"

#include "bridge/declarative_frontend/engine/bindings.h"
#include "bridge/declarative_frontend/engine/js_types.h"
#include "bridge/declarative_frontend/view_stack_processor.h"
#include "core/common/container.h"
#include "core/components_ng/base/view_stack_processor.h"
#include "frameworks/core/pipeline/base/element_register.h"

namespace OHOS::Ace::Framework {

void JSViewStackProcessor::JSVisualState(const JSCallbackInfo& info)
{
    LOGD("JSVisualState");
    if ((info.Length() < 1) || (!info[0]->IsString())) {
        LOGD("JSVisualState: is not a string.");
        if (Container::IsCurrentUseNewPipeline()) {
            NG::ViewStackProcessor::GetInstance()->ClearVisualState();
        } else {
            ViewStackProcessor::GetInstance()->ClearVisualState();
        }
        return;
    }

    std::string state = info[0]->ToString();
    VisualState visualState = JSViewStackProcessor::StringToVisualState(state);
    if (Container::IsCurrentUseNewPipeline()) {
        NG::ViewStackProcessor::GetInstance()->SetVisualState(visualState);
    } else {
        ViewStackProcessor::GetInstance()->SetVisualState(visualState);
    }
}

// public static emthods exposed to JS
void JSViewStackProcessor::JSBind(BindingTarget globalObj)
{
    LOGD("JSViewStackProcessor::Bind");
    JSClass<JSViewStackProcessor>::Declare("ViewStackProcessor");
    MethodOptions opt = MethodOptions::NONE;

    JSClass<JSViewStackProcessor>::StaticMethod(
        "AllocateNewElmetIdForNextComponent", &JSViewStackProcessor::JsAllocateNewElmetIdForNextComponent, opt);
    JSClass<JSViewStackProcessor>::StaticMethod(
        "StartGetAccessRecordingFor", &JSViewStackProcessor::JsStartGetAccessRecordingFor, opt);
    JSClass<JSViewStackProcessor>::StaticMethod(
        "SetElmtIdToAccountFor", &JSViewStackProcessor::JsSetElmtIdToAccountFor, opt);
    JSClass<JSViewStackProcessor>::StaticMethod(
        "GetElmtIdToAccountFor", &JSViewStackProcessor::JsGetElmtIdToAccountFor, opt);
    JSClass<JSViewStackProcessor>::StaticMethod(
        "StopGetAccessRecording", &JSViewStackProcessor::JsStopGetAccessRecording, opt);
    JSClass<JSViewStackProcessor>::StaticMethod(
        "ImplicitPopBeforeContinue", &JSViewStackProcessor::JsImplicitPopBeforeContinue, opt);
    JSClass<JSViewStackProcessor>::StaticMethod("visualState", JSVisualState, opt);
    JSClass<JSViewStackProcessor>::StaticMethod("MakeUniqueId", &JSViewStackProcessor::JSMakeUniqueId, opt);
    JSClass<JSViewStackProcessor>::Bind<>(globalObj);
}

VisualState JSViewStackProcessor::StringToVisualState(const std::string& stateString)
{
    if (stateString == "normal") {
        return VisualState::NORMAL;
    }
    if (stateString == "focused") {
        return VisualState::FOCUSED;
    }
    if (stateString == "pressed") {
        return VisualState::PRESSED;
    }
    if (stateString == "disabled") {
        return VisualState::DISABLED;
    }
    if (stateString == "hover") {
        return VisualState::HOVER;
    }
    LOGE("Unknown visual state \"%{public}s\", resetting to UNDEFINED", stateString.c_str());
    return VisualState::NOTSET;
}

void JSViewStackProcessor::JsStartGetAccessRecordingFor(ElementIdType elmtId)
{
    if (Container::IsCurrentUseNewPipeline()) {
        return NG::ViewStackProcessor::GetInstance()->StartGetAccessRecordingFor(elmtId);
    }
    return ViewStackProcessor::GetInstance()->StartGetAccessRecordingFor(elmtId);
}

int32_t JSViewStackProcessor::JsGetElmtIdToAccountFor()
{
    if (Container::IsCurrentUseNewPipeline()) {
        return NG::ViewStackProcessor::GetInstance()->GetNodeIdToAccountFor();
    }
    return ViewStackProcessor::GetInstance()->GetElmtIdToAccountFor();
}

void JSViewStackProcessor::JsSetElmtIdToAccountFor(ElementIdType elmtId)
{
    if (Container::IsCurrentUseNewPipeline()) {
        return NG::ViewStackProcessor::GetInstance()->SetNodeIdToAccountFor(elmtId);
    }
    ViewStackProcessor::GetInstance()->SetElmtIdToAccountFor(elmtId);
}

void JSViewStackProcessor::JsStopGetAccessRecording()
{
    if (Container::IsCurrentUseNewPipeline()) {
        return NG::ViewStackProcessor::GetInstance()->StopGetAccessRecording();
    }
    return ViewStackProcessor::GetInstance()->StopGetAccessRecording();
}

void JSViewStackProcessor::JsImplicitPopBeforeContinue()
{
    if (Container::IsCurrentUseNewPipeline()) {
        NG::ViewStackProcessor::GetInstance()->ImplicitPopBeforeContinue();
        return;
    }
    if ((ViewStackProcessor::GetInstance()->Size() > 1) && ViewStackProcessor::GetInstance()->ShouldPopImmediately()) {
        LOGD("Implicit Pop before continue.");
        ViewStackProcessor::GetInstance()->Pop();
        LOGD("Implicit Pop done, top component is %{public}s",
            AceType::TypeName(ViewStackProcessor::GetInstance()->GetMainComponent()));
    } else {
        LOGD("NO Implicit Pop before continue. top component is %{public}s",
            AceType::TypeName(ViewStackProcessor::GetInstance()->GetMainComponent()));
    }
}

void JSViewStackProcessor::JSMakeUniqueId(const JSCallbackInfo& info)
{
    const auto result = ElementRegister::GetInstance()->MakeUniqueId();
    info.SetReturnValue(JSRef<JSVal>::Make(ToJSValue(result)));
}

} // namespace OHOS::Ace::Framework
