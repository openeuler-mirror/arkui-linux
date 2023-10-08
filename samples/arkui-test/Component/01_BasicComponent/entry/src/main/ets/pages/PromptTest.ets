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

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 20, bottom: 15 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct PromptTest {
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

        Text('提示框组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

        Text('1. Toast: 不可交互的提示框组件')
          .textStyle()

        Button("无参数Toast")
          .margin({bottom: 10})
          .onClick(() => {
            prompt.showToast({
              message: "默认Toast"
            })
          })

        Button("带参数Toast")
          .margin({bottom: 10})
          .onClick(() => {
            prompt.showToast({
              message: "bottom为300的位置, duration为5000", // 显示文本
              duration: 5000,              // 显示时长
              bottom: 300                  // 距离底部的距离
            })
          })

        Text('2. Dialog: 可交互的提示框组件')
          .textStyle()

        Text('2.1. 用@ohos.prompt模块里提供的showDialog')
          .fontSize(14)
          .margin({ bottom: 10 })
          .textAlign(TextAlign.Start)
          .width('80%')

        Button("show dialog")
          .margin({bottom: 10})
          .onClick(() => {
            prompt.showDialog({
              title: "对话框标题",
              message: "对话框内容",
              buttons: [
                {
                  text: "第一个按钮",
                  color: "#aabbcc"
                },
                {
                  text: "第二个按钮",
                  color: "#bbccaa"
                },
                {
                  text: "第三个按钮",
                  color: "#ccaabb"
                }
              ]
            }, (error, index) => {
              var msg = error ? JSON.stringify(error) : "index: " + index;
              prompt.showToast({
                message: msg
              })
            });
          })

        Text('2.2. 使用全局对话框AlertDialog')
          .fontSize(14)
          .margin({ bottom: 10 })
          .textAlign(TextAlign.Start)
          .width('80%')

        Button("show dialog")
          .margin({bottom: 10})
          .onClick(() => {
            AlertDialog.show({
              title: "对话框标题",
              message: "对话框内容",
              autoCancel: true, // 点击蒙层，隐藏对话框
              cancel: () => { // 点击蒙层的事件回调
                prompt.showToast({
                  message: "点击蒙层消失"
                })
              },
              alignment: DialogAlignment.Bottom, // 设置对话框底部对齐
              offset: { dx: 0, dy: -20 }, // 在Y轴方向上的偏移量
              confirm: {
                value: "确定按钮",
                fontColor: "#ff0000",
                backgroundColor: "#ccaabb",
                action: () => {
                  prompt.showToast({
                    message: "点击按钮消失"
                  })
                }
              }
            });
          })

        Text('3. Menu: 显示一个Menu')
          .textStyle()
        Button("show menu")
          .margin({bottom: 10})
          .onClick(() => {
            prompt.showActionMenu({ // 显示一个菜单栏
              title: "ActionMenu标题", // 设置标题
              buttons: [ // 设置选项
                {
                  text: "按钮1",
                  color: "#aabbcc"
                },
                {
                  text: "按钮2",
                  color: "#bbccaa"
                },
                {
                  text: "按钮3",
                  color: "#ccaabb"
                }
              ]
            }, (error, index) => { // 事件回调
              var msg = error ? JSON.stringify(error) : "index: " + index;
              prompt.showToast({
                message: msg
              })
            })
          })
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
}
}