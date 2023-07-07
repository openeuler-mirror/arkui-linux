/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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
export const MemLevel = {
    MEM_LEVEL_MIN: 1,
    MEM_LEVEL_MAX: 9,
    MEM_LEVEL_DEFAULT: 8
};
export const ErrorCode = {
    ERROR_CODE_OK: 0,
    ERROR_CODE_ERRNO: -1,
};
export const CompressLevel = {
    COMPRESS_LEVEL_NO_COMPRESSION: 0,
    COMPRESS_LEVEL_BEST_SPEED: 1,
    COMPRESS_LEVEL_BEST_COMPRESSION: 9,
    COMPRESS_LEVEL_DEFAULT_COMPRESSION: -1
};
export const CompressStrategy = {
    COMPRESS_STRATEGY_DEFAULT_STRATEGY: 0,
    COMPRESS_STRATEGY_FILTERED: 1,
    COMPRESS_STRATEGY_HUFFMAN_ONLY: 2,
    COMPRESS_STRATEGY_RLE: 3,
    COMPRESS_STRATEGY_FIXED: 4
};
export const Options = {
    level: CompressLevel,
    memLevel: MemLevel,
    strategy: CompressStrategy,
};
export function mockZlib() {  
    const zlib = {
        ErrorCode,
        MemLevel,
        CompressLevel,
        CompressStrategy,
        Options,
        zipFile: function(...args) {
            console.warn("zlib.zipFile interface mocked in the Previewer. How this interface works on the Previewer may be different from that on a real device.")
            return new Promise((resolve) => {
                resolve();
            })
        },

        unzipFile: function(...args) {
            console.warn("zlib.unzipFile interface mocked in the Previewer. How this interface works on the Previewer may be different from that on a real device.")
            return new Promise((resolve) => {
                resolve();
            })
        }
    }
    return zlib;
}