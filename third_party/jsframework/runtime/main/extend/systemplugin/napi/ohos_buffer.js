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

export function mockBuffer() {
  const paramBuffer = {
    paramIterMock_K : '[PC Preview] unknow iterableiterator_k',
    paramIterMock_V : '[PC Preview] unknow iterableiterator_v'
  }
  const BlobClass = class Blob {
    constructor(...args) {
      console.warn('BlobClass.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      this.size = '[PC preview] unknow size';
      this.type = '[PC preview] unknow type';
      this.arrayBuffer = function (...args) {
        console.warn("BlobClass.arrayBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve) => {
          resolve(paramMock.paramArrayMock)
        });
      };
      this.slice = function (...args) {
        console.warn("BlobClass.slice interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new BlobClass();
      };
      this.text = function (...args) {
        console.warn("BlobClass.text interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        });
      };
    }
  }

  const buffer = {
    alloc: function (...args) {
      console.warn("buffer.alloc interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    allocUninitializedFromPool: function (...args) {
      console.warn("buffer.allocUninitializedFromPool interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    allocUninitialized: function (...args) {
      console.warn("buffer.allocUninitialized interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    byteLength: function (...args) {
      console.warn("buffer.byteLength interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    concat: function (...args) {
      console.warn("buffer.concat interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    from: function (...args) {
      console.warn("buffer.from interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    isBuffer: function (...args) {
      console.warn("buffer.isBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isEncoding: function (...args) {
      console.warn("buffer.isEncoding interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    compare: function (...args) {
      console.warn("buffer.compare interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    transcode: function (...args) {
      console.warn("buffer.transcode interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    Blob: BlobClass,
    Buffer: BufferClass
  }

  const BufferClass = class Buffer {
    constructor() {
      console.warn('BufferClass.constructor interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      this.length = '[PC preview] unknow length',
      this.buffer = '[PC preview] unknow buffer',
      this.byteOffset = '[PC preview] unknow byteOffset',
      this.fill = function (...args) {
      console.warn("Buffer.fill interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    this.compare = function (...args) {
      console.warn("Buffer.compare interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.copy = function (...args) {
      console.warn("Buffer.copy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.equals = function (...args) {
      console.warn("Buffer.equals interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    this.includes = function (...args) {
      console.warn("Buffer.includes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    this.indexOf = function (...args) {
      console.warn("Buffer.indexOf interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.keys = function (...args) {
      console.warn("Buffer.keys interface mockecd in the Previewer. How this interface works on the Previewer" +
        "may be different from that on a real device.")
      const IteratorKMock = {
        *[Symbol.iterator]() {
          yield paramBuffer.paramIterMock_K;
        }
      };
      return IteratorKMock;
    },
    this.values = function (...args) {
      console.warn("Buffer.values interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const IteratorVMock = {
        *[Symbol.iterator]() {
          yield paramBuffer.paramIterMock_V;
        }
      };
      return IteratorVMock;
    },
    this.entries = function (...args) {
      console.warn("Buffer.entries interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const IteratorEntriesMock = {
        *[Symbol.iterator]() {
          yield [paramBuffer.paramIterMock_K, paramBuffer.paramIterMock_V];
        }
      };
      return IteratorEntriesMock;
    },
    this.lastIndexOf = function (...args) {
      console.warn("Buffer.lastIndexOf interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readBigInt64BE = function (...args) {
      console.warn("Buffer.readBigInt64BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readBigInt64LE = function (...args) {
      console.warn("Buffer.readBigInt64LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readBigUInt64BE = function (...args) {
      console.warn("Buffer.readBigUInt64BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readBigUInt64LE = function (...args) {
      console.warn("Buffer.readBigUInt64LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readDoubleBE = function (...args) {
      console.warn("Buffer.readDoubleBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readDoubleLE = function (...args) {
      console.warn("Buffer.readDoubleLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readFloatBE = function (...args) {
      console.warn("Buffer.readFloatBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readFloatLE = function (...args) {
      console.warn("Buffer.readFloatLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readInt8 = function (...args) {
      console.warn("Buffer.readInt8 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readInt16BE = function (...args) {
      console.warn("Buffer.readInt16BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readInt16LE = function (...args) {
      console.warn("Buffer.readInt16LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readInt32BE = function (...args) {
      console.warn("Buffer.readInt32BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readInt32LE = function (...args) {
      console.warn("Buffer.readInt32LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readIntBE = function (...args) {
      console.warn("Buffer.readIntBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readIntLE = function (...args) {
      console.warn("Buffer.readIntLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUInt8 = function (...args) {
      console.warn("Buffer.readUInt8 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUInt16BE = function (...args) {
      console.warn("Buffer.readUInt16BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUInt16LE = function (...args) {
      console.warn("Buffer.readUInt16LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUInt32BE = function (...args) {
      console.warn("Buffer.readUInt32BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUInt32LE = function (...args) {
      console.warn("Buffer.readUInt32LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUIntBE = function (...args) {
      console.warn("Buffer.readUIntBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.readUIntLE = function (...args) {
      console.warn("Buffer.readUIntLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.subarray = function (...args) {
      console.warn("Buffer.subarray interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    this.swap16 = function (...args) {
      console.warn("Buffer.swap16 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    this.swap32 = function (...args) {
      console.warn("Buffer.swap32 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    this.swap64 = function (...args) {
      console.warn("Buffer.swap64 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return new BufferClass();
    },
    this.toJSON = function (...args) {
      console.warn("Buffer.toJSON interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramObjectMock;
    },
    this.toString = function (...args) {
      console.warn("Buffer.toString interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    this.write = function (...args) {
      console.warn("Buffer.write interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeBigInt64BE = function (...args) {
      console.warn("Buffer.writeBigInt64BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeBigInt64LE = function (...args) {
      console.warn("Buffer.writeBigInt64LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeBigUInt64BE = function (...args) {
      console.warn("Buffer.writeBigUInt64BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeBigUInt64LE = function (...args) {
      console.warn("Buffer.writeBigUInt64LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeDoubleBE = function (...args) {
      console.warn("Buffer.writeDoubleBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeDoubleLE = function (...args) {
      console.warn("Buffer.writeDoubleLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeFloatBE = function (...args) {
      console.warn("Buffer.writeFloatBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeFloatLE = function (...args) {
      console.warn("Buffer.writeFloatLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeInt8 = function (...args) {
      console.warn("Buffer.writeInt8 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeInt16BE = function (...args) {
      console.warn("Buffer.writeInt16BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeInt16LE = function (...args) {
      console.warn("Buffer.writeInt16LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeInt32BE = function (...args) {
      console.warn("Buffer.writeInt32BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeInt32LE = function (...args) {
      console.warn("Buffer.writeInt32LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeIntBE = function (...args) {
      console.warn("Buffer.writeIntBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeIntLE = function (...args) {
      console.warn("Buffer.writeIntLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUInt8 = function (...args) {
      console.warn("Buffer.writeUInt8 interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUInt16BE = function (...args) {
      console.warn("Buffer.writeUInt16BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUInt16LE = function (...args) {
      console.warn("Buffer.writeUInt16LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUInt32BE = function (...args) {
      console.warn("Buffer.writeUInt32BE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUInt32LE = function (...args) {
      console.warn("Buffer.writeUInt32LE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUIntBE = function (...args) {
      console.warn("Buffer.writeUIntBE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    this.writeUIntLE = function (...args) {
      console.warn("Buffer.writeUIntLE interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    }
  }
}
return buffer;
}
