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

while getopts "g:t:a:o:d:r:h" arg
do
    case "${arg}" in
        "g")
            GENERATOR=${OPTARG}
        ;;
        "t")
            TEMPLATE=${OPTARG}
        ;;
        "a")
            DATA=${OPTARG}
        ;;
        "o")
            OUTPUT=${OPTARG}
        ;;
        "d")
            OUTDIR=${OPTARG}
        ;;
        "r")
            REQUIRE=${OPTARG}
        ;;
        "h")
            echo "help"
        ;;
    ?)
        echo "unkonw argument"
        exit 1
        ;;
    esac
done

if [ ! -d "${OUTDIR}" ]; then
    mkdir -p ${OUTDIR}
fi
echo "${GENERATOR} --template ${TEMPLATE} --data ${DATA} --output ${OUTDIR}/${OUTPUT} --require ${REQUIRE}"
${GENERATOR} --template ${TEMPLATE} --data ${DATA} --output ${OUTDIR}/${OUTPUT} --require ${REQUIRE}
