/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "core/components_ng/pattern/list/list_event_hub.h"

#include "base/utils/utils.h"
#include "core/components_ng/base/frame_node.h"
#include "core/components_ng/pattern/list/list_item_pattern.h"
#include "core/components_ng/pattern/list/list_layout_property.h"
#include "core/components_ng/pattern/list/list_pattern.h"
#include "core/pipeline_ng/pipeline_context.h"

namespace OHOS::Ace::NG {

void ListEventHub::InitItemDragEvent(const RefPtr<GestureEventHub>& gestureHub)
{
    auto actionStartTask = [weak = WeakClaim(this)](const GestureEvent& info) {
        auto eventHub = weak.Upgrade();
        CHECK_NULL_VOID_NOLOG(eventHub);
        eventHub->HandleOnItemDragStart(info);
    };

    auto actionUpdateTask = [weak = WeakClaim(this)](const GestureEvent& info) {
        auto eventHub = weak.Upgrade();
        CHECK_NULL_VOID_NOLOG(eventHub);
        eventHub->HandleOnItemDragUpdate(info);
    };

    auto actionEndTask = [weak = WeakClaim(this)](const GestureEvent& info) {
        auto eventHub = weak.Upgrade();
        CHECK_NULL_VOID_NOLOG(eventHub);
        eventHub->HandleOnItemDragEnd(info);
    };

    auto actionCancelTask = [weak = WeakClaim(this)]() {
        auto eventHub = weak.Upgrade();
        CHECK_NULL_VOID_NOLOG(eventHub);
        eventHub->HandleOnItemDragCancel();
    };

    auto dragEvent = MakeRefPtr<DragEvent>(
        std::move(actionStartTask), std::move(actionUpdateTask), std::move(actionEndTask), std::move(actionCancelTask));
    gestureHub->SetDragEvent(dragEvent, { PanDirection::ALL }, DEFAULT_PAN_FINGER, DEFAULT_PAN_DISTANCE);
}

void ListEventHub::HandleOnItemDragStart(const GestureEvent& info)
{
    auto pipeline = PipelineContext::GetCurrentContext();
    CHECK_NULL_VOID(pipeline);

    auto globalX = static_cast<float>(info.GetGlobalPoint().GetX());
    auto globalY = static_cast<float>(info.GetGlobalPoint().GetY());

    draggedIndex_ = GetListItemIndexByPosition(globalX, globalY);
    OHOS::Ace::ItemDragInfo itemDragInfo;
    itemDragInfo.SetX(pipeline->ConvertPxToVp(Dimension(globalX, DimensionUnit::PX)));
    itemDragInfo.SetY(pipeline->ConvertPxToVp(Dimension(globalY, DimensionUnit::PX)));
    auto customNode = FireOnItemDragStart(itemDragInfo, draggedIndex_);
    CHECK_NULL_VOID(customNode);
    auto manager = pipeline->GetDragDropManager();
    CHECK_NULL_VOID(manager);

    dragDropProxy_ = manager->CreateAndShowDragWindow(customNode, info);
    CHECK_NULL_VOID(dragDropProxy_);
    dragDropProxy_->OnItemDragStart(info, GetFrameNode());
}

void ListEventHub::HandleOnItemDragUpdate(const GestureEvent& info)
{
    CHECK_NULL_VOID(dragDropProxy_);
    dragDropProxy_->OnItemDragMove(info, draggedIndex_, DragType::LIST);
}

void ListEventHub::HandleOnItemDragEnd(const GestureEvent& info)
{
    CHECK_NULL_VOID(dragDropProxy_);
    dragDropProxy_->OnItemDragEnd(info, draggedIndex_, DragType::LIST);
    dragDropProxy_->DestroyDragWindow();
    dragDropProxy_ = nullptr;
    draggedIndex_ = 0;
}

void ListEventHub::HandleOnItemDragCancel()
{
    CHECK_NULL_VOID(dragDropProxy_);
    dragDropProxy_->onItemDragCancel();
    dragDropProxy_->DestroyDragWindow();
    dragDropProxy_ = nullptr;
    draggedIndex_ = 0;
}

Axis ListEventHub::GetDirection() const
{
    auto host = GetFrameNode();
    CHECK_NULL_RETURN(host, Axis::VERTICAL);
    auto layoutProperty = host->GetLayoutProperty<ListLayoutProperty>();
    CHECK_NULL_RETURN(layoutProperty, Axis::VERTICAL);
    return layoutProperty->GetListDirection().value_or(Axis::VERTICAL);
}

int32_t ListEventHub::GetListItemIndexByPosition(float x, float y)
{
    auto listNode = GetFrameNode();
    CHECK_NULL_RETURN(listNode, 0);
    auto geometryNode = listNode->GetGeometryNode();
    CHECK_NULL_RETURN(geometryNode, 0);
    auto globalOffset = listNode->GetOffsetRelativeToWindow();
    float offsetX = x - globalOffset.GetX();
    float offsetY = y - globalOffset.GetY();
    float mainOffset = GetDirection() == Axis::VERTICAL ? offsetY : offsetX;
    
    auto listPattern = listNode->GetPattern<ListPattern>();
    CHECK_NULL_RETURN(listPattern, 0);
    auto itemPosition = listPattern->GetItemPosition();
    for (auto & pos : itemPosition) {
        if (mainOffset <= pos.second.endPos) {
            return pos.first;
        }
    }
    if (!itemPosition.empty()) {
        return itemPosition.rbegin()->first + 1;
    }
    return 0;
}
} // namespace OHOS::Ace::NG