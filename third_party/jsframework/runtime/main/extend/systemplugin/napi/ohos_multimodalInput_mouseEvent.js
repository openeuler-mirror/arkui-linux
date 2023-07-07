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
    MOVE: 1,
    BUTTON_DOWN: 2,
    BUTTON_UP: 3,
    AXIS_BEGIN: 4,
    AXIS_UPDATE: 5,
    AXIS_END: 6,
}

export const Button = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    SIDE: 3,
    EXTRA: 4,
    FORWARD: 5,
    BACK: 6,
    TASK: 7,
}

export const Axis = {
    SCROLL_VERTICAL: 0,
    SCROLL_HORIZONTAL: 1,
    PINCH: 2,
}

export function mockMouseEvent() {
    const AxisValue = {
        axis: '[PC preview] unknow axis',
        value: '[PC preview] unknow value',
    }
    const MouseEvent = {
        action: '[PC preview] unknow action',
        screenX: '[PC preview] unknow screenX',
        screenY: '[PC preview] unknow screenY',
        windowX: '[PC preview] unknow windowX',
        windowY: '[PC preview] unknow windowY',
        rawDeltaX: '[PC preview] unknow rawDeltaX',
        rawDeltaY: '[PC preview] unknow rawDeltaY',
        button: '[PC preview] unknow button',
        pressedButtons: ['[PC preview] unknow pressedButtons'],
        axes: ['[PC preview] unknow axes'],
        pressedKeys: ['[PC preview] unknow pressedKeys'],
        ctrlKey: '[PC preview] unknow ctrlKey',
        altKey: '[PC preview] unknow altKey',
        shiftKey: '[PC preview] unknow shiftKey',
        logoKey: '[PC preview] unknow logoKey',
        fnKey: '[PC preview] unknow fnKey',
        capsLock: '[PC preview] unknow capsLock',
        numLock: '[PC preview] unknow numLock',
        scrollLock: '[PC preview] unknow scrollLock',
    }
    const mouseEvent = {
        Action,
        Button,
        Axis,
    }
    return mouseEvent;
}