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

export function mockConvertXml() {
  const ConvertXMLClass = class ConvertXML {
    constructor(...args) {
      console.warn("convertXml.ConvertXML.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.");
      this.convert = function (...args) {
        console.warn("ConvertXML.convert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.");
        return paramMock.paramObjectMock;
      }
     }
  };

  const ConvertXMLMock = {
    ConvertXML : ConvertXMLClass
  };

  const ConvertOptionsMock = {
    trim : '[PC preview] unknow trim',
    ignoreDeclaration : '[PC preview] unknow ignoreDeclaration',
    ignoreInstruction : '[PC preview] unknow ignoreInstruction',
    ignoreAttributes : '[PC preview] unknow ignoreAttributes',
    ignoreComment : '[PC preview] unknow ignoreComment',
    ignoreCDATA : '[PC preview] unknow ignoreCDATA',
    ignoreDoctype : '[PC preview] unknow ignoreDoctype',
    ignoreText : '[PC preview] unknow ignoreText',
    declarationKey : '[PC preview] unknow declarationKey',
    instructionKey : '[PC preview] unknow instructionKey',
    attributesKey : '[PC preview] unknow attributesKey',
    textKey : '[PC preview] unknow textKey',
    cdataKey : '[PC preview] unknow cdataKey',
    doctypeKey : '[PC preview] unknow doctypeKey',
    commentKey : '[PC preview] unknow commentKey',
    parentKey : '[PC preview] unknow parentKey',
    typeKey : '[PC preview] unknow typeKey',
    nameKey : '[PC preview] unknow nameKey',
    elementsKey : '[PC preview] unknow elementsKey'
  };
  return ConvertXMLMock;
}
