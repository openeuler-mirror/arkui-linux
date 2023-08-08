/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

export const FormError = {
    ERR_COMMON: 1,
    ERR_PERMISSION_DENY: 2,
    ERR_GET_INFO_FAILED: 4,
    ERR_GET_BUNDLE_FAILED: 5,
    ERR_GET_LAYOUT_FAILED: 6,
    ERR_ADD_INVALID_PARAM: 7,
    ERR_CFG_NOT_MATCH_ID: 8,
    ERR_NOT_EXIST_ID: 9,
    ERR_BIND_PROVIDER_FAILED: 10,
    ERR_MAX_SYSTEM_FORMS: 11,
    ERR_MAX_INSTANCES_PER_FORM: 12,
    ERR_OPERATION_FORM_NOT_SELF: 13,
    ERR_PROVIDER_DEL_FAIL: 14,
    ERR_MAX_FORMS_PER_CLIENT: 15,
    ERR_MAX_SYSTEM_TEMP_FORMS: 16,
    ERR_FORM_NO_SUCH_MODULE: 17,
    ERR_FORM_NO_SUCH_ABILITY: 18,
    ERR_FORM_NO_SUCH_DIMENSION: 19,
    ERR_FORM_FA_NOT_INSTALLED: 20,
    ERR_SYSTEM_RESPONSES_FAILED: 30,
    ERR_FORM_DUPLICATE_ADDED: 31,
    ERR_IN_RECOVERY: 36,
    ERR_DISTRIBUTED_SCHEDULE_FAILED: 37
}
export function mockFormError() {
    const formError = {
        FormError
    }
    return formError;
}