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

#ifndef ES2PANDA_TYPESCRIPT_EXACTOR_TYPEEXTRACTOR_H
#define ES2PANDA_TYPESCRIPT_EXACTOR_TYPEEXTRACTOR_H

#include <ir/statements/blockStatement.h>
#include <macros.h>

#include "typeRecorder.h"

namespace panda::es2panda::extractor {

using Getter = std::function<int64_t(const ir::AstNode *, bool isNewInstance)>;
using Handler = std::function<void(const ir::AstNode *)>;

class TypeExtractor {
public:
    explicit TypeExtractor(const ir::BlockStatement *rootNode, bool typeDtsExtractor, bool typeDtsBuiltin,
        ArenaAllocator *allocator, compiler::CompilerContext *context);
    ~TypeExtractor() = default;
    NO_COPY_SEMANTIC(TypeExtractor);
    NO_MOVE_SEMANTIC(TypeExtractor);

    void StartTypeExtractor(const parser::Program *program);

    bool GetTypeDtsExtractor() const;
    bool GetTypeDtsBuiltin() const;
    TypeRecorder *Recorder() const;

    const ir::Identifier *GetIdentifierFromExpression(const ir::Expression *expression);
    int64_t GetTypeIndexFromAnnotation(const ir::Expression *typeAnnotation);
    int64_t GetTypeIndexFromIdentifier(const ir::Identifier *identifier);
    int64_t GetTypeIndexFromInitializer(const ir::Expression *initializer);

    static int64_t GetBuiltinTypeIndex(util::StringView name);

private:
    const ir::BlockStatement *rootNode_;
    const bool typeDtsExtractor_;
    const bool typeDtsBuiltin_;
    std::unique_ptr<TypeRecorder> recorder_;
    std::unordered_map<ir::AstNodeType, Getter> getterMap_;
    std::unordered_map<ir::AstNodeType, Handler> handlerMap_;

    void ExtractNodesType(const ir::AstNode *parent);
    void ExtractNodeType(const ir::AstNode *parent, const ir::AstNode *childNode);
    void ExtractImport(const parser::Program *program);
    void ExtractExport(const parser::Program *program);

    const ir::AstNode *GetDeclNodeFromIdentifier(const ir::Identifier *identifier, const ir::Identifier **variable);
    const ir::AstNode *GetDeclNodeFromInitializer(const ir::Expression *initializer, const ir::Identifier **variable);

    int64_t GetTypeIndexFromDeclNode(const ir::AstNode *node, bool isNewInstance);
    int64_t GetTypeIndexFromIdentifierNode(const ir::AstNode *node, bool isNewInstance);
    int64_t GetTypeIndexFromClassExpression(const ir::AstNode *node, bool isNewInstance);
    int64_t GetTypeIndexFromClassDefinition(const ir::AstNode *node, bool isNewInstance);
    int64_t GetTypeIndexFromInterfaceNode(const ir::AstNode *node, bool isNewInstance);
    int64_t GetTypeIndexFromImportNode(const ir::AstNode *node, [[maybe_unused]] bool isNewInstance);
    int64_t GetTypeIndexFromTypeAliasNode(const ir::AstNode *node, [[maybe_unused]] bool isNewInstance);
    int64_t GetTypeIndexFromMemberNode(const ir::AstNode *node, [[maybe_unused]] bool isNewInstance);

    void HandleVariableDeclaration(const ir::AstNode *node);
    void HandleFunctionDeclaration(const ir::AstNode *node);
    void HandleClassDeclaration(const ir::AstNode *node);
    void HandleInterfaceDeclaration(const ir::AstNode *node);
    void HandleTypeAliasDeclaration(const ir::AstNode *node);

    // Helpers
    int64_t GetTypeIndexFromClassInst(int64_t typeIndex);
    int64_t GetTypeIndexFromTypeReference(const ir::TSTypeReference *typeReference);

    // Builtin Helpers
    int64_t GetTypeIndexFromBuiltin(const util::StringView &name, const ir::TSTypeParameterInstantiation *node);
    int64_t GetTypeIndexFromBuiltinInst(int64_t typeIndexBuiltin, const ir::TSTypeParameterInstantiation *node);

    // Other Helpers
    bool IsExportNode(const ir::AstNode *node) const;
    bool IsDeclareNode(const ir::AstNode *node) const;
};

}  // namespace panda::es2panda::extractor

#endif  // ES2PANDA_TYPESCRIPT_EXACTOR_TYPEEXTRACTOR_H
