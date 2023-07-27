/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd.
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

#include "glfw_render_context.h"

#include <mutex>

namespace FT::Rosen {
const std::string MAIN_WINDOW_NAME = "main window";

InputEventConsumer::InputEventConsumer(std::weak_ptr<GlfwRenderContext> context)
{
    context_ = context;
}

bool InputEventConsumer::OnInputEvent(const std::shared_ptr<OHOS::MMI::KeyEvent>& keyEvent) const
{
    if (keyEvent == nullptr) {
        return false;
    }
    keyEvent->MarkProcessed();

    auto context = context_.lock();
    if (context != nullptr) {
        context->OnKey(keyEvent->GetKeyCode(), 0, keyEvent->GetKeyAction(), 0);
    }

    return true;
}

bool InputEventConsumer::OnInputEvent(const std::shared_ptr<OHOS::MMI::PointerEvent>& pointerEvent) const
{
    if (pointerEvent == nullptr) {
        return false;
    }
    pointerEvent->MarkProcessed();

    auto context = context_.lock();
    if (context == nullptr) {
        return false;
    }

    int32_t action = pointerEvent->GetPointerAction();
    if (action == OHOS::MMI::PointerEvent::POINTER_ACTION_MOVE) {
        OHOS::MMI::PointerEvent::PointerItem pointerItem;
        if (!pointerEvent->GetPointerItem(pointerEvent->GetPointerId(), pointerItem)) {
            LOGI("Failed to GetPointerItem");
            return false;
        }
        context->OnCursorPos(pointerItem.GetDisplayX(), pointerItem.GetDisplayY());
    } else if (action == OHOS::MMI::PointerEvent::POINTER_ACTION_BUTTON_DOWN) {
        context->OnMouseButton(pointerEvent->GetButtonId(), 1, 0);
    } else if (action == OHOS::MMI::PointerEvent::POINTER_ACTION_BUTTON_UP) {
        context->OnMouseButton(pointerEvent->GetButtonId(), 0, 0);
    }

    return true;
}

bool InputEventConsumer::OnInputEvent(const std::shared_ptr<OHOS::MMI::AxisEvent>& axisEvent) const
{
    if (axisEvent == nullptr) {
        return false;
    }
    axisEvent->MarkProcessed();

    return true;
}

int GlfwRenderContext::Init()
{
    return true;
}

void GlfwRenderContext::Terminate()
{
    DestroyWindow();
}

int GlfwRenderContext::CreateWindow(int32_t width, int32_t height, bool visible)
{
    if (window_ != nullptr) {
        return 0;
    }

    if (width <= 0 || height <= 0) {
        LOGE("Invalid param, width:%{public}d height:%{public}d", width, height);
        return -1;
    }

    OHOS::sptr<OHOS::Rosen::WindowOption> option(new OHOS::Rosen::WindowOption());
    option->SetWindowType(OHOS::Rosen::WindowType::WINDOW_TYPE_APP_MAIN_WINDOW);
    option->SetWindowMode(OHOS::Rosen::WindowMode::WINDOW_MODE_FLOATING);
    option->SetWindowRect({0, 0, static_cast<uint32_t>(width), static_cast<uint32_t>(height)});
    option->SetMainHandlerAvailable(false);

    static int cnt = 0;
    std::string name = MAIN_WINDOW_NAME + std::to_string(cnt++);

    window_ = OHOS::Rosen::Window::Create(name, option);
    if (window_ == nullptr) {
        LOGE("Failed to create window");
        return -1;
    }

    auto listener = std::make_shared<InputEventConsumer>(shared_from_this());
    window_->SetInputEventConsumer(listener);

    if (visible) {
        window_->Show();
    }

    return 0;
}

void GlfwRenderContext::DestroyWindow()
{
    if (window_ != nullptr) {
        window_->Destroy();
        window_ = nullptr;
    }
}

int GlfwRenderContext::WindowShouldClose()
{
    if (window_ != nullptr) {
        return window_->GetWindowState() == OHOS::Rosen::WindowState::STATE_DESTROYED ? 1 : 0;
    }

    return 0;
}

void GlfwRenderContext::PollEvents()
{
}

void GlfwRenderContext::GetWindowSize(int32_t &width, int32_t &height)
{
    if (window_ != nullptr) {
        OHOS::Rosen::Rect rect = window_->GetRequestRect();
        width = rect.width_;
        height = rect.height_;
    }
}

void GlfwRenderContext::SetWindowSize(int32_t width, int32_t height)
{
    if (width <= 0 || height <= 0) {
        LOGE("Invalid param, width:%{public}d height:%{public}d", width, height);
        return;
    }

    if (window_ != nullptr) {
        window_->Resize(static_cast<uint32_t>(width), static_cast<uint32_t>(height));
    }
}

void GlfwRenderContext::SetWindowTitle(const std::string &title)
{
    if (window_ != nullptr) {
        window_->SetAPPWindowLabel(title);
    }
}

OHOS::sptr<OHOS::Rosen::Window> GlfwRenderContext::GetWindow()
{
    return window_;
}

void GlfwRenderContext::OnMouseButton(const OnMouseButtonFunc &onMouseBotton)
{
    onMouseBotton_ = onMouseBotton;
}

void GlfwRenderContext::OnCursorPos(const OnCursorPosFunc &onCursorPos)
{
    onCursorPos_ = onCursorPos;
}

void GlfwRenderContext::OnKey(const OnKeyFunc &onKey)
{
    onKey_ = onKey;
}

void GlfwRenderContext::OnChar(const OnCharFunc &onChar)
{
    onChar_ = onChar;
}

void GlfwRenderContext::OnMouseButton(int button, int action, int mods)
{
    if (onMouseBotton_ != nullptr) {
        onMouseBotton_(button, action, mods);
    }
}

void GlfwRenderContext::OnCursorPos(double x, double y)
{
    if (onCursorPos_ != nullptr) {
        onCursorPos_(x, y);
    }
}

void GlfwRenderContext::OnKey(int key, int scancode, int action, int mods)
{
    if (onKey_ != nullptr) {
        onKey_(key, scancode, action, mods);
    }
}

void GlfwRenderContext::OnChar(unsigned int codepoint)
{
}
}
