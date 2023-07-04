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

#include "regAllocator.h"

#include <compiler/core/pandagen.h>

#include <algorithm>

namespace panda::es2panda::compiler {

// FrontAllocator

FrontAllocator::FrontAllocator(PandaGen *pg)
    : pg_(pg), insn_(std::move(pg_->Insns()), pg_->Allocator()->Adapter())
{
}

FrontAllocator::~FrontAllocator()
{
    pg_->Insns().splice(pg_->Insns().end(), std::move(insn_));
}

// RegAllocator

void RegAllocator::PushBack(IRNode *ins)
{
    pg_->Insns().push_back(ins);
}

ArenaAllocator *RegAllocator::Allocator() const
{
    return pg_->Allocator();
}

uint16_t RegAllocator::GetSpillRegsCount() const
{
    return spillRegs_;
}

void RegAllocator::UpdateIcSlot(IRNode *node)
{
    auto inc = node->SetIcSlot(pg_->GetCurrentSlot());
    pg_->IncreaseCurrentSlot(inc);
}

Label *RegAllocator::AllocLabel(std::string &&id)
{
    const auto *lastInsNode = pg_->Insns().empty() ? FIRST_NODE_OF_FUNCTION : pg_->Insns().back()->Node();
    return Alloc<Label>(lastInsNode, std::move(id));
}

void RegAllocator::Run(IRNode *ins, int64_t typeIndex)
{
    Run(ins);
    pg_->TypedInsns()[ins] = typeIndex;
}

void RegAllocator::Run(IRNode *ins)
{
    std::array<VReg *, IRNode::MAX_REG_OPERAND> regs {};
    auto regCnt = ins->Registers(&regs);

    if (regCnt == 0) {
        return PushBack(ins);
    }

    auto registers = Span<VReg *>(regs.data(), regs.data() + regCnt);
    spillRegs_ = std::max(spillRegs_, static_cast<uint16_t>(regCnt));

    if (!CheckRegIndices(ins, registers)) {
        hasSpill_ = true;
    }

    PushBack(ins);
}

void RegAllocator::Run(IRNode *ins, size_t argCount)
{
    std::array<VReg *, IRNode::MAX_REG_OPERAND> regs {};
    auto regCnt = ins->Registers(&regs);
    ASSERT(regCnt != 0);
    auto registers = Span<VReg *>(regs.data(), regs.data() + regCnt);
    spillRegs_ = std::max(spillRegs_, static_cast<uint16_t>(argCount + regCnt - 1));

    if (!CheckRegIndices(ins, registers)) {
        hasSpill_ = true;
    }

    PushBack(ins);
}

void RegAllocator::AdjustInsRegWhenHasSpill()
{
    if (!hasSpill_) {
        spillRegs_ = 0;
        return;
    }

    if ((spillRegs_ + pg_->TotalRegsNum()) > UINT16_MAX) {
        throw Error(ErrorType::GENERIC, "Can't adjust spill insns when regs run out");
    }

    ArenaList<IRNode *> newInsns(Allocator()->Adapter());
    auto &insns = pg_->Insns();
    for (auto it = insns.begin(); it != insns.end(); ++it) {
        IRNode *ins = *it;
        std::vector<OperandKind> regsKind;
        std::array<VReg *, IRNode::MAX_REG_OPERAND> regs {};
        auto regCnt = ins->Registers(&regs);

        if (regCnt == 0) {
            newInsns.push_back(ins);
            continue;
        }

        auto registers = Span<VReg *>(regs.data(), regs.data() + regCnt);
        for (auto *reg : registers) {
            *reg = *reg + spillRegs_;
        }

        if (CheckRegIndices(ins, registers, &regsKind)) {
            // current ins has no spill, continue iterating
            newInsns.push_back(ins);
            continue;
        }

        // current ins has spill
        if (ins->IsRangeInst()) {
            AdjustRangeInsSpill(registers, ins, newInsns);
            continue;
        }

        AdjustInsSpill(registers, ins, newInsns, regsKind);
    }
    pg_->SetInsns(newInsns);
}

void RegAllocator::AdjustInsSpill(Span<VReg *> &registers, IRNode *ins, ArenaList<IRNode *> &newInsns,
                                  std::vector<OperandKind> &regsKind)
{
    ASSERT(spillIndex_ == 0);
    ASSERT(!regsKind.empty());
    int idx = 0;
    for (auto *reg : registers) {
        if (IsRegisterCorrect(reg)) {
            idx++;
            continue;
        }

        const auto originReg = *reg;
        VReg spillReg = spillIndex_;
        if (regsKind[idx] == OperandKind::SRC_VREG || regsKind[idx] == OperandKind::SRC_DST_VREG) {
            Add<Mov>(newInsns, ins->Node(), spillReg, originReg);
        }
        if (regsKind[idx] == OperandKind::DST_VREG || regsKind[idx] == OperandKind::SRC_DST_VREG) {
            dstRegSpills_.push_back(std::make_pair(originReg, spillReg));
        }
        *reg = spillIndex_++;
        idx++;
    }

    newInsns.push_back(ins);

    for (auto spillPair : dstRegSpills_) {
        Add<Mov>(newInsns, ins->Node(), spillPair.first, spillPair.second);
    }

    FreeSpill();
    dstRegSpills_.clear();
}

void RegAllocator::AdjustRangeInsSpill(Span<VReg *> &registers, IRNode *ins, ArenaList<IRNode *> &newInsns)
{
    ASSERT(spillIndex_ == 0);
    ASSERT(ins->IsRangeInst());
    auto rangeRegCount = ins->RangeRegsCount();
    auto *iter = registers.begin();
    auto *rangeStartIter = iter + registers.size() - 1;
    
    while (iter != rangeStartIter) {
        VReg *reg = *iter;
        Add<Mov>(newInsns, ins->Node(), spillIndex_, *reg);
        *reg = spillIndex_++;
        iter++;
    }

    VReg *rangeStartReg = *rangeStartIter;
    auto originReg = *rangeStartReg;
    *rangeStartReg = spillIndex_;

    while (rangeRegCount--) {
        Add<Mov>(newInsns, ins->Node(), spillIndex_++, originReg++);
    }

    newInsns.push_back(ins);
    FreeSpill();
}

}  // namespace panda::es2panda::compiler
