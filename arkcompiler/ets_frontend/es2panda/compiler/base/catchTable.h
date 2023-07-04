/**
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

#ifndef ES2PANDA_COMPILER_BASE_CATCH_TABLE_H
#define ES2PANDA_COMPILER_BASE_CATCH_TABLE_H

#include <ir/irnode.h>
#include <compiler/core/labelPair.h>

namespace panda::es2panda::compiler {

class PandaGen;

class TryLabelSet {
public:
    explicit TryLabelSet(PandaGen *pg);

    ~TryLabelSet() = default;
    DEFAULT_COPY_SEMANTIC(TryLabelSet);
    DEFAULT_MOVE_SEMANTIC(TryLabelSet);

    const LabelPair &TryLabelPair() const
    {
        return try_;
    }

    const LabelPair &CatchLabelPair() const
    {
        return catch_;
    }

    Label *TryBegin() const
    {
        return try_.Begin();
    }

    Label *TryEnd() const
    {
        return try_.End();
    }

    Label *CatchBegin() const
    {
        return catch_.Begin();
    }

    Label *CatchEnd() const
    {
        return catch_.End();
    }

private:
    LabelPair try_;
    LabelPair catch_;
};

class CatchTable {
public:
    CatchTable(PandaGen *pg, uint32_t depth) : labelSet_(pg), depth_(depth) {}

    ~CatchTable() = default;
    NO_COPY_SEMANTIC(CatchTable);
    NO_MOVE_SEMANTIC(CatchTable);

    const TryLabelSet &LabelSet() const
    {
        return labelSet_;
    }

    uint32_t Depth() const
    {
        return depth_;
    }

private:
    TryLabelSet labelSet_;
    uint32_t depth_;
};

}  // namespace panda::es2panda::compiler

#endif
