/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

import { paramMock } from "./utils"
import { windowMock } from "./napi/ohos_window"

const DataAbilityResultMock = {
  uri: "[PC Preview] unknow uri",
  count: "[PC Preview] unknow count"
}
const DataAbilityResultArrayMock = [
  DataAbilityResultMock
]
const getFileTypesArrayMock = [
  paramMock.paramStringMock
]
const PacMapTypeMock = {
  PacMap: new Map([["[PC Preview] unknow PacMapKey", "[PC Preview] unknow PacMapValue"]])
}
const ResultSetMock = {
  columnNames: "[PC Preview] unknow columnNames",
  columnCount: "[PC Preview] unknow columnCount",
  rowCount: "[PC Preview] unknow rowCount",
  rowIndex: "[PC Preview] unknow rowIndex",
  isAtFirstRow: "[PC Preview] unknow isAtFirstRow",
  isAtLastRow: "[PC Preview] unknow isAtLastRow",
  isEnded: "[PC Preview] unknow isEnded",
  isStarted: "[PC Preview] unknow isStarted",
  isClose: "[PC Preview] unknow isClose",
  getColumnIndex: function (...args) {
    console.warn("ResultSet.getColumnIndex interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  getColumnName: function (...args) {
    console.warn("ResultSet.getColumnName interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock;
  },
  goTo: function (...args) {
    console.warn("ResultSet.goTo interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToRow: function (...args) {
    console.warn("ResultSet.goToRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToLastRow: function (...args) {
    console.warn("ResultSet.goToLastRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToFirstRow: function (...args) {
    console.warn("ResultSet.goToFirstRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToNextRow: function (...args) {
    console.warn("ResultSet.goToNextRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  goToPreviousRow: function (...args) {
    console.warn("ResultSet.goToPreviousRow interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  getBlob: function (...args) {
    console.warn("ResultSet.getBlob interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramArrayMock;
  },
  getString: function (...args) {
    console.warn("ResultSet.getString interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramStringMock;
  },
  getLong: function (...args) {
    console.warn("ResultSet.getLong interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  getDouble: function (...args) {
    console.warn("ResultSet.getDouble interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramNumberMock;
  },
  isColumnNull: function (...args) {
    console.warn("ResultSet.isColumnNull interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    return paramMock.paramBooleanMock;
  },
  close: function () {
    console.warn("ResultSet.isColumnNull interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
  }
}
const DataAbilityHelperMock = {
  openFile: function (...args) {
    console.warn("DataAbilityHelper.openFile interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  on: function (...args) {
    console.warn("DataAbilityHelper.on interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    }
  },
  off: function (...args) {
    console.warn("DataAbilityHelper.off interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    }
  },
  call: function (...args) {
    console.warn("DataAbilityHelper.call interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, PacMapTypeMock)
    } else {
      return new Promise((resolve) => {
        resolve(PacMapMock);
      })
    }
  },
  getType: function (...args) {
    console.warn("DataAbilityHelper.getType interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  getFileTypes: function (...args) {
    console.warn("DataAbilityHelper.getFileTypes interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, getFileTypesArrayMock)
    } else {
      return new Promise((resolve) => {
        resolve(getFileTypesArrayMock);
      })
    }
  },
  normalizeUri: function (...args) {
    console.warn("DataAbilityHelper.normalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  denormalizeUri: function (...args) {
    console.warn("DataAbilityHelper.denormalizeUri interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
      })
    }
  },
  notifyChange: function (...args) {
    console.warn("DataAbilityHelper.notifyChange interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock)
    } else {
      return new Promise((resolve) => {
        resolve();
      })
    }
  },
  insert: function (...args) {
    console.warn("DataAbilityHelper.insert interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  batchInsert: function (...args) {
    console.warn("DataAbilityHelper.batchInsert interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  delete: function (...args) {
    console.warn("DataAbilityHelper.delete interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  update: function (...args) {
    console.warn("DataAbilityHelper.update interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
    } else {
      return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
      })
    }
  },
  query: function (...args) {
    console.warn("DataAbilityHelper.query interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, ResultSetMock)
    } else {
      return new Promise((resolve) => {
        resolve(ResultSetMock);
      })
    }
  },
  executeBatch: function (...args) {
    console.warn("DataAbilityHelper.executeBatch interface mocked in the Previewer. How this interface works on the Previewer" +
      " may be different from that on a real device.")
    const len = args.length
    if (typeof args[len - 1] === 'function') {
      args[len - 1].call(this, paramMock.businessErrorMock, DataAbilityResultArrayMock)
    } else {
      return new Promise((resolve) => {
        resolve(DataAbilityResultArrayMock);
      })
    }
  }
}

export function mockAbilityFeatureAbility() {
  global.systemplugin.ability = {}
  const WantMock = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    uri: "[PC Preview] unknow uri",
    type: "[PC Preview] unknow type",
    flag: "[PC Preview] unknow flag",
    action: "[PC Preview] unknow action",
    parameters: "[PC Preview] unknow parameters",
    entities: "[PC Preview] unknow entities"
  }
  const AbilityResultMock = {
    resultCode: "[PC Preview] unknow resultCode",
    want: WantMock
  }
  const ContinuationStateMock = {
    LOCAL_RUNNING: '0',
    REMOTE_RUNNING: '1',
    REPLICA_RUNNING: '2'
  }
  const PermissionRequestResultMock = {
    requestCode: "[PC Preview] unknow requestCode",
    permissions: ["[PC Preview] unknow permission", "[PC Preview] unknow permission"],
    authResults: ["[PC Preview] unknow authResult", "[PC Preview] unknow authResult"]
  }
  const ModuleInfoMock = {
    moduleName: "[PC Preview] unknow moduleName",
    moduleSourceDir: "[PC Preview] unknow moduleSourceDir"
  }
  const CustomizeDataMock = {
    name: "[PC Preview] unknow name",
    value: "[PC Preview] unknow values"
  }
  const ApplicationInfoMock = {
    name: "[PC Preview] unknow name",
    description: "[PC Preview] unknow description",
    descriptionId: "[PC Preview] unknow descriptionId",
    systemApp: "[PC Preview] unknow systemApp",
    enabled: "[PC Preview] unknow enabled",
    label: "[PC Preview] unknow label",
    labelId: "[PC Preview] unknow labelId",
    icon: "[PC Preview] unknow icon",
    iconId: "[PC Preview] unknow iconId",
    process: "[PC Preview] unknow process",
    supportedModes: "[PC Preview] unknow supportedModes",
    moduleSourceDirs: ["[PC Preview] unknow moduleSourceDir", "[PC Preview] unknow moduleSourceDir"],
    permissions: ["[PC Preview] unknow permission", "[PC Preview] unknow permission"],
    moduleInfo: [ModuleInfoMock],
    entryDir: "[PC Preview] unknow entryDir",
    customizeData: new Map([["[PC Preview] unknow customizeDataKey", CustomizeDataMock]])
  }
  const AbilityInfoMock = {
    bundleName: "[PC Preview] unknow bundleName",
    className: "[PC Preview] unknow className",
    label: "[PC Preview] unknow label",
    description: "[PC Preview] unknow description",
    icon: "[PC Preview] unknow icon",
    labelId: "[PC Preview] unknow labelId",
    descriptionId: "[PC Preview] unknow descriptionId",
    iconId: "[PC Preview] unknow iconId",
    moduleName: "[PC Preview] unknow moduleName",
    process: "[PC Preview] unknow process",
    targetAbility: "[PC Preview] unknow targetAbility",
    backgroundModes: "[PC Preview] unknow backgroundModes",
    isVisible: "[PC Preview] unknow isVisible",
    formEnabled: "[PC Preview] unknow formEnabled",
    type: "[PC Preview] unknow type",
    subType: "[PC Preview] unknow subType",
    orientation: "[PC Preview] unknow orientation",
    launchMode: "[PC Preview] unknow launchMode",
    permissions: ["[PC Preview] unknow permission", "[PC Preview] unknow permission"],
    deviceTypes: ["[PC Preview] unknow deviceType", "[PC Preview] unknow deviceType"],
    deviceCapabilities: ["[PC Preview] unknow deviceCapabilities", "[PC Preview] unknow deviceCapabilities"],
    readPermission: "[PC Preview] unknow readPermission",
    writePermission: "[PC Preview] unknow writePermission",
    applicationInfo: ApplicationInfoMock,
    formEntity: "[PC Preview] unknow formEntity",
    minFormHeight: "[PC Preview] unknow minFormHeight",
    defaultFormHeight: "[PC Preview] unknow defaultFormHeight",
    minFormWidth: "[PC Preview] unknow minFormWidth",
    defaultFormWidth: "[PC Preview] unknow defaultFormWidth",
    uri: "[PC Preview] unknow uri",
    customizeData: new Map([["[PC Preview] unknow customizeDataKey", CustomizeDataMock]])
  }
  const ProcessInfoMock = {
    pid: "[PC Preview] unknow pid",
    processName: "[PC Preview] unknow processName"
  }
  const HapModuleInfoMock = {
    name: "[PC Preview] unknow name",
    description: "[PC Preview] unknow description",
    descriptionId: "[PC Preview] unknow descriptionId",
    icon: "[PC Preview] unknow icon",
    label: "[PC Preview] unknow label",
    labelId: "[PC Preview] unknow labelId",
    iconId: "[PC Preview] unknow iconId",
    backgroundImg: "[PC Preview] unknow backgroundImg",
    supportedModes: "[PC Preview] unknow supportedModes",
    reqCapabilities: ["[PC Preview] unknow reqCapabilities", "[PC Preview] unknow reqCapabilities"],
    deviceTypes: ["[PC Preview] unknow deviceTypes", "[PC Preview] unknow deviceTypes"],
    abilityInfo: [AbilityInfoMock],
    moduleName: "[PC Preview] unknow moduleName",
    mainAbilityName: "[PC Preview] unknow mainAbilityName",
    installationFree: "[PC Preview] unknow installationFree",
  }
  const ElementNameMock = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    uri: "[PC Preview] unknow uri",
    shortName: "[PC Preview] unknow shortName",
  }
  const AppVersionInfoMock = {
    appName: "[PC Preview] unknow appName",
    versionCode: "[PC Preview] unknow versionCode",
    versionName: "[PC Preview] unknow versionName"
  }
  const ContextMock = {
    getCacheDir: function (...args) {
      console.warn("Context.getCacheDir interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getFilesDir: function (...args) {
      console.warn("Context.getFilesDir interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getExternalCacheDir: function (...args) {
      console.warn("Context.getExternalCacheDir interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getOrCreateLocalDir: function (...args) {
      console.warn("Context.getOrCreateLocalDir interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getOrCreateDistributedDir: function (...args) {
      console.warn("Context.getOrCreateDistributedDir interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    verifyPermission: function (...args) {
      console.warn("Context.verifyPermission interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    compelVerifyPermission: function (...args) {
      console.warn("Context.compelVerifyPermission interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    authUriAccessPermission: function (...args) {
      console.warn("Context.authUriAccessPermission interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    unauthUriAccessPermission: function (...args) {
      console.warn("Context.unauthUriAccessPermission interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    requestPermissionsFromUser: function (...args) {
      console.warn("Context.requestPermissionsFromUser interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PermissionRequestResultMock)
      } else {
        return new Promise((resolve) => {
          resolve(PermissionRequestResultMock)
        })
      }
    },
    getApplicationInfo: function (...args) {
      console.warn("Context.getApplicationInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ApplicationInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(ApplicationInfoMock)
        })
      }
    },
    getBundleName: function (...args) {
      console.warn("Context.getBundleName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getDisplayOrientation: function (...args) {
      console.warn("Context.getDisplayOrientation interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    setDisplayOrientation: function (...args) {
      console.warn("Context.setDisplayOrientation interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    setShowOnLockScreen: function (...args) {
      console.warn("Context.setShowOnLockScreen interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    setWakeUpScreen: function (...args) {
      console.warn("Context.setWakeUpScreen interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    getProcessInfo: function (...args) {
      console.warn("Context.getProcessInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ProcessInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(ProcessInfoMock)
        })
      }
    },
    getAppType: function (...args) {
      console.warn("Context.getAppType interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getElementName: function (...args) {
      console.warn("Context.getElementName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ElementNameMock)
      } else {
        return new Promise((resolve) => {
          resolve(ElementNameMock)
        })
      }
    },
    getHapModuleInfo: function (...args) {
      console.warn("Context.getHapModuleInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, HapModuleInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(HapModuleInfoMock)
        })
      }
    },
    getProcessName: function (...args) {
      console.warn("Context.getProcessName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    getCallingBundle: function (...args) {
      console.warn("Context.getCallingBundle interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    printDrawnCompleted: function (...args) {
      console.warn("Context.printDrawnCompleted interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    isUpdatingConfigurations: function (...args) {
      console.warn("Context.isUpdatingConfigurations interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    getAppVersionInfo: function (...args) {
      console.warn("Context.getAppVersionInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AppVersionInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(AppVersionInfoMock)
        })
      }
    },
    getAbilityInfo: function (...args) {
      console.warn("Context.getAbilityInfo interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AbilityInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(AbilityInfoMock)
        })
      }
    },
    getApplicationContext: function () {
      console.warn("Context.getApplicationContext interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return ContextMock;
    }
  }
  global.systemplugin.ability.featureAbility = {
    getWant: function (...args) {
      console.warn("ability.featureAbility.getWant interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WantMock)
      } else {
        return new Promise((resolve) => {
          resolve(WantMock)
        })
      }
    },
    startAbility: function (...args) {
      console.warn("ability.featureAbility.startAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    connectAbility: function (...args) {
      console.warn("ability.featureAbility.connectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    disconnectAbility: function (...args) {
      console.warn("ability.featureAbility.disconnectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    getContext: function () {
      console.warn("ability.featureAbility.getContext interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      return ContextMock;
    },
    startAbilityForResult: function (...args) {
      console.warn("ability.featureAbility.startAbilityForResult interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AbilityResultMock)
      } else {
        return new Promise((resolve) => {
          resolve(AbilityResultMock)
        })
      }
    },
    terminateSelfWithResult: function (...args) {
      console.warn("ability.featureAbility.terminateSelfWithResult interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    terminateSelf: function (...args) {
      console.warn("ability.featureAbility.terminateSelf interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    acquireDataAbilityHelper: function (...args) {
      console.warn("ability.featureAbility.acquireDataAbilityHelper mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
      return DataAbilityHelperMock;
    },
    hasWindowFocus: function (...args) {
      console.warn("ability.featureAbility.hasWindowFocus interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    getAbilityMissionId: function (...args) {
      console.warn("ability.featureAbility.getAbilityMissionId interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock);
        })
      }
    },
    getWindow: function (...args) {
      console.warn("ability.featureAbility.getWindow interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, windowMock)
      } else {
        return new Promise((resolve) => {
          resolve(windowMock)
        })
      }
    },
    continueAbility: function (...args) {
      console.warn("ability.featureAbility.continueAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve();
        })
      }
    },
    getContinuationState: function (...args) {
      console.warn("ability.featureAbility.getContinuationState interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ContinuationStateMock)
      } else {
        return new Promise((resolve) => {
          resolve(ContinuationStateMock)
        })
      }
    },
    getOriginalDeviceId: function (...args) {
      console.warn("ability.featureAbility.getOriginalDeviceId interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        })
      }
    },
    reverseContinueAbility: function (...args) {
      console.warn("ability.featureAbility.reverseContinueAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    finishTaskSyncAnimation: function (...args) {
      console.warn("ability.featureAbility.finishTaskSyncAnimation interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
    },
    setTaskSyncAnimationParams: function (...args) {
      console.warn("ability.featureAbility.setTaskSyncAnimationParams interface mocked in the Previewer. How this interface works on" +
        " the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    startAssistAbility: function (...args) {
      console.warn("ability.featureAbility.startAssistAbility mocked in the Previewer. How this interface works on the Previewer may be" +
        " different from that on a real device.")
    },
    stopAssistAbility: function (...args) {
      console.warn("ability.featureAbility.stopAssistAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    on: function (...args) {
      console.warn("ability.featureAbility.on interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'assistConnect') {
          args[len - 1].call(this, global.systemplugin.ability.abilityAgent);
        } else if (args[0] == 'assistConnectFailed') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else {
          args[len - 1].call(this, paramMock.paramNumberMock);
        }
      }
    },
    off: function (...args) {
      console.warn("ability.featureAbility.off interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'assistConnect') {
          args[len - 1].call(this, global.systemplugin.ability.abilityAgent);
        } else if (args[0] == 'assistConnectFailed') {
          args[len - 1].call(this, paramMock.paramNumberMock);
        } else {
          args[len - 1].call(this, paramMock.paramNumberMock);
        }
      }
    }
  }
}
export function mockAbilityParticleAbility() {
  global.systemplugin.ability.particleAbility = {
    startAbility: function (...args) {
      console.warn("ability.particleAbility.startAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    connectAbility: function (...args) {
      console.warn("ability.particleAbility.connectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    disconnectAbility: function (...args) {
      console.warn("ability.particleAbility.disconnectAbility interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    terminateSelf: function (...args) {
      console.warn("ability.particleAbility.terminateSelf interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    acquireDataAbilityHelper: function (...args) {
      console.warn("ability.particleAbility.acquireDataAbilityHelper interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return DataAbilityHelperMock;
    },
    startBackgroundRunning: function (...args) {
      console.warn("ability.particleAbility.startBackgroundRunning interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    cancelBackgroundRunning: function (...args) {
      console.warn("ability.particleAbility.cancelBackgroundRunning interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }
}
export function mockAbilityFormManager() {
  const FormInfoMock = {
    bundleName: "[PC Preview] unknow bundleName",
    moduleName: "[PC Preview] unknow moduleName",
    abilityName: "[PC Preview] unknow abilityName",
    name: "[PC Preview] unknow name",
    description: "[PC Preview] unknow description",
    type: "[PC Preview] unknow type",
    jsComponentName: "[PC Preview] unknow jsComponentName",
    colorMode: "[PC Preview] unknow colorMode",
    isDefault: "[PC Preview] unknow isDefault",
    updateEnabled: "[PC Preview] unknow updateEnabled",
    formVisibleNotify: "[PC Preview] unknow formVisibleNotify",
    relatedBundleName: "[PC Preview] unknow relatedBundleName",
    scheduledUpdateTime: "[PC Preview] unknow scheduledUpdateTime",
    formConfigAbility: "[PC Preview] unknow formConfigAbility",
    updateDuration: "[PC Preview] unknow updateDuration",
    defaultDimension: "[PC Preview] unknow defaultDimension",
    supportDimensions: "[PC Preview] unknow supportDimensions",
    customizeDatas: "[PC Preview] unknow customizeDatas",
    jsonObject: "[PC Preview] unknow jsonObject"
  }
  const WantMock = {
    deviceId: "[PC Preview] unknow deviceId",
    bundleName: "[PC Preview] unknow bundleName",
    abilityName: "[PC Preview] unknow abilityName",
    uri: "[PC Preview] unknow uri",
    type: "[PC Preview] unknow type",
    flag: "[PC Preview] unknow flag",
    action: "[PC Preview] unknow action",
    parameters: "[PC Preview] unknow parameters",
    entities: "[PC Preview] unknow entities"
  }
  const FormStateMock = {
    UNKNOWN: '-1',
    DEFAULT: '0',
    READY: '1'
  }
  const FormInfoArrayMock = [
    FormInfoMock
  ]
  const AcquireFormStateMock = {
    FormStateMock,
    WantMock
  }
  global.systemplugin.ability.formManager = {
    requestForm: function (...args) {
      console.warn("ability.formManager.requestForm interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    deleteForm: function (...args) {
      console.warn("ability.formManager.deleteForm interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    releaseForm: function (...args) {
      console.warn("ability.formManager.releaseForm interface mocked in the Previewer. How this interface works on the Previewer may" +
        " be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    notifyVisibleForms: function (...args) {
      console.warn("ability.formManager.notifyVisibleForms interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    notifyInvisibleForms: function (...args) {
      console.warn("ability.formManager.notifyInvisibleForms interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    enableFormsUpdate: function (...args) {
      console.warn("ability.formManager.enableFormsUpdate interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    disableFormsUpdate: function (...args) {
      console.warn("ability.formManager.disableFormsUpdate interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    isSystemReady: function (...args) {
      console.warn("ability.formManager.isSystemReady interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        })
      }
    },
    castTempForm: function (...args) {
      console.warn("ability.formManager.castTempForm interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    deleteInvalidForms: function (...args) {
      console.warn("ability.formManager.deleteInvalidForms interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    acquireFormState: function (...args) {
      console.warn("ability.formManager.acquireFormState interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AcquireFormStateMock)
      } else {
        return new Promise((resolve) => {
          resolve(AcquireFormStateMock)
        })
      }
    },
    on: function (...args) {
      console.warn("ability.formManager.on interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramStringMock)
      }
    },
    off: function (...args) {
      console.warn("ability.formManager.off interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.paramStringMock)
      }
    },
    getAllFormsInfo: function (...args) {
      console.warn("ability.formManager.getAllFormsInfo interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FormInfoArrayMock)
      } else {
        return new Promise((resolve) => {
          resolve(FormInfoArrayMock)
        })
      }
    },
    getFormsInfo: function (...args) {
      console.warn("ability.formManager.getFormsInfo interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FormInfoArrayMock)
      } else {
        return new Promise((resolve) => {
          resolve(FormInfoArrayMock)
        })
      }
    },
    updateForm: function (...args) {
      console.warn("ability.formManager.updateForm interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }
}
export function mockAbilityContinuationRegisterManager() {
  const ContinuationResultMock = {
    id: "[PC Preview] unknow id",
    type: "[PC Preview] unknow type",
    name: "[PC Preview] unknow name"
  }
  global.systemplugin.ability.continuationRegisterManager = {
    on: function (...args) {
      console.warn("ability.ContinuationRegisterManager.on interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'deviceConnect') {
          args[len - 1].call(this, ContinuationResultMock)
        } else {
          args[len - 1].call(this, paramMock.paramStringMock)
        }
      }
    },
    off: function (...args) {
      console.warn("ability.ContinuationRegisterManager.off interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] === 'deviceConnect') {
          args[len - 1].call(this, ContinuationResultMock)
        } else {
          args[len - 1].call(this, paramMock.paramStringMock)
        }
      }
    },
    register: function (...args) {
      console.warn("ability.ContinuationRegisterManager.register interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    unregister: function (...args) {
      console.warn("ability.ContinuationRegisterManager.unregister interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    },
    updateConnectStatus: function (...args) {
      console.warn("ability.ContinuationRegisterManager.updateConnectStatus interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    showDeviceList: function (...args) {
      console.warn("ability.ContinuationRegisterManager.showDeviceList interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        })
      }
    },
    disconnect: function (...args) {
      console.warn("ability.ContinuationRegisterManager.disconnect interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }
}
export function mockAbilityAbilityAgent() {
  global.systemplugin.ability.abilityAgent = {
    on: function (...args) {
      console.warn("ability.abilityAgent.on interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'message') {
          args[len - 1].call(this, paramMock.paramStringMock);
        } else {
          args[len - 1].call(this, paramMock.paramNumberMock);
        }
      }
    },
    off: function (...args) {
      console.warn("ability.abilityAgent.off interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'message') {
          args[len - 1].call(this, paramMock.paramStringMock)
        } else {
          args[len - 1].call(this, paramMock.paramNumberMock)
        }
      }
    },
    postMessage: function (...args) {
      console.warn("ability.abilityAgent.postMessage interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        })
      }
    }
  }
}
export function mockAbilityFormBindingData() {
  const FormBindingDataMock = {
    data: "[PC Preview] unknow data"
  }
  global.systemplugin.ability.formBindingData = {
    createFormBindingData: function (...args) {
      console.warn("ability.formBindingData.createFormBindingData interface mocked in the Previewer. How this interface works" +
        " on the Previewer may be different from that on a real device.")
      return FormBindingDataMock;
    }
  }
}
