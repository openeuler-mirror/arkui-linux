/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#include "literals.h"

#include <compiler/core/pandagen.h>
#include <ir/base/templateElement.h>
#include <ir/expressions/taggedTemplateExpression.h>
#include <ir/expressions/templateLiteral.h>

namespace panda::es2panda::compiler {

// Literals

void Literals::GetTemplateObject(PandaGen *pg, const ir::TaggedTemplateExpression *lit)
{
    RegScope rs(pg);
    VReg templateArg = pg->AllocReg();
    VReg indexReg = pg->AllocReg();
    VReg rawArr = pg->AllocReg();
    VReg cookedArr = pg->AllocReg();

    const ir::TemplateLiteral *templateLit = lit->Quasi();

    pg->CreateEmptyArray(templateLit);
    pg->StoreAccumulator(templateLit, rawArr);

    pg->CreateEmptyArray(templateLit);
    pg->StoreAccumulator(templateLit, cookedArr);

    size_t elemIndex = 0;

    for (const auto *element : templateLit->Quasis()) {
        pg->LoadAccumulatorInt(element, elemIndex);
        pg->StoreAccumulator(element, indexReg);

        pg->LoadAccumulatorString(element, element->Raw());
        pg->StoreObjByValue(element, rawArr, indexReg);

        pg->LoadAccumulatorString(element, element->Cooked());
        pg->StoreObjByValue(element, cookedArr, indexReg);

        elemIndex++;
    }

    pg->CreateEmptyArray(lit);
    pg->StoreAccumulator(lit, templateArg);

    elemIndex = 0;
    pg->LoadAccumulatorInt(lit, elemIndex);
    pg->StoreAccumulator(lit, indexReg);

    pg->LoadAccumulator(lit, rawArr);
    pg->StoreObjByValue(lit, templateArg, indexReg);

    elemIndex++;
    pg->LoadAccumulatorInt(lit, elemIndex);
    pg->StoreAccumulator(lit, indexReg);

    pg->LoadAccumulator(lit, cookedArr);
    pg->StoreObjByValue(lit, templateArg, indexReg);

    pg->GetTemplateObject(lit, templateArg);
}

}  // namespace panda::es2panda::compiler
