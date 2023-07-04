/**
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

#ifndef MERGE_ABC_MERGE_OPTIONS_H
#define MERGE_ABC_MERGE_OPTIONS_H

#include <iostream>
#include <macros.h>
#include <utils/pandargs.h>

namespace panda::proto {
class Options {
public:
    Options();
    NO_COPY_SEMANTIC(Options);
    NO_MOVE_SEMANTIC(Options);
    ~Options();

    bool Parse(int argc, const char **argv);

    const std::string &protoPathInput() const
    {
        return protoPathInput_;
    }

    const std::string &protoBinSuffix() const
    {
        return protoBinSuffix_;
    }

    const std::string &outputFileName() const
    {
        return outputFileName_;
    }

    const std::string &outputFilePath() const
    {
        return outputFilePath_;
    }

    const std::string &ErrorMsg() const
    {
        return errorMsg_;
    }

private:
    panda::PandArgParser *argparser_;
    std::string errorMsg_;
    std::string protoBinSuffix_ {"protoBin"};
    std::string protoPathInput_;
    std::string outputFileName_ {"modules.abc"};
    std::string outputFilePath_;
};
} // panda::proto
#endif
