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
struct GridContainerTest {
  @State sizeType: SizeType = SizeType.XS
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

        Text('格栅布局容器')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 5 }) {
        GridContainer({ columns: 12, sizeType: this.sizeType, gutter: 10, margin: 20 }) {
          Row() {
            Text('1')
              .useSizeType({
                xs: { span: 6, offset: 0 },
                sm: { span: 2, offset: 0 },
                md: { span: 2, offset: 0 },
                lg: { span: 2, offset: 0 }
              })
              .height(50).backgroundColor(0x4682B4).textAlign(TextAlign.Center)
            Text('2')
              .useSizeType({
                xs: { span: 2, offset: 6 },
                sm: { span: 6, offset: 2 },
                md: { span: 2, offset: 2 },
                lg: { span: 2, offset: 2 }
              })
              .height(50).backgroundColor(0x00BFFF).textAlign(TextAlign.Center)
            Text('3')
              .useSizeType({
                xs: { span: 2, offset: 8 },
                sm: { span: 2, offset: 8 },
                md: { span: 6, offset: 4 },
                lg: { span: 2, offset: 4 }
              })
              .height(50).backgroundColor(0x4682B4).textAlign(TextAlign.Center)
            Text('4')
              .useSizeType({
                xs: { span: 2, offset: 10 },
                sm: { span: 2, offset: 10 },
                md: { span: 2, offset: 10 },
                lg: { span: 6, offset: 6 }
              })
              .height(50).backgroundColor(0x00BFFF).textAlign(TextAlign.Center)
          }
        }.width('80%')

        Text('Click Simulate to change the device width').fontSize(9).width('80%').fontColor(0xCCCCCC)
        Row() {
          Button('XS')
            .onClick(() => {
              this.sizeType = SizeType.XS
            }).backgroundColor(0x317aff)
          Button('SM')
            .onClick(() => {
              this.sizeType = SizeType.SM
            }).backgroundColor(0x317aff)
          Button('MD')
            .onClick(() => {
              this.sizeType = SizeType.MD
            }).backgroundColor(0x317aff)
          Button('LG')
            .onClick(() => {
              this.sizeType = SizeType.LG
            }).backgroundColor(0x317aff)
        }
      }.width('100%').margin({ top: 5 })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}