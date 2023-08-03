/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    getRangeStartVregPos, isRangeInst
} from "./base/util";
import { CacheList, VregisterCache } from "./base/vregisterCache";
import { DebugInfo } from "./debuginfo";
import {
    Format,
    IRNode,
    Mov,
    OperandKind,
    OperandType,
    VReg
} from "./irnodes";
import { PandaGen } from "./pandagen";

const MAX_VREGC = 65536;

class RegAllocator {
    private newInsns: IRNode[] = [];
    private spills: VReg[] = [];
    private spillId: number = 0;
    private vRegsId: number = 0;
    private needAdjust: boolean = false;

    constructor() {
        this.vRegsId = 0;
    }

    allocIndexForVreg(vreg: VReg) {
        let num = this.getFreeVreg();
        vreg.num = num;
    }

    getSpill(): VReg {
        return this.spills[this.spillId++];
    }

    freeSpill(): void {
        this.spillId = 0;
    }

    getFreeVreg(): number {
        if (this.vRegsId >= MAX_VREGC) {
            throw new Error("vreg has been running out");
        }
        return this.vRegsId++;
    }

    /* check whether the operands is valid for the format,
       return 0 if it is valid, otherwise return the total
       number of vreg which does not meet the requirement
    */
    getNumOfInvalidVregs(operands: OperandType[], format: Format): number {
        let num = 0;
        for (let j = 0; j < operands.length; ++j) {
            if (operands[j] instanceof VReg) {
                if ((<VReg>operands[j]).num >= (1 << format[j][1])) {
                    num++;
                }
            }
        }
        return num;
    }

    doRealAdjustment(operands: OperandType[], format: Format, index: number, irNodes: IRNode[]) {
        let head: IRNode[] = [];
        let tail: IRNode[] = [];

        for (let j = 0; j < operands.length; ++j) {
            if (operands[j] instanceof VReg) {
                let vOrigin = <VReg>operands[j];
                if (vOrigin.num >= (1 << format[j][1])) {
                    let spill = this.getSpill();
                    operands[j] = spill;
                    if (format[j][0] == OperandKind.SrcVReg) {
                        head.push(new Mov(spill, vOrigin));
                    } else if (format[j][0] == OperandKind.DstVReg) {
                        tail.push(new Mov(vOrigin, spill))
                    } else if (format[j][0] == OperandKind.SrcDstVReg) {
                        head.push(new Mov(spill, vOrigin));
                        tail.push(new Mov(vOrigin, spill))
                    } else {
                        // here we do nothing
                    }
                }
            }
        }

        // for debuginfo
        DebugInfo.copyDebugInfo(irNodes[index], head);
        DebugInfo.copyDebugInfo(irNodes[index], tail);

        this.newInsns.push(...head, irNodes[index], ...tail);
        this.freeSpill();
    }

    checkDynRangeInstruction(irNodes: IRNode[], index: number): boolean {
        let operands = irNodes[index].operands;
        let rangeRegOffset = getRangeStartVregPos(irNodes[index]);
        let level = 1 << (irNodes[index].getFormats())[0][rangeRegOffset][1];

        /*
          1. "CalliDynRange 4, v255" is a valid insn, there is no need for all 4 registers numbers to be less than 255,
          it is also similar for NewobjDyn
          2. we do not need to mark any register to be invalid for tmp register, since no other register is used in calli.dyn.range
        */
        if ((<VReg>operands[rangeRegOffset]).num >= level) {
            // needs to be adjusted.
            return false;
        }

        /* the first operand is an imm */
        let startNum = (<VReg>operands[rangeRegOffset]).num;
        let i = rangeRegOffset + 1;
        for (; i < (irNodes[index]).operands.length; ++i) {
            if ((startNum + 1) != (<VReg>operands[i]).num) {
                throw Error("Warning: VReg sequence of DynRange is not continuous. Please adjust it now.");
            }
            startNum++;
        }

        /* If the parameters are consecutive, no adjustment is required. */
        if (i == (irNodes[index]).operands.length) {
            return true;
        }

        // needs to be adjusted.
        return false;
    }

