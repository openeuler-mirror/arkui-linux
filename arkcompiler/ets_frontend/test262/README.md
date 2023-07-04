## File overview:
```
es5_tests.txt:  This file contains a list of ES5 test cases. If useful cases are found missing, you can add them as needed.
es2015_tests.txt:  This file contains a full list of use cases of ES2015 except those filtered out with'es6id'. If useful cases are found missing, you can add them as needed.
es2021_tests.txt:  This file contains a full list of use cases of ES2021 except those filtered out with'es6id'. If useful cases are found missing, you can add them as needed.
intl_tests.txt：  This file contains a list of internationalization test cases. If you find useful cases missing, you can add them as needed.
skip_tests.json: This file contains a list of use cases that do not meet the requirements. If useful cases are found missing, you can add them according to the specified format.
intl_skip_tests.json: This file contains a list of non-compliant internationalization use cases. If useful cases are found to be missing, they can be added in the specified format.
```

## 1. Compile ts2abc and ark_js_vm project
```
./build.sh --product-name hispark_taurus_standard --build-target ark_js_vm --build-target ark_ts2abc_build
```

## 2 Run test cases

### 2.1 Options
```
usage: run_test262.py [-h] [--dir DIR] [--file FILE] [--mode [{1,2,3}]]
                      [--es51] [--es2015 [{all,only}]] [--esnext]
                      [--engine FILE] [--babel] [--timeout TIMEOUT]
                      [--threads THREADS] [--hostArgs HOSTARGS]
                      [--ark-aot]
                      [--ark-aot-tool ARK_AOT_TOOL]
                      [--ark-tool ARK_TOOL]
                      [--ark-frontend-tool ARK_FRONTEND_TOOL]
                      [--libs-dir LIBS_DIR]
                      [--ark-frontend [{ts2panda,es2panda}]]

optional arguments:
  -h, --help            Show this help message and exit
  --dir DIR             Directory to test
  --file FILE           File to test
  --mode [{1,2,3}]      selection information as: 1: only default 2:
                        only strict mode 3: both default and strict mode
  --es51                Run test262 ES5.1 version
  --es2015 [{all,only}]
                        Run test262 - ES2015. all: Contains all use cases for
                        ES5 and ES2015, only: Only include use cases for
                        ES2015
  --esnext              Run test262 - ES.next.
  --engine FILE         Other engine binarys to run tests with
                        (as:d8,hermes,jsc,qjs...)
  --babel               Whether to use Babel conversion
  --timeout TIMEOUT     Set a custom test timeout in milliseconds !!!
  --threads THREADS     Run this many tests in parallel. Note that the browser
                        runners don't work great with t > 1.
  --hostArgs HOSTARGS   command-line arguments to pass to eshost host
  --ark-aot             Run test262 with aot
  --ark-aot-tool ARK_AOT_TOOL
                        ark's aot tool
  --ark-tool ARK_TOOL   ark's binary tool
  --ark-frontend-tool ARK_FRONTEND_TOOL
                        ark frontend conversion tool
  --libs-dir LIBS_DIR   The path collection of dependent so, divided by':'
  --ark-frontend [{ts2panda,es2panda}]
                        Choose one of them
```

### 2.2 Run all the test cases

```
python3 test262/run_test262.py
```

### 2.3 Run `es51` related test cases

```python
python3 test262/run_test262.py --es51
```

After the execution finished, a directory named `test_es51` is created under directory `test262/data` , which is used to store all `es51` cases.

### 2.4 Run `es2015` related test cases
#### 2.4.1 only include use cases for ES2015
```python
python3 test262/run_test262.py --es2015 only
```
#### 2.4.2  Contains all use cases for ES5 and ES2015
```python
python3 test262/run_test262.py --es2015 all
```

### 2.5 Run single test case

```python
python3 test262/run_test262.py --file test262/data/test_es5/language/statements/break/12.8-1.js
```

### 2.6 Run all the test cases under specified directory

```python
python3 test262/run_test262.py --dir test262/data/test_es5/language/statements
```

### 2.7 Run single test case with other engines. Take d8 as an example

```python
 python3 test262/run_test262.py --engine="/home/share/v8-code/v8/out.gn/x64.release/d8" --file test262/data/test_es5/language/statements/break/12.8-1.js
```
### 2.8 Run single test case with `babel` conversion
```
python3 test262/run_test262.py  --babel --file test262/data/test_es5/language/statements/break/12.8-1.js
```

