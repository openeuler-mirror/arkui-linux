/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { paramMock } from "../utils"
import { PixelMapMock } from "./ohos_multimedia_image"

export function mockMultimediaMediaLibrary() {
  const mockFileAsset = {
    id: "[PC Preview] unknow id",
    uri: "[PC Preview] unknow uri",
    mimeType: "[PC Preview] unknow mimeType",
    mediaType: "[PC Preview] unknow mediaType",
    displayName: "[PC Preview] unknow displayName",
    title: "[PC Preview] unknow title",
    relativePath: "[PC Preview] unknow relativePath",
    parent: "[PC Preview] unknow parent",
    size: "[PC Preview] unknow size",
    dateAdded: "[PC Preview] unknow dateAdded",
    dateModified: "[PC Preview] unknow dateModified",
    dateTaken: "[PC Preview] unknow dateTaken",
    artist: "[PC Preview] unknow artist",
    audioAlbum: "[PC Preview] unknow audioAlbum",
    width: "[PC Preview] unknow width",
    height: "[PC Preview] unknow height",
    orientation: "[PC Preview] unknow orientation",
    duration: "[PC Preview] unknow duration",
    albumId: "[PC Preview] unknow albumId",
    albumUri: "[PC Preview] unknow albumUri",
    albumName: "[PC Preview] unknow albumName",
    isDirectory: function (...args) {
      console.warn("FileAsset.isDirectory interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    commitModify: function (...args) {
      console.warn("FileAsset.commitModify interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    open: function (...args) {
      console.warn("FileAsset.open interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    close: function (...args) {
      console.warn("FileAsset.close interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    getThumbnail: function (...args) {
      console.warn("FileAsset.getThumbnail interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockImagePixelMap)
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockImagePixelMap)
        })
      }
    },
    favorite: function (...args) {
      console.warn("FileAsset.favorite interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    isFavorite: function (...args) {
      console.warn("FileAsset.isFavorite interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    trash: function (...args) {
      console.warn("FileAsset.trash interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    isTrash: function (...args) {
      console.warn("FileAsset.isTrash interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
  };

  const mockFetchFileResult = {
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
      console.warn("FetchFileResult.close interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getFirstObject: function (...args) {
      console.warn("FetchFileResult.getFirstObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFileAsset)
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFileAsset)
        })
      }
    },
    getNextObject: function (...args) {
      console.warn("FetchFileResult.getNextObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFileAsset)
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFileAsset)
        })
      }
    },
    getLastObject: function (...args) {
      console.warn("FetchFileResult.getLastObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFileAsset)
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFileAsset)
        })
      }
    },
    getPositionObject: function (...args) {
      console.warn("FetchFileResult.getPositionObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFileAsset)
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFileAsset)
        })
      }
    },
    getAllObject: function (...args) {
      console.warn("FetchFileResult.getPositionObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [mockFileAsset])
      } else {
        return new Promise((resolve, reject) => {
          resolve([mockFileAsset])
        })
      }
    },
  };

  const mockPeerInfo = {
    deviceName: "[PC Preview] unknow deviceName",
    networkId: "[PC Preview] unknow networkId",
    deviceType: "[PC Preview] unknow deviceType",
    isOnline: "[PC Preview] unknow isOnline"
  };

  const mockImagePixelMap = PixelMapMock;

  const mockAlbum = {
    albumId: "[PC Preview] unknow albumId",
    albumName: "[PC Preview] unknow albumName",
    albumUri: "[PC Preview] unknow albumUri",
    dateModified: "[PC Preview] unknow dateModified",
    count: "[PC Preview] unknow count",
    relativePath: "[PC Preview] unknow relativePath",
    coverUri: "[PC Preview] unknow coverUri",
    commitModify: function (...args) {
      console.warn("Album.commitModify interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    getFileAssets: function (...args) {
      console.warn("Album.getFileAssets interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFetchFileResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFetchFileResult)
        })
      }
    }
  };

  const mockMediaLibrary = {
    getPublicDirectory: function (...args) {
      console.warn("MediaLibrary.getPublicDirectory interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getFileAssets: function (...args) {
      console.warn("MediaLibrary.getFileAssets interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFetchFileResult);
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFetchFileResult)
        })
      }
    },
    on: function (...args) {
      console.warn("MediaLibrary.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    off: function (...args) {
      console.warn("MediaLibrary.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    createAsset: function (...args) {
      console.warn("MediaLibrary.createAsset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, mockFileAsset);
      } else {
        return new Promise((resolve, reject) => {
          resolve(mockFileAsset)
        })
      }
    },
    deleteAsset: function (...args) {
      console.warn("MediaLibrary.deleteAsset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    getAlbums: function (...args) {
      console.warn("MediaLibrary.getAlbums interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [mockAlbum]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([mockAlbum])
        })
      }
    },
    storeMediaAsset: function (...args) {
      console.warn("MediaLibrary.storeMediaAsset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    startImagePreview: function (...args) {
      console.warn("MediaLibrary.startImagePreview interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    startMediaSelect: function (...args) {
      console.warn("MediaLibrary.startMediaSelect interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([paramMock.paramStringMock])
        })
      }
    },
    getActivePeers: function (...args) {
      console.warn("MediaLibrary.getActivePeers interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [mockPeerInfo]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([mockPeerInfo])
        })
      }
    },
    getAllPeers: function (...args) {
      console.warn("MediaLibrary.getAllPeers interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [mockPeerInfo]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([mockPeerInfo])
        })
      }
    },
    release: function (...args) {
      console.warn("MediaLibrary.startImagePreview interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    }
  };

  const mediaLibrary = {
    MediaType: {
      FILE: 0,
      IMAGE: 1,
      VIDEO: 2,
      AUDIO: 3
    },
    FileKey: {
      ID: "file_id",
      RELATIVE_PATH: "relative_path",
      DISPLAY_NAME: "display_name",
      PARENT: "parent",
      MIME_TYPE: "mime_type",
      MEDIA_TYPE: "media_type",
      SIZE: "size",
      DATE_ADDED: "date_added",
      DATE_MODIFIED: "date_modified",
      DATE_TAKEN: "date_taken",
      TITLE: "title",
      ARTIST: "artist",
      AUDIOALBUM: "audio_album",
      DURATION: "duration",
      WIDTH: "width",
      HEIGHT: "height",
      ORIENTATION: "orientation",
      ALBUM_ID: "bucket_id",
      ALBUM_NAME: "bucket_display_name"
    },
    DirectoryType: {
      DIR_CAMERA: 0,
      DIR_VIDEO: 1,
      DIR_IMAGE: 2,
      DIR_AUDIO: 3,
      DIR_DOCUMENTS: 4,
      DIR_DOWNLOAD: 5
    },
    DeviceType: {
      TYPE_UNKNOWN: 0,
      TYPE_LAPTOP: 1,
      TYPE_PHONE: 2,
      TYPE_TABLET: 3,
      TYPE_WATCH: 4,
      TYPE_CAR: 5,
      TYPE_TV: 6
    },
    getMediaLibrary: function (...args) {
      console.warn("mediaLibrary.getMediaLibrary interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return mockMediaLibrary;
    }
  };

  return mediaLibrary;
}
