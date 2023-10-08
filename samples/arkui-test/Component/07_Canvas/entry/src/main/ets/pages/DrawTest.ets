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
struct DrawTest {
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

          Text('图形与Shape')
            .fontSize(22)
            .margin({ top: 80, left: 20 })
        }
        .width('80%')
        .margin({ bottom: 30 })

        Scroll() {
          Column() {
            Text('1. Circle:')
              .textStyle()
            Row() {
              Circle()
                .width(80)
                .height(80)
                .strokeWidth(3)
                .stroke(Color.Red)
                .margin({ right: 20 })
              Circle()
                .width(80)
                .height(80)
                .strokeWidth(3)
                .stroke(Color.Red)
                .strokeMiterLimit(5)
                .strokeLineJoin(LineJoinStyle.Miter)
                .strokeLineCap(LineCapStyle.Butt)
                .strokeDashArray([0, 1, 2, 3, 4, 5])
                .fill(Color.Gray)
                .fillOpacity(0.3)
            }
            .width("80%")

            Text('2. Ellipse:')
              .textStyle()
            Row() {
              Ellipse()
                .width(130)
                .height(80)
                .strokeWidth(3)
                .stroke(Color.Red)
                .margin({ right: 20 })
              Ellipse()
                .width(130)
                .height(80)
                .strokeWidth(3)
                .stroke(Color.Red)
                .strokeMiterLimit(5)
                .strokeLineJoin(LineJoinStyle.Miter)
                .strokeLineCap(LineCapStyle.Butt)
                .strokeDashArray([0, 1, 2, 3, 4, 5])
                .fill(Color.Gray)
                .fillOpacity(0.3)
            }
            .width("80%")

            Text('3. Line:')
              .textStyle()
            Line()
              .width(150)
              .height(30)
              .startPoint([0, 0])
              .endPoint([150, 30])
              .backgroundColor(Color.Pink)

            Text('4. Path:')
              .textStyle()
            Column({ space: 10 }) {
              Text('Straight line')
                .fontSize(11)
                .fontColor(0xCCCCCC)
                .width('100%')
              // 绘制一条长900px，宽3vp的直线
              Path()
                .height(10)
                .commands('M0 0 L600 0')
                .stroke(Color.Black)
                .strokeWidth(3)

              Text('Straight line graph')
                .fontSize(11)
                .fontColor(0xCCCCCC)
                .width('100%')
              // 绘制直线图形
              Flex({ justifyContent: FlexAlign.SpaceBetween }) {
                Path()
                  .commands('M100 0 L200 240 L0 240 Z')
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
                Path()
                  .commands('M0 0 H200 V200 H0 Z')
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
                Path()
                  .commands('M100 0 L0 100 L50 200 L150 200 L200 100 Z')
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
              }.width('100%')

              Text('Curve graphics').fontSize(11).fontColor(0xCCCCCC).width('90%')
              // 绘制弧线图形
              Flex({ justifyContent: FlexAlign.SpaceBetween }) {
                Path()
                  .commands("M0 300 S100 0 240 300 Z")
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
                Path()
                  .commands('M0 150 C0 100 140 0 200 150 L100 300 Z')
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
                Path()
                  .commands('M0 100 A30 20 20 0 0 200 100 Z')
                  .fillOpacity(0)
                  .stroke(Color.Black)
                  .strokeWidth(3)
              }.width('100%')
            }.width('80%')
            .margin({ top: 5 })

            Text('5. Rect:')
              .textStyle()
            Row() {
              Rect()
                .width(220)
                .height(50)
                .fill(Color.Pink)
                .margin({ bottom: 20 })
            }

            Text('6. Shape: 绘制组件的父组件')
              .textStyle()

            Column({ space: 10 }) {
              Text('basic').fontSize(11).fontColor(0xCCCCCC).width('100%')
              // 在Shape的(-2, -2)点绘制一个 300 * 50 带边框的矩形,颜色0x317AF7,边框颜色黑色,边框宽度4,边框间隙20,向左偏移10,线条两端样式为半圆,拐角样式圆角,抗锯齿(默认开启)
              // 在Shape的(-2, 58)点绘制一个 300 * 50 带边框的椭圆,颜色0x317AF7,边框颜色黑色,边框宽度4,边框间隙20,向左偏移10,线条两端样式为半圆,拐角样式圆角,抗锯齿(默认开启)
              // 在Shape的(-2, 118)点绘制一个 300 * 10 直线路径,颜色0x317AF7,边框颜色黑色,宽度4,间隙20,向左偏移10,线条两端样式为半圆,拐角样式圆角,抗锯齿(默认开启)
              Shape() {
                Rect().width(300).height(50)
                Ellipse().width(300).height(50).offset({ x: 0, y: 60 })
                Path().width(300).height(10).commands('M0 0 L900 0').offset({ x: 0, y: 120 })
              }
              .viewPort({ x: -2, y: -2, width: 304, height: 130 })
              .fill(0x317AF7)
              .stroke(Color.Black)
              .strokeWidth(4)
              .strokeDashArray([20])
              .strokeDashOffset(10)
              .strokeLineCap(LineCapStyle.Round)
              .strokeLineJoin(LineJoinStyle.Round)
              .antiAlias(true)
              // 分别在Shape的(0, 0)、(-5, -5)点绘制一个 300 * 50 带边框的矩形,可以看出之所以将视口的起始位置坐标设为负值是因为绘制的起点默认为线宽的中点位置，因此要让边框完全显示则需要让视口偏移半个线宽
              Shape() {
                Rect().width(300).height(50)
              }
              .viewPort({ x: 0, y: 0, width: 320, height: 70 })
              .fill(0x317AF7)
              .stroke(Color.Black)
              .strokeWidth(10)

              Shape() {
                Rect().width(300).height(50)
              }
              .viewPort({ x: -5, y: -5, width: 320, height: 70 })
              .fill(0x317AF7)
              .stroke(Color.Black)
              .strokeWidth(10)

              Text('path').fontSize(11).fontColor(0xCCCCCC).width('100%')
              // 在Shape的(0, -5)点绘制一条直线路径,颜色0xEE8443,线条宽度10,线条间隙20
              Shape() {
                Path().width(300).height(10).commands('M0 0 L900 0')
              }
              .viewPort({ x: 0, y: -5, width: 300, height: 20 })
              .stroke(0xEE8443)
              .strokeWidth(10)
              .strokeDashArray([20])
              // 在Shape的(0, -5)点绘制一条直线路径,颜色0xEE8443,线条宽度10,线条间隙20,向左偏移10
              Shape() {
                Path().width(300).height(10).commands('M0 0 L900 0')
              }
              .viewPort({ x: 0, y: -5, width: 300, height: 20 })
              .stroke(0xEE8443)
              .strokeWidth(10)
              .strokeDashArray([20])
              .strokeDashOffset(10)
              // 在Shape的(0, -5)点绘制一条直线路径,颜色0xEE8443,线条宽度10,透明度0.5
              Shape() {
                Path().width(300).height(10).commands('M0 0 L900 0')
              }
              .viewPort({ x: 0, y: -5, width: 300, height: 20 })
              .stroke(0xEE8443)
              .strokeWidth(10)
              .strokeOpacity(0.5)
              // 在Shape的(0, -5)点绘制一条直线路径,颜色0xEE8443,线条宽度10,线条间隙20,线条两端样式为半圆
              Shape() {
                Path().width(300).height(10).commands('M0 0 L900 0')
              }
              .viewPort({ x: 0, y: -5, width: 300, height: 20 })
              .stroke(0xEE8443)
              .strokeWidth(10)
              .strokeDashArray([20])
              .strokeLineCap(LineCapStyle.Round)
              // 在Shape的(-80, -5)点绘制一个封闭路径,颜色0x317AF7,线条宽度10,边框颜色0xEE8443,拐角样式锐角（默认值）
              Shape() {
                Path().width(200).height(60).commands('M0 0 L400 0 L400 150 Z')
              }
              .viewPort({ x: -80, y: -5, width: 310, height: 90 })
              .fill(0x317AF7)
              .stroke(0xEE8443)
              .strokeWidth(10)
              .strokeLineJoin(LineJoinStyle.Miter)
              .strokeMiterLimit(5)
            }.width('80%').margin({ top: 5 })
          }
        }
        .size({ width: '100%', height: 550})
    }
    .backgroundColor($r('app.color.background'))
    .size({ width: '100%', height: '100%' })
  }
}