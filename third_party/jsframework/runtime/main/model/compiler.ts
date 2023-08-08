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

/**
 * @fileOverview
 * ViewModel template parser & data-binding process
 */

import {
  hasOwn,
  Log,
  removeItem
} from '../../utils/index';
import {
  initData,
  initComputed
} from '../reactivity/state';
import {
  bindElement,
  setClass,
  setIdStyle,
  setTagStyle,
  setUniversalStyle,
  setId,
  bindSubVm,
  bindSubVmAfterInitialized,
  newWatch,
  bindDir,
  setAttributeStyle
} from './directive';
import {
  createBlock,
  createBody,
  createElement,
  attachTarget,
  moveTarget,
  removeTarget
} from './domHelper';
import {
  bindPageLifeCycle
} from './pageLife';
import Vm from './index';
import Element from '../../vdom/Element';
import Comment from '../../vdom/Comment';
import Node from '../../vdom/Node';
import Document from '../../vdom/Document';
import { VmOptions } from './vmOptions';

export interface FragBlockInterface {
  start: Comment;
  end: Comment;
  element?: Element;
  blockId: number;
  children?: any[];
  data?: any[];
  vms?: Vm[];
  updateMark?: Node;
  display?: boolean;
  type?: string;
  vm?: Vm;
}

export interface AttrInterface {
  type: string;
  value: () => void | string;
  tid: number;
  append: string;
  slot: string;
  slotScope: string;
  name: string;
  data: () => any | string;
  $data: () => any | string;
}

export interface TemplateInterface {
  type: string;
  attr: Partial<AttrInterface>;
  classList?: () => any | string[];
  children?: TemplateInterface[];
  events?: object;
  repeat?: () => any | RepeatInterface;
  shown?: () => any;
  style?: Record<string, string>;
  id?: () => any | string;
  append?: string;
  onBubbleEvents?: object;
  onCaptureEvents?: object;
  catchBubbleEvents?: object;
  catchCaptureEvents?: object;
}

interface RepeatInterface {
  exp: () => any;
  key?: string;
  value?: string;
  tid?: number;
}

interface MetaInterface {
  repeat: object;
  shown: boolean;
  type: string;
}

interface ConfigInterface {
  latestValue: undefined | string | number;
  recorded: boolean;
}

export function build(vm: Vm) {
  const opt: any = vm._vmOptions || {};
  const template: any = opt.template || {};
  compile(vm, template, vm._parentEl);
  // foreach vm
  const doc: Document = vm._app.doc;
  const body: Node = doc.body;
  compileVm(vm, body);
  compileElementAndElement(vm, body);
  compileAttrStyle(vm, body);
  Log.debug(`"OnReady" lifecycle in Vm(${vm._type}).`);
  vm.$emit('hook:onReady');
  if (vm._parent) {
    vm.$emit('hook:onAttached');
  }
  vm._ready = true;
}

/**
 * Compile the Virtual Dom.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node need to be compiled. Structure of the label in the template.
 * @param {FragBlockInterface | Element} dest - Parent Node's VM of current.
 * @param {MetaInterface} [meta] - To transfer data.
 */
function compile(vm: Vm, target: TemplateInterface, dest: FragBlockInterface | Element, meta?: Partial<MetaInterface>): void {
  const app: any = vm._app || {};
  if (app.lastSignal === -1) {
    return;
  }
  meta = meta || {};
  if (targetIsSlot(target)) {
    compileSlot(vm, target, dest as Element);
    return;
  }

  if (targetNeedCheckRepeat(target, meta)) {
    if (dest.type === 'document') {
      Log.warn('The root element does\'t support `repeat` directive!');
    } else {
      compileRepeat(vm, target, dest as Element);
    }
    return;
  }
  if (targetNeedCheckShown(target, meta)) {
    if (dest.type === 'document') {
      Log.warn('The root element does\'t support `if` directive!');
    } else {
      compileShown(vm, target, dest, meta);
    }
    return;
  }
  const type = meta.type || target.type;
  const component: VmOptions | null = targetIsComposed(vm, type);
  if (component) {
    compileCustomComponent(vm, component, target, dest, type, meta);
    return;
  }
  if (type === 'compontent') {
    compileDyanmicComponent(vm, target, dest, type, meta);
    return;
  }
  if (targetIsBlock(target)) {
    compileBlock(vm, target, dest);
    return;
  }
  compileNativeComponent(vm, target, dest, type);
}

