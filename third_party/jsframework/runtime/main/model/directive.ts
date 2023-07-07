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
 * 2021.01.08 - Rewrite some functions and remove some redundant judgments to fit framework.
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 */

/**
 * @fileOverview
 * Directive Parser
 */

import {
  typof,
  camelize,
  Log
} from '../../utils/index';
import Watcher from '../reactivity/watcher';
import {
  setDescendantStyle
} from './selector';
import {
  getDefaultPropValue
} from '../util/props';
import {
  matchMediaQueryCondition
} from '../extend/mediaquery/mediaQuery';
import {
  TemplateInterface,
  FragBlockInterface,
  AttrInterface
} from './compiler';
import Vm from './index';
import Element from '../../vdom/Element';

const SETTERS = {
  attr: 'setAttr',
  style: 'setStyle',
  data: 'setData',
  $data: 'setData',
  event: 'addEvent',
  idStyle: 'setIdStyle',
  tagStyle: 'setTagStyle',
  attrStyle: 'setAttrStyle',
  tagAndTagStyle: 'setTagAndTagStyle',
  tagAndIdStyle: 'setTagAndIdStyle',
  universalStyle: 'setUniversalStyle',
  firstOrLastChildStyle: 'setFirstOrLastChildStyle'
};

/* eslint-disable no-unused-vars */
enum ContentType {
  CONTENT_STRING,
  CONTENT_OPEN_QUOTE,
  CONTENT_CLOSE_QUOTE,
  CONTENT_ATTR,
  CONTENT_COUNTER
}

interface ContentObject {
  value: string,
  contentType: ContentType
}
let finallyItems: Array <ContentObject> = [];

/**
 * Bind id, attr, classnames, style, events to an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - Element to be bind.
 * @param {TemplateInterface} template - Structure of the component.
 * @param {Element | FragBlockInterface} parentElement - Parent element of current element.
 */
export function bindElement(vm: Vm, el: Element, template: TemplateInterface, parentElement: Element | FragBlockInterface): void {
  // Set descendant style.
  setDescendantStyle(
    vm._selector,
    {
      id: template.id,
      class: template.classList,
      tag: template.type
    },
    parentElement,
    vm,
    function(style: {[key: string]: any}) {
      if (!style) {
        return;
      }
      const css = vm._css || {};
      setAnimation(style, css);
      setFontFace(style, css);
      setStyle(vm, el, style);
    }
  );

  // inherit 'show' attribute of custom component
  if (el.isCustomComponent) {
    const value = vm['show'];
    if (template.attr && value !== undefined) {
      if (typeof value === 'function') {
        // vm['show'] is assigned to this.show in initPropsToData()
        template.attr['show'] = function() {
          return this.show;
        };
      } else {
        template.attr['show'] = value;
      }
    }
  }

  setId(vm, el, template.id, vm);
  setAttr(vm, el, template.attr);
  setStyle(vm, el, template.style);
  setIdStyle(vm, el, template.id);
  setClass(vm, el, template.classList);
  setTagStyle(vm, el, template.type, false, false, true);
  setTagAndIdStyle(vm, el, template.type, template.id);
  setUniversalStyle(vm, el);
  applyStyle(vm, el);

  bindEvents(vm, el, template.events);
  bindEvents(vm, el, template.onBubbleEvents, '');
  bindEvents(vm, el, template.onCaptureEvents, 'capture');
  bindEvents(vm, el, template.catchBubbleEvents, 'catchbubble');
  bindEvents(vm, el, template.catchCaptureEvents, 'catchcapture');

  if (!vm._isHide && !vm._init) {
    el.addEvent('hide');
    vm._isHide = true;
  }
}

/**
 * <p>Bind all props to sub vm and bind all style, events to the root element</p>
 * <p>of the sub vm if it doesn't have a replaced multi-node fragment.</p>
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 * @param {TemplateInterface} template - Structure of the component.
 * @param {Object} repeatItem - Item object.
 */
export function bindSubVm(vm: Vm, rawSubVm: Vm, rawTemplate: TemplateInterface, repeatItem: object): void {
  const subVm: any = rawSubVm || {};
  const template: any = rawTemplate || {};
  const options: any = subVm._vmOptions || {};

  let props = options.props;
  if (isArray(props) || !props) {
    if (isArray(props)) {
      props = props.reduce((result, value) => {
        result[value] = true;
        return result;
      }, {});
    }
    mergeProps(repeatItem, props, vm, subVm);
    mergeProps(template.attr, props, vm, subVm);
  } else {
    const attrData = template.attr || {};
    const repeatData = repeatItem || {};
    Object.keys(props).forEach(key => {
      const prop = props[key];
      let value = attrData[key] || repeatData[key] || undefined;
      if (value === undefined) {
        value = getDefaultPropValue(vm, prop);
      }
      mergePropsObject(key, value, vm, subVm);
    });
  }

  const attr = template.attr || {};
  for (const key in attr) {
    const value = attr[key];
    if (key === 'inheritClass') {
      const inheritClasses = value.split(' ');
      for (let x = 0; x < inheritClasses.length; x++) {
        const cssName = '.' + inheritClasses[x];
        const cssParent = vm._css[cssName];
        if (cssParent) {
          subVm._css[cssName] = cssParent;
        } else {
          console.error('cssParent is null');
        }
      }
    }
  }
}

