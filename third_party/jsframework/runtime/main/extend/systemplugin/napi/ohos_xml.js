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
export function mockXml() {
  const XmlSerializerClass = class XmlSerializer {
    constructor(...args) {
      console.warn("XmlSerializer.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.setAttributes = function (...args) {
        console.warn("XmlSerializer.setAttributes interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.addEmptyElement = function (...args) {
        console.warn("XmlSerializer.addEmptyElement interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setDeclaration = function (...args) {
        console.warn("XmlSerializer.setDeclaration interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.startElement = function (...args) {
        console.warn("XmlSerializer.startElement interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.endElement = function (...args) {
        console.warn("XmlSerializer.endElement interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setNamespace = function (...args) {
        console.warn("XmlSerializer.setNamespace interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setComment = function (...args) {
        console.warn("XmlSerializer.setCommnet interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setCData = function (...args) {
        console.warn("XmlSerializer.setCData interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setText = function (...args) {
        console.warn("XmlSerializer.setText interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      };
      this.setDocType = function (...args) {
        console.warn("XmlSerializer.setDocType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      }
    }
  };

  const XmlPullParserClass = class XmlPullParser {
    constructor(...args) {
      console.warn("XmlPullParser.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.parse = function (...args) {
        console.warn("XmlPullParser.parse interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      }
    }
  };

  const xmlMock = {
    XmlSerializer : XmlSerializerClass,
    XmlPullParser : XmlPullParserClass,

    EventType : {
    START_DOCUMENT: 0,
    END_DOCUMENT: 1,
    START_TAG: 2,
    END_TAG: 3,
    TEXT: 4,
    CDSECT: 5,
    COMMENT: 6,
    DOCDECL: 7,
    INSTRUCTION: 8,
    ENTITY_REFERENCE: 9,
    WHITESPACE: 10
    }
  };

  const ParseInfoMock = {
    getColumnNumber: function () {
      console.warn("ParseInfo.getColumnNumber interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getDepth: function () {
      console.warn("ParseInfo.getDepth interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getLineNumber: function () {
      console.warn("ParseInfo.getLineNumber interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getName: function () {
      console.warn("ParseInfo.getName interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getNamespace: function () {
      console.warn("ParseInfo.getNamespace interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getPrefix: function () {
      console.warn("ParseInfo.getPrefix interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getText: function () {
      console.warn("ParseInfo.getText interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    isEmptyElementTag: function () {
      console.warn("ParseInfo.isEmptyElementTag interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isWhitespace: function () {
      console.warn("ParseInfo.isWhitespace interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getAttributeCount: function () {
      console.warn("ParseInfo.getAttributeCount interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
      return paramMock.paramNumberMock;
    }
  };

  const ParseOptionsMock = {
    supportDoctype: '[PC preview] unknow supportDoctype',
    ignoreNameSpace: '[PC preview] unknow ignoreNameSpace',
    tagValueCallbackFunction: function(...args) {
    console.warn("ParseOptions.tagValueCallbackFunction interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
    },
    attributeValueCallbackFunction: function(...args) {
    console.warn("ParseOptions.attributeValueCallbackFunction interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
    },
    tokenValueCallbackFunction: function(...args) {
    console.warn("ParseOptions.tokenValueCallbackFunction interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
    }
  };
  return xmlMock;
}
