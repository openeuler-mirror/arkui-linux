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
struct PickerTest {
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

        Text('选择器组件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')

      Text('TimePicker:')
        .fontSize(14)
        .margin({ top: 20, bottom: 10 })
        .textAlign(TextAlign.Start)
        .width('80%')

      TimePicker({selected: new Date()}) // 设置默认当前时间
        .width(200)
        .height(120)
        .backgroundColor('#aabbcc')
        .useMilitaryTime(true)           // 设置12小时制，也就是不显示上下午文本
        .onChange((date) => {            // 设置事件回调
          console.log(`selected time：${date.hour} : ${date.minute}`)
        })

      Text('DatePicker:')
        .fontSize(14)
        .margin({ top: 20, bottom: 10 })
        .textAlign(TextAlign.Start)
        .width('80%')

      DatePicker({
        start: new Date('2000-1-1'), // 设置开始日期
        end: new Date('2030-1-1')    // 设置结束日期
      })
        .lunar(true)                   // 设置显示农历
        .width(200)
        .height(120)
        .backgroundColor('#aabbcc')
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}