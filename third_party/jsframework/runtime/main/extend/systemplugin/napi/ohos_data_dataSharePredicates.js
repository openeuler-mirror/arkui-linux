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
export function mockDataSharePredicates() {
    const DataSharePredicatesClass = class DataSharePredicates {
      constructor() {
        this.equalTo = function (...args) {
          console.warn("DataSharePredicates.equalTo interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.notEqualTo = function (...args) {
          console.warn("DataSharePredicates.notEqualTo interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.beginWrap = function (...args) {
          console.warn("DataSharePredicates.beginWrap interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.endWrap = function (...args) {
          console.warn("DataSharePredicates.endWrap interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.or = function (...args) {
          console.warn("DataSharePredicates.or interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.and = function (...args) {
          console.warn("DataSharePredicates.and interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.contains = function (...args) {
          console.warn("DataSharePredicates.contains interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.beginsWith = function (...args) {
          console.warn("DataSharePredicates.beginsWith interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.endsWith = function (...args) {
          console.warn("DataSharePredicates.endsWith interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.isNull = function (...args) {
          console.warn("DataSharePredicates.isNull interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.isNotNull = function (...args) {
          console.warn("DataSharePredicates.isNotNull interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.like = function (...args) {
          console.warn("DataSharePredicates.like interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.unlike = function (...args) {
            console.warn("DataSharePredicates.unlike interface mocked in the Previewer. How this interface works on the" +
              " Previewer may be different from that on a real device.")
            return new DataSharePredicatesClass();
          };
        this.glob = function (...args) {
          console.warn("DataSharePredicates.glob interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.between = function (...args) {
          console.warn("DataSharePredicates.between interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.notBetween = function (...args) {
          console.warn("DataSharePredicates.notBetween interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.greaterThan = function (...args) {
          console.warn("DataSharePredicates.greaterThan interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.lessThan = function (...args) {
          console.warn("DataSharePredicates.lessThan interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.greaterThanOrEqualTo = function (...args) {
          console.warn("DataSharePredicates.greaterThanOrEqualTo interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.lessThanOrEqualTo = function (...args) {
          console.warn("DataSharePredicates.lessThanOrEqualTo interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.orderByAsc = function (...args) {
          console.warn("DataSharePredicates.orderByAsc interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.orderByDesc = function (...args) {
          console.warn("DataSharePredicates.orderByDesc interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.distinct = function (...args) {
          console.warn("DataSharePredicates.distinct interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.limit = function (...args) {
          console.warn("DataSharePredicates.limit interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.groupBy = function (...args) {
          console.warn("DataSharePredicates.groupBy interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.indexedBy = function (...args) {
          console.warn("DataSharePredicates.indexedBy interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.in = function (...args) {
          console.warn("DataSharePredicates.in interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.notIn = function (...args) {
          console.warn("DataSharePredicates.notIn interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.prefixKey = function (...args) {
          console.warn("DataSharePredicates.prefixKey interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
        this.inKeys = function (...args) {
          console.warn("DataSharePredicates.inKeys interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
          return new DataSharePredicatesClass();
        };
      }
    }
      const dataSharePredicatesMock = {
        DataSharePredicates: DataSharePredicatesClass
    }
    return dataSharePredicatesMock;
}