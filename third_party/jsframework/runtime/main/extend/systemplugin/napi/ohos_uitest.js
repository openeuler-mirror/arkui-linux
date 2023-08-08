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

import {paramMock} from '../utils'

const warnMessage =
    ' interface mocked in the Previewer. How this interface works on the' +
    ' Previewer may be different from that on a real device.'

export const ResizeDirection = {
  LEFT: 0,
  RIGHT: 1,  
  UP: 2,
  DOWN: 3,
  LEFT_UP: 4,
  LEFT_DOWN: 5,
  RIGHT_UP: 6,
  RIGHT_DOWN: 7
}

export const MatchPattern = {
  EQUALS: 0,
  CONTAINS: 1,
  STARTS_WITH: 2,
  ENDS_WITH: 3
}

export const WindowMode = {
  FULLSCREEN: 0,
  PRIMARY: 1,
  SECONDARY: 2,
  FLOATING: 3
}

export const Point = {
    X: '[PC Preview] unknown X',
    Y: '[PC Preview] unknown Y'
}

export const Rect = {
    leftX: '[PC Preview] unknown leftX',
    topY: '[PC Preview] unknown topY',
    rightX: '[PC Preview] unknown rightX',
    bottomY: '[PC Preview] unknown bottomY'
}

export const WindowFilter = {
    bundleName: '[PC Preview] unknown bundleName',
    title: '[PC Preview] unknown title',
    focused: '[PC Preview] unknown focused',
    actived: '[PC Preview] unknown actived'
}

const ByClass = class ByMock {
  constructor() {
    console.warn('uitest.By.constructor' + warnMessage);
    this.id = function(...args) {
      console.warn('uitest.By.id' + warnMessage)
      return new ByClass()
    };
    this.text = function(...args) {
      console.warn('uitest.By.text' + warnMessage)
      return new ByClass()
    };
    this.key = function(...args) {
      console.warn('uitest.By.key' + warnMessage)
      return new ByClass()
    };
    this.type = function(...args) {
      console.warn('uitest.By.type' + warnMessage)
      return new ByClass()
    };
    this.enabled = function(...args) {
      console.warn('uitest.By.enabled' + warnMessage)
      return new ByClass()
    };
    this.focused = function(...args) {
      console.warn('uitest.By.focused' + warnMessage)
      return new ByClass()
    };
    this.selected = function(...args) {
      console.warn('uitest.By.selected' + warnMessage)
      return new ByClass()
    };
    this.clickable = function(...args) {
      console.warn('uitest.By.clickable' + warnMessage)
      return new ByClass()
    };
    this.enabled = function(...args) {
      console.warn('uitest.By.enabled' + warnMessage)
      return new ByClass()
    };
    this.longClickable = function(...args) {
      console.warn('uitest.By.longClickable' + warnMessage)
      return new ByClass()
    };
    this.scrollable = function(...args) {
      console.warn('uitest.By.scrollable' + warnMessage)
      return new ByClass()
    };
    this.checkable = function(...args) {
      console.warn('uitest.By.checkable' + warnMessage)
      return new ByClass()
    };
    this.checked = function(...args) {
      console.warn('uitest.By.checked' + warnMessage)
      return new ByClass()
    };
    this.isBefore = function(...args) {
      console.warn('uitest.By.isBefore' + warnMessage)
      return new ByClass()
    };
    this.isAfter = function(...args) {
      console.warn('uitest.By.isAfter' + warnMessage)
      return new ByClass()
    };
  }
}

const UiDriverClass = class UiDriverMock {
  constructor() {
    console.warn('uitest.UiDriver.constructor' + warnMessage);
    this.delayMs = function(...args) {
      console.warn('uitest.UiDriver.delayMs' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.findComponent = function(...args) {
      console.warn('uitest.UiDriver.findComponent' + warnMessage)
      return new Promise((resolve) => {
        resolve(new UiComponentClass())
      });
    };
    this.findWindow = function(...args) {
      console.warn('uitest.UiDriver.findWindow' + warnMessage)
      return new Promise((resolve) => {
        resolve(new UiWindowClass())
      });
    };
    this.findComponents = function(...args) {
      console.warn('uitest.UiDriver.findComponents' + warnMessage)
      return new Promise((resolve) => {
        resolve(new Array(new UiComponentClass()))
      });
    };
    this.waitForComponent = function(...args) {
      console.warn('uitest.UiDriver.waitForComponent' + warnMessage)
      return new Promise((resolve) => {
        resolve(new UiComponentClass())
      });
    };
    this.screenCap = function(...args) {
      console.warn('uitest.UiDriver.screenCap' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.assertComponentExist = function(...args) {
      console.warn('uitest.UiDriver.assertComponentExist' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.pressBack = function(...args) {
      console.warn('uitest.UiDriver.pressBack' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.triggerKey = function(...args) {
      console.warn('uitest.UiDriver.triggerKey' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.triggerCombineKeys = function(...args) {
      console.warn('uitest.UiDriver.triggerCombineKeys' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.click = function(...args) {
      console.warn('uitest.UiDriver.click' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.longClick = function(...args) {
      console.warn('uitest.UiDriver.longClick' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.doubleClick = function(...args) {
      console.warn('uitest.UiDriver.doubleClick' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.swipe = function(...args) {
      console.warn('uitest.UiDriver.swipe' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.drag = function(...args) {
      console.warn('uitest.UiDriver.drag' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
  }
}

UiDriverClass.create = function () {
    console.warn('uitest.UiDriver.create' + warnMessage)
    return new UiDriverClass()
}

const UiComponentClass = class UiComponentMock {
  constructor() {
    console.warn('uitest.UiComponent.constructor' + warnMessage);
    this.getId = function(...args) {
      console.warn('uitest.UiComponent.getId' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock)
      });
    };
    this.getText = function(...args) {
      console.warn('uitest.UiComponent.getText' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock)
      });
    };
    this.getKey = function(...args) {
      console.warn('uitest.UiComponent.getKey' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock)
      });
    };
    this.getType = function(...args) {
      console.warn('uitest.UiComponent.getType' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock)
      });
    };
    this.isEnabled = function(...args) {
      console.warn('uitest.UiComponent.isEnabled' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isFocused = function(...args) {
      console.warn('uitest.UiComponent.isFocused' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isSelected = function(...args) {
      console.warn('uitest.UiComponent.isSelected' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isClickable = function(...args) {
      console.warn('uitest.UiComponent.isClickable' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isLongClickable = function(...args) {
      console.warn('uitest.UiComponent.isLongClickable' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isScrollable = function(...args) {
      console.warn('uitest.UiComponent.isScrollable' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isCheckable = function(...args) {
      console.warn('uitest.UiComponent.isCheckable' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isChecked = function(...args) {
      console.warn('uitest.UiComponent.isChecked' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.getBounds = function(...args) {
      console.warn('uitest.UiComponent.getBounds' + warnMessage)
      return new Promise((resolve) => {
        resolve(Rect)
      });
    };
    this.getBoundsCenter = function(...args) {
      console.warn('uitest.UiComponent.getBoundsCenter' + warnMessage)
      return new Promise((resolve) => {
        resolve(Point)
      });
    };
    this.click = function(...args) {
      console.warn('uitest.UiComponent.click' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.longClick = function(...args) {
      console.warn('uitest.UiComponent.longClick' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.doubleClick = function(...args) {
      console.warn('uitest.UiComponent.doubleClick' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.scrollToTop = function(...args) {
      console.warn('uitest.UiComponent.scrollToTop' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.scrollToBottom = function(...args) {
      console.warn('uitest.UiComponent.scrollToBottom' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.inputText = function(...args) {
      console.warn('uitest.UiComponent.inputText' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.clearText = function(...args) {
      console.warn('uitest.UiComponent.clearText' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.scrollSearch = function(...args) {
      console.warn('uitest.UiComponent.scrollSearch' + warnMessage)
      return new Promise((resolve) => {
        resolve(new UiComponentClass())
      });
    };
    this.dragTo = function(...args) {
      console.warn('uitest.UiComponent.dragTo' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.pinchOut = function(...args) {
      console.warn('uitest.UiComponent.pinchOut' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
    this.pinchIn = function(...args) {
      console.warn('uitest.UiComponent.pinchIn' + warnMessage)
      return new Promise((resolve) => {
        resolve()
      });
    };
  }
}

const UiWindowClass = class UiWindowMock {
  constructor() {
    console.warn('uitest.UiWindow.constructor' + warnMessage);
    this.getBundleName = function(...args) {
      console.warn('uitest.UiWindow.getBundleName' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock)
      });
    };
    this.getBounds = function(...args) {
      console.warn('uitest.UiWindow.getBounds' + warnMessage)
      return new Promise((resolve) => {
        resolve(Rect)
      });
    };
    this.getTitle = function(...args) {
      console.warn('uitest.UiWindow.getTitle' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock)
      });
    };
    this.getWindowMode = function(...args) {
      console.warn('uitest.UiWindow.getWindowMode' + warnMessage)
      return new Promise((resolve) => {
        resolve(WindowMode)
      });
    };
    this.isFocused = function(...args) {
      console.warn('uitest.UiWindow.isFocused' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.isActived = function(...args) {
      console.warn('uitest.UiWindow.isActived' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.focus = function(...args) {
      console.warn('uitest.UiWindow.focus' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.moveTo = function(...args) {
      console.warn('uitest.UiWindow.moveTo' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.resize = function(...args) {
      console.warn('uitest.UiWindow.resize' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.split = function(...args) {
      console.warn('uitest.UiWindow.split' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.maximize = function(...args) {
      console.warn('uitest.UiWindow.maximize' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.resume = function(...args) {
      console.warn('uitest.UiWindow.resume' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.minimize = function(...args) {
      console.warn('uitest.UiWindow.minimize' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
    this.close = function(...args) {
      console.warn('uitest.UiWindow.close' + warnMessage)
      return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock)
      });
    };
  };
}

export function mockUiTest() {
  const module = {
    ResizeDirection: ResizeDirection,
    MatchPattern: MatchPattern,
    WindowMode: WindowMode,
    Point: Point,
    Rect: Rect,
    WindowFilter: WindowFilter,
    BY: new ByClass(),
    UiDriver: UiDriverClass,
    UiComponent: UiComponentClass,
    UiWindow: UiWindowClass
  };
  return module
}