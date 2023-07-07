/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Page from '../page/index';

/**
 * This class defines the map for the page instances.
 */
export class PageLinkedMap {
  public _map: Page[];

  constructor() {
    this._map = [];
  }

  public unshift(instance: Page) {
    this._map.unshift(instance);
    Object.defineProperty(this, instance.id, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return proxyGet(this, instance.id);
      }
    });
  }

  public push(instance: Page) {
    this._map.push(instance);
    Object.defineProperty(this, instance.id, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return proxyGet(this, instance.id);
      }
    });
  }

  public remove(instance: Page) {
    const index = this._map.indexOf(instance);
    delete this[instance.id];
    // @ts-ignore
    delete this._map.splice(index, 1);
  }

  public getTop(packageName: string) {
    const appMap = this._map.filter(instance => {
      return instance.packageName === packageName;
    });
    return appMap && appMap[appMap.length - 1];
  }
}

function proxyGet(pageLinkedMap: PageLinkedMap, id: string) {
  const index = pageLinkedMap._map.map(instance => instance.id).lastIndexOf(id);
  return pageLinkedMap._map[index];
}

export const pageMap: PageLinkedMap = new PageLinkedMap();

export const appMap = {};
