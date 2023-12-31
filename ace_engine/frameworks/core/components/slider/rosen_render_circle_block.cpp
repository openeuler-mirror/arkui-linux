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

#include "core/components/slider/rosen_render_circle_block.h"

#include "core/SkMaskFilter.h"
#include "core/SkPath.h"
#include "core/SkRRect.h"

#include "base/utils/system_properties.h"
#include "core/components/common/painter/rosen_decoration_painter.h"
#include "core/components/common/properties/shadow.h"
#include "core/components/common/properties/shadow_config.h"
#include "core/pipeline/base/rosen_render_context.h"
#include "render_service_client/core/ui/rs_node.h"

namespace OHOS::Ace {
namespace {

constexpr double BORDER_WEIGHT = 0.33;
constexpr double HALF = 0.5;
constexpr double RADIUS_PADDING = 4.0;
constexpr Dimension HOVER_RADIUS = 12.0_vp;
constexpr Dimension PRESS_RADIUS = 12.0_vp;
constexpr Dimension FOCUS_BORDER_PADDING = 2.0_vp;
constexpr uint32_t FOCUS_BORDER_COLOR = 0xFF0A59F7;
constexpr uint32_t HOVER_BORDER_COLOR = 0x0C000000;
constexpr uint32_t PRESS_BORDER_COLOR = 0x19000000;
} // namespace

void RosenRenderCircleBlock::Update(const RefPtr<Component>& component)
{
    LOGD("Slider::Update");
    RenderBlock::Update(component);
}

void RosenRenderCircleBlock::SyncGeometryProperties()
{
    RenderBlock::SyncGeometryProperties();
    auto rsNode = GetRSNode();
    if (!rsNode) {
        return;
    }

    double radius = NormalizeToPx(blockSize_) * HALF * radiusScale_;
    double diameter = radius * 2.0;
    auto frame = rsNode->GetStagingProperties().GetFrame();
    SkRect rect = SkRect::MakeXYWH(frame.x_ - radius, frame.y_ - radius, diameter, diameter);

    float elevationOfDefaultShadowXS = 4.0f;
    float transRatio = elevationOfDefaultShadowXS / (LIGHT_HEIGHT - elevationOfDefaultShadowXS);
    float spotRatio = LIGHT_HEIGHT / (LIGHT_HEIGHT - elevationOfDefaultShadowXS);

    SkRect spotRect = SkRect::MakeLTRB(rect.left() * spotRatio, rect.top() * spotRatio,
        rect.right() * spotRatio, rect.bottom() * spotRatio);
    spotRect.offset(-transRatio * LIGHT_POSITION_X, -transRatio * LIGHT_POSITION_Y);
    spotRect.outset(transRatio * LIGHT_RADIUS, transRatio * LIGHT_RADIUS);

    SkRect shadowRect = rect;
    float ambientBlur = 2.0f;
    shadowRect.outset(ambientBlur, ambientBlur);
    shadowRect.join(spotRect);
    shadowRect.outset(1, 1);

    float offsetX = 0.0f;
    float offsetY = 0.0f;
    if (isHover_) {
        double hoverRadius = NormalizeToPx(HOVER_RADIUS);
        offsetX = hoverRadius > shadowRect.width() * HALF ? hoverRadius : shadowRect.width() * HALF;
        offsetY = hoverRadius > shadowRect.height() * HALF ? hoverRadius : shadowRect.height() * HALF;
    } else if (isPress_) {
        double pressRadius = NormalizeToPx(PRESS_RADIUS);
        offsetX = pressRadius > shadowRect.width() * HALF ? pressRadius : shadowRect.width() * HALF;
        offsetY = pressRadius > shadowRect.height() * HALF ? pressRadius : shadowRect.height() * HALF;
    } else {
        offsetX = shadowRect.width() * HALF;
        offsetY = shadowRect.height() * HALF;
    }
    rsNode->SetFrame(frame.x_ - offsetX, frame.y_ - offsetY, frame.z_ + offsetX, frame.w_ + offsetY);
}

void RosenRenderCircleBlock::Paint(RenderContext& context, const Offset& offset)
{
    LOGD("Slider::Paint_offset position x:%{public}lf, y:%{public}lf radiusScale:%{public}lf", offset.GetX(),
        offset.GetY(), radiusScale_);
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("canvas fetch failed");
        return;
    }

    if (isHover_) {
        SkPaint hoverPaint;
        hoverPaint.setColor(HOVER_BORDER_COLOR);
        double hoverRadius = NormalizeToPx(HOVER_RADIUS);
        canvas->drawCircle(offset.GetX(), offset.GetY(), hoverRadius, hoverPaint);
    }

    if (isPress_) {
        SkPaint pressPaint;
        pressPaint.setColor(PRESS_BORDER_COLOR);
        double pressRadius = NormalizeToPx(PRESS_RADIUS);
        canvas->drawCircle(offset.GetX(), offset.GetY(), pressRadius, pressPaint);
    }

    double radius = NormalizeToPx(blockSize_) * HALF * radiusScale_;

    PaintShadow(context, offset, radius);

    if (GetFocus() && GetMode() == SliderMode::OUTSET) {
        SkPaint focusPaint;
        focusPaint.setColor(FOCUS_BORDER_COLOR);
        focusPaint.setStyle(SkPaint::Style::kStroke_Style);
        focusPaint.setStrokeWidth(NormalizeToPx(FOCUS_BORDER_PADDING));
        focusPaint.setAntiAlias(true);
        canvas->drawCircle(offset.GetX(), offset.GetY(), radius + RADIUS_PADDING, focusPaint);
        SkPaint blockPaint;
        blockPaint.setColor(SkColorSetARGB(GetBlockColor().GetAlpha(), GetBlockColor().GetRed(),
            GetBlockColor().GetGreen(), GetBlockColor().GetBlue()));
        blockPaint.setAntiAlias(true);
        canvas->drawCircle(offset.GetX(), offset.GetY(), radius, blockPaint);
    } else {
        SkPaint blockPaint;
        blockPaint.setColor(SkColorSetARGB(GetBlockColor().GetAlpha(), GetBlockColor().GetRed(),
            GetBlockColor().GetGreen(), GetBlockColor().GetBlue()));
        blockPaint.setAntiAlias(true);
        canvas->drawCircle(offset.GetX(), offset.GetY(), radius, blockPaint);
    }

    // Draw block border
    SkPaint borderPaint;
    // use this color to reduce the loss at corner.
    static const uint8_t alpha = 13;
    borderPaint.setColor(SkColorSetARGB(alpha, 0, 0, 0));
    borderPaint.setStyle(SkPaint::Style::kStroke_Style);
    borderPaint.setAntiAlias(true);
    borderPaint.setStrokeWidth(BORDER_WEIGHT);
    canvas->drawCircle(offset.GetX(), offset.GetY(), radius, borderPaint);
}

void RosenRenderCircleBlock::PaintShadow(RenderContext& context, const Offset& offset, double radius)
{
    double diameter = radius * 2.0;
    SkRect rect = SkRect::MakeXYWH(offset.GetX() - radius, offset.GetY() - radius, diameter, diameter);
    RosenDecorationPainter::PaintShadow(SkPath().addRRect(SkRRect::MakeRectXY(rect, radius, radius)),
        ShadowConfig::DefaultShadowXS, static_cast<RosenRenderContext*>(&context)->GetCanvas());
}

} // namespace OHOS::Ace