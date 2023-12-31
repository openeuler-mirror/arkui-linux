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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SLIDER_SLIDER_LAYOUT_PROPERTY_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SLIDER_SLIDER_LAYOUT_PROPERTY_H

#include "core/components_ng/layout/layout_property.h"
#include "core/components_ng/pattern/slider/slider_style.h"
#include "core/pipeline/pipeline_base.h"

namespace OHOS::Ace::NG {

class ACE_EXPORT SliderLayoutProperty : public LayoutProperty {
    DECLARE_ACE_TYPE(SliderLayoutProperty, LayoutProperty);

public:
    SliderLayoutProperty() = default;
    ~SliderLayoutProperty() override = default;
    RefPtr<LayoutProperty> Clone() const override
    {
        auto value = MakeRefPtr<SliderLayoutProperty>();
        value->LayoutProperty::UpdateLayoutProperty(DynamicCast<LayoutProperty>(this));
        value->propSliderLayoutStyle_ = CloneSliderLayoutStyle();
        return value;
    }

    void Reset() override
    {
        LayoutProperty::Reset();
        ResetSliderLayoutStyle();
    }

    void ToJsonValue(std::unique_ptr<JsonValue>& json) const override
    {
        auto pipeline = PipelineBase::GetCurrentContext();
        CHECK_NULL_VOID(pipeline);
        auto theme = pipeline->GetTheme<SliderTheme>();
        CHECK_NULL_VOID(theme);
        LayoutProperty::ToJsonValue(json);
        json->Put("trackThickness",
            GetThickness()
                .value_or(GetSliderModeValue(SliderModel::SliderMode::OUTSET) == SliderModel::SliderMode::OUTSET
                              ? theme->GetOutsetTrackThickness()
                              : theme->GetInsetTrackThickness())
                .ToString().c_str());
        static const std::array<std::string, 3> SLIDER_MODE_TO_STRING = {
            "SliderStyle.OutSet",
            "SliderStyle.InSet",
            "SliderStyle.Capsule",
        };
        // should be in constructor
        json->Put("style",
            SLIDER_MODE_TO_STRING.at(static_cast<int32_t>(GetSliderMode().value_or(SliderModel::SliderMode::OUTSET)))
                .c_str());
    }

    ACE_DEFINE_PROPERTY_GROUP(SliderLayoutStyle, SliderLayoutStyle)
    ACE_DEFINE_PROPERTY_ITEM_WITH_GROUP(SliderLayoutStyle, Direction, Axis, PROPERTY_UPDATE_MEASURE)
    ACE_DEFINE_PROPERTY_ITEM_WITH_GROUP(SliderLayoutStyle, Thickness, Dimension, PROPERTY_UPDATE_MEASURE)
    ACE_DEFINE_PROPERTY_ITEM_WITH_GROUP(SliderLayoutStyle, SliderMode, SliderModel::SliderMode, PROPERTY_UPDATE_MEASURE)
private:
    ACE_DISALLOW_COPY_AND_MOVE(SliderLayoutProperty);
};

} // namespace OHOS::Ace::NG
#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_SLIDER_SLIDER_LAYOUT_PROPERTY_H
