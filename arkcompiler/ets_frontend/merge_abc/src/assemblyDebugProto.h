/**
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef MERGE_ABC_ASSEMBLY_DEBUG_H
#define MERGE_ABC_ASSEMBLY_DEBUG_H

#include "assemblyDebug.pb.h"
#include "assembly-program.h"

namespace panda::proto {
class DebuginfoIns {
public:
    static void Serialize(const panda::pandasm::debuginfo::Ins &debug, protoPanda::DebuginfoIns &protoDebug);
    static void Deserialize(const protoPanda::DebuginfoIns &protoDebug, panda::pandasm::debuginfo::Ins &debug);
};

class LocalVariable {
public:
    static void Serialize(const panda::pandasm::debuginfo::LocalVariable &debug,
                          protoPanda::LocalVariable &protoDebug);
    static void Deserialize(const protoPanda::LocalVariable &protoDebug,
                            panda::pandasm::debuginfo::LocalVariable &debug);
};
} // panda::proto
#endif
