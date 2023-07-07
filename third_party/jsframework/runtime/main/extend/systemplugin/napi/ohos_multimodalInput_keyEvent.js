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

export const Action = {
    CANCEL: 0,
    DOWN: 1,
    UP: 2,
}

export function mockKeyEvent() {
    const Key = {
        code: '[PC preview] unknow code',
        pressedTime: '[PC preview] unknow pressedTime',
        deviceId: '[PC preview] unknow deviceId',
    }
    const KeyEvent = {
        action: '[PC preview] unknow action',
        key: Key,
        unicodeChar: '[PC preview] unknow unicodeChar',
        keys: ['[PC preview] unknow Key'],
        ctrlKey: '[PC preview] unknow ctrlKey',
        altKey: '[PC preview] unknow altKey',
        shiftKey: '[PC preview] unknow shiftKey',
        logoKey: '[PC preview] unknow logoKey',
        fnKey: '[PC preview] unknow fnKey',
        capsLock: '[PC preview] unknow capsLock',
        numLock: '[PC preview] unknow numLock',
        scrollLock: '[PC preview] unknow scrollLock',
    }
    const keyEvent = {
        Action,
    }
    return keyEvent;
}