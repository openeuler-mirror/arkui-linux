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
import { RemoteObjectClass } from "./ohos_rpc"

export function mockAppAccount() {
  const AppAccountInfoMock = {
    owner: "[PC Preview] unknown owner",
    name: "[PC Preview] unknown name"
  };
  const OAuthTokenInfoMock = {
    authType: "[PC preview] unknown authType",
    token: "[PC preview] unknown token",
    account: AppAccountInfoMock,
  };
  const AuthenticatorInfoMock = {
    owner: "[PC preview] unknown owner",
    iconId: "[PC preview] unknown iconId",
    labelId: "[PC preview] unknown labelId",
  };
  const appAccountInfoArrayMock = new Array();
  appAccountInfoArrayMock.push(AppAccountInfoMock);
  const SelectAccountsOptions = {
    allowedAccounts: appAccountInfoArrayMock,
    allowedOwners: [paramMock.paramString],
    requiredLabels: [paramMock.paramString],
  }
  const VerifyCredentialOptions  = {
    credentialType: paramMock.paramStringMock,
    credential: paramMock.paramStringMock,
    parameters:{"unknown key":paramMock.paramObjectMock},
  }
  const SetPropertiesOptions  = {
    properties: {"unknown key":paramMock.paramObjectMock},
    parameters: {"unknown key":paramMock.paramObjectMock},
  }
  const appAccountManagerMock = {
    addAccount: function (...args) {
      console.warn("AppAccountManager.addAccount interface mocked in the Previewer. " +
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
    addAccountImplicitly: function (...args) {
      console.warn("AppAccountManager.addAccountImplicitly interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
      }
    },
    deleteAccount: function (...args) {
      console.warn("AppAccountManager.deleteAccount interface mocked in the Previewer. " +
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
    disableAppAccess: function (...args) {
      console.warn("AppAccountManager.disableAppAccess interface mocked in the Previewer. " +
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
    enableAppAccess: function (...args) {
      console.warn("AppAccountManager.enableAppAccess interface mocked in the Previewer. " +
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
    checkAppAccess: function (...args) {
      console.warn("AppAccountManager.checkAppAccess interface mocked in the Previewer. " +
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
    checkAppAccountSyncEnable: function (...args) {
      console.warn("AppAccountManager.checkAppAccountSyncEnable interface mocked in the Previewer. " +
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
    setAccountCredential: function (...args) {
      console.warn("AppAccountManager.setAccountCredential interface mocked in the Previewer. " +
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
    setAccountExtraInfo: function (...args) {
      console.warn("AppAccountManager.setAccountExtraInfo interface mocked in the Previewer. " +
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
    setAppAccountSyncEnable: function (...args) {
      console.warn("AppAccountManager.setAppAccountSyncEnable interface mocked in the Previewer. " +
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
    setAssociatedData: function (...args) {
      console.warn("AppAccountManager.setAssociatedData interface mocked in the Previewer. " +
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
    getAllAccessibleAccounts: function (...args) {
      console.warn("AppAccountManager.getAllAccessibleAccounts interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var appAccountInfoArrayMock = new Array();
      appAccountInfoArrayMock.push(AppAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, appAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(appAccountInfoArrayMock);
        })
      }
    },
    getAllAccounts: function (...args) {
      console.warn("AppAccountManager.getAllAccounts interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var appAccountInfoArrayMock = new Array();
      appAccountInfoArrayMock.push(AppAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, appAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(appAccountInfoArrayMock);
        })
      }
    },
    getAccountCredential: function (...args) {
      console.warn("AppAccountManager.getAccountCredential interface mocked in the Previewer. " +
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
    getAccountExtraInfo: function (...args) {
      console.warn("AppAccountManager.getAccountExtraInfo interface mocked in the Previewer. " +
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
    getAssociatedData: function (...args) {
      console.warn("AppAccountManager.getAssociatedData interface mocked in the Previewer. " +
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
    getAssociatedDataSync: function (...args) {
      console.warn("AppAccountManager.getAssociatedDataSync interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    on: function (...args) {
      console.warn("AppAccountManager.on interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var appAccountInfoArrayMock = new Array();
      appAccountInfoArrayMock.push(AppAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, appAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(appAccountInfoArrayMock);
        })
      }
    },
    off: function (...args) {
      console.warn("AppAccountManager.off interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var appAccountInfoArrayMock = new Array();
      appAccountInfoArrayMock.push(AppAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, appAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(appAccountInfoArrayMock);
        })
      }
    },
    authenticate: function (...args) {
      console.warn("AppAccountManager.authenticate interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
      }
    },
    getOAuthToken: function (...args) {
      console.warn("AppAccountManager.getOAuthToken interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    setOAuthToken: function (...args) {
      console.warn("AppAccountManager.setOAuthToken interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    deleteOAuthToken: function (...args) {
      console.warn("AppAccountManager.deleteOAuthToken interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    setOAuthTokenVisibility: function (...args) {
      console.warn("AppAccountManager.setOAuthTokenVisibility interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    checkOAuthTokenVisibility: function (...args) {
      console.warn("AppAccountManager.checkOAuthTokenVisibility interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    getAllOAuthTokens: function (...args) {
      console.warn("AppAccountManager.getAllOAuthTokens interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new Array(OAuthTokenInfoMock));
      } else {
        return new Promise((resolve, reject) => {
          resolve(new Array(OAuthTokenInfoMock))
        })
      }
    },
    getOAuthList: function (...args) {
      console.warn("AppAccountManager.getOAuthList interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new Array(paramMock.paramStringMock));
      } else {
        return new Promise((resolve, reject) => {
          resolve(new Array(paramMock.paramStringMock))
        })
      }
    },
    getAuthenticatorCallback: function (...args) {
      console.warn("AppAccountManager.getAuthenticatorCallback interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AuthenticatorCallbackMock)
        })
      }
    },
    getAuthenticatorInfo: function (...args) {
      console.warn("AppAccountManager.getAuthenticatorInfo interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AuthenticatorInfoMock)
        })
      }
    },
    checkAccountLabels: function (...args) {
      console.warn("AppAccountManager.checkAccountLabels interface mocked in the Previewer. " +
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
    deleteAccountCredential: function (...args) {
      console.warn("AppAccountManager.deleteAccountCredential interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    selectAccountsByOptions: function (...args) {
      console.warn("AppAccountManager.selectAccountsByOptions interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      var appAccountInfoArrayMock = new Array();
      appAccountInfoArrayMock.push(AppAccountInfoMock);
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, appAccountInfoArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(appAccountInfoArrayMock);
        })
      }
    },
    verifyCredential: function (...args) {
      console.warn("AppAccountManager.verifyCredential interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
      }
    },
    setAuthenticatorProperties: function (...args) {
      console.warn("AppAccountManager.setAuthenticatorProperties interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
      }
    }
  };
  const AuthenticatorCallbackMock = {
    onResult: function (...args) {
      console.warn("AuthenticatorCallback.onResult interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    onRequestRedirected: function (...args) {
      console.warn("AuthenticatorCallback.onRequestRedirected interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    onRequestContinued: function (...args) {
      console.warn("AuthenticatorCallback.onRequestContinued interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
  };
  const AuthenticatorClass = class Authenticator {
    constructor() {
      console.warn("appAccount.Authenticator constructor interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      this.addAccountImplicitly = function (...args) {
        console.warn("Authenticator.addAccountImplicitly interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.authenticate = function (...args) {
        console.warn("Authenticator.authenticate interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.verifyCredential = function (...args) {
        console.warn("Authenticator.verifyCredential interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.setProperties = function (...args) {
        console.warn("Authenticator.setProperties interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.checkAccountLabels = function (...args) {
        console.warn("Authenticator.checkAccountLabels interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.isAccountRemovable = function (...args) {
        console.warn("Authenticator.isAccountRemovable interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AuthenticatorCallbackMock);
        }
      };
      this.getRemoteObject = function (...args) {
        console.warn("Authenticator.getRemoteObject interface mocked in the Previewer. " +
          "How this interface works on the Previewer may be different from that on a real device.")
          return new RemoteObjectClass;
      };
    }
  };
  const ConstantsMock = {
    ACTION_ADD_ACCOUNT_IMPLICITLY: "addAccountImplicitly",
    ACTION_AUTHENTICATE: "authenticate",
    KEY_NAME: "name",
    KEY_OWNER: "owner",
    KEY_TOKEN: "token",
    KEY_ACTION: "action",
    KEY_AUTH_TYPE: "authType",
    KEY_SESSION_ID: "sessionId",
    KEY_CALLER_PID: "callerPid",
    KEY_CALLER_UID: "callerUid",
    KEY_CALLER_BUNDLE_NAME: "callerBundleName",
    KEY_REQUIRED_LABELS: "requiredLabels",
    KEY_BOOLEAN_RESULT: "booleanResult"
  };
  const ResultCodeMock = {
    SUCCESS: 0,
    ERROR_ACCOUNT_NOT_EXIST: 10001,
    ERROR_APP_ACCOUNT_SERVICE_EXCEPTION: 10002,
    ERROR_INVALID_PASSWORD: 10003,
    ERROR_INVALID_REQUEST: 10004,
    ERROR_INVALID_RESPONSE: 10005,
    ERROR_NETWORK_EXCEPTION: 10006,
    ERROR_OAUTH_AUTHENTICATOR_NOT_EXIST: 10007,
    ERROR_OAUTH_CANCELED: 10008,
    ERROR_OAUTH_LIST_TOO_LARGE: 10009,
    ERROR_OAUTH_SERVICE_BUSY: 10010,
    ERROR_OAUTH_SERVICE_EXCEPTION: 10011,
    ERROR_OAUTH_SESSION_NOT_EXIST: 10012,
    ERROR_OAUTH_TIMEOUT: 10013,
    ERROR_OAUTH_TOKEN_NOT_EXIST: 10014,
    ERROR_OAUTH_TOKEN_TOO_MANY: 10015,
    ERROR_OAUTH_UNSUPPORT_ACTION: 10016,
    ERROR_OAUTH_UNSUPPORT_AUTH_TYPE: 10017,
    ERROR_PERMISSION_DENIED: 10018
  };
  const appAccount = {
    createAppAccountManager: function (...args) {
      console.warn("appAccount.createAppAccountManager interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return appAccountManagerMock;
    },
    AuthenticatorCallback: AuthenticatorCallbackMock,
    Authenticator: AuthenticatorClass,
    Constants: ConstantsMock,
    ResultCode: ResultCodeMock,
  }
  return appAccount
}