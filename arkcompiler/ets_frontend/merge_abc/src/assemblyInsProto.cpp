/**
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

#include "assemblyInsProto.h"

namespace panda::proto {
void Ins::Serialize(const panda::pandasm::Ins &insn, protoPanda::Ins &protoInsn)
{
    protoInsn.set_opcode(static_cast<uint32_t>(insn.opcode));
    for (const auto &reg : insn.regs) {
        protoInsn.add_regs(static_cast<uint32_t>(reg));
    }
    for (const auto &str : insn.ids) {
        protoInsn.add_ids(str);
    }
    for (const auto &imm : insn.imms) {
        auto *protoImm = protoInsn.add_imms();
        switch (static_cast<protoPanda::Ins_IType::TypeCase>(imm.index() + 1)) {  // 1: enum TypeCase start from 1
            case protoPanda::Ins_IType::kValueInt:
                protoImm->set_valueint(std::get<int64_t>(imm));
                break;
            case protoPanda::Ins_IType::kValueDouble:
                protoImm->set_valuedouble(std::get<double>(imm));
                break;
            default:
                UNREACHABLE();
        }
    }
    protoInsn.set_label(insn.label);
    protoInsn.set_setlabelval(insn.set_label);
    auto *protoDebug = protoInsn.mutable_insdebug();
    DebuginfoIns::Serialize(insn.ins_debug, *protoDebug);
}

void Ins::Deserialize(const protoPanda::Ins &protoInsn, panda::pandasm::Ins &insn)
{
    insn.opcode = static_cast<panda::pandasm::Opcode>(protoInsn.opcode());
    insn.regs.reserve(protoInsn.regs_size());
    for (const auto &protoReg : protoInsn.regs()) {
        insn.regs.push_back(static_cast<uint16_t>(protoReg));
    }
    insn.ids.reserve(protoInsn.ids_size());
    for (const auto &protoId : protoInsn.ids()) {
        insn.ids.push_back(protoId);
    }
    insn.imms.reserve(protoInsn.imms_size());
    for (const auto &protoImm : protoInsn.imms()) {
        switch (protoImm.type_case()) {
            case protoPanda::Ins_IType::kValueInt: {
                insn.imms.push_back(protoImm.valueint());
                break;
            }
            case protoPanda::Ins_IType::kValueDouble: {
                insn.imms.push_back(protoImm.valuedouble());
                break;
            }
            default:
                UNREACHABLE();
        }
    }
    insn.label = protoInsn.label();
    insn.set_label = protoInsn.setlabelval();
    const protoPanda::DebuginfoIns &protoDebugInfoIns = protoInsn.insdebug();
    DebuginfoIns::Deserialize(protoDebugInfoIns, insn.ins_debug);
}
} // panda::proto
