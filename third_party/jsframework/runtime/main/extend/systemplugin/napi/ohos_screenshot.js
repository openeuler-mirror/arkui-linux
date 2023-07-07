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

import { paramMock } from "../utils"

export function mockScreenshot() {
  const RectMock = {
    left: '[PC preview] unknow Rect.left',
    top: '[PC preview] unknow  Rect.top',
    width: '[PC preview] unknow Rect.width',
    height: '[PC preview] unknow Rect.height'
  }
  const SizeMock = {
    width: '[PC preview] unknow Size.width',
    height: '[PC preview] unknow Size.height',
  }
  const ScreenshotOptionsMock = {
    screenRect: RectMock,
    imageSize: SizeMock,
    rotation: '[PC preview] unknow Size.width',
    displayId: '[PC preview] unknow Size.width',
  }

  const screenshotMock = {
    ImageSource: '[PC preview] unknow ImageSource'
  }

  const screenshot = {
    save: function (...args) {
      console.warn("screenshot.save interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, screenshotMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(screenshotMock)
        })
      }
    }
  }
  return screenshot
}
