/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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

#include "metaProperty.h"

#include <compiler/core/pandagen.h>
#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void MetaProperty::Iterate([[maybe_unused]] const NodeTraverser &cb) const {}

void MetaProperty::Dump(ir::AstDumper *dumper) const
{
    const char *kind = nullptr;

    switch (kind_) {
        case MetaPropertyKind::NEW_TARGET: {
            kind = "new.Target";
            break;
        }
        case MetaPropertyKind::IMPORT_META: {
            kind = "import.Meta";
            break;
        }
        default: {
            UNREACHABLE();
        }
    }

    dumper->Add({{"type", "MetaProperty"}, {"kind", kind}});
}

void MetaProperty::Compile(compiler::PandaGen *pg) const
{
    if (kind_ == ir::MetaProperty::MetaPropertyKind::NEW_TARGET) {
        pg->GetNewTarget(this);
        return;
    }

    if (kind_ == ir::MetaProperty::MetaPropertyKind::IMPORT_META) {
        // TODO()
        pg->Unimplemented();
    }
}

checker::Type *MetaProperty::Check(checker::Checker *checker) const
{
    // TODO(aszilagyi)
    return checker->GlobalAnyType();
}

void MetaProperty::UpdateSelf([[maybe_unused]] const NodeUpdater &cb, [[maybe_unused]] binder::Binder *binder) {}

}  // namespace panda::es2panda::ir
