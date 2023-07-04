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


a: b;

b: if (0) {}

c: if (0) {} else {}

d: while (0) {};

e: do {} while (0);

f: switch(0) {}

g: try {} catch(e) {} finally {}

function a()
{
  b:
  {
    a:
    while(true)
    {
      break a;
    }
  }
}


function b()
{
  b:
  {
    a:
    c:
    while(true)
    {
      break b;
    }
  }
}

a:
b:
c:
d: 1;

a: 1;
a: 2;
a: 3;
