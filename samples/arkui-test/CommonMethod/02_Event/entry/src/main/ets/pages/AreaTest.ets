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

@Styles function btnGlobalPressedStyle() { // 定义一个全局样式
  .backgroundColor(Color.Pink)
  .width(180)
  .height(50)
}

@Styles function btnGlobalNormalStyle() {  // 定义一个全局样式
  .backgroundColor(Color.Blue)
  .width(180)
  .height(50)
}

@Entry
@Component
struct AreaTest {
  @State text: string = "";
  @State area: string = "";
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

        Text('区域变化事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {

        Button("Change Area")
          .stateStyles({
            normal: btnGlobalNormalStyle,
            pressed: btnGlobalPressedStyle
          })
          .onClick(() => {
            this.text += "change ";
          })

        Text(this.text)
          .fontSize(18)
          .onAreaChange((oldArea, newArea) => {
            this.area = "old:\n" + JSON.stringify(oldArea) + "\n\n\nnew:\n" + JSON.stringify(newArea);
          })

        Text(this.area)
          .fontSize(18)
      }
      .width('80%')
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}