/**
 * Merge class and styles from vm to sub vm.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 * @param {TemplateInterface} template - Structure of the component.
 * @param {Element | FragBlockInterface} target - The target of element.
 */
export function bindSubVmAfterInitialized(vm: Vm, subVm: Vm, template: TemplateInterface, target: Element | FragBlockInterface): void {
  mergeClassStyle(template.classList, vm, subVm);
  mergeStyle(template.style, vm, subVm);
  if (target.children) {
    target.children[target.children.length - 1]._vm = subVm;
  } else {
    target.vm = subVm;
  }
  bindSubEvent(vm, subVm, template);
}

/**
 * Bind custom event from vm to sub vm for calling parent method.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 * @param {TemplateInterface} template - Structure of the component.
 */
function bindSubEvent(vm: Vm, subVm: Vm, template: TemplateInterface): void {
  if (template.events) {
    for (const type in template.events) {
      subVm.$on(camelize(type), function() {
        const args = [];
        for (const i in arguments) {
          args[i] = arguments[i];
        }
        if (vm[template.events[type]]
            && typeof vm[template.events[type]] === 'function') {
          vm[template.events[type]].apply(vm, args);
        } else if (template.events[type]
            && typeof template.events[type] === 'function') {
          template.events[type].apply(vm, args);
        }
      });
    }
  }
}

/**
 * Merge props from vm to sub vm.
 * @param {string} key - Get vm object by key.
 * @param {*} value - Default Value.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 * @return {*} Sub vm object.
 */
function mergePropsObject(key: string, value: any, vm: Vm, subVm: Vm): any {
  subVm._props.push(key);
  if (typeof value === 'function') {
    const returnValue = watch(vm, value, function(v) {
      subVm[key] = v;
    });
    // 'show' attribute will be inherited by elements in custom component
    if (key === 'show') {
      subVm[key] = value;
    } else {
      subVm[key] = returnValue;
    }
  } else {
    const realValue =
        value && value.__hasDefault ? value.__isDefaultValue : value;
    subVm[key] = realValue;
  }
  return subVm[key];
}

/**
 * Bind props from vm to sub vm and watch their updates.
 * @param {Object} target - Target object.
 * @param {*} props - Vm props.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 */
function mergeProps(target: object, props: any, vm: Vm, subVm: Vm): void {
  if (!target) {
    return;
  }
  for (const key in target) {
    if (!props || props[key] || key === 'show') {
      subVm._props.push(key);
      const value = target[key];
      if (typeof value === 'function') {
        const returnValue = watch(vm, value, function(v) {
          subVm[key] = v;
        });
        // 'show' attribute will be inherited by elements in custom component
        if (key === 'show') {
          subVm[key] = value;
        } else {
          subVm[key] = returnValue;
        }
      } else {
        subVm[key] = value;
      }
    }
  }
}

/**
 * Bind style from vm to sub vm and watch their updates.
 * @param {Object} target - Target object.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 */
function mergeStyle(target: { [key: string]: any }, vm: Vm, subVm: Vm): void {
  for (const key in target) {
    const value = target[key];
    if (typeof value === 'function') {
      const returnValue = watch(vm, value, function(v) {
        if (subVm._rootEl) {
          subVm._rootEl.setStyle(key, v);
        }
      });
      subVm._rootEl.setStyle(key, returnValue);
    } else {
      if (subVm._rootEl) {
        subVm._rootEl.setStyle(key, value);
      }
    }
  }
}

/**
 * Bind class and style from vm to sub vm and watch their updates.
 * @param {Object} target - Target object.
 * @param {Vm} vm - Vm object.
 * @param {Vm} subVm - Sub vm.
 */
function mergeClassStyle(target: Function | string[], vm: Vm, subVm: Vm): void {
  const css = vm._css || {};
  if (!subVm._rootEl) {
    return;
  }

  /**
   * Class name.
   * @constant {string}
   */
  const CLASS_NAME = '@originalRootEl';
  css['.' + CLASS_NAME] = subVm._rootEl.classStyle;

  function addClassName(list, name) {
    if (typof(list) === 'array') {
      list.unshift(name);
    }
  }

  if (typeof target === 'function') {
    const value = watch(vm, target, v => {
      addClassName(v, CLASS_NAME);
      setClassStyle(subVm._rootEl, css, v);
    });
    addClassName(value, CLASS_NAME);
    setClassStyle(subVm._rootEl, css, value);
  } else if (target !== undefined) {
    addClassName(target, CLASS_NAME);
    setClassStyle(subVm._rootEl, css, target);
  }
}

