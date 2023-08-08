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

import { paramMock } from "../utils"

export function mockWebSocket() {
  const WebSocketRequestOptions = {
    header: "[PC Preview] unknow header"
  }
  const WebSocketCloseOptions = {
    code: "[PC Preview] unknow code",
    reason: "[PC Preview] unknow reason"
  }
  const WebSocketMock = {
    connect: function (...args) {
      console.warn("WebSocket.connect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    send: function (...args) {
      console.warn("WebSocket.send interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    close: function (...args) {
      console.warn("WebSocket.close interface mocked in the Previewer. How this interface works on the Previewer " +
        "may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    on: function (...args) {
      console.warn("WebSocket.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'open') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'message') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else if (args[0] === 'close') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            code: "[PC Preview] unknow code",
            reason: "[PC Preview] unknow reason"
          });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("WebSocket.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'open') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'message') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else if (args[0] === 'close') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            code: "[PC Preview] unknow code",
            reason: "[PC Preview] unknow reason"
          });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    }
  }
  const webSocket = {
    createWebSocket: function () {
      console.warn("net.webSocket.createWebSocket interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebSocketMock;
    }
  }
  return webSocket
}
