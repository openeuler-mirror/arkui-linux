# Copyright (c) 2021-2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set(ES2PANDA_AOT_SRC
  options.cpp
  main.cpp
)

panda_add_executable(es2panda ${ES2PANDA_AOT_SRC})
target_link_libraries(es2panda es2panda-lib arkassembler arkbytecodeopt)
target_include_directories(es2panda PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

if (PANDA_FUZZILLI)
    target_compile_options(es2panda
        PRIVATE -fPIC
    )
endif()

target_compile_options(es2panda
  PRIVATE -Werror=shadow
)

panda_add_sanitizers(TARGET es2panda SANITIZERS ${PANDA_SANITIZERS_LIST})
panda_add_to_clang_tidy(TARGET es2panda CHECKS
    "-modernize-use-trailing-return-type"
    "-llvmlibc-restrict-system-libc-headers"
    "-llvmlibc-callee-namespace"
    "-cert-dcl21-cpp"
    "-cppcoreguidelines-macro-usage"
    "-cppcoreguidelines-pro-bounds-pointer-arithmetic"
    "-fuchsia-default-arguments-calls"
    "-fuchsia-default-arguments-declarations"
    "-readability-implicit-bool-conversion"
    "-misc-non-private-member-variables-in-classes"
    "-hicpp-signed-bitwise"
    "-altera-struct-pack-align"
)
