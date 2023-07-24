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

std::shared_ptr<GlfwRenderContext> GlfwRenderContext::GetGlobal()
{
    if (global_ == nullptr) {
        static std::mutex mutex;
        std::lock_guard lock(mutex);
        if (global_ == nullptr) {
            global_ = std::make_shared<GlfwRenderContext>();
        }
    }

    return global_;
}

int GlfwRenderContext::Init()
{
    external_ = false;
    return true;
}

void GlfwRenderContext::InitFrom(void *glfwWindow)
{
    if (glfwWindow == nullptr) {
        LOGE("InitFrom glfwWindow is nullptr");
        return;
    }
    LOGI("InitFrom glfwWindow");

    external_ = true;
}

void GlfwRenderContext::Terminate()
{
    if (external_) {
        return;
    }

}

int GlfwRenderContext::CreateWindow(int32_t width, int32_t height, bool visible)
{
    if (external_) {
        return 0;
    }

    if (window_ != nullptr) {
        return 0;
    }

    return 0;
}

void GlfwRenderContext::DestroyWindow()
{
    if (external_) {
        return;
    }
}

int GlfwRenderContext::WindowShouldClose()
{
  return 0;
}

void GlfwRenderContext::WaitForEvents()
{
}

void GlfwRenderContext::PollEvents()
{
}

void GlfwRenderContext::GetWindowSize(int32_t &width, int32_t &height)
{
}

void GlfwRenderContext::SetWindowSize(int32_t width, int32_t height)
{
}

void GlfwRenderContext::SetWindowTitle(const std::string &title)
{
}

std::string GlfwRenderContext::GetClipboardData()
{
    return "";
}

void GlfwRenderContext::SetClipboardData(const std::string &data)
{
}

void GlfwRenderContext::MakeCurrent()
{
}

void GlfwRenderContext::SwapBuffers()
{
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

void GlfwRenderContext::OnMouseButton(GLFWwindow *window, int button, int action, int mods)
{
}

void GlfwRenderContext::OnCursorPos(GLFWwindow *window, double x, double y)
{
}

void GlfwRenderContext::OnKey(GLFWwindow *window, int key, int scancode, int action, int mods)
{
}

void GlfwRenderContext::OnChar(GLFWwindow *window, unsigned int codepoint)
{
}
}
