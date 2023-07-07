/*
 * Copyright (c) 2023 Huawei Technologies Co., Ltd. All rights reserved.
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

#include "want_wrap_ohos.h"

#include "base/log/log_wrapper.h"
#include "base/utils/utils.h"
//#include "napi_common_want.h"

namespace OHOS::Ace {

RefPtr<WantWrap> WantWrap::CreateWantWrap(void* nativeEngine, void* nativeValue)
{
    NativeEngine* engine = reinterpret_cast<NativeEngine*>(nativeEngine);
    NativeValue* value = reinterpret_cast<NativeValue*>(nativeValue);
    if (engine == nullptr || value == nullptr) {
        LOGW("engine or value is nullptr when CreateWantWrap.");
        return nullptr;
    }

    return AceType::MakeRefPtr<WantWrapOhos>(engine, value);
}

WantWrapOhos::WantWrapOhos(NativeEngine* engine, NativeValue* value)
{
    OHOS::AppExecFwk::UnwrapWant(reinterpret_cast<napi_env>(engine),
                                 reinterpret_cast<napi_value>(value),
                                 want_);
}

void WantWrapOhos::SetWantParamsFromWantWrap(void* want)
{
    auto destWant = reinterpret_cast<AAFwk::Want*>(want);
    CHECK_NULL_VOID_NOLOG(destWant);
    auto params = want_.GetParams();
    destWant->SetParams(params);
}

std::string WantWrapOhos::ToString() const
{
    return want_.ToString();
}

} // namespace OHOS::Ace
