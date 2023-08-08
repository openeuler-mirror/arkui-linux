#!/bin/bash
# Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

script_path=$(cd $(dirname $0);pwd)
code_dir=$(dirname ${script_path})/../

case $(uname -s) in
    Linux)
        host_platform=linux
        ;;
    Darwin)
        host_platform=darwin
        ;;
    *)
        echo "Unsupported host platform: $(uname -s)"
        exit 1
esac

node_js_ver=v12.18.4
node_js_name=node-${node_js_ver}-${host_platform}-x64

cd ${code_dir}/third_party/jsframework/
export PATH=${code_dir}/prebuilts/build-tools/common/nodejs/${node_js_name}/bin:$PATH
npm config set registry https://repo.huaweicloud.com/repository/npm/
npm install

cd ${code_dir}
if [ -d "${code_dir}/prebuilts/build-tools/common/js-framework" ]; then
    echo -e "\n"
    echo "${code_dir}/prebuilts/build-tools/common/js-framework already exist, it will be replaced with node-${node_js_ver}"
    /bin/rm -rf ${code_dir}/prebuilts/build-tools/common/js-framework
    echo -e "\n"
fi

mkdir -p ${code_dir}/prebuilts/build-tools/common/js-framework
/bin/cp -rf ${code_dir}/third_party/jsframework/node_modules ${code_dir}/prebuilts/build-tools/common/js-framework/
