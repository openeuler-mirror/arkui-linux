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

function buildMockInfo(interfaceName) {
  return interfaceName + " interface mocked in the Previewer. How this interface works on the Previewer" +
    " may be different from that on a real device."
}

export function mockHiSysEvent() {
  const EventType = {
    FAULT: 1,
    STATISTIC: 2,
    SECURITY: 3,
    BEHAVIOR: 4
  }
  const SysEventInfo = {
    domain: paramMock.paramStringMock,
    name: paramMock.paramStringMock,
    eventType: EventType,
    params: paramMock.paramObjectMock
  }
  const RuleType = {
    WHOLE_WORD: 1,
    PREFIX: 2,
    REGULAR: 3
  }
  const WatchRule = {
    domain: paramMock.paramStringMock,
    name: paramMock.paramStringMock,
    tag: paramMock.paramStringMock,
    ruleType: RuleType
  }
  const Watcher = {
    rules: [WatchRule],
    onEvent: function(...args) {
      console.warn(buildMockInfo("hisysEvent.Watcher.onEvent"))
    },
    onServiceDied: function(...args) {
      console.warn(buildMockInfo("hisysEvent.Watcher.onServiceDied"))
    }
  }
  const QueryArg = {
    beginTime: paramMock.paramNumberMock,
    endTime: paramMock.paramNumberMock,
    maxEvents: paramMock.paramNumberMock
  }
  const QueryRule = {
    domain: paramMock.paramStringMock,
    names: [paramMock.paramStringMock]
  }
  const Querier = {
    onQuery: function(...args) {
      console.warn(buildMockInfo("hisysEvent.Querier.onQuery"))
    },
    onComplete: function(...args) {
      console.warn(buildMockInfo("hisysEvent.Querier.onComplete"))
    }
  }
  const hiSysEvent = {
    EventType,
    SysEventInfo,
    RuleType,
    WatchRule,
    Watcher,
    QueryArg,
    QueryRule,
    Querier,
    write: function (...args) {
      console.warn(buildMockInfo("hiSysEvent.write"))
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    addWatcher: function(...args) {
        console.warn(buildMockInfo("hiSysEvent.addWatcher"))
        return paramMock.paramNumberMock;
    },
    removeWatcher: function(...args) {
        console.warn(buildMockInfo("hiSysEvent.removeWatcher"))
        return paramMock.paramNumberMock;
    },
    query: function(...args) {
        console.warn(buildMockInfo("hiSysEvent.query"))
        return paramMock.paramNumberMock;
    }
  }
  return hiSysEvent
}