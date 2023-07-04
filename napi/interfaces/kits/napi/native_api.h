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

#ifndef FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_API_H
#define FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_API_H

#ifndef NAPI_VERSION
#define NAPI_VERSION 8
#endif

#ifndef NAPI_EXPERIMENTAL
#define NAPI_EXPERIMENTAL
#endif

#include <node_api.h>

#ifdef NAPI_TEST
#ifdef _WIN32
#define NAPI_INNER_EXTERN __declspec(dllexport)
#else
#define NAPI_INNER_EXTERN __attribute__((visibility("default")))
#endif
#else
#ifdef _WIN32
#define NAPI_INNER_EXTERN __declspec(deprecated)
#else
#define NAPI_INNER_EXTERN __attribute__((__deprecated__))
#endif
#endif

NAPI_INNER_EXTERN napi_status napi_set_instance_data(napi_env env,
                                                     void* data,
                                                     napi_finalize finalize_cb,
                                                     void* finalize_hint);

NAPI_INNER_EXTERN napi_status napi_get_instance_data(napi_env env,
                                                     void** data);

NAPI_INNER_EXTERN napi_status napi_fatal_exception(napi_env env, napi_value err);

NAPI_INNER_EXTERN napi_status napi_add_env_cleanup_hook(napi_env env,
                                                        void (*fun)(void* arg),
                                                        void* arg);

NAPI_INNER_EXTERN napi_status napi_remove_env_cleanup_hook(napi_env env,
                                                           void (*fun)(void* arg),
                                                           void* arg);

NAPI_INNER_EXTERN napi_status napi_add_async_cleanup_hook(
    napi_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);

NAPI_INNER_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);

NAPI_INNER_EXTERN napi_status napi_create_buffer(napi_env env,
                                                 size_t length,
                                                 void** data,
                                                 napi_value* result);

NAPI_INNER_EXTERN napi_status napi_create_buffer_copy(napi_env env,
                                                      size_t length,
                                                      const void* data,
                                                      void** result_data,
                                                      napi_value* result);


NAPI_INNER_EXTERN napi_status napi_create_external_buffer(napi_env env,
                                                          size_t length,
                                                          void* data,
                                                          napi_finalize finalize_cb,
                                                          void* finalize_hint,
                                                          napi_value* result);

NAPI_INNER_EXTERN napi_status napi_create_string_utf16(napi_env env,
                                                       const char16_t* str,
                                                       size_t length,
                                                       napi_value* result);

NAPI_INNER_EXTERN napi_status napi_get_buffer_info(napi_env env,
                                                   napi_value value,
                                                   void** data,
                                                   size_t* length);

NAPI_INNER_EXTERN napi_status napi_get_value_string_utf16(napi_env env,
                                                          napi_value value,
                                                          char16_t* buf,
                                                          size_t bufsize,
                                                          size_t* result);

NAPI_INNER_EXTERN napi_status napi_is_buffer(napi_env env,
                                             napi_value value,
                                             bool* result);

NAPI_INNER_EXTERN napi_status napi_detach_arraybuffer(napi_env env,
                                                      napi_value arraybuffer);

NAPI_INNER_EXTERN napi_status napi_is_detached_arraybuffer(napi_env env,
                                                           napi_value value,
                                                           bool* result);

NAPI_INNER_EXTERN napi_status napi_get_all_property_names(napi_env env,
                                                          napi_value object,
                                                          napi_key_collection_mode key_mode,
                                                          napi_key_filter key_filter,
                                                          napi_key_conversion key_conversion,
                                                          napi_value* result);

NAPI_EXTERN napi_status napi_object_freeze(napi_env env, napi_value object);

NAPI_INNER_EXTERN napi_status napi_object_seal(napi_env env,
                                               napi_value object);

NAPI_INNER_EXTERN napi_status napi_type_tag_object(napi_env env,
                                                   napi_value value,
                                                   const napi_type_tag* type_tag);

NAPI_INNER_EXTERN napi_status napi_check_object_type_tag(napi_env env,
                                                         napi_value value,
                                                         const napi_type_tag* type_tag,
                                                         bool* result);

NAPI_INNER_EXTERN napi_status napi_add_finalizer(napi_env env,
                                                 napi_value js_object,
                                                 void* native_object,
                                                 napi_finalize finalize_cb,
                                                 void* finalize_hint,
                                                 napi_ref* result);

NAPI_INNER_EXTERN napi_status napi_async_init(napi_env env,
                                              napi_value async_resource,
                                              napi_value async_resource_name,
                                              napi_async_context* result);

NAPI_INNER_EXTERN napi_status napi_async_destroy(napi_env env,
                                                 napi_async_context async_context);

NAPI_INNER_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                       napi_value resource_object,
                                                       napi_async_context context,
                                                       napi_callback_scope* result);

NAPI_INNER_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                        napi_callback_scope scope);

NAPI_INNER_EXTERN napi_status napi_adjust_external_memory(napi_env env,
                                                          int64_t change_in_bytes,
                                                          int64_t* adjusted_value);

NAPI_INNER_EXTERN napi_status node_api_get_module_file_name(napi_env env, const char** result);

NAPI_EXTERN napi_status napi_run_script_path(napi_env env, const char* path, napi_value* result);

#endif /* FOUNDATION_ACE_NAPI_INTERFACES_KITS_NAPI_NATIVE_API_H */