/**
 * Bind id to an element. Note: Each id is unique in a whole vm.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - Element object.
 * @param {Function | string} id - Unique vm id.
 * @param {Vm} target - Target vm.
 */
export function setId(vm: Vm, el: Element, id: Function | string, target: Vm): void {
  const map = Object.create(null);
  Object.defineProperties(map, {
    vm: {
      value: target,
      writable: false,
      configurable: false
    },
    el: {
      get: () => el || target._rootEl,
      configurable: false
    }
  });
  if (typeof id === 'function') {
    const handler = id;
    const newId = handler.call(vm);
    if (newId || newId === 0) {
      setElementId(el, newId);
      vm._ids[newId] = map;
    }
    watch(vm, handler, (newId) => {
      if (newId) {
        setElementId(el, newId);
        vm._ids[newId] = map;
      }
    });
  } else if (id && typeof id === 'string') {
    setElementId(el, id);
    vm._ids[id] = map;
  }
}

/**
 * Set id to Element.
 * @param {Element} el - Element object.
 * @param {string} id - Element id.
 */
function setElementId(el: Element, id: string): void {
  if (el) {
    el.id = id;
  }
}

/**
 * Bind attr to an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - Element.
 * @param {AttrInterface} attr - Attr to bind.
 */
export function setAttr(vm: Vm, el: Element, attr: Partial<AttrInterface>): void {
  if (attr) {
    // address $data or data independently
    if (attr.$data) {
      bindDir(vm, el, '$data', attr.$data);
    } else if (attr.data && Object.prototype.toString.call(attr.data) === '[object Object]') {
      bindDir(vm, el, 'data', attr.data);
    }
  }
  bindDir(vm, el, 'attr', attr);
}

/**
 * Set font family and get font resource.
 * @param {Object} css - Css style.
 * @param {string | string[]} fontFamilyNames - Font family names.
 * @return {*} Font resource.
 */
function _getFontFamily(css: any, fontFamilyNames: string | string[]): any[] {
  let results = [];
  const familyMap = css['@FONT-FACE'];
  if (typeof fontFamilyNames === 'string') {
    fontFamilyNames.split(',').forEach(fontFamilyName => {
      fontFamilyName = fontFamilyName.trim();
      let find = false;
      if (familyMap && Array.isArray(familyMap)) {
        let len = familyMap.length;
        while (len) {
          if (
            familyMap[len - 1].fontFamily &&
              familyMap[len - 1].fontFamily === fontFamilyName
          ) {
            results.push(familyMap[len - 1]);
            find = true;
          }
          len--;
        }
      } else if (familyMap && typeof familyMap === 'object') {
        const definedFontFamily = familyMap[fontFamilyName];
        if (definedFontFamily && definedFontFamily.src) {
          if (Array.isArray(definedFontFamily.src)) {
            definedFontFamily.src = definedFontFamily.src.map(item => `url("${item}")`).join(',');
          }
          results.push(definedFontFamily);
          find = true;
        }
      }
      if (!find) {
        results.push({ 'fontFamily': fontFamilyName });
      }
    });
  } else if (Array.isArray(fontFamilyNames)) {
    results = fontFamilyNames;
  } else if (fontFamilyNames) {
    Log.warn(`GetFontFamily Array error, unexpected fontFamilyNames type [${typeof fontFamilyNames}].`);
  }
  return results;
}

/**
 * Select class style.
 * @param {Object} css - Css style.
 * @param {Function | string[]} classList - List of class label.
 * @param {number} index - Index of classList.
 * @return {*} Select style.
 */
function selectClassStyle(css: object, classList: Function | string[], index: number, vm: Vm): any {
  const key = '.' + classList[index];
  return selectStyle(css, key, vm);
}

/**
 * Select id style.
 * @param {Object} css - Css style.
 * @param {string} id - Id label.
 * @param {Vm} vm - Vm object.
 * @return {*} Select style.
 */
function selectIdStyle(css: object, id: string, vm: Vm): any {
  const key = '#' + id;
  return selectStyle(css, key, vm);
}

function selectTagAndIdStyle(css: object, tag: string, id: string, vm: Vm): any {
  const key = tag + '#' + id;
  return selectStyle(css, key, vm);
}

/**
 * Replace style.
 * @param {*} oStyle - Current style.
 * @param {*} rStyle - New style.
 */
function replaceStyle(oStyle: any, rStyle: any): void {
  if (!rStyle || rStyle.length <= 0) {
    return;
  }
  Object.keys(rStyle).forEach(function(key) {
    oStyle[key] = rStyle[key];
  });
}

