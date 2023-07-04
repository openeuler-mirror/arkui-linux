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

#include <codecvt>
#include <cstdarg>
#include <iostream>
#include <locale>
#include <string>
#include <unistd.h>

#include "assembly-type.h"
#include "assembly-program.h"
#include "assembly-emitter.h"
#include "json/json.h"
#include "securec.h"
#include "ts2abc_options.h"
#include "ts2abc.h"
#include "protobufSnapshotGenerator.h"

#ifdef ENABLE_BYTECODE_OPT
#include "optimize_bytecode.h"
#endif

namespace panda::ts2abc {
// pandasm definitions
constexpr const auto LANG_EXT = panda::pandasm::extensions::Language::ECMASCRIPT;
const std::string WHOLE_LINE;
bool g_isMergeAbc = false;
bool g_debugModeEnabled = false;
bool g_debugLogEnabled = false;
int g_optLevel = 0;
bool g_enableTypeinfo = false;
bool g_displayTypeinfo = false;
bool g_isDtsFile = false;
std::string g_optLogLevel = "error";
uint32_t g_literalArrayCount = 0;
int32_t g_newLiteralArrayIndex = -1;
static constexpr const char* TSTYPE_ANNO_RECORD_NAME = "_ESTypeAnnotation";
static constexpr const char* TSTYPE_ANNO_ELEMENT_NAME = "_TypeOfInstruction";
std::string g_compilerOutputProto = "";
std::string g_recordName = "";
std::string g_outputFileName = "";
bool g_isStartDollar = true;
constexpr uint32_t LITERALBUFFERINDEXOFFSET = 100;
uint32_t MAX_UINT8 = static_cast<uint32_t>(std::numeric_limits<uint8_t>::max());
bool g_isOutputProto = false;
static constexpr const char* PROTO_BIN_SUFFIX = "protoBin";

constexpr std::size_t BOUND_LEFT = 0;
constexpr std::size_t BOUND_RIGHT = 0;
constexpr std::size_t LINE_NUMBER = 0;
constexpr bool IS_DEFINED = true;
int g_opCodeIndex = 0;
std::unordered_map<int, panda::pandasm::Opcode> g_opcodeMap = {
#define OPLIST(opcode, name, optype, width, flags, def_idx, use_idxs) {g_opCodeIndex++, panda::pandasm::Opcode::opcode},
    PANDA_INSTRUCTION_LIST(OPLIST)
#undef OPLIST
    {-1, panda::pandasm::Opcode::INVALID},
};

// pandasm helpers
static panda::pandasm::Record MakeRecordDefinition(const std::string &name)
{
    auto record = panda::pandasm::Record(name, LANG_EXT);
    return record;
}

static panda::pandasm::Function MakeFuncDefintion(const std::string &name, const std::string &returnType)
{
    auto function = panda::pandasm::Function(
        name,
        LANG_EXT,
        BOUND_LEFT,
        BOUND_RIGHT,
        WHOLE_LINE,
        IS_DEFINED,
        LINE_NUMBER);

    function.return_type = panda::pandasm::Type(returnType.c_str(), 0);
    return function;
};

static panda::pandasm::Label MakeLabel(const std::string &name)
{
    auto label = panda::pandasm::Label(
        name,
        BOUND_LEFT,
        BOUND_RIGHT,
        WHOLE_LINE,
        IS_DEFINED,
        LINE_NUMBER);

    return label;
};


static bool IsValidInt32(double value)
{
    return (value <= static_cast<double>(std::numeric_limits<int>::max()) &&
        value >= static_cast<double>(std::numeric_limits<int>::min()));
}

bool GetDebugLog()
{
    return g_debugLogEnabled;
}

static void SetDebugLog(bool debugLog)
{
    g_debugLogEnabled = debugLog;
}

bool GetDebugModeEnabled()
{
    return g_debugModeEnabled;
}

static void SetDebugModeEnabled(bool value)
{
    g_debugModeEnabled = value;
}

// Unified interface for debug log print
static void Logd(const char *format, ...)
{
    const int logBufferSize = 1024;
    if (GetDebugLog()) {
        va_list valist;
        va_start(valist, format);
        char logMsg[logBufferSize];
        int ret = vsnprintf_s(logMsg, sizeof(logMsg), sizeof(logMsg) - 1, format, valist);
        if (ret == -1) {
            va_end(valist);
            return;
        }
        std::cout << logMsg << std::endl;
        va_end(valist);
    }
}

static std::u16string ConvertUtf8ToUtf16(const std::string &data)
{
    std::u16string u16Data = std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t> {}.from_bytes(data);
    return u16Data;
}

static std::string ConvertUtf16ToMUtf8(const uint16_t *u16Data, size_t u16DataSize)
{
    size_t mutf8DataLen = panda::utf::Utf16ToMUtf8Size(u16Data, u16DataSize);
    std::vector<uint8_t> mutf8Data(mutf8DataLen);

    panda::utf::ConvertRegionUtf16ToMUtf8(u16Data, mutf8Data.data(), u16DataSize, mutf8DataLen - 1, 0);

    std::string ret = std::string(reinterpret_cast<char *>(mutf8Data.data()));
    return ret;
}

static std::string ConvertUtf8ToMUtf8(const std::string &data)
{
    // WARN: std::u16string is set of uint_least16_t characters.
    std::u16string u16String = ConvertUtf8ToUtf16(data);
    uint16_t *u16Data = reinterpret_cast<uint16_t *>(u16String.data());
    size_t u16DataSize = u16String.size();
    return ConvertUtf16ToMUtf8(u16Data, u16DataSize);
}

static std::string GetLiteralId(int64_t index)
{
    return g_recordName + "_" + std::to_string(index);
}

static bool IsFuncMain0(std::string funcName)
{
    std::string expectedName = "func_main_0";
    if (g_isMergeAbc) {
        expectedName = g_recordName + "." + expectedName;
    }
    return funcName == expectedName;
}

static std::string ParseUnicodeEscapeString(const std::string &data)
{
    const int unicodeEscapeSymbolLen = 2;
    const int unicodeCharacterLen = 4;
    const int base = 16;
    std::string::size_type startIdx = 0;
    std::string newData = "";
    std::string::size_type len = data.length();
    while (true) {
        std::string unicodeStr = "\\u";
        std::string::size_type index = data.find(unicodeStr, startIdx);
        if (index == std::string::npos) {
            break;
        }
        if (index != 0 && data[index - 1] == '\\') {
            std::string tmpStr = data.substr(startIdx, index - 1 - startIdx) +
                                data.substr(index, unicodeEscapeSymbolLen); // delete a '\\'
            newData += ConvertUtf8ToMUtf8(tmpStr);
            startIdx = index + unicodeEscapeSymbolLen;
        } else {
            std::string tmpStr = data.substr(startIdx, index - startIdx);
            newData += ConvertUtf8ToMUtf8(tmpStr);
            std::string uStr = data.substr(index + unicodeEscapeSymbolLen, unicodeCharacterLen);
            uint16_t u16Data = static_cast<uint16_t>(std::stoi(uStr.c_str(), NULL, base));
            newData += ConvertUtf16ToMUtf8(&u16Data, 1);
            startIdx = index + unicodeEscapeSymbolLen + unicodeCharacterLen;
        }
    }
    if (startIdx != len) {
        std::string tmpStr = data.substr(startIdx);
        newData += ConvertUtf8ToMUtf8(tmpStr);
    }
    return newData;
}

std::string ParseString(const std::string &data)
{
    if (data.find("\\u") != std::string::npos) {
        return ParseUnicodeEscapeString(data);
    }

    return ConvertUtf8ToMUtf8(data);
}

static void ParseLiteral(const Json::Value &literal, std::vector<panda::pandasm::LiteralArray::Literal> &literalArray)
{
    panda::pandasm::LiteralArray::Literal tagLiteral;
    panda::pandasm::LiteralArray::Literal valueLiteral;

    uint8_t tagValue = static_cast<uint8_t>(literal["t"].asUInt());

    tagLiteral.tag_ = panda::panda_file::LiteralTag::TAGVALUE;
    tagLiteral.value_ = tagValue;
    literalArray.emplace_back(tagLiteral);

    switch (tagValue) {
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::BOOL): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::BOOL;
            valueLiteral.value_ = literal["v"].asBool();
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::INTEGER): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::INTEGER;
            valueLiteral.value_ = static_cast<uint32_t>(literal["v"].asInt());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::DOUBLE): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::DOUBLE;
            valueLiteral.value_ = literal["v"].asDouble();
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::STRING): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::STRING;
            valueLiteral.value_ = ParseString(literal["v"].asString());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::METHOD): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::METHOD;
            valueLiteral.value_ = ParseString(literal["v"].asString());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::GENERATORMETHOD): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::GENERATORMETHOD;
            valueLiteral.value_ = ParseString(literal["v"].asString());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::ACCESSOR): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::ACCESSOR;
            valueLiteral.value_ = static_cast<uint8_t>(0);
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::METHODAFFILIATE): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE;
            valueLiteral.value_ = static_cast<uint16_t>(literal["v"].asUInt());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::LITERALBUFFERINDEX): {
            UNREACHABLE();
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::LITERALARRAY): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::LITERALARRAY;
            valueLiteral.value_ = ParseString(literal["v"].asString());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::BUILTINTYPEINDEX): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::BUILTINTYPEINDEX;
            valueLiteral.value_ = static_cast<uint8_t>(literal["v"].asInt());
            break;
        }
        case static_cast<uint8_t>(panda::panda_file::LiteralTag::NULLVALUE): {
            valueLiteral.tag_ = panda::panda_file::LiteralTag::NULLVALUE;
            valueLiteral.value_ = static_cast<uint8_t>(0);
            break;
        }
        default:
            break;
    }

    literalArray.emplace_back(valueLiteral);
}

