# testTs

### 文件简介
1.skip_tests.json:进行代码文件的规避执行，能对文件中存放的ts文件进行不执行操作。<br>
2.import_tests.json:存放import的ts代码文件路径，对import类型文件进行添加。<br>

### 环境准备
1.在鸿蒙系统代码根目录下编译ts2abc仓。先删除out目录，然后执行./build.sh --product-name hispark_taurus_standard --build-target ark_ts2abc命令进行编译。<br>
2.进入out文件中的工具build目录 cd out/hispark_taurus/clang_x64/arkcompiler/ets_frontend/build，使用npm install命令进行环境搭建<br>
3.搭建完环境，进入到鸿蒙系统ark/ts2abc目录下<br>


### 执行测试框架
1.执行选项<br>
1.1 执行全量测试<br>
python3 ./testTs/run_testTs.py  <br>
1.2 执行目录测试<br>
python3 ./testTs/run_testTs.py --dir  文件目录，例如（./testTs/test/ambient）<br>
1.3 执行单个文件测试<br>
python3 ./testTs/run_testTs.py --file  文件路径，例如（./testTs/test/ambient/1.ts）<br>

