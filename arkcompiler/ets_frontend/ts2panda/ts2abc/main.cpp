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

#include "assembly-type.h"
#include "assembly-program.h"
#include "assembly-emitter.h"
#include "json/json.h"
#include "ts2abc_options.h"
#include "ts2abc.h"

int Preprocess(const panda::ts2abc::Options &options, const panda::PandArgParser &argParser, std::string &output,
    std::string &data, const std::string &usage)
{
    std::string input;
    if (!options.GetCompileByPipeArg()) {
        input = options.GetTailArg1();
        output = options.GetTailArg2();
        if (input.empty() || output.empty()) {
            std::cerr << "Incorrect args number" << std::endl;
            std::cerr << "Usage example: ts2abc test.json test.abc"<< std::endl;
            std::cerr << usage << std::endl;
            std::cerr << argParser.GetHelpString();
            return panda::ts2abc::RETURN_FAILED;
        }

        if (!panda::ts2abc::HandleJsonFile(input, data)) {
            return panda::ts2abc::RETURN_FAILED;
        }
    } else {
        output = options.GetTailArg1();
        if (output.empty()) {
            std::cerr << usage << std::endl;
            std::cerr << argParser.GetHelpString();
            return panda::ts2abc::RETURN_FAILED;
        }
    }
    return panda::ts2abc::RETURN_SUCCESS;
}

bool HandleNpmEntries(const panda::ts2abc::Options &options, const panda::PandArgParser &argParser,
                      const std::string &usage)
{
    std::string input = options.GetTailArg1();
    std::string output = options.GetTailArg2();
    if (options.GetCompileByPipeArg() || input.empty() || output.empty()) {
        if (options.GetCompileByPipeArg()) {
            std::cerr << "[compile-npm-entries] and [compile-by-pipe] can not be used simultaneously" << std::endl;
        } else {
            std::cerr << "Incorrect args number" << std::endl;
        }
        std::cerr << "Usage example: js2abc --compile-npm-entries npm_entries.txt npm_entries.abc"<< std::endl;
        std::cerr << usage << std::endl;
        std::cerr << argParser.GetHelpString();
        return false;
    }

    if (!panda::ts2abc::CompileNpmEntries(input, output)) {
        return false;
    }

    return true;
}

int main(int argc, const char *argv[])
{
    panda::PandArgParser argParser;
    panda::Span<const char *> sp(argv, argc);
    panda::ts2abc::Options options(sp[0]);
    options.AddOptions(&argParser);

    if (!argParser.Parse(argc, argv)) {
        std::cerr << argParser.GetErrorString();
        std::cerr << argParser.GetHelpString();
        return panda::ts2abc::RETURN_FAILED;
    }

    std::string usage = "Usage: js2abc [OPTIONS]... [ARGS]...";
    if (options.GetHelpArg()) {
        std::cout << usage << std::endl;
        std::cout << argParser.GetHelpString();
        return panda::ts2abc::RETURN_SUCCESS;
    }

    if (options.GetBcVersionArg() || options.GetBcMinVersionArg()) {
        std::string version = options.GetBcVersionArg() ? panda::panda_file::GetVersion(panda::panda_file::version) :
                              panda::panda_file::GetVersion(panda::panda_file::minVersion);
        std::cout << version << std::endl;
        return panda::ts2abc::RETURN_SUCCESS;
    }

    if (options.GetCompileNpmEntries()) {
        if (!HandleNpmEntries(options, argParser, usage)) {
            return panda::ts2abc::RETURN_FAILED;
        }
        return panda::ts2abc::RETURN_SUCCESS;
    }


    if ((options.GetOptLevelArg() < static_cast<int>(panda::ts2abc::OptLevel::O_LEVEL0)) ||
        (options.GetOptLevelArg() > static_cast<int>(panda::ts2abc::OptLevel::O_LEVEL2))) {
        std::cerr << "Incorrect optimization level value" << std::endl;
        std::cerr << usage << std::endl;
        std::cerr << argParser.GetHelpString();
        return panda::ts2abc::RETURN_FAILED;
    }

    std::string optLogLevel(options.GetOptLogLevelArg());

    if (options.IsMultiProgramsPipe()) {
        if (!panda::ts2abc::GenerateProgramsFromPipe(options)) {
            std::cerr << "call GenerateProgramsFromPipe fail" << std::endl;
            return panda::ts2abc::RETURN_FAILED;
        }
        return panda::ts2abc::RETURN_SUCCESS;
    }

    std::string output;
    std::string data = "";

    if (Preprocess(options, argParser, output, data, usage) == panda::ts2abc::RETURN_FAILED) {
        return panda::ts2abc::RETURN_FAILED;
    }

    if (!panda::ts2abc::GenerateProgram(data, output, options)) {
        std::cerr << "call GenerateProgram fail" << std::endl;
        return panda::ts2abc::RETURN_FAILED;
    }

    return panda::ts2abc::RETURN_SUCCESS;
}
