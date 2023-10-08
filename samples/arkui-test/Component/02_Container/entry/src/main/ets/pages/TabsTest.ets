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
struct TabsTest {
  private controller: TabsController = new TabsController();
  @State index: number = 0; // 选项卡下标，默认为第一个
  @Builder tabMessage() {   // 自定义消息标签
    Column() {
      Column() {
        Blank()
        Image(this.index == 0 ? 'pages/icon_message_selected.png' : 'pages/icon_message_normal.png')
          .size({width: 25, height: 25})
        Text('消息')
          .fontSize(16)
          .fontColor(this.index == 0 ? "#2a58d0" : "#6b6b6b")
        Blank()
      }
      .height('100%')
      .width("100%")
      .onClick(() => {
        this.index = 0;
        this.controller.changeIndex(this.index);
      })
    }
  }

  @Builder tabContract() {  // 自定义联系人标签
    Column() {
      Blank()
      Image(this.index == 1 ? 'pages/icon_contract_selected.png' : 'pages/icon_contract_normal.png')
        .size({width: 25, height: 25})
      Text('联系人')
        .fontSize(16)
        .fontColor(this.index == 1 ? "#2a58d0" : "#6b6b6b")
      Blank()
    }
    .height('100%')
    .width("100%")
    .onClick(() => {
      this.index = 1;
      this.controller.changeIndex(this.index);
    })
  }

  @Builder tabDynamic() {   // 自定义动态标签
    Column() {
      Blank()
      Image(this.index == 2 ? 'pages/icon_dynamic_selected.png' : 'pages/icon_dynamic_normal.png')
        .size({width: 25, height: 25})
      Text('动态')
        .fontSize(16)
        .fontColor(this.index == 2 ? "#2a58d0" : "#6b6b6b")
      Blank()
    }
    .height('100%')
    .width("100%")
    .onClick(() => {
      this.index = 2;
      this.controller.changeIndex(this.index);
    })
  }

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

        Text('页签组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })


      Tabs({
        barPosition: BarPosition.End, // TabBar排列在下方
        controller: this.controller   // 绑定控制器
      }) {
        TabContent() {
          Column() {
            Text('消息')
              .fontSize(20)
              .margin({top:12})
          }
          .width('100%')
          .height('100%')
          .backgroundColor("#aabbcc")
        }
        .tabBar(this.tabMessage)      // 使用自定义TabBar

        TabContent() {
          Column() {
            Text('联系人')
              .fontSize(20)
              .margin({top:12})
          }
          .width('100%')
          .height('100%')
          .backgroundColor("#bbccaa")
        }
        .tabBar(this.tabContract)     // 使用自定义TabBar

        TabContent() {
          Column() {
            Text('动态')
              .fontSize(20)
              .margin({top:12})
          }
          .width('100%')
          .height('100%')
          .backgroundColor("#ccaabb")
        }
        .tabBar(this.tabDynamic)      // 使用自定义TabBar
      }
      .width('100%')
      .height(550)
      .barHeight(60)
      .barMode(BarMode.Fixed)         // TabBar均分
      .onChange((index: number) => {  // 页面切换回调
        this.index = index;
      })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}