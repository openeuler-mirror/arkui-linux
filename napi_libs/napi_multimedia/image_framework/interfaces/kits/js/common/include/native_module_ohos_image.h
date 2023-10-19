/*
 * Copyright (C) 2022 Huawei Device Co., Ltd.
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

#ifndef INTERFACES_KITS_JS_COMMON_INCLUDE_NATIVE_MODULE_OHOS_IMAGE_H_
#define INTERFACES_KITS_JS_COMMON_INCLUDE_NATIVE_MODULE_OHOS_IMAGE_H_

#include "napi/native_node_api.h"
#include "image_source_napi.h"
#include "pixel_map_napi.h"
#include "image_packer_napi.h"

#if !defined(_IOS) && !defined(_ANDROID)
#include "image_receiver_napi.h"
#include "image_creator_napi.h"
#include "image_napi.h"
#endif

#endif // INTERFACES_KITS_JS_COMMON_INCLUDE_NATIVE_MODULE_OHOS_IMAGE_H_
