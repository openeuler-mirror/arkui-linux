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

#include "bridge/declarative_frontend/jsview/js_grid_item.h"

#include "bridge/declarative_frontend/engine/functions/js_mouse_function.h"
#include "bridge/declarative_frontend/jsview/models/grid_item_model_impl.h"
#include "core/common/container.h"
#include "core/components_ng/pattern/grid/grid_item_model_ng.h"

namespace OHOS::Ace {

std::unique_ptr<GridItemModel> GridItemModel::instance_ = nullptr;

GridItemModel* GridItemModel::GetInstance()
{
    if (!instance_) {
#ifdef NG_BUILD
        instance_.reset(new NG::GridItemModelNG());
#else
        if (Container::IsCurrentUseNewPipeline()) {
            instance_.reset(new NG::GridItemModelNG());
        } else {
            instance_.reset(new Framework::GridItemModelImpl());
        }
#endif
    }
    return instance_.get();
}

} // namespace OHOS::Ace

namespace OHOS::Ace::Framework {

void JSGridItem::Create(const JSCallbackInfo& args)
{
    if (Container::IsCurrentUsePartialUpdate()) {
        CreateForPartialUpdate(args);
        return;
    }
    GridItemModel::GetInstance()->Create();
}

void JSGridItem::CreateForPartialUpdate(const JSCallbackInfo& args)
{
    if (args.Length() < 2 || !args[0]->IsFunction() || !args[1]->IsBoolean()) {
        LOGE("parameter not valid");
        GridItemModel::GetInstance()->Create();
        return;
    }

    auto isLazy = args[1]->ToBoolean();
    auto jsDeepRender = AceType::MakeRefPtr<JsFunction>(args.This(), JSRef<JSFunc>::Cast(args[0]));
    auto gridItemDeepRenderFunc = [execCtx = args.GetExecutionContext(), jsDeepRenderFunc = std::move(jsDeepRender)](
                                      int32_t elmtId) {
        ACE_SCOPED_TRACE("JSGridItem::ExecuteDeepRender");
        LOGD("GridItem elmtId %{public}d DeepRender JS function execution start ....", elmtId);
        ACE_DCHECK(componentsStack_.empty());
        JAVASCRIPT_EXECUTION_SCOPE(execCtx);
        JSRef<JSVal> jsParams[2];
        jsParams[0] = JSRef<JSVal>::Make(ToJSValue(elmtId));
        jsParams[1] = JSRef<JSVal>::Make(ToJSValue(true));
        jsDeepRenderFunc->ExecuteJS(2, jsParams);
        LOGD("GridItem elmtId %{public}d DeepRender JS function execution - done ", elmtId);
    };
    GridItemModel::GetInstance()->Create(std::move(gridItemDeepRenderFunc), isLazy);
}

void JSGridItem::SetColumnStart(int32_t columnStart)
{
    GridItemModel::GetInstance()->SetColumnStart(columnStart);
}

void JSGridItem::SetColumnEnd(int32_t columnEnd)
{
    GridItemModel::GetInstance()->SetColumnEnd(columnEnd);
}

void JSGridItem::SetRowStart(int32_t rowStart)
{
    GridItemModel::GetInstance()->SetRowStart(rowStart);
}

void JSGridItem::SetRowEnd(int32_t rowEnd)
{
    GridItemModel::GetInstance()->SetRowEnd(rowEnd);
}

void JSGridItem::ForceRebuild(bool forceRebuild)
{
    GridItemModel::GetInstance()->SetForceRebuild(forceRebuild);
}

void JSGridItem::SetSelectable(bool selectable)
{
    GridItemModel::GetInstance()->SetSelectable(selectable);
}

void JSGridItem::SelectCallback(const JSCallbackInfo& args)
{
    if (!args[0]->IsFunction()) {
        LOGE("fail to bind onSelect event due to info is not function");
        return;
    }

    RefPtr<JsMouseFunction> jsOnSelectFunc = AceType::MakeRefPtr<JsMouseFunction>(JSRef<JSFunc>::Cast(args[0]));
    auto onSelectId = [execCtx = args.GetExecutionContext(), func = std::move(jsOnSelectFunc)](bool isSelected) {
        JAVASCRIPT_EXECUTION_SCOPE_WITH_CHECK(execCtx);
        func->SelectExecute(isSelected);
    };
    GridItemModel::GetInstance()->SetOnSelect(std::move(onSelectId));
}

void JSGridItem::JSBind(BindingTarget globalObj)
{
    LOGD("GridItem:JSBind");
    JSClass<JSGridItem>::Declare("GridItem");

    MethodOptions opt = MethodOptions::NONE;
    JSClass<JSGridItem>::StaticMethod("create", &JSGridItem::Create, opt);
    JSClass<JSGridItem>::StaticMethod("columnStart", &JSGridItem::SetColumnStart, opt);
    JSClass<JSGridItem>::StaticMethod("columnEnd", &JSGridItem::SetColumnEnd, opt);
    JSClass<JSGridItem>::StaticMethod("rowStart", &JSGridItem::SetRowStart, opt);
    JSClass<JSGridItem>::StaticMethod("rowEnd", &JSGridItem::SetRowEnd, opt);
    JSClass<JSGridItem>::StaticMethod("forceRebuild", &JSGridItem::ForceRebuild, opt);
    JSClass<JSGridItem>::StaticMethod("selectable", &JSGridItem::SetSelectable, opt);
    JSClass<JSGridItem>::StaticMethod("onSelect", &JSGridItem::SelectCallback);
    JSClass<JSGridItem>::StaticMethod("width", &JSGridItem::SetGridItemWidth);
    JSClass<JSGridItem>::StaticMethod("height", &JSGridItem::SetGridItemHeight);
    JSClass<JSGridItem>::StaticMethod("onClick", &JSInteractableView::JsOnClick);
    JSClass<JSGridItem>::StaticMethod("onAppear", &JSInteractableView::JsOnAppear);
    JSClass<JSGridItem>::StaticMethod("onDisAppear", &JSInteractableView::JsOnDisAppear);
    JSClass<JSGridItem>::StaticMethod("onTouch", &JSInteractableView::JsOnTouch);
    JSClass<JSGridItem>::StaticMethod("onHover", &JSInteractableView::JsOnHover);
    JSClass<JSGridItem>::StaticMethod("onKeyEvent", &JSInteractableView::JsOnKey);
    JSClass<JSGridItem>::StaticMethod("onDeleteEvent", &JSInteractableView::JsOnDelete);
    JSClass<JSGridItem>::StaticMethod("remoteMessage", &JSInteractableView::JsCommonRemoteMessage);

    JSClass<JSGridItem>::Inherit<JSContainerBase>();
    JSClass<JSGridItem>::Inherit<JSViewAbstract>();
    JSClass<JSGridItem>::Bind<>(globalObj);
}

} // namespace OHOS::Ace::Framework
