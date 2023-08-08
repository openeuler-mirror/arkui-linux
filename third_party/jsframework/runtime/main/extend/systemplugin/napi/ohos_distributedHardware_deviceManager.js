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

export function mockDeviceManager() {
  const DeviceType = {
    UNKNOWN_TYPE: 0,
    SPEAKER: 0x0A,
    PHONE: 0x0E,
    TABLET: 0x11,
    WEARABLE: 0x6D,
    CAR: 0x83,
    TV: 0x9C
  }
  const DeviceStateChangeAction = {
    ONLINE: 0,
    READY: 1,
    OFFLINE: 2,
    CHANGE: 3
  }
  const DiscoverMode = {
    DISCOVER_MODE_PASSIVE: 0x55,
    DISCOVER_MODE_ACTIVE: 0xAA
  }
  const ExchangeMedium = {
    AUTO: 0,
    BLE: 1,
    COAP: 2,
    USB: 3
  }
  const ExchangeFreq = {
    LOW: 0,
    MID: 1,
    HIGH: 2,
    SUPER_HIGH: 3
  }
  const SubscribeCap = {
    SUBSCRIBE_CAPABILITY_DDMP: 0,
    SUBSCRIBE_CAPABILITY_OSD: 1
  }
  const deviceInfoMock = {
    deviceId: "[PC Preview] unknow mDeviceId",
    deviceName: "[PC Preview] unknow mDeviceName",
    deviceType: DeviceType,
    networkId: "[PC Preview] unknow mNetworkId",
    range: "[PC Preview] unknow mRange"
  }
  const deviceStateChangeMock = {
    action: 0,
    device: deviceInfoMock
  }
  const SubscribeInfo = {
    subscribeId: "[PC Preview] unknow mSubscribeId",
    mode: DiscoverMode,
    medium: ExchangeMedium,
    freq: ExchangeFreq,
    isSameAccount: "[PC Preview] unknow mIsSameAccount",
    isWakeRemote: "[PC Preview] unknow mIsWakeRemote",
    capability: SubscribeCap
  }
  const PublishInfo = {
    publishId: "[PC Preview] unknow mPublishId",
    mode: DiscoverMode,
    freq: ExchangeFreq,
    ranging : "[PC Preview] unknow mRanging"
  }
  const AuthParam = {
    authType: "[PC Preview] unknow mAuthType",
    extraInfo: {"key":"unknow any"}
  }
  const AuthInfo = {
    authType: "[PC Preview] unknow mAuthType",
    token: "[PC Preview] unknow mToken",
    extraInfo: {"key":"unknow any"}
  }
  const deviceManagerMock = {
    release: function () {
      console.warn("DeviceManager.release interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    getTrustedDeviceListSync: function () {
      console.warn("DeviceManager.getTrustedDeviceListSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(deviceInfoMock);
      return array;
    },
    getTrustedDeviceList: function (...args) {
      console.warn("DeviceManager.getTrustedDeviceList interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(deviceInfoMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array);
      } else {
        return new Promise((resolve, reject) => {
          resolve(array);
        })
      }
    },
    getLocalDeviceInfoSync: function () {
      console.warn("DeviceManager.getLocalDeviceInfoSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return deviceInfoMock;
    },
    getLocalDeviceInfo: function (...args) {
      console.warn("DeviceManager.getLocalDeviceInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, deviceInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(deviceInfoMock);
        })
      }
    },
    startDeviceDiscovery: function (...args) {
      console.warn("DeviceManager.startDeviceDiscovery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stopDeviceDiscovery: function (...args) {
      console.warn("DeviceManager.stopDeviceDiscovery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    publishDeviceDiscovery: function (...args) {
      console.warn("DeviceManager.publishDeviceDiscovery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    unPublishDeviceDiscovery: function (...args) {
      console.warn("DeviceManager.unPublishDeviceDiscovery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    authenticateDevice: function (...args) {
      console.warn("DeviceManager.authenticateDevice interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, {
          deviceId: "[PC Preview] unknow deviceId",
          pinToken: "[PC Preview] unknow pinToken"
        });
      }
    },
    unAuthenticateDevice: function (...args) {
      console.warn("DeviceManager.unAuthenticateDevice interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    verifyAuthInfo: function (...args) {
      console.warn("DeviceManager.verifyAuthInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, {
          deviceId: "[PC Preview] unknow deviceId",
          level: "[PC Preview] unknow level"
        });
      }
    },
    on: function (...args) {
      console.warn("DeviceManager.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'deviceStateChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, deviceStateChangeMock);
        } else if (args[0] == 'deviceFound') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            subscribeId: "[PC Preview] unknow subscribeId",
            device: deviceInfoMock
          });
        } else if (args[0] == 'discoverFail') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            subscribeId: "[PC Preview] unknow subscribeId",
            reason: "[PC Preview] unknow reason"
          });
        } else if (args[0] == 'publishSuccess') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            publishId: "[PC Preview] unknow publishId",
          });
        } else if (args[0] == 'publishFail') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            publishId: "[PC Preview] unknow publishId",
            reason: "[PC Preview] unknow reason"
          });
        } else {
          args[len - 1].call(this);
        }
      }
    },
    off: function (...args) {
      console.warn("DeviceManager.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    }
  }
  const deviceManager = {
    DeviceType,
    DeviceStateChangeAction,
    DiscoverMode,
    ExchangeMedium,
    ExchangeFreq,
    SubscribeCap,
    SubscribeInfo,
    PublishInfo,
    AuthParam,
    AuthInfo,
    createDeviceManager: function (...args) {
      console.warn("distributedHardware.deviceManager.createDeviceManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, deviceManagerMock)
      }
    }
  }
  return deviceManager
}