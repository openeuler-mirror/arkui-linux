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
struct TransitionTest {
  // @ts-ignore
  @State scale: number = 1;                     // 默认放缩比例
  // @ts-ignore
  @State opacity: number = 1;                   // 默认不透明度
  @State show: boolean = false;               // 控制组件的添加和删除
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

        Text('页面转场动画')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Scroll() {
        Column() {
          Stack() {
            Image("pages/test4.jpg")
              .size({ width: 200, height: 150 })
              .onClick(() => {
                router.pushUrl({ url: 'pages/second_' })
              })
            Text('第一个页面')
              .fontSize(26)
              .fontColor(Color.White)
          }
          .size({ width: "100%", height: 300 })
          .scale({
            x: this.scale, // 设置当前页面X轴方向上的放缩比
            y: this.scale // 设置当前页面Y轴方向上的放缩比
          })
          .opacity(this.opacity) // 设置当前页面不透明度
        }
        .size({ width: "100%" })
      }
      .size({width: '100%', height: 550})
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  pageTransition() { // 添加全局pageTransition方法
    PageTransitionEnter({ // 设置当前页面入场动画的配置信息
      duration: 1200, // 动画执行时间
      curve: Curve.Linear // 设置动画曲线
    })
      .onEnter((type?: RouteType, progress?: number) => { // 每一帧的动画事件回调
        this.scale = progress;
        this.opacity = progress;
        console.log("enter routeType: " + type)
      })

    PageTransitionExit({ // 设置当前页面退场动画的配置信息
      duration: 1500, // 设置动画的执行时间
      curve: Curve.Ease // 设置动画曲线
    })
      .onExit((type?: RouteType, progress?: number) => { // 每一帧的动画事件回调
        console.log("exit routeType: " + type)
        this.scale = 1 - progress;
        this.opacity = 1;
      })
  }
}