static panda::pandasm::Record ParseRecord(const Json::Value &record)
{
    std::string recordName = "";
    if (record.isMember("name") && record["name"].isString()) {
        recordName = record["name"].asString();
    }

    auto pandaRecord = MakeRecordDefinition(recordName);

    if (record.isMember("metadata") && record["metadata"].isObject()) {
        auto metadata = record["metadata"];
        if (metadata.isMember("attribute") && metadata["attribute"].isString()) {
            std::string metAttribute = metadata["attribute"].asString();
            if (metAttribute.length() > 0) {
                pandaRecord.metadata->SetAttribute(metAttribute);
            }
        }
    }

    return pandaRecord;
}

static void ParseInstructionOpCode(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    if (ins.isMember("o") && ins["o"].isInt()) {
        auto opcode = ins["o"].asInt();
        if (g_opcodeMap.find(opcode) != g_opcodeMap.end()) {
            pandaIns.opcode = g_opcodeMap[opcode];
        }
    }
}

static void ParseInstructionRegs(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    if (ins.isMember("r") && ins["r"].isArray()) {
        auto regs = ins["r"];
        for (Json::ArrayIndex i = 0; i < regs.size(); ++i) {
            pandaIns.regs.emplace_back(regs[i].asUInt());
        }
    }
}

static void ParseInstructionIds(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    if (ins.isMember("id") && ins["id"].isArray()) {
        auto ids = ins["id"];
        for (Json::ArrayIndex i = 0; i < ids.size(); ++i) {
            if (ids[i].isString()) {
                pandaIns.ids.emplace_back(ParseString(ids[i].asString()));
            }
        }
    }
}

static void ParseInstructionImms(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    if (ins.isMember("im") && ins["im"].isArray()) {
        auto imms = ins["im"];
        for (Json::ArrayIndex i = 0; i < imms.size(); ++i) {
            double imsValue = imms[i].asDouble();
            Logd("imm: %lf ", imsValue);
            double intpart;
            if (std::modf(imsValue, &intpart) == 0.0 && IsValidInt32(imsValue)) {
                pandaIns.imms.emplace_back(static_cast<int64_t>(imsValue));
            } else {
                pandaIns.imms.emplace_back(imsValue);
            }
        }
    }
}

static void ParseInstructionLabel(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    if (ins.isMember("l") && ins["l"].isString()) {
        std::string label = ins["l"].asString();
        if (label.length() != 0) {
            Logd("label:\t%s", label.c_str());
            pandaIns.set_label = true;
            pandaIns.label = label;
            Logd("pandaIns.label:\t%s", pandaIns.label.c_str());
        }
    }
}

static void ParseInstructionDebugInfo(const Json::Value &ins, panda::pandasm::Ins &pandaIns)
{
    panda::pandasm::debuginfo::Ins insDebug;
    if (ins.isMember("d") && ins["d"].isObject()) {
        auto debugPosInfo = ins["d"];
        if (GetDebugModeEnabled()) {
            if (debugPosInfo.isMember("bl") && debugPosInfo["bl"].isInt()) {
                insDebug.bound_left = debugPosInfo["bl"].asUInt();
            }

            if (debugPosInfo.isMember("br") && debugPosInfo["br"].isInt()) {
                insDebug.bound_right = debugPosInfo["br"].asUInt();
            }

            // whole line
            if (debugPosInfo.isMember("w") && debugPosInfo["w"].isString()) {
                insDebug.whole_line = debugPosInfo["w"].asString();
            }

            // column number
            if (debugPosInfo.isMember("c") && debugPosInfo["c"].isInt()) {
                insDebug.column_number = debugPosInfo["c"].asInt();
            }
        }

        // line number
        if (debugPosInfo.isMember("l") && debugPosInfo["l"].isInt()) {
            insDebug.line_number = debugPosInfo["l"].asInt();
        }
    }

    pandaIns.ins_debug = insDebug;
}

static panda::pandasm::Ins ParseInstruction(const Json::Value &ins)
{
    panda::pandasm::Ins pandaIns;
    ParseInstructionOpCode(ins, pandaIns);
    ParseInstructionRegs(ins, pandaIns);
    ParseInstructionIds(ins, pandaIns);
    ParseInstructionImms(ins, pandaIns);
    ParseInstructionLabel(ins, pandaIns);
    ParseInstructionDebugInfo(ins, pandaIns);
    return pandaIns;
}

static int ParseVariablesDebugInfo(const Json::Value &function, panda::pandasm::Function &pandaFunc)
{
    if (!GetDebugModeEnabled()) {
        return RETURN_SUCCESS;
    }

    if (function.isMember("v") && function["v"].isArray()) {
        for (Json::ArrayIndex i = 0; i < function["v"].size(); ++i) {
            if (!function["v"][i].isObject()) {
                continue;
            }

            panda::pandasm::debuginfo::LocalVariable variableDebug;
            auto variable = function["v"][i];
            if (variable.isMember("n") && variable["n"].isString()) {
                variableDebug.name = variable["n"].asString();  // name
            }

            if (variable.isMember("s") && variable["s"].isString()) {
                variableDebug.signature = variable["s"].asString();  // signature
            }

            if (variable.isMember("st") && variable["st"].isString()) {
                variableDebug.signature_type = variable["st"].asString();  // signature type
            }

            if (variable.isMember("r") && variable["r"].isInt()) {
                variableDebug.reg = variable["r"].asInt();  // regs
            }

            if (variable.isMember("start") && variable["start"].isInt()) {
                variableDebug.start = variable["start"].asUInt();  // start
            }

            if (variable.isMember("len") && variable["len"].isInt()) {
                variableDebug.length = variable["len"].asUInt();  // length
            }

            pandaFunc.local_variable_debug.push_back(variableDebug);
        }
    }

    return RETURN_SUCCESS;
}

static int ParseSourceFileInfo(const Json::Value &function, panda::pandasm::Function &pandaFunc)
{
    if (function.isMember("sf") && function["sf"].isString()) {
        pandaFunc.source_file = function["sf"].asString();
    }

    if (function.isMember("sc") && function["sc"].isString()) {
        pandaFunc.source_code = function["sc"].asString();
    }

    return RETURN_SUCCESS;
}

