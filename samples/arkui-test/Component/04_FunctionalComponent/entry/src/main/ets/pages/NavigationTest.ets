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
import prompt from '@ohos.prompt';

@Entry
@Component
struct NavigationTest {
  @State index: number = 0;
  @State hideToolBar: boolean = false;
  @State hideTitleBar: boolean = false;
  @Builder toolbar() {
    Row() {
      Column() {
        Text('消息')
          .fontSize(16)
          .fontColor(this.index == 0 ? "#2a58d0" : "#6b6b6b")
      }
      .alignItems(HorizontalAlign.Center)
      .height('100%')
      .layoutWeight(1)
      .onClick(() => {
        this.index = 0;
      })

      Column() {
        Text('联系人')
          .fontSize(16)
          .fontColor(this.index == 1 ? "#2a58d0" : "#6b6b6b")
      }
      .alignItems(HorizontalAlign.Center)
      .height('100%')
      .layoutWeight(1)
      .onClick(() => {
        this.index = 1;
      })

      Column() {
        Text('动态')
          .fontSize(16)
          .fontColor(this.index == 2 ? "#2a58d0" : "#6b6b6b")
      }
      .alignItems(HorizontalAlign.Center)
      .height('100%')
      .layoutWeight(1)
      .onClick(() => {
        this.index = 2;
      })
    }
    .width('100%')
    .height(60)
  }

  build() {
    Navigation() {
        Column({space: 10}) {
        Text(this.index == 0 ? "消息" : this.index == 1 ? "联系人" : "动态")
          .textAlign(TextAlign.Center)
          .fontSize(22)
          .margin({top: 30})

        Button(this.hideTitleBar ? "显示TitleBar" : "隐藏TitleBar")
          .onClick(() => {
            this.hideTitleBar = !this.hideTitleBar;
          })


        Button(this.hideToolBar ? "显示ToolBar" : "隐藏ToolBar")
          .onClick(() => {
            this.hideToolBar = !this.hideToolBar;
          })

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

      }
      .size({width: '100%', height: '100%'})
    }
    .size({width: '100%', height: '100%'})
    .title("页面导航")
    .toolBar(this.toolbar())
    .hideToolBar(this.hideToolBar)
    .hideTitleBar(this.hideTitleBar)
  }
}