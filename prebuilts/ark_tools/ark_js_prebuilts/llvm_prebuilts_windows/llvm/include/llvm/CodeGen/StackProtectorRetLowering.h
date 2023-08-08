//===-- StackProtectorRetLowering.h -----------------------------*- C++ -*-===//
//
// Part of the LLVM Project, under the Apache License v2.0 with LLVM Exceptions.
// See https://llvm.org/LICENSE.txt for license information.
// SPDX-License-Identifier: Apache-2.0 WITH LLVM-exception
//
//===----------------------------------------------------------------------===//

#ifndef LLVM_CODEGEN_STACKPROTECTORRETLOWERING_H
#define LLVM_CODEGEN_STACKPROTECTORRETLOWERING_H

#include <utility>
#include <vector>

namespace llvm {
class CalleeSavedInfo;
class GlobalVariable;
class MachineBasicBlock;
class MachineFunction;
class MachineInstr;

class StackProtectorRetLowering {
public:
  virtual ~StackProtectorRetLowering() {}

  /// insert stack-protector-ret instrumentation in prologue or epilogue.
  virtual void insertStackProtectorRetPrologue(MachineFunction &MF,
                                               MachineBasicBlock &MBB,
                                               GlobalVariable *cookie) const {}
  virtual void insertStackProtectorRetEpilogue(MachineFunction &MF,
                                               MachineInstr &MI,
                                               GlobalVariable *cookie) const {}

  /// Check if it is a return instruction.
  /// Need to overide the implementation for different architectures.
  virtual bool instrIsRet(unsigned opcode) const { return false; }

  /// Get a caller saved temporary register for the target architecture.
  /// Need to overide the implementation for different architectures.
  virtual unsigned getTargetReg(void) const { return 0; }

  /// Check if backward CFI protection is required.
  virtual void setupStackProtectorRet(MachineFunction &MF) const;

  /// Set SSPRetReg as a callee saved register to push the computed stack guard value onto the stack.
  virtual void saveStackProtectorRetRegister(MachineFunction &MF, std::vector<CalleeSavedInfo> &CSI) const;

  /// Determine an available SSPRet register and feedback the determination result.
  virtual bool determineStackProtectorRetRegister(MachineFunction &MF) const;

  /// insertStackProtectorRets - insert stack-protector-ret instrumentation.
  virtual void insertStackProtectorRets(MachineFunction &MF) const;
};

} // namespace llvm

#endif
