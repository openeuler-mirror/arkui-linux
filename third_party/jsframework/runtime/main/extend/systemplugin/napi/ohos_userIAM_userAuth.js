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

export function mockUserAuth() {

  const SUCCESS = 0

  const contextId = 1234

  const IUserAuthCallback = {
    onResult: function (...args) {
      console.warn("uerAuth.onResult interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
    },

    onAcquireInfo: function (...args) {
      console.warn("uerAuth.onAcquireInfo interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
    },
  }
  
  const AuthResult = {
    token : paramMock.paramArrayMock,
    remainTimes : "[PC Preview] unknown remainTimes",
    freezingTime : "[PC Preview] unknown freezingTime",
  }

  const Authenticator = {
    execute: function (...args) {
      console.warn("uerAuth.execute interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length;
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, SUCCESS);
        } else {
          return new Promise((resolve, reject) => {
            resolve(SUCCESS);
          })
        }
    }
  }

  const UserAuthClass = class UserAuth {
    constructor() {
      console.warn("uerAuth.constructor interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      this.getVersion = function (...args) {
        console.warn("uerAuth.getVersion interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        return paramMock.paramNumberMock;
      };

      this.getAvailableStatus = function (...args) {
        console.warn("uerAuth.getAvailableStatus interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        return SUCCESS;
      };

      this.auth = function (...args) {
        console.warn("uerAuth.auth interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        const len = args.length;
        if (len > 0 && typeof args[len - 1] === 'function') {
          args[len - 1].call(this, IUserAuthCallback);
        }
        return contextId;
      };

      this.cancelAuth = function (...args) {
        console.warn("uerAuth.cancelAuth interface mocked in the Previewer." +
          " How this interface works on the Previewer may be different from that on a real device.")
        return SUCCESS;
      };

    }
  }

  const AuthEvent = {
    callback: function (...args) {
      console.warn("uerAuth.callback interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
    }
  }

  const AuthResultInfo = {
    result : "[PC Preview] unknown result",
    token : paramMock.paramArrayMock,
    remainAttempts : "[PC Preview] unknown remainAttempts",
    lockoutDuration : "[PC Preview] unknown lockoutDuration",
  }

  const TipInfo = {
      module : "[PC Preview] unknown module",
      tip : "[PC Preview] unknown tip",
  }

  const AuthInstance = {
    on: function (...args) {
      console.warn("uerAuth.on interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, AuthEvent);
      }
    },
    off: function (...args) {
      console.warn("uerAuth.off interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },
    start: function (...args) {
      console.warn("uerAuth.start interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },
    cancel: function (...args) {
      console.warn("uerAuth.cancel interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },
  }

  const userAuth = {
    AuthenticationResult: {
      NO_SUPPORT : -1,
      SUCCESS : 0,
      COMPARE_FAILURE : 1,
      CANCELED : 2,
      TIMEOUT : 3,
      CAMERA_FAIL : 4,
      BUSY : 5,
      INVALID_PARAMETERS : 6,
      LOCKED : 7,
      NOT_ENROLLED : 8,
      GENERAL_ERROR : 100
    },

    ResultCode : {
      SUCCESS : 0,
      FAIL : 1,
      GENERAL_ERROR : 2,
      CANCELED : 3,
      TIMEOUT : 4,
      TYPE_NOT_SUPPORT : 5,
      TRUST_LEVEL_NOT_SUPPORT : 6,
      BUSY : 7,
      INVALID_PARAMETERS : 8,
      LOCKED : 9,
      NOT_ENROLLED : 10
    },

    FaceTips : {
      FACE_AUTH_TIP_TOO_BRIGHT : 1,
      FACE_AUTH_TIP_TOO_DARK : 2,
      FACE_AUTH_TIP_TOO_CLOSE : 3,
      FACE_AUTH_TIP_TOO_FAR : 4,
      FACE_AUTH_TIP_TOO_HIGH : 5,
      FACE_AUTH_TIP_TOO_LOW : 6,
      FACE_AUTH_TIP_TOO_RIGHT : 7,
      FACE_AUTH_TIP_TOO_LEFT : 8,
      FACE_AUTH_TIP_TOO_MUCH_MOTION : 9,
      FACE_AUTH_TIP_POOR_GAZE : 10,
      FACE_AUTH_TIP_NOT_DETECTED : 11
    },

    FingerprintTips : {
      FINGERPRINT_AUTH_TIP_GOOD : 0,
      FINGERPRINT_AUTH_TIP_DIRTY : 1,
      FINGERPRINT_AUTH_TIP_INSUFFICIENT : 2,
      FINGERPRINT_AUTH_TIP_PARTIAL : 3,
      FINGERPRINT_AUTH_TIP_TOO_FAST : 4,
      FINGERPRINT_AUTH_TIP_TOO_SLOW : 5
    },

    UserAuthType : {
      FACE : 2,
      FINGERPRINT : 4
    },

    AuthTrustLevel : {
      ATL1 : 10000,
      ATL2 : 20000,
      ATL3 : 30000,
      ATL4 : 40000
    },

    getAuthenticator : function (...args) {
      console.warn("uerAuth.getAuthenticator interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return Authenticator;
    },

    getVersion : function (...args) {
      console.warn("uerAuth.getVersion interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
        return paramMock.paramNumberMock;
    },
  
    getAvailableStatus : function (...args) {
      console.warn("uerAuth.getAvailableStatus interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },
  
    getAuthInstance : function (...args) {
      console.warn("uerAuth.getAuthInstance interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return AuthInstance;
    },

    ResultCodeV9 : {
      SUCCESS : 12500000,
      FAIL : 12500001,
      GENERAL_ERROR : 12500002,
      CANCELED : 12500003,
      TIMEOUT : 12500004,
      TYPE_NOT_SUPPORT : 12500005,
      TRUST_LEVEL_NOT_SUPPORT : 12500006,
      BUSY : 12500007,
      INVALID_PARAMETERS : 12500008,
      LOCKED : 12500009,
      NOT_ENROLLED : 12500010
    },
    UserAuth : UserAuthClass
  }
  return userAuth; 
}