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
import socket from '@ohos.net.socket';

// 创建一个TCPSocket连接，返回一个TCPSocket对象。
let tcp = socket.constructTCPSocketInstance();

@Entry
@Component
struct SocketTest {
  @State error: string = "错误信息未加载";
  @State text: string = "文本未加载";
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

        Text('Socket')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 10 }) {
        Button('发起请求')
          .onClick(() => {
            this.request();
          })

        Text(this.error)
          .fontSize(20)

        Text(this.text)
          .fontSize(20)
      }
      .width('100%')
      .padding(10)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  private request() {
    tcp.on("message", (data) => {
      this.text = JSON.stringify(data.remoteInfo);       // 监听服务器消息回调
    });
    tcp.connect({                                  // 连接服务器
      address: {
        address: "baidu.com",                            // 地址
        port: 80                                         // 端口
      },
      timeout: 6000
    }, (error) => {
      if(error) {
        this.error = JSON.stringify(error);
      } else {
        this.error = "connect success";
        let data = "GET / HTTP/1.1\n" +
        "Host:baidu.com\n"                    // 发送数据
        tcp.send({                                 // 连接建立后，发送数据
          data: data,
          encoding: "utf-8"
        }, (error) => {
          if(error) {
            this.error = JSON.stringify(error);
          } else {
            this.error = "send success";
          }
        })
      }
    })
  }
}