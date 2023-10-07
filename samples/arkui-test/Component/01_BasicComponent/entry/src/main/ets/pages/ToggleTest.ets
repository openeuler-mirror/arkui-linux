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

import prompt from '@ohos.prompt';
import router from '@ohos.router';

@Entry
@Component
struct ToggleTest {
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

        Text('开关组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
        /* 文本组件 */
        Text('开关组件定义了三组样式 ToggleType, 下面展示了这三种样式，并使用了Blank')
          .width('80%')
          .margin({ top: 20, bottom: 20 })

        Text('1. Switch样式:')
          .textAlign(TextAlign.Start)
          .width('80%')
          .margin({ top: 20, bottom: 20 })


        /* Blank 与开关组件 */
        Row() {
          Text('Bluetooth').fontSize(18) // 靠左显示
          Blank() // 铺满剩余尺寸
          Toggle({ type: ToggleType.Switch }) // 靠右显示
        }
        .width('80%')
        .backgroundColor('#e9e9e9')
        .borderRadius(15)
        .padding({ left: 10 })


        Row({ space: 20 }) {
          Toggle({ type: ToggleType.Switch })

          Toggle({ type: ToggleType.Switch })
            .selectedColor(Color.Pink)
            .switchPointColor(Color.Brown)
            .onChange((isOn) => {
              prompt.showToast({
                message: "开关状态：" + isOn
              })
            })
        }

        Text('2. Checkbox')
          .textAlign(TextAlign.Start)
          .width('80%')
          .margin({ top: 20, bottom: 20 })

        Row({ space: 20 }) {
          Toggle({ type: ToggleType.Checkbox })

          Toggle({ type: ToggleType.Checkbox })
            .selectedColor(Color.Pink)
            .switchPointColor(Color.Brown)
            .onChange((isOn) => {
              prompt.showToast({
                message: "开关状态：" + isOn
              })
            })
        }

        Text('3. Button')
          .textAlign(TextAlign.Start)
          .width('80%')
          .margin({ top: 20, bottom: 20 })

        Row({ space: 20 }) {
          Toggle({ type: ToggleType.Button }) {
            Text('按钮样式')
              .fontSize(20)
          }
          .size({ width: 120, height: 60 })

          Toggle({ type: ToggleType.Button }) {
            Text('按钮样式') // 添加一个子组件
              .fontSize(20)
          }
          .size({ width: 120, height: 60 })
          .selectedColor(Color.Pink)
          .switchPointColor(Color.Brown)
          .onChange((isOn) => {
            prompt.showToast({
              message: "开关状态：" + isOn
            })
          })
        }
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}