static panda::pandasm::Function::CatchBlock ParsecatchBlock(const Json::Value &catch_block)
{
    panda::pandasm::Function::CatchBlock pandaCatchBlock;

    if (catch_block.isMember("tb_lab") && catch_block["tb_lab"].isString()) {
        pandaCatchBlock.try_begin_label = catch_block["tb_lab"].asString();
    }

    if (catch_block.isMember("te_lab") && catch_block["te_lab"].isString()) {
        pandaCatchBlock.try_end_label = catch_block["te_lab"].asString();
    }

    if (catch_block.isMember("cb_lab") && catch_block["cb_lab"].isString()) {
        pandaCatchBlock.catch_begin_label = catch_block["cb_lab"].asString();
        pandaCatchBlock.catch_end_label = catch_block["cb_lab"].asString();
    }

    return pandaCatchBlock;
}

panda::pandasm::Function GetFunctionDefintion(const Json::Value &function)
{
    std::string funcName = "";
    if (function.isMember("n") && function["n"].isString()) {
        funcName = function["n"].asString();
    }

    std::string funcRetType = "";
    auto params = std::vector<panda::pandasm::Function::Parameter>();
    if (function.isMember("s") && function["s"].isObject()) {
        auto signature = function["s"];
        if (signature.isMember("rt") && signature["rt"].isString()) {
            funcRetType = signature["rt"].asString();
        } else {
            funcRetType = "any";
        }

        Logd("parsing function: %s return type: %s \n", funcName.c_str(), funcRetType.c_str());

        if (signature.isMember("p") && signature["p"].isInt()) {
            auto paramNum = signature["p"].asUInt();
            for (Json::ArrayIndex i = 0; i < paramNum; ++i) {
                params.emplace_back(panda::pandasm::Type("any", 0), LANG_EXT);
            }
        }
    }

    uint32_t regsNum = 0;
    if (function.isMember("r") && function["r"].isInt()) {
        regsNum = function["r"].asUInt();
    }

    auto pandaFunc = MakeFuncDefintion(funcName, funcRetType);
    pandaFunc.params = std::move(params);
    pandaFunc.regs_num = regsNum;

    return pandaFunc;
}

static void ParseFunctionInstructions(const Json::Value &function, panda::pandasm::Function &pandaFunc)
{
    if (function.isMember("i") && function["i"].isArray()) {
        auto ins = function["i"];
        for (Json::ArrayIndex i = 0; i < ins.size(); ++i) {
            if (!ins[i].isObject()) {
                continue;
            }

            auto paIns = ParseInstruction(ins[i]);
            Logd("instruction:\t%s", paIns.ToString().c_str());
            pandaFunc.ins.push_back(paIns);
        }
    }
}

static void ParseFunctionLabels(const Json::Value &function, panda::pandasm::Function &pandaFunc)
{
    if (function.isMember("l") && function["l"].isArray()) {
        auto labels = function["l"];
        for (Json::ArrayIndex i = 0; i < labels.size(); ++i) {
            auto labelName = labels[i].asString();
            auto pandaLabel = MakeLabel(labelName);

            Logd("label_name:\t%s", labelName.c_str());
            pandaFunc.label_table.emplace(labelName, pandaLabel);
        }
    }
}

static void ParseFunctionCatchTables(const Json::Value &function, panda::pandasm::Function &pandaFunc)
{
    if (function.isMember("ca_tab") && function["ca_tab"].isArray()) {
        auto catchTables = function["ca_tab"];
        for (Json::ArrayIndex i = 0; i < catchTables.size(); ++i) {
            auto catchTable = catchTables[i];
            if (!catchTable.isObject()) {
                continue;
            }

            auto pandaCatchBlock = ParsecatchBlock(catchTable);
            pandaFunc.catch_blocks.push_back(pandaCatchBlock);
        }
    }
}

static std::vector<std::pair<int32_t, uint32_t>> GetInstTypeMap(const Json::Value &function,
                                                                panda::pandasm::Function &pandaFunc)
{
    constexpr const char* TYPE_INFO = "ti";
    std::vector<std::pair<int32_t, uint32_t>> instTypeMap;
    if (!function.isMember(TYPE_INFO) || !function[TYPE_INFO].isArray()) {
        return instTypeMap;
    }

    // must be instidx <-> typeidx pair
    auto sourceTypeMap = function[TYPE_INFO];
    constexpr size_t TYPE_MAP_ELEMENT_SIZE = 2;
    ASSERT(sourceTypeMap.size() % TYPE_MAP_ELEMENT_SIZE == 0);
    instTypeMap.reserve(sourceTypeMap.size() / TYPE_MAP_ELEMENT_SIZE);

    // fix inst index since invalid inst won't be emit
    int32_t start = 0;
    int32_t remove = 0;
    for (Json::ArrayIndex i = 0; i < sourceTypeMap.size(); i += TYPE_MAP_ELEMENT_SIZE) {
        auto instIndex = sourceTypeMap[i].asInt();
        auto typeIndex = sourceTypeMap[i + 1].asUInt();
        if (instIndex < 0) { // para
            instTypeMap.emplace_back(instIndex, typeIndex);
            continue;
        }

        // remove the invalid instruction
        for (; start < instIndex; start++) {
            if (pandaFunc.ins[start].opcode == panda::pandasm::Opcode::INVALID) {
                remove++;
            }
        }
        instTypeMap.emplace_back(instIndex - remove, typeIndex);
    }

    if (g_displayTypeinfo) {
        std::cout << "Handle types for function: " << pandaFunc.name << std::endl;
        std::cout << "(instruction order, type): ";
        for (auto &it : instTypeMap) {
            std::cout << "(" << it.first << ", " << it.second << "), ";
        }
        std::cout << std::endl;
    }

    return instTypeMap;
}

static void ParseFunctionTypeInfo(const Json::Value &function, panda::pandasm::Function &pandaFunc,
                                  panda::pandasm::Program &prog)
{
    auto instTypeMap = GetInstTypeMap(function, pandaFunc);
    if (!instTypeMap.empty()) {
        std::vector<panda::pandasm::LiteralArray::Literal> literalArray;
        for (auto &it : instTypeMap) {
            panda::pandasm::LiteralArray::Literal instTagLiteral;
            panda::pandasm::LiteralArray::Literal instValueLiteral;
            instTagLiteral.tag_ = panda::panda_file::LiteralTag::TAGVALUE;
            ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::INTEGER) <= MAX_UINT8);
            instTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::INTEGER);
            literalArray.emplace_back(instTagLiteral);
            instValueLiteral.tag_ = panda::panda_file::LiteralTag::INTEGER;
            instValueLiteral.value_ = static_cast<uint32_t>(it.first);
            literalArray.emplace_back(instValueLiteral);

            panda::pandasm::LiteralArray::Literal typeTagLiteral;
            panda::pandasm::LiteralArray::Literal typeValueLiteral;
            typeTagLiteral.tag_ = panda::panda_file::LiteralTag::TAGVALUE;
            auto type = it.second;
            if (type < LITERALBUFFERINDEXOFFSET) {
                ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::BUILTINTYPEINDEX) <= MAX_UINT8);
                typeTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::BUILTINTYPEINDEX);
                typeValueLiteral.tag_ = panda::panda_file::LiteralTag::BUILTINTYPEINDEX;
                ASSERT(type <= MAX_UINT8);
                typeValueLiteral.value_ = static_cast<uint8_t>(type);
            } else {
                ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::LITERALARRAY) <= MAX_UINT8);
                typeTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::LITERALARRAY);
                typeValueLiteral.tag_ = panda::panda_file::LiteralTag::LITERALARRAY;
                std::string typeId = GetLiteralId(type - LITERALBUFFERINDEXOFFSET);
                typeValueLiteral.value_ = typeId;
            }
            literalArray.emplace_back(typeTagLiteral);
            literalArray.emplace_back(typeValueLiteral);
        }

        std::string litId = GetLiteralId(g_newLiteralArrayIndex--);
        auto literalarrayInstance = panda::pandasm::LiteralArray(literalArray);
        prog.literalarray_table.emplace(litId, std::move(literalarrayInstance));

        panda::pandasm::AnnotationData funcAnnotation(TSTYPE_ANNO_RECORD_NAME);
        panda::pandasm::AnnotationElement typeOfVregElement(
            TSTYPE_ANNO_ELEMENT_NAME, std::make_unique<panda::pandasm::ScalarValue>(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(litId)));
        funcAnnotation.AddElement(std::move(typeOfVregElement));
        const_cast<std::vector<panda::pandasm::AnnotationData>&>(pandaFunc.metadata->GetAnnotations()).push_back(
            std::move(funcAnnotation));
    }
}

