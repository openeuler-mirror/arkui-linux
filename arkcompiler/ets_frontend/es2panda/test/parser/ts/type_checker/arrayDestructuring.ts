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


var [var1, var2] = [1, "foo", true];
var1 = 2;
var2 = "bar";

var var3: number;
var var4: boolean;
var [var3, , var4] = [var1, , true];

var [var5 = 2] = ["foo"];
var var5: number | string;

var [var6 = 1, var7 = "asd", var8 = true] = [];
var var6: number;
var var7: string;
var var8: boolean;

var [var9, [var10, , var11], ...var12] = [{ a: 6, b: "bar" }, [42, , "foo" + 2]];
var9 = { a: 5, b: "foo" };
var10 = var3;
var11 = var7;
var12 = [];

var [var13 = [1, "foo"], [var14, var15] = [{}, true], ...var16] = [3, [true, {}], function (a: any, b: any): number { return 12 }, "bar"];
var13 = 5;
var13 = [2, "baz"];
var14 = {};
var14 = false;
var15 = var14;
var var16: [(a: any, b: any) => number, string];

var [var17, var18 = 6, var19]: [number, number | string, boolean[]] = [1, "foo", [true, false]];
var [var20, , var21]: number[] | [number, number, string] = [];
var [var22, var23 = [{ a: 5, b: "foo" }, false], var24]: string[] | [number, ({ a: number, b: string } | boolean)[]] = [1, [{ a: 1, b: "bat" }, true]];
var [[var25, var26] = ["foo", {}], [[var27]]]: number[][][] | [[number | string, {}], [[number]]] = [[1, {}], [[3]]];
var [var28 = {}, { var29 }, ...var30]: [{}, { var29: number }, number, string] = [{}, { var29: 5 }, 1, "foo"];

var var31: number;
var var32: boolean;

[var31, var32] = [var31, true];
[var31, var31] = [5, 6];
[var31, var32] = [var31, true, false, 5];

var var33: number;
var var34: boolean;

[var33, var34] = [var31, var32];

var var35: string | number;

[var35 = 2] = ["foo"];

var var36: number;
var var37: string;
var var38: boolean;
[var36 = 1, var37 = "asd", var38 = true] = [];

var var39 = {};
var var40 = var33;
var var41 = var37;
var var42 = [];
[var39, [var40, , var41 = "bar"], ...var42] = [{}, [42, , "foo" + 2]];
[var39, [var40, , var41 = "bar"], ...var42] = [{}, [42, , "foo" + 2], 3, "baz", false];

[var39, [var40, , var41 = "bar"] = [45, , "baz"], ...var42] = [{}, [42, , "foo" + 2]];

var var43 = [45, , "baz"] as const;

var var44 = "foo";

[var39, [var40, , var41 = "bar"] = var43, ...var42] = [{}, [42, , var44 + 2]];

var var45: string[];
var var46: number[];
var var47: (string | number)[];
var var48: string[];

[var45, var46, var47, var47, var47, ...var48] = [["foo", "bar"], [1, 2], ["foo", "bar"], [1, 2], [1, "foo"], "bar", "bar"]

var var49: string[];
var var50: number[];
[[...var49], ...var50] = [["foo", "bar"], 1, 2]
