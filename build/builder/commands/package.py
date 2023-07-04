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

import sys
import os
import toml
import re
from typing import Any

from builder.common.logger import logger
from builder.common.utils import exec_sys_command

class Packager:
    def __init__(self, args):
        self.args = args
        self.configs_dir = os.path.join(self.args.project_dir, "build/configs")

    def prepare(self) -> bool:
        # Try to make output dir
        if not os.path.exists(self.args.output):
            exec_sys_command(['mkdir', '-p', self.args.output], True)

        # Generate Toml file
        with open(os.path.join(self.configs_dir, "rpm_config_template.toml"), 'r') as template_file:
            template_data = template_file.read()

        new_toml_data = template_data.replace('<NAME>', self.args.name)

        new_toml_path = os.path.join(self.args.output, f"{self.args.name}_rpm_config.toml")
        with open(new_toml_path, 'w') as new_toml_file:
            new_toml_file.write(new_toml_data)

        logger.info(f"Output toml file: {new_toml_path}")

        return True

    def _gen_spec_file(self, rpm_configs: dict[str, Any]) -> bool:
        # Check args
        if not os.path.exists(self.args.config_file):
            logger.error(f"Config file {self.args.config_file} not found.")
            return False

        if not os.path.exists(self.args.target_dir):
            logger.error(f"Target dir {self.args.config_file} is not exist.")
            return False

        # Generate spec file
        with open(os.path.join(self.configs_dir, "rpm_template.spec"), 'r') as template_file:
            template_data = template_file.read()

        new_spec_data = template_data.replace('<NAME>', rpm_configs['name'])
        new_spec_data = new_spec_data.replace('<VERSION>', rpm_configs['version'])
        new_spec_data = new_spec_data.replace('<RELEASE>', rpm_configs['release'])
        new_spec_data = new_spec_data.replace('<SUMMARY>', rpm_configs['summary'])
        new_spec_data = new_spec_data.replace('<LICENSE>', rpm_configs['license'])
        new_spec_data = new_spec_data.replace('<URL>', rpm_configs['url'])
        new_spec_data = new_spec_data.replace('<BUILD_ARCH>', rpm_configs['build_arch'])
        new_spec_data = new_spec_data.replace('<DESCRIPTION>', rpm_configs['description'])

        paths_set = set()
        mkdir_commands = ""
        copy_commands = ""
        files_scriptlet = ""

        for file, install_path in rpm_configs['install_paths'].items():
            paths_set.add(install_path)

            file_path = os.path.join(self.args.target_dir, file)
            if not os.path.exists(file_path):
                logger.error(f"File {file_path} is not exist.")
                return False
            copy_commands += "cp -pdf %s %%{buildroot}%s\n" % (file_path, install_path)

            files_scriptlet += os.path.join(install_path, os.path.basename(file_path)) + "\n"

        for path in paths_set:
            mkdir_commands += "mkdir -p %%{buildroot}%s\n" % (path)

        new_spec_data = new_spec_data.replace('<MKDIR>', mkdir_commands)
        new_spec_data = new_spec_data.replace('<COPY_FILES>', copy_commands)
        new_spec_data = new_spec_data.replace('<FILES>', files_scriptlet)

        with open(os.path.join(self.args.target_dir, f"{rpm_configs['name']}.spec"), 'w') as spec_file:
            spec_file.write(new_spec_data)

        return True

    def generate(self) -> bool:
        logger.info(f"Do package generate with {self.args.target_dir} {self.args.config_file}")

        # Read config file (TOML)
        with open(self.args.config_file, 'r') as f:
            rpm_configs = toml.load(f)

        # Setup RPM tree
        exec_sys_command("rpmdev-setuptree", False)

        # Generate spec file``
        self._gen_spec_file(rpm_configs)

        # Build rpm package
        rst, output = exec_sys_command(["rpmbuild", "-bb", os.path.join(self.args.target_dir, f"{rpm_configs['name']}.spec")])
        if rst == True:
            output_rpm_file = re.search(r'^Wrote:\s+(.*)$', output, flags=re.MULTILINE)
            if output_rpm_file:
                logger.info(f"RPM package has been generated to : {output_rpm_file.group(1)}")
        else:
            logger.error(f"Failed to exec rpmbuild.")
            return False

        return True

    def exec_command(self) -> bool:
        logger.info(f'Exec "package" command...')

        subcommand = self.args.package_subcommand

        if (subcommand == "prepare"):
            return self.prepare()
        elif (subcommand == "generate"):
            return self.generate()
        else:
            logger.error("Unknow subcommand.")
            sys.exit(1)
