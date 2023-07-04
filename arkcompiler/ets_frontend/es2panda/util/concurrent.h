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

#ifndef ES2PANDA_UTIL_CONCURRENT_H
#define ES2PANDA_UTIL_CONCURRENT_H

#include <util/ustring.h>

namespace panda::es2panda::compiler {
class PandaGen;
} // namespace panda::es2panda::compiler

namespace panda::es2panda::ir {
class AstNode;
class BlockStatement;
class ScriptFunction;
} // namespace panda::es2panda::ir

namespace panda::es2panda::binder {
class ScopeFindResult;
} // namespace panda::es2panda::binder

namespace panda::es2panda::lexer {
class LineIndex;
}

namespace panda::es2panda::util {

enum class ConcurrentInvalidFlag {
    NOT_ORDINARY_FUNCTION = 1,
    NOT_IMPORT_VARIABLE = 2
};

class Concurrent {
public:
    Concurrent() = delete;

    static void SetConcurrent(ir::ScriptFunction *func, const lexer::LineIndex &lineIndex);
    static void ThrowInvalidConcurrentFunction(const lexer::LineIndex &lineIndex, const ir::AstNode *expr,
                                    ConcurrentInvalidFlag errFlag);
    static void VerifyImportVarForConcurrentFunction(const lexer::LineIndex &lineIndex, const ir::AstNode *node,
                                            const binder::ScopeFindResult &result);

    static constexpr std::string_view USE_CONCURRENT = "use concurrent";
};

} // namespace panda::es2panda::util

#endif