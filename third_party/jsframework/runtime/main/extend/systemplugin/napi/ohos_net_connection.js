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

export const NetCap = {
  NET_CAPABILITY_MMS: 0,
  NET_CAPABILITY_NOT_METERED: 11,
  NET_CAPABILITY_INTERNET: 12,
  NET_CAPABILITY_NOT_VPN: 15,
  NET_CAPABILITY_VALIDATED: 16
};

export const NetBearType = {
  BEARER_CELLULAR: 0,
  BEARER_WIFI: 1,
  BEARER_ETHERNET: 3
};

export function mockConnection() {
  const NetSpecifier = {
    netCapabilities: NetCapabilities,
    bearerPrivateIdentifier: '[PC preview] unknow bearerPrivateIdentifier'
  }

  const NetCapabilities = {
    linkUpBandwidthKbps: '[PC preview] unknow linkUpBandwidthKbps',
    linkDownBandwidthKbps: '[PC preview] unknow linkDownBandwidthKbps',
    networkCap:[NetCap],
    bearerTypes:[NetBearType]
  }

  const ConnectionProperties = {
    interfaceName: '[PC preview] unknow interfaceName',
    domains: '[PC preview] unknow domains',
    linkAddresses: [LinkAddress],
    dnses: [NetAddress],
    routes: [RouteInfo],
    mtu: '[PC preview] unknow mtu'
  }

  const LinkAddress = {
    address: NetAddress,
    prefixLength: '[PC preview] unknow prefixLength'
  }

  const NetAddress = {
    address: '[PC preview] unknow address',
    family: '[PC preview] unknow family',
    port: '[PC preview] unknow port'
  }

  const RouteInfo = {
    interface: '[PC preview] unknow interface',
    destination: LinkAddress,
    gateway: NetAddress,
    hasGateway: '[PC preview] unknow hasGateway',
    isDefaultRoute: '[PC preview] unknow isDefaultRoute'
  }

  const NetConnection = {
    on: function (...args) {
      console.warn("NetConnection.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'netAvailable') {
          args[len - 1].call(this, NetHandle);
        } else if (args[0] === 'netBlockStatusChange') {
          var array = new Array(NetHandle, paramMock.paramBooleanMock);
          args[len - 1].call(this, array);
        } else if (args[0] === 'netCapabilitiesChange') {
          var array = new Array(NetHandle, NetCapabilities);
          args[len - 1].call(this, array);
        } else if (args[0] === 'netConnectionPropertiesChange') {
          var array = new Array(NetHandle, ConnectionProperties);
          args[len - 1].call(this, array);
        } else if (args[0] === 'netLost') {
          args[len - 1].call(this, NetHandle);
        } else if (args[0] === 'netUnavailable') {
          args[len - 1].call(this);
        }
      }
    },

    register: function (...args) {
      console.warn("NetConnection.register interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      }
    },

    unregister: function (...args) {
      console.warn("NetConnection.unregister interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      }
    }
  }

  const NetHandle = {
    netId: '[PC preview] unknow netId',

    getAddressesByName: function (...args) {
      console.warn("NetHandle.getAddressesByName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NetAddress])
      } else {
        return new Promise((resolve, reject) => {
          resolve([NetAddress])
        })
      }
    },

    getAddressByName: function (...args) {
      console.warn("NetHandle.getAddressByName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetAddress)
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetAddress)
        })
      }
    }
  }

  const connection = {
    NetCap,
    NetBearType,
    createNetConnection: function () {
      console.warn("connection.createNetConnection interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return NetConnection;
    },

    getDefaultNet: function (...args) {
      console.warn("connection.getDefaultNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetHandle)
      } else {
        return new Promise((resolve) => {
          resolve(NetHandle)
        })
      }
    },

    getAllNets: function (...args) {
      console.warn("connection.getAllNets interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NetHandle])
      } else {
        return new Promise((resolve) => {
          resolve([NetHandle])
        })
      }
    },

    getConnectionProperties: function (...args) {
      console.warn("connection.getConnectionProperties interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ConnectionProperties)
      } else {
        return new Promise((resolve) => {
          resolve(ConnectionProperties)
        })
      }
    },

    getNetCapabilities: function (...args) {
      console.warn("connection.getNetCapabilities interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetCapabilities)
      } else {
        return new Promise((resolve) => {
          resolve(NetCapabilities)
        })
      }
    },

    hasDefaultNet: function (...args) {
      console.warn("connection.hasDefaultNet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },

    enableAirplaneMode: function (...args) {
      console.warn("connection.enableAirplaneMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    disableAirplaneMode: function (...args) {
      console.warn("connection.disableAirplaneMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    reportNetConnected: function (...args) {
      console.warn("connection.reportNetConnected interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    reportNetDisconnected: function (...args) {
      console.warn("connection.reportNetDisconnected interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    getAddressesByName: function (...args) {
      console.warn("connection.getAddressesByName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [NetAddress])
      } else {
        return new Promise((resolve) => {
          resolve([NetAddress])
        })
      }
    },
  };

  return connection;
}