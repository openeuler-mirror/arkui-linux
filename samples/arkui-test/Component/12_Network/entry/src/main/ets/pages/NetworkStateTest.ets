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
import observer from '@ohos.telephony.observer';
import radio from '@ohos.telephony.radio';

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct NetworkStateTest {
  @State netState_: string = "";
  @State netState: string = "";
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

        Text('网络状态监听')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('监听网络状态需要申请 ohos.permission.GET_NETWORK_INFO 权限。')
        .textStyle()

      Text('1. observer:')
        .textStyle()
      Text('使用@ohos.telephony.observer模块里的API以注入监听器的方式获取网络状态')
        .fontSize(14)
        .margin({ bottom: 20 })
        .textAlign(TextAlign.Start)
        .width('80%')
      Text(this.netState_)
        .textStyle()

      Text('2. radio:')
        .textStyle()
      Text('@ohos.telephony.radio模块里通过getNetworkState()直接获取当前的网络状态')
        .fontSize(14)
        .margin({ bottom: 20 })
        .textAlign(TextAlign.Start)
        .width('80%')


      Button('获取网络状态')
        .onClick(() => {
          radio.getNetworkState((error, data) => {
            if(data) {
              this.netState = JSON.stringify(data);
            } else {
              this.netState = "net invalid";
            }
          })
        })
        .margin({ bottom: 30 })

      Text(this.netState)
        .textStyle()
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  private networkChanged(networkState) {
    this.netState_ = "network state: " + JSON.stringify(networkState)
    console.log("network state: " + JSON.stringify(networkState))
  }

  aboutToAppear() {
    this.netState_ = "network state: ?"
    observer.on('networkStateChange', this.networkChanged)
  }

  aboutToDisappear() {
    observer.off('networkStateChange', this.networkChanged)
  }
}