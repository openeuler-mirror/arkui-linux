#!/usr/bin/env ruby
# Copyright (c) 2021-2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

require 'erb'
require 'ostruct'
require 'set'

keywords = [
    # keywords start with 'a'
    {
        "abstract" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ABSTRACT"],
        "any" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ANY"],
        "arguments" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ARGUMENTS"],
        "as" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_AS"],
        "asserts" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ASSERTS"],
        "async" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ASYNC"],
        "await" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_AWAIT"],
    },

    # keywords start with 'b'
    {
        "bigint" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_BIGINT"],
        "boolean" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_BOOLEAN"],
        "break" => ["TokenType::KEYW_BREAK", "TokenType::KEYW_BREAK"],
    },

    # keywords start with 'c'
    {
        "case" => ["TokenType::KEYW_CASE", "TokenType::KEYW_CASE"],
        "catch" => ["TokenType::KEYW_CATCH", "TokenType::KEYW_CATCH"],
        "class" => ["TokenType::KEYW_CLASS", "TokenType::KEYW_CLASS"],
        "const" => ["TokenType::KEYW_CONST", "TokenType::KEYW_CONST"],
        "continue" => ["TokenType::KEYW_CONTINUE", "TokenType::KEYW_CONTINUE"]
    },

    # keywords start with 'd'
    {
        "debugger" => ["TokenType::KEYW_DEBUGGER", "TokenType::KEYW_DEBUGGER"],
        "declare" => ["TokenType::KEYW_DECLARE", "TokenType::KEYW_DECLARE"],
        "default" => ["TokenType::KEYW_DEFAULT", "TokenType::KEYW_DEFAULT"],
        "delete" => ["TokenType::KEYW_DELETE", "TokenType::KEYW_DELETE"],
        "do" => ["TokenType::KEYW_DO", "TokenType::KEYW_DO"],
    },

    # keywords start with 'e'
    {
        "else" => ["TokenType::KEYW_ELSE", "TokenType::KEYW_ELSE"],
        "enum" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_ENUM"],
        "eval" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_EVAL"],
        "export" => ["TokenType::KEYW_EXPORT", "TokenType::KEYW_EXPORT"],
        "extends" => ["TokenType::KEYW_EXTENDS", "TokenType::KEYW_EXTENDS"],
    },

    # keywords start with 'f'
    {
        "false" => ["TokenType::LITERAL_FALSE", "TokenType::LITERAL_FALSE"],
        "finally" => ["TokenType::KEYW_FINALLY", "TokenType::KEYW_FINALLY"],
        "for" => ["TokenType::KEYW_FOR", "TokenType::KEYW_FOR"],
        "from" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_FROM"],
        "function" => ["TokenType::KEYW_FUNCTION", "TokenType::KEYW_FUNCTION"],
    },

    # keywords start with 'g'
    {
        "get" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_GET"],
        "global" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_GLOBAL"],
    },

    # keywords start with 'i'
    {
        "if" => ["TokenType::KEYW_IF", "TokenType::KEYW_IF"],
        "implements" => ["TokenType::KEYW_IMPLEMENTS", "TokenType::KEYW_IMPLEMENTS"],
        "import" => ["TokenType::KEYW_IMPORT", "TokenType::KEYW_IMPORT"],
        "in" => ["TokenType::KEYW_IN", "TokenType::KEYW_IN"],
        "infer" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_INFER"],
        "instanceof" => ["TokenType::KEYW_INSTANCEOF", "TokenType::KEYW_INSTANCEOF"],
        "interface" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_INTERFACE"],
        "is" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_IS"],
    },

    # keywords start with 'k'
    {
        "keyof" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_KEYOF"],
    },

    # keywords start with 'l'
    {
        "let" => ["TokenType::KEYW_LET", "TokenType::KEYW_LET"],
    },

    # keywords start with 'm'
    {
        "meta" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_META"],
        "module" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_MODULE"],
        "namespace" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_NAMESPACE"],
    },

    # keywords start with 'n'
    {
        "never" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_NEVER"],
        "new" => ["TokenType::KEYW_NEW", "TokenType::KEYW_NEW"],
        "null" => ["TokenType::LITERAL_NULL", "TokenType::LITERAL_NULL"],
        "number" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_NUMBER"],
    },

    # keywords start with 'o'
    {
        "object" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_OBJECT"],
        "of" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_OF"],
    },

    # keywords start with 'p'
    {
        "package" => ["TokenType::KEYW_PACKAGE", "TokenType::KEYW_PACKAGE"],
        "private" => ["TokenType::KEYW_PRIVATE", "TokenType::KEYW_PRIVATE"],
        "protected" => ["TokenType::KEYW_PROTECTED", "TokenType::KEYW_PROTECTED"],
        "public" => ["TokenType::KEYW_PUBLIC", "TokenType::KEYW_PUBLIC"],
    },

    # keywords start with 'r'
    {
        "readonly" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_READONLY"],
        "return" => ["TokenType::KEYW_RETURN", "TokenType::KEYW_RETURN"],
        "require" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_REQUIRE"],
    },

    # keywords start with 's'
    {
        "set" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_SET"],
        "static" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_STATIC"],
        "string" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_STRING"],
        "super" => ["TokenType::KEYW_SUPER", "TokenType::KEYW_SUPER"],
        "switch" => ["TokenType::KEYW_SWITCH", "TokenType::KEYW_SWITCH"],
        "symbol" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_SYMBOL"],
    },

    # keywords start with 't'
    {
        "this" => ["TokenType::KEYW_THIS", "TokenType::KEYW_THIS"],
        "throw" => ["TokenType::KEYW_THROW", "TokenType::KEYW_THROW"],
        "true" => ["TokenType::LITERAL_TRUE", "TokenType::LITERAL_TRUE"],
        "try" => ["TokenType::KEYW_TRY", "TokenType::KEYW_TRY"],
        "type" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_TYPE"],
        "typeof" => ["TokenType::KEYW_TYPEOF", "TokenType::KEYW_TYPEOF"],
    },

    # keywords start with 'u'
    {
        "undefined" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_UNDEFINED"],
        "unique" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_UNIQUE"],
        "unknown" => ["TokenType::LITERAL_IDENT", "TokenType::KEYW_UNKNOWN"],
    },

    # keywords start with 'v'
    {
        "var" => ["TokenType::KEYW_VAR", "TokenType::KEYW_VAR"],
        "void" => ["TokenType::KEYW_VOID", "TokenType::KEYW_VOID"],
    },

    # keywords start with 'w'
    {
        "while" => ["TokenType::KEYW_WHILE", "TokenType::KEYW_WHILE"],
        "with" => ["TokenType::KEYW_WITH", "TokenType::KEYW_WITH"],
    },

    # keywords start with 'y'
    {
        "yield" => ["TokenType::KEYW_YIELD", "TokenType::KEYW_YIELD"],
    },
]

def collect_functions(functions, keys)
    offset = 0

    while true
        has_more = false

        keys.each do |key|
            if key.length < offset + 1
                next
            end

            has_more = true
            func_name = key[0..offset];

            if functions.has_key?(func_name)
                functions[func_name].add(key[offset + 1])
            else
                functions[func_name] = Set[key[offset + 1]]
            end
        end

        if has_more
            offset += 1
            next
        end

        break
    end
end

def generate(keywords, template_file, output_file)   
    functions = {}
    keywords.each do |group|
        collect_functions(functions, group.keys)
    end

    template = File.read(template_file)
    t = ERB.new(template, nil, '%-')
    t.filename = OpenStruct.new.template
    res = t.result(binding)

    File.open(output_file, "w") do |file|
        file.write(res)
    end
end

abort "Failed: input file required!" if ARGV.size < 2

generate(keywords, ARGV[0], ARGV[1])
