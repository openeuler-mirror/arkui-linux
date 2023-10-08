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
struct CutTest {
  @State text: string = ''
  @State eventType: string = ''
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

        Text('公共剪切类属性')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('1. 遮罩设置: mask')
      .textStyle()

      Image($r("app.media.test")) // 默认图片
        .height(150)
        .margin({bottom:20})

      Image($r("app.media.test")) // 居左剪切出一个圆
        .width(120)
        .height(120)
        .mask(new Circle({width: 120, height: 120}).fill(Color.Pink))

      Text('2. 剪切设置: clip')
        .textStyle()

      Image($r("app.media.test"))   // 居右剪切出一个圆
        .width(120)
        .height(120)
        .clip(new Circle({width: 120, height: 120}).fill(Color.Pink))

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}