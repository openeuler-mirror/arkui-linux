/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_COMPILER_CORE_DYNAMIC_CONTEXT_H
#define ES2PANDA_COMPILER_CORE_DYNAMIC_CONTEXT_H

#include <util/ustring.h>
#include <ir/irnode.h>
#include <compiler/core/labelTarget.h>
#include <compiler/base/iterators.h>

namespace panda::es2panda::ir {
class TryStatement;
class ForOfStatement;
class LabelledStatement;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {
class PandaGen;
class LoopEnvScope;
class CatchTable;
class TryLabelSet;

enum class DynamicContextType { NONE, LABEL, LEX_ENV, ITERATOR, TRY };

class DynamicContext {
public:
    NO_COPY_SEMANTIC(DynamicContext);
    NO_MOVE_SEMANTIC(DynamicContext);
    virtual ~DynamicContext();

    void *operator new(size_t) = delete;
    void *operator new[](size_t) = delete;

    virtual void AbortContext([[maybe_unused]] ControlFlowChange cfc,
                              [[maybe_unused]] const util::StringView &targetLabel) {};

    virtual bool HasTryCatch() const
    {
        return false;
    }

    virtual bool HasFinalizer() const
    {
        return HasTryCatch();
    }

    virtual DynamicContextType Type() const = 0;

    DynamicContext *Prev()
    {
        return prev_;
    }

    const DynamicContext *Prev() const
    {
        return prev_;
    }

    const LabelTarget &Target() const
    {
        return target_;
    }

protected:
    explicit DynamicContext(PandaGen *pg, LabelTarget target);

    PandaGen *pg_;
    LabelTarget target_;
    DynamicContext *prev_ {};
};

class LabelContext : public DynamicContext {
public:
    explicit LabelContext(PandaGen *pg, LabelTarget target) : DynamicContext(pg, target) {}
    explicit LabelContext(PandaGen *pg, const ir::LabelledStatement *labelledStmt);
    NO_COPY_SEMANTIC(LabelContext);
    NO_MOVE_SEMANTIC(LabelContext);
    ~LabelContext();

    DynamicContextType Type() const override
    {
        return DynamicContextType::LABEL;
    }

private:
    Label *label_ {};
    const ir::LabelledStatement *labelledStmt_ {};
};

class LexEnvContext : public DynamicContext {
public:
    explicit LexEnvContext(LoopEnvScope *envScope, PandaGen *pg, LabelTarget target);
    NO_COPY_SEMANTIC(LexEnvContext);
    NO_MOVE_SEMANTIC(LexEnvContext);
    ~LexEnvContext();

    DynamicContextType Type() const override
    {
        return DynamicContextType::LEX_ENV;
    }

    bool HasTryCatch() const override;
    void AbortContext([[maybe_unused]] ControlFlowChange cfc,
                      [[maybe_unused]] const util::StringView &targetLabel) override;

private:
    LoopEnvScope *envScope_;
    CatchTable *catchTable_ {};
};

class IteratorContext : public DynamicContext {
public:
    explicit IteratorContext(PandaGen *pg, const Iterator &iterator, LabelTarget target);
    NO_COPY_SEMANTIC(IteratorContext);
    NO_MOVE_SEMANTIC(IteratorContext);
    ~IteratorContext();

    DynamicContextType Type() const override
    {
        return DynamicContextType::ITERATOR;
    }

    const Iterator &GetIterator() const
    {
        return iterator_;
    }

    bool HasTryCatch() const override
    {
        return true;
    }

    void AbortContext([[maybe_unused]] ControlFlowChange cfc,
                      [[maybe_unused]] const util::StringView &targetLabel) override;

private:
    const Iterator &iterator_;
    CatchTable *catchTable_;
};

class DestructuringIteratorContext : public DynamicContext {
public:
    explicit DestructuringIteratorContext(PandaGen *pg, const DestructuringIterator &iterator);
    NO_COPY_SEMANTIC(DestructuringIteratorContext);
    NO_MOVE_SEMANTIC(DestructuringIteratorContext);
    ~DestructuringIteratorContext() override;

    DynamicContextType Type() const override
    {
        return DynamicContextType::ITERATOR;
    }

    const DestructuringIterator &GetIterator() const
    {
        return iterator_;
    }

    bool HasTryCatch() const override
    {
        return true;
    }

    void AbortContext(ControlFlowChange cfc, const util::StringView &targetLabel) override;

private:
    const DestructuringIterator &iterator_;
    CatchTable *catchTable_;
};

class TryContext : public DynamicContext {
public:
    explicit TryContext(PandaGen *pg, const ir::TryStatement *tryStmt, bool hasFinalizer = true)
        : DynamicContext(pg, {}), tryStmt_(tryStmt), hasFinalizer_(hasFinalizer)
    {
        InitCatchTable();
        InitFinalizer();
    }

    explicit TryContext(PandaGen *pg) : DynamicContext(pg, {})
    {
        InitCatchTable();
    }

    NO_COPY_SEMANTIC(TryContext);
    NO_MOVE_SEMANTIC(TryContext);
    ~TryContext() = default;

    DynamicContextType Type() const override
    {
        return DynamicContextType::TRY;
    }

    bool HasTryCatch() const override
    {
        return true;
    }

    VReg FinalizerRun() const
    {
        return finalizerRun_;
    }

    CatchTable *GetCatchTable() const
    {
        return catchTable_;
    }

    const TryLabelSet &LabelSet() const;
    bool HasFinalizer() const override;
    void InitFinalizer();
    void EmitFinalizer();

    void AbortContext([[maybe_unused]] ControlFlowChange cfc,
                      [[maybe_unused]] const util::StringView &targetLabel) override;

private:
    void InitCatchTable();

    const ir::TryStatement *tryStmt_ {};
    CatchTable *catchTable_ {};
    VReg finalizerRun_ {};
    bool hasFinalizer_ {};
    bool inFinalizer_ {};
};
}  // namespace panda::es2panda::compiler

#endif
