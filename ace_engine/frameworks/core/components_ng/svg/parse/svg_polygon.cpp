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

#include "frameworks/core/components_ng/svg/parse/svg_polygon.h"

#include "base/utils/utils.h"
#include "frameworks/core/components/common/painter/flutter_svg_painter.h"
#include "frameworks/core/components/declaration/svg/svg_polygon_declaration.h"

namespace OHOS::Ace::NG {

SvgPolygon::SvgPolygon(bool isClose) : SvgGraphic(), isClose_(isClose)
{
    declaration_ = AceType::MakeRefPtr<SvgPolygonDeclaration>();
    declaration_->Init();
    declaration_->InitializeStyle();
}

RefPtr<SvgNode> SvgPolygon::CreatePolygon()
{
    return AceType::MakeRefPtr<SvgPolygon>(true);
}

RefPtr<SvgNode> SvgPolygon::CreatePolyline()
{
    return AceType::MakeRefPtr<SvgPolygon>(false);
}

SkPath SvgPolygon::AsPath(const Size& viewPort) const
{
    SkPath path;
    auto declaration = AceType::DynamicCast<SvgPolygonDeclaration>(declaration_);
    CHECK_NULL_RETURN_NOLOG(declaration, path);
    if (declaration->GetPoints().empty()) {
        return path;
    }
    std::vector<SkPoint> skPoints;
    FlutterSvgPainter::StringToPoints(declaration->GetPoints().c_str(), skPoints);
    if (skPoints.empty()) {
        return SkPath();
    }
    path.addPoly(&skPoints[0], skPoints.size(), isClose_);
    if (declaration->GetClipState().IsEvenodd()) {
        path.setFillType(SkPath::FillType::kEvenOdd_FillType);
    }
    return path;
}

} // namespace OHOS::Ace::NG
