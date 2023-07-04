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

#include <filesystem>

#include "gtest/gtest.h"
#include "ts2abc.h"

using namespace testing;
using namespace testing::ext;
namespace fs = std::filesystem;

namespace ARK::Ts2Abc::Ts2Abc {
    class FunctionTest : public testing::Test {
    public:
        static void SetUpTestCase();
        static void TearDownTestCase();
        void SetUp();
        void TearDown();
    };
            
    Json::Value function = {};

    void FunctionTest::SetUpTestCase() {}
    void FunctionTest::TearDownTestCase() {}
    const void FunctionTest::SetUp()
    {
        std::string file = "../../ark/ts2abc/ts2panda/ts2abc/tests/sources/add.json";
        std::string data = "";
        int ret = HandleJsonFile(file, data);
        EXPECT_EQ(ret, 1);
        Json::Value rootValue;
        ret = ParseJson(data, rootValue);
        EXPECT_EQ(ret, panda::ts2abc::RETURN_SUCCESS);
        function = rootValue["func_body"];
    }
    const void FunctionTest::TearDown() {}

    HWTEST_F(FunctionTest, FunctionTest_GetFunctionDefintion, TestSize.Level0)
    {
        auto pandaFunc = GetFunctionDefintion(function);
        EXPECT_EQ(pandaFunc.name, function["name"].asString());
        EXPECT_EQ(pandaFunc.return_type.GetName(), "any");
        auto signature = function["signature"];
        EXPECT_EQ(pandaFunc.params.size(), signature["params"].asUInt());
        EXPECT_EQ(pandaFunc.regs_num, function["regs_num"].asUInt());
    }
} // namespace ARK::Ts2Abc::Ts2Abc