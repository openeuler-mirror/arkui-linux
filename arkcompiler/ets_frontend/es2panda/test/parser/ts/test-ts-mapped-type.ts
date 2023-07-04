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


type Type1<T1> = { -readonly [prop in keyof T1]-?: boolean; };
type Type2<T2> = { +readonly [prop in keyof T2]+?: boolean; };
type Type3<T3> = { readonly [prop in keyof T3]?: boolean; };
type Type4<T4> = { [prop in keyof T4]: boolean; };
type Type5<T5> = { [prop in keyof T5]: boolean };
type Type6<T6> = { [prop in keyof T6]; };
type Type7<T7> = { [prop in keyof T7] };