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

#ifndef GLFW_RENDER_CONTEXT_EXPORT_GLFW_RENDER_CONTEXT
#define GLFW_RENDER_CONTEXT_EXPORT_GLFW_RENDER_CONTEXT

#include <functional>
#include <memory>
#include "base/log/log.h"
#include <string>

struct GLFWwindow;
namespace FT::Rosen {
class GlfwRenderContext {
public:
    using OnMouseButtonFunc = std::function<void(int button, bool pressed, int mods)>;
    using OnCursorPosFunc = std::function<void(double x, double y)>;
    using OnKeyFunc = std::function<void(int key, int scancode, int action, int mods)>;
    using OnCharFunc = std::function<void(unsigned int codepoint)>;

    // GlfwRenderContext isn't a singleton.
    static std::shared_ptr<GlfwRenderContext> GetGlobal();

    /* before CreateWindow */
    int Init();
    void InitFrom(void *glfwWindow);
    void Terminate();

    /* before window operation */
    int CreateWindow(int32_t width, int32_t height, bool visible);
    void DestroyWindow();

    /* window operation */
    int WindowShouldClose();
    void WaitForEvents();
    void PollEvents();
    void GetWindowSize(int32_t &width, int32_t &height);
    void SetWindowSize(int32_t width, int32_t height);
    void SetWindowTitle(const std::string &title);
    std::string GetClipboardData();
    void SetClipboardData(const std::string &data);

    /* gl operation */
    void MakeCurrent();
    void SwapBuffers();

    /* input event */
    void OnMouseButton(const OnMouseButtonFunc &onMouseBotton);
    void OnCursorPos(const OnCursorPosFunc &onCursorPos);
    void OnKey(const OnKeyFunc &onKey);
    void OnChar(const OnCharFunc &onChar);

private:
    static void OnMouseButton(GLFWwindow *window, int button, int action, int mods);
    static void OnCursorPos(GLFWwindow *window, double x, double y);
    static void OnKey(GLFWwindow *window, int key, int scancode, int action, int mods);
    static void OnChar(GLFWwindow *window, unsigned int codepoint);

    static inline std::shared_ptr<GlfwRenderContext> global_ = nullptr;
    bool external_ = false;
    GLFWwindow *window_ = nullptr;
    OnMouseButtonFunc onMouseBotton_ = nullptr;
    OnCursorPosFunc onCursorPos_ = nullptr;
    OnKeyFunc onKey_ = nullptr;
    OnCharFunc onChar_ = nullptr;
};
}
#endif // GLFW_RENDER_CONTEXT_EXPORT_GLFW_RENDER_CONTEXT
