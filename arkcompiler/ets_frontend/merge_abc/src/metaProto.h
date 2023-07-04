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

#ifndef MERGE_ABC_META_H
#define MERGE_ABC_META_H

#include "annotationProto.h"
#include "arena_allocator.h"
#include "assembly-program.h"
#include "assemblyTypeProto.h"
#include "meta.pb.h"

namespace panda::proto {
class RecordMetadata {
public:
    static void Serialize(const panda::pandasm::RecordMetadata &meta, protoPanda::RecordMetadata &protoMeta);
    static void Deserialize(const protoPanda::RecordMetadata &protoMeta,
                            std::unique_ptr<panda::pandasm::RecordMetadata> &meta,
                            panda::ArenaAllocator *allocator);
};

class FunctionMetadata {
public:
    static void Serialize(const panda::pandasm::FunctionMetadata &meta,
                                    protoPanda::FunctionMetadata &protoMeta);
    static void Deserialize(const protoPanda::FunctionMetadata &protoMeta,
                            std::unique_ptr<panda::pandasm::FunctionMetadata> &meta,
                            panda::ArenaAllocator *allocator);
};

class FieldMetadata {
public:
    static void Serialize(const panda::pandasm::FieldMetadata &meta, protoPanda::FieldMetadata &protoMeta);
    static void Deserialize(const protoPanda::FieldMetadata &protoMeta,
                            std::unique_ptr<panda::pandasm::FieldMetadata> &meta,
                            panda::ArenaAllocator *allocator);
};

class ParamMetadata {
public:
    static void Serialize(const panda::pandasm::ParamMetadata &meta, protoPanda::ParamMetadata &protoMeta);
    static void Deserialize(const protoPanda::ParamMetadata &protoMeta,
                            std::unique_ptr<panda::pandasm::ParamMetadata> &meta,
                            panda::ArenaAllocator *allocator);
};

class ItemMetadata {
public:
    static void Serialize(const panda::pandasm::ItemMetadata &meta, protoPanda::ItemMetadata &protoMeta);
    static void Deserialize(const protoPanda::ItemMetadata &protoMeta, panda::pandasm::ItemMetadata &meta);
};

class AnnotationMetadata {
public:
    static void Serialize(const panda::pandasm::AnnotationMetadata &meta,
                          protoPanda::AnnotationMetadata &protoMeta);
    static void Deserialize(const protoPanda::AnnotationMetadata &protoMeta, panda::pandasm::AnnotationMetadata &meta,
                            panda::ArenaAllocator *allocator);
};

class Metadata {
public:
    static void Serialize(const panda::pandasm::Metadata &meta, protoPanda::Metadata &protoMeta);
    static void Deserialize(const protoPanda::Metadata &protoMeta, panda::pandasm::Metadata &meta);
};
} // panda::proto
#endif
