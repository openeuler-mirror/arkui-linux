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


var ns1_1 : string = "test-ts-namespace-13 flag1";
var ns2_1 : string = "test-ts-namespace-13 flag2";
var ns3_1 : string = "test-ts-namespace-13 flag3";

namespace ns1 {
  export namespace ns2{
    export namespace ns3{
      export var ns1 = ns1_1;
      export var ns2 = ns2_1;
      export var ns3 = ns3_1;
    }
  }
}

print(ns1.ns2.ns3.ns1);
print(ns1.ns2.ns3.ns2);
print(ns1.ns2.ns3.ns3);
