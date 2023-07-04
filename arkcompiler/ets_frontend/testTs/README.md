# testTs

### File info
1. skip_tests.json:avoids code files and does not perform operations on TS files stored in the file.
2. import_tests.json:Is the path to the TS code file where import files are stored to add import files.

### Environment to prepare
1. Compile TS2ABC warehouse in hongmeng system code root directory. Delete the out directory and run the './build.sh --product-name hispark_taurus_standard --build-target ark_ts2abc' command.
2. Go to the tool build directory 'cd out/hispark_taurus/clang_x64/arkcompiler/ets_frontend/build' in the out file and run the 'npm install' command to set up the environment
3. After setting up the environment, enter the ark/ts2abc directory of Hongmeng system

### Execute test framework
1. Execute options  <br>
1.1 Performing a Full Test <br>
python3 ./testTs/run_testTs.py  <br>
1.2 Performing directory Tests <br>
python3 ./testTs/run_testTs.py --dir  File directory, for example（./testTs/test/ambient）<br>
1.3 Performing a Single file Test<br>
python3 ./testTs/run_testTs.py --file  File path, for example (./testTs/test/ambient/1.ts）<br>
