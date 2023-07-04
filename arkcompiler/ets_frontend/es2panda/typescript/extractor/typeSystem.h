/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ES2PANDA_TYPESCRIPT_EXACTOR_TYPESYSTEM_H
#define ES2PANDA_TYPESCRIPT_EXACTOR_TYPESYSTEM_H

#include <cstdint>

#include <binder/variable.h>
#include <compiler/base/literals.h>
#include <ir/astDump.h>
#include <ir/astNode.h>
#include <ir/base/classDefinition.h>
#include <ir/base/classProperty.h>
#include <ir/base/methodDefinition.h>
#include <ir/base/scriptFunction.h>
#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/functionExpression.h>
#include <ir/expressions/identifier.h>
#include <ir/expressions/literals/numberLiteral.h>
#include <ir/expressions/literals/stringLiteral.h>
#include <ir/statements/classDeclaration.h>
#include <ir/statements/functionDeclaration.h>
#include <ir/ts/tsArrayType.h>
#include <ir/ts/tsClassImplements.h>
#include <ir/ts/tsInterfaceBody.h>
#include <ir/ts/tsInterfaceDeclaration.h>
#include <ir/ts/tsInterfaceHeritage.h>
#include <ir/ts/tsMethodSignature.h>
#include <ir/ts/tsParameterProperty.h>
#include <ir/ts/tsPrivateIdentifier.h>
#include <ir/ts/tsPropertySignature.h>
#include <ir/ts/tsTypeLiteral.h>
#include <ir/ts/tsUnionType.h>

