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
struct SideBarContainerTest {
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

        Text('侧边栏容器')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      SideBarContainer(SideBarContainerType.Overlay) {
        Column() {
          Text("侧边栏区域")
            .width("100%")
            .height("100%")
            .fontSize(30)
            .textAlign(TextAlign.Center)
        }
        .width(10)
        .height("100%")
        .backgroundColor("#aabbcc")

        Column() {
          Text("侧边栏区域")
            .width("100%")
            .height("100%")
            .fontSize(30)
            .textAlign(TextAlign.Center)
        }
        .width("100%")
        .height("100%")
        .backgroundColor("#bbccaa")
      }
      .height(500)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}