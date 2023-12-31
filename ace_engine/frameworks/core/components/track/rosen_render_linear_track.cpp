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

#include "core/components/track/rosen_render_linear_track.h"

#include "core/SkCanvas.h"
#include "core/SkMaskFilter.h"
#include "core/SkPaint.h"
#include "core/SkPath.h"
#include "core/SkRRect.h"
#include "core/SkShader.h"
#include "effects/SkGradientShader.h"

#include "core/components/slider/render_slider.h"
#include "core/components/track/render_track.h"
#include "core/pipeline/base/rosen_render_context.h"

namespace OHOS::Ace {

sk_sp<SkShader> RosenRenderLinearTrack::BlendSkShader(const SkPoint pts, const SkColor color, bool useAnimator)
{
    const double scanLeftOffset = NormalizeToPx(Dimension(75, DimensionUnit::VP));
    const double scanRightOffset = NormalizeToPx(Dimension(5, DimensionUnit::VP));
    const Color hightLight = Color::FromString("#88ffffff");
    const Color shadow = Color::FromString("#00ffffff");
    SkColor scanColors[3] = { shadow.GetValue(), hightLight.GetValue(), shadow.GetValue() };
    SkScalar scanPos[3] = { 0, 0.94, 1 };
    sk_sp<SkShader> scanShader;
    sk_sp<SkShader> backgroundShader;
    sk_sp<SkShader> blendShader;
    const SkPoint gradientPoints[2] = { { pts.fX - scanLeftOffset, pts.fY }, { pts.fX + scanRightOffset, pts.fY } };
#ifdef USE_SYSTEM_SKIA
    backgroundShader = SkShader::MakeColorShader(color);
    scanShader = SkGradientShader::MakeLinear(gradientPoints, scanColors, scanPos, 3, SkShader::kDecal_TileMode);
    if (useAnimator) {
        blendShader = SkShader::MakeCompose(backgroundShader, scanShader, SkBlendMode::kSrcOver);
    } else {
        blendShader = backgroundShader;
    }
#else
    backgroundShader = SkShaders::Color(color);
    scanShader = SkGradientShader::MakeLinear(gradientPoints, scanColors, scanPos, 3, SkTileMode::kDecal);
    if (useAnimator) {
        blendShader = SkShaders::Blend(SkBlendMode::kSrcOver, backgroundShader, scanShader);
    } else {
        blendShader = backgroundShader;
    }
#endif
    return blendShader;
}

void RosenRenderLinearTrack::Paint(RenderContext& context, const Offset& offset)
{
    if (GetSliderMode() == SliderMode::INSET) {
        PaintSliderTrack(context, offset);
        return;
    }
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("Paint canvas is null");
        return;
    }
    double trackHeight = NormalizeToPx(TRACK_HEIGHT_DP);
    if (!NearEqual(GetTrackThickness(), 0.0)) {
        trackHeight = GetTrackThickness();
    }
    // Draw background
    PaintBackgroundTrack(canvas, offset, trackHeight);

    // Draw slider steps
    PaintSliderSteps(context, offset);

    // Draw cache region
    double trackLength = 0.0;
    if (direction_ == Axis::VERTICAL) {
        trackLength = GetLayoutSize().Height();
    } else {
        trackLength = GetLayoutSize().Width();
    }
    trackLength = trackLength - trackHeight;
    if (!NearEqual(GetCachedRatio(), 0.0)) {
        SkPaint cachedPaint;
        cachedPaint.setAntiAlias(true);
        cachedPaint.setColor(GetCachedColor().GetValue());
        const double startRect = leftToRight_ ? offset.GetX() : offset.GetX() + GetLayoutSize().Width();
        const double endRect = leftToRight_ ? startRect + trackHeight + trackLength * GetCachedRatio()
                                            : startRect - trackHeight - trackLength * GetCachedRatio();
        SkRRect cachedRect = SkRRect::MakeRectXY(
            { startRect, offset.GetY(), endRect, offset.GetY() + trackHeight }, trackHeight * HALF, trackHeight * HALF);
        SkRRect cachedRectRosen = SkRRect();
        cachedRectRosen = cachedRect;
        canvas->drawRRect(cachedRectRosen, cachedPaint);
    }
    // Draw selected region
    if (!NearEqual(GetTotalRatio(), 0.0)) {
        SkPaint selectPaint;
        selectPaint.setAntiAlias(true);
        double startRect = 0.0;
        double endRect = 0.0;
        if (direction_ == Axis::VERTICAL) {
            startRect = isReverse_ ? offset.GetY() + GetLayoutSize().Height() : offset.GetY();
            endRect = isReverse_ ? startRect - trackHeight - trackLength * GetTotalRatio()
                                : startRect + trackHeight + trackLength * GetTotalRatio();
            SkRRect selectRect = SkRRect::MakeRectXY({ offset.GetX(), startRect, offset.GetX() + trackHeight, endRect },
                trackHeight * HALF, trackHeight * HALF);
            selectPaint.setShader(
                BlendSkShader({ offset.GetX(), startRect }, GetSelectColor().GetValue(), playAnimation_));
            canvas->drawRRect(selectRect, selectPaint);
            return;
        }
        if ((leftToRight_ && !isReverse_) || (!leftToRight_ && isReverse_)) {
            startRect = offset.GetX();
            endRect = startRect + trackHeight + trackLength * GetTotalRatio();
        } else {
            startRect = offset.GetX() + GetLayoutSize().Width();
            endRect = startRect - trackHeight - trackLength * GetTotalRatio();
        }
        SkRRect selectRect = SkRRect::MakeRectXY({ startRect, offset.GetY(), endRect, offset.GetY() + trackHeight },
                trackHeight * HALF, trackHeight * HALF);
        selectPaint.setShader(BlendSkShader({ startRect + scanHighLightValue_ * trackLength, offset.GetY() },
            GetSelectColor().GetValue(), playAnimation_));
        canvas->drawRRect(selectRect, selectPaint);
    }
}

void RosenRenderLinearTrack::PaintSliderSteps(RenderContext& context, const Offset& offset)
{
    if (NearZero(GetSliderSteps()) || NearEqual(GetSliderSteps(), GetLayoutSize().Width())) {
        LOGD("slider steps invalid");
        return;
    }
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("Paint canvas is null");
        return;
    }

    double size = 0.0;
    Color color;
    RefPtr<SliderTheme> theme = GetTheme<SliderTheme>();
    if (theme) {
        size = NormalizeToPx(theme->GetMarkerSize());
        color = theme->GetMarkerColor();
    }

    double trackHeight = NormalizeToPx(TRACK_HEIGHT_DP);
    if (!NearEqual(GetTrackThickness(), 0.0)) {
        trackHeight = GetTrackThickness();
    }
    if (direction_ == Axis::VERTICAL) {
        const double trackLength = GetLayoutSize().Height();
        const double dxOffset = offset.GetX() + trackHeight * HALF;
        double current = offset.GetY();
        SkPaint skPaint;
        skPaint.setColor(color.GetValue());
        skPaint.setStyle(SkPaint::Style::kStroke_Style);
        skPaint.setStrokeWidth(size);
        skPaint.setStrokeCap(SkPaint::Cap::kRound_Cap);
        SkPath path;
        while (LessOrEqual(current, offset.GetY() + trackLength)) {
            double dyOffset;
            if (GetSliderMode() == SliderMode::OUTSET) {
                dyOffset = std::clamp(current, offset.GetY() + size * HALF, offset.GetY() + trackLength - size * HALF);
            } else {
                dyOffset = std::clamp(current, offset.GetY(), offset.GetY() + trackLength);
            }
            path.moveTo(SkDoubleToScalar(dxOffset), SkDoubleToScalar(dyOffset));
            path.lineTo(SkDoubleToScalar(dxOffset), SkDoubleToScalar(dyOffset));
            current += GetSliderSteps();
        }
        canvas->drawPath(path, skPaint);
    } else {
        const double trackLength = GetLayoutSize().Width();
        const double dyOffset = offset.GetY() + trackHeight * HALF;
        double current = offset.GetX();
        SkPaint skPaint;
        skPaint.setColor(color.GetValue());
        skPaint.setStyle(SkPaint::Style::kStroke_Style);
        skPaint.setStrokeWidth(size);
        skPaint.setStrokeCap(SkPaint::Cap::kRound_Cap);
        SkPath path;
        while (LessOrEqual(current, offset.GetY() + trackLength)) {
            double dxOffset;
            if (GetSliderMode() == SliderMode::OUTSET) {
                dxOffset = std::clamp(current, offset.GetX() + size * HALF, offset.GetX() + trackLength - size * HALF);
            } else {
                dxOffset = std::clamp(current, offset.GetX(), offset.GetX() + trackLength);
            }
            path.moveTo(SkDoubleToScalar(dxOffset), SkDoubleToScalar(dyOffset));
            path.lineTo(SkDoubleToScalar(dxOffset), SkDoubleToScalar(dyOffset));
            current += GetSliderSteps();
        }
        canvas->drawPath(path, skPaint);
    }
}

void RosenRenderLinearTrack::PaintSliderTrack(RenderContext& context, const Offset& offset)
{
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("Paint canvas is null");
        return;
    }
    double trackHeight = NormalizeToPx(TRACK_HEIGHT_DP);
    if (!NearEqual(GetTrackThickness(), 0.0)) {
        trackHeight = GetTrackThickness();
    }
    double trackLength = 0.0;
    double dxOffset = 0.0;
    double dyOffset = 0.0;
    if (direction_ == Axis::VERTICAL) {
        trackLength = GetLayoutSize().Height();
        dxOffset = offset.GetX() + trackHeight * HALF;
    } else {
        trackLength = GetLayoutSize().Width();
        dyOffset = offset.GetY() + trackHeight * HALF;
    }

    // Draw background
    SkPaint railPaint;
    railPaint.setAntiAlias(true);
    railPaint.setColor(GetBackgroundColor().GetValue());
    railPaint.setStyle(SkPaint::Style::kStroke_Style);
    railPaint.setStrokeWidth(trackHeight);
    railPaint.setStrokeCap(SkPaint::kRound_Cap);
    if (direction_ == Axis::VERTICAL) {
        canvas->drawLine(dxOffset, offset.GetY(), dxOffset, offset.GetY() + trackLength, railPaint);
    } else {
        canvas->drawLine(offset.GetX(), dyOffset, offset.GetX() + trackLength, dyOffset, railPaint);
    }

    // draw steps
    PaintSliderSteps(context, offset);

    // Draw selected region
    if (!NearEqual(GetTotalRatio(), 0.0)) {
        SkPaint selectPaint;
        selectPaint.setAntiAlias(true);
        selectPaint.setColor(GetSelectColor().GetValue());
        selectPaint.setStyle(SkPaint::Style::kStroke_Style);
        selectPaint.setStrokeWidth(trackHeight);
        selectPaint.setStrokeCap(SkPaint::kRound_Cap);
        double fromOffset = 0.0;
        double toOffset = 0.0;
        if (direction_ == Axis::VERTICAL) {
            fromOffset = isReverse_ ? offset.GetY() + trackLength : offset.GetY();
            toOffset = isReverse_ ?
                fromOffset - trackLength * GetTotalRatio() : fromOffset + trackLength * GetTotalRatio();
            canvas->drawLine(dxOffset, fromOffset, dxOffset, toOffset, selectPaint);
            return;
        }
        if (((leftToRight_ && !isReverse_)) || ((!leftToRight_ && isReverse_))) {
            fromOffset = offset.GetX();
            toOffset = fromOffset + trackLength * GetTotalRatio();
        } else {
            fromOffset = offset.GetX() + trackLength;
            toOffset = fromOffset - trackLength * GetTotalRatio();
        }
        canvas->drawLine(fromOffset, dyOffset, toOffset, dyOffset, selectPaint);
    }
}

void RosenRenderLinearTrack::PaintBackgroundTrack(SkCanvas* canvas, const Offset& offset, double trackHeight) const
{
    SkPaint railPaint;
    railPaint.setAntiAlias(true);
    railPaint.setColor(GetBackgroundColor().GetValue());
    SkRRect rrect;
    if (direction_ == Axis::VERTICAL) {
        rrect = SkRRect::MakeRectXY(
            { offset.GetX(), offset.GetY(), offset.GetX() + trackHeight, offset.GetY() + GetLayoutSize().Height() },
            trackHeight * HALF, trackHeight * HALF);
    } else {
        rrect = SkRRect::MakeRectXY(
            { offset.GetX(), offset.GetY(), offset.GetX() + GetLayoutSize().Width(), offset.GetY() + trackHeight },
            trackHeight * HALF, trackHeight * HALF);
    }

    canvas->drawRRect(rrect, railPaint);
}

} // namespace OHOS::Ace