namespace panda::es2panda::extractor {

enum PrimitiveType : uint8_t {
    ANY = 0,
    NUMBER,
    BOOLEAN,
    VOID,
    STRING,
    SYMBOL,
    NUL,
    UNDEFINED,
    INT,
};

const std::unordered_map<ir::AstNodeType, PrimitiveType> PRIMITIVE_TYPE_MAP = {
    {ir::AstNodeType::TS_ANY_KEYWORD, PrimitiveType::ANY},
    {ir::AstNodeType::TS_NUMBER_KEYWORD, PrimitiveType::NUMBER},
    {ir::AstNodeType::TS_BOOLEAN_KEYWORD, PrimitiveType::BOOLEAN},
    {ir::AstNodeType::TS_VOID_KEYWORD, PrimitiveType::VOID},
    {ir::AstNodeType::TS_STRING_KEYWORD, PrimitiveType::STRING},
    {ir::AstNodeType::TS_SYMBOL_KEYWORD, PrimitiveType::SYMBOL},
    {ir::AstNodeType::TS_NULL_KEYWORD, PrimitiveType::NUL},
    {ir::AstNodeType::TS_UNDEFINED_KEYWORD, PrimitiveType::UNDEFINED},
    // Placeholder for Type Inference INT
};

enum BuiltinType : uint8_t {
    BT_HEAD = 20,
    BT_FUNCTION,
    BT_RANGEERROR,
    BT_ERROR,
    BT_OBJECT,
    BT_SYNTAXERROR,
    BT_TYPEERROR,
    BT_REFERENCEERROR,
    BT_URIERROR,
    BT_SYMBOL,
    BT_EVALERROR,
    BT_NUMBER,
    BT_PARSEFLOAT,
    BT_DATE,
    BT_BOOLEAN,
    BT_BIGINT,
    BT_PARSEINT,
    BT_WEAKMAP,
    BT_REGEXP,
    BT_SET,
    BT_MAP,
    BT_WEAKREF,
    BT_WEAKSET,
    BT_FINALIZATIONREGISTRY,
    BT_ARRAY,
    BT_UINT8CLAMPEDARRAY,
    BT_UINT8ARRAY,
    BT_TYPEDARRAY,
    BT_INT8ARRAY,
    BT_UINT16ARRAY,
    BT_UINT32ARRAY,
    BT_INT16ARRAY,
    BT_INT32ARRAY,
    BT_FLOAT32ARRAY,
    BT_FLOAT64ARRAY,
    BT_BIGINT64ARRAY,
    BT_BIGUINT64ARRAY,
    BT_SHAREDARRAYBUFFER,
    BT_DATAVIEW,
    BT_STRING,
    BT_ARRAYBUFFER,
    BT_EVAL,
    BT_ISFINITE,
    BT_ARKPRIVATE,
    BT_PRINT,
    BT_DECODEURI,
    BT_DECODEURICOMPONENT,
    BT_ISNAN,
    BT_ENCODEURI,
    BT_NAN,
    BT_GLOBALTHIS,
    BT_ENCODEURICOMPONENT,
    BT_INFINITY,
    BT_MATH,
    BT_JSON,
    BT_ATOMICS,
    BT_UNDEFINED,
    BT_REFLECT,
    BT_PROMISE,
    BT_PROXY,
    BT_GENERATORFUNCTION,
    BT_INTL,
};

const std::unordered_map<std::string, BuiltinType> BUILTIN_TYPE_MAP = {
    {"Function", BuiltinType::BT_FUNCTION},
    {"RangeError", BuiltinType::BT_RANGEERROR},
    {"Error", BuiltinType::BT_ERROR},
    {"Object", BuiltinType::BT_OBJECT},
    {"SyntaxError", BuiltinType::BT_SYNTAXERROR},
    {"TypeError", BuiltinType::BT_TYPEERROR},
    {"ReferenceError", BuiltinType::BT_REFERENCEERROR},
    {"URIError", BuiltinType::BT_URIERROR},
    {"Symbol", BuiltinType::BT_SYMBOL},
    {"EvalError", BuiltinType::BT_EVALERROR},
    {"Number", BuiltinType::BT_NUMBER},
    {"parseFloat", BuiltinType::BT_PARSEFLOAT},
    {"Date", BuiltinType::BT_DATE},
    {"Boolean", BuiltinType::BT_BOOLEAN},
    {"BigInt", BuiltinType::BT_BIGINT},
    {"parseInt", BuiltinType::BT_PARSEINT},
    {"WeakMap", BuiltinType::BT_WEAKMAP},
    {"RegExp", BuiltinType::BT_REGEXP},
    {"Set", BuiltinType::BT_SET},
    {"Map", BuiltinType::BT_MAP},
    {"WeakRef", BuiltinType::BT_WEAKREF},
    {"WeakSet", BuiltinType::BT_WEAKSET},
    {"FinalizationRegistry", BuiltinType::BT_FINALIZATIONREGISTRY},
    {"Array", BuiltinType::BT_ARRAY},
    {"Uint8ClampedArray", BuiltinType::BT_UINT8CLAMPEDARRAY},
    {"Uint8Array", BuiltinType::BT_UINT8ARRAY},
    {"TypedArray", BuiltinType::BT_TYPEDARRAY},
    {"Int8Array", BuiltinType::BT_INT8ARRAY},
    {"Uint16Array", BuiltinType::BT_UINT16ARRAY},
    {"Uint32Array", BuiltinType::BT_UINT32ARRAY},
    {"Int16Array", BuiltinType::BT_INT16ARRAY},
    {"Int32Array", BuiltinType::BT_INT32ARRAY},
    {"Float32Array", BuiltinType::BT_FLOAT32ARRAY},
    {"Float64Array", BuiltinType::BT_FLOAT64ARRAY},
    {"BigInt64Array", BuiltinType::BT_BIGINT64ARRAY},
    {"BigUint64Array", BuiltinType::BT_BIGUINT64ARRAY},
    {"SharedArrayBuffer", BuiltinType::BT_SHAREDARRAYBUFFER},
    {"DataView", BuiltinType::BT_DATAVIEW},
    {"String", BuiltinType::BT_STRING},
    {"ArrayBuffer", BuiltinType::BT_ARRAYBUFFER},
    {"eval", BuiltinType::BT_EVAL},
    {"isFinite", BuiltinType::BT_ISFINITE},
    {"ArkPrivate", BuiltinType::BT_ARKPRIVATE},
    {"print", BuiltinType::BT_PRINT},
    {"decodeURI", BuiltinType::BT_DECODEURI},
    {"decodeURIComponent", BuiltinType::BT_DECODEURICOMPONENT},
    {"isNaN", BuiltinType::BT_ISNAN},
    {"encodeURI", BuiltinType::BT_ENCODEURI},
    {"NaN", BuiltinType::BT_NAN},
    {"globalThis", BuiltinType::BT_GLOBALTHIS},
    {"encodeURIComponent", BuiltinType::BT_ENCODEURICOMPONENT},
    {"Infinity", BuiltinType::BT_INFINITY},
    {"Math", BuiltinType::BT_MATH},
    {"JSON", BuiltinType::BT_JSON},
    {"Atomics", BuiltinType::BT_ATOMICS},
    {"undefined", BuiltinType::BT_UNDEFINED},
    {"Reflect", BuiltinType::BT_REFLECT},
    {"Promise", BuiltinType::BT_PROMISE},
    {"Proxy", BuiltinType::BT_PROXY},
    {"GeneratorFunction", BuiltinType::BT_GENERATORFUNCTION},
    {"Intl", BuiltinType::BT_INTL},
};

enum UserType : uint8_t {
    COUNTER,
    CLASS,
    CLASSINST,
    FUNCTION,
    UNION,
    ARRAY,
    OBJECT,
    EXTERNAL,
    INTERFACE,
    BUILTININST
};

enum Modifier : uint8_t {
    NONSTATIC = 0,
    STATIC = 1 << 2,
    ASYNC = 1 << 3,
    GENERATOR = 1 << 4
};

enum ModifierAB : uint8_t {
    NONABSTRACT,
    ABSTRACT
};

enum ModifierRO : uint8_t {
    NONREADONLY,
    READONLY
};

enum AccessFlag : uint8_t {
    PUBLIC,
    PRIVATE,
    PROTECTED
};

class BaseType {
public:
    explicit BaseType(TypeExtractor *extractor)
        : extractor_(extractor), recorder_(extractor_->Recorder()), buffer_(recorder_->NewLiteralBuffer())
    {
    }
    ~BaseType() = default;
    NO_COPY_SEMANTIC(BaseType);
    NO_MOVE_SEMANTIC(BaseType);

protected:
    TypeExtractor *extractor_;
    TypeRecorder *recorder_;
    compiler::LiteralBuffer *buffer_;

