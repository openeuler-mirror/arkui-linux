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

export function mockMultimediaMedia() {
  const audioPlayerMock = {
    play: function () {
      console.warn("AudioPlayer.play interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    pause: function () {
      console.warn("AudioPlayer.pause interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    stop: function () {
      console.warn("AudioPlayer.stop interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    reset: function () {
      console.warn("AudioPlayer.reset interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    seek: function (...args) {
      console.warn("AudioPlayer.seek interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    setVolume: function (...args) {
      console.warn("AudioPlayer.setVolume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    release: function () {
      console.warn("AudioPlayer.release interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    getTrackDescription: function(...args) {
      console.warn("AudioPlayer.getTrackDescription interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [mediaDescriptionMock]);
      } else {
        return new Promise((resolve) => {
          resolve([mediaDescriptionMock]);
        });
      }
    },
    src: '[PC Preview] unknow src',
    fdSrc: AVFileDescriptor,
    loop: '[PC Preview] unknow loop',
    audioInterruptMode: InterruptMode,
    currentTime: '[PC Preview] unknow currentTime',
    duration: '[PC Preview] unknow duration',
    state: '[PC Preview] unknow state',
    on: function (...args) {
      console.warn("AudioPlayer.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    }
  }
  const locationMock = {
    latitude: '[PC Preview] unknow latitude',
    longitude: '[PC Preview] unknow longitude',
  }
  const audioRecorderConfigMock = {
    audioEncoder: '[PC Preview] unknow audioEncoder',
    audioEncodeBitRate: '[PC Preview] unknow audioEncodeBitRate',
    audioSampleRate: '[PC Preview] unknow audioSampleRate',
    numberOfChannels: '[PC Preview] unknow numberOfChannels',
    format: '[PC Preview] unknow format',
    uri: '[PC Preview] unknow uri',
    location: locationMock,
    audioEncoderMime: '[PC Preview] unknow audioEncoderMime',
    fileFormat: '[PC Preview] unknow fileFormat',
  }
  const audioRecorderMock = {
    prepare: function (...args) {
      console.warn("AudioRecorder.prepare interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    start: function () {
      console.warn("AudioRecorder.start interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    pause: function () {
      console.warn("AudioRecorder.pause interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    resume: function () {
      console.warn("AudioRecorder.resume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stop: function () {
      console.warn("AudioRecorder.stop interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    release: function () {
      console.warn("AudioRecorder.release interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    reset: function () {
      console.warn("AudioRecorder.reset interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("AudioRecorder.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    }
  }
  const videoRecorderMock = {
    prepare: function (...args) {
      console.warn("VideoRecorder.prepare interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getInputSurface: function (...args) {
      console.warn("VideoRecorder.getInputSurface interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock);
        });
      }
    },
    start: function (...args) {
      console.warn("VideoRecorder.start interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    pause: function (...args) {
      console.warn("VideoRecorder.pause interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    resume: function (...args) {
      console.warn("VideoRecorder.resume interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    stop: function (...args) {
      console.warn("VideoRecorder.stop interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    release: function (...args) {
      console.warn("VideoRecorder.release interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    reset: function (...args) {
      console.warn("VideoRecorder.reset interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    on: function (...args) {
      console.warn("AudioRecorder.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    state: paramMock.paramStringMock,
  }
  const videoPlayerMock = {
    url: '[PC Preview] unknow url',
    fdSrc: AVFileDescriptor,
    loop: '[PC Preview] unknow loop',
    currentTime: '[PC Preview] unknow currentTime',
    duration: '[PC Preview] unknow duration',
    state: '[PC Preview] unknow state',
    width: '[PC Preview] unknow width',
    height: '[PC Preview] unknow height',
    audioInterruptMode: InterruptMode,
    videoScaleType: mediaMock.VideoScaleType,
    setDisplaySurface: function (...args) {
      console.warn("VideoPlayer.setDisplaySurface interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    prepare: function (...args) {
      console.warn("VideoPlayer.prepare interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    play: function (...args) {
      console.warn("VideoPlayer.play interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    pause: function (...args) {
      console.warn("VideoPlayer.pause interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    stop: function (...args) {
      console.warn("VideoPlayer.stop interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    reset: function (...args) {
      console.warn("VideoPlayer.reset interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    seek: function (...args) {
      console.warn("VideoPlayer.seek interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    setVolume: function (...args) {
      console.warn("VideoPlayer.setVolume interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    release: function (...args) {
      console.warn("VideoPlayer.release interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getTrackDescription: function (...args) {
      console.warn("VideoPlayer.getTrackDescription interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
            args[len - 1].call(this, paramMock.businessErrorMock, [mediaDescriptionMock]);
        } else {
          return new Promise((resolve) => {
            resolve([mediaDescriptionMock]);
          });
        }
      },
    setSpeed: function (...args) {
      console.warn("VideoPlayer.setSpeed interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    selectBitrate: function (...args) {
      console.warn("VideoPlayer.selectBitrate interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.paramNumberMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        });
      }
    },
    on: function (...args) {
      console.warn("VideoPlayer.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
  }
  const AVFileDescriptorMock = {
    fd: '[PC Preview] unknow fd',
    offset: '[PC Preview] unknow audioChannels',
    length: '[PC Preview] unknow audioCodec',
  }
  const videoRecorderProfileMock = {
    audioBitrate: '[PC Preview] unknow audioBitrate',
    audioChannels: '[PC Preview] unknow audioChannels',
    audioCodec: '[PC Preview] unknow audioCodec',
    audioSampleRate: '[PC Preview] unknow audioSampleRate',
    fileFormat: '[PC Preview] unknow fileFormat',
    videoBitrate: '[PC Preview] unknow videoBitrate',
    videoCodec: '[PC Preview] unknow videoCodec',
    videoFrameWidth: '[PC Preview] unknow videoFrameWidth',
    videoFrameHeight: '[PC Preview] unknow videoFrameHeight',
    videoFrameRate: '[PC Preview] unknow videoFrameRate',
  }
  const videoRecorderConfigMock = {
    audioSourceType: '[PC Preview] unknow audioSourceType',
    videoSourceType: '[PC Preview] unknow videoSourceType',
    profile: '[PC Preview] unknow profile',
    url: '[PC Preview] unknow url',
    rotation: '[PC Preview] unknow rotation',
    location: locationMock,
  }
  const mediaDescriptionMock = {
    "key": 'paramMock.paramObjectMock',
  }
  const InterruptModeMock = {
    SHARE_MODE: 0,
    INDEPENDENT_MODE: 1
  }
  const mediaMock = {
    MediaErrorCode : {
      MSERR_OK: 0,
      MSERR_NO_MEMORY: 1,
      MSERR_OPERATION_NOT_PERMIT: 2,
      MSERR_INVALID_VAL: 3,
      MSERR_IO: 4,
      MSERR_TIMEOUT: 5,
      MSERR_UNKNOWN: 6,
      MSERR_SERVICE_DIED: 7,
      MSERR_INVALID_STATE: 8,
      MSERR_UNSUPPORTED: 9
    },
    BufferingInfoType : {
      BUFFERING_START: 1,
      BUFFERING_END: 2,
      BUFFERING_PERCENT: 3,
      CACHED_DURATION: 4
    },
    AudioEncoder : {
      DEFAULT: 0,
      AMR_NB: 1,
      AMR_WB: 2,
      AAC_LC: 3,
      HE_AAC: 4
    },
    AudioOutputFormat : {
      DEFAULT: 0,
      MPEG_4: 2,
      AMR_NB: 3,
      AMR_WB: 4,
      AAC_ADTS: 6
    },
    CodecMimeType : {
      VIDEO_H263: 'video/h263',
      VIDEO_AVC: 'video/avc',
      VIDEO_MPEG2: 'video/mpeg2',
      VIDEO_MPEG4: 'video/mp4v-es',
      VIDEO_VP8: 'video/x-vnd.on2.vp8',
      AUDIO_AAC: 'audio/mp4a-latm',
      AUDIO_VORBIS: 'audio/vorbis',
      AUDIO_FLAC: 'audio/flac',
    },
    PlaybackSpeed : {
      SPEED_FORWARD_0_75_X: 0,
      SPEED_FORWARD_1_00_X: 1,
      SPEED_FORWARD_1_25_X: 2,
      SPEED_FORWARD_1_75_X: 3,
      SPEED_FORWARD_2_00_X: 4,
    },
    VideoScaleType : {
      VIDEO_SCALE_TYPE_FIT: 0,
      VIDEO_SCALE_TYPE_FIT_CROP: 1,
    },
    ContainerFormatType : {
      CFT_MPEG_4: "mp4",
      CFT_MPEG_4A: "m4a",
    },
    MediaType : {
      MEDIA_TYPE_AUD: 0,
      MEDIA_TYPE_VID: 1,
    },
    MediaDescriptionKey : {
      MD_KEY_TRACK_INDEX: "track_index",
      MD_KEY_TRACK_TYPE: "track_type",
      MD_KEY_CODEC_MIME: "codec_mime",
      MD_KEY_DURATION: "duration",
      MD_KEY_BITRATE: "bitrate",
      MD_KEY_WIDTH: "width",
      MD_KEY_HEIGHT: "height",
      MD_KEY_FRAME_RATE: "frame_rate",
      MD_KEY_AUD_CHANNEL_COUNT: "channel_count",
      MD_KEY_AUD_SAMPLE_RATE: "sample_rate",
    },
    AudioSourceType : {
      AUDIO_SOURCE_TYPE_DEFAULT: 0,
      AUDIO_SOURCE_TYPE_MIC: 1,
    },
    VideoSourceType : {
      VIDEO_SOURCE_TYPE_SURFACE_YUV: 0,
      VIDEO_SOURCE_TYPE_SURFACE_ES: 1,
    },
    SeekMode : {
      SEEK_NEXT_SYNC: 0,
      SEEK_PREV_SYNC: 1,
    },
    AudioState: '[PC Preview] unknow AudioState',
    VideoRecordState: '[PC Preview] unknow VideoRecordState',
    VideoPlayState: '[PC Preview] unknow VideoPlayState',
    createAudioPlayer: function () {
      console.warn("media.createAudioPlayer interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return audioPlayerMock;
    },
    createAudioRecorder: function () {
      console.warn("media.createAudioRecorder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return audioRecorderMock;
    },
    createVideoPlayer: function () {
      console.warn("media.createVideoPlayer interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, videoPlayerMock);
      } else {
        return new Promise((resolve) => {
          resolve(videoPlayerMock);
        });
      }
    },
    createVideoRecorder: function () {
      console.warn("media.createVideoRecorder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, videoRecorderMock);
      } else {
        return new Promise((resolve) => {
          resolve(videoRecorderMock);
        });
      }
    },
  }
  return mediaMock;
}
