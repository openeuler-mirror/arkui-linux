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

export const LaunchParam = {
    launchReason: LaunchReason,
    lastExitReason: LastExitReason,
}
export const LaunchReason = {
    UNKNOWN: 0,
    START_ABILITY: 1,
    CALL: 2,
    CONTINUATION: 3,
}
export const LastExitReason = {
    UNKNOWN: 0,
    ABILITY_NOT_RESPONDING: 1,
    NORMAL: 2,
}
export const OnContinueResult = {
    AGREE: 0,
    REJECT: 1,
    MISMATCH: 2,
}
export const MemoryLevel = {
    MEMORY_LEVEL_MODERATE: 0,
    MEMORY_LEVEL_LOW: 1,
    MEMORY_LEVEL_CRITICAL: 2,
}
export const WindowMode = {
    WINDOW_MODE_UNDEFINED: 0,
    WINDOW_MODE_FULLSCREEN: 1,
    WINDOW_MODE_SPLIT_PRIMARY: 100,
    WINDOW_MODE_SPLIT_SECONDARY: 101,
    WINDOW_MODE_FLOATING: 102,
}
export function mockAbilityConstant() {
    const AbilityConstant = {
        LaunchParam,
        LaunchReason,
        LastExitReason,
        OnContinueResult,
        MemoryLevel,
        WindowMode
    }
    return AbilityConstant;
}