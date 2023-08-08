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

import { paramMock } from "./utils"

export function mockWebSocket() {
  global.systemplugin.net = {}
  const WebSocketMock = {
    connect: function (...args) {
      console.warn("WebSocket.connect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    send: function (...args) {
      console.warn("WebSocket.send interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    close: function (...args) {
      console.warn("WebSocket.close interface mocked in the Previewer. How this interface works on the Previewer " +
        "may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    on: function (...args) {
      console.warn("WebSocket.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'open') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'message') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else if (args[0] === 'close') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            code: "[PC Preview] unknow code",
            reason: "[PC Preview] unknow reason"
          });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("WebSocket.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'open') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'message') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        } else if (args[0] === 'close') {
          args[len - 1].call(this, paramMock.businessErrorMock, {
            code: "[PC Preview] unknow code",
            reason: "[PC Preview] unknow reason"
          });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    }
  }
  global.systemplugin.net.webSocket = {
    createWebSocket: function () {
      console.warn("net.webSocket.createWebSocket interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebSocketMock;
    }
  }
}

export function mockHttp() {
  const HttpResponseCacheOptions = {
    filePath: "[PC Preview] unknow filePath",
    fileChildPath: "[PC Preview] unknow fileChildPath",
    cacheSize: "[PC Preview] unknow cacheSize"
  }
  const HttpResponseCache = {
    close: function (...args) {
      console.warn("net.HttpResponseCache.close interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    delete: function (...args) {
      console.warn("net.HttpResponseCache.delete interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    flush: function (...args) {
      console.warn("net.HttpResponseCache.flush interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  }
  const HttpResponseMock = {
    result: "[PC Preview] unknow result",
    responseCode: "[PC Preview] unknow responseCode",
    header: "[PC Preview] unknow header"
  }
  const HttpRequestMock = {
    request: function (...args) {
      console.warn("HttpRequest.request interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpResponseMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpResponseMock);
        })
      }
    },
    destroy: function () {
      console.warn("HttpRequest.destroy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("HttpRequest.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      }
    },
    off: function (...args) {
      console.warn("HttpRequest.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      }
    }
  }
  global.systemplugin.net.http = {
    createHttp: function () {
      console.warn("net.http.createHttp interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return HttpRequestMock;
    },
    getInstalledHttpResponseCache: function (...args) {
      console.warn("net.http.getInstalledHttpResponseCache interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpResponseCache);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpResponseCache);
        })
      }
    },
    createHttpResponseCache: function (...args) {
      console.warn("net.http.createHttpResponseCache interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpResponseCacheOptions);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpResponseCache);
        })
      }
    }
  }
}

export function mockMdns() {
  const localServiceInfoMock = {
    serviceType: "[PC Preview] unknow serviceType",
    serviceName: "[PC Preview] unknow serviceName",
    host: "[PC Preview] unknow host",
    port: "[PC Preview] unknow port"
  }
  global.systemplugin.net.mdns = {
    on: function (...args) {
      console.warn("net.mdns.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'serviceAdd') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceRemove') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceStart') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceStop') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceFound') {
          args[len - 1].call(this, localServiceInfoMock);
        } else if (args[0] === 'serviceLost') {
          args[len - 1].call(this, localServiceInfoMock);
        } else if (args[0] === 'serviceResolve') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceLost') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else {
          args[len - 1].call(this);
        }
      }
    },
    off: function (...args) {
      console.warn("net.mdns.off interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'serviceAdd') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceRemove') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceStart') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceStop') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceFound') {
          args[len - 1].call(this, localServiceInfoMock);
        } else if (args[0] === 'serviceLost') {
          args[len - 1].call(this, localServiceInfoMock);
        } else if (args[0] === 'serviceResolve') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'serviceLost') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else if (args[0] === 'error') {
          args[len - 1].call(this, { serviceInfo: localServiceInfoMock, errorCode: 0 });
        } else {
          args[len - 1].call(this);
        }
      }
    },
    addLocalService: function (...args) {
      console.warn("net.mdns.addLocalService interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    removeLocalService: function (...args) {
      console.warn("net.mdns.removeLocalService interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    startSearchingMDNS: function (...args) {
      console.warn("net.mdns.startSearchingMDNS interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    stopSearchingMDNS: function (...args) {
      console.warn("net.mdns.stopSearchingMDNS interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  }
}

export function mockSocket() {
  const SocketStateBase = {
    isBound: "[PC Preview] unknow isBound",
    isClose: "[PC Preview] unknow isClose",
    isConnected: "[PC Preview] unknow isConnected"
  }
  const SocketRemoteInfo = {
    address: "[PC Preview] unknow address",
    family: "[PC Preview] unknow family",
    port: "[PC Preview] unknow port",
    size: "[PC Preview] unknow size"
  }
  const NetAddress = {
    address: "[PC Preview] unknow saddressize",
    family: "[PC Preview] unknow family",
    port: "[PC Preview] unknow port "
  }
  const UDPSocket = {
    bind: function (...args) {
      console.warn("UDPSocket.bind interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    send: function (...args) {
      console.warn("UDPSocket.send interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    close: function (...args) {
      console.warn("UDPSocket.close interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getState: function (...args) {
      console.warn("UDPSocket.getState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SocketStateBase)
      } else {
        return new Promise((resolve, reject) => {
          resolve(SocketStateBase);
        })
      }
    },
    setExtraOptions: function (...args) {
      console.warn("UDPSocket.setExtraOptions interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    on: function (...args) {
      console.warn("UDPSocket.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'message') {
          args[len - 1].call(this, {
            message: "[PC Preview] unknow message",
            remoteInfo: SocketRemoteInfo
          });
        } else if (args[0] === 'listening') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("UDPSocket.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'message') {
          args[len - 1].call(this, {
            message: "[PC Preview] unknow message",
            remoteInfo: SocketRemoteInfo
          });
        } else if (args[0] === 'listening') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    }
  }

  const TCPSocket = {
    bind: function (...args) {
      console.warn("TcpSocket.bind interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    connect: function (...args) {
      console.warn("TcpSocket.connect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    send: function (...args) {
      console.warn("TcpSocket.send interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    close: function (...args) {
      console.warn("TcpSocket.close interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getRemoteAddress: function (...args) {
      console.warn("TcpSocket.getRemoteAddress interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetAddress)
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetAddress);
        })
      }
    },
    getState: function (...args) {
      console.warn("TcpSocket.getState interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SocketStateBase)
      } else {
        return new Promise((resolve, reject) => {
          resolve(SocketStateBase);
        })
      }
    },
    setExtraOptions: function (...args) {
      console.warn("TcpSocket.setExtraOptions interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    on: function (...args) {
      console.warn("TcpSocket.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'message') {
          args[len - 1].call(this, {
            message: "[PC Preview] unknow message",
            remoteInfo: SocketRemoteInfo
          });
        } else if (args[0] === 'listening') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("TcpSocket.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'message') {
          args[len - 1].call(this, {
            message: "[PC Preview] unknow message",
            remoteInfo: SocketRemoteInfo
          });
        } else if (args[0] === 'listening') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    }
  }
  global.systemplugin.net.socket = {
    constructUDPSocketInstance: function () {
      console.warn("net.socket.constructUDPSocketInstance interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return UDPSocket;
    },
    constructTCPSocketInstance: function () {
      console.warn("net.socket.constructTCPSocketInstance interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return TCPSocket;
    }
  }
}

export function mockHotspot() {
  global.systemplugin.net.hotspot = {
    isHotspotSupported: function (...args) {
      console.warn("net.hotspot.isHotspotSupported interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    stopUsbHotspot: function (...args) {
      console.warn("net.hotspot.stopUsbHotspot interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    startUsbHotspot: function (...args) {
      console.warn("net.hotspot.startUsbHotspot interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getRxBytes: function (...args) {
      console.warn("net.hotspot.getRxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getTxBytes: function (...args) {
      console.warn("net.hotspot.getTxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getNetHotspotIfaces: function (...args) {
      console.warn("net.hotspot.getNetHotspotIfaces interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var stringArray = new Array();
      stringArray.push(paramMock.paramStringMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, stringArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(stringArray);
        })
      }
    },
  }
}
export function mockStatistics() {
  global.systemplugin.net.statistics = {
    getIfaceRxBytes: function (...args) {
      console.warn("net.statistics.getIfaceRxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getIfaceTxBytes: function (...args) {
      console.warn("net.statistics.getIfaceTxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getCellularRxBytes: function (...args) {
      console.warn("net.statistics.getCellularRxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getCellularTxBytes: function (...args) {
      console.warn("net.statistics.getCellularTxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getAllTxBytes: function (...args) {
      console.warn("net.statistics.getAllTxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getAllRxBytes: function (...args) {
      console.warn("net.statistics.getAllRxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getUidRxBytes: function (...args) {
      console.warn("net.statistics.getUidRxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getUidTxBytes: function (...args) {
      console.warn("net.statistics.getUidTxBytes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
  }
}

const HttpResponse = {
  result: "[PC Preview] unknow result",
  responseCode: "[PC Preview] unknow responseCode",
  header: "[PC Preview] unknow header",
  cookies: "[PC Preview] unknow cookies"
};
const HttpRequest = {
  request: function () {
    console.warn("HttpRequest.request interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, HttpResponse);
    } else {
      return new Promise((resolve, reject) => {
        resolve(HttpResponse);
      })
    }
  },
  destroy: function () {
    console.warn("HttpRequest.destroy interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  },
  on: function () {
    console.warn("HttpRequest.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function' && args[0] === 'headerReceive') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve(paramMock.paramObjectMock);
      })
    }
  },
  off: function () {
    console.warn("HttpRequest.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function' && args[0] === 'headerReceive') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve(paramMock.paramObjectMock);
      })
    }
  }
};
export function mockConnection() {
  const NetAddress = "[PC Preview] unknow NetAddress"
  const NetHandle = {
    netId: "[PC Preview] unknow netId",
    bindSocket: function () {
      console.warn("NetHandle.bindSocket interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    openConnection: function () {
      console.warn("NetHandle.openConnection interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpRequest);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpRequest);
        })
      }
    },
    getAddressesByName: function () {
      console.warn("NetHandle.getAddressesByName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetAddress);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetAddress);
        })
      }
    },
    getAddressByName: function () {
      console.warn("NetHandle.getAddressByName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetAddress);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetAddress);
        })
      }
    },
  }
  const NetBearType = "[PC Preview] unknow NetBearType"
  const NetCapabilities = {
    bearerTypes: function () {
      console.warn("NetCapabilities.bearerTypes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var netBearTypeArray = new Array();
      netBearTypeArray.push(NetBearType);
      return netBearTypeArray;
    }
  }
  const NetCap = "[PC Preview] unknow NetCap"
  const ConnectionProperties = {
    interfaceName: "[PC Preview] unknow interfaceName",
    isUsePrivateDns: "[PC Preview] unknow isUsePrivateDns",
    privateDnsServerName: "[PC Preview] unknow privateDnsServerName",
    domains: "[PC Preview] unknow domains",
    httpProxy: "[PC Preview] unknow httpProxy",
    linkAddresses: function () {
      console.warn("ConnectionProperties.linkAddresses interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var LinkAddress = new Array();
      LinkAddress.push(NetBearType);
      return LinkAddress;
    },
    dnses: function () {
      console.warn("ConnectionProperties.dnses interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var NetAddress = new Array();
      NetAddress.push(NetBearType);
      return NetAddress;
    },
    routes: function () {
      console.warn("ConnectionProperties.routes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var RouteInfo = new Array();
      RouteInfo.push(NetBearType);
      return RouteInfo;
    },
    mtu: "[PC Preview] unknow mtu"
  }
  const HttpProxy = {
    host: "[PC Preview] unknow host",
    port: "[PC Preview] unknow port",
    parsedExclusionList: "[PC Preview] unknow parsedExclusionList"
  }
  const blocked = "[PC Preview] unknow blocked"
  const BackgroundPolicy = "[PC Preview] unknow BackgroundPolicy"
  global.systemplugin.net.connection = {
    on: function (...args) {
      console.warn("net.connection.on interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'netAvailable') {
          args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
        } else if (args[0] === 'netBlockStatusChange') {
          args[len - 1].call(this, paramMock.businessErrorMock, { NetHandle, blocked });
        } else if (args[0] === 'netCapabilitiesChange') {
          args[len - 1].call(this, { NetHandle, NetCap });
        } else if (args[0] === 'netConnectionPropertiesChange') {
          args[len - 1].call(this, { NetHandle, ConnectionProperties });
        } else if (args[0] === 'netLosing') {
          args[len - 1].call(this, {
            NetHandle,
            maxMsToLive: "[PC Preview] unknow maxMsToLive"
          });
        } else if (args[0] === 'netLost') {
          args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
        } else if (args[0] === 'netUnavailable') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    off: function (...args) {
      console.warn("net.connection.off interface mocked in the Previewer. How this interface works on the Previewer may " +
        "be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'netAvailable') {
          args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
        } else if (args[0] === 'netBlockStatusChange') {
          args[len - 1].call(this, { NetHandle, blocked });
        } else if (args[0] === 'netCapabilitiesChange') {
          args[len - 1].call(this, { NetHandle, NetCap });
        } else if (args[0] === 'netConnectionPropertiesChange') {
          args[len - 1].call(this, { NetHandle, ConnectionProperties });
        } else if (args[0] === 'netLosing') {
          args[len - 1].call(this, {
            NetHandle,
            maxMsToLive: "[PC Preview] unknow maxMsToLive"
          });
        } else if (args[0] === 'netLost') {
          args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
        } else if (args[0] === 'netUnavailable') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    },
    addNetStatusCallback: function (...args) {
      console.warn("net.connection.addNetStatusCallback interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    removeNetStatusCallback: function (...args) {
      console.warn("net.connection.removeNetStatusCallback interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getAppNet: function (...args) {
      console.warn("net.connection.getAppNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetHandle);
        })
      }
    },
    setAppNet: function (...args) {
      console.warn("net.connection.setAppNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getDefaultNet: function (...args) {
      console.warn("net.connection.getDefaultNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetHandle);
        })
      }
    },
    getAllNets: function (...args) {
      console.warn("net.connection.getAllNets interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetHandle);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetHandle);
        })
      }
    },
    getDefaultHttpProxy: function (...args) {
      console.warn("net.connection.getDefaultHttpProxy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpProxy);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpProxy);
        })
      }
    },
    getConnectionProperties: function (...args) {
      console.warn("net.connection.getConnectionProperties interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ConnectionProperties);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ConnectionProperties);
        })
      }
    },
    getNetCapabilities: function (...args) {
      console.warn("net.connection.getNetCapabilities interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetCapabilities);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetCapabilities);
        })
      }
    },
    getBackgroundPolicy: function (...args) {
      console.warn("net.connection.getBackgroundPolicy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BackgroundPolicy);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BackgroundPolicy);
        })
      }
    },
    isDefaultNetMetered: function (...args) {
      console.warn("net.connection.isDefaultNetMetered interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    hasDefaultNet: function (...args) {
      console.warn("net.connection.hasDefaultNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    enableAirplaneMode: function (...args) {
      console.warn("net.connection.enableAirplaneMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    disableAirplaneMode: function (...args) {
      console.warn("net.connection.disableAirplaneMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    enableDistributedCellularData: function (...args) {
      console.warn("net.connection.enableDistributedCellularData interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    disableDistributedCellularData: function (...args) {
      console.warn("net.connection.disableDistributedCellularData interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    reportNetConnected: function (...args) {
      console.warn("net.connection.reportNetConnected interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    reportNetDisconnected: function (...args) {
      console.warn("net.connection.reportNetDisconnected interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
  }
}