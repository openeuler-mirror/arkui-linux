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

let url_data = `
<!DOCTYPE html>
<html>
<body>
<button type='button'>Button Click</button>
</body>
</html>
`

@Entry
@Component
struct WebTest {
  private webController: WebController = new WebController();
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

        Text('网页加载')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 10 }) {
        Row({space: 10}) {
          Button("刷新")
            .onClick(() => {
              this.webController.refresh();
            })

          Button("加载本地资源")
            .onClick(() => {
              this.webController.loadData({
                data: url_data,
                mimeType: "text/html",
                encoding: "utf-8"
              })
            })
        }
        .margin({bottom: 20})

        Web({
          src: "https://www.arkui.club", // 默认加载 www.arkui.club 网址
          controller: this.webController
        })
          .width("100%")
          .height("100%")
      }
      .width('100%')
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}