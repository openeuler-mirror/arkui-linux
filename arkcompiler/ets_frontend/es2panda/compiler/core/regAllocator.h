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

#ifndef ES2PANDA_COMPILER_CORE_REG_ALLOCATOR_H
#define ES2PANDA_COMPILER_CORE_REG_ALLOCATOR_H

#include <gen/isa.h>
#include <lexer/token/sourceLocation.h>
#include <macros.h>

namespace panda::es2panda::ir {
class AstNode;
}  // namespace panda::es2panda::ir

namespace panda::es2panda::compiler {

class PandaGen;

class RegAllocator {
public:
    explicit RegAllocator(PandaGen *pg)
        : pg_(pg), sourceLocationFlag_(lexer::SourceLocationFlag::VALID_SOURCE_LOCATION)
    {
    }
    NO_COPY_SEMANTIC(RegAllocator);
    NO_MOVE_SEMANTIC(RegAllocator);
    ~RegAllocator() = default;

    void SetSourceLocationFlag(lexer::SourceLocationFlag flag)
    {
        sourceLocationFlag_ = flag;
    }

    lexer::SourceLocationFlag GetSourceLocationFlag() const
    {
        return sourceLocationFlag_;
    }

    ArenaAllocator *Allocator() const;
    uint16_t GetSpillRegsCount() const;
    
    void AdjustInsRegWhenHasSpill();

    Label *AllocLabel(std::string &&id);
    void AddLabel(Label *label)
    {
        PushBack(label);
    }

    template <typename T, typename... Args>
    void Emit(const ir::AstNode *node, Args &&... args)
    {
        auto *ins = Alloc<T>(node, std::forward<Args>(args)...);
        Run(ins);
    }

    template <typename T, typename... Args>
    void EmitWithType(const ir::AstNode *node, int64_t typeIndex, Args &&... args)
    {
        auto *ins = Alloc<T>(node, std::forward<Args>(args)...);
        Run(ins, typeIndex);
    }

    template <typename T, typename... Args>
    void EmitRange(const ir::AstNode *node, size_t argCount, Args &&... args)
    {
        auto *ins = Alloc<T>(node, std::forward<Args>(args)...);
        Run(ins, argCount);
    }

private:
    bool CheckRegIndices(IRNode *ins, const Span<VReg *> &registers,
                         std::vector<OperandKind> *regsKind = nullptr)
    {
        Formats formats = ins->GetFormats();

        for (const auto &format : formats) {
            limit_ = 0;
            for (const auto &formatItem : format.GetFormatItem()) {
                if (regsKind && formatItem.IsVReg()) {
                    regsKind->push_back(formatItem.Kind());
                }

                if (formatItem.IsVReg() && limit_ == 0) {
                    limit_ = 1 << formatItem.Bitwidth();
                }
            }

            if (std::all_of(registers.begin(), registers.end(),
                            [this](const VReg *reg) { return IsRegisterCorrect(reg); })) {
                return true;
            }
        }
        return false;
    }

    inline bool IsRegisterCorrect(const VReg *reg) const
    {
        return *reg < limit_;
    }

    inline void FreeSpill()
    {
        spillIndex_ = 0;
    }

    void PushBack(IRNode *ins);
    void UpdateIcSlot(IRNode *node);
    void Run(IRNode *ins);
    void Run(IRNode *ins, size_t argCount);
    void Run(IRNode *ins, int64_t typeIndex);
    void AdjustInsSpill(Span<VReg *> &registers, IRNode *ins, ArenaList<IRNode *> &newInsns,
                        std::vector<OperandKind> &regsKind);
    void AdjustRangeInsSpill(Span<VReg *> &registers, IRNode *ins, ArenaList<IRNode *> &newInsns);

    template <typename T, typename... Args>
    T *Alloc(const ir::AstNode *node, Args &&... args)
    {
        ir::AstNode *invalidNode = nullptr;
        bool isInvalid = GetSourceLocationFlag() == lexer::SourceLocationFlag::INVALID_SOURCE_LOCATION;
        auto *ret = Allocator()->New<T>(isInvalid ? invalidNode : node, std::forward<Args>(args)...);
        UpdateIcSlot(ret);
        return ret;
    }

    template <typename T, typename... Args>
    void Add(ArenaList<IRNode *> &insns, const ir::AstNode *node, Args &&... args)
    {
        insns.push_back(Alloc<T>(node, std::forward<Args>(args)...));
    }

    PandaGen *pg_;
    lexer::SourceLocationFlag sourceLocationFlag_; // for instructions that need to be set with invalid debuginfo
    size_t limit_ {0};
    uint16_t spillRegs_ {0};
    VReg spillIndex_ {0};
    bool hasSpill_ {false};
    std::vector<std::pair<VReg, VReg>> dstRegSpills_ {};
};

class FrontAllocator {
public:
    explicit FrontAllocator(PandaGen *pg);
    NO_COPY_SEMANTIC(FrontAllocator);
    NO_MOVE_SEMANTIC(FrontAllocator);
    ~FrontAllocator();

private:
    PandaGen *pg_;
    ArenaList<IRNode *> insn_;
};
}  // namespace panda::es2panda::compiler

#endif