    void CalculateIndex(const util::StringView &name, int64_t &typeIndex, int64_t &typeIndexShift, bool forBuiltin)
    {
        if (forBuiltin && extractor_->GetTypeDtsBuiltin()) {
            auto t = BUILTIN_TYPE_MAP.find(std::string(name));
            if (t != BUILTIN_TYPE_MAP.end()) {
                typeIndexShift = t->second;
                typeIndex = typeIndexShift - BuiltinType::BT_HEAD;
            }
        }

        if (typeIndex == PrimitiveType::ANY) {
            typeIndex = recorder_->AddLiteralBuffer(buffer_);
            typeIndexShift = typeIndex + recorder_->GetUserTypeIndexShift();
        } else {
            recorder_->SetLiteralBuffer(typeIndex, buffer_);
        }
    }

    std::variant<util::StringView, const ir::Identifier *> CalculateName(const ir::Expression *expression)
    {
        if (expression->IsLiteral()) {
            auto name = expression->AsLiteral()->GetName();
            if (name.has_value()) {
                return name.value();
            }
            return nullptr;
        } else {
            return extractor_->GetIdentifierFromExpression(expression);
        }
    }

    std::string CalculateStr(const ArenaVector<ir::Expression *> &expressions)
    {
        std::vector<std::string> tmp;
        for (const auto &t : expressions) {
            ir::AstDumper dumper(t);
            tmp.emplace_back(dumper.Str());
        }
        std::sort(tmp.begin(), tmp.end());

        std::stringstream ss;
        for (const auto &t : tmp) {
            ss << t;
        }
        return ss.str();
    }
};

class TypeCounter : public BaseType {
public:
    explicit TypeCounter(TypeExtractor *extractor) : BaseType(extractor)
    {
        typeIndexPlaceHolder_ = recorder_->AddLiteralBuffer(buffer_);
        if (extractor_->GetTypeDtsExtractor()) {
            // Make builtin type slots
            for (int64_t i = 0; i < TypeRecorder::USERTYPEINDEXHEAD - BuiltinType::BT_HEAD; i++) {
                auto buffer = recorder_->NewLiteralBuffer();
                (void)recorder_->AddLiteralBuffer(buffer);
            }
            recorder_->SetUserTypeIndexShift(BuiltinType::BT_HEAD);
        }
    }
    ~TypeCounter() = default;
    NO_COPY_SEMANTIC(TypeCounter);
    NO_MOVE_SEMANTIC(TypeCounter);

    int64_t GetTypeIndexPlaceHolder() const
    {
        return typeIndexPlaceHolder_;
    }

    void FillLiteralBuffer()
    {
        int64_t userTypeNumber = recorder_->CalculateUserType();
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::COUNTER));
        if (extractor_->GetTypeDtsExtractor()) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(userTypeNumber +
                TypeRecorder::USERTYPEINDEXHEAD - BuiltinType::BT_HEAD));
        } else {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(userTypeNumber));
        }
        const auto &anonymousReExport = recorder_->GetAnonymousReExport();
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(anonymousReExport.size()));
        std::for_each(anonymousReExport.begin(), anonymousReExport.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t));
        });
        recorder_->SetLiteralBuffer(typeIndexPlaceHolder_, buffer_);
    }

private:
    int64_t typeIndexPlaceHolder_ = PrimitiveType::ANY;
};

