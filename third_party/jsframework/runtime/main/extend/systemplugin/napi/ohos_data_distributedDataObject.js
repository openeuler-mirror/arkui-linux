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

export function mockDistributedObject() {
  const DistributedObject = {
    setSessionId: function (...args) {
      console.warn("DistributedObject.setSessionId interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("DistributedObject.on interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("DistributedObject.off interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
    },
    save: function (...args) {
      console.warn("DistributedObject.save interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SaveSuccessResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SaveSuccessResponse);
        })
      }
    },
    revokeSave: function (...args) {
      console.warn("DistributedObject.revokeSave interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, RevokeSaveSuccessResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(RevokeSaveSuccessResponse);
        })
      }
    }
  };
  const SaveSuccessResponse = {
    sessionId: "[[PC Preview] unknow sessionId]",
    version: "[[PC Preview] unknow version]",
    deviceId: "[[PC Preview] unknow deviceId]"
  };
  const RevokeSaveSuccessResponse = {
    sessionId: "[[PC Preview] unknow sessionId]"
  };
  const distributedDataObject = {
    createDistributedObject: function (...args) {
      console.warn("distributedObject.createDistributedObject interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.");
      return DistributedObject;
    },
    genSessionId: function (...args) {
      console.warn("distributedObject.genSessionId interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    }
  };
  return distributedDataObject;
}
