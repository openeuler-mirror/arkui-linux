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

export function mockHidebug() {
    const hidebug = {
        getNativeHeapSize: function () {
            console.warn("hidebug.getNativeHeapSize interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getNativeHeapAllocatedSize: function () {
            console.warn("hidebug.getNativeHeapAllocatedSize interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getNativeHeapFreeSize: function () {
            console.warn("hidebug.getNativeHeapFreeSize interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getPss: function () {
            console.warn("hidebug.getPss interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getSharedDirty: function () {
            console.warn("hidebug.getSharedDirty interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getPrivateDirty: function () {
            console.warn("hidebug.getPrivateDirty interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        getCpuUsage: function () {
            console.warn("hidebug.getCpuUsage interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramNumberMock;
        },
        startProfiling: function (...args) {
            console.warn("hidebug.startProfiling interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
        },
        stopProfiling: function () {
            console.warn("hidebug.stopProfiling interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
        },
        dumpHeapData: function (...args) {
            console.warn("hidebug.dumpHeapData interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
        },
        getServiceDump: function (...args) {
            console.warn("hidebug.getServiceDump interface mocked in the Previewer. How this interface works on the" +
            " Previewer may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
    }
    return hidebug
}