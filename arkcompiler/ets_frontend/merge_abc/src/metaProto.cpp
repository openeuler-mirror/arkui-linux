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
#include "metaProto.h"

namespace panda::proto {
void RecordMetadata::Serialize(const panda::pandasm::RecordMetadata &meta, protoPanda::RecordMetadata &protoMeta)
{
    auto *protoItemmetadata = protoMeta.mutable_father();
    ItemMetadata::Serialize(static_cast<const panda::pandasm::ItemMetadata &>(meta), *protoItemmetadata);
}

void RecordMetadata::Deserialize(const protoPanda::RecordMetadata &protoMeta,
                                 std::unique_ptr<panda::pandasm::RecordMetadata> &meta,
                                 panda::ArenaAllocator *allocator)
{
    auto &protoItemMetadata = protoMeta.father();
    ItemMetadata::Deserialize(protoItemMetadata, *meta);

    auto &protoAnnoMetadata = protoItemMetadata.father();
    AnnotationMetadata::Deserialize(protoAnnoMetadata, *meta, allocator);

    const auto &protoMetadata = protoAnnoMetadata.father();
    Metadata::Deserialize(protoMetadata, *meta);
}

void FunctionMetadata::Serialize(const panda::pandasm::FunctionMetadata &meta,
                                 protoPanda::FunctionMetadata &protoMeta)
{
    auto *protoItemmetadata = protoMeta.mutable_father();
    ItemMetadata::Serialize(static_cast<const panda::pandasm::ItemMetadata &>(meta), *protoItemmetadata);
}

void FunctionMetadata::Deserialize(const protoPanda::FunctionMetadata &protoMeta,
                                   std::unique_ptr<panda::pandasm::FunctionMetadata> &meta,
                                   panda::ArenaAllocator *allocator)
{
    auto &protoItemMetadata = protoMeta.father();
    ItemMetadata::Deserialize(protoItemMetadata, *meta);

    auto &protoAnnoMetadata = protoItemMetadata.father();
    AnnotationMetadata::Deserialize(protoAnnoMetadata, *meta, allocator);

    const auto &protoMetadata = protoAnnoMetadata.father();
    Metadata::Deserialize(protoMetadata, *meta);
}

void FieldMetadata::Serialize(const panda::pandasm::FieldMetadata &meta, protoPanda::FieldMetadata &protoMeta)
{
    auto *protoItemmetadata = protoMeta.mutable_father();
    ItemMetadata::Serialize(meta, *protoItemmetadata);
    auto *protoType = protoMeta.mutable_fieldtype();
    Type::Serialize(meta.GetFieldType(), *protoType);
    const auto val = meta.GetValue();
    if (val.has_value()) {
        auto *protoValue = protoMeta.mutable_value();
        ScalarValue::Serialize(val.value(), *protoValue);
    }
}

void FieldMetadata::Deserialize(const protoPanda::FieldMetadata &protoMeta,
                                std::unique_ptr<panda::pandasm::FieldMetadata> &meta,
                                panda::ArenaAllocator *allocator)
{
    auto &protoItemMetadata = protoMeta.father();
    ItemMetadata::Deserialize(protoItemMetadata, *meta);
    auto &protoAnnoMetadata = protoItemMetadata.father();
    AnnotationMetadata::Deserialize(protoAnnoMetadata, *meta, allocator);
    const auto &protoMetadata = protoAnnoMetadata.father();
    Metadata::Deserialize(protoMetadata, *meta);

    auto &fieldType = Type::Deserialize(protoMeta.fieldtype(), allocator);
    meta->SetFieldType(fieldType);
    ScalarValue scalarValue;
    if (protoMeta.has_value()) {
        auto scalar = scalarValue.Deserialize(protoMeta.value(), allocator);
        meta->SetValue(scalar);
    }
}

void ParamMetadata::Serialize(const panda::pandasm::ParamMetadata &meta, protoPanda::ParamMetadata &protoMeta)
{
    auto *protoAnnometadata = protoMeta.mutable_father();
    AnnotationMetadata::Serialize(static_cast<const panda::pandasm::AnnotationMetadata &>(meta), *protoAnnometadata);
}

void ParamMetadata::Deserialize(const protoPanda::ParamMetadata &protoMeta,
                                std::unique_ptr<panda::pandasm::ParamMetadata> &meta,
                                panda::ArenaAllocator *allocator)
{
    const auto &protoAnnoMetadata = protoMeta.father();
    AnnotationMetadata::Deserialize(protoAnnoMetadata, *meta, allocator);
}

void ItemMetadata::Serialize(const panda::pandasm::ItemMetadata &meta, protoPanda::ItemMetadata &protoMeta)
{
    auto *protoAnnometadata = protoMeta.mutable_father();
    AnnotationMetadata::Serialize(static_cast<const panda::pandasm::AnnotationMetadata &>(meta), *protoAnnometadata);
    protoMeta.set_accessflags(meta.GetAccessFlags());
}

void ItemMetadata::Deserialize(const protoPanda::ItemMetadata &protoMeta, panda::pandasm::ItemMetadata &meta)
{
    meta.SetAccessFlags(protoMeta.accessflags());
}

void AnnotationMetadata::Serialize(const panda::pandasm::AnnotationMetadata &meta,
                                   protoPanda::AnnotationMetadata &protoMeta)
{
    auto *protoMetadata = protoMeta.mutable_father();
    Metadata::Serialize(static_cast<const panda::pandasm::Metadata &>(meta), *protoMetadata);
    for (const auto &anno : meta.GetAnnotations()) {
        auto *proto_anno = protoMeta.add_annotations();
        AnnotationData::Serialize(anno, *proto_anno);
    }
}

void AnnotationMetadata::Deserialize(const protoPanda::AnnotationMetadata &protoMeta,
                                     panda::pandasm::AnnotationMetadata &meta,
                                     panda::ArenaAllocator *allocator)
{
    std::vector<panda::pandasm::AnnotationData> annotations;
    annotations.reserve(protoMeta.annotations_size());
    for (const auto &protoAnnotation : protoMeta.annotations()) {
        auto *annotation = allocator->New<panda::pandasm::AnnotationData>(protoAnnotation.recordname());
        AnnotationData::Deserialize(protoAnnotation, *annotation, allocator);
        annotations.emplace_back(std::move(*annotation));
    }
    meta.AddAnnotations(annotations);
}

void Metadata::Serialize(const panda::pandasm::Metadata &meta, protoPanda::Metadata &protoMeta)
{
    for (const auto &attr : meta.GetBoolAttributes()) {
        protoMeta.add_set_attributes(attr);
    }
    for (const auto &[name, attrs] : meta.GetAttributes()) {
        auto *protoKeyVal = protoMeta.add_attributes();
        protoKeyVal->set_key(name);
        for (const auto &attr : attrs) {
            protoKeyVal->add_value(attr);
        }
    }
}

void Metadata::Deserialize(const protoPanda::Metadata &protoMeta, panda::pandasm::Metadata &meta)
{
    for (const auto &attr : protoMeta.set_attributes()) {
        meta.SetAttribute(attr);
    }
    for (const auto &protoKeyVal: protoMeta.attributes()) {
        auto &key = protoKeyVal.key();
        for (const auto &attr : protoKeyVal.value()) {
            meta.SetAttributeValue(key, attr);
        }
    }
}
} // panda::proto
