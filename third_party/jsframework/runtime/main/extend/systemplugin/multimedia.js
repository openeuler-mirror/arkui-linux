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

const sizeMock = {
  height: "[PC Preview] unknow height",
  width: "[PC Preview] unknow width"
}
const imageInfoMock = {
  size: sizeMock,
  pixelFortmat: "[PC Preview] unknow pixelFortmat",
  colorSpace: "[PC Preview] unknow colorSpace",
  alphaType: "[PC Preview] unknow alphaType"
}
export const PixelMapMock = {
  isEditable: "[PC Preview]: unknow isEditable",
  readPixelsToBuffer: function (...args) {
    console.warn("PixelMap.readPixelsToBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
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
  readPixels: function (...args) {
    console.warn("PixelMap.readPixels interface mocked in the Previewer. How this interface works on the Previewer" +
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
  writePixels: function (...args) {
    console.warn("PixelMap.writePixels interface mocked in the Previewer. How this interface works on the Previewer" +
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
  writeBufferToPixels: function (...args) {
    console.warn("PixelMap.writeBufferToPixels interface mocked in the Previewer. How this interface works on the Previewer" +
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
  getImageInfo: function (...args) {
    console.warn("PixelMap.getImageInfo interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (len > 0 && typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, imageInfoMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve(imageInfoMock);
      })
    }
  },
  getBytesNumberPerRow: function (...args) {
    console.warn("PixelMap.getBytesNumberPerRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getPixelBytesNumber: function (...args) {
    console.warn("PixelMap.getPixelBytesNumber interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  release: function (...args) {
    console.warn("PixelMap.release interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (len > 0 && typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve();
      })
    }
  }
}

export function mockMultimediaImage() {
  global.systemplugin.multimedia = {}
  const imageSourceMock = {
    getImageInfo: function (...args) {
      console.warn("ImageSource.getImageInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, imageInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(imageInfoMock);
        })
      }
    },
    release: function (...args) {
      console.warn("ImageSource.release interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    createPixelMap: function (...args) {
      console.warn("ImageSource.createPixelMap interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PixelMapMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PixelMapMock);
        })
      }
    },
    getImageProperty: function (...args) {
      console.warn("ImageSource.getImageProperty interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    supportedFormats: "[PC Preview] unknow supportedFormats"
  }
  const imagePackerMock = {
    packing: function (...args) {
      console.warn("ImagePacker.packing interface mocked in the Previewer. How this interface works on the Previewer" +
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
    release: function (...args) {
      console.warn("ImagePacker.release interface mocked in the Previewer. How this interface works on the Previewer" +
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
    supportedFormats: "[PC Preview] unknow supportedFormats"
  }
  const PixelMapFormatMock = {
    UNKNOWN: "[PC Preview]: unknow UNKNOWN",
    RGB_565: "[PC Preview]: unknow RGB_565",
    RGBA_8888: "[PC Preview]: unknow RGBA_8888",
  }
  const PropertyKeyMock = {
    BITS_PER_SAMPLE: "[PC Preview]: unknow BITS_PER_SAMPLE",
    ORIENTATION: "[PC Preview]: unknow ORIENTATION",
    IMAGE_LENGTH: "[PC Preview]: unknow IMAGE_LENGTH",
    GPS_LATITUDE: "[PC Preview]: unknow GPS_LATITUDE",
    GPS_LONGITUDE: "[PC Preview]: unknow GPS_LONGITUDE",
    GPS_LATITUDE_REF: "[PC Preview]: unknow GPS_LATITUDE_REF",
    GPS_LONGITUDE_REF: "[PC Preview]: unknow GPS_LONGITUDE_REF"
  }

  global.systemplugin.multimedia.image = {
    PixelMapFormat: PixelMapFormatMock,
    PropertyKey: PropertyKeyMock,
    createImageSource: function () {
      console.warn("multimedia.image.createImageSource interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return imageSourceMock;
    },
    createImagePacker: function () {
      console.warn("multimedia.image.createImagePacker interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return imagePackerMock;
    }
  }
}

export function mockMultimediaMedia() {
  const MediaType = {
    VIDEO: "[PC Preview]: unknow VIDEO",
    AUDIO: "[PC Preview]: unknow AUDIO",
  }
  const ComposerTrack = {
    trackId: "[PC Preview]: unknow trackId",
    type: MediaType,
    duration: "[PC Preview]: unknow duration"
  }
  const sizeMock = {
    height: "[PC Preview] unknow height",
    width: "[PC Preview] unknow width"
  }
  const DecoderFrameMock = {
    size: sizeMock,
    pts: "[PC Preview] unknow pts",
    buffer: "[PC Preview] unknow buffer"
  }
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
      console.warn("AudioPlayer.stop interface mocked in the Previewer. How this interface works on the Previewer" +
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
    src: "[PC Preview] unknow src",
    loop: "[PC Preview] unknow loop",
    currentTime: "[PC Preview] unknow currentTime",
    duration: "[PC Preview] unknow duration",
    state: "[PC Preview] unknow state",
    on: function (...args) {
      console.warn("AudioPlayer.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'timeUpdate') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else {
          args[len - 1].call(this);
        }
      }
    }
  }
  const audioRecorderMock = {
    prepare: function () {
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
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else {
          args[len - 1].call(this);
        }
      }
    }
  }
  const MediaComposerMock = {
    extractSource: function (...args) {
      console.warn("MediaComposer.extractSource interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var composerTracks = new Array(ComposerTrack)
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, composerTracks);
      } else {
        return new Promise((resolve, reject) => {
          resolve(composerTracks);
        })
      }
    },
    configOutput: function (...args) {
      console.warn("MediaComposer.configOutput interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    addTrack: function (...args) {
      console.warn("MediaComposer.addTrack interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    removeTrack: function (...args) {
      console.warn("MediaComposer.removeTrack interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    compose: function (...args) {
      console.warn("MediaComposer.compose interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    release: function (...args) {
      console.warn("MediaComposer.release interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
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
  const mediaDecoderMock = {
    start: function (...args) {
      console.warn("MediaDecoder.start interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    seek: function (...args) {
      console.warn("MediaDecoder.seek interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    stop: function () {
      console.warn("MediaDecoder.stop interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    release: function () {
      console.warn("MediaDecoder.release interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    requestFrame: function () {
      console.warn("MediaDecoder.requestFrame interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("MediaDecoder.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'start') {
          args[len - 1].call(this, sizeMock);
        } else if (args[0] == 'frameChange') {
          args[len - 1].call(this, sizeMock);
        } else if (args[0] == 'frameAvailable') {
          args[len - 1].call(this, DecoderFrameMock);
        } else {
          args[len - 1].call(this);
        }
      }
    }
  }
  const MimeTypeMock = '[PC Preview] unknow mimeType'
  const CodecDescriptionMock = {
    name: "[PC Preview] unknow name",
    mimeTypes: new Array(MimeTypeMock),
    isAudio: "[PC Preview] unknow isAudio",
    isEncoder: "[PC Preview] unknow isEncoder",
    isSoftware: "[PC Preview] unknow isSoftware",
  }
  const codecDescriptionHelperMock = {
    findDecoder: function (...args) {
      console.warn("CodecDescriptionHelper.findDecoder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CodecDescriptionMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CodecDescriptionMock);
        })
      }
    },
    findEncoder: function (...args) {
      console.warn("CodecDescriptionHelper.findEncoder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CodecDescriptionMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CodecDescriptionMock);
        })
      }
    },
    getSupportedDecoders: function (...args) {
      console.warn("CodecDescriptionHelper.getSupportedDecoders interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      var CodecDescriptionArray = new Array(CodecDescriptionMock)
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CodecDescriptionArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CodecDescriptionArray);
        })
      }
    },
    getSupportedEncoders: function (...args) {
      console.warn("CodecDescriptionHelper.getSupportedEncoders interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      var CodecDescriptionArray = new Array(CodecDescriptionMock)
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CodecDescriptionArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(CodecDescriptionArray);
        })
      }
    },
    getSupportedMimes: function (...args) {
      console.warn("CodecDescriptionHelper.getSupportedMimes interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      var MimeTypeArray = new Array(MimeTypeMock)
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, MimeTypeArray);
      } else {
        return new Promise((resolve, reject) => {
          resolve(MimeTypeArray);
        })
      }
    },
    isDecoderSupportedByFormat: function (...args) {
      console.warn("CodecDescriptionHelper.isDecoderSupportedByFormat interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isDecoderSupportedByMime: function (...args) {
      console.warn("CodecDescriptionHelper.isDecoderSupportedByMime interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isEncoderSupportedByFormat: function (...args) {
      console.warn("CodecDescriptionHelper.isEncoderSupportedByFormat interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isEncoderSupportedByMime: function (...args) {
      console.warn("CodecDescriptionHelper.findDisEncoderSupportedByMime interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
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
  global.systemplugin.multimedia.media = {
    MediaType: {
      VIDEO: 0,
      AUDIO: 1,
    },
    createAudioPlayer: function () {
      console.warn("multimedia.media.createAudioPlayer interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return audioPlayerMock;
    },
    createAudioRecorder: function () {
      console.warn("multimedia.media.createAudioRecorder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return audioRecorderMock;
    },
    createMediaComposer: function () {
      console.warn("multimedia.media.createMediaComposer interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return MediaComposerMock;
    },
    createMediaDecoder: function () {
      console.warn("multimedia.media.createMediaDecoder interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return mediaDecoderMock;
    },
    getCodecDescriptionHelper: function () {
      console.warn("multimedia.media.getCodecDescriptionHelper interface mocked in the Previewer. How this" +
        " interface works on the Previewer may be different from that on a real device.")
      return codecDescriptionHelperMock;
    }
  }
}

export function mockMultimediaMedialibrary() {
  const FileAssetMock = {
    id: "[PC Preview] unknow id",
    uri: "[PC Preview] unknow uri",
    thumbnailUri: "[PC Preview] unknow thumbnailUri",
    mimeType: "[PC Preview] unknow mimeType",
    mediaType: "[PC Preview] unknow mediaType",
    displayName: "[PC Preview] unknow displayName",
    title: "[PC Preview] unknow title",
    size: "[PC Preview] unknow size",
    albumId: "[PC Preview] unknow albumId",
    albumName: "[PC Preview] unknow albumName",
    dateAdded: "[PC Preview] unknow dateAdded",
    dateModified: "[PC Preview] unknow dateMidified",
    dateTaken: "[PC Preview] unknow dateTaken",
    orientation: "[PC Preview] unknow orientation",
    width: "[PC Preview] unknow width",
    height: "[PC Preview] unknow height",
    extendedValues: "[PC Preview] unknow extendedValues",
  }
  const MediaLibraryMock = {
    storeMediaAsset: function (...args) {
      console.warn("MediaLibrary.storeMediaAsset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    startImagePreview: function (...args) {
      console.warn("MediaLibrary.startImagePreview interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    startMediaSelect: function (...args) {
      console.warn("MediaLibrary.startMediaSelect interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramArrayMock);
        })
      }
    },
    getFileAssets: function (...args) {
      console.warn("MediaLibrary.getFileAssets interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FetchFileResultMock)
        : new Promise((resolve, reject) => {
          resolve(FetchFileResultMock);
        })
    },
    getAlbums: function (...args) {
      console.warn("MediaLibrary.getAlbums interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var albumsMock = new Array(AlbumMock)
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, albumsMock)
        : new Promise((resolve, reject) => {
          resolve(albumsMock);
        })
    },
    on: function (...args) {
      console.warn("MediaLibrary.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("MediaLibrary.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    }
  }
  const FetchFileResultMock = {
    getCount: function (...args) {
      console.warn("FetchFileResult.getCount interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    isAfterLast: function (...args) {
      console.warn("FetchFileResult.isAfterLast interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    close: function (...args) {
      console.warn("FetchFileResult.close interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    getFirstObject: function (...args) {
      console.warn("FetchFileResult.getFirstObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FileAssetMock)
        : new Promise((resolve, reject) => {
          resolve(FileAssetMock);
        })
    },
    getLastObject: function (...args) {
      console.warn("FetchFileResult.getLastObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FileAssetMock)
        : new Promise((resolve, reject) => {
          resolve(FileAssetMock);
        })
    },
    getNextObject: function (...args) {
      console.warn("FetchFileResult.getNextObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FileAssetMock)
        : new Promise((resolve, reject) => {
          resolve(FileAssetMock);
        })
    },
    getPositionObject: function (...args) {
      console.warn("FetchFileResult.getPositionObject interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FileAssetMock)
        : new Promise((resolve, reject) => {
          resolve(FileAssetMock);
        })
    },
    getAllObject: function (...args) {
      console.warn("FetchFileResult.getAllObject interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      var fileAssets = new Array(FileAssetMock)
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, fileAssets)
        : new Promise((resolve, reject) => {
          resolve(fileAssets);
        })
    }
  }
  const AlbumMock = {
    albumId: "[PC Preview] unknow albumId",
    albumName: "[PC Preview] unknow albumName",
    path: "[PC Preview] unknow path",
    dateModified: "[PC Preview] unknow dateModified",
    getFileAssets: function (...args) {
      console.warn("Album.getFileAssets interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, FetchFileResultMock)
        : new Promise((resolve, reject) => {
          resolve(FetchFileResultMock);
        })
    }
  }
  const AVMetadataHelperMock = {
    setSource: function (...args) {
      console.warn("AVMetadataHelper.setSource interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock)
        : new Promise((resolve, reject) => {
          resolve();
        })
    },
    fetchVideoPixelMapByTime: function (...args) {
      console.warn("AVMetadataHelper.fetchVideoPixelMapByTime interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock)
        : new Promise((resolve, reject) => {
          resolve(paramMock.paramObjectMock);
        })
    },
    resolveMetadata: function (...args) {
      console.warn("AVMetadataHelper.resolveMetadata interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
        : new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
    },
    release: function (...args) {
      console.warn("AVMetadataHelper.release interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      var isCallBack = typeof args[len - 1] === 'function'
      return isCallBack ? args[len - 1].call(this, paramMock.businessErrorMock)
        : new Promise((resolve, reject) => {
          resolve();
        })
    }
  }
  global.systemplugin.multimedia.mediaLibrary = {
    getMediaLibrary: function () {
      console.warn("multimedia.mediaLibrary.getMediaLibrary interface mocked in the Previewer. How this interface" +
        " works on the Previewer may be different from that on a real device.")
      return MediaLibraryMock;
    },
    createAVMetadataHelper: function () {
      console.warn("multimedia.mediaLibrary.createAVMetadataHelper interface mocked in the Previewer. How this" +
        " interface works on the Previewer may be different from that on a real device.")
      return AVMetadataHelperMock;
    },
  }
}

export function mockMultimediaAudio() {
  const interruptActionMock = {
    actionType: "[PC Preview] unknow actionType",
    type: "[PC Preview] unknow type",
    hint: "[PC Preview] unknow hint",
    activated: "[PC Preview] unknow activated",
  }
  const AudioEncodingFormatMock = "[PC Preview]: unknow AudioEncodingFormat"
  const DeviceRoleMock = "[PC Preview]: unknow DeviceRole"
  const DeviceTypeMock = "[PC Preview]: unknow DeviceType"
  const AudioDeviceDescriptorMock = {
    id: "[PC Preview]: unknow id",
    name: "[PC Preview]: unknow name",
    address: "[PC Preview]: unknow address",
    sampleRates: new Array(paramMock.paramNumberMock),
    channelCounts: new Array(paramMock.paramNumberMock),
    channelIndexMasks: new Array(paramMock.paramNumberMock),
    channelMasks: new Array(paramMock.paramNumberMock),
    encodingFormats: new Array(AudioEncodingFormatMock),
    deviceRole: DeviceRoleMock,
    deviceType: DeviceTypeMock,
  }
  const DeviceChangeActionMock = {
    type: "[PC Preview]: unknow type",
    deviceDescriptors: AudioDeviceDescriptorMock,
  }
  const AudioRingModeMock = '[PC Preview]: unknow AudioRingMode'
  const audioManagerMock = {
    on: function (...args) {
      console.warn("AudioManager.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'interrupt') {
          args[len - 1].call(this, interruptActionMock);
        } else if (args[0] == 'deviceChange') {
          args[len - 1].call(this, DeviceChangeActionMock);
        } else {
          args[len - 1].call(this);
        }
      }
    },
    off: function (...args) {
      console.warn("AudioManager.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'interrupt') {
          args[len - 1].call(this, interruptActionMock);
        } else if (args[0] == 'deviceChange') {
          args[len - 1].call(this);
        } else {
          args[len - 1].call(this);
        }
      }
    },
    getDevices: function (...args) {
      console.warn("AudioManager.getDevices interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var AudioDeviceDescriptors = new Array(AudioDeviceDescriptorMock)
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioDeviceDescriptors);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioDeviceDescriptors);
        })
      }
    },
    isDeviceActive: function (...args) {
      console.warn("AudioManager.isDeviceActive interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    setDeviceActive: function (...args) {
      console.warn("AudioManager.setDeviceActive interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setRingerMode: function (...args) {
      console.warn("AudioManager.setRingerMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setAudioParameter: function (...args) {
      console.warn("AudioManager.setAudioParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    setVolume: function (...args) {
      console.warn("AudioManager.setVolume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getVolume: function (...args) {
      console.warn("AudioManager.getVolume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getMinVolume: function (...args) {
      console.warn("AudioManager.getMinVolume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getMaxVolume: function (...args) {
      console.warn("AudioManager.getMaxVolume interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    isMute: function (...args) {
      console.warn("AudioManager.isMute interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    mute: function (...args) {
      console.warn("AudioManager.mute interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    isActive: function (...args) {
      console.warn("AudioManager.isActive interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    isMicrophoneMute: function (...args) {
      console.warn("AudioManager.isMicrophoneMute interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    setMicrophoneMute: function (...args) {
      console.warn("AudioManager.setMicrophoneMute interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getAudioParameter: function (...args) {
      console.warn("AudioManager.getAudioParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
    getRingerMode: function (...args) {
      console.warn("AudioManager.getRingerMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AudioRingModeMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AudioRingModeMock);
        })
      }
    }
  }
  global.systemplugin.multimedia.audio = {
    AudioVolumeType: {
      RINGTONE: 2,
      MEDIA: 3,
    },
    ContentType: {
      CONTENT_TYPE_UNKNOWN: 0,
      CONTENT_TYPE_SPEECH: 1,
      CONTENT_TYPE_MUSIC: 2,
      CONTENT_TYPE_MOVIE: 3,
      CONTENT_TYPE_SONIFICATION: 4,
    },
    StreamUsage: {
      STREAM_USAGE_UNKNOWN: 0,
      STREAM_USAGE_MEDIA: 1,
      STREAM_USAGE_VOICE_COMMUNICATION: 2,
      STREAM_USAGE_NOTIFICATION_RINGTONE: 6,
    },
    DeviceFlag: {
      OUTPUT_DEVICES_FLAG: 1,
      INPUT_DEVICES_FLAG: 2,
      ALL_DEVICES_FLAG: 3,
    },
    ActiveDeviceType: {
      SPEAKER: 2,
      BLUETOOTH_SCO: 7,
    },
    AudioRingMode: {
      RINGER_MODE_NORMAL: 2,
      RINGER_MODE_SILENT: 0,
      RINGER_MODE_VIBRATE: 1,
    },
    getAudioManager: function () {
      console.warn("multimedia.media.getAudioManager interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return audioManagerMock;
    }
  }
}
