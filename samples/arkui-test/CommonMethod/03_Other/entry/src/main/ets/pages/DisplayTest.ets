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
struct DisplayTest {
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

        Text('显示效果类属性')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })


      Scroll() {
        Column() {
          Text('原图')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)

          Text('1. 高斯模糊: blur')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .blur(5.5) // 设置图片模糊半径

          Text('2. 背景模糊: backdropBlur')
            .textStyle()
            Text("backdropBlur")
              .textAlign(TextAlign.Center)
              .width(260)
              .height(150)
              .fontColor(Color.White)
              .fontSize(16)
              .backdropBlur(5.5) // 设置背景图片的模糊效果
              .backgroundImage($r("app.media.test"), ImageRepeat.NoRepeat)
              .backgroundImageSize({ height: 150 })

          Text('3. 阴影效果设置: shadow')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .shadow({
              radius: 5.5,
              color: Color.Grey,
              offsetX: vp2px(5),
              offsetY: vp2px(5)
            })

          Text('4. 灰度效果设置: grayscale')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .grayscale(1) // 设置灰度值为1

          Text('5. 高光效果设置: grayscale')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .brightness(0.5)

          Text('6. 饱和度效果设置: saturate')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .saturate(2.5)

          Text('7. 对比度效果设置: contrast')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .contrast(1.5)

          Text('8. 图像反转效果设置: invert')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .invert(1)

          Text('9. 色相旋转效果设置: hueRotate')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .hueRotate(180)

          Text('10. 深褐色效果设置: sepia')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .sepia(1)

          Text('11. 颜色叠加效果设置: colorBlend')
            .textStyle()
          Image($r("app.media.test"))
            .height(150)
            .colorBlend(Color.Blue)
        }
      }
      .size({width: '100%', height: 550})
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}