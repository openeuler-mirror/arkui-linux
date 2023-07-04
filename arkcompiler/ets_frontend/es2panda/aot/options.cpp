/*
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

#include "options.h"

#include "mergeProgram.h"
#include "os/file.h"
#include <util/helpers.h>
#include <utils/pandargs.h>
#if defined(PANDA_TARGET_WINDOWS)
#include <io.h>
#else
#include <dirent.h>
#endif

#include <fstream>
#include <sstream>
#include <utility>

namespace panda::es2panda::aot {
constexpr char PROCESS_AS_LIST_MARK = '@';
const std::string LIST_ITEM_SEPERATOR = ";";

template <class T>
T RemoveExtension(T const &filename)
{
    typename T::size_type const P(filename.find_last_of('.'));
    return P > 0 && P != T::npos ? filename.substr(0, P) : filename;
}

static std::vector<std::string> GetStringItems(std::string &input, const std::string &delimiter)
{
    std::vector<std::string> items;
    size_t pos = 0;
    std::string token;
    while ((pos = input.find(delimiter)) != std::string::npos) {
        token = input.substr(0, pos);
        if (!token.empty()) {
            items.push_back(token);
        }
        input.erase(0, pos + delimiter.length());
    }
    if (!input.empty()) {
        items.push_back(input);
    }
    return items;
}

// Options
bool Options::CollectInputFilesFromFileList(const std::string &input)
{
    std::ifstream ifs;
    std::string line;
    ifs.open(panda::os::file::File::GetExtendedFilePath(input));
    if (!ifs.is_open()) {
        std::cerr << "Failed to open source list: " << input << std::endl;
        return false;
    }

    constexpr size_t ITEM_COUNT_MERGE = 5;  // item list: [filePath; recordName; moduleKind; sourceFile, pkgName]
    constexpr size_t ITEM_COUNT_NOT_MERGE = 5;  // item list: [filePath; recordName; moduleKind; sourceFile; outputfile]
    while (std::getline(ifs, line)) {
        std::vector<std::string> itemList = GetStringItems(line, LIST_ITEM_SEPERATOR);
        if ((compilerOptions_.mergeAbc && itemList.size() != ITEM_COUNT_MERGE) ||
            (!compilerOptions_.mergeAbc && itemList.size() != ITEM_COUNT_NOT_MERGE)) {
            std::cerr << "Failed to parse input file" << std::endl;
            return false;
        }

        std::string fileName = itemList[0];
        std::string recordName = compilerOptions_.mergeAbc ? itemList[1] : "";
        parser::ScriptKind scriptKind;
        if (itemList[2] == "script") {
            scriptKind = parser::ScriptKind::SCRIPT;
        } else if (itemList[2] == "commonjs") {
            scriptKind = parser::ScriptKind::COMMONJS;
        } else {
            scriptKind = parser::ScriptKind::MODULE;
        }

        es2panda::SourceFile src(fileName, recordName, scriptKind);
        src.sourcefile = itemList[3];
        if (compilerOptions_.mergeAbc) {
            src.pkgName = itemList[4];
        }

        sourceFiles_.push_back(src);
        if (!compilerOptions_.mergeAbc) {
            outputFiles_.insert({fileName, itemList[4]});
        }
    }
    return true;
}

bool Options::CollectInputFilesFromFileDirectory(const std::string &input, const std::string &extension)
{
    std::vector<std::string> files;
    if (!proto::MergeProgram::GetProtoFiles(input, extension, files)) {
        return false;
    }
    for (auto &f : files) {
        es2panda::SourceFile src(f, util::Helpers::BaseName(f), scriptKind_);
        sourceFiles_.push_back(src);
    }

    return true;
}

void Options::ParseCacheFileOption(const std::string &cacheInput)
{
    if (cacheInput[0] != PROCESS_AS_LIST_MARK) {
        compilerOptions_.cacheFiles.insert({sourceFile_, cacheInput});
        return;
    }

    std::ifstream ifs;
    std::string line;
    ifs.open(panda::os::file::File::GetExtendedFilePath(cacheInput.substr(1)));
    if (!ifs.is_open()) {
        std::cerr << "Failed to open cache file list: " << cacheInput << std::endl;
        return;
    }

    constexpr int cacheListItemCount = 2;
    while (std::getline(ifs, line)) {
        std::vector<std::string> itemList = GetStringItems(line, LIST_ITEM_SEPERATOR);
        if (itemList.size() != cacheListItemCount) {
            continue;
        }
        compilerOptions_.cacheFiles.insert({itemList[0], itemList[1]});
    }
}

Options::Options() : argparser_(new panda::PandArgParser()) {}

Options::~Options()
{
    delete argparser_;
}

bool Options::Parse(int argc, const char **argv)
{
    panda::PandArg<bool> opHelp("help", false, "Print this message and exit");

    // parser
    panda::PandArg<std::string> inputExtension("extension", "js",
                                               "Parse the input as the given extension (options: js | ts | as)");
    panda::PandArg<bool> opModule("module", false, "Parse the input as module");
    panda::PandArg<bool> opCommonjs("commonjs", false, "Parse the input as commonjs");
    panda::PandArg<bool> opParseOnly("parse-only", false, "Parse the input only");
    panda::PandArg<bool> opEnableTypeCheck("enable-type-check", false, "Check the type in ts after parse");
    panda::PandArg<bool> opDumpAst("dump-ast", false, "Dump the parsed AST");

    // type extractor
    panda::PandArg<bool> opTypeExtractor("type-extractor", false, "Enable type extractor for typescript");
    panda::PandArg<bool> opTypeDtsBuiltin("type-dts-builtin", false, "Enable builtin type extractor for .d.ts file");

    // compiler
    panda::PandArg<bool> opDumpAssembly("dump-assembly", false, "Dump pandasm");
    panda::PandArg<bool> opDebugInfo("debug-info", false, "Compile with debug info");
    panda::PandArg<bool> opDumpDebugInfo("dump-debug-info", false, "Dump debug info");
    panda::PandArg<int> opOptLevel("opt-level", 2,
        "Compiler optimization level (options: 0 | 1 | 2). In debug and base64Input mode, optimizer is disabled");
    panda::PandArg<int> opFunctionThreadCount("function-threads", 0, "Number of worker threads to compile function");
    panda::PandArg<int> opFileThreadCount("file-threads", 0, "Number of worker threads to compile file");
    panda::PandArg<bool> opSizeStat("dump-size-stat", false, "Dump size statistics");
    panda::PandArg<bool> opDumpLiteralBuffer("dump-literal-buffer", false, "Dump literal buffer");
    panda::PandArg<std::string> outputFile("output", "", "Compiler binary output (.abc)");
    panda::PandArg<std::string> recordName("record-name", "", "Specify the record name");
    panda::PandArg<bool> debuggerEvaluateExpression("debugger-evaluate-expression", false,
                                                    "evaluate expression in debugger mode");
    panda::PandArg<std::string> base64Input("base64Input", "", "base64 input of js content");
    panda::PandArg<bool> base64Output("base64Output", false, "output panda file content as base64 to std out");
    panda::PandArg<std::string> sourceFile("source-file", "",
                                           "specify the file path info recorded in generated abc");
    panda::PandArg<std::string> outputProto("outputProto", "",
                                            "specify the output name for serializd protobuf file (.protoBin)");
    panda::PandArg<std::string> opCacheFile("cache-file", "", "cache file for incremental compile");
    panda::PandArg<std::string> opNpmModuleEntryList("npm-module-entry-list", "", "entry list file for module compile");
    panda::PandArg<bool> opMergeAbc("merge-abc", false, "Compile as merge abc");

    // hotfix && hotreload
    panda::PandArg<std::string> opDumpSymbolTable("dump-symbol-table", "", "dump symbol table to file");
    panda::PandArg<std::string> opInputSymbolTable("input-symbol-table", "", "input symbol table file");
    panda::PandArg<bool> opGeneratePatch("generate-patch", false, "generate patch abc");
    panda::PandArg<bool> opHotReload("hot-reload", false, "compile as hot-reload mode");

    // version
    panda::PandArg<bool> bcVersion("bc-version", false, "Print ark bytecode version");
    panda::PandArg<bool> bcMinVersion("bc-min-version", false, "Print ark bytecode minimum supported version");

    // tail arguments
    panda::PandArg<std::string> inputFile("input", "", "input file");

    argparser_->Add(&opHelp);
    argparser_->Add(&opModule);
    argparser_->Add(&opCommonjs);
    argparser_->Add(&opDumpAst);
    argparser_->Add(&opParseOnly);
    argparser_->Add(&opEnableTypeCheck);
    argparser_->Add(&opTypeExtractor);
    argparser_->Add(&opTypeDtsBuiltin);
    argparser_->Add(&opDumpAssembly);
    argparser_->Add(&opDebugInfo);
    argparser_->Add(&opDumpDebugInfo);
    argparser_->Add(&debuggerEvaluateExpression);
    argparser_->Add(&base64Input);
    argparser_->Add(&base64Output);

    argparser_->Add(&opOptLevel);
    argparser_->Add(&opFunctionThreadCount);
    argparser_->Add(&opFileThreadCount);
    argparser_->Add(&opSizeStat);
    argparser_->Add(&opDumpLiteralBuffer);

    argparser_->Add(&inputExtension);
    argparser_->Add(&outputFile);
    argparser_->Add(&sourceFile);
    argparser_->Add(&recordName);
    argparser_->Add(&outputProto);
    argparser_->Add(&opCacheFile);
    argparser_->Add(&opNpmModuleEntryList);
    argparser_->Add(&opMergeAbc);

    argparser_->Add(&opDumpSymbolTable);
    argparser_->Add(&opInputSymbolTable);
    argparser_->Add(&opGeneratePatch);
    argparser_->Add(&opHotReload);

    argparser_->Add(&bcVersion);
    argparser_->Add(&bcMinVersion);

    argparser_->PushBackTail(&inputFile);
    argparser_->EnableTail();
    argparser_->EnableRemainder();

    bool parseStatus = argparser_->Parse(argc, argv);

    if (parseStatus && (bcVersion.GetValue() || bcMinVersion.GetValue())) {
        compilerOptions_.bcVersion = bcVersion.GetValue();
        compilerOptions_.bcMinVersion = bcMinVersion.GetValue();
        return true;
    }

    if (!parseStatus || opHelp.GetValue() || (inputFile.GetValue().empty() && base64Input.GetValue().empty())) {
        std::stringstream ss;

        ss << argparser_->GetErrorString() << std::endl;
        ss << "Usage: "
           << "es2panda"
           << " [OPTIONS] [input file] -- [arguments]" << std::endl;
        ss << std::endl;
        ss << "optional arguments:" << std::endl;
        ss << argparser_->GetHelpString() << std::endl;

        errorMsg_ = ss.str();
        return false;
    }

    bool inputIsEmpty = inputFile.GetValue().empty();
    bool base64InputIsEmpty = base64Input.GetValue().empty();
    bool outputIsEmpty = outputFile.GetValue().empty();

    if (!inputIsEmpty && !base64InputIsEmpty) {
        errorMsg_ = "--input and --base64Input can not be used simultaneously";
        return false;
    }

    if (!outputIsEmpty && base64Output.GetValue()) {
        errorMsg_ = "--output and --base64Output can not be used simultaneously";
        return false;
    }

    if (opModule.GetValue() && opCommonjs.GetValue()) {
        errorMsg_ = "[--module] and [--commonjs] can not be used simultaneously";
        return false;
    }

    if (opModule.GetValue()) {
        scriptKind_ = es2panda::parser::ScriptKind::MODULE;
    } else if (opCommonjs.GetValue()) {
        scriptKind_ = es2panda::parser::ScriptKind::COMMONJS;
    } else {
        scriptKind_ = es2panda::parser::ScriptKind::SCRIPT;
    }

    auto parseTypeExtractor = [&opTypeExtractor, &opTypeDtsBuiltin, this]() {
        compilerOptions_.typeExtractor = opTypeExtractor.GetValue();
        if (compilerOptions_.typeExtractor) {
            compilerOptions_.typeDtsBuiltin = opTypeDtsBuiltin.GetValue();
#ifndef NDEBUG
            std::cout << "[LOG]TypeExtractor is enabled, type-dts-builtin: " <<
                compilerOptions_.typeDtsBuiltin << std::endl;
#endif
        }
    };

    std::string extension = inputExtension.GetValue();
    if (!extension.empty()) {
        if (extension == "js") {
            extension_ = es2panda::ScriptExtension::JS;
        } else if (extension == "ts") {
            extension_ = es2panda::ScriptExtension::TS;
            // Type Extractor is only enabled for TypeScript
            parseTypeExtractor();
        } else if (extension == "as") {
            extension_ = es2panda::ScriptExtension::AS;
        } else {
            errorMsg_ = "Invalid extension (available options: js, ts, as)";
            return false;
        }
    }

    bool isInputFileList = false;
    if (!inputIsEmpty) {
        std::string rawInput = inputFile.GetValue();
        isInputFileList = rawInput[0] == PROCESS_AS_LIST_MARK;
        std::string input = isInputFileList ? rawInput.substr(1) : rawInput;
        sourceFile_ = input;
    }

    if (base64Output.GetValue()) {
        compilerOutput_ = "";
    } else if (!outputIsEmpty) {
        compilerOutput_ = outputFile.GetValue();
    } else if (outputIsEmpty && !inputIsEmpty) {
        compilerOutput_ = RemoveExtension(util::Helpers::BaseName(sourceFile_)).append(".abc");
    }

    if (opMergeAbc.GetValue()) {
        recordName_ = recordName.GetValue();
        if (recordName_.empty()) {
            recordName_ = compilerOutput_.empty() ? "Base64Output" :
                RemoveExtension(util::Helpers::BaseName(compilerOutput_));
        }
        compilerOptions_.mergeAbc = opMergeAbc.GetValue();
    }

    if (!inputIsEmpty) {
        // common mode
        auto inputAbs = panda::os::file::File::GetAbsolutePath(sourceFile_);
        if (!inputAbs) {
            std::cerr << "Failed to find: " << sourceFile_ << std::endl;
            return false;
        }

        auto fpath = inputAbs.Value();
        if (isInputFileList) {
            CollectInputFilesFromFileList(fpath);
        } else if (panda::os::file::File::IsDirectory(fpath)) {
            CollectInputFilesFromFileDirectory(fpath, extension);
        } else {
            es2panda::SourceFile src(sourceFile_, recordName_, scriptKind_);
            sourceFiles_.push_back(src);
        }
    } else if (!base64InputIsEmpty) {
        // input content is base64 string
        base64Input_ = ExtractContentFromBase64Input(base64Input.GetValue());
        if (base64Input_.empty()) {
            errorMsg_ = "The input string is not a valid base64 data";
            return false;
        }

        es2panda::SourceFile src("", recordName_, es2panda::parser::ScriptKind::SCRIPT);
        src.source = base64Input_;
        sourceFiles_.push_back(src);
    }

    if (!outputProto.GetValue().empty()) {
        compilerProtoOutput_ = outputProto.GetValue();
    }

    optLevel_ = opOptLevel.GetValue();
    functionThreadCount_ = opFunctionThreadCount.GetValue();
    fileThreadCount_ = opFileThreadCount.GetValue();
    npmModuleEntryList_ = opNpmModuleEntryList.GetValue();

    if (!opCacheFile.GetValue().empty()) {
        ParseCacheFileOption(opCacheFile.GetValue());
    }

    if (opParseOnly.GetValue()) {
        options_ |= OptionFlags::PARSE_ONLY;
    }

    if (opSizeStat.GetValue()) {
        options_ |= OptionFlags::SIZE_STAT;
    }

    compilerOptions_.dumpAsm = opDumpAssembly.GetValue();
    compilerOptions_.dumpAst = opDumpAst.GetValue();
    compilerOptions_.dumpDebugInfo = opDumpDebugInfo.GetValue();
    compilerOptions_.isDebug = opDebugInfo.GetValue();
    compilerOptions_.parseOnly = opParseOnly.GetValue();
    compilerOptions_.enableTypeCheck = opEnableTypeCheck.GetValue();
    compilerOptions_.dumpLiteralBuffer = opDumpLiteralBuffer.GetValue();
    compilerOptions_.isDebuggerEvaluateExpressionMode = debuggerEvaluateExpression.GetValue();

    compilerOptions_.extension = extension_;
    compilerOptions_.functionThreadCount = functionThreadCount_;
    compilerOptions_.fileThreadCount = fileThreadCount_;
    compilerOptions_.output = compilerOutput_;
    compilerOptions_.debugInfoSourceFile = sourceFile.GetValue();
    compilerOptions_.optLevel = (compilerOptions_.isDebug || !base64Input.GetValue().empty() ||
        base64Output.GetValue()) ? 0 : opOptLevel.GetValue();
    compilerOptions_.sourceFiles = sourceFiles_;
    compilerOptions_.mergeAbc = opMergeAbc.GetValue();

    compilerOptions_.hotfixOptions.dumpSymbolTable = opDumpSymbolTable.GetValue();
    compilerOptions_.hotfixOptions.symbolTable = opInputSymbolTable.GetValue();
    compilerOptions_.hotfixOptions.generatePatch = opGeneratePatch.GetValue();
    compilerOptions_.hotfixOptions.hotReload = opHotReload.GetValue();

    return true;
}

std::string Options::ExtractContentFromBase64Input(const std::string &inputBase64String)
{
    std::string inputContent = util::Base64Decode(inputBase64String);
    if (inputContent == "") {
        return "";
    }
    bool validBase64Input = util::Base64Encode(inputContent) == inputBase64String;
    if (!validBase64Input) {
        return "";
    }
    return inputContent;
}
}  // namespace panda::es2panda::aot
