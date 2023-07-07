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
import { mockDataAbility } from "../ohos_data_dataAbility"

export const DataAbilityOperation = {
  uri: "[PC Preview] unknow uri",
  type: {
    TYPE_INSERT: 1,
    TYPE_UPDATE: 2,
    TYPE_DELETE: 3,
    TYPE_ASSERT: 4
  },
  valuesBucket: {key:{}},
  valueBackReferences: {key:{}},
  predicates: mockDataAbility().DataAbilityPredicates,
  predicatesBackReferences: new Map([[paramMock.paramNumberMock, paramMock.paramNumberMock]]),
  interrupted: "[PC Preview] unknow interrupted",
  expectedCount: "[PC Preview] unknow expectedCount"
}