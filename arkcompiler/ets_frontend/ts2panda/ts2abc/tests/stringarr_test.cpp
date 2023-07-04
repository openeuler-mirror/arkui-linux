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
    class StringArrTest : public testing::Test {
    public:
        static void SetUpTestCase();
        static void TearDownTestCase();
        void SetUp();
        void TearDown();
    };

    void StringArrTest::SetUpTestCase() {}
    void StringArrTest::TearDownTestCase() {}
    const void StringArrTest::SetUp() {}
    const void StringArrTest::TearDown() {}

    HWTEST_F(StringArrTest, StringArrTest_With0, TestSize.Level0)
    {
        std::string input = "Hello 000World";
        std::string expected = "Hello 000World";
        std::string output = ParseString(input);
        EXPECT_EQ(output, expected);
    }

    HWTEST_F(StringArrTest, StringArrTest_HalfUnicodeChar, TestSize.Level0)
    {
        std::string input = "Hello\\UD834World";
        std::string expected = "Hello\\UD834World";
        std::string output = ParseString(input);
        EXPECT_EQ(output, expected);
    }
} // namespace ARK::Ts2Abc::Ts2Abc