/**
 * Select style for class label, id label.
 * @param {Object} css - Css style.
 * @param {string} key - Key index.
 * @param {Vm} vm - Vm object.
 * @return {*}
 */
function selectStyle(css: object, key: string, vm: Vm): any {
  const style = css[key];
  if (!vm) {
    return style;
  }
  const mediaStatus = vm._mediaStatus;
  if (!mediaStatus) {
    return style;
  }
  const mqArr = css['@MEDIA'];
  if (!mqArr) {
    vm._init = true;
    return style;
  }
  const classStyle = {};
  if (style) {
    Object.keys(style).forEach(function(key) {
      classStyle[key] = style[key];
      setCounterValue(vm, key, style[key]);
    });
  }
  for (let i$1 = 0; i$1 < mqArr.length; i$1++) {
    if (matchMediaQueryCondition(mqArr[i$1].condition, mediaStatus, false)) {
      replaceStyle(classStyle, mqArr[i$1][key]);
    }
  }
  return classStyle;
}

/**
 * Set class style after SelectClassStyle.
 * @param {Element} el - Element object.
 * @param {Object} css - Css style.
 * @param {string[]} classList - List of class label.
 */
function setClassStyle(el: Element, css: object, classList: string[], vm?: Vm): void {
  const SPACE_REG: RegExp = /\s+/;
  const newClassList: string[] = [];
  if (Array.isArray(classList)) {
    classList.forEach(v => {
      if (typeof v === 'string' && SPACE_REG.test(v)) {
        newClassList.push(...v.trim().split(SPACE_REG));
      } else {
        newClassList.push(v);
      }
    });
  }
  classList = newClassList;
  const classStyle = {};
  const length = classList.length;
  if (length === 1) {
    const style = selectClassStyle(css, classList, 0, vm);
    if (style) {
      Object.keys(style).forEach((key) => {
        classStyle[key] = style[key];
        setCounterValue(vm, key, style[key]);
      });
    }
  } else {
    const rets = [];
    const keys = Object.keys(css || {});
    for (let i = 0; i < length; i++) {
      const clsKey = '.' + classList[i];
      const style = selectStyle(css, clsKey, vm);
      if (style) {
        const order = clsKey === '.@originalRootEl' ? -1000 : keys.indexOf(clsKey);
        rets.push({style: style, order: order});
      }
    }
    if (rets.length === 1) {
      const style = rets[0].style;
      if (style) {
        Object.keys(style).forEach((key) => {
          classStyle[key] = style[key];
          setCounterValue(vm, key, style[key]);
        });
      }
    } else if (rets.length > 1) {
      rets.sort(function(a, b) {
        if (!a) {
          return -1;
        } else if (!b) {
          return 1;
        } else {
          return a.order > b.order ? 1 : -1;
        }
      });
      const retStyle = {};
      rets.forEach(function(key) {
        if (key && key.style) {
          Object.assign(retStyle, key.style);
        }
      });
      Object.keys(retStyle).forEach((key) => {
        classStyle[key] = retStyle[key];
        setCounterValue(vm, key, retStyle[key]);
      });
    }
  }

  const keyframes = css['@KEYFRAMES'];
  if (keyframes) {
    /*
     * Assign @KEYFRAMES's value.
     */
    const animationName = classStyle['animationName'];
    if (animationName) {
      classStyle['animationName'] = keyframes[animationName];
      if (classStyle['animationName']) {
        classStyle['animationName'].push({'animationName': animationName});
      }
    }
    const transitionEnter = classStyle['transitionEnter'];
    if (transitionEnter) {
      classStyle['transitionEnter'] = keyframes[transitionEnter];
      classStyle['transitionEnterName'] = transitionEnter;
    }
    const transitionExit = classStyle['transitionExit'];
    if (transitionExit) {
      classStyle['transitionExit'] = keyframes[transitionExit];
      classStyle['transitionExitName'] = transitionExit;
    }
    const sharedTransitionName = classStyle['sharedTransitionName'];
    if (sharedTransitionName) {
      classStyle['sharedTransitionName'] = keyframes[sharedTransitionName];
    }
  }
  const fontFace = classStyle['fontFamily'];
  if (fontFace) {
    const fontCompileList = _getFontFamily(css, fontFace);
    classStyle['fontFamily'] = fontCompileList;
  }
  el.setClassStyle(classStyle);
  el.classList = classList;
}

/**
 * Bind classnames to an element
 * @param {Vm} vm - Vm object.
 * @param {Element} el - Element object.
 * @param {Function | string[]} classList - List of class label.
 */
export function setClass(vm: Vm, el: Element, classList: Function | string[]): void {
  if (typeof classList !== 'function' && !Array.isArray(classList)) {
    return;
  }
  if (Array.isArray(classList) && !classList.length) {
    el.setClassStyle({});
    return;
  }
  const style = vm._css || {};
  if (typeof classList === 'function') {
    const value = watch(vm, classList, v => {
      setClassStyle(el, style, v, vm);
    });
    setClassStyle(el, style, value, vm);
  } else {
    setClassStyle(el, style, classList, vm);
  }
}