static std::string CreateLiteralArrayForType(const Json::Value &types, panda::pandasm::Program &prog)
{
    std::vector<panda::pandasm::LiteralArray::Literal> literalArray;
    for (Json::ArrayIndex i = 0; i < types.size(); i++) {
        auto type = types[i];
        if (!type.isObject()) {
            continue;
        }

        panda::pandasm::LiteralArray::Literal symbolTagLiteral;
        panda::pandasm::LiteralArray::Literal symbolValueLiteral;
        std::string symbol = "";
        if (type.isMember("symbol") && type["symbol"].isString()) {
            symbol = type["symbol"].asString();
        }
        symbolTagLiteral.tag_ = panda::panda_file::LiteralTag::TAGVALUE;
        ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::STRING) <= MAX_UINT8);
        symbolTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::STRING);
        symbolValueLiteral.tag_ = panda::panda_file::LiteralTag::STRING;
        symbolValueLiteral.value_ = symbol;
        literalArray.emplace_back(symbolTagLiteral);
        literalArray.emplace_back(symbolValueLiteral);

        panda::pandasm::LiteralArray::Literal typeTagLiteral;
        panda::pandasm::LiteralArray::Literal typeValueLiteral;
        uint32_t typeIndex = 0;
        if (type.isMember("type") && type["type"].isInt()) {
            typeIndex = type["type"].asUInt();
        }
        typeTagLiteral.tag_ = panda::panda_file::LiteralTag::TAGVALUE;
        if (typeIndex < LITERALBUFFERINDEXOFFSET) {
            ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::BUILTINTYPEINDEX) <= MAX_UINT8);
            typeTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::BUILTINTYPEINDEX);
            typeValueLiteral.tag_ = panda::panda_file::LiteralTag::BUILTINTYPEINDEX;
            ASSERT(typeIndex <= MAX_UINT8);
            typeValueLiteral.value_ = static_cast<uint8_t>(typeIndex);
        } else {
            ASSERT(static_cast<uint32_t>(panda::panda_file::LiteralTag::LITERALARRAY) <= MAX_UINT8);
            typeTagLiteral.value_ = static_cast<uint8_t>(panda::panda_file::LiteralTag::LITERALARRAY);
            typeValueLiteral.tag_ = panda::panda_file::LiteralTag::LITERALARRAY;
            std::string litId = GetLiteralId(typeIndex - LITERALBUFFERINDEXOFFSET);
            typeValueLiteral.value_ = litId;
        }

        literalArray.emplace_back(typeTagLiteral);
        literalArray.emplace_back(typeValueLiteral);
    }

    std::string litId = GetLiteralId(g_newLiteralArrayIndex--);
    auto literalarrayInstance = panda::pandasm::LiteralArray(literalArray);
    prog.literalarray_table.emplace(litId, std::move(literalarrayInstance));
    return litId;
}

static void ParseFunctionExportedType(const Json::Value &function, panda::pandasm::Function &pandaFunc,
                                      panda::pandasm::Program &prog)
{
    std::string funcName = "";
    if (function.isMember("n") && function["n"].isString()) {
        funcName = function["n"].asString();
        if (!IsFuncMain0(funcName)) {
            return;
        }
    }

    if (function.isMember("es2t") && function["es2t"].isArray()) {
        auto exportedTypes = function["es2t"];
        panda::pandasm::AnnotationData funcAnnotation(TSTYPE_ANNO_RECORD_NAME);
        std::string litId = CreateLiteralArrayForType(exportedTypes, prog);

        std::string symbolTypeAnnotationName = "exportedSymbolTypes";
        panda::pandasm::AnnotationElement exportedSymbolTypesElement(symbolTypeAnnotationName,
            std::make_unique<panda::pandasm::ScalarValue>(
                panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(litId)));
        funcAnnotation.AddElement(std::move(exportedSymbolTypesElement));

        const_cast<std::vector<panda::pandasm::AnnotationData>&>(
            pandaFunc.metadata->GetAnnotations()).push_back(std::move(funcAnnotation));
    }
}

static void ParseFunctionDeclaredType(const Json::Value &function, panda::pandasm::Function &pandaFunc,
                                      panda::pandasm::Program &prog)
{
    std::string funcName = "";
    if (function.isMember("n") && function["n"].isString()) {
        funcName = function["n"].asString();
        if (!IsFuncMain0(funcName)) {
            return;
        }
    }

    if (function.isMember("ds2t") && function["ds2t"].isArray()) {
        auto declaredTypes = function["ds2t"];
        panda::pandasm::AnnotationData funcAnnotation(TSTYPE_ANNO_RECORD_NAME);
        std::string litId = CreateLiteralArrayForType(declaredTypes, prog);

        std::string symbolTypeAnnotationName = "declaredSymbolTypes";
        panda::pandasm::AnnotationElement declaredSymbolTypesElement(symbolTypeAnnotationName,
            std::make_unique<panda::pandasm::ScalarValue>(
                panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(litId)));
        funcAnnotation.AddElement(std::move(declaredSymbolTypesElement));

        const_cast<std::vector<panda::pandasm::AnnotationData>&>(pandaFunc.metadata->GetAnnotations()).push_back(
            std::move(funcAnnotation));
    }
}

static void ParseFunctionKind(const Json::Value &function, panda::pandasm::Function &pandaFunc) {
    panda::panda_file::FunctionKind funcKind {};
    if (function.isMember("kind") && function["kind"].isInt()) {
        funcKind = static_cast<panda::panda_file::FunctionKind>(function["kind"].asUInt());
        pandaFunc.SetFunctionKind(funcKind);
    }
}

static void ParseFunctionIcSize(const Json::Value &function, panda::pandasm::Function &pandaFunc) {
    if (function.isMember("icSize") && function["icSize"].isInt()) {
        size_t icSize = static_cast<size_t>(function["icSize"].asUInt());
        pandaFunc.SetSlotsNum(icSize);
    }
}

static panda::pandasm::Function ParseFunction(const Json::Value &function, panda::pandasm::Program &prog)
{
    auto pandaFunc = GetFunctionDefintion(function);
    ParseFunctionInstructions(function, pandaFunc);
    ParseVariablesDebugInfo(function, pandaFunc);
    ParseSourceFileInfo(function, pandaFunc);
    ParseFunctionLabels(function, pandaFunc);
    ParseFunctionCatchTables(function, pandaFunc);
    ParseFunctionTypeInfo(function, pandaFunc, prog);
    ParseFunctionExportedType(function, pandaFunc, prog);
    ParseFunctionDeclaredType(function, pandaFunc, prog);
    ParseFunctionKind(function, pandaFunc);
    ParseFunctionIcSize(function, pandaFunc);

    if (g_isDtsFile && !IsFuncMain0(pandaFunc.name)) {
        pandaFunc.metadata->SetAttribute("external");
    }

    return pandaFunc;
}