// For { MethodDefinition / FunctionDeclaration / FunctionExpression } -> ScriptFunction / TSMethodSignature
class FunctionType : public BaseType {
public:
    explicit FunctionType(TypeExtractor *extractor, const ir::AstNode *node, const util::StringView &name)
        : BaseType(extractor), paramsTypeIndex_(recorder_->Allocator()->Adapter())
    {
        CalculateIndex(name, typeIndex_, typeIndexShift_, !(node->IsTSMethodSignature()));
        name_ = name;

        auto fn = [this](const auto *func) {
            recorder_->SetNodeTypeIndex(func, typeIndexShift_);
            recorder_->AddUserType(typeIndexShift_);
            if constexpr (std::is_same_v<decltype(func), const ir::ScriptFunction *>) {
                if (name_.Is("")) {
                    name_ = recorder_->GetAnonymousFunctionNames(func);
                }
                FillModifier(func);
            }
            FillParameters(func);
            FillReturn(func);
            FillLiteralBuffer();
        };
        if (node->IsMethodDefinition()) {
            auto methodDef = node->AsMethodDefinition();
            auto modifiers = methodDef->Modifiers();
            if (modifiers & ir::ModifierFlags::PRIVATE) {
                accessFlag_ = AccessFlag::PRIVATE;
            }
            if (modifiers & ir::ModifierFlags::PROTECTED) {
                accessFlag_ = AccessFlag::PROTECTED;
            }
            if (methodDef->IsStatic()) {
                modifier_ += Modifier::STATIC;
            }
            fn(node->AsMethodDefinition()->Function());
        } else if (node->IsFunctionDeclaration()) {
            fn(node->AsFunctionDeclaration()->Function());
        } else if (node->IsFunctionExpression()) {
            fn(node->AsFunctionExpression()->Function());
        } else if (node->IsTSMethodSignature()) {
            fn(node->AsTSMethodSignature());
        }
    }
    ~FunctionType() = default;
    NO_COPY_SEMANTIC(FunctionType);
    NO_MOVE_SEMANTIC(FunctionType);

    uint8_t GetModifier() const
    {
        return modifier_;
    }

    int64_t GetTypeIndexShift() const
    {
        return typeIndexShift_;
    }

private:
    util::StringView name_ {};
    AccessFlag accessFlag_ = AccessFlag::PUBLIC;
    uint8_t modifier_ = Modifier::NONSTATIC;
    bool containThis_ = false;
    ArenaVector<int64_t> paramsTypeIndex_;
    int64_t typeIndexReturn_ = PrimitiveType::ANY;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillModifier(const ir::ScriptFunction *scriptFunc)
    {
        if (scriptFunc->IsAsync()) {
            modifier_ += Modifier::ASYNC;
        }
        if (scriptFunc->IsGenerator()) {
            modifier_ += Modifier::GENERATOR;
        }
    }

    template <typename T>
    void FillParameters(const T *func)
    {
        for (const auto &t : func->Params()) {
            auto param = t;
            if (t->IsTSParameterProperty()) {
                param = t->AsTSParameterProperty()->Parameter();
            }
            if (param->IsAssignmentExpression()) {
                param = param->AsAssignmentExpression()->Left();
            }
            
            // Identifier / SpreadElement / RestElement / ArrayExpression / ObjectExpression
            auto identifier = extractor_->GetIdentifierFromExpression(param);
            if (identifier != nullptr) {
                if (identifier->Name().Is("this") && paramsTypeIndex_.size() == 0) {
                    containThis_ = true;
                }
                paramsTypeIndex_.emplace_back(extractor_->GetTypeIndexFromIdentifier(identifier));
            } else {
                paramsTypeIndex_.emplace_back(PrimitiveType::ANY);
            }
        }
    }

    template <typename T>
    void FillReturn(const T *func)
    {
        typeIndexReturn_ = extractor_->GetTypeIndexFromAnnotation(func->ReturnTypeAnnotation());
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::FUNCTION));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(accessFlag_ + modifier_));
        buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(name_));
        if (containThis_) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(1));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramsTypeIndex_.at(0)));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramsTypeIndex_.size() - 1));
            for (size_t i = 1; i < paramsTypeIndex_.size(); i++) {
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramsTypeIndex_.at(i)));
            }
        } else {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(0));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramsTypeIndex_.size()));
            for (size_t i = 0; i < paramsTypeIndex_.size(); i++) {
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramsTypeIndex_.at(i)));
            }
        }
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(typeIndexReturn_));
    }
};

