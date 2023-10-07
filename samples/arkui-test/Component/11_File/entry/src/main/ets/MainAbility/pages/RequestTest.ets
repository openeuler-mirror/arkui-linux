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
import request from '@ohos.request';
import prompt from '@ohos.prompt';

@Entry
@Component
struct RequestTest {
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

        Text('文件上传下载')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })

      Column({space: 10}) {
        Button('上传文件')
          .onClick(() => {
            this.upload()
          })

        Button('下载文件')
          .onClick(() => {
            this.download()
          })
      }
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  private upload() {
    let uploadTask;
    let uploadConfig = {
      url: 'https://patch',
      header: { key1: "value1", key2: "value2" },
      method: "POST",
      files: [{ filename: "test", name: "test", uri: "internal://cache/test.jpg", type: "jpg" }],
      data: [{ name: "name123", value: "123" }],
    };
    try {
      request.uploadFile(globalThis.abilityContext, uploadConfig, (err, data) => {
        if (err) {
          console.error('Failed to request the upload. Cause: ' + JSON.stringify(err));
          prompt.showToast({
            message: 'Failed to request the upload. Cause: ' + JSON.stringify(err)
          })
          return;
        }
        uploadTask = data;
      });
    } catch (err) {
      console.error('err.code : ' + err.code + ', err.message : ' + err.message);
      prompt.showToast({
        message: 'err.code : ' + err.code + ', err.message : ' + err.message
      })
    }
  }

  private download() {
    let downloadRequestOptions = {
      url: 'http://www.path.com',
      filename: 'requestSystemTest',
      header: '',
      description: 'this is requestSystem download response',
      success: function(data) {
        console.info(' download success, code:' + JSON.stringify(data));
      },
      fail: function(data, code) {
        console.info(' download fail data: ' + data + 'code: ' + code);
      },
      complete: function (){
        console.info(' download complete');
      }
    }
    try {
      request.download(downloadRequestOptions);
      console.info('download start ');
    } catch(err) {
      console.info(' download err:' + err);
      prompt.showToast({
        message: 'err.code : ' + err.code + ', err.message : ' + err.message
      })
    }
  }
}