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

#include "mouse_style_ohos.h"

#include "input_manager.h"
#include "struct_multimodal.h"

#include "base/log/log_wrapper.h"
#include "base/utils/linear_map.h"
#include "base/utils/utils.h"

namespace OHOS::Ace {

RefPtr<MouseStyle> MouseStyle::CreateMouseStyle()
{
    return AceType::MakeRefPtr<MouseStyleOhos>();
}

bool MouseStyleOhos::SetPointerStyle(int32_t windowId, MouseFormat pointerStyle) const
{
    auto inputManager = MMI::InputManager::GetInstance();
    CHECK_NULL_RETURN(inputManager, false);
    static const LinearEnumMapNode<MouseFormat, int32_t> mouseFormatMap[] = {
        { MouseFormat::DEFAULT, MMI::DEFAULT },
        { MouseFormat::WEST_EAST, MMI::WEST_EAST },
        { MouseFormat::NORTH_SOUTH, MMI::NORTH_SOUTH },
        { MouseFormat::NORTH_EAST_SOUTH_WEST, MMI::NORTH_EAST_SOUTH_WEST },
        { MouseFormat::NORTH_WEST_SOUTH_EAST, MMI::NORTH_WEST_SOUTH_EAST },
        { MouseFormat::CROSS, MMI::CROSS },
        { MouseFormat::CURSOR_COPY, MMI::CURSOR_COPY },
        { MouseFormat::CURSOR_FORBID, MMI::CURSOR_FORBID },
        { MouseFormat::HAND_GRABBING, MMI::HAND_GRABBING },
        { MouseFormat::HAND_POINTING, MMI::HAND_POINTING },
        { MouseFormat::HELP, MMI::HELP },
        { MouseFormat::CURSOR_MOVE, MMI::CURSOR_MOVE },
        { MouseFormat::RESIZE_LEFT_RIGHT, MMI::RESIZE_LEFT_RIGHT },
        { MouseFormat::RESIZE_UP_DOWN, MMI::RESIZE_UP_DOWN },
        { MouseFormat::TEXT_CURSOR, MMI::TEXT_CURSOR },
        { MouseFormat::ZOOM_IN, MMI::ZOOM_IN },
        { MouseFormat::ZOOM_OUT, MMI::ZOOM_OUT },
    };
    int32_t MMIPointStyle = MMI::DEFAULT;
    int64_t idx = BinarySearchFindIndex(mouseFormatMap, ArraySize(mouseFormatMap), pointerStyle);
    if (idx >= 0) {
        MMIPointStyle = mouseFormatMap[idx].value;
    }
    int32_t setResult = inputManager->SetPointerStyle(windowId, MMIPointStyle);
    if (setResult == -1) {
        LOGE("SetPointerStyle result is false");
        return false;
    }
    return true;
}

int32_t MouseStyleOhos::GetPointerStyle(int32_t windowId, int32_t& pointerStyle) const
{
    auto inputManager = MMI::InputManager::GetInstance();
    CHECK_NULL_RETURN(inputManager, -1);
    int32_t getResult = inputManager->GetPointerStyle(windowId, pointerStyle);
    if (getResult == -1) {
        LOGE("GetPointerStyle result is false");
        return -1;
    }
    return getResult;
}

bool MouseStyleOhos::ChangePointerStyle(int32_t windowId, MouseFormat mouseFormat) const
{
    int32_t curPointerStyle = -1;
    if (GetPointerStyle(windowId, curPointerStyle) == -1) {
        LOGE("ChangePointerStyle: GetPointerStyle return failed");
        return false;
    }
    if (curPointerStyle == static_cast<int32_t>(mouseFormat)) {
        return true;
    }

    LOGD("ChangePointerStyle do SetPointerStyle: %{public}d", mouseFormat);
    return SetPointerStyle(windowId, mouseFormat);
}

} // namespace OHOS::Ace
