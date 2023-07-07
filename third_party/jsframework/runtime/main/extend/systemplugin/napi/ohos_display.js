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

const DisplayState = {
  STATE_UNKNOWN: 0,
  STATE_OFF: 1,
  STATE_ON: 2,
  STATE_DOZE: 3,
  STATE_DOZE_SUSPEND: 4,
  STATE_VR: 5,
  STATE_ON_SUSPEND: 6
}
const DisplayType = {
  add: 'add',
  remove: 'remove',
  change: 'change'
}

export function mockDisplay() {
  const Rect = {
    left: '[PC preview] unknow left',
    top: '[PC preview] unknow top',
    width: '[PC preview] unknow width',
    height: '[PC preview] unknow height',
  }
  
  const WaterfallDisplayAreaRects = {
    left: Rect,
    top: Rect,
    width: Rect,
    height: Rect
  }

  const CutoutInfo = {
    boundingRects: Array(Rect),
    waterfallDisplayAreaRects: WaterfallDisplayAreaRects
  }
  
  const Display = {
    id: '[PC preview] unknow id',
    name: '[PC preview] unknow name',
    alive: '[PC preview] unknow alive',
    state: DisplayState,
    refreshRate: '[PC preview] unknow refreshRate',
    rotation: '[PC preview] unknow rotation',
    width: '[PC preview] unknow width',
    height: '[PC preview] unknow height',
    densityDPI: '[PC preview] unknow densityDPI',
    densityPixels: '[PC preview] unknow densityPixels',
    scaledDensity: '[PC preview] unknow scaledDensity',
    xDPI: '[PC preview] unknow xDPI',
    yDPI: '[PC preview] unknow yDPI',
    getCutoutInfo: function(...args) {
      console.warn('Display.getCutoutInfo interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CutoutInfo);
      } else {
        return new Promise((resolve) => {
          resolve(CutoutInfo);
        });
      }
    }
  }
  
  const display = {
    getDefaultDisplay: function (...args) {
      console.warn("Display.getDefaultDisplay interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Display)
      } else {
        return new Promise((resolve, reject) => {
          resolve(Display)
        })
      }
    },
    getDefaultDisplaySync: function (...args) {
      console.warn("Display.getDefaultDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return Display
    },
    getAllDisplay: function (...args) {
      console.warn("Display.getAllDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [Display])
      } else {
        return new Promise((resolve, reject) => {
          resolve([Display])
        })
      }
    },
    hasPrivateWindow: function (...args) {
      console.warn("Display.hasPrivateWindow interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    on: function (...args) {
      console.warn("Display.on interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (len!==2){
        console.warn("Display.on：please check params !")
        return
      }
      if (typeof args[len - 1] === 'function') {
        if (args[0] === DisplayType.add|| args[0] === DisplayType.remove || args[0] === DisplayType.change){
          console.warn(`Display.on: you has registered ${args[0]} event.`)
        } else {
          console.warn("Display.on：please check first param!")
        }
      } else {
        console.warn("Display.on：please check params, the second parma must be a function!")
      }
    },
    off: function (...args) {
      console.warn("Display.off interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      if (len!==2){
        console.warn("Display.off：please check params!")
        return
      }
      if (typeof args[len - 1] === 'function') {
        if (args[0] === DisplayType.add|| args[0] === DisplayType.remove || args[0] === DisplayType.change){
          console.warn(`Display.off: you has registered ${args[0]} event`)
        } else {
          console.warn("Display.off：please check first param!")
        }
      } else {
        console.warn("Display.off：please check params, the second parma must be a function!")
      }
    },
    DisplayState
  }
  return display
}