function compileVm(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    let count = 0;
    node.children.forEach((child: Node) => {
      const el = child as Element;
      const tag = child.type;
      if (count === 0) {
        setTagStyle(vm, el, tag, true, false, false);
      } else if (count === node.children.length - 1) {
        setTagStyle(vm, el, tag, false, true, false);
      }
      count++;
      compileVmChild(vm, child);
    });
  }
}

function compileVmChild(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    let count = 0;
    node.children.forEach((child: Node) => {
      const el = child as Element;
      const tag = child.type;
      if (count === 0) {
        setTagStyle(vm, el, tag, true, false, false);
      } else if (count === node.children.length - 1) {
        setTagStyle(vm, el, tag, false, true, false);
      }
      count++;
      compileVm(vm, child);
    });
  }
}

function compileAttrStyle(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    node.children.forEach((child: Node) => {
      const el = child as Element;
      setAttributeStyle(vm, el);
      compileAttrStyleChild(vm, child);
    });
  }
}

function compileAttrStyleChild(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    node.children.forEach((child: Node) => {
      const el = child as Element;
      setAttributeStyle(vm, el);
      compileAttrStyle(vm, child);
    });
  }
}

function compileElementAndElement(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    node.children.forEach((child: Node) => {
      if (child.nextSibling) {
        const el = child.nextSibling as Element;
        const tag = child.type + '+' + child.nextSibling.type;
        setTagStyle(vm, el, tag, false, false, false);
      }
      compileElementAndElementChild(vm, child);
    });
  }
}

function compileElementAndElementChild(vm: Vm, body: Node): void {
  if (body.nodeType === Node.NodeType.Element) {
    const node: Element = body as Element;
    node.children.forEach((child: Node) => {
      if (child.nextSibling) {
        const el = child.nextSibling as Element;
        const tag = child.type + '+' + child.nextSibling.type;
        setTagStyle(vm, el, tag, false, false, false);
      }
      compileElementAndElement(vm, child);
    });
  }
}

/**
 * Compile a dynamic component.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {Element | FragBlockInterface} dest - Parent Node's VM of current.
 * @param {string} type - Component Type.
 * @param {MetaInterface} meta - To transfer data.
 */
export function compileDyanmicComponent(
  vm: Vm,
  target: TemplateInterface,
  dest: Element | FragBlockInterface,
  type: string,
  meta: Partial<MetaInterface>
): void {
  const attr: object = target.attr;
  let dynamicType: string;
  for (const key in attr) {
    const value = attr[key];
    if (key === 'name') {
      if (typeof value === 'function') {
        dynamicType = value.call(vm, vm);
      } else if (typeof value === 'string') {
        dynamicType = value;
      } else {
        Log.error('compontent attr name is unkonwn');
        return;
      }
    }
  }

  const elementDiv = createElement(vm, 'div');
  attachTarget(elementDiv, dest);

  const element = createElement(vm, type);
  element.vm = vm;
  element.target = target;
  element.destroyHook = function() {
    if (element.watchers !== undefined) {
      element.watchers.forEach(function(watcher) {
        watcher.teardown();
      });
      element.watchers = [];
    }
  };
  bindDir(vm, element, 'attr', attr);
  attachTarget(element, elementDiv);

  const component: VmOptions | null = targetIsComposed(vm, dynamicType);
  if (component) {
    compileCustomComponent(vm, component, target, elementDiv, dynamicType, meta);
    return;
  }
}

/**
 * Check if target type is slot.
 *
 * @param  {object}  target
 * @return {boolean}
 */
function targetIsSlot(target: TemplateInterface) {
  return target.type === 'slot';
}

/**
 * Check if target needs to compile by a list.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {MetaInterface} meta - To transfer data.
 * @return {boolean} - True if target needs repeat. Otherwise return false.
 */
function targetNeedCheckRepeat(target: TemplateInterface, meta: Partial<MetaInterface>) {
  return !hasOwn(meta, 'repeat') && target.repeat;
}

/**
 * Check if target needs to compile by a 'if' or 'shown' value.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {MetaInterface} meta - To transfer data.
 * @return {boolean} - True if target needs a 'shown' value. Otherwise return false.
 */
function targetNeedCheckShown(target: TemplateInterface, meta: Partial<MetaInterface>) {
  return !hasOwn(meta, 'shown') && target.shown;
}

