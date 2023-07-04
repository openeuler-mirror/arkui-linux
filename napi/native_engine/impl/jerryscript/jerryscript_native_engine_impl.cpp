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

#include "jerryscript_native_engine_impl.h"

#include "jerryscript-ext/handler.h"
#include "jerryscript_native_deferred.h"
#include "jerryscript_native_reference.h"

#include "native_value/jerryscript_native_array.h"
#include "native_value/jerryscript_native_array_buffer.h"
#include "native_value/jerryscript_native_big_int.h"
#include "native_value/jerryscript_native_boolean.h"
#include "native_value/jerryscript_native_buffer.h"
#include "native_value/jerryscript_native_data_view.h"
#include "native_value/jerryscript_native_date.h"
#include "native_value/jerryscript_native_external.h"
#include "native_value/jerryscript_native_function.h"
#include "native_value/jerryscript_native_number.h"
#include "native_value/jerryscript_native_object.h"
#include "native_value/jerryscript_native_string.h"
#include "native_value/jerryscript_native_typed_array.h"
#include "utils/log.h"

JerryScriptNativeEngineImpl::JerryScriptNativeEngineImpl(NativeEngine* engine,
    void* jsEngineInterface) : NativeEngineInterface(engine, jsEngineInterface)
{
    HILOG_INFO("JerryScriptNativeEngineImpl::JerryScriptNativeEngineImpl begin");
    jerry_add_external();
    jerry_value_t global = jerry_get_global_object();
    jerry_value_t require = jerry_create_external_function([](const jerry_value_t function, const jerry_value_t thisVal,
                                                               const jerry_value_t args[],
                                                               const jerry_length_t argc) -> jerry_value_t {
        JerryScriptNativeEngineImpl* that = nullptr;
        jerry_get_object_native_pointer(function, (void**)&that, nullptr);
        jerry_value_t result = jerry_create_undefined();

        if (!(argc >= 1 && jerry_value_is_string(args[0]))) {
            return result;
        }

        jerry_size_t moduleNameSize = jerry_get_utf8_string_size(args[0]);
        if (moduleNameSize == 0) {
            return result;
        }

        char* moduleName = new char[moduleNameSize + 1] { 0 };
        uint32_t moduleNameLength = jerry_string_to_char_buffer(args[0], (jerry_char_t*)moduleName, moduleNameSize + 1);
        moduleName[moduleNameLength] = '\0';
        NativeModule* module = that->GetModuleManager()->LoadNativeModule(moduleName, nullptr, false);
        
        if (module != nullptr) {
            std::string strModuleName(moduleName);
            JerryScriptNativeEngine* nativeEngine = new JerryScriptNativeEngine(that, that->GetJsEngine(), false);
            auto jsNativeEngine = static_cast<JerryScriptNativeEngine*>(that->GetRootNativeEngine());
            if (!jsNativeEngine) {
                HILOG_ERROR("init module failed");
                return result;
            }
            NativeValue* value = that->CreateObject(static_cast<JerryScriptNativeEngine*>(nativeEngine));
            module->registerCallback(jsNativeEngine, value);
            result = jerry_acquire_value(*value);
            nativeEngine->SetModuleFileName(strModuleName);
        }
        return result;
    });
    jerry_set_object_native_pointer(require, this, nullptr);
    jerryx_set_property_str(global, "requireNapi", require);

    jerry_release_value(require);
    jerry_release_value(global);
    HILOG_INFO("JerryScriptNativeEngineImpl::JerryScriptNativeEngineImpl end");
    Init();
}

JerryScriptNativeEngineImpl::~JerryScriptNativeEngineImpl()
{
    HILOG_INFO("JerryScriptNativeEngineImpl::~JerryScriptNativeEngineImpl");
    Deinit();
}

void JerryScriptNativeEngineImpl::Loop(LoopMode mode, bool needSync)
{
    NativeEngineInterface::Loop(mode, needSync);
    jerry_value_t retVal = jerry_run_all_enqueued_jobs();
    jerry_release_value(retVal);
}

NativeValue* JerryScriptNativeEngineImpl::GetGlobal(NativeEngine* engine)
{
    return new JerryScriptNativeObject(static_cast<JerryScriptNativeEngine*>(engine), jerry_get_global_object());
}

NativeValue* JerryScriptNativeEngineImpl::CreateNull(NativeEngine* engine)
{
    return new JerryScriptNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerry_create_null());
}

NativeValue* JerryScriptNativeEngineImpl::CreateUndefined(NativeEngine* engine)
{
    return new JerryScriptNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerry_create_undefined());
}

NativeValue* JerryScriptNativeEngineImpl::CreateBoolean(NativeEngine* engine, bool value)
{
    return new JerryScriptNativeBoolean(static_cast<JerryScriptNativeEngine*>(engine), value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateNumber(NativeEngine* engine, int32_t value)
{
    return new JerryScriptNativeNumber(static_cast<JerryScriptNativeEngine*>(engine), (double)value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateNumber(NativeEngine* engine, uint32_t value)
{
    return new JerryScriptNativeNumber(static_cast<JerryScriptNativeEngine*>(engine), (double)value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateNumber(NativeEngine* engine, int64_t value)
{
    return new JerryScriptNativeNumber(static_cast<JerryScriptNativeEngine*>(engine), (double)value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateNumber(NativeEngine* engine, double value)
{
    return new JerryScriptNativeNumber(static_cast<JerryScriptNativeEngine*>(engine), (double)value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateString(NativeEngine* engine, const char* value, size_t length)
{
    return new JerryScriptNativeString(static_cast<JerryScriptNativeEngine*>(engine), value, length);
}

NativeValue* JerryScriptNativeEngineImpl::CreateSymbol(NativeEngine* engine, NativeValue* value)
{
    return new JerryScriptNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerry_create_symbol(*value));
}

NativeValue* JerryScriptNativeEngineImpl::CreateExternal(
    NativeEngine* engine, void* value, NativeFinalize callback, void* hint, [[maybe_unused]] size_t nativeBindingSize)
{
    return new JerryScriptNativeExternal(static_cast<JerryScriptNativeEngine*>(engine), value, callback, hint);
}

NativeValue* JerryScriptNativeEngineImpl::CreateObject(NativeEngine* engine)
{
    return new JerryScriptNativeObject(static_cast<JerryScriptNativeEngine*>(engine));
}

NativeValue* JerryScriptNativeEngineImpl::CreateNativeBindingObject(
    NativeEngine* engine, void* detach, void* attach)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::CreateFunction(
    NativeEngine* engine, const char* name, size_t length, NativeCallback cb, void* value)
{
    return new JerryScriptNativeFunction(static_cast<JerryScriptNativeEngine*>(engine), name, cb, value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateArray(NativeEngine* engine, size_t length)
{
    return new JerryScriptNativeArray(static_cast<JerryScriptNativeEngine*>(engine), (int)length);
}

NativeValue* JerryScriptNativeEngineImpl::CreateArrayBuffer(NativeEngine* engine, void** value, size_t length)
{
    return new JerryScriptNativeArrayBuffer(static_cast<JerryScriptNativeEngine*>(engine), value, length);
}

NativeValue* JerryScriptNativeEngineImpl::CreateArrayBufferExternal(
    NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint)
{
    return new JerryScriptNativeArrayBuffer(
        static_cast<JerryScriptNativeEngine*>(engine), (unsigned char*)value, length, cb, hint);
}

NativeValue* JerryScriptNativeEngineImpl::CreateBuffer(NativeEngine* engine, void** value, size_t length)
{
    return new JerryScriptNativeBuffer(static_cast<JerryScriptNativeEngine*>(engine), (uint8_t**)value, length);
}

NativeValue* JerryScriptNativeEngineImpl::CreateBufferCopy(
    NativeEngine* engine, void** value, size_t length, const void* data)
{
    return new JerryScriptNativeBuffer(
        static_cast<JerryScriptNativeEngine*>(engine), (uint8_t**)value, length, (uint8_t*)data);
}

NativeValue* JerryScriptNativeEngineImpl::CreateBufferExternal(
    NativeEngine* engine, void* value, size_t length, NativeFinalize cb, void* hint)
{
    return new JerryScriptNativeBuffer(
        static_cast<JerryScriptNativeEngine*>(engine), (uint8_t*)value, length, cb, hint);
}

NativeValue* JerryScriptNativeEngineImpl::CreateTypedArray(
    NativeEngine* engine, NativeTypedArrayType type, NativeValue* value, size_t length, size_t offset)
{
    return new JerryScriptNativeTypedArray(static_cast<JerryScriptNativeEngine*>(engine), type, value, length, offset);
}

NativeValue* JerryScriptNativeEngineImpl::CreateDataView(
    NativeEngine* engine, NativeValue* value, size_t length, size_t offset)
{
    return new JerryScriptNativeDataView(static_cast<JerryScriptNativeEngine*>(engine), value, length, offset);
}

NativeValue* JerryScriptNativeEngineImpl::CreatePromise(NativeEngine* engine, NativeDeferred** deferred)
{
    jerry_value_t promise = jerry_create_promise();
    *deferred = new JerryScriptNativeDeferred(promise);
    return new JerryScriptNativeValue(static_cast<JerryScriptNativeEngine*>(engine), promise);
}

NativeValue* JerryScriptNativeEngineImpl::CreateError(NativeEngine* engine, NativeValue* code, NativeValue* message)
{
    jerry_value_t jerror = 0;

    jerror = jerry_create_error_sz(JERRY_ERROR_COMMON, nullptr, 0);
    jerror = jerry_get_value_from_error(jerror, true);

    if (message) {
        jerry_value_t jreturn = jerryx_set_property_str(jerror, "message", *message);
        jerry_release_value(jreturn);
    }
    if (code) {
        jerry_value_t jreturn = jerryx_set_property_str(jerror, "code", *code);
        jerry_release_value(jreturn);
    }
    jerror = jerry_create_error_from_value(jerror, true);

    return new JerryScriptNativeObject(static_cast<JerryScriptNativeEngine*>(engine), jerror);
}

NativeValue* JerryScriptNativeEngineImpl::CallFunction(
    NativeEngine* engine, NativeValue* thisVar, NativeValue* function, NativeValue* const *argv, size_t argc)
{
    jerry_value_t* args = nullptr;
    if (argc > 0) {
        args = new jerry_value_t[argc];
        for (size_t i = 0; i < argc; i++) {
            if (argv[i] == nullptr) {
                args[i] = jerry_create_undefined();
            } else {
                args[i] = *argv[i];
            }
        }
    }
    NativeScope* scope = scopeManager_->Open();
    jerry_value_t result = jerry_call_function(*function, thisVar ? *thisVar : 0, (const jerry_value_t*)args, argc);
    scopeManager_->Close(scope);
    if (args != nullptr) {
        delete[] args;
    }

    if (jerry_value_is_error(result)) {
        jerry_value_t errorObj = jerry_get_value_from_error(result, true);
        jerry_value_t propName = jerry_create_string_from_utf8((const jerry_char_t*)"message");
        jerry_property_descriptor_t propDescriptor = { 0 };
        jerry_get_own_property_descriptor(errorObj, propName, &propDescriptor);
        jerry_value_t setResult = jerry_set_property(errorObj, propName, propDescriptor.value);
        jerry_release_value(propName);
        jerry_release_value(setResult);
        Throw(JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), errorObj));
        return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerry_create_undefined());
    } else {
        return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), result);
    }
}

NativeValue* JerryScriptNativeEngineImpl::RunScript(NativeEngine* engine, NativeValue* script)
{
    NativeString* pscript = (NativeString*)script->GetInterface(NativeString::INTERFACE_ID);

    size_t length = pscript->GetLength();
    if (length == 0) {
        return nullptr;
    }
    char* strScript = new char[length] { 0 };
    pscript->GetCString(strScript, length, &length);
    jerry_value_t result = jerry_eval((const unsigned char*)strScript, pscript->GetLength(), JERRY_PARSE_NO_OPTS);
    if (jerry_value_is_error(result)) {
        result = jerry_get_value_from_error(result, true);
    }
    delete[] strScript;
    return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), result);
}

NativeValue* JerryScriptNativeEngineImpl::RunBufferScript(NativeEngine* engine, std::vector<uint8_t>& buffer)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::RunActor(
    NativeEngine* engine, std::vector<uint8_t>& buffer, const char *descriptor)
{
    return RunBufferScript(engine, buffer);
}

NativeValue* JerryScriptNativeEngineImpl::DefineClass(
    NativeEngine* engine, const char* name, NativeCallback callback,
    void* data, const NativePropertyDescriptor* properties, size_t length)
{
    auto classConstructor = new JerryScriptNativeFunction(
        static_cast<JerryScriptNativeEngine*>(engine), name, callback, data);
    auto classProto = new JerryScriptNativeObject(static_cast<JerryScriptNativeEngine*>(engine));

    jerryx_set_property_str(*classConstructor, "prototype", *classProto);

    for (size_t i = 0; i < length; ++i) {
        if (properties[i].attributes & NATIVE_STATIC) {
            classConstructor->DefineProperty(properties[i]);
        } else {
            classProto->DefineProperty(properties[i]);
        }
    }
    return classConstructor;
}

NativeValue* JerryScriptNativeEngineImpl::CreateInstance(
    NativeEngine* engine, NativeValue* constructor, NativeValue* const *argv, size_t argc)
{
    return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerry_construct_object(
        *constructor, (const jerry_value_t*)argv, argc));
}

NativeReference* JerryScriptNativeEngineImpl::CreateReference(
    NativeEngine* engine, NativeValue* value, uint32_t initialRefcount,
    NativeFinalize callback, void* data, void* hint)
{
    return new JerryScriptNativeReference(
        static_cast<JerryScriptNativeEngine*>(engine), value, initialRefcount, callback, data, hint);
}

bool JerryScriptNativeEngineImpl::Throw(NativeValue* error)
{
    this->lastException_ = error;
    return true;
}

bool JerryScriptNativeEngineImpl::Throw(
    NativeEngine* engine, NativeErrorType type, const char* code, const char* message)
{
    jerry_value_t jerror = 0;
    jerry_error_t jtype;
    switch (type) {
        case NATIVE_COMMON_ERROR:
            jtype = JERRY_ERROR_COMMON;
            break;
        case NATIVE_TYPE_ERROR:
            jtype = JERRY_ERROR_TYPE;
            break;
        case NATIVE_RANGE_ERROR:
            jtype = JERRY_ERROR_RANGE;
            break;
        default:
            return false;
    }
    jerror = jerry_create_error(jtype, (const unsigned char*)message);
    jerror = jerry_get_value_from_error(jerror, true);
    if (code) {
        jerry_value_t jcode = jerry_create_string_from_utf8((const unsigned char*)code);
        jerryx_set_property_str(jerror, "code", jcode);
    }
    jerror = jerry_create_error_from_value(jerror, true);
    this->lastException_ = new JerryScriptNativeObject(static_cast<JerryScriptNativeEngine*>(engine), jerror);
    return true;
}

void* JerryScriptNativeEngineImpl::CreateRuntime(NativeEngine* engine)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::Serialize(NativeEngine* context, NativeValue* value,
    NativeValue* transfer)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::Deserialize(
    NativeEngine* engine, NativeEngine* context, NativeValue* recorder)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::LoadModule(
    NativeEngine* engine, NativeValue* str, const std::string& fileName)
{
    return nullptr;
}

NativeValue* JerryScriptNativeEngineImpl::JerryValueToNativeValue(
    JerryScriptNativeEngine* engine, jerry_value_t value)
{
    NativeValue* result = nullptr;
    switch (jerry_value_get_type(value)) {
        case JERRY_TYPE_NONE:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_UNDEFINED:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_NULL:
            result = new JerryScriptNativeValue(engine, value);
            break;
        case JERRY_TYPE_BOOLEAN:
            result = new JerryScriptNativeBoolean(engine, value);
            break;
        case JERRY_TYPE_NUMBER:
            result = new JerryScriptNativeNumber(engine, value);
            break;
        case JERRY_TYPE_STRING:
            result = new JerryScriptNativeString(engine, value);
            break;
        case JERRY_TYPE_OBJECT:
            if (jerry_value_is_array(value)) {
                result = new JerryScriptNativeArray(engine, value);
            } else if (jerry_value_is_arraybuffer(value)) {
                result = new JerryScriptNativeArrayBuffer(engine, value);
            } else if (jerry_value_is_dataview(value)) {
                result = new JerryScriptNativeDataView(engine, value);
            } else if (jerry_value_is_typedarray(value)) {
                result = new JerryScriptNativeTypedArray(engine, value);
            } else if (jerry_value_is_external(value)) {
                result = new JerryScriptNativeExternal(engine, value);
            } else if (jerry_is_date(value)) {
                result = new JerryScriptNativeDate(engine, value);
            } else {
                result = new JerryScriptNativeObject(engine, value);
            }
            break;
        case JERRY_TYPE_FUNCTION:
            result = new JerryScriptNativeFunction(engine, value);
            break;
        case JERRY_TYPE_ERROR:
            result = new JerryScriptNativeObject(engine, value);
            break;
        case JERRY_TYPE_SYMBOL:
            result = new JerryScriptNativeValue(engine, value);
            break;
#if JERRY_API_MINOR_VERSION > 3
        case JERRY_TYPE_BIGINT:
                result = new JerryScriptNativeBigInt(engine, value);
                break;
#endif
        default:;
    }
    return result;
}

NativeValue* JerryScriptNativeEngineImpl::ValueToNativeValue(NativeEngine* engine, JSValueWrapper& value)
{
    jerry_value_t jerryValue = value;
    return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), jerryValue);
}

bool JerryScriptNativeEngineImpl::TriggerFatalException(NativeValue* error)
{
    return false;
}

bool JerryScriptNativeEngineImpl::AdjustExternalMemory(int64_t ChangeInBytes, int64_t* AdjustedValue)
{
    HILOG_INFO("L1: napi_adjust_external_memory not supported!");
    return true;
}

NativeValue* JerryScriptNativeEngineImpl::CreateDate(NativeEngine* engine, double time)
{
    jerry_value_t value = jerry_strict_date(time);
    return JerryValueToNativeValue(static_cast<JerryScriptNativeEngine*>(engine), value);
}

void JerryScriptNativeEngineImpl::SetPromiseRejectCallback(
    NativeEngine* engine, NativeReference* rejectCallbackRef, NativeReference* checkCallbackRef) {}

NativeValue* JerryScriptNativeEngineImpl::CreateBigWords(
    NativeEngine* engine, int sign_bit, size_t word_count, const uint64_t* words)
{
#if JERRY_API_MINOR_VERSION > 3 // jerryscript2.3: 3,  jerryscript2.4: 4
    constexpr int bigintMod = 2;
    bool sign = false;
    if ((sign_bit % bigintMod) == 1) {
        sign = true;
    }
    uint32_t size = (uint32_t)word_count;

    jerry_value_t jerryValue = jerry_create_bigint(words, size, sign);

    return new JerryScriptNativeBigInt(static_cast<JerryScriptNativeEngine*>(engine), jerryValue);
#else
    return nullptr;
#endif
}

NativeValue* JerryScriptNativeEngineImpl::CreateBigInt(NativeEngine* engine, int64_t value)
{
    return new JerryScriptNativeBigInt(static_cast<JerryScriptNativeEngine*>(engine), value);
}

NativeValue* JerryScriptNativeEngineImpl::CreateBigInt(NativeEngine* engine, uint64_t value)
{
#if JERRY_API_MINOR_VERSION > 3 // jerryscript2.3: 3,  jerryscript2.4: 4
    return new JerryScriptNativeBigInt(static_cast<JerryScriptNativeEngine*>(engine), value, true);
#else
    return nullptr;
#endif
}

NativeValue* JerryScriptNativeEngineImpl::CreateString16(NativeEngine* engine, const char16_t* value, size_t length)
{
    return new JerryScriptNativeString(static_cast<JerryScriptNativeEngine*>(engine), value, length);
}
