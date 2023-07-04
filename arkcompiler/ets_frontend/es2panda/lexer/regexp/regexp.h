/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#ifndef ES2PANDA_PARSER_CORE_REGEXP_H
#define ES2PANDA_PARSER_CORE_REGEXP_H

#include <util/enumbitops.h>
#include <util/ustring.h>

#include <unordered_set>

namespace panda::es2panda::lexer {

enum class RegExpFlags {
    EMPTY = 0,
    GLOBAL = 1 << 0,
    IGNORE_CASE = 1 << 1,
    MULTILINE = 1 << 2,
    STICKY = 1 << 3,
    UNICODE = 1 << 4,
    DOTALL = 1 << 5,
};

DEFINE_BITOPS(RegExpFlags)

class RegExpError : std::exception {
public:
    explicit RegExpError(std::string_view m);
    std::string message;
};

struct RegExp {
    RegExp(util::StringView p, util::StringView f, RegExpFlags reFlags);

    util::StringView patternStr;
    util::StringView flagsStr;
    RegExpFlags flags;
};

class RegExpParser {
public:
    explicit RegExpParser(const RegExp &re, ArenaAllocator *allocator);
    void ParsePattern();

private:
    void ParseDisjunction();
    void ParseAlternatives();
    void ParseAlternative();

    void ParseNonCapturingGroup();
    void ParseNamedCapturingGroup();
    void ParseCapturingGroup();

    void ParseAssertion();
    char32_t ParseClassAtom();
    void ParseCharacterClass();
    void ParseAtomEscape();

    uint32_t ParseControlEscape();
    uint32_t ParseDecimalEscape();
    uint32_t ParseLegacyOctalEscape();
    uint32_t ParseHexEscape();
    uint32_t ParseUnicodeDigits();
    uint32_t ParseUnicodeEscape();

    void ParseUnicodePropertyEscape();
    void ParseNamedBackreference();

    void ParseQuantifier();
    bool ParseBracedQuantifier();

    bool IsSyntaxCharacter(char32_t cp) const;
    bool ParsePatternCharacter();

    util::StringView ParseIdent();

    bool Unicode() const;

    char32_t Peek() const;
    char32_t Next();
    void Advance();
    bool Eos() const;
    void ValidateNamedGroupReferences();

    RegExp re_;
    ArenaAllocator *allocator_ {};
    util::StringView::Iterator iter_;
    uint32_t capturingGroupCount_;
    std::unordered_set<util::StringView> groupNames_;
    std::unordered_set<util::StringView> namedGroupReferences_;
};

}  // namespace panda::es2panda::lexer

#endif
