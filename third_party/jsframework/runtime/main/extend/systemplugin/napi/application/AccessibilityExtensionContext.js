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

import { paramMock } from '../../utils'
import { ExtensionContextClass } from './ExtensionContext'

const ElementAttributeNameMock = '[PC Preview] unknown element attribute name';

const ElementAttributeValuesMock = '[PC Preview] unknown element attribute value';

const Rect = {
  left: '[PC Preview] unknown element left',
  top: '[PC Preview] unknown element top',
  width: '[PC Preview] unknown element width',
  height: '[PC Preview] unknown element height'
};

const AccessibilityElement = {
  attributeNames: function (...args) {
    console.warn('AccessibilityElement.attributeNames interface mocked in the Previewer.' +
      ' How this interface works on the Previewer may be different from that on a real device.');
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, [ElementAttributeNameMock]);
    } else {
      return new Promise((resolve, reject) => {
        resolve([ElementAttributeNameMock]);
      });
    }
  },
  attributeValue: function (...args) {
    console.warn('AccessibilityElement.attributeValue interface mocked in the Previewer.' +
      ' How this interface works on the Previewer may be different from that on a real device.');
    let value = null;
    switch (args[0]) {
      case 'contents':
        value = [ElementAttributeValuesMock];
        break;
      case 'rect':
      case 'screenRect':
        value = Rect;
        break;
      case 'parent':
      case 'rootElement':
        value = AccessibilityElement;
        break;
      case 'children':
        value = [AccessibilityElement];
        break;
      default:
        value = ElementAttributeValuesMock;
        break;
      }

    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, value);
    } else {
      return new Promise((resolve, reject) => {
        resolve(value);
      });
    }
  },
  actionNames: function (...args) {
    console.warn('AccessibilityElement.actionNames interface mocked in the Previewer.' +
      ' How this interface works on the Previewer may be different from that on a real device.');
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, [param.paramStringMock]);
    } else {
      return new Promise((resolve, reject) => {
        resolve([param.paramStringMock]);
      });
    }
  },
  performAction: function (...args) {
    console.warn('AccessibilityElement.performAction interface mocked in the Previewer.' +
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
  findElement: function (...args) {
    console.warn('AccessibilityElement.findElement interface mocked in the Previewer.' +
      ' How this interface works on the Previewer may be different from that on a real device.');
    const result = (args[0] === 'content') ? [AccessibilityElement] : AccessibilityElement;
    const len = args.length;
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, result);
    } else {
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }
  },
};

export class AccessibilityExtensionContext extends ExtensionContextClass {
  constructor(...args) {
    super();
    console.warn('AccessibilityExtensionContext.constructor interface mocked in the Previewer.' +
      ' How this interface works on the Previewer may be different from that on a real device.');

    this.setEventTypeFilter = function (...args) {
      console.warn('AccessibilityExtensionContext.setEventTypeFilter interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    };

    this.setTargetBundleName = function (...args) {
      console.warn('AccessibilityExtensionContext.setTargetBundleName interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    };

    this.getFocusElement = function (...args) {
      console.warn('AccessibilityExtensionContext.getFocusElement interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AccessibilityElement);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AccessibilityElement);
        });
      }
    };

    this.getWindowRootElement = function (...args) {
      console.warn('AccessibilityExtensionContext.getWindowRootElement interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AccessibilityElement);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AccessibilityElement);
        });
      }
    };

    this.getWindows = function (...args) {
      console.warn('AccessibilityExtensionContext.getWindows interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [AccessibilityElement]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([AccessibilityElement]);
        });
      }
    };

    this.injectGesture = function (...args) {
      console.warn('AccessibilityExtensionContext.injectGesture interface mocked in the Previewer.' +
        ' How this interface works on the Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }
    };
  }
};