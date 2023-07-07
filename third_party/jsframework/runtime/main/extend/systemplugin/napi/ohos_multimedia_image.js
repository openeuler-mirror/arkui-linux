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

const SizeMock = {
  height: "[PC Preview] unknow height",
  width: "[PC Preview] unknow width"
}
const ImageInfoMock = {
  size: SizeMock
}

export const PixelMapMock = {
  isEditable: "[PC Preview] unknow isEditable",
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
      args[len - 1].call(this, paramMock.businessErrorMock, ImageInfoMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve(ImageInfoMock);
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
  getDensity: function (...args) {
    console.warn("PixelMap.getDensity interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  opacity: function (...args) {
    console.warn("PixelMap.opacity interface mocked in the Previewer. How this interface works on the Previewer" +
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
  createAlphaPixelmap: function (...args) {
    console.warn("PixelMap.createAlphaPixelmap interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (len > 0 && typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock,PixelMapMock);
    } else {
      return new Promise((resolve, reject) => {
        resolve(PixelMapMock);
      })
    }
  },
  scale: function (...args) {
    console.warn("PixelMap.scale interface mocked in the Previewer. How this interface works on the Previewer" +
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
  translate: function (...args) {
    console.warn("PixelMap.translate interface mocked in the Previewer. How this interface works on the Previewer" +
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
  rotate: function (...args) {
    console.warn("PixelMap.rotate interface mocked in the Previewer. How this interface works on the Previewer" +
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
  flip: function (...args) {
    console.warn("PixelMap.flip interface mocked in the Previewer. How this interface works on the Previewer" +
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
  crop: function (...args) {
    console.warn("PixelMap.flip interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const RegionMock = {
    size: SizeMock,
    x: "[PC Preview] unknow x",
    y: "[PC Preview] unknow y"
  }
  const PositionAreaMock = {
    pixels: "[PC Preview] unknow pixels",
    offset: "[PC Preview] unknow offset",
    stride: "[PC Preview] unknow stride",
    region: RegionMock
  }
  const PackingOptionMock = {
    format: "[PC Preview] unknow format",
    quality: "[PC Preview] unknow quality"
  }
  const GetImagePropertyOptionsMock = {
    index: "[PC Preview] unknow index",
    defaultValue: "[PC Preview] unknow defaultValue"
  }
  const DecodingOptionsMock = {
    index: "[PC Preview] unknow index",
    sampleSize: "[PC Preview] unknow sampleSize",
    rotate: "[PC Preview] unknow rotate",
    editable: "[PC Preview] unknow editable",
    desiredSize: SizeMock,
    desiredRegion: RegionMock,
    desiredPixelFormat: "[PC Preview] unknow desiredPixelFormat"
  }
  const ComponentMock = {
    componentType: "[PC Preview] unknow componentType",
    rowStride: "[PC Preview] unknow rowStride",
    pixelStride: "[PC Preview] unknow pixelStride",
    byteBuffer: "[PC Preview] unknow pixelStride"
  }
  const InitializationOptionsMock = {
    size: SizeMock,
    pixelFormat: "[PC Preview] unknow pixelFormat",
    editable: "[PC Preview] unknow editable",
    alphaType: "[PC Preview] unknow alphaType",
    scaleMode: "[PC Preview] unknow scaleMode"
  }
  const SourceOptionsMock = {
    sourceDensity:"[PC Preview] unknow sourceDensity",
    sourcePixelFormat:"[PC Preview] unknow sourcePixelFormat",
    sourceSize:SizeMock
  }

  const ImageSourceMock = {
    getImageInfo: function (...args) {
      console.warn("ImageSource.getImageInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ImageInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ImageInfoMock);
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
    modifyImageProperty: function (...args) {
      console.warn("ImageSource.modifyImageProperty interface mocked in the Previewer. How this interface works on the Previewer" +
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
    updateData: function (...args) {
      console.warn("ImageSource.updateData interface mocked in the Previewer. How this interface works on the Previewer" +
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
    supportedFormats: "[PC Preview] unknow supportedFormats"
  }
  const ImagePackerMock = {
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
  const ImageMock = {
    clipRect: RegionMock,
    size: SizeMock,
    format: "[PC Preview] unknow format",
    getComponent: function (...args) {
      console.warn("Image.getComponent interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock,ComponentMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(ComponentMock);
        })
      }
    },
    release: function (...args) {
      console.warn("Image.release interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const ImageReceiverMock = {
    size: SizeMock,
    capacity: "[PC Preview] unknow width",
    format: "[PC Preview] unknow format",
    getReceivingSurfaceId: function (...args) {
      console.warn("ImageReceiver.getReceivingSurfaceId interface mocked in the Previewer. How this interface works on the Previewer" +
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
    readLatestImage: function (...args) {
      console.warn("ImageReceiver.readLatestImage interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.ImageMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.ImageMock);
        })
      }
    },
    readNextImage: function (...args) {
      console.warn("ImageReceiver.readNextImage interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.ImageMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.ImageMock);
        })
      }
    },
    on: function (...args) {
      console.warn("ImageReceiver.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    release: function (...args) {
      console.warn("ImageReceiver.release interface mocked in the Previewer. How this interface works on the Previewer" +
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
  const image = {
    PixelMapFormat: {
      UNKNOWN: 0,
      RGB_565: 2,
      RGBA_8888: 3,
    },
    PropertyKey: {
      BITS_PER_SAMPLE: "BitsPerSample",
      ORIENTATION: "Orientation",
      IMAGE_LENGTH: "ImageLength",
      IMAGE_WIDTH: "ImageWidth",
      GPS_LATITUDE: "GPSLatitude",
      GPS_LONGITUDE: "GPSLongitude",
      GPS_LATITUDE_REF: "GPSLatitudeRef",
      GPS_LONGITUDE_REF: "GPSLongitudeRef",
    },
    ImageFormat: {
      YCBCR_422_SP: 1000,
      JPEG: 2000,
    },
    AlphaType: {
      UNKNOWN: 0,
      OPAQUE: 1,
      PREMUL: 2,
      UNPREMUL: 3,
    },
    ScaleMode: {
      FIT_TARGET_SIZE: 0,
      CENTER_CROP: 1,
    },
    ComponentType: {
      YUV_Y: 1,
      YUV_U: 2,
      YUV_V: 3,
      JPEG: 4,
    },
    createPixelMap: function (...args) {
      console.warn("image.createPixelMap interface mocked in the Previewer. How this interface works on the Previewer" +
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
    createImageSource: function () {
      console.warn("image.createImageSource interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return ImageSourceMock;
    },
    CreateIncrementalSource: function () {
      console.warn("image.CreateIncrementalSource interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return ImageSourceMock;
    },
    createImagePacker: function () {
      console.warn("image.createImagePacker interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return ImagePackerMock;
    },
    createImageReceiver: function () {
      console.warn("image.createImageReceiver interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return ImageReceiverMock;
    }
  }
  return image;
}
