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


namespace ns.ns2 {
  export namespace ns3 {
    export class C {
      s : string = "test-ts-namespace-9 flag1";
      f() {
        print("test-ts-namespace-9 flag2");
      }
    }
  }
  export class C {
    s : string = "test-ts-namespace-9 flag3";
    f() {
      print("test-ts-namespace-9 flag4");
    }
  }
}

var c : ns.ns2.ns3.C = new ns.ns2.ns3.C();
print(c.s);
c.f();

var d : ns.ns2.C = new ns.ns2.C();
print(d.s);
d.f();
