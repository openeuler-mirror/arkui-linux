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


namespace ns {}

class ns {
  s : string = "test-ts-namespace-11 flag1";
}

var s : string = "test-ts-namespace-11 flag2";

namespace ns {
  print(s);
  export var c = new ns();
  print(c.s)
}

print(ns.c.s)

var d = new ns();
print(d.s);
