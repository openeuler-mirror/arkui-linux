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

export function mockUsb() {
  const USBDevice = {
    busNum: '[PC Preview] unknow busNum',
    devAddress: '[PC Preview] unknow devAddress',
    serial: '[PC Preview] unknow serial',
    name: '[PC Preview] unknow name',
    manufacturerName: '[PC Preview] unknow maunfactureName',
    productName: '[PC Preview] unknow productName',
    version: '[PC Preview] unknow version',
    vendorId: '[PC Preview] unknow vendorId',
    productId: '[PC Preview] unknow productId',
    clazz: '[PC Preview] unknow clazz',
    subClass: '[PC Preview] unknow subClass',
    protocol: '[PC Preview] unknow protocol',
    configs: '[PC Preview] unknow configs',
  };

  const USBConfig = {
    id: '[PC Preview] unknow id',
    attributes: '[PC Preview] unknow attributes',
    maxPower: '[PC Preview] unknow maxPower',
    name: '[PC Preview] unknow name',
    isRemoteWakeup: '[PC Preview] unknow isRemoteWakeup',
    isSelfPowered: '[PC Preview] unknow isSelfPowered',
    interfaces: '[PC Preview] unknow interfaces',
  };

  const USBInterface = {
    id: '[PC Preview] unknow id',
    protocol: '[PC Preview] unknow protocol',
    clazz: '[PC Preview] unknow clazz',
    subClass: '[PC Preview] unknow subClass',
    alternateSetting: '[PC Preview] unknow alternateSetting',
    name: '[PC Preview] unknow name',
    endpoints: '[PC Preview] unknow endpoints',
  };

  const USBEndpoint = {
    address: '[PC Preview] unknow address',
    attributes: '[PC Preview] unknow attributes',
    interval: '[PC Preview] unknow interval',
    maxPacketSize: '[PC Preview] unknow maxPacketSize',
    direction: '[PC Preview] unknow direction',
    number: '[PC Preview] unknow number',
    type: '[PC Preview] unknow type',
    interfaceId: '[PC Preview] unknow interfaceId',
  };

  const USBDevicePipe = {
    busNum: '[PC Preview] unknow busNum',
    devAddress: '[PC Preview] unknow devAddress',
  };

  const PowerRoleType = {
    NONE: '[PC Preview] unknow NONE',
    SOURCE: '[PC Preview] unknow SOURCE',
    SINK: '[PC Preview] unknow SINK',
  };

  const DataRoleType = {
    NONE: '[PC Preview] unknow NONE',
    HOST: '[PC Preview] unknow HOST',
    DEVICE: '[PC Preview] unknow DEVICE',
  };

  const USBPort = {
    id: '[PC Preview] unknow id',
    supportedModes: '[PC Preview] unknow supportedModes',
    status: '[PC Preview] unknow status',
  };

  const PortModeType = {
    NONE: '[PC Preview] unknow NONE',
    UFP: '[PC Preview] unknow UFP',
    DFP: '[PC Preview] unknow DFP',
    DRP: '[PC Preview] unknow DRP',
    NUM_MODES: '[PC Preview] unknow NUM_MODES',
  };

  const USBPortStatus = {
    currentMode: '[PC Preview] unknow currentMode',
    currentPowerRole: '[PC Preview] unknow currentPowerRole',
    currentDataRole: '[PC Preview] unknow currentDataRole',
  };

  const USBControlParams = {
    request: '[PC Preview] unknow request',
    target: '[PC Preview] unknow target',
    reqType: '[PC Preview] unknow reqType',
    direction: '[PC Preview] unknow direction',
    value: '[PC Preview] unknow value',
    index: '[PC Preview] unknow index',
    data: '[PC Preview] unknow data',
  };

  const USBRequestTargetType = {
    USB_REQUEST_TARGET_DEVICE: '[PC Preview] unknow USB_REQUEST_TARGET_DEVICE',
    USB_REQUEST_TARGET_INTERFACE: '[PC Preview] unknow USB_REQUEST_TARGET_INTERFACE',
    USB_REQUEST_TARGET_ENDPOINT: '[PC Preview] unknow USB_REQUEST_TARGET_ENDPOINT',
    USB_REQUEST_TARGET_OTHER: '[PC Preview] unknow USB_REQUEST_TARGET_OTHER',
  };

  const USBControlRequestType = {
    USB_REQUEST_TYPE_STANDARD: '[PC Preview] unknow USB_REQUEST_TYPE_STANDARD',
    USB_REQUEST_TYPE_CLASS: '[PC Preview] unknow USB_REQUEST_TYPE_CLASS',
    USB_REQUEST_TYPE_VENDOR: '[PC Preview] unknow USB_REQUEST_TYPE_VENDOR',
  };

  const USBRequestDirection = {
    USB_REQUEST_DIR_TO_DEVICE: '[PC Preview] unknow USB_REQUEST_DIR_TO_DEVICE',
    USB_REQUEST_DIR_FROM_DEVICE: '[PC Preview] unknow USB_REQUEST_DIR_FROM_DEVICE',
  };

  const FunctionType = {
    NONE: '[PC Preview] unknow NONE',
    ACM: '[PC Preview] unknow ACM',
    ECM: '[PC Preview] unknow ECM',
    HDC: '[PC Preview] unknow HDC',
    MTP: '[PC Preview] unknow MTP',
    PTP: '[PC Preview] unknow PTP',
    RNDIS: '[PC Preview] unknow RNDIS',
    MIDI: '[PC Preview] unknow MIDI',
    AUDIO_SOURCE: '[PC Preview] unknow AUDIO_SOURCE',
    NCM: '[PC Preview] unknow NCM',
  };

  const usb = {
    getVersion: function (...args) {
      console.warn('usb.getVersion interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramStringMock;
    },
    getDevices: function (...args) {
      console.warn('usb.getDevices interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return [USBDevice];
    },
    connectDevice: function (...args) {
      console.warn('usb.connectDevice interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return USBDevicePipe;
    },
    getPorts: function (...args) {
      console.warn('usb.getPorts interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return [USBPort];
    },
    getSupportedModes: function (...args) {
      console.warn('usb.getSupportedModes interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return PortModeType;
    },
    requestRight: function (...args) {
      console.warn('usb.requestRight interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getCurrentFunctions: function (...args) {
      console.warn('usb.getCurrentFunctions interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return FunctionType;
    },
    setCurrentFunctions: function (...args) {
      console.warn('usb.setCurrentFunctions interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    hasRight: function (...args) {
      console.warn('usb.hasRight interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramBooleanMock;
    },
    setPortRoles: function (...args) {
      console.warn('usb.setPortRoles interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getRawDescriptor: function (...args) {
      console.warn('usb.getRawDescriptor interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramArrayMock;
    },
    closePipe: function (...args) {
      console.warn('usb.closePipe interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    claimInterface: function (...args) {
      console.warn('usb.claimInterface interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    releaseInterface: function (...args) {
      console.warn('usb.releaseInterface interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    setInterface: function (...args) {
      console.warn('usb.setInterface interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    getFileDescriptor: function (...args) {
      console.warn('usb.getFileDescriptor interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    usbFunctionsFromString: function (...args) {
      console.warn('usb.usbFunctionsFromString interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    usbFunctionsToString: function (...args) {
      console.warn('usb.usbFunctionsToString interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramStringMock;
    },
    controlTransfer: function (...args) {
      console.warn('usb.controlTransfer interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    setConfiguration: function (...args) {
      console.warn('usb.setConfiguration interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      return paramMock.paramNumberMock;
    },
    bulkTransfer: function (...args) {
      console.warn('usb.bulkTransfer interface mocked in the Previewer. How this interface works on the'
        + ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
  };
  return usb;
}

