# Copyright (c) 2021 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cmake_minimum_required(VERSION 3.10 FATAL_ERROR)

project(ts2abc)

set(PANDA_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../submodules/panda)
set(PANDA_BIN ${CMAKE_CURRENT_BINARY_DIR}/panda)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -pthread")
set(JSON_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../third_party/jsoncpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include("${PANDA_ROOT}/cmake/Definitions.cmake")
include("${PANDA_ROOT}/cmake/PandaCmakeFunctions.cmake")

set(TS2ABC_SOURCES ts2abc.cpp)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/bin)
panda_add_executable(ts2abc ${TS2ABC_SOURCES})
target_include_directories(ts2abc
    PRIVATE
    ${PANDA_ROOT}/assembler
    ${PANDA_BIN}/assembler
    ${PANDA_ROOT}/libpandabase
    ${PANDA_ROOT}/libpandafile
    ${PANDA_BIN}/libpandafile/include
    ${PANDA_ROOT}/third_party/libc_sec/include
    ${PANDA_ROOT}/bytecode_optimizer
    ${PANDA_ROOT}/compiler
    ${PANDA_BIN}/runtime/include
    ${PANDA_ROOT}
    ${PANDA_BIN}/compiler/generated
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${JSON_ROOT}
    ${JSON_ROOT}/include
)

include(ExternalProject)
ExternalProject_Add(panda
    SOURCE_DIR        ${PANDA_ROOT}
    BINARY_DIR        ${PANDA_BIN}
    CMAKE_ARGS        -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} -DPANDA_ENABLE_CLANG_TIDY=${PANDA_ENABLE_CLANG_TIDY} -DPANDA_PRODUCT_BUILD=true
    BUILD_COMMAND     $(MAKE) arkassembler arkcompiler arkbytecodeopt
    BUILD_BYPRODUCTS  ${PANDA_ASSEMBLER_OUTPUT} ${PANDA_FILE_OUTPUT} ${PANDA_BASE_OUTPUT} ${PANDA_ZIPARCHIVE_OUTPUT} ${MINIZ_OUTPUT} ${PANDA_COMPILER_OUTPUT} ${PANDA_BYTECODEOPT_OUTPUT}
    INSTALL_COMMAND    ""
    BUILD_ALWAYS      TRUE
)

add_dependencies(ts2abc panda)
if(PANDA_TARGET_WINDOWS OR PANDA_TARGET_MACOS)
  if(PANDA_TARGET_WINDOWS)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -static")
  endif()
  set(PANDA_ASSEMBLER_OUTPUT ${PANDA_BIN}/lib/libarkassembler.a)
  add_library(arkassembler STATIC IMPORTED)
  set(PANDA_FILE_OUTPUT ${PANDA_BIN}/lib/libarkfile.a)
  add_library(arkfile STATIC IMPORTED)
  set(PANDA_BASE_OUTPUT ${PANDA_BIN}/lib/libarkbase.a)
  add_library(arkbase STATIC IMPORTED)
  set(PANDA_COMPILER_OUTPUT ${PANDA_BIN}/lib/libarkcompiler.a)
  add_library(arkcompiler STATIC IMPORTED)
  set(PANDA_BYTECODEOPT_OUTPUT ${PANDA_BIN}/lib/libarkbytecodeopt.a)
  add_library(arkbytecodeopt STATIC IMPORTED)


  set(PANDA_ZIPARCHIVE_OUTPUT ${PANDA_BIN}/lib/libarkziparchive.a)
  add_library(arkziparchive STATIC IMPORTED)
  set(MINIZ_OUTPUT ${PANDA_BIN}/lib/libminiz.a)
  add_library(miniz STATIC IMPORTED)
  set_target_properties (miniz PROPERTIES
    IMPORTED_LOCATION ${MINIZ_OUTPUT}
  )
  set(SEC_OUTPUT ${PANDA_BIN}/lib/libc_secshared.a)
  add_library(c_secshared STATIC IMPORTED)

  set(BUILD_SHARED_LIBS OFF CACHE BOOL "Build jsoncpp static library" FORCE)
  add_subdirectory(${JSON_ROOT} jsoncpp_static)
  target_link_libraries(ts2abc jsoncpp_static)
else()
  set(PANDA_ASSEMBLER_OUTPUT ${PANDA_BIN}/lib/libarkassembler.so)
  add_library(arkassembler SHARED IMPORTED)
  set(PANDA_FILE_OUTPUT ${PANDA_BIN}/lib/libarkfile.so)
  add_library(arkfile SHARED IMPORTED)
  set(PANDA_BASE_OUTPUT ${PANDA_BIN}/lib/libarkbase.so)
  add_library(arkbase SHARED IMPORTED)
  set(PANDA_ZIPARCHIVE_OUTPUT ${PANDA_BIN}/lib/libarkziparchive.so)
  add_library(arkziparchive SHARED IMPORTED)
  set(PANDA_COMPILER_OUTPUT ${PANDA_BIN}/lib/libarkcompiler.so)
  add_library(arkcompiler SHARED IMPORTED)
  set(PANDA_BYTECODEOPT_OUTPUT ${PANDA_BIN}/lib/libarkbytecodeopt.so)
  add_library(arkbytecodeopt SHARED IMPORTED)

  set(MINIZ_OUTPUT ${PANDA_BIN}/lib/libminiz.so)
  add_library(miniz SHARED IMPORTED)
  set(SEC_OUTPUT ${PANDA_BIN}/lib/libc_secshared.so)
  add_library(c_secshared SHARED IMPORTED)

  set(BUILD_SHARED_LIBS ON CACHE BOOL "Build jsoncpp shared library" FORCE)
  add_subdirectory(${JSON_ROOT} jsoncpp_lib)
  target_link_libraries(ts2abc jsoncpp_lib)
endif()

set_target_properties (arkassembler PROPERTIES
  IMPORTED_LOCATION ${PANDA_ASSEMBLER_OUTPUT}
)
set_target_properties (arkfile PROPERTIES
  IMPORTED_LOCATION ${PANDA_FILE_OUTPUT}
)
set_target_properties (arkbase PROPERTIES
  IMPORTED_LOCATION ${PANDA_BASE_OUTPUT}
)
set_target_properties (arkziparchive PROPERTIES
  IMPORTED_LOCATION ${PANDA_ZIPARCHIVE_OUTPUT}
)
set_target_properties (arkcompiler PROPERTIES
  IMPORTED_LOCATION ${PANDA_COMPILER_OUTPUT}
)
set_target_properties (arkbytecodeopt PROPERTIES
  IMPORTED_LOCATION ${PANDA_BYTECODEOPT_OUTPUT}
)
set_target_properties (c_secshared PROPERTIES
  IMPORTED_LOCATION ${SEC_OUTPUT}
)

if(PANDA_TARGET_WINDOWS  OR PANDA_TARGET_MACOS)
  target_link_libraries(ts2abc arkbytecodeopt arkcompiler arkassembler arkfile arkziparchive arkbase c_secshared miniz)
else()
  target_link_libraries(ts2abc arkassembler arkfile arkbase arkziparchive c_secshared arkcompiler arkbytecodeopt)
endif()
