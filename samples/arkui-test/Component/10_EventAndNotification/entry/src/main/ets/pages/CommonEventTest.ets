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
import commonEvent from '@ohos.commonEvent';    // 引入事件包

@Entry
@Component
struct CommonEventTest {
  @State text: string = "";
  @State publish: string = "";
  private subscriber = null;
  private createSubscriber() {
    if (this.subscriber) {
      this.text = "subscriber already created";
    } else {
      commonEvent.createSubscriber({            // 创建订阅者
        events: ["event"]                   // 指定订阅的事件名称
      }, (err, subscriber) => {                 // 创建结果的回调
        if(err) {
          this.text = "create subscriber failed: " + err;
        } else {
          this.subscriber = subscriber;         // 创建订阅成功
          this.text = "create subscriber success";
        }
      })
    }
  }

  private subscribe() {
    if (this.subscriber) {
      // 根据创建的subscriber开始订阅事件
      commonEvent.subscribe(this.subscriber, (err, data) => {
        if(err) {
          // 异常处理
          this.text = "subscribe event failure: " + err;
        } else {
          // 接收到事件
          this.text = "subscribe event success: " + data.event + ", " + data;
        }
      })
    } else {
      this.text = "please create subscriber";
    }
  }

  private unsubscribe() {
    if (this.subscriber) {
      commonEvent.unsubscribe(this.subscriber, (err) => {// 取消订阅事件
        if(err) {
          this.text = "unsubscribe event failure: " + err;
        } else {
          this.subscriber = null;
          this.text = "unsubscribe event success: ";
        }
      })
    } else {
      this.text = "already subscribed";
    }
  }

  private publishEvent() {
    commonEvent.publish("event", (err) => {// 发布事件，事件名称为testEvent
      if(err) {// 结果回调
        this.publish = "publish event error: " + err.code + ", " + err.message + ", " + err.name + ", " + err.stack;
      } else {
        this.publish = "publish event success";
      }
    })
  }

  private publishEventWithData() {
    commonEvent.publish("testEvent", {         // 发布事件，事件名称为testEvent
      code: 10086,                             // 事件携带的参数
      data: "publish with data"                // 事件携带的参数
    }, (err) => {                              // 结果回调
      if(err) {
        this.publish = "publish event error: " + err.code + ", " + err.message + ", " + err.name + ", " + err.stack;
      } else {
        this.publish = "publish event with data success";
      }
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

        Text('公共事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Button("创建订阅者")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.createSubscriber();
          })

        Button("订阅公共事件")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.subscribe();
          })

        Button("取消订阅")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.unsubscribe();
          })

        Text(this.text)
          .size({width: 260, height: 100})
          .fontSize(16)
          .backgroundColor("#dbdbdb")

        Divider()
          .size({width: '90%', height: 5})

        Button("发布公共事件")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.publishEvent();
          })

        Button("发布公共事件指定公共信息")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.publishEventWithData();
          })

        Text(this.publish)
          .size({width: 260, height: 100})
          .fontSize(16)
          .backgroundColor("#dbdbdb")

      }
      .padding(10)
      .size({width: "100%", height: '100%'})

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}