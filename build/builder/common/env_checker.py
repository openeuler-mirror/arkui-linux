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

import toml

from builder.common.logger import logger
from builder.common.utils import exec_sys_command
from builder.common.prebuild import build_deps

class Checker:
    """
    Checker is a singleton.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        with open('/etc/os-release', 'r') as f:
            for line in f:
                if line.startswith('ID='):
                    self.os_id = line.split('=')[1].strip().strip('"').lower()
                elif line.startswith('VERSION_ID='):
                    self.os_version = line.split('=')[1].strip().strip('"')

    def _is_package_installed(self, pkg: str) -> bool:
        is_success, output = exec_sys_command(['rpm', '-q', pkg], is_show_output=False)

        if output:
            return is_success
        else:
            return False

    def _install_packages(self, pkgs: list) -> bool:
        logger.info('Try install system packages: {} ...'.format(', '.join(pkgs)))
        is_success, _output = exec_sys_command(['sudo', 'yum', 'install', '-y'] + pkgs)
        return is_success

    def check_system_env(self, project_dir: str, install_missing_pkg: bool = False) -> bool:
        import os

        logger.info('Checking system environment...')

        # Open config file
        config_path = os.path.join(project_dir, 'build', 'configs', 'system_deps.toml')
        with open(config_path, 'r') as f:
            configs = toml.load(f)

        # Check os version
        if self.os_id in configs['dependencies']['supported_os'] and self.os_version in configs['dependencies'][self.os_id]['supported_version']:
            logger.debug(f'Current OS: {self.os_id} {self.os_version}')
        else:
            logger.error(f'Unsupported OS: {self.os_id} {self.os_version}')
            return False

        # Check packages
        package_deps = configs.get(self.os_id, {}).get(self.os_version, {}).get('package_deps', [])
        if package_deps is None:
            logger.error(f'No package_deps config for {self.os_id} {self.os_version} in {config_path}')
            return False

        missing_packages = []
        for pkg in package_deps:
            if not self._is_package_installed(pkg):
                missing_packages.append(pkg)

        if missing_packages == []:
            build_deps(os.path.join(project_dir, "out", "prebuild"))
            return True
        elif install_missing_pkg:
            ret = self._install_packages(missing_packages)
            if ret:
                build_deps(os.path.join(project_dir, "out", "prebuild"))
            return ret
        else:
            logger.error('System package "{}" is not installed. Please install them by using `yum install` or `dnf install`'.format(', '.join(missing_packages)))
            return False

checker = Checker()
