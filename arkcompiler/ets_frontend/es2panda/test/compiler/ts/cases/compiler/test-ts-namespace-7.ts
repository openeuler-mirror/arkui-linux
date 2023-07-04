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
  export namespace ns3{
    export var s : string = "test-ts-namespace-7 flag1";
  }
}

var s : string = "test-ts-namespace-7 flag2";
namespace ns.ns2 {
  export namespace ns3{
    export namespace ns4{
      print(s);
    }
  }
}

namespace ns.ns2 {
  namespace ns3 {
    export namespace ns4 {
      print(s);
    }
  }
}

namespace ns.ns2 {
  namespace ns3 {
    export var s : string = "test-ts-namespace-7 flag3";
  }
  namespace ns3 {
    export namespace ns4 {
      print(s)
    }
  }
}