static void GenerateESCallTypeAnnotationRecord(panda::pandasm::Program &prog)
{
    auto callTypeAnnotationRecord = panda::pandasm::Record("_ESCallTypeAnnotation", LANG_EXT);
    callTypeAnnotationRecord.metadata->SetAttribute("external");
    callTypeAnnotationRecord.metadata->SetAccessFlags(panda::ACC_ANNOTATION);
    prog.record_table.emplace(callTypeAnnotationRecord.name, std::move(callTypeAnnotationRecord));
}
static void GenerateESTypeAnnotationRecord(panda::pandasm::Program &prog)
{
    auto tsTypeAnnotationRecord = panda::pandasm::Record(TSTYPE_ANNO_RECORD_NAME, LANG_EXT);
    tsTypeAnnotationRecord.metadata->SetAttribute("external");
    tsTypeAnnotationRecord.metadata->SetAccessFlags(panda::ACC_ANNOTATION);
    prog.record_table.emplace(tsTypeAnnotationRecord.name, std::move(tsTypeAnnotationRecord));
}

static void GenerateESModuleRecord(panda::pandasm::Program &prog)
{
    auto ecmaModuleRecord = panda::pandasm::Record("_ESModuleRecord", LANG_EXT);
    ecmaModuleRecord.metadata->SetAccessFlags(panda::ACC_PUBLIC);
    prog.record_table.emplace(ecmaModuleRecord.name, std::move(ecmaModuleRecord));
}

static void GenerateCommonJsRecord(panda::pandasm::Program &prog, bool isCommonJs)
{
    // when multi-abc file get merged, field should be inserted in abc's own record
    auto commonjsRecord = panda::pandasm::Record("_CommonJsRecord", LANG_EXT);
    commonjsRecord.metadata->SetAccessFlags(panda::ACC_PUBLIC);
    auto isCommonJsField = panda::pandasm::Field(LANG_EXT);
    isCommonJsField.name = "isCommonJs";
    isCommonJsField.type = panda::pandasm::Type("u8", 0);
    isCommonJsField.metadata->SetValue(panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(
        static_cast<uint8_t>(isCommonJs)));
    commonjsRecord.field_list.emplace_back(std::move(isCommonJsField));

    prog.record_table.emplace(commonjsRecord.name, std::move(commonjsRecord));
}

static void SetCommonjsField(panda::pandasm::Program &prog, bool isCommonjs)
{
    auto iter = prog.record_table.find(g_recordName);
    if (iter != prog.record_table.end()) {
        auto &rec = iter->second;
        auto isCommonJsField = panda::pandasm::Field(LANG_EXT);
        isCommonJsField.name = "isCommonjs";
        isCommonJsField.type = panda::pandasm::Type("u8", 0);
        isCommonJsField.metadata->SetValue(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(static_cast<uint8_t>(isCommonjs)));
        rec.field_list.emplace_back(std::move(isCommonJsField));
    }
}

static void AddModuleRecord(panda::pandasm::Program &prog, const std::string &moduleName)
{
    std::string moduleRecordName = g_isMergeAbc ? g_recordName : "_ESModuleRecord";
    std::string fieldName = g_isMergeAbc ? "moduleRecordIdx" : moduleName;
    auto iter = prog.record_table.find(moduleRecordName);
    if (iter != prog.record_table.end()) {
        auto &rec = iter->second;
        auto moduleIdxField = panda::pandasm::Field(LANG_EXT);
        moduleIdxField.name = fieldName;
        moduleIdxField.type = panda::pandasm::Type("u32", 0);
        std::string moduleId = GetLiteralId(g_newLiteralArrayIndex);
        moduleIdxField.metadata->SetValue(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(moduleId));

        rec.field_list.emplace_back(std::move(moduleIdxField));
    }
}

int ParseJson(const std::string &data, Json::Value &rootValue)
{
    JSONCPP_STRING errs;
    Json::CharReaderBuilder readerBuilder;

    std::unique_ptr<Json::CharReader> const jsonReader(readerBuilder.newCharReader());
    bool res = jsonReader->parse(data.c_str(), data.c_str() + data.length(), &rootValue, &errs);
    if (!res || !errs.empty()) {
        std::cerr << "ParseJson err. " << errs.c_str() << std::endl;
        return RETURN_FAILED;
    }

    if (!rootValue.isObject()) {
        std::cerr << "The parsed json data is not one object" << std::endl;
        return RETURN_FAILED;
    }

    return RETURN_SUCCESS;
}

static void ParseMergeAbcMode(const Json::Value &rootValue)
{
    Logd("---------------parse is_merge_abc----------------");
    if (rootValue.isMember("merge_abc") && rootValue["merge_abc"].isBool()) {
        g_isMergeAbc = rootValue["merge_abc"].asBool();
    }
}

static void ParseModuleMode(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    Logd("----------------parse module_mode-----------------");
    if (rootValue.isMember("module_mode") && rootValue["module_mode"].isBool()) {
        if (rootValue["module_mode"].asBool() && !g_isMergeAbc) {
            GenerateESModuleRecord(prog);
        }
    }
}

static void ParseCommonJsModuleMode(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    Logd("------------parse commonjs_module_mode-------------");
    if (rootValue.isMember("commonjs_module") && rootValue["commonjs_module"].isBool()) {
        if (g_isMergeAbc) {
            SetCommonjsField(prog, rootValue["commonjs_module"].asBool());
        } else {
            if (rootValue["commonjs_module"].asBool()) {
                GenerateCommonJsRecord(prog, true);
            }
        }
    }
}

void ParseLogEnable(const Json::Value &rootValue)
{
    if (rootValue.isMember("log_enabled") && rootValue["log_enabled"].isBool()) {
        SetDebugLog(rootValue["log_enabled"].asBool());
    }
}

void ParseDebugMode(const Json::Value &rootValue)
{
    Logd("-----------------parse debug_mode-----------------");
    if (rootValue.isMember("debug_mode") && rootValue["debug_mode"].isBool()) {
        SetDebugModeEnabled(rootValue["debug_mode"].asBool());
    }
}

static void ParseOptLevel(const Json::Value &rootValue)
{
    Logd("-----------------parse opt level-----------------");
    if (rootValue.isMember("opt_level") && rootValue["opt_level"].isInt()) {
        g_optLevel = rootValue["opt_level"].asInt();
    }
    if (GetDebugModeEnabled()) {
        g_optLevel = 0;
    }
}

static void ParseDisplayTypeinfo(const Json::Value &rootValue)
{
    Logd("-----------------parse enable_typeinfo-----------------");
    if (rootValue.isMember("display_typeinfo") && rootValue["display_typeinfo"].isBool()) {
        g_displayTypeinfo = rootValue["display_typeinfo"].asBool();
    }
}

static void ParseOptLogLevel(const Json::Value &rootValue)
{
    Logd("-----------------parse opt log level-----------------");
    if (rootValue.isMember("opt_log_level") && rootValue["opt_log_level"].isString()) {
        g_optLogLevel = rootValue["opt_log_level"].asString();
    }
}

static void ParseIsDtsFile(const Json::Value &rootValue)
{
    Logd("-----------------parse is dts file-----------------");
    if (rootValue.isMember("is_dts_file") && rootValue["is_dts_file"].isBool()) {
        g_isDtsFile = rootValue["is_dts_file"].asBool();
    }
}

static void ParseEnableTypeInfo(const Json::Value &rootValue)
{
    Logd("-----------------parse enable type info-----------------");
    if (rootValue.isMember("record_type") && rootValue["record_type"].isBool()) {
        g_enableTypeinfo = rootValue["record_type"].asBool();
    }
}

static void ParseCompilerOutputProto(const Json::Value &rootValue)
{
    Logd("-----------------parse compiler output proto-----------------");
    if (rootValue.isMember("output-proto") && rootValue["output-proto"].isBool()) {
        g_isOutputProto = rootValue["output-proto"].asBool();
    }
}

static void ReplaceAllDistinct(std::string &str, const std::string &oldValue, const std::string &newValue)
{
    for (std::string::size_type pos(0); pos != std::string::npos; pos += newValue.length()) {
        if ((pos = str.find(oldValue, pos)) != std::string::npos) {
            str.replace(pos, oldValue.length(), newValue);
        } else {
            break;
        }
    }
}

