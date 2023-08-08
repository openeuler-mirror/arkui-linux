/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
import { PixelMapMock } from "./ohos_multimedia_image"

export const WindowType = {
  TYPE_APP: 0,
  TYPE_SYSTEM_ALERT: 1,
  TYPE_INPUT_METHOD: 2,
  TYPE_STATUS_BAR: 3,
  TYPE_PANEL: 4,
  TYPE_KEYGUARD: 5,
  TYPE_VOLUME_OVERLAY: 6,
  TYPE_NAVIGATION_BAR: 7,
  TYPE_FLOAT: 8,
  TYPE_WALLPAPER: 9,
  TYPE_DESKTOP: 10,
  TYPE_LAUNCHER_RECENT: 11,
  TYPE_LAUNCHER_DOCK: 12,
  TYPE_VOICE_INTERACTION: 13,
  TYPE_POINTER: 14,
  TYPE_FLOAT_CAMERA: 15,
  TYPE_DIALOG: 16,
  TYPE_SCREENSHOT: 17
}

export const AvoidAreaType= {
  TYPE_SYSTEM: 0,
  TYPE_CUTOUT: 1,
  TYPE_SYSTEM_GESTURE: 2,
  TYPE_KEYBOARD: 3
}

export const Orientation = {
  UNSPECIFIED: 0,
  PORTRAIT: 1,
  LANDSCAPE: 2,
  PORTRAIT_INVERTED: 3,
  LANDSCAPE_INVERTED: 4,
  AUTO_ROTATION: 5,
  AUTO_ROTATION_PORTRAIT: 6,
  AUTO_ROTATION_LANDSCAPE: 7,
  AUTO_ROTATION_RESTRICTED: 8,
  AUTO_ROTATION_PORTRAIT_RESTRICTED: 9,
  AUTO_ROTATION_LANDSCAPE_RESTRICTED: 10,
  LOCKED: 11
}


export const WindowMode= {
  UNDEFINED: 1,
  FULLSCREEN: 2,
  PRIMARY: 3,
  SECONDARY: 4,
  FLOATING: 5
}

export const WindowLayoutMode= {
  WINDOW_LAYOUT_MODE_CASCADE: 0,
  WINDOW_LAYOUT_MODE_TILE: 1
}

export const SystemBarProperties= {
  statusBarColor: '[PC preview] unknow statusBarColor',
  isStatusBarLightIcon: '[PC preview] unknow isStatusBarLightIcon',
  statusBarContentColor: '[PC preview] unknow statusBarContentColor',
  navigationBarColor: '[PC preview] unknow navigationBarColor',
  isNavigationBarLightIcon: '[PC preview] unknow isNavigationBarLightIcon',
  navigationBarContentColor: '[PC preview] unknow navigationBarContentColor'
}

export const Rect = {
  left: '[PC preview] unknow Rect.left',
  top: '[PC preview] unknow  Rect.top',
  width: '[PC preview] unknow Rect.width',
  height: '[PC preview] unknow Rect.height'
}

export const SystemBarRegionTint = {
  type: WindowType,
  isEnable: '[PC preview] unknow isEnable',
  region: Rect,
  backgroundColor: '[PC preview] unknow backgroundColor',
  contentColor: '[PC preview] unknow contentColor'
}

export const SystemBarTintState = {
  displayId: '[PC preview] unknow brightness',
  regionTint:[SystemBarRegionTint]
}

export const AvoidArea = {
  visible: '[PC preview] unknow AvoidArea.visible',
  leftRect: Rect,
  topRect: Rect,
  rightRect: Rect,
  bottomRect: Rect
}

export const Size = {
  width: '[PC preview] unknow width',
  height: '[PC preview] unknow height'
}