// For { ClassDeclaration / ClassExpression } -> ClassDefinition
class ClassType : public BaseType {
public:
    explicit ClassType(TypeExtractor *extractor, const ir::ClassDefinition *classDef, const util::StringView &name)
        : BaseType(extractor),
          implementsHeritages_(recorder_->Allocator()->Adapter()),
          staticFields_(recorder_->Allocator()->Adapter()),
          staticMethods_(recorder_->Allocator()->Adapter()),
          fields_(recorder_->Allocator()->Adapter()),
          methods_(recorder_->Allocator()->Adapter())
    {
        CalculateIndex(name, typeIndex_, typeIndexShift_, true);
        recorder_->SetNodeTypeIndex(classDef, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillModifier(classDef);
        FillHeritages(classDef);
        FillFieldsandMethods(classDef);
        FillLiteralBuffer();
    }
    ~ClassType() = default;
    NO_COPY_SEMANTIC(ClassType);
    NO_MOVE_SEMANTIC(ClassType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    ModifierAB modifierAB_ = ModifierAB::NONABSTRACT;
    int64_t extendsHeritage_ = PrimitiveType::ANY;
    ArenaVector<int64_t> implementsHeritages_;
    // 3 field infos, typeIndex / accessFlag / modifier
    ArenaMap<util::StringView, std::array<int64_t, 3>> staticFields_;
    ArenaMap<util::StringView, int64_t> staticMethods_;
    // 3 field infos, typeIndex / accessFlag / modifier
    ArenaMap<util::StringView, std::array<int64_t, 3>> fields_;
    ArenaMap<util::StringView, int64_t> methods_;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillModifier(const ir::ClassDefinition *classDef)
    {
        if (classDef->Abstract()) {
            modifierAB_ = ModifierAB::ABSTRACT;
        }
    }

    void FillHeritages(const ir::ClassDefinition *classDef)
    {
        auto super = classDef->Super();
        if (super != nullptr) {
            extendsHeritage_ = extractor_->GetTypeIndexFromInitializer(super);
        }

        for (const auto &t : classDef->Implements()) {
            if (t != nullptr) {
                implementsHeritages_.emplace_back(extractor_->GetTypeIndexFromInitializer(t));
            }
        }
    }

    void FillField(const ir::ClassProperty *field)
    {
        auto modifiers = field->Modifiers();
        bool isStatic = (modifiers & ir::ModifierFlags::STATIC);
        AccessFlag flag = AccessFlag::PUBLIC;
        if (modifiers & ir::ModifierFlags::PRIVATE) {
            flag = AccessFlag::PRIVATE;
        }
        if (modifiers & ir::ModifierFlags::PROTECTED) {
            flag = AccessFlag::PROTECTED;
        }
        ModifierRO modifier = ModifierRO::NONREADONLY;
        if (modifiers & ir::ModifierFlags::READONLY) {
            modifier = ModifierRO::READONLY;
        }
 
        int64_t typeIndex = extractor_->GetTypeIndexFromAnnotation(field->TypeAnnotation());
        // 3 field infos, typeIndex / accessFlag / modifier
        std::array<int64_t, 3> fieldInfo = {typeIndex, flag, modifier};
        auto fn = [&fieldInfo, &isStatic, this](const util::StringView &name) {
            if (isStatic) {
                staticFields_[name] = fieldInfo;
            } else {
                fields_[name] = fieldInfo;
            }
        };

        const ir::Expression *expression;
        if (field->Key()->IsTSPrivateIdentifier()) {
            expression = field->Key()->AsTSPrivateIdentifier()->Key();
        } else {
            expression = field->Key();
        }
        auto res = CalculateName(expression);
        if (std::holds_alternative<util::StringView>(res)) {
            fn(std::get<util::StringView>(res));
        } else {
            auto identifier = std::get<const ir::Identifier *>(res);
            if (identifier != nullptr) {
                recorder_->SetIdentifierTypeIndex(identifier, typeIndex);
                fn(identifier->Name());
            }
        }
    }

    void FillMethod(const ir::MethodDefinition *method)
    {
        auto fn = [&method, this](const FunctionType &functionType, const util::StringView &name) {
            if (functionType.GetModifier() == Modifier::NONSTATIC) {
                methods_[name] = recorder_->GetNodeTypeIndex(method->Function());
            } else {
                staticMethods_[name] = recorder_->GetNodeTypeIndex(method->Function());
            }
        };

        auto res = CalculateName(method->Key());
        if (std::holds_alternative<util::StringView>(res)) {
            auto name = std::get<util::StringView>(res);
            FunctionType functionType(extractor_, method, name);
            fn(functionType, name);
        } else {
            auto identifier = std::get<const ir::Identifier *>(res);
            if (identifier != nullptr) {
                auto name = identifier->Name();
                FunctionType functionType(extractor_, method, name);
                recorder_->SetIdentifierTypeIndex(identifier, functionType.GetTypeIndexShift());
                fn(functionType, name);
            }
        }
    }

    void FillFieldsandMethods(const ir::ClassDefinition *classDef)
    {
        auto methodDef = const_cast<ir::ClassDefinition *>(classDef)->Ctor();
        ASSERT(methodDef->IsMethodDefinition());
        // Filter Implicit Constructor
        const auto &range = methodDef->Key()->Range();
        if (!(range.start.index == range.end.index && range.start.line == range.end.line &&
            range.start.index == range.start.line && range.end.index == range.end.line)) {
            FillMethod(methodDef);
        }

        for (const auto &t : classDef->Body()) {
            if (t->IsClassProperty()) {
                FillField(t->AsClassProperty());
            } else if (t->IsMethodDefinition()) {
                FillMethod(t->AsMethodDefinition());
            }
        }
    }

    void FillFieldsLiteralBuffer(bool isStatic)
    {
        // 3 field infos, typeIndex / accessFlag / modifier
        auto fn = [this](const ArenaMap<util::StringView, std::array<int64_t, 3>> &map) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(map.size()));
            std::for_each(map.begin(), map.end(), [this](const auto &t) {
                buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t.first));
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[0]));  // 0. typeIndex
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[1]));  // 1. accessFlag
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[2]));  // 2. modifier
            });
        };

        if (isStatic) {
            fn(staticFields_);
        } else {
            fn(fields_);
        }
    }

    void FillMethodsLiteralBuffer(bool isStatic)
    {
        auto fn = [this](const ArenaMap<util::StringView, int64_t> &map) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(map.size()));
            std::for_each(map.begin(), map.end(), [this](const auto &t) {
                buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t.first));
                buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second));
            });
        };

        if (isStatic) {
            fn(staticMethods_);
        } else {
            fn(methods_);
        }
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::CLASS));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(modifierAB_));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(extendsHeritage_));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(implementsHeritages_.size()));
        std::for_each(implementsHeritages_.begin(), implementsHeritages_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t));
        });

        FillFieldsLiteralBuffer(false);
        FillMethodsLiteralBuffer(false);
        FillFieldsLiteralBuffer(true);
        FillMethodsLiteralBuffer(true);
    }
};

