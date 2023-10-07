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
import webSocket from '@ohos.net.webSocket';

@Entry
@Component
struct WebSocketTest {
  @State text: string = "";
  private inputValue = "";
  private webSocketImpl: any = null;
  build() {
    Column() {
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

        Text('WebSocket')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 10 }) {
        Row({ space: 10 }) {
          Button("建立连接")
            .onClick(() => {
              this.connect();
            })

          Button("关闭连接")
            .onClick(() => {
              this.close();
            })
        }
        .margin({top:30})

        Row({ space: 10 }) {
          TextInput()
            .width(220)
            .height(40)
            .onChange((value) => {
              this.inputValue = value;
            })

          Button("发送消息")
            .onClick(() => {
              this.send(this.inputValue);
            })
        }

        Text(this.text)
          .fontSize(18)
      }
      .backgroundColor($r('app.color.background'))
      .size({ width: '100%', height: '100%' })
    }
  }

  private connect() {
    let webSocketImpl = webSocket.createWebSocket(); // 创建WebSocket实例
    webSocketImpl.on("open", (error, data) => {      // 监听连接建立
      this.webSocketImpl = webSocketImpl;            // 连接建立成功，可以调用send方法向服务器发送数据
      this.text = "连接已建立"
    });
    webSocketImpl.on("message", (error, data) => {   // 监听服务器端发送的数据
      if(data) {
        this.text = JSON.stringify(data);
      }
    });
    webSocketImpl.on("close", (data) => {            // 监听连接关闭的回调
      this.text = "connection closed";
      this.webSocketImpl = null;
    });
    webSocketImpl.on("error", (data) => {            // 监听异常事件
      this.text = "connection closed";
      this.close();
    })

		// 在线模拟
    webSocketImpl.connect("ws://124.222.224.186:8800", (error, data) => {
      if(!error) {
        console.log("connect: " + JSON.stringify(data));
      }
    })
  }

  // 发送消息
  private send(text: string) {
    if(this.webSocketImpl) {
      this.webSocketImpl.send(text, (error, data) => {
        if(!error) {
          console.log("send data result: " + data);
        }
      })
    }
  }

  // 关闭连接
  private close() {
    if(this.webSocketImpl) {
      this.webSocketImpl.close((data) => {
        console.log("connection closed: " + data);
        this.text = "连接已关闭";
      });
      this.webSocketImpl = null;
    }
  }

}