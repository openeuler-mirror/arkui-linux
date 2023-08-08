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
/*
 * 2021.01.08 - Reconstruct the class 'Vm' and make it more adaptable to framework.
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 */

/**
 * @fileOverview
 * ViewModel Constructor & definition
 */

import {
  extend,
  Log,
  removeItem
} from '../../utils/index';
import {
  initState,
  initBases
} from '../reactivity/state';
import {
  build, FragBlockInterface
} from './compiler';
import {
  set,
  del
} from '../reactivity/observer';
import {
  watch,
  initPropsToData
} from './pageLife';
import {
  initEvents,
  ExternalEvent,
  Evt
} from './events';
import {
  selector
} from './selector';
import Page from '../page/index';
import Element from '../../vdom/Element';
import {
  ComputedInterface,
  cssType,
  Props,
  VmOptions,
  MediaStatusInterface,
  ExternalBindingInterface
} from './vmOptions';
import {
  hasOwn
} from '../util/shared';

/**
 * VM constructor.
 * @param {string} type - Type.
 * @param {null | VmOptions} options - Component options.
 * @param {Vm} parentVm   which contains __app.
 * @param {Element | FragBlockInterface} parentEl - root element or frag block.
 * @param {Object} mergedData - External data.
 * @param {ExternalEvent} externalEvents - External events.
 */
export default class Vm {
  private $app: any;
  private __methods: Record<string, (...args: unknown[]) => any>;
  private __type: string;
  private __css: cssType;
  private __vmOptions: VmOptions;
  private __parent: Vm;
  private __realParent: Vm;
  private __computed: ComputedInterface;
  private __selector: object;
  private __parentEl: Element | FragBlockInterface;
  private __app: Page;
  private __shareData: any;
  private __data: any;
  private __props: Props;
  private __init: boolean;
  private __valid: boolean;
  private __visible: boolean;
  private __ready: boolean;
  private __rootEl: Element;
  private __ids: Record<string, {vm: Vm, el: Element}>;
  private __vmEvents: object;
  private __childrenVms: Vm[];
  private __externalBinding: ExternalBindingInterface;
  private readonly __descriptor: string;
  private __isHide: boolean;
  private __mediaStatus: Partial<MediaStatusInterface<string, boolean>>;
  public $refs: Record<string, Element>;
  private __slotContext: { content: Record<string, any>, parentVm: Vm };
  private __counterMapping = new Map();