/**
 * Check if this kind of component is composed.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {string} type - Component type.
 * @return {VmOptions} Component.
 */
export function targetIsComposed(vm: Vm, type: string): VmOptions {
  let component;
  if (vm._app && vm._app.customComponentMap) {
    component = vm._app.customComponentMap[type];
  }
  if (component) {
    if (component.data && typeof component.data === 'object') {
      if (!component.initObjectData) {
        component.initObjectData = component.data;
      }
      const str = JSON.stringify(component.initObjectData);
      component.data = JSON.parse(str);
    }
  }
  return component;
}

/**
 * Compile a target with repeat directive.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {dest} dest - Node need to be appended.
 */
function compileSlot(vm: Vm, target: TemplateInterface, dest: Element): Element {
  if (!vm._slotContext) {
    // slot in root vm
    return;
  }

  const slotDest = createBlock(vm, dest);

  // reslove slot content
  const namedContents = vm._slotContext.content;
  const parentVm = vm._slotContext.parentVm;
  const slotItem = { target, dest: slotDest };
  const slotName = target.attr.name || 'default';

  // acquire content by name
  const namedContent = namedContents[slotName];
  if (!namedContent) {
    compileChildren(vm, slotItem.target, slotItem.dest);
  } else {
    // Bind slot scope
    if (Array.isArray(namedContent)) {
      namedContent.forEach((item: TemplateInterface) => {
        const slotScope = item.attr && item.attr.slotScope;
        if (typeof slotScope === 'string') {
          parentVm[slotScope] = vm._data;
        }
      });
    }
    compileChildren(parentVm, { children: namedContent }, slotItem.dest);
  }
}

/**
 * Compile a target with repeat directive.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {Element} dest - Parent Node's VM of current.
 */
function compileRepeat(vm: Vm, target: TemplateInterface, dest: Element): void {
  const repeat = target.repeat;
  let getter: any;
  let key: any;
  let value: any;
  let trackBy: any;

  if (isRepeat(repeat)) {
    getter = repeat.exp;
    key = repeat.key || '$idx';
    value = repeat.value;
    trackBy = target.attr && target.attr.tid;
  } else {
    getter = repeat;
    key = '$idx';
    value = '$item';
    trackBy = target.attr && target.attr.tid;
  }
  if (typeof getter !== 'function') {
    getter = function() {
      return [];
    };
  }
  const fragBlock: FragBlockInterface = createBlock(vm, dest);
  fragBlock.children = [];
  fragBlock.data = [];
  fragBlock.vms = [];
  bindRepeat(vm, target, fragBlock, { getter, key, value, trackBy });
}

/**
 * Compile a target with 'if' directive.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {FragBlockInterface | Element} dest - Parent Node's VM of current.
 * @param {MetaInterface} meta - To transfer data.
 */
function compileShown(
  vm: Vm,
  target: TemplateInterface,
  dest: Element | FragBlockInterface,
  meta: Partial<MetaInterface>
): void {
  const newMeta: Partial<MetaInterface> = { shown: true };
  const fragBlock = createBlock(vm, dest);
  if (isBlock(dest) && dest.children) {
    dest.children.push(fragBlock);
  }
  if (hasOwn(meta, 'repeat')) {
    newMeta.repeat = meta.repeat;
  }
  bindShown(vm, target, fragBlock, newMeta);
}

/**
 * Support <block>.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @return {boolean} True if target supports bolck. Otherwise return false.
 */
function targetIsBlock(target: TemplateInterface): boolean {
  return target.type === 'block';
}

/**
 * If <block> create block and compile the children node.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {Element | FragBlockInterface} dest - Parent Node's VM of current.
 */
function compileBlock(vm: Vm, target: TemplateInterface, dest: Element | FragBlockInterface): void {
  const block = createBlock(vm, dest);
  if (isBlock(dest) && dest.children) {
    dest.children.push(block);
  }
  const app: any = vm._app || {};
  const children = target.children;
  if (children && children.length) {
    children.every((child) => {
      compile(vm, child, block);
      return app.lastSignal !== -1;
    });
  }
}

/**
 * Compile a composed component.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {VmOptions} component - Composed component.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {Element | FragBlockInterface} dest - Parent Node's VM of current.
 * @param {string} type - Component Type.
 * @param {MetaInterface} meta - To transfer data.
 */
