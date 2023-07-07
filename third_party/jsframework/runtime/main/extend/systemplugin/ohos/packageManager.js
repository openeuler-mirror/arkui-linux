/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

export function mockPackageManager() {
  const PackageFlagMock = {
    DEFAULT: 0x00000000,
    GET_ACTIVITIES: 0x00000001,
    GET_META_DATA: 0x00000080,
    MATCH_UNINSTALLED_PACKAGES: 0x00002000,
    MATCH_ALL: 0x00020000
  }
  const PackageErrorMock = {
    NAME_NOT_FOUND_EXCEPTION: 0
  }
  const ApplicationInfosMock = [
    {
      packageName: "[PC preview] unknown package name",
      className: "[PC preview] unknown class name",
      name: "[PC preview] unknown name",
      labelId: "[PC preview] unknown label id",
      iconId: "[PC preview] unknown icon id",
      sourceDir: "[PC preview] unknown source dir",
      flags: "[PC preview] unknown flags",
      customizeData: {
        key: "[PC preview] unknown key",
        value: {
          CustomizeData: {
            name: "[PC preview] unknown name",
            value: "[PC preview] unknown value",
          }
        }
      }
    },
  ]
  const ApplicationInfoMock = {
    packageName: "[PC preview] unknown package name",
    className: "[PC preview] unknown class name",
    name: "[PC preview] unknown name",
    labelId: "[PC preview] unknown label id",
    iconId: "[PC preview] unknown icon id",
    sourceDir: "[PC preview] unknown source dir",
    flags: "[PC preview] unknown flags",
    customizeData: {
      key: "[PC preview] unknown key",
      value: {
        CustomizeData: {
          name: "[PC preview] unknown name",
          value: "[PC preview] unknown value",
        }
      }
    }
  }
  const ApplicationFlagMock = {
    FLAG_SYSTEM: 0x0000000001,
    FLAG_IS_DATA_ONLY: 0x1000000000,
  }
  const PackageInfoMock = {
    packageName: "[PC preview] unknown package name",
    name: "[PC preview] unknown name ",
    lastUpdateTime: "[PC preview] unknown last update time",
    versionCode: "[PC preview] unknown version code",
    appInfo: {
      packageName: "[PC preview] unknown package name",
      className: "[PC preview] unknown class name",
      name: "[PC preview] unknown name",
      labelId: "[PC preview] unknown label id",
      iconId: "[PC preview] unknown icon id",
      sourceDir: "[PC preview] unknown source dir",
      flags: "[PC preview] unknown flags",
      customizeData: {
        key: "[PC preview] unknown key",
        value: {
          CustomizeData: {
            name: "[PC preview] unknown name",
            value: "[PC preview] unknown value",
          }
        }
      }
    }
  }
  const PackageInfosMock = [
    {
      packageName: "[PC preview] unknown package name",
      name: "[PC preview] unknown name ",
      lastUpdateTime: "[PC preview] unknown last update time",
      versionCode: "[PC preview] unknown version code",
      appInfo: {
        packageName: "[PC preview] unknown package name",
        className: "[PC preview] unknown class name",
        name: "[PC preview] unknown name",
        labelId: "[PC preview] unknown label id",
        iconId: "[PC preview] unknown icon id",
        sourceDir: "[PC preview] unknown source dir",
        flags: "[PC preview] unknown flags",
        customizeData: {
          key: "[PC preview] unknown key",
          value: {
            CustomizeData: {
              name: "[PC preview] unknown name",
              value: "[PC preview] unknown value",
            }
          }
        }
      }
    },
  ]

  const CustomizeDataMock = {
    name: "[PC preview] unknown name",
    value: "[PC preview] unknown value",
  }
  const BundleErrorMock = {
    REMOTE_EXCEPTION: 0,
    SECURITY_EXCEPTION: 1
  }
  const ActivityInfoMock = {
    packageName: "[PC preview] unknown package name",
    name: "[PC preview] unknown name",
    iconId: "[PC preview] unknown icon id",
    labelId: "[PC preview] unknown label id",
    customizeData: {
      key: "[PC preview] unknown key",
      value: {
        CustomizeData: {
          name: "[PC preview] unknown name",
          value: "[PC preview] unknown value",
        }
      }
    }
  }
  const ActivityInfosMock = [
    {
      packageName: "[PC preview] unknown package name",
      name: "[PC preview] unknown name",
      iconId: "[PC preview] unknown icon id",
      labelId: "[PC preview] unknown label id",
      customizeData: {
        key: "[PC preview] unknown key",
        value: {
          CustomizeData: {
            name: "[PC preview] unknown name",
            value: "[PC preview] unknown value",
          }
        }
      }
    },
  ]
  const ComponentNameMock = {
    package: "[PC preview] unknown package",
    name: "[PC preview] unknown name",
  }
  global.ohosplugin.package = {
    getApplicationInfo: function (...args) {
      console.warn("PackageManger.getApplicationInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ApplicationInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(ApplicationInfoMock)
        });
      }
    },
    getInstalledApplications: function (...args) {
      console.warn("PackageManger.getInstalledApplications interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ApplicationInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(ApplicationInfosMock)
        });
      }
    },
    getPackageInfo: function (...args) {
      console.warn("PackageManger.getPackageInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PackageInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(PackageInfoMock)
        });
      }
    },
    getInstalledPackages: function (...args) {
      console.warn("PackageManger.getInstalledPackages interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PackageInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(PackageInfosMock)
        });
      }
    },
    getActivityInfo: function (...args) {
      console.warn("PackageManger.getActivityInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ActivityInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(ActivityInfoMock)
        });
      }
    },
    getActivityList: function (...args) {
      console.warn("PackageManger.getActivityList interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ActivityInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(ActivityInfosMock)
        });
      }
    },
  }
}