  constructor(
    type: string,
    options: null | VmOptions,
    parentVm: Vm | any,
    parentEl: Element | FragBlockInterface,
    mergedData: object,
    externalEvents: ExternalEvent
  ) {
    this.$app = global.aceapp;
    this.__parent = parentVm.__realParent ? parentVm.__realParent : parentVm;
    this.__app = parentVm.__app;
    parentVm.__childrenVms && parentVm.__childrenVms.push(this);

    if (!options && this.__app.customComponentMap) {
      options = this.__app.customComponentMap[type];
    }
    const data = options.data || {};
    const shareData = options.shareData || {};
    this.__vmOptions = options;
    this.__computed = options.computed;
    this.__css = options.style || {};
    this.__selector = selector(this.__css);
    this.__ids = {};
    this.$refs = {};
    this.__vmEvents = {};
    this.__childrenVms = [];
    this.__type = type;
    this.__valid = true;
    this.__props = [];
    this.__methods = {};

    // Bind events and lifecycles.
    initEvents(this, externalEvents);

    Log.debug(
      `'_innerInit' lifecycle in Vm(${this.__type}) and mergedData = ${JSON.stringify(mergedData)}.`
    );
    this.$emit('hook:_innerInit');
    this.__data = (typeof data === 'function' ? data.apply(this) : data) || {};
    this.__shareData = (typeof shareData === 'function' ? shareData.apply(this) : shareData) || {};
    this.__descriptor = options._descriptor;
    if (global.aceapp && global.aceapp.i18n && global.aceapp.i18n.extend) {
      global.aceapp.i18n.extend(this);
    }
    if (global.aceapp && global.aceapp.dpi && global.aceapp.dpi.extend) {
      global.aceapp.dpi.extend(this);
    }

    // MergedData means extras params.
    if (mergedData) {
      if (hasOwn(mergedData, 'paramsData') && hasOwn(mergedData, 'dontOverwrite') && mergedData['dontOverwrite'] === false) {
        dataAccessControl(this, mergedData['paramsData'], this.__app.options && this.__app.options.appCreate);
        extend(this._data, mergedData['paramsData']);
      } else {
        dataAccessControl(this, mergedData, this.__app.options && this.__app.options.appCreate);
        extend(this._data, mergedData);
      }
    }

    initPropsToData(this);
    initState(this);
    initBases(this);
    Log.debug(`"onInit" lifecycle in Vm(${this.__type})`);

    if (mergedData && hasOwn(mergedData, 'paramsData') && hasOwn(mergedData, 'dontOverwrite')) {
      if (mergedData['dontOverwrite'] === false) {
        this.$emit('hook:onInit');
      } else {
        this.$emitDirect('hook:onInit', mergedData['paramsData']);
      }
    } else {
      this.$emit('hook:onInit');
    }

    if (!this.__app.doc) {
      return;
    }
    this.__mediaStatus = {};
    this.__mediaStatus.orientation = this.__app.options.orientation;
    this.__mediaStatus.width = this.__app.options.width;
    this.__mediaStatus.height = this.__app.options.height;
    this.__mediaStatus.resolution = this.__app.options.resolution;
    this.__mediaStatus['device-type'] = this.__app.options['device-type'];
    this.__mediaStatus['aspect-ratio'] = this.__app.options['aspect-ratio'];
    this.__mediaStatus['device-width'] = this.__app.options['device-width'];
    this.__mediaStatus['device-height'] = this.__app.options['device-height'];
    this.__mediaStatus['round-screen'] = this.__app.options['round-screen'];
    this.__mediaStatus['dark-mode'] = this.__app.options['dark-mode'];

    // If there is no parentElement, specify the documentElement.
    this.__parentEl = parentEl || this.__app.doc.documentElement;
    build(this);
  }

  /**
   * Get the element by id.
   * @param {string | number} [id] - Element id.
   * @return {Element} Element object. if get null, return root element.
   */
  public $element(id?: string | number): Element {
    if (id) {
      if (typeof id !== 'string' && typeof id !== 'number') {
        Log.warn(`Invalid parameter type: The type of 'id' should be string or number, not ${typeof id}.`);
        return;
      }
      const info: any = this._ids[id];
      if (info) {
        return info.el;
      }
    } else {
      return this.__rootEl;
    }
  }

  /**
   * Get the vm by id.
   * @param {string} id - Vm id.
   * @return {Vm} Vm object.
   */
  public $vm(id: string): Vm {
    const info = this._ids[id];
    if (info) {
      return info.vm;
    }
  }

  /**
   * Get parent Vm of current.
   */
  public $parent(): Vm {
    return this._parent;
  }

