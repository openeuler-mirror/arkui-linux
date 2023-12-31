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

#include "core/components_ng/base/view_stack_processor.h"
#include "core/components_ng/pattern/shape/polygon_model_ng.h"
#include "core/components_ng/pattern/shape/polygon_pattern.h"
#include "core/components_ng/test/pattern/shape/base_polygon_pattern_test_ng.h"

using namespace testing;
using namespace testing::ext;

namespace OHOS::Ace::NG {

class PolygonPatternTestNg : public BasePolygonPatternTestNg {
public:
    RefPtr<FrameNode> CreadFrameNode() override
    {
        PolygonModelNG().Create(true);
        return AceType::DynamicCast<FrameNode>(ViewStackProcessor::GetInstance()->GetMainElementNode());
    }

    void Draw(RefPtr<FrameNode> frameNode) override
    {
        EXPECT_EQ(frameNode == nullptr, false);
        auto pattern = frameNode->GetPattern<PolygonPattern>();
        EXPECT_EQ(pattern == nullptr, false);
        auto layoutProperty = frameNode->GetLayoutProperty();
        EXPECT_EQ(layoutProperty == nullptr, false);
        auto layoutAlgorithm = AceType::DynamicCast<ShapeLayoutAlgorithm>(pattern->CreateLayoutAlgorithm());
        EXPECT_EQ(layoutAlgorithm == nullptr, false);
        LayoutConstraintF layoutConstraint;
        layoutConstraint.percentReference.SetWidth(WIDTH);
        layoutConstraint.percentReference.SetHeight(HEIGHT);
        layoutProperty->UpdateLayoutConstraint(layoutConstraint);
        layoutProperty->UpdateContentConstraint();
        auto size = layoutAlgorithm->MeasureContent(layoutProperty->CreateContentConstraint(), nullptr);
        EXPECT_EQ(size.has_value(), true);
        auto paintMethod = pattern->CreateNodePaintMethod();
        EXPECT_EQ(paintMethod == nullptr, false);
        frameNode->GetGeometryNode()->SetContentSize(size.value());
        auto paintWrapper = AceType::MakeRefPtr<PaintWrapper>(frameNode->GetRenderContext(),
            frameNode->GetGeometryNode()->Clone(), frameNode->GetPaintProperty<ShapePaintProperty>());
        EXPECT_EQ(paintWrapper == nullptr, false);
        auto contentDraw = paintMethod->GetContentDrawFunction(AceType::RawPtr(paintWrapper));
        EXPECT_EQ(contentDraw == nullptr, false);
        std::shared_ptr<SkCanvas> canvas = std::make_shared<SkCanvas>();
        RSCanvas rsCavas(&canvas);
        contentDraw(rsCavas);
    }

    void CheckPolygonPoints(bool hasValue)
    {
        PolygonModelNG().Create(true);
        auto shapeAbstactModel = ShapeAbstractModelNG();
        SetSize(shapeAbstactModel);
        auto frameNode = AceType::DynamicCast<FrameNode>(ViewStackProcessor::GetInstance()->GetMainElementNode());
        ViewStackProcessor::GetInstance()->Pop();
        CheckPoints(frameNode, hasValue);
        Draw(frameNode);
    }
};

/**
 * @tc.name: PolygonPoints001
 * @tc.desc: create path with points
 * @tc.type: FUNC
 */

HWTEST_F(PolygonPatternTestNg, PolygonPoints001, TestSize.Level1)
{
    CheckPolygonPoints(true);
}

/**
 * @tc.name: PolygonPoints002
 * @tc.desc: create path with no points
 * @tc.type: FUNC
 */

HWTEST_F(PolygonPatternTestNg, PolygonPoints002, TestSize.Level1)
{
    CheckPolygonPoints(false);
}

} // namespace OHOS::Ace::NG