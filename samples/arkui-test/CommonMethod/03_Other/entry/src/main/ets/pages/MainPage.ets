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

/* button 样式 */
@Extend(Button) function buttonStyle(arkTSFileName) {
  .fontSize(16)
  .fontColor('#191919')
  .borderWidth(1)
  .borderColor('#a9a9a9')
  .backgroundColor('#e9e9e9')
  .width('100%')
  .onClick(() => {
    router.replaceUrl({ url: 'pages/' + arkTSFileName });
  })
}

@Entry
@Component
struct MainPage{
  build() {
      Column() {
        /* 文本组件 */
        Text('其它公共属性测试')
          .fontSize(24)
          .margin({ top: 100, bottom: 60 })
          .width('100%') // 宽度大于文本内容长度，textAlign起作用
          .textAlign(TextAlign.Center)

        /* 弹性布局容器 Flex */
        Flex({ direction: FlexDirection.Column }) {
          /* 按钮 Button 组件 */
          Button('公共剪切类属性', { type: ButtonType.Normal })
            .buttonStyle('CutTest')

          Button('公共提示类属性', { type: ButtonType.Normal })
            .buttonStyle('BindTest')

          Button('显示效果类属性', { type: ButtonType.Normal })
            .buttonStyle('DisplayTest')
        }
        .width('50%')
      }
      .backgroundColor($r('app.color.background'))
  }
}