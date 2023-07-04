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


type A = string;
type B = string;
type C = string;
type D = string;
type E = string;
type F = string;

type Type1 = (A | & B) & (& C | D);
type Type2 = A & (| C | D) | B & (C | D)
type Type3 = A & C | A & D | B & C | B & D;
type Type4 = A & (B & C) & D;
type Type5 = (A | (B & C) & D) & E | F;

var a: | & string;