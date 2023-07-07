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

export function mockTv() {
  const SoundStereos = {
    STEREO_STEREO: "[PC Preview] unknow STEREO_STEREO",
    STEREO_MONO: "[PC Preview] unknow STEREO_MONO",
    STEREO_DOUBLE_LEFT: "[PC Preview] unknow STEREO_DOUBLE_LEFT",
    STEREO_DOUBLE_RIGHT: "[PC Preview] unknow STEREO_DOUBLE_RIGHT",
    STEREO_EXCHANGE: "[PC Preview] unknow STEREO_EXCHANGE",
    STEREO_ONLY_RIGHT: "[PC Preview] unknow STEREO_ONLY_RIGHT",
    STEREO_ONLY_LEFT: "[PC Preview] unknow STEREO_ONLY_LEFT",
    STEREO_MUTED: "[PC Preview] unknow STEREO_MUTED"
  }
  const SoundSpdifs = {
    SPDIF_PCM: "[PC Preview] unknow SPDIF_PCM",
    SPDIF_RAW: "[PC Preview] unknow SPDIF_RAW",
    SPDIF_AUTO: "[PC Preview] unknow SPDIF_AUTO"
  }
  const SoundArcModes = {
    ARC_AUDIO_MODE_LPCM: "[PC Preview] unknow ARC_AUDIO_MODE_LPCM",
    ARC_AUDIO_MODE_RAW: "[PC Preview] unknow ARC_AUDIO_MODE_RAW",
    ARC_AUDIO_MODE_LEGACY: "[PC Preview] unknow ARC_AUDIO_MODE_LEGACY",
    ARC_AUDIO_MODE_AUTO: "[PC Preview] unknow ARC_AUDIO_MODE_AUTO"
  }
  const AudioStreamInfo = {
    type: "[PC Preview] unknow type",
    value: "[PC Preview] unknow value"
  }
  const AudioGainAttr = {
    isLinearMode: "[PC Preview] unknow isLinearMode",
    gain: "[PC Preview] unknow gain"
  }
  const HistenSoundModes = {
    HISTEN_SNDMODE_MUSIC: "[PC Preview] unknow HISTEN_SNDMODE_MUSIC",
    HISTEN_SNDMODE_MOVIE: "[PC Preview] unknow HISTEN_SNDMODE_MOVIE",
    HISTEN_SNDMODE_STANDARD: "[PC Preview] unknow HISTEN_SNDMODE_STANDARD",
    HISTEN_SNDMODE_SPORTS: "[PC Preview] unknow HISTEN_SNDMODE_SPORTS",
    HISTEN_SNDMODE_NEWS: "[PC Preview] unknow HISTEN_SNDMODE_NEWS",
    HISTEN_SNDMODE_GAME: "[PC Preview] unknow HISTEN_SNDMODE_GAME",
    HISTEN_SNDMODE_AUTO: "[PC Preview] unknow HISTEN_SNDMODE_AUTO",
    HISTEN_SNDMODE_DEVIALET: "[PC Preview] unknow HISTEN_SNDMODE_DEVIALET",
    HISTEN_SNDMODE_USER: "[PC Preview] unknow HISTEN_SNDMODE_USER"
  }
  const SoundFields = {
    SNDFIELD_DESKTOP: "[PC Preview] unknow SNDFIELD_DESKTOP",
    SNDFIELD_HANG: "[PC Preview] unknow SNDFIELD_HANG"
  }
  const AudioOutDevices = {
    DEVICE_NONE: "[PC Preview] unknow DEVICE_NONE",
    DEVICE_OUT_SPEAKER: "[PC Preview] unknow DEVICE_OUT_SPEAKER",
    DEVICE_OUT_SPDIF: "[PC Preview] unknow DEVICE_OUT_SPDIF",
    DEVICE_OUT_HDMI_ARC: "[PC Preview] unknow DEVICE_OUT_HDMI_ARC",
    DEVICE_OUT_BLUETOOTH_A2DP: "[PC Preview] unknow DEVICE_OUT_BLUETOOTH_A2DP",
    DEVICE_OUT_USB_DEVICE: "[PC Preview] unknow DEVICE_OUT_USB_DEVICE",
    DEVICE_OUT_WIFI_SPEAKER: "[PC Preview] unknow DEVICE_OUT_WIFI_SPEAKER"
  }
  const SourceIndices = {
    SOURCE_ATV: "[PC Preview] unknow SOURCE_ATV",
    SOURCE_DVBC: "[PC Preview] unknow SOURCE_DVBC",
    SOURCE_DTMB: "[PC Preview] unknow SOURCE_DTMB",
    SOURCE_CVBS1: "[PC Preview] unknow SOURCE_CVBS1",
    SOURCE_CVBS2: "[PC Preview] unknow SOURCE_CVBS2",
    SOURCE_CVBS3: "[PC Preview] unknow SOURCE_CVBS3",
    SOURCE_VGA: "[PC Preview] unknow SOURCE_VGA",
    SOURCE_YPBPR1: "[PC Preview] unknow SOURCE_YPBPR1",
    SOURCE_YPBPR2: "[PC Preview] unknow SOURCE_YPBPR2",
    SOURCE_HDMI1: "[PC Preview] unknow SOURCE_HDMI1",
    SOURCE_HDMI2: "[PC Preview] unknow SOURCE_HDMI2",
    SOURCE_HDMI3: "[PC Preview] unknow SOURCE_HDMI3",
    SOURCE_HDMI4: "[PC Preview] unknow SOURCE_HDMI4",
    SOURCE_MEDIA: "[PC Preview] unknow SOURCE_MEDIA",
    SOURCE_MEDIA2: "[PC Preview] unknow SOURCE_MEDIA2",
    SOURCE_SCART1: "[PC Preview] unknow SOURCE_SCART1",
    SOURCE_SCART2: "[PC Preview] unknow SOURCE_SCART2",
    SOURCE_AUTO: "[PC Preview] unknow SOURCE_AUTO",
    SOURCE_DVBT: "[PC Preview] unknow SOURCE_DVBT",
    SOURCE_ATSC: "[PC Preview] unknow SOURCE_ATSC",
    SOURCE_DVBS: "[PC Preview] unknow SOURCE_DVBS",
    SOURCE_ISDBT: "[PC Preview] unknow SOURCE_ISDBT",
    SOURCE_BUTT: "[PC Preview] unknow SOURCE_BUTT"
  }
  const TimingInfo = {
    width: "[PC Preview] unknow width",
    height: "[PC Preview] unknow height",
    frame: "[PC Preview] unknow frame",
    isInterlace: "[PC Preview] unknow isInterlace",
    hdmiFmt: "[PC Preview] unknow hdmiFmt",
    threeDimFmt: "[PC Preview] unknow threeDimFmt",
    colorSpace: "[PC Preview] unknow colorSpace",
    isMhl: "[PC Preview] unknow isMhl"
  }
  const HdmiCecDeviceInfo = {
    hdmiDevPort: "[PC Preview] unknow hdmiDevPort",
    logicAddr: "[PC Preview] unknow logicAddr",
    devVendId: "[PC Preview] unknow devVendId",
    osdName: "[PC Preview] unknow osdName"
  }
  const PictureClrtmps = {
    CLRTMP_NATURE: "[PC Preview] unknow CLRTMP_NATURE",
    CLRTMP_COOL: "[PC Preview] unknow CLRTMP_COOL",
    CLRTMP_WARM: "[PC Preview] unknow CLRTMP_WARM",
    CLRTMP_USER: "[PC Preview] unknow CLRTMP_USER",
    CLRTMP_TOCOOL: "[PC Preview] unknow CLRTMP_TOCOOL",
    CLRTMP_TOWARM: "[PC Preview] unknow CLRTMP_TOWARM",
    CLRTMP_BUTT: "[PC Preview] unknow CLRTMP_BUTT"
  }
  const PictureLevels = {
    LEVEL_OFF: "[PC Preview] unknow LEVEL_OFF",
    LEVEL_LOW: "[PC Preview] unknow LEVEL_LOW",
    LEVEL_MIDDLE: "[PC Preview] unknow LEVEL_MIDDLE",
    LEVEL_HIGH: "[PC Preview] unknow LEVEL_HIGH",
    LEVEL_AUTO: "[PC Preview] unknow LEVEL_AUTO"
  }
  const PictureAspects = {
    ASPECT_16_9: "[PC Preview] unknow ASPECT_16_9",
    ASPECT_14_9: "[PC Preview] unknow ASPECT_14_9",
    ASPECT_4_3: "[PC Preview] unknow ASPECT_4_3",
    ASPECT_FULL: "[PC Preview] unknow ASPECT_FULL",
    ASPECT_POINT2POINT: "[PC Preview] unknow ASPECT_POINT2POINT",
    ASPECT_AUTO: "[PC Preview] unknow ASPECT_AUTO",
    ASPECT_SUBTITLE: "[PC Preview] unknow ASPECT_SUBTITLE",
    ASPECT_PERSON: "[PC Preview] unknow ASPECT_PERSON",
    ASPECT_CINEMA: "[PC Preview] unknow ASPECT_CINEMA",
    ASPECT_PANORAMA: "[PC Preview] unknow ASPECT_PANORAMA",
    ASPECT_ZOOM: "[PC Preview] unknow ASPECT_ZOOM",
    ASPECT_ZOOM1: "[PC Preview] unknow ASPECT_ZOOM1",
    ASPECT_ZOOM2: "[PC Preview] unknow ASPECT_ZOOM2",
    ASPECT_TRUTH: "[PC Preview] unknow ASPECT_TRUTH",
    ASPECT_21_9: "[PC Preview] unknow ASPECT_21_9"
  }
  const PictureModes = {
    PICMODE_VIVID: "[PC Preview] unknow PICMODE_VIVID",
    PICMODE_STANDARD: "[PC Preview] unknow PICMODE_STANDARD",
    PICMODE_SOFTNESS: "[PC Preview] unknow PICMODE_SOFTNESS",
    PICMODE_MOVIE: "[PC Preview] unknow PICMODE_MOVIE",
    PICMODE_SPORTS: "[PC Preview] unknow PICMODE_SPORTS",
    PICMODE_KID: "[PC Preview] unknow PICMODE_KID",
    PICMODE_GAME: "[PC Preview] unknow PICMODE_GAME",
    PICMODE_PICTURE: "[PC Preview] unknow PICMODE_PICTURE",
    PICMODE_USER: "[PC Preview] unknow PICMODE_USER",
    PICMODE_AUTO: "[PC Preview] unknow PICMODE_AUTO",
    PICMODE_NATURAL: "[PC Preview] unknow PICMODE_NATURAL",
    PICMODE_MASTER: "[PC Preview] unknow PICMODE_MASTER",
    PICMODE_DYNAMIC: "[PC Preview] unknow PICMODE_DYNAMIC"
  }
  const HdmiRanges = {
    HDMI_RANGE_AUTO: "[PC Preview] unknow HDMI_RANGE_AUTO",
    HDMI_RANGE_COMPLETE: "[PC Preview] unknow HDMI_RANGE_COMPLETE",
    HDMI_RANGE_LIMIT: "[PC Preview] unknow HDMI_RANGE_LIMIT"
  }
  const ColorGamuts = {
    COLOR_GAMUT_AUTO: "[PC Preview] unknow COLOR_GAMUT_AUTO",
    COLOR_GAMUT_BT2020: "[PC Preview] unknow COLOR_GAMUT_BT2020",
    COLOR_GAMUT_P3: "[PC Preview] unknow COLOR_GAMUT_P3",
    COLOR_GAMUT_ADOBERGB: "[PC Preview] unknow COLOR_GAMUT_ADOBERGB",
    COLOR_GAMUT_BT709: "[PC Preview] unknow COLOR_GAMUT_BT709",
    COLOR_GAMUT_BT601_EBU: "[PC Preview] unknow COLOR_GAMUT_BT601_EBU",
    COLOR_GAMUT_BT601_SMPTE: "[PC Preview] unknow COLOR_GAMUT_BT601_SMPTE",
    COLOR_GAMUT_NATIVE: "[PC Preview] unknow COLOR_GAMUT_NATIVE"
  }
  const WhitePoints = {
    WHITE_POINT_AUTO: "[PC Preview] unknow WHITE_POINT_AUTO",
    WHITE_POINT_D50: "[PC Preview] unknow WHITE_POINT_D50",
    WHITE_POINT_D60: "[PC Preview] unknow WHITE_POINT_D60",
    WHITE_POINT_D63: "[PC Preview] unknow WHITE_POINT_D63",
    WHITE_POINT_D65: "[PC Preview] unknow WHITE_POINT_D65",
    WHITE_POINT_D93: "[PC Preview] unknow WHITE_POINT_D93",
    WHITE_POINT_NATIVE: "[PC Preview] unknow WHITE_POINT_NATIVE"
  }
  const Oetfs = {
    OETF_AUTO: "[PC Preview] unknow OETF_AUTO",
    OETF_BT709: "[PC Preview] unknow OETF_BT709",
    OETF_SRGB: "[PC Preview] unknow OETF_SRGB",
    OETF_22: "[PC Preview] unknow OETF_22",
    OETF_24: "[PC Preview] unknow OETF_24",
    OETF_26: "[PC Preview] unknow OETF_26",
    OETF_BT2084: "[PC Preview] unknow OETF_BT2084",
    OETF_HLG: "[PC Preview] unknow OETF_HLG",
    OETF_NATIVE: "[PC Preview] unknow OETF_NATIVE"
  }
  const ColorManagerModes = {
    COLOR_MANAGER_AUTO: "[PC Preview] unknow COLOR_MANAGER_AUTO",
    COLOR_MANAGER_HDR10: "[PC Preview] unknow COLOR_MANAGER_HDR10",
    COLOR_MANAGER_HLG: "[PC Preview] unknow COLOR_MANAGER_HLG",
    COLOR_MANAGER_HDTV: "[PC Preview] unknow COLOR_MANAGER_HDTV",
    COLOR_MANAGER_SRGB: "[PC Preview] unknow COLOR_MANAGER_SRGB",
    COLOR_MANAGER_P3_DCI: "[PC Preview] unknow COLOR_MANAGER_P3_DCI",
    COLOR_MANAGER_P3_D65: "[PC Preview] unknow COLOR_MANAGER_P3_D65",
    COLOR_MANAGER_P3_D50: "[PC Preview] unknow COLOR_MANAGER_P3_D50",
    COLOR_MANAGER_ADOBERGB: "[PC Preview] unknow COLOR_MANAGER_ADOBERGB",
    COLOR_MANAGER_EBU: "[PC Preview] unknow COLOR_MANAGER_EBU",
    COLOR_MANAGER_SMPTE_C: "[PC Preview] unknow COLOR_MANAGER_SMPTE_C",
    COLOR_MANAGER_USER1: "[PC Preview] unknow COLOR_MANAGER_USER1",
    COLOR_MANAGER_USER2: "[PC Preview] unknow COLOR_MANAGER_USER2",
    COLOR_MANAGER_P3_PG: "[PC Preview] unknow COLOR_MANAGER_P3_PG",
    COLOR_MANAGER_CUVA: "[PC Preview] unknow COLOR_MANAGER_CUVA"
  }
  const PictureUserHdrTypes = {
    USER_HDR_TYPE_AUTO: "[PC Preview] unknow USER_HDR_TYPE_AUTO",
    USER_HDR_TYPE_CUVA: "[PC Preview] unknow USER_HDR_TYPE_CUVA",
    USER_HDR_TYPE_HDR10: "[PC Preview] unknow USER_HDR_TYPE_HDR10",
    USER_HDR_TYPE_HLG: "[PC Preview] unknow USER_HDR_TYPE_HLG",
    USER_HDR_TYPE_OFF: "[PC Preview] unknow USER_HDR_TYPE_OFF",
    USER_HDR_TYPE_BUTT: "[PC Preview] unknow USER_HDR_TYPE_BUTT"
  }
  const CommonLevels = {
    HI_MW_LEVEL_OFF: "[PC Preview] unknow HI_MW_LEVEL_OFF",
    HI_MW_LEVEL_LOW: "[PC Preview] unknow HI_MW_LEVEL_LOW",
    HI_MW_LEVEL_MID: "[PC Preview] unknow HI_MW_LEVEL_MID",
    HI_MW_LEVEL_HIGH: "[PC Preview] unknow HI_MW_LEVEL_HIGH",
    HI_MW_LEVEL_AUTO: "[PC Preview] unknow HI_MW_LEVEL_AUTO"
  }
  const PictureColorTempModes = {
    COLOR_TEMP_DEFAULT: "[PC Preview] unknow COLOR_TEMP_DEFAULT",
    COLOR_TEMP_NATURAL_TONE: "[PC Preview] unknow COLOR_TEMP_NATURAL_TONE",
    COLOR_TEMP_EYE_PROTECT: "[PC Preview] unknow COLOR_TEMP_EYE_PROTECT"
  }
  const RectInfo = {
    x: "[PC Preview] unknow x",
    y: "[PC Preview] unknow y",
    w: "[PC Preview] unknow w",
    h: "[PC Preview] unknow h"
  }
  const SignalStates = {
    SIGSTAT_SUPPORT: "[PC Preview] unknow SIGSTAT_SUPPORT",
    SIGSTAT_NOSIGNAL: "[PC Preview] unknow SIGSTAT_NOSIGNAL",
    SIGSTAT_UNSUPPORT: "[PC Preview] unknow SIGSTAT_UNSUPPORT",
    SIGSTAT_UNSTABLE: "[PC Preview] unknow SIGSTAT_UNSTABLE"
  }
  const HdmirxEdidTypes = {
    HDMIRX_EDID_TYPE_2_0: "[PC Preview] unknow HDMIRX_EDID_TYPE_2_0",
    HDMIRX_EDID_TYPE_1_4: "[PC Preview] unknow HDMIRX_EDID_TYPE_1_4",
    HDMIRX_EDID_TYPE_AUTO: "[PC Preview] unknow HDMIRX_EDID_TYPE_AUTO"
  }
  const Wakeup = {
    mode: "[PC Preview] unknow mode",
    src: "[PC Preview] unknow src",
    value: "[PC Preview] unknow value"
  }
  const result = {
    getAudioManager: function () {
      console.warn("tv.getAudioManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return AudioManager;
    },
    getEventManager: function () {
      console.warn("tv.getEventManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return EventManager;
    },
    getHdmiCecManager: function () {
      console.warn("tv.getHdmiCecManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return HdmiCecManager;
    },
    getPictureManager: function () {
      console.warn("tv.getPictureManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return PictureManager;
    },
    getSourceManager: function () {
      console.warn("tv.getSourceManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return SourceManager;
    },
    getSystemSetting: function () {
      console.warn("tv.getSystemSetting interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return SystemSetting;
    }
  }
  const AudioManager = {
    getMute: function (...args) {
      console.warn("AudioManager.getMute interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setMute: function (...args) {
      console.warn("AudioManager.setMute interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setUsrAudioMute: function (...args) {
      console.warn("AudioManager.setUsrAudioMute interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getStereoMode: function (...args) {
      console.warn("AudioManager.getStereoMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SoundStereos);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SoundStereos);
        })
      }
    },
    setStereoMode: function (...args) {
      console.warn("AudioManager.setStereoMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableSpdif: function (...args) {
      console.warn("AudioManager.enableSpdif interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isSpdifEnabled: function (...args) {
      console.warn("AudioManager.enableSpdif interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSpdifMode: function (...args) {
      console.warn("AudioManager.enableSpdif interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSpdifMode: function (...args) {
      console.warn("AudioManager.getSpdifMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SoundSpdifs);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SoundSpdifs);
        })
      }
    },
    enableArc: function (...args) {
      console.warn("AudioManager.enableArc interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isArcEnabled: function (...args) {
      console.warn("AudioManager.isArcEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setArcMode: function (...args) {
      console.warn("AudioManager.setArcMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getArcMode: function (...args) {
      console.warn("AudioManager.getArcMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SoundArcModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SoundArcModes);
        })
      }
    },
    isArcSupported: function (...args) {
      console.warn("AudioManager.isArcSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAdvancedEffectParameter: function (...args) {
      console.warn("AudioManager.setAdvancedEffectParameter interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAdvancedEffectParameter: function (...args) {
      console.warn("AudioManager.getAdvancedEffectParameter interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioStreamInfo: function (...args) {
      console.warn("AudioManager.getAudioStreamInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioStreamInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioStreamInfo);
        })
      }
    },
    setTrackWeight: function (...args) {
      console.warn("AudioManager.getAdvancedEffectParameter interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTrackWeight: function (...args) {
      console.warn("AudioManager.getTrackWeight interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioGainAttr);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioGainAttr);
        })
      }
    },
    getSoundModeList: function (...args) {
      console.warn("AudioManager.getSoundModeList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var histenSoundModesArray = new Array();
      histenSoundModesArray.push(HistenSoundModes);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, histenSoundModesArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(histenSoundModesArray);
        })
      }
    },
    setNightMode: function (...args) {
      console.warn("AudioManager.setNightMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isNightModeEnabled: function (...args) {
      console.warn("AudioManager.isNightModeEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isNightModeSupported: function (...args) {
      console.warn("AudioManager.isNightModeSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    soundModeling: function (...args) {
      console.warn("AudioManager.soundModeling interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setModelType: function (...args) {
      console.warn("AudioManager.setModelType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getModelType: function (...args) {
      console.warn("AudioManager.getModelType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SoundFields);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SoundFields);
        })
      }
    },
    startMicRecorder: function (...args) {
      console.warn("AudioManager.startMicRecorder interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopMicRecorder: function (...args) {
      console.warn("AudioManager.stopMicRecorder interface mocked in the Previewer. How this interface works on the Previewer" +
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
    hasSoundCustomized: function (...args) {
      console.warn("AudioManager.stopMicRecorder interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setOutDevice: function (...args) {
      console.warn("AudioManager.setOutDevice interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getOutDevice: function (...args) {
      console.warn("AudioManager.getOutDevice interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioOutDevices);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioOutDevices);
        })
      }
    },
    getHangMode: function (...args) {
      console.warn("AudioManager.getHangMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SoundFields);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SoundFields);
        })
      }
    },
    setHangMode: function (...args) {
      console.warn("AudioManager.setHangMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isMicDamaged: function (...args) {
      console.warn("AudioManager.isMicDamaged interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isVolAdjustSupported: function (...args) {
      console.warn("AudioManager.isVolAdjustSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    recoveryOutDevice: function (...args) {
      console.warn("AudioManager.recoveryOutDevice interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setVolumeByPid: function (...args) {
      console.warn("AudioManager.setVolumeByPid interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenGeqGains: function (...args) {
      console.warn("AudioManager.getHistenGeqGains interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var numberArray = new Array();
      numberArray.push(paramMock.paramNumberMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, numberArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(numberArray);
        })
      }
    },
    setHistenGeqGain: function (...args) {
      console.warn("AudioManager.setHistenGeqGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenVocGain: function (...args) {
      console.warn("AudioManager.getHistenVocGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHistenVocGain: function (...args) {
      console.warn("AudioManager.setHistenVocGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenVertSurroundGain: function (...args) {
      console.warn("AudioManager.getHistenVertSurroundGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHistenVertSurroundGain: function (...args) {
      console.warn("AudioManager.setHistenVertSurroundGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenHorzSurroundGain: function (...args) {
      console.warn("AudioManager.getHistenHorzSurroundGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHistenHorzSurroundGain: function (...args) {
      console.warn("AudioManager.setHistenHorzSurroundGain interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenCustomMode: function (...args) {
      console.warn("AudioManager.getHistenCustomMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHistenCustomMode: function (...args) {
      console.warn("AudioManager.setHistenCustomMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resetHistenCustomMode: function (...args) {
      console.warn("AudioManager.resetHistenCustomMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHistenCustomModeList: function (...args) {
      console.warn("AudioManager.getHistenCustomModeList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var numberArray = new Array();
      numberArray.push(paramMock.paramNumberMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, numberArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(numberArray);
        })
      }
    },
    enableHistenVoip: function (...args) {
      console.warn("AudioManager.enableHistenVoip interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isHistenVoipEnabled: function (...args) {
      console.warn("AudioManager.isHistenVoipEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    }
  }
  const EventManager = {
    on: function (...args) {
      console.warn("EventManager.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("EventManager.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    }
  }
  const HdmiCecManager = {
    getUiStatus: function (...args) {
      console.warn("HdmiCecManager.getUiStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setUiStatus: function (...args) {
      console.warn("HdmiCecManager.setUiStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDeviceList: function (...args) {
      console.warn("HdmiCecManager.getDeviceList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HdmiCecDeviceInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HdmiCecDeviceInfo);
        })
      }
    },
    changeSourceToTv: function (...args) {
      console.warn("HdmiCecManager.changeSourceToTv interface mocked in the Previewer. How this interface works on the Previewer" +
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
    sendMenuCommand: function (...args) {
      console.warn("HdmiCecManager.sendMenuCommand interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    }
  }
  const PictureManager = {
    enableAutoPictureMode: function (...args) {
      console.warn("PictureManager.enableAutoPictureMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setPictureMode: function (...args) {
      console.warn("PictureManager.setPictureMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setBrightness: function (...args) {
      console.warn("PictureManager.setBrightness interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBrightness: function (...args) {
      console.warn("PictureManager.getBrightness interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setContrast: function (...args) {
      console.warn("PictureManager.setContrast interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getContrast: function (...args) {
      console.warn("PictureManager.getContrast interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSaturation: function (...args) {
      console.warn("PictureManager.setSaturation interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSaturation: function (...args) {
      console.warn("PictureManager.getSaturation interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSharpness: function (...args) {
      console.warn("PictureManager.setSharpness interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSharpness: function (...args) {
      console.warn("PictureManager.getSharpness interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHue: function (...args) {
      console.warn("PictureManager.setHue interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHue: function (...args) {
      console.warn("PictureManager.getHue interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setBacklight: function (...args) {
      console.warn("PictureManager.setBacklight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBacklight: function (...args) {
      console.warn("PictureManager.getBacklight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setBacklightThreshold: function (...args) {
      console.warn("PictureManager.setBacklightThreshold interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBacklightThreshold: function (...args) {
      console.warn("PictureManager.getBacklightThreshold interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setColorTemp: function (...args) {
      console.warn("PictureManager.setColorTemp interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorTemp: function (...args) {
      console.warn("PictureManager.getColorTemp interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureClrtmps);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureClrtmps);
        })
      }
    },
    setNr: function (...args) {
      console.warn("PictureManager.setNr interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getNr: function (...args) {
      console.warn("PictureManager.getNr interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureLevels);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureLevels);
        })
      }
    },
    setMemcLevel: function (...args) {
      console.warn("PictureManager.setMemcLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMemcLevel: function (...args) {
      console.warn("PictureManager.getMemcLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableDci: function (...args) {
      console.warn("PictureManager.enableDci interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isDciEnabled: function (...args) {
      console.warn("PictureManager.isDciEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableDynamicBl: function (...args) {
      console.warn("PictureManager.enableDynamicBl interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isDynamicBlEnabled: function (...args) {
      console.warn("PictureManager.isDynamicBlEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAspect: function (...args) {
      console.warn("PictureManager.setAspect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAspect: function (...args) {
      console.warn("PictureManager.getAspect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureAspects);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureAspects);
        })
      }
    },
    enableLocalDimming: function (...args) {
      console.warn("PictureManager.enableLocalDimming interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isLocalDimmingEnabled: function (...args) {
      console.warn("PictureManager.isLocalDimmingEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isLocalDimmingSupported: function (...args) {
      console.warn("PictureManager.isLocalDimmingSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setEyeProtectMode: function (...args) {
      console.warn("PictureManager.setEyeProtectMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getEyeProtectMode: function (...args) {
      console.warn("PictureManager.getEyeProtectMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setVideoInfoStart: function (...args) {
      console.warn("PictureManager.setVideoInfoStart interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setVideoInfoStop: function (...args) {
      console.warn("PictureManager.setVideoInfoStop interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPictureModeList: function (...args) {
      console.warn("PictureManager.getPictureModeList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var pictureModesArray = new Array();
      pictureModesArray.push(PictureModes);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, pictureModesArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(pictureModesArray);
        })
      }
    },
    setAutoBlEnable: function (...args) {
      console.warn("PictureManager.setAutoBlEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isAutoBacklightEnabled: function (...args) {
      console.warn("PictureManager.isAutoBacklightEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setActivityUi: function (...args) {
      console.warn("PictureManager.setActivityUi interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDciType: function (...args) {
      console.warn("PictureManager.setDciType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDciType: function (...args) {
      console.warn("PictureManager.getDciType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDciGainLevel: function (...args) {
      console.warn("PictureManager.setDciGainLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDciGainLevel: function (...args) {
      console.warn("PictureManager.getDciGainLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setUploadBacklight: function (...args) {
      console.warn("PictureManager.setUploadBacklight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPictureMode: function (...args) {
      console.warn("PictureManager.getPictureMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureModes);
        })
      }
    },
    enableBacklight: function (...args) {
      console.warn("PictureManager.enableBacklight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isBacklightEnabled: function (...args) {
      console.warn("PictureManager.isBacklightEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHdmiRange: function (...args) {
      console.warn("PictureManager.setHdmiRange interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHdmiRange: function (...args) {
      console.warn("PictureManager.getHdmiRange interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HdmiRanges);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HdmiRanges);
        })
      }
    },
    setColorGamut: function (...args) {
      console.warn("PictureManager.setColorGamut interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorGamut: function (...args) {
      console.warn("PictureManager.getColorGamut interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ColorGamuts);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ColorGamuts);
        })
      }
    },
    setWhitePoint: function (...args) {
      console.warn("PictureManager.setWhitePoint interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getWhitePoint: function (...args) {
      console.warn("PictureManager.getWhitePoint interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WhitePoints);
      } else {
        return new Promise((resolve, reject) => {
          resolve(WhitePoints);
        })
      }
    },
    setOetf: function (...args) {
      console.warn("PictureManager.setOetf interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getOetf: function (...args) {
      console.warn("PictureManager.getOetf interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Oetfs);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Oetfs);
        })
      }
    },
    setTwoPointColorTemp: function (...args) {
      console.warn("PictureManager.setTwoPointColorTemp interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTwoPointColorTemp: function (...args) {
      console.warn("PictureManager.getTwoPointColorTemp interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    setTenGamma: function (...args) {
      console.warn("PictureManager.setTenGamma interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTenGamma: function (...args) {
      console.warn("PictureManager.getTenGamma interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    enableCreatorMode: function (...args) {
      console.warn("PictureManager.enableCreatorMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isCreatorModeEnabled: function (...args) {
      console.warn("PictureManager.isCreatorModeEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setColorManagerMode: function (...args) {
      console.warn("PictureManager.setColorManagerMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorManagerMode: function (...args) {
      console.warn("PictureManager.getColorManagerMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ColorManagerModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ColorManagerModes);
        })
      }
    },
    restoreCalibration: function (...args) {
      console.warn("PictureManager.restoreCalibration interface mocked in the Previewer. How this interface works on the Previewer" +
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
    restoreMasterSetting: function (...args) {
      console.warn("PictureManager.restoreMasterSetting interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setStandbyLedEnable: function (...args) {
      console.warn("PictureManager.setStandbyLedEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isStandbyLedEnabled: function (...args) {
      console.warn("PictureManager.isStandbyLedEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHdrType: function (...args) {
      console.warn("PictureManager.getHdrType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureUserHdrTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureUserHdrTypes);
        })
      }
    },
    setUserHdrType: function (...args) {
      console.warn("PictureManager.setUserHdrType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getUserHdrType: function (...args) {
      console.warn("PictureManager.getUserHdrType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureUserHdrTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureUserHdrTypes);
        })
      }
    },
    setMpegNr: function (...args) {
      console.warn("PictureManager.setMpegNr interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMpegNr: function (...args) {
      console.warn("PictureManager.getMpegNr interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonLevels);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CommonLevels);
        })
      }
    },
    setBoostPeakLevel: function (...args) {
      console.warn("PictureManager.setBoostPeakLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBoostPeakLevel: function (...args) {
      console.warn("PictureManager.getBoostPeakLevel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonLevels);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CommonLevels);
        })
      }
    },
    enableNaturalTone: function (...args) {
      console.warn("PictureManager.enableNaturalTone interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isNaturalToneEnabled: function (...args) {
      console.warn("PictureManager.isNaturalToneEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setClearMotionLevel: function (...args) {
      console.warn("PictureManager.setClearMotionLevel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getClearMotionLevel: function (...args) {
      console.warn("PictureManager.getClearMotionLevel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CommonLevels);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CommonLevels);
        })
      }
    },
    restoreCurrentPictureMode: function (...args) {
      console.warn("PictureManager.restoreCurrentPictureMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setEyeProtectStep: function (...args) {
      console.warn("PictureManager.setEyeProtectStep interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getEyeProtectStep: function (...args) {
      console.warn("PictureManager.getEyeProtectStep interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setColorTempMode: function (...args) {
      console.warn("PictureManager.setColorTempMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorTempMode: function (...args) {
      console.warn("PictureManager.getColorTempMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PictureColorTempModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PictureColorTempModes);
        })
      }
    },
    setColorTempStep: function (...args) {
      console.warn("PictureManager.setColorTempStep interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorTempStep: function (...args) {
      console.warn("PictureManager.getColorTempStep interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getNormalColorManagerMode: function (...args) {
      console.warn("PictureManager.getNormalColorManagerMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ColorManagerModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ColorManagerModes);
        })
      }
    },
    isPdParamSupported: function (...args) {
      console.warn("PictureManager.isPdParamSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isCuvaDeviceSupported: function (...args) {
      console.warn("PictureManager.isCuvaDeviceSupported interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    }
  }
  const SourceManager = {
    selectSource: function (...args) {
      console.warn("SourceManager.selectSource interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurSourceId: function (...args) {
      console.warn("SourceManager.getCurSourceId interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SourceIndices);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SourceIndices);
        })
      }
    },
    deselectSource: function (...args) {
      console.warn("SourceManager.deselectSource interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAvailSourceList: function (...args) {
      console.warn("SourceManager.getAvailSourceList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var sourceIndicesArray = new Array();
      sourceIndicesArray.push(SourceIndices);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, sourceIndicesArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(sourceIndicesArray);
        })
      }
    },
    getTimingInfo: function (...args) {
      console.warn("SourceManager.getTimingInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TimingInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TimingInfo);
        })
      }
    },
    getSignalStatus: function (...args) {
      console.warn("SourceManager.getSignalStatus interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SignalStates);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SignalStates);
        })
      }
    },
    setWindowRect: function (...args) {
      console.warn("SourceManager.setWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getWindowRect: function (...args) {
      console.warn("SourceManager.getWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, RectInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(RectInfo);
        })
      }
    },
    setVideoDisplay: function (...args) {
      console.warn("SourceManager.setVideoDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    clearVideoDisplay: function (...args) {
      console.warn("SourceManager.clearVideoDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSupportSourceList: function (...args) {
      console.warn("SourceManager.getSupportSourceList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, sourceIndicesArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(sourceIndicesArray);
        })
      }
    },
    getSelectSourceId: function (...args) {
      console.warn("SourceManager.getSelectSourceId interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    getSourcePlayingState: function (...args) {
      console.warn("SourceManager.getSourcePlayingState interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var sourceIndicesArray = new Array();
      sourceIndicesArray.push(SourceIndices);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, sourceIndicesArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(sourceIndicesArray);
        })
      }
    },
    connectDistributeService: function (...args) {
      console.warn("SourceManager.connectDistributeService interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    }
  }
  const SystemSetting = {
    restoreDefault: function (...args) {
      console.warn("SystemSetting.restoreDefault interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setHdmirxEdidType: function (...args) {
      console.warn("SystemSetting.setHdmirxEdidType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getHdmirxEdidType: function (...args) {
      console.warn("SystemSetting.getHdmirxEdidType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HdmirxEdidTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HdmirxEdidTypes);
        })
      }
    },
    isPowerOnPanelEnabled: function (...args) {
      console.warn("SystemSetting.isPowerOnPanelEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enablePowerOnPanel: function (...args) {
      console.warn("SystemSetting.enablePowerOnPanel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    restorePic: function (...args) {
      console.warn("SystemSetting.restorePic interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setPowerSaveMode: function (...args) {
      console.warn("SystemSetting.setPowerSaveMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPowerSaveMode: function (...args) {
      console.warn("SystemSetting.getPowerSaveMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getWakeup: function (...args) {
      console.warn("SystemSetting.getWakeup interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Wakeup);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Wakeup);
        })
      }
    },
    enableLock: function (...args) {
      console.warn("SystemSetting.enableLock interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isLockEnabled: function (...args) {
      console.warn("SystemSetting.isLockEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var sourceIndicesArray = new Array();
      sourceIndicesArray.push(SourceIndices);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    setParentLock: function (...args) {
      console.warn("SystemSetting.setParentLock interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentLock: function (...args) {
      console.warn("SystemSetting.getParentLock interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableSrcLock: function (...args) {
      console.warn("SystemSetting.enableSrcLock interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isSrcLockEnabled: function (...args) {
      console.warn("SystemSetting.isSrcLockEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isCurrentLocked: function (...args) {
      console.warn("SystemSetting.isCurrentLocked interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableDtvLock: function (...args) {
      console.warn("SystemSetting.enableDtvLock interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isDtvLockEnabled: function (...args) {
      console.warn("SystemSetting.isDtvLockEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDtvLockDefaultStatus: function (...args) {
      console.warn("SystemSetting.setDtvLockDefaultStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    enableTemperatureCtrl: function (...args) {
      console.warn("SystemSetting.enableTemperatureCtrl interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isTemperatureCtrlEnabled: function (...args) {
      console.warn("SystemSetting.isTemperatureCtrlEnabled interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isTemperatureCtrlSupported: function (...args) {
      console.warn("SystemSetting.isTemperatureCtrlSupported interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isLampEffectSupported: function (...args) {
      console.warn("SystemSetting.isLampEffectSupported interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    }
  }
  return result;
}