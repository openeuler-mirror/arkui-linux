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

import { paramMock } from "../../utils"

const DataAbilityResult = {
  uri: "[PC Preview] unknow uri",
  count: "[PC Preview] unknow count"
}
const ResultSet = {
  columnNames: [paramMock.paramStringMock],
  columnCount: "[PC Preview] unknow columnCount",
  rowCount: "[PC Preview] unknow rowCount",
  rowIndex: "[PC Preview] unknow rowIndex",
  isAtFirstRow: "[PC Preview] unknow isAtFirstRow",
  isAtLastRow: "[PC Preview] unknow isAtLastRow",
  isEnded: "[PC Preview] unknow isEnded",
  isStarted: "[PC Preview] unknow isStarted",
  isClose: "[PC Preview] unknow isClose",
  getColumnIndex: function (...args) {
    console.warn("ResultSet.getColumnIndex interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  getColumnName: function (...args) {
    console.warn("ResultSet.getColumnName interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock;
  },
  goTo: function (...args) {
    console.warn("ResultSet.goTo interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToRow: function (...args) {
    console.warn("ResultSet.goToRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToLastRow: function (...args) {
    console.warn("ResultSet.goToLastRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToFirstRow: function (...args) {
    console.warn("ResultSet.goToFirstRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToNextRow: function (...args) {
    console.warn("ResultSet.goToNextRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToPreviousRow: function (...args) {
    console.warn("ResultSet.goToPreviousRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  getBlob: function (...args) {
    console.warn("ResultSet.getBlob interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramArrayMock;
  },
  getString: function (...args) {
    console.warn("ResultSet.getString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock;
  },
  getLong: function (...args) {
    console.warn("ResultSet.getLong interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  getDouble: function (...args) {
    console.warn("ResultSet.getDouble interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  isColumnNull: function (...args) {
    console.warn("ResultSet.isColumnNull interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  close: function () {
    console.warn("ResultSet.close interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  }
}

export const PacMap = {key:{}}
export const DataAbilityHelper = {
  openFile: function (...args) {
    console.warn("dataAbilityHelper.openFile interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  on: function (...args) {
    console.warn("dataAbilityHelper.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    }
  },
  off: function (...args) {
    console.warn("dataAbilityHelper.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    }
  },
  call: function (...args) {
    console.warn("dataAbilityHelper.call interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, PacMap)
    } else {
      return new Promise((resolve) => {
        resolve(PacMap);
      })
    }
  },
  getType: function (...args) {
    console.warn("dataAbilityHelper.getType interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  getFileTypes: function (...args) {
    console.warn("dataAbilityHelper.getFileTypes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock])
    } else {
      return new Promise((resolve) => {
        resolve([paramMock.paramStringMock]);
      })
    }
  },
  normalizeUri: function (...args) {
    console.warn("dataAbilityHelper.normalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  denormalizeUri: function (...args) {
    console.warn("dataAbilityHelper.denormalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  notifyChange: function (...args) {
    console.warn("dataAbilityHelper.notifyChange interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve();
      })
    }
  },
  insert: function (...args) {
    console.warn("dataAbilityHelper.insert interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  batchInsert: function (...args) {
    console.warn("dataAbilityHelper.batchInsert interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  delete: function (...args) {
    console.warn("dataAbilityHelper.delete interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  update: function (...args) {
    console.warn("dataAbilityHelper.update interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  query: function (...args) {
    console.warn("dataAbilityHelper.query interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, ResultSet)
    } else {
      return new Promise((resolve) => {
        resolve(ResultSet);
      })
    }
  },
  call: function (...args)  {
    console.warn("dataAbilityHelper.call interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, PacMap)
    } else {
      return new Promise((resolve) => {
        resolve(PacMap);
      })
    }
  },
  executeBatch: function (...args) {
    console.warn("dataAbilityHelper.executeBatch interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, [DataAbilityResult])
    } else {
      return new Promise((resolve) => {
        resolve([DataAbilityResult]);
      })
    }
  }
}
