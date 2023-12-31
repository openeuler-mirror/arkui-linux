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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SWITCH_SWITCH_PAINT_METHOD_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SWITCH_SWITCH_PAINT_METHOD_H

#include "core/components_ng/pattern/toggle/switch_modifier.h"
#include "core/components_ng/pattern/toggle/switch_paint_property.h"
#include "core/components_ng/render/canvas.h"
#include "core/components_ng/render/canvas_image.h"
#include "core/components_ng/render/node_paint_method.h"
#include "core/components_ng/render/paint_wrapper.h"
#include "core/components_ng/render/render_context.h"

namespace OHOS::Ace::NG {
class ACE_EXPORT SwitchPaintMethod : public NodePaintMethod {
    DECLARE_ACE_TYPE(SwitchPaintMethod, NodePaintMethod)
public:
    explicit SwitchPaintMethod(const RefPtr<SwitchModifier>& switchModifier) : switchModifier_(switchModifier) {}

    ~SwitchPaintMethod() override = default;

    RefPtr<Modifier> GetContentModifier(PaintWrapper* paintWrapper) override
    {
        CHECK_NULL_RETURN(switchModifier_, nullptr);
        return switchModifier_;
    }

    void UpdateContentModifier(PaintWrapper* paintWrapper) override
    {
        CHECK_NULL_VOID(switchModifier_);
        switchModifier_->InitializeParam();
        auto paintProperty = DynamicCast<SwitchPaintProperty>(paintWrapper->GetPaintProperty());
        if (paintProperty->HasSelectedColor()) {
            switchModifier_->SetUserActiveColor(paintProperty->GetSelectedColor().value());
        }
        if (paintProperty->HasSwitchPointColor()) {
            switchModifier_->SetUserPointColor(paintProperty->GetSwitchPointColor().value());
        }
        auto size = paintWrapper->GetContentSize();
        auto offset = paintWrapper->GetContentOffset();
        switchModifier_->SetSize(size);
        switchModifier_->SetOffset(offset);
        switchModifier_->SetEnabled(enabled_);
        switchModifier_->SetIsSelect(isSelect_);
        switchModifier_->SetIsHover(isHover_);
        switchModifier_->SetMainDelta(mainDelta_);
        switchModifier_->UpdateAnimatableProperty();
    }

    void SetHotZoneOffset(OffsetF& hotZoneOffset)
    {
        hotZoneOffset_ = hotZoneOffset;
    }

    void SetHotZoneSize(SizeF& hotZoneSize)
    {
        hotZoneSize_ = hotZoneSize;
    }

    void SetHoverPercent(float hoverPercent)
    {
        hoverPercent_ = hoverPercent;
    }

    void SetEnabled(bool enabled)
    {
        enabled_ = enabled;
    }

    void SetMainDelta(float mainDelta)
    {
        mainDelta_ = mainDelta;
    }

    void SetIsSelect(bool isSelect)
    {
        isSelect_ = isSelect;
    }

    void SetIsHover(bool isHover)
    {
        isHover_ = isHover;
    }

private:
    float mainDelta_ = 0.0f;
    float hoverPercent_ = 0.0f;
    const Dimension radiusGap_ = 2.0_vp;
    bool enabled_ = true;
    bool isSelect_ = true;
    Color clickEffectColor_ = Color::WHITE;
    Color hoverColor_ = Color::WHITE;
    Dimension hoverRadius_ = 8.0_vp;

    bool isHover_ = false;
    OffsetF hotZoneOffset_;
    SizeF hotZoneSize_;

    RefPtr<SwitchModifier> switchModifier_;

    ACE_DISALLOW_COPY_AND_MOVE(SwitchPaintMethod);
};
} // namespace OHOS::Ace::NG

#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SWITCH_SWITCH_PAINT_METHOD_H
