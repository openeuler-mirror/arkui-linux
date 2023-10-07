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
struct ProgressTest {
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

          Text('进度条组件')
            .fontSize(22)
            .margin({ top: 80, left: 20 })
        }
        .width('80%')
    /* 线性布局容器 (Row, Column) */
      /* 文本组件 */
      Text('下面展示了各种进度条组件:')
        .width('80%')
        .margin({ top: 30, bottom: 20 })
        .padding(10)

      Progress({
        value: 85, // 设置当前进度
        type: ProgressType.ScaleRing // 设置进度条的样式为环形刻度样式
      })
        .size({ width: 80, height: 80 })
        .padding(5)

      Progress({
        value: 85, // 设置当前进度
        total: 100, // 设置进度总量
        type: ProgressType.Capsule // 设置进度条的样式为胶囊样式
      })
        .size({ width: 120, height: 50 })
        .padding(5)

      Progress({
        value: 85, // 设置当前进度
        total: 100, // 设置进度总量
        type: ProgressType.Eclipse // 设置进度条的样式为圆形样式
      })
        .size({ width: 80, height: 80 })
        .padding(5)

      Progress({
        value: 85, // 设置当前进度
        total: 100, // 设置进度总量
        type: ProgressType.Linear // 设置进度条的样式为条形样式
      })
        .size({ width: '50%', height: 40 })
        .padding(5)

      Progress({
        value: 85, // 设置当前进度
        total: 100, // 设置进度总量
        type: ProgressType.Ring // 设置进度条的样式为环形样式
      })
        .size({ width: 80, height: 80 })
        .padding(5)

      LoadingProgress()
        .width(120)
        .height(60)
        .color(Color.Pink) // 设置进度条的前景色
      }
      .backgroundColor($r('app.color.background'))
      .size({width: '100%', height: '100%'})
    }
  }
