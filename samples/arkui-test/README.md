## arkui-test

### 介绍
arkui-test 遍历 arkui 下各组件，测试各控件功能。该目录下存放测试 arkui-linux 的代码与 hap 包。从组件与公共属性两方面进行测试。

### CommonMethod
存放测试公共属性的源码，目录结构如下所示。
```
arkui-linux/samples/arkui-test/CommonMethod
├── 01_Style
├── 02_Event
└── 03_Other
```
生成的 hap 包存放在 `/hap/CommonMethod` 中。

### Component
存放测试组件的源码，目录结构如下所示。
```
arkui-linux/samples/arkui-test/Component
├── 01_BasicComponent
├── 02_Container
├── 03_Scroll
├── 04_FunctionalComponent
├── 05_StartAbility
├── 06_Window
├── 07_Canvas
├── 08_UserDefined
├── 09_Animation
├── 10_EventAndNotification
├── 11_File
└── 12_Network
```
生成的 hap 包存放在 `/hap/Component` 中。

### hap
该目录下包含测试组件 `Component` 与公共属性 `CommonMethod` 的 hap 包。

解压 hap 包使用如下命令, `xxx.hap` 为 hap 包的名称。

```
unzip xxx.hap
```

执行程序，使用如下命令，`xxx` 为 hap 包解压的路径。
```
./hap_executor xxx
```