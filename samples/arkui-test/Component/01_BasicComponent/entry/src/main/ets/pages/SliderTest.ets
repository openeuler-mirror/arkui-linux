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
struct SliderTest {
  @State outSetValue: number = 40
  @State inSetValue: number = 40
  @State outVerticalSetValue: number = 40
  @State inVerticalSetValue: number = 40

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

        Text('滑动条组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

      Column({ space: 10 }) {
        Row() {
          Slider({
            value: this.outSetValue,
            min: 0,
            max: 100,
            step: 1,
            style: SliderStyle.OutSet
          })
            .blockColor(Color.Red)
            .selectedColor(Color.Red)
            .trackColor(Color.Pink)
            .showSteps(true)
            .showTips(true)
            .trackThickness(4)
            .onChange((value: number, mode: SliderChangeMode) => {
              this.outSetValue = value
            })
          Text(this.outSetValue.toFixed(0))
            .fontSize(16)
        }
        .padding({ top: 50 })
        .width('80%')

        Row() {
          Slider({
            value: this.inSetValue,
            min: 0,
            max: 100,
            step: 1,
            style: SliderStyle.InSet
          })
            .blockColor(0xCCCCCC)
            .trackColor(Color.Black)
            .trackThickness(10)
            .selectedColor(0xCCCCCC)
            .showSteps(false)
            .showTips(false)
            .onChange((value: number, mode: SliderChangeMode) => {
              this.inSetValue = value
            })
          Text(this.inSetValue.toFixed(0))
            .fontSize(16)
        }
        .width('80%')

        Row() {
          Column() {
            Slider({
              value: this.outVerticalSetValue,
              min: 0,
              max: 100,
              step: 1,
              style: SliderStyle.OutSet,
              direction: Axis.Vertical
            })
              .blockColor(Color.Blue)
              .trackColor(Color.Gray)
              .selectedColor(Color.Blue)
              .trackThickness(5)
              .showSteps(true)
              .showTips(true)
              .onChange((value: number, mode: SliderChangeMode) => {
                this.outVerticalSetValue = value
              })
            Text(this.outVerticalSetValue.toFixed(0))
              .fontSize(16)
          }.width('50%').height(300)

          Column() {
            Slider({
              value: this.inVerticalSetValue,
              min: 0,
              max: 100,
              step: 1,
              style: SliderStyle.InSet,
              direction: Axis.Vertical
            })
              .blockColor(Color.Red)
              .trackColor(Color.Pink)
              .selectedColor(Color.Red)
              .showSteps(false)
              .showTips(false)
              .trackThickness(10)
              .onChange((value: number, mode: SliderChangeMode) => {
                this.inVerticalSetValue = value
              })
            Text(this.inVerticalSetValue.toFixed(0))
              .fontSize(16)
          }.width('50%').height(300)
        }
      }.width('100%').margin({ top: 5 })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}
