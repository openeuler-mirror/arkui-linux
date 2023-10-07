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
import prompt from '@ohos.prompt';

@Entry
@Component
struct AnimateToTest {
  @State btnWidth: number = 200;
  @State btnHeight: number = 60;
  @State btnAnim: boolean = true;

  // @ts-ignore
  @State translate: TranslateOptions = { // 位移数据
    x: 0,
    y: 0,
    z: 0
  }

  private step1: () => Promise<boolean>; // 第一步动画
  private step2: () => Promise<boolean>; // 第二步动画
  private step3: () => Promise<boolean>; // 第三步动画
  private step4: () => Promise<boolean>; // 第四步动画

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

        Text('显式动画')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Button('Click Me')
          .size({width: this.btnWidth, height: this.btnHeight})
          .onClick(() => {
            if(this.btnAnim) {
              animateTo({
                duration: 1300,
                tempo: 1,
                curve: Curve.Sharp,
                delay: 200,
                iterations: 1,
                playMode: PlayMode.Normal,
                onFinish: () => {
                  prompt.showToast({ message: "play finish" })
                }
              }, () => {
                this.btnWidth = 100;
                this.btnHeight = 50;
              });
            } else {
              animateTo({
                duration: 300,
                tempo: 1,
                curve: Curve.Linear,
                delay: 200,
                iterations: 1,
                playMode: PlayMode.Normal,
                onFinish: () => {
                  prompt.showToast({ message: "play finish" })
                }
              }, () => {
                this.btnWidth = 200;
                this.btnHeight = 60;
              });
            }
            this.btnAnim = !this.btnAnim;
          })

        Button('animateTo')
          .onClick(async () => {
            await this.step1();            // 等待第一步动画执行完毕
            await this.step2();            // 等待第二步动画执行完毕
            await this.step3();            // 等待第三步动画执行完毕
            await this.step4();            // 等待第四步动画执行完毕
          })

        Text("AnimateTo")
          .fontSize(20)
          .backgroundColor("#aabbcc")
          .translate(this.translate)
      }
      .width('100%')
      .padding(10)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  private animateStep(value: AnimateParam, event: () => void): () => Promise<boolean> {
    return () => {
      return new Promise((resolve, reject) => {
        if(value) {                      // 判断参数是否合法
          let onFinish = value.onFinish; // 保存原有动画回调
          value.onFinish = () => {       // 替换新的动画回调
            onFinish?.call(this)         // 执行原有动画回到
            resolve(true);               // 触发方法执行完毕
          }
          animateTo(value, event);       // 开始执行显式动画
        } else {
          // reject("value invalid")     // 触发方法执行失败
          resolve(false);                // 参数非法，不执行
        }
      });
    }
  }

  aboutToAppear() {
    let duration = 3000;
    this.step1 = this.animateStep({      // 初始化单步动画1
      duration: duration,
      tempo: 0.5,
      curve: Curve.Linear,
      iterations: 1,
      playMode: PlayMode.Normal,
      onFinish: () => {
        console.log("animation finish")
      }
    }, () => {
      this.translate = {
        x: 0,
        y: 100,
        z: 0
      }
    });

    this.step2 = this.animateStep({      // 初始化单步动画2
      duration: duration,
      tempo: 0.5,
      curve: Curve.Linear,
      iterations: 1,
      playMode: PlayMode.Normal,
      onFinish: () => {
        console.log("animation finish")
      }
    }, () => {
      this.translate = {
        x: 100,
        y: 100,
        z: 0
      }
    });

    this.step3 = this.animateStep({      // 初始化单步动画3
      duration: duration,
      tempo: 0.5,
      curve: Curve.Linear,
      iterations: 1,
      playMode: PlayMode.Normal,
      onFinish: () => {
        console.log("animation finish")
      }
    }, () => {
      this.translate = {
        x: 100,
        y: 0,
        z: 0
      }
    });

    this.step4 = this.animateStep({      // 初始化单步动画4
      duration: duration,
      tempo: 0.5,
      curve: Curve.Linear,
      iterations: 1,
      playMode: PlayMode.Normal,
      onFinish: () => {
        console.log("animation finish")
      }
    }, () => {
      this.translate = {
        x: 0,
        y: 0,
        z: 0
      }
    });
  }

  // 提取一个方法
  private generateAnimateParam(duration: number, event: () => void): AnimateParam {
    return {
      duration: duration,
      tempo: 0.5,
      curve: Curve.Linear,
      iterations: 1,
      playMode: PlayMode.Normal,
      onFinish: () => {
        event?.call(this);
      }
    }
  }

}