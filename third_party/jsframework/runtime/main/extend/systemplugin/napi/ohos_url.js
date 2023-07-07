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

import { paramMock } from '../utils';

export function mockUrl() {
  const URLSearchParamsClass = class URLSearchParams {
    constructor(...args) {
      console.warn('url.URLSearchParams.constructor interface mocked in the Previewer. How this interface works on' +
        ' the Previewer' +
        ' may be different from that on a real device.');
      this.append = function (...args) {
        console.warn('url.URLSearchParams.append interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
      };
      this.delete = function (...args) {
        console.warn('url.URLSearchParams.delete interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
      };
      this.getAll = function (...args) {
        console.warn('url.URLSearchParams.getAll interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return [paramMock.paramStringMock];
      };
      this.entries = function (...args) {
        console.warn('url.URLSearchParams.entries interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorTwoStringMock = {
          *[Symbol.iterator]() {
            yield [paramMock.paramStringMock, paramMock.paramStringMock];
          }
        };
        return IteratorTwoStringMock;
      };
      this.forEach = function (...args) {
        console.warn('url.URLSearchParams.forEach interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
      };
      this.get = function (...args) {
        console.warn('url.URLSearchParams.get interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return paramMock.paramStringMock;
      };
      this.has = function (...args) {
        console.warn('url.URLSearchParams.has interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return paramMock.paramBooleanMock;
      };
      this.set = function (...args) {
        console.warn('url.URLSearchParams.set interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
      };
      this.sort = function (...args) {
        console.warn('url.URLSearchParams.sort interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
      };
      this.keys = function (...args) {
        console.warn('url.URLSearchParams.keys interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorStringMock = {
          *[Symbol.iterator]() {
            yield paramMock.paramStringMock;
          }
        };
        return IteratorStringMock;
      };
      this.values = function (...args) {
        console.warn('url.URLSearchParams.values interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        const IteratorStringMock = {
          *[Symbol.iterator]() {
            yield paramMock.paramStringMock;
          }
        };
        return IteratorStringMock;
      };
      this.toString = function (...args) {
        console.warn('url.URLSearchParams.toString interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return paramMock.paramStringMock;
      };
      this[Symbol.iterator] = function (...args) {
        console.warn('url.URLSearchParams.[Symbol.iterator] interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        let index = 0;
        const IteratorTwoStringMock = {
          next: () => {
            if (index < 1) {
              const returnValue = [paramMock.paramStringMock, paramMock.paramStringMock];
              index++;
              return {
                value: returnValue,
                done: false
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return IteratorTwoStringMock;
      }
    }
  };
  const URLClass = class URL {
    constructor(...args) {
      console.warn('url.URL.constructor interface mocked in the Previewer. How this interface works on the Previewer' +
        ' may be different from that on a real device.');
      this.toString = function (...args) {
        console.warn('URL.toString interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return paramMock.paramStringMock;
      };
      this.toJSON = function (...args) {
        console.warn('URL.toJSON interface mocked in the Previewer. How this interface works on the Previewer' +
          ' may be different from that on a real device.');
        return paramMock.paramStringMock;
      };
      this.hash = '[PC preview] unknow hash';
      this.host = '[PC preview] unknow host';
      this.hostname = '[PC preview] unknow hostname';
      this.href = '[PC preview] unknow href';
      this.origin = '[PC preview] unknow origin';
      this.password = '[PC preview] unknow password';
      this.pathname = '[PC preview] unknow pathname';
      this.port = '[PC preview] unknow port';
      this.protocol = '[PC preview] unknow protocol';
      this.search = '[PC preview] unknow search';
      this.searchParams = new URLSearchParamsClass();
      this.username = '[PC preview] unknow username';
    }
  };
  const urlMock = {
    URLSearchParams: URLSearchParamsClass,
    URL: URLClass
  };
  return urlMock;
}
