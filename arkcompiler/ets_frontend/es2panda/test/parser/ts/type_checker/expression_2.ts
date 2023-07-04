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


var c = 1;

switch (c) {
    case 0 : c += c;
    case 1 : c *= c;
    case 2 : c -= c;
    case 3 : c = +c;
    case 4 : c = -c;
    case 5 : c++;
    case 6 : ++c;
    case 7 : c--;
    case 8 : --c;
    default: break;
}
