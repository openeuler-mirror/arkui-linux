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
import { CommonEventData } from "./commonEvent/commonEventData"
import { CommonEventSubscriber } from "./commonEvent/commonEventSubscriber"

export const Support = {
  COMMON_EVENT_BOOT_COMPLETED: "usual.event.BOOT_COMPLETED",
  COMMON_EVENT_LOCKED_BOOT_COMPLETED: "usual.event.LOCKED_BOOT_COMPLETED",
  COMMON_EVENT_SHUTDOWN: "usual.event.SHUTDOWN",
  COMMON_EVENT_BATTERY_CHANGED: "usual.event.BATTERY_CHANGED",
  COMMON_EVENT_BATTERY_LOW: "usual.event.BATTERY_LOW",
  COMMON_EVENT_BATTERY_OKAY: "usual.event.BATTERY_OKAY",
  COMMON_EVENT_POWER_CONNECTED: "usual.event.POWER_CONNECTED",
  COMMON_EVENT_POWER_DISCONNECTED: "usual.event.POWER_DISCONNECTED",
  COMMON_EVENT_SCREEN_OFF: "usual.event.SCREEN_OFF",
  COMMON_EVENT_SCREEN_ON: "usual.event.SCREEN_ON",
  COMMON_EVENT_THERMAL_LEVEL_CHANGED: "usual.event.THERMAL_LEVEL_CHANGED",
  COMMON_EVENT_USER_PRESENT: "usual.event.USER_PRESENT",
  COMMON_EVENT_TIME_TICK: "usual.event.TIME_TICK",
  COMMON_EVENT_TIME_CHANGED: "usual.event.TIME_CHANGED",
  COMMON_EVENT_DATE_CHANGED: "usual.event.DATE_CHANGED",
  COMMON_EVENT_TIMEZONE_CHANGED: "usual.event.TIMEZONE_CHANGED",
  COMMON_EVENT_CLOSE_SYSTEM_DIALOGS: "usual.event.CLOSE_SYSTEM_DIALOGS",
  COMMON_EVENT_PACKAGE_ADDED: "usual.event.PACKAGE_ADDED",
  COMMON_EVENT_PACKAGE_REPLACED: "usual.event.PACKAGE_REPLACED",
  COMMON_EVENT_MY_PACKAGE_REPLACED: "usual.event.MY_PACKAGE_REPLACED",
  COMMON_EVENT_PACKAGE_REMOVED: "usual.event.PACKAGE_REMOVED",
  COMMON_EVENT_BUNDLE_REMOVED: "usual.event.BUNDLE_REMOVED",
  COMMON_EVENT_PACKAGE_FULLY_REMOVED: "usual.event.PACKAGE_FULLY_REMOVED",
  COMMON_EVENT_PACKAGE_CHANGED: "usual.event.PACKAGE_CHANGED",
  COMMON_EVENT_PACKAGE_RESTARTED: "usual.event.PACKAGE_RESTARTED",
  COMMON_EVENT_PACKAGE_DATA_CLEARED: "usual.event.PACKAGE_DATA_CLEARED",
  COMMON_EVENT_PACKAGE_CACHE_CLEARED: "usual.event.PACKAGE_CACHE_CLEARED",
  COMMON_EVENT_PACKAGES_SUSPENDED: "usual.event.PACKAGES_SUSPENDED",
  COMMON_EVENT_PACKAGES_UNSUSPENDED: "usual.event.PACKAGES_UNSUSPENDED",
  COMMON_EVENT_MY_PACKAGE_SUSPENDED: "usual.event.MY_PACKAGE_SUSPENDED",
  COMMON_EVENT_MY_PACKAGE_UNSUSPENDED: "usual.event.MY_PACKAGE_UNSUSPENDED",
  COMMON_EVENT_UID_REMOVED: "usual.event.UID_REMOVED",
  COMMON_EVENT_PACKAGE_FIRST_LAUNCH: "usual.event.PACKAGE_FIRST_LAUNCH",
  COMMON_EVENT_PACKAGE_NEEDS_VERIFICATION: "usual.event.PACKAGE_NEEDS_VERIFICATION",
  COMMON_EVENT_PACKAGE_VERIFIED: "usual.event.PACKAGE_VERIFIED",
  COMMON_EVENT_EXTERNAL_APPLICATIONS_AVAILABLE: "usual.event.EXTERNAL_APPLICATIONS_AVAILABLE",
  COMMON_EVENT_EXTERNAL_APPLICATIONS_UNAVAILABLE: "usual.event.EXTERNAL_APPLICATIONS_UNAVAILABLE",
  COMMON_EVENT_CONFIGURATION_CHANGED: "usual.event.CONFIGURATION_CHANGED",
  COMMON_EVENT_LOCALE_CHANGED: "usual.event.LOCALE_CHANGED",
  COMMON_EVENT_MANAGE_PACKAGE_STORAGE: "usual.event.MANAGE_PACKAGE_STORAGE",
  COMMON_EVENT_DRIVE_MODE: "common.event.DRIVE_MODE",
  COMMON_EVENT_HOME_MODE: "common.event.HOME_MODE",
  COMMON_EVENT_OFFICE_MODE: "common.event.OFFICE_MODE",
  COMMON_EVENT_USER_STARTED: "usual.event.USER_STARTED",
  COMMON_EVENT_USER_BACKGROUND: "usual.event.USER_BACKGROUND",
  COMMON_EVENT_USER_FOREGROUND: "usual.event.USER_FOREGROUND",
  COMMON_EVENT_USER_SWITCHED: "usual.event.USER_SWITCHED",
  COMMON_EVENT_USER_STARTING: "usual.event.USER_STARTING",
  COMMON_EVENT_USER_UNLOCKED: "usual.event.USER_UNLOCKED",
  COMMON_EVENT_USER_STOPPING: "usual.event.USER_STOPPING",
  COMMON_EVENT_USER_STOPPED: "usual.event.USER_STOPPED",
  COMMON_EVENT_HWID_LOGIN: "common.event.HWID_LOGIN",
  COMMON_EVENT_HWID_LOGOUT: "common.event.HWID_LOGOUT",
  COMMON_EVENT_HWID_TOKEN_INVALID: "common.event.HWID_TOKEN_INVALID",
  COMMON_EVENT_HWID_LOGOFF: "common.event.HWID_LOGOFF",
  COMMON_EVENT_WIFI_POWER_STATE: "usual.event.wifi.POWER_STATE",
  COMMON_EVENT_WIFI_SCAN_FINISHED: "usual.event.wifi.SCAN_FINISHED",
  COMMON_EVENT_WIFI_RSSI_VALUE: "usual.event.wifi.RSSI_VALUE",
  COMMON_EVENT_WIFI_CONN_STATE: "usual.event.wifi.CONN_STATE",
  COMMON_EVENT_WIFI_HOTSPOT_STATE: "usual.event.wifi.HOTSPOT_STATE",
  COMMON_EVENT_WIFI_AP_STA_JOIN: "usual.event.wifi.WIFI_HS_STA_JOIN",
  COMMON_EVENT_WIFI_AP_STA_LEAVE: "usual.event.wifi.WIFI_HS_STA_LEAVE",
  COMMON_EVENT_WIFI_MPLINK_STATE_CHANGE: "usual.event.wifi.mplink.STATE_CHANGE",
  COMMON_EVENT_WIFI_P2P_CONN_STATE: "usual.event.wifi.p2p.CONN_STATE_CHANGE",
  COMMON_EVENT_WIFI_P2P_STATE_CHANGED: "usual.event.wifi.p2p.STATE_CHANGE",
  COMMON_EVENT_WIFI_P2P_PEERS_STATE_CHANGED: "usual.event.wifi.p2p.DEVICES_CHANGE",
  COMMON_EVENT_WIFI_P2P_PEERS_DISCOVERY_STATE_CHANGED: "usual.event.wifi.p2p.PEER_DISCOVERY_STATE_CHANGE",
  COMMON_EVENT_WIFI_P2P_CURRENT_DEVICE_STATE_CHANGED:"usual.event.wifi.p2p.CURRENT_DEVICE_CHANGE",
  COMMON_EVENT_WIFI_P2P_GROUP_STATE_CHANGED:"usual.event.wifi.p2p.GROUP_STATE_CHANGED",
  COMMON_EVENT_BLUETOOTH_HANDSFREE_AG_CONNECT_STATE_UPDATE:
    "usual.event.bluetooth.handsfree.ag.CONNECT_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HANDSFREE_AG_CURRENT_DEVICE_UPDATE:
    "usual.event.bluetooth.handsfree.ag.CURRENT_DEVICE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HANDSFREE_AG_AUDIO_STATE_UPDATE: "usual.event.bluetooth.handsfree.ag.AUDIO_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSOURCE_CONNECT_STATE_UPDATE:"usual.event.bluetooth.a2dpsource.CONNECT_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSOURCE_CURRENT_DEVICE_UPDATE: "usual.event.bluetooth.a2dpsource.CURRENT_DEVICE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSOURCE_PLAYING_STATE_UPDATE: "usual.event.bluetooth.a2dpsource.PLAYING_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSOURCE_AVRCP_CONNECT_STATE_UPDATE:
    "usual.event.bluetooth.a2dpsource.AVRCP_CONNECT_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSOURCE_CODEC_VALUE_UPDATE: "usual.event.bluetooth.a2dpsource.CODEC_VALUE_UPDATE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_DISCOVERED: "usual.event.bluetooth.remotedevice.DISCOVERED",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_CLASS_VALUE_UPDATE: "usual.event.bluetooth.remotedevice.CLASS_VALUE_UPDATE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_ACL_CONNECTED: "usual.event.bluetooth.remotedevice.ACL_CONNECTED",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_ACL_DISCONNECTED: "usual.event.bluetooth.remotedevice.ACL_DISCONNECTED",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_NAME_UPDATE:
    "usual.event.bluetooth.remotedevice.NAME_UPDATE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_PAIR_STATE:
    "usual.event.bluetooth.remotedevice.PAIR_STATE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_BATTERY_VALUE_UPDATE:
    "usual.event.bluetooth.remotedevice.BATTERY_VALUE_UPDATE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_SDP_RESULT:
    "usual.event.bluetooth.remotedevice.SDP_RESULT",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_UUID_VALUE:
    "usual.event.bluetooth.remotedevice.UUID_VALUE",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_PAIRING_REQ:
    "usual.event.bluetooth.remotedevice.PAIRING_REQ",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_PAIRING_CANCEL:
    "usual.event.bluetooth.remotedevice.PAIRING_CANCEL",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_CONNECT_REQ:
    "usual.event.bluetooth.remotedevice.CONNECT_REQ",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_CONNECT_REPLY:
    "usual.event.bluetooth.remotedevice.CONNECT_REPLY",
  COMMON_EVENT_BLUETOOTH_REMOTEDEVICE_CONNECT_CANCEL:
    "usual.event.bluetooth.remotedevice.CONNECT_CANCEL",
  COMMON_EVENT_BLUETOOTH_HANDSFREEUNIT_CONNECT_STATE_UPDATE:
    "usual.event.bluetooth.handsfreeunit.CONNECT_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HANDSFREEUNIT_AUDIO_STATE_UPDATE:
    "usual.event.bluetooth.handsfreeunit.AUDIO_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HANDSFREEUNIT_AG_COMMON_EVENT:
    "usual.event.bluetooth.handsfreeunit.AG_COMMON_EVENT",
  COMMON_EVENT_BLUETOOTH_HANDSFREEUNIT_AG_CALL_STATE_UPDATE:
    "usual.event.bluetooth.handsfreeunit.AG_CALL_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HOST_STATE_UPDATE:
    "usual.event.bluetooth.host.STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HOST_REQ_DISCOVERABLE:
    "usual.event.bluetooth.host.REQ_DISCOVERABLE",
  COMMON_EVENT_BLUETOOTH_HOST_REQ_ENABLE: "usual.event.bluetooth.host.REQ_ENABLE",
  COMMON_EVENT_BLUETOOTH_HOST_REQ_DISABLE:
    "usual.event.bluetooth.host.REQ_DISABLE",
  COMMON_EVENT_BLUETOOTH_HOST_SCAN_MODE_UPDATE:
    "usual.event.bluetooth.host.SCAN_MODE_UPDATE",
  COMMON_EVENT_BLUETOOTH_HOST_DISCOVERY_STARTED:
    "usual.event.bluetooth.host.DISCOVERY_STARTED",
  COMMON_EVENT_BLUETOOTH_HOST_DISCOVERY_FINISHED:
    "usual.event.bluetooth.host.DISCOVERY_FINISHED",
  COMMON_EVENT_BLUETOOTH_HOST_NAME_UPDATE:
    "usual.event.bluetooth.host.NAME_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSINK_CONNECT_STATE_UPDATE:
    "usual.event.bluetooth.a2dpsink.CONNECT_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSINK_PLAYING_STATE_UPDATE:
    "usual.event.bluetooth.a2dpsink.PLAYING_STATE_UPDATE",
  COMMON_EVENT_BLUETOOTH_A2DPSINK_AUDIO_STATE_UPDATE:
    "usual.event.bluetooth.a2dpsink.AUDIO_STATE_UPDATE",
  COMMON_EVENT_NFC_ACTION_ADAPTER_STATE_CHANGED:
    "usual.event.nfc.action.ADAPTER_STATE_CHANGED",
  COMMON_EVENT_NFC_ACTION_RF_FIELD_ON_DETECTED:
    "usual.event.nfc.action.RF_FIELD_ON_DETECTED",
  COMMON_EVENT_NFC_ACTION_RF_FIELD_OFF_DETECTED:
    "usual.event.nfc.action.RF_FIELD_OFF_DETECTED",
  COMMON_EVENT_DISCHARGING: "usual.event.DISCHARGING",
  COMMON_EVENT_CHARGING: "usual.event.CHARGING",
  COMMON_EVENT_DEVICE_IDLE_MODE_CHANGED: "usual.event.DEVICE_IDLE_MODE_CHANGED",
  COMMON_EVENT_POWER_SAVE_MODE_CHANGED: "usual.event.POWER_SAVE_MODE_CHANGED",
  COMMON_EVENT_USER_ADDED: "usual.event.USER_ADDED",
  COMMON_EVENT_USER_REMOVED: "usual.event.USER_REMOVED",
  COMMON_EVENT_ABILITY_ADDED: "common.event.ABILITY_ADDED",
  COMMON_EVENT_ABILITY_REMOVED: "common.event.ABILITY_REMOVED",
  COMMON_EVENT_ABILITY_UPDATED: "common.event.ABILITY_UPDATED",
  COMMON_EVENT_LOCATION_MODE_STATE_CHANGED:
    "usual.event.location.MODE_STATE_CHANGED",
  COMMON_EVENT_IVI_SLEEP: "common.event.IVI_SLEEP",
  COMMON_EVENT_IVI_PAUSE: "common.event.IVI_PAUSE",
  COMMON_EVENT_IVI_STANDBY: "common.event.IVI_STANDBY",
  COMMON_EVENT_IVI_LASTMODE_SAVE: "common.event.IVI_LASTMODE_SAVE",
  COMMON_EVENT_IVI_VOLTAGE_ABNORMAL: "common.event.IVI_VOLTAGE_ABNORMAL",
  COMMON_EVENT_IVI_HIGH_TEMPERATURE: "common.event.IVI_HIGH_TEMPERATURE",
  COMMON_EVENT_IVI_EXTREME_TEMPERATURE: "common.event.IVI_EXTREME_TEMPERATURE",
  COMMON_EVENT_IVI_TEMPERATURE_ABNORMAL: "common.event.IVI_TEMPERATURE_ABNORMAL",
  COMMON_EVENT_IVI_VOLTAGE_RECOVERY: "common.event.IVI_VOLTAGE_RECOVERY",
  COMMON_EVENT_IVI_TEMPERATURE_RECOVERY: "common.event.IVI_TEMPERATURE_RECOVERY",
  COMMON_EVENT_IVI_ACTIVE: "common.event.IVI_ACTIVE",
  COMMON_EVENT_USB_STATE: "usual.event.hardware.usb.action.USB_STATE",
  COMMON_EVENT_USB_PORT_CHANGED: "usual.event.hardware.usb.action.USB_PORT_CHANGED",
  COMMON_EVENT_USB_DEVICE_ATTACHED:
    "usual.event.hardware.usb.action.USB_DEVICE_ATTACHED",
  COMMON_EVENT_USB_DEVICE_DETACHED:
    "usual.event.hardware.usb.action.USB_DEVICE_DETACHED",
  COMMON_EVENT_USB_ACCESSORY_ATTACHED:
    "usual.event.hardware.usb.action.USB_ACCESSORY_ATTACHED",
  COMMON_EVENT_USB_ACCESSORY_DETACHED:
    "usual.event.hardware.usb.action.USB_ACCESSORY_DETACHED",
  COMMON_EVENT_DISK_REMOVED: "usual.event.data.DISK_REMOVED",
  COMMON_EVENT_DISK_UNMOUNTED: "usual.event.data.DISK_UNMOUNTED",
  COMMON_EVENT_DISK_MOUNTED: "usual.event.data.DISK_MOUNTED",
  COMMON_EVENT_DISK_BAD_REMOVAL: "usual.event.data.DISK_BAD_REMOVAL",
  COMMON_EVENT_DISK_UNMOUNTABLE: "usual.event.data.DISK_UNMOUNTABLE",
  COMMON_EVENT_DISK_EJECT: "usual.event.data.DISK_EJECT",
  COMMON_EVENT_VOLUME_REMOVED: "usual.event.data.VOLUME_REMOVED",
  COMMON_EVENT_VOLUME_UNMOUNTED: "usual.event.data.VOLUME_UNMOUNTED",
  COMMON_EVENT_VOLUME_MOUNTED: "usual.event.data.VOLUME_MOUNTED",
  COMMON_EVENT_VOLUME_BAD_REMOVAL: "usual.event.data.VOLUME_BAD_REMOVAL",
  COMMON_EVENT_VOLUME_EJECT: "usual.event.data.VOLUME_EJECT",
  COMMON_EVENT_VISIBLE_ACCOUNTS_UPDATED:
    "usual.event.data.VISIBLE_ACCOUNTS_UPDATED",
  COMMON_EVENT_ACCOUNT_DELETED: "usual.event.data.ACCOUNT_DELETED",
  COMMON_EVENT_FOUNDATION_READY: "common.event.FOUNDATION_READY",
  COMMON_EVENT_AIRPLANE_MODE_CHANGED: "usual.event.AIRPLANE_MODE",
  COMMON_EVENT_SPLIT_SCREEN: "common.event.SPLIT_SCREEN",
  COMMON_EVENT_SLOT_CHANGE: "usual.event.SLOT_CHANGE",
  COMMON_EVENT_SPN_INFO_CHANGED: "usual.event.SPN_INFO_CHANGED"
}
export function mockCommonEvent() {
  const commonEvent = {
    publish: function (...args) {
      console.warn('commonEvent.publish interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } 
    },
    publishAsUser: function (...args) {
      console.warn('commonEvent.publishAsUser interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      }
    },
    createSubscriber: function (...args) {
      console.warn('commonEvent.createSubscriber interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonEventSubscriber);
      } else {
        return new Promise((resolve) => {
          resolve(CommonEventSubscriber);
        });
      }
    },
    subscribe: function (...args) {
      console.warn('commonEvent.subscribe interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonEventData);
      }
    },
    unsubscribe: function (...args) {
      console.warn('commonEvent.unsubscribe interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      }
    },
    Support
  }
  return commonEvent
}
