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

export const RequestMethod = {
  OPTIONS: "OPTIONS",
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  TRACE: "TRACE",
  CONNECT: "CONNECT"
};

export const ResponseCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NOT_AUTHORITATIVE: 203,
  NO_CONTENT: 204,
  RESET: 205,
  PARTIAL: 206,
  MULT_CHOICE: 300,
  MOVED_PERM: 301,
  MOVED_TEMP: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_METHOD: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTH: 407,
  CLIENT_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECON_FAILED: 412,
  ENTITY_TOO_LARGE: 413,
  REQ_TOO_LONG: 414,
  UNSUPPORTED_TYPE: 415,
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  VERSION: 505
};

export function mockHttp() {
  const HttpResponse = {
    result: "[PC Preview] unknow result",
    responseCode: ResponseCode,
    header: "[PC Preview] unknow header",
    cookies: "[PC Preview] unknow cookies"
  }
  const HttpRequest = {
    request: function (...args) {
      console.warn("HttpRequest.request interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HttpResponse);
      } else {
        return new Promise((resolve, reject) => {
          resolve(HttpResponse);
        })
      }
    },
    destroy: function () {
      console.warn("HttpRequest.destroy interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("HttpRequest.on interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'headerReceive') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'headersReceive') {
          args[len - 1].call(this, paramMock.paramObjectMock);
        }
      }
    },
    off: function (...args) {
      console.warn("HttpRequest.off interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'headerReceive') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramObjectMock);
        } else if (args[0] === 'headersReceive') {
          args[len - 1].call(this, paramMock.paramObjectMock);
        }
      }
    },
    once: function (...args) {
      console.warn("HttpRequest.once interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramObjectMock);
      }
    }
  }

  const HttpRequestOptions = {
    method: RequestMethod,
    extraData: "[PC Preview] unknow extraData",
    header: "[PC Preview] unknow header",
    readTimeout: "[PC Preview] unknow readTimeout",
    connectTimeout: "[PC Preview] unknow connectTimeout"
  }

  const http = {
    RequestMethod,
    ResponseCode,
    createHttp: function () {
      console.warn("net.http.createHttp interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return HttpRequest;
    },
  }

  return http;
}