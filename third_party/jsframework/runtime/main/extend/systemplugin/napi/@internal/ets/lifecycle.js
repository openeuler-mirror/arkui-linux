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
import { FormBindingData } from "../ohos_application_formBindingData"
import { FormState } from "../ohos_application_formInfo"
import { paramMock } from "../../utils"
import { RemoteObjectClass } from "../ohos_rpc"
import { ResultSet, PacMapType } from "../ohos_ability_featureAbility"

const DataAbilityResult = {
    uri: "[PC Preview] unknow uri",
    count: "[PC Preview] unknow count",
}
export const LifecycleForm = {
    onCreate: function (...args) {
        console.warn("LifecycleForm.onCreate interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
        return FormBindingData;
    },
    onCastToNormal: function (...args) {
        console.warn("LifecycleForm.onCastToNormal interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onUpdate: function (...args) {
        console.warn("LifecycleForm.onUpdate interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onVisibilityChange: function (...args) {
        console.warn("LifecycleForm.onVisibilityChange interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onEvent: function (...args) {
        console.warn("LifecycleForm.onEvent interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onDestroy: function (...args) {
        console.warn("LifecycleForm.onDestroy interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onAcquireFormState: function (...args) {
        console.warn("LifecycleForm.onAcquireFormState interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
        return FormState;
    },
    onShare: function (...args) {
      console.warn("LifecycleForm.onShare interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      return {"key": "unknow any"};
  },
}
export const LifecycleApp = {
    onShow: function () {
        console.warn("LifecycleApp.onShow interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onHide: function () {
        console.warn("LifecycleApp.onHide interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onDestroy: function () {
        console.warn("LifecycleApp.onDestroy interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onCreate: function () {
        console.warn("LifecycleApp.onCreate interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onWindowDisplayModeChanged: function (...args) {
        console.warn("LifecycleApp.onWindowDisplayModeChanged interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onStartContinuation: function () {
        console.warn("LifecycleApp.onStartContinuation interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
        return paramMock.paramBooleanMock;
    },
    onSaveData: function (...args) {
        console.warn("LifecycleApp.onSaveData interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
        return paramMock.paramBooleanMock;
    },
    onCompleteContinuation: function (...args) {
        console.warn("LifecycleApp.onCompleteContinuation interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onRestoreData: function (...args) {
        console.warn("LifecycleApp.onRestoreData interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onRemoteTerminated: function () {
        console.warn("LifecycleApp.onRemoteTerminated interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onSaveAbilityState: function (...args) {
        console.warn("LifecycleApp.onSaveAbilityState interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onRestoreAbilityState: function (...args) {
        console.warn("LifecycleApp.onRestoreAbilityState interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onInactive: function () {
        console.warn("LifecycleApp.onInactive interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onActive: function () {
        console.warn("LifecycleApp.onActive interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onNewWant: function (...args) {
        console.warn("LifecycleApp.onNewWant interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onMemoryLevel: function (...args) {
        console.warn("LifecycleApp.onMemoryLevel interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
}
export const LifecycleService = {
    onStart: function () {
        console.warn("LifecycleService.onStart interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onCommand: function (...args) {
        console.warn("LifecycleService.onCommand interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onStop: function () {
        console.warn("LifecycleService.onStop interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onConnect: function (...args) {
        console.warn("LifecycleService.onConnect interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
        return new RemoteObjectClass();
    },
    onDisconnect: function (...args) {
        console.warn("LifecycleService.onDisconnect interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    onReconnect: function (...args) {
        console.warn("LifecycleService.onReconnect interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
}
export const LifecycleData = {
    update: function (...args) {
        console.warn("LifecycleData.update interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        }
    },
    query: function (...args) {
        console.warn("LifecycleData.query interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, ResultSet);
        }
    },
    delete: function (...args) {
        console.warn("LifecycleData.delete interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        }
    },
    normalizeUri: function (...args) {
        console.warn("LifecycleData.normalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        }
    },
    batchInsert: function (...args) {
        console.warn("LifecycleData.batchInsert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        }
    },
    denormalizeUri: function (...args) {
        console.warn("LifecycleData.denormalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        }
    },
    insert: function (...args) {
        console.warn("LifecycleData.insert interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        }
    },
    openFile: function (...args) {
        console.warn("LifecycleData.openFile interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        }
    },
    getFileTypes: function (...args) {
        console.warn("LifecycleData.getFileTypes interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramStringMock]);
        }
    },
    onInitialized: function (...args) {
        console.warn("LifecycleData.onInitialized interface mocked in the Previewer. How this interface works on the Previewer may" +
          " be different from that on a real device.")
    },
    getType: function (...args) {
        console.warn("LifecycleData.getType interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
        }
    },
    executeBatch: function (...args) {
        console.warn("LifecycleData.executeBatch interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, [DataAbilityResult]);
        }
    },
    call: function (...args) {
        console.warn("LifecycleData.call interface mocked in the Previewer. How this interface works on the Previewer" +
          " may be different from that on a real device.")
        const len = args.length
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, PacMapType);
        }
    },
}