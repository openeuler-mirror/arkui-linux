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

#include "ark_native_object.h"

#include "ark_headers.h"
#include "ark_native_array.h"
#include "ark_native_external.h"
#include "ark_native_function.h"
#include "ark_native_reference.h"
#include "ark_native_string.h"

#include "native_engine/native_property.h"

#include "utils/log.h"

using panda::ObjectRef;
using panda::StringRef;
using panda::NativePointerRef;
using panda::ArrayRef;
using panda::PropertyAttribute;

DetachCallback ArkNativeObject::detach_ = nullptr;
AttachCallback ArkNativeObject::attach_ = nullptr;

ArkNativeObject::ArkNativeObject(ArkNativeEngine* engine)
    : ArkNativeObject(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    auto vm = engine->GetEcmaVm();
    LocalScope scope(vm);
    Local<ObjectRef> object = ObjectRef::New(vm);
    value_ = Global<ObjectRef>(vm, object);
}

ArkNativeObject::ArkNativeObject(ArkNativeEngine* engine, Local<JSValueRef> value) : ArkNativeValue(engine, value) {}

ArkNativeObject::ArkNativeObject(ArkNativeEngine* engine, void* detach, void* attach)
    : ArkNativeObject(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    auto vm = engine->GetEcmaVm();
    LocalScope scope(vm);
    Local<ObjectRef> object = ObjectRef::New(vm, detach, attach);
    value_ = Global<ObjectRef>(vm, object);
}

void* ArkNativeObject::DetachFuncCallback(void* engine, void* object, void* hint, void* detachData)
{
    if (detachData == nullptr || (engine == nullptr || object ==nullptr)) {
        HILOG_ERROR("DetachFuncCallback params has nullptr");
        return nullptr;
    }
    DetachCallback detach = reinterpret_cast<DetachCallback>(detachData);
    void* detachVal = detach(reinterpret_cast<NativeEngine*>(engine), object, hint);
    return detachVal;
}

Local<JSValueRef> ArkNativeObject::AttachFuncCallback(void* engine, void* buffer, void* hint, void* attachData)
{
    panda::EscapeLocalScope scope(reinterpret_cast<ArkNativeEngine*>(engine)->GetEcmaVm());
    if (attachData == nullptr || (engine == nullptr || buffer ==nullptr)) {
        HILOG_ERROR("AttachFuncCallback params has nullptr");
    }
    AttachCallback attach = reinterpret_cast<AttachCallback>(attachData);
    NativeValue* attachVal = attach(reinterpret_cast<NativeEngine*>(engine), buffer, hint);
    Global<JSValueRef> result = *attachVal;
    return scope.Escape(result.ToLocal(reinterpret_cast<ArkNativeEngine*>(engine)->GetEcmaVm()));
}

ArkNativeObject::ArkNativeObject(ArkNativeEngine* engine, DetachCallback detach, AttachCallback attach)
    : ArkNativeObject(engine, JSValueRef::Undefined(engine->GetEcmaVm()))
{
    {
        std::lock_guard<std::mutex> lock(funcMutex_);
        detach_ = detach;
        attach_ = attach;
    }
    auto vm = engine->GetEcmaVm();
    LocalScope scope(vm);
    Local<ObjectRef> object = ObjectRef::New(
        vm, reinterpret_cast<void*>(DetachFuncCallback), reinterpret_cast<void*>(AttachFuncCallback));
    value_ = Global<ObjectRef>(vm, object);
}

ArkNativeObject::~ArkNativeObject() {}

bool ArkNativeObject::ConvertToNativeBindingObject(
    void* engine, DetachCallback detachData, AttachCallback attachData, void *object, void *hint)
{
    if (detachData == nullptr || (attachData == nullptr || object == nullptr)) {
        HILOG_ERROR("ConvertToNativeBindingObject params has nullptr");
        return false;
    }
    auto vm = reinterpret_cast<ArkNativeEngine*>(engine)->GetEcmaVm();
    Global<ObjectRef> obj = value_;
    bool res = obj->Set(vm, reinterpret_cast<void*>(DetachFuncCallback), reinterpret_cast<void*>(AttachFuncCallback));
    this->SetNativeBindingPointer(
        engine, object, hint, reinterpret_cast<void *>(detachData), reinterpret_cast<void *>(attachData));
    return res;
}

