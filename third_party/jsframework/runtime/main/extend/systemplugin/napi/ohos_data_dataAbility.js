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

import { paramMock } from '../utils';

export const RdbPredicatesClass = class RdbPredicates {
  constructor(...args) {
    console.warn('data.rdb.RdbPredicates.constructor interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
    this.equalTo = function (...args) {
      console.warn("RdbPredicates.equalTo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.notEqualTo = function (...args) {
      console.warn("RdbPredicates.notEqualTo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.beginWrap = function (...args) {
      console.warn("RdbPredicates.beginWrap interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.endWrap = function (...args) {
      console.warn("RdbPredicates.endWrap interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.or = function (...args) {
      console.warn("RdbPredicates.or interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.and = function (...args) {
      console.warn("RdbPredicates.and interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.contains = function (...args) {
      console.warn("RdbPredicates.contains interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.beginsWith = function (...args) {
      console.warn("RdbPredicates.beginsWith interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.endsWith = function (...args) {
      console.warn("RdbPredicates.endsWith interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.isNull = function (...args) {
      console.warn("RdbPredicates.isNull interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.isNotNull = function (...args) {
      console.warn("RdbPredicates.isNotNull interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.like = function (...args) {
      console.warn("RdbPredicates.like interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.glob = function (...args) {
      console.warn("RdbPredicates.glob interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.between = function (...args) {
      console.warn("RdbPredicates.between interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.notBetween = function (...args) {
      console.warn("RdbPredicates.notBetween interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.greaterThan = function (...args) {
      console.warn("RdbPredicates.greaterThan interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.lessThan = function (...args) {
      console.warn("RdbPredicates.lessThan interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.greaterThanOrEqualTo = function (...args) {
      console.warn("RdbPredicates.greaterThanOrEqualTo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.lessThanOrEqualTo = function (...args) {
      console.warn("RdbPredicates.lessThanOrEqualTo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.orderByAsc = function (...args) {
      console.warn("RdbPredicates.orderByAsc interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.orderByDesc = function (...args) {
      console.warn("RdbPredicates.orderByDesc interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.distinct = function (...args) {
      console.warn("RdbPredicates.distinct interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.limitAs = function (...args) {
      console.warn("RdbPredicates.limitAs interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.offsetAs = function (...args) {
      console.warn("RdbPredicates.offsetAs interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.groupBy = function (...args) {
      console.warn("RdbPredicates.groupBy interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.indexedBy = function (...args) {
      console.warn("RdbPredicates.indexedBy interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.in = function (...args) {
      console.warn("RdbPredicates.in interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.notIn = function (...args) {
      console.warn("RdbPredicates.notIn interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.inDevices = function (...args) {
      console.warn("RdbPredicates.inDevices interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
    this.inAllDevices = function (...args) {
      console.warn("RdbPredicates.inAllDevices interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new RdbPredicatesClass();
    };
  }
};

export function mockDataAbility() {
  const DataAbilityPredicatesClass = class DataAbilityPredicates {
    constructor() {
      console.warn('DataAbility.DataAbilityPredicates.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      this.equalTo = function (...args) {
        console.warn('DataAbilityPredicates.equalTo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.notEqualTo = function (...args) {
        console.warn('DataAbilityPredicates.notEqualTo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.beginWrap = function (...args) {
        console.warn('DataAbilityPredicates.beginWrap interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.endWrap = function (...args) {
        console.warn('DataAbilityPredicates.endWrap interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.or = function (...args) {
        console.warn('DataAbilityPredicates.or interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.and = function (...args) {
        console.warn('DataAbilityPredicates.and interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.contains = function (...args) {
        console.warn('DataAbilityPredicates.contains interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.beginsWith = function (...args) {
        console.warn('DataAbilityPredicates.beginsWith interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.endsWith = function (...args) {
        console.warn('DataAbilityPredicates.endsWith interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.isNull = function (...args) {
        console.warn('DataAbilityPredicates.isNull interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.isNotNull = function (...args) {
        console.warn('DataAbilityPredicates.isNotNull interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.like = function (...args) {
        console.warn('DataAbilityPredicates.like interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.glob = function (...args) {
        console.warn('DataAbilityPredicates.glob interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.between = function (...args) {
        console.warn('DataAbilityPredicates.between interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.notBetween = function (...args) {
        console.warn('DataAbilityPredicates.notBetween interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.greaterThan = function (...args) {
        console.warn('DataAbilityPredicates.greaterThan interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.lessThan = function (...args) {
        console.warn('DataAbilityPredicates.lessThan interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.greaterThanOrEqualTo = function (...args) {
        console.warn('DataAbilityPredicates.greaterThanOrEqualTo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.lessThanOrEqualTo = function (...args) {
        console.warn('DataAbilityPredicates.lessThanOrEqualTo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.orderByAsc = function (...args) {
        console.warn('DataAbilityPredicates.orderByAsc interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.orderByDesc = function (...args) {
        console.warn('DataAbilityPredicates.orderByDesc interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.distinct = function (...args) {
        console.warn('DataAbilityPredicates.distinct interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.limitAs = function (...args) {
        console.warn('DataAbilityPredicates.limitAs interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.offsetAs = function (...args) {
        console.warn('DataAbilityPredicates.offsetAs interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.groupBy = function (...args) {
        console.warn('DataAbilityPredicates.groupBy interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.indexedBy = function (...args) {
        console.warn('DataAbilityPredicates.indexedBy interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.in = function (...args) {
        console.warn('DataAbilityPredicates.in interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
      this.notIn = function (...args) {
        console.warn('DataAbilityPredicates.notIn interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        return new DataAbilityPredicatesClass();
      };
    }
  };
  const dataAbilityMock = {
    createRdbPredicates: function (...args) {
      console.warn('DataAbility.createRdbPredicates.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer may be different from that on a real device.');
      return new RdbPredicatesClass();
    },
    DataAbilityPredicates: DataAbilityPredicatesClass
  };
  return dataAbilityMock;
}
