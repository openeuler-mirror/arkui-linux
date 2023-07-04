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

pip3 install -r ${SCRIPT_DIR}/configs/requirements.txt

# Remove out dir
rm -rf ${PROJECT_DIR}/out

# =============================================================================
# System Packages
# =============================================================================
#
# check system packages in current system by calling builder.py

echo -e "\e[36m[-] Prepare system packages...\e[0m"

# Check & Install required system packages
python3 ${PROJECT_DIR}/build/builder.py check --install-packages $*

# =============================================================================
# Prebuild
# =============================================================================
#
# download prebuild files

# install prebuild library
if [ ! -d ${PROJECT_DIR}/prebuilts/libs ]; then
git clone https://gitee.com/yanansong/ft_engine_prebuild.git -b rpms ${PROJECT_DIR}/prebuilts/libs
fi

ARCHNAME=`uname -m`

cd ${PROJECT_DIR}/prebuilts/libs/rpms/${ARCHNAME}
sudo ./installRPM

cd ${PROJECT_DIR}
rm -fr ${PROJECT_DIR}/prebuilts/libs

# install prebuild include. delete download files
if [ ! -d ${PROJECT_DIR}/prebuilts/inc ]; then
git clone https://gitee.com/yanansong/devel_inc.git ${PROJECT_DIR}/prebuilts/inc
fi

# copy include files to /usr/include. delete download files
cd ${PROJECT_DIR}/prebuilts/inc
sudo cp -fr * /usr/local/include
cd ${PROJECT_DIR}
rm -fr ${PROJECT_DIR}/prebuilts/inc

# install ft_surface_wrapper
if [ ! -d ${PROJECT_DIR}/prebuilts/rpm/ft_surface_wrapper ]; then
    git clone https://gitee.com/ShaoboFeng/ft_surface_wrapper.git ${PROJECT_DIR}/prebuilts/rpm/ft_surface_wrapper
fi
cd ${PROJECT_DIR}/prebuilts/rpm/ft_surface_wrapper/
if [ ! -d ${PROJECT_DIR}/prebuilts/rpm/ft_surface_wrapper/build ]; then
    mkdir build
fi

cd build
cmake ..
make -j6
sudo make install
rm -fr ${PROJECT_DIR}/prebuilts/rpm/ft_surface_wrapper
cd ${PROJECT_DIR}

# install mesa_fangtian
if [ ! -d ${PROJECT_DIR}/prebuilts/rpm/binary ]; then
    git clone https://gitee.com/ShaoboFeng/rpm-fangtian.git ${PROJECT_DIR}/prebuilts/rpm/binary
fi
cd ${PROJECT_DIR}/prebuilts/rpm/binary
./install.sh
cd ${PROJECT_DIR}

# copy FT sa file to /usr/local/share/ft/
sudo mkdir -p /usr/local/share/ft
sudo cp -fr ${PROJECT_DIR}/etc/ft.xml /usr/local/share/ft/

# copy config files to /usr/local/share/ft/window_manager
sudo mkdir -p /usr/local/share/ft/window_manager
sudo cp ${PROJECT_DIR}/window_manager/resources/config/other/display_manager_config.xml /usr/local/share/ft/window_manager
sudo cp ${PROJECT_DIR}/window_manager/resources/config/other/window_manager_config.xml /usr/local/share/ft/window_manager

echo -e "\033[32m[*] Pre-build Done. You need exec 'build.sh'.\033[0m"
