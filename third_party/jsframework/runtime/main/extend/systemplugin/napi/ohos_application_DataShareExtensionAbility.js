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
import { ExtensionContextClass } from "./application/ExtensionContext"

export function mockDataShareExtensionAbility() {
  const DataShareExtensionAbilityClass = class DataShareExtensionAbility {
    constructor() {
      console.warn('application.DataShareExtensionAbility interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.context = new ExtensionContextClass();
      this.onCreate = function (...args) {
        console.warn("application.DataShareExtensionAbility.onCreate interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        }
      },
      this.getFileTypes = function (...args) {
        console.warn("application.DataShareExtensionAbility.getFileTypes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock,[paramMock.paramStringMock])
        }
      },
      this.openFile = function (...args) {
        console.warn("application.DataShareExtensionAbility.openFile interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      },
      this.insert = function (...args) {
        console.warn("application.DataShareExtensionAbility.insert interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      },
      this.update = function (...args) {
        console.warn("application.DataShareExtensionAbility.update interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      },
      this.delete = function (...args) {
        console.warn("application.DataShareExtensionAbility.delete interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      },
      this.query = function (...args) {
        console.warn("application.DataShareExtensionAbility.query interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
        }
      },
      this.getType = function (...args) {
        console.warn("application.DataShareExtensionAbility.getType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
        }
      },
      this.batchInsert = function (...args) {
        console.warn("application.DataShareExtensionAbility.batchInsert interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        }
      },
      this.normalizeUri = function (...args) {
        console.warn("application.DataShareExtensionAbility.normalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        }
      },
      this.denormalizeUri = function (...args) {
        console.warn("application.DataShareExtensionAbility.denormalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        }
      }    
    }
  }
  return DataShareExtensionAbilityClass;
}