class ClassInstType : public BaseType {
public:
    explicit ClassInstType(TypeExtractor *extractor, int64_t typeIndexRefShift)
        : BaseType(extractor), typeIndexRefShift_(typeIndexRefShift)
    {
        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->SetClassInst(typeIndexRefShift_, typeIndexShift_);
        recorder_->SetClassType(typeIndexShift_, typeIndexRefShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillLiteralBuffer();
    }
    ~ClassInstType() = default;
    NO_COPY_SEMANTIC(ClassInstType);
    NO_MOVE_SEMANTIC(ClassInstType);

    int64_t GetTypeIndexShift() const
    {
        return typeIndexShift_;
    }

private:
    int64_t typeIndexRefShift_ = PrimitiveType::ANY;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::CLASSINST));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(typeIndexRefShift_));
    }
};

class InterfaceType : public BaseType {
public:
    explicit InterfaceType(TypeExtractor *extractor, const ir::TSInterfaceDeclaration *interfaceDef,
                           const util::StringView &name)
        : BaseType(extractor),
          heritages_(recorder_->Allocator()->Adapter()),
          fields_(recorder_->Allocator()->Adapter()),
          methods_(recorder_->Allocator()->Adapter())
    {
        CalculateIndex(name, typeIndex_, typeIndexShift_, true);
        recorder_->SetNodeTypeIndex(interfaceDef, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillHeritages(interfaceDef);
        FillFieldsandMethods(interfaceDef);
        FillLiteralBuffer();
    }
    ~InterfaceType() = default;
    NO_COPY_SEMANTIC(InterfaceType);
    NO_MOVE_SEMANTIC(InterfaceType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    ArenaVector<int64_t> heritages_;
    // 3 field infos, typeIndex / accessFlag / modifier
    ArenaMap<util::StringView, std::array<int64_t, 3>> fields_;
    ArenaMap<util::StringView, int64_t> methods_;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillHeritages(const ir::TSInterfaceDeclaration *interfaceDef)
    {
        for (const auto &t : interfaceDef->Extends()) {
            if (t != nullptr) {
                heritages_.emplace_back(extractor_->GetTypeIndexFromInitializer(t));
            }
        }
    }

    void FillField(const ir::TSPropertySignature *field)
    {
        AccessFlag flag = AccessFlag::PUBLIC;
        ModifierRO modifier = ModifierRO::NONREADONLY;
        if (field->Readonly()) {
            modifier = ModifierRO::READONLY;
        }

        int64_t typeIndex = extractor_->GetTypeIndexFromAnnotation(field->TypeAnnotation());
        // 3 field infos, typeIndex / accessFlag / modifier
        std::array<int64_t, 3> fieldInfo = {typeIndex, flag, modifier};

        auto res = CalculateName(field->Key());
        if (std::holds_alternative<util::StringView>(res)) {
            fields_[std::get<util::StringView>(res)] = fieldInfo;
        } else {
            auto identifier = std::get<const ir::Identifier *>(res);
            if (identifier != nullptr) {
                recorder_->SetIdentifierTypeIndex(identifier, typeIndex);
                fields_[identifier->Name()] = fieldInfo;
            }
        }
    }

    void FillMethod(const ir::TSMethodSignature *method)
    {
        auto res = CalculateName(method->Key());
        if (std::holds_alternative<util::StringView>(res)) {
            auto name = std::get<util::StringView>(res);
            FunctionType functionType(extractor_, method, name);
            methods_[name] = recorder_->GetNodeTypeIndex(method);
        } else {
            auto identifier = std::get<const ir::Identifier *>(res);
            if (identifier != nullptr) {
                auto name = identifier->Name();
                FunctionType functionType(extractor_, method, name);
                recorder_->SetIdentifierTypeIndex(identifier, functionType.GetTypeIndexShift());
                methods_[name] = recorder_->GetNodeTypeIndex(method);
            }
        }
    }

    void FillFieldsandMethods(const ir::TSInterfaceDeclaration *interfaceDef)
    {
        for (const auto &t : interfaceDef->Body()->Body()) {
            if (t->IsTSPropertySignature()) {
                FillField(t->AsTSPropertySignature());
            } else if (t->IsTSMethodSignature()) {
                FillMethod(t->AsTSMethodSignature());
            }
        }
    }

    void FillFieldsLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(fields_.size()));
        std::for_each(fields_.begin(), fields_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t.first));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[0]));  // 0. typeIndex
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[1]));  // 1. accessFlag
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second[2]));  // 2. modifier
        });
    }

    void FillMethodsLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(methods_.size()));
        std::for_each(methods_.begin(), methods_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t.first));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second));
        });
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::INTERFACE));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(heritages_.size()));
        std::for_each(heritages_.begin(), heritages_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t));
        });

        FillFieldsLiteralBuffer();
        FillMethodsLiteralBuffer();
    }
};

