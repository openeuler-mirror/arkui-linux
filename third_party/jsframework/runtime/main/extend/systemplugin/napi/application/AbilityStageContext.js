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

import { ContextClass } from "./Context"
import { HapModuleInfo } from "../bundle/hapModuleInfo"
import { Configuration } from "../ohos_application_Configuration"

export const AbilityStageContextClass = class AbilityStageContext extends ContextClass {
    constructor() {
        super();
        console.warn("AbilityStageContext.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.currentHapModuleInfo = HapModuleInfo;
        this.config = Configuration;
    }
};