static void ParseOptions(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    GenerateESCallTypeAnnotationRecord(prog);
    GenerateESTypeAnnotationRecord(prog);
    ParseMergeAbcMode(rootValue);
    ParseModuleMode(rootValue, prog);
    ParseCommonJsModuleMode(rootValue, prog);
    ParseLogEnable(rootValue);
    ParseDebugMode(rootValue);
    ParseOptLevel(rootValue);
    ParseDisplayTypeinfo(rootValue);
    ParseOptLogLevel(rootValue);
    ParseIsDtsFile(rootValue);
    ParseEnableTypeInfo(rootValue);
    ParseCompilerOutputProto(rootValue);
}

static void ParseSingleFunc(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    auto function = ParseFunction(rootValue["fb"], prog);
    prog.function_table.emplace(function.name.c_str(), std::move(function));
}

static void ParseRec(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    auto record = ParseRecord(rootValue["rb"]);
    g_recordName = record.name;
    prog.record_table.emplace(record.name.c_str(), std::move(record));
}

static void SetPackageName(const std::string &packageName, panda::pandasm::Program &prog)
{
    auto iter = prog.record_table.find(g_recordName);
    if (iter != prog.record_table.end()) {
        auto &rec = iter->second;
        auto pkgNameField = panda::pandasm::Field(LANG_EXT);
        pkgNameField.name = "pkgName@" + packageName;
        pkgNameField.type = panda::pandasm::Type("u8", 0);
        pkgNameField.metadata->SetValue(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(static_cast<uint8_t>(0)));

        rec.field_list.emplace_back(std::move(pkgNameField));
    }
}

static void ParseInputJsonFileContent(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    auto iter = prog.record_table.find(g_recordName);
    if (iter != prog.record_table.end()) {
        auto &rec = iter->second;

        auto inputJsonFileContentField = panda::pandasm::Field(LANG_EXT);
        inputJsonFileContentField.name = "jsonFileContent";
        inputJsonFileContentField.type = panda::pandasm::Type("u32", 0);
        inputJsonFileContentField.metadata->SetValue(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::STRING>(
            static_cast<std::string_view>(rootValue["ijfc"].asString())));
        rec.field_list.emplace_back(std::move(inputJsonFileContentField));
    }
}

static void ParseSingleStr(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    auto strArr = rootValue["s"];
    for (Json::ArrayIndex i = 0; i < strArr.size(); ++i) {
        prog.strings.insert(ParseString(strArr[i].asString()));
    }
}

static void ParseSingleLiteralBuf(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    std::vector<panda::pandasm::LiteralArray::Literal> literalArray;
    auto literalBuffer = rootValue["lit_arr"];
    auto literals = literalBuffer["lb"];
    for (Json::ArrayIndex i = 0; i < literals.size(); ++i) {
        ParseLiteral(literals[i], literalArray);
    }

    auto literalarrayInstance = panda::pandasm::LiteralArray(literalArray);
    auto litId = literalBuffer["k"].asString();
    prog.literalarray_table.emplace(litId, std::move(literalarrayInstance));
}

static void ParseModuleRequests(const Json::Value &moduleRequests,
                                std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal moduleSize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(moduleRequests.size())};
    moduleLiteralArray.emplace_back(moduleSize);
    for (Json::ArrayIndex i = 0; i < moduleRequests.size(); ++i) {
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(moduleRequests[i].asString())};
        moduleLiteralArray.emplace_back(moduleRequest);
    }
}

static void ParseRegularImportEntries(const Json::Value &regularImportEntries,
                                      std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(regularImportEntries.size())};
    moduleLiteralArray.emplace_back(entrySize);
    for (Json::ArrayIndex i = 0; i < regularImportEntries.size(); ++i) {
        auto entry = regularImportEntries[i];
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["localName"].asString())};
        moduleLiteralArray.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal importName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["importName"].asString())};
        moduleLiteralArray.emplace_back(importName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry["moduleRequest"].asUInt())};
        moduleLiteralArray.emplace_back(moduleRequest);
    }
}

static void ParseNamespaceImportEntries(const Json::Value &namespaceImportEntries,
                                        std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER,
        .value_ = static_cast<uint32_t>(namespaceImportEntries.size())};
    moduleLiteralArray.emplace_back(entrySize);
    for (Json::ArrayIndex i = 0; i < namespaceImportEntries.size(); ++i) {
        auto entry = namespaceImportEntries[i];
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["localName"].asString())};
        moduleLiteralArray.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry["moduleRequest"].asUInt())};
        moduleLiteralArray.emplace_back(moduleRequest);
    }
}

static void ParseLocalExportEntries(const Json::Value &localExportEntries,
                                    std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(localExportEntries.size())};
    moduleLiteralArray.emplace_back(entrySize);
    for (Json::ArrayIndex i = 0; i < localExportEntries.size(); ++i) {
        auto entry = localExportEntries[i];
        panda::pandasm::LiteralArray::Literal localName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["localName"].asString())};
        moduleLiteralArray.emplace_back(localName);
        panda::pandasm::LiteralArray::Literal exportName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["exportName"].asString())};
        moduleLiteralArray.emplace_back(exportName);
    }
}

static void ParseIndirectExportEntries(const Json::Value &indirectExportEntries,
                                       std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(indirectExportEntries.size())};
    moduleLiteralArray.emplace_back(entrySize);
    for (Json::ArrayIndex i = 0; i < indirectExportEntries.size(); ++i) {
        auto entry = indirectExportEntries[i];
        panda::pandasm::LiteralArray::Literal exportName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["exportName"].asString())};
        moduleLiteralArray.emplace_back(exportName);
        panda::pandasm::LiteralArray::Literal importName = {
            .tag_ = panda::panda_file::LiteralTag::STRING, .value_ = ParseString(entry["importName"].asString())};
        moduleLiteralArray.emplace_back(importName);
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(entry["moduleRequest"].asUInt())};
        moduleLiteralArray.emplace_back(moduleRequest);
    }
}

static void ParseStarExportEntries(const Json::Value &starExportEntries,
                                   std::vector<panda::pandasm::LiteralArray::Literal> &moduleLiteralArray)
{
    panda::pandasm::LiteralArray::Literal entrySize = {
        .tag_ = panda::panda_file::LiteralTag::INTEGER, .value_ = static_cast<uint32_t>(starExportEntries.size())};
    moduleLiteralArray.emplace_back(entrySize);
    for (Json::ArrayIndex i = 0; i < starExportEntries.size(); ++i) {
        panda::pandasm::LiteralArray::Literal moduleRequest = {
            .tag_ = panda::panda_file::LiteralTag::METHODAFFILIATE,
            .value_ = static_cast<uint16_t>(starExportEntries[i].asUInt())};
        moduleLiteralArray.emplace_back(moduleRequest);
    }
}

static void ParseSingleModule(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    std::vector<panda::pandasm::LiteralArray::Literal> moduleLiteralArray;

    auto moduleRecord = rootValue["mod"];
    ParseModuleRequests(moduleRecord["moduleRequests"], moduleLiteralArray);
    ParseRegularImportEntries(moduleRecord["regularImportEntries"], moduleLiteralArray);
    ParseNamespaceImportEntries(moduleRecord["namespaceImportEntries"], moduleLiteralArray);
    ParseLocalExportEntries(moduleRecord["localExportEntries"], moduleLiteralArray);
    ParseIndirectExportEntries(moduleRecord["indirectExportEntries"], moduleLiteralArray);
    ParseStarExportEntries(moduleRecord["starExportEntries"], moduleLiteralArray);

    std::string moduleName = ParseString(moduleRecord["moduleName"].asString());
    AddModuleRecord(prog, moduleName);
    std::string moduleId = GetLiteralId(g_newLiteralArrayIndex--);

    auto moduleLiteralarrayInstance = panda::pandasm::LiteralArray(moduleLiteralArray);
    prog.literalarray_table.emplace(moduleId, std::move(moduleLiteralarrayInstance));
}

