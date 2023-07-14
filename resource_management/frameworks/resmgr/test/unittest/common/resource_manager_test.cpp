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

#include "resource_manager_test.h"

#include <climits>
#include <cstring>
#include <gtest/gtest.h>
#define private public

#include "res_config.h"
#include "resource_manager.h"
#include "resource_manager_impl.h"
#include "test_common.h"
#include "utils/errors.h"
#include "utils/string_utils.h"
#include "utils/utils.h"

using namespace OHOS::Global::Resource;
using namespace testing::ext;
namespace {
static const int NON_EXIST_ID = 1111;

static const char *g_nonExistName = "non_existent_name";

static const char *g_colorModeResFilePath = "colormode/assets/entry/resources.index";

static const char *g_mccMncResFilePath = "mccmnc/assets/entry/resources.index";

static const char *g_systemResFilePath = "system/assets/entry/resources.index";

static const char *g_overlayResFilePath = "overlay/assets/entry/resources.index";

class ResourceManagerTest : public testing::Test {
public:
    static void SetUpTestCase(void);

    static void TearDownTestCase(void);

    void SetUp();

    void TearDown();

    ResourceManagerTest() : rm(nullptr)
    {}

    ~ResourceManagerTest()
    {}

public:
    ResourceManager *rm;

    int GetResId(std::string name, ResType resType) const;

    void TestStringByName(const char *name, const char *cmp) const;

    void TestStringById(const char *name, const char *cmp) const;

    void TestPluralStringById(int quantity, const char *cmp, bool format = false) const;

    void TestPluralStringByName(int quantity, const char *cmp, bool format = false) const;

    void TestGetRawFilePathByName(const std::string &name, const std::string &cmp) const;

    void AddResource(const char *language, const char *script, const char *region);

    void AddColorModeResource(DeviceType deviceType, ColorMode colorMode, float screenDensity) const;

    void AddHapResource(const char *language, const char *script, const char *region);

    void TestGetStringArrayById(const char *name) const;

    void TestGetStringArrayByName(const char *name) const;

    void TestGetStringFormatById(const char *name, const char *cmp) const;

    void TestGetStringFormatByName(const char *name, const char *cmp) const;

    void TestGetPatternById(const char *name) const;

    void TestGetPatternByName(const char *name) const;

    void TestGetThemeById(const char *name) const;

    void TestGetThemeByName(const char *appTheme, const char *testTheme) const;

    void TestGetBooleanByName(const char *boolean1, const char *booleanRef) const;

    void TestGetBooleanById(const char *boolean1, const char *booleanRef) const;

    void TestGetIntegerByName(const char* integer1, const char* integerRef) const;

    void TestGetIntegerById(const char* integer1, const char* integerRef) const;

    void TestGetFloatByName(const char* touchTarget, const char* floatRef) const;

    void TestGetFloatById(const char* touchTarget, const char* floatRef) const;

    void TestGetIntArrayById(const char* intarray1) const;

    void TestGetIntArrayByName(const char* intarray1) const;

    void TestGetProfileById(HapResource *tmp) const;

    void TestGetProfileByName(HapResource *tmp) const;

    void TestGetMediaWithDensityById(HapResource *tmp) const;

    void TestGetMediaById(HapResource *tmp) const;

    void TestGetMediaWithDensityByName(HapResource *tmp) const;

