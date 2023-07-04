/**
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "assemblyDebugProto.h"

namespace panda::proto {
void DebuginfoIns::Serialize(const panda::pandasm::debuginfo::Ins &debug, protoPanda::DebuginfoIns &protoDebug)
{
    protoDebug.set_linenumber(debug.line_number);
    protoDebug.set_columnnumber(debug.column_number);
    protoDebug.set_wholeline(debug.whole_line);
    protoDebug.set_boundleft(debug.bound_left);
    protoDebug.set_boundright(debug.bound_right);
}

void DebuginfoIns::Deserialize(const protoPanda::DebuginfoIns &protoDebug, panda::pandasm::debuginfo::Ins &debug)
{
    debug.line_number = protoDebug.linenumber();
    debug.column_number = protoDebug.columnnumber();
    debug.whole_line = protoDebug.wholeline();
    debug.bound_left = protoDebug.boundleft();
    debug.bound_right = protoDebug.boundright();
}

void LocalVariable::Serialize(const panda::pandasm::debuginfo::LocalVariable &debug,
                              protoPanda::LocalVariable &protoDebug)
{
    protoDebug.set_name(debug.name);
    protoDebug.set_signature(debug.signature);
    protoDebug.set_signaturetype(debug.signature_type);
    protoDebug.set_reg(debug.reg);
    protoDebug.set_start(debug.start);
    protoDebug.set_length(debug.length);
}

void LocalVariable::Deserialize(const protoPanda::LocalVariable &protoDebug,
                                panda::pandasm::debuginfo::LocalVariable &debug)
{
    debug.name = protoDebug.name();
    debug.signature = protoDebug.signature();
    debug.signature_type = protoDebug.signaturetype();
    debug.reg = protoDebug.reg();
    debug.start = protoDebug.start();
    debug.length = protoDebug.length();
}
} // panda::proto