export const WindowProperties = {
  windowRect: '[PC preview] unknow windowRect',
  type: '[PC preview] unknow type',
  brightness: '[PC preview] unknow brightness',
  isTransparent: '[PC preview] unknow isTransparent',
  isFullScreen: '[PC preview] unknow isFullScreen',
  isKeepScreenOn: '[PC preview] unknow isKeepScreenOn',
  dimBehindValue: '[PC preview] unknow dimBehindValue',
  isLayoutFullScreen: '[PC preview] unknow isLayoutFullScreen',
  focusable: '[PC preview] unknow focusable',
  touchable: '[PC preview] unknow touchable',
  isPrivacyMode: '[PC preview] unknow isPrivacyMode',
  isRoundCorner: '[PC preview] unknow isRoundCorner'
}

export const ColorSpace = {
  DEFAULT: 0,
  WIDE_GAMUT: 1
}

const TransitionController = {
  animationForShown : function(...args) {
    console.warn("TransitionController.animationForShown interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  animationForHidden : function(...args) {
    console.warn("TransitionController.animationForHidden interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  }
}

const TransitionContext = {
  toWindow: Window,
  completeTransition : function(...args) {
    console.warn("TransitionContext.completeTransition interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  }
}

export const WindowStageEventType = {
  FOREGROUND: 1,
  ACTIVE: 2,
  INACTIVE: 3,
  BACKGROUND: 4
}

export const WindowStage = {
  getMainWindow: function(...args) {
    console.warn("WindowStage.getMainWindow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, Window)
    } else {
      return new Promise((resolve) => {
        resolve(Window)
      })
    }
  },
  createSubWindow: function(...args) {
    console.warn("WindowStage.createSubWindow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, Window)
    } else {
      return new Promise((resolve) => {
        resolve(Window)
      })
    }
  },
  getSubWindow: function(...args) {
    console.warn("WindowStage.getSubWindow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, [Window])
    } else {
      return new Promise((resolve) => {
        resolve([Window])
      })
    }
  },
  loadContent: function(...args) {
    console.warn("WindowStage.loadContent interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  on: function(...args) {
    console.warn("WindowStage.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      if (args[0] === 'windowStageEvent') {
        console.warn(`WindowStage.on you has registered ${args[0]} event`)
      } else {
        console.warn("WindowStage.on：please check first param!")
      }
    } else {
      console.warn("WindowStage.on：please check param!")
    }
  },
  off: function(...args) {
    console.warn("WindowStage.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      if (args[0] === 'windowStageEvent') {
        console.warn(`you has registered ${args[0]} event`)
      }else {
        console.warn("WindowStage.off：please check first param!")
      }
    }else {
      console.warn("WindowStage.off：please check param!")
    }
  },
  disableWindowDecor: function() {
    console.warn("WindowStage.disableWindowDecor interface mocked in the Previewer. How this interface works on the Previewer" +
      "may be different from that on a real device.")
  },
  setShowOnLockScreen: function() {
    console.warn("WindowStage.setShowOnLockScreen interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  }
}

export const Window = {
  setBrightness: function(...args) {
    console.warn("Window.setBrightness interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setBackgroundColor: function(...args) {
    console.warn("Window.setBackgroundColor interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setTransparent: function(...args) {
    console.warn("Window.setTransparent interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setFullScreen: function(...args) {
    console.warn("Window.setFullScreen interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setKeepScreenOn: function(...args) {
    console.warn("Window.setKeepScreenOn interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setWakeUpScreen: function(...args) {
    console.warn("Window.setWakeUpScreen interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setDimBehind: function(...args) {
    console.warn("Window.setDimBehind interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setLayoutFullScreen: function(...args) {
    console.warn("Window.setLayoutFullScreen interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setFocusable: function(...args) {
    console.warn("Window.setFocusable interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setTouchable: function(...args) {
    console.warn("Window.setTouchable interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setPrivacyMode: function(...args) {
    console.warn("Window.setPrivacyMode interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setSnapshotSkip: function(...args) {
    console.warn("Window.setSnapshotSkip interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setSystemBarEnable: function(...args) {
    console.warn("Window.setSystemBarEnable interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setSystemBarProperties: function(...args) {
    console.warn("Window.setSystemBarProperties interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setPreferredOrientation: function(...args) {
    console.warn("Window.setPreferredOrientation interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock,Orientation)
    } else {
      return new Promise((resolve) => {
        resolve(Orientation)
      })
    }
  },
  setForbidSplitMove: function(...args) {
    console.warn("Window.setForbidSplitMove interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  getProperties: function(...args) {
    console.warn("Window.getProperties interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, WindowProperties)
    } else {
      return new Promise((resolve) => {
        resolve(WindowProperties)
      })
    }
  },
  getAvoidArea: function(...args) {
    console.warn("Window.getAvoidArea interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, AvoidArea)
    } else {
      return new Promise((resolve) => {
        resolve(AvoidArea)
      })
    }
  },
  moveTo: function(...args) {
    console.warn("Window.moveTo interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  resetSize: function(...args) {
    console.warn("Window.resetSize interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setWindowType: function(...args) {
    console.warn("Window.setWindowType interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  loadContent: function(...args) {
    console.warn("Window.loadContent interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  hide: function(...args) {
    console.warn("Window.hide interface mocked in the Previewer. How this interface works on the" +
       " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  hideWithAnimation: function(...args) {
    console.warn("Window.hideWithAnimation interface mocked in the Previewer. How this interface works on the" +
       " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  show: function(...args) {
    console.warn("Window.show interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  showWithAnimation: function(...args) {
    console.warn("Window.showWithAnimation interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  isShowing: function(...args) {
    console.warn("Window.isShowing interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      })
    }
  },
  destroy: function(...args) {
    console.warn("Window.destroy interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setOutsideTouchable: function(...args) {
    console.warn("Window.setOutsideTouchable interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  on: function(...args) {
    console.warn("Window.on interface mocked in the Previewer. How this interface works on the Previewer may be" +
      " different from that on a real device.")
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      if (args[0] === 'keyboardHeightChange'|| args[0] === 'systemAvoidAreaChange'
        || args[0] === 'windowSizeChange'|| args[0] === 'touchOutside'|| args[0] === 'avoidAreaChange'
        || args[0] === 'screenshot' || args[0] === 'dialogTargetTouch'
      ){
        console.warn(`Window.on you has registered ${args[0]} event`)
      } else {
        console.warn("Window.on please check first param!")
      }
    } else {
      console.warn("Window.on please check param!")
    }
  },
  off: function(...args) {
    console.warn("Window.off interface mocked in the Previewer. How this interface works on the Previewer may be" +
      " different from that on a real device.")
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      if (args[0] === 'keyboardHeightChange'|| args[0] === 'systemAvoidAreaChange'
        || args[0] === 'windowSizeChange'|| args[0] === 'touchOutside'|| args[0] === 'avoidAreaChange'
        || args[0] === 'screenshot' || args[0] === 'dialogTargetTouch'
      ){
        console.warn(`Window.off you has registered ${args[0]} event`)
      } else {
        console.warn("Window.off please check first param!")
      }
    } else {
      console.warn("Window.off please check param!")
    }
  },
  setColorSpace: function(...args) {
    console.warn("Window.setColorSpace interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  getColorSpace: function(...args) {
    console.warn("Window.getColorSpace interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock)
      })
    }
  },
  isSupportWideGamut: function(...args) {
    console.warn("Window.isSupportWideGamut interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      })
    }
  },
  snapshot: function (...args) {
    console.warn("Window.snapshot interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, PixelMapMock)
    } else {
      return new Promise((resolve, reject) => {
        resolve(PixelMapMock)
      })
    }
  },
  bindDialogTarget: function(...args) {
    console.warn("Window.bindDialogTarget interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    /* 参数带有function,需特殊判断,原型如下 */
    /* bindDialogTarget(token: rpc.RemoteObject, deathCallback: Callback<void>): Promise<void>; */
    /* bindDialogTarget(token: rpc.RemoteObject, deathCallback: Callback<void>, callback: AsyncCallback<void>); */
    if (typeof args[len - 2] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  },
  setBlur: function() {
    console.warn("Window.setBlur interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setBackdropBlur: function() {
    console.warn("Window.setBackdropBlur interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setBackdropBlurStyle: function() {
    console.warn("Window.setBackdropBlurStyle interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setShadow: function() {
    console.warn("Window.setShadow interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  setCornerRadius: function() {
    console.warn("Window.setCornerRadius interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  opacity: function(...args) {
    console.warn("Window.opacity interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  scale: function(...args) {
    console.warn("Window.scale interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  rotate: function(...args) {
    console.warn("Window.rotate interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  translate: function(...args) {
    console.warn("Window.translate interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  },
  getTransitionController: function() {
    console.warn("Window.getTransitionController interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
      return TransitionController;
  }
}

export const windowMock = Window

export function mockWindow() {
  const ScaleOptions = {
    x: '[PC preview] unknow x',
    y: '[PC preview] unknow y',
    pivotX: '[PC preview] unknow pivotX',
    pivotY: '[PC preview] unknow pivotY'
  }

  const RotateOptions = {
    x: '[PC preview] unknow x',
    y: '[PC preview] unknow y',
    z: '[PC preview] unknow z',
    pivotX: '[PC preview] unknow pivotX',
    pivotY: '[PC preview] unknow pivotY'
  }

  const TranslateOptions = {
    x: '[PC preview] unknow x',
    y: '[PC preview] unknow y',
    z: '[PC preview] unknow z'
  }

  const window =  {
    BlurStyle: {
      OFF: 0,
      THIN: 1,
      REGULAR: 2,
      THICK: 3
    },
    getTopWindow: function(...args) {
      console.warn("Window.getTopWindow interface mocked in the Previewer. How this interface works on the Previewer" +
        "may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Window)
      } else {
        return new Promise((resolve) => {
          resolve(Window)
        })
      }
    },
    create: function(...args) {
      console.warn("Window.create interface mocked in the Previewer. How this interface works on the Previewer may" +
         " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Window)
      } else {
        return new Promise((resolve) => {
          resolve(Window)
        })
      }
    },
    find: function(...args) {
      console.warn("Window.find interface mocked in the Previewer. How this interface works on the Previewer may be" +
         " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Window)
      } else {
        return new Promise((resolve) => {
          resolve(Window)
        })
      }
    },
    isFloatingAbilityWindowVisible: function(...args) {
      console.warn("Window.isFloatingAbilityWindowVisible interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    setSplitBarVisibility: function(...args) {
      console.warn("Window.setSplitBarVisibility interface mocked in the Previewer. How this interface works on the Previewer" +
        "may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    minimizeAll: function(...args) {
      console.warn("Window.minimizeAll interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    toggleShownStateForAllAppWindows: function(...args) {
      console.warn("Window.toggleShownStateForAllAppWindows interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    setWindowLayoutMode: function(...args) {
      console.warn("Window.setWindowLayoutMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    on: function(...args) {
      console.warn("Window.on interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'systemBarTintChange') {
          console.warn(`Window.on you has registered ${args[0]} event`)
        } else {
          console.warn("Window.on please check first param!")
        }
      } else {
        console.warn("Window.on please check param!")
      }
    },
    off: function(...args) {
      console.warn("Window.off interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'systemBarTintChange') {
          console.warn(`Window.off you has registered ${args[0]} event`)
        } else {
          console.warn("Window.off please check first param!")
        }
      } else {
        console.warn("Window.off please check param!")
      }
    },
    WindowType,
    AvoidAreaType,
    WindowMode,
    WindowLayoutMode,
    SystemBarProperties,
    SystemBarRegionTint,
    SystemBarTintState,
    Rect,
    AvoidArea,
    Size,
    WindowProperties,
    ColorSpace,
    ScaleOptions,
    RotateOptions,
    TranslateOptions,
    TransitionContext,
    TransitionController,
    WindowStageEventType,
    WindowStage
  }
  return window
}
