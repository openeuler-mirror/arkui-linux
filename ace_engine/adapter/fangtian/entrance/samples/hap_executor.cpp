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

#include "adapter/fangtian/entrance/ace_ability.h"
#include "adapter/fangtian/entrance/ace_run_args.h"
#include "adapter/fangtian/entrance/samples/key_input_handler.h"
#include "adapter/fangtian/entrance/samples/touch_event_handler.h"

#include "adapter/fangtian/external/ability/context.h"
#include "adapter/fangtian/external/ability/fa/fa_context.h"
#include "adapter/fangtian/external/ability/stage/stage_context.h"

namespace {

constexpr int32_t GET_INSPECTOR_TREE_TIMES = 12;
constexpr int32_t GET_INSPECTOR_TREE_INTERVAL = 5000;
constexpr char FILE_NAME[] = "InspectorTree.txt";
constexpr char ACE_VERSION_2[] = "2.0";
constexpr char MODEL_STAGE[] = "stage";
constexpr char MAX_ARGS_COUNT = 2;

auto&& renderCallback = [](const void*, const size_t bufferSize, const int32_t width, const int32_t height) -> bool {
    return true;
};

} // namespace
bool GetAceRunArgs(int argc, const char* argv[], OHOS::Ace::Platform::AceRunArgs &args);

int main(int argc, const char* argv[])
{
    OHOS::Ace::LogWrapper::SetLogLevel(OHOS::Ace::LogLevel::DEBUG);
    OHOS::Ace::Platform::AceRunArgs args;
    if (!GetAceRunArgs(argc, argv, args)) {
        std::cout << "Please run in the following format: ./hap_executor packagepath" << std::endl;
        return 0;
    }

    auto ability = OHOS::Ace::Platform::AceAbility::CreateInstance(args);
    if (!ability) {
        std::cerr << "Could not create AceAbility!" << std::endl;
        return -1;
    } else {
        std::cout << "create ability OK" << std::endl;
    }

    // TODO adaptor for fangtian mmi
    // OHOS::Ace::Platform::KeyInputHandler::InitialTextInputCallback(ability->GetGlfwWindowController());
    // OHOS::Ace::Platform::TouchEventHandler::InitialTouchEventCallback(ability->GetGlfwWindowController());
    bool runFlag = true;
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
    ability->InitEnv();
    std::cout << "Ace initialize done. run loop now" << std::endl;
    ability->Start();
    runFlag = false;
    timer.join();
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

    std::string appResourcesPath = "/home/ubuntu/demo/preview/js/AppResources";
    std::string appResourcesPathStage = "/home/ubuntu/demo/preview/js/default_stage";
    std::string systemResourcesPath = "/home/ubuntu/demo/preview/js/SystemResources";

    args.assetPath = happath;
    args.systemResourcesPath = systemResourcesPath;
    args.appResourcesPath = happath;
    args.deviceConfig.orientation = OHOS::Ace::DeviceOrientation::LANDSCAPE;
    args.deviceConfig.density = 1;
    args.deviceConfig.deviceType = OHOS::Ace::DeviceType::TABLET;
    args.windowTitle = "Demo";
    args.deviceWidth = 1920;
    args.deviceHeight = 1080;
    args.onRender = std::move(renderCallback);

    bool stageModel = args.projectModel == OHOS::Ace::Platform::ProjectModel::STAGE;
    auto context = OHOS::Ace::Context::CreateContext(stageModel, args.appResourcesPath);
    CHECK_NULL_RETURN(context, false);
    if (stageModel) {
        args.aceVersion = OHOS::Ace::Platform::AceVersion::ACE_2_0;
        std::cout << "GetSrcLanguage: ets" << std::endl;
    } else {
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
    }

    return true;
}
