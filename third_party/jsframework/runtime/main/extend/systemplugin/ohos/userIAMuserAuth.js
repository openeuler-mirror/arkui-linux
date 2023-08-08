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

export function mockUserIAMUserAuth() {
  const AuthenticationResult = {
    NO_SUPPORT: -1,
    SUCCESS: 0,
    COMPARE_FAILURE: 1,
    CANCELED: 2,
    TIMEOUT: 3,
    CAMERA_FAIL: 4,
    BUSY: 5,
    INVALID_PARAMETERS: 6,
    LOCKED: 7,
    NOT_ENROLLED: 8,
    GENERAL_ERROR: 100,
  }

  const CheckAvailabilityResult = {
    SUPPORTED: 0,
    AUTH_TYPE_NOT_SUPPORT: 1,
    SECURE_LEVEL_NOT_SUPPORT: 2,
    DISTRIBUTED_AUTH_NOT_SUPPORT: 3,
    NOT_ENROLLED: 4,
    PARAM_NUM_ERROR: 5,
  }

  const TipEvent = {
    RESULT: 1,
    CANCEL: 2,
    ACQUIRE: 3,
    BUSY: 4,
    OUT_OF_MEM: 5,
    FACE_ID: 6,
  }

  const TipCode = {
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
    FACE_AUTH_TIP_NOT_DETECTED: 11,
  }

  const Result = {
    SUCCESS: 0,
    FAILED: 1,
  }

  function checkAuthParam(authType, secureLevel) {
    if ((typeof authType !== 'string') || (["ALL", "FACE_ONLY"].indexOf(authType) < 0)) {
      console.error('invalid authType');
      return CheckAvailabilityResult.AUTH_TYPE_NOT_SUPPORT;
    }

    if ((typeof secureLevel !== 'string') || (["S1", "S2", "S3", "S4"].indexOf(secureLevel) < 0)) {
      console.error('invalid secureLevel');
      return CheckAvailabilityResult.SECURE_LEVEL_NOT_SUPPORT;
    }

    return Result.SUCCESS;
  }

  let Authenticator = class {
    constructor() {
    }

    async execute(authType, secureLevel, callback) {
      console.warn("Authenticator.execute interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      function handleCallback(callback, ret) {
        if (typeof callback === 'function') {
          callback(ret);
        } else {
          if (ret === 0) {
            return ret;
          } else {
            throw ret;
          }
        }
      }

      if (checkAuthParam(authType, secureLevel) != Result.SUCCESS) {
        return handleCallback(callback, AuthenticationResult.INVALID_PARAMETERS);
      }

      let successTip = {
        "errorCode": Result.FAILED,
        "tipEvent": TipEvent.RESULT,
        "tipCode": AuthenticationResult.SUCCESS,
        "tipInfo": "success",
      };

      for (let localCallback of userAuth.subscribeTipSet.values()) {
        localCallback(successTip);
      }

      // mock
      return handleCallback(callback, AuthenticationResult.SUCCESS);
    }

    checkAvailability(authType, secureLevel) {
      console.warn("Authenticator.checkAvailability interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      let result = checkAuthParam(authType, secureLevel);
      if (result != Result.SUCCESS) {
        return result;
      }

      // mock
      return CheckAvailabilityResult.SUPPORTED;
    }

    cancel() {
      console.warn("Authenticator.cancel interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")

      // mock
      return Result.SUCCESS;
    }

    async on(type, callback) {
      console.warn("Authenticator.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      let errorTip = {
        "errorCode": Result.FAILED,
        "tipEvent": 0,
        "tipCode": 0,
        "tipInfo": "",
      };

      if (type !== 'tip') {
        console.error('type is invalid')
        callback(errorTip);
        return;
      }

      if (typeof callback !== 'function') {
        console.error('callback parameter is invalid');
        callback(errorTip);
        return;
      }

      userAuth.subscribeTipSet.add(callback);
      if (userAuth.subscribeToTip) {
        console.log('already subscribe to event');
        return;
      }

      // mock
      userAuth.subscribeToTip = true;
      console.info('subscribe success');
    }

    async off(type, optCallback) {
      console.warn("Authenticator.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (type !== 'tip') {
        console.error('type is invalid')
        return;
      }

      if (typeof optCallback === 'function') {
        userAuth.subscribeTipSet.delete(optCallback);
      } else {
        userAuth.subscribeTipSet.clear();
      }

      if (!userAuth.subscribeToTip) {
        console.info('not subscribing event, no need unsubscribe');
        return;
      }

      if (userAuth.subscribeTipSet.size !== 0) {
        console.info('subscriber is not 0, no need unsubscribe');
        return;
      }

      // mock
      userAuth.subscribeToTip = false;
      console.info('unsubscribe success');
    }
  }

  var userAuth = {
    moduleGroup: null,
    eventGroup: null,
    authenticator: null,
    subscribeToTip: false,
    subscribeTipSet: new Set([]),
    getAuthenticator: function getAuthenticator() {
      console.warn("userAuth.getAuthenticator interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      if (this.authenticator == null) {
        this.authenticator = new Authenticator()
      }
      return this.authenticator;
    }
  }

  global.systemplugin.userIAM = global.systemplugin.userIAM || {};
  global.systemplugin.userIAM.userAuth = {
    getAuthenticator: userAuth.getAuthenticator,
    AuthenticationResult: AuthenticationResult,
    CheckAvailabilityResult: CheckAvailabilityResult,
    TipEvent: TipEvent,
    TipCode: TipCode,
    Result: Result,
  };
}