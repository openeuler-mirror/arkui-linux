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
struct LinearGradientTest {
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

        Text('渐变颜色')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Row() {
        Text()
          .size({ width: 0, height: 80 })
          .layoutWeight(1)
          .linearGradient({
            angle: 90,
            colors: [['#BDE895', 0.1], ["#95DE7F", 0.6], ["#7AB967", 1]]
          })
          .margin({ right: 10 })

        Text()
          .size({ width: 0, height: 80 })
          .layoutWeight(1)
          .linearGradient({
            angle: 135,
            colors: [['#ff4c8f', 0], ["#8933ff", 1]]
          })
          .margin({ right: 10 })
      }.width('50%')
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}