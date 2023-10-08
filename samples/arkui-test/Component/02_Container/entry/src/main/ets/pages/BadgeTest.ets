/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
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

import router from '@ohos.router';

@Entry
@Component
struct BadgeTest {
  @State counts: number = 1
  @State message: string = 'new'
  build() {
    Column(){
      Row() {
        Button('返回', { type: ButtonType.Normal })
          .height(30)
          .width(50)
          .fontColor('#696969')
          .backgroundColor('#DCDCDC')
          .onClick(() => {
            router.replaceUrl({ url: 'pages/MainPage' });
          })
          .margin({ top: 80 })
          .align(Alignment.Start)

        Text('角标组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Flex({ justifyContent: FlexAlign.SpaceAround }) {
        Badge({
          count: this.counts,
          maxCount: 99,
          style: { color: 0xFFFFFF, fontSize: 12, badgeSize: 20, badgeColor: Color.Red }
        }) {
          Button('message')
            .onClick(() => {
              this.counts++
            })
            .width(100).height(50).backgroundColor(0x317aff)
        }.width(100).height(50)

        Badge({
          value: this.message,
          style: { color: 0xFFFFFF, fontSize: 9, badgeSize: 20, badgeColor: Color.Blue }
        }) {
          Text('message')
            .width(80)
            .height(50)
            .fontSize(16)
            .borderRadius(10)
            .textAlign(TextAlign.Center)
            .backgroundColor(Color.Pink)
        }.width(80).height(50)

        Badge({
          value: ' ',
          position: BadgePosition.RightTop,
          style: { badgeSize: 6, badgeColor: Color.Red }
        }) {
          Text('message')
            .width(90)
            .height(50)
            .fontSize(16)
            .borderRadius(10)
            .textAlign(TextAlign.Center)
            .backgroundColor(Color.Pink)
        }.width(90).height(50)
      }.width('100%').margin({ top: 10 })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}