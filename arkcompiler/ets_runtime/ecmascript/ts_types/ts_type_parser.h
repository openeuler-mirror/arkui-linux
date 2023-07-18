/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ECMASCRIPT_TS_TYPES_TS_TYPE_PARSER_H
#define ECMASCRIPT_TS_TYPES_TS_TYPE_PARSER_H

#include "ecmascript/ts_types/ts_type_table_generator.h"

namespace panda::ecmascript {
/* TSTypeParser parses types recorded in abc files into TSTypes. VM uses TSTypeTables to
 * store TSTypes. Each TSTypeTable is used to store all types from the same record.
 * Since VM can only record types in GlobalTSTypeRef::MAX_MODULE_ID records and
 * can only record GlobalTSTypeRef::MAX_LOCAL_ID types in one record, all types outside
 * this range will not be parsed and will be treated as any.
 * In addition to this, in the following case, types will not be parsed and will be treated as any.
 * 1. Import types with module request that does not point to one abc file
 * 2. Import types with module request that point to one abc file which is generated by JS
 * 3. Types with kind that are not supported temporarily
 */
class TSTypeParser {
public:
    explicit TSTypeParser(TSManager *tsManager)
        : tsManager_(tsManager), vm_(tsManager->GetEcmaVM()),
          thread_(vm_->GetJSThread()), factory_(vm_->GetFactory()),
          tableGenerator_(tsManager_) {}
    ~TSTypeParser() = default;

    GlobalTSTypeRef PUBLIC_API CreateGT(const JSPandaFile *jsPandaFile, const CString &recordName, uint32_t typeId);

    static constexpr size_t USER_DEFINED_TYPE_OFFSET = 100;

private:
    static constexpr size_t TYPE_KIND_INDEX_IN_LITERAL = 0;
    static constexpr size_t BUILDIN_TYPE_OFFSET = 20;
    static constexpr size_t IMPORT_PATH_OFFSET_IN_LITERAL = 1;

    static constexpr const char* DECLARED_SYMBOL_TYPES = "declaredSymbolTypes";
    static constexpr const char* EXPORTED_SYMBOL_TYPES = "exportedSymbolTypes";

    inline GlobalTSTypeRef GetAndStoreGT(const JSPandaFile *jsPandaFile, uint32_t typeId, const CString &recordName,
                                         uint32_t moduleId = 0, uint32_t localId = 0)
    {
        GlobalTSTypeRef gt(moduleId, localId);
        tsManager_->AddElementToLiteralOffsetGTMap(jsPandaFile, typeId, recordName, gt);
        return gt;
    }

    inline GlobalTSTypeRef GetAndStoreImportGT(const JSPandaFile *jsPandaFile, uint32_t typeId,
                                               const CString &recordName, GlobalTSTypeRef gt)
    {
        tsManager_->AddElementToLiteralOffsetGTMap(jsPandaFile, typeId, recordName, gt, true);
        return gt;
    }

    inline void SetTSType(JSHandle<TSTypeTable> table, JSHandle<JSTaggedValue> type,
                          const GlobalTSTypeRef &gt)
    {
        JSHandle<TSType>(type)->SetGT(gt);
        uint32_t localId = gt.GetLocalId();
        table->Set(thread_, localId, type);
    }

    GlobalTSTypeRef ParseType(const JSPandaFile *jsPandaFile, const CString &recordName, uint32_t typeId);

    GlobalTSTypeRef ParseBuiltinObjType(uint32_t typeId);

    GlobalTSTypeRef ResolveImportType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                      JSHandle<TaggedArray> literal, uint32_t typeId);

    JSHandle<JSTaggedValue> ParseNonImportType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                               JSHandle<TaggedArray> literal, TSTypeKind kind, uint32_t typeId);

    JSHandle<TSClassType> ParseClassType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                         const JSHandle<TaggedArray> &literal, uint32_t typeId);

    JSHandle<TSClassInstanceType> ParseClassInstanceType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                                         const JSHandle<TaggedArray> &literal);

    JSHandle<TSInterfaceType> ParseInterfaceType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                                 const JSHandle<TaggedArray> &literal);

    JSHandle<TSUnionType> ParseUnionType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                         const JSHandle<TaggedArray> &literal);

    JSHandle<TSFunctionType> ParseFunctionType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                               const JSHandle<TaggedArray> &literal);

    JSHandle<TSArrayType> ParseArrayType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                         const JSHandle<TaggedArray> &literal);

    JSHandle<TSObjectType> ParseObjectType(const JSPandaFile *jsPandaFile, const CString &recordName,
                                           const JSHandle<TaggedArray> &literal);

    void FillPropertyTypes(const JSPandaFile *jsPandaFile,
                           const CString &recordName,
                           JSHandle<TSObjLayoutInfo> &layout,
                           const JSHandle<TaggedArray> &literal,
                           uint32_t startIndex, uint32_t lastIndex,
                           uint32_t &index, bool isField);

    void FillInterfaceMethodTypes(const JSPandaFile *jsPandaFile,
                                  const CString &recordName,
                                  JSHandle<TSObjLayoutInfo> &layout,
                                  const JSHandle<TaggedArray> &literal,
                                  uint32_t startIndex, uint32_t lastIndex,
                                  uint32_t &index);

    JSHandle<TaggedArray> GetExportDataFromRecord(const JSPandaFile *jsPandaFile, const CString &recordName);

    JSHandle<JSTaggedValue> GenerateExportTableFromRecord(const JSPandaFile *jsPandaFile, const CString &recordName,
                                                          const JSHandle<TSTypeTable> &table);

    JSHandle<EcmaString> GenerateImportRelativePath(JSHandle<EcmaString> importRel) const;

    JSHandle<EcmaString> GenerateImportVar(JSHandle<EcmaString> import) const;

    GlobalTSTypeRef GetExportGTByName(JSHandle<EcmaString> target, JSHandle<TaggedArray> &exportTable) const;

    TSManager *tsManager_ {nullptr};
    EcmaVM *vm_ {nullptr};
    JSThread *thread_ {nullptr};
    ObjectFactory *factory_ {nullptr};
    TSTypeTableGenerator tableGenerator_;
};
}  // panda::ecmascript
#endif  // ECMASCRIPT_TS_TYPES_TS_TYPE_PARSER_H