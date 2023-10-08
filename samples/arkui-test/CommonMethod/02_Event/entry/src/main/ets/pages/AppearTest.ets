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

import prompt from '@ohos.prompt';
import router from '@ohos.router';

@Entry
@Component
struct AppearTest {
  @State isShow: boolean = true
  @State changeAppear: string = 'Hide Text'
  private myText: string = 'Text for onAppear'
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

        Text('挂载卸载事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column() {
        Button(this.changeAppear)
          .onClick(() => {
            this.isShow = !this.isShow
          }).margin(15)
        if (this.isShow) {
          Text(this.myText).fontSize(26).fontWeight(FontWeight.Bold)
            .onAppear(() => {
              this.changeAppear = 'Hide Text'
              prompt.showToast({
                message: 'The text is shown',
                duration: 2000
              })
            })
            .onDisAppear(() => {
              this.changeAppear = 'Show Text'
              prompt.showToast({
                message: 'The text is hidden',
                duration: 2000
              })
            })
        }
      }.padding(30).width('100%')


    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}