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

export function mockOsAccount() {
  const OsAccountInfoMock = {
    localId: "[PC Preview] unknown localId",
    localName: "[PC Preview] unknown localName",
    type: "[PC Preview] unknown type",
    constraints: "[PC Preview] unknown constraints",
    isVerified: "[PC Preview] unknown isVerified",
    photo: "[PC Preview] unknown photo",
    createTime: "[PC Preview] unknown createTime",
    lastLoginTime: "[PC Preview] unknown lastLoginTime",
    serialNumber: "[PC Preview] unknown serialNumber",
    isActived: "[PC Preview] unknown isActived",
    isCreateCompleted: "[PC Preview] unknown isCreateCompleted",
    domainInfo: "[PC Preview] unknown domainInfo",
    distributedInfo: "[PC Preview] unknown distributedInfo"
  };
  const DomainAccountInfoMock = {
    domain: "[PC Preview] unknown domain",
    accountName: "[PC Preview] unknown accountName"
  };
  const ConstraintSourceTypeInfoMock = {
    localId: "[PC Preview] unknown localId",
    type: "[PC Preview] unknown type"
  };
  const GetPropertyRequest = {
    authType: "[PC Preview] unknown authType",
    keys: "[PC Preview] unknown keys"
  };
  const SetPropertyRequest = {
    authType: "[PC Preview] unknown authType",
    key: "[PC Preview] unknown key",
    setInfo: "[PC Preview] unknown setInfo"
  };
  const ExecutorProperty = {
    result: "[PC Preview] unknown result",
    authSubType: AuthSubType,
    remainTimes: "[PC Preview] unknown remainTimes",
    freezingTime: "[PC Preview] unknown freezingTime"
  };
  const AuthResult = {
    token: "[PC Preview] unknown token",
    remainTimes: "[PC Preview] unknown remainTimes",
    freezingTime: "[PC Preview] unknown freezingTime"
  };
  const CredentialInfo = {
    credType: "[PC Preview] unknown credType",
    credSubType: "[PC Preview] unknown credSubType",
    token: "[PC Preview] unknown token"
  };
  const RequestResult = {
    credentialId: "[PC Preview] unknown credentialId"
  };
  const EnrolledCredInfo = {
    credentialId: "[PC Preview] unknown credentialId",
    authType: "[PC Preview] unknown authType",
    authSubType: "[PC Preview] unknown authSubType",
    templateId: "[PC Preview] unknown templateId"
  };
  const OsAccountTypeMock = "[PC Preview] unknown type";
  const AccountManagerMock = {
    activateOsAccount: function (...args) {
      console.warn("AccountManager.activateOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    isMultiOsAccountEnable: function (...args) {
      console.warn("AccountManager.isMultiOsAccountEnable interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isOsAccountActived: function (...args) {
      console.warn("AccountManager.isOsAccountActived interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isOsAccountConstraintEnable: function (...args) {
      console.warn("AccountManager.isOsAccountConstraintEnable interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isTestOsAccount: function (...args) {
      console.warn("AccountManager.isTestOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isOsAccountVerified: function (...args) {
      console.warn("AccountManager.isOsAccountVerified interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    removeOsAccount: function (...args) {
      console.warn("AccountManager.removeOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setOsAccountConstraints: function (...args) {
      console.warn("AccountManager.setOsAccountConstraints interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setOsAccountName: function (...args) {
      console.warn("AccountManager.setOsAccountName interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getCreatedOsAccountsCount: function (...args) {
      console.warn("AccountManager.getCreatedOsAccountsCount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getOsAccountLocalIdFromProcess: function (...args) {
      console.warn("AccountManager.getOsAccountLocalIdFromProcess interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getOsAccountLocalIdFromUid: function (...args) {
      console.warn("AccountManager.getOsAccountLocalIdFromUid interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getOsAccountLocalIdFromDomain: function (...args) {
      console.warn("AccountManager.getOsAccountLocalIdFromDomain interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    queryMaxOsAccountNumber: function (...args) {
      console.warn("AccountManager.queryMaxOsAccountNumber interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getOsAccountAllConstraints: function (...args) {
      console.warn("AccountManager.getOsAccountAllConstraints interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    queryAllCreatedOsAccounts: function (...args) {
      console.warn("AccountManager.queryAllCreatedOsAccounts interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var osAccountInfoArrayMock = new Array();
      osAccountInfoArrayMock.push(OsAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, osAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(osAccountInfoArrayMock);
        })
      }
    },
    queryActivatedOsAccountIds: function (...args) {
      console.warn("AccountManager.queryActivatedOsAccountIds interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var osAccountIdsArrayMock = new Array();
      osAccountIdsArrayMock.push(OsAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, osAccountIdsArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(osAccountIdsArrayMock);
        })
      }
    },
    createOsAccount: function (...args) {
      console.warn("AccountManager.createOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OsAccountInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OsAccountInfoMock);
        })
      }
    },
    createOsAccountForDomain: function (...args) {
      console.warn("AccountManager.createOsAccountForDomain interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OsAccountInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OsAccountInfoMock);
        })
      }
    },
    queryCurrentOsAccount: function (...args) {
      console.warn("AccountManager.queryCurrentOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OsAccountInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OsAccountInfoMock);
        })
      }
    },
    queryOsAccountById: function (...args) {
      console.warn("AccountManager.queryOsAccountById interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OsAccountInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OsAccountInfoMock);
        })
      }
    },
    getOsAccountTypeFromProcess: function (...args) {
      console.warn("AccountManager.getOsAccountTypeFromProcess interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OsAccountTypeMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OsAccountTypeMock);
        })
      }
    },
    getDistributedVirtualDeviceId: function (...args) {
      console.warn("AccountManager.getDistributedVirtualDeviceId interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getOsAccountProfilePhoto: function (...args) {
      console.warn("AccountManager.getOsAccountProfilePhoto interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    setOsAccountProfilePhoto: function (...args) {
      console.warn("AccountManager.setOsAccountProfilePhoto interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getOsAccountLocalIdBySerialNumber: function (...args) {
      console.warn("AccountManager.getOsAccountLocalIdBySerialNumber interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getSerialNumberByOsAccountLocalId: function (...args) {
      console.warn("AccountManager.getSerialNumberByOsAccountLocalId interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    on: function (...args) {
      console.warn("AccountManager.on interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    off: function (...args) {
      console.warn("AccountManager.off interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    isMainOsAccount: function (...args) {
      console.warn("AccountManager.isMainOsAccount interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    getBundleIdFromUid: function (...args) {
      console.warn("AccountManager.getBundleIdFromUid interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    queryOsAccountConstraintSourceTypes: function (...args) {
      console.warn("AccountManager.queryOsAccountConstraintSourceTypes interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
        var constraintSourceTypeInfoArrayMock = new Array();
        constraintSourceTypeInfoArrayMock.push(ConstraintSourceTypeInfoMock);
        const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, constraintSourceTypeInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(constraintSourceTypeInfoArrayMock);
        })
      }
    },
  };
  const UserAuthClass = class UserAuth {
    constructor() {
      console.warn("osAccount.UserAuth.constructor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      this.getVersion = function (...args) {
        console.warn("UserAuth.getVersion interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramNumberMock;
      };
      this.getAvailableStatus = function (...args) {
        console.warn("UserAuth.getAvailableStatus interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramNumberMock;
      };
      this.getProperty = function (...args) {
        console.warn("UserAuth.getProperty interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, ExecutorProperty);
        } else {
          return new Promise((resolve, reject) => {
            resolve(ExecutorProperty);
          })
        }
      };
      this.setProperty = function (...args) {
        console.warn("UserAuth.setProperty interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve(paramMock.paramNumberMock);
          })
        }
      };
      this.auth = function (...args) {
        console.warn("UserAuth.auth interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IUserAuthCallback);
        } 
        return paramMock.paramArrayMock;
      };
      this.authUser = function (...args) {
        console.warn("UserAuth.authUser interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IUserAuthCallback);
        }
        return paramMock.paramArrayMock;
      };
      this.cancelAuth = function (...args) {
        console.warn("UserAuth.cancelAuth interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramNumberMock;
      };
   }; 
  };
  const PINAuthClass = class PINAuth {
    constructor() {
      console.warn("osAccount.PINA.constructor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      this.registerInputer = function (...args) {
        console.warn("PINAuth.registerInputer interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramBooleanMock;
      };
      this.unregisterInputer = function (...args) {
        console.warn("PINAuth.unregisterInputer interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
      };
    };
  };
  const UserIdentityManagerClass = class UserIdentityManager {
    constructor() {
      console.warn("osAccount.getAccountManager.constructor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      this.openSession = function (...args) {
        console.warn("UserIdentityManager.openSession interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock,  paramMock.paramArrayMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve(paramMock.paramArrayMock);
          })
        }
      };
      this.addCredential = function (...args) {
        console.warn("AUserIdentityManager.addCredential interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IIdmCallback);
        }
      };
      this.updateCredential = function (...args) {
        console.warn("AUserIdentityManager.updateCredential interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IIdmCallback);
        }
      };
      this.closeSession = function (...args) {
        console.warn("AUserIdentityManager.closeSession interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.") 
      };
      this.cancel = function (...args) {
        console.warn("AUserIdentityManager.cancel interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return paramMock.paramNumberMock;
      };
      this.delUser = function (...args) {
        console.warn("AUserIdentityManager.delUser interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IIdmCallback);
        }
      };
      this.delCred = function (...args) {
        console.warn("AUserIdentityManager.delCred interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, IIdmCallback);
        }
      };
      this.getAuthInfo = function (...args) {
        console.warn("AUserIdentityManager.getAuthInfo interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        var EnrolledCredInfoMock = new Array();
        EnrolledCredInfoMock.push(EnrolledCredInfo);
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, EnrolledCredInfoMock);
        } else {
          return new Promise((resolve, reject) => {
            resolve(EnrolledCredInfoMock)
          })
        }
      };
    };
  }
  const IInputData = {
    onSetData: function (...args) {
      console.warn("IInputData.onSetData interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
  };
  const IInputer = {
    onGetData: function (...args) {
      console.warn("IInputer.onGetData interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
  };
  const IUserAuthCallback = {
    onResult: function (...args) {
      console.warn("IUserAuthCallback.onResult interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    onAcquireInfo: function (...args) {
      console.warn("IUserAuthCallback.onAcquireInfo interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
  };
  const IIdmCallback = {
    onResult: function (...args) {
      console.warn("IIdmCallback.onResult interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    onAcquireInfo: function (...args) {
      console.warn("IIdmCallback.onAcquireInfo interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
  };
  const ConstraintSourceType = {
    CONSTRAINT_NOT_EXIST: 0,
    CONSTRAINT_TYPE_BASE: 1,
    CONSTRAINT_TYPE_DEVICE_OWNER: 2,
    CONSTRAINT_TYPE_PROFILE_OWNER: 3
  };
  const OsAccountType = {
    ADMIN: 0,
    NORMAL: 1,
    GUEST: 2
  };
  const FingerprintTips = {
    FINGERPRINT_TIP_GOOD: 0,
    FINGERPRINT_TIP_IMAGER_DIRTY: 1,
    FINGERPRINT_TIP_INSUFFICIENT: 2,
    FINGERPRINT_TIP_PARTIAL: 3,
    FINGERPRINT_TIP_TOO_FAST: 4,
    FINGERPRINT_TIP_TOO_SLOW: 5
  };
  const FaceTipsCode = {
    FACE_AUTH_TIP_TOO_BRIGHT: 1,
    FACE_AUTH_TIP_TOO_DARK: 2,
    FACE_AUTH_TIP_TOO_CLOSE: 3,
    FACE_AUTH_TIP_TOO_FAR: 4,
    FACE_AUTH_TIP_TOO_HIGH: 5,
    FACE_AUTH_TIP_TOO_LOW: 6,
    FACE_AUTH_TIP_TOO_RIGHT: 7,
    FACE_AUTH_TIP_TOO_LEFT: 8,
    FACE_AUTH_TIP_TOO_MUCH_MOTION: 9,
    FACE_AUTH_TIP_POOR_GAZE: 10,
    FACE_AUTH_TIP_NOT_DETECTED: 11
  };
  const ResultCode = {
    SUCCESS: 0,
    FAIL: 1,
    GENERAL_ERROR: 2,
    CANCELED: 3,
    TIMEOUT: 4,
    TYPE_NOT_SUPPORT: 5,
    TRUST_LEVEL_NOT_SUPPORT: 6,
    BUSY: 7,
    INVALID_PARAMETERS: 8,
    LOCKED: 9,
    NOT_ENROLLED: 10
  };
  const Module = {
    FACE_AUTH: 1
  };
  const AuthTrustLevel = {
    ATL1: 10000,
    ATL2: 20000,
    ATL3: 30000,
    ATL4: 40000
  };
  const AuthSubType = {
    PIN_SIX: 10000,
    PIN_NUMBER: 10001,
    PIN_MIXED: 10002,
    FACE_2D: 20000,
    FACE_3D: 20001
  };
  const GetPropertyType = {
    AUTH_SUB_TYPE: 1,
    REMAIN_TIMES: 2,
    FREEZING_TIME: 3
  };
  const SetPropertyType = {
    INIT_ALGORITHM: 1
  };
  const AuthType = {
    PIN: 1,
    FACE: 2
  };
  const osAccount = {
    getAccountManager: function (...args) {
      console.warn("osAccount.getAccountManager interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return AccountManagerMock;
    },
    UserAuth: UserAuthClass,
    PINAuth: PINAuthClass,
    UserIdentityManager: UserIdentityManagerClass,
    ConstraintSourceType,
    OsAccountType,
    FingerprintTips,
    FaceTipsCode,
    ResultCode,
    Module,
    AuthTrustLevel,
    AuthSubType,
    GetPropertyType,
    SetPropertyType,
    AuthType,
  }
  return osAccount
}