/**
 * Support css selector by id and component.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {Function | string} id - Id label.
 */
export function setIdStyle(vm: Vm, el: Element, id: Function | string): void {
  if (id) {
    const css = vm._css || {};
    if (typeof id === 'function') {
      const value = watch(vm, id, v => {
        doSetStyle(vm, el, selectIdStyle(css, v, vm), css, 'idStyle');
      });
      doSetStyle(vm, el, selectIdStyle(css, value, vm), css, 'idStyle');
    } else if (typeof id === 'string') {
      doSetStyle(vm, el, selectIdStyle(css, id, vm), css, 'idStyle');
    }
  }
}

/**
 * Set style.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {*} style - Style to be Set.
 * @param {*} css - Css style.
 * @param {string} name - Bind by name.
 */
function doSetStyle(vm: Vm, el: Element, style: any, css: any, name: string, isFirst?: boolean, isLast?: boolean, isSetContent?: boolean): void {
  if (!style) {
    return;
  }
  const typeStyle = {};
  Object.assign(typeStyle, style);
  setAnimation(typeStyle, css);
  setFontFace(typeStyle, css);
  bindDir(vm, el, name, typeStyle, isFirst, isLast, isSetContent);
}

/**
 * Set FontFace.
 * @param {*} style - Style.
 * @param {*} css - Css style.
 */
function setFontFace(style: any, css: any): void {
  const fontFace = style['fontFamily'];
  if (fontFace) {
    const fontCompileList = _getFontFamily(css, fontFace);
    style['fontFamily'] = fontCompileList;
  }
}

/**
 * Set Animation
 * @param {*} style - Style.
 * @param {*} css - Css style.
 */
function setAnimation(style: any, css: any): void {
  const animationName = style['animationName'];
  const keyframes = css['@KEYFRAMES'];
  if (animationName && keyframes) {
    style['animationName'] = keyframes[animationName];
    if (style['animationName']) {
      style['animationName'].push({'animationName': animationName});
    }
  }
}

/**
 * Set tag style.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {string} tag - Tag.
 */
export function setTagStyle(vm: Vm, el: Element, tag: string, isFirst?: boolean, isLast?: boolean, isSetContent?: boolean): void {
  const css = vm._css || {};
  if (tag && typeof tag === 'string') {
    let tagStyle = 'tagStyle';
    if (tag.indexOf('+') > 0) {
      tagStyle = 'tagAndTagStyle';
    }
    doSetStyle(vm, el, selectStyle(css, tag, vm), css, tagStyle, isFirst, isLast, isSetContent);
  }
}

export function setTagAndIdStyle(vm: Vm, el: Element, tag: string, id: Function | string): void {
  const css = vm._css || {};
  if (typeof id === 'string') {
    if (tag && typeof tag === 'string') {
      doSetStyle(vm, el, selectTagAndIdStyle(css, tag, id, vm), css, 'tagAndIdStyle');
    }
  }
}

/**
 * Set * style.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 */
export function setUniversalStyle(vm: Vm, el: Element): void {
  const css = vm._css || {};
  doSetStyle(vm, el, selectStyle(css, '*', vm), css, 'universalStyle');
}

/**
 * Bind style to an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {*} style - Style.
 */
function setStyle(vm: Vm, el: Element, style: any): void {
  bindDir(vm, el, 'style', style);
}

/**
 * Add an event type and handler to an element and generate a dom update.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {string} type - Type added to event.
 * @param {Function} handler - Handle added to event.
 */
function setEvent(vm: Vm, el: Element, type: string, handler: Function): void {
  el.addEvent(type, handler.bind(vm));
}

/**
 * Add all events of an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {Object} events - Events of an element.
 */
function bindEvents(vm: Vm, el: Element, events: object, eventType?: string): void {
  if (!events) {
    return;
  }
  const keys = Object.keys(events);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    let handler = events[key];
    if (typeof handler === 'string') {
      handler = vm[handler];
      if (!handler || typeof handler !== 'function') {
        Log.warn(`The event handler '${events[key]}' is undefined or is not function.`);
        continue;
      }
    }
    const eventName: string = eventType ? eventType + key : key;
    setEvent(vm, el, eventName, handler);
  }
}

/**
 * <p>Set a series of members as a kind of an element.</p>
 * <p>for example: style, attr, ...</p>
 * <p>if the value is a function then bind the data changes.</p>
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {string} name - Method name.
 * @param {Object} data - Data that needed.
 */
