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

export function mockOhosBluetooth() {
  const ArrayStringMock = ["[PC preview] unknown array string"]
  const connectedBLEDevicesMock = [
    {
      connectedBLEDevice: "[PC Preview] unknow connectedBLEDevice",
    }
  ]
  const gattServiceMock = {
    serviceUuid: "[PC preview] unknown serviceUuid",
    isPrimary: "[PC preview] unknown isPrimary",
    characteristics: [
      BLECharacteristicMock
    ],
    includeServices: [
      gattServiceMock
    ]
  }
  const BLECharacteristicMock = {
    serviceUuid: "[PC preview] unknown serviceUuid",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    characteristicValue: "[PC preview] unknown characteristicValue",
    descriptors: [
      BLEDescriptorMock
    ]
  }
  const BLEDescriptorMock = {
    serviceUuid: "[PC preview] unknown serviceUuid",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    descriptorUuid: "[PC preview] unknown descriptorUuid",
    descriptorValue: "[PC preview] unknown descriptorValue"
  }
  const gattServicesMock = [
    gattServiceMock
  ]
  const scanResultMock = {
    deviceId: "[PC preview] unknown deviceId",
    rssi: "[PC preview] unknown rssi",
    data: "[PC preview] unknown data"
  }
  const characteristicReadReqMock = {
    deviceId: "[PC preview] unknown deviceId",
    transId: "[PC preview] unknown transId",
    offset: "[PC preview] unknown offset",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    serviceUuid: "[PC preview] unknown serviceUuid"
  }
  const characteristicWriteReqMock = {
    deviceId: "[PC preview] unknown deviceId",
    transId: "[PC preview] unknown transId",
    offset: "[PC preview] unknown offset",
    isPrep: "[PC preview] unknown isPrep",
    needRsp: "[PC preview] unknown needRsp",
    value: "[PC preview] unknown value",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    serviceUuid: "[PC preview] unknown serviceUuid"
  }
  const descriptorReadReqMock = {
    deviceId: "[PC preview] unknown v",
    transId: "[PC preview] unknown transId",
    offset: "[PC preview] unknown offset",
    descriptorUuid: "[PC preview] unknown descriptorUuid",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    serviceUuid: "[PC preview] unknown serviceUuid"
  }
  const descriptorWriteReqMock = {
    deviceId: "[PC preview] unknown deviceId",
    transId: "[PC preview] unknown transId",
    offset: "[PC preview] unknown offset",
    isPrep: "[PC preview] unknown isPrep",
    needRsp: "[PC preview] unknown needRsp",
    value: "[PC preview] unknown value",
    descriptorUuid: "[PC preview] unknown descriptorUuid",
    characteristicUuid: "[PC preview] unknown characteristicUuid",
    serviceUuid: "[PC preview] unknown serviceUuid"
  }
  const BLEConnectChangedStateMock = {
    deviceId: "[PC preview] unknown deviceId",
    state: "[PC preview] unknown state"
  }
  const pinRequiredParamMock = {
    deviceId: "[PC preview] unknown deviceId",
    pinCode: "[PC preview] unknown pinCode"
  }
  const sppReadMock = {
    ArrayBuffer: "[PC preview] unknown ArrayBuffer"
  }
  const GattServerMock = {
    startAdvertising: function (...args) {
      console.warn("GattServer.startAdvertising interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    stopAdvertising: function () {
      console.warn("GattServer.stopAdvertising interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    addService: function (...args) {
      console.warn("GattServer.addService interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    removeService: function (...args) {
      console.warn("GattServer.removeService interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    close: function () {
      console.warn("GattServer.close interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    notifyCharacteristicChanged: function (...args) {
      console.warn("GattServer.notifyCharacteristicChanged interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    sendResponse: function (...args) {
      console.warn("GattServer.sendResponse interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    on: function (...args) {
      console.warn("GattServer.on interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'characteristicRead') {
          args[len - 1].call(this, characteristicReadReqMock);
        } else if (args[0] == 'characteristicWrite') {
          args[len - 1].call(this, characteristicWriteReqMock);
        } else if (args[0] == 'descriptorRead') {
          args[len - 1].call(this, descriptorReadReqMock);
        } else if (args[0] == 'descriptorWrite') {
          args[len - 1].call(this, descriptorWriteReqMock);
        } else if (args[0] == 'connectStateChange') {
          args[len - 1].call(this, BLEConnectChangedStateMock);
        }
      }
    },
    off: function (...args) {
      console.warn("GattServer.off interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'characteristicRead') {
          args[len - 1].call(this, characteristicReadReqMock);
        } else if (args[0] == 'characteristicWrite') {
          args[len - 1].call(this, characteristicWriteReqMock);
        } else if (args[0] == 'descriptorRead') {
          args[len - 1].call(this, descriptorReadReqMock);
        } else if (args[0] == 'descriptorWrite') {
          args[len - 1].call(this, descriptorWriteReqMock);
        } else if (args[0] == 'connectStateChange') {
          args[len - 1].call(this, BLEConnectChangedStateMock);
        }
      }
    },
  }
  const GattClientDeviceMock = {
    connect: function () {
      console.warn("GattClientDevice.connect interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    disconnect: function () {
      console.warn("GattClientDevice.disconnect interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    close: function () {
      console.warn("GattClientDevice.close interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    getDeviceName: function (...args) {
      console.warn("GattClientDevice.getDeviceName interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getServices: function (...args) {
      console.warn("GattClientDevice.getServices interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, gattServicesMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(gattServicesMock);
        })
      }
    },
    readCharacteristicValue: function (...args) {
      console.warn("GattClientDevice.readCharacteristicValue interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BLECharacteristicMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BLECharacteristicMock);
        })
      }
    },
    readDescriptorValue: function (...args) {
      console.warn("GattClientDevice.readDescriptorValue interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BLEDescriptorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BLEDescriptorMock);
        })
      }
    },
    writeCharacteristicValue: function (...args) {
      console.warn("GattClientDevice.writeCharacteristicValue interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    writeDescriptorValue: function (...args) {
      console.warn("GattClientDevice.writeDescriptorValue interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    getRssiValue: function (...args) {
      console.warn("GattClientDevice.getRssiValue interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    setBLEMtuSize: function (...args) {
      console.warn("GattClientDevice.setBLEMtuSize interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    setNotifyCharacteristicChanged: function (...args) {
      console.warn("GattClientDevice.setNotifyCharacteristicChanged interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    on: function (...args) {
      console.warn("GattClientDevice.on interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'BLECharacteristicChange') {
          args[len - 1].call(this, BLECharacteristicMock);
        } else if (args[0] == 'BLEConnectionStateChange') {
          args[len - 1].call(this, BLEConnectChangedStateMock);
        }
      }
    },
    off: function (...args) {
      console.warn("GattClientDevice.off interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'BLECharacteristicChange') {
          args[len - 1].call(this, BLECharacteristicMock);
        } else if (args[0] == 'BLEConnectionStateChange') {
          args[len - 1].call(this, BLEConnectChangedStateMock);
        }
      }
    },
  }
  global.ohosplugin.bluetooth = {
    getState: function () {
      console.warn("bluetooth.getState interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getBtConnectionState: function () {
      console.warn("bluetooth.getBtConnectionState interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    pairDevice: function (...args) {
      console.warn("bluetooth.pairDevice interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    enableBluetooth: function () {
      console.warn("bluetooth.enableBluetooth interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    disableBluetooth: function () {
      console.warn("bluetooth.disableBluetooth interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getLocalName: function () {
      console.warn("bluetooth.getLocalName interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getPairedDevices: function () {
      console.warn("bluetooth.getPairedDevices interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return ArrayStringMock;
    },
    setDevicePairingConfirmation: function (...args) {
      console.warn("bluetooth.setDevicePairingConfirmation interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    setLocalName: function (...args) {
      console.warn("bluetooth.setLocalName interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    setBluetoothScanMode: function (...args) {
      console.warn("bluetooth.setBluetoothScanMode interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getBluetoothScanMode: function () {
      console.warn("bluetooth.getBluetoothScanMode interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    startBluetoothDiscovery: function () {
      console.warn("bluetooth.startBluetoothDiscovery interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    stopBluetoothDiscovery: function () {
      console.warn("bluetooth.stopBluetoothDiscovery interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    on: function (...args) {
      console.warn("bluetooth.on interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'bluetoothDeviceFind') {
          args[len - 1].call(this, ArrayStringMock);
        } else if (args[0] == 'bondStateChange') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else if (args[0] == 'pinRequired') {
          args[len - 1].call(this, pinRequiredParamMock);
        } else if (args[0] == 'stateChange') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else if (args[0] == 'sppRead') {
          args[len - 1].call(this, sppReadMock.ArrayBuffer);
        }
      }
    },
    off: function (...args) {
      console.warn("bluetooth.off interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'bluetoothDeviceFind') {
          args[len - 1].call(this, ArrayStringMock);
        } else if (args[0] == 'bondStateChange') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else if (args[0] == 'pinRequired') {
          args[len - 1].call(this, pinRequiredParamMock);
        } else if (args[0] == 'stateChange') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else if (args[0] == 'sppRead') {
          args[len - 1].call(this, sppReadMock.ArrayBuffer);
        }
      }
    },
    sppListen: function (...args) {
      console.warn("bluetooth.sppListen interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      }
    },
    sppAccept: function (...args) {
      console.warn("bluetooth.sppAccept interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      }
    },
    sppConnect: function (...args) {
      console.warn("bluetooth.sppConnect interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      }
    },
    sppCloseServerSocket: function (...args) {
      console.warn("bluetooth.sppCloseServerSocket interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    sppCloseClientSocket: function (...args) {
      console.warn("bluetooth.sppCloseClientSocket interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    sppWrite: function (...args) {
      console.warn("bluetooth.sppWrite interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    ScanDuty: {
      SCAN_MODE_LOW_POWER: 0,
      SCAN_MODE_BALANCED: 1,
      SCAN_MODE_LOW_LATENCY: 2
    },
    MatchMode: {
      MATCH_MODE_AGGRESSIVE: 1,
      MATCH_MODE_STICKY: 2
    },
    ScanMode: {
      SCAN_MODE_NONE: 0,
      SCAN_MODE_CONNECTABLE: 1,
      SCAN_MODE_GENERAL_DISCOVERABLE: 2,
      SCAN_MODE_LIMITED_DISCOVERABLE: 3,
      SCAN_MODE_CONNECTABLE_GENERAL_DISCOVERABLE: 4,
      SCAN_MODE_CONNECTABLE_LIMITED_DISCOVERABLE: 5
    },
    SppType: {
      SPP_RFCOMM: 0
    }
  }
  global.ohosplugin.bluetooth.BLE = {
    createGattServer: function () {
      console.warn("bluetooth.BLE.createGattServer interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return GattServerMock
    },
    createGattClientDevice: function (...args) {
      console.warn("bluetooth.BLE.createGattClientDevice interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return GattClientDeviceMock
    },
    getConnectedBLEDevices: function () {
      console.warn("bluetooth.BLE.getConnectedBLEDevices interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      return connectedBLEDevicesMock
    },
    startBLEScan: function (...args) {
      console.warn("bluetooth.BLE.startBLEScan interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    stopBLEScan: function () {
      console.warn("bluetooth.BLE.stopBLEScan interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("bluetooth.BLE.on interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'BLEDeviceFind') {
          args[len - 1].call(this, [scanResultMock]);
        }
      }
    },
    off: function (...args) {
      console.warn("bluetooth.BLE.off interface mocked in the Previewer." +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'BLEDeviceFind') {
          args[len - 1].call(this, [scanResultMock]);
        }
      }
    },
  }
}