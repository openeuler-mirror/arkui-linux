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

#ifndef FOUNDATION_ACE_ADAPTER_OHOS_OSAL_WANT_WRAP_OHOS_H
#define FOUNDATION_ACE_ADAPTER_OHOS_OSAL_WANT_WRAP_OHOS_H

#include "base/want/want_wrap.h"

//#include "napi/native_api.h"
//#include "native_engine/native_engine.h"
//#include "want.h"

namespace OHOS::Ace {

class NativeValue {

};

class WantWrapOhos : public WantWrap {
    DECLARE_ACE_TYPE(WantWrapOhos, WantWrap)

public:
    WantWrapOhos(NativeEngine* engine, NativeValue* value);
    ~WantWrapOhos() = default;
    void SetWantParamsFromWantWrap(void* want) override;
    std::string ToString() const override;
private:
    //AAFwk::Want want_;
};

} // namespace OHOS::Ace

#endif // FOUNDATION_ACE_ADAPTER_OHOS_OSAL_WANT_WRAP_OHOS_H
