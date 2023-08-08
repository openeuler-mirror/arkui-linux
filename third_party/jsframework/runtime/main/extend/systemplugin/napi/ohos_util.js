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

export function mockUtil() {
  const TextDecoderClass = class TextDecoder {
    constructor(...args) {
      console.warn("util.TextDecoder.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.decode = function (...args) {
        console.warn("TextDecoder.decode interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramStringMock;
      };
      this.decodeWithStream = function (...args) {
        console.warn("TextDecoder.decodeWithStream interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramStringMock;
      };
      this.encoding = "[PC preview] unknow encoding";
      this.fatal = "[PC preview] unknow fatal";
      this.ignoreBOM = "[PC preview] unknow ignoreBOM"
    }
  };

  const TextEncoderClass = class TextEncoder {
    constructor(...args) {
      console.warn("util.TextEncoder.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.encode = function (...args) {
        console.warn("TextEncoder.encode interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        const arr = new Uint8Array()
        return arr;
      };
      this.encodeInto = function (...args) {
        console.warn("TextEncoder.encodeInto interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramObjectMock;
      };
      this.encoding = "[PC preview] unknow encoding"
    }
  };

  const RationalNumberClass = class RationalNumber {
    constructor(...args) {
      console.warn("util.RationalNumber.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.compareTo = function (...args) {
        console.warn("RationalNumber.compareTo​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.equals = function (...args) {
        console.warn("RationalNumber.equals​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.valueOf = function (...args) {
        console.warn("RationalNumber.valueOf interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getDenominator = function (...args) {
        console.warn("RationalNumber.getDenominator​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getNumerator = function (...args) {
        console.warn("RationalNumber.getNumerator​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.isFinite = function (...args) {
        console.warn("RationalNumber.isFinite​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isNaN = function (...args) {
        console.warn("RationalNumber.isNaN​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isZero = function (...args) {
        console.warn("RationalNumber.isZero​ interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.toString = function (...args) {
        console.warn("RationalNumber.toString interface mocked in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramStringMock;
      }
    }
  };

  RationalNumberClass.getCommonDivisor = function (...args) {
    console.warn("RationalNumber.getDenominator​ interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    return paramMock.paramNumberMock;
  };

  RationalNumberClass.createRationalFromString = function (...args) {
    console.warn("RationalNumber.createRationalFromString​ interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.");
    return new RationalNumberClass();
  };

  const LruBufferClass = class LruBuffer {
    constructor(...args) {
      console.warn("util.LruBuffer.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.updateCapacity = function (...args) {
        console.warn("LruBuffer.updateCapacity interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
      };
      this.toString = function (...args) {
        console.warn("LruBuffer.toString interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramStringMock;
      };
      this.getCapacity = function (...args) {
        console.warn("LruBuffer.getCapacity interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.clear = function (...args) {
        console.warn("LruBuffer.clear interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
      };
      this.getCreateCount = function (...args) {
        console.warn("LruBuffer.getCreateCount interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getMissCount = function (...args) {
        console.warn("LruBuffer.getMissCount interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getRemovalCount = function (...args) {
        console.warn("LruBuffer.getRemovalCount interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getMatchCount = function (...args) {
        console.warn("LruBuffer.getMatchCount interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.getPutCount = function (...args) {
        console.warn("LruBuffer.getPutCount interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramNumberMock;
      };
      this.isEmpty = function (...args) {
        console.warn("LruBuffer.isEmpty​ interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.get = function (...args) {
        console.warn("LruBuffer.get interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramObjectMock;
      };
      this.put = function (...args) {
        console.warn("LruBuffer.put interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramObjectMock;
      };
      this.values = function (...args) {
        console.warn("LruBuffer.values interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramArrayMock;
      };
      this.keys = function (...args) {
        console.warn("LruBuffer.keys​ interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramArrayMock;
      };
      this.remove = function (...args) {
        console.warn("LruBuffer.remove interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramObjectMock;
      };
      this.afterRemoval = function (...args) {
        console.warn("LruBuffer.afterRemoval interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
      };
      this.contains = function (...args) {
        console.warn("LruBuffer.contains​ interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.createDefault = function (...args) {
        console.warn("LruBuffer.createDefault​ interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramObjectMock;
      };
      this.entries = function (...args) {
        console.warn("LruBuffer.entries interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramArrayMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn("LruBuffer.[Symbol.iterator] interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramArrayMock;
      };
      this.length = "[PC preview] unknow length"
    }
  };

  const ScopeComparableMock = {
    compareTo: function(...args) {
      console.warn("ScopeComparable.compareTo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramBooleanMock;
    }
  };

  const ScopeType = "[PC preview] unknow ScopeType";

  const ScopeClass = class Scope {
    constructor(...args) {
      console.warn("util.Scope.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.toString = function (...args) {
        console.warn("Scope.toString interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramStringMock;
      };
      this.intersect = function (...args) {
        console.warn("Scope.intersect interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return new ScopeClass();
      };
      this.getUpper = function (...args) {
        console.warn("Scope.getUpper interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return ScopeType;
      };
      this.getLower = function (...args) {
        console.warn("Scope.getLower interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return ScopeType;
      };
      this.expand = function (...args) {
        console.warn("Scope.expand interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return new ScopeClass();
      };
      this.contains = function (...args) {
        console.warn("Scope.contains interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.clamp = function (...args) {
        console.warn("Scope.clamp interface mockecd in the Previewer. How this interface works on the Previewer" +
          "may be different from that on a real device.");
        return ScopeType;
      }
    } 
  };

  const Base64Class = class Base64 {
    constructor(...args) {
      console.warn("util.Base64.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.encodeSync = function (...args) {
        console.warn("Base64.encodeSync interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        const arr = new Uint8Array()
        return arr;
      };
      this.encodeToStringSync = function (...args) {
        console.warn("Base64.encodeToStringSync interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramStringMock;
      };
      this.decodeSync = function (...args) {
        console.warn("Base64.decodeSync interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        const arr = new Uint8Array()
        return arr;
      };
      this.encode = function (...args) {
        console.warn("Base64.encode interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        const arr = new Uint8Array()
        return new Promise((resolve, reject) => {
          resolve(arr);
        })
      };
      this.encodeToString = function (...args) {
        console.warn("Base64.encodeToString interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      };
      this.decode = function (...args) {
        console.warn("Base64.decode interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        const arr = new Uint8Array()
        return new Promise((resolve, reject) => {
          resolve(arr);
        })
      }
    }
  };

  const typesClass = class types {
    constructor(...args) {
      console.warn("util.types.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.isAnyArrayBuffer = function (...args) {
        console.warn("types.isAnyArrayBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isArrayBufferView = function (...args) {
        console.warn("types.isArrayBufferView interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isArgumentsObject = function (...args) {
        console.warn("types.isArgumentsObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isArrayBuffer = function (...args) {
        console.warn("types.isArrayBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isAsyncFunction = function (...args) {
        console.warn("types.isAsyncFunction interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isBigInt64Array = function (...args) {
        console.warn("types.isBigInt64Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isBigUint64Array = function (...args) {
        console.warn("types.isBigUint64Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isBooleanObject = function (...args) {
        console.warn("types.isBooleanObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isBoxedPrimitive = function (...args) {
        console.warn("types.isBoxedPrimitive interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isDataView = function (...args) {
        console.warn("types.isDataView interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isDate = function (...args) {
        console.warn("types.isDate interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isExternal = function (...args) {
        console.warn("types.isExternal interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isFloat32Array = function (...args) {
        console.warn("types.isFloat32Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isFloat64Array = function (...args) {
        console.warn("types.isFloat64Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isGeneratorFunction = function (...args) {
        console.warn("types.isGeneratorFunction interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isGeneratorObject = function (...args) {
        console.warn("types.isGeneratorObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isInt8Array = function (...args) {
        console.warn("types.isInt8Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isInt16Array = function (...args) {
        console.warn("types.isInt16Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isInt32Array = function (...args) {
        console.warn("types.isInt32Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isMap = function (...args) {
        console.warn("types.isMap interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isMapIterator = function (...args) {
        console.warn("types.isMapIterator interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isModuleNamespaceObject = function (...args) {
        console.warn("types.isModuleNamespaceObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isNativeError = function (...args) {
        console.warn("types.isNativeError interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isNumberObject = function (...args) {
        console.warn("types.isNumberObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isPromise = function (...args) {
        console.warn("types.isPromise interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isProxy = function (...args) {
        console.warn("types.isProxy interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isRegExp = function (...args) {
        console.warn("types.isRegExp interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isSet = function (...args) {
        console.warn("types.isSet interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isSetIterator = function (...args) {
        console.warn("types.isSetIterator interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isSharedArrayBuffer = function (...args) {
        console.warn("types.isSharedArrayBuffer interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isStringObject = function (...args) {
        console.warn("types.isStringObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isSymbolObject = function (...args) {
        console.warn("types.isSymbolObject interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isTypedArray = function (...args) {
        console.warn("types.isTypedArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isUint8Array = function (...args) {
        console.warn("types.isUint8Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isUint8ClampedArray = function (...args) {
        console.warn("types.isUint8ClampedArray interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isUint16Array = function (...args) {
        console.warn("types.isUint16Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isUint32Array = function (...args) {
        console.warn("types.isUint32Array interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isWeakMap = function (...args) {
        console.warn("types.isWeakMap interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      };
      this.isWeakSet = function (...args) {
        console.warn("types.isWeakSet interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramBooleanMock;
      }
    }
  };

  const utilMock = {
    TextDecoder : TextDecoderClass,
    TextEncoder : TextEncoderClass,
    RationalNumber : RationalNumberClass,
    LruBuffer : LruBufferClass,
    Scope : ScopeClass,
    Base64 : Base64Class,
    types : typesClass,
    printf: function (...args) {
      console.warn("util.printf interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    getErrorString: function (...args) {
      console.warn("util.getErrorString interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    callbackWrapper: function (...args) {
      console.warn("util.callbackWrapper interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
    },
    promiseWrapper: function (...args) {
      console.warn("util.promiseWrapper interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramObjectMock;
    },
    promisify: function (...args) {
      console.warn("util.promisify interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramObjectMock;
    },
    randomUUID: function (...args) {
      console.warn("util.randomUUID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    randomBinaryUUID: function (...args) {
      console.warn("util.randomBinaryUUID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramArrayMock;
    },
    parseUUID: function (...args) {
      console.warn("util.parseUUID interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      return paramMock.paramArrayMock;
    }
  };
  return utilMock;
}
