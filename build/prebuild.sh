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

pip3 install -r ${SCRIPT_DIR}/configs/requirements.txt

# Remove out dir
rm -rf ${PROJECT_DIR}/out

# prebuilts_download
cd ${PROJECT_DIR}
build/prebuilts_download.sh --skip-ssl

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
cd $home
PREBUILD_DIR="ft_prebuild"
if [ ! -d ${PREBUILD_DIR} ]; then
mkdir ${PREBUILD_DIR}
fi
cd ${PREBUILD_DIR}
FT_PREBUILD_DIR=$(pwd)

# install prebuild library
if [ ! -d ${FT_PREBUILD_DIR}/libs ]; then
git clone https://gitee.com/yanansong/ft_engine_prebuild.git -b rpms ${FT_PREBUILD_DIR}/libs
fi

ARCHNAME=`uname -m`

cd ${FT_PREBUILD_DIR}/libs/rpms/${ARCHNAME}
sudo ./installRPM

# install prebuild include.
if [ ! -d ${FT_PREBUILD_DIR}/inc ]; then
git clone https://gitee.com/yanansong/devel_inc.git ${FT_PREBUILD_DIR}/inc
fi

# copy include files to /usr/include. 
cd ${FT_PREBUILD_DIR}/inc
sudo cp -fr * /usr/local/include

# install prebuild include.
if [ ! -d ${FT_PREBUILD_DIR}/inc_libz ]; then
git clone https://gitee.com/all-seeing-eyes/ace_include.git ${FT_PREBUILD_DIR}/inc_libz
fi

cd ${FT_PREBUILD_DIR}/inc_libz
sudo cp -fr libz /usr/local/include

# install prebuild include.
if [ ! -d ${FT_PREBUILD_DIR}/cjson ]; then
git clone https://gitee.com/src-openeuler/cjson.git ${FT_PREBUILD_DIR}/cjson
cd ${FT_PREBUILD_DIR}/cjson
tar xf v1.7.15.tar.gz
cd cJSON-1.7.15/
mkdir cJSON
cp *.h cJSON
sudo cp -r cJSON /usr/local/include
fi

# =============================================================================
# third_party
# =============================================================================
if [ ! -d ${PROJECT_DIR}/third_party/flutter ]; then
    git clone https://gitee.com/openeuler/ft_flutter.git ${PROJECT_DIR}/third_party/flutter
fi

if [ ! -d ${PROJECT_DIR}/third_party/ft_engine ]; then
    git clone https://gitee.com/openeuler/ft_engine.git ${PROJECT_DIR}/third_party/ft_engine
fi

if [ ! -d /usr/include/ft/wm ]; then
    echo "start build ft_engine"
    cd ${PROJECT_DIR}/third_party/ft_engine
    if [ ! -d ${PROJECT_DIR}/third_party/ft_engine/third_party ]; then
        ./build/prebuild.sh  $*
    fi
    ./build.sh $*
    cd ${PROJECT_DIR}
fi

if [ ! -e /usr/lib64/libace_skia_fangtian.so ]; then
    echo "start build libace_skia_fangtian.so"
    cd ${PROJECT_DIR}/third_party/flutter
    ./project_build/prebuild.sh
    ./build.sh $*
    cd ${PROJECT_DIR}
fi

echo -e "\033[32m[*] Pre-build Done. You need exec 'build.sh'.\033[0m"
