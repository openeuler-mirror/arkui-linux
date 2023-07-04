#!/usr/bin/env python3
# Copyright (c) 2023 Huawei Technologies Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os

from builder.common.logger import logger
from builder.common.utils import exec_sys_command

_EXCLUDE_DIRS = ["out", "prebuilts", "third_party"]
_C_CPP_EXTS = [".c", ".cc", ".cxx", ".cpp", ".h", ".hpp"]
_GN_EXTS = [".gn", ".gni"]

class Formatter:
    def __init__(self, args):
        self.args = args

        self.clang_format_cmds = ['clang-format', '-i', '-style=file', '-fallback-style=none']
        self.gn_format_cmds = [self.args.gn_path, 'format']

        # Init exclude dirs
        self.exclude_dirs = []
        for dir in _EXCLUDE_DIRS:
            self.exclude_dirs.append(os.path.join(self.args.project_dir, dir))

        # Init target code path
        if self.args.code_path is None:
            self.code_path = self.args.project_dir
        else:
            self.code_path = os.path.abspath(self.code_path)

    def _is_subpath(self, path, parent_paths) -> bool:
        path = os.path.abspath(path)

        return any(os.path.commonpath([path, p]) == p for p in parent_paths)

    def pre_format(self) -> bool:
        if self.args.verbose:
            self.clang_format_cmds.append("-verbose")

        return True

    def _do_format(self, abs_file_name: str, exts: list, format_cmds: list) -> bool:
        should_format = False
        for ext in exts:
            if abs_file_name.endswith(ext):
                should_format = True
                break

        if should_format:
            cmds = format_cmds + [abs_file_name]
            rst, _ = exec_sys_command(cmds) # do format
            if not rst:
                return False

        return True

    def do_format(self) -> bool:
        logger.info(f"Start format files in {self.code_path}...")

        for [dirpath, _, filenames] in os.walk(self.code_path):
            # Escape some dirs
            if self._is_subpath(dirpath, self.exclude_dirs):
                logger.debug(f"Escape dir: {dirpath}")
                continue

            # Find all files and try to format them
            for filename in filenames:
                abs_file_name = os.path.join(dirpath, filename)
                # try to do clang format
                if not self._do_format(abs_file_name, _C_CPP_EXTS, self.clang_format_cmds):
                    logger.error(f"Failed to format C/C++ file: {abs_file_name}")
                    return False
                # try to do gn format
                if not self._do_format(abs_file_name, _GN_EXTS, self.gn_format_cmds):
                    logger.error(f"Failed to format GN file: {abs_file_name}")
                    return False

        return True

    def exec_command(self) -> bool:
        logger.info(f'Exec "format" command...')

        if not self.pre_format():
            return False

        return self.do_format()

