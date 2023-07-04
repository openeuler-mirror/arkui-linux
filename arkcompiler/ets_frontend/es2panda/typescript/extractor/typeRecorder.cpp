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

#include "typeRecorder.h"

#include <ir/astDump.h>

namespace panda::es2panda::extractor {

template <typename M, typename K, typename V>
static V FindValue(const M &map, const K &key, const V &value)
{
    auto t = map.find(key);
    if (t != map.end()) {
        return t->second;
    }
    return value;
}

TypeRecorder::TypeRecorder(ArenaAllocator *allocator, compiler::CompilerContext *context)
    : allocator_(allocator), context_(context), buffStorage_(allocator_->Adapter())
{
}

ArenaAllocator *TypeRecorder::Allocator() const
{
    return allocator_;
}

const ArenaVector<compiler::LiteralBuffer *> &TypeRecorder::BuffStorage() const
{
    return buffStorage_;
}

const std::unordered_map<const ir::AstNode *, int64_t> &TypeRecorder::NodeTypeIndex() const
{
    return nodeTypeIndex_;
}

const std::unordered_map<const binder::Variable *, int64_t> &TypeRecorder::VariableTypeIndex() const
{
    return variableTypeIndex_;
}

const std::unordered_map<std::string, int64_t> &TypeRecorder::ExportType() const
{
    return exportType_;
}

const std::unordered_map<std::string, int64_t> &TypeRecorder::DeclareType() const
{
    return declareType_;
}

compiler::LiteralBuffer *TypeRecorder::NewLiteralBuffer()
{
    return allocator_->New<compiler::LiteralBuffer>(allocator_);
}

int64_t TypeRecorder::AddLiteralBuffer(compiler::LiteralBuffer *buffer)
{
    buffStorage_.push_back(buffer);
    buffer->SetIndex(context_->NewLiteralIndex());
    return buffer->Index();
}

compiler::LiteralBuffer *TypeRecorder::GetLiteralBuffer(int64_t index) const
{
    auto res = std::find_if(buffStorage_.begin(), buffStorage_.end(),
        [&index](const auto &t) { return t->Index() == index; });
    return (res != buffStorage_.end()) ? *res : nullptr;
}

void TypeRecorder::SetLiteralBuffer(int64_t index, compiler::LiteralBuffer *buffer)
{
    std::replace_if(buffStorage_.begin(), buffStorage_.end(),
        [&index](const auto &t) { return t->Index() == index; }, buffer);
    buffer->SetIndex(index);
}

util::StringView TypeRecorder::GetAnonymousFunctionNames(const ir::ScriptFunction *func) const
{
    const auto &m = context_->Binder()->AnonymousFunctionNames();
    auto res = m.find(func);
    return (res != m.end()) ? std::move(res->second) : std::move(DEFAULT_NAME);
}

int64_t TypeRecorder::CalculateUserType() const
{
    return userType_.size();
}

void TypeRecorder::AddUserType(int64_t index)
{
    userType_.insert(index);
}

int64_t TypeRecorder::GetTypeSummaryIndex() const
{
    return typeSummaryIndex_;
}

void TypeRecorder::SetTypeSummaryIndex(int64_t index)
{
    typeSummaryIndex_ = index;
}

int64_t TypeRecorder::GetUserTypeIndexShift() const
{
    return userTypeIndexShift_;
}

void TypeRecorder::SetUserTypeIndexShift(int64_t index)
{
    userTypeIndexShift_ = index;
}

int64_t TypeRecorder::GetNodeTypeIndex(const ir::AstNode *node) const
{
    return FindValue(nodeTypeIndex_, node, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetNodeTypeIndex(const ir::AstNode *node, int64_t index)
{
    if (node == nullptr || GetNodeTypeIndex(node) != PRIMITIVETYPE_ANY) {
        return;
    }

    nodeTypeIndex_[node] = index;
}

int64_t TypeRecorder::GetVariableTypeIndex(const binder::Variable *variable) const
{
    return FindValue(variableTypeIndex_, variable, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetVariableTypeIndex(const binder::Variable *variable, int64_t index)
{
    if (variable == nullptr || GetVariableTypeIndex(variable) != PRIMITIVETYPE_ANY) {
        return;
    }

    variableTypeIndex_[variable] = index;
}

void TypeRecorder::SetIdentifierTypeIndex(const ir::Identifier *identifier, int64_t index)
{
    if (identifier == nullptr) {
        return;
    }
    SetNodeTypeIndex(identifier, index);
    SetVariableTypeIndex(identifier->Variable(), index);
}

int64_t TypeRecorder::GetBuiltinInst(const std::vector<int64_t> &allTypes) const
{
    return FindValue(builtinInst_, allTypes, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetBuiltinInst(const std::vector<int64_t> &allTypes, int64_t instIndex)
{
    builtinInst_[allTypes] = instIndex;
}

int64_t TypeRecorder::GetClassInst(int64_t classIndex) const
{
    return FindValue(classInst_, classIndex, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetClassInst(int64_t classIndex, int64_t instIndex)
{
    if (classIndex == PRIMITIVETYPE_ANY) {
        return;
    }
    classInst_[classIndex] = instIndex;
}

int64_t TypeRecorder::GetClassType(int64_t instIndex) const
{
    // Here we always return the original type rather than instance type
    // If `instIndex` is not in `classType_`, it means `instIndex` does not come from new instance
    return FindValue(classType_, instIndex, instIndex);
}

void TypeRecorder::SetClassType(int64_t instIndex, int64_t classIndex)
{
    if (instIndex == PRIMITIVETYPE_ANY) {
        return;
    }
    classType_[instIndex] = classIndex;
}

int64_t TypeRecorder::GetArrayType(int64_t contentIndex) const
{
    return FindValue(arrayType_, contentIndex, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetArrayType(int64_t contentIndex, int64_t arrayIndex)
{
    arrayType_[contentIndex] = arrayIndex;
}

int64_t TypeRecorder::GetUnionType(const std::string &unionStr) const
{
    return FindValue(unionType_, unionStr, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetUnionType(const std::string &unionStr, int64_t unionIndex)
{
    unionType_[unionStr] = unionIndex;
}

int64_t TypeRecorder::GetObjectType(const std::string &objectStr) const
{
    return FindValue(objectType_, objectStr, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetObjectType(const std::string &objectStr, int64_t objectIndex)
{
    objectType_[objectStr] = objectIndex;
}

int64_t TypeRecorder::GetExportType(const std::string &exportStr) const
{
    return FindValue(exportType_, exportStr, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetExportType(const std::string &exportStr, int64_t exportIndex)
{
    exportType_[exportStr] = exportIndex;
}

int64_t TypeRecorder::GetDeclareType(const std::string &declareStr) const
{
    return FindValue(declareType_, declareStr, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetDeclareType(const std::string &declareStr, int64_t declareIndex)
{
    declareType_[declareStr] = declareIndex;
}

int64_t TypeRecorder::GetNamespaceType(const std::string &namespaceStr) const
{
    return FindValue(namespaceType_, namespaceStr, PRIMITIVETYPE_ANY);
}

void TypeRecorder::SetNamespaceType(const std::string &namespaceStr, int64_t namespaceIndex)
{
    namespaceType_[namespaceStr] = namespaceIndex;
}

std::string TypeRecorder::GetNamespacePath(const std::string &namespaceStr) const
{
    return FindValue(namespacePath_, namespaceStr, std::string());
}

void TypeRecorder::SetNamespacePath(const std::string &namespaceStr, const std::string &filePath)
{
    namespacePath_[namespaceStr] = filePath;
}

const std::set<util::StringView> &TypeRecorder::GetAnonymousReExport() const
{
    return anonymousReExport_;
}

void TypeRecorder::AddAnonymousReExport(const util::StringView &reExportStr)
{
    anonymousReExport_.insert(reExportStr);
}

ALWAYS_INLINE void TypeRecorder::Dump(const parser::Program *program) const
{
#ifndef NDEBUG
    std::cout << "========== TypeExtractor ==========" << std::endl;
    std::cout << "---------- userType_ ----------" << std::endl;
    std::stringstream ss;
    for (const auto &t : userType_) {
        ss << t << " | ";
    }
    std::cout << ss.str() << std::endl;
    std::cout << "---------- nodeTypeIndex_ ----------" << std::endl;
    for (const auto &t : nodeTypeIndex_) {
        ir::AstDumper dumper(t.first);
        std::cout << dumper.Str() << " : " << t.second << std::endl;
    }
    std::cout << "---------- variableTypeIndex_ ----------" << std::endl;
    for (const auto &t : variableTypeIndex_) {
        std::cout << t.first->Name() << " : " << t.second << std::endl;
    }
    std::cout << "---------- builtinInst_ ----------" << std::endl;
    for (const auto &t : builtinInst_) {
        for (const auto &p : t.first) {
            std::cout << p << " ";
        }
        std::cout << t.second << std::endl;
    }

    auto fn = [](const auto &map) {
        for (const auto &t : map) {
            std::cout << t.first << " : " << t.second << std::endl;
        }
    };
    std::cout << "---------- classInst_ ----------" << std::endl;
    std::cout << "---- class ---- | ---- inst ----" << std::endl;
    fn(classInst_);
    std::cout << "---------- classType_ ----------" << std::endl;
    std::cout << "---- inst ---- | ---- class ----" << std::endl;
    fn(classType_);
    std::cout << "---------- arrayType_ ----------" << std::endl;
    fn(arrayType_);
    std::cout << "---------- unionType_ ----------" << std::endl;
    fn(unionType_);
    std::cout << "---------- objectType_ ----------" << std::endl;
    fn(objectType_);
    std::cout << "---------- exportType_ ----------" << std::endl;
    fn(exportType_);
    std::cout << "---------- declareType_ ----------" << std::endl;
    fn(declareType_);
    std::cout << "---------- namespaceType_ ----------" << std::endl;
    fn(namespaceType_);
    std::cout << "---------- namespacePath_ ----------" << std::endl;
    fn(namespacePath_);
    std::cout << "---------- anonymousReExport_ ----------" << std::endl;
    for (const auto &t : anonymousReExport_) {
        std::cout << std::string(t) << std::endl;
    }
    std::cout << "========== TypeExtractor ==========" << std::endl;
#endif
}

}  // namespace panda::es2panda::extractor
