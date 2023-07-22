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

#include "ark_native_string.h"
#if !defined(PREVIEW) && !defined(IOS_PLATFORM)
// #include "ohos/init_data.h"
#else
#include "unicode/putil.h"
#endif
#include "securec.h"
#include "unicode/ucnv.h"
#include "utils/log.h"

using panda::StringRef;
using panda::ObjectRef;
ArkNativeString::ArkNativeString(ArkNativeEngine* engine, const char* value, size_t length)
    : ArkNativeString(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    auto vm = engine->GetEcmaVm();
    LocalScope scope(vm);
    Local<StringRef> object = StringRef::NewFromUtf8(vm, value, length);
    value_ = Global<StringRef>(vm, object);
}
ArkNativeString::ArkNativeString(ArkNativeEngine* engine, Local<JSValueRef> value) : ArkNativeValue(engine, value) {}

ArkNativeString::~ArkNativeString() {}

void* ArkNativeString::GetInterface(int interfaceId)
{
    return (NativeString::INTERFACE_ID == interfaceId) ? (NativeString*)this : nullptr;
}

void ArkNativeString::GetCString(char* buffer, size_t size, size_t* length)
{
    if (length == nullptr) {
        return;
    }
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<StringRef> val = value_;
    if (buffer == nullptr) {
        *length = val->Utf8Length() - 1;
    } else if (size != 0) {
        int copied = val->WriteUtf8(buffer, size - 1) - 1;
        buffer[copied] = '\0';
        *length = copied;
    } else {
        *length = 0;
    }
}

void ArkNativeString::GetCString16(char16_t* buffer, size_t size, size_t* length) {}

size_t ArkNativeString::GetLength()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<StringRef> value = value_;
    return value->Utf8Length() - 1;
}

size_t ArkNativeString::EncodeWriteUtf8(char* buffer, size_t bufferSize, int32_t* nchars)
{
    if (buffer == nullptr || nchars == nullptr) {
        HILOG_ERROR("buffer is null or nchars is null");
        return 0;
    }

    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<StringRef> val = value_;
    int32_t length = val->Length();

    int32_t pos = 0;
    int32_t writableSize = static_cast<int32_t>(bufferSize);
    int32_t i = 0;
    Local<ObjectRef> strObj = Local<ObjectRef>(val.ToLocal(vm));
    for (; i < length; i++) {
        Local<StringRef> str = Local<StringRef>(strObj->Get(vm, i));
        int32_t len = str->Utf8Length() - 1;
        if (len > writableSize) {
            break;
        }

        str->WriteUtf8((buffer + pos), writableSize);
        writableSize -= len;
        pos += len;
    }

    *nchars = i;
    HILOG_DEBUG("EncodeWriteUtf8 the result of buffer: %{public}s", buffer);
    return pos;
}

void ArkNativeString::EncodeWriteChinese(std::string& buffer, const char* encoding)
{
    if (encoding == nullptr) {
        HILOG_ERROR("encoding is nullptr");
        return;
    }
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<StringRef> val = value_;
    int32_t length = val->Length();
    Local<ObjectRef> strObj = Local<ObjectRef>(val.ToLocal(vm));

    int32_t pos = 0;
    const int32_t writableSize = 22; // 22 : encode max bytes of the ucnv_convent function;

    std::string tempBuf = "";
    tempBuf.resize(writableSize + 1);

    UErrorCode ErrorCode = U_ZERO_ERROR;
    const char* encFrom = "utf8";
    for (int32_t i = 0; i < length; i++) {
        Local<StringRef> str = Local<StringRef>(strObj->Get(vm, i));
        int32_t len = str->Utf8Length() - 1;
        if ((pos + len) >= writableSize) {
            char outBuf[writableSize] = {0};
            ucnv_convert(encoding, encFrom, outBuf, writableSize, tempBuf.c_str(), pos, &ErrorCode);
            if (ErrorCode != U_ZERO_ERROR) {
                HILOG_ERROR("ucnv_convert is failed : ErrorCode = %{public}d", static_cast<int32_t>(ErrorCode));
                return;
            }
            buffer += outBuf;
            tempBuf.clear();
            pos = 0;
        }
        str->WriteUtf8((tempBuf.data() + pos), writableSize);
        pos += len;
    }
    if (pos > 0) {
        char outBuf[writableSize] = {0};
        ucnv_convert(encoding, encFrom, outBuf, writableSize, tempBuf.c_str(), pos, &ErrorCode);
        if (ErrorCode != U_ZERO_ERROR) {
            HILOG_ERROR("ucnv_convert is failed : ErrorCode = %{public}d", static_cast<int32_t>(ErrorCode));
            return;
        }
        buffer += outBuf;
    }
}