void* ArkNativeObject::GetInterface(int interfaceId)
{
    return (NativeObject::INTERFACE_ID == interfaceId) ? (NativeObject*)this : nullptr;
}

void ArkNativeObject::SetNativePointer(void* pointer, NativeFinalize cb, void* hint,
    NativeReference** reference, size_t nativeBindingSize)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> value = value_;

    Local<StringRef> key = StringRef::GetNapiWrapperString(vm);
    if (pointer == nullptr && value->Has(vm, key)) {
        Local<ObjectRef> wrapper = value->Get(vm, key);
        auto ref = reinterpret_cast<ArkNativeReference*>(wrapper->GetNativePointerField(0));
        // Try to remove native pointer from ArrayDataList
        ASSERT(nativeBindingSize == 0);
        wrapper->SetNativePointerField(0, nullptr, nullptr, nullptr, nativeBindingSize);
        value->Delete(vm, key);
        delete ref;
    } else {
        Local<ObjectRef> object = ObjectRef::New(vm);
        ArkNativeReference* ref = nullptr;
        if (reference != nullptr) {
            ref = new ArkNativeReference(engine_, this, 1, false, cb, pointer, hint);
            *reference = ref;
        } else {
            ref = new ArkNativeReference(engine_, this, 0, true, cb, pointer, hint);
        }
        object->SetNativePointerFieldCount(1);
        object->SetNativePointerField(0, ref, nullptr, nullptr, nativeBindingSize);
        PropertyAttribute attr(object, true, false, true);
        value->DefineProperty(vm, key, attr);
    }
}

void* ArkNativeObject::GetNativePointer()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> value = value_;
    Local<StringRef> key = StringRef::GetNapiWrapperString(vm);
    Local<JSValueRef> val = value->Get(vm, key);
    void* result = nullptr;
    if (val->IsObject()) {
        Local<ObjectRef> ext(val);
        auto ref = reinterpret_cast<ArkNativeReference*>(ext->GetNativePointerField(0));
        result = ref != nullptr ? ref->GetData() : nullptr;
    }
    return result;
}

void ArkNativeObject::SetNativeBindingPointer(
    void *enginePointer, void *objPointer, void *hint, void *detachData, void *attachData)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> value = value_;

    Local<ObjectRef> object = Local<ObjectRef>(value.ToLocal(vm));
    object->SetNativePointerFieldCount(5); // 5 : NativeEngine, NativeObject, hint, detachData, attachData
    object->SetNativePointerField(0, enginePointer, nullptr, nullptr);
    object->SetNativePointerField(1, objPointer, nullptr, nullptr);
    object->SetNativePointerField(2, hint, nullptr, nullptr); // 2 : hint
    object->SetNativePointerField(3, detachData, nullptr, nullptr); // 3 : detachData
    object->SetNativePointerField(4, attachData, nullptr, nullptr); // 4 : attachData
}

void* ArkNativeObject::GetNativeBindingPointer(uint32_t index)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> value = value_;
    uint32_t paramCount = static_cast<uint32_t>(value->GetNativePointerFieldCount());
    if (index >= paramCount) {
        HILOG_ERROR("index more than nativebindingpointer count");
        return nullptr;
    }
    return value->GetNativePointerField(index);
}

NativeValue* ArkNativeObject::GetPropertyNames()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> val = value_;
    Local<ArrayRef> arrayVal = val->GetOwnPropertyNames(vm);
    NativeChunk& chunk = engine_->GetNativeChunk();
    return chunk.New<ArkNativeArray>(engine_, arrayVal);
}

