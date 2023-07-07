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

import { paramMock } from "../utils"
import { WantAgent } from "./ohos_wantAgent"

export function mockSystemTimer() {
  const systemTimer = {
    TIMER_TYPE_REALTIME: '[PC preview] unknow TIMER_TYPE_REALTIME',
    TIMER_TYPE_WAKEUP: '[PC preview] unknow TIMER_TYPE_WAKEUP',
    TIMER_TYPE_EXACT: '[PC preview] unknow TIMER_TYPE_EXACT',
    TIMER_TYPE_IDLE: '[PC preview] unknow TIMER_TYPE_IDLE',
    createTimer: function (...args) {
      console.warn("systemTimer.createTimer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    startTimer: function (...args) {
      console.warn("systemTimer.startTimer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    stopTimer: function (...args) {
      console.warn("systemTimer.stopTimer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    destroyTimer: function (...args) {
      console.warn("systemTimer.destroyTimer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  }
  const TimerOptions = {
    type: '[PC Preview] unknown type',
    repeat: '[PC Preview] unknown repeat',
    interval: '[PC Preview] unknown interval',
    wantAgent: WantAgent,
    callback:'[PC Preview] unknown interval'
  }
  return systemTimer
}
