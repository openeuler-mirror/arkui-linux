#!/bin/bash
# Copyright (c) 2021 Huawei Device Co., Ltd.
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
ts2panda_dir=$(dirname ${script_path})
code_dir=${ts2panda_dir}/../../..

nodejs_dir=$1

cd ${ts2panda_dir}
export PATH=${nodejs_dir}:$PATH
npm config set registry http://repo.huaweicloud.com/repository/npm/
if [ "X${SKIP_SSL}" == "XYES" ];then
    npm config set strict-ssl false
fi
npm cache clean -f
npm install

cd ${code_dir}
if [ -d "${code_dir}/prebuilts/build-tools/common/ts2abc" ]; then
    echo -e "\n"
    echo "${code_dir}/prebuilts/build-tools/common/ts2abc already exist, it will be replaced"
    /bin/rm -rf ${code_dir}/prebuilts/build-tools/common/ts2abc
    echo -e "\n"
fi

mkdir -p ${code_dir}/prebuilts/build-tools/common/ts2abc
/bin/cp -rf ${code_dir}/arkcompiler/ets_frontend/ts2panda/node_modules ${code_dir}/prebuilts/build-tools/common/ts2abc/ || echo "skip copying due to other thread"
