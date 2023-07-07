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
import { paramMock } from "../../utils"
const ContinuationMode = {
    COLLABORATION_SINGLE: 0,
    COLLABORATION_MULTIPLE: 1
}
export const ContinuationExtraParams = {
    deviceType: [paramMock.paramStringMock],
    targetBundle: "[PC Preview] unknow targetBundle",
    description: "[PC Preview] unknow description",
    filter: "[PC Preview] unknow filter",
    continuationMode: ContinuationMode,
    authInfo: {"key":"unknow any"}
}
