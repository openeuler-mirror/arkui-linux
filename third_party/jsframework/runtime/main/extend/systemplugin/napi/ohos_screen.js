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

import { paramMock } from '../utils';

export const Orientation = {
  UNSPECIFIED: 0,
  VERTICAL: 1,
  HORIZONTAL: 2,
  REVERSE_VERTICAL: 3,
  REVERSE_HORIZONTAL: 4
};

export const Screen = {
  id: 'PC preview] unknown  id',
  parent: '[PC preview] unknown parent',
  supportedModeInfo: supportedModeInfoArray,
  activeModeIndex: '[PC preview] unknown activeModeIndex',
  orientation: Orientation,
  setOrientation: function(...args) {
    console.warn('Screen.setOrientation interface mocked in the Previewer. How this interface works on the' +
                   ' Previewer may be different from that on a real device.');
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock);
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  },
  setScreenActiveMode: function(...args) {
    console.warn('Screen.setScreenActiveMode interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock);
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  },
  setDensityDpi: function(...args) {
    console.warn('Screen.setDensityDpi interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock);
    } else {
      return new Promise((resolve) => {
        resolve();
      });
    }
  }
};

export const allScreenMock = [
  Screen
];

export const ExpandOption = {
  screenId: '[PC preview] unknown screenId',
  startX: '[PC preview] unknown  startX',
  startY: '[PC preview] unknown startY'
};

export const VirtualScreenOption = {
  name: '[PC preview] unknown name',
  width: '[PC preview] unknown width',
  height: '[PC preview] unknown height',
  density: '[PC preview] unknown density',
  surfaceId: '[PC preview] unknown surfaceId'
};

export const ScreenModeInfo = {
  id: '[PC preview] unknown id',
  width: '[PC preview] unknown width',
  height: '[PC preview] unknown height',
  refreshRate: '[PC preview] unknown refreshRate'
};

export const supportedModeInfoArray = [
  ScreenModeInfo
]
const EventTypeMock = {
  connect: 'connect',
  disconnect: 'disconnect',
  change: 'change'
}
export function mockScreen() {
  const screen =  {
    ExpandOption,
    VirtualScreenOption,
    Orientation,
    ScreenModeInfo,
    getAllScreens: function(...args) {
      console.warn('Screen.getAllScreens interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, allScreenMock);
      } else {
        return new Promise((resolve) => {
          resolve(allScreenMock);
        });
      }
    },
    on: function(...args) {
      console.warn('Screen.on interface mocked in the Previewer. How this interface works on the Previewer may be' +
        ' different from that on a real device.');
      const len = args.length;
      if (len!==2){
        console.warn("Screen.on please check params!")
        return
      }
      if (typeof args[len - 1] === 'function') {
        if (args[0] === EventTypeMock.connect || args[0] === EventTypeMock.disconnect || args[0] === EventTypeMock.change) {
          console.warn(`Screen.on you has registered ${args[0]} event`)
        } else {
          console.warn('Screen.on please check first param!')
        }
      } else {
        console.warn('Screen.on please check param!')
      }
    },
    off: function(...args) {
      console.warn('Screen.off interface mocked in the Previewer. How this interface works on the Previewer may be' +
        ' different from that on a real device.');
      const len = args.length;
      if (len!==2){
        console.warn("Screen.off please check params!")
        return
      }
      if (typeof args[len - 1] === 'function') {
        if (args[0] === EventTypeMock.connect || args[0] === EventTypeMock.disconnect || args[0] === EventTypeMock.change) {
          console.warn(`Screen.off you has registered ${args[0]} event`)
        } else {
          console.warn('Screen.off please check first param!')
        }
      } else {
        console.warn('Screen.off please check param!')
      }
    },
    makeExpand: function(...args) {
      console.warn('Screen.makeExpand interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    makeMirror: function(...args) {
      console.warn( 'Screen.makeMirror interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    createVirtualScreen: function(...args) {
      console.warn( 'Screen.createVirtualScreen interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Screen);
      } else {
        return new Promise((resolve) => {
          resolve(Screen);
        });
      }
    },
    destroyVirtualScreen: function(...args) {
      console.warn('Screen.destroyVirtualScreen interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    setVirtualScreenSurface: function(...args) {
      console.warn( 'Screen.setVirtualScreenSurface interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    isScreenRotationLocked: function(...args) {
      console.warn( 'Screen.setVirtualScreenSurface interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    setScreenRotationLocked: function(...args) {
      console.warn( 'Screen.setVirtualScreenSurface interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    }
  }
  return screen
}

