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
struct VideoTest {
  private videoController: VideoController = new VideoController()
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

        Text('视频播放')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Video({
          src: $rawfile("videoTest.mp4"),                   // 设置数据源
          controller: this.videoController                   // 设置控制器
        })
          .width(300)
          .height(210)

        Row({space: 10}) {
          Button("开始播放")
            .onClick(() => {
              this.videoController.start()
            })
          Button("暂停播放")
            .onClick(() => {
              this.videoController.pause()
            })

          Button("继续播放")
            .onClick(() => {
              this.videoController.start()
            })
        }

        Row({space: 10}) {
          Button("全屏播放")
            .onClick(() => {
              this.videoController.requestFullscreen(true)
            })
          Button("退出全屏")
            .onClick(() => {
              this.videoController.exitFullscreen()
            })
        }
      }
      .width("100%")
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}