### 2.9 Get test result

take the following code as an example:

```shell
zgy@lfgphicprd23154:/home/share/OpenHarmony2.0_20210604/ark/ts2abc$ python3 -B test262/run_test262.py --file test262/data/test_es51/language/statements/break/12.8-1.js

Wait a moment..........

07-30 16:56:03.857383 D:>>>       command: npm install | dir: /home/share/OpenHarmony2.0_20210604/out/ohos-arm-release/clang_x64/arkcompiler/ets_frontend/build/src/..
npm WARN ts2panda@1.0.0 No description
npm WARN ts2panda@1.0.0 No repository field.
npm WARN ts2panda@1.0.0 No license field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

up to date in 2.225s

28 packages are looking for funding
  run `npm fund` for details

07-30 16:56:06.746184 D:>>>       command: npm install | dir: test262/eshost
up to date in 1.446s

1 package is looking for funding
  run `npm fund` for details

07-30 16:56:08.767037 D:>>>       command: npm install | dir: test262/harness
up to date in 2.412s
07-30 16:56:11.836409 D:>>>       command: git checkout -- . | dir: test262/data
07-30 16:56:12.012115 D:>>>       command: git checkout 9ca13b12728b7e0089c7eb03fa2bd17f8abe297f | dir: test262/data
HEAD is now at 9ca13b1272 Fix typo in BigIntArray property descriptor test
07-30 16:56:12.275768 D:>>>       command: git checkout -- . | dir: test262/eshost
07-30 16:56:12.280134 D:>>>       command: git apply ../eshost.patch | dir: test262/eshost
07-30 16:56:12.283263 D:>>>       command: git checkout -- . | dir: test262/harness
07-30 16:56:12.288134 D:>>>       command: git apply ../harness.patch | dir: test262/harness
Test command:
        node
        test262/harness/bin/run.js
        --hostType=panda
        --hostPath=python3
        --hostArgs='-B test262/run_sunspider.py --ark-tool=/home/share/OpenHarmony2.0_20210604/out/ohos-arm-release/clang_x64/arkcompiler/ets_runtime/ark_js_vm --ark-frontend-tool=/home/share/OpenHarmony2.0_20210604/out/ohos-arm-release/clang_x64/arkcompiler/ets_frontend/build/src/index.js --libs-dir=/home/share/OpenHarmony2.0_20210604/out/ohos-arm-release/clang_x64/arkcompiler/ets_runtime:/home/share/OpenHarmony2.0_20210604/out/ohos-arm-release/clang_x64/global/i18n_standard:/home/share/OpenHarmony2.0_20210604/prebuilts/clang/ohos/linux-x86_64/llvm/lib/ --ark-frontend=ts2panda '
        --threads=15
        --mode=only strict mode
        --timeout=60000
        --tempDir=out/test262
        --test262Dir=test262/data
        --saveCompiledTests
        test262/data/test_es51/language/statements/break/12.8-1.js

FAIL test262/data/test_es51/language/statements/break/12.8-1.js (strict mode)

Ran 1 tests
0 passed
1 failed
used time is: 0:00:13.303865
```

* `default` indicates `non-strict` mode; `strict mode` indicates the strict mode.

* After the execution finished, the following files are generated under directory `out/test262/` (you can specified it in `test262/config.py`):

```
-rw-rw-r-- 1 zgy zgy 7583 Nov 21 18:18 12.8-1-default.abc
-rw-rw-r-- 1 zgy zgy 415 Nov 21 18:18 12.8-1.js.panda.default.err
-rw-rw-r-- 1 zgy zgy 4389 Nov 21 18:18 12.8-1.js.panda.default.fail
-rw-rw-r-- 1 zgy zgy 415 Nov 21 18:18 12.8-1.js.panda.strict.err
-rw-rw-r-- 1 zgy zgy 4403 Nov 21 18:18 12.8-1.js.panda.strict.fail
-rw-rw-r-- 1 zgy zgy 7601 Nov 21 18:18 12.8-1-strict.abc
```

`.abc` indicates the generated binary `abc` file.

`.err` indicates that an error occurred during the test.

`.fail/.pass` is the file saved after `js` file has been preprocessed.

The `result.txt` file is generated under directory `out/test262` to save statistics after the test finished.
