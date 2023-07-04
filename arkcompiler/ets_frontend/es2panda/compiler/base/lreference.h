/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_COMPILER_BASE_LREFERENCE_H
#define ES2PANDA_COMPILER_BASE_LREFERENCE_H

#include <binder/scope.h>
#include <ir/irnode.h>

namespace panda::es2panda::ir {
class AstNode;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

enum class ReferenceKind {
    MEMBER,
    VAR_OR_GLOBAL,
    DESTRUCTURING,
};

enum class ReferenceFlags {
    NONE = 0,
    DECLARATION = 1U << 0U,
};

class PandaGen;

class LReference {
public:
    LReference(const ir::AstNode *node, PandaGen *pg, bool isDeclaration, ReferenceKind refKind,
               binder::ScopeFindResult res);
    ~LReference() = default;
    NO_COPY_SEMANTIC(LReference);
    NO_MOVE_SEMANTIC(LReference);

    void GetValue();
    void SetValue();
    binder::Variable *Variable() const;
    ReferenceKind Kind() const;

    static LReference CreateLRef(PandaGen *pg, const ir::AstNode *node, bool isDeclaration);

private:
    const ir::AstNode *node_;
    PandaGen *pg_;
    ReferenceKind refKind_;
    binder::ScopeFindResult res_;
    VReg obj_;
    Operand prop_;
    bool isDeclaration_;
};

}  // namespace panda::es2panda::compiler

#endif
