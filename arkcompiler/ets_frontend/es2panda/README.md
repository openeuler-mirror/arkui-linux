# Es2panda

All in one JavaScript/TypeScript parser and compiler.

## Usage
```sh
es2panda [OPTIONS] [input file] -- [arguments]
```

## Optional arguments
 - `--debug-info`: Compile with debug info
 - `--dump-assembly`: Dump pandasm
 - `--dump-ast`: Dump the parsed AST
 - `--dump-debug-info`: Dump debug info
 - `--dump-size-stat`: Dump binary size statistics
 - `--extension`: Parse the input as the given extension (options: js | ts | as)
 - `--module`: Parse the input as module
 - `--opt-level`: Compiler optimization level (options: 0 | 1 | 2)
 - `--output`: Compiler binary output (.abc)
 - `--parse-only`: Parse the input only
 - `--strict`: Parse the input in strict mode

## Tail arguments
 - `input`: input file

## Running the tests
```sh
pip install tqdm
```
```sh
python3 test/runner.py [OPTIONS] [build_directory]
```

### Optional arguments
 - `--regression`: Run regression tests
 - `--test262`: Run test262
 - `--no-progress`: Don't show progress bar

### Tail arguments
 - `build_directory`: Path to panda build directory

### Skip list
Skip list for the runtime: `test/test262skiplist.txt, test/test262skiplist-long.txt`.
