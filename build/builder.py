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

# This is an entry file: parse subcommand and call releated python script.

import sys
import argparse
import os
from rich.console import Console

from builder.commands.build import Builder
from builder.commands.format import Formatter
from builder.commands.package import Packager
from builder.common.env_checker import checker
from builder.common.logger import logger, LoggerManager

VERSION="0.1.0-rc1"

class FtBuilder:
    def __init__(self):
        self.default_project_dir = os.path.abspath(os.path.dirname(os.path.split(os.path.realpath(__file__))[0]))

    def banner(self) -> str:
        return rf"""     _,---.  ,--.--------.                                  .=-.-.                         ,----.
  .-`.' ,  \/==/,  -   , -\           _..---.  .--.-. .-.-./==/_ / _.-.     _,..---._   ,-.--` , \  .-.,.---.
 /==/_  _.-'\==\.-.  - ,_./         .' .'.-. \/==/ -|/=/  |==|, |.-,.'|   /==/,   -  \ |==|-  _.-` /==/  `   \
/==/-  '..-. `--`|==\- \           /==/- '=' /|==| ,||=| -|==|  |==|, |   |==|   _   _\|==|   `.-.|==|-, .=., |
|==|_ ,    /     |==|_ |           |==|-,   ' |==|- | =/  |==|- |==|- |   |==|  .=.   /==/_ ,    /|==|   '='  /
|==|   .--'      |==|- |           |==|  .=. \|==|,  \/ - |==| ,|==|, |   |==|,|   | -|==|    .-' |==|- ,   .'
|==|-  |         |==|, |           /==/- '=' ,|==|-   ,   /==|- |==|- `-._|==|  '='   /==|_  ,`-._|==|_  . ,'.
/==/   \         /==/ -/          |==|   -   //==/ , _  .'/==/. /==/ - , ,/==|-,   _`//==/ ,     //==/  /\ ,  )
`--`---'         `--`--`          `-._`.___,' `--`..---'  `--`-``--`-----'`-.`.____.' `--`-----`` `--`-`--`--'
                                                                                            version: {VERSION}
"""

    def parse_args(self):
        parser = argparse.ArgumentParser(
            prog='builder.py',
            description="Fangtian builder for OpenEuler OS.",
            epilog='Please submit building issues to https://gitee.com/openeuler-graphics/fangtian_build.')

        parser.add_argument('--project-dir', type=str, help="Specify the project root dir.")
        # parser.add_argument('--enable-logfile', action='store_true', help="Enable saving log to file.")
        parser.add_argument('--version', action='version', version='%(prog)s ' + VERSION)

        subparsers = parser.add_subparsers(dest='subcommand', required=True, help="builder subcommands")
        # Subcommand: build
        build_parser = subparsers.add_parser('build', help='Build the project')
        build_parser.add_argument('-t', '--target-cpu',
                                type=str,
                                choices=['auto', 'x64', 'x86', 'aarch64'],
                                default='auto',
                                help='Specify the target CPU type.')
        build_parser.add_argument('-b', '--build-type',
                                choices=['debug', 'release'],
                                default='debug',
                                help='Specify the build type')
        build_parser.add_argument('-j', '--jobs',
                                type=int,
                                default=4,
                                help='Specify the number of jobs to run simultaneously during building.')
        build_parser.add_argument('--enable-musl',
                                action='store_true',
                                help='Enable musl C lib. if musl is disabled, you\'ll use system C lib.')
        build_parser.add_argument('-cc', '--export-compile-commands',
                                action='store_true',
                                help='Export "compile_commands.json" file.')
        build_parser.add_argument('-v', '--verbose',
                                action='store_true',
                                help='Show all logs.')
        build_parser.add_argument('--escape-build',
                                action='store_true',
                                help='Only do "prebuild" operations.')
        build_parser.add_argument('-l', '--log-level',
                                type=str,
                                choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'FATAL', 'CRITICAL'],
                                default='NOTSET',
                                help='Set log level of builder.')
        build_parser.add_argument('-i', '--install',
                                type=str,
                                default='',
                                nargs='?',
                                const='/usr',
                                help='Install all librarys & binarys to specify dir(default is /usr).')
        # Subcommand: format
        format_parser = subparsers.add_parser('format', help='Format C/C++ & GN files')
        format_parser.add_argument('--code-path',
                                type=str,
                                help='Specify target code path to format.')
        format_parser.add_argument('--gn-path',
                                type=str,
                                default=os.path.join(self.default_project_dir, 'prebuilts/build-tools/linux-x64/bin/gn'),
                                help='Show all format lines.')
        format_parser.add_argument('-v', '--verbose',
                                action='store_true',
                                help='Show all format lines.')

        # Subcommand: check
        check_parser = subparsers.add_parser('check', help='System or project checking')
        check_parser.add_argument('--install-packages',
                                action='store_true',
                                help='Install missing packages.')

        # Subcommand: package
        package_parser = subparsers.add_parser('package', help='Tools for packaging RPM')
        package_subparsers = package_parser.add_subparsers(dest='package_subcommand', required=True, help="builder subcommands")

        package_prepare_parser = package_subparsers.add_parser('prepare', help='Prepare toml file for packaging.')
        package_prepare_parser.add_argument('-o', '--output',
                                type=str,
                                required=True,
                                help='Specify the output dir of toml file.')
        package_prepare_parser.add_argument('-n', '--name',
                                type=str,
                                required=True,
                                help='Specify the package name.')
        build_parser.add_argument('--use-musl',
                                action='store_true',
                                help='Add musl k-v to toml file.')

        # Subcommand: generate
        package_prepare_parser = package_subparsers.add_parser('generate', help='Setup rpm tree & Generate spec file & Build the RPM package.')
        package_prepare_parser.add_argument('--target-dir',
                                type=str,
                                required=True,
                                help='Specify the dir which includes files to be installed.')
        package_prepare_parser.add_argument('--config-file',
                                type=str,
                                required=True,
                                help='Specify the path of toml config file.')

        # Parse args
        self.args = parser.parse_args()

    def _setup_logger(self):
        lm = LoggerManager()
        if self.args.__contains__("log_level") and self.args.log_level:
            lm.setup_level(self.args.log_level)
        else:
            lm.setup_level("NOTSET")

        # if self.args.enable_logfile:
        #     logger.error("Enable log file is not supported yet.")
        #     lm.add_file_logger(os.path.join(self.args.project_dir, "out", "log", "build", "builder.log"))

    def prepare(self):
        if self.args is None:
            Console().print("FtBuiler Inner Error: args is None", style="bold red")

        self._setup_logger()

        if self.args.project_dir is None:
            self.args.project_dir = os.path.abspath(os.path.dirname(os.path.split(os.path.realpath(__file__))[0]))

    def do_subcommand(self) -> bool:
        print(self.banner())

        logger.debug(f"Project dir: {self.args.project_dir}")

        if self.args is None or self.args.subcommand is None:
            return False

        subcommand = self.args.subcommand
        self.args.subcommand = None

        # Do acual subcommand
        rst = False
        if (subcommand == "build"):
            builder = Builder(self.args)
            rst = builder.exec_command()
        elif (subcommand == "format"):
            formatter = Formatter(self.args)
            rst = formatter.exec_command()
        elif (subcommand == "check"):
            rst = checker.check_system_env(self.args.project_dir, install_missing_pkg=self.args.install_packages)
        elif (subcommand == "package"):
            packager = Packager(self.args)
            rst = packager.exec_command()
        else:
            logger.error(f"Unknow subcommand: {subcommand}")
            sys.exit(1)

        # Check subcommand result
        if rst:
            logger.debug(f"{subcommand} done.")
        else:
            logger.error(f"{subcommand} failed!")

        return rst

def main() -> int:
    builder = FtBuilder()
    builder.parse_args()

    console = Console()
    try:
        builder.prepare()

        return 0 if builder.do_subcommand() else 1
    except:
        console.print_exception(show_locals=True)
        return 1

if __name__ == "__main__":
    sys.exit(main())