static void ParseSingleTypeInfo(const Json::Value &rootValue, panda::pandasm::Program &prog)
{
    auto typeInfoRecord = rootValue["ti"];
    auto typeFlag = typeInfoRecord["tf"].asBool();
    auto typeSummaryIndex = typeInfoRecord["tsi"].asString();

    if (g_isMergeAbc) {
        auto iter = prog.record_table.find(g_recordName);
        if (iter != prog.record_table.end()) {
            auto &rec = iter->second;

            auto typeFlagField = panda::pandasm::Field(LANG_EXT);
            typeFlagField.name = "typeFlag";
            typeFlagField.type = panda::pandasm::Type("u8", 0);
            typeFlagField.metadata->SetValue(panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(
            static_cast<uint8_t>(typeFlag)));
            rec.field_list.emplace_back(std::move(typeFlagField));

            if (g_enableTypeinfo) {
                auto typeSummaryIndexField = panda::pandasm::Field(LANG_EXT);
                typeSummaryIndexField.name = "typeSummaryOffset";
                typeSummaryIndexField.type = panda::pandasm::Type("u32", 0);
                typeSummaryIndexField.metadata->SetValue(
                    panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(typeSummaryIndex));
                rec.field_list.emplace_back(std::move(typeSummaryIndexField));
            }
        }
        return;
    }
    auto ecmaTypeInfoRecord = panda::pandasm::Record("_ESTypeInfoRecord", LANG_EXT);
    ecmaTypeInfoRecord.metadata->SetAccessFlags(panda::ACC_PUBLIC);

    auto typeFlagField = panda::pandasm::Field(LANG_EXT);
    typeFlagField.name = "typeFlag";
    typeFlagField.type = panda::pandasm::Type("u8", 0);
    typeFlagField.metadata->SetValue(panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(
    static_cast<uint8_t>(typeFlag)));
    ecmaTypeInfoRecord.field_list.emplace_back(std::move(typeFlagField));

    if (g_enableTypeinfo) {
        auto typeSummaryIndexField = panda::pandasm::Field(LANG_EXT);
        typeSummaryIndexField.name = "typeSummaryOffset";
        typeSummaryIndexField.type = panda::pandasm::Type("u32", 0);
        typeSummaryIndexField.metadata->SetValue(
            panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::LITERALARRAY>(typeSummaryIndex));
        ecmaTypeInfoRecord.field_list.emplace_back(std::move(typeSummaryIndexField));
    }

    prog.record_table.emplace(ecmaTypeInfoRecord.name, std::move(ecmaTypeInfoRecord));
}

