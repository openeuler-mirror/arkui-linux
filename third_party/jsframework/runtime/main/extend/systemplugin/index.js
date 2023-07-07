/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

import regeneratorRuntime from 'babel-runtime/regenerator'

import {
  mockAbilityFeatureAbility,
  mockAbilityParticleAbility,
  mockAbilityFormManager,
  mockAbilityContinuationRegisterManager,
  mockAbilityAbilityAgent,
  mockAbilityFormBindingData
} from './ability'
import { mockAppAbilityManager } from './ohos/app'

import { mockBattery } from './battery'
import { mockBrightness } from './brightness'
import { mockOhosBluetooth } from './ohos/bluetooth'
import { mockDistributedSchedule } from './distributedSchedule'
import { mockFetch } from './fetch'
import { mockFeatureAbility } from './featureAbility'
import { mockGeolocation } from './geolocation'
import { mockNotification } from './notification'
import { mockCommonEvent } from './ohos/commonEvent'
import { mockOhosRequest } from './ohos/request'
import { mockSensor } from './sensor'
import { mockStorage } from './storage'
import { mockStorageInfoManager } from './ohos/storageInfoManager'
import { mockSystemPackage } from './systemPackage'

import { mockUserauth } from './userIAM'
import { mockVibrator } from './vibrator'
import { mockRequireNapiFun } from './napi'
import { mockAI } from './ai'
import { mockUserIAMUserAuth } from './ohos/userIAMuserAuth.js'
import { mockBundleManager } from './ohos/bundleManager'
import { mockPackageManager } from './ohos/packageManager'
import { mockCalendar } from "./calendar"

export function mockSystemPlugin() {
  global.regeneratorRuntime = regeneratorRuntime

  global.systemplugin = {}
  global.ohosplugin = {}

  mockNotification()
  mockCommonEvent()
  mockFetch()
  mockStorage()
  mockVibrator()
  mockSensor()
  mockGeolocation()
  mockBattery()
  mockBrightness()
  mockSystemPackage()
  mockFeatureAbility()
  mockOhosBluetooth()
  mockUserauth()
  mockDistributedSchedule()
  mockOhosRequest()
  mockAbilityFeatureAbility()
  mockAbilityContinuationRegisterManager()
  mockRequireNapiFun()
  mockAbilityParticleAbility()
  mockAbilityFormManager()
  mockAbilityAbilityAgent()
  mockAbilityFormBindingData()
  mockAI()
  mockStorageInfoManager()
  mockAppAbilityManager()
  mockUserIAMUserAuth()
  mockBundleManager()
  mockPackageManager()
  mockCalendar()
}
