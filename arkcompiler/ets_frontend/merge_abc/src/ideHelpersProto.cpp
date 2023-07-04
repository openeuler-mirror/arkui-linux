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

#include "ideHelpersProto.h"

namespace panda::proto {
void SourceLocation::Serialize(const panda::pandasm::SourceLocation &location,
                               protoPanda::SourceLocation &protoLocation)
{
    auto *protoBegin = protoLocation.mutable_begin();
    SourcePosition::Serialize(location.begin, *protoBegin);
    auto *protoEnd = protoLocation.mutable_end();
    SourcePosition::Serialize(location.end, *protoEnd);
}

void SourceLocation::Deserialize(const protoPanda::SourceLocation &protoLocation,
                                 panda::pandasm::SourceLocation &location)
{
    if (protoLocation.has_begin()) {
        SourcePosition::Deserialize(protoLocation.begin(), location.begin);
    }
    if (protoLocation.has_end()) {
        SourcePosition::Deserialize(protoLocation.end(), location.end);
    }
}

void SourcePosition::Serialize(const panda::pandasm::SourcePosition &position,
                               protoPanda::SourcePosition &protoPosition)
{
    protoPosition.set_line(position.line);
    protoPosition.set_column(position.column);
}

void SourcePosition::Deserialize(const protoPanda::SourcePosition &protoPosition,
                                 panda::pandasm::SourcePosition &position)
{
    position.line = protoPosition.line();
    position.column = protoPosition.column();
}
} // panda::proto
