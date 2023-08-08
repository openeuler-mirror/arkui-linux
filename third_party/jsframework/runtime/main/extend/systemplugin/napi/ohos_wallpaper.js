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
import { PixelMapMock } from "../multimedia"

export function mockWallpaper() {
  const wallpaper = {
    WallpaperType: {
      WALLPAPER_SYSTEM: '[PC preview] unknow WALLPAPER_SYSTEM',
      WALLPAPER_LOCKSCREEN: '[PC preview] unknow WALLPAPER_LOCKSCREEN'
    },
    getColors: function (...args) {
      console.warn("wallpaper.getColors interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      let colors = new Array();
      colors.push(RgbaColorMock);
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, colors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(colors);
        })
      }
    },
    getColorsSync: function (...args) {
      console.warn("wallpaper.getColorsSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      let colors = new Array();
      colors.push(RgbaColorMock);
      return colors;
    },
    getId: function (...args) {
      console.warn("wallpaper.getId interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getIdSync: function (...args) {
      console.warn("wallpaper.getIdSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getFile: function (...args) {
      console.warn("wallpaper.getFile interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getFileSync: function (...args) {
      console.warn("wallpaper.getFileSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getMinHeight: function (...args) {
      console.warn("wallpaper.getMinHeight interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getMinHeightSync: function (...args) {
      console.warn("wallpaper.getMinHeightSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getMinWidth: function (...args) {
      console.warn("wallpaper.getMinWidth interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getMinWidthSync: function (...args) {
      console.warn("wallpaper.getMinWidthSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    isChangePermitted: function (...args) {
      console.warn("wallpaper.isChangePermitted interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isChangeAllowed: function (...args) {
      console.warn("wallpaper.isChangeAllowed interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isOperationAllowed: function (...args) {
      console.warn("wallpaper.isOperationAllowed interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isUserChangeAllowed: function (...args) {
      console.warn("wallpaper.isUserChangeAllowed interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    reset: function (...args) {
      console.warn("wallpaper.reset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    restore: function (...args) {
      console.warn("wallpaper.restore interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setWallpaper: function (...args) {
      console.warn("wallpaper.setWallpaper interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setImage: function (...args) {
      console.warn("wallpaper.setImage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getPixelMap: function (...args) {
      console.warn("wallpaper.getPixelMap interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PixelMapMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(PixelMapMock);
        })
      }
    },
    getImage: function (...args) {
      console.warn("wallpaper.getImage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PixelMapMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(PixelMapMock);
        })
      }
    },
    on: function (...args) {
      console.warn("wallpaper.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'colorChange') {
          let colors = new Array();
          colors.push(RgbaColorMock);
          args[len - 1].call(this, colors, wallpaper.WallpaperType.WALLPAPER_SYSTEM);
        }
      }
    },
    off: function (...args) {
      console.warn("wallpaper.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'colorChange') {
          let colors = new Array();
          colors.push(RgbaColorMock);
          args[len - 1].call(this, colors, wallpaper.WallpaperType.WALLPAPER_SYSTEM);
        }
      }
    }
  }
  const RgbaColorMock = {
    red: '[PC preview] unknow red',
    green: '[PC preview] unknow green',
    blue: '[PC preview] unknow blue',
    alpha: '[PC preview] unknow alpha'
  }
  return wallpaper
}