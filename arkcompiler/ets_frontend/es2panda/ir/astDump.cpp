/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#include "astDump.h"

#include <ir/astNode.h>

#include <cmath>
#include <iostream>

namespace panda::es2panda::ir {

AstDumper::AstDumper(const BlockStatement *program, util::StringView sourceCode) : index_(sourceCode), indent_(0)
{
    SerializeObject(reinterpret_cast<const ir::AstNode *>(program));
}

AstDumper::AstDumper(const ir::AstNode *node) : indent_(0), dumpNodeOnly_(true)
{
    SerializeNode(node);
}

void AstDumper::SerializeNode(const ir::AstNode *node)
{
    Wrap([this, node]() -> void {
        node->Dump(this);
    });
}

void AstDumper::Add(std::initializer_list<AstDumper::Property> props)
{
    AddList<std::initializer_list<AstDumper::Property>>(props);
}

void AstDumper::Add(const AstDumper::Property &prop)
{
    Serialize(prop);
}

const char *AstDumper::ModifierToString(ModifierFlags flags)
{
    if (flags & ModifierFlags::PRIVATE) {
        return "private";
    }

    if (flags & ModifierFlags::PROTECTED) {
        return "protected";
    }

    if (flags & ModifierFlags::PUBLIC) {
        return "public";
    }

    return nullptr;
}

const char *AstDumper::TypeOperatorToString(TSOperatorType operatorType)
{
    if (operatorType == TSOperatorType::KEYOF) {
        return "keyof";
    }

    if (operatorType == TSOperatorType::READONLY) {
        return "readonly";
    }

    if (operatorType == TSOperatorType::UNIQUE) {
        return "unique";
    }

    return nullptr;
}

void AstDumper::Serialize(const AstDumper::Property &prop)
{
    SerializePropKey(prop.Key());
    const auto &value = prop.Value();

    if (std::holds_alternative<const char *>(value)) {
        SerializeString(std::get<const char *>(value));
    } else if (std::holds_alternative<util::StringView>(value)) {
        SerializeString(std::get<util::StringView>(value));
    } else if (std::holds_alternative<bool>(value)) {
        SerializeBoolean(std::get<bool>(value));
    } else if (std::holds_alternative<double>(value)) {
        SerializeNumber(std::get<double>(value));
    } else if (std::holds_alternative<const ir::AstNode *>(value)) {
        if (dumpNodeOnly_) {
            SerializeNode(std::get<const ir::AstNode *>(value));
        } else {
            SerializeObject(std::get<const ir::AstNode *>(value));
        }
    } else if (std::holds_alternative<std::vector<const ir::AstNode *>>(value)) {
        SerializeArray(std::get<std::vector<const ir::AstNode *>>(value));
    } else if (std::holds_alternative<lexer::TokenType>(value)) {
        SerializeToken(std::get<lexer::TokenType>(value));
    } else if (std::holds_alternative<std::initializer_list<Property>>(value)) {
        SerializePropList(std::get<std::initializer_list<Property>>(value));
    } else if (std::holds_alternative<Property::Constant>(value)) {
        SerializeConstant(std::get<Property::Constant>(value));
    }
}

void AstDumper::SerializeToken(lexer::TokenType token)
{
    ss_ << "\"" << lexer::TokenToString(token) << "\"";
}

void AstDumper::SerializePropKey(const char *str)
{
    if (dumpNodeOnly_) {
        return;
    }
    ss_ << std::endl;
    Indent();
    SerializeString(str);
    ss_ << ": ";
}

void AstDumper::SerializeString(const char *str)
{
    ss_ << "\"" << str << "\"";
}

void AstDumper::SerializeString(const util::StringView &str)
{
    ss_ << "\"" << str.Utf8() << "\"";
}

void AstDumper::SerializeNumber(size_t number)
{
    ss_ << number;
}

void AstDumper::SerializeNumber(double number)
{
    if (std::isinf(number)) {
        ss_ << "\"Infinity\"";
    } else {
        ss_ << number;
    }
}

void AstDumper::SerializeBoolean(bool boolean)
{
    ss_ << (boolean ? "true" : "false");
}

void AstDumper::SerializeConstant(Property::Constant constant)
{
    switch (constant) {
        case Property::Constant::PROP_NULL: {
            ss_ << "null";
            break;
        }
        case Property::Constant::EMPTY_ARRAY: {
            ss_ << "[]";
            break;
        }
        default: {
            UNREACHABLE();
        }
    }
}

void AstDumper::SerializePropList(std::initializer_list<AstDumper::Property> props)
{
    Wrap([this, &props]() -> void {
        for (const auto *it = props.begin(); it != props.end(); ++it) {
            Serialize(*it);
            if (std::next(it) != props.end()) {
                ss_ << ',';
            }
        }
    });
}

void AstDumper::SerializeArray(std::vector<const ir::AstNode *> array)
{
    Wrap(
        [this, &array]() -> void {
            for (auto it = array.begin(); it != array.end(); ++it) {
                if (dumpNodeOnly_) {
                    SerializeNode(*it);
                } else {
                    ss_ << std::endl;
                    Indent();
                    SerializeObject(*it);
                }

                if (std::next(it) != array.end()) {
                    ss_ << ',';
                }
            }
        },
        '[', ']');
}

void AstDumper::SerializeObject(const ir::AstNode *object)
{
    Wrap([this, object]() -> void {
        object->Dump(this);
        SerializeLoc(object->Range());
    });
}

void AstDumper::Wrap(const WrapperCb &cb, char delimStart, char delimEnd)
{
    ss_ << delimStart;

    if (dumpNodeOnly_) {
        cb();
    } else {
        indent_++;
        cb();
        ss_ << std::endl;
        indent_--;
        Indent();
    }

    ss_ << delimEnd;
}

void AstDumper::SerializeLoc(const lexer::SourceRange &loc)
{
    ss_ << ',';
    SerializePropKey("loc");

    Wrap([this, &loc]() -> void {
        SerializePropKey("start");
        SerializeSourcePosition(loc.start);
        ss_ << ',';
        SerializePropKey("end");
        SerializeSourcePosition(loc.end);
    });
}

void AstDumper::SerializeSourcePosition(const lexer::SourcePosition &pos)
{
    lexer::SourceLocation loc = index_.GetLocation(pos);

    Wrap([this, &loc]() -> void {
        SerializePropKey("line");
        SerializeNumber(loc.line);
        ss_ << ',';
        SerializePropKey("column");
        SerializeNumber(loc.col);
    });
}

void AstDumper::Indent()
{
    for (int32_t i = 0; i < indent_; i++) {
        ss_ << "  ";
    }
}

}  // namespace panda::es2panda::ir