class ExternalType : public BaseType {
public:
    explicit ExternalType(TypeExtractor *extractor, const util::StringView &importName,
                          const util::StringView &redirectPath) : BaseType(extractor)
    {
        std::stringstream ss;
        ss << "#" + std::string(importName) + "#" + std::string(redirectPath);
        redirectPath_ = util::UString(ss.str(), recorder_->Allocator()).View();
        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->AddUserType(typeIndexShift_);

        FillLiteralBuffer();
    }
    ~ExternalType() = default;
    NO_COPY_SEMANTIC(ExternalType);
    NO_MOVE_SEMANTIC(ExternalType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    util::StringView redirectPath_;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::EXTERNAL));
        buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(redirectPath_));
    }
};

class UnionType : public BaseType {
public:
    explicit UnionType(TypeExtractor *extractor, const ir::TSUnionType *unionDef)
        : BaseType(extractor), unionTypes_(recorder_->Allocator()->Adapter())
    {
        auto unionStr = CalculateStr(unionDef->Types());
        typeIndexShift_ = recorder_->GetUnionType(unionStr);
        if (typeIndexShift_ != PrimitiveType::ANY) {
            return;
        }

        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->SetUnionType(unionStr, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillTypes(unionDef);
        FillLiteralBuffer();
    }
    ~UnionType() = default;
    NO_COPY_SEMANTIC(UnionType);
    NO_MOVE_SEMANTIC(UnionType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    ArenaVector<int64_t> unionTypes_;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillTypes(const ir::TSUnionType *unionDef)
    {
        for (const auto &t : unionDef->Types()) {
            unionTypes_.emplace_back(extractor_->GetTypeIndexFromAnnotation(t));
        }
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::UNION));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(unionTypes_.size()));
        std::for_each(unionTypes_.begin(), unionTypes_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t));
        });
    }
};

