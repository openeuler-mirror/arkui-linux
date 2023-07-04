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

#include "base64.h"

namespace panda::es2panda::util {
std::string Base64Encode(const std::string &inputString)
{
    size_t strLen = inputString.length();
    size_t encodedStrLen = strLen / TO_TRANSFORM_CHAR_NUM * TRANSFORMED_CHAR_NUM;
    if (strLen % TO_TRANSFORM_CHAR_NUM != 0) {
        encodedStrLen += TRANSFORMED_CHAR_NUM;
    }
    std::string encodedRes = std::string(encodedStrLen, '\0');
    const char* base64CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (size_t i = 0, j = 0; i < encodedRes.length() - 2; i += TRANSFORMED_CHAR_NUM, j += TO_TRANSFORM_CHAR_NUM) {
        // convert three 8bit into four 6bit; then add two 0 bit in each 6 bit
        // former 00 + first 6 bits of the first char
        encodedRes[i] = base64CharSet[(inputString[j] & 0xff) >> 2];
        // 00 + the last 2 bits of the first char + the first 4 bits of the second char
        encodedRes[i + 1] = base64CharSet[(inputString[j] & 0x03) << 4 | (inputString[j + 1] & 0xf0) >> 4];
        // 00 + last 4 bits of the second char + the first 2 bits of the third char
        encodedRes[i + 2] = base64CharSet[(inputString[j + 1] & 0x0f) << 2 | (inputString[j + 2] & 0xc0) >> 6];
        // 00 + the last 6 bits of the third char
        encodedRes[i + 3] = base64CharSet[inputString[j + 2] & 0x3f];
    }
    switch (strLen % TO_TRANSFORM_CHAR_NUM) {
        case 1:
            encodedRes[encodedRes.length() - 2] = '=';
            encodedRes[encodedRes.length() - 1] = '=';
            break;
        case 2:
            encodedRes[encodedRes.length() - 1] = '=';
            break;
        default:
            break;
    }
    return encodedRes;
}

std::string Base64Decode(const std::string &base64String)
{
    const int decodeTable[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1,
        62,   //  '+'
        -1, -1, -1,
        63,   // '/'
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61,   // '0'~'9'
        -1, -1, -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,   // 'A'~'Z'
        -1, -1, -1, -1, -1, -1,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51    // 'a'~'z'
    };

    size_t strLen = base64String.length();
    size_t decodedStrLen = strLen / TRANSFORMED_CHAR_NUM * TO_TRANSFORM_CHAR_NUM;
    if (base64String.find("==") != std::string::npos) {
        decodedStrLen -= std::string("==").length();
    } else if (base64String.find("=") != std::string::npos) {
        decodedStrLen -= std::string("=").length();
    }
    std::string decodedRes = std::string(decodedStrLen, '\0');
    int firstChar = 0;
    int secondChar = 0;
    int thirdChar = 0;
    int fourthChar = 0;
    for (size_t i = 0, j = 0; i < strLen - 2; i += TRANSFORMED_CHAR_NUM, j += TO_TRANSFORM_CHAR_NUM) {
        firstChar = decodeTable[static_cast<unsigned char>(base64String[i])];
        secondChar = decodeTable[static_cast<unsigned char>(base64String[i + 1])];
        thirdChar = decodeTable[static_cast<unsigned char>(base64String[i + 2])];
        fourthChar = decodeTable[static_cast<unsigned char>(base64String[i + 3])];

        if (firstChar == -1 || secondChar == -1) {
            return "";
        }
        // the last 6 bit of the first char + the 2~3 bit of the second char(first 4 bit - 00)
        decodedRes[j] = (firstChar << 2) | (secondChar >> 4);
        if (j == decodedStrLen - 1) {
            break;
        }
        if (thirdChar == -1) {
            return "";
        }
        // the last 4 bit of the second char +  the 2~5 bit of the third char(first 6 bit - 00)
        decodedRes[j + 1] = (secondChar << 4) | (thirdChar >> 2);
        if (j + 1 == decodedStrLen - 1) {
            break;
        }
        if (fourthChar == -1) {
            return "";
        }
        // the last 2 bit of the third char + the last 6 bit of the fourth char
        decodedRes[j + 2] = (thirdChar << 6) | fourthChar;
    }
    return decodedRes;
}
}  // namespace panda::es2panda::util
