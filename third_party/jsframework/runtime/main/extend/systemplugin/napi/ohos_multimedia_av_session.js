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

export function mockMultimediaAVSession() {
  const AVMetadata = {
    assetId: "[PC Preview] unknow assetId",
    title: "[PC Preview] unknow title",
    artist: "[PC Preview] unknow artist",
    author: "[PC Preview] unknow author",
    album: "[PC Preview] unknow album",
    writer: "[PC Preview] unknow writer",
    composer: "[PC Preview] unknow composer",
    duration: "[PC Preview] unknow duration",
    mediaImage: "[PC Preview] unknow mediaImage",
    publishDate: "[PC Preview] unknow publishDate",
    subtitle: "[PC Preview] unknow subtitle",
    description: "[PC Preview] unknow description",
    lyric: "[PC Preview] unknow lyric",
    previousAssetId: "[PC Preview] unknow previousAssetId",
    nextAssetId: "[PC Preview] unknow nextAssetId"
  }
  
  const AVPlaybackState = {
    state: "[PC Preview] unknow state",
    speed: "[PC Preview] unknow speed",
    position: PlaybackPosition,
    bufferedTime: "[PC Preview] unknow bufferedTime",
    loopMode: "[PC Preview] unknow loopMode",
    isFavorite: "[PC Preview] unknow isFavorite"
  }
  
  const PlaybackPosition = {
    elapsedTime: "[PC Preview] unknow elapsedTime",
    updateTime: "[PC Preview] unknow updateTime"
  }
  
  const OutputDeviceInfo = {
    isRemote: "[PC Preview] unknow isRemote",
    deviceId: [paramMock.paramStringMock],
    deviceName: [paramMock.paramStringMock]
  }
  
  const AVSessionDescriptor = {
    sessionId: "[PC Preview] unknow sessionId",
    type: "[PC Preview] unknow type",
    sessionTag: "[PC Preview] unknow sessionTag",
    elementName: "[PC Preview] unknow elementName",
    isActive: "[PC Preview] unknow isActive",
    isTopSession: "[PC Preview] unknow isTopSession",
    outputDevice:
     "[PC Preview] unknow outputDevice"
  }

  const AVControlCommandType = ['play', 'pause', 'stop', 'playNext', 'playPrevious', 'fastForward', 'rewind', 'seek', 'setSpeed', 'setLoopMode', 'toggleFavorite'];

  const AVSession = {
    sessionId: "[PC Preview] unknow sessionId",
    setAVMetadata: function (...args) {
      console.warn("AVSession.setAVMetadata interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAVPlaybackState: function (...args) {
      console.warn("AVSession.setAVPlaybackState interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setLaunchAbility: function (...args) {
      console.warn("AVSession.setLaunchAbility interface mocked in the Previewer. How this interface works on the Previewer" +
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
    setAudioStreamId: function (...args) {
      console.warn("AVSession.setAudioStreamId interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getController: function (...args) {
      console.warn("AVSession.getController interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AVSessionController);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AVSessionController);
      })
      }
    },
    getOutputDevice: function (...args) {
      console.warn("AVSession.getOutputDevice interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OutputDeviceInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OutputDeviceInfo);
      })
      }
    },
    on: function (...args) {
      console.warn("AVSession.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (args[0] == 'play' || args[0] == 'pause' ||args[0] == 'stop' ||args[0] == 'playNext' 
        ||args[0] == 'playPrevious' ||args[0] == 'fastForward' ||args[0] == 'rewind') {
          args[len - 1].call(this);
        } else if(args[0] == 'seek' || args[0] == 'setSpeed') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else if(args[0] == 'setLoopMode') {
          var loopMode = "[PC Preview] unknow LoopMode";
          args[len - 1].call(this, loopMode);
        } else if(args[0] == 'toggleFavorite') {
          args[len - 1].call(this, paramMock.paramStringMock);
        } else if(args[0] == 'handleKeyEvent') {
          args[len - 1].call(this, paramMock.paramObjectMock);
        } else if(args[0] == 'outputDeviceChanged') {
          args[len - 1].call(this, OutputDeviceInfo);
        } 
    },
    off: function (...args) {
      console.warn("AVSession.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    activate: function (...args) {
      console.warn("AVSession.activate interface mocked in the Previewer. How this interface works on the Previewer" +
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
    deactivate: function (...args) {
      console.warn("AVSession.deactivate interface mocked in the Previewer. How this interface works on the Previewer" +
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
    destroy: function (...args) {
      console.warn("AVSession.destroy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
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
  
  const AVSessionController = {
    sessionId: "[PC Preview] unknow sessionId",
    getAVPlaybackState: function (...args) {
      console.warn("AVSessionController.getAVPlaybackState interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AVPlaybackState);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AVPlaybackState);
      })
      }
    },
    getAVMetadata: function (...args) {
      console.warn("AVSessionController.getAVMetadata interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AVMetadata);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AVMetadata);
      })
      }
    },
    getOutputDevice: function (...args) {
      console.warn("AVSessionController.getOutputDevice interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, OutputDeviceInfo);
      } else {
        return new Promise((resolve, reject) => {
          resolve(OutputDeviceInfo);
      })
      }
    },
    sendAVKeyEvent: function (...args) {
      console.warn("AVSessionController.sendAVKeyEvent interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getLaunchAbility: function (...args) {
      console.warn("AVSessionController.getLaunchAbility interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getRealPlaybackPositionSync: function (...args) {
      console.warn("AVSessionController.getRealPlaybackPositionSync interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        return paramMock.paramNumberMock;
    },
    isActive: function (...args) {
      console.warn("AVSessionController.isActive interface mocked in the Previewer. How this interface works on the Previewer" +
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
    destroy: function (...args) {
      console.warn("AVSessionController.destroy interface mocked in the Previewer. How this interface works on the Previewer" +
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
    getValidCommands: function (...args) {
      console.warn("AVSessionController.getValidCommands interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AVControlCommandType);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AVControlCommandType);
      })
      }
    },
    sendControlCommand: function (...args) {
      console.warn("AVSessionController.sendControlCommand interface mocked in the Previewer. How this interface works on the Previewer" +
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
    on: function (...args) {
      console.warn("AVSessionController.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      const len = args.length
      if (args[0] == 'metadataChanged') {
        args[len-1].call(this, AVMetadata);
      } else if (args[0] == 'playbackStateChanged') {
        args[len-1].call(this, AVPlaybackState);
      } else if (args[0] == 'sessionDestroyed') {
        args[len-1].call(this);
      } else if (args[0] == 'activeStateChanged') {
        args[len-1].call(this, paramMock.paramBooleanMock);
      } else if (args[0] == 'validCommandChanged') {
        args[len-1].call(this, AVControlCommandType);
      } else if (args[0] == 'outputDeviceChanged') {
        args[len-1].call(this, OutputDeviceInfo);
      }
    },
    off: function (...args) {
      console.warn("AVSessionController.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    }
  }

  const avsession = {
    createAVSession: function (...args) {
      console.warn("AVSession.createAVSession interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AVSession);
        } else {
          return new Promise((resolve, reject) => {
            resolve(AVSession);
          })
        }  
      
    },
    getAllSessionDescriptors: function (...args) {
      console.warn("AVSession.getAllSessionDescriptors interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      var desArr = Array(AVSessionDescriptor);
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, desArr);
      } else {
        return new Promise((resolve, reject) => {
          resolve(desArr);
      })
      }
    },
    createController: function (...args) {
      console.warn("AVSession.createController interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AVSessionController);
      } else {
        return new Promise((resolve, reject) => {
          resolve(AVSessionController);
      })
      }
    },
    castAudio: function (...args) {
      console.warn("AVSession.castAudio interface mocked in the Previewer. How this interface works on the Previewer" +
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
    on: function (...args) {
      console.warn("AVSession.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
        const len = args.length
        if (args[0] == 'sessionCreated' || args[0] == 'sessionDestroyed' || args[0] == 'topSessionChanged') {
          args[len - 1].call(this, AVSessionDescriptor);
        } else if (args[0] == 'sessionServiceDied') {
          args[len - 1].call(this);
        }
    },
    off: function (...args) {
      console.warn("AVSession.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    sendSystemAVKeyEvent: function (...args) {
      console.warn("AVSession.sendSystemAVKeyEvent interface mocked in the Previewer. How this interface works on the Previewer" +
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
    sendSystemControlCommand: function (...args) {
      console.warn("AVSession.sendSystemControlCommand interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
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
  return avsession
}