export function compileCustomComponent(
  vm: Vm,
  component: VmOptions,
  target: TemplateInterface,
  dest: Element | FragBlockInterface,
  type: string,
  meta: Partial<MetaInterface>
): void {
  const subVm = new Vm(
    type,
    component,
    vm,
    dest,
    undefined,
    {
      'hook:_innerInit': function() {
        // acquire slot content of context
        const namedContents = {};
        if (target.children) {
          target.children.forEach(item => {
            const slotName = item.attr.slot || 'default';
            if (namedContents[slotName]) {
              namedContents[slotName].push(item);
            } else {
              namedContents[slotName] = [item];
            }
          });
        }
        this.__slotContext = { content: namedContents, parentVm: vm };
        setId(vm, null, target.id, this);

        // Bind template earlier because of lifecycle issues.
        this.__externalBinding = {
          parent: vm,
          template: target
        };

        // Bind props before init data.
        bindSubVm(vm, this, target, meta.repeat);
      }
    });
  bindSubVmAfterInitialized(vm, subVm, target, dest);
}

/**
 * Reset the element style.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {Element} element - To be reset.
 */
function resetElementStyle(vm: Vm, element: Element): void {
  // Add judgment statements to avoid repeatedly calling 'setClass' function.
  let len = 0;
  if (element.children !== undefined) {
    len = element.children.length;
  }
  const css = vm._css || {};
  const mqArr = css['@MEDIA'];
  for (let ii = 0; ii < len; ii++) {
    const el = element.children[ii] as Element;
    if (!el.isCustomComponent) {
      resetElementStyle(vm, el);
    }
  }
  setUniversalStyle(vm, element);
  if (element.type) {
    setTagStyle(vm, element, element.type, false, false, false);
  }
  if (element.id) {
    setIdStyle(vm, element, element.id);
  }
  if (element.classList && mqArr) {
    for (let i = 0; i < element.classList.length; i++) {
      for (let m = 0; m < mqArr.length; m++) {
        const clsKey = '.' + element.classList[i];
        if (hasOwn(mqArr[m], clsKey)) {
          setClass(vm, element, element.classList);
        }
      }
    }
  }
}

/**
 * <p>Generate element from template and attach to the dest if needed.</p>
 * <p>The time to attach depends on whether the mode status is node or tree.</p>
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} template - Generate element from template.
 * @param {FragBlockInterface | Element} dest - Parent Node's VM of current.
 * @param {string} type - Vm type.
 */
function compileNativeComponent(vm: Vm, template: TemplateInterface, dest: FragBlockInterface | Element, type: string): void {
  function handleViewSizeChanged(e) {
    if (!vm._mediaStatus) {
      vm._mediaStatus = {};
    }
    vm._mediaStatus.orientation = e.orientation;
    vm._mediaStatus.width = e.width;
    vm._mediaStatus.height = e.height;
    vm._mediaStatus.resolution = e.resolution;
    vm._mediaStatus['device-type'] = e['device-type'];
    vm._mediaStatus['aspect-ratio'] = e['aspect-ratio'];
    vm._mediaStatus['device-width'] = e['device-width'];
    vm._mediaStatus['device-height'] = e['device-height'];
    vm._mediaStatus['round-screen'] = e['round-screen'];
    vm._mediaStatus['dark-mode'] = e['dark-mode'];
    const css = vm._vmOptions && vm._vmOptions.style || {};
    const mqArr = css['@MEDIA'];
    if (!mqArr) {
      return;
    }
    if (e.isInit && vm._init) {
      return;
    }
    vm._init = true;
    resetElementStyle(vm, e.currentTarget);
    e.currentTarget.addEvent('show');
  }

  let element;
  if (!isBlock(dest) && dest.ref === '_documentElement') {
    // If its parent is documentElement then it's a body.
    element = createBody(vm, type);
  } else {
    element = createElement(vm, type);
    element.destroyHook = function() {
      if (element.block !== undefined) {
        removeTarget(element.block);
      }
      if (element.watchers !== undefined) {
        element.watchers.forEach(function(watcher) {
          watcher.teardown();
        });
        element.watchers = [];
      }
    };
  }

  if (!vm._rootEl) {
    vm._rootEl = element;
    // Bind event earlier because of lifecycle issues.
    const binding: any = vm._externalBinding || {};
    const target = binding.template;
    const parentVm = binding.parent;
    if (target && target.events && parentVm && element) {
      for (const type in target.events) {
        const handler = parentVm[target.events[type]];
        if (handler) {
          element.addEvent(type, handler.bind(parentVm));
        }
      }
    }
    // Page show hide life circle hook function.
    bindPageLifeCycle(vm, element);
    element.setCustomFlag();
    element.customFlag = true;
    vm._init = true;
    element.addEvent('viewsizechanged', handleViewSizeChanged);
  }

  // Dest is parent element.
  bindElement(vm, element, template, dest);
  if (element.event && element.event['attached']) {
    element.fireEvent('attached', {});
  }

  if (template.attr && template.attr.append) {
    template.append = template.attr.append;
  }
  if (template.append) {
    element.attr = element.attr || {};
    element.attr.append = template.append;
  }
  let treeMode = template.append === 'tree';
  const app: any = vm._app || {};

  // Record the parent node of treeMode, used by class selector.
  if (treeMode) {
    if (!global.treeModeParentNode) {
      global.treeModeParentNode = dest;
    } else {
      treeMode = false;
    }
  }
  if (app.lastSignal !== -1 && !treeMode) {
    app.lastSignal = attachTarget(element, dest);
  }
  if (app.lastSignal !== -1) {
    compileChildren(vm, template, element);
  }
  if (app.lastSignal !== -1 && treeMode) {
    delete global.treeModeParentNode;
    app.lastSignal = attachTarget(element, dest);
  }
}

