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

#include <fstream>
#include <iostream>
#include <sstream>
#include <thread>
#include <unistd.h>
#include "ace_ability.h"
#include "ace_run_args.h"
#include "samples/key_input_handler.h"
#include "samples/touch_event_handler.h"
#include "adapter/fangtian/external/ability/context.h"
#include "adapter/fangtian/external/ability/fa/fa_context.h"
#include "adapter/fangtian/external/ability/stage/stage_context.h"
#include "display_type.h"
#include "dm/display_manager.h"

namespace {

constexpr int32_t GET_INSPECTOR_TREE_TIMES = 12;
constexpr int32_t GET_INSPECTOR_TREE_INTERVAL = 5000;
#ifdef INSPECTOR_TREE
constexpr char FILE_NAME[] = "InspectorTree.txt";
#endif
constexpr char ACE_VERSION_2[] = "2.0";
constexpr char MODEL_STAGE[] = "stage";
constexpr char MAX_ARGS_COUNT = 2;
constexpr size_t MAX_LEN_PID_NAME = 15;
#ifdef WINDOWS_PLATFORM
constexpr char DELIMITER[] = "\\";
constexpr char ASSET_PATH_SHARE_STAGE[] = "resources\\base\\profile";
#else
constexpr char DELIMITER[] = "/";
constexpr char ASSET_PATH_SHARE_STAGE[] = "resources/base/profile";
#endif

auto&& renderCallback = [](const void*, const size_t bufferSize, const int32_t width, const int32_t height) -> bool {
    return true;
};

} // namespace
extern char **environ;
void SetProcName(int argc, const char* argv[]);
bool GetAceRunArgs(int argc, const char* argv[], OHOS::Ace::Platform::AceRunArgs &args);

int main(int argc, const char* argv[])
{
    OHOS::Ace::LogWrapper::SetLogLevel(OHOS::Ace::LogLevel::DEBUG);
    OHOS::Ace::Platform::AceRunArgs args;
    if (!GetAceRunArgs(argc, argv, args)) {
        std::cout << "Please run in the following format: ./hap_executor packagepath" << std::endl;
        return 0;
    }
    SetProcName(argc, argv);

    auto ability = OHOS::Ace::Platform::AceAbility::CreateInstance(args);
    if (!ability) {
        std::cerr << "Could not create AceAbility!" << std::endl;
        return -1;
    } else {
        std::cout << "create ability OK" << std::endl;
    }

    // TODO adaptor for fangtian mmi
    // OHOS::Ace::Platform::KeyInputHandler::InitialTextInputCallback(ability->GetGlfwWindowController());
    OHOS::Ace::Platform::TouchEventHandler::InitialTouchEventCallback(ability->GetGlfwWindowController());
    bool runFlag = true;
#ifdef INSPECTOR_TREE
    std::thread timer([&ability, &runFlag]() {
        int32_t getJSONTreeTimes = GET_INSPECTOR_TREE_TIMES;
        while (getJSONTreeTimes-- && runFlag) {
            std::this_thread::sleep_for(std::chrono::milliseconds(GET_INSPECTOR_TREE_INTERVAL));
            std::string jsonTreeStr = ability->GetJSONTree();
            // clear all information
            std::ofstream fileCleaner(FILE_NAME, std::ios_base::out);
            std::ofstream fileWriter(FILE_NAME, std::ofstream::app);
            fileWriter << jsonTreeStr;
            fileWriter << std::endl;
            fileWriter.close();
        }
    });
#endif
    ability->InitEnv();
    std::cout << "Ace initialize done. run loop now" << std::endl;
    ability->Start();
    runFlag = false;
#ifdef INSPECTOR_TREE
    timer.join();
#endif
    std::cout << "hap executor exit" << std::endl;
    return 0;
}

