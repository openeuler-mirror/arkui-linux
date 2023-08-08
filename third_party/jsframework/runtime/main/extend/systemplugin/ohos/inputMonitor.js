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

export function mockInputMonitor() {
  const touches = [{
    force: 1.67,
    globalX: 122,
    globalY: 3654,
    localX: 0,
    localY: 0,
    size: 2.03
  }];
  const changedTouches = [{
    force: 1.67,
    globalX: 122,
    globalY: 3654,
    localX: 0,
    localY: 0,
    size: 2.03
  }];
  const pressedButtons = [10, 11 , 12, 13, 14];
  global.systemplugin.multimodalInput = {};
  global.systemplugin.multimodalInput.inputMonitor = {
    on: function (...args) {
      console.warn('multimodalInput.inputMonitor.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      clearInterval(this.offInputMonitor);
      delete this.offInputMonitor;
      this.offInputMonitor = setInterval(() => {
        const len = args.length;
        if (len !== 2 || typeof args[0] !== 'string' || typeof args[len - 1] !== 'function') {
          console.warn('multimodalInput.inputMonitor.on param invalid.');
          return;
        }
        if (args[0] !== 'touch' && args[0] !== 'mouse') {
          console.warn('multimodalInput.inputMonitor.on first param should be touch or mouse.');
          return;
        }
        const value = {};
        value.type = 'up';
        value.timestamp = 318878;
        value.deviceId = 0;
        value.touches = touches;
        value.changedTouches = changedTouches;
        const mouse = {};
        mouse.type = 'move';
        mouse.pressedButtons = pressedButtons;
        mouse.displayId = 20;
        mouse.targetWindowId = 21;
        mouse.agentWindowId = 22;
        mouse.localX = 450;
        mouse.localY = 736;
        mouse.globalX = 450;
        mouse.globalY = 784;
        mouse.timestamp = 55670246;
        mouse.axisVerticalValue = 15;
        mouse.axisHorizontalValue = 20;
        if (args[0] === 'touch') {
          console.warn('multimodalInput.inputMonitor.on touch callback.');
          args[len - 1].call(this, value);
        } else if (args[0] === 'mouse') {
          console.warn('multimodalInput.inputMonitor.on mouse callback.');
          args[len - 1].call(this, mouse);
        }
      }, 1000);
    },

    off: function (...args) {
      console.warn('multimodalInput.inputMonitor.off interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      clearInterval(this.offInputMonitor);
      delete this.offInputMonitor;
    }
  };
}

