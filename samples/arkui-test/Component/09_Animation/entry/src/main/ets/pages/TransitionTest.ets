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
  @State scale_: number = 1;                     // 默认放缩比例
  @State opacity_: number = 1;                   // 默认不透明度
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

        Text('组件内转场动画')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Scroll() {
        Column() {
          Column({ space: 10 }) {
            Stack() {
              if (this.show) {
                Image("pages/test5.jpg")
                  .objectFit(ImageFit.Cover)
                  .size({ width: '100%', height: '100%' })
                  .transition({ // 设置Image转场动画
                    type: TransitionType.Insert, // 设置Image的入场动画
                    opacity: 1, // 设置Image的不透明度
                    translate: { // 设置Image的位移参数
                      x: '100%' // 设置Image从父容器右侧入场
                    }
                  })
                  .transition({ // 设置Image转场动画
                    type: TransitionType.Delete, // 设置Image的退场动画
                    opacity: 0, // 设置Image退场结束时的不透明度
                    translate: { // 设置Image的位移参数
                      x: '-100%' // 设置Image从父容器左侧退场
                    }
                  })
              }
            }
            .size({ width: "100%", height: 400 })

            Button(this.show ? "删除图片" : "添加图片")
              .size({ width: 200, height: 50 })
              .onClick(() => {
                animateTo({ // 点击按钮，控制组件转场动画
                  duration: 1300, // 设置动画的执行时长
                  curve: Curve.Linear // 设置动画曲线
                }, () => {
                  this.show = !this.show; // 控制显示和隐藏
                })
              })
          }
          .padding(10)
          .size({ width: "100%" })
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
        this.scale_ = progress;
        this.opacity_ = progress;
        console.log("enter routeType: " + type)
      })

    PageTransitionExit({ // 设置当前页面退场动画的配置信息
      duration: 1500, // 设置动画的执行时间
      curve: Curve.Ease // 设置动画曲线
    })
      .onExit((type?: RouteType, progress?: number) => { // 每一帧的动画事件回调
        console.log("exit routeType: " + type)
        this.scale_ = 1 - progress;
        this.opacity_ = 1;
      })
  }
}



