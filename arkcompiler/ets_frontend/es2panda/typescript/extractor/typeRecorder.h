/*
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

#ifndef ES2PANDA_TYPESCRIPT_EXACTOR_TYPERECORDER_H
#define ES2PANDA_TYPESCRIPT_EXACTOR_TYPERECORDER_H

#include <macros.h>

#include <binder/binder.h>
#include <binder/variable.h>
#include <compiler/base/literals.h>
#include <compiler/core/compilerContext.h>
#include <ir/astNode.h>
#include <ir/expressions/identifier.h>
#include <parser/program/program.h>
#include <mem/arena_allocator.h>
#include <utils/arena_containers.h>

namespace panda::es2panda::extractor {

const util::StringView DEFAULT_NAME = "default";

class TypeRecorder {
public:
    explicit TypeRecorder(ArenaAllocator *allocator, compiler::CompilerContext *context);
    ~TypeRecorder() = default;
    NO_COPY_SEMANTIC(TypeRecorder);
    NO_MOVE_SEMANTIC(TypeRecorder);

    ArenaAllocator *Allocator() const;
    const ArenaVector<compiler::LiteralBuffer *> &BuffStorage() const;
    const std::unordered_map<const ir::AstNode *, int64_t> &NodeTypeIndex() const;
    const std::unordered_map<const binder::Variable *, int64_t> &VariableTypeIndex() const;
    const std::unordered_map<std::string, int64_t> &ExportType() const;
    const std::unordered_map<std::string, int64_t> &DeclareType() const;

    compiler::LiteralBuffer *NewLiteralBuffer();
    int64_t AddLiteralBuffer(compiler::LiteralBuffer *buffer);
    compiler::LiteralBuffer *GetLiteralBuffer(int64_t index) const;
    void SetLiteralBuffer(int64_t index, compiler::LiteralBuffer *buffer);

    util::StringView GetAnonymousFunctionNames(const ir::ScriptFunction *func) const;

    int64_t CalculateUserType() const;
    void AddUserType(int64_t index);

    int64_t GetTypeSummaryIndex() const;
    void SetTypeSummaryIndex(int64_t index);

    int64_t GetUserTypeIndexShift() const;
    void SetUserTypeIndexShift(int64_t index);

    int64_t GetNodeTypeIndex(const ir::AstNode *node) const;
    void SetNodeTypeIndex(const ir::AstNode *node, int64_t index);

    int64_t GetVariableTypeIndex(const binder::Variable *variable) const;
    void SetVariableTypeIndex(const binder::Variable *variable, int64_t index);

    void SetIdentifierTypeIndex(const ir::Identifier *identifier, int64_t index);

    int64_t GetBuiltinInst(const std::vector<int64_t> &allTypes) const;
    void SetBuiltinInst(const std::vector<int64_t> &allTypes, int64_t instIndex);

    int64_t GetClassInst(int64_t classIndex) const;
    void SetClassInst(int64_t classIndex, int64_t instIndex);

    int64_t GetClassType(int64_t instIndex) const;
    void SetClassType(int64_t instIndex, int64_t classIndex);

    int64_t GetArrayType(int64_t contentIndex) const;
    void SetArrayType(int64_t contentIndex, int64_t arrayIndex);

    int64_t GetUnionType(const std::string &unionStr) const;
    void SetUnionType(const std::string &unionStr, int64_t unionIndex);

    int64_t GetObjectType(const std::string &objectStr) const;
    void SetObjectType(const std::string &objectStr, int64_t objectIndex);

    int64_t GetExportType(const std::string &exportStr) const;
    void SetExportType(const std::string &exportStr, int64_t exportIndex);

    int64_t GetDeclareType(const std::string &declareStr) const;
    void SetDeclareType(const std::string &declareStr, int64_t declareIndex);

    int64_t GetNamespaceType(const std::string &namespaceStr) const;
    void SetNamespaceType(const std::string &namespaceStr, int64_t namespaceIndex);

    std::string GetNamespacePath(const std::string &namespaceStr) const;
    void SetNamespacePath(const std::string &namespaceStr, const std::string &filePath);

    const std::set<util::StringView> &GetAnonymousReExport() const;
    void AddAnonymousReExport(const util::StringView &reExportStr);

    ALWAYS_INLINE void Dump(const parser::Program *program) const;

    static constexpr uint8_t PRIMITIVETYPE_ANY = 0U;
    static constexpr int64_t USERTYPEINDEXHEAD = 100;

private:
    ArenaAllocator *allocator_;
    compiler::CompilerContext *context_;
    ArenaVector<compiler::LiteralBuffer *> buffStorage_;
    int64_t typeSummaryIndex_ = 0;
    int64_t userTypeIndexShift_ = USERTYPEINDEXHEAD;
    std::set<int64_t> userType_ {};
    std::unordered_map<const ir::AstNode *, int64_t> nodeTypeIndex_ {};
    std::unordered_map<const binder::Variable *, int64_t> variableTypeIndex_ {};
    std::map<std::vector<int64_t>, int64_t> builtinInst_ {};
    std::unordered_map<int64_t, int64_t> classInst_ {};
    std::unordered_map<int64_t, int64_t> classType_ {};
    std::unordered_map<int64_t, int64_t> arrayType_ {};
    std::unordered_map<std::string, int64_t> unionType_ {};
    std::unordered_map<std::string, int64_t> objectType_ {};
    // Export symbols
    std::unordered_map<std::string, int64_t> exportType_ {};
    std::unordered_map<std::string, int64_t> declareType_ {};
    // Namespace in import / export declaration
    std::unordered_map<std::string, int64_t> namespaceType_ {};
    std::unordered_map<std::string, std::string> namespacePath_ {};
    std::set<util::StringView> anonymousReExport_ {};
};

}  // namespace panda::es2panda::extractor

#endif  // ES2PANDA_TYPESCRIPT_EXACTOR_TYPERECORDER_H