  /**
   * Get child Vm of current.
   */
  public $child(id: string): Vm {
    if (typeof id !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'id' should be string, not ${typeof id}.`);
      return;
    }
    return this.$vm(id);
  }

  /**
   * Get root element of current.
   */
  public $rootElement(): Element {
    return this.__rootEl;
  }

  /**
   * Get root Vm of current.
   */
  public $root(): Vm {
    return getRoot(this);
  }

  /**
   * Execution Method.
   * @param {string} type - Type.
   * @param {Object} [detail] - May needed for Evt.
   * @param {*} args - Arg list.
   * @return {*}
   */
  public $emit(type: string, detail?: object, ...args: any[]): any[] {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    const events = this.__vmEvents;
    const handlerList = events[type];
    if (handlerList) {
      const results = [];
      const evt = new Evt(type, detail);
      handlerList.forEach((handler) => {
        results.push(handler.call(this, evt, ...args));
      });
      return results;
    }
  }

  /**
   * Execution Method directly.
   * @param {string} type - Type.
   * @param {*} args - Arg list.
   * @return {*}
   */
  public $emitDirect(type: string, ...args: any[]): any[] {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    const events = this.__vmEvents;
    const handlerList = events[type];
    if (handlerList) {
      const results = [];
      handlerList.forEach((handler) => {
        results.push(handler.call(this, ...args));
      });
      return results;
    }
  }

  /**
   * Dispatch events, passing upwards along the parent.
   * @param {string} type - Type.
   * @param {Object} [detail] - May needed for Evt.
   */
  public $dispatch(type: string, detail?: object): void {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    const evt = new Evt(type, detail);
    this.$emit(type, evt);
    if (!evt.hasStopped() && this.__parent && this.__parent.$dispatch) {
      this.__parent.$dispatch(type, evt);
    }
  }

  /**
   * Broadcast event, which is passed down the subclass.
   * @param {string} type - Type.
   * @param {Object} [detail] - May be needed for Evt.
   */
  public $broadcast(type: string, detail?: object): void {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    const evt = new Evt(type, detail);
    this.$emit(type, evt);
    if (!evt.hasStopped() && this.__childrenVms) {
      this.__childrenVms.forEach((subVm) => {
        subVm.$broadcast(type, evt);
      });
    }
  }

  /**
   * Add the event listener.
   * @param {string} type - Type.
   * @param {Function} handler - To add.
   */
  public $on(type: string, handler: Function): void {
    if (typeof type !== 'string') {
      Log.debug(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    if (typeof handler !== 'function') {
      Log.debug(`Invalid parameter type: The type of 'handler' should be function, not ${typeof handler}.`);
      return;
    }
    const events = this.__vmEvents;
    const handlerList = events[type] || [];
    handlerList.push(handler);
    events[type] = handlerList;
    if (type === 'hook:onReady' && this.__ready) {
      this.$emit('hook:onReady');
    }
  }

  /**
   * Remove the event listener.
   * @param {string} type - Type.
   * @param {Function} handler - To remove.
   */
  public $off(type: string, handler: Function): void {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    if (typeof handler !== 'function') {
      Log.warn(`Invalid parameter type: The type of 'handler' should be function, not ${typeof handler}.`);
      return;
    }
    const events = this.__vmEvents;
    if (!handler) {
      delete events[type];
      return;
    }
    const handlerList = events[type];
    if (!handlerList) {
      return;
    }
    removeItem(handlerList, handler);
  }

  /**
   * Execution element.fireEvent Method.
   * @param {string} type - Type.
   * @param {Object} data - needed for Evt.
   * @param {string} id - Element id.
   */
  public $emitElement(type: string, data: object, id: string): void {
    if (typeof type !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'type' should be string, not ${typeof type}.`);
      return;
    }
    if (typeof id !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'id' should be string, not ${typeof id}.`);
      return;
    }
    const info = this._ids[id];
    if (info) {
      const element = info.el;
      const evt = new Evt(type, data);
      element.fireEvent(type, evt, false);
    } else {
      Log.warn('The id is invalid, id = ' + id);
    }
  }

  /**
   * Watch a calc function and callback if the calc value changes.
   * @param {string} data - Data that needed.
   * @param {Function | string} callback - Callback function.
   */
  public $watch(data: string, callback: ((...args: any) => any) | string): void {
    if (typeof data !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'data' should be string, not ${typeof data}.`);
      return;
    }
    if (typeof callback !== 'function' && typeof callback !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'callback' should be function or string, not ${typeof callback}.`);
      return;
    }
    watch(this, data, callback);
  }

  /**
   * Set a property on an object.
   * @param {string} key - Get value by key.
   * @param {*} value - Property
   */
  public $set(key: string, value: any): void {
    if (typeof key !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'key' should be string, not ${typeof key}.`);
      return;
    }
    if (key.indexOf('.') !== -1) {
      _proxySet(this._data, key, value);
    }
    set(this._data, key, value);
  }

  /**
   * Delete a property and trigger change.
   * @param {string} key - Get by key.
   */
  public $delete(key: string): void {
    if (typeof key !== 'string') {
      Log.warn(`Invalid parameter type: The type of 'key' should be string, not ${typeof key}.`);
      return;
    }
    del(this._data, key);
  }

  /**
   * Delete Vm object.
   */
  public destroy(): void {
    Log.debug(`[JS Framework] "onDestroy" lifecycle in Vm(${this.__type})`);
    this.$emit('hook:onDestroy');
    this.$emit('hook:onDetached');
    fireNodeDetached(this.__rootEl);
    this.__valid = false;

    delete this.__app;
    delete this.__computed;
    delete this.__css;
    delete this.__data;
    delete this.__ids;
    delete this.__vmOptions;
    delete this.__parent;
    delete this.__parentEl;
    delete this.__rootEl;
    delete this.$refs;

    // Destroy child vms recursively.
    if (this.__childrenVms) {
      let vmCount: number = this.__childrenVms.length;
      while (vmCount--) {
        this.destroy.call(this.__childrenVms[vmCount], this.__childrenVms[vmCount]);
      }
      delete this.__childrenVms;
    }
    delete this.__type;
    delete this.__vmEvents;
  }

  /**
   * $t function.
   * @param {string} key - Key.
   * @return {string} - Key.
   */
  public $t(key: string): string {
    return key;
  }

  /**
   * $tc function.
   * @param {string} key - Key.
   * @return {string} - Key.
   */
  public $tc(key: string): string {
    return key;
  }

  /**
   * $r function.
   * @param {string} key - Key.
   * @return {string} - Key.
   */
  public $r(key: string): string {
    return key;
  }

  /**
   * Methods of this Vm.
   * @type {Object}
   * @readonly
   */
  public get _methods() {
    return this.__methods;
  }

  public $getCounterMapping(key: string): number {
    return this.__counterMapping.get(key);
  }

  public $setCounterMapping(key: string, value: number) {
    this.__counterMapping.set(key, value);
  }

  public get _counterMapping() {
    return this.__counterMapping;
  }

  /**
   * Type of this Vm.
   * @type {string}
   * @readonly
   */
  public get _type() {
    return this.__type;
  }

  public set _type(newType: string) {
    this.__type = newType;
  }

  /**
   * Css of this Vm.
   * @type {[key: string]: any}
   * @readonly
   */
  public get _css() {
    return this.__css;
  }

  /**
   * Options of this Vm.
   * @type {VmOptions}
   */
  public get _vmOptions() {
    return this.__vmOptions;
  }

  public set _vmOptions(newOptions: VmOptions) {
    this.__vmOptions = newOptions;
  }

  /**
   * Parent of this Vm.
   * @type {Vm}
   * @readonly
   */
  public get _parent() {
    return this.__parent;
  }

  /**
   * RealParent of this Vm.
   * @type {Vm}
   */
  public get _realParent() {
    return this.__realParent;
  }

  public set _realParent(realParent: Vm) {
    this.__realParent = realParent;
  }

  /**
   * Computed of this Vm.
   * @type {ComputedInterface}
   */
  public get computed() {
    return this.__computed;
  }

  public set computed(newComputed: ComputedInterface) {
    this.__computed = newComputed;
  }

  /**
   * Selector of this Vm.
   * @type {Object}
   * @readonly
   */
  public get _selector() {
    return this.__selector;
  }

  /**
   * ParentEl of this Vm.
   * @type {FragBlockInterface | Element}
   */
  public get _parentEl() {
    return this.__parentEl;
  }

  public set _parentEl(newParentEl: FragBlockInterface | Element) {
    this.__parentEl = newParentEl;
  }

  /**
   * App of this Vm.
   * @type {Page}
   */
  public get _app() {
    return this.__app;
  }

  public set _app(newApp: Page) {
    this.__app = newApp;
  }

  /**
   * ShareData of this Vm.
   * @type {*}
   */
  public get _shareData() {
    return this.__shareData;
  }

  public set _shareData(newShareData: object) {
    this.__shareData = newShareData;
  }

  /**
   * Data of this Vm.
   * @type {*}
   */
  public get _data() {
    return this.__data;
  }

  public set _data(newData: any) {
    this.__data = newData;
  }

  /**
   * Props of this Vm.
   * @type {Props}
   * @readonly
   */
  public get _props() {
    return this.__props;
  }

  /**
   * Init of this Vm.
   * @type {boolean}
   */
  public get _init() {
    return this.__init;
  }

  public set _init(newInit: boolean) {
    this.__init = newInit;
  }

  /**
   * Valid of this Vm.
   * @type {boolean}
   * @readonly
   */
  public get _valid() {
    return this.__valid;
  }

  /**
   * Visible of this Vm.
   * @type {boolean}
   */
  public get _visible() {
    return this.__visible;
  }

  public set _visible(newVisible) {
    this.__visible = newVisible;
  }

  /**
   * Ready of this Vm.
   * @type {boolean}
   */
  public get _ready() {
    return this.__ready;
  }

  public set _ready(newReady: boolean) {
    this.__ready = newReady;
  }

  /**
   * RootEl of this Vm.
   * @type {Element}
   */
  public get _rootEl() {
    return this.__rootEl;
  }

  public set _rootEl(newRootEl: Element) {
    this.__rootEl = newRootEl;
  }

  /**
   * Ids of this Vm.
   * @type {{[key: string]: { vm: Vm, el: Element}}}
   * @readonly
   */
  public get _ids() {
    return this.__ids;
  }

  /**
   * VmEvents of this Vm.
   * @type {Object}
   * @readonly
   */
  public get _vmEvents() {
    return this.__vmEvents;
  }

  /**
   * children of vm.
   * @return {Array} - children of Vm.
   */
  public get _childrenVms() {
    return this.__childrenVms;
  }

  /**
   * ExternalBinding of this Vm.
   * @type {ExternalBinding}
   */
  public get _externalBinding() {
    return this.__externalBinding;
  }

  public set _externalBinding(newExternalBinding: ExternalBindingInterface) {
    this.__externalBinding = newExternalBinding;
  }

  /**
   * Descriptor of this Vm.
   * @type {string}
   * @readonly
   */
  public get _descriptor() {
    return this.__descriptor;
  }

  /**
   * IsHide of this Vm.
   * @type {boolean}
   */
  public get _isHide() {
    return this.__isHide;
  }

  public set _isHide(newIsHide: boolean) {
    this.__isHide = newIsHide;
  }

  /**
   * MediaStatus of this Vm.
   * @type {MediaStatusInterface<string, boolean>}
   */
  public get _mediaStatus() {
    return this.__mediaStatus;
  }

  public set _mediaStatus(newMediaStatus: Partial<MediaStatusInterface<string, boolean>>) {
    this.__mediaStatus = newMediaStatus;
  }

  /**
   * slotContext of this Vm.
   * @type { content: Record<string, any>, parentVm: Vm }
   */
  public get _slotContext() {
    return this.__slotContext;
  }

  public set _slotContext(newMSoltContext: { content: Record<string, any>, parentVm: Vm }) {
    this.__slotContext = newMSoltContext;
  }
}

