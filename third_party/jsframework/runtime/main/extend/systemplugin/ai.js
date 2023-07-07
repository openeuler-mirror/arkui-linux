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

export function mockAI() {
  const TTSCallBackMock = {
    key: "[PC preview] unknow key"
  };
  global.systemplugin.ai = {};
  global.systemplugin.ai.TTS = {
    getTTSClient: function () {
      console.warn("ai.TTS.getTTSClient interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return TTSClient
    },
  };
  const TTSClient = {
    init: function (...args) {
      console.warn("TTSClient.init interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    isSpeaking: function () {
      console.warn("TTSClient.isSpeaking interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    setAudioType: function (...args) {
      console.warn("TTSClient.setAudioType interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    setParams: function (...args) {
      console.warn("TTSClient.setParams interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    connectService: function () {
      console.warn("TTSClient.connectService interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    setIsSaveTtsData: function (...args) {
      console.warn("TTSClient.setIsSaveTtsData interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    release: function () {
      console.warn("TTSClient.release interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    speakLongText: function (...args) {
      console.warn("TTSClient.speakLongText interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    speakText: function (...args) {
      console.warn("TTSClient.speakText interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      args[0].success()
      hasComplete(args[0].complete)
    },
    stopSpeak: function () {
      console.warn("TTSClient.stopSpeak interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    destroy: function () {
      console.warn("TTSClient.destroy interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
    },
    on: function (...args) {
      console.warn("TTSClient.on interface mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      const len = args.length
      args[len - 1].call(this, TTSCallBackMock)
    },
    getSupportMaxLength: function () {
      console.warn("TTSClient.getSupportMaxLength interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getVersion: function () {
      console.warn("TTSClient.getVersion interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return paramMock.paramStringMock
    },
  };
}