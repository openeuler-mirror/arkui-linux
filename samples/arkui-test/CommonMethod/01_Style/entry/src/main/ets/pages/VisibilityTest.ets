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

class ContainerInfo {
  label: string = '';
  size: string = '';
}

class ChildInfo {
  text: string = '';
  priority: number = 0;
}

@Entry
@Component
struct VisibilityTest {
  // 显示容器大小
  private container: ContainerInfo[] = [
    { label: 'Big container: 100%', size: '100%' },
    { label: 'Middle container: 50%', size: '50%' },
    { label: 'Small container: 30%', size: '30%' }
  ]

  private children: ChildInfo[] = [
    { text: '1\n(priority:2)', priority: 2 },
    { text: '2\n(priority:1)', priority: 1 },
    { text: '3\n(priority:3)', priority: 3 },
    { text: '4\n(priority:1)', priority: 1 },
    { text: '5\n(priority:2)', priority: 2 }
  ]

  @State currentIndex: number = 0;

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

        Text('显隐设置')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      /* 显示和隐藏设置 */
      Text('1. 显示和隐藏设置: visibility')
        .textStyle()
      Column({ space: 10 }) {
        Row() {
          Text()
            .height(30)
            .width(120)
            .backgroundColor("#aabbcc")
            .layoutWeight(1)

          Text()
            .height(30)
            .backgroundColor("#aaccbb")
            .visibility(Visibility.Visible) // 设置默认值Visible
            .layoutWeight(1)

          Text()
            .height(30)
            .backgroundColor(Color.Pink)
            .layoutWeight(1)
        }

        Row() {
          Text()
            .height(30)
            .width(120)
            .backgroundColor("#aabbcc")
            .layoutWeight(1)

          Text()
            .height(30)
            .backgroundColor("#aaccbb")
            .visibility(Visibility.Hidden) // 设置Hidden，不在界面显示但是还占着位置
            .layoutWeight(1)

          Text()
            .height(30)
            .backgroundColor(Color.Pink)
            .layoutWeight(1)
        }

        Row() {
          Text()
            .height(30)
            .backgroundColor("#aabbcc")
            .layoutWeight(1)

          Text()
            .height(30)
            .visibility(Visibility.None) // 设置None，不在界面上显示
            .backgroundColor("#aaccbb")
            .layoutWeight(1)

          Text()
            .height(30)
            .backgroundColor(Color.Pink)
            .layoutWeight(1)
        }
      }
      .margin({bottom:10})
      .width('80%')

      /* 显示优先级设置 */
      Text('2. 显示优先级设置: displayPriority')
        .textStyle()

      Text('displayPriority设置当前组件在布局容器中显示的优先级。当父容器空间不足时，低优先级的组件会被隐藏，该属性仅在Row 、Column、和 Flex(单行) 容器组件中生效。')
        .fontSize(14)
        .margin({ bottom: 20 })
        .textAlign(TextAlign.Start)
        .width('80%')

      Column({ space: 10 }) {

        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          ForEach(this.children, (item) => {
            Text(item.text)
              .width(100)
              .height(160)
              .fontSize(18)
              .textAlign(TextAlign.Center)
              .backgroundColor(0xbbb2cb)
              .displayPriority(item.priority)           // 使用displayPriority给子组件绑定显示优先级
          }, item => item.text)
        }
        .width(this.container[this.currentIndex].size)  // 通过变量设置Flex父容器宽度
        .backgroundColor(0xd2cab3)

        Button(this.container[this.currentIndex].label) // 切换父级容器大小
          .backgroundColor(0x317aff)
          .onClick(() => {
            this.currentIndex = (this.currentIndex + 1) % this.container.length;
          })

      }
      .padding(10)
      .width("100%")
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}