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

export function mockWorker() {
  const WorkerOptionsMock = {
    type: '[PC preview] unknow type',
    name: '[PC preview] unknow name',
    shared: '[PC preview] unknow shared'
  };

  const EventMock = {
    type: '[PC preview] unknow type',
    timeStamp: '[PC preview] unknow timeStamp'
  };

  const ErrorEventMock = {
    message: '[PC preview] unknow message',
    filename: '[PC preview] unknow filename',
    lineno: '[PC preview] unknow lineno',
    colno: '[PC preview] unknow colno',
    error: '[PC preview] unknow error'
  };

  const MessageEventMock = {
    data: '[PC preview] unknow data'
  };

  const PostMessageOptionsMock = {
    transfer:'[PC preview] unknow transfer'
  };

  const EventTargetMock = {
    addEventListener : function (...args) {
        console.warn('PostMessageOptions.addEventListener interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
    },
    dispatchEvent : function (...args) {
        console.warn('PostMessageOptions.dispatchEvent interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
        return paramMock.paramBooleanMock;
    },
    removeEventListener : function (...args) {
        console.warn("PostMessageOptions.removeEventListener interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
    },
    removeAllListener : function (...args) {
        console.warn("PostMessageOptions.removeAllListener interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
    }
  };

  const WorkerGlobalScopeMock = {
    name: '[PC preview] unknow name',
    onerror: function (...args) {
      console.warn("WorkerGlobalScope.onerror interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    },
    self: '[PC preview] unknow self'
  };

  const DedicatedWorkerGlobalScopeMock = {
    onmessage: function (...args) {
      console.warn("DedicatedWorkerGlobalScope.onmessage interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    },
    onmessageerror: function (...args) {
      console.warn("DedicatedWorkerGlobalScope.onmessageerror interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    },
    close : function (...args) {
      console.warn("DedicatedWorkerGlobalScope.close interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    },
    postMessage : function (...args) {
      console.warn("DedicatedWorkerGlobalScope.postMessage interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    },
    postMessage : function (...args) {
      console.warn("DedicatedWorkerGlobalScope.postMessage interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    }
  };

  const WorkerClass = class Worker {
    constructor(...args){
      console.warn('Worker.constructor interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
      this.postMessage = function (...args) {
        console.warn("Worker.postMessage interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.terminate = function (...args) {
        console.warn("Worker.terminate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.on = function (...args) {
        console.warn("Worker.on interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.once = function (...args) {
        console.warn("Worker.once interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.off = function (...args) {
        console.warn("Worker.off interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.addEventListener = function (...args) {
        console.warn("Worker.addEventListener interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.");
      };
      this.dispatchEvent = function (...args) {
        console.warn("Worker.dispatchEvent interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.removeEventListener = function (...args) {
        console.warn("Worker.removeEventListener interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.");
      };
      this.removeAllListener = function (...args) {
        console.warn("Worker.removeAllListener interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.");
      };
      this.onmessage = function (...args) {
        console.warn("Worker.onmessage interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.onmessageerror = function (...agrs) {
        console.warn("Worker.onmessageerror interface mocked in the Previewer. How this interface works on the" +
          " Previewer may be different from that on a real device.");
      };
      this.onerror = function (...args) {
        console.warn("Worker.onerror interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.onclose = function (...args) {
        console.warn("Worker.onclose interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      };
      this.onexit = function (...args) {
        console.warn("Worker.onexit interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
      }
    }
  };

  const workerMock = {
    Worker : WorkerClass,
    parentPort : '[PC preview] unknow parentPort'
  };
  return workerMock;
}

