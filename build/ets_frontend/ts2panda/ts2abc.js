/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
const path = require("path");
const fs = require("fs");
const spawn = require('child_process').spawn;

let isWin = !1;
let isMac = !1;

const arkDir = path.resolve(__dirname);

if (fs.existsSync(path.join(arkDir, 'build-win'))) {
    isWin = !0;
} else if (fs.existsSync(path.join(arkDir, 'build-mac'))) {
    isMac = !0;
} else if (!fs.existsSync(path.join(arkDir, 'build'))) {
    throw Error('find build fail').message;
}

let js2abc;
if (isWin) {
    js2abc = path.join(arkDir, 'build-win', 'bin', 'js2abc.exe');
} else if (isMac) {
    js2abc = path.join(arkDir, 'build-mac', 'bin', 'js2abc');
} else {
    js2abc = path.join(arkDir, 'build', 'bin', 'js2abc');
}

function callJs2abc(args) {
    let proc = spawn(`${js2abc}`, args);

    proc.stderr.on('data', (data) => {
        throw Error(`${data}`).message;
    });

    proc.stdout.on('data', (data) => {
        process.stdout.write(`${data}`);
    });
}

let args = process.argv.splice(2);
// keep bc-version to be compatible with old IDE versions
if (args.length == 1 && args[0] == "--bc-version") {
    callJs2abc(args);
    return;
}

// hard-coded for now, will be modified later
if (args[0] == "--target-api-version") {
    if (args[1] == "8") {
        process.stdout.write("0.0.0.2");
    } else if (args[1] == "9") {
        process.stdout.write("9.0.0.0");
    } else {
        args = ["--bc-version"];
        callJs2abc(args);
    }
}
