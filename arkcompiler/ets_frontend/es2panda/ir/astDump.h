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

#ifndef ES2PANDA_IR_ASTDUMP_H
#define ES2PANDA_IR_ASTDUMP_H

#include <ir/astNode.h>
#include <lexer/token/sourceLocation.h>
#include <lexer/token/tokenType.h>
#include <util/ustring.h>

#include <sstream>
#include <variant>

namespace panda::es2panda::ir {

class AstDumper {
public:
    class Nullable {
    public:
        explicit Nullable(const ir::AstNode *node) : node_(node) {}

        const ir::AstNode *Node() const
        {
            return node_;
        }

    private:
        const ir::AstNode *node_;
    };

    class Optional {
    public:
        using Val = std::variant<const char *, const ir::AstNode *, bool>;
        explicit Optional(const ir::AstNode *node) : value_(node) {}
        explicit Optional(const char *string) : value_(const_cast<char *>(string)) {}
        explicit Optional(bool boolean) : value_(boolean) {}

        const Val &Value() const
        {
            return value_;
        }

    private:
        Val value_;
    };

    class Property {
    public:
        class Ignore {
        public:
            Ignore() = default;
        };

        enum class Constant {
            PROP_NULL,
            EMPTY_ARRAY,
        };

        using Val =
            std::variant<const char *, lexer::TokenType, std::initializer_list<Property>, util::StringView, bool,
                         double, const ir::AstNode *, std::vector<const ir::AstNode *>, Constant, Nullable, Ignore>;

        Property(const char *key, const char *string) : key_(key), value_(string) {}
        Property(const char *key, util::StringView str) : key_(key), value_(str) {}
        Property(const char *key, bool boolean) : key_(key), value_(boolean) {}
        Property(const char *key, double number) : key_(key), value_(number) {}
        Property(const char *key, lexer::TokenType token) : key_(key), value_(token) {}
        Property(const char *key, std::initializer_list<Property> props) : key_(key), value_(props) {}
        Property(const char *key, const ir::AstNode *node) : key_(key), value_(const_cast<ir::AstNode *>(node)) {}

        Property(const char *key, Constant constant) : key_(key), value_(constant) {}
        Property(const char *key, Nullable nullable) : key_(key)
        {
            if (nullable.Node()) {
                value_ = nullable.Node();
            } else {
                value_ = Property::Constant::PROP_NULL;
            }
        }

        Property(const char *key, Optional optional) : key_(key)
        {
            const auto &value = optional.Value();
            if (std::holds_alternative<const ir::AstNode *>(value) && std::get<const ir::AstNode *>(value)) {
                value_ = std::get<const ir::AstNode *>(value);
                return;
            }

            if (std::holds_alternative<const char *>(value) && std::get<const char *>(value)) {
                value_ = std::get<const char *>(value);
                return;
            }

            if (std::holds_alternative<bool>(value) && std::get<bool>(value)) {
                value_ = std::get<bool>(value);
                return;
            }

            value_ = Ignore();
        }

        template <typename T>
        Property(const char *key, const ArenaVector<T> &array) : key_(key)
        {
            if (array.empty()) {
                value_ = Constant::EMPTY_ARRAY;
                return;
            }

            std::vector<const ir::AstNode *> nodes;
            nodes.reserve(array.size());

            for (auto &it : array) {
                nodes.push_back(it);
            }

            value_ = std::move(nodes);
        }

        const char *Key() const
        {
            return key_;
        }

        const Val &Value() const
        {
            return value_;
        }

    private:
        const char *key_;
        Val value_ {false};
    };

    explicit AstDumper(const BlockStatement *program, util::StringView sourceCode);
    explicit AstDumper(const ir::AstNode *node);

    void SerializeNode(const ir::AstNode *node);

    void Add(std::initializer_list<Property> props);
    void Add(const AstDumper::Property &prop);

    static const char *ModifierToString(ModifierFlags flags);
    static const char *TypeOperatorToString(TSOperatorType operatorType);

    std::string Str() const
    {
        return ss_.str();
    }

private:
    using WrapperCb = std::function<void()>;

    template <typename T>
    void AddList(T props)
    {
        for (auto it = props.begin(); it != props.end();) {
            Serialize(*it);

            do {
                if (++it == props.end()) {
                    return;
                }
            } while (std::holds_alternative<Property::Ignore>((*it).Value()));

            ss_ << ',';
        }
    }

    void Indent();

    void Serialize(const AstDumper::Property &prop);
    void SerializePropKey(const char *str);
    void SerializeString(const char *str);
    void SerializeString(const util::StringView &str);
    void SerializeNumber(size_t number);
    void SerializeNumber(double number);
    void SerializeBoolean(bool boolean);
    void SerializeObject(const ir::AstNode *object);
    void SerializeToken(lexer::TokenType token);
    void SerializePropList(std::initializer_list<AstDumper::Property> props);
    void SerializeConstant(Property::Constant constant);
    void Wrap(const WrapperCb &cb, char delimStart = '{', char delimEnd = '}');

    void SerializeLoc(const lexer::SourceRange &loc);
    void SerializeSourcePosition(const lexer::SourcePosition &pos);

    void SerializeArray(std::vector<const ir::AstNode *> array);

    lexer::LineIndex index_;
    std::stringstream ss_;
    int32_t indent_;
    bool dumpNodeOnly_ = false;
};
}  // namespace panda::es2panda::ir

#endif  // ASTDUMP_H
