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
@Extend(Text) function textStyle () {
  .width('25%')
  .height(35)
  .fontSize(16)
  .textAlign(TextAlign.Center)
  .backgroundColor(0xAFEEEE)
}

@Observed
class ClassA {
  public name: string
  public bol: boolean

  constructor(name: string, bol: boolean) {
    this.name = name
    this.bol = bol
  }
}

@Entry
@Component
struct DragTest {
  @State arr: ClassA[] = [new ClassA('A', true), new ClassA('B', true), new ClassA('C', true)]
  @State dragIndex: number = 0

  changeIndex(index1: number, index2: number) { // 交换数组位置
    [this.arr[index1], this.arr[index2]] = [this.arr[index2], this.arr[index1]];
  }

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

        Text('拖拽事件')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Row({ space: 15 }) {
        List({ space: 20 }) {
          ForEach(this.arr, (item, index) => {
            ListItem() {
              Column() {
                Child({ a: this.arr[index] })
              }
              .onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                  this.dragIndex = index // 获取当前拖拽子组件的索引
                  console.info('onTouch' + this.dragIndex)
                }
              })
            }
          })
        }
        .listDirection(Axis.Horizontal)
        .onDrop((event: DragEvent, extraParams: string) => { // 绑定此事件的组件可作为拖拽释放目标，当在本组件范围内停止拖拽行为时，触发回调。
          let jsonString = JSON.parse(extraParams);
          this.changeIndex(this.dragIndex, jsonString.insertIndex)
        })
      }.padding({ top: 10, bottom: 10 }).margin(10)

    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }
}


@Component
struct Child {
  @ObjectLink a: ClassA

  @Builder pixelMapBuilder() {
    Column() {
      Text(this.a.name)
        .width('50%')
        .height(60)
        .fontSize(16)
        .borderRadius(10)
        .textAlign(TextAlign.Center)
        .backgroundColor(Color.Yellow)
    }
  }

  build() {
    Column() {
      Text(this.a.name)
        .textStyle()
        .visibility(this.a.bol ? Visibility.Visible : Visibility.None)
        .onDragStart(() => { // 第一次拖拽此事件绑定的组件时，触发回调。
          this.a.bol = false // 控制显隐
          return this.pixelMapBuilder() // 设置拖拽过程中显示的图片。
        })
        .onTouch((event: TouchEvent) => {
          if (event.type === TouchType.Up) {
            this.a.bol = true
          }
        })
      Text('')
        .width('25%')
        .height(35)
        .fontSize(16)
        .textAlign(TextAlign.Center)
        .border({ width: 5, color: 'red' })
        .visibility(!this.a.bol ? Visibility.Visible : Visibility.None)
    }
  }
}