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
import { AbilityContextClass as _AbilityContext } from "./application/AbilityContext"
import { AbilityStageContextClass as _AbilityStageContext } from "./application/AbilityStageContext"
import { ApplicationContextClass as _ApplicationContext } from "./application/ApplicationContext"
import { BaseContextClass as _BaseContext } from "./application/BaseContext"
import { ContextClass as _Context } from "./application/Context"
import { ExtensionContextClass as _ExtensionContext } from "./application/ExtensionContext"
import { FormExtensionContextClass as _FormExtensionContext } from "./application/FormExtensionContext"
import { EventHubClass as _EventHub } from "./application/EventHub"
import { PermissionRequestResultClass as _PermissionRequestResult } from "./application/PermissionRequestResult"

export const AreaMode = {
    EL1: 0,
    EL2: 1
}
export function mockContext() {
    const Context = {
        AbilityContext: new _AbilityContext(),
        AbilityStageContext: new _AbilityStageContext(),
        ApplicationContext: new _ApplicationContext(),
        BaseContext: new _BaseContext(),
        Context: new _Context(),
        ExtensionContext: new _ExtensionContext(),
        FormExtensionContext: new _FormExtensionContext(),
        AreaMode,
        EventHub: new _EventHub(),
        PermissionRequestResult: new _PermissionRequestResult()
    }
    return Context;
}