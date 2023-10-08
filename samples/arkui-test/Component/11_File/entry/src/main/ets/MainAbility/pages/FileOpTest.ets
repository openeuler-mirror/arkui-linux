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
import featureAbility from '@ohos.ability.featureAbility';
import fileio from '@ohos.fileio';
import zlib from '@ohos.zlib';

@Entry
@Component
struct FileOpTest {
  private fileName = "test.txt";
  private rootDir: string = "";
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

        Text('文件操作')
          .fontSize(22)
          .margin({ top: 80, left: 20 })
      }
      .width('80%')
      .margin({ bottom: 30 })


      Column({space: 10}) {
        Button('获取根目录')
          .onClick(() => {
            featureAbility.getContext().getFilesDir((error, path) => {
              console.log("files dir: " + path)
              this.rootDir = path;
            });
            featureAbility.getContext().getCacheDir((error, path) => {
              console.log("cache dir: " + path)
            });
          })

        Button('打开文件')
          .onClick(() => {
            if(this.rootDir) {
              this.open(this.rootDir);
            }
          })

        Button('写入文件')
          .onClick(() => {
            if(this.rootDir) {
              this.write(this.rootDir);
            }
          })

        Button('读取文件')
          .onClick(() => {
            if(this.rootDir) {
              this.read(this.rootDir);
            }
          })
        Button('关闭文件')
          .onClick(() => {
            if(this.rootDir) {
              this.close(this.rootDir);
            }
          })
        Button('压缩文件')
          .onClick(() => {
            if(this.rootDir) {
              this.zip(this.rootDir);
            }
          })
        Button('解压缩文件')
          .onClick(() => {
            if(this.rootDir) {
              this.unzip(this.rootDir);
            }
          })
      }
      .padding(10)
    }
    .backgroundColor($r('app.color.background'))
    .size({width: '100%', height: '100%'})
  }

  private unzip(path: string) {
    let inFile = path + "/test.zip";
    let outFile = path;
    zlib.unzipFile(inFile, outFile, {})
      .then((result) => {
        console.log(JSON.stringify(result));
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      })
  }

  private zip(path: string) {
    let inFile = path + "/" + this.fileName;
    let outFile = path + "/test.zip";
    zlib.zipFile(inFile, outFile, {})
      .then((result) => {
        console.log(JSON.stringify(result));
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      })
  }

  private close(path: string) {
    let fd = fileio.openSync(path + "/" + this.fileName, 0o102, 0o666);
    fileio.closeSync(fd);
  }

  private open(path: string) {
    let fd = fileio.openSync(path + "/" + this.fileName, 0o102, 0o666);
    console.log("open file result: " + fd);
  }

  private read(path: string) {
    let fd = fileio.openSync(path + "/" + this.fileName, 0o102, 0o666);
    let buffer = new ArrayBuffer(4096);
    fileio.read(fd, buffer, (error, data) => {
      if(!error) {
        let s = String.fromCodePoint.apply(null, new Uint8Array(data.buffer));
        console.log("" + s);
        let d = decodeURIComponent(escape(s));
        console.log("read success, read content: " + d);
      }
    })
  }

  private write(path: string) {
    let fd = fileio.openSync(path + "/" + this.fileName, 0o102, 0o666);
    fileio.write(fd, "你好，OpenHarmony", (error, length) => {
      if(!error) {
        console.log("write success, write length: " + length);
      }
    })
  }
}