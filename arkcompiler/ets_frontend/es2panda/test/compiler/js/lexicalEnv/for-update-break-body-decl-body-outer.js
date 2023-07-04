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

/**
 * j is loop lexical
 * len is function lexical
 */
{
    let a = [];
    let len = 5;

    function x() {
        return len;
    }

    for (let i = 1; i < 5; i++) {
        print("check enter loop, len == 5: ", len == 5);
        if (i == 3) {
            break;
        }
        let j = i;
        a.push(function b() {
            print(j);
        });
    }

    print("check exit loop, len == 5: ", len == 5);

    a.forEach(f => {
        f();
    })
}
