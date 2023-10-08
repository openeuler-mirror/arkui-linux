// @ts-nocheck
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
import Notification from '@ohos.notification';

@Entry
@Component
struct NotificationTest {
  private id: number = 10086;
  private error: string = "";
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

        Text('通知')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 10 }) {
        Button('发布通知')
          .onClick(() => {
            this.publishNotification();
          })
        Button('取消通知')
          .onClick(() => {
            this.cancelNotification();
          })
        Button('取消所有通知')
          .onClick(() => {
            this.cancelAllNotification();
          })

        Text(this.error)
          .fontSize(20)
      }
      .width('100%')
      .height('100%')
      .padding(10)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
  private cancelAllNotification() {
    Notification.cancelAll(() => {
      prompt.showToast({
        message: "取消所有通知"
      })
    })
  }

  private cancelNotification() {
    this.id--;
    Notification.cancel(this.id, () => {
      prompt.showToast({
        message: "取消通知" + this.id
      })
    })
  }

  private publishNotification() {
    console.log("publish")
    let contentType = Notification.ContentType.NOTIFICATION_CONTENT_BASIC_TEXT;
    Notification.publish({
      content: {
        contentType: contentType,
        normal: {
          title: "测试标题" + this.id,
          text: "测试内容" + this.id,
          additionalText: "测试额外数据" + this.id
        }
      },
      id: this.id,
      color: 0xff0000,
      colorEnabled: true,
      label: "测试标签" + this.id,
      badgeIconStyle: 20
    }, (error) => {
      if(error) {
        this.error = JSON.stringify(error);
        prompt.showToast({
          message: this.error
        })
      } else {
        this.id++;
        prompt.showToast({
          message: "发送成功"
        })
      }
    })
  }
}