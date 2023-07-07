/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { paramMock } from "../utils"

export function mockDistributedAccount() {
  const distributedInfoMock = {
    name: "[PC Preview] unknown name",
    id: "[PC Preview] unknown id",
    event: "[PC Preview] unknown event",
    scalableData: "[PC Preview] unknown scalableData"
  }
  const distributedAccountAbilityMock = {
    queryOsAccountDistributedInfo: function (...args) {
      console.warn("DistributedAccountAbility.queryOsAccountDistributedInfo interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, distributedInfoMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(distributedInfoMock);
        })
      }
    },
    updateOsAccountDistributedInfo: function (...args) {
      console.warn("DistributedAccountAbility.updateOsAccountDistributedInfo interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    }
  };
  const distributedAccount = {
    getDistributedAccountAbility: function (...args) {
      console.warn("distributedAccount.getDistributedAccountAbility interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return distributedAccountAbilityMock;
    }
  }
  return distributedAccount;
}