static int ParseSmallPieceJson(const std::string &subJson, panda::pandasm::Program &prog)
{
    Json::Value rootValue;
    if (ParseJson(subJson, rootValue)) {
        std::cerr <<" Fail to parse json by JsonCPP" << std::endl;
        return RETURN_FAILED;
    }
    int type = -1;
    if (rootValue.isMember("t") && rootValue["t"].isInt()) {
        type = rootValue["t"].asInt();
    }
    switch (type) {
        case static_cast<int>(JsonType::FUNCTION): {
            if (rootValue.isMember("fb") && rootValue["fb"].isObject()) {
                ParseSingleFunc(rootValue, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::RECORD): {
            if (rootValue.isMember("rb") && rootValue["rb"].isObject()) {
                ParseRec(rootValue, prog);
            }
            if (rootValue.isMember("pn") && rootValue["pn"].isString()) {
                std::string packageName = rootValue["pn"].asString();
                SetPackageName(packageName, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::STRING): {
            if (rootValue.isMember("s") && rootValue["s"].isArray()) {
                ParseSingleStr(rootValue, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::LITERALBUFFER): {
            if (rootValue.isMember("lit_arr") && rootValue["lit_arr"].isObject()) {
                ParseSingleLiteralBuf(rootValue, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::MODULE): {
            if (rootValue.isMember("mod") && rootValue["mod"].isObject()) {
                ParseSingleModule(rootValue, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::OPTIONS): {
            ParseOptions(rootValue, prog);
            break;
        }
        case static_cast<int>(JsonType::TYPEINFO): {
            if (rootValue.isMember("ti") && rootValue["ti"].isObject()) {
                ParseSingleTypeInfo(rootValue, prog);
            }
            break;
        }
        case static_cast<int>(JsonType::RECORDNAME): {
            if (rootValue.isMember("rn") && rootValue["rn"].isString()) {
                g_recordName = rootValue["rn"].asString();
            }
            break;
        }
        case static_cast<int>(JsonType::OUTPUTFILENAME): {
            if (rootValue.isMember("ofn") && rootValue["ofn"].isString()) {
                g_outputFileName = rootValue["ofn"].asString();
            }
            break;
        }
        case static_cast<int>(JsonType::INPUTJSONFILECONTENT): {
            if (rootValue.isMember("ijfc") && rootValue["ijfc"].isString()) {
                ParseInputJsonFileContent(rootValue, prog);
            }
            break;
        }
        default: {
            std::cerr << "Unreachable json type: " << type << std::endl;
            return RETURN_FAILED;
        }
    }
    return RETURN_SUCCESS;
}

static bool ParseData(const std::string &data, panda::pandasm::Program &prog)
{
    if (data.empty()) {
        std::cerr << "the stringify json is empty" << std::endl;
        return false;
    }

    size_t pos = 0;

    for (size_t idx = 0; idx < data.size(); idx++) {
        if (data[idx] == '$' && (idx == 0 || data[idx - 1] != '#')) {
            if (g_isStartDollar) {
                pos = idx + 1;
                g_isStartDollar = false;
                continue;
            }

            std::string subJson = data.substr(pos, idx - pos);
            ReplaceAllDistinct(subJson, "#$", "$");
            ReplaceAllDistinct(subJson, "#*", "*");
            if (ParseSmallPieceJson(subJson, prog)) {
                std::cerr << "fail to parse stringify json" << std::endl;
                return false;
            }
            g_isStartDollar = true;
        }
    }

    return true;
}

static bool IsStartOrEndPosition(int idx, char *buff, const std::string &data)
{
    if (buff[idx] != '$') {
        return false;
    }

    if (idx == 0 && (data.empty() || data.back() != '#')) {
        return true;
    }

    if (idx != 0 && buff[idx - 1] != '#') {
        return true;
    }

    return false;
}

static bool EmitProgram(const std::string &output, int optLevel, std::string optLogLevel, panda::pandasm::Program &prog)
{
    if (g_isOutputProto) {
        g_compilerOutputProto = output.substr(0, output.find_last_of(".") + 1).append(PROTO_BIN_SUFFIX);
    }
    std::string convertedFilePath = panda::os::file::File::GetExtendedFilePath(output);

#ifdef ENABLE_BYTECODE_OPT
    if (g_optLevel != static_cast<int>(OptLevel::O_LEVEL0) || optLevel != static_cast<int>(OptLevel::O_LEVEL0)) {
        optLogLevel = (optLogLevel != "error") ? optLogLevel : g_optLogLevel;

        if (g_optLogLevel != "error") {
            panda::Logger::ComponentMask mask;
            mask.set(panda::Logger::Component::ASSEMBLER);
            mask.set(panda::Logger::Component::BYTECODE_OPTIMIZER);
            mask.set(panda::Logger::Component::COMPILER);
            panda::Logger::InitializeStdLogging(panda::Logger::LevelFromString(optLogLevel), mask);
        }

        bool emitDebugInfo = true;
        std::map<std::string, size_t> stat;
        std::map<std::string, size_t> *statp = nullptr;
        panda::pandasm::AsmEmitter::PandaFileToPandaAsmMaps maps {};
        panda::pandasm::AsmEmitter::PandaFileToPandaAsmMaps* mapsp = &maps;

        if (!panda::pandasm::AsmEmitter::Emit(convertedFilePath, prog, statp, mapsp, emitDebugInfo)) {
            std::cerr << "Failed to emit binary data: " << panda::pandasm::AsmEmitter::GetLastError() << std::endl;
            return false;
        }

        panda::bytecodeopt::OptimizeBytecode(&prog, mapsp, convertedFilePath, true);

        if (g_compilerOutputProto.size() > 0) {
            panda::proto::ProtobufSnapshotGenerator::GenerateSnapshot(prog, g_compilerOutputProto);
            return true;
        }

        if (!panda::pandasm::AsmEmitter::Emit(convertedFilePath, prog, statp, mapsp, emitDebugInfo)) {
            std::cerr << "Failed to emit binary data: " << panda::pandasm::AsmEmitter::GetLastError() << std::endl;
            return false;
        }
        return true;
    }
#endif
    if (g_compilerOutputProto.size() > 0) {
        panda::proto::ProtobufSnapshotGenerator::GenerateSnapshot(prog, g_compilerOutputProto);
        return true;
    }

    if (!panda::pandasm::AsmEmitter::Emit(convertedFilePath, prog, nullptr)) {
        std::cerr << "Failed to emit binary data: " << panda::pandasm::AsmEmitter::GetLastError() << std::endl;
        return false;
    }

    Logd("Successfully generated: %s\n", output.c_str());
    return true;
}

static bool EmitAndRestoreProgram(panda::pandasm::Program &prog, panda::ts2abc::Options options)
{
    if (!EmitProgram(g_outputFileName, options.GetOptLevelArg(), options.GetOptLogLevelArg(), prog)) {
        std::cerr << "fail to emit porgram " << g_outputFileName << " in HandleBuffer" << std::endl;
        return false;
    }
    prog = panda::pandasm::Program();
    prog.lang = panda::pandasm::extensions::Language::ECMASCRIPT;
    g_newLiteralArrayIndex = -1;
    return true;
}

static bool HandleBuffer(const int &ret, char *buff, std::string &data, panda::pandasm::Program &prog,
                         panda::ts2abc::Options options)
{
    uint32_t startPos = 0;
    if (options.IsMultiProgramsPipe() && ((buff[0] == '*' && data.back() != '#') ||
                                          (buff[0] == '\n' && buff[1] == '*'))) {
        if (!EmitAndRestoreProgram(prog, options)) {
            std::cerr << "fail to emit and restore program" << std::endl;
            return false;
        }
    }

    for (int idx = 0; idx < ret; idx++) {
        if (IsStartOrEndPosition(idx, buff, data)) {
            if (g_isStartDollar) {
                startPos = idx + 1;
                g_isStartDollar = false;
                continue;
            }

            std::string substr(buff + startPos, buff + idx);
            data += substr;
            ReplaceAllDistinct(data, "#$", "$");
            ReplaceAllDistinct(data, "#*", "*");
            if (ParseSmallPieceJson(data, prog)) {
                std::cerr << "fail to parse stringify json" << std::endl;
                return false;
            }
            g_isStartDollar = true;
            // clear data after parsing
            data.clear();
            // idx: $, then idx + 1:'\n', so comparing buff[idx + 2] with '*'
            if (options.IsMultiProgramsPipe() && idx < ret - 2 && buff[idx + 2] == '*' &&
                !EmitAndRestoreProgram(prog, options)) {
                std::cerr << "fail to emit and restore program" << std::endl;
                return false;
            }
        }
    }

    if (!g_isStartDollar) {
        std::string substr(buff + startPos, buff + ret);
        data += substr;
    }

    return true;
}

static bool ReadFromPipe(panda::pandasm::Program &prog, panda::ts2abc::Options options)
{
    std::string data;
    const size_t bufSize = 4096;
    // the parent process open a pipe to this child process with fd of 3
    const size_t fd = 3;

    char buff[bufSize + 1];
    int ret = 0;

    while ((ret = read(fd, buff, bufSize)) != 0) {
        if (ret < 0) {
            std::cerr << "Read pipe error" << std::endl;
            return false;
        }
        buff[ret] = '\0';

        if (!HandleBuffer(ret, buff, data, prog, options)) {
            std::cerr << "fail to handle buffer" << std::endl;
            return false;
        }
    }

    Logd("finish parsing from pipe");
    return true;
}

bool GenerateProgramsFromPipe(panda::ts2abc::Options options)
{
    panda::pandasm::Program prog = panda::pandasm::Program();
    prog.lang = panda::pandasm::extensions::Language::ECMASCRIPT;

    if (!ReadFromPipe(prog, options)) {
        std::cerr << "fail to parse programs from Pipe!" << std::endl;
        return false;
    }

    return true;
}

bool GenerateProgram([[maybe_unused]] const std::string &data, const std::string &output,
                     panda::ts2abc::Options options)
{
    bool isParsingFromPipe = options.GetCompileByPipeArg();
    int optLevel = options.GetOptLevelArg();
    std::string optLogLevel = options.GetOptLogLevelArg();
    panda::pandasm::Program prog = panda::pandasm::Program();
    prog.lang = panda::pandasm::extensions::Language::ECMASCRIPT;

    if (isParsingFromPipe) {
        if (!ReadFromPipe(prog, options)) {
            std::cerr << "fail to parse Pipe!" << std::endl;
            return false;
        }
    } else {
        if (!ParseData(data, prog)) {
            std::cerr << "fail to parse Data!" << std::endl;
            return false;
        }
    }

    Logd("parsing done, calling pandasm\n");

    return EmitProgram(output, optLevel, optLogLevel, prog);
}

bool CompileNpmEntries(const std::string &input, const std::string &output)
{
    auto inputAbs = panda::os::file::File::GetAbsolutePath(input);
    if (!inputAbs) {
        std::cerr << "Input file does not exist" << std::endl;
        return false;
    }
    auto fpath = inputAbs.Value();
    if (panda::os::file::File::IsRegularFile(fpath) == false) {
        std::cerr << "Input: " << fpath << " must be either a regular file or a directory" << std::endl;
        return false;
    }

    std::stringstream ss;
    std::ifstream inputStream(panda::os::file::File::GetExtendedFilePath(input));
    if (inputStream.fail()) {
        std::cerr << "Failed to read file to buffer: " << input << std::endl;
        return false;
    }
    ss << inputStream.rdbuf();

    panda::pandasm::Program prog = panda::pandasm::Program();
    prog.lang = LANG_EXT;

    std::string line;
    while (getline(ss, line)) {
        std::size_t pos = line.find(":");
        std::string recordName = line.substr(0, pos);
        std::string field = line.substr(pos + 1);

        auto langExt = LANG_EXT;
        auto entryNameField = panda::pandasm::Field(langExt);
        entryNameField.name = field;
        entryNameField.type = panda::pandasm::Type("u8", 0);
        entryNameField.metadata->SetValue(panda::pandasm::ScalarValue::Create<panda::pandasm::Value::Type::U8>(
            static_cast<bool>(0)));

        panda::pandasm::Record entryRecord = panda::pandasm::Record(recordName, langExt);
        entryRecord.field_list.emplace_back(std::move(entryNameField));
        prog.record_table.emplace(recordName, std::move(entryRecord));
    }

    panda::proto::ProtobufSnapshotGenerator::GenerateSnapshot(prog, output);
    return true;
}

bool HandleJsonFile(const std::string &input, std::string &data)
{
    auto inputAbs = panda::os::file::File::GetAbsolutePath(input);
    if (!inputAbs) {
        std::cerr << "Input file does not exist" << std::endl;
        return false;
    }
    auto fpath = inputAbs.Value();
    if (panda::os::file::File::IsRegularFile(fpath) == false) {
        std::cerr << "Input must be either a regular file or a directory" << std::endl;
        return false;
    }

    std::ifstream file;
    file.open(panda::os::file::File::GetExtendedFilePath(fpath));
    if (file.fail()) {
        std::cerr << "failed to open:" << fpath << std::endl;
        return false;
    }

    file.seekg(0, std::ios::end);
    int64_t fileSize = file.tellg();
    if (fileSize == -1) {
        std::cerr << "failed to get position in input sequence: " << fpath << std::endl;
        return false;
    }
    file.seekg(0, std::ios::beg);
    auto buf = std::vector<char>(fileSize);
    file.read(reinterpret_cast<char *>(buf.data()), fileSize);
    data = buf.data();
    buf.clear();
    file.close();

    return true;
}

} // namespace panda::ts2abc
