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

#include "core/components_ng/pattern/navigation/nav_bar_layout_algorithm.h"

#include "base/geometry/ng/offset_t.h"
#include "base/geometry/ng/size_t.h"
#include "base/log/ace_trace.h"
#include "base/memory/ace_type.h"
#include "base/utils/utils.h"
#include "core/components_ng/base/frame_node.h"
#include "core/components_ng/pattern/linear_layout/linear_layout_property.h"
#include "core/components_ng/pattern/navigation/nav_bar_layout_property.h"
#include "core/components_ng/pattern/navigation/nav_bar_node.h"
#include "core/components_ng/pattern/navigation/nav_bar_pattern.h"
#include "core/components_ng/pattern/navigation/title_bar_pattern.h"
#include "core/components_ng/property/layout_constraint.h"
#include "core/components_ng/property/measure_property.h"
#include "core/components_ng/property/measure_utils.h"
#include "core/pipeline_ng/pipeline_context.h"

namespace OHOS::Ace::NG {
namespace {
float MeasureTitleBar(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty, const SizeF& navigationSize)
{
    auto titleBarNode = hostNode->GetTitleBarNode();
    CHECK_NULL_RETURN(titleBarNode, 0.0f);
    auto index = hostNode->GetChildIndexById(titleBarNode->GetId());
    auto titleBarWrapper = layoutWrapper->GetOrCreateChildByIndex(index);
    CHECK_NULL_RETURN(titleBarWrapper, 0.0f);
    auto constraint = navBarLayoutProperty->CreateChildConstraint();
    if (navBarLayoutProperty->GetHideTitleBar().value_or(false)) {
        constraint.selfIdealSize = OptionalSizeF(0.0f, 0.0f);
        titleBarWrapper->Measure(constraint);
        return 0.0f;
    }
    auto titleBarFrameNode = AceType::DynamicCast<FrameNode>(titleBarNode);
    CHECK_NULL_RETURN(titleBarFrameNode, 0.0f);
    auto titleBarLayoutProperty = titleBarFrameNode->GetLayoutProperty<TitleBarLayoutProperty>();
    CHECK_NULL_RETURN(titleBarLayoutProperty, 0.0f);
    if (titleBarLayoutProperty->HasTitleHeight()) {
        constraint.selfIdealSize.SetHeight(
            static_cast<float>(titleBarLayoutProperty->GetTitleHeightValue().ConvertToPx()));
        titleBarWrapper->Measure(constraint);
        return titleBarLayoutProperty->GetTitleHeight()->ConvertToPx();
    }

    // MINI 模式
    if (navBarLayoutProperty->GetTitleModeValue(NavigationTitleMode::FREE) == NavigationTitleMode::MINI) {
        // 有subtitle
        if (hostNode->GetSubtitle()) {
            constraint.selfIdealSize =
                OptionalSizeF(navigationSize.Width(), static_cast<float>(DOUBLE_LINE_TITLEBAR_HEIGHT.ConvertToPx()));
            titleBarWrapper->Measure(constraint);
            return static_cast<float>(DOUBLE_LINE_TITLEBAR_HEIGHT.ConvertToPx());
        }

        constraint.selfIdealSize =
            OptionalSizeF(navigationSize.Width(), static_cast<float>(SINGLE_LINE_TITLEBAR_HEIGHT.ConvertToPx()));
        titleBarWrapper->Measure(constraint);
        return static_cast<float>(SINGLE_LINE_TITLEBAR_HEIGHT.ConvertToPx());
    }

    float titleBarHeight = 0.0f;
    if (navBarLayoutProperty->GetTitleModeValue(NavigationTitleMode::FREE) == NavigationTitleMode::FREE) {
        auto titleBar = AceType::DynamicCast<TitleBarNode>(titleBarNode);
        CHECK_NULL_RETURN(titleBar, 0.0f);
        auto titlePattern = titleBar->GetPattern<TitleBarPattern>();
        CHECK_NULL_RETURN(titlePattern, 0.0f);
        titleBarHeight = titlePattern->GetTempTitleBarHeight();
    }

    // FREE 和 FULL 模式，有subtitle
    if (hostNode->GetSubtitle()) {
        if (NearZero(titleBarHeight)) {
            titleBarHeight = static_cast<float>(FULL_DOUBLE_LINE_TITLEBAR_HEIGHT.ConvertToPx());
        }
        constraint.selfIdealSize = OptionalSizeF(navigationSize.Width(), titleBarHeight);
        titleBarWrapper->Measure(constraint);
        return titleBarHeight;
    }

    // no subtitle
    if (NearZero(titleBarHeight)) {
        titleBarHeight = static_cast<float>(FULL_SINGLE_LINE_TITLEBAR_HEIGHT.ConvertToPx());
    }
    constraint.selfIdealSize = OptionalSizeF(navigationSize.Width(), titleBarHeight);
    titleBarWrapper->Measure(constraint);
    return titleBarHeight;
}

float MeasureToolBar(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty, const SizeF& navigationSize)
{
    auto toolBarNode = hostNode->GetToolBarNode();
    CHECK_NULL_RETURN(toolBarNode, 0.0f);
    auto index = hostNode->GetChildIndexById(toolBarNode->GetId());
    auto toolBarWrapper = layoutWrapper->GetOrCreateChildByIndex((index));
    CHECK_NULL_RETURN(toolBarWrapper, 0.0f);
    auto constraint = navBarLayoutProperty->CreateChildConstraint();
    if (navBarLayoutProperty->GetHideToolBar().value_or(false) ||
        toolBarNode->GetChildren().empty()) {
        constraint.selfIdealSize = OptionalSizeF(0.0f, 0.0f);
        toolBarWrapper->Measure(constraint);
        return 0.0f;
    }

    auto theme = NavigationGetTheme();
    CHECK_NULL_RETURN(theme, 0.0f);
    auto toolbarHeight = theme->GetHeight();
    constraint.selfIdealSize = OptionalSizeF(navigationSize.Width(), static_cast<float>(toolbarHeight.ConvertToPx()));
    toolBarWrapper->Measure(constraint);
    return static_cast<float>(toolbarHeight.ConvertToPx());
}

void MeasureContentChild(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty, const SizeF& navigationSize, float titleBarHeight,
    float toolBarHeight)
{
    auto contentNode = hostNode->GetNavBarContentNode();
    CHECK_NULL_VOID(contentNode);
    auto index = hostNode->GetChildIndexById(contentNode->GetId());
    auto contentWrapper = layoutWrapper->GetOrCreateChildByIndex(index);
    CHECK_NULL_VOID(contentWrapper);
    auto constraint = navBarLayoutProperty->CreateChildConstraint();
    constraint.selfIdealSize =
        OptionalSizeF(navigationSize.Width(), navigationSize.Height() - titleBarHeight - toolBarHeight);
    contentWrapper->Measure(constraint);
}

float LayoutTitleBar(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty)
{
    if (navBarLayoutProperty->GetHideTitleBar().value_or(false)) {
        return 0.0f;
    }
    auto titleBarNode = hostNode->GetTitleBarNode();
    CHECK_NULL_RETURN(titleBarNode, 0.0f);
    auto index = hostNode->GetChildIndexById(titleBarNode->GetId());
    auto titleBarWrapper = layoutWrapper->GetOrCreateChildByIndex(index);
    CHECK_NULL_RETURN(titleBarWrapper, 0.0f);
    auto geometryNode = titleBarWrapper->GetGeometryNode();
    auto titleBarOffset = OffsetF(0.0f, 0.0f);
    geometryNode->SetMarginFrameOffset(titleBarOffset);
    titleBarWrapper->Layout();
    return geometryNode->GetFrameSize().Height();
}

void LayoutContent(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty, float titlebarHeight)
{
    auto contentNode = hostNode->GetNavBarContentNode();
    CHECK_NULL_VOID(contentNode);
    auto index = hostNode->GetChildIndexById(hostNode->GetNavBarContentNode()->GetId());
    auto contentWrapper = layoutWrapper->GetOrCreateChildByIndex(index);
    CHECK_NULL_VOID(contentWrapper);
    auto geometryNode = contentWrapper->GetGeometryNode();
    if (!navBarLayoutProperty->GetHideTitleBar().value_or(false)) {
        auto contentOffset = OffsetF(geometryNode->GetFrameOffset().GetX(), titlebarHeight);
        geometryNode->SetMarginFrameOffset(contentOffset);
        contentWrapper->Layout();
        return;
    }
    auto contentOffset = OffsetF(0.0f, 0.0f);
    geometryNode->SetMarginFrameOffset(contentOffset);
    contentWrapper->Layout();
}

void LayoutToolBar(LayoutWrapper* layoutWrapper, const RefPtr<NavBarNode>& hostNode,
    const RefPtr<NavBarLayoutProperty>& navBarLayoutProperty)
{
    if (navBarLayoutProperty->GetHideToolBar().value_or(false)) {
        return;
    }
    auto toolBarNode = hostNode->GetToolBarNode();
    CHECK_NULL_VOID(toolBarNode);
    auto index = hostNode->GetChildIndexById(toolBarNode->GetId());
    auto toolBarWrapper = layoutWrapper->GetOrCreateChildByIndex(index);
    CHECK_NULL_VOID(toolBarWrapper);
    auto geometryNode = toolBarWrapper->GetGeometryNode();

    auto theme = NavigationGetTheme();
    CHECK_NULL_VOID(theme);
    auto toolBarOffsetY = layoutWrapper->GetGeometryNode()->GetFrameSize().Height() - theme->GetHeight().ConvertToPx();
    auto toolBarOffset = OffsetF(geometryNode->GetFrameOffset().GetX(), static_cast<float>(toolBarOffsetY));
    geometryNode->SetMarginFrameOffset(toolBarOffset);
    toolBarWrapper->Layout();
}

} // namespace

void NavBarLayoutAlgorithm::Measure(LayoutWrapper* layoutWrapper)
{
    auto hostNode = AceType::DynamicCast<NavBarNode>(layoutWrapper->GetHostNode());
    CHECK_NULL_VOID(hostNode);
    auto navBarLayoutProperty = AceType::DynamicCast<NavBarLayoutProperty>(layoutWrapper->GetLayoutProperty());
    CHECK_NULL_VOID(navBarLayoutProperty);
    const auto& constraint = navBarLayoutProperty->GetLayoutConstraint();
    CHECK_NULL_VOID(constraint);
    auto geometryNode = layoutWrapper->GetGeometryNode();
    auto size = CreateIdealSize(constraint.value(), Axis::HORIZONTAL, MeasureType::MATCH_PARENT, true);
    const auto& padding = layoutWrapper->GetLayoutProperty()->CreatePaddingAndBorder();
    MinusPaddingToSize(padding, size);
    float titleBarHeight = MeasureTitleBar(layoutWrapper, hostNode, navBarLayoutProperty, size);
    float toolBarHeight = MeasureToolBar(layoutWrapper, hostNode, navBarLayoutProperty, size);
    MeasureContentChild(layoutWrapper, hostNode, navBarLayoutProperty, size, titleBarHeight, toolBarHeight);
    layoutWrapper->GetGeometryNode()->SetFrameSize(size);
}

void NavBarLayoutAlgorithm::Layout(LayoutWrapper* layoutWrapper)
{
    auto hostNode = AceType::DynamicCast<NavBarNode>(layoutWrapper->GetHostNode());
    CHECK_NULL_VOID(hostNode);
    auto navBarLayoutProperty = AceType::DynamicCast<NavBarLayoutProperty>(layoutWrapper->GetLayoutProperty());
    CHECK_NULL_VOID(navBarLayoutProperty);
    float titlebarHeight = LayoutTitleBar(layoutWrapper, hostNode, navBarLayoutProperty);
    LayoutContent(layoutWrapper, hostNode, navBarLayoutProperty, titlebarHeight);
    LayoutToolBar(layoutWrapper, hostNode, navBarLayoutProperty);
}

} // namespace OHOS::Ace::NG