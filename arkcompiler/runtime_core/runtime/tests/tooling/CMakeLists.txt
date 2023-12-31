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

set(SOURCES
    test_util.cpp
    test_extractor.cpp)

# Test library can't be built with --no-undefined option
set(UNSUPPORTED_LINKER_FLAGS "-Wl,--no-undefined")
if (CMAKE_SHARED_LINKER_FLAGS)
    string(REPLACE ${UNSUPPORTED_LINKER_FLAGS} "" CMAKE_SHARED_LINKER_FLAGS ${CMAKE_SHARED_LINKER_FLAGS})
endif()

# Common testing framework for tooling tests
add_library(debugtest SHARED ${SOURCES})
target_link_libraries(debugtest arkfile arkruntime)

target_include_directories(debugtest PUBLIC
    ${PANDA_ROOT}
    ${CMAKE_CURRENT_SOURCE_DIR}
)

panda_add_to_clang_tidy(debugtest)
panda_add_sanitizers(TARGET debugtest SANITIZERS ${PANDA_SANITIZERS_LIST})
