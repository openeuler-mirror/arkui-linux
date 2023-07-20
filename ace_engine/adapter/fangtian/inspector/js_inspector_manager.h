/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
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

#ifndef FOUNDATION_ACE_ADAPTER_PREVIEW_INSPECTOR_JS_INSPECTOR_MANAGER_H
#define FOUNDATION_ACE_ADAPTER_PREVIEW_INSPECTOR_JS_INSPECTOR_MANAGER_H

#include <cstdint>
#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "core/components_ng/base/group_node.h"
#include "core/components_ng/base/ui_node.h"
#include "core/components_v2/inspector/inspector_composed_element.h"
#include "core/pipeline/pipeline_context.h"
#include "frameworks/bridge/common/accessibility/accessibility_node_manager.h"

namespace OHOS::Ace::Framework {

class JsInspectorManager : public AccessibilityNodeManager {
    DECLARE_ACE_TYPE(JsInspectorManager, AccessibilityNodeManager);

public:
    JsInspectorManager() = default;
    ~JsInspectorManager() override = default;

    void InitializeCallback() override;

private:
    void AssembleJSONTree(std::string& jsonStr);
    std::unique_ptr<JsonValue> GetChildrenJson(RefPtr<AccessibilityNode> node);
    std::unique_ptr<JsonValue> GetChildJson(RefPtr<AccessibilityNode> node);
    void AssembleDefaultJSONTree(std::string& jsonStr);

    bool OperateComponent(const std::string& attrsJson);
    bool OperateRootComponent(RefPtr<Component> newComponent);
    bool OperateGeneralComponent(
        int32_t parentID, int32_t slot, std::string& operateType, RefPtr<Component> newComponent);
    bool OperateGeneralUINode(RefPtr<NG::UINode> parent, int32_t slot, RefPtr<NG::UINode> newChild);
    RefPtr<Component> GetNewComponentWithJsCode(const std::unique_ptr<JsonValue>& root);
    RefPtr<NG::UINode> GetNewFrameNodeWithJsCode(const std::unique_ptr<JsonValue>& root);
    RefPtr<V2::InspectorComposedElement> GetInspectorElementById(NodeId nodeId);
    const WeakPtr<Element>& GetRootElement();
    const RefPtr<NG::UINode> GetRootUINode();
    void GetAttrsAndStyles(std::unique_ptr<JsonValue>& jsonNode, const RefPtr<AccessibilityNode>& node);
    void GetAttrsAndStylesV2(std::unique_ptr<JsonValue>& jsonNode, const RefPtr<AccessibilityNode>& node);
    std::string UpdateNodeRectStrInfo(const RefPtr<AccessibilityNode> node);
    std::string UpdateNodeRectStrInfoV2(const RefPtr<AccessibilityNode> node);
    std::string ConvertStrToPropertyType(std::string& typeValue);
    std::string ConvertPseudoClassStyle(const std::string pseudoClassValue);
    Rect deviceRect_;
};

} // namespace OHOS::Ace::Framework

#endif // FOUNDATION_ACE_ADAPTER_PREVIEW_INSPECTOR_JS_INSPECTOR_MANAGER_H