export function bindDir(vm: Vm, el: Element, name: string, data: object, isFirst?: boolean, isLast?: boolean, isSetContent?: boolean): void {
  if (!data) {
    return;
  }
  const keys = Object.keys(data);
  let i = keys.length;
  if (!i) {
    return;
  }
  let methodName = SETTERS[name];
  let method = el[methodName];
  const isSetStyle = methodName === 'setStyle';
  if (methodName === 'setIdStyle') {
    for (const id in el.idStyle) {
      el.idStyle[id] = '';
    }
  }
  if (name === 'tagStyle' || name === 'tagAndIdStyle') {
    let j: number = 0;
    let k: number = 0;
    let temp: string = null;
    for (j = 0; j < i - 1; j++) {
      for (k = 0; k < i - 1 - j; k++) {
        if (keys[k] > keys[k + 1]) {
          temp = keys[k + 1];
          keys[k + 1] = keys[k];
          keys[k] = temp;
        }
      }
    }
  }
  while (i--) {
    let key = keys[i];
    const value = data[key];
    if (name === 'tagStyle') {
      if (key.endsWith(':first-child') || key.endsWith(':last-child')) {
        methodName = SETTERS['firstOrLastChildStyle'];
      } else {
        methodName = SETTERS[name];
      }
      if (key.endsWith(':first-child') && isFirst) {
        key = key.replace(':first-child', '');
      } else if (key.endsWith(':last-child') && isLast) {
        key = key.replace(':last-child', '');
      }
      if (key === 'counterIncrement::before' || key === 'counterIncrement::after' || key === 'counterIncrement') {
        if (vm._counterMapping.has(value)) {
          let counter = vm.$getCounterMapping(value);
          vm.$setCounterMapping(value, ++counter);
        } else {
          vm.$setCounterMapping(value, 1);
        }
      }

      if (isSetContent && (key === 'content::before' || key === 'content::after')) {
        finallyItems = [];
        splitItems(value);
        const newValue = setContent(vm, el, key);
        methodName = SETTERS['attr'];
        method = el[methodName];
        method.call(el, 'value', newValue);
        continue;
      }
    }

    if (name === 'tagAndIdStyle') {
      const newValue = updateTagAndIdStyle(el, key, value);
      methodName = SETTERS['attr'];
      method = el[methodName];
      method.call(el, 'value', newValue);
      continue;
    }
    method = el[methodName];
    if (key === 'ref') {
      vm.$refs[value] = el;
    }
    const isSetFont = isSetStyle && key === 'fontFamily';
    const setValue = function(value) {
      if (isSetFont) {
        value = filterFontFamily(vm, value);
      }
      method.call(el, key, value);
    };
    if (typeof value === 'function') {
      bindKey(vm, el, setValue, value);
    } else {
      setValue(value);
    }
  }
}

/**
 * Bind data changes to a certain key to a name series in an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - ELement component.
 * @param {Function} setValue - Set value.
 * @param {Function} calc - Watch the calc and return a value by calc.call().
 */
function bindKey(vm: Vm, el: Element, setValue: Function, calc: Function): void {
  // Watch the calc, and returns a value by calc.call().
  const watcher = newWatch(vm, calc, (value) => {
    function handler() {
      setValue(value);
    }
    const differ = vm && vm._app && vm._app.differ;
    if (differ) {
      differ.append('element', el.ref, handler);
    } else {
      handler();
    }
  });
  el.watchers.push(watcher);
  setValue(watcher.value);
}

/**
 * FontFamily Filter.
 * @param {Vm} vm - Vm object.
 * @param {string} fontFamilyName - FontFamily name.
 * @return {*} FontFamily Filter.
 */
export function filterFontFamily(vm: Vm, fontFamilyName: string): any[] {
  const css = vm._css || {};
  return _getFontFamily(css, fontFamilyName);
}

/**
 * Watch the calc.
 * @param {Vm} vm - Vm object.
 * @param {Function} calc - Watch the calc, and returns a value by calc.call().
 * @param {Function} callback - Callback callback Function.
 * @return {Watcher} New watcher for rhe calc value.
 */
export function newWatch(vm: Vm, calc: Function, callback: Function): Watcher {
  const watcher = new Watcher(vm, calc, function(value, oldValue) {
    if (typeof value !== 'object' && value === oldValue) {
      return;
    }
    callback(value);
  }, null);
  return watcher;
}

/**
 * Watch a calc function and callback if the calc value changes.
 * @param {Vm} vm - Vm object.
 * @param {Function} calc - Watch the calc, and returns a value by calc.call().
 * @param {Function} callback - Callback callback Function.
 * @return {*} Watcher value.
 */
export function watch(vm: Vm, calc: Function, callback: Function): any {
  const watcher = new Watcher(vm, calc, function(value, oldValue) {
    if (typeof value !== 'object' && value === oldValue) {
      return;
    }
    callback(value);
  }, null);
  return watcher.value;
}

/**
 * Apply style to an element.
 * @param {Vm} vm - Vm object.
 * @param {Element} el - Element object.
 */
