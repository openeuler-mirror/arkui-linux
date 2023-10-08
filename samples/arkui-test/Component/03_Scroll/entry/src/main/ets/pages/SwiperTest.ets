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

/* @Extend样式设置 */
@Extend(Text) function textStyle() {
  .fontSize(14)
  .margin({ top: 30, bottom: 20 })
  .textAlign(TextAlign.Start)
  .width('80%')
}

@Entry
@Component
struct SwiperTest {
  private controller: SwiperController = new SwiperController();
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

        Text('页面切换组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Text('1. Swiper:')
        .textStyle()

      Swiper(this.controller) {      // 绑定翻页控制器
        Text('Page1')
          .fontSize(20)
          .backgroundColor('#aabbcc')
        Text('Page2')
          .fontSize(20)
          .backgroundColor('#aabbcc')
        Text('Page3')
          .fontSize(20)
          .backgroundColor('#aabbcc')
      }
      .width('80%')
      .height(280)
      .backgroundColor(Color.Pink)
      .index(1)                      // 默认显示第二页
      .indicator(true)               // 显示导航指示器

      Text('2. SwiperController:')
        .fontSize(14)
        .margin({ top: 30 })
        .textAlign(TextAlign.Start)
        .width('80%')

      Text('Swiper 的页面切换控制器，可以将此对象绑定至 Swiper 组件上，然后通过它控制翻页。')
        .fontSize(14)
        .margin({ top: 18, bottom: 20 })
        .textAlign(TextAlign.Start)
        .width('80%')

      Row({space: 20}) {
        Button('上一页')
          .onClick(() => {
            this.controller.showPrevious();
          })
        Button('下一页')
          .onClick(() => {
            this.controller.showNext();
          })
      }
      .margin({top: 10})
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}