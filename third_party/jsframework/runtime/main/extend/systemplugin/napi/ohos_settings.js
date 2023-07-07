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

export function mockSettings() {
  const date = {
    DATE_FORMAT: "[PC Preview] unknow DATE_FORMAT",
    TIME_FORMAT: "[PC Preview] unknow TIME_FORMAT",
    AUTO_GAIN_TIME: "[PC Preview] unknow AUTO_GAIN_TIME",
    AUTO_GAIN_TIME_ZONE: "[PC Preview] unknow AUTO_GAIN_TIME_ZONE",
  };
  const display = {
    FONT_SCALE: "[PC Preview] unknow FONT_SCALE",
    SCREEN_BRIGHTNESS_STATUS: "[PC Preview] unknow SCREEN_BRIGHTNESS_STATUS",
    AUTO_SCREEN_BRIGHTNESS: "[PC Preview] unknow AUTO_SCREEN_BRIGHTNESS",
    AUTO_SCREEN_BRIGHTNESS_MODE: "[PC Preview] unknow AUTO_SCREEN_BRIGHTNESS_MODE",
    MANUAL_SCREEN_BRIGHTNESS_MODE: "[PC Preview] unknow MANUAL_SCREEN_BRIGHTNESS_MODE",
    SCREEN_OFF_TIMEOUT: "[PC Preview] unknow SCREEN_OFF_TIMEOUT",
    DEFAULT_SCREEN_ROTATION: "[PC Preview] unknow DEFAULT_SCREEN_ROTATION",
    ANIMATOR_DURATION_SCALE: "[PC Preview] unknow ANIMATOR_DURATION_SCALE",
    TRANSITION_ANIMATION_SCALE: "[PC Preview] unknow TRANSITION_ANIMATION_SCALE",
    WINDOW_ANIMATION_SCALE: "[PC Preview] unknow WINDOW_ANIMATION_SCALE",
    DISPLAY_INVERSION_STATUS: "[PC Preview] unknow DISPLAY_INVERSION_STATUS",
  };
  const general = {
    SETUP_WIZARD_FINISHED: "[PC Preview] unknow SETUP_WIZARD_FINISHED",
    END_BUTTON_ACTION: "[PC Preview] unknow END_BUTTON_ACTION",
    ACCELEROMETER_ROTATION_STATUS: "[PC Preview] unknow ACCELEROMETER_ROTATION_STATUS",
    AIRPLANE_MODE_STATUS: "[PC Preview] unknow AIRPLANE_MODE_STATUS",
    DEVICE_PROVISION_STATUS: "[PC Preview] unknow DEVICE_PROVISION_STATUS",
    HDC_STATUS: "[PC Preview] unknow HDC_STATUS",
    BOOT_COUNTING: "[PC Preview] unknow BOOT_COUNTING",
    CONTACT_METADATA_SYNC_STATUS: "[PC Preview] unknow CONTACT_METADATA_SYNC_STATUS",
    DEVELOPMENT_SETTINGS_STATUS: "[PC Preview] unknow DEVELOPMENT_SETTINGS_STATUS",
    DEVICE_NAME: "[PC Preview] unknow DEVICE_NAME",
    USB_STORAGE_STATUS: "[PC Preview] unknow USB_STORAGE_STATUS",
    DEBUGGER_WAITING: "[PC Preview] unknow DEBUGGER_WAITING",
    DEBUG_APP_PACKAGE: "[PC Preview] unknow DEBUG_APP_PACKAGE",
    ACCESSIBILITY_STATUS: "[PC Preview] unknow ACCESSIBILITY_STATUS",
    ACTIVATED_ACCESSIBILITY_SERVICES: "[PC Preview] unknow ACTIVATED_ACCESSIBILITY_SERVICES",
    GEOLOCATION_ORIGINS_ALLOWED: "[PC Preview] unknow GEOLOCATION_ORIGINS_ALLOWED",
    SKIP_USE_HINTS: "[PC Preview] unknow SKIP_USE_HINTS",
    TOUCH_EXPLORATION_STATUS: "[PC Preview] unknow TOUCH_EXPLORATION_STATUS",
  };
  const input = {
    DEFAULT_INPUT_METHOD: "[PC Preview] unknow DEFAULT_INPUT_METHOD",
    ACTIVATED_INPUT_METHOD_SUB_MODE: "[PC Preview] unknow ACTIVATED_INPUT_METHOD_SUB_MODE",
    ACTIVATED_INPUT_METHODS: "[PC Preview] unknow ACTIVATED_INPUT_METHODS",
    SELECTOR_VISIBILITY_FOR_INPUT_METHOD: "[PC Preview] unknow SELECTOR_VISIBILITY_FOR_INPUT_METHOD",
    AUTO_CAPS_TEXT_INPUT: "[PC Preview] unknow AUTO_CAPS_TEXT_INPUT",
    AUTO_PUNCTUATE_TEXT_INPUT: "[PC Preview] unknow AUTO_PUNCTUATE_TEXT_INPUT",
    AUTO_REPLACE_TEXT_INPUT: "[PC Preview] unknow AUTO_REPLACE_TEXT_INPUT",
    SHOW_PASSWORD_TEXT_INPUT: "[PC Preview] unknow SHOW_PASSWORD_TEXT_INPUT",
  };
  const network = {
    DATA_ROAMING_STATUS: "[PC Preview] unknow DATA_ROAMING_STATUS",
    HTTP_PROXY_CFG: "[PC Preview] unknow HTTP_PROXY_CFG",
    NETWORK_PREFERENCE_USAGE: "[PC Preview] unknow NETWORK_PREFERENCE_USAGE",
  };
  const phone = {
    RTT_CALLING_STATUS: "[PC Preview] unknow RTT_CALLING_STATUS",
  };
  const sound = {
    VIBRATE_WHILE_RINGING: "[PC Preview] unknow VIBRATE_WHILE_RINGING",
    DEFAULT_ALARM_ALERT: "[PC Preview] unknow DEFAULT_ALARM_ALERT",
    DTMF_TONE_TYPE_WHILE_DIALING: "[PC Preview] unknow DTMF_TONE_TYPE_WHILE_DIALING",
    DTMF_TONE_WHILE_DIALING: "[PC Preview] unknow DTMF_TONE_WHILE_DIALING",
    AFFECTED_MODE_RINGER_STREAMS: "[PC Preview] unknow AFFECTED_MODE_RINGER_STREAMS",
    AFFECTED_MUTE_STREAMS: "[PC Preview] unknow AFFECTED_MUTE_STREAMS",
    DEFAULT_NOTIFICATION_SOUND: "[PC Preview] unknow DEFAULT_NOTIFICATION_SOUND",
    DEFAULT_RINGTONE: "[PC Preview] unknow DEFAULT_RINGTONE",
    SOUND_EFFECTS_STATUS: "[PC Preview] unknow SOUND_EFFECTS_STATUS",
    VIBRATE_STATUS: "[PC Preview] unknow VIBRATE_STATUS",
    HAPTIC_FEEDBACK_STATUS: "[PC Preview] unknow HAPTIC_FEEDBACK_STATUS",
  };
  const TTS = {
    DEFAULT_TTS_PITCH: "[PC Preview] unknow DEFAULT_TTS_PITCH",
    DEFAULT_TTS_RATE: "[PC Preview] unknow DEFAULT_TTS_RATE",
    DEFAULT_TTS_SYNTH: "[PC Preview] unknow DEFAULT_TTS_SYNTH",
    ENABLED_TTS_PLUGINS: "[PC Preview] unknow ENABLED_TTS_PLUGINS",
  };
  const wireless = {
    BLUETOOTH_DISCOVER_ABILITY_STATUS: "[PC Preview] unknow DEFAULT_TTBLUETOOTH_DISCOVER_ABILITY_STATUSS_PITCH",
    BLUETOOTH_DISCOVER_TIMEOUT: "[PC Preview] unknow BLUETOOTH_DISCOVER_TIMEOUT",
    AIRPLANE_MODE_RADIOS: "[PC Preview] unknow AIRPLANE_MODE_RADIOS",
    BLUETOOTH_STATUS: "[PC Preview] unknow BLUETOOTH_STATUS",
    BLUETOOTH_RADIO: "[PC Preview] unknow BLUETOOTH_RADIO",
    CELL_RADIO: "[PC Preview] unknow CELL_RADIO",
    NFC_RADIO: "[PC Preview] unknow NFC_RADIO",
    WIFI_RADIO: "[PC Preview] unknow WIFI_RADIO",
    OWNER_LOCKDOWN_WIFI_CFG: "[PC Preview] unknow OWNER_LOCKDOWN_WIFI_CFG",
    WIFI_DHCP_MAX_RETRY_COUNT: "[PC Preview] unknow WIFI_DHCP_MAX_RETRY_COUNT",
    WIFI_TO_MOBILE_DATA_AWAKE_TIMEOUT: "[PC Preview] unknow WIFI_TO_MOBILE_DATA_AWAKE_TIMEOUT",
    WIFI_STATUS: "[PC Preview] unknow WIFI_STATUS",
    WIFI_WATCHDOG_STATUS: "[PC Preview] unknow WIFI_WATCHDOG_STATUS",
  };
  const settings = {
    date,
    display,
    general,
    input,
    network,
    phone,
    sound,
    TTS,
    wireless,
    getURI: function (...args) {
      console.warn("settings.getURI interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramObjectMock)
        })
      }
    },
    getValue: function (...args) {
      console.warn("settings.getValue interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramObjectMock)
          })
        }
    },
    setValue: function (...args) {
      console.warn("settings.setValue interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramBooleanMock)
          })
        }
    },
    enableAirplaneMode: function (...args) {
      console.warn("settings.enableAirplaneMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock)
        } else {
          return new Promise((resolve) => {
            resolve()
          })
        }
    },
    canShowFloating: function (...args) {
      console.warn("settings.canShowFloating interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
        } else {
          return new Promise((resolve) => {
            resolve(paramMock.paramBooleanMock)
          })
        }
    },
    getUriSync: function (...args) {
      console.warn("settings.getUriSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock
    },
    getValueSync: function (...args) {
      console.warn("settings.getValueSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock
    },
    setValueSync: function (...args) {
      console.warn("settings.getValueSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramBooleanMock
    },
  };
  return settings;
}
