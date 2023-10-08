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
import http from '@ohos.net.http';
import RequestMethod from '@ohos.net.http';
import ResponseCode from '@ohos.net.http';

let httpRequest = http.createHttp();

@Entry
@Component
struct NetTest {
  @State html: string = "未加载";

  private httpRequest() {
    httpRequest.request("https://cn.bing.com",
      {
        method: http.RequestMethod.GET,
        readTimeout: 600000,
        connectTimeout: 600000
      },
      (error, data) => {
        if(error) {
          console.log("error code: " + error.code + ", msg: " + error.message)
          this.html = "error code: " + error.code + ", msg: " + error.message
        } else {
          let code = data.responseCode
          if(ResponseCode.ResponseCode.OK == code) {
            this.html = JSON.stringify(data.result);
            let header= JSON.stringify(data.header);
            console.log("result: " + this.html);
            console.log("header: " + header);
          } else {
            console.log("response code: " + code);
          }
        }
      }
    );
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

        Text('网络请求')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

    Column({space: 10}) {
      Button("读取网页")
        .onClick(() => {
          this.httpRequest();
        })

      Text(this.html)

    }
    .width('100%')
    .height('100%')
    .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }


}