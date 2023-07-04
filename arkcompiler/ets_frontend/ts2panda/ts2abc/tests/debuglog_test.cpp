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

#include "gtest/gtest.h"
#include "ts2abc.h"

using namespace testing;
using namespace testing::ext;

namespace ARK::Ts2Abc::Ts2Abc {
    class DebugLogTest : public testing::Test {
    public:
        static void SetUpTestCase();
        static void TearDownTestCase();
        void SetUp();
        void TearDown();
    };

    void DebugLogTest::SetUpTestCase() {}
    void DebugLogTest::TearDownTestCase() {}
    const void DebugLogTest::SetUp() {}
    const void DebugLogTest::TearDown() {}

    HWTEST_F(DebugLogTest, DebugLogTest_True, TestSize.Level0)
    {
        Json::Value rootValue;
        rootValue["log_enabled"] = true;
        ParseLogEnable(rootValue);
        ASSERT_TRUE(GetDebugLog() == true);
    }

    HWTEST_F(DebugLogTest, DebugLogTest_False, TestSize.Level0)
    {
        Json::Value rootValue;
        rootValue["log_enabled"] = false;
        ParseLogEnable(rootValue);
        ASSERT_TRUE(GetDebugLog() == false);
    }
} // namespace ARK::Ts2Abc::Ts2Abc