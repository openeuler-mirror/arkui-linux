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

import { paramMock } from "../utils"

export function mockWindowAnimationManager() {
  const RRect = {
    left: '[PC preview] unknow left',
    top: '[PC preview] unknow top',
    width: '[PC preview] unknow width',
    height: '[PC preview] unknow height',
    radius: '[PC preview] unknow radius',
  }
  const WindowAnimationTarget = {
    bundleName: '[PC preview] unknow bundleName',
    abilityName: '[PC preview] unknow abilityName',
    windowBounds: RRect,
  }
  const WindowAnimationFinishedCallback = {
    onAnimationFinish: function (...args) {
      console.warn("WindowAnimationFinishedCallback.onAnimationFinish interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
  }
  const WindowAnimationController = {
    onStartAppFromLauncher: function (...args) {
      console.warn("WindowAnimationController.onStartAppFromLauncher interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onStartAppFromRecent: function (...args) {
      console.warn("WindowAnimationController.onStartAppFromRecent interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onStartAppFromOther: function (...args) {
      console.warn("WindowAnimationController.onStartAppFromOther interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onAppTransition: function (...args) {
      console.warn("WindowAnimationController.onAppTransition interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onMinimizeWindow: function (...args) {
      console.warn("WindowAnimationController.onMinimizeWindow interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onCloseWindow: function (...args) {
      console.warn("WindowAnimationController.onCloseWindow interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    onScreenUnlock: function (...args) {
      console.warn("WindowAnimationController.onScreenUnlock interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
  }

  const windowAnimationManager = {
    WindowAnimationController,
    WindowAnimationFinishedCallback,
    WindowAnimationTarget,
    RRect,
    setController: function (...args) {
      console.warn("windowAnimationManager.setController interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    }
  }
  return windowAnimationManager
}