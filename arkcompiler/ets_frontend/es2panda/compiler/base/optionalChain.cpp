/*
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

#include "optionalChain.h"

#include <compiler/core/pandagen.h>

namespace panda::es2panda::compiler {
OptionalChain::OptionalChain(PandaGen *pg, const ir::AstNode *node) : pg_(pg), node_(node), prev_(pg->optionalChain_)
{
    pg_->optionalChain_ = this;
}

OptionalChain::~OptionalChain()
{
    if (label_) {
        pg_->SetLabel(node_, label_);
    }
    pg_->optionalChain_ = prev_;
}

void OptionalChain::CheckNullish(bool optional, compiler::VReg obj)
{
    if (!optional) {
        return;
    }

    if (!label_) {
        label_ = pg_->AllocLabel();
    }

    RegScope rs(pg_);

    auto *notNullish = pg_->AllocLabel();
    auto *nullish = pg_->AllocLabel();

    pg_->LoadConst(node_, Constant::JS_NULL);
    pg_->Condition(node_, lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL, obj, nullish);
    pg_->LoadConst(node_, Constant::JS_UNDEFINED);
    pg_->Condition(node_, lexer::TokenType::PUNCTUATOR_NOT_STRICT_EQUAL, obj, nullish);
    pg_->Branch(node_, notNullish);
    pg_->SetLabel(node_, nullish);

    pg_->LoadConst(node_, compiler::Constant::JS_UNDEFINED);
    pg_->Branch(node_, label_);
    pg_->SetLabel(node_, notNullish);
    pg_->LoadAccumulator(node_, obj);
}

}   // namespace panda::es2panda::compiler
