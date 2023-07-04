#!/bin/bash
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

set -e

PANDA_ROOT="../submodules/panda"
ISA="$PANDA_ROOT/isa/isa.yaml"
DEPS="$PANDA_ROOT/isa/isapi.rb,$PANDA_ROOT/libpandafile/pandafile_isapi.rb"
TEMPLATE="templates/irnodes.ts.erb"
OUTPUT="src/irnodes.ts"

ruby $PANDA_ROOT/isa/gen.rb --template $TEMPLATE --data $ISA --output $OUTPUT --require "$DEPS"

BUILTIN_DATA="$PANDA_ROOT/isa/builtins.yaml"
BUILTIN_REQS="$PANDA_ROOT/isa/builtinsapi.rb,$PANDA_ROOT/runtime/ecmascript/ecma_builtins.rb"
BUILTIN_TEMPLATE="templates/builtinsMap.ts.erb"
BUILTIN_OUTPUT="src/builtinsMap.ts"

ruby $PANDA_ROOT/isa/gen.rb --template $BUILTIN_TEMPLATE --data $BUILTIN_DATA --output $BUILTIN_OUTPUT --require "$BUILTIN_REQS"
