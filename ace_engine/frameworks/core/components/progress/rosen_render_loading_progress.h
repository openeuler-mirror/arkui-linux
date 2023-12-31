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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_PROGRESS_ROSEN_RENDER_LOADING_PROGRESS_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_PROGRESS_ROSEN_RENDER_LOADING_PROGRESS_H

#include "utils/SkCamera.h"

#include "base/geometry/offset.h"
#include "core/components/progress/render_loading_progress.h"
#include "core/pipeline/base/render_context.h"
#include "core/pipeline/base/rosen_render_context.h"

namespace OHOS::Ace {

class RosenRenderLoadingProgress final : public RenderLoadingProgress {
    DECLARE_ACE_TYPE(RosenRenderLoadingProgress, RenderLoadingProgress);

public:
    RosenRenderLoadingProgress() = default;
    ~RosenRenderLoadingProgress() override = default;

    void Paint(RenderContext& context, const Offset& offset) override;

    void PaintRing(SkCanvas* canvas, const Offset& offset);

    void PaintComet(SkCanvas* canvas, const Offset& offset);

private:
    void RotateCalculate(const Offset& src, Offset& dst, float degrees);

    Sk3DView* camera_ = nullptr;
    double locationOffsetY_ = 0.0;
    Offset cometCenter_;
};

} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_PROGRESS_ROSEN_RENDER_LOADING_PROGRESS_H
