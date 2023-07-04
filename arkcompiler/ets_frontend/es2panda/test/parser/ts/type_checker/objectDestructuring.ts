/*
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


var { var1, var2 } = { var1: 5, var2: "foo" };
var1 = 3;
var2 = "bar";

var { prop: [var3, , , var4], var5 = true } = { prop: [1, [], {}, "foo"] }
var3 = 12;
var4 = "baz";
var5 = false;

var { prop: { var6 = 3, var7 = "" } = { var6: "foo", var7: true } } = { prop: { var6: 1, var7: "bar" } }
var6 = 1;
var6 = "baz";
var7 = false;
var7 = "baz";

var { prop: { prop: [var8 = 1, var9 = { a: 3, b: "bar" }] } = { prop: ["foo", true] } } = { prop: { prop: [1, 2, 3] } };
var8 = var6;
var9 = 1;
var9 = { a: 1, b: "foo" };
var9 = false;

interface interface1 {
    var11: number,
    b: string,
    (a: number, b: string[]): boolean;
}

var var10: interface1;
var { var11, ...var12 } = var10;
var11 = 12;
var12 = { b: "foo" };

var { var13 = 6, var14 = true }: { var13: number | string, var14: boolean | number[] } = { var13: "foo", var14: [1, 2, 3] };
var { prop: { var15, ...var16 } }: { prop: { var15: number, a: string, b(a: number, b: number[]): boolean, c: number[] } } = { prop: { var15: 12, a: "foo", c: [1, 2, 3], b: function (a: number, b: number[]): boolean { return true } } };
var { ...var17 }: { a: number, b: string } | { c: boolean, d: void } | { e: { k: true, z: "foo" } } = { a: 5, b: "foo" };

var var18: number;
var var19: boolean;

({ var18 = 0, var19 } = { var18: 1, var19: true });
({ var18, var19 } = { var19: false, var18: 3 });
({ var18, var18 } = { var18: 2 });
({ var18 = 4, var19 = true } = { var19: false, var18: 5 });

var var20 = {};
({ var19, var20: { var18 } } = { var19: true, var20: { var18: 5 + 6 } });

var var21: {};

({ var18, ...var21 } = { var18: 7, a: false, b: { c: "foo" } });

var var22: string;
var var23: interface2;
interface interface2 {
    var18: number,
    var22: string;
}

({ var18, ...var21 } = var23);
({ var18, var22 } = var23);

var var24: number;
var var25: string;
var var26: boolean;
var var27: any;

({ var27: [var26 = true, [var25, var24 = 8]] } = { var27: [false, ["foo"]] })

var var28: number;
var var29: string;
var var30 = {};

({ var30: { var29 = "foo", var28 } = { var28: 9 } } = { var30: { var28: 10, var29: "bar" } });
