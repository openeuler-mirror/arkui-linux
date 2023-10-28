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

set -e

# =============================================================================
# Python
# =============================================================================
#
# check python3 in current system.
PYTHON_REQUIRED_VERSION="3.9.2"

echo -e "\e[36m[-] Prepare python3 packages...\e[0m"

# Check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "python3 is not installed"
    exit 1
fi
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed"
    exit 1
fi
if ! command -v python &> /dev/null; then
    echo "python is not installed"
    sudo yum install python -y
fi

# Check python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')

# Compare the versions
if [ "$(printf '%s\n' "$PYTHON_REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$PYTHON_REQUIRED_VERSION" ]; then
    echo "The python3 version is $PYTHON_VERSION"
else
    echo "The python3 version is less than $PYTHON_REQUIRED_VERSION"
fi

# Install python packages
SCRIPT_DIR=$(cd $(dirname $0);pwd)
PROJECT_DIR=$(dirname ${SCRIPT_DIR})

# =============================================================================
# System Packages
# =============================================================================
#
# check system packages in current system by calling builder.py

echo -e "\e[36m[-] Prepare system packages...\e[0m"

# Check & Install required system packages
python3 ${PROJECT_DIR}/build/builder.py check --install-packages


# =============================================================================
# Prebuild
# =============================================================================
#
# download prebuild files
cd ${PROJECT_DIR}
build/prebuilts_download.sh --skip-ssl

cd $home
PREBUILD_DIR="ft_prebuild"
if [ ! -d ${PREBUILD_DIR} ]; then
mkdir ${PREBUILD_DIR}
fi
cd ${PREBUILD_DIR}
FT_PREBUILD_DIR=$(pwd)

ARCHNAME=`uname -m`

echo -e "\033[32m[*] Pre-build Done. You need exec 'build.sh'.\033[0m"
