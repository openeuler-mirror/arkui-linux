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

export function mockProcess() {
  const process = {
    runCmd: function (...args) {
      console.warn("process.runCmd interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return ChildProcessMock;
    },
    abort: function (...args) {
      console.warn("process.abort interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("process.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("process.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    exit: function (...args) {
      console.warn("process.exit interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    cwd: function (...args) {
      console.warn("process.cwd interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    chdir: function (...args) {
      console.warn("process.chdir interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    uptime: function (...args) {
      console.warn("process.uptime interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    kill: function (...args) {
      console.warn("process.kill interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getStartRealtime: function (...args) {
      console.warn("process.getStartRealtime interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getPastCputime: function (...args) {
      console.warn("process.getPastCputime interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getAvailableCores: function (...args) {
      console.warn("process.getAvailableCores interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramArrayMock;
    },
    isIsolatedProcess: function (...args) {
      console.warn("process.isIsolatedProcess interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    is64Bit: function (...args) {
      console.warn("process.is64Bit interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isAppUid: function (...args) {
      console.warn("process.isAppUid interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getUidForName: function (...args) {
      console.warn("process.getUidForName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getThreadPriority: function (...args) {
      console.warn("process.getThreadPriority interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getSystemConfig: function (...args) {
      console.warn("process.getSystemConfig interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getEnvironmentVar: function (...args) {
      console.warn("process.getEnvironmentVar interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    egid: '[PC preview] unknow egid',
    euid: '[PC preview] unknow euid',
    gid: '[PC preview] unknow gid',
    uid: '[PC preview] unknow uid',
    groups: '[PC preview] unknow groups',
    pid: '[PC preview] unknow pid',
    ppid: '[PC preview] unknow ppid',
    tid: '[PC preview] unknow tid',
  }

  const ChildProcessMock = {
    pid: '[PC preview] unknow pid',
    ppid: '[PC preview] unknow ppid',
    exitCode: '[PC preview] unknow exitCode',
    killed: '[PC preview] unknow killed',
    wait: function (...args) {
      console.warn("ChildProcess.wait interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new Promise((resolve, reject) => {
        resolve(paramMock.paramNumberMock);
      })
    },
    getOutput: function (...args) {
      console.warn("ChildProcess.getOutput interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const arr = new Uint8Array()
      return new Promise((resolve, reject) => {
        resolve(arr);
      })
    },
    getErrorOutput: function (...args) {
      console.warn("ChildProcess.getErrorOutput interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const arr = new Uint8Array()
      return new Promise((resolve, reject) => {
        resolve(arr);
      })
    },
    close: function (...args) {
      console.warn("ChildProcess.close interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    kill: function (...args) {
      console.warn("ChildProcess.kill interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    }
  }
  return process;
}
