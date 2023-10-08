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
struct LocationTest {
  build() {
    Column() {
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

        Text('位置设置')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Scroll() {
        Column() {
          Text('1. 对齐方式: align')
            .textStyle()

          Text("align")
            .fontSize(20)
            .size({width: 200, height: 60})// 组件尺寸大于内容尺寸，符合条件
            .align(Alignment.TopStart)     // 设置内容对齐方式
            .backgroundColor((Color.Pink))


          Text('2. 布局方向: direction')
            .textStyle()

          Row({space: 10}) {
            Text('1')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#aabbcc")
            Text('2')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#bbccaa")
            Text('3')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#ccaabb")
          }
          .width('80%')
          .backgroundColor(Color.Pink)
          .direction(Direction.Ltr) // 设置子组件的对齐方式为Ltr
          .margin({bottom:10})

          Row({space: 10}) {
            Text('1')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#aabbcc")
            Text('2')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#bbccaa")
            Text('3')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#ccaabb")
          }
          .width('80%')
          .backgroundColor(Color.Pink)
          .direction(Direction.Rtl) // 设置子组件的对齐方式为Rtl

          Text('3. 绝对定位: position')
            .textStyle()

          Row({space: 10}) {
            Text('1')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#aabbcc")
              .position({ // 使用绝对定位，设置组件位置
                x: 220,
                y: 0
              })
            Text('2')
              .height(50)
              .width(220)
              .fontSize(16)
              .backgroundColor("#bbccaa")
            Text('3')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#ccaabb")
          }
          .width('80%')
          .height(160)
          .backgroundColor(Color.Pink)

          Text('4. 相对定位: offset')
            .textStyle()

          Row({space: 10}) {
            Text('1')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#aabbcc")
              .offset({ // 使用相对定位，设置组件位置
                x: 10,
                y: 10
              })

            Text('2')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#bbccaa")
            Text('3')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#ccaabb")
          }
          .width('80%')
          .height(70)
          .backgroundColor(Color.Pink)

          Text('5. 锚点设置: markAnchor')
            .textStyle()

          Row({space: 10}) {
            Text('1')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#aabbcc")
              .markAnchor({ // 设置锚点
                x: 10,
                y: 10
              })


            Text('2')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#bbccaa")
            Text('3')
              .height(50)
              .width('25%')
              .fontSize(16)
              .backgroundColor("#ccaabb")
          }
          .width('80%')
          .height(70)
          .backgroundColor(Color.Pink)

          Text('6. 约束条件: alignRules')
            .textStyle()

          RelativeContainer() {
            Row()
              .width(100)
              .height(100)
              .backgroundColor("#FF3333")
              .alignRules({
                top: {
                  anchor: "__container__",
                  align: VerticalAlign.Top
                },
                left: {
                  anchor: "__container__",
                  align: HorizontalAlign.Start
                }
              })
              .id("row1")

            Row()
              .width(100)
              .height(100)
              .backgroundColor("#FFCC00")
              .alignRules({
                top: {
                  anchor: "__container__",
                  align: VerticalAlign.Top
                },
                right: {
                  anchor: "__container__",
                  align: HorizontalAlign.End
                }
              })
              .id("row2")

            Row().height(100)
              .backgroundColor("#FF6633")
              .alignRules({
                top: {
                  anchor: "row1",
                  align: VerticalAlign.Bottom
                },
                left: {
                  anchor: "row1",
                  align: HorizontalAlign.End
                },
                right: {
                  anchor: "row2",
                  align: HorizontalAlign.Start
                }
              })
              .id("row3")

            Row()
              .backgroundColor("#FF9966")
              .alignRules({
                top: {
                  anchor: "row3",
                  align: VerticalAlign.Bottom
                },
                bottom: {
                  anchor: "__container__",
                  align: VerticalAlign.Bottom
                },
                left: {
                  anchor: "__container__",
                  align: HorizontalAlign.Start
                },
                right: {
                  anchor: "row1",
                  align: HorizontalAlign.End
                }
              })
              .id("row4")

            Row()
              .backgroundColor("#FF66FF")
              .alignRules({
                top: {
                  anchor: "row3",
                  align: VerticalAlign.Bottom
                },
                bottom: {
                  anchor: "__container__",
                  align: VerticalAlign.Bottom
                },
                left: {
                  anchor: "row2",
                  align: HorizontalAlign.Start
                },
                right: {
                  anchor: "__container__",
                  align: HorizontalAlign.End
                }
              })
              .id("row5")
          }
          .width(300)
          .height(300)
          .border({ width: 3, color: "#6699FF" })

        }.size({ width: '100%'})
      }
      .width('100%')
      .height(550)
    }
    .backgroundColor($r('app.color.background'))
    .size({ width: '100%', height: '100%' })
  }
}