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

#include "assembler/assembly-function.h"
#include "libpandafile/literal_data_accessor.h"
#include "os/file.h"
#include "options.h"

#include "mergeProgram.h"

#if defined(PANDA_TARGET_WINDOWS)
#include <io.h>
#else
#include <dirent.h>
#endif

#include <fstream>

namespace panda::proto {
bool MergeProgram::GetProtoFiles(const std::string &protoBinPath, const std::string &protoBinSuffix,
                                 std::vector<std::string> &directoryFiles)
{
#if PANDA_TARGET_WINDOWS
    int handle = 0;
    struct _finddata_t fileInfo;
    std::string path;
    if ((handle = _findfirst(path.assign(protoBinPath).append("\\*").c_str(), &fileInfo)) == -1) {
        return false;
    }
    do {
        if (fileInfo.attrib & _A_SUBDIR) {
            if((!strncmp(fileInfo.name, ".", 1)) || (!strncmp(fileInfo.name, "..", 2))) {
                continue;
            }
            if (!GetProtoFiles(path.assign(protoBinPath).append("\\").append(fileInfo.name), protoBinSuffix,
                               directoryFiles)) {
                _findclose(handle);
                return false;
            }
        } else {
            std::string fileName(fileInfo.name);
            if (fileName.substr(fileName.find_last_of(".") + 1).compare(protoBinSuffix) == 0) {
                directoryFiles.emplace_back(path.assign(protoBinPath).append("\\").append(fileName));
            }
        }
    } while (_findnext(handle, &fileInfo) == 0);
    _findclose(handle);
#elif PANDA_TARGET_UNIX
    DIR *protoBin = opendir(protoBinPath.c_str());
    if (protoBin == nullptr) {
        return false;
    }
    dirent *dir = nullptr;
    std::string pathPrefix = protoBinPath + "/";
    while ((dir = readdir(protoBin)) != nullptr) {
        if((!strncmp(dir->d_name, ".", 1)) || (!strncmp(dir->d_name, "..", 2))) {
            continue;
        }
        if (dir->d_type == DT_DIR) {
            std::string subDirName = pathPrefix + dir->d_name;
            if (!GetProtoFiles(subDirName, protoBinSuffix, directoryFiles)) {
                closedir(protoBin);
                return false;
            }
        } else {
            std::string fileName = pathPrefix + dir->d_name;
            if (fileName.substr(fileName.find_last_of(".") + 1).compare(protoBinSuffix) == 0) {
                directoryFiles.emplace_back(fileName);
            }
        }
    }
    closedir(protoBin);
#endif
    return true;
}

bool MergeProgram::AppendProtoFiles(const std::string &filePath, const std::string &protoBinSuffix,
                                    std::vector<std::string> &protoFiles)
{
    auto inputAbs = panda::os::file::File::GetAbsolutePath(filePath);
    if (!inputAbs) {
        std::cerr << "Failed to open: " << filePath << std::endl;
        return false;
    }

    auto fPath = inputAbs.Value();
    if (panda::os::file::File::IsRegularFile(fPath)) {
        if (filePath.substr(filePath.find_last_of(".") + 1).compare(protoBinSuffix) == 0) {
            protoFiles.emplace_back(fPath);
        }
    } else if (panda::os::file::File::IsDirectory(fPath)) {
        std::vector<std::string> directoryFiles;
        if (!GetProtoFiles(fPath, protoBinSuffix, directoryFiles)) {
            return false;
        }
        protoFiles.insert(protoFiles.end(), directoryFiles.begin(), directoryFiles.end());
    } else {
        std::cerr << "The input path: " << fPath << " must be either a regular file or directory." << std::endl;
        return false;
    }

    return true;
}

bool MergeProgram::CollectProtoFiles(std::string &input, const std::string &protoBinSuffix,
                                     std::vector<std::string> &protoFiles)
{
    constexpr const char DOGGY = '@';
    std::vector<std::string> inputs;
    bool isList = false;

    if (input[0] == DOGGY) {
        input.erase(input.begin() + 0);
        isList = true;
    }

    auto inputAbs = panda::os::file::File::GetAbsolutePath(input);
    if (!inputAbs) {
        std::cerr << "Failed to open: " << input << std::endl;
        return false;
    }
    if (isList) {
        std::ifstream in(panda::os::file::File::GetExtendedFilePath(inputAbs.Value()));
        std::string line;
        constexpr const char CARRIAGE = '\r';
        while (getline(in, line)) {
            // erase front spaces
            line.erase(line.begin(),
                       std::find_if(line.begin(), line.end(), [](unsigned char ch) { return std::isspace(ch) == 0; }));
            // erase carrige return symbol (Windows workaround)
            line.erase(std::find_if(line.rbegin(), line.rend(), [](unsigned char ch) { return ch != CARRIAGE; }).base(),
                       line.end());
            if (!line.empty()) {
                inputs.push_back(line);
            }
        }
        in.close();
    } else {
        inputs.push_back(inputAbs.Value());
    }

    protoFiles.reserve(inputs.size());
    for (auto &filePath : inputs) {
        if (!AppendProtoFiles(filePath, protoBinSuffix, protoFiles)) {
            return false;
        }
    }

    return true;
}
} // namespace panda::proto
