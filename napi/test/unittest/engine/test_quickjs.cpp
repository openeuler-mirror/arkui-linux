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

#include "test.h"

#include "quickjs_native_engine.h"

static NativeEngine* g_nativeEngine = nullptr;
static NativeEngine* g_moduleNameNativeEngine = nullptr;

NativeEngineTest::NativeEngineTest()
{
    engine_ = g_nativeEngine;
    moduleNameEngine_ = g_moduleNameNativeEngine;
}

NativeEngineTest::~NativeEngineTest()
{
    printf("NativeEngineTest::~NativeEngineTest \n");
    engine_->RunCleanup();
}

int main(int argc, char** argv)
{
    testing::GTEST_FLAG(output) = "xml:./";
    testing::InitGoogleTest(&argc, argv);

    JSRuntime* rt = JS_NewRuntime();
    if (rt == nullptr) {
        return 0;
    }

    JSContext* ctx = JS_NewContext(rt);
    if (ctx == nullptr) {
        return 0;
    }

    js_std_add_helpers(ctx, 0, nullptr);
    g_nativeEngine = new QuickJSNativeEngine(rt, ctx, 0);  // default instance id 0

    g_moduleNameNativeEngine = new QuickJSNativeEngine(g_nativeEngine->GetNativeEngineImpl(), 0, false);

    NativeModuleManager* moduleManager = g_nativeEngine->GetModuleManager();
    const char* moduleName1 = "ability.featureAbility";
    const char* moduleName2 = "window";
    NativeModule* module1 = moduleManager->LoadNativeModule(moduleName1, nullptr, false);
    if (module1 != nullptr) {
        HILOG_INFO("moduleManager->LoadNativeModule featureability succcess");
        std::string strModuleName1(moduleName1);
        moduleManager->SetNativeEngine(strModuleName1, g_nativeEngine);
        g_nativeEngine->SetModuleFileName(strModuleName1);
    }
    NativeModule* module2 = moduleManager->LoadNativeModule(moduleName2, nullptr, false);
    if (module2 != nullptr) {
        HILOG_INFO("moduleManager->LoadNativeModule window succcess");
        std::string strModuleName2(moduleName2);
        moduleManager->SetNativeEngine(strModuleName2, g_moduleNameNativeEngine);
        g_moduleNameNativeEngine->SetModuleFileName(strModuleName2);
    }

    int ret = RUN_ALL_TESTS();

    g_nativeEngine->DeleteEngine();
    delete g_nativeEngine;
    g_nativeEngine = nullptr;
    delete g_moduleNameNativeEngine;
    g_moduleNameNativeEngine = nullptr;

    js_std_free_handlers(rt);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);

    return ret;
}
