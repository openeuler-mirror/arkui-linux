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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_CHECKBOXGROUP_CHECKBOXGROUP_PAINT_PROPERTY_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_CHECKBOXGROUP_CHECKBOXGROUP_PAINT_PROPERTY_H

#include "core/animation/curve.h"
#include "core/components/common/layout/constants.h"
#include "core/components/common/properties/color.h"
#include "core/components_ng/render/paint_property.h"

namespace OHOS::Ace::NG {

class CheckBoxGroupPaintProperty : public PaintProperty {
    DECLARE_ACE_TYPE(CheckBoxGroupPaintProperty, PaintProperty)

public:
    CheckBoxGroupPaintProperty() = default;
    ~CheckBoxGroupPaintProperty() override = default;

    RefPtr<PaintProperty> Clone() const override
    {
        auto paintProperty = MakeRefPtr<CheckBoxGroupPaintProperty>();
        paintProperty->UpdatePaintProperty(this);
        paintProperty->propCheckBoxGroupSelect_ = CloneCheckBoxGroupSelect();
        paintProperty->propCheckBoxGroupSelectedColor_ = CloneCheckBoxGroupSelectedColor();
        paintProperty->propStatus_ = propStatus_;

        return paintProperty;
    }

    void Reset() override
    {
        PaintProperty::Reset();
        ResetCheckBoxGroupSelect();
        ResetCheckBoxGroupSelectedColor();

        propStatus_ = SelectStatus::NONE;
    }

    enum class SelectStatus {
        ALL = 0,
        PART,
        NONE,
    };

    SelectStatus& GetSelectStatus()
    {
        return propStatus_;
    }

    void SetSelectStatus(const SelectStatus& status)
    {
        propStatus_ = status;
    }

    bool GetIsCheckBoxCallbackDealed()
    {
        return isCheckBoxCallbackDealed_;
    }

    void SetIsCheckBoxCallbackDealed(bool dealed)
    {
        isCheckBoxCallbackDealed_ = true;
    }

    void ToJsonValue(std::unique_ptr<JsonValue>& json) const override;

    ACE_DEFINE_PROPERTY_ITEM_WITHOUT_GROUP(CheckBoxGroupSelect, bool, PROPERTY_UPDATE_RENDER);
    ACE_DEFINE_PROPERTY_ITEM_WITHOUT_GROUP(CheckBoxGroupSelectedColor, Color, PROPERTY_UPDATE_RENDER);

private:
    SelectStatus propStatus_ = SelectStatus::NONE;
    bool isCheckBoxCallbackDealed_ = false;
};

} // namespace OHOS::Ace::NG

#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_PATTERN_CHECKBOXGROUP_CHECKBOXGROUP_PAINT_PROPERTY_H
