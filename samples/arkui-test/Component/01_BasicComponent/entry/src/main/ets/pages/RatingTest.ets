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
struct RatingTest {
  @State rating: number = 1
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

        Text('评分条组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

        Text('设置不可操作:')
          .fontSize(14)
          .margin({ top: 50, bottom: 10 })
          .textAlign(TextAlign.Start)
          .width('80%')

        Rating({ rating: 0, indicator: true })  // 设置不可操作，默认值为0
          .width(220)
          .height(60)

        Text('设置可操作:')
          .fontSize(14)
          .margin({ top: 20, bottom: 10 })
          .textAlign(TextAlign.Start)
          .width('80%')

        Rating({ rating: 0, indicator: false }) // 设置可操作，默认值为0
          .width(220)
          .height(60)

      Text(`Rating事件:`)
        .fontSize(14)
        .margin({ top: 20, bottom: 10 })
        .textAlign(TextAlign.Start)
        .width('80%')

      Rating({
        rating: this.rating,
        indicator: false
      })
        .width(220)
        .height(40)
        .stars(8)
        .stepSize(0.5)
        .onChange((value) => {
          this.rating = value;
        })

      Text(`总分数：${this.rating}`)
        .fontSize(10)
        .width(220)
        .margin({ top: 5 })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}