function applyStyle(vm: Vm, el: Element): void {
  const css = vm._css || {};
  const allStyle = el.style;
  setAnimation(allStyle, css);
}

/**
 * Check if it is an Array.
 * @param {*} params - Any value.
 * @return {boolean} Return true if it is an array. Otherwise return false.
 */
function isArray(params: any): params is Array<string> {
  return Array.isArray(params);
}

function splitItems(valueStr: string): void {
  let i: number;
  let item: string = '';
  let startQuote: boolean = false;
  const itemList: string[] = [];
  const len = valueStr.length;
  for (i = 0; i < len; i++) {
    if (!startQuote) {
      if (valueStr[i] === '"') {
        const itemLength = item.length;
        if (itemLength > 0) {
          const itemListLength = itemList.length;
          itemList[itemListLength] = item;
        }
        item = '"';
        startQuote = true;
        continue;
      } else {
        item = item + valueStr[i];
        if (i === len - 1) {
          const itemListLength = itemList.length;
          itemList[itemListLength] = item;
        }
        continue;
      }
    } else {
      if (valueStr[i] === '"') {
        item = item + valueStr[i];
        startQuote = false;
        const itemListLength = itemList.length;
        itemList[itemListLength] = item;
        item = '';
        continue;
      } else {
        item = item + valueStr[i];
        continue;
      }
    }
  }
  doSplitItem(itemList);
}

function doSplitItem(itemList: string[]): void {
  let i: number;
  const itemListLength = itemList.length;
  for (i = 0; i < itemListLength; i++) {
    let item = itemList[i].trim();
    if (item.indexOf('"') === 0) {
      item = item.replace('"', '');
      item = item.replace('"', '');
      const contentObject: ContentObject = {
        value: item,
        contentType: ContentType.CONTENT_STRING
      };
      const finallyItemsLength = finallyItems.length;
      finallyItems[finallyItemsLength] = contentObject;
    } else {
      splitItem(item.trim());
      if (finallyItems.length > 0) {
        continue;
      } else {
        return;
      }
    }
  }
}

function splitItem(item: string): void{
  if (item.length === 0) {
    return;
  }
  const finallyItemsLength = finallyItems.length;
  if (item.indexOf('open-quote') === 0) {
    const subItem = item.substr(0, 10);
    const contentObject: ContentObject = {
      value: subItem,
      contentType: ContentType.CONTENT_OPEN_QUOTE
    };
    finallyItems[finallyItemsLength] = contentObject;
    splitItem(item.substr(10).trim());
  } else if (item.indexOf('close-quote') === 0) {
    const subItem = item.substr(0, 11);
    const contentObject: ContentObject = {
      value: subItem,
      contentType: ContentType.CONTENT_CLOSE_QUOTE
    };
    finallyItems[finallyItemsLength] = contentObject;
    splitItem(item.substr(11).trim());
  } else if (item.indexOf('attr') === 0) {
    const fromIndex = item.indexOf('(');
    const toIndex = item.indexOf(')');
    const subLen = toIndex - fromIndex - 1;
    const subItem = item.substr(fromIndex + 1, subLen).trim();
    const contentObject: ContentObject = {
      value: subItem,
      contentType: ContentType.CONTENT_ATTR
    };
    finallyItems[finallyItemsLength] = contentObject;
    splitItem(item.substr(toIndex + 1).trim());
  } else if (item.indexOf('counter') === 0) {
    const toIndex = item.indexOf(')');
    const subItem = item.substr(0, toIndex + 1).trim();
    const contentObject: ContentObject = {
      value: subItem,
      contentType: ContentType.CONTENT_COUNTER
    };
    finallyItems[finallyItemsLength] = contentObject;
    splitItem(item.substr(toIndex + 1).trim());
  } else {
    finallyItems = [];
  }
}

function setContent(vm: Vm, el: Element, key: string): string {
  const itemLength = finallyItems.length;
  let contentValue = '';
  let newValue = '';
  if (itemLength > 0) {
    let i: number;
    for (i = 0; i < itemLength; i++) {
      const contentType = finallyItems[i].contentType;
      switch (contentType) {
        case ContentType.CONTENT_STRING:
          contentValue = contentValue + getContentString(finallyItems[i].value);
          break;
        case ContentType.CONTENT_OPEN_QUOTE:
          contentValue = contentValue + getContentOpenQuote(el, key);
          break;
        case ContentType.CONTENT_CLOSE_QUOTE:
          contentValue = contentValue + getContentCloseQuote(el, key);
          break;
        case ContentType.CONTENT_ATTR:
          contentValue = contentValue + getContentAttr(el, finallyItems[i].value);
          break;
        case ContentType.CONTENT_COUNTER:
          contentValue = contentValue + getCounter(vm, el, finallyItems[i].value);
          break;
      }
    }
    const oldValue = el.attr['value'];
    if (key === 'content::before') {
      newValue = contentValue + oldValue;
    } else if (key === 'content::after') {
      newValue = oldValue + contentValue;
    }
  }
  return newValue;
}