/**
 * Set proxy.
 * @param {Object} data - Data that needed.
 * @param {string} key - Get prop by key.
 * @param {*} value - Property.
 */
function _proxySet(data: object, key: string, value: any): void {
  let tempObj = data;
  const keys = key.split('.');
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const prop = keys[i];
    if (i === len - 1) {
      set(tempObj, prop, value);
      tempObj = null;
      break;
    }
    if (tempObj[prop] === null || typeof tempObj[prop] !== 'object' && typeof tempObj[prop] !== 'function') {
      Log.warn(`Force define property '${prop}' of '${JSON.stringify(tempObj)}' with value '{}', `
        + `old value is '${tempObj[prop]}'.`);
      set(tempObj, prop, {});
    }
    tempObj = tempObj[prop];
  }
}

/**
 * Control data access.
 * @param {Vm} vm - Vm object.
 * @param {Object} mergedData - Merged data.
 * @param {boolean} external - If has external data.
 */
function dataAccessControl(vm: any, mergedData: object, external: boolean): void {
  if (vm._descriptor && Object.keys(vm._descriptor).length !== 0) {
    const keys = Object.keys(mergedData);
    keys.forEach(key => {
      const desc = vm._descriptor[key];
      if (!desc || desc.access === 'private' || external && desc.access === 'protected') {
        Log.error(`(${key}) can not modify`);
        delete mergedData[key];
      }
    });
  }
}

/**
 * Get root Vm.
 * @param {Vm} vm - Vm object.
 * @return {Vm} Root vm.
 */
function getRoot(vm: any): Vm {
  const parent = vm._parent;
  if (!parent) {
    return vm;
  }
  if (parent.__rootVm) {
    return vm;
  }
  return getRoot(parent);
}

/**
 * order node and fire detached event.
 * @param {Element} el - Element object.
 */
function fireNodeDetached(el: Element) {
  if (!el) {
    return;
  }
  if (el.event && el.event['detached']) {
    el.fireEvent('detached', {});
  }
  if (el.children && el.children.length !== 0) {
    for (const child of el.children) {
      fireNodeDetached(child as Element);
    }
  }
}