NativeValue* ArkNativeObject::GetEnumerablePropertyNames()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> val = value_;
    Local<ArrayRef> arrayVal = val->GetOwnEnumerablePropertyNames(vm);
    NativeChunk& chunk = engine_->GetNativeChunk();
    return chunk.New<ArkNativeArray>(engine_, arrayVal);
}

NativeValue* ArkNativeObject::GetPrototype()
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> obj = value_;
    Local<JSValueRef> val = obj->GetPrototype(vm);

    return ArkNativeEngine::ArkValueToNativeValue(engine_, val);
}

bool ArkNativeObject::DefineProperty(NativePropertyDescriptor propertyDescriptor)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> obj = value_;
    bool result = false;
    Local<StringRef> propertyName = StringRef::NewFromUtf8(vm, propertyDescriptor.utf8name);

    bool writable = (propertyDescriptor.attributes & NATIVE_WRITABLE) != 0;
    bool enumable = (propertyDescriptor.attributes & NATIVE_ENUMERABLE) != 0;
    bool configable = (propertyDescriptor.attributes & NATIVE_CONFIGURABLE) != 0;

    NativeScopeManager* scopeManager = engine_->GetScopeManager();
    if (scopeManager == nullptr) {
        HILOG_ERROR("scope manager is null");
        return false;
    }
    NativeScope* nativeScope = scopeManager->Open();
    std::string fullName("");
#ifdef ENABLE_HITRACE
    fullName += GetModuleName();
#endif
    NativeChunk& chunk = engine_->GetNativeChunk();
    if (propertyDescriptor.getter != nullptr || propertyDescriptor.setter != nullptr) {
        Local<JSValueRef> localGetter = JSValueRef::Undefined(vm);
        Local<JSValueRef> localSetter = JSValueRef::Undefined(vm);

        if (propertyDescriptor.getter != nullptr) {
            fullName += "getter";
            NativeValue* getter = chunk.New<ArkNativeFunction>(
                engine_, fullName.c_str(), 0, propertyDescriptor.getter, propertyDescriptor.data);
            Global<JSValueRef> globalGetter = *getter;
            localGetter = globalGetter.ToLocal(vm);
        }
        if (propertyDescriptor.setter != nullptr) {
            fullName += "setter";
            NativeValue* setter = chunk.New<ArkNativeFunction>(
                engine_, fullName.c_str(), 0, propertyDescriptor.setter, propertyDescriptor.data);
            Global<JSValueRef> globalSetter = *setter;
            localSetter = globalSetter.ToLocal(vm);
        }

        PropertyAttribute attr(JSValueRef::Undefined(engine_->GetEcmaVm()), false, enumable, configable);
        result = obj->SetAccessorProperty(vm, propertyName, localGetter, localSetter, attr);
    } else if (propertyDescriptor.method != nullptr) {
        fullName += propertyDescriptor.utf8name;
        NativeValue* cb = chunk.New<ArkNativeFunction>(engine_, fullName.c_str(), 0, propertyDescriptor.method,
                                               propertyDescriptor.data);
        Global<JSValueRef> globalCb = *cb;
        PropertyAttribute attr(globalCb.ToLocal(vm), writable, enumable, configable);
        result = obj->DefineProperty(vm, propertyName, attr);
    } else {
        Global<JSValueRef> value = *(propertyDescriptor.value);

        PropertyAttribute attr(value.ToLocal(vm), writable, enumable, configable);
        result = obj->DefineProperty(vm, propertyName, attr);
    }
    Local<ObjectRef> excep = panda::JSNApi::GetUncaughtException(vm);
    if (!excep.IsNull()) {
        HILOG_ERROR("ArkNativeObject::DefineProperty occur Exception");
        panda::JSNApi::GetAndClearUncaughtException(vm);
    }
    scopeManager->Close(nativeScope);
    return result;
}

bool ArkNativeObject::SetProperty(NativeValue* key, NativeValue* value)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> obj = value_;
    Global<JSValueRef> k = *key;
    Global<JSValueRef> val = *value;

    return obj->Set(vm, k.ToLocal(vm), val.ToLocal(vm));
}

