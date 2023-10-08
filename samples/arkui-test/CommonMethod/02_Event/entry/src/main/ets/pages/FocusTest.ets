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

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}


@Entry
@Component
struct FocusTest {
  @State oneButtonColor: string = '#FFC0CB'
  @State twoButtonColor: string = '#87CEFA'
  @State threeButtonColor: string = '#90EE90'

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

        Text('焦点事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('通过外接键盘的上下键可以让焦点在三个按钮间移动，按钮获焦时颜色变化，失焦时变回原背景色')
      .textStyle()

      Column({ space: 20 }) {
        // 通过外接键盘的上下键可以让焦点在三个按钮间移动，按钮获焦时颜色变化，失焦时变回原背景色
        Button('First Button')
          .backgroundColor(this.oneButtonColor)
          .width(260)
          .height(70)
          .fontColor(Color.Black)
          .focusable(true)
          .onFocus(() => {
            this.oneButtonColor = '#FF0000'
          })
          .onBlur(() => {
            this.oneButtonColor = '#FFC0CB'
          })
        Button('Second Button')
          .backgroundColor(this.twoButtonColor)
          .width(260)
          .height(70)
          .fontColor(Color.Black)
          .focusable(true)
          .onFocus(() => {
            this.twoButtonColor = '#FF0000'
          })
          .onBlur(() => {
            this.twoButtonColor = '#87CEFA'
          })
        Button('Third Button')
          .backgroundColor(this.threeButtonColor)
          .width(260)
          .height(70)
          .fontColor(Color.Black)
          .focusable(true)
          .onFocus(() => {
            this.threeButtonColor = '#FF0000'
          })
          .onBlur(() => {
            this.threeButtonColor = '#90EE90'
          })
      }.width('100%').margin({ top: 20 })

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}