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

#include "assemblyFileLocationProto.h"

namespace panda::proto {
void FileLocation::Serialize(const panda::pandasm::FileLocation &location, protoPanda::FileLocation &protoLocation)
{
    protoLocation.set_wholeline(location.whole_line);
    protoLocation.set_boundleft(location.bound_left);
    protoLocation.set_boundright(location.bound_right);
    protoLocation.set_linenumber(location.line_number);
    protoLocation.set_isdefined(location.is_defined);
}

void FileLocation::Deserialize(const protoPanda::FileLocation &protoLocation,
                               std::optional<panda::pandasm::FileLocation> &location)
{
    std::string wholeLine = protoLocation.wholeline();
    panda::pandasm::FileLocation fileLocation(wholeLine, protoLocation.boundleft(), protoLocation.boundright(),
                                              protoLocation.linenumber(), protoLocation.isdefined());
    location = fileLocation;
}
} // panda::proto
