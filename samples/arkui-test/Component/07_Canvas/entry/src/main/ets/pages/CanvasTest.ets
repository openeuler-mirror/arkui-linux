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
struct CanvasTest {
  // 初始化RenderingContextSettings并设置为抗锯齿
  private setting: RenderingContextSettings = new RenderingContextSettings(true);
  // 初始化CanvasRenderingContext2D
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.setting);
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

        Text('Canvas组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column() {
        Canvas(this.context)                        // 设置Canvas所需要的context
          .size({width: '100%', height: "100%"})    // 设置Canvas的宽高
          .onReady(() => {                          // 监听回调，在回调内执行绘画操作
            this.context.fillRect(100, 100, 130, 40); // 以(100, 100)为起点坐标，画矩形，默认黑色
          })
      }
      .width('100%')
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}