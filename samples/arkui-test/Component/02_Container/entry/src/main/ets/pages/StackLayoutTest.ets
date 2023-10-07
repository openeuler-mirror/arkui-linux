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
struct StackLayoutTest {
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

        Text('层叠容器布局')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

      Stack({alignContent: Alignment.Bottom}) {
        Text('Text1')
          .width(200)
          .height(180)
            // .textAlign(TextAlign.End)
          .backgroundColor("#aabbcc")

        Text('Text2')
          .width(130)
          .height(100)
            // .textAlign(TextAlign.End)
          .backgroundColor('#bbccaa')

        Text('Text3')       // 被遮挡住了
          .backgroundColor('#ccaabb')

        Text('Text4')
          .width(60)
          .height(45)
            // .textAlign(TextAlign.End)
          .backgroundColor('#abcabc')
      }
      .backgroundColor(Color.Pink)
      .width("80%")
      .height('200')
      .margin({ top: 20 })


      Stack({alignContent: Alignment.Center}) {
        Text('Text1')
          .width(200)
          .height(180)
          .backgroundColor("#aabbcc")

        Text('Text2')
          .width(130)
          .height(100)
          .backgroundColor('#bbccaa')

        Text('Text3')       // 被遮挡住了
          .backgroundColor('#ccaabb')

        Text('Text4')
          .width(60)
          .height(45)
          .backgroundColor('#abcabc')
      }
      .backgroundColor(Color.Pink)
      .width("80%")
      .height('200')
      .margin({ top: 20 })


      Stack({alignContent: Alignment.TopStart}) {
        Text('Text1')
          .width(200)
          .height(180)
          .textAlign(TextAlign.End)
          .backgroundColor("#aabbcc")

        Text('Text2')
          .width(130)
          .height(100)
          .textAlign(TextAlign.End)
          .backgroundColor('#bbccaa')

        Text('Text3')       // 被遮挡住了
          .backgroundColor('#ccaabb')

        Text('Text4')
          .width(60)
          .height(45)
          .textAlign(TextAlign.End)
          .backgroundColor('#abcabc')
      }
      .backgroundColor(Color.Pink)
      .width("80%")
      .height('200')
      .margin({ top: 20 })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}