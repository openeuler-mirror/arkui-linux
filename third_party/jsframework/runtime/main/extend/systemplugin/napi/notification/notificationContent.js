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
import { ContentType } from "../ohos_notification"
import { PixelMapMock } from "../ohos_multimedia_image"

export const NotificationBasicContent = {
    title: '[PC preview] unknow title',
    text: '[PC preview] unknow text',
    additionalText: '[PC preview] unknow additionalText',
}
export const NotificationLongTextContent = {
    longText: '[PC preview] unknow longText',
    briefText: '[PC preview] unknow briefText',
    expandedTitle: '[PC preview] unknow expandedTitle',
}
export const NotificationMultiLineContent = {
    briefText: '[PC preview] unknow briefText',
    longTitle: '[PC preview] unknow longTitle',
    lines: [paramMock.paramStringMock],
}
export const NotificationPictureContent = {
    briefText: '[PC preview] unknow briefText',
    expandedTitle: '[PC preview] unknow expandedTitle',
    picture: PixelMapMock,
}
export const NotificationContent = {
    contentType: ContentType,
    normal: NotificationBasicContent,
    longText: NotificationLongTextContent,
    multiLine: NotificationMultiLineContent,
    picture: NotificationPictureContent,
}