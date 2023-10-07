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
  .margin({ top: 20, bottom: 15 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct LinearLayoutTest {
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

        Text('线性容器布局')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

      Text('1. Row: 按照水平方向布局子组件。')
        .textStyle()
      Row() {
        Text()
          .size({width: 90, height: 50})
          .backgroundColor('#aabbcc')
        Text()
          .size({width: 90, height: 50})
          .backgroundColor('#bbccaa')
        Text()
          .size({width: 90, height: 50})
          .backgroundColor('#ccaabb')
      }
      .justifyContent(FlexAlign.Start)
      .size({width: "80%", height: 90})
      .borderWidth(2)
      .borderColor('#E6E6FA')


      Text('2. Column: 按照竖直方向布局子组件。')
        .textStyle()

      Column() {
        Text()
          .size({width: 160, height: 25})
          .backgroundColor('#aabbcc')

        Text()
          .size({width: 160, height: 25})
          .backgroundColor('#bbccaa')

        Text()
          .size({width: 160, height: 25})
          .backgroundColor('#ccaabb')
      }
      .alignItems(HorizontalAlign.Center)
      .justifyContent(FlexAlign.SpaceEvenly)
      .size({width: "80%", height: 120})
      .borderWidth(2)
      .borderColor('#E6E6FA')


      Text('3. Blank: 空白填充组件，用在Row和Column组件内填充组件在主轴方向上的剩余尺寸。')
        .textStyle()

      Row() {
        Text('Bluetooth').fontSize(18)      // 靠左显示
        Blank()                             // 铺满剩余尺寸
        Toggle({ type: ToggleType.Switch }) // 靠右显示
      }
      .width('60%')
      .backgroundColor('#D8BFD8')
      .borderRadius(15)
      .padding({ left: 10})
      .margin({ top: 20 })

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}