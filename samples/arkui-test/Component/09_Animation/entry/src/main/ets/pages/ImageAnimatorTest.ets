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
struct ImageAnimationTest {
  @State state: AnimationStatus = AnimationStatus.Initial
  @State reverse: boolean = false
  @State iterations: number = 1
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

        Text('帧动画')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({ space: 10 }) {
        ImageAnimator()
          .images([
            {
              src: '/pages/test1.jpg',
              duration: 500,
              width: 325,
              height: 200,
              top: 0,
              left: 0
            },
            {
              src: '/pages/test2.jpg',
              duration: 500,
              width: 325,
              height: 200,
              top: 0,
              left: 0
            },
            {
              src: '/pages/test3.jpg',
              duration: 500,
              width: 325,
              height: 200,
              top: 0,
              left: 0
            },
            {
              src: '/pages/test4.jpg',
              duration: 500,
              width: 325,
              height: 200,
              top: 0,
              left: 0
            },
            {
              src: '/pages/test5.jpg',
              duration: 500,
              width: 325,
              height: 200,
              top: 0,
              left: 0
            }
          ])
          .state(this.state)
          .reverse(this.reverse)
          .fixedSize(false)
          .preDecode(2)
          .fillMode(FillMode.None)
          .iterations(this.iterations)
          .width(325)
          .height(210)
          .onStart(() => {
            console.info('Start')
          })
          .onPause(() => {
            console.info('Pause')
          })
          .onRepeat(() => {
            console.info('Repeat')
          })
          .onCancel(() => {
            console.info('Cancel')
          })
          .onFinish(() => {
            console.info('Finish')
          })
        Row({space: 5}) {
          Button('start')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.state = AnimationStatus.Running
            })
          Button('pause')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.state = AnimationStatus.Paused
            })
          Button('stop')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.state = AnimationStatus.Stopped
            })
        }

        Row({space: 5}) {
          Button('reverse')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.reverse = !this.reverse
            })
          Button('once')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.iterations = 1
            })
          Button('iteration')
            .width(100)
            .padding(5)
            .onClick(() => {
              this.iterations = -1
            })
        }
      }
      .width('100%')
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}