    adjustDynRangeInstruction(irNodes: IRNode[], index: number) {
        let head: IRNode[] = [];
        let operands = irNodes[index].operands;

        /* exclude operands that are not require consecutive */
        let rangeRegOffset = getRangeStartVregPos(irNodes[index]);
        let regNums = operands.length - getRangeStartVregPos(irNodes[index]);

        for (let i = 0; i < regNums; i++) {
            let spill = this.getSpill();
            head.push(new Mov(spill, <VReg>operands[i + rangeRegOffset]));
            operands[i + rangeRegOffset] = spill;
        }

        // for debuginfo
        DebugInfo.copyDebugInfo(irNodes[index], head);

        this.newInsns.push(...head, irNodes[index]);
        this.freeSpill();
    }

    adjustInstructionsIfNeeded(irNodes: IRNode[]): void {
        for (let i = 0; i < irNodes.length; ++i) {
            let operands = irNodes[i].operands;
            let formats = irNodes[i].getFormats();
            if (isRangeInst(irNodes[i])) {
                if (this.checkDynRangeInstruction(irNodes, i)) {
                    this.newInsns.push(irNodes[i]);
                    continue;
                }
                this.adjustDynRangeInstruction(irNodes, i);
                continue;
            }

            let min = operands.length;
            let minFormat = formats[0];
            for (let j = 0; j < formats.length; ++j) {
                let num = this.getNumOfInvalidVregs(operands, formats[j]);
                if (num < min) {
                    minFormat = formats[j];
                    min = num;
                }
            }
            if (min > 0) {
                this.doRealAdjustment(operands, minFormat, i, irNodes);
                continue;
            }
            this.newInsns.push(irNodes[i]);
        }
    }

    getTotalRegsNum(): number {
        return this.vRegsId;
    }

    allocIndexForVregs(locals: VReg[], temps: VReg[], cache: VregisterCache): void {
        for (let i = 0; i < locals.length; ++i) {
            this.allocIndexForVreg(locals[i]);
        }
        for (let i = 0; i < temps.length; ++i) {
            this.allocIndexForVreg(temps[i]);
        }
        for (let i = CacheList.MIN; i < CacheList.MAX; ++i) {
            let cacheItem = cache.getCache(i);
            if (cacheItem.isNeeded()) {
                this.allocIndexForVreg(cacheItem.getCache());
            }
        }
    }

    allocSpillPool(irNodes: IRNode[]): void {
        let spillCount: number = 0;
        for (let i = 0; i < irNodes.length; ++i) {
            let operands = irNodes[i].operands;
            let formats = irNodes[i].getFormats();
            if (isRangeInst(irNodes[i])) {
                let rangeRegOffset = getRangeStartVregPos(irNodes[i]);
                spillCount = Math.max(spillCount, operands.length - rangeRegOffset);

                let level = 1 << (irNodes[i].getFormats())[0][rangeRegOffset][1];
                if ((<VReg>operands[rangeRegOffset]).num >= level) {
                    this.needAdjust = true;
                }
                continue;
            }

            let min = operands.length;
            spillCount = Math.max(spillCount, min);
            for (let j = 0; j < formats.length; ++j) {
                let num = this.getNumOfInvalidVregs(operands, formats[j]);
                if (num < min) {
                    min = num;
                }
            }
            if (min > 0) {
                this.needAdjust = true;
            }
        }

        if (this.needAdjust) {
            this.vRegsId = 0;
            while (spillCount--) {
                let spill = new VReg();
                this.allocIndexForVreg(spill);
                this.spills.push(spill);
            }
        }
    }

    run(pandaGen: PandaGen): void {
        let irNodes = pandaGen.getInsns();
        let locals = pandaGen.getLocals();
        let temps = pandaGen.getTemps();
        let cache = pandaGen.getVregisterCache();
        let parametersCount = pandaGen.getParametersCount();

        this.allocIndexForVregs(locals, temps, cache);
        this.allocSpillPool(irNodes);
        if (this.needAdjust) {
            // assign index to Vregs again
            this.allocIndexForVregs(locals, temps, cache);
        }
        this.adjustInstructionsIfNeeded(irNodes);
        for (let i = 0; i < parametersCount; ++i) {
            let v = new VReg();
            this.allocIndexForVreg(v);
            this.newInsns.unshift(new Mov(locals[i], v));
        }

        pandaGen.setInsns(this.newInsns);
    }
}

export class RegAlloc {
    run(pandaGen: PandaGen): void {
        let regalloc = new RegAllocator();

        regalloc.run(pandaGen);
        pandaGen.setTotalRegsNum(regalloc.getTotalRegsNum());
    }
}
