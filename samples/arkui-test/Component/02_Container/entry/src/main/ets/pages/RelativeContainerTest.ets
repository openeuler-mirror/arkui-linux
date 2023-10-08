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
struct RelativeContainerTest {
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

        Text('相对布局容器')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

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
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}