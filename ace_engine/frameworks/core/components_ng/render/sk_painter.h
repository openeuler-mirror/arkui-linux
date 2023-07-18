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

#ifndef FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_RENDER_SK_PAINTER_PAINTER_H
#define FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_RENDER_SK_PAINTER_PAINTER_H

#include <string>

#include "include/core/SkPaint.h"

#include "base/geometry/ng/rect_t.h"
#include "core/components_ng/pattern/shape/shape_paint_property.h"
#include "core/components_ng/render/drawing.h"

namespace OHOS::Ace::NG {

class SkPainter {
public:
    SkPainter() = default;
    ~SkPainter() = default;
    static void DrawPath(RSCanvas& canvas, const std::string& commands, const ShapePaintProperty& shapePaintProperty);
    static bool SetPen(SkPaint& skPaint, const ShapePaintProperty& shapePaintProperty);
    static void SetBrush(SkPaint& skPaint, const ShapePaintProperty& shapePaintProperty);
};

} // namespace OHOS::Ace::NG

#endif // FOUNDATION_ACE_FRAMEWORKS_CORE_COMPONENTS_NG_RENDER_SK_PAINTER_PAINTER_H