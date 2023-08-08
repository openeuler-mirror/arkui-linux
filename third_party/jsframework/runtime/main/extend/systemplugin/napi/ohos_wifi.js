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

export function mockWifi() {
  const EapMethod = {
    EAP_NONE : 0,
    EAP_PEAP : 1,
    EAP_TLS : 2,
    EAP_TTLS : 3,
    EAP_PWD : 4,
    EAP_SIM : 5,
    EAP_AKA : 6,
    EAP_AKA_PRIME : 7,
    EAP_UNAUTH_TLS : 8,
  }

  const Phase2Method = {
    PHASE2_NONE : 0,
    PHASE2_PAP : 1,
    PHASE2_MSCHAP : 2,
    PHASE2_MSCHAPV2 : 3,
    PHASE2_GTC : 4,
    PHASE2_SIM : 5,
    PHASE2_AKA : 6,
    PHASE2_AKA_PRIME : 7,
  }

  const WifiSecurityType = {
    WIFI_SEC_TYPE_INVALID : 0,
    WIFI_SEC_TYPE_OPEN : 1,
    WIFI_SEC_TYPE_WEP : 2,
    WIFI_SEC_TYPE_PSK : 3,
    WIFI_SEC_TYPE_SAE : 4,
    WIFI_SEC_TYPE_EAP : 5,
    WIFI_SEC_TYPE_EAP_SUITE_B : 6,
    WIFI_SEC_TYPE_OWE : 7,
    WIFI_SEC_TYPE_WAPI_CERT : 8,
    WIFI_SEC_TYPE_WAPI_PSK : 9,
  }

  const IpType = {
    STATIC : 0,
    DHCP : 1,
    UNKNOWN : 2,
  }

  const SuppState = {
    DISCONNECTED : 0,
    INTERFACE_DISABLED : 1,
    INACTIVE : 2,
    SCANNING : 3,
    AUTHENTICATING : 4,
    ASSOCIATING : 5,
    ASSOCIATED : 6,
    FOUR_WAY_HANDSHAKE : 7,
    GROUP_HANDSHAKE : 8,
    COMPLETED : 9,
    UNINITIALIZED : 10,
    INVALID : 11,
  }

  const ConnState = {
    SCANNING : 0,
    CONNECTING : 1,
    AUTHENTICATING : 2,
    OBTAINING_IPADDR : 3,
    CONNECTED : 4,
    DISCONNECTING : 5,
    DISCONNECTED : 6,
    UNKNOWN : 7,
  }

  const P2pConnectState = {
    DISCONNECTED : 0,
    CONNECTED : 1,
  }

  const P2pDeviceStatus = {
    CONNECTED : 0,
    INVITED : 1,
    FAILED : 2,
    AVAILABLE : 3,
    UNAVAILABLE : 4,
  }

  const WifiLinkedInfo = {
    ssid: '[PC preview] unknow ssid',
    bssid: '[PC preview] unknow bssid',
    networkId: '[PC preview] unknow networkId',
    rssi: '[PC preview] unknow rssi',
    band: '[PC preview] unknow band',
    linkSpeed: '[PC preview] unknow linkSpeed',
    frequency: '[PC preview] unknow frequency',
    isHidden: '[PC preview] unknow isHidden',
    isRestricted: '[PC preview] unknow isRestricted',
    chload: '[PC preview] unknow chload',
    snr: '[PC preview] unknow snr',
    macType: '[PC preview] unknow macType',
    macAddress: '[PC preview] unknow macAddress',
    ipAddress: '[PC preview] unknow ipAddress',
    suppState: SuppState.INVALID,
    connState: ConnState.DISCONNECTED,
  }

  const IpInfo = {
    ipAddress: '[PC preview] unknow ipAddress',
    gateway: '[PC preview] unknow gateway',
    netmask: '[PC preview] unknow netmask',
    primaryDns: '[PC preview] unknow primaryDns',
    secondDns: '[PC preview] unknow secondDns',
    serverIp: '[PC preview] unknow serverIp',
    leaseDuration: '[PC preview] unknow leaseDuration',
  }

  const WifiInfoElem = {
    eid: '[PC preview] unknow eid',
    content: '[PC preview] unknow content',
  }

  const WifiScanInfo = {
    ssid: '[PC preview] unknow ssid',
    bssid: '[PC preview] unknow bssid',
    capabilities: '[PC preview] unknow capabilities',
    securityType: WifiSecurityType.WIFI_SEC_TYPE_OPEN,
    rssi: '[PC preview] unknow rssi',
    band: '[PC preview] unknow band',
    frequency: '[PC preview] unknow frequency',
    channelWidth: '[PC preview] unknow channelWidth',
    centerFrequency0: '[PC preview] unknow centerFrequency0',
    centerFrequency1: '[PC preview] unknow centerFrequency1',
    infoElems: [WifiInfoElem],
    timestamp: '[PC preview] unknow timestamp',
  }

  const IpConfig = {
    ipAddress: '[PC preview] unknow ipAddress',
    gateway: '[PC preview] unknow gateway',
    dnsServers: [paramMock.paramNumberMock],
    domains: [paramMock.paramStringMock],
  }

  const WifiEapConfig = {
    eapMethod: EapMethod.EAP_NONE,
    phase2Method: Phase2Method.PHASE2_NONE,
    identity: '[PC preview] unknow identity',
    anonymousIdentity: '[PC preview] unknow anonymousIdentity',
    password: '[PC preview] unknow password',
    caCertAliases: '[PC preview] unknow caCertAliases',
    caPath: '[PC preview] unknow caPath',
    clientCertAliases: '[PC preview] unknow clientCertAliases',
    altSubjectMatch: '[PC preview] unknow altSubjectMatch',
    domainSuffixMatch: '[PC preview] unknow domainSuffixMatch',
    realm: '[PC preview] unknow realm',
    plmn: '[PC preview] unknow plmn',
    eapSubId: '[PC preview] unknow eapSubId',
  }

  const WifiDeviceConfig = {
    ssid: '[PC preview] unknow ssid',
    bssid: '[PC preview] unknow bssid',
    preSharedKey: '[PC preview] unknow preSharedKey',
    isHiddenSsid: '[PC preview] unknow isHiddenSsid',
    securityType: WifiSecurityType.WIFI_SEC_TYPE_OPEN,
    creatorUid: '[PC preview] unknow creatorUid',
    disableReason: '[PC preview] unknow disableReason',
    netId: '[PC preview] unknow netId',
    randomMacType: '[PC preview] unknow randomMacType',
    randomMacAddr: '[PC preview] unknow randomMacAddr',
    ipType: IpType.DHCP,
    staticIp: IpConfig,
    eapConfig: WifiEapConfig,
  }

  const WifiHotspotConfig = {
    ssid: '[PC preview] unknow ssid',
    securityType: WifiSecurityType.WIFI_SEC_TYPE_OPEN,
    band: '[PC preview] unknow band',
    preSharedKey: '[PC preview] unknow preSharedKey',
    maxConn: '[PC preview] unknow maxConn',
  }

  const WifiStationInfo = {
    name: '[PC preview] unknow name',
    macAddress: '[PC preview] unknow macAddress',
    ipAddress: '[PC preview] unknow ipAddress',
  }

  const P2pLinkedInfo = {
    connectState: P2pConnectState.DISCONNECTED,
    isGroupOwner: '[PC preview] unknow isGroupOwner',
    groupOwnerAddr: '[PC preview] unknow groupOwnerAddr',
  }

  const WifiP2pDevice = {
    deviceName: '[PC preview] unknow deviceName',
    deviceAddress: '[PC preview] unknow deviceAddress',
    primaryDeviceType: '[PC preview] unknow primaryDeviceType',
    deviceStatus: P2pDeviceStatus.UNAVAILABLE,
    groupCapabilitys: '[PC preview] unknow groupCapabilitys',
  }

  const P2pGroupInfo = {
    isP2pGo: '[PC preview] unknow connectState',
    ownerInfo: WifiP2pDevice,
    passphrase: '[PC preview] unknow passphrase',
    interface: '[PC preview] unknow interface',
    groupName: '[PC preview] unknow groupName',
    networkId: '[PC preview] unknow networkId',
    frequency: '[PC preview] unknow frequency',
    clientDevices: [WifiP2pDevice],
    goIpAddress: '[PC preview] unknow goIpAddress',
  }

  const wifi = {
    enableWifi: function (...args) {
      console.warn("wifi.enableWifi interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    disableWifi: function (...args) {
      console.warn("wifi.disableWifi interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isWifiActive: function (...args) {
      console.warn("wifi.isWifiActive interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    scan: function (...args) {
      console.warn("wifi.scan interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getScanInfos: function (...args) {
      console.warn("wifi.getScanInfos interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [WifiScanInfo])
      } else {
        return new Promise((resolve) => {
          resolve([WifiScanInfo])
        })
      }
    },

    getScanInfosSync: function (...args) {
      console.warn("wifi.getScanInfosSync interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return [WifiScanInfo];
    },

    addDeviceConfig: function (...args) {
      console.warn("wifi.addDeviceConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },

    addUntrustedConfig: function (...args) {
      console.warn("wifi.addUntrustedConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },

    removeUntrustedConfig: function (...args) {
      console.warn("wifi.removeUntrustedConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },

    addCandidateConfig: function (...args) {
      console.warn("wifi.addCandidateConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },

    removeCandidateConfig: function (...args) {
      console.warn("wifi.removeCandidateConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },

    getCandidateConfigs: function (...args) {
      console.warn("wifi.getCandidateConfigs interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return [WifiDeviceConfig];
    },

    connectToCandidateConfig: function (...args) {
      console.warn("wifi.connectToCandidateConfig interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return;
    },

    connectToNetwork: function (...args) {
      console.warn("wifi.connectToNetwork interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    connectToDevice: function (...args) {
      console.warn("wifi.connectToDevice interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    disconnect: function (...args) {
      console.warn("wifi.disconnect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getSignalLevel: function (...args) {
      console.warn("wifi.getSignalLevel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    getLinkedInfo: function (...args) {
      console.warn("wifi.getLinkedInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WifiLinkedInfo)
      } else {
        return new Promise((resolve) => {
          resolve(WifiLinkedInfo)
        })
      }
    },

    isConnected: function (...args) {
      console.warn("wifi.isConnected interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getSupportedFeatures: function (...args) {
      console.warn("wifi.getSupportedFeatures interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    isFeatureSupported: function (...args) {
      console.warn("wifi.isFeatureSupported interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getDeviceMacAddress: function (...args) {
      console.warn("wifi.getDeviceMacAddress interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return [paramMock.paramArrayMock];
    },

    getIpInfo: function (...args) {
      console.warn("wifi.getIpInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return IpInfo;
    },

    getCountryCode: function (...args) {
      console.warn("wifi.getCountryCode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },

    reassociate: function (...args) {
      console.warn("wifi.reassociate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    reconnect: function (...args) {
      console.warn("wifi.reconnect interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getDeviceConfigs: function (...args) {
      console.warn("wifi.getDeviceConfigs interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return [WifiDeviceConfig];
    },

    updateNetwork: function (...args) {
      console.warn("wifi.updateNetwork interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    disableNetwork: function (...args) {
      console.warn("wifi.disableNetwork interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    removeAllNetwork: function (...args) {
      console.warn("wifi.removeAllNetwork interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    removeDevice: function (...args) {
      console.warn("wifi.removeDevice interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    enableHotspot: function (...args) {
      console.warn("wifi.enableHotspot interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    disableHotspot: function (...args) {
      console.warn("wifi.disableHotspot interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isHotspotDualBandSupported: function (...args) {
      console.warn("wifi.isHotspotDualBandSupported interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isHotspotActive: function (...args) {
      console.warn("wifi.isHotspotActive interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    setHotspotConfig: function (...args) {
      console.warn("wifi.setHotspotConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getHotspotConfig: function (...args) {
      console.warn("wifi.getHotspotConfig interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return WifiHotspotConfig;
    },

    getStations: function (...args) {
      console.warn("wifi.getStations interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return [WifiStationInfo];
    },

    on: function (...args) {
      console.warn("wifi.on interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },

    off: function (...args) {
      console.warn("wifi.off interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
    },

    getP2pLinkedInfo: function (...args) {
      console.warn("wifi.getP2pLinkedInfo interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, P2pLinkedInfo)
      } else {
        return new Promise((resolve) => {
          resolve(P2pLinkedInfo)
        })
      }
    },

    getCurrentGroup: function (...args) {
      console.warn("wifi.getCurrentGroup interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, P2pGroupInfo)
      } else {
        return new Promise((resolve) => {
          resolve(P2pGroupInfo)
        })
      }
    },

    getP2pPeerDevices: function (...args) {
      console.warn("wifi.getP2pPeerDevices interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [WifiP2pDevice])
      } else {
        return new Promise((resolve) => {
          resolve([WifiP2pDevice])
        })
      }
    },

    getP2pLocalDevice: function (...args) {
      console.warn("wifi.getP2pLocalDevice interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WifiP2pDevice)
      } else {
        return new Promise((resolve) => {
          resolve(WifiP2pDevice)
        })
      }
    },

    createGroup: function (...args) {
      console.warn("wifi.createGroup interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    removeGroup: function (...args) {
      console.warn("wifi.removeGroup interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    p2pConnect: function (...args) {
      console.warn("wifi.p2pConnect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    p2pCancelConnect: function (...args) {
      console.warn("wifi.p2pCancelConnect interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    startDiscoverDevices: function (...args) {
      console.warn("wifi.startDiscoverDevices interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    stopDiscoverDevices: function (...args) {
      console.warn("wifi.stopDiscoverDevices interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    deletePersistentGroup: function (...args) {
      console.warn("wifi.deletePersistentGroup interface mocked in the Previewer. " +
        "How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    getP2pGroups: function (...args) {
      console.warn("wifi.getP2pGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [P2pGroupInfo])
      } else {
        return new Promise((resolve) => {
          resolve([P2pGroupInfo])
        })
      }
    },

    setDeviceName: function (...args) {
      console.warn("wifi.setDeviceName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
  }
  return wifi;
}
