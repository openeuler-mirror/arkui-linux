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

import { paramMock } from '../utils';

export function mockAccessibility() {
  const AbilityTypeMock = '[PC Preview] unknown AbilityType';

  const CapabilityMock = '[PC Preview] unknown Capability';

  const EventTypeMock = '[PC Preview] unknown EventType';

  const AccessibilityAbilityInfo = {
    id: '[PC Preview] unknown id',
    name: '[PC Preview] unknown name',
    bundleName: '[PC Preview] unknown bundleName',
    TargetBundleName: ['[PC Preview] unknown TargetBundleName'],
    abilityTypes: [AbilityTypeMock],
    capabilities: [CapabilityMock],
    description: '[PC Preview] unknown description',
    eventTypes: [EventTypeMock]
  };

  const CaptionsFontEdgeTypeMock = '[PC Preview] unknown CaptionsFontEdgeType';

  const CaptionsFontFamilyMock = '[PC Preview] unknown CaptionsFontFamily';

  const CaptionStyle = {
    fontFamily: CaptionsFontFamilyMock,
    fontScale: '[PC Preview] unknown fontScale',
    fontColor: '[PC Preview] unknown fontColor',
    fontEdgeType: CaptionsFontEdgeTypeMock,
    backgroundColor: '[PC Preview] unknown backgroundColor',
    windowColor: '[PC Preview] unknown windowColor'
  };

  const CaptionsManagerMock = {
    enabled: '[PC Preview] unknown enabled',
    style: CaptionStyle,
    on: function (...args) {
      console.warn('CaptionsManager.on interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 1 && typeof args[len - 1] === 'function') {
        if (args[0] === 'enableChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'styleChange') {
          args[len - 1].call(this, CaptionStyle);
        }
      }
    },
    off: function (...args) {
      console.warn('CaptionsManager.off interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 1 && typeof args[len - 1] === 'function') {
        if (args[0] === 'enableChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'styleChange') {
          args[len - 1].call(this, CaptionStyle);
        }
      }
    },
  };

  const WindowUpdateTypeMock = '[PC Preview] unknown WindowUpdateType';

  const ActionMock = '[PC Preview] unknown Action';

  const TextMoveUnitMock = '[PC Preview] unknown TextMoveUnit';

  const EventInfoClass = class EventInfo {
    constructor(...args) {
      console.warn('accessibility.EventInfoClass.constructor interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      this.type = EventTypeMock;
      this.windowUpdateType = WindowUpdateTypeMock;
      this.bundleName = '[PC Preview] unknown bundleName';
      this.componentType = '[PC Preview] unknown componentType';
      this.pageId = '[PC Preview] unknown pageId';
      this.description = '[PC Preview] unknown description';
      this.triggerAction = ActionMock;
      this.textMoveUnit = TextMoveUnitMock;
      this.contents = ['[PC Preview] unknown content'];
      this.lastContent = '[PC Preview] unknown lastContent';
      this.beginIndex = '[PC Preview] unknown beginIndex';
      this.currentIndex = '[PC Preview] unknown currentIndex';
      this.endIndex = '[PC Preview] unknown endIndex';
      this.itemCount = '[PC Preview] unknown itemCount';
    }
  };

  const accessibility = {
    EventInfo: EventInfoClass,
    isOpenAccessibility: function (...args) {
      console.warn('accessibility.isOpenAccessibility interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    isOpenTouchGuide: function (...args) {
      console.warn('accessibility.isOpenTouchGuide interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    on: function (...args) {
      console.warn('accessibility.on interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'accessibilityStateChange') {
          args[len - 1].call(this, this, paramMock.paramBooleanMock);
        } else if (args[0] == 'touchGuideStateChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else {
          args[len - 1].call(this, this, paramMock.paramBooleanMock);
        }
      }
    },
    off: function (...args) {
      console.warn('accessibility.off interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 1 && typeof args[len - 1] === 'function') {
        if (args[0] === 'accessibilityStateChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] === 'touchGuideStateChange') {
          args[len - 1].call(this, paramMock.paramBooleanMock);
        }
      }
    },
    getAbilityLists: function (...args) {
      console.warn('accessibility.getAbilityLists interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [AccessibilityAbilityInfo]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([AccessibilityAbilityInfo]);
        });
      }
    },
    sendEvent: function (...args) {
      console.warn('accessibility.sendEvent interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    },
    getCaptionsManager: function () {
      console.warn('accessibility.getCaptionsManager interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      return CaptionsManagerMock;
    }
  };

  return accessibility;
}