/**
 * Set all children to a certain parent element.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {any} template - Generate element from template.
 * @param {Element | FragBlockInterface} dest - Parent Node's VM of current.
 * @return {void | boolean} If there is no children, return null. Return true if has node.
 */
function compileChildren(vm: Vm, template: any, dest: Element | FragBlockInterface): void | boolean {
  const app: any = vm._app || {};
  const children = template.children;
  if (children && children.length) {
    children.every((child) => {
      compile(vm, child, dest);
      return app.lastSignal !== -1;
    });
  }
}

/**
 * Watch the list update and refresh the changes.
 * @param {Vm} vm - Vm object need to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {FragBlockInterface} fragBlock - {vms, data, children}
 * @param {*} info - {getter, key, value, trackBy, oldStyle}
 */
function bindRepeat(vm: Vm, target: TemplateInterface, fragBlock: FragBlockInterface, info: any): void {
  const vms = fragBlock.vms;
  const children = fragBlock.children;
  const { getter, trackBy } = info;
  const keyName = info.key;
  const valueName = info.value;

  function compileItem(item: any, index: number, context: Vm) {
    const mergedData = {};
    mergedData[keyName] = index;
    mergedData[valueName] = item;
    const newContext = mergeContext(context, mergedData);
    vms.push(newContext);
    compile(newContext, target, fragBlock, { repeat: item });
  }
  const list = watchBlock(vm, fragBlock, getter, 'repeat',
    (data) => {
      Log.debug(`The 'repeat' item has changed ${data}.`);
      if (!fragBlock || !data) {
        return;
      }
      const oldChildren = children.slice();
      const oldVms = vms.slice();
      const oldData = fragBlock.data.slice();

      // Collect all new refs track by.
      const trackMap = {};
      const reusedMap = {};
      data.forEach((item, index) => {
        const key = trackBy && item[trackBy] !== undefined ? item[trackBy] : index;
        if (key === null || key === '') {
          return;
        }
        trackMap[key] = item;
      });
      // Remove unused element foreach old item.
      const reusedList: any[] = [];
      const cacheList: any[] = [];
      oldData.forEach((item, index) => {
        const key = trackBy && item[trackBy] !== undefined ? item[trackBy] : index;
        if (hasOwn(trackMap, key)) {
          reusedMap[key] = {
            item, index, key,
            target: oldChildren[index],
            vm: oldVms[index]
          };
          reusedList.push(item);
        } else {
          cacheList.push({
            target: oldChildren[index],
            vm: oldVms[index]
          });
        }
      });
      // Create new element for each new item.
      children.length = 0;
      vms.length = 0;
      fragBlock.data = data.slice();
      fragBlock.updateMark = fragBlock.start;

      data.forEach((item, index) => {
        const key = trackBy && item[trackBy] !== undefined ? item[trackBy] : index;
        const reused = reusedMap[key];
        if (reused) {
          if (reused.item === reusedList[0]) {
            reusedList.shift();
          } else {
            removeItem(reusedList, reused.item);
            moveTarget(reused.target, fragBlock.updateMark);
          }
          children.push(reused.target);
          vms.push(reused.vm);
          reused.vm[valueName] = item;

          reused.vm[keyName] = index;
          fragBlock.updateMark = reused.target;
        } else {
          if (cacheList.length > 0) {
            const reusedItem = cacheList[0];
            cacheList.shift();
            moveTarget(reusedItem.target, fragBlock.updateMark);
            children.push(reusedItem.target);
            vms.push(reusedItem.vm);
            reusedItem.vm[valueName] = item;

            reusedItem.vm[keyName] = index;
            fragBlock.updateMark = reusedItem.target;
          } else {
            compileItem(item, index, vm);
          }
        }
      });
      delete fragBlock.updateMark;
      cacheList.forEach((item) => {
        removeTarget(item.target);
      });
    }
  );
  if (list && Array.isArray(list)) {
    fragBlock.data = list.slice(0);
    list.forEach((item, index) => {
      compileItem(item, index, vm);
    });
  }
}

