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

#ifndef FOUNDATION_ACE_ACE_ENGINE_ADAPTER_PREVIEW_ENTRANCE_CLIPBOARD_CLIPBOARD_IMPL_H
#define FOUNDATION_ACE_ACE_ENGINE_ADAPTER_PREVIEW_ENTRANCE_CLIPBOARD_CLIPBOARD_IMPL_H

#include <string>
#include <functional>

#include "base/utils/macros.h"
#include "base/memory/referenced.h"
#include "base/thread/task_executor.h"
#include "core/common/clipboard/clipboard.h"
#include "core/common/clipboard/clipboard_interface.h"

namespace OHOS::Ace::Platform {

using CallbackSetClipboardData = std::function<void(const std::string&)>;
using CallbackGetClipboardData = std::function<const std::string(void)>;
using CallbackSetClipboardPixmapData = std::function<void(const RefPtr<PixelMap>&)>;
using CallbackGetClipboardPixmapData = std::function<const RefPtr<PixelMap>(void)>;

class ACE_FORCE_EXPORT_WITH_PREVIEW ClipboardImpl : public Clipboard {
public:
    explicit ClipboardImpl(const RefPtr<TaskExecutor>& taskExecutor) : Clipboard(taskExecutor) {}
    ~ClipboardImpl() override = default;

    void SetData(
        const std::string& data, CopyOptions copyOption = CopyOptions::InApp, bool isDragData = false) override;
    void GetData(const std::function<void(const std::string&)>& callback, bool syncMode = false) override;
    void SetPixelMapData(const RefPtr<PixelMap>& pixmap, CopyOptions copyOption = CopyOptions::InApp) override;
    void GetPixelMapData(const std::function<void(const RefPtr<PixelMap>&)>& callback, bool syncMode = false) override;
    void Clear() override;
    void HasData(const std::function<void(bool hasData)>& callback) override;
    void RegisterCallbackSetClipboardData(CallbackSetClipboardData callback);
    void RegisterCallbackGetClipboardData(CallbackGetClipboardData callback);
    void RegisterCallbackSetClipboardPixmapData(CallbackSetClipboardPixmapData callback);
    void RegisterCallbackGetClipboardPixmapData(CallbackGetClipboardPixmapData callback);

private:
    CallbackSetClipboardData callbackSetClipboardData_;
    CallbackGetClipboardData callbackGetClipboardData_;
    CallbackSetClipboardPixmapData callbackSetClipboardPixmapData_;
    CallbackGetClipboardPixmapData callbackGetClipboardPixmapData_;
};
} // namespace OHOS::Ace::Platform

#endif // FOUNDATION_ACE_ACE_ENGINE_ADAPTER_PREVIEW_ENTRANCE_CLIPBOARD_CLIPBOARD_IMPL_H
