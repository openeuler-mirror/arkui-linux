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

import { getInstructionSize, IRNode, IRNodeKind } from "./irnodes";
import { LOGD } from "./log";
import { PandaGen } from "./pandagen";

export enum HoistingType {
    GLOBAL_VAR = 0,
    LOCAL_VAR,
    GLOBAL_FUNCTION,
    LOCAL_FUNCTION
}

class ItemValue {
    private count: number = 1;
    private instSize: number;
    private relatedInsns: { name: string, num: number }[] = [];
    private nodeMap: Map<string, number> = new Map<string, number>();

    constructor(instSize: number, relatedInsns?: { name: string, num: number }) {
        this.instSize = instSize;
        if (relatedInsns) {
            this.relatedInsns.push(relatedInsns);
        }
    }

    add(num: number) {
        this.count += num;
        this.relatedInsns.forEach(relatedInsn => { relatedInsn.num += num });
    }

    set(num: number) {
        this.count = num;
        this.relatedInsns.forEach(relatedInsn => { relatedInsn.num = num });
    }

    getCount() {
        return this.count;
    }

    getInstSize() {
        return this.instSize;
    }

    getTotalSize() {
        return this.count * this.instSize;
    }

    getRelatedInsns() {
        return this.relatedInsns;
    }

    getNodeMap() {
        return this.nodeMap;
    }

    updateNodeMap(nodeName: string) {
        if (!this.nodeMap.has(nodeName)) {
            this.nodeMap.set(nodeName, 1);
        } else {
            let old = this.nodeMap.get(nodeName);
            this.nodeMap.set(nodeName, old! + 1);
        }
    }

    unionNodeMap(nodeMap: Map<string, number>) {
        nodeMap.forEach((value: number, key: string) => {
            if (!this.nodeMap.has(key)) {
                this.nodeMap.set(key, value);
            } else {
                let oldvalue = this.nodeMap.get(key);
                oldvalue! += value;
                this.nodeMap.set(key, oldvalue!);
            }
        });
    }

    getSavedSizeIfRemoved(Histogram: HistogramStatistics) {
        let savedSize = this.getTotalSize();
        this.relatedInsns.forEach(relatedInsn => {
            let histogram = Histogram.getStatistics();
            let item = histogram.get(relatedInsn.name);
            if (item) {
                savedSize += (relatedInsn.num) * item.getInstSize();
            }
        });

        return savedSize;
    }

    static createItemValue(name: string, instSize: number): ItemValue {
        let relatedInsns: { name: string, num: number };
        if (name == "lda.str") {
            relatedInsns = { name: "sta.dyn", num: 1 };
        }

        return new ItemValue(instSize, relatedInsns!);
    }
}

class HistogramStatistics {
    private insHistogram: Map<string, ItemValue> = new Map<string, ItemValue>();
    private funcName: string;

    constructor(funcName: string) {
        this.funcName = funcName;
    }

    getInsName(ins: IRNode): string {
        if (ins.kind == IRNodeKind.LABEL) {
            return "Label"
        }

        return ins.getMnemonic();
    }

    unionStatistics(histogram: HistogramStatistics): void {
        let histogramData = histogram.getStatistics();
        histogramData.forEach((value: ItemValue, key: string) => {
            if (!this.insHistogram.has(key)) {
                this.insHistogram.set(key, value);
            } else {
                let old = this.insHistogram.get(key);
                old!.add(value.getCount());
                old!.unionNodeMap(value.getNodeMap());
                this.insHistogram.set(key, old!);
            }
        });
    }

    catchStatistics(pg: PandaGen): void {
        pg.getInsns().forEach(ins => {
            let key = this.getInsName(ins);
            let opSize = getInstructionSize(ins.kind);
            let nodeName = ins.getNodeName();
            if (key.length <= 1) {
                LOGD("this IRNode had no key: " + ins.toString());
            }
            if (!this.insHistogram.has(key)) {
                let item = ItemValue.createItemValue(key, opSize);
                item.updateNodeMap(nodeName);
                this.insHistogram.set(key, item);
            } else {
                let old = this.insHistogram.get(key);
                old!.updateNodeMap(nodeName);
                old!.add(1);
                this.insHistogram.set(key, old!);
            }
        });
        return;
    }

    getStatistics(): Map<string, ItemValue> {
        return this.insHistogram;
    }

