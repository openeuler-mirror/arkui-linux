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
import { PixelMapMock } from "../multimedia"

export function mockBundleManager() {

  const ArrayNumberMock = ["[PC preview] unknown array number"]
  const ArrayStringMock = ["[PC preview] unknown array string"]
  const LauncherAbilityInfosMock = [
    {
      abilityInfo: {
        bundleName: "[PC preview] unknown bundle name",
        name: "[PC preview] unknown name",
        label: "[PC preview] unknown label",
        description: "[PC preview] unknown description",
        icon: "[PC preview] unknown icon",
        labelId: "[PC preview] unknown label id",
        descriptionId: "[PC preview] unknown description id",
        iconId: "[PC preview] unknown icon id",
        moduleName: "[PC preview] unknown module name",
        process: "[PC preview] unknown process",
        targetAbility: "[PC preview] unknown target ability",
        backgroundModes: "[PC preview] unknown background modes",
        isVisible: "[PC preview] unknown is visible",
        formEnabled: "[PC preview] unknown form enabled",
        type: "[PC preview] unknown type",
        subType: "[PC preview] unknown sub type",
        orientation: "[PC preview] unknown orientation",
        launchMode: "[PC preview] unknown launch mode",
        permissions: ["[PC preview] unknown permission"],
        deviceTypes: ["[PC preview] unknown device type"],
        deviceCapabilities: ["[PC preview] unknown device capability"],
        readPermission: "[PC preview] unknown read permission",
        writePermission: "[PC preview] unknown write permission",
        applicationInfo: {
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
        formEntity: "[PC preview] unknown form entity",
        minFormHeight: "[PC preview] unknown min form height",
        defaultFormHeight: "[PC preview] unknown default form height",
        minFormWidth: "[PC preview] unknown min form width",
        uri: "[PC preview] unknown uri",
        customizeData: {
          key: "[PC preview] unknown key",
          value: [
            {
              CustomizeData: {
                name: "[PC preview] unknown name",
                value: "[PC preview] unknown value",
              },
            },
            {
              CustomizeData: {
                name: "[PC preview] unknown name",
                value: "[PC preview] unknown value",
              },
            }
          ]
        },
      },
      elementName: {
        deviceId: "[PC preview] unknown device id",
        bundleName: "[PC preview] unknown bundle name",
        abilityName: "[PC preview] unknown ability name",
        uri: "[PC preview] unknown uri",
        shortName: "[PC preview] unknown short name",
      },
      userId: "[PC preview] unknown user id",
      installTime: "[PC preview] unknown install time",
    },
  ]
  const ModeleUsageRecordsMock = [
    {
      bundleName: "[PC preview] unknown bundle name",
      appLabelId: "[PC preview] unknown app label id",
      name: "[PC preview] unknown name",
      labelId: "[PC preview] unknown label id",
      descriptionId: "[PC preview] unknown description id",
      abilityName: "[PC preview] unknown ability name",
      abilityLabelId: "[PC preview] unknown ability label id",
      abilityDescriptionId: "[PC preview] unknown ability description id",
      abilityIconId: "[PC preview] unknown ability icon id",
      launchedCount: "[PC preview] unknown launched count",
      lastLaunchTime: "[PC preview] unknown last launch time",
      isRemoved: "[PC preview] unknown is removed",
      installationFreeSupported: "[PC preview] unknown installation free supported",
    },
  ]
  const ShortcutInfosMock = [
    {
      id: "[PC preview] unknown id",
      bundleName: "[PC preview] unknown bundle name",
      hostAbility: "[PC preview] unknown host ability",
      icon: "[PC preview] unknown icon",
      label: "[PC preview] unknown label",
      disableMessage: "[PC preview] unknown disable message",
      wants: [
        {
          targetBundle: "[PC preview] unknown target bundle",
          targetClass: "[PC preview] unknown target class",
        }],
      isStatic: "[PC preview] unknown is static",
      isHomeShortcut: "[PC preview] unknown is home shortcut",
      isEnabled: "[PC preview] unknown is enabled",
    },
  ]
  const WantMock = {
    deviceId: "[PC preview] unknown device id",
    bundleName: "[PC preview] unknown bundle name",
    abilityName: "[PC preview] unknown ability name",
    uri: "[PC preview] unknown uri",
    type: "[PC preview] unknown type",
    action: "[PC preview] unknown action",
    entities: "[PC preview] unknown entities",
    flags: "[PC preview] unknown flags",
  }
  const BundleInstallerMock = {}
  const BundleInfoMock = {
    name: "[PC preview] unknown name",
    type: "[PC preview] unknown type",
    appId: "[PC preview] unknown app id",
    uid: "[PC preview] unknown uid",
    installTime: "[PC preview] unknown install time",
    updateTime: "[PC preview] unknown up date time",
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
    },
    abilityInfo: [
      {
        bundleName: "[PC preview] unknown bundle name",
        name: "[PC preview] unknown name",
        label: "[PC preview] unknown label",
        description: "[PC preview] unknown description",
        icon: "[PC preview] unknown icon",
        labelId: "[PC preview] unknown label id",
        descriptionId: "[PC preview] unknown description id",
        iconId: "[PC preview] unknown icon id",
        moduleName: "[PC preview] unknown module name",
        process: "[PC preview] unknown process",
        targetAbility: "[PC preview] unknown target ability",
        backgroundModes: "[PC preview] unknown background modes",
        isVisible: "[PC preview] unknown is visible",
        formEnabled: "[PC preview] unknown form enabled",
        type: "[PC preview] unknown type",
        subType: "[PC preview] unknown sub type",
        orientation: "[PC preview] unknown orientation",
        launchMode: "[PC preview] unknown launch mode",
        permissions: ["[PC preview] unknown permission"],
        deviceTypes: ["[PC preview] unknown device type"],
        deviceCapabilities: ["[PC preview] unknown device capability"],
        readPermission: "[PC preview] unknown read permission",
        writePermission: "[PC preview] unknown write permission",
        applicationInfo: {
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
        formEntity: "[PC preview] unknown form entity",
        minFormHeight: "[PC preview] unknown min form height",
        defaultFormHeight: "[PC preview] unknown default form height",
        minFormWidth: "[PC preview] unknown min form width",
        defaultFormWidth: "[PC preview] unknown default form width",
        uri: "[PC preview] unknown uri",
        customizeData: {
          key: "[PC preview] unknown key",
          value: [
            {
              CustomizeData: {
                name: "[PC preview] unknown name",
                value: "[PC preview] unknown value",
              },
            },
            {
              CustomizeData: {
                name: "[PC preview] unknown name",
                value: "[PC preview] unknown value",
              },
            }
          ]
        },
      }
    ],
    reqPermissions: ["[PC preview] unknown repermission"],
    reqPermissionDetails: [
      {
        name: "[PC preview] unknown name",
        reason: "[PC preview] unknown reason",
        usedScene: {
          abilities: ["[PC preview] unknown ability"],
          when: "[PC preview] unknown when",
        }
      }
    ],
    vendor: "[PC preview] unknown vendor",
    versionCode: "[PC preview] unknown versionCode",
    versionName: "[PC preview] unknown versionName",
    compatibleVersion: "[PC preview] unknown compatibleVersion",
    targetVersion: "[PC preview] unknown targetVersion",
    isCompressNativeLibs: "[PC preview] unknown isCompressNativeLibs",
    hapModuleInfo: [
      {
        name: "[PC preview] unknown name",
        description: "[PC preview] unknown desciption",
        descriptionId: "[PC preview] unknown description id",
        icon: "[PC preview] unknown icon",
        label: "[PC preview] unknown label",
        labelId: "[PC preview] unknown label id",
        iconId: "[PC preview] unknown iconid",
        backgroundImg: "[PC preview] unknown back ground img",
        supportedModes: "[PC preview] unknown supported modes",
        reqCapabilities: ["[PC preview] unknown reqcapability"],
        deviceTypes: ["[PC preview] unknown device type"],
        abilityInfo: [
          {
            bundleName: "[PC preview] unknown bundle name",
            name: "[PC preview] unknown name",
            label: "[PC preview] unknown label",
            description: "[PC preview] unknown description",
            icon: "[PC preview] unknown icon",
            labelId: "[PC preview] unknown label id",
            descriptionId: "[PC preview] unknown description id",
            iconId: "[PC preview] unknown icon id",
            moduleName: "[PC preview] unknown module name",
            process: "[PC preview] unknown process",
            targetAbility: "[PC preview] unknown target ability",
            backgroundModes: "[PC preview] unknown back ground modes",
            isVisible: "[PC preview] unknown is visible",
            formEnabled: "[PC preview] unknown form enabled",
            type: "[PC preview] unknown bundle.AbilityType",
            subType: " [PC preview] unknown bundle.AbilitySubType",
            orientation: "[PC preview] unknown bundle.DisplayOrientation",
            launchMode: " [PC preview] unknown bundle.LaunchMode",
            permissions: ["[PC preview] unknown permission"],
            deviceTypes: ["[PC preview] unknown device type"],
            deviceCapabilities: ["[PC preview] unknown device capability "],
            readPermission: "[PC preview] unknown read permission",
            writePermission: "[PC preview] unknown write permission",
            applicationInfo: {
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
            formEntity: "[PC preview] unknown form entity",
            minFormHeight: "[PC preview] unknown min form height",
            defaultFormHeight: "[PC preview] unknown default form height",
            minFormWidth: "[PC preview] unknown min form width",
            defaultFormWidth: "[PC preview] unknown default form width",
            uri: "[PC preview] unknown uri",
            customizeData: {
              key: "[PC preview] unknown key",
              value: [
                {
                  CustomizeData: {
                    name: "[PC preview] unknown name",
                    value: "[PC preview] unknown value",
                  },
                },
                {
                  CustomizeData: {
                    name: "[PC preview] unknown name",
                    value: "[PC preview] unknown value",
                  },
                }
              ]
            },
          }
        ],
        moduleName: "[PC preview] unknown module name",
        mainAbilityName: "[PC preview] unknown main ability name",
        installationFree: "[PC preview] unknown installation free",
      }
    ],
    entryModuleName: "[PC preview] unknown entry module name",
    cpuAbi: "[PC preview] unknown cpu abi",
    isSilentInstallation: "[PC preview] unknown is silent installation",
    minCompatibleVersionCode: "[PC preview] unknown min compatible version code",
    entryInstallationFree: "[PC preview] unknown entry installation free",
  }
  const PermissionDefMock = {
    name: "[PC preview] unknown name",
    permissionFlags: "[PC preview] unknown permission flags",
    grantMode: "[PC preview] unknown grant mode",
    availableScope: "[PC preview] unknown available scope",
    labelRes: "[PC preview] unknown label res",
    descriptionRes: "[PC preview] unknown description res",
    group: "[PC preview] unknown group",
    usageInfo: "[PC preview] unknown usage info",
    reminderDesc: "[PC preview] unknown reminder desc",
    reminderIcon: "[PC preview] unknown reminder icon"
  }
  const PermissionDefsMock = [
    {
      name: "[PC preview] unknown name",
      permissionFlags: "[PC preview] unknown permission flags",
      grantMode: "[PC preview] unknown grant mode",
      availableScope: "[PC preview] unknown available scope",
      labelRes: "[PC preview] unknown label res",
      descriptionRes: "[PC preview] unknown description res",
      group: "[PC preview] unknown group",
      usageInfo: "[PC preview] unknown usage info",
      reminderDesc: "[PC preview] unknown reminder desc",
      reminderIcon: "[PC preview] unknown reminder icon"
    }
  ]
  const BundlePackInfoMock = {
    packages: [
      {
        deviceType: ["[PC preview] unknown device type"],
        name: "[PC preview] unknown name",
        moduleType: "[PC preview] unknown module type",
        deliveryWithInstall: "[PC preview] unknown deliver with install",
      }
    ],
    summary: {
      app: {
        bundleName: "[PC preview] unknown bundle name",
        version: {
          minCompatibleVersionCode: "[PC preview] unknown min compatible version code",
          name: "[PC preview] unknown name",
          code: " [PC preview] unknown code",
        }
      },
      modules: [
        {
          apiVersion: {
            releaseType: "[PC preview] unknown release type",
            compatible: "[PC preview] unknown compatible",
            target: "[PC preview] unknown target",
          },
          deviceType: ["[PC preview] unknown device type"],
          distro: {
            deliveryWithInstall: "[PC preview] unknown deliver with install",
            installationFree: "[PC preview] unknown installation free",
            moduleName: "[PC preview] unknown module name",
            moduleType: "[PC preview] unknown module type",
            mainAbility: "[PC preview] unknown main ability",
          },
          abilities: [
            {
              name: "[PC preview] unknown name",
              label: "[PC preview] unknown label",
              visible: '[PC preview] unknown visible',
              forms: [
                {
                  name: "[PC preview] unknown name",
                  type: "[PC preview] unknown type",
                  updateEnabled: "[PC preview] unknown update enabled",
                  scheduledUpateTime: "[PC preview] unknown scheduled updte time",
                  updateDuration: "[PC preview] unknown update duration",
                  supportDimensions: ["[PC preview] unknown support dimension"],
                  defaultDimension: "[PC preview] unknown default dimension",
                }
              ]
            }
          ]
        }
      ]
    },
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

  const AbilityInfosMock = [
    {
      bundleName: "[PC preview] unknown bundle name",
      name: "[PC preview] unknown name",
      label: "[PC preview] unknown label",
      description: "[PC preview] unknown descrption",
      icon: "[PC preview] unknown icon",
      labelId: "[PC preview] unknown label id",
      descriptionId: "[PC preview] unknown description id",
      iconId: "[PC preview] unknown icon id",
      moduleName: "[PC preview] unknown module name",
      process: "[PC preview] unknown process",
      targetAbility: "[PC preview] unknown target ability",
      backgroundModes: "[PC preview] unknown background modes ",
      isVisible: "[PC preview] unknown is visible",
      formEnabled: "[PC preview] unknown form enabled",
      type: "[PC preview] unknown bundle.AbilityType",
      subType: "[PC preview] unknown bundle.AbilitySubType",
      orientation: "[PC preview] unknown bundle.DisplayOrientation",
      launchMode: "[PC preview] unknown bundle.LaunchMode",
      permissions: ["[PC preview] unknown  permission"],
      deviceTypes: ["[PC preview] unknown device type"],
      deviceCapabilities: ["[PC preview] unknown device capability"],
      readPermission: "[PC preview] unknown read permission",
      writePermission: "[PC preview] unknown write permission",
      applicationInfo: {
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
      formEntity: "[PC preview] unknown form entitty",
      minFormHeight: "[PC preview] unknown minForm Height",
      defaultFormHeight: "[PC preview] unknown default Form Height",
      minFormWidth: "[PC preview] unknown default min Form Width",
      defaultFormWidth: "[PC preview] unknown default form width",
      uri: "[PC preview] unknown uri",
      customizeData: {
        key: "[PC preview] unknown key",
        value: [
          {
            CustomizeData: {
              name: "[PC preview] unknown name",
              value: "[PC preview] unknown value",
            },
          },
          {
            CustomizeData: {
              name: "[PC preview] unknown name",
              value: "[PC preview] unknown value",
            },
          }
        ]
      },
    }
  ]
  const AbilityInfoMock = {
    bundleName: "[PC preview] unknown bundle name",
    name: "[PC preview] unknown name",
    label: "[PC preview] unknown label",
    description: "[PC preview] unknown descrption",
    icon: "[PC preview] unknown icon",
    labelId: "[PC preview] unknown label id",
    descriptionId: "[PC preview] unknown description id",
    iconId: "[PC preview] unknown icon id",
    moduleName: "[PC preview] unknown module name",
    process: "[PC preview] unknown process",
    targetAbility: "[PC preview] unknown target ability",
    backgroundModes: "[PC preview] unknown background modes ",
    isVisible: "[PC preview] unknown is visible",
    formEnabled: "[PC preview] unknown form enabled",
    type: "[PC preview] unknown bundle.AbilityType",
    subType: "[PC preview] unknown bundle.AbilitySubType",
    orientation: "[PC preview] unknown bundle.DisplayOrientation",
    launchMode: "[PC preview] unknown bundle.LaunchMode",
    permissions: ["[PC preview] unknown  permission"],
    deviceTypes: ["[PC preview] unknown device type"],
    deviceCapabilities: ["[PC preview] unknown device capability"],
    readPermission: "[PC preview] unknown read permission",
    writePermission: "[PC preview] unknown write permission",
    applicationInfo: {
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
    formEntity: "[PC preview] unknown form entitty",
    minFormHeight: "[PC preview] unknown minForm Height",
    defaultFormHeight: "[PC preview] unknown default Form Height",
    minFormWidth: "[PC preview] unknown default min Form Width",
    defaultFormWidth: "[PC preview] unknown default form width",
    uri: "[PC preview] unknown uri",
    customizeData: {
      key: "[PC preview] unknown key",
      value: [
        {
          CustomizeData: {
            name: "[PC preview] unknown name",
            value: "[PC preview] unknown value",
          },
        },
        {
          CustomizeData: {
            name: "[PC preview] unknown name",
            value: "[PC preview] unknown value",
          },
        }
      ]
    },
  }
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

  const BundleInfosMock = [
    {
      name: "[PC preview] unknown name",
      type: "[PC preview] unknown type",
      appId: "[PC preview] unknown app id",
      uid: "[PC preview] unknown uid",
      installTime: "[PC preview] unknown install time",
      updateTime: "[PC preview] unknown up date time",
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
      },
      abilityInfo: [
        {
          bundleName: "[PC preview] unknown bundle name",
          name: "[PC preview] unknown name",
          label: "[PC preview] unknown label",
          description: "[PC preview] unknown description",
          icon: "[PC preview] unknown icon",
          labelId: "[PC preview] unknown label id",
          descriptionId: "[PC preview] unknown description id",
          iconId: "[PC preview] unknown icon id",
          moduleName: "[PC preview] unknown module name",
          process: "[PC preview] unknown process",
          targetAbility: "[PC preview] unknown target ability",
          backgroundModes: "[PC preview] unknown background modes",
          isVisible: "[PC preview] unknown is visible",
          formEnabled: "[PC preview] unknown form enabled",
          type: "[PC preview] unknown type",
          subType: "[PC preview] unknown sub type",
          orientation: "[PC preview] unknown orientation",
          launchMode: "[PC preview] unknown launch mode",
          permissions: ["[PC preview] unknown permission"],
          deviceTypes: ["[PC preview] unknown device type"],
          deviceCapabilities: ["[PC preview] unknown device capability"],
          readPermission: "[PC preview] unknown read permission",
          writePermission: "[PC preview] unknown write permission",
          applicationInfo: {
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
          formEntity: "[PC preview] unknown form entity",
          minFormHeight: "[PC preview] unknown min form height",
          defaultFormHeight: "[PC preview] unknown default form height",
          minFormWidth: "[PC preview] unknown min form width",
          defaultFormWidth: "[PC preview] unknown default form width",
          uri: "[PC preview] unknown uri",
          customizeData: {
            key: "[PC preview] unknown key",
            value: [
              {
                CustomizeData: {
                  name: "[PC preview] unknown name",
                  value: "[PC preview] unknown value",
                },
              },
              {
                CustomizeData: {
                  name: "[PC preview] unknown name",
                  value: "[PC preview] unknown value",
                },
              }
            ]
          },
        }
      ],
      reqPermissions: ["[PC preview] unknown repermission"],
      reqPermissionDetails: [
        {
          name: "[PC preview] unknown name",
          reason: "[PC preview] unknown reason",
          usedScene: {
            abilities: ["[PC preview] unknown ability"],
            when: "[PC preview] unknown when",
          }
        }
      ],
      vendor: "[PC preview] unknown vendor",
      versionCode: "[PC preview] unknown versionCode",
      versionName: "[PC preview] unknown versionName",
      compatibleVersion: "[PC preview] unknown compatibleVersion",
      targetVersion: "[PC preview] unknown targetVersion",
      isCompressNativeLibs: "[PC preview] unknown isCompressNativeLibs",
      hapModuleInfo: [
        {
          name: "[PC preview] unknown name",
          description: "[PC preview] unknown desciption",
          descriptionId: "[PC preview] unknown description id",
          icon: "[PC preview] unknown icon",
          label: "[PC preview] unknown label",
          labelId: "[PC preview] unknown label id",
          iconId: "[PC preview] unknown iconid",
          backgroundImg: "[PC preview] unknown back ground img",
          supportedModes: "[PC preview] unknown supported modes",
          reqCapabilities: ["[PC preview] unknown reqcapability"],
          deviceTypes: ["[PC preview] unknown device type"],
          abilityInfo: [
            {
              bundleName: "[PC preview] unknown bundle name",
              name: "[PC preview] unknown name",
              label: "[PC preview] unknown label",
              description: "[PC preview] unknown description",
              icon: "[PC preview] unknown icon",
              labelId: "[PC preview] unknown label id",
              descriptionId: "[PC preview] unknown description id",
              iconId: "[PC preview] unknown icon id",
              moduleName: "[PC preview] unknown module name",
              process: "[PC preview] unknown process",
              targetAbility: "[PC preview] unknown target ability",
              backgroundModes: "[PC preview] unknown back ground modes",
              isVisible: "[PC preview] unknown is visible",
              formEnabled: "[PC preview] unknown form enabled",
              type: "[PC preview] unknown bundle.AbilityType",
              subType: " [PC preview] unknown bundle.AbilitySubType",
              orientation: "[PC preview] unknown bundle.DisplayOrientation",
              launchMode: " [PC preview] unknown bundle.LaunchMode",
              permissions: ["[PC preview] unknown permission"],
              deviceTypes: ["[PC preview] unknown device type"],
              deviceCapabilities: ["[PC preview] unknown device capability "],
              readPermission: "[PC preview] unknown read permission",
              writePermission: "[PC preview] unknown write permission",
              applicationInfo: {
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
              formEntity: "[PC preview] unknown form entity",
              minFormHeight: "[PC preview] unknown min form height",
              defaultFormHeight: "[PC preview] unknown default form height",
              minFormWidth: "[PC preview] unknown min form width",
              defaultFormWidth: "[PC preview] unknown default form width",
              uri: "[PC preview] unknown uri",
              customizeData: {
                key: "[PC preview] unknown key",
                value: [
                  {
                    CustomizeData: {
                      name: "[PC preview] unknown name",
                      value: "[PC preview] unknown value",
                    },
                  },
                  {
                    CustomizeData: {
                      name: "[PC preview] unknown name",
                      value: "[PC preview] unknown value",
                    },
                  }
                ]
              },
            }
          ],
          moduleName: "[PC preview] unknown module name",
          mainAbilityName: "[PC preview] unknown main ability name",
          installationFree: "[PC preview] unknown installation free",
        }
      ],
      entryModuleName: "[PC preview] unknown entry module name",
      cpuAbi: "[PC preview] unknown cpu abi",
      isSilentInstallation: "[PC preview] unknown is silent installation",
      minCompatibleVersionCode: "[PC preview] unknown min compatible version code",
      entryInstallationFree: "[PC preview] unknown entry installation free"
    }
  ]
  const BundleOptionsMock = {
    userId: "[PC preview] unknown user id",
    networkId: "[PC preview] unknown network id",
  }
  const LauncherAbilityInfoMock = {
    abilityInfo: {
      bundleName: "[PC preview] unknown bundle name",
      name: "[PC preview] unknown name",
      label: "[PC preview] unknown label",
      description: "[PC preview] unknown description",
      icon: "[PC preview] unknown icon",
      labelId: "[PC preview] unknown label id",
      descriptionId: "[PC preview] unknown description id",
      iconId: "[PC preview] unknown icon id",
      moduleName: "[PC preview] unknown module name",
      process: "[PC preview] unknown process",
      targetAbility: "[PC preview] unknown target ability",
      backgroundModes: "[PC preview] unknown background modes",
      isVisible: "[PC preview] unknown is visible",
      formEnabled: "[PC preview] unknown form enabled",
      type: "[PC preview] unknown type",
      subType: "[PC preview] unknown sub type",
      orientation: "[PC preview] unknown orientation",
      launchMode: "[PC preview] unknown launch mode",
      permissions: ["[PC preview] unknown permission"],
      deviceTypes: ["[PC preview] unknown device type"],
      deviceCapabilities: ["[PC preview] unknown device capability"],
      readPermission: "[PC preview] unknown read permission",
      writePermission: "[PC preview] unknown write permission",
      applicationInfo: {
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
      formEntity: "[PC preview] unknown form entity",
      minFormHeight: "[PC preview] unknown min form height",
      defaultFormHeight: "[PC preview] unknown default form height",
      minFormWidth: "[PC preview] unknown min form width",
      uri: "[PC preview] unknown uri",
      customizeData: {
        key: "[PC preview] unknown key",
        value: [
          {
            CustomizeData: {
              name: "[PC preview] unknown name",
              value: "[PC preview] unknown value",
            },
          },
          {
            CustomizeData: {
              name: "[PC preview] unknown name",
              value: "[PC preview] unknown value",
            },
          }
        ]
      },
    },
    elementName: {
      deviceId: "[PC preview] unknown device id",
      bundleName: "[PC preview] unknown bundle name",
      abilityName: "[PC preview] unknown ability name",
      uri: "[PC preview] unknown uri",
      shortName: "[PC preview] unknown short name",
    },
    userId: "[PC preview] unknown user id",
    installTime: "[PC preview] unknown install time",
  }

const ExtensionAbilityInfoMock = [
  {
    bundleName: "[PC preview] unknown bundle name",
    moduleName: "[PC preview] unknown module name",
    name: "[PC preview] unknown name",
    labelId: "[PC preview] unknown label id",
    descriptionId: "[PC preview] unknown description id",
    iconId: "[PC preview] unknown icon id",
    isVisible: "[PC preview] unknown is visible",
    extensionAbilityType: "[PC preview] unknown extension abilityType",
    permissions: "[PC preview] unknown permissions",
    applicationInfo: "[PC preview] unknown application info",
    metadata: "[PC preview] unknown metadata",
    enabled: "[PC preview] unknown enabled",
    readPermission: "[PC preview] unknown read permission",
    writePermission: "[PC preview] unknown write permission",
  }
]

  const ModuleUpdateFlagMock = {
    FLAG_MODULE_UPGRADE_CHECK: 0,
    FLAG_MODULE_UPGRADE_INSTALL: 1,
    FLAG_MODULE_UPGRADE_INSTALL_WITH_CONFIG_WINDOWS: 2,
  }
  const BundleFlagMock = {
    GET_BUNDLE_DEFAULT: 0x00000000,
    GET_BUNDLE_WITH_ABILITIES: 0x00000001,
    GET_ABILITY_INFO_WITH_PERMISSION: 0x00000002,
    GET_ABILITY_INFO_WITH_APPLICATION: 0x00000004,
    GET_APPLICATION_INFO_WITH_PERMISSION: 0x00000008,
    GET_BUNDLE_WITH_REQUESTED_PERMISSION: 0x00000010,
    GET_ALL_APPLICATION_INFO: 0xFFFF0000,
  }
  const ColorModeMock = {
    AUTO_MODE: -1,
    DARK_MODE: 0,
    LIGHT_MODE: 1,
  }
  const ModuleRemoveFlagMock = {
    FLAG_MODULE_NOT_USED_BY_FORM: 0,
    FLAG_MODULE_USED_BY_FORM: 1,
    FLAG_MODULE_NOT_USED_BY_SHORTCUT: 2,
    FLAG_MODULE_USED_BY_SHORTCUT: 3,
  }
  const SignatureCompareResultMock = {
    SIGNATURE_MATCHED: 0,
    SIGNATURE_NOT_MATCHED: 1,
    SIGNATURE_UNKNOWN_BUNDLE: 2,
  }
  const ShortcutExistenceMock = {
    SHORTCUT_EXISTENCE_EXISTS: 0,
    SHORTCUT_EXISTENCE_NOT_EXISTS: 1,
    SHORTCUT_EXISTENCE_UNKNOWN: 2,
  }
  const QueryShortCutFlagMock = {
    QUERY_SHORYCUT_HOME: 0,
  }
  const GrantStatusMock = {
    PERMISSION_DENIED: -1,
    PERMISSION_GRANTED: 0,
  }
  const AbilityTypeMock = {
    UNKNOWN: 0,
    PAGE: 1,
    SERVICE: 2,
    DATA: 3
  }
  const AbilitySubTypeMock = {
    UNSPECIFIED: 0,
    CA: 1,
  }
  const DisplayOrientationMock = {
    UNSPECIFIED: 0,
    LANDSCAPE: 1,
    PORTRAIT: 2,
    FOLLOW_RECENT: 3
  }
  const LaunchModeMock = {
    SINGLETON: 0,
    STANDARD: 1,
  }
  const InstallErrorCodeMock = {
    SUCCESS: 0,
    STATUS_INSTALL_FAILURE: 1,
    STATUS_INSTALL_FAILURE_ABORTED: 2,
    STATUS_INSTALL_FAILURE_INVALID: 3,
    STATUS_INSTALL_FAILURE_CONFLICT: 4,
    STATUS_INSTALL_FAILURE_STORAGE: 5,
    STATUS_INSTALL_FAILURE_INCOMPATIBLE: 6,
    STATUS_UNINSTALL_FAILURE: 7,
    STATUS_UNINSTALL_FAILURE_BLOCKE: 8,
    STATUS_UNINSTALL_FAILURE_ABORTED: 9,
    STATUS_UNINSTALL_FAILURE_CONFLICT: 10,
    STATUS_INSTALL_FAILURE_DOWNLOAD_TIMEOUT: 0x0B,
    STATUS_INSTALL_FAILURE_DOWNLOAD_FAILED: 0x0C,
    STATUS_ABILITY_NOT_FOUND: 0x40,
    STATUS_BMS_SERVICE_ERROR: 0x41
  }
  const BundleErrorMock = {
    REMOTE_EXCEPTION: 0,
    SECURITY_EXCEPTION: 1
  }

  global.ohosplugin.bundle = {
    getBundleInfo: function (...args) {
      console.warn("bundle.getBundleInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(BundleInfoMock)
        });
      }
    },
    getBundleInstaller: function (...args) {
      console.warn("bundle.getBundleInstaller interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleInstallerMock)
      } else {
        return new Promise((resolve) => {
          resolve(BundleInstallerMock)
        });
      }
    },
    getApplicationInfo: function (...args) {
      console.warn("bundle.getApplicationInfo interface mocked in the Previewer. How this interface works on the" +
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
    queryAbilityByWant: function (...args) {
      console.warn("bundle.queryAbilityByWant interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, AbilityInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(AbilityInfosMock)
        });
      }
    },
    getAllBundleInfo: function (...args) {
      console.warn("bundle.getAllBundleInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(BundleInfosMock)
        });
      }
    },
    getBundlesForUid: function (...args) {
      console.warn("bundle.getBundlesForUid interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ArrayStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(ArrayStringMock)
        });
      }
    },
    getAllApplicationInfo: function (...args) {
      console.warn("bundle.getAllApplicationInfo interface mocked in the Previewer. How this interface works on the" +
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
    getSystemAvailableCapabilities: function (...args) {
      console.warn("bundle.getSystemAvailableCapabilities interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ArrayStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(ArrayStringMock)
        });
      }
    },
    hasSystemCapability: function (...args) {
      console.warn("bundle.hasSystemCapability interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    getBundleGids: function (...args) {
      console.warn("bundle.getBundleGids interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ArrayNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(ArrayNumberMock)
        });
      }
    },
    checkPublicKeys: function (...args) {
      console.warn("bundle.checkPublicKeys interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SignatureCompareResultMock.SIGNATURE_MATCHED)
      } else {
        return new Promise((resolve) => {
          resolve(SignatureCompareResultMock.SIGNATURE_MATCHED)
        });
      }
    },
    getNameForUid: function (...args) {
      console.warn("bundle.getNameForUid interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        });
      }
    },
    getBundleArchiveInfo: function (...args) {
      console.warn("bundle.getBundleArchiveInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundleInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(BundleInfoMock)
        });
      }
    },
    isSafeMode: function (...args) {
      console.warn("bundle.isSafeMode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    getLaunchWantForBundle: function (...args) {
      console.warn("bundle.getLaunchWantForBundle interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, WantMock)
      } else {
        return new Promise((resolve) => {
          resolve(WantMock)
        });
      }
    },
    setApplicationEnabled: function (...args) {
      console.warn("bundle.setApplicationEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    setAbilityEnabled: function (...args) {
      console.warn("bundle.setAbilityEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    isApplicationEnabled: function (...args) {
      console.warn("bundle.isApplicationEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    isAbilityEnabled: function (...args) {
      console.warn("bundle.isAbilityEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    cleanBundleCacheFiles: function (...args) {
      console.warn("bundle.cleanBundleCacheFiles interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    startShortcut: function (...args) {
      console.warn("bundle.startShortcut interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    getAppType: function (...args) {
      console.warn("bundle.getAppType interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        });
      }
    },
    isShortcutExist: function (...args) {
      console.warn("bundle.isShortcutExist interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ShortcutExistenceMock.SHORTCUT_EXISTENCE_EXISTS)
      } else {
        return new Promise((resolve) => {
          resolve(ShortcutExistenceMock.SHORTCUT_EXISTENCE_EXISTS)
        });
      }
    },
    isHomeShortcutSupported: function (...args) {
      console.warn("bundle.isHomeShortcutSupported interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    addHomeShortcut: function (...args) {
      console.warn("bundle.addHomeShortcut interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    updateShortcuts: function (...args) {
      console.warn("bundle.updateShortcuts interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    disableHomeShortcuts: function (...args) {
      console.warn("bundle.disableHomeShortcuts interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    enableHomeShortcuts: function (...args) {
      console.warn("bundle.enableHomeShortcuts interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    getAllHomeShortcutInfo: function (...args) {
      console.warn("bundle.getAllHomeShortcutInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ShortcutInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(ShortcutInfosMock)
        });
      }
    },
    getAppsGrantedPermissions: function (...args) {
      console.warn("bundle.getAppsGrantedPermissions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, ArrayStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(ArrayStringMock)
        });
      }
    },
    getAbilityIcon: function (...args) {
      console.warn("bundle.getAbilityIcon interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PixelMapMock)
      } else {
        return new Promise((resolve) => {
          resolve(PixelMapMock)
        });
      }
    },
    getAbilityLabel: function (...args) {
      console.warn("bundle.getAbilityLabel interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        });
      }
    },
    getClearUserDataFlag: function (...args) {
      console.warn("bundle.getClearUserDataFlag interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    setClearUserDataFlag: function (...args) {
      console.warn("bundle.setClearUserDataFlag interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    getBundlePackInfo: function (...args) {
      console.warn("bundle.getBundlePackInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, BundlePackInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(BundlePackInfoMock)
        });
      }
    },
    getAbilityList: function (...args) {
      console.warn("bundle.getAbilityList interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, LauncherAbilityInfosMock)
      } else {
        return new Promise((resolve) => {
          resolve(LauncherAbilityInfosMock)
        });
      }
    },
    getAbilityInfo: function (...args) {
      console.warn("bundle.getAbilityInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[0] === 'string') {
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, AbilityInfoMock)
        } else {
          return new Promise((resolve) => {
            resolve(AbilityInfoMock)
          });
        }
      } else if (typeof args[0] === 'object') {
        if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, LauncherAbilityInfoMock)
        } else {
          return new Promise((resolve) => {
            resolve(LauncherAbilityInfoMock)
          });
        }
      }
    },
    isBundleEnabled: function (...args) {
      console.warn("bundle.isBundleEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    getPermissionDef: function (...args) {
      console.warn("bundle.getPermissionDef interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PermissionDefMock)
      } else {
        return new Promise((resolve) => {
          resolve(PermissionDefMock)
        });
      }
    },
    getPermissionGroupDef: function (...args) {
      console.warn("bundle.getPermissionGroupDef interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PermissionDefMock)
      } else {
        return new Promise((resolve) => {
          resolve(PermissionDefMock)
        });
      }
    },
    getAllPermissionGroupDefs: function (...args) {
      console.warn("bundle.getAllPermissionGroupDefs interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PermissionDefsMock)
      } else {
        return new Promise((resolve) => {
          resolve(PermissionDefsMock)
        });
      }
    },
    getPermissionDefByGroup: function (...args) {
      console.warn("bundle.getPermissionDefByGroup interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PermissionDefsMock)
      } else {
        return new Promise((resolve) => {
          resolve(PermissionDefsMock)
        });
      }
    },
    getModuleUsageRecords: function (...args) {
      console.warn("bundle.getModuleUsageRecords interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this,paramMock.businessErrorMock,ModeleUsageRecordsMock)
      } else {
        return new Promise((resolve) => {
          resolve(ModeleUsageRecordsMock)
        });
      }
    },
    queryExtensionAbilityInfosByWant: function (...args) {
      console.warn("bundle.queryExtensionAbilityInfosByWant interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this,paramMock.businessErrorMock,ExtensionAbilityInfoMock)
      } else {
        return new Promise((resolve) => {
          resolve(ExtensionAbilityInfoMock)
        });
      }
    }
  }
}