function getContentString(value: string): string {
  let contentValue = value.replace('\"', '');
  contentValue = contentValue.replace('\"', '');
  return contentValue;
}

function getContentOpenQuote(el: Element, key: string): string {
  let contentValue = '';
  if (el.isOpen) {
    contentValue = '\'';
  } else {
    contentValue = '\"';
    el.isOpen = true;
  }
  if (key === 'content::before') {
    el.hasBefore = true;
  }
  return contentValue;
}

function getContentCloseQuote(el: Element, key: string): string {
  let contentValue = '';
  if (el.isOpen) {
    contentValue = '\"';
  } else {
    contentValue = '';
  }
  if (el.isOpen && key === 'content::after') {
    el.hasAfter = true;
  }
  return contentValue;
}

function getContentAttr(el: Element, value: string): string {
  let contentValue = el.attr[value];
  if (contentValue === undefined) {
    contentValue = '';
  }
  return contentValue;
}

function getCounter(vm: Vm, el: Element, key: string): string {
  const fromIndex = key.indexOf('(');
  const toIndex = key.indexOf(')');
  const counterName = key.substr(fromIndex + 1, toIndex - fromIndex - 1);
  if (vm._counterMapping.has(counterName)) {
    return vm.$getCounterMapping(counterName) + '';
  }
  return '';
}

function updateTagAndIdStyle(el: Element, key: string, value: string): string {
  let newValue = '';
  let contentValue = '';
  let oldValue = el.attr['value'];
  if (key === 'content::before') {
    if (value === 'open-quote' || value === 'close-quote') {
      if (value === 'open-quote' && key === 'content::before') {
        contentValue = '\"';
        if (el.hasBefore) {
          oldValue = oldValue.substr(1, oldValue.length);
        }
        newValue = contentValue + oldValue;
        oldValue = newValue;
      } else if (el.hasBefore && value === 'close-quote' && key === 'content::before') {
        el.hasBefore = false;
        oldValue = oldValue.substr(1, oldValue.length);
        newValue = oldValue;
      }
    }
  } else if (key === 'content::after') {
    if (value === 'open-quote' && key === 'content::after') {
      contentValue = '\"';
      if (el.hasBefore) {
        contentValue = '\'';
      }
      if (el.hasAfter) {
        oldValue = oldValue.substr(0, oldValue.length - 1);
      }
      newValue = oldValue + contentValue;
    } else if (value === 'close-quote' && key === 'content::after' && el.hasBefore) {
      contentValue = '\"';
      if (el.hasAfter) {
        oldValue = oldValue.substr(0, oldValue.length - 1);
      }
      newValue = oldValue + contentValue;
    }
  }
  if (value === 'no-open-quote' || value === 'no-close-quote') {
    newValue = oldValue;
    if (key === 'content::before' && value === 'no-open-quote') {
      if (el.hasBefore) {
        newValue = oldValue.substr(1);
      }
    }
    if (key === 'content::after') {
      if (el.hasAfter) {
        newValue = oldValue.substr(0, oldValue.length - 1);
      }
    }
  }
  return newValue;
}

export function setAttributeStyle(vm: Vm, el: Element): void {
  const css = vm._css;
  if (css) {
    const keys = Object.keys(css);
    if (keys !== undefined || keys !== null) {
      const i = keys.length;
      let j: number = 0;
      for (j; j < i; j++) {
        let cssKey = keys[j].trim();
        if (cssKey.indexOf('[') === 0) {
          cssKey = cssKey.substr(1, cssKey.length - 2);
          const equalIndex = cssKey.indexOf('=');
          if (equalIndex !== -1) {
            const attrId = cssKey.substr(0, equalIndex).trim();
            let attrValue = cssKey.substr(equalIndex + 1).trim();
            if (attrValue.indexOf('\"') !== -1) {
              attrValue = attrValue.replace('"', '').trim();
              attrValue = attrValue.replace('"', '').trim();
            }
            const elValue = el.attr[attrId];
            if (elValue !== undefined && elValue === attrValue) {
              const newKey = keys[j];
              bindDir(vm, el, 'attrStyle', css[newKey]);
            }
          }
        }
      }
    }
  }
}

function setCounterValue(vm: Vm, key: string, value: string): void {
  if (key === 'counterReset') {
    vm.$setCounterMapping(value, 0);
  }
  if (key === 'counterIncrement') {
    if (vm._counterMapping.has(value)) {
      let counter = vm.$getCounterMapping(value);
      vm.$setCounterMapping(value, ++counter);
    } else {
      vm.$setCounterMapping(value, 1);
    }
  }
}

