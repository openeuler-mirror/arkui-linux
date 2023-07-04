/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#ifndef TS2PANDA_TS2ABC_TS2ABC_OPTIONS_H_
#define TS2PANDA_TS2ABC_TS2ABC_OPTIONS_H_

#include "utils/pandargs.h"

#include <optional>
#include <string>
#include <unordered_set>
#include <vector>

namespace panda::ts2abc {
    class Options {
    public:
        explicit Options(const std::string &exePath) : exe_dir_(GetExeDir(exePath)) {}

        ~Options() = default;

        void AddOptions(PandArgParser *parser)
        {
            parser->Add(&size_stat_arg_);
            parser->Add(&help_arg_);
            parser->Add(&opt_level_arg_);
            parser->Add(&opt_log_level_arg_);
            parser->Add(&bc_version_arg_);
            parser->Add(&bc_min_version_arg_);
            parser->Add(&compile_by_pipe_arg_);
            parser->Add(&compile_npm_entries_);
            parser->Add(&compiler_output_proto_);
            parser->Add(&multi_programs_pipe_);
            parser->EnableTail();
            parser->PushBackTail(&Tail_Arg1_arg_);
            parser->PushBackTail(&Tail_Arg2_arg_);
        }

        bool GetSizeStatArg() const
        {
            return size_stat_arg_.GetValue();
        }

        void SetSizeStatArg(bool value)
        {
            size_stat_arg_.SetValue(value);
        }

        bool WasSetSizeStatArg() const
        {
            return size_stat_arg_.WasSet();
        }

        bool GetHelpArg() const
        {
            return help_arg_.GetValue();
        }

        void SetHelpArg(bool value)
        {
            help_arg_.SetValue(value);
        }

        bool WasSetHelpArg() const
        {
            return help_arg_.WasSet();
        }

        int GetOptLevelArg() const
        {
            return opt_level_arg_.GetValue();
        }

        void SetOptLevelArg(int value)
        {
            opt_level_arg_.SetValue(value);
        }

        bool WasSetOptLevelArg() const
        {
            return opt_level_arg_.WasSet();
        }

        std::string GetOptLogLevelArg() const
        {
            return opt_log_level_arg_.GetValue();
        }

        void SetOptLogLevelArg(std::string value)
        {
            opt_log_level_arg_.SetValue(value);
        }

        bool WasSetOptLogLevelArg() const
        {
            return opt_log_level_arg_.WasSet();
        }

        bool GetBcVersionArg() const
        {
            return bc_version_arg_.GetValue();
        }

        void SetSetBcVersionArg(bool value)
        {
            bc_version_arg_.SetValue(value);
        }

        bool WasBcVersionArg() const
        {
            return bc_version_arg_.WasSet();
        }

        bool GetBcMinVersionArg() const
        {
            return bc_min_version_arg_.GetValue();
        }

        void SetBcMinVersionArg(bool value)
        {
            bc_min_version_arg_.SetValue(value);
        }

        bool WasSetBcMinVersionArg() const
        {
            return bc_min_version_arg_.WasSet();
        }

        bool GetCompileByPipeArg() const
        {
            return compile_by_pipe_arg_.GetValue();
        }

        void SetCompileByPipeArg(bool value)
        {
            compile_by_pipe_arg_.SetValue(value);
        }

        bool WasSetCompileByPipeArg() const
        {
            return compile_by_pipe_arg_.WasSet();
        }

        bool GetCompileNpmEntries() const
        {
            return compile_npm_entries_.GetValue();
        }

        void SetCompileNpmEntries(bool value)
        {
            compile_npm_entries_.SetValue(value);
        }

        bool WasSetCompileNpmEntries() const
        {
            return compile_npm_entries_.WasSet();
        }

        bool IsOutputProto() const
        {
            return compiler_output_proto_.GetValue();
        }

        void SetOutputProto(bool value)
        {
            compiler_output_proto_.SetValue(value);
        }

        bool WasSetOutputProto() const
        {
            return compiler_output_proto_.WasSet();
        }

        bool IsMultiProgramsPipe() const
        {
            return multi_programs_pipe_.GetValue();
        }

        std::string GetTailArg1() const
        {
            return Tail_Arg1_arg_.GetValue();
        }

        void SetTailArg1(std::string value)
        {
            Tail_Arg1_arg_.SetValue(value);
        }

        bool WasSetTailArg1() const
        {
            return Tail_Arg1_arg_.WasSet();
        }

        std::string GetTailArg2() const
        {
            return Tail_Arg2_arg_.GetValue();
        }

        void SetTailArg2(std::string value)
        {
            Tail_Arg2_arg_.SetValue(value);
        }

        bool WasSetTailArg2() const
        {
            return Tail_Arg2_arg_.WasSet();
        }

    private:
        static std::string GetExeDir(const std::string &exePath)
        {
            auto pos = exePath.find_last_of('/');
            return exePath.substr(0, pos);
        }

        std::string exe_dir_;
        panda::PandArg<bool> size_stat_arg_{ "size-stat", false,
                R"(Print panda file size statistic)"};
        panda::PandArg<bool> help_arg_{ "help", false,
                R"(Print this message and exit)"};
        panda::PandArg<int> opt_level_arg_{ "opt-level", 0,
                R"("Optimization level. Possible values: [0, 1, 2]. Default: 0\n"
                "0: no optimizations\n    "
                "1: basic bytecode optimizations, including valueNumber,"
                    "lowering, constantResolver, regAccAllocator\n    "
                "2: (experimental optimizations): Sta/Lda Peephole, "
                    "Movi/Lda Peephole, Register Coalescing")"};
        panda::PandArg<std::string> opt_log_level_arg_{ "opt-log-level", "error",
                R"(Optimization log level. Possible values: "
                   "['error', 'debug', 'info', 'fatal']. Default: 'error' )"};
        panda::PandArg<bool> bc_version_arg_{ "bc-version", false,
                R"(Print ark bytecode version)"};
        panda::PandArg<bool> bc_min_version_arg_{ "bc-min-version", false,
                R"(Print ark bytecode minimum supported version)"};
        panda::PandArg<bool> compile_by_pipe_arg_{ "compile-by-pipe", false,
                R"(Compile a json file that is passed by pipe)"};
        panda::PandArg<bool> compile_npm_entries_{ "compile-npm-entries", false,
                R"(Compile npm entries info into an abc file)"};
        panda::PandArg<bool> compiler_output_proto_{ "output-proto", false,
                R"(Output protoBin file)"};
        panda::PandArg<bool> multi_programs_pipe_{ "multi-programs-pipe", false,
                R"(Genrate programs by single pipe)"};
        panda::PandArg<std::string> Tail_Arg1_arg_{ "ARG_1", "",
                R"(Path to input(json file) or path to output(ark bytecode)"
                  " when 'compile-by-pipe' enabled)"};
        panda::PandArg<std::string> Tail_Arg2_arg_{ "ARG_2", "",
                R"(Path to output(ark bytecode) or ignore when 'compile-by-pipe' enabled)"};
    };
} // namespace panda::ts2abc

#endif // TS2PANDA_TS2ABC_TS2ABC_OPTIONS_H_
