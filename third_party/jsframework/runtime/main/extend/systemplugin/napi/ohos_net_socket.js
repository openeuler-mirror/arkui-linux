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
          args[len - 1].call(this, {ArrayBuffer, SocketRemoteInfo});
        } else if (args[0] === 'listening') {
          args[len - 1].call(this);
        } else if (args[0] === 'close') {
          args[len - 1].call(this);
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
          args[len - 1].call(this, {ArrayBuffer, SocketRemoteInfo});
        } else if (args[0] === 'listening') {
          args[len - 1].call(this);
        } else if (args[0] === 'close') {
          args[len - 1].call(this);
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
          args[len - 1].call(this, {ArrayBuffer, SocketRemoteInfo});
        } else if (args[0] === 'connect') {
          args[len - 1].call(this);
        } else if (args[0] === 'close') {
          args[len - 1].call(this);
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
          args[len - 1].call(this, {ArrayBuffer, SocketRemoteInfo});
        } else if (args[0] === 'connect') {
          args[len - 1].call(this);
        } else if (args[0] === 'close') {
          args[len - 1].call(this);
        } else if (args[0] === 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        }
      }
    }
  }

  const UDPSendOptions = {
    data: "[PC Preview] unknow data",
    address: NetAddress
  }

  const ExtraOptionsBase = {
    receiveBufferSize: "[PC Preview] unknow receiveBufferSize",
    sendBufferSize: "[PC Preview] unknow sendBufferSize",
    reuseAddress: "[PC Preview] unknow reuseAddress",
    socketTimeout: "[PC Preview] unknow socketTimeout"
  }

  const UDPExtraOptions = {
    broadcast: "[PC Preview] unknow broadcast"
  }

  const TCPConnectOptions = {
    address: NetAddress,
    timeout: "[PC Preivew] unknow timeout",
  }

  const TCPSendOptions = {
    data: "[PC Preview] unknow data",
    encoding: "[PC Preview] unknow encoding",
  }

  const TCPExtraOptions = {
    keepAlive: "[PC Preview] unknow keepAlive",
    OOBInline: "[PC Preview] unknow OOBInline",
    TCPNoDelay: "[PC Preview] unknow TCPNoDelay",
    socketLinger: {
      on: "[PC Preview] unknow on",
      linger: "[PC Preview] unknow linger"
    }
  }
  const socket = {
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

  return socket;
}
