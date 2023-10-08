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
  .margin({ top: 20, bottom: 10 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct OtherTest {
  @State account: string = '';
  @State password: string = '';
  @State isShowProgress: boolean = false;
  @State value: string = "";


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

          Text('其它基础组件')
            .fontSize(22)
            .margin({ top: 80, left: 20 })
        }
        .width('80%')

        /* 文本测试 */
        Text('文本测试:')
          .textStyle()
        Text('Hello, Fangtian')
          .backgroundColor('#bbccaa')
          .margin({ top: 2 })
          .width('100%') // 宽度大于文本内容长度，textAlign起作用
          .textAlign(TextAlign.Center)

        /* 按钮测试 */
        Text('按钮测试:')
          .textStyle()

        Button('test')
          .height(40)
          .width(90)
          .backgroundColor('#aabbcc')

        /* 图片测试 */
        Text('图片测试:')
          .textStyle()

        Image($r("app.media.icon"))
          .width(40)
          .height(40)
          .renderMode(ImageRenderMode.Original) // 原图渲染

        /* 输入框测试 */
        Text('输入框测试:')
          .textStyle()

        Column() {
          TextInput({ placeholder: "password" })
            .width('90%')
            .height(45)
            .type(InputType.Password)
            .enterKeyType(EnterKeyType.Done)
            .caretColor(Color.Red)
            .placeholderColor(Color.Gray)
            .placeholderFont({
              size: 16,
              style: FontStyle.Normal,
            })
            .onChange((value) => {
              this.value = value;
            })

          Text("输入内容为：" + this.value)
            .fontSize(10)
            .width('90%')
            .margin({ top: 10 })

        }
        .alignItems(HorizontalAlign.Center)
        .width('100%')
        .padding(10)


        /*二维码测试 */
        Text('二维码测试:')
          .textStyle()

        QRCode('Hello, Fangtian')
          .width(70)
          .height(70)

      }
      .backgroundColor($r('app.color.background'))
      .size({width: '100%', height: '100%'})
  }
}