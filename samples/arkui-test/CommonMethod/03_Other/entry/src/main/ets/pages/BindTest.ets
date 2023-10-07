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

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct BindTest {
  @Builder MenuBuilder() { // 自定义布局
    Column() {
      Text("菜单1")
        .width("100%")
        .height(40)
        .fontSize(20)
        .textAlign(TextAlign.Center)
        .onClick(() => {
          prompt.showToast({message: "菜单1"});
        })
      Divider()
        .width("100%")
        .height(1)
        .backgroundColor("#aabbcc")
      Text("菜单2")
        .width("100%")
        .height(40)
        .fontSize(20)
        .textAlign(TextAlign.Center)
        .onClick(() => {
          prompt.showToast({message: "菜单2"});
        })
      Divider()
        .width("100%")
        .height(1)
        .backgroundColor("#aabbcc")
      Text("菜单3")
        .width("100%")
        .height(40)
        .fontSize(20)
        .textAlign(TextAlign.Center)
        .onClick(() => {
          prompt.showToast({message: "菜单3"});
        })
    }
    .backgroundColor(Color.Pink)
    .width(100)
  }

  @State showPopup: boolean = false;

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

        Text('公共提示类属性')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('1. bindMenu: 给当前组件绑定一个菜单项，用户点击组件后弹出菜单。')
      .textStyle()
      Column({space: 10}) {
        Button("bindMenu")
          .width(120)
          .height(50)
          .onClick(() => {
            prompt.showToast({message: "bindMenu"})
          })
          .bindMenu([
            {
              value: "菜单1",
              action: () => {
                prompt.showToast({message: "菜单1"})
              }
            },
            {
              value: "菜单2",
              action: () => {
                prompt.showToast({message: "菜单2"})
              }
            },
            {
              value: "菜单3",
              action: () => {
                prompt.showToast({message: "菜单3"})
              }
            }
          ])
      }
      .padding(10)
      .size({ width: "100%" })

      Text('2. bindContextMenu: 在长按或者右键点击组件是才会触发显示菜单项。')
        .textStyle()
      Column({space: 10}) {
        Button("bindContextMenu")
          .width(120)
          .height(50)
          .onClick(() => {                                           // 点击事件
            prompt.showToast({message: "bindContextMenu"})
          })
          .bindContextMenu(this.MenuBuilder, ResponseType.LongPress) // 长按绑定
      }
      .padding(10)
      .size({ width: "100%"})

      Text('3. bindPopup: 和bindMenu功能类似，从用户角度讲都是弹出一个可选项提示框。')
        .textStyle()
      Column({space: 10}) {
        Row({space: 10}) {
          Button("showPopup")
            .width(120)
            .height(50)
            .onClick(() => {
              this.showPopup = true;
            })

          Button("hidePopup")
            .width(120)
            .height(50)
            .onClick(() => {
              this.showPopup = false;
            })
        }

        Button("bindPopup")
          .width(120)
          .height(50)
          .bindPopup(this.showPopup, {
            message: "bindPopup测试",
            placementOnTop: true,
            onStateChange: ((state) => {
              prompt.showToast({message: "isVisible: " + state.isVisible})
            }),
            primaryButton: {
              value: "测试1",
              action: () => {
                prompt.showToast({message: "测试1"})
                this.showPopup = !this.showPopup;
              }
            },
            secondaryButton: {
              value: "测试2",
              action: () => {
                prompt.showToast({message: "测试2"})
                this.showPopup = !this.showPopup;
              }
            }
          })
          .onClick(() => {
            this.showPopup = !this.showPopup;
          })
      }
      .padding(10)
      .size({ width: "100%"})
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}