class ArrayType : public BaseType {
public:
    explicit ArrayType(TypeExtractor *extractor, const ir::TSArrayType *arrayDef) : BaseType(extractor)
    {
        typeIndexRefShift_ = extractor_->GetTypeIndexFromAnnotation(arrayDef->ElementType());
        typeIndexShift_ = recorder_->GetArrayType(typeIndexRefShift_);
        if (typeIndexShift_ != PrimitiveType::ANY) {
            return;
        }

        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->SetArrayType(typeIndexRefShift_, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillLiteralBuffer();
    }
    ~ArrayType() = default;
    NO_COPY_SEMANTIC(ArrayType);
    NO_MOVE_SEMANTIC(ArrayType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    int64_t typeIndexRefShift_ = PrimitiveType::ANY;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::ARRAY));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(typeIndexRefShift_));
    }
};

class ObjectType : public BaseType {
public:
    explicit ObjectType(TypeExtractor *extractor, const ir::TSTypeLiteral *literalDef)
        : BaseType(extractor), properties_(recorder_->Allocator()->Adapter())
    {
        std::string objectStr = "object";
        if (literalDef != nullptr) {
            objectStr = CalculateStr(literalDef->Members());
        }
        typeIndexShift_ = recorder_->GetObjectType(objectStr);
        if (typeIndexShift_ != PrimitiveType::ANY) {
            return;
        }

        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->SetObjectType(objectStr, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        if (literalDef != nullptr) {
            FillMembers(literalDef);
        }
        FillLiteralBuffer();
    }
    ~ObjectType() = default;
    NO_COPY_SEMANTIC(ObjectType);
    NO_MOVE_SEMANTIC(ObjectType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    ArenaMap<util::StringView, int64_t> properties_;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillMembers(const ir::TSTypeLiteral *literalDef)
    {
        auto fn = [this](const auto *property, int64_t typeIndex) {
            auto res = CalculateName(property->Key());
            if (std::holds_alternative<util::StringView>(res)) {
                properties_[std::get<util::StringView>(res)] = typeIndex;
            } else {
                auto identifier = std::get<const ir::Identifier *>(res);
                if (identifier != nullptr) {
                    recorder_->SetIdentifierTypeIndex(identifier, typeIndex);
                    properties_[identifier->Name()] = typeIndex;
                }
            }
        };

        for (const auto &t : literalDef->Members()) {
            if (t->IsTSPropertySignature()) {
                auto property = t->AsTSPropertySignature();
                int64_t typeIndex = extractor_->GetTypeIndexFromAnnotation(property->TypeAnnotation());
                fn(property, typeIndex);
            } else if (t->IsTSMethodSignature()) {
                auto property = t->AsTSMethodSignature();
                int64_t typeIndex = extractor_->GetTypeIndexFromAnnotation(property->ReturnTypeAnnotation());
                fn(property, typeIndex);
            }
        }
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::OBJECT));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(properties_.size()));
        std::for_each(properties_.begin(), properties_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::StringLiteral>(t.first));
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t.second));
        });
    }
};

class BuiltinInstType : public BaseType {
public:
    explicit BuiltinInstType(TypeExtractor *extractor, const std::vector<int64_t> &allTypes)
        : BaseType(extractor), paramTypes_(recorder_->Allocator()->Adapter())
    {
        typeIndexBuiltin_ = allTypes[0];
        typeIndex_ = recorder_->AddLiteralBuffer(buffer_);
        typeIndexShift_ = typeIndex_ + recorder_->GetUserTypeIndexShift();
        recorder_->SetBuiltinInst(allTypes, typeIndexShift_);
        recorder_->AddUserType(typeIndexShift_);

        FillTypes(allTypes);
        FillLiteralBuffer();
    }
    ~BuiltinInstType() = default;
    NO_COPY_SEMANTIC(BuiltinInstType);
    NO_MOVE_SEMANTIC(BuiltinInstType);

    int64_t GetTypeIndexShift()
    {
        return typeIndexShift_;
    }

private:
    ArenaVector<int64_t> paramTypes_;
    int64_t typeIndexBuiltin_ = PrimitiveType::ANY;
    int64_t typeIndex_ = PrimitiveType::ANY;
    int64_t typeIndexShift_ = PrimitiveType::ANY;

    void FillTypes(const std::vector<int64_t> &allTypes)
    {
        for (size_t t = 1; t < allTypes.size(); t++) {
            paramTypes_.emplace_back(allTypes[t]);
        }
    }

    void FillLiteralBuffer()
    {
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(UserType::BUILTININST));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(typeIndexBuiltin_));
        buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(paramTypes_.size()));
        std::for_each(paramTypes_.begin(), paramTypes_.end(), [this](const auto &t) {
            buffer_->Add(recorder_->Allocator()->New<ir::NumberLiteral>(t));
        });
    }
};

}  // namespace panda::es2panda::extractor

#endif  // ES2PANDA_TYPESCRIPT_EXACTOR_TYPESYSTEM_H
