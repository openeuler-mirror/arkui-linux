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

#include "hap_manager_test.h"

#include <gtest/gtest.h>

#include "test_common.h"
#include "utils/string_utils.h"

#define private public

#include "hap_manager.h"

using namespace OHOS::Global::Resource;
using namespace testing::ext;
namespace {
static const int NON_EXIST_ID = 1111;
class HapManagerTest : public testing::Test {
public:
    static void SetUpTestCase(void);

    static void TearDownTestCase(void);

    void SetUp();

    void TearDown();
};

void HapManagerTest::SetUpTestCase(void)
{
    // step 1: input testsuit setup step
    g_logLevel = LOG_DEBUG;
}

void HapManagerTest::TearDownTestCase()
{
    // step 2: input testsuit teardown step
}

void HapManagerTest::SetUp()
{
    // step 3: input testcase setup step
    HILOG_DEBUG("HapManagerTest setup");
}

void HapManagerTest::TearDown()
{
    // step 4: input testcase teardown step
    HILOG_DEBUG("HapManagerTest teardown");
}

/*
 * this test shows how to load a hap, then find value list by id
 * @tc.name: HapManagerFuncTest001
 * @tc.desc: Test AddResourcePath & GetResourceList function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(HapManagerTest, HapManagerFuncTest001, TestSize.Level1)
{
    HapManager *hapManager = new HapManager(new ResConfigImpl);
    bool ret = hapManager->AddResourcePath(FormatFullPath(g_resFilePath).c_str());

    EXPECT_TRUE(ret);

    int id = 16777217;
    std::vector<const HapResource::IdValues *> idValues = hapManager->GetResourceList(id);
    if (idValues.size() == 0) {
        delete hapManager;
        EXPECT_TRUE(false);
        return;
    }

    PrintIdValues(idValues[0]);
    delete hapManager;
}

/*
 * this test shows how to reload a hap
 * @tc.name: HapManagerFuncTest002
 * @tc.desc: Test UpdateResConfig & AddResourcePath function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(HapManagerTest, HapManagerFuncTest002, TestSize.Level1)
{
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    std::string resPath = FormatFullPath(g_resFilePath);
    const char *path = resPath.c_str();
    HapManager *hapManager = new HapManager(new ResConfigImpl);
    if (hapManager == nullptr) {
        delete (rc);
        EXPECT_TRUE(false);
        return;
    }
    hapManager->UpdateResConfig(*rc);
    bool ret = hapManager->AddResourcePath(path);

    EXPECT_TRUE(ret);

    uint32_t id = 16777234; // 16777234 means string_ref
    std::vector<const HapResource::IdValues *> idValues = hapManager->GetResourceList(id);
    if (idValues.size() == 0) {
        delete (hapManager);
        delete (rc);
        EXPECT_TRUE(false);
        return;
    }

    EXPECT_EQ(static_cast<size_t>(1), idValues[0]->GetLimitPathsConst().size());
    PrintIdValues(idValues[0]);

    // reload

    ResConfig *rc2 = CreateResConfig();
    if (rc2 == nullptr) {
        delete (hapManager);
        delete (rc);
        EXPECT_TRUE(false);
        return;
    }

    rc2->SetLocaleInfo("zh", nullptr, "CN");
    hapManager->UpdateResConfig(*rc2);
    do {
        idValues = hapManager->GetResourceList(id);
        if (idValues.size() == 0) {
            EXPECT_TRUE(false);
            break;
        }

        EXPECT_EQ(static_cast<size_t>(2), idValues[0]->GetLimitPathsConst().size());

        PrintIdValues(idValues[0]);
    } while (false);
    delete (hapManager);
    delete (rc2);
    delete (rc);
}

/*
 * this test shows how to load resources from hap, then find value list by id
 * @tc.name: HapManagerFuncTest003
 * @tc.desc: Test AddResourcePath & GetResourceList function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(HapManagerTest, HapManagerFuncTest003, TestSize.Level1)
{
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    HapManager *hapManager = new HapManager(new ResConfigImpl);
    hapManager->UpdateResConfig(*rc);
    if (hapManager == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    bool ret = hapManager->AddResourcePath(FormatFullPath(g_hapPath).c_str());

    EXPECT_TRUE(ret);

    int id = 16777219; // 16777219 means 'aboutPage_title_primary'
    std::vector<const HapResource::IdValues *> idValues = hapManager->GetResourceList(id);
    if (idValues.size() == 0) {
        delete hapManager;
        EXPECT_TRUE(false);
        return;
    }
    PrintIdValues(idValues[0]);

    idValues = hapManager->GetResourceList(NON_EXIST_ID);
    if (idValues.size() == 0) {
        delete hapManager;
        EXPECT_TRUE(true);
        return;
    }
    delete hapManager;
}

/*
 * this test shows how to load resources from hap, then find value list by id
 * @tc.name: HapManagerFuncTest004
 * @tc.desc: Test AddResourcePath & GetResourceList function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(HapManagerTest, HapManagerFuncTest004, TestSize.Level1)
{
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    HapManager *hapManager = new HapManager(new ResConfigImpl);
    hapManager->UpdateResConfig(*rc);
    if (hapManager == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    bool ret = hapManager->AddResourcePath(FormatFullPath(g_hapPath).c_str());
    EXPECT_TRUE(ret);
    int id = 16777219; // 16777219 means 'AboutPageFA' 'aboutPage_title_primary'
    std::vector<const HapResource::IdValues *> idValues = hapManager->GetResourceList(id);
    if (idValues.size() == 0) {
        delete hapManager;
        EXPECT_TRUE(false);
        return;
    }
    PrintIdValues(idValues[0]);

    idValues = hapManager->GetResourceList(NON_EXIST_ID);
    if (idValues.size() == 0) {
        delete hapManager;
        EXPECT_TRUE(true);
        return;
    }
    delete hapManager;
}
}