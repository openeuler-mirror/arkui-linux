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

#ifndef FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_NODE_API_H
#define FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_NODE_API_H

#include <iostream>
#include <vector>

#include <node/js_native_api.h>

#include "napi/native_common.h"

NAPI_EXTERN napi_status napi_is_callable(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_create_runtime(napi_env env, napi_env* result_env);
NAPI_EXTERN napi_status napi_serialize(napi_env env, napi_value object, napi_value transfer_list, napi_value* result);
NAPI_EXTERN napi_status napi_deserialize(napi_env env, napi_value recorder, napi_value* object);
NAPI_EXTERN napi_status napi_delete_serialization_data(napi_env env, napi_value value);
NAPI_EXTERN napi_status napi_run_buffer_script(napi_env env, std::vector<uint8_t>& buffer, napi_value* result);
NAPI_EXTERN napi_status napi_run_actor(napi_env env, std::vector<uint8_t>& buffer,
                                       const char* descriptor, napi_value* result);
NAPI_EXTERN napi_status napi_wrap_with_size(napi_env env,
                                  napi_value js_object,
                                  void* native_object,
                                  napi_finalize finalize_cb,
                                  void* finalize_hint,
                                  napi_ref* result,
                                  size_t native_binding_size);
NAPI_EXTERN napi_status napi_create_external_with_size(napi_env env,
                                                       void* data,
                                                       napi_finalize finalize_cb,
                                                       void* finalize_hint,
                                                       napi_value* result,
                                                       size_t native_binding_size);
NAPI_EXTERN napi_status napi_set_promise_rejection_callback(napi_env env, napi_ref ref, napi_ref checkRef);

NAPI_EXTERN napi_status napi_is_arguments_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_async_function(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_boolean_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_generator_function(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_date(napi_env env, napi_value value, bool* result);

NAPI_EXTERN napi_status napi_is_map_iterator(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_set_iterator(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_generator_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_module_namespace_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_proxy(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_reg_exp(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_number_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_map(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_set(napi_env env, napi_value value, bool* result);

NAPI_EXTERN napi_status napi_is_string_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_symbol_object(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_weak_map(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_weak_set(napi_env env, napi_value value, bool* result);

NAPI_EXTERN napi_status napi_is_big_int64_array(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_big_uint64_array(napi_env env, napi_value value, bool* result);
NAPI_EXTERN napi_status napi_is_shared_array_buffer(napi_env env, napi_value value, bool* result);

#endif /* FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_NODE_API_H */
