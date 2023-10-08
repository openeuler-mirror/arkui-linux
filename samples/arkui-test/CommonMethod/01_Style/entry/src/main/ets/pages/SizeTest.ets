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

@Extend(Text) function textStyleWithoutTopMargin() {
  .fontSize(14)
  .margin({ bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct SizeTest {
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

        Text('尺寸设置')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Scroll() {
        Column() {
          Text('1. 宽高设置: size, width, height')
            .textStyle()

          Text()
            .size({ width: 220, height: 125 }) // 设置宽高
            .width(120) // 设置宽度，覆盖前边的值
            .height(25) // 设置高度，覆盖前边的值
            .backgroundColor("#ccbbaa") // 设置背景色

          Text()
            .width("80%") // 设置宽度充满父布局
            .height(10) // 设置高度
            .backgroundColor(Color.Pink) // 设置背景色

          Text()
            .width(200) // 设置宽度
            .height(200) // 设置高度
            .size({ width: 120, height: 25 }) // 设置宽高，覆盖前边的值
            .backgroundColor("#aabbcc") // 设置背景色


          Text('2. 宽高比设置: aspectRatio = width / height')
            .textStyle()

          Row({ space: 10 }) {
            Text()
              .width(50)
              .height(50)
              .backgroundColor(Color.Pink) // 参考物，模拟1:1比例

            Text()
              .width(50)
              .backgroundColor(Color.Pink)
              .aspectRatio(1) // 设置宽高比

            Text()
              .width(50)
              .backgroundColor(Color.Pink)
              .aspectRatio(1.5) // 设置宽高比

            Text()
              .width(50)
              .height(50)
              .backgroundColor(Color.Pink)
              .aspectRatio(1.5) // 设置宽高比

            Text()
              .width(50)
              .backgroundColor(Color.Pink)
              .aspectRatio(0.5) // 设置宽高比
          }
          .width("80%")
          .height(120)
          .backgroundColor("#aabbcc")

          Text('3. 边距设置: padding, margin')
            .textStyle()

          Row() {
            Stack() {
              Text()
                .width('100%') // 设置宽度充满父布局
                .height('100%') // 设置高度充满父布局
                .backgroundColor(Color.Pink) // 设置背景色
            }
            .padding(10) // 设置四个边距值
            .backgroundColor("#aabbcc") // 设置背景色
            .size({ width: 80, height: 80 }) // 设置宽高尺寸
            .margin({ right: 50 })

            Stack() {
              Text()
                .width('100%') // 宽度充满父布局
                .height('100%') // 高度充满父布局
                .backgroundColor(Color.Pink) // 设置背景色
            }
            .padding({ left: 5, top: 20, right: 5, bottom: 20 }) // 设置不同的边距值
            .backgroundColor("#aabbcc") // 设置背景色
            .size({ width: 80, height: 80 }) // 设置宽高尺寸
          }

          Text('4. 权重设置')
            .textStyle()

          Text('(1) 每个子组件都设置了权重为 1')
            .textStyleWithoutTopMargin()
          Row() { // 子组件全都设置了权重，则子组件的宽度按照权重比例分配
            Text()
              .height(30)
              .backgroundColor("#aabbcc")
              .layoutWeight(1)

            Text()
              .height(30)
              .backgroundColor("#aaccbb")
              .layoutWeight(1)
          }
          .width('80%')
          .margin({bottom: 20})

          Text('(2) 除去第一个无权重子组件的宽度，剩余子组件的宽度按照1:2分配')
            .textStyleWithoutTopMargin()
          Row() {
            Text()
              .width(150)
              .height(30)
              .backgroundColor("#aabbcc")

            Text()
              .height(30)
              .backgroundColor("#aaccbb")
              .layoutWeight(1)

            Text()
              .height(30)
              .width(20)
              .backgroundColor("#ccbbaa")
              .layoutWeight(2)
          }
          .width('80%')

          Text('5. 尺寸约束')
            .textStyle()

          Column() {
            Text('目标参照组件')
              .textStyleWithoutTopMargin()
            Text() // 目标参照组件
              .width(220)
              .height(40)
              .backgroundColor("#aabbcc")

            Text('(1) maxWidth: 120, maxHeight: 20')
              .textStyle()

            Text() // 设置约束尺寸
              .width(220)
              .height(40)
              .constraintSize({
                maxWidth: 120,
                maxHeight: 20
              })
              .backgroundColor("#bbccaa")

            Text('(2) minWidth: 250, minHeight: 60')
              .textStyle()
            Text() // 设置约束属性
              .width(220)
              .height(40)
              .constraintSize({
                minWidth: 250,
                minHeight: 60
              })
              .backgroundColor("#ccaabb")
          }
          .width("100%")

        }.size({ width: '100%'})
      }
      .width('100%')
      .height(550)
    }
    .backgroundColor($r('app.color.background'))
    .size({ width: '100%', height: '100%' })
  }
}