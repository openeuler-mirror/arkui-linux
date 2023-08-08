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

export function mockDtv() {
  const BookTask = {
    id: "[PC Preview] unknow id",
    channelId: "[PC Preview] unknow channelId",
    eventId: "[PC Preview] unknow eventId",
    isAdjustByEvent: "[PC Preview] unknow isAdjustByEvent",
    name: "[PC Preview] unknow name",
    startDate: "[PC Preview] unknow startDate",
    duration: "[PC Preview] unknow duration",
    type: "[PC Preview] unknow type",
    cycle: "[PC Preview] unknow cycle",
    isEnabled: "[PC Preview] unknow isEnabled",
    lcn: "[PC Preview] unknow lcn",
    programName: "[PC Preview] unknow programName",
    signalType: "[PC Preview] unknow signalType",
    startTime: "[PC Preview] unknow startTime"
  }
  const FavTags = {
    FAV_ALL: "[PC Preview] unknow FAV_ALL",
    FAV_1: "[PC Preview] unknow FAV_1",
    FAV_2: "[PC Preview] unknow FAV_2",
    FAV_3: "[PC Preview] unknow FAV_3",
    FAV_4: "[PC Preview] unknow FAV_4",
    FAV_5: "[PC Preview] unknow FAV_5",
    FAV_6: "[PC Preview] unknow FAV_6",
    FAV_7: "[PC Preview] unknow FAV_7",
    FAV_8: "[PC Preview] unknow FAV_8",
    FAV_9: "[PC Preview] unknow FAV_9",
    FAV_10: "[PC Preview] unknow FAV_10",
    FAV_11: "[PC Preview] unknow FAV_11",
    FAV_12: "[PC Preview] unknow FAV_12",
    FAV_13: "[PC Preview] unknow FAV_13",
    FAV_14: "[PC Preview] unknow FAV_14",
    FAV_15: "[PC Preview] unknow FAV_15",
    FAV_16: "[PC Preview] unknow FAV_16"
  }
  const ChannelTsInfo = {
    tsInfoNum: "[PC Preview] unknow tsInfoNum",
    networkType: "[PC Preview] unknow networkType",
    centerFreqList: "[PC Preview] unknow centerFreqList",
    cabDeliveryDescriptor: "[PC Preview] unknow cabDeliveryDescriptor",
    terDeliveryDescriptor: "[PC Preview] unknow terDeliveryDescriptor",
    satDeliveryDescriptor: "[PC Preview] unknow satDeliveryDescriptor"
  }
  const ChannelFilter = {
    siElement: "[PC Preview] unknow siElement",
    tvRadio: "[PC Preview] unknow tvRadio",
    favGroupTypes: "[PC Preview] unknow favGroupTypes",
    scrambleType: "[PC Preview] unknow scrambleType",
    editTags: "[PC Preview] unknow editTags",
    letters: "[PC Preview] unknow letters",
    mbServiceNameFilter: "[PC Preview] unknow mbServiceNameFilter"
  }
  const TVRadioFilters = {
    ALL: "[PC Preview] unknow ALL",
    TV: "[PC Preview] unknow TV",
    RADIO: "[PC Preview] unknow RADIO",
    DATA: "[PC Preview] unknow DATA",
    BUTT: "[PC Preview] unknow BUTT"
  }
  const ChannelRegion = {
    name: "[PC Preview] unknow name",
    countryCode: "[PC Preview] unknow countryCode",
    regionDepth: "[PC Preview] unknow regionDepth",
    prc: "[PC Preview] unknow prc",
    src: "[PC Preview] unknow src",
    trc: "[PC Preview] unknow trc"
  }
  const ChannelRate = {
    enUstvAll: "[PC Preview] unknow enUstvAll",
    enUstvFv: "[PC Preview] unknow enUstvFv",
    enUstvV: "[PC Preview] unknow enUstvV",
    enUstvS: "[PC Preview] unknow enUstvS",
    enUstvL: "[PC Preview] unknow enUstvL",
    enUstvD: "[PC Preview] unknow enUstvD",
    enMpaa: "[PC Preview] unknow enMpaa",
    enCaen: "[PC Preview] unknow enCaen",
    enCafr: "[PC Preview] unknow enCafr"
  }
  const ParentalContents = {
    PARENTAL_CONTENT_NONE: "[PC Preview] unknow PARENTAL_CONTENT_NONE",
    PARENTAL_CONTENT_DRUGS: "[PC Preview] unknow PARENTAL_CONTENT_DRUGS",
    PARENTAL_CONTENT_VIOLENCE: "[PC Preview] unknow PARENTAL_CONTENT_VIOLENCE",
    PARENTAL_CONTENT_VIOL_DRUG: "[PC Preview] unknow PARENTAL_CONTENT_VIOL_DRUG",
    PARENTAL_CONTENT_SEX: "[PC Preview] unknow PARENTAL_CONTENT_SEX",
    PARENTAL_CONTENT_SEX_DRUG: "[PC Preview] unknow PARENTAL_CONTENT_SEX_DRUG",
    PARENTAL_CONTENT_SEX_VIOL: "[PC Preview] unknow PARENTAL_CONTENT_SEX_VIOL",
    PARENTAL_CONTENT_SEX_VIOL_DRUG: "[PC Preview] unknow PARENTAL_CONTENT_SEX_VIOL_DRUG",
    PARENTAL_CONTENT_BUTT: "[PC Preview] unknow PARENTAL_CONTENT_BUTT"
  }
  const EPGEvent = {
    channelId: "[PC Preview] unknow channelId",
    eventId: "[PC Preview] unknow eventId",
    scramble: "[PC Preview] unknow scramble",
    parentLockLevel: "[PC Preview] unknow parentLockLevel",
    startTime: "[PC Preview] unknow startTime",
    endTime: "[PC Preview] unknow endTime",
    duration: "[PC Preview] unknow duration",
    eventName: "[PC Preview] unknow eventName",
    contentLevel1: "[PC Preview] unknow contentLevel1",
    contentLevel2: "[PC Preview] unknow contentLevel2",
    contentLevel3: "[PC Preview] unknow contentLevel3",
    contentLevel4: "[PC Preview] unknow contentLevel4",
    runningStatus: "[PC Preview] unknow runningStatus",
    shortDescription: "[PC Preview] unknow shortDescription",
    extendedDescription: "[PC Preview] unknow extendedDescription",
    booked: "[PC Preview] unknow booked",
    cridProgramme: "[PC Preview] unknow cridProgramme",
    cridSeries: "[PC Preview] unknow cridSeries",
    utcStartTime: "[PC Preview] unknow utcStartTime",
    utcEndTime: "[PC Preview] unknow utcEndTime"
  }
  const NetworkTypes = {
    NONE: "[PC Preview] unknow NONE",
    CABLE: "[PC Preview] unknow CABLE",
    SATELLITE: "[PC Preview] unknow SATELLITE",
    TERRESTRIAL: "[PC Preview] unknow TERRESTRIAL",
    ISDB_TER: "[PC Preview] unknow ISDB_TER",
    ATSC_T: "[PC Preview] unknow ATSC_T",
    DTMB: "[PC Preview] unknow DTMB",
    J83B: "[PC Preview] unknow J83B",
    RF: "[PC Preview] unknow RF",
    ATSC_CAB: "[PC Preview] unknow ATSC_CAB",
    ISDB_CAB: "[PC Preview] unknow ISDB_CAB"
  }
  const VersionTypes = {
    Version_1: "[PC Preview] unknow Version_1",
    Version_2: "[PC Preview] unknow Version_2",
    Version_all: "[PC Preview] unknow Version_all"
  }
  const TunerStatus = {
    UNLOCK: "[PC Preview] unknow UNLOCK",
    LOCK: "[PC Preview] unknow LOCK",
    UNKNOW: "[PC Preview] unknow UNKNOW"
  }
  const TimeShiftInfo = {
    recordTime: "[PC Preview] unknow recordTime",
    beginTimeSecond: "[PC Preview] unknow beginTimeSecond",
    playTimeSecond: "[PC Preview] unknow playTimeSecond",
    TERRESTRIAL: "[PC Preview] unknow TERRESTRIAL"
  }
  const TrickModes = {
    FAST_FORWARD_NORMAL: "[PC Preview] unknow FAST_FORWARD_NORMAL",
    FAST_FORWARD_TWO: "[PC Preview] unknow FAST_FORWARD_TWO",
    FAST_FORWARD_FOUR: "[PC Preview] unknow FAST_FORWARD_FOUR",
    FAST_FORWARD_EIGHT: "[PC Preview] unknow FAST_FORWARD_EIGHT",
    FAST_FORWARD_SIXTEEN: "[PC Preview] unknow FAST_FORWARD_SIXTEEN",
    FAST_FORWARD_THIRTYTWO: "[PC Preview] unknow FAST_FORWARD_THIRTYTWO",
    FAST_FORWARD_SIXTYFOUR: "[PC Preview] unknow FAST_FORWARD_SIXTYFOUR",
    FAST_BACKWARD_NORMAL: "[PC Preview] unknow FAST_BACKWARD_NORMAL",
    FAST_BACKWARD_TWO: "[PC Preview] unknow FAST_BACKWARD_TWO",
    FAST_BACKWARD_FOUR: "[PC Preview] unknow FAST_BACKWARD_FOUR",
    FAST_BACKWARD_EIGHT: "[PC Preview] unknow FAST_BACKWARD_EIGHT",
    FAST_BACKWARD_SIXTEEN: "[PC Preview] unknow FAST_BACKWARD_SIXTEEN",
    FAST_BACKWARD_THIRTYTWO: "[PC Preview] unknow FAST_BACKWARD_THIRTYTWO",
    FAST_BACKWARD_SIXTYFOUR: "[PC Preview] unknow FAST_BACKWARD_SIXTYFOUR",
    SLOW_FORWARD_TWO: "[PC Preview] unknow SLOW_FORWARD_TWO",
    SLOW_FORWARD_FOUR: "[PC Preview] unknow SLOW_FORWARD_FOUR",
    SLOW_FORWARD_EIGHT: "[PC Preview] unknow SLOW_FORWARD_EIGHT",
    SLOW_FORWARD_SIXTEEN: "[PC Preview] unknow SLOW_FORWARD_SIXTEEN",
    SLOW_FORWARD_THIRTYTWO: "[PC Preview] unknow SLOW_FORWARD_THIRTYTWO",
    SLOW_BACKWARD_TWO: "[PC Preview] unknow SLOW_BACKWARD_TWO",
    SLOW_BACKWARD_FOUR: "[PC Preview] unknow SLOW_BACKWARD_FOUR",
    SLOW_BACKWARD_EIGHT: "[PC Preview] unknow SLOW_BACKWARD_EIGHT",
    SLOW_BACKWARD_SIXTEEN: "[PC Preview] unknow SLOW_BACKWARD_SIXTEEN",
    SLOW_BACKWARD_THIRTYTWO: "[PC Preview] unknow SLOW_BACKWARD_THIRTYTWO",
    INVALID_TRICK_MODE: "[PC Preview] unknow INVALID_TRICK_MODE"
  }
  const PlayStatus = {
    STOP: "[PC Preview] unknow STOP",
    LIVEPLAY: "[PC Preview] unknow LIVEPLAY",
    TIMESHIFTPLAY: "[PC Preview] unknow TIMESHIFTPLAY",
    PAUSE: "[PC Preview] unknow PAUSE",
    IDLE: "[PC Preview] unknow IDLE",
    RELEASEPLAYRESOURCE: "[PC Preview] unknow RELEASEPLAYRESOURCE",
    PIPPLAY: "[PC Preview] unknow PIPPLAY",
    EWSPLAY: "[PC Preview] unknow EWSPLAY",
    INVALID: "[PC Preview] unknow INVALID"
  }
  const AudioComponent = {
    pid: "[PC Preview] unknow pid",
    type: "[PC Preview] unknow type",
    languageCode: "[PC Preview] unknow languageCode",
    audioTextDescription: "[PC Preview] unknow audioTextDescription",
    audioDescriptionType: "[PC Preview] unknow audioDescriptionType",
    audioTrackMode: "[PC Preview] unknow audioTrackMode",
    audioComponentTag: "[PC Preview] unknow audioComponentTag"
  }
  const AudioTrackModes = {
    AUDIO_TRACK_STEREO: "[PC Preview] unknow AUDIO_TRACK_STEREO",
    AUDIO_TRACK_DOUBLE_MONO: "[PC Preview] unknow AUDIO_TRACK_DOUBLE_MONO",
    AUDIO_TRACK_DOUBLE_LEFT: "[PC Preview] unknow AUDIO_TRACK_DOUBLE_LEFT",
    AUDIO_TRACK_DOUBLE_RIGHT: "[PC Preview] unknow AUDIO_TRACK_DOUBLE_RIGHT",
    AUDIO_TRACK_EXCHANGE: "[PC Preview] unknow AUDIO_TRACK_EXCHANGE",
    AUDIO_TRACK_ONLY_RIGHT: "[PC Preview] unknow AUDIO_TRACK_ONLY_RIGHT",
    AUDIO_TRACK_ONLY_LEFT: "[PC Preview] unknow AUDIO_TRACK_ONLY_LEFT",
    AUDIO_TRACK_MUTED: "[PC Preview] unknow AUDIO_TRACK_MUTED",
    AUDIO_TRACK_BUTT: "[PC Preview] unknow AUDIO_TRACK_BUTT"
  }
  const StopTypes = {
    FREEZE: "[PC Preview] unknow FREEZE",
    BLACKSCREEN: "[PC Preview] unknow BLACKSCREEN",
    STOP_TYPE_BUTT: "[PC Preview] unknow STOP_TYPE_BUTT"
  }
  const AudioTypes = {
    HI_DESC_AUDIO_UNDEFINED: "[PC Preview] unknow HI_DESC_AUDIO_UNDEFINED",
    HI_DESC_AUDIO_VISUAL_IMPAIRED_COMMENTARY: "[PC Preview] unknow HI_DESC_AUDIO_VISUAL_IMPAIRED_COMMENTARY",
    HI_DESC_AUDIO_HEARING_IMPAIRED: "[PC Preview] unknow HI_DESC_AUDIO_HEARING_IMPAIRED",
    HI_DESC_AUDIO_CLEAN_EFFACTS: "[PC Preview] unknow HI_DESC_AUDIO_CLEAN_EFFACTS"
  }
  const PlayInfo = {
    startVideoPlayStatus: "[PC Preview] unknow startVideoPlayStatus",
    startAudioPlayStatus: "[PC Preview] unknow startAudioPlayStatus",
    signalStatus: "[PC Preview] unknow signalStatus",
    caStatus: "[PC Preview] unknow caStatus",
    frontendDataStatus: "[PC Preview] unknow frontendDataStatus"
  }
  const SubtitleTypes = {
    SUBTITLE: "[PC Preview] unknow SUBTITLE",
    TELETEXT: "[PC Preview] unknow TELETEXT",
    CC: "[PC Preview] unknow CC"
  }
  const SubtComponentTypes = {
    NORMAL: "[PC Preview] unknow NORMAL",
    HOH: "[PC Preview] unknow HOH"
  }
  const TeletextComponent = {
    motor: "[PC Preview] unknow motor",
    magazingNum: "[PC Preview] unknow magazingNum",
    pageNum: "[PC Preview] unknow pageNum"
  }
  const TTXRegions = {
    TTX_REGION_WEST_EUROPE: "[PC Preview] unknow TTX_REGION_WEST_EUROPE",
    TTX_REGION_EAST_EUROPE: "[PC Preview] unknow TTX_REGION_EAST_EUROPE",
    TTX_REGION_RUSSIAN: "[PC Preview] unknow TTX_REGION_RUSSIAN",
    TTX_REGION_ARABIC: "[PC Preview] unknow TTX_REGION_ARABIC",
    TTX_REGION_FARSI: "[PC Preview] unknow TTX_REGION_FARSI",
    TTX_REGION_BUTT: "[PC Preview] unknow TTX_REGION_BUTT"
  }
  const Modulations = {
    QAM_AUTO: "[PC Preview] unknow QAM_AUTO",
    QAM4_NR: "[PC Preview] unknow QAM4_NR",
    QAM4: "[PC Preview] unknow QAM4",
    QAM16: "[PC Preview] unknow QAM16",
    QAM32: "[PC Preview] unknow QAM32",
    QAM64: "[PC Preview] unknow QAM64",
    QAM128: "[PC Preview] unknow QAM128",
    QAM256: "[PC Preview] unknow QAM256",
    QAM512: "[PC Preview] unknow QAM512",
    QAM640: "[PC Preview] unknow QAM640",
    QAM768: "[PC Preview] unknow QAM768",
    QAM896: "[PC Preview] unknow QAM896",
    QAM1024: "[PC Preview] unknow QAM1024",
    QPSK: "[PC Preview] unknow QPSK",
    BPSK: "[PC Preview] unknow BPSK",
    OQPSK: "[PC Preview] unknow OQPSK",
    MODU_8VSB: "[PC Preview] unknow MODU_8VSB",
    MODU_16VSB: "[PC Preview] unknow MODU_16VSB"
  }
  const Status = {
    RUNNING: "[PC Preview] unknow RUNNING",
    UNSTART: "[PC Preview] unknow UNSTART"
  }
  const PVRFileInfo = {
    fullPath: "[PC Preview] unknow fullPath",
    size: "[PC Preview] unknow size",
    duration: "[PC Preview] unknow duration",
    videoResolution: "[PC Preview] unknow videoResolution",
    audioComponents: "[PC Preview] unknow audioComponents",
    subtitleComponents: "[PC Preview] unknow subtitleComponents",
    isRadio: "[PC Preview] unknow isRadio"
  }
  const DtvSystems = {
    DVB_STANDARD: "[PC Preview] unknow DVB_STANDARD",
    ATSC_STANDARD: "[PC Preview] unknow ATSC_STANDARD"
  }

  const ClosedCaptionList = {
    listName: "[PC Preview] unknow listName",
    ccList: "[PC Preview] unknow ccList",
    listType: "[PC Preview] unknow listType",
    currentPosition: "[PC Preview] unknow currentPosition"
  }
  const ClosedCaptionComponent = {
    languageCode: "[PC Preview] unknow languageCode",
    enCCType: "[PC Preview] unknow enCCType",
    dataType: "[PC Preview] unknow dataType",
    currentPosition: "[PC Preview] unknow currentPosition"
  }
  const CCAnalogSelectors = {
    CC1: "[PC Preview] unknow CC1",
    CC2: "[PC Preview] unknow CC2",
    CC3: "[PC Preview] unknow CC3",
    CC4: "[PC Preview] unknow CC4",
    TEXT1: "[PC Preview] unknow TEXT1",
    TEXT2: "[PC Preview] unknow TEXT2",
    TEXT3: "[PC Preview] unknow TEXT3",
    TEXT4: "[PC Preview] unknow TEXT4"
  }
  const CCDigitalSelectors = {
    OFF: "[PC Preview] unknow OFF",
    SERVICE1: "[PC Preview] unknow SERVICE1",
    SERVICE2: "[PC Preview] unknow SERVICE2",
    SERVICE3: "[PC Preview] unknow SERVICE3",
    SERVICE4: "[PC Preview] unknow SERVICE4",
    SERVICE5: "[PC Preview] unknow SERVICE5",
    SERVICE6: "[PC Preview] unknow SERVICE6"
  }
  const FontSizes = {
    DEFAULT: "[PC Preview] unknow DEFAULT",
    SMALL: "[PC Preview] unknow SMALL",
    NORMAL: "[PC Preview] unknow NORMAL",
    LARGE: "[PC Preview] unknow LARGE"
  }
  const FontStyles = {
    DEFAULT: "[PC Preview] unknow DEFAULT",
    STYLE0: "[PC Preview] unknow STYLE0",
    STYLE1: "[PC Preview] unknow STYLE1",
    STYLE2: "[PC Preview] unknow STYLE2",
    STYLE3: "[PC Preview] unknow STYLE3",
    STYLE4: "[PC Preview] unknow STYLE4",
    STYLE5: "[PC Preview] unknow STYLE5",
    STYLE6: "[PC Preview] unknow STYLE6",
    STYLE7: "[PC Preview] unknow STYLE7"
  }
  const Colors = {
    DEFAULT: "[PC Preview] unknow DEFAULT",
    BLACK: "[PC Preview] unknow BLACK",
    RED: "[PC Preview] unknow RED",
    GREEN: "[PC Preview] unknow GREEN",
    BLUE: "[PC Preview] unknow BLUE",
    YELLOW: "[PC Preview] unknow YELLOW",
    MAGENTA: "[PC Preview] unknow MAGENTA",
    STYLE6: "[PC Preview] unknow STYLE6",
    CYAN: "[PC Preview] unknow CYAN"
  }
  const Opacities = {
    DEFAULT: "[PC Preview] unknow DEFAULT",
    SOLID: "[PC Preview] unknow SOLID",
    FLASHING: "[PC Preview] unknow FLASHING",
    TRANSLUCENT: "[PC Preview] unknow TRANSLUCENT",
    TRANSPARENT: "[PC Preview] unknow TRANSPARENT"
  }
  const FontEdgeEffects = {
    DEFAULT: "[PC Preview] unknow DEFAULT",
    NONE: "[PC Preview] unknow NONE",
    RAISED: "[PC Preview] unknow RAISED",
    DEPRESSED: "[PC Preview] unknow DEPRESSED",
    UNIFORM: "[PC Preview] unknow UNIFORM",
    LETF_DROP_SHADOW: "[PC Preview] unknow LETF_DROP_SHADOW",
    RIGHT_DROP_SHADOW: "[PC Preview] unknow RIGHT_DROP_SHADOW"
  }

  const result = {
    getBookManager: function () {
      console.warn("dtv.getBookManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return BookManager;
    },
    getChannelManager: function () {
      console.warn("dtv.getChannelManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return ChannelManager;
    },
    getAtvChannelManager: function () {
      console.warn("dtv.getAtvChannelManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return AtvChannelManager;
    },
    getParentalControlManager: function () {
      console.warn("dtv.getParentalControlManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return ParentalControlManager;
    },
    getConfigManager: function () {
      console.warn("dtv.getConfigManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return DTVConfigManager;
    },
    getEPGManager: function () {
      console.warn("dtv.getEPGManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return EPGManager;
    },
    getOTAManager: function () {
      console.warn("dtv.getOTAManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return OTAManager;
    },
    getHardwareManager: function () {
      console.warn("dtv.getHardwareManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return HardwareManager;
    },
    getNetworkManager: function () {
      console.warn("dtv.getNetworkManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return NetworkManager;
    },
    getPlayerManager: function () {
      console.warn("dtv.getPlayerManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return PlayerManager;
    },
    getRecorderManager: function () {
      console.warn("dtv.getRecorderManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return RecorderManager;
    },
    getPVRFilePlayer: function () {
      console.warn("dtv.getPVRFilePlayer interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return PVRFilePlayer;
    },
    getPVRFileManager: function () {
      console.warn("dtv.getPVRFileManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return PVRFileManager;
    },
    getDTVManager: function () {
      console.warn("dtv.getDTVManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return DTVManager;
    },
    getClosedCaptionManager: function () {
      console.warn("dtv.getClosedCaptionManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return ClosedCaptionManager;
    },
    getDtvEventManager: function () {
      console.warn("dtv.getDtvEventManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return DtvEventManager;
    }
  }

  const BookManager = {
    addTask: function (...args) {
      console.warn("BookManager.addTask interface mocked in the Previewer. How this interface works on the Previewer" +
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
    clearAllTasks: function (...args) {
      console.warn("BookManager.clearAllTasks interface mocked in the Previewer. How this interface works on the Previewer" +
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
    createTask: function (...args) {
      console.warn("BookManager.createTask interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BookTask);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BookTask);
        })
      }
    },
    deleteTask: function (...args) {
      console.warn("BookManager.deleteTask interface mocked in the Previewer. How this interface works on the Previewer" +
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
    updateTask: function (...args) {
      console.warn("BookManager.updateTask interface mocked in the Previewer. How this interface works on the Previewer" +
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
    findConflictTasks: function (...args) {
      console.warn("BookManager.findConflictTasks interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var bookTaskArray = new Array();
      bookTaskArray.push(BookTask);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, bookTaskArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(bookTaskArray);
        })
      }
    },
    getTaskByID: function (...args) {
      console.warn("BookManager.getTaskByID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var bookTaskArray = new Array();
      bookTaskArray.push(BookTask);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BookTask);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BookTask);
        })
      }
    },
    getAllTasks: function (...args) {
      console.warn("BookManager.getAllTasks interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var bookTaskArray = new Array();
      bookTaskArray.push(BookTask);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, bookTaskArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(bookTaskArray);
        })
      }
    },
    getComingTask: function (...args) {
      console.warn("BookManager.getComingTask interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BookTask);
      } else {
        return new Promise((resolve, reject) => {
          resolve(BookTask);
        })
      }
    }
  }
  const Channel = {
    getChannelName: function (...args) {
      console.warn("Channel.getChannelName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getFavTag: function (...args) {
      console.warn("Channel.getFavTag interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var favTagArray = new Array();
      favTagArray.push(FavTags);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, favTagArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(favTagArray);
        })
      }
    },
    getCaTag: function (...args) {
      console.warn("Channel.getCaTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTag: function (...args) {
      console.warn("Channel.getTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getVolume: function (...args) {
      console.warn("Channel.getVolume interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTrackMode: function (...args) {
      console.warn("Channel.getTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioTrackModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioTrackModes);
        })
      }
    },
    setChannelName: function (...args) {
      console.warn("Channel.setChannelName interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setFavTag: function (...args) {
      console.warn("Channel.setFavTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setTag: function (...args) {
      console.warn("Channel.setTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setVolume: function (...args) {
      console.warn("Channel.setVolume interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setTrackMode: function (...args) {
      console.warn("Channel.setTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRunningStatus: function (...args) {
      console.warn("Channel.getRunningStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getStatusTag: function (...args) {
      console.warn("Channel.getStatusTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setStatusTag: function (...args) {
      console.warn("Channel.setStatusTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSortTag: function (...args) {
      console.warn("Channel.setSortTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSortTag: function (...args) {
      console.warn("Channel.getSortTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannelID: function (...args) {
      console.warn("Channel.getChannelID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannelNo: function (...args) {
      console.warn("Channel.getChannelNo interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getNetWorkName: function (...args) {
      console.warn("Channel.getNetWorkName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  const ChannelList = {
    setFilter: function (...args) {
      console.warn("ChannelList.setFilter interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFilter: function (...args) {
      console.warn("ChannelList.getFilter interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelFilter);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelFilter);
        })
      }
    },
    getChannelCount: function (...args) {
      console.warn("ChannelList.getChannelCount interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannels: function (...args) {
      console.warn("ChannelList.getChannels interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelArray = new Array();
      channelArray.push(Channel);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelArray);
        })
      }
    },
    getChannelByIndex: function (...args) {
      console.warn("ChannelList.getChannelByIndex interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    setListName: function (...args) {
      console.warn("ChannelList.setListName interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getListName: function (...args) {
      console.warn("ChannelList.getListName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    move: function (...args) {
      console.warn("ChannelList.move interface mocked in the Previewer. How this interface works on the Previewer" +
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
    swap: function (...args) {
      console.warn("ChannelList.swap interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPosByChannelID: function (...args) {
      console.warn("ChannelList.getPosByChannelID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPosByChannelLcn: function (...args) {
      console.warn("ChannelList.getPosByChannelLcn interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getGroupType: function (...args) {
      console.warn("ChannelList.getGroupType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setChannelNameLang: function (...args) {
      console.warn("ChannelList.setChannelNameLang interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const ChannelManager = {
    getChannelByNo: function (...args) {
      console.warn("ChannelManager.getChannelByNo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getChannelById: function (...args) {
      console.warn("ChannelManager.getChannelById interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getTsInfoByID: function (...args) {
      console.warn("ChannelManager.getTsInfoByID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelTsInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelTsInfo);
        })
      }
    },
    importDBFromIniFile: function (...args) {
      console.warn("ChannelManager.importDBFromIniFile interface mocked in the Previewer. How this interface works on the Previewer" +
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
    exportDBToFile: function (...args) {
      console.warn("ChannelManager.exportDBToFile interface mocked in the Previewer. How this interface works on the Previewer" +
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
    importDBFromFile: function (...args) {
      console.warn("ChannelManager.importDBFromFile interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deleteAll: function (...args) {
      console.warn("ChannelManager.deleteAll interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deleteChannelByID: function (...args) {
      console.warn("ChannelManager.deleteChannelByID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    restoreChannelByID: function (...args) {
      console.warn("ChannelManager.restoreChannelByID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    delChannelByTag: function (...args) {
      console.warn("ChannelManager.delChannelByTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deleteChannelsByNetworkType: function (...args) {
      console.warn("ChannelManager.deleteChannelsByNetworkType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deleteChannelsBySIElement: function (...args) {
      console.warn("ChannelManager.deleteChannelsBySIElement interface mocked in the Previewer. How this interface works on the Previewer" +
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
    save: function (...args) {
      console.warn("ChannelManager.save interface mocked in the Previewer. How this interface works on the Previewer" +
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
    recover: function (...args) {
      console.warn("ChannelManager.recover interface mocked in the Previewer. How this interface works on the Previewer" +
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
    createChannel: function (...args) {
      console.warn("ChannelManager.createChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getChannelList: function (...args) {
      console.warn("ChannelManager.getChannelList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelList);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelList);
        })
      }
    },
    sort: function (...args) {
      console.warn("ChannelManager.sort interface mocked in the Previewer. How this interface works on the Previewer" +
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
    sortProgramView: function (...args) {
      console.warn("ChannelManager.sortProgramView interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDefaultOpenChannel: function (...args) {
      console.warn("ChannelManager.setDefaultOpenChannel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setChannelServiceTypeMode: function (...args) {
      console.warn("ChannelManager.setChannelServiceTypeMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    rebuildAllGroup: function (...args) {
      console.warn("ChannelManager.rebuildAllGroup interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannelServiceTypeMode: function (...args) {
      console.warn("ChannelManager.getChannelServiceTypeMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TVRadioFilters);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TVRadioFilters);
        })
      }
    },
    getChannelListByGroupType: function (...args) {
      console.warn("ChannelManager.getChannelListByGroupType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelList);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelList);
        })
      }
    },
    getDefaultOpenChannel: function (...args) {
      console.warn("ChannelManager.getDefaultOpenChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    setChannelServiceTypeMode: function (...args) {
      console.warn("ChannelManager.setChannelServiceTypeMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    rebuildAllGroup: function (...args) {
      console.warn("ChannelManager.rebuildAllGroup interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannelServiceTypeMode: function (...args) {
      console.warn("ChannelManager.getChannelServiceTypeMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TVRadioFilters);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TVRadioFilters);
        })
      }
    },
    getDefaultOpenGroupType: function (...args) {
      console.warn("ChannelManager.getDefaultOpenGroupType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getUseFavGroups: function (...args) {
      console.warn("ChannelManager.getUseFavGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelListArray = new Array();
      channelListArray.push(ChannelList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelListArray);
        })
      }
    },
    getUseStatalliteGroups: function (...args) {
      console.warn("ChannelManager.getUseStatalliteGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelListArray = new Array();
      channelListArray.push(ChannelList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelListArray);
        })
      }
    },
    getUseGroups: function (...args) {
      console.warn("ChannelManager.getUseGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelListArray = new Array();
      channelListArray.push(ChannelList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelListArray);
        })
      }
    },
    regenerateChannels: function (...args) {
      console.warn("ChannelManager.regenerateChannels interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setFavNetworkName: function (...args) {
      console.warn("ChannelManager.setFavNetworkName interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getLcnList: function (...args) {
      console.warn("ChannelManager.getLcnList interface mocked in the Previewer. How this interface works on the Previewer" +
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
    selectLcnList: function (...args) {
      console.warn("ChannelManager.selectLcnList interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getConflictLcnGroupNum: function (...args) {
      console.warn("ChannelManager.getConflictLcnGroupNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getConflictLcnChannelId: function (...args) {
      console.warn("ChannelManager.getConflictLcnChannelId interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRegionList: function (...args) {
      console.warn("ChannelManager.getRegionList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelRegionArray = new Array();
      channelRegionArray.push(ChannelRegion);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelRegionArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelRegionArray);
        })
      }
    },
    setRegionInfo: function (...args) {
      console.warn("ChannelManager.setRegionInfo interface mocked in the Previewer. How this interface works on the Previewer" +
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
    reAssignLcn: function (...args) {
      console.warn("ChannelManager.reAssignLcn interface mocked in the Previewer. How this interface works on the Previewer" +
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
    addUserChannel: function (...args) {
      console.warn("ChannelManager.addUserChannel interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const AnalogChannel = {
    enableAFT: function (...args) {
      console.warn("AnalogChannel.enableAFT interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isAFTEnable: function (...args) {
      console.warn("AnalogChannel.isAFTEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setColorSystem: function (...args) {
      console.warn("AnalogChannel.setColorSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getColorSystem: function (...args) {
      console.warn("AnalogChannel.getColorSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getOriginalColorSystem: function (...args) {
      console.warn("AnalogChannel.getOriginalColorSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAudioSystem: function (...args) {
      console.warn("AnalogChannel.setAudioSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioSystem: function (...args) {
      console.warn("AnalogChannel.getAudioSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setMtsMode: function (...args) {
      console.warn("AnalogChannel.setMtsMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMtsMode: function (...args) {
      console.warn("AnalogChannel.getMtsMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const AtvChannelManager = {
    createChannel: function (...args) {
      console.warn("AtvChannelManager.createChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AnalogChannel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AnalogChannel);
        })
      }
    },
    getChannelByID: function (...args) {
      console.warn("AtvChannelManager.getChannelByID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AnalogChannel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AnalogChannel);
        })
      }
    },
    getAllChannelList: function (...args) {
      console.warn("AtvChannelManager.getAllChannelList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelList);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelList);
        })
      }
    },
    getChannelList: function (...args) {
      console.warn("AtvChannelManager.getChannelList interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelList);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelList);
        })
      }
    },
    deleteAll: function (...args) {
      console.warn("AtvChannelManager.deleteAll interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deleteChannelByID: function (...args) {
      console.warn("AtvChannelManager.deleteChannelByID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDefaultOpenChannel: function (...args) {
      console.warn("AtvChannelManager.getDefaultOpenChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AnalogChannel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AnalogChannel);
        })
      }
    },
    getUseGroups: function (...args) {
      console.warn("AtvChannelManager.getUseGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelListArray = new Array();
      channelListArray.push(ChannelList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelListArray);
        })
      }
    },
    getUseFavGroups: function (...args) {
      console.warn("AtvChannelManager.getUseFavGroups interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var channelListArray = new Array();
      channelListArray.push(ChannelList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, channelListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(channelListArray);
        })
      }
    }
  }
  const RRTInfo = {
    getRRTDimensionsNum: function (...args) {
      console.warn("RRTInfo.getRRTDimensionsNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRRTDimensionName: function (...args) {
      console.warn("RRTInfo.getRRTDimensionName interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRRTDimensionTypeNum: function (...args) {
      console.warn("RRTInfo.getRRTDimensionTypeNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRRTDimensionValueName: function (...args) {
      console.warn("RRTInfo.getRRTDimensionValueName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  const ParentalControlManager = {
    setParentalRateUstvAllTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvAllTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateUstvFvTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvFvTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateUstvVTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvVTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateUstvSTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvSTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateUstvLTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvLTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateUstvDTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateUstvDTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateMpaaTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateMpaaTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateCaenTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateCaenTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRateCafrTypes: function (...args) {
      console.warn("ParentalControlManager.setParentalRateCafrTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentalRate: function (...args) {
      console.warn("ParentalControlManager.setParentalRate interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvAllTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvAllTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvFvTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvFvTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvVTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvVTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvSTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvSTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvLTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvLTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateUstvDTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateUstvDTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateMpaaTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateMpaaTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateCaenTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateCaenTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRateCafrTypes: function (...args) {
      console.warn("ParentalControlManager.getParentalRateCafrTypes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalRate: function (...args) {
      console.warn("ParentalControlManager.getParentalRate interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannelParental: function (...args) {
      console.warn("ParentalControlManager.getChannelParental interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ChannelRate);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ChannelRate);
        })
      }
    },
    getChannelParentalChannel: function (...args) {
      console.warn("ParentalControlManager.getChannelParentalChannel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParental: function (...args) {
      console.warn("ParentalControlManager.getParental interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentalContent: function (...args) {
      console.warn("ParentalControlManager.getParentalContent interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ParentalContents);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ParentalContents);
        })
      }
    },
    getParentalStatus: function (...args) {
      console.warn("ParentalControlManager.getParentalStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRRT: function (...args) {
      console.warn("ParentalControlManager.getRRT interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, RRTInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(RRTInfo);
        })
      }
    },
    resetRRT: function (...args) {
      console.warn("ParentalControlManager.resetRRT interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getParentLockAge: function (...args) {
      console.warn("ParentalControlManager.getParentLockAge interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setParentLockAge: function (...args) {
      console.warn("ParentalControlManager.setParentLockAge interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const DTVConfigManager = {
    setString: function (...args) {
      console.warn("DTVConfigManager.setString interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setInt: function (...args) {
      console.warn("DTVConfigManager.setInt interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getString: function (...args) {
      console.warn("DTVConfigManager.getString interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getInt: function (...args) {
      console.warn("DTVConfigManager.getInt interface mocked in the Previewer. How this interface works on the Previewer" +
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
    restoreDefaultConfig: function (...args) {
      console.warn("DTVConfigManager.restoreDefaultConfig interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getConfigFileInt: function (...args) {
      console.warn("DTVConfigManager.getConfigFileInt interface mocked in the Previewer. How this interface works on the Previewer" +
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
    switchTunerSignal: function (...args) {
      console.warn("DTVConfigManager.switchTunerSignal interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const EPGManager = {
    setEventLang: function (...args) {
      console.warn("EPGManager.setEventLang interface mocked in the Previewer. How this interface works on the Previewer" +
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
    startEpg: function (...args) {
      console.warn("EPGManager.startEpg interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPresentEvent: function (...args) {
      console.warn("EPGManager.getPresentEvent interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EPGEvent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EPGEvent);
        })
      }
    },
    getFollowEvent: function (...args) {
      console.warn("EPGManager.getFollowEvent interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EPGEvent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EPGEvent);
        })
      }
    },
    getEvents: function (...args) {
      console.warn("EPGManager.getEvents interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var ePGEventArray = new Array();
      ePGEventArray.push(EPGEvent);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ePGEventArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ePGEventArray);
        })
      }
    },
    getEventById: function (...args) {
      console.warn("EPGManager.getEventById interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EPGEvent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EPGEvent);
        })
      }
    },
    getRelevantEvents: function (...args) {
      console.warn("EPGManager.getEventById interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EPGEvent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EPGEvent);
        })
      }
    }
  }
  const OTAManager = {
    startOta: function (...args) {
      console.warn("OTAManager.startOta interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopOta: function (...args) {
      console.warn("OTAManager.stopOta interface mocked in the Previewer. How this interface works on the Previewer" +
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
    startDownloadFile: function (...args) {
      console.warn("OTAManager.startDownloadFile interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopDownloadFile: function (...args) {
      console.warn("OTAManager.stopDownloadFile interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const Motor = {
    setLimit: function (...args) {
      console.warn("Motor.setLimit interface mocked in the Previewer. How this interface works on the Previewer" +
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
    move: function (...args) {
      console.warn("Motor.move interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopMove: function (...args) {
      console.warn("Motor.stopMove interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAutoRolationSwitch: function (...args) {
      console.warn("Motor.setAutoRolationSwitch interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const Multiplex = {
    getBelongNetwork: function (...args) {
      console.warn("Multiplex.getBelongNetwork interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Network);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Network);
        })
      }
    },
    getID: function (...args) {
      console.warn("Multiplex.getID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFrequency: function (...args) {
      console.warn("Multiplex.getFrequency interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setFrequency: function (...args) {
      console.warn("Multiplex.setFrequency interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getVersion: function (...args) {
      console.warn("Multiplex.getVersion interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, VersionTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(VersionTypes);
        })
      }
    },
    setVersion: function (...args) {
      console.warn("Multiplex.setVersion interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getName: function (...args) {
      console.warn("Multiplex.getName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getBandWidth: function (...args) {
      console.warn("Multiplex.getBandWidth interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSymbolRate: function (...args) {
      console.warn("Multiplex.getSymbolRate interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getModulation: function (...args) {
      console.warn("Multiplex.getModulation interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPolarity: function (...args) {
      console.warn("Multiplex.getPolarity interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const Tuner = {
    getSignalStrength: function (...args) {
      console.warn("Tuner.getSignalStrength interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSignalQuality: function (...args) {
      console.warn("Tuner.getSignalQuality interface mocked in the Previewer. How this interface works on the Previewer" +
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
    connect: function (...args) {
      console.warn("Tuner.connect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    disconnect: function (...args) {
      console.warn("Tuner.disconnect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBER: function (...args) {
      console.warn("Tuner.getBER interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSNR: function (...args) {
      console.warn("Tuner.getSNR interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSignalType: function (...args) {
      console.warn("Tuner.getSignalType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetworkTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkTypes);
        })
      }
    },
    getTunerID: function (...args) {
      console.warn("Tuner.getTunerID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetworkTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkTypes);
        })
      }
    },
    getTuningMultiplexe: function (...args) {
      console.warn("Tuner.getTuningMultiplexe interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Multiplex);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Multiplex);
        })
      }
    },
    getTunerStatus: function (...args) {
      console.warn("Tuner.getTunerStatus interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TunerStatus);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TunerStatus);
        })
      }
    },
    getModulation: function (...args) {
      console.warn("Tuner.getModulation interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Modulations);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Modulations);
        })
      }
    }
  }
  const HardwareManager = {
    getMotor: function (...args) {
      console.warn("HardwareManager.getMotor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Motor);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Motor);
        })
      }
    },
    getTunerNum: function (...args) {
      console.warn("HardwareManager.getTunerNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAllTuners: function (...args) {
      console.warn("HardwareManager.getAllTuners interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var tunerArray = new Array();
      tunerArray.push(Tuner);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, tunerArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(tunerArray);
        })
      }
    },
    getTunersByStatus: function (...args) {
      console.warn("HardwareManager.getTunersByStatus interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var tunerArray = new Array();
      tunerArray.push(Tuner);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, tunerArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(tunerArray);
        })
      }
    },
    getTunerByID: function (...args) {
      console.warn("HardwareManager.getTunerByID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Tuner);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Tuner);
        })
      }
    }
  }
  const Network = {
    getID: function (...args) {
      console.warn("Network.getID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMultiplexes: function (...args) {
      console.warn("Network.getMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var multiplexArray = new Array();
      multiplexArray.push(Multiplex);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, multiplexArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(multiplexArray);
        })
      }
    },
    setScanMultiplexes: function (...args) {
      console.warn("Network.setScanMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getScanMultiplexes: function (...args) {
      console.warn("Network.getScanMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var multiplexArray = new Array();
      multiplexArray.push(Multiplex);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, multiplexArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(multiplexArray);
        })
      }
    },
    createMultiplex: function (...args) {
      console.warn("Network.createMultiplex interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Multiplex);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Multiplex);
        })
      }
    },
    createTmpMultiplex: function (...args) {
      console.warn("Network.createTmpMultiplex interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Multiplex);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Multiplex);
        })
      }
    },
    getPresetMultiplexes: function (...args) {
      console.warn("Network.getPresetMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var multiplexArray = new Array();
      multiplexArray.push(Multiplex);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, multiplexArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(multiplexArray);
        })
      }
    },
    getMultiplexById: function (...args) {
      console.warn("Network.getMultiplexById interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Multiplex);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Multiplex);
        })
      }
    },
    removeMultiplex: function (...args) {
      console.warn("Network.removeMultiplex interface mocked in the Previewer. How this interface works on the Previewer" +
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
    saveMultiplexes: function (...args) {
      console.warn("Network.saveMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    recoverMultiplexes: function (...args) {
      console.warn("Network.recoverMultiplexes interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isSelected: function (...args) {
      console.warn("Network.isSelected interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSelect: function (...args) {
      console.warn("Network.setSelect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getNetworkNameList: function (...args) {
      console.warn("Network.getNetworkNameList interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const TimeManager = {
    getCalendarTime: function (...args) {
      console.warn("TimeManager.getCalendarTime interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    setCalendarTime: function (...args) {
      console.warn("TimeManager.setCalendarTime interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    getTimeZone: function (...args) {
      console.warn("TimeManager.getTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setTimeZone: function (...args) {
      console.warn("TimeManager.setTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
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
    secondToDate: function (...args) {
      console.warn("TimeManager.secondToDate interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    dateToSecond: function (...args) {
      console.warn("TimeManager.dateToSecond interface mocked in the Previewer. How this interface works on the Previewer" +
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
    syncTime: function (...args) {
      console.warn("TimeManager.syncTime interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSyncTimeFlag: function (...args) {
      console.warn("TimeManager.getSyncTimeFlag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    syncTimeZone: function (...args) {
      console.warn("TimeManager.syncTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSyncTimeZoneFlag: function (...args) {
      console.warn("TimeManager.getSyncTimeZoneFlag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSleepTime: function (...args) {
      console.warn("TimeManager.getSleepTime interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setWakeupInternal: function (...args) {
      console.warn("TimeManager.setWakeupInternal interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setTimeToSystem: function (...args) {
      console.warn("TimeManager.setTimeToSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    syncDaylight: function (...args) {
      console.warn("TimeManager.syncDaylight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSyncDaylightFlag: function (...args) {
      console.warn("TimeManager.getSyncDaylightFlag interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDaylight: function (...args) {
      console.warn("TimeManager.setDaylight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDaylight: function (...args) {
      console.warn("TimeManager.getDaylight interface mocked in the Previewer. How this interface works on the Previewer" +
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
  }
  const NetworkManager = {
    getAllSupportNetworks: function (...args) {
      console.warn("NetworkManager.getAllSupportNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var networkArray = new Array();
      networkArray.push(Network);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, networkArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(networkArray);
        })
      }
    },
    getNetworks: function (...args) {
      console.warn("NetworkManager.getNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var networkArray = new Array();
      networkArray.push(Network);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, networkArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(networkArray);
        })
      }
    },
    getNetworks: function (...args) {
      console.warn("NetworkManager.getNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var networkArray = new Array();
      networkArray.push(Network);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, networkArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(networkArray);
        })
      }
    },
    getCurrentNetworkType: function (...args) {
      console.warn("NetworkManager.getCurrentNetworkType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, NetworkTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(NetworkTypes);
        })
      }
    },
    setCurrentNetworkType: function (...args) {
      console.warn("NetworkManager.setCurrentNetworkType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    createNetwork: function (...args) {
      console.warn("NetworkManager.createNetwork interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Network);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Network);
        })
      }
    },
    getNetworkById: function (...args) {
      console.warn("NetworkManager.getNetworkById interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Network);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Network);
        })
      }
    },
    removeNetwork: function (...args) {
      console.warn("NetworkManager.removeNetwork interface mocked in the Previewer. How this interface works on the Previewer" +
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
    removeAllSatellite: function (...args) {
      console.warn("NetworkManager.removeAllSatellite interface mocked in the Previewer. How this interface works on the Previewer" +
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
    clearNetworks: function (...args) {
      console.warn("NetworkManager.clearNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
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
    saveNetworks: function (...args) {
      console.warn("NetworkManager.saveNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
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
    recoverNetworks: function (...args) {
      console.warn("NetworkManager.recoverNetworks interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTimeManager: function (...args) {
      console.warn("NetworkManager.getTimeManager interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TimeManager);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TimeManager);
        })
      }
    },
    setNetworkType: function (...args) {
      console.warn("NetworkManager.setNetworkType interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const SubtitleComponent = {
    getLanguageCode: function (...args) {
      console.warn("SubtitleComponent.getLanguageCode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getSubtitleType: function (...args) {
      console.warn("SubtitleComponent.getSubtitleType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SubtitleTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SubtitleTypes);
        })
      }
    },
    getSubtComponentType: function (...args) {
      console.warn("SubtitleComponent.getSubtComponentType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SubtComponentTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SubtComponentTypes);
        })
      }
    },
    getPID: function (...args) {
      console.warn("SubtitleComponent.getPID interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMagazingNum: function (...args) {
      console.warn("SubtitleComponent.getMagazingNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPageNum: function (...args) {
      console.warn("SubtitleComponent.getPageNum interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getPos: function (...args) {
      console.warn("SubtitleComponent.getPos interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isHdSubtitle: function (...args) {
      console.warn("SubtitleComponent.isHdSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSubtComponentTag: function (...args) {
      console.warn("SubtitleComponent.getSubtComponentTag interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const TeletextControl = {
    showTTX: function (...args) {
      console.warn("TeletextControl.showTTX interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isTTXVisible: function (...args) {
      console.warn("TeletextControl.isTTXVisible interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isTTXAvailable: function (...args) {
      console.warn("TeletextControl.isTTXAvailable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentTTX: function (...args) {
      console.warn("TeletextControl.getCurrentTTX interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TeletextComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TeletextComponent);
        })
      }
    },
    setCommand: function (...args) {
      console.warn("TeletextControl.setCommand interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setTTXLanguage: function (...args) {
      console.warn("TeletextControl.setTTXLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTTXLanguage: function (...args) {
      console.warn("TeletextControl.getTTXLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    setTTXRegion: function (...args) {
      console.warn("TeletextControl.setTTXRegion interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTTXRegion: function (...args) {
      console.warn("TeletextControl.getTTXRegion interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TTXRegions);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TTXRegions);
        })
      }
    },
    showHbbtvTtxApp: function (...args) {
      console.warn("TeletextControl.showHbbtvTtxApp interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isHbbtvTtxAppVisible: function (...args) {
      console.warn("TeletextControl.isHbbtvTtxAppVisible interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isHbbtvTtxAppAvailable: function (...args) {
      console.warn("TeletextControl.isHbbtvTtxAppAvailable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    showSubtitle: function (...args) {
      console.warn("TeletextControl.showSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const AdControl = {
    setAdEnable: function (...args) {
      console.warn("AdControl.setAdEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isAdEnable: function (...args) {
      console.warn("AdControl.isAdEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAdBalance: function (...args) {
      console.warn("AdControl.setAdBalance interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAdBalance: function (...args) {
      console.warn("AdControl.getAdBalance interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAdToSomePort: function (...args) {
      console.warn("AdControl.setAdToSomePort interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isAdToSomePort: function (...args) {
      console.warn("AdControl.isAdToSomePort interface mocked in the Previewer. How this interface works on the Previewer" +
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
  }
  const Ginga = {
    init: function (...args) {
      console.warn("Ginga.init interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deinit: function (...args) {
      console.warn("Ginga.deinit interface mocked in the Previewer. How this interface works on the Previewer" +
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
    dispatchKey: function (...args) {
      console.warn("Ginga.dispatchKey interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAppList: function (...args) {
      console.warn("Ginga.getAppList interface mocked in the Previewer. How this interface works on the Previewer" +
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
    startApp: function (...args) {
      console.warn("Ginga.startApp interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setGraphicSurface: function (...args) {
      console.warn("Ginga.setGraphicSurface interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const Player = {
    showVideo: function (...args) {
      console.warn("Player.showVideo interface mocked in the Previewer. How this interface works on the Previewer" +
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
    freezeVideo: function (...args) {
      console.warn("Player.freezeVideo interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isVideoFrozen: function (...args) {
      console.warn("Player.isVideoFrozen interface mocked in the Previewer. How this interface works on the Previewer" +
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
    changeChannel: function (...args) {
      console.warn("Player.changeChannel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopSync: function (...args) {
      console.warn("Player.stopSync interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentChannel: function (...args) {
      console.warn("Player.getCurrentChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getReplaceChannel: function (...args) {
      console.warn("Player.getReplaceChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getPreviousChannel: function (...args) {
      console.warn("Player.getPreviousChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    setTimeShiftEncryption: function (...args) {
      console.warn("Player.setTimeShiftEncryption interface mocked in the Previewer. How this interface works on the Previewer" +
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
    play: function (...args) {
      console.warn("Player.play interface mocked in the Previewer. How this interface works on the Previewer" +
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
    pause: function (...args) {
      console.warn("Player.pause interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTimeShiftInfo: function (...args) {
      console.warn("Player.getTimeShiftInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TimeShiftInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TimeShiftInfo);
        })
      }
    },
    startTimeShift: function (...args) {
      console.warn("Player.startTimeShift interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopTimeShift: function (...args) {
      console.warn("Player.stopTimeShift interface mocked in the Previewer. How this interface works on the Previewer" +
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
    seek: function (...args) {
      console.warn("Player.seek interface mocked in the Previewer. How this interface works on the Previewer" +
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
    trickPlay: function (...args) {
      console.warn("Player.trickPlay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTrickMode: function (...args) {
      console.warn("Player.getTrickMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TrickModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TrickModes);
        })
      }
    },
    getStatus: function (...args) {
      console.warn("Player.getStatus interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PlayStatus);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PlayStatus);
        })
      }
    },
    setMute: function (...args) {
      console.warn("Player.setMute interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getMuteStatus: function (...args) {
      console.warn("Player.getMuteStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDisplay: function (...args) {
      console.warn("Player.setDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    clearDisplay: function (...args) {
      console.warn("Player.clearDisplay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentAudioComponents: function (...args) {
      console.warn("Player.getCurrentAudioComponents interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var audioComponentArray = new Array();
      audioComponentArray.push(AudioComponent);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, audioComponentArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(audioComponentArray);
        })
      }
    },
    selectAudio: function (...args) {
      console.warn("Player.selectAudio interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentAudio: function (...args) {
      console.warn("Player.getCurrentAudio interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioComponent);
        })
      }
    },
    showSubtitle: function (...args) {
      console.warn("Player.showSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isSubtitleVisible: function (...args) {
      console.warn("Player.isSubtitleVisible interface mocked in the Previewer. How this interface works on the Previewer" +
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
    pauseSubtitle: function (...args) {
      console.warn("Player.pauseSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resumeSubtitle: function (...args) {
      console.warn("Player.resumeSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSubtitleHiAvailable: function (...args) {
      console.warn("Player.setSubtitleHiAvailable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSubtitleHiStatus: function (...args) {
      console.warn("Player.setSubtitleHiStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSubtitleHiStatus: function (...args) {
      console.warn("Player.getSubtitleHiStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSubtitleLanguage: function (...args) {
      console.warn("Player.setSubtitleLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
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
    selectSubtitle: function (...args) {
      console.warn("Player.selectSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSurface: function (...args) {
      console.warn("Player.setSurface interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentSubtitle: function (...args) {
      console.warn("Player.getCurrentSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SubtitleComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SubtitleComponent);
        })
      }
    },
    getTeletextControl: function (...args) {
      console.warn("Player.getTeletextControl interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TeletextControl);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TeletextControl);
        })
      }
    },
    releaseResource: function (...args) {
      console.warn("Player.releaseResource interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resumeResource: function (...args) {
      console.warn("Player.resumeResource interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setWindowRect: function (...args) {
      console.warn("Player.setWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
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
      console.warn("Player.getWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    setClipRect: function (...args) {
      console.warn("Player.setClipRect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getClipRect: function (...args) {
      console.warn("Player.getClipRect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    snapshot: function (...args) {
      console.warn("Player.snapshot interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTuner: function (...args) {
      console.warn("Player.getTuner interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Tuner);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Tuner);
        })
      }
    },
    setZOrder: function (...args) {
      console.warn("Player.setZOrder interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAudioTrackMode: function (...args) {
      console.warn("Player.setAudioTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAudioLanguage: function (...args) {
      console.warn("Player.setAudioLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioTrackMode: function (...args) {
      console.warn("Player.getAudioTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioTrackModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioTrackModes);
        })
      }
    },
    setStopMode: function (...args) {
      console.warn("Player.setStopMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getStopMode: function (...args) {
      console.warn("Player.getStopMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, StopTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(StopTypes);
        })
      }
    },
    getVideoResolutionHeight: function (...args) {
      console.warn("Player.getVideoResolutionHeight interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getVideoResolutionWidth: function (...args) {
      console.warn("Player.getVideoResolutionWidth interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFPS: function (...args) {
      console.warn("Player.getFPS interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setVolume: function (...args) {
      console.warn("Player.setVolume interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getVolume: function (...args) {
      console.warn("Player.getVolume interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stopAudioStreamOutput: function (...args) {
      console.warn("Player.stopAudioStreamOutput interface mocked in the Previewer. How this interface works on the Previewer" +
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
    startAudioStreamOutput: function (...args) {
      console.warn("Player.startAudioStreamOutput interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDolbyInfoStreamType: function (...args) {
      console.warn("Player.getDolbyInfoStreamType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDolbyInfoAcmod: function (...args) {
      console.warn("Player.getDolbyInfoAcmod interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDolbyRange: function (...args) {
      console.warn("Player.setDolbyRange interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDRARawChannel: function (...args) {
      console.warn("Player.getDRARawChannel interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAdControl: function (...args) {
      console.warn("Player.getAdControl interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AdControl);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AdControl);
        })
      }
    },
    ewsActionControl: function (...args) {
      console.warn("Player.ewsActionControl interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getGinga: function (...args) {
      console.warn("Player.getGinga interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Ginga);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Ginga);
        })
      }
    },
    getSupportStatus: function (...args) {
      console.warn("Player.getSupportStatus interface mocked in the Previewer. How this interface works on the Previewer" +
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
    switchToBarkerChannelFreSync: function (...args) {
      console.warn("Player.switchToBarkerChannelFreSync interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAvFramePlaying: function (...args) {
      console.warn("Player.getAvFramePlaying interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTimeShiftAudioComponents: function (...args) {
      console.warn("Player.getTimeShiftAudioComponents interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var audioComponentArray = new Array();
      audioComponentArray.push(AudioComponent);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, audioComponentArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(audioComponentArray);
        })
      }
    },
    selectTimeShiftAudio: function (...args) {
      console.warn("Player.selectTimeShiftAudio interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSubtitleFirSecLang: function (...args) {
      console.warn("Player.getSubtitleFirSecLang interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioFirSecLang: function (...args) {
      console.warn("Player.getAudioFirSecLang interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAudioType: function (...args) {
      console.warn("Player.setAudioType interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioType: function (...args) {
      console.warn("Player.getAudioType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioTypes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioTypes);
        })
      }
    },
    getCurrentPlayInfo: function (...args) {
      console.warn("Player.getCurrentPlayInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PlayInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PlayInfo);
        })
      }
    },
  }
  const PlayerManager = {
    createPlayer: function (...args) {
      console.warn("PlayerManager.createPlayer interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Player);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Player);
        })
      }
    },
    getPlayers: function (...args) {
      console.warn("PlayerManager.getPlayers interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var playerArray = new Array();
      playerArray.push(Player);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, playerArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(playerArray);
        })
      }
    },
    destroyPlayer: function (...args) {
      console.warn("PlayerManager.destroyPlayer interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const Recorder = {
    start: function (...args) {
      console.warn("Recorder.start interface mocked in the Previewer. How this interface works on the Previewer" +
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
    startpvrEncryption: function (...args) {
      console.warn("Recorder.startpvrEncryption interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getChannel: function (...args) {
      console.warn("Recorder.getChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    },
    getRecordFile: function (...args) {
      console.warn("Recorder.getRecordFile interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var objectArray = new Array();
      objectArray.push(paramMock.paramObjectMock);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, objectArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(objectArray);
        })
      }
    },
    stop: function (...args) {
      console.warn("Recorder.stop interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTuner: function (...args) {
      console.warn("Recorder.getTuner interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Tuner);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Tuner);
        })
      }
    },
    getAlreadyRecordTime: function (...args) {
      console.warn("Recorder.getAlreadyRecordTime interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDuration: function (...args) {
      console.warn("Recorder.getDuration interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRecordStatus: function (...args) {
      console.warn("Recorder.getRecordStatus interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Status);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Status);
        })
      }
    },
  }
  const RecorderManager = {
    createRecorder: function (...args) {
      console.warn("RecorderManager.createRecorder interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Recorder);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Recorder);
        })
      }
    },
    getAllRecorders: function (...args) {
      console.warn("RecorderManager.getAllRecorders interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Recorder);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Recorder);
        })
      }
    },
    destroyRecorder: function (...args) {
      console.warn("RecorderManager.destroyRecorder interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const PVRFilePlayer = {
    start: function (...args) {
      console.warn("PVRFilePlayer.start interface mocked in the Previewer. How this interface works on the Previewer" +
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
    start: function (...args) {
      console.warn("PVRFilePlayer.start interface mocked in the Previewer. How this interface works on the Previewer" +
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
    stop: function (...args) {
      console.warn("PVRFilePlayer.stop interface mocked in the Previewer. How this interface works on the Previewer" +
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
    pause: function (...args) {
      console.warn("PVRFilePlayer.pause interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resume: function (...args) {
      console.warn("PVRFilePlayer.resume interface mocked in the Previewer. How this interface works on the Previewer" +
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
    trickPlay: function (...args) {
      console.warn("PVRFilePlayer.trickPlay interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentTrickMode: function (...args) {
      console.warn("PVRFilePlayer.getCurrentTrickMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TrickModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TrickModes);
        })
      }
    },
    seekTo: function (...args) {
      console.warn("PVRFilePlayer.seekTo interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentAudio: function (...args) {
      console.warn("PVRFilePlayer.getCurrentAudio interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioComponent);
        })
      }
    },
    selectAudio: function (...args) {
      console.warn("PVRFilePlayer.selectAudio interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCurrentSubtitle: function (...args) {
      console.warn("PVRFilePlayer.getCurrentSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SubtitleComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SubtitleComponent);
        })
      }
    },
    getSubtitleComponents: function (...args) {
      console.warn("PVRFilePlayer.getSubtitleComponents interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var subtitleComponentArray = new Array();
      subtitleComponentArray.push(SubtitleComponent);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, subtitleComponentArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(subtitleComponentArray);
        })
      }
    },
    selectSubtitle: function (...args) {
      console.warn("PVRFilePlayer.selectSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    showSubtitle: function (...args) {
      console.warn("PVRFilePlayer.showSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isSubtitleVisible: function (...args) {
      console.warn("PVRFilePlayer.isSubtitleVisible interface mocked in the Previewer. How this interface works on the Previewer" +
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
    pauseSubtitle: function (...args) {
      console.warn("PVRFilePlayer.pauseSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resumeSubtitle: function (...args) {
      console.warn("PVRFilePlayer.resumeSubtitle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getTeletextControl: function (...args) {
      console.warn("PVRFilePlayer.getTeletextControl interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, TeletextControl);
      } else {
        return new Promise((resolve, reject) => {
          resolve(TeletextControl);
        })
      }
    },
    getCurrentPosition: function (...args) {
      console.warn("PVRFilePlayer.getCurrentPosition interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSurface: function (...args) {
      console.warn("PVRFilePlayer.setSurface interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setWindowRect: function (...args) {
      console.warn("PVRFilePlayer.setWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
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
      console.warn("PVRFilePlayer.getWindowRect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
      }
    },
    getPVRFileInfo: function (...args) {
      console.warn("PVRFilePlayer.getPVRFileInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PVRFileInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PVRFileInfo);
        })
      }
    },
    setAudioTrackMode: function (...args) {
      console.warn("PVRFilePlayer.setAudioTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAudioTrackMode: function (...args) {
      console.warn("PVRFilePlayer.getAudioTrackMode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioTrackModes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioTrackModes);
        })
      }
    },
    getCurrentChannel: function (...args) {
      console.warn("PVRFilePlayer.getCurrentChannel interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Channel);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Channel);
        })
      }
    }
  }
  const PVRFileManager = {
    delete: function (...args) {
      console.warn("PVRFileManager.delete interface mocked in the Previewer. How this interface works on the Previewer" +
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
    rename: function (...args) {
      console.warn("PVRFileManager.rename interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setUserData: function (...args) {
      console.warn("PVRFileManager.setUserData interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getUserData: function (...args) {
      console.warn("PVRFileManager.getUserData interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  const DTVManager = {
    prepareDTV: function (...args) {
      console.warn("DTVManager.prepareDTV interface mocked in the Previewer. How this interface works on the Previewer" +
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
    unPrepareDTV: function (...args) {
      console.warn("DTVManager.unPrepareDTV interface mocked in the Previewer. How this interface works on the Previewer" +
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
    releaseDTVMem: function (...args) {
      console.warn("DTVManager.releaseDTVMem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    resumeDTVMem: function (...args) {
      console.warn("DTVManager.resumeDTVMem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    onStandby: function (...args) {
      console.warn("DTVManager.onStandby interface mocked in the Previewer. How this interface works on the Previewer" +
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
    onWakeup: function (...args) {
      console.warn("DTVManager.onWakeup interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setCountry: function (...args) {
      console.warn("DTVManager.setCountry interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getCountry: function (...args) {
      console.warn("DTVManager.getCountry interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    setAreaCode: function (...args) {
      console.warn("DTVManager.setAreaCode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAreaCode: function (...args) {
      console.warn("DTVManager.getAreaCode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setSysLang: function (...args) {
      console.warn("DTVManager.setSysLang interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getSysLang: function (...args) {
      console.warn("DTVManager.getSysLang interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var subtitleComponentArray = new Array();
      subtitleComponentArray.push(SubtitleComponent);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    setScreenBlueEnable: function (...args) {
      console.warn("DTVManager.setScreenBlueEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getScreenBlueEnable: function (...args) {
      console.warn("DTVManager.getScreenBlueEnable interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setDtvSystem: function (...args) {
      console.warn("DTVManager.setDtvSystem interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDtvSystem: function (...args) {
      console.warn("DTVManager.getDtvSystem interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DtvSystems);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DtvSystems);
        })
      }
    },
    setFeFakeMode: function (...args) {
      console.warn("DTVManager.setFeFakeMode interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getJavaAPIVersion: function (...args) {
      console.warn("DTVManager.getJavaAPIVersion interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    }
  }
  const ClosedCaptionManager = {
    getUsedCCLists: function (...args) {
      console.warn("ClosedCaptionManager.getUsedCCLists interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      var closedCaptionListArray = new Array();
      closedCaptionListArray.push(ClosedCaptionList);
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, closedCaptionListArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(closedCaptionListArray);
        })
      }
    },
    getCurrentCC: function (...args) {
      console.warn("ClosedCaptionManager.getCurrentCC interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ClosedCaptionComponent);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ClosedCaptionComponent);
        })
      }
    },
    isCCVisible: function (...args) {
      console.warn("ClosedCaptionManager.isCCVisible interface mocked in the Previewer. How this interface works on the Previewer" +
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
    showCC: function (...args) {
      console.warn("ClosedCaptionManager.showCC interface mocked in the Previewer. How this interface works on the Previewer" +
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
    showCC: function (...args) {
      console.warn("ClosedCaptionManager.showCC interface mocked in the Previewer. How this interface works on the Previewer" +
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
    isCCShow: function (...args) {
      console.warn("ClosedCaptionManager.isCCShow interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAnalogSelector: function (...args) {
      console.warn("ClosedCaptionManager.setAnalogSelector interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getAnalogSelector: function (...args) {
      console.warn("ClosedCaptionManager.setAnalogSelector interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CCAnalogSelectors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CCAnalogSelectors);
        })
      }
    },
    setDigitalSelector: function (...args) {
      console.warn("ClosedCaptionManager.setDigitalSelector interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getDigitalSelector: function (...args) {
      console.warn("ClosedCaptionManager.getDigitalSelector interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CCDigitalSelectors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CCDigitalSelectors);
        })
      }
    },
    setFontSize: function (...args) {
      console.warn("ClosedCaptionManager.setFontSize interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontSize: function (...args) {
      console.warn("ClosedCaptionManager.getFontSize interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FontSizes);
      } else {
        return new Promise((resolve, reject) => {
          resolve(FontSizes);
        })
      }
    },
    setFontStyle: function (...args) {
      console.warn("ClosedCaptionManager.setFontStyle interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontStyle: function (...args) {
      console.warn("ClosedCaptionManager.getFontStyle interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FontStyles);
      } else {
        return new Promise((resolve, reject) => {
          resolve(FontStyles);
        })
      }
    },
    setFontColor: function (...args) {
      console.warn("ClosedCaptionManager.setFontColor interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontColor: function (...args) {
      console.warn("ClosedCaptionManager.getFontColor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Colors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Colors);
        })
      }
    },
    setFontOpacity: function (...args) {
      console.warn("ClosedCaptionManager.setFontOpacity interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontOpacity: function (...args) {
      console.warn("ClosedCaptionManager.getFontOpacity interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Opacities);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Opacities);
        })
      }
    },
    setBackgroundColor: function (...args) {
      console.warn("ClosedCaptionManager.setBackgroundColor interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBackgroundColor: function (...args) {
      console.warn("ClosedCaptionManager.getBackgroundColor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Colors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Colors);
        })
      }
    },
    setBackgroundOpacity: function (...args) {
      console.warn("ClosedCaptionManager.setBackgroundOpacity interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getBackgroundOpacity: function (...args) {
      console.warn("ClosedCaptionManager.getBackgroundOpacity interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Opacities);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Opacities);
        })
      }
    },
    setFontEdgeEffect: function (...args) {
      console.warn("ClosedCaptionManager.setFontEdgeEffect interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontEdgeEffect: function (...args) {
      console.warn("ClosedCaptionManager.getFontEdgeEffect interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FontEdgeEffects);
      } else {
        return new Promise((resolve, reject) => {
          resolve(FontEdgeEffects);
        })
      }
    },
    setFontEdgeColor: function (...args) {
      console.warn("ClosedCaptionManager.setFontEdgeColor interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getFontEdgeColor: function (...args) {
      console.warn("ClosedCaptionManager.getFontEdgeColor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Colors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(Colors);
        })
      }
    }
  }
  const DtvEventManager = {
    on: function (...args) {
      console.warn("DtvEventManager.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("DtvEventManager.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    }
  }
  return result;
}