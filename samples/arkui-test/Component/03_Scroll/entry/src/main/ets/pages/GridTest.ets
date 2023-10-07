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
  // @ts-ignore
struct GridTest {
  private items: number[] = [];

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

        Text('网格布局')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 60 })

      Grid() {
        ForEach(this.items, (item, index) => {
          GridItem() {
            Text('Text: ' + item)
              .fontSize(16)
              .backgroundColor('#aabbcc')
              .width('80%')
              .height(70)
          }
          .columnStart(index == 0 ? 0 : 0) // 设置第一个Item布局从第一列开始
          .columnEnd(index == 0 ? 2 : 0)   // 设置第一个Item布局从第三列结束，也即是占满整行
        })
      }
      .columnsTemplate("1fr 1fr 1fr")      // 设置3列，每列均分
      .columnsGap(10)                      // 设置列间距
      .rowsGap(10)                         // 设置行间距
      .width('80%')
      .height(400)
      .backgroundColor(Color.Pink)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
  private aboutToAppear() {
    for(var i = 0; i < 18; i++) {
      this.items[i] = i;
    }
  }
}