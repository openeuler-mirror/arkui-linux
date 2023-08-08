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

export const EventPriority = {
  IMMEDIATE: 0,
  HIGH: 1,
  LOW: 2,
  IDLE: 3,
}
export const EventData = {
  data: '[PC preview] unknow data',
}
export const InnerEvent = {
  eventId: '[PC preview] unknow eventId',
  priority: EventPriority,
}

export function mockEmitter() {
  const emitter = {
    on: function (...args) {
      console.warn("emitter.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, EventData);
      }
    },
    once: function (...args) {
      console.warn("emitter.once interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, EventData);
      }
    },
    off: function (...args) {
      console.warn("emitter.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
    },
    emit: function (...args) {
      console.warn("emitter.emit interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
    },
    EventData,
    InnerEvent,
    EventPriority
  }
  return emitter
}