    getTotal() {
        let totalInsnsNum: number = 0;
        let totalSize: number = 0;
        // @ts-ignore
        this.insHistogram.forEach((value, key) => {
            totalInsnsNum += value.getCount();
            totalSize += value.getTotalSize();
        });

        return [totalInsnsNum, totalSize];
    }

    print(): void {
        let totalInsnsNum = this.getTotal()[0];
        let totalSize = this.getTotal()[1];
        LOGD("\n");
        LOGD("Histogram:", "====== (" + this.funcName + ") ======");
        LOGD("op code\t\t\tinsns number\tins size\ttotal size\tsize percentage");
        this.insHistogram.forEach((value, key) => {
            if (key.length < 8) { // 8 indicates insn name length
                LOGD(key + "\t\t\t" + value.getCount() + "\t\t"+ value.getInstSize() + "\t\t" + value.getTotalSize() + "\t\t"
                     + value.getSavedSizeIfRemoved(this) + "\t" + Math.round(value.getSavedSizeIfRemoved(this) / totalSize * 100) + "%"); // multiplying 100 is to calculate percentage data
            } else if (key.length < 16) { // 16 indicates insn name length
                LOGD(key + "\t\t" + value.getCount() + "\t\t" + value.getInstSize() + "\t\t" + value.getTotalSize() + "\t\t"
                     + value.getSavedSizeIfRemoved(this) + "\t" + Math.round(value.getSavedSizeIfRemoved(this) / totalSize * 100) + "%");
            } else {
                LOGD(key + "\t" + value.getCount() + "\t\t" + value.getInstSize() + "\t\t" + value.getTotalSize() + "\t\t"
                     + value.getSavedSizeIfRemoved(this) + "\t" + Math.round(value.getSavedSizeIfRemoved(this) / totalSize * 100) + "%");
            }
        });

        LOGD("total insns number : \t" + totalInsnsNum + "\t\t" + "total Size : \t" + totalSize);

        LOGD("\n");
        this.insHistogram.forEach((value, key) => {
            if (value.getNodeMap().size > 1) {

                LOGD("op code: " + key);
                value.getNodeMap().forEach((num: number, node: string) => {
                    if (node.length < 8) {
                        LOGD("Node: \t" + node + "\t\t\t\t\t\tnum: \t" + num + "\t\t" + Math.round(num / value.getCount() * 100) + "%");
                    } else if (node.length < 16) {
                        LOGD("Node: \t" + node + "\t\t\t\t\tnum: \t" + num + "\t\t" + Math.round(num / value.getCount() * 100) + "%");
                    } else if (node.length < 24) {
                        LOGD("Node: \t" + node + "\t\t\t\tnum: \t" + num + "\t\t" + Math.round(num / value.getCount() * 100) + "%");
                    } else {
                        LOGD("Node: \t" + node + "\t\t\tnum: \t" + num + "\t\t" + Math.round(num / value.getCount() * 100) + "%");
                    }
                });
                LOGD("\n");
            }
        });
    }
}

export class CompilerStatistics {
    private histogramMap: Map<string, HistogramStatistics> = new Map<string, HistogramStatistics>();
    private numOfHoistingCases: number[] = [0, 0, 0, 0];
    private hoistingRelatedInsnNum: number = 0;

    constructor() {

    }

    addHoistingRelatedInsnNum(num: number) {
        this.hoistingRelatedInsnNum += num;
    }

    addNumOfHoistCases(type: HoistingType) {
        this.numOfHoistingCases[type]++;
    }

    getInsHistogramStatistics(pg: PandaGen) {
        let histogram = new HistogramStatistics(pg.internalName);

        histogram.catchStatistics(pg);
        this.histogramMap.set(pg.internalName, histogram);
    }

    printHistogram(verbose: boolean) {
        let totalHistogram = new HistogramStatistics("Total");
        
        // @ts-ignore
        this.histogramMap.forEach((histogram, funcName) => {
            totalHistogram.unionStatistics(histogram);

            if (verbose) {
                histogram.print();
            }
        });

        totalHistogram.print();
    }

    printHoistStatistics(): void {
        LOGD("\n");
        LOGD("HoistingRelated Histogram:", "======whole file=======");
        LOGD("global var\tlocal var\tglobal function\tlocal function");
        LOGD(this.numOfHoistingCases[0] + "\t\t" + this.numOfHoistingCases[1] + "\t\t" + this.numOfHoistingCases[2] + "\t\t" + this.numOfHoistingCases[3]);
        LOGD("\n");
        LOGD("Approximately hoisting related insns nums");
        LOGD(this.hoistingRelatedInsnNum);
    }
}