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

export function mockBatteryinfo() {
  const BatteryPluggedType = {
    NONE: 0,
    AC: 1,
    USB: 2,
    WIRELESS: 3
  }
  const BatteryChargeState = {
    NONE: 0,
    ENABLE: 1,
    DISABLE: 2,
    FULL: 3
  }
  const BatteryHealthState = {
    UNKNOWN: 0,
    GOOD: 1,
    OVERHEAT: 2,
    OVERVOLTAGE: 3,
    COLD: 4,
    DEAD: 5
  }
  const BatteryCapacityLevel  = {
    LEVEL_NONE: 0,
    LEVEL_FULL: 1,
    LEVEL_HIGH: 2,
    LEVEL_NORMAL: 3,
    LEVEL_LOW: 4,
    LEVEL_CRITICAL: 5
  }
  const CommonEventBatteryChangedCode  = {
    EXTRA_SOC: 0,
    EXTRA_VOLTAGE: 1,
    EXTRA_TEMPERATURE: 2,
    EXTRA_HEALTH_STATE: 3,
    EXTRA_PLUGGED_TYPE: 4,
    EXTRA_MAX_CURRENT: 5,
    EXTRA_MAX_VOLTAGE: 6,
    EXTRA_CHARGE_STATE: 7,
    EXTRA_CHARGE_COUNTER: 8,
    EXTRA_PRESENT: 9,
    EXTRA_TECHNOLOGY: 10,
  }
  const batteryInfo = {
    BatteryPluggedType,
    BatteryChargeState,
    BatteryHealthState,
    BatteryCapacityLevel,
    CommonEventBatteryChangedCode,
    batterySOC: "[PC Preview] unknow batterySOC",
    chargingStatus: BatteryChargeState,
    healthStatus: BatteryHealthState,
    pluggedType: BatteryPluggedType,
    voltage: "[PC Preview] unknow voltage",
    technology: "[PC Preview] unknow technology",
    batteryTemperature: "[PC Preview] unknow batteryTemperature",
    isBatteryPresent: "[PC Preview] unknow isBatteryPresent",
    batteryCapacityLevel: BatteryCapacityLevel,
    estimatedRemainingChargeTime: "[PC Preview] unknow estimatedRemainingChargeTime",
    totalEnergy: "[PC Preview] unknow totalEnergy",
    nowCurrent: "[PC Preview] unknow nowCurrent",
    remainingEnergy: "[PC Preview] unknow remainingEnergy"
  }
  return batteryInfo
}
