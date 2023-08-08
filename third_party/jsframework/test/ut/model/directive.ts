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

import chai from 'chai';
import sinon from 'sinon';
import {
  describe,
  before,
  it
} from 'mocha';
import {
  fakeLog,
  fakeLogRestore
} from '../../fakeLog';
import {
  bindSubVm,
  bindSubVmAfterInitialized,
  setAttr
} from '../../../runtime/main/model/directive';
import { initState } from '../../../runtime/main/reactivity/state';
import config from '../../../runtime/main/config';

const expect = chai.expect;
const { nativeComponentMap } = config;
const directive = {};

function extendVm(vm, methodNames) {
  methodNames.forEach((name) => {
    vm[name] = directive[name];
  });
  initState(vm);
}

function initElement(el) {
  el.setAttr = function(k, v) {
    this.attr[k] = v;
  };
  el.setStyle = function(k, v) {
    this.style[k] = v;
  };
  el.setClassStyle = function(style) {
    this.classStyle = style;
  };
  el.addEvent = function(t, h) {
    this.event[t] = h;
  };
  el.setClassList = function(classList) {
    this.classList = classList;
  };
}

describe('bind external infomations to sub vm', () => {
  fakeLog();

  let vm: any;
  let subVm: any;

  before(() => {
    vm = {
      data: { a: 1, b: 2, c: 'class-style1' },
      watchers: [],
      app: { eventManager: { add: () => {} }},
      options: {
        style: {
          'class-style1': {
            aaa: 1,
            bbb: 2
          },
          'class-style2': {
            aaa: 2,
            ccc: 3
          }
        }
      },
      foo: function() {}
    };
    extendVm(vm, []);
    subVm = {
      options: {
        props: {
          a: String,
          b: String
        }
      },
      _props: []
    };
  });

  it('bind to no-root-element sub vm', () => {
    bindSubVm(vm, subVm, {
      // @ts-ignore
      attr: { a: 3, c: 4 },

      // @ts-ignore
      style: { a: 2 },
      events: { click: 'foo' }
    }, {});
    expect(subVm.a).eql(3);
    expect(subVm.b).to.be.undefined;
    expect(subVm._rootEl).to.be.undefined;
  });

  it('bind props with external data', () => {
    bindSubVm(vm, subVm, {
      // @ts-ignore
      attr: { a: function() {
        return this.data.b;
      } }
    }, {});
    expect(subVm.a).eql(2);
  });

  it('bind styles to a sub vm with root element', () => {
    subVm._rootEl = {
      attr: {},
      style: {},
      event: []
    };
    const template: any = {
      style: { aaa: 2, bbb: function() {
        return this.data.a;
      } }
    };
    initElement(subVm._rootEl);
    bindSubVm(vm, subVm, template, {});

    // @ts-ignore
    bindSubVmAfterInitialized(vm, subVm, template, {});
    expect(subVm._rootEl.style.aaa).eql(2);
    expect(subVm._rootEl.style.bbb).eql(1);
  });

  fakeLogRestore();
});

/*
1. api 7 data* ->$data  set to dataset ,data ->data data set to attr;
2. api 6 data* -> data set to dataset，data -> data set to attr（data and data* are not compatible ar compile time);
3. api 5 data -> data set to attr.
*/
describe('set $data and data to element to check API 7 scene', () => {
  fakeLog();

  let vm: any;
  let attr1: any;
  let attr2: any;
  let element: any
  let SETTERS = {
    attr: 'setAttr',
    data: 'setData',
    $data: 'setData'
  }

  before(() => {
    vm = {
      __data: { c: '333', d: '444'},
      _watchers: [],
    };
    attr1 = {
      data: '111',
      $data: { b: '222' }
    };
    attr2 = {
      data: function () {return vm.__data.c},
      $data: { url: function () {return vm.__data.d} }
    };
    element = {
      dataSet: {},
      attr: {},
      watchers: [],
      setData: function setData(key: string, value: string): void {
        this.dataSet[key] = value;
      },
      setAttr: function(key: string, value: string | number): void {
        if (this.attr[key] === value) {
          return;
        }
        this.attr[key] = value;
      }
    };
  });

  it('set data and $data to element', () => {
    setAttr(vm, element, attr1)
    expect(element.attr.data).eql('111');
    expect(element.dataSet.b).eql('222');
  })

  it('set data and $data which is function to element', () => {
    setAttr(vm, element, attr2)
    expect(element.attr.data).eql('333');
    expect(element.dataSet.url).eql('444');
  })

  fakeLogRestore();
});

describe('set data and data* to element to check API 6 scene', () => {
  fakeLog();

  let vm: any;
  let attr1: any;
  let attr2: any;
  let element: any
  let SETTERS = {
    attr: 'setAttr',
    data: 'setData'
  }

  before(() => {
    vm = {};
    attr1 = {
      data: '111'
    };
    attr2 = {
      data: { url: '222'}
    };
    element = {
      dataSet: {},
      attr: {},
      setData: function setData(key: string, value: string): void {
        this.dataSet[key] = value;
      },
      setAttr: function(key: string, value: string | number): void {
        if (this.attr[key] === value) {
          return;
        }
        this.attr[key] = value;
      }
    };
  });

  it('set data to element', () => {
    setAttr(vm, element, attr1)
    expect(element.attr.data).eql('111');
  })

  it('set data* to element', () => {
    setAttr(vm, element, attr2)
    expect(element.dataSet.url).eql('222');
  })

  fakeLogRestore();
});

describe('set data only to element attr to to check API 5 scene', () => {
  fakeLog();

  let vm: any;
  let attr: any;
  let element: any
  let SETTERS = {
    attr: 'setAttr',
    data: 'setData'
  }

  before(() => {
    vm = {};
    attr = {
      data: '111'
    };
    element = {
      dataSet: {},
      attr: {},
      setData: function setData() {},
      setAttr: function(key: string, value: string | number): void {
        if (this.attr[key] === value) {
          return;
        }
        this.attr[key] = value;
      }
    };
  });

  it('set data to element', () => {
    setAttr(vm, element, attr)
    expect(element.attr.data).eql('111');
  })

  fakeLogRestore();
});