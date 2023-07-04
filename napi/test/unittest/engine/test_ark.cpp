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

#include "test.h"

#include "native_engine/impl/ark/ark_native_engine.h"
#include "utils/log.h"

using panda::RuntimeOption;

struct ThreadArgs {
    NativeEngine* engine = nullptr;
    bool initialState = false;
    bool suspendState = false;
    bool resumeState = false;
};

static NativeEngine* g_nativeEngine = nullptr;

NativeEngineTest::NativeEngineTest()
{
    engine_ = g_nativeEngine;
}

NativeEngineTest::~NativeEngineTest()
{}

void *NativeEngineTest::Run(void *args)
{
    ThreadArgs* threadArgs = reinterpret_cast<ThreadArgs*>(args);
    NativeEngine* engine = threadArgs->engine;
    threadArgs->initialState = engine->IsSuspended();
    engine->SuspendVM();
    threadArgs->suspendState = engine->IsSuspended();
    engine->ResumeVM();
    sleep(1);
    threadArgs->resumeState = engine->IsSuspended();
    return nullptr;
}

int main(int argc, char** argv)
{
    testing::GTEST_FLAG(output) = "xml:./";
    testing::InitGoogleTest(&argc, argv);

    // Setup
    RuntimeOption option;
    option.SetGcType(RuntimeOption::GC_TYPE::GEN_GC);
    const int64_t poolSize = 0x1000000;  // 16M
    option.SetGcPoolSize(poolSize);
    option.SetLogLevel(RuntimeOption::LOG_LEVEL::ERROR);
    option.SetDebuggerLibraryPath("");
    EcmaVM* vm = panda::JSNApi::CreateJSVM(option);
    if (vm == nullptr) {
        return 0;
    }

    g_nativeEngine = new ArkNativeEngine(vm, nullptr);

    int ret = testing::UnitTest::GetInstance()->Run();

    g_nativeEngine->Loop(LOOP_NOWAIT);

    delete g_nativeEngine;
    g_nativeEngine = nullptr;
    panda::JSNApi::DestroyJSVM(vm);
    vm = nullptr;

    return ret;
}

HWTEST_F(NativeEngineTest, SuspendVM001, testing::ext::TestSize.Level0)
{
    pthread_t tids;
    struct ThreadArgs *args = new ThreadArgs;
    args->engine = engine_;
    int res = pthread_create(&tids, NULL, Run, (void*)args);
    if (res != 0) {
        std::cout << "thread create failed";
        return;
    }
    for (int i = 0; i < 3; ++i) { // 3:Loop 3 times
        sleep(1);
        engine_->CheckSafepoint();
    }
    ASSERT_TRUE(!args->initialState);
    ASSERT_TRUE(args->suspendState);
    ASSERT_TRUE(!args->resumeState);
    delete args;
    args = nullptr;
}