bool GetAceRunArgs(int argc, const char* argv[], OHOS::Ace::Platform::AceRunArgs &args)
{
    if (argc < 2) { // ./hap_executor + package path
        return false;
    }

    if (argv == nullptr) {
        return false;
    }

    char realPath[PATH_MAX] = { 0x00 };
    std::string happath(argv[1]);
    if (realpath(happath.c_str(), realPath) == nullptr) {
        LOGE("realpath fail! filePath: %{private}s, fail reason: %{public}s", happath.c_str(), strerror(errno));
        return false;
    }
    std::cout << "hap path: " << realPath << std::endl;
    std::string hapRealPath = realPath;

    std::string faConfigPath = happath + "/config.json";
    std::string stageModulePath = happath + "/module.json";
    if (realpath(stageModulePath.c_str(), realPath) != nullptr) {
        std::cout << "projectModel: STAGE" << std::endl;
        args.projectModel = OHOS::Ace::Platform::ProjectModel::STAGE;
        args.pageProfile = "main_page";
    } else if (realpath(faConfigPath.c_str(), realPath) != nullptr) {
        std::cout << "projectModel: FA" << std::endl;
        args.projectModel = OHOS::Ace::Platform::ProjectModel::FA;
    } else {
        std::cout << "File error, please check the hap file" << std::endl;
        return false;
    }

    std::string assetPath;
    std::string appResourcesPath;
    std::string systemResourcesPath = happath;
    bool stageModel = args.projectModel == OHOS::Ace::Platform::ProjectModel::STAGE;
    if (stageModel) {
        args.aceVersion = OHOS::Ace::Platform::AceVersion::ACE_2_0;
        std::cout << "GetSrcLanguage: ets" << std::endl;
        assetPath = hapRealPath + DELIMITER + "ets";
        appResourcesPath = hapRealPath;
        systemResourcesPath = hapRealPath;
    } else {
        auto context = OHOS::Ace::Context::CreateContext(stageModel, hapRealPath);
        CHECK_NULL_RETURN(context, false);
        auto faContext = OHOS::Ace::AceType::DynamicCast<OHOS::Ace::FaContext>(context);
        CHECK_NULL_RETURN(faContext, false);
        auto hapModuleInfo = faContext->GetHapModuleInfo();
        CHECK_NULL_RETURN(hapModuleInfo, false);
        std::string srcLanguage = hapModuleInfo->GetSrcLanguage();
        if (hapModuleInfo->GetSrcLanguage() == "ets") {
            args.aceVersion = OHOS::Ace::Platform::AceVersion::ACE_2_0;
            std::cout << "GetSrcLanguage: ets" << std::endl;
        } else {
            args.aceVersion = OHOS::Ace::Platform::AceVersion::ACE_1_0;
            std::cout << "GetSrcLanguage: js" << std::endl;
        }
        assetPath = hapRealPath + DELIMITER + "assets" + DELIMITER + "js" + DELIMITER + "MainAbility";
        appResourcesPath = hapRealPath; // unused
        systemResourcesPath = hapRealPath + DELIMITER + "assets" + DELIMITER + "entry";
    }

    args.assetPath = assetPath;
    args.systemResourcesPath = systemResourcesPath;
    args.appResourcesPath = hapRealPath;
    args.deviceConfig.orientation = OHOS::Ace::DeviceOrientation::LANDSCAPE;
    args.deviceConfig.deviceType = OHOS::Ace::DeviceType::PC;
    args.windowTitle = "Demo";
    args.onRender = std::move(renderCallback);

    int32_t width = 800;
    int32_t height = 600;
    auto defaultDisplay = OHOS::Rosen::DisplayManager::GetInstance().GetDefaultDisplay();
    if (defaultDisplay) {
        width = defaultDisplay->GetWidth();
        height = defaultDisplay->GetHeight();
        args.deviceConfig.density = defaultDisplay->GetVirtualPixelRatio();
        LOGI("deviceWidth: %{public}d, deviceHeight: %{public}d, default density: %{public}f",
            args.deviceWidth, args.deviceHeight, args.deviceConfig.density);
    }
    args.deviceWidth = width;
    args.deviceHeight = height;
    args.viewWidth = width;
    args.viewHeight = height;

    std::cout << "args.assetPath : " << args.assetPath << std::endl;
    std::cout << "args.appResourcesPath : " << args.appResourcesPath << std::endl;
    std::cout << "args.systemResourcesPath : " << args.systemResourcesPath << std::endl;
    std::cout << "AppWidth : " << width << "AppHeight : " << height << std::endl;

    return true;
}

std::string Trim(std::string &str)
{
    if (str.empty()) {
        return str;
    }
    str.erase(0, str.find_first_not_of(" "));
    str.erase(str.find_last_not_of(" ") + 1);
    return str;
}

std::vector<std::string> SplitStr(std::string str, std::string spSymbol)
{
    std::vector<std::string> result;
    std::string::size_type i = 0;
    Trim(str);
    std::string::size_type found = str.find(spSymbol);
    if (found != std::string::npos) {
        while (found != std::string::npos) {
            std::string value = str.substr(i, found - i);
            Trim(value);
            if (!value.empty()) {
                result.push_back(value);
            }
            i = found + spSymbol.size();
            found = str.find(spSymbol, i);
        }
        std::string lastv = str.substr(i, str.size() - i);
        Trim(lastv);
        if (!lastv.empty()) {
            result.push_back(lastv);
        }
    }
    return result;
}

void SetProcName(int argc, const char* argv[])
{
    if (argc < 2) { // ./hap_executor + package path + procname
        return;
    }

    std::string procName; 
    if (argc >= 3) {
        procName = argv[2];
    } else {
        std::string happath(argv[1]);
        std::vector<std::string> strVector = SplitStr(happath, DELIMITER);
        auto vectorSize = strVector.size();
        if (vectorSize > 0) {
            procName = strVector[vectorSize - 1];
        } else {
            std::cout << "get name failed!" << std::endl;
            return;
        }
    }
    std::cout << "get procname: "<< procName << std::endl;

    if (procName.size() > MAX_LEN_PID_NAME) {
        procName = procName.substr(0, MAX_LEN_PID_NAME);
    }
    
    int32_t ret = prctl(PR_SET_NAME, procName.c_str());
    if (ret != 0) {
        std::cout << "call the system API prctl failed!" << std::endl;
        return;
    }

    memset(const_cast<char *>(argv[0]), 0, environ[0] - argv[0]);
    std::sprintf(const_cast<char *>(argv[0]), "%s", procName.c_str());

    std::cout << "set procname: "<< procName << std::endl;
    return;
}
