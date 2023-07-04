/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef TS2PANDA_TS2ABC_TS2ABC_H_
#define TS2PANDA_TS2ABC_TS2ABC_H_

#include <codecvt>
#include <cstdarg>
#include <iostream>
#include <locale>
#include <string>
#include <unistd.h>

#include "assembly-type.h"
#include "assembly-program.h"
#include "assembly-emitter.h"
#include "json/json.h"

namespace panda::ts2abc {
enum class JsonType {
    FUNCTION = 0,
    RECORD,
    STRING,
    LITERALBUFFER,
    MODULE,
    OPTIONS,
    TYPEINFO,
    RECORDNAME,
    OUTPUTFILENAME,
    INPUTJSONFILECONTENT
};

constexpr int RETURN_SUCCESS = 0;
constexpr int RETURN_FAILED = 1;

enum class OptLevel {
    O_LEVEL0 = 0,
    O_LEVEL1,
    O_LEVEL2
};

bool HandleJsonFile(const std::string &input, std::string &data);
bool GenerateProgram(const std::string &data, const std::string &output, panda::ts2abc::Options options);
bool GenerateProgramsFromPipe(panda::ts2abc::Options options);
bool CompileNpmEntries(const std::string &input, const std::string &output);
bool GetDebugLog();
void ParseLogEnable(const Json::Value &rootValue);
bool GetDebugModeEnabled();
void ParseDebugMode(const Json::Value &rootValue);
std::string ParseString(const std::string &data);
int ParseJson(const std::string &data, Json::Value &rootValue);
panda::pandasm::Function GetFunctionDefintion(const Json::Value &function);
} // namespace panda::ts2abc

#endif // TS2PANDA_TS2ABC_TS2ABC_H_
