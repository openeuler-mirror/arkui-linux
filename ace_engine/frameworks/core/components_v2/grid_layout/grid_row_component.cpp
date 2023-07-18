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

#include "core/components_v2/grid_layout/grid_row_component.h"

#include "core/components_v2/grid_layout/grid_row_element.h"
#include "core/components_v2/grid_layout/render_grid_row.h"

namespace OHOS::Ace::V2 {
RefPtr<RenderNode> GridRowComponent::CreateRenderNode()
{
    return RenderGridRow::Create();
}

RefPtr<Element> GridRowComponent::CreateElement()
{
    return AceType::MakeRefPtr<GridRowElement>();
}
} // namespace OHOS::Ace::V2