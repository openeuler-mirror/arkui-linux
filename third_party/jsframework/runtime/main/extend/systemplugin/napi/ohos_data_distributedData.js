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

export function mockDistributedData() {
  const SchemaClass = class Schema {
    constructor() {
      console.warn('Schema.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      this.toJsonString = function (...args) {
        console.warn("Schema.toJsonString interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return paramMock.paramStringMock;
      }
    }
  };

  const FieldNodeClass = class FieldNode {
    constructor(...args) {
      console.warn('FieldNode.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');

      this.appendChild = function (...args) {
        console.warn("FieldNode.appendChild interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return paramMock.paramBooleanMock;
      };

      this.toJson = function (...args) {
        console.warn("FieldNode.toJson interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return paramMock.paramStringMock;
      };
    }
  };

  const QueryClass = class Query {
    constructor() {
      console.warn('Query.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      this.reset = function (...args) {
        console.warn("Query.reset interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.equalTo = function (...args) {
        console.warn("Query.equalTo interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.notEqualTo = function (...args) {
        console.warn("Query.notEqualTo interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.greaterThan = function (...args) {
        console.warn("Query.greaterThan interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.lessThan = function (...args) {
        console.warn("Query.lessThan interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.greaterThanOrEqualTo = function (...args) {
        console.warn("Query.greaterThanOrEqualTo interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.lessThanOrEqualTo = function (...args) {
        console.warn("Query.lessThanOrEqualTo interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.isNull = function (...args) {
        console.warn("Query.isNull interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.inNumber = function (...args) {
        console.warn("Query.inNumber interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.inString = function (...args) {
        console.warn("Query.inString interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.notInNumber = function (...args) {
        console.warn("Query.notInNumber interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.notInString = function (...args) {
        console.warn("Query.notInString interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.like = function (...args) {
        console.warn("Query.like interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.unlike = function (...args) {
        console.warn("Query.unlike interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.and = function (...args) {
        console.warn("Query.and interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.or = function (...args) {
        console.warn("Query.or interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.orderByAsc = function (...args) {
        console.warn("Query.orderByAsc interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.orderByDesc = function (...args) {
        console.warn("Query.orderByDesc interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.limit = function (...args) {
        console.warn("Query.limit interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.isNotNull = function (...args) {
        console.warn("Query.isNotNull interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.beginGroup = function (...args) {
        console.warn("Query.beginGroup interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.endGroup = function (...args) {
        console.warn("Query.endGroup interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.prefixKey = function (...args) {
        console.warn("Query.prefixKey interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.setSuggestIndex = function (...args) {
        console.warn("Query.setSuggestIndex interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.deviceId = function (...args) {
        console.warn("Query.deviceId interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };

      this.getSqlLike = function (...args) {
        console.warn("Query.getSqlLike interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        return QueryClass;
      };
    }
  };

  const distributedDataMock = {
    Schema: SchemaClass,
    Query: QueryClass,
    FieldNode: FieldNodeClass,

    KVStoreType: {
      DEVICE_COLLABORATION: 0,
      SINGLE_VERSION: 1,
      MULTI_VERSION: 2,
    },

    SecurityLevel: {
      NO_LEVEL: 0,
      S0: 1,
      S1: 2,
      S2: 3,
      S3: 5,
      S4: 6,
    },

    SyncMode: {
      PULL_ONLY: 0,
      PUSH_ONLY: 1,
      PUSH_PULL: 2,
    },

    SubscribeType: {
      SUBSCRIBE_TYPE_LOCAL: 0,
      SUBSCRIBE_TYPE_REMOTE: 1,
      SUBSCRIBE_TYPE_ALL: 2,
    },

    createKVManager: function (...args) {
      console.warn("distributedData.createKVManager interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, KVManager);
      } else {
        return new Promise((resolve, reject) => {
          resolve(KVManager);
        })
      }
    }
  };

  const userTypeMock = {
    SAME_USER_ID: "[PC Preview] unknown SAME_USER_ID"
  };
  const userInfoMock = {
    userId: "[PC Preview] unknown userId",
    userType: "[PC Preview] unknown userType"
  };
  const kvManagerConfigMock = {
    userInfo: "[PC Preview] unknown userInfo",
    bundleName: "[PC Preview] unknown bundleName",
    context : "[PC Preview] unknown context"
  };
  const constantsMock = {
    MAX_KEY_LENGTH: "[PC Preview] unknown MAX_KEY_LENGTH",
    MAX_VALUE_LENGTH: "[PC Preview] unknown MAX_VALUE_LENGTH",
    MAX_KEY_LENGTH_DEVICE: "[PC Preview] unknown MAX_KEY_LENGTH_DEVICE",
    MAX_STORE_ID_LENGTH: "[PC Preview] unknown MAX_STORE_ID_LENGTH",
    MAX_QUERY_LENGTH: "[PC Preview] unknown MAX_QUERY_LENGTH",
    MAX_BATCH_SIZE: "[PC Preview] unknown MAX_BATCH_SIZE"
  };
  const schemaMock = {
    root: "[PC Preview] unknown root",
    indexes: "[PC Preview] unknown indexes",
    mode: "[PC Preview] unknown mode",
    skip: "[PC Preview] unknown skip"
  };
  const fieldnodeMock = {
    default: "[PC Preview] unknown default",
    nullable: "[PC Preview] unknown nullable",
    type: "[PC Preview] unknown type"
  };
  const valueTypeMock = {
    STRING: "[PC Preview] unknown STRING",
    INTEGER: "[PC Preview] unknown INTEGER",
    FLOAT: "[PC Preview] unknown FLOAT",
    BYTE_ARRAY: "[PC Preview] unknown BYTE_ARRAY",
    BOOLEAN: "[PC Preview] unknown BOOLEAN",
    DOUBLE: "[PC Preview] unknown DOUBLE"
  };
  const valueMock = {
    type: valueTypeMock.STRING,
    value: "[PC Preview] unknown value"
  };
  const entryMock = {
    key: "[PC Preview] unknown key",
    value: valueMock
  };
  const changeNotificationMock = {
    insertEntries: new Array(entryMock),
    updateEntries: new Array(entryMock),
    deleteEntries: new Array(entryMock),
    deviceId: "[PC Preview] unknown deviceId"
  };
  const optionsMock = {
    createIfMissing: "[PC Preview] unknown createIfMissing",
    encrypt: "[PC Preview] unknown encrypt",
    backup: "[PC Preview] unknown backup",
    autoSync: "[PC Preview] unknown autoSync",
    kvStoreType: "[PC Preview] unknown kvStoreType",
    securityLevel: "[PC Preview] unknown securityLevel",
    schema: "[PC Preview] unknown schema"
  };

  const KVStoreClass = class KVStore {
    constructor() {
      console.warn("KVStore.constructor interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      this.put = function (...args) {
        console.warn("KVStore.put interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.delete = function (...args) {
        console.warn("KVStore.delete interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.setSyncRange = function (...args) {
        console.warn("KVStore.setSyncRange interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.on = function (...args) {
        console.warn("KVStore.on interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          if (args[0] == 'dataChange') {
            args[len - 1].call(this, paramMock.businessErrorMock, changeNotificationMock)
          } else if (args[0] === 'syncComplete') {
            var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
            args[len - 1].call(this, array);
          }
        }
      };

      this.off = function (...args) {
        console.warn("KVStore.off interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          if (args[0] == 'dataChange') {
            args[len - 1].call(this, paramMock.businessErrorMock, changeNotificationMock)
          } else if (args[0] === 'syncComplete') {
            var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
            args[len - 1].call(this, array);
          }
        }
      };

      this.putBatch = function (...args) {
        console.warn("KVStore.putBatch interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.deleteBatch = function (...args) {
        console.warn("KVStore.deleteBatch interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.startTransaction = function (...args) {
        console.warn("KVStore.startTransaction interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.commit = function (...args) {
        console.warn("KVStore.commit interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.rollback = function (...args) {
        console.warn("KVStore.rollback interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.enableSync = function (...args) {
        console.warn("KVStore.enableSync interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.backup = function (...args) {
        console.warn("KVStore.backup interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

	    this.restore = function (...args) {
        console.warn("KVStore.restore interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.deleteBackup = function (...args) {
        console.warn("KVStore.deleteBackup interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramArrayMock)
          })
        }
      };
    }
  };

  const SingleKVStoreClass = class SingleKVStore extends KVStoreClass {
    constructor() {
      super();
      console.warn("SingleKVStore.constructor interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")

      this.put = function (...args) {
        console.warn("SingleKVStore.put interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          })
        }
      };

      this.delete = function (...args) {
        console.warn("SingleKVStore.delete interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve();
          })
        }
      };

      this.on = function (...args) {
        console.warn("SingleKVStore.on interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          if (args[0] === 'dataChange') {
            args[len - 1].call(this, changeNotificationMock);
          } else if (args[0] === 'syncComplete') {
            var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
            args[len - 1].call(this, array);
          }
        }
      };

      this.off = function (...args) {
        console.warn("SingleKVStore.off interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
        if (typeof args[len - 1] === 'function') {
          if (args[0] == 'syncComplete') {
            args[len - 1].call(this, paramMock.businessErrorMock, array)
          } else if (args[0] == 'dataChange') {
            args[len - 1].call(this, paramMock.businessErrorMock, changeNotificationMock)
          }
        }
      };

      this.sync = function (...args) {
        console.warn("SingleKVStore.sync interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
      };

      this.get = function (...args) {
        console.warn("SingleKVStore.get interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock,
            paramMock.paramBooleanMock | paramMock.paramStringMock | paramMock.paramNumberMock | paramMock.paramArrayMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramBooleanMock | paramMock.paramStringMock | paramMock.paramNumberMock | paramMock.paramArrayMock)
          })
        }
      };

      this.getResultSet = function (...args) {
        console.warn("SingleKVStore.getResultSet interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, KVStoreResultSet)
        } else {
          return new Promise((resolve) => {
            resolve(KVStoreResultSet)
          })
        }
      };

      this.closeResultSet = function (...args) {
        console.warn("SingleKVStore.closeResultSet interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.getResultSize = function (...args) {
        console.warn("SingleKVStore.getResultSize interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramNumberMock)
          })
        }
      };

      this.getEntries = function (...args) {
        console.warn("SingleKVStore.getEntries interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        var array = new Array(entryMock)
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, array)
        } else {
          return new Promise((resolve) => {
            resolve(array)
          })
        }
      };

      this.removeDeviceData = function (...args) {
        console.warn("SingleKVStore.removeDeviceData interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.setSyncParam = function (...args) {
        console.warn("SingleKVStore.setSyncParam interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.getSecurityLevel = function (...args) {
        console.warn("SingleKVStore.getSecurityLevel interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };
    }
  };

  const DeviceKVStoreClass = class DeviceKVStore extends KVStoreClass {
    constructor() {
      super();
      console.warn('DeviceKVStore.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');

      this.get = function (...args) {
        console.warn("DeviceKVStore.get interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock,
            paramMock.paramBooleanMock | paramMock.paramStringMock | paramMock.paramNumberMock | paramMock.paramArrayMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramBooleanMock | paramMock.paramStringMock | paramMock.paramNumberMock | paramMock.paramArrayMock)
          })
        }
      };

      this.getEntries = function (...args) {
        console.warn("DeviceKVStore.getEntries interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        var array = new Array(entryMock)
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, array)
        } else {
          return new Promise((resolve) => {
            resolve(array)
          })
        }
      };

      this.getResultSet = function (...args) {
        console.warn("DeviceKVStore.getResultSet interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, KVStoreResultSet)
        } else {
          return new Promise((resolve) => {
            resolve(KVStoreResultSet)
          })
        }
      };

      this.closeResultSet = function (...args) {
        console.warn("DeviceKVStore.closeResultSet interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.getResultSize = function (...args) {
        console.warn("DeviceKVStore.getResultSize interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramNumberMock)
          })
        }
      };

      this.removeDeviceData = function (...args) {
        console.warn("DeviceKVStore.removeDeviceData interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
      };

      this.sync = function (...args) {
        console.warn("DeviceKVStore.sync interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
      };

      this.on = function (...args) {
        console.warn("DeviceKVStore.on interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
        if (typeof args[len - 1] === 'function') {
          if (args[0] == 'syncComplete') {
            args[len - 1].call(this, paramMock.businessErrorMock, array)
          } else if (args[0] == 'dataChange') {
            args[len - 1].call(this, paramMock.businessErrorMock, changeNotificationMock)
          }
        }
      };

      this.off = function (...args) {
        console.warn("DeviceKVStore.off interface mocked in the Previewer. How this interface works" +
          " on the Previewer may be different from that on a real device.")
        const len = args.length
        var array = new Array([paramMock.paramStringMock, paramMock.paramNumberMock]);
        if (typeof args[len - 1] === 'function') {
          if (args[0] == 'syncComplete') {
            args[len - 1].call(this, paramMock.businessErrorMock, array)
          } else if (args[0] == 'dataChange') {
            args[len - 1].call(this, paramMock.businessErrorMock, changeNotificationMock)
          }
        }
      };
    }
  };

  const KVManager = {
    getKVStore: function (...args) {
      console.warn("KVManager.getKVStore interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      var singleKVStoreClass = new SingleKVStoreClass
      var deviceKVStoreClass = new DeviceKVStoreClass
      if (len > 0 && typeof args[len - 1] === 'function') {
        console.warn("getKVStore kvStoreType = " + args[1].kvStoreType);
        if (args[1].kvStoreType == distributedDataMock.KVStoreType.DEVICE_COLLABORATION) {
          args[len - 1].call(this, paramMock.businessErrorMock, deviceKVStoreClass);
        } else if (args[1].kvStoreType == distributedDataMock.KVStoreType.SINGLE_VERSION) {
          args[len - 1].call(this, paramMock.businessErrorMock, singleKVStoreClass);
        }
      } else {
        return new Promise((resolve) => {
          if (args[1].kvStoreType == distributedDataMock.KVStoreType.DEVICE_COLLABORATION) {
            resolve(deviceKVStoreClass);
          } else if (args[1].kvStoreType == distributedDataMock.KVStoreType.SINGLE_VERSION) {
            resolve(singleKVStoreClass);
          }
        })
      }
    },

    closeKVStore: function (...args) {
      console.warn("KVManager.closeKVStore interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    deleteKVStore: function (...args) {
      console.warn("KVManager.deleteKVStore interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    getAllKVStoreId: function (...args) {
      console.warn("KVManager.getAllKVStoreId interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      var array = new Array(paramMock.paramStringMock)
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        })
      }
    },

    on: function (...args) {
      console.warn("KVManager.on interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'distributedDataServiceDie') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        }
      }
    },

    off: function (...args) {
      console.warn("KVManager.off interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'distributedDataServiceDie') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        }
      }
    }
  };

  const KVStoreResultSet = {
    getCount: function (...args) {
      console.warn("KVStoreResultSet.getCount interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    getPosition: function (...args) {
      console.warn("KVStoreResultSet.getPosition interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    moveToFirst: function (...args) {
      console.warn("KVStoreResultSet.moveToFirst interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    moveToLast: function (...args) {
      console.warn("KVStoreResultSet.moveToLast interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    moveToNext: function (...args) {
      console.warn("KVStoreResultSet.moveToNext interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    moveToPrevious: function (...args) {
      console.warn("KVStoreResultSet.moveToPrevious interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    move: function (...args) {
      console.warn("KVStoreResultSet.move interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    moveToPosition: function (...args) {
      console.warn("KVStoreResultSet.moveToPosition interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isFirst: function (...args) {
      console.warn("KVStoreResultSet.isFirst interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isLast: function (...args) {
      console.warn("KVStoreResultSet.isLast interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isBeforeFirst: function (...args) {
      console.warn("KVStoreResultSet.isBeforeFirst interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isAfterLast: function (...args) {
      console.warn("KVStoreResultSet.isAfterLast interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getEntry: function (...args) {
      console.warn("KVStoreResultSet.getEntry interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return entryMock;
    }
  };

  return distributedDataMock;
}