/**
 * Watch the display update and add/remove the element.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {TemplateInterface} target - Node needs to be compiled. Structure of the label in the template.
 * @param {FragBlockInterface} fragBlock - {vms, data, children}
 * @param {MetaInterface} meta - To transfer data.
 */
function bindShown(
  vm: Vm,
  target: TemplateInterface,
  fragBlock: FragBlockInterface,
  meta: Partial<MetaInterface>
): void {
  const display = watchBlock(vm, fragBlock, target.shown, 'shown',
    (display) => {
      Log.debug(`The 'if' item was changed ${display}.`);
      if (!fragBlock || !!fragBlock.display === !!display) {
        return;
      }
      fragBlock.display = !!display;
      if (display) {
        compile(vm, target, fragBlock, meta);
      } else {
        removeTarget(fragBlock, true);
      }
    }
  );

  fragBlock.display = !!display;
  if (display) {
    compile(vm, target, fragBlock, meta);
  }
}

/**
 * Watch calc changes and append certain type action to differ.
 * @param {Vm} vm - Vm object needs to be compiled.
 * @param {FragBlockInterface} fragBlock - {vms, data, children}
 * @param {Function} calc - Function.
 * @param {string} type - Vm type.
 * @param {Function} handler - Function.
 * @return {*} Init value of calc.
 */
function watchBlock(vm: Vm, fragBlock: FragBlockInterface, calc: Function, type: string, handler: Function): any {
  const differ = vm && vm._app && vm._app.differ;
  const config: Partial<ConfigInterface> = {};
  const newWatcher = newWatch(vm, calc, (value) => {
    config.latestValue = value;
    if (differ && !config.recorded) {
      differ.append(type, fragBlock.blockId.toString(), () => {
        const latestValue = config.latestValue;
        handler(latestValue);
        config.recorded = false;
        config.latestValue = undefined;
      });
    }
    config.recorded = true;
  });
  fragBlock.end.watchers.push(newWatcher);
  return newWatcher.value;
}

/**
 * Clone a context and merge certain data.
 * @param {Vm} context - Context value.
 * @param {Object} mergedData - Certain data.
 * @return {*} The new context.
 */
function mergeContext(context: Vm, mergedData: object): any {
  const newContext = Object.create(context);
  newContext.__data = mergedData;
  newContext.__shareData = {};
  initData(newContext);
  initComputed(newContext);
  newContext.__realParent = context;
  return newContext;
}

/**
 * Check if it needs repeat.
 * @param {Function | RepeatInterface} repeat - Repeat value.
 * @return {boolean} - True if it needs repeat. Otherwise return false.
 */
function isRepeat(repeat: Function | RepeatInterface): repeat is RepeatInterface {
  const newRepeat = <RepeatInterface>repeat;
  return newRepeat.exp !== undefined;
}

/**
 * Check if it is a block.
 * @param {FragBlockInterface | Node} node - Node value.
 * @return {boolean} - True if it is a block. Otherwise return false.
 */
export function isBlock(node: FragBlockInterface | Node): node is FragBlockInterface {
  const newNode = <FragBlockInterface>node;
  return newNode.blockId !== undefined;
}