    void TestGetMediaByName(HapResource *tmp) const;
};

void ResourceManagerTest::SetUpTestCase(void)
{
    // step 1: input testsuit setup step
    g_logLevel = LOG_DEBUG;
}

void ResourceManagerTest::TearDownTestCase(void)
{
    // step 2: input testsuit teardown step
}

void ResourceManagerTest::SetUp(void)
{
    this->rm = CreateResourceManager();
}

void ResourceManagerTest::TearDown(void)
{
    delete this->rm;
}

int ResourceManagerTest::GetResId(std::string name, ResType resType) const
{
    auto idv = ((ResourceManagerImpl *)rm)->hapManager_->GetResourceListByName(name.c_str(), resType);
    if (idv.size() == 0) {
        return -1;
    }

    PrintIdValues(idv[0]);
    if (idv[0]->GetLimitPathsConst().size() > 0) {
        return idv[0]->GetLimitPathsConst()[0]->GetIdItem()->id_;
    }
    return OBJ_NOT_FOUND;
}

void ResourceManagerTest::TestStringByName(const char *name, const char *cmp) const
{
    RState rState;
    std::string outValue;
    rState = rm->GetStringByName(name, outValue);
    ASSERT_EQ(SUCCESS, rState);
    HILOG_DEBUG("%s : %s", name, outValue.c_str());
    ASSERT_EQ(std::string(cmp), outValue);
}

void ResourceManagerTest::TestStringById(const char *name, const char *cmp) const
{
    RState rState;
    std::string outValue;
    int id = GetResId(name, ResType::STRING);
    ASSERT_TRUE(id > 0);
    rState = rm->GetStringById(id, outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(std::string(cmp), outValue);
}

void ResourceManagerTest::AddResource(const char *language, const char *script, const char *region)
{
    if (language != nullptr || region != nullptr) {
        auto rc = CreateResConfig();
        if (rc == nullptr) {
            EXPECT_TRUE(false);
            return;
        }
        rc->SetLocaleInfo(language, script, region);
        rm->UpdateResConfig(*rc);
        delete rc;
    }
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
}

void ResourceManagerTest::AddHapResource(const char *language, const char *script, const char *region)
{
    if (language != nullptr || region != nullptr) {
        auto rc = CreateResConfig();
        if (rc == nullptr) {
            EXPECT_TRUE(false);
            return;
        }
        rc->SetLocaleInfo(language, script, region);
        rm->UpdateResConfig(*rc);
        delete rc;
    }
    bool ret = rm->AddResource(FormatFullPath(g_hapPath).c_str());
    ASSERT_TRUE(ret);
}

void ResourceManagerTest::AddColorModeResource(DeviceType deviceType, ColorMode colorMode,
                                               float screenDensity) const
{
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, nullptr);
    rc->SetDeviceType(deviceType);
    rc->SetColorMode(colorMode);
    rc->SetScreenDensity(screenDensity);
    rm->UpdateResConfig(*rc);
    delete rc;
    bool ret = rm->AddResource(FormatFullPath(g_colorModeResFilePath).c_str());
    ASSERT_TRUE(ret);
}

void ResourceManagerTest::TestPluralStringById(int quantity, const char *cmp, bool format) const
{
    RState ret;
    std::string outValue;
    int id = GetResId("eat_apple", ResType::PLURALS);
    ASSERT_TRUE(id > 0);
    if (format) {
        ret = rm->GetPluralStringByIdFormat(outValue, id, quantity, quantity);
    } else {
        ret = rm->GetPluralStringById(id, quantity, outValue);
    }

    ASSERT_EQ(SUCCESS, ret);
    ASSERT_EQ(std::string(cmp), outValue);
}

void ResourceManagerTest::TestPluralStringByName(int quantity, const char *cmp, bool format) const
{
    RState ret;
    std::string outValue;
    const char *name = "eat_apple";
    if (format) {
        ret = rm->GetPluralStringByNameFormat(outValue, name, quantity, quantity);
    } else {
        ret = rm->GetPluralStringByName(name, quantity, outValue);
    }

    ASSERT_EQ(SUCCESS, ret);
    ASSERT_EQ(std::string(cmp), outValue);
}

void ResourceManagerTest::TestGetRawFilePathByName(const std::string &name, const std::string &cmp) const
{
    std::string outValue;
    rm->GetRawFilePathByName(name, outValue);
    HILOG_DEBUG("%s : %s", name.c_str(), outValue.c_str());
    ASSERT_EQ(cmp, outValue);
}

void ResourceManagerTest::TestGetProfileById(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/base/profile/test_profile.json");

    std::string outValue;
    RState state;
    int id = GetResId("test_profile", ResType::PROF);
    EXPECT_TRUE(id > 0);
    state = rm->GetProfileById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetProfileByName(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/base/profile/test_profile.json");

    std::string outValue;
    RState state;
    state = rm->GetProfileByName("test_profile", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetMediaById(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/base/media/icon1.png");

    std::string outValue;
    RState state;
    int id = GetResId("icon1", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetMediaWithDensityById(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetMediaByName(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/base/media/icon1.png");

    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon1", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetMediaWithDensityByName(HapResource *tmp) const
{
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 120;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

void ResourceManagerTest::TestGetStringFormatById(const char *name, const char *cmp) const
{
    int id = GetResId(name, ResType::STRING);
    ASSERT_TRUE(id > 0);
    std::string outValue;
    RState state = rm->GetStringFormatById(outValue, id, 101);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(cmp, outValue);
}

void ResourceManagerTest::TestGetStringFormatByName(const char *name, const char *cmp) const
{
    std::string outValue;
    RState state;
    state = rm->GetStringFormatByName(outValue, name, 101);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(cmp, outValue);
}

void ResourceManagerTest::TestGetStringArrayById(const char *name) const
{
    std::vector<std::string> outValue;
    int id = GetResId(name, ResType::STRINGARRAY);
    RState state;
    state = rm->GetStringArrayById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(4), outValue.size());
    PrintVectorString(outValue);
}

void ResourceManagerTest::TestGetStringArrayByName(const char *name) const
{
    std::vector<std::string> outValue;
    RState state;
    state = rm->GetStringArrayByName(name, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(4), outValue.size());
    PrintVectorString(outValue);
}

void ResourceManagerTest::TestGetPatternById(const char *name) const
{
    std::map<std::string, std::string> outValue;
    int id = GetResId(name, ResType::PATTERN);
    RState state;
    state = rm->GetPatternById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(3), outValue.size());
    PrintMapString(outValue);
}

void ResourceManagerTest::TestGetPatternByName(const char *name) const
{
    std::map<std::string, std::string> outValue;
    RState state;
    state = rm->GetPatternByName(name, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(3), outValue.size());
    PrintMapString(outValue);
}

void ResourceManagerTest::TestGetThemeById(const char *name) const
{
    std::map<std::string, std::string> outValue;
    RState state;
    int id = GetResId(name, ResType::THEME);
    ASSERT_TRUE(id > 0);
    state = rm->GetThemeById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
}

void ResourceManagerTest::TestGetThemeByName(const char *appTheme, const char *testTheme) const
{
    std::map<std::string, std::string> outValue;
    RState state;
    state = rm->GetThemeByName(appTheme, outValue);
    ASSERT_EQ(SUCCESS, state);
    PrintMapString(outValue);

    state = rm->GetThemeByName(testTheme, outValue);
    ASSERT_EQ(SUCCESS, state);
}

void ResourceManagerTest::TestGetBooleanById(const char* boolean1, const char* booleanRef) const
{
    bool outValue = true;
    RState state;
    int id = GetResId(boolean1, ResType::BOOLEAN);
    ASSERT_TRUE(id > 0);
    state = rm->GetBooleanById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_TRUE(outValue);

    id = GetResId(booleanRef, ResType::BOOLEAN);
    ASSERT_TRUE(id > 0);
    state = rm->GetBooleanById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_TRUE(outValue);
}

void ResourceManagerTest::TestGetBooleanByName(const char* boolean1, const char* booleanRef) const
{
    bool outValue = true;
    RState state;
    state = rm->GetBooleanByName(boolean1, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_TRUE(outValue);

    state = rm->GetBooleanByName(booleanRef, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_TRUE(outValue);
}

void ResourceManagerTest::TestGetIntegerById(const char* integer1, const char* integerRef) const
{
    int outValue;
    RState state;
    int id = GetResId(integer1, ResType::INTEGER);
    ASSERT_TRUE(id > 0);
    state = rm->GetIntegerById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(101, outValue);

    id = GetResId(integerRef, ResType::INTEGER);
    ASSERT_TRUE(id > 0);
    state = rm->GetIntegerById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(101, outValue);
}

void ResourceManagerTest::TestGetIntegerByName(const char* integer1, const char* integerRef) const
{
    int outValue;
    RState state;
    state = rm->GetIntegerByName(integer1, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(101, outValue);

    state = rm->GetIntegerByName(integerRef, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(101, outValue);
}

void ResourceManagerTest::TestGetFloatById(const char* touchTarget, const char* floatRef) const
{
    float outValue;
    RState state;
    int id = GetResId(touchTarget, ResType::FLOAT);
    ASSERT_TRUE(id > 0);
    state = rm->GetFloatById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(48, outValue); // 48vp

    std::string unit;
    state = rm->GetFloatById(id, outValue, unit);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(48, outValue); // 48vp
    EXPECT_EQ("vp", unit);

    id = GetResId(floatRef, ResType::FLOAT);
    ASSERT_TRUE(id > 0);
    state = rm->GetFloatById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(707, outValue); // 707vp
}

void ResourceManagerTest::TestGetFloatByName(const char* touchTarget, const char* floatRef) const
{
    float outValue;
    RState state;
    state = rm->GetFloatByName(touchTarget, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(48, outValue); // 48vp

    std::string unit;
    state = rm->GetFloatByName(touchTarget, outValue, unit);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(48, outValue); // 48vp
    EXPECT_EQ("vp", unit);

    state = rm->GetFloatByName(floatRef, outValue);
    ASSERT_EQ(SUCCESS, state);
    EXPECT_EQ(707, outValue); // 707vp
}

void ResourceManagerTest::TestGetIntArrayById(const char* intarray1) const
{
    std::vector<int> outValue;
    RState state;
    int id = GetResId(intarray1, ResType::INTARRAY);
    EXPECT_TRUE(id > 0);
    state = rm->GetIntArrayById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(3), outValue.size());
    EXPECT_EQ(100, outValue[0]);
    EXPECT_EQ(200, outValue[1]);
    EXPECT_EQ(101, outValue[2]);
}

void ResourceManagerTest::TestGetIntArrayByName(const char* intarray1) const
{
    std::vector<int> outValue;
    RState state;
    state = rm->GetIntArrayByName(intarray1, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(3), outValue.size());
    EXPECT_EQ(100, outValue[0]);
    EXPECT_EQ(200, outValue[1]);
    EXPECT_EQ(101, outValue[2]);
}

/*
 * @tc.name: ResourceManagerAddResourceTest001
 * @tc.desc: Test AddResource function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest001, TestSize.Level1)
{
    // success cases
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
};

/*
 * @tc.name: ResourceManagerAddResourceTest002
 * @tc.desc: Test AddResource function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest002, TestSize.Level1)
{
    // error cases
    // file not exist
    bool ret = rm->AddResource("/data/test/do_not_exist.resources");
    ASSERT_TRUE(!ret);
}

/*
 * @tc.name: ResourceManagerAddResourceTest003
 * @tc.desc: Test AddResource function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest003, TestSize.Level1)
{
    // error cases
    // reload the same path
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(!ret);
}

/*
 * @tc.name: ResourceManagerAddResourceTest004
 * @tc.desc: Test AddResource function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest004, TestSize.Level1)
{
    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl *)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);
}

/*
 * @tc.name: ResourceManagerAddResourceTest005
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest005, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl*)rm)->AddResource("notexist/resources.index", overlayPaths);
    ASSERT_FALSE(ret);
}

/*
 * @tc.name: ResourceManagerAddResourceTest006
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceTest006, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath("notexist/resources.index"));
    bool ret = ((ResourceManagerImpl*)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_FALSE(ret);
}

/*
 * @tc.name: ResourceManagerUpdateResConfigTest001
 * @tc.desc: Test UpdateResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUpdateResConfigTest001, TestSize.Level1)
{
    // success cases
    RState state;
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rc->SetDeviceType(DeviceType::DEVICE_CAR);
    state = rm->UpdateResConfig(*rc);
    delete rc;
    EXPECT_EQ(SUCCESS, state);
}

/*
 * @tc.name: ResourceManagerUpdateResConfigTest002
 * @tc.desc: Test UpdateResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUpdateResConfigTest002, TestSize.Level1)
{
    // error cases
    RState state;
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    state = rm->UpdateResConfig(*rc);
    delete rc;
    EXPECT_EQ(LOCALEINFO_IS_NULL, state);
}

/*
 * @tc.name: ResourceManagerUpdateResConfigTest003
 * @tc.desc: Test UpdateResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUpdateResConfigTest003, TestSize.Level1)
{
    // error cases
    RState state;
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo(nullptr, nullptr, "US");
    state = rm->UpdateResConfig(*rc);
    delete rc;
    EXPECT_EQ(LOCALEINFO_IS_NULL, state);
}

/*
 * load a hap, defaultConfig set to en, then switch to zh
 * @tc.name: ResourceManagerUpdateResConfigTest004
 * @tc.desc: Test UpdateResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUpdateResConfigTest004, TestSize.Level1)
{
    // success case
    bool ret = true;
    RState state;
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    state = rm->UpdateResConfig(*rc);
    EXPECT_EQ(SUCCESS, state);
    ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    if (!ret) {
        EXPECT_TRUE(false);
        delete rc;
        return;
    }
    // update to another language, will trigger reload
    // before reload:
    TestStringByName("app_name", "App Name");

    rc->SetLocaleInfo("zh", nullptr, nullptr);
    state = rm->UpdateResConfig(*rc);
    delete rc;
    EXPECT_EQ(SUCCESS, state);
    // after reload:
    TestStringByName("app_name", "应用名称");
}

/*
 * @tc.name: ResourceManagerUpdateResConfigTest005
 * @tc.desc: Test UpdateResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUpdateResConfigTest005, TestSize.Level1)
{
    // error case
    AddResource("zh", nullptr, nullptr);

    // make a fake hapResource, then reload will fail
    HapResource *hapResource = new HapResource("/data/test/non_exist", 0, nullptr, nullptr);
    ((ResourceManagerImpl *)rm)->hapManager_->hapResources_.push_back(hapResource);
    ((ResourceManagerImpl *)rm)->hapManager_->loadedHapPaths_["/data/test/non_exist"] = std::vector<std::string>();
    RState state;
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    state = rm->UpdateResConfig(*rc);
    delete rc;
    EXPECT_EQ(HAP_INIT_FAILED, state);
}

/*
 * @tc.name: ResourceManagerGetResConfigTest001
 * @tc.desc: Test GetResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetResConfigTest001, TestSize.Level1)
{
    // success cases
    ResConfigImpl rc;
    rm->GetResConfig(rc);
#ifdef SUPPORT_GRAPHICS
    EXPECT_EQ(nullptr, rc.GetLocaleInfo());
#endif
    EXPECT_EQ(DIRECTION_NOT_SET, rc.GetDirection());
    EXPECT_EQ(SCREEN_DENSITY_NOT_SET, rc.GetScreenDensity());
    EXPECT_EQ(DEVICE_NOT_SET, rc.GetDeviceType());
}

/*
 * @tc.name: ResourceManagerGetResConfigTest002
 * @tc.desc: Test GetResConfig function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetResConfigTest002, TestSize.Level1)
{
    // success cases
    RState state;
    {
        ResConfig *rc = CreateResConfig();
        if (rc == nullptr) {
            EXPECT_TRUE(false);
            return;
        }
        rc->SetLocaleInfo("en", nullptr, "US");
        rc->SetDeviceType(DeviceType::DEVICE_CAR);
        state = rm->UpdateResConfig(*rc);
        delete rc;
        EXPECT_EQ(SUCCESS, state);
    }

    ResConfigImpl rc;
    rm->GetResConfig(rc);
#ifdef SUPPORT_GRAPHICS
    EXPECT_EQ("en", std::string(rc.GetLocaleInfo()->getLanguage()));
#endif
    EXPECT_EQ(DEVICE_CAR, rc.GetDeviceType());
}

/*
 * @tc.name: ResourceManagerGetStringByIdTest001
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdTest001, TestSize.Level1)
{
    AddResource("en", nullptr, nullptr);

    TestStringById("app_name", "App Name");

    TestStringById("copyright_text", "XXXXXX All rights reserved. ©2011-2019");

    TestStringById("string_ref", "XXXXXX All rights reserved. ©2011-2019");

    TestStringById("string_ref2", "XXXXXX All rights reserved. ©2011-2019");
}

/*
 * @tc.name: ResourceManagerGetStringByIdTest002
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestStringById("app_name", "应用名称");

    TestStringById("copyright_text", "版权所有 ©2011-2019 XXXX有限公司保留一切权利");

    TestStringById("string_ref", "$aaaaa");

    TestStringById("string_ref2", "$aaaaa");
}

/*
 * @tc.name: ResourceManagerGetStringByIdTest003
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdTest003, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::string outValue;
    RState state = rm->GetStringById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetStringByIdTest004
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdTest004, TestSize.Level1)
{
    AddResource("en", nullptr, nullptr);

    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl*)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);
    TestStringById("ohos_app_name", "SystemOverlay");
}

/*
 * @tc.name: ResourceManagerGetStringByIdTest005
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdTest005, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl*)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);
    TestStringById("ohos_lab_answer_call", "overlay接听电话");
}

/*
 * @tc.name: ResourceManagerGetStringByNameTest001
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameTest001, TestSize.Level1)
{
    AddResource("en", nullptr, nullptr);

    TestStringByName("app_name", "App Name");

    TestStringByName("copyright_text", "XXXXXX All rights reserved. ©2011-2019");

    TestStringByName("string_ref", "XXXXXX All rights reserved. ©2011-2019");

    TestStringByName("string_ref2", "XXXXXX All rights reserved. ©2011-2019");
}

/*
 * @tc.name: ResourceManagerGetStringByNameTest002
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestStringByName("app_name", "应用名称");

    TestStringByName("copyright_text", "版权所有 ©2011-2019 XXXX有限公司保留一切权利");

    TestStringByName("string_ref", "$aaaaa");

    TestStringByName("string_ref2", "$aaaaa");
}

/*
 * @tc.name: ResourceManagerGetStringByNameTest003
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameTest003, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::string outValue;
    RState state = rm->GetStringByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetStringByNameTest004
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameTest004, TestSize.Level1)
{
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_VERTICAL);
    rm->UpdateResConfig(*rc);
    delete rc;
    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl *)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);
    std::string outValue;
    ((ResourceManagerImpl *)rm)->GetStringByName("ohos_desc_camera", outValue);
    ASSERT_EQ(outValue, "允许应用拍摄照片和视频。");
}

/*
 * @tc.name: ResourceManagerGetStringByNameTest005
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameTest005, TestSize.Level1)
{
    AddResource("en", nullptr, nullptr);
    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl *)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);
    std::string outValue;
    ((ResourceManagerImpl *)rm)->GetStringByName("hello", outValue);
    ASSERT_EQ(outValue, "Helloooo");
}

/*
 * @tc.name: ResourceManagerGetStringFormatByIdTest001
 * @tc.desc: Test GetStringFormatById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    const char *name = "app_name";
    int id = GetResId(name, ResType::STRING);
    ASSERT_TRUE(id > 0);
    std::string outValue;
    RState state = rm->GetStringFormatById(outValue, id, 101);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ("应用名称", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringFormatByIdTest002
 * @tc.desc: Test GetStringFormatById function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::string outValue;
    RState state = rm->GetStringFormatById(outValue, NON_EXIST_ID, 101);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetStringFormatByNameTest001
 * @tc.desc: Test GetStringFormatByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    const char *name = "app_name";
    std::string outValue;
    RState state = rm->GetStringFormatByName(outValue, name, 101);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ("应用名称", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringFormatByNameTest002
 * @tc.desc: Test GetStringFormatByName function
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::string outValue;
    RState state = rm->GetStringFormatByName(outValue, g_nonExistName, 101);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetStringArrayByIdTest001
 * @tc.desc: Test GetStringArrayById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestGetStringArrayById("size");
}

/*
 * @tc.name: ResourceManagerGetStringArrayByIdTest002
 * @tc.desc: Test GetStringArrayById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    RState state;
    // error case
    // not found case
    std::vector<std::string> outValue;
    state = rm->GetStringArrayById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetStringArrayByNameTest001
 * @tc.desc: Test GetStringArrayByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestGetStringArrayByName("size");
}

/*
 * @tc.name: ResourceManagerGetStringArrayByNameTest002
 * @tc.desc: Test GetStringArrayByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    RState state;
    // error case
    // not found case
    std::vector<std::string> outValue;
    state = rm->GetStringArrayByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPatternByIdTest001
 * @tc.desc: Test GetPatternById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestGetPatternById("base");
}

/*
 * @tc.name: ResourceManagerGetPatternByIdTest002
 * @tc.desc: Test GetPatternById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    int id;
    std::map<std::string, std::string> outValue;
    RState state;

    id = GetResId("child", ResType::PATTERN);
    state = rm->GetPatternById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(4), outValue.size());
    PrintMapString(outValue);
}

/*
 * @tc.name: ResourceManagerGetPatternByIdTest003
 * @tc.desc: Test GetPatternById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByIdTest003, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    int id;
    std::map<std::string, std::string> outValue;
    RState state;

    id = GetResId("ccchild", ResType::PATTERN);
    state = rm->GetPatternById(id, outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(5), outValue.size());
    PrintMapString(outValue);
}

/*
 * @tc.name: ResourceManagerGetPatternByIdTest004
 * @tc.desc: Test GetPatternById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByIdTest004, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::map<std::string, std::string> outValue;
    RState state;

    // not found case
    state = rm->GetPatternById(NON_EXIST_ID, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPatternByNameTest001
 * @tc.desc: Test GetPatternByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    TestGetPatternByName("base");
}

/*
 * @tc.name: ResourceManagerGetPatternByNameTest002
 * @tc.desc: Test GetPatternByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::map<std::string, std::string> outValue;
    RState state;

    state = rm->GetPatternByName("child", outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(4), outValue.size());
    PrintMapString(outValue);
}

/*
 * @tc.name: ResourceManagerGetPatternByNameTest003
 * @tc.desc: Test GetPatternByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByNameTest003, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::map<std::string, std::string> outValue;
    RState state;

    state = rm->GetPatternByName("ccchild", outValue);
    ASSERT_EQ(SUCCESS, state);
    ASSERT_EQ(static_cast<size_t>(5), outValue.size());
    PrintMapString(outValue);
}

/*
 * @tc.name: ResourceManagerGetPatternByNameTest004
 * @tc.desc: Test GetPatternByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByNameTest004, TestSize.Level1)
{
    AddResource("zh", nullptr, nullptr);

    std::map<std::string, std::string> outValue;
    RState state;

    // not found case
    state = rm->GetPatternByName(g_nonExistName, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdTest001
 * @tc.desc: Test GetPluralStringById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdTest001, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    int quantity = 1;
    TestPluralStringById(quantity, "%d apple", false);

    quantity = 101;
    TestPluralStringById(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdTest002
 * @tc.desc: Test GetPluralStringById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringById(quantity, "%d apples", false);

    quantity = 101;
    TestPluralStringById(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdTest003
 * @tc.desc: Test GetPluralStringById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdTest003, TestSize.Level1)
{
    AddResource("pl", nullptr, "PL");

    int quantity = 1;
    TestPluralStringById(quantity, "1 jabłko");

    quantity = 2;
    TestPluralStringById(quantity, "%d jabłka");

    quantity = 23;
    TestPluralStringById(quantity, "%d jabłka");

    quantity = 12;
    TestPluralStringById(quantity, "%d jabłek");
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdTest004
 * @tc.desc: Test GetPluralStringById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdTest004, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    int quantity = 0;
    TestPluralStringById(quantity, "zero-0");
    quantity = 1;
    TestPluralStringById(quantity, "one-1");
    quantity = 2;
    TestPluralStringById(quantity, "two-2");
    quantity = 5;
    TestPluralStringById(quantity, "few-%d");
    quantity = 12;
    TestPluralStringById(quantity, "many-%d");
    quantity = 500;
    TestPluralStringById(quantity, "other-%d");
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdTest005
 * @tc.desc: Test GetPluralStringById function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdTest005, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    RState state;
    std::string outValue;
    state = rm->GetPluralStringById(NON_EXIST_ID, 1, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameTest001
 * @tc.desc: Test GetPluralStringByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameTest001, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    int quantity = 1;
    TestPluralStringByName(quantity, "%d apple", false);

    quantity = 101;
    TestPluralStringByName(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameTest002
 * @tc.desc: Test GetPluralStringByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameTest002, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    RState state;
    std::string outValue;
    state = rm->GetPluralStringByName(g_nonExistName, 1, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFormatTest001
 * @tc.desc: Test GetPluralStringByIdFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFormatTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringById(quantity, "1 apples", true);

    quantity = 101;
    TestPluralStringById(quantity, "101 apples", true);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFormatTest002
 * @tc.desc: Test GetPluralStringByIdFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFormatTest002, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    RState state;
    std::string outValue;
    state = rm->GetPluralStringByIdFormat(outValue, NON_EXIST_ID, 1, 1);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFormatTest003
 * @tc.desc: Test GetPluralStringByIdFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFormatTest003, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    RState state;
    std::string outValue;
    int id = GetResId("app_name", ResType::STRING);
    state = rm->GetPluralStringByIdFormat(outValue, id, 1, 1);
    ASSERT_EQ(ERROR_CODE_RES_NOT_FOUND_BY_ID, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFormatTest004
 * @tc.desc: Test GetPluralStringByIdFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFormatTest004, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    RState state;
    std::string outValue;
    int quantity = 1;
    int id = GetResId("eat_apple", ResType::PLURALS);
    state = rm->GetPluralStringByIdFormat(outValue, id, quantity);
    ASSERT_EQ(ERROR_CODE_RES_REF_TOO_MUCH, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFormatTest001
 * @tc.desc: Test GetPluralStringByNameFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFormatTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringByName(quantity, "1 apples", true);

    quantity = 101;
    TestPluralStringByName(quantity, "101 apples", true);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFormatTest002
 * @tc.desc: Test GetPluralStringByNameFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFormatTest002, TestSize.Level1)
{
    AddResource("ar", nullptr, "SA");

    RState state;
    std::string outValue;
    state = rm->GetPluralStringByNameFormat(outValue, g_nonExistName, 1, 1);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFormatTest003
 * @tc.desc: Test GetPluralStringByNameFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFormatTest003, TestSize.Level1)
{
    bool ret = ((ResourceManagerImpl*)rm)->AddResource(FormatFullPath(g_overlayResFilePath).c_str());
    ASSERT_TRUE(ret);
    std::string outValue;
    const char* eatApple = "eat_apple";
    RState state = rm->GetPluralStringByNameFormat(outValue, eatApple, 1, 1);
    ASSERT_EQ(ERROR_CODE_RES_NOT_FOUND_BY_NAME, state);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFormatTest004
 * @tc.desc: Test GetPluralStringByNameFormat function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFormatTest004, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    std::string outValue;
    const char* eatApple = "eat_apple";
    int quantity = 1;
    RState state = rm->GetPluralStringByNameFormat(outValue, eatApple, quantity);
    ASSERT_EQ(ERROR_CODE_RES_REF_TOO_MUCH, state);
}

/*
 * @tc.name: ResourceManagerGetThemeByIdTest001
 * @tc.desc: Test GetThemeById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetThemeById("app_theme");
}

/*
 * @tc.name: ResourceManagerGetThemeByIdTest002
 * @tc.desc: Test GetThemeById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::map<std::string, std::string> outValue;
    RState state;
    state = rm->GetThemeById(NON_EXIST_ID, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetThemeByNameTest001
 * @tc.desc: Test GetThemeByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetThemeByName("app_theme", "test_theme");
}

/*
 * @tc.name: ResourceManagerGetThemeByNameTest002
 * @tc.desc: Test GetThemeByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::map<std::string, std::string> outValue;
    RState state;
    state = rm->GetThemeByName(g_nonExistName, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetBooleanByIdTest001
 * @tc.desc: Test GetBooleanById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetBooleanById("boolean_1", "boolean_ref");
}

/*
 * @tc.name: ResourceManagerGetBooleanByIdTest002
 * @tc.desc: Test GetBooleanById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    bool outValue = true;
    RState state;
    state = rm->GetBooleanById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetBooleanByNameTest001
 * @tc.desc: Test GetBooleanByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetBooleanByName("boolean_1", "boolean_ref");
}

/*
 * @tc.name: ResourceManagerGetBooleanByNameTest002
 * @tc.desc: Test GetBooleanByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    bool outValue = true;
    RState state;
    state = rm->GetBooleanByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetIntegerByIdTest001
 * @tc.desc: Test GetIntegerById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetIntegerById("integer_1", "integer_ref");
}

/*
 * @tc.name: ResourceManagerGetIntegerByIdTest002
 * @tc.desc: Test GetIntegerById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    int outValue;
    RState state;
    state = rm->GetIntegerById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameTest001
 * @tc.desc: Test GetIntegerByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetIntegerByName("integer_1", "integer_ref");
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameTest002
 * @tc.desc: Test GetIntegerByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    int outValue;
    RState state;
    state = rm->GetIntegerByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetFloatByIdTest001
 * @tc.desc: Test GetFloatById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetFloatById("width_appBar_backButton_touchTarget", "float_ref");
}

/*
 * @tc.name: ResourceManagerGetFloatByIdTest002
 * @tc.desc: Test GetFloatById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    float outValue;
    RState state;
    state = rm->GetFloatById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetFloatByNameTest001
 * @tc.desc: Test GetFloatByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetFloatByName("width_appBar_backButton_touchTarget", "float_ref");
}

/*
 * @tc.name: ResourceManagerGetFloatByNameTest002
 * @tc.desc: Test GetFloatByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    float outValue;
    RState state;
    state = rm->GetFloatByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetIntArrayByIdTest001
 * @tc.desc: Test GetIntArrayById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetIntArrayById("intarray_1");
}

/*
 * @tc.name: ResourceManagerGetIntArrayByIdTest002
 * @tc.desc: Test GetIntArrayById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::vector<int> outValue;
    RState state;
    state = rm->GetIntArrayById(NON_EXIST_ID, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetIntArrayByNameTest001
 * @tc.desc: Test GetIntArrayByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    TestGetIntArrayByName("intarray_1");
}

/*
 * @tc.name: ResourceManagerGetIntArrayByNameTest002
 * @tc.desc: Test GetIntArrayByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::vector<int> outValue;
    RState state;
    state = rm->GetIntArrayByName(g_nonExistName, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetColorByIdTest001
 * @tc.desc: Test GetColorById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    uint32_t outValue;
    RState state;
    int id = GetResId("divider_color", ResType::COLOR);
    EXPECT_TRUE(id > 0);
    state = rm->GetColorById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(268435456), outValue); // #10000000

    id = GetResId("color_aboutPage_title_primary", ResType::COLOR);
    EXPECT_TRUE(id > 0);
    state = rm->GetColorById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(4279834905, outValue); // #191919
}

/*
 * @tc.name: ResourceManagerGetColorByIdTest002
 * @tc.desc: Test GetColorById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    uint32_t outValue;
    RState state;
    state = rm->GetColorById(NON_EXIST_ID, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest001
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("divider_color", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(268435456), outValue); // #10000000

    state = rm->GetColorByName("color_aboutPage_title_primary", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(4279834905, outValue); // #191919
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest002
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName(g_nonExistName, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest003
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest003, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_only", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(0), outValue); // #00000000 base resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest004
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest004, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(572662306), outValue); // #22222222 light resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest005
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest005, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_dark", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(0), outValue); // #00000000 base resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest006
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest006, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light_dark", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(572662306), outValue); // #22222222 light resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest007
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest007, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, DARK, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_only", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(0), outValue); // #00000000 base resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest008
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest008, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, DARK, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(0), outValue); // #00000000 base resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest009
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest009, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, DARK, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_dark", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(286331153), outValue); // #11111111 dark resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest010
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest010, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, DARK, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light_dark", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(286331153), outValue); // #11111111 dark resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest011
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest011, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light_phone", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(858993459), outValue); // #33333333 phone resource
}

/*
 * @tc.name: ResourceManagerGetColorByNameTest012
 * @tc.desc: Test GetColorByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetColorByNameTest012, TestSize.Level1)
{
    AddColorModeResource(DEVICE_PHONE, LIGHT, SCREEN_DENSITY_LDPI / BASE_DPI);

    uint32_t outValue;
    RState state;
    state = rm->GetColorByName("base_light_ldpi", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(static_cast<uint32_t>(572662306), outValue); // #22222222 light resource
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest001
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest002
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_zh_cn", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest003
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest003, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);

    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest004
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest004, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(1);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc001_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest005
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest005, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(10);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc010_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest006
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest006, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(1);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc001_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest007
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest007, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(10);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc010_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest008
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest008, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest009
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest009, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(1);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc001_mnc101_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest010
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest010, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(10);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc010_mnc101_en", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest011
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest011, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_zh", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest012
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest012, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_phone", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest013
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest013, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_CAR);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_car", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest014
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest014, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_phone", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest015
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest015, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_CAR);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_car", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest016
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest016, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_dark", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest017
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest017, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest018
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest018, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_dark", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest019
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest019, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_SDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest020
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest020, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_LDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest021
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest021, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_XLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_en_us_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest022
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest022, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_LDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest023
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest023, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(LIGHT);
    rc->SetScreenDensity(SCREEN_DENSITY_XLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_light", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForMccMncTest024
 * @tc.desc: Test GetStringByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForMccMncTest024, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_mccMncResFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("mccmnc_str", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("str_mcc460_mnc101_en_phone_dark_xldpi", outValue);
}

/*
 * @tc.name: ResourceManagerGetProfileByIdTest001
 * @tc.desc: Test GetProfileById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetProfileById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetProfileByIdTest002
 * @tc.desc: Test GetProfileById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::string outValue;
    RState state;
    state = rm->GetProfileById(NON_EXIST_ID, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetProfileByNameTest001
 * @tc.desc: Test GetProfileByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetProfileByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetProfileByNameTest002
 * @tc.desc: Test GetProfileByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::string outValue;
    RState state;
    state = rm->GetProfileByName(g_nonExistName, outValue);
    ASSERT_EQ(NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest001
 * @tc.desc: Test GetMediaById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetMediaById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest002
 * @tc.desc: Test GetMediaById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::string outValue;
    RState state;
    state = rm->GetMediaById(NON_EXIST_ID, outValue);
    ASSERT_EQ(ERROR_CODE_RES_ID_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest003
 * @tc.desc: Test GetMediaById, to match sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest003, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetMediaWithDensityById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest004
 * @tc.desc: Test GetMediaById, to match mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest004, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 160;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest005
 * @tc.desc: Test GetMediaById, to match ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest005, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 240;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest006
 * @tc.desc: Test GetMediaById, to match xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest006, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 320;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest007
 * @tc.desc: Test GetMediaById, to match xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest007, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 480;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest008
 * @tc.desc: Test GetMediaById, to match xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest008, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 640;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest009
 * @tc.desc: Test GetMediaById, to match unsupport density
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest009, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    uint32_t density1 = 420;
    uint32_t density2 = 800;
    uint32_t density3 = 10;
    std::string outValue;
    RState state1;
    RState state2;
    RState state3;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state1 = rm->GetMediaById(id, density1, outValue);
    state2 = rm->GetMediaById(id, density2, outValue);
    state3 = rm->GetMediaById(id, density3, outValue);
    EXPECT_TRUE(state1 == ERROR_CODE_INVALID_INPUT_PARAMETER);
    EXPECT_TRUE(state2 == ERROR_CODE_INVALID_INPUT_PARAMETER);
    EXPECT_TRUE(state3 == ERROR_CODE_INVALID_INPUT_PARAMETER);
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest010
 * @tc.desc: Test GetMediaById, to match with no density param
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest010, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    uint32_t density = 0;
    std::string outValue1;
    std::string outValue2;
    RState state1;
    RState state2;
    int id = GetResId("icon", ResType::MEDIA);
    state1 = rm->GetMediaById(id, density, outValue1);
    state2 = rm->GetMediaById(id, outValue2);
    EXPECT_TRUE(state1 == SUCCESS);
    EXPECT_TRUE(state2 == SUCCESS);
    EXPECT_EQ(outValue1, outValue2);
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest011
 * @tc.desc: Test GetMediaById, to match zh_CN-sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest011, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest012
 * @tc.desc: Test GetMediaById, to match zh_CN-mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest012, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 160;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest013
 * @tc.desc: Test GetMediaById, to match zh_CN-ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest013, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 240;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest014
 * @tc.desc: Test GetMediaById, to match zh_CN-xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest014, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 320;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest015
 * @tc.desc: Test GetMediaById, to match zh_CN-xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest015, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 480;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest016
 * @tc.desc: Test GetMediaById, to match zh_CN-xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest016, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 640;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest017
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest017, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest018
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest018, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 160;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest019
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest019, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 240;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest020
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest020, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 320;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest021
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest021, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 480;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest022
 * @tc.desc: Test GetMediaById, to match mcc460_mnc101-zh_CN-phone-dark-xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest022, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 640;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdTest023
 * @tc.desc: Test GetMediaById
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdTest023, TestSize.Level1)
{
    AddResource("en", nullptr, nullptr);

    int id = GetResId("app_name", ResType::STRING);
    EXPECT_TRUE(id > 0);
    std::string outValue;
    RState state = rm->GetMediaById(id, outValue);
    EXPECT_EQ(state, ERROR_CODE_RES_NOT_FOUND_BY_ID);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest001
 * @tc.desc: Test GetMediaByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest001, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetMediaByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest002
 * @tc.desc: Test GetMediaByName
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest002, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    std::string outValue;
    RState state;
    state = rm->GetMediaByName(g_nonExistName, outValue);
    ASSERT_EQ(ERROR_CODE_RES_NAME_NOT_FOUND, state);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest003
 * @tc.desc: Test GetMediaByName, to match sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest003, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    TestGetMediaWithDensityByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest004
 * @tc.desc: Test GetMediaByName, to match mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest004, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 160;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest005
 * @tc.desc: Test GetMediaByName, to match ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest005, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 240;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest006
 * @tc.desc: Test GetMediaByName, to match xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest006, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 320;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest007
 * @tc.desc: Test GetMediaByName, to match xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest007, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 480;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest008
 * @tc.desc: Test GetMediaByName, to match xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest008, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    uint32_t density = 640;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest009
 * @tc.desc: Test GetMediaByName, to match unsupport density
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest009, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    uint32_t density1 = 420;
    uint32_t density2 = 800;
    uint32_t density3 = 10;
    std::string outValue;
    RState state1;
    RState state2;
    RState state3;
    state1 = rm->GetMediaByName("icon", density1, outValue);
    state2 = rm->GetMediaByName("icon", density2, outValue);
    state3 = rm->GetMediaByName("icon", density3, outValue);
    EXPECT_TRUE(state1 == ERROR_CODE_INVALID_INPUT_PARAMETER);
    EXPECT_TRUE(state2 == ERROR_CODE_INVALID_INPUT_PARAMETER);
    EXPECT_TRUE(state3 == ERROR_CODE_INVALID_INPUT_PARAMETER);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest010
 * @tc.desc: Test GetMediaByName, to match with no density param
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest010, TestSize.Level1)
{
    AddResource("en", nullptr, "US");

    uint32_t density = 0;
    std::string outValue1;
    std::string outValue2;
    RState state1;
    RState state2;
    state1 = rm->GetMediaByName("icon", density, outValue1);
    state2 = rm->GetMediaByName("icon", outValue2);
    EXPECT_TRUE(state1 == SUCCESS);
    EXPECT_TRUE(state2 == SUCCESS);
    EXPECT_EQ(outValue1, outValue2);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest011
 * @tc.desc: Test GetMediaByName, to match zh_CN-sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest011, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest012
 * @tc.desc: Test GetMediaByName, to match zh_CN-mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest012, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 160;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest013
 * @tc.desc: Test GetMediaByName, to match zh_CN-ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest013, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 240;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest014
 * @tc.desc: Test GetMediaByName, to match zh_CN-xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest014, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 320;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest015
 * @tc.desc: Test GetMediaByName, to match zh_CN-xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest015, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 480;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest016
 * @tc.desc: Test GetMediaByName, to match zh_CN-xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest016, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/zh_CN-xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TABLET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 640;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest017
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-sdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest017, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-sdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest018
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-mdpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest018, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-mdpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 160;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest019
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-ldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest019, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-ldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 240;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest020
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-xldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest020, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 320;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest021
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-xxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest021, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 480;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameTest022
 * @tc.desc: Test GetMediaByName, to match mcc460_mnc101-zh_CN-phone-dark-xxxldpi determinder
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameTest022, TestSize.Level1)
{
    AddResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_resFilePath).c_str(), 0, nullptr, nullptr);
    tmp->Init();
    std::string res = tmp->GetResourcePath();
    res.append("entry/resources/mcc460_mnc101-zh_CN-phone-dark-xxxldpi/media/icon.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetMcc(460);
    rc->SetMnc(101);
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(DARK);
    rc->SetScreenDensity(SCREEN_DENSITY_XXXLDPI / BASE_DPI);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 640;
    std::string outValue;
    RState state;
    state = rm->GetMediaByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetStringByIdForInputDeviceTest001
 * @tc.desc: Test GetStringById, to match pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdForInputDeviceTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int id = GetResId("point_test", ResType::STRING);
    EXPECT_TRUE(id > 0);
    std::string outValue;
    rState = rm->GetStringById(id, outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByIdForInputDeviceTest002
 * @tc.desc: Test GetStringById, to match base directory which rc is not set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdForInputDeviceTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int id = GetResId("point_test", ResType::STRING);
    EXPECT_TRUE(id > 0);
    std::string outValue;
    rState = rm->GetStringById(id, outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("default device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByIdForInputDeviceTest003
 * @tc.desc: Test GetStringById, to match zh_CN-phone-pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdForInputDeviceTest003, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int id = GetResId("point_test", ResType::STRING);
    EXPECT_TRUE(id > 0);
    std::string outValue;
    rState = rm->GetStringById(id, outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("zh_CN phone pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByIdForInputDeviceTest004
 * @tc.desc: Test GetStringById, not match zh_CN-phone-pointingdevice directory which language not match
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdForInputDeviceTest004, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int id = GetResId("point_test", ResType::STRING);
    EXPECT_TRUE(id > 0);
    std::string outValue;
    rState = rm->GetStringById(id, outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest001
 * @tc.desc: Test GetStringByName, to match pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("point_test", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest002
 * @tc.desc: Test GetStringByName, to match base directory which rc is not set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("point_test", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("default device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest003
 * @tc.desc: Test GetStringByName, to match zh_CN-phone-pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest003, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("point_test", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("zh_CN phone pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest004
 * @tc.desc: Test GetStringByName, not match zh_CN-phone-pointingdevice directory which language not match
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest004, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("point_test", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest005
 * @tc.desc: Test GetStringByName, not match zh_CN-phone-pointingdevice directory which devicetype not match
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest005, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("point_test", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("pointing device test", outValue);
}

/*
 * @tc.name: ResourceManagerGetStringByNameForInputDeviceTest006
 * @tc.desc: Test GetStringByName,match base directory which pointingdevice directory not have res with name
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameForInputDeviceTest006, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    std::string outValue;
    rState = rm->GetStringByName("hello", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ("Helloooo", outValue);
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameForInputDeviceTest001
 * @tc.desc: Test GetStringByName, to match pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameForInputDeviceTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int outValue;
    rState = rm->GetIntegerByName("integer_input_device", outValue);;
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(888, outValue);
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameForInputDeviceTest002
 * @tc.desc: Test GetIntegerByName, to match base directory which rc is not set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameForInputDeviceTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int outValue;
    rState = rm->GetIntegerByName("integer_input_device", outValue);;
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(999, outValue);
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameForInputDeviceTest003
 * @tc.desc: Test GetIntegerByName, to match zh_CN-phone-pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameForInputDeviceTest003, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int outValue;
    rState = rm->GetIntegerByName("integer_input_device", outValue);
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(777, outValue);
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameForInputDeviceTest004
 * @tc.desc: Test GetIntegerByName, not match zh_CN-phone-pointingdevice directory which language not match
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameForInputDeviceTest004, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    int outValue;
    rState = rm->GetIntegerByName("integer_input_device", outValue);;
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(888, outValue);
}

/*
 * @tc.name: ResourceManagerGetBooleanByNameForInputDeviceTest001
 * @tc.desc: Test GetBooleanByName, to match pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByNameForInputDeviceTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    bool outValue;
    rState = rm->GetBooleanByName("boolean_input_device", outValue);;
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(true, outValue);
}

/*
 * @tc.name: ResourceManagerGetBooleanByNameForInputDeviceTest002
 * @tc.desc: Test GetBooleanByName, to match base directory which rc is not set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByNameForInputDeviceTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    RState rState;
    bool outValue;
    rState = rm->GetBooleanByName("boolean_input_device", outValue);;
    ASSERT_EQ(SUCCESS, rState);
    ASSERT_EQ(false, outValue);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameForInputDeviceTest001
 * @tc.desc: Test GetMediaByName, to match pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameForInputDeviceTest001, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    std::string res;
    res.append("/data/test/all/assets/entry/resources/pointingdevice/media/input_device.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    std::string outValue;
    RState state;
    state = rm->GetMediaByName("input_device", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameForInputDeviceTest002
 * @tc.desc: Test GetMediaByName, to match base directory which rc is not set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameForInputDeviceTest002, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    std::string res;
    res.append("/data/test/all/assets/entry/resources/base/media/input_device.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, nullptr);
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_NOT_SET);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    std::string outValue;
    RState state;
    state = rm->GetMediaByName("input_device", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameForInputDeviceTest003
 * @tc.desc: Test GetMediaByName, to match zh_CN-phone-pointingdevice directory which rc is set
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameForInputDeviceTest003, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    std::string res;
    res.append("/data/test/all/assets/entry/resources/zh_CN-phone-pointingdevice/media/input_device.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    std::string outValue;
    RState state;
    state = rm->GetMediaByName("input_device", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

/*
 * @tc.name: ResourceManagerGetMediaByNameForInputDeviceTest004
 * @tc.desc: Test GetMediaByName, not match zh_CN-phone-pointingdevice directory which language not match
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameForInputDeviceTest004, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    ASSERT_TRUE(ret);
    std::string res;
    res.append("/data/test/all/assets/entry/resources/pointingdevice/media/input_device.png");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rc->SetDirection(DIRECTION_NOT_SET);
    rc->SetDeviceType(DEVICE_PHONE);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rc->SetInputDevice(INPUTDEVICE_POINTINGDEVICE);
    rm->UpdateResConfig(*rc);
    delete rc;

    std::string outValue;
    RState state;
    state = rm->GetMediaByName("input_device", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(res, outValue);
}

/*
 * @tc.name: ResourceManagerResolveReferenceTest001
 * @tc.desc: Test ResolveReference function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerResolveReferenceTest001, TestSize.Level1)
{
    ResConfig *rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rm->UpdateResConfig(*rc);

    rm->AddResource(FormatFullPath(g_resFilePath).c_str());

    int id = GetResId("integer_1", ResType::INTEGER);
    std::string value(FormatString("$integer:%d", id));
    std::string outValue;
    RState ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(std::string("101"), outValue);

    std::string copyright("XXXXXX All rights reserved. ©2011-2019");
    id = GetResId("copyright_text", ResType::STRING);
    value.assign(FormatString("$string:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(copyright, outValue);

    id = GetResId("string_ref", ResType::STRING);
    value.assign(FormatString("$string:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(copyright, outValue);

    id = GetResId("boolean_1", ResType::BOOLEAN);
    value.assign(FormatString("$boolean:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(std::string("true"), outValue);

    id = GetResId("grey_background", ResType::COLOR);
    value.assign(FormatString("$color:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(std::string("#F5F5F5"), outValue);

    id = GetResId("aboutPage_minHeight", ResType::FLOAT);
    value.assign(FormatString("$float:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(SUCCESS, ret);
    EXPECT_EQ(std::string("707vp"), outValue);

    id = GetResId("base", ResType::PATTERN);
    value.assign(FormatString("$pattern:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    EXPECT_EQ(ERROR, ret);

    // reload
    rc->SetLocaleInfo("zh", nullptr, "CN");
    rm->UpdateResConfig(*rc);
    delete rc;

    id = GetResId("copyright_text", ResType::STRING);
    value.assign(FormatString("$string:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    ASSERT_EQ(SUCCESS, ret);
    ASSERT_EQ(std::string("版权所有 ©2011-2019 XXXX有限公司保留一切权利"), outValue.c_str());

    id = GetResId("string_ref", ResType::STRING);
    value.assign(FormatString("$string:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    ASSERT_EQ(SUCCESS, ret);
    ASSERT_EQ(std::string("$aaaaa"), outValue.c_str());

    // error case
    // wrong id
    value.assign(FormatString("$boolean:%d", NON_EXIST_ID));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    ASSERT_EQ(ERROR, ret);
    // wrong type
    id = GetResId("copyright_text", ResType::STRING);
    value.assign(FormatString("$boolean:%d", id));
    ret = ((ResourceManagerImpl *)rm)->ResolveReference(value, outValue);
    ASSERT_EQ(ERROR, ret);
}

/*
 * @tc.name: ResourceManagerResolveParentReferenceTest001
 * @tc.desc: Test ResolveParentReference function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerResolveParentReferenceTest001, TestSize.Level1)
{
    rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    int id;
    std::map<std::string, std::string> outValue;
    const IdItem *idItem;
    RState ret;

    id = GetResId("base", ResType::PATTERN);
    EXPECT_TRUE(id > 0);
    idItem = ((ResourceManagerImpl *)rm)->hapManager_->FindResourceById(id);
    ASSERT_TRUE(idItem != nullptr);
    ret = ((ResourceManagerImpl *)rm)->ResolveParentReference(idItem, outValue);
    ASSERT_EQ(SUCCESS, ret);
    PrintMapString(outValue);

    HILOG_DEBUG("=====");
    id = GetResId("child", ResType::PATTERN);
    idItem = ((ResourceManagerImpl *)rm)->hapManager_->FindResourceById(id);
    ASSERT_TRUE(idItem != nullptr);
    ret = ((ResourceManagerImpl *)rm)->ResolveParentReference(idItem, outValue);
    ASSERT_EQ(SUCCESS, ret);
    PrintMapString(outValue);

    HILOG_DEBUG("=====");
    id = GetResId("ccchild", ResType::PATTERN);
    idItem = ((ResourceManagerImpl *)rm)->hapManager_->FindResourceById(id);
    ASSERT_TRUE(idItem != nullptr);
    ret = ((ResourceManagerImpl *)rm)->ResolveParentReference(idItem, outValue);
    ASSERT_EQ(SUCCESS, ret);
    PrintMapString(outValue);

    // error case
    ret = ((ResourceManagerImpl *)rm)->ResolveParentReference(nullptr, outValue);
    ASSERT_EQ(ERROR, ret);
    // wrong resType
    IdItem *item = new IdItem;
    for (int i = 0; i < ResType::MAX_RES_TYPE; ++i) {
        if (i == ResType::THEME || i == ResType::PATTERN) {
            continue;
        }
        item->resType_ = (ResType) i;
        ret = ((ResourceManagerImpl *)rm)->ResolveParentReference(item, outValue);
        EXPECT_EQ(ERROR, ret);
    }
    delete item;
}

/*
 * test res with same name in different resType
 * @tc.name: ResourceManagerSameNameTest001
 * @tc.desc: Test GetStringByName & GetBooleanByName & GetIntegerByName function, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, ResourceManagerSameNameTest001, TestSize.Level1)
{
    rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    std::string outValue;
    std::string name;
    RState state;

    state = rm->GetStringByName("same_name", outValue);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(std::string("StringSameName"), outValue);

    bool outValueB = true;
    state = rm->GetBooleanByName("same_name", outValueB);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(false, outValueB);

    int outValueI;
    state = rm->GetIntegerByName("same_name", outValueI);
    EXPECT_TRUE(state == SUCCESS);
    EXPECT_EQ(999, outValueI);
}

/*
 * test get raw file path interface
 * @tc.name: RawFileTest001
 * @tc.desc: Test GetRawFilePathByName, file case.
 * @tc.type: FUNC
 */
HWTEST_F(ResourceManagerTest, RawFileTest001, TestSize.Level1)
{
    rm->AddResource(FormatFullPath(g_resFilePath).c_str());
    TestGetRawFilePathByName("rawfile/test_rawfile.txt",
        "/data/test/all/assets/entry/resources/rawfile/test_rawfile.txt");

    TestGetRawFilePathByName("test_rawfile.txt",
        "/data/test/all/assets/entry/resources/rawfile/test_rawfile.txt");
}

/*
 * @tc.name: ResourceManagerAddResourceFromHapTest001
 * @tc.desc: Test AddResource function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerAddResourceFromHapTest001, TestSize.Level1)
{
    // error cases
    // file not exist
    bool ret = rm->AddResource("/data/test/do_not_exist.hap");
    ASSERT_TRUE(!ret);
}

/*
 * @tc.name: ResourceManagerGetStringByIdFromHapTest002
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdFromHapTest002, TestSize.Level1)
{
    AddHapResource("en", nullptr, "US");

    TestStringById("app_name", "App Name");
    TestStringById("copyright_text", "XXXXXX All rights reserved. ©2011-2019");
}

/*
 * @tc.name: ResourceManagerGetStringByIdFromHapTest003
 * @tc.desc: Test GetStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByIdFromHapTest003, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);

    TestStringById("app_name", "应用名称");
    TestStringById("copyright_text", "版权所有 ©2011-2019 XXXX有限公司保留一切权利");
}

/*
 * @tc.name: ResourceManagerGetStringByNameFromHapTest004
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameFromHapTest004, TestSize.Level1)
{
    AddHapResource("en", nullptr, nullptr);

    TestStringByName("app_name", "App Name");
    TestStringByName("copyright_text", "XXXXXX All rights reserved. ©2011-2019");
}

/*
 * @tc.name: ResourceManagerGetStringByNameFromHapTest005
 * @tc.desc: Test GetStringByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringByNameFromHapTest005, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);

    TestStringByName("app_name", "应用名称");
    TestStringByName("copyright_text", "版权所有 ©2011-2019 XXXX有限公司保留一切权利");
}

/*
 * @tc.name: ResourceManagerGetStringFormatByIdFromHapTest006
 * @tc.desc: Test GetStringFormatById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByIdFromHapTest006, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);

    TestGetStringFormatById("app_name", "应用名称");
}


/*
 * @tc.name: ResourceManagerGetStringFormatByNameFromHapTest007
 * @tc.desc: Test GetStringFormatByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringFormatByNameFromHapTest007, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);
    TestGetStringFormatByName("app_name", "应用名称");
}

/*
 * @tc.name: ResourceManagerGetStringArrayByIdFromHapTest008
 * @tc.desc: Test GetStringArrayById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByIdFromHapTest008, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);
    TestGetStringArrayById("size");
}

/*
 * @tc.name: ResourceManagerGetStringArrayByNameFromHapTest009
 * @tc.desc: Test GetStringArrayByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetStringArrayByNameFromHapTest009, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);
    TestGetStringArrayByName("size");
}

/*
 * @tc.name: ResourceManagerGetPatternByIdFromHapTest0010
 * @tc.desc: Test GetPatternById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByIdFromHapTest0010, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);
    TestGetPatternById("base");
}

/*
 * @tc.name: ResourceManagerGetPatternByNameFromHapTest0011
 * @tc.desc: Test GetPatternByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPatternByNameFromHapTest0011, TestSize.Level1)
{
    AddHapResource("zh", nullptr, nullptr);
    TestGetPatternByName("base");
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFromHapTest0012
 * @tc.desc: Test GetPluralStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFromHapTest0012, TestSize.Level1)
{
    AddHapResource("en", nullptr, "US");

    int quantity = 1;
    TestPluralStringById(quantity, "%d apple", false);
    quantity = 101;
    TestPluralStringById(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFromHapTest0013
 * @tc.desc: Test GetPluralStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFromHapTest0013, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringById(quantity, "%d apples", false);
    quantity = 101;
    TestPluralStringById(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFromHapTest0014
 * @tc.desc: Test GetPluralStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFromHapTest0014, TestSize.Level1)
{
    AddHapResource("ar", nullptr, "SA");

    int quantity = 0;
    TestPluralStringById(quantity, "zero-0");
    quantity = 1;
    TestPluralStringById(quantity, "one-1");
    quantity = 5;
    TestPluralStringById(quantity, "few-%d");
    quantity = 500;
    TestPluralStringById(quantity, "other-%d");
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFromHapTest0015
 * @tc.desc: Test GetPluralStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFromHapTest0015, TestSize.Level1)
{
    AddHapResource("pl", nullptr, "PL");

    int quantity = 1;
    TestPluralStringById(quantity, "1 jabłko");
    quantity = 2;
    TestPluralStringById(quantity, "%d jabłka");
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFromHapTest0016
 * @tc.desc: Test GetPluralStringByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFromHapTest0016, TestSize.Level1)
{
    AddHapResource("en", nullptr, "US");

    int quantity = 1;
    TestPluralStringByName(quantity, "%d apple", false);
    quantity = 101;
    TestPluralStringByName(quantity, "%d apples", false);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByIdFormatFromHapTest0017
 * @tc.desc: Test GetPluralStringById function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByIdFormatFromHapTest0017, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringById(quantity, "1 apples", true);
    quantity = 101;
    TestPluralStringById(quantity, "101 apples", true);
}

/*
 * @tc.name: ResourceManagerGetPluralStringByNameFormatFromHapTest0018
 * @tc.desc: Test GetPluralStringByName function
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetPluralStringByNameFormatFromHapTest0018, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    int quantity = 1;
    TestPluralStringByName(quantity, "1 apples", true);
    quantity = 101;
    TestPluralStringByName(quantity, "101 apples", true);
}

/*
 * @tc.name: ResourceManagerGetThemeByIdFromHapTest0019
 * @tc.desc: Test GetThemeById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByIdFromHapTest0019, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetThemeById("app_theme");
}

/*
 * @tc.name: ResourceManagerGetThemeByNameFromHapTest0020
 * @tc.desc: Test GetThemeByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetThemeByNameFromHapTest0020, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetThemeByName("app_theme", "test_theme");
}

/*
 * @tc.name: ResourceManagerGetBooleanByIdFromHapTest0021
 * @tc.desc: Test GetBooleanById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByIdFromHapTest0021, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetBooleanById("boolean_1", "boolean_ref");
}

/*
 * @tc.name: ResourceManagerGetBooleanByNameFromHapTest0022
 * @tc.desc: Test GetBooleanByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetBooleanByNameFromHapTest0022, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetBooleanByName("boolean_1", "boolean_ref");
}

/*
 * @tc.name: ResourceManagerGetIntegerByIdFromHapTest0023
 * @tc.desc: Test GetIntegerById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByIdFromHapTest0023, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetIntegerById("integer_1", "integer_ref");
}

/*
 * @tc.name: ResourceManagerGetIntegerByNameFromHapTest0024
 * @tc.desc: Test GetIntegerByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntegerByNameFromHapTest0024, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetIntegerByName("integer_1", "integer_ref");
}

/*
 * @tc.name: ResourceManagerGetFloatByIdFromHapTest0025
 * @tc.desc: Test GetFloatById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByIdFromHapTest0025, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetFloatById("width_appBar_backButton_touchTarget", "float_ref");
}

/*
 * @tc.name: ResourceManagerGetFloatByNameFromHapTest0026
 * @tc.desc: Test GetFloatByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetFloatByNameFromHapTest0026, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetFloatByName("width_appBar_backButton_touchTarget", "float_ref");
}

/*
 * @tc.name: ResourceManagerGetIntArrayByIdFromHapTest0027
 * @tc.desc: Test GetIntArrayById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByIdFromHapTest0027, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetIntArrayById("intarray_1");
}

/*
 * @tc.name: ResourceManagerGetIntArrayByNameFromHapTest0028
 * @tc.desc: Test GetIntArrayByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetIntArrayByNameFromHapTest0028, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    TestGetIntArrayByName("intarray_1");
}

/*
 * @tc.name: ResourceManagerGetProfileByIdFromHapTest0029
 * @tc.desc: Test GetProfileById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByIdFromHapTest0029, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetProfileById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetProfileByNameFromHapTest0030
 * @tc.desc: Test GetProfileByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileByNameFromHapTest0030, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetProfileByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdFromHapTest0031
 * @tc.desc: Test GetMediaById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdFromHapTest0031, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetMediaById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByIdFromHapTest0032
 * @tc.desc: Test GetMediaById, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByIdFromHapTest0032, TestSize.Level1)
{
    AddHapResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetMediaWithDensityById(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameFromHapTest0033
 * @tc.desc: Test GetMediaByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameFromHapTest0033, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetMediaByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetMediaByNameFromHapTest0034
 * @tc.desc: Test GetMediaByName, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaByNameFromHapTest0034, TestSize.Level1)
{
    AddHapResource("en", nullptr, "US");

    HapResource *tmp = new HapResource(FormatFullPath(g_hapPath).c_str(), 0, nullptr, nullptr);
    TestGetMediaWithDensityByName(tmp);
    delete tmp;
}

/*
 * @tc.name: ResourceManagerGetProfileDataByIdFromHapTest0035
 * @tc.desc: Test GetProfileDataByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileDataByIdFromHapTest0035, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::unique_ptr<uint8_t[]> outValue;
    int id = GetResId("test_profile", ResType::PROF);
    EXPECT_TRUE(id > 0);
    size_t len;
    RState state = rm->GetProfileDataById(id, len, outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetProfileDataByNameFromHapTest0036
 * @tc.desc: Test GetProfileDataByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetProfileDataByNameFromHapTest0036, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::unique_ptr<uint8_t[]> outValue;
    size_t len;
    RState state = rm->GetProfileDataByName("test_profile", len, outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataByNameFromHapTest0037
 * @tc.desc: Test GetMediaDataByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataByNameFromHapTest0037, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::unique_ptr<uint8_t[]> outValue;
    RState state;
    size_t len;
    state = rm->GetMediaDataByName("icon1", len, outValue);
    EXPECT_EQ(len, 5997); // the length of icon1
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataByIdFromHapTest0038
 * @tc.desc: Test GetMediaDataById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataByIdFromHapTest0038, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::unique_ptr<uint8_t[]> outValue;
    RState state;
    int id = GetResId("icon1", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    size_t len;
    state = rm->GetMediaDataById(id, len, outValue);
    EXPECT_EQ(len, 5997); // the length of icon1
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataBase64ByNameFromHapTest0039
 * @tc.desc: Test GetMediaBase64DataByName
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataBase64ByNameFromHapTest0039, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::string outValue;
    RState state;
    state = rm->GetMediaBase64DataByName("icon1", outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataBase64ByIdFromHapTest0040
 * @tc.desc: Test GetMediaDataBase64ById
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataBase64ByIdFromHapTest0040, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    std::string outValue;
    int id = GetResId("icon1", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    RState state;
    state = rm->GetMediaBase64DataById(id, outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataByIdFromHapTest0041
 * @tc.desc: Test GetMediaDataById, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataByIdFromHapTest0041, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::unique_ptr<uint8_t[]> outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    size_t len;
    state = rm->GetMediaDataById(id, density, len, outValue);
    EXPECT_EQ(len, 6790); // the length of icon
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaDataByNameFromHapTest0042
 * @tc.desc: Test GetMediaBase64DataByName, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaDataByNameFromHapTest0042, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::unique_ptr<uint8_t[]> outValue;
    RState state;
    size_t len;
    state = rm->GetMediaDataByName("icon", density, len, outValue);
    EXPECT_EQ(len, 6790); // the length of icon
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaBase64DataByIdFromHapTest0043
 * @tc.desc: Test GetMediaBase64DataById, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaBase64DataByIdFromHapTest0043, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    int id = GetResId("icon", ResType::MEDIA);
    EXPECT_TRUE(id > 0);
    state = rm->GetMediaBase64DataById(id, density, outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * @tc.name: ResourceManagerGetMediaBase64DataByNameFromHapTest0044
 * @tc.desc: Test GetMediaDataById, to match sdpi determinder
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerGetMediaBase64DataByNameFromHapTest0044, TestSize.Level1)
{
    AddHapResource("zh", nullptr, "CN");

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetDeviceType(DEVICE_TV);
    rc->SetColorMode(COLOR_MODE_NOT_SET);
    rc->SetScreenDensity(SCREEN_DENSITY_NOT_SET);
    rm->UpdateResConfig(*rc);
    delete rc;

    int density = 120;
    std::string outValue;
    RState state;
    state = rm->GetMediaBase64DataByName("icon", density, outValue);
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * test get raw file path interface
 * @tc.name: RawFileTestFromHap0045
 * @tc.desc: Test GetRawFileFromHap & AddResource function, file case.
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, RawFileTestFromHap0045, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_hapPath).c_str());
    EXPECT_TRUE(ret);
    std::unique_ptr<ResourceManager::RawFile> rawFile;
    RState state;
    state = rm->GetRawFileFromHap("test_rawfile.txt", rawFile);
    ASSERT_EQ(rawFile->length, 17); // 17 means the length of "for raw file test"
    EXPECT_TRUE(state == SUCCESS);
    state = rm->GetRawFileFromHap("rawfile/test_rawfile.txt", rawFile);
    ASSERT_EQ(rawFile->length, 17); // 17 means the length of "for raw file test"
    EXPECT_TRUE(state == SUCCESS);
}

/*
 * test get raw file path interface
 * @tc.name: RawFileTestFromHap0046
 * @tc.desc: Test GetRawFileFromHap & AddResource function, file case.
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, RawFileTestFromHap0046, TestSize.Level1)
{
    bool ret = rm->AddResource(FormatFullPath(g_hapPath).c_str());
    EXPECT_TRUE(ret);
    ResourceManager::RawFileDescriptor descriptor;
    RState state;
    state = rm->GetRawFileDescriptorFromHap("test_rawfile.txt", descriptor);
    EXPECT_TRUE(state == SUCCESS);
    ASSERT_EQ(descriptor.length, 17); // 17 means the length of "for raw file test"
    state = rm->CloseRawFileDescriptor("test_rawfile.txt");
    EXPECT_TRUE(state == SUCCESS);

    state = rm->GetRawFileDescriptorFromHap("rawfile/test_rawfile.txt", descriptor);
    EXPECT_TRUE(state == SUCCESS);
    ASSERT_EQ(descriptor.length, 17); // 17 means the length of "for raw file test"
    state = rm->CloseRawFileDescriptor("rawfile/test_rawfile.txt");
    EXPECT_TRUE(state == SUCCESS);

    state = rm->CloseRawFileDescriptor("noexist.txt");
    EXPECT_EQ(state, ERROR_CODE_RES_PATH_INVALID);
}

/*
 * @tc.name: ResourceManagerOverlayTest001
 * @tc.desc: Test overlay AddResource & UpdateResConfig function, file case.
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerOverlayTest001, TestSize.Level1)
{
    std::vector<std::string> overlayPaths;
    overlayPaths.push_back(FormatFullPath(g_overlayResFilePath).c_str());
    bool ret = ((ResourceManagerImpl *)rm)->AddResource(FormatFullPath(g_systemResFilePath).c_str(), overlayPaths);
    ASSERT_TRUE(ret);

    auto rc = CreateResConfig();
    if (rc == nullptr) {
        EXPECT_TRUE(false);
        return;
    }
    rc->SetLocaleInfo("en", nullptr, "US");
    rm->UpdateResConfig(*rc);
    delete rc;
}

/*
 * @tc.name: ResourceManagerUtilsTest001
 * @tc.desc: Test endWithTail;
 * @tc.type: FUNC
 * @tc.require: issueI5LHLP
 */
HWTEST_F(ResourceManagerTest, ResourceManagerUtilsTest001, TestSize.Level1)
{
    std::string path = "";
    std::string tail = ".hap";
    bool ret = Utils::endWithTail(path, tail);
    ASSERT_FALSE(ret);
}
}
