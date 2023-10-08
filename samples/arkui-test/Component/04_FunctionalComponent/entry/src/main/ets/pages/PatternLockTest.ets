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
struct PatternLockTest {
  @State passwords: Number[] = []
  @State message: string = '请验证密码'
  private patternLockController: PatternLockController = new PatternLockController()
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

        Text('手势密码')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Text(this.message)
          .textAlign(TextAlign.Center)
          .fontSize(22)

        PatternLock(this.patternLockController)
          .sideLength(200)            // 设置宽高
          .circleRadius(7)            // 设置圆点半径
          .regularColor(Color.Red)    // 设置圆点颜色
          .pathStrokeWidth(10)        // 设置连线粗细
          .backgroundColor(Color.Pink)// 设置背景色
          .autoReset(true)            // 支持用户在完成输入后再次触屏重置组件状态
          .onPatternComplete((input: Array<number>) => {
            if (input == null || input == undefined || input.length < 5) {
              this.message = "密码长度至少为5位数。";
              return;
            }
            if (this.passwords.length > 0) {
              if (this.passwords.toString() == input.toString()) {
                this.passwords = input
                this.message = "密码设置成功"
              } else {
                this.message = '密码输入错误'
              }
            } else {
              this.passwords = input
              this.message = "密码输入错误"
            }
          })
        Button('重置密码')
          .onClick(() => {
            this.passwords = [];
            this.message = '请验证手势密码';
            this.patternLockController.reset();
          })
      }
      .width('100%')
      .height('100%')
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}