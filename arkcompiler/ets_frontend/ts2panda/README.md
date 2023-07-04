### ts2panda
ts2panda aims to translate JavaScript source files into ARK bytecode which could be executed by the ARK runtime.

The whole converter could be splited into several phases.
* tsc(TypeScript compiler) automatically builds the AST for us
* translate TypeScript AST into panda instruction arrays
* apply several passes with the instruction arrays, including:
    * [register allocator](doc/register_allocator.md)
    * [intrinsic expander](doc/intrinsic_expander.md)
    * [panda assembly dumper](doc/assembly_dumper.md)
    * [panda binary dumper](doc/binary_dumper.md)

### Run a case
The whole ARK project needs to be built before running cases.
#### dump panda binary
```
node --expose-gc ../../out/release/clang_x64/arkcompiler/ets_frontend/build/src/index.js <your/path/to/case_jsFile> <--> <--output> <output-filename>
```
#### dump panda assembly
```
node --expose-gc ../../out/release/clang_x64/arkcompiler/ets_frontend/build/src/index.js <your/path/to/case_jsFile> --dump-assembly
```
