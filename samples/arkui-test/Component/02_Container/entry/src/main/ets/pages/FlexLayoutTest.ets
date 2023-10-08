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
struct FlexLayoutTest {
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

        Text('弹性容器布局')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

      Text('1. 子组件由右向左:')
        .textStyle()

      Flex({direction: FlexDirection.Row}) {
        Text('Text1')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#aabbcc")
        Text('Text2')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#bbaacc")
        Text('Text3')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#ccaabb")
        Text('Text4')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#abcabc")
      }
      .width('80%')
      .height(60)
      .backgroundColor('#E6E6FA')


      Text('2. 子组件由上至下')
        .textStyle()

      Flex({direction: FlexDirection.ColumnReverse}) {
        Text('Text1')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#aabbcc")
        Text('Text2')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#bbaacc")
        Text('Text3')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#ccaabb")
        Text('Text4')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#abcabc")
      }
      .width('80%')
      .height(220)
      .backgroundColor('#E6E6FA')


      Text('3. 等间距布局:')
        .textStyle()
      Flex({direction: FlexDirection.Row, justifyContent: FlexAlign.SpaceEvenly}) {
        Text('Text1')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#aabbcc")
        Text('Text2')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#bbaacc")
        Text('Text3')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#ccaabb")
        Text('Text4')
          .fontSize(16)
          .padding(10)
          .backgroundColor("#abcabc")
      }
      .width('80%')
      .height(60)
      .backgroundColor('#E6E6FA')

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}