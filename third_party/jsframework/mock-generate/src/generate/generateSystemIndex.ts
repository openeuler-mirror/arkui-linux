/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

const systemIndexArray: Array<SystemIndexEntity> = [];
const systemNoMockArray = ['system.app', 'system.configuration', 'system.device',
  'system.mediaquery', 'system.prompt', 'system.router'];

export function addToSystemIndexArray(systemIndexEntity: SystemIndexEntity) {
  systemIndexArray.push(systemIndexEntity);
}

export function getSystemIndexArray(): Array<SystemIndexEntity> {
  return systemIndexArray;
}

/**
 * generate startswith 'system_'
 * @returns
 */
export function generateSystemIndex(): string {
  let systemIndex = `import regeneratorRuntime from 'babel-runtime/regenerator'\n`;
  let exportFunction = '';
  systemIndexArray.forEach(value => {
    if (!systemNoMockArray.includes(value.filename.replace('_', '.'))) {
      systemIndex += `import { ${value.mockFunctionName} } from './${value.filename}'\n`;
      exportFunction += `${value.mockFunctionName}();\n`;
    }
  });
  systemIndex += `import {mockRequireNapiFun} from './napi/index';\n`;
  systemIndex += `export function mockSystemPlugin() {
    global.regeneratorRuntime = regeneratorRuntime
    global.systemplugin = {}
    global.ohosplugin = {}\n`;
  systemIndex += exportFunction;
  systemIndex += `mockRequireNapiFun();\n`;
  systemIndex += '}';
  return systemIndex;
}

export interface SystemIndexEntity {
  filename: string,
  mockFunctionName: string
}
