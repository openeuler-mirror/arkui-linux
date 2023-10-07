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
import emitter from '@ohos.events.emitter';

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}


@Entry
@Component
struct EmitterTest {
  @State text: string = "";

  private subscribe() {
    emitter.on({                                // 开启事件订阅
      eventId: 10086,                           // 指定事件的ID
      priority: emitter.EventPriority.IMMEDIATE // 事件的优先级
    }, (data) => {                              // 事件回调
      if(data) {
        this.text = "data: " + JSON.stringify(data);
      } else {
        this.text = "none data";
      }
    })
    this.text = "subscribe success";
  }

  private unsubscribe() {
    emitter.off(10086);                         // 取消订阅事件
    this.text = "unsubscribe success";
  }

  private publishEvent() {
    emitter.emit({                              // 发布事件
      eventId: 10086,                           // 指定事件ID
      priority: emitter.EventPriority.IMMEDIATE // 指定事件优先级
    })
  }

  private publishEventWithData() {
    emitter.emit({
      eventId: 10086,                           // 发布事件
      priority: emitter.EventPriority.IMMEDIATE // 指定事件优先级
    }, {                                        // 添加额外参数
      data: {
        "test": 'emitter test'
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

        Text('进程内事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('Emitter发送的事件作用域只能在APP内部')
      .textStyle()

      Column({space: 10}) {
        Button("订阅事件")
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

        Button("发布事件")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.publishEvent();
          })

        Button("发布事件并携带参数")
          .size({width: 260, height: 50})
          .onClick(() => {
            this.publishEventWithData();
          })

      }
      .padding(10)
      .size({width: "100%"})

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}