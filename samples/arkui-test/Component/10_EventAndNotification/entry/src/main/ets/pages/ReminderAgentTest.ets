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
import reminderAgent from '@ohos.reminderAgent';

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct ReminderAgentTest {
  private reminderId: number = 0;
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

      Text('@ohos.reminderAgent模块里提供了发布后台代理提醒和取消后台代理提醒的相关API')
      .textStyle()

      Column({ space: 10 }) {
        Button('发起定时提醒')
          .onClick(() => {
            this.startTimer();
          })

        Button('取消定时提醒')
          .onClick(() => {
            this.cancelTimer();
          })

        Button('取消所有定时提醒')
          .onClick(() => {
            this.cancelAllTimer();
          })
      }
      .width('100%')
      .height('100%')
      .padding(10)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
  // 开启后台代理提醒
  private startTimer() {
    let timer = {
      reminderType: reminderAgent.ReminderType.REMINDER_TYPE_TIMER,// 定时器
      triggerTimeInSeconds: 5,                                     // 5秒后触发提醒
      title: "标题测试",                                            // 标题
      content: "标题内容测试",                                       // 内容
      notificationId: 10086                                        // 任务ID
    }
    reminderAgent.publishReminder(timer, (error, reminderId) => {  // 发布一个提醒
      if(reminderId) {
        // 发送成功
        this.reminderId = reminderId;
      }
    })
  }

  // 取消后台代理提醒
  private cancelTimer() {
    reminderAgent.cancelReminder(this.reminderId, (error, data) => {
      if(!error) {
        // 取消成功
      }
    })
  }

  private cancelAllTimer() {
    reminderAgent.cancelAllReminders((error, data) => {
      if(!error) {
        // 取消成功
      }
    })
  }
}