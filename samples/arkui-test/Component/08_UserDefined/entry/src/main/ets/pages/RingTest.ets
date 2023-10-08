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
import {Ring} from './Ring' // 引入自定义的Ring组件

@Entry
@Component
struct RingTest {
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

        Text('自定义圆环')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Row({space: 5}) {
        Ring()                 // 显示默认圆环

        Ring({ringAttribute: { // 参数传递
          radius: 40,          // 设置圆环的半径
          width: 8,            // 设置圆环的宽度
          color: Color.Green,  // 设置圆环的颜色
          solid: '#aabbcc'     // 设置圆环的填充色
        }})

        Ring({ringAttribute: { // 参数传递
          radius: 45,          // 设置圆环的半径
          width: 10,           // 设置圆环的宽度
          color: Color.Red,    // 设置圆环的颜色
          solid: Color.Pink    // 设置圆环的填充色
        }})
      }
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}