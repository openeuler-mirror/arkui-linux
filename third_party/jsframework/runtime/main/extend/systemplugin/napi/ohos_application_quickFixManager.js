/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

import { paramMock } from "../utils"

export const HapModuleQuickFixInfo  = {
    moduleName: '[PC preview] unknow moduleName',
    originHapHash: '[PC preview] unknow originHapHash',
    quickFixFilePath: '[PC preview] unknow quickFixFilePath',
}
export const ApplicationQuickFixInfo = {
    bundleName: '[PC preview] unknow bundleName',
    bundleVersionCode: '[PC preview] unknow bundleVersionCode',
    bundleVersionName: '[PC preview] unknow bundleVersionName',
    quickFixVersionCode: '[PC preview] unknow quickFixVersionCode',
    quickFixVersionName: '[PC preview] unknow quickFixVersionName',
    hapModuleQuickFixInfo: [HapModuleQuickFixInfo],
}
export function mockQuickFixManager() {
  const quickFixManager = {
    HapModuleQuickFixInfo,
    ApplicationQuickFixInfo,
    applyQuickFix: function (...args) {
      console.warn('quickFixManager.applyQuickFix interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve();
        });
      }
    },
    getApplicationQuickFixInfo: function (...args) {
        console.warn('quickFixManager.getApplicationQuickFixInfo interface mocked in the Previewer. How this interface works on the' +
          ' Previewer may be different from that on a real device.');
        const len = args.length;
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, ApplicationQuickFixInfo);
        } else {
          return new Promise((resolve) => {
            resolve(ApplicationQuickFixInfo);
          });
        }
      },
  }
  return quickFixManager
}