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
import { AccessibilityExtensionContext } from './application/AccessibilityExtensionContext';

const AccessibilityEvent = {
  eventType: '[PC Preview] unknown eventType',
  target: '[PC Preview] unknown target',
  timeStamp: '[PC Preview] unknown timeStamp'
};

const GesturePoint = {
    positionX: '[PC Preview] unknown positionX',
    positionY: '[PC Preview] unknown positionY'
  };

const GesturePath = {
  points: [GesturePoint],
  durationTime: '[PC Preview] unknown durationTime'
};

export function mockAccessibilityExtensionAbility() {
  const AccessibilityExtensionAbilityClass = class AccessibilityExtensionAbility {
    constructor() {
      console.warn('accessibilityExtensionAbility.constructor interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      this.context = new AccessibilityExtensionContext();
      this.onConnect = function (...args) {
        console.warn('accessibilityExtensionAbility.onConnect interface mocked in the Previewer.' +
          ' How this interface works on the Previewer may be different from that on a real device.');
      };
      this.onDisconnect = function (...args) {
        console.warn('accessibilityExtensionAbility.onDisconnect interface mocked in the Previewer.' +
          ' How this interface works on the Previewer may be different from that on a real device.');
      };
      this.onAccessibilityEvent = function (...args) {
        console.warn('accessibilityExtensionAbility.onAccessibilityEvent interface mocked in the Previewer.' +
          ' How this interface works on the Previewer may be different from that on a real device.');
      };
      this.onKeyEvent = function (...args) {
        console.warn('accessibilityExtensionAbility.onKeyEvent interface mocked in the Previewer.' +
          ' How this interface works on the Previewer may be different from that on a real device.');
        return paramMock.paramBooleanMock;
      };
    }
  };

  return AccessibilityExtensionAbilityClass;
}