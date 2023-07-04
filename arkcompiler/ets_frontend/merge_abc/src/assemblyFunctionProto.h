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

#ifndef MERGE_ABC_ASSEMBLY_FUNCTION_H
#define MERGE_ABC_ASSEMBLY_FUNCTION_H

#include "arena_allocator.h"
#include "assemblyDebugProto.h"
#include "assemblyFileLocationProto.h"
#include "assemblyFunction.pb.h"
#include "assemblyInsProto.h"
#include "assemblyLabelProto.h"
#include "assemblyTypeProto.h"
#include "assembly-program.h"
#include "ideHelpersProto.h"
#include "metaProto.h"

namespace panda::proto {
class CatchBlock {
public:
    static void Serialize(const panda::pandasm::Function::CatchBlock &block, protoPanda::CatchBlock &protoBlock);
    static void Deserialize(const protoPanda::CatchBlock &protoBlock, panda::pandasm::Function::CatchBlock &block);
};

class Parameter {
public:
    static void Serialize(const panda::pandasm::Function::Parameter &param, protoPanda::Parameter &protoParam);
    static void Deserialize(const protoPanda::Parameter &protoParam, panda::pandasm::Function::Parameter &param,
                            panda::ArenaAllocator *allocator);
};

class Function {
public:
    static void Serialize(const panda::pandasm::Function &function, protoPanda::Function &protoFunction);
    static void Deserialize(const protoPanda::Function &protoFunction, panda::pandasm::Function &function,
                            panda::ArenaAllocator *allocator);
};
} // panda::proto
#endif
