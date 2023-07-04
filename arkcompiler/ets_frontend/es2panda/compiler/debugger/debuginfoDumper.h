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

#ifndef ES2PANDA_COMPILER_DEBUGGER_DEBUGINFO_DUMPER_H
#define ES2PANDA_COMPILER_DEBUGGER_DEBUGINFO_DUMPER_H

#include <assembly-ins.h>
#include <assembly-program.h>
#include <macros.h>

namespace panda::es2panda::debuginfo {

using Value = std::variant<std::string, size_t, int32_t>;

class DebugInfoDumper {
public:
    explicit DebugInfoDumper(const pandasm::Program *prog);
    ~DebugInfoDumper() = default;
    NO_COPY_SEMANTIC(DebugInfoDumper);
    NO_MOVE_SEMANTIC(DebugInfoDumper);

    void Dump();

private:
    template <typename T>
    void WrapArray(const char *name, const std::vector<T> &array, bool comma = true);
    void WriteIns(const pandasm::Ins &ins);
    void WriteMetaData(const std::vector<pandasm::AnnotationData> &metaData);
    void WriteProperty(const char *key, const Value &value, bool comma = true);
    void WritePosInfo(const pandasm::debuginfo::Ins &posInfo);
    void WriteVariableInfo(const pandasm::debuginfo::LocalVariable &localVariableDebug);
    void Indent();

    const pandasm::Program *prog_;
    std::stringstream ss_;
    int32_t indent_ {0};
};

}  // namespace panda::es2panda::debuginfo

#endif  // UTIL_DEBUGINFO_DUMPER_H
