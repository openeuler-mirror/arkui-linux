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

@Styles function btnGlobalPressedStyle() { // 组件外定义的按钮摁下的样式
  .backgroundColor(Color.Pink)
  .width(180)
  .height(50)
}

@Styles function btnGlobalNormalStyle() {  // 组件外定义的按钮默认的样式
  .backgroundColor(Color.Blue)
  .width(180)
  .height(50)
}

@Extend(Text) function textStyle2(size: number = 20, color: ResourceColor = Color.Black, bgColor: ResourceColor = Color.Pink) {
  .fontSize(size)
  .fontColor(color)
  .backgroundColor(bgColor)
  .fontStyle(FontStyle.Italic)
  .fontWeight(FontWeight.Bold)
}

@Entry
@Component
struct StyleTest {
  @Styles btnPressStyle() {                // 组件内定义的按钮摁下的样式
    .backgroundColor(Color.Pink)
    .width(180)
    .height(50)
  }

  @Styles btnNormalStyle() {                // 组件内定义的按钮默认的样式
    .backgroundColor(Color.Blue)
    .width(180)
    .height(50)
  }

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

        Text('多态样式')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })


      Text('1. 多种状态样式设置: StateStyles')
        .textStyle()

      Button("Custom Style")
        .width(180)
        .height(50)
        .stateStyles({
          normal: { // 设置默认情况下的显示样式
            .backgroundColor(Color.Blue)
          },
          pressed: { // 设置手指摁下时的显示样式
            .backgroundColor(Color.Pink)
          }
        })

      Text('2. @Styles样式设置')
        .textStyle()

      Button("组件外样式")
        .stateStyles({
          normal: btnGlobalNormalStyle,     // 使用组件外定义的按钮默认的样式
          pressed: btnGlobalPressedStyle    // 使用组件外定义的按钮摁下的样式
        })
        .margin({bottom:10})

      Button("组件内样式")
        .stateStyles({
          normal: this.btnNormalStyle,      // 使用组件内定义的按钮默认的样式
          pressed: this.btnPressStyle       // 使用组件内定义的按钮摁下的样式
        })


      Text('3. @Extend样式设置')
        .textStyle()

      Text("Extend")
        .textStyle2()
        .margin({bottom:10})

      Text("Extend")
        .textStyle2(30, Color.Brown, "#aabbcc")
        .margin({bottom:10})

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}