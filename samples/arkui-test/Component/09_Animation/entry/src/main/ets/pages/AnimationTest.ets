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

@Entry
@Component
struct AnimationTest {
  @State btnWidth: number = 160;
  @State btnHeight: number = 60;
  @State myWidth: number = 100;
  @State myHeight: number = 50;
  @State flag: boolean = false;
  @State myColor: Color = Color.Blue;
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

        Text('属性动画')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Button({type: ButtonType.Normal}) {
          Text("Anim")
            .fontSize(20)
        }
        .width(this.btnWidth)
        .height(this.btnHeight)
        .borderRadius(8)
        .backgroundColor('#aabbcc')
        .animation({
          duration: 1300,           // 设置动画指定时长
          curve: Curve.Friction,    // 设置动画曲线样式
          iterations: 2,            // 设置动画执行2遍
          playMode: PlayMode.Normal // 设置播放模式
        })
        .onClick(() => {            // 点击Button的时候执行动画
          this.btnWidth = 80;       // 对Button的宽进行属性动画
          this.btnHeight = 40;      // 对Button的高进行属性动画
        })

        Button("text")
          .type(ButtonType.Normal)
          .width(this.myWidth)
          .height(this.myHeight)
            // animation只对其上面的type、width、height属性生效，时长为1000ms，曲线为Ease
          .animation({ duration: 1000, curve: Curve.Ease })
            // animation对下面的backgroundColor、margin属性不生效
          .backgroundColor(this.myColor)
          .margin(20)

        Button("area: click me")
          .fontSize(12)
          .onClick(() => {
            // 改变属性值，配置了属性动画的属性会进行动画过渡
            if (this.flag) {
              this.myWidth = 100;
              this.myHeight = 50;
              this.myColor = Color.Blue;
            } else {
              this.myWidth = 200;
              this.myHeight = 100;
              this.myColor = Color.Pink;
            }
            this.flag = !this.flag;
          })
      }
      .width('100%')
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}