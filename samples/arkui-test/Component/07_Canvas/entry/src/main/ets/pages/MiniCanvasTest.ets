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
import { MiniCanvas, Paint } from '@ohos/mini_canvas'

@Entry
@Component
struct MiniCanvasTest {
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

        Text('MiniCanvas组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      MiniCanvas({
        onDraw: (canvas) => {
          var paint = new Paint()

          canvas.drawRoundRect(10, 10, 150, 50, 10, paint);

          paint.setColor(Color.Pink.toString())
          canvas.drawRoundRect(170, 10, 150, 50, 15, paint);

          paint.setStroke(true)
          canvas.drawRoundRect(10, 70, 150, 50, 15, paint);

          paint.setColor('#ff0000')
          paint.setStrokeWidth(3)
          canvas.drawRoundRect(170, 70, 150, 50, 10, paint);

          paint.setColor(Color.Red.toString())         // 设置圆弧颜色
          canvas.drawArc(100, 300, 30, 0, 130, paint)

          paint.setStroke(false)                       // 设置实心圆弧
          canvas.drawArc(170, 300, 30, 0, 130, paint)
        }
      })
        .width('80%')
        .height(550)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}