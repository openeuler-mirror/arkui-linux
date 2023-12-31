/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#include "core/components/track/rosen_render_circular_track.h"

#include "core/SkCanvas.h"
#include "core/SkColor.h"
#include "core/SkPaint.h"
#include "effects/SkGradientShader.h"

#include "core/pipeline/base/rosen_render_context.h"

namespace OHOS::Ace {
namespace {

constexpr double COLOR_STOP = 0.4;
constexpr int32_t COLOR_NUM = 3;

void DrawArc(RenderContext& context, const RenderRingInfo& trackInfo)
{
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("Paint canvas is null");
        return;
    }
    double thickness = trackInfo.thickness;
    SkPaint paint;
    paint.setAntiAlias(true);
    if (trackInfo.gradient.IsValid()) {
        SkColor colors[trackInfo.gradient.GetColors().size() + 1];
        // size cannot be larger than uint32_t.
        for (uint32_t index = 0; index < trackInfo.gradient.GetColors().size(); index++) {
            colors[index] = trackInfo.gradient.GetColors()[index].GetColor().GetValue();
        }
        colors[trackInfo.gradient.GetColors().size()] = trackInfo.gradient.GetColors()[0].GetColor().GetValue();
        float position[] = { COLOR_STOP, 2.0 * COLOR_STOP, 1.0 };
#ifdef USE_SYSTEM_SKIA
        paint.setShader(SkGradientShader::MakeSweep(trackInfo.center.GetX(), trackInfo.center.GetY(), colors, position,
            COLOR_NUM, SkShader::kClamp_TileMode, trackInfo.startDegree, trackInfo.startDegree + 360, true, nullptr));
#else
        paint.setShader(SkGradientShader::MakeSweep(trackInfo.center.GetX(), trackInfo.center.GetY(), colors, position,
            COLOR_NUM, SkTileMode::kClamp, trackInfo.startDegree, trackInfo.startDegree + 360, true, nullptr));
#endif
    } else {
        paint.setColor(trackInfo.color.GetValue());
    }
    paint.setStyle(SkPaint::Style::kStroke_Style);
    paint.setStrokeWidth(thickness);
    paint.setStrokeCap(SkPaint::kRound_Cap);

    const double degreeOffset = -90;
    canvas->drawArc({ trackInfo.center.GetX() + (thickness / 2) - trackInfo.radius,
                        trackInfo.center.GetY() + (thickness / 2) - trackInfo.radius,
                        trackInfo.center.GetX() + trackInfo.radius - (thickness / 2),
                        trackInfo.center.GetY() + trackInfo.radius - (thickness / 2) },
        trackInfo.clockwise * trackInfo.startDegree + degreeOffset,
        trackInfo.clockwise * trackInfo.sweepDegree, false, paint);
}
} // namespace

void RosenRenderCircularTrack::Paint(RenderContext& context, const Offset& offset)
{
    RenderRingInfo data = paintData_;

    data.center = offset + Offset(GetLayoutSize().Width() / 2, GetLayoutSize().Height() / 2);
    data.radius = GetLayoutSize().Width() / 2;
    auto canvas = static_cast<RosenRenderContext*>(&context)->GetCanvas();
    if (!canvas) {
        LOGE("Paint canvas is null");
        return;
    }
    canvas->save();

    // draw background
    data.color = GetBackgroundColor();
    DrawArc(context, data);

    // draw cache
    data.color = GetCachedColor();
    data.sweepDegree = paintData_.sweepDegree * GetCachedRatio();
    DrawArc(context, data);

    // draw select
    data.color = GetSelectColor();
    data.gradient = GetGradient();
    data.sweepDegree = paintData_.sweepDegree * GetTotalRatio();
    DrawArc(context, data);

    canvas->restore();
}

} // namespace OHOS::Ace