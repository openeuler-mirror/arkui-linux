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

import {paramMock} from "../utils"

export const DataType = {
  TYPE_NULL: 0,
  TYPE_LONG: 1,
  TYPE_DOUBLE: 2,
  TYPE_STRING: 3,
  TYPE_BLOB: 4
};
export const DataShareResultSetMock = {
  columnNames: "[PC Preview] unknow columnNames",
  columnCount: "[PC Preview] unknow columnCount",
  rowCount: "[PC Preview] unknow rowCount",
  rowIndex: "[PC Preview] unknow rowIndex",
  isEnded: "[PC Preview] unknow isEnded",
  isStarted: "[PC Preview] unknow isStarted",
  isClosed: "[PC Preview] unknow isClosed",
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
  getDataType: function (...args) {
    console.warn("ResultSet.getDataType interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  close: function () {
    console.warn("ResultSet.close interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  }
}
export function DataShareResultSet() {
      return DataShareResultSetMock
}