NativeValue* ArkNativeObject::GetProperty(NativeValue* key)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<JSValueRef> k = *key;
    Global<ObjectRef> obj = value_;

    Local<JSValueRef> val = obj->Get(vm, k.ToLocal(vm));
    return ArkNativeEngine::ArkValueToNativeValue(engine_, val);
}

bool ArkNativeObject::HasProperty(NativeValue* key)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<ObjectRef> obj = value_;
    Global<JSValueRef> k = *key;

    return obj->Has(vm, k.ToLocal(vm));
}

bool ArkNativeObject::DeleteProperty(NativeValue* key)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);
    Global<JSValueRef> k = *key;
    Global<ObjectRef> obj = value_;

    return obj->Delete(vm, k.ToLocal(vm));
}

bool ArkNativeObject::SetProperty(const char* name, NativeValue* value)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);

    Global<ObjectRef> obj = value_;
    Local<StringRef> key = StringRef::NewFromUtf8(vm, name);
    Global<JSValueRef> val = *value;

    return obj->Set(vm, key, val.ToLocal(vm));
}

NativeValue* ArkNativeObject::GetProperty(const char* name)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);

    Local<StringRef> key = StringRef::NewFromUtf8(vm, name);
    Global<ObjectRef> obj = value_;
    Local<JSValueRef> val = obj->Get(vm, key);
    return ArkNativeEngine::ArkValueToNativeValue(engine_, val);
}

bool ArkNativeObject::HasProperty(const char* name)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);

    Local<StringRef> key = StringRef::NewFromUtf8(vm, name);
    Global<ObjectRef> obj = value_;

    return obj->Has(vm, key);
}

bool ArkNativeObject::DeleteProperty(const char* name)
{
    auto vm = engine_->GetEcmaVm();
    LocalScope scope(vm);

    Local<StringRef> key = StringRef::NewFromUtf8(vm, name);
    Global<ObjectRef> obj = value_;

    return obj->Delete(vm, key);
}

bool ArkNativeObject::SetPrivateProperty(const char* name, NativeValue* value)
{
    return false;
}

NativeValue* ArkNativeObject::GetPrivateProperty(const char* name)
{
    return nullptr;
}

bool ArkNativeObject::HasPrivateProperty(const char* name)
{
    return false;
}

bool ArkNativeObject::DeletePrivateProperty(const char* name)
{
    return false;
}

NativeValue* ArkNativeObject::GetAllPropertyNames(
    napi_key_collection_mode keyMode, napi_key_filter keyFilter, napi_key_conversion keyConversion)
{
    return nullptr;
}

bool ArkNativeObject::AssociateTypeTag(NapiTypeTag* typeTag)
{
    return true;
}

bool ArkNativeObject::CheckTypeTag(NapiTypeTag* typeTag)
{
    return true;
}

void ArkNativeObject::SetModuleName(std::string moduleName)
{
    NativeChunk& chunk = engine_->GetNativeChunk();
    NativeValue* moduleValue = chunk.New<ArkNativeString>(engine_, moduleName.c_str(),
        moduleName.size());
    this->SetProperty(ArkNativeObject::PANDA_MODULE_NAME, moduleValue);
}

std::string ArkNativeObject::GetModuleName()
{
    std::string moduleName("");
    auto nativeModuleName = this->GetProperty(ArkNativeObject::PANDA_MODULE_NAME);
    if (nativeModuleName != nullptr && nativeModuleName->TypeOf() == NATIVE_STRING) {
        auto nativeString = reinterpret_cast<NativeString*>(nativeModuleName->GetInterface(NativeString::INTERFACE_ID));
        char arrayName[PANDA_MODULE_NAME_LEN] = {0};
        size_t len = 0;
        nativeString->GetCString(arrayName, PANDA_MODULE_NAME_LEN, &len);
        moduleName += arrayName;
        moduleName += ".";
    }
    return moduleName;
}

void ArkNativeObject::AddFinalizer(void* pointer, NativeFinalize cb, void* hint) {}

void ArkNativeObject::Freeze() {}

void ArkNativeObject::Seal() {}