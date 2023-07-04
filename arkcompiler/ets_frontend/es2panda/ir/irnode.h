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

#ifndef ES2PANDA_COMPILER_IR_IRNODE_H
#define ES2PANDA_COMPILER_IR_IRNODE_H

#include <lexer/token/sourceLocation.h>
#include <macros.h>
#include <util/ustring.h>
#include <utils/span.h>

#include <cstdint>
#include <list>
#include <sstream>
#include <utility>
#include <variant>
#include <vector>

namespace panda::es2panda::ir {
class AstNode;
}  // namespace panda::es2panda::ir

namespace panda::pandasm {
struct Ins;
}  // namespace panda::pandasm

namespace panda::es2panda::compiler {

enum class OperandKind {
    // the least significant bit indicates vreg
    // the second bit indicates src or dst
    SRC_VREG,
    DST_VREG,
    SRC_DST_VREG,
    IMM,
    ID,
    STRING_ID,
    LABEL
};

class FormatItem {
public:
    constexpr FormatItem(OperandKind kind, uint32_t bitwidth) : kind_(kind), bitwidth_(bitwidth) {}

    OperandKind Kind() const
    {
        return kind_;
    };

    bool constexpr IsVReg() const
    {
        return kind_ == OperandKind::SRC_VREG || kind_ == OperandKind::DST_VREG || kind_ == OperandKind::SRC_DST_VREG;
    }

    uint32_t Bitwidth() const
    {
        return bitwidth_;
    };

private:
    OperandKind kind_;
    uint32_t bitwidth_;
};

class Format {
public:
    constexpr Format(const FormatItem *item, size_t size) : item_(item), size_(size) {}

    panda::Span<const FormatItem> GetFormatItem() const
    {
        return panda::Span<const FormatItem>(item_, size_);
    }

private:
    const FormatItem *item_;
    size_t size_;
};

using Formats = panda::Span<const Format>;
using VReg = uint16_t;

class Label;
class IRNode;

using Operand = std::variant<compiler::VReg, double, int64_t, util::StringView, Label *>;

#define FIRST_NODE_OF_FUNCTION (reinterpret_cast<ir::AstNode *>(0x1))

using ICSlot = uint16_t;

using IcSizeType = uint32_t;

class IRNode {
public:
    explicit IRNode(const ir::AstNode *node) : node_(node) {};
    virtual ~IRNode() = default;

    NO_COPY_SEMANTIC(IRNode);
    NO_MOVE_SEMANTIC(IRNode);

    const ir::AstNode *Node() const
    {
        return node_;
    }

    static constexpr auto MAX_REG_OPERAND = 5;

    virtual Formats GetFormats() const = 0;
    virtual size_t Registers([[maybe_unused]] std::array<VReg *, MAX_REG_OPERAND> *regs) = 0;
    virtual size_t Registers([[maybe_unused]] std::array<const VReg *, MAX_REG_OPERAND> *regs) const = 0;
    virtual void Transform(panda::pandasm::Ins *ins) const = 0;
    virtual ICSlot SetIcSlot(IcSizeType currentSlot) = 0;

    virtual bool IsRangeInst() const
    {
        return false;
    }

    virtual int64_t RangeRegsCount()
    {
        return 0;
    }

private:
    const ir::AstNode *node_;
};

}  // namespace panda::es2panda::compiler

#endif
