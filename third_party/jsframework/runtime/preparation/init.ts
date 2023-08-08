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
 * 2021.01.08 - Rewrite the function 'initFramework' and make it simpler.
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 */

import service from './service';
import i18n from '../main/extend/i18n/index';
import dpi from '../main/extend/dpi/index';
import { Log } from '../utils/utils';
import { Options } from '../main/app';
import globalApi from './methods';
import NativeElementClassFactory from '../vdom/NativeElementClassFactory';

export interface GlobalInterface {
  createInstance: (id: string, code: string, config: Options, data: object) => any | Error;
  registerModules: (modules: object) => void;
  appDestroy: (packageName: string) => void;
  appShow: (packageName: string) => void;
  appHide: (packageName: string) => void;
  appError: (packageName: string, errors: any) => void;
  destroyInstance: (pageId: string) => any | Error;
  getRoot: (...args: any[]) => any | Error;
  callJS: (pageId: string, tasks: any[]) => any | Error;
}

/**
 * Setup framework: register services and initialize the global methods.
 */
export function initFramework(): void {
  for (const serviceName in i18n) {
    service.register(serviceName, i18n[serviceName]);
  }
  for (const serviceName in dpi) {
    service.register(serviceName, dpi[serviceName]);
  }

  const globalMethods: GlobalInterface = {
    'createInstance': globalApi.createInstance,
    'registerModules': globalApi.registerModules,
    'appDestroy': globalApi.appDestroy,
    'appError': globalApi.appError,
    'appShow': globalApi.appShow,
    'appHide': globalApi.appHide,
    'destroyInstance': globalApi.destroyInstance,
    'getRoot': globalApi.getRoot,
    'callJS': globalApi.callJS
  };

  // registerModules and registerComponents
  ModulesInfo.forEach(modules => {
    globalMethods['registerModules'](modules);
  });

  ComponentsInfo.forEach((name) => {
    if (name && name.type && name.methods) {
      NativeElementClassFactory.createNativeElementClass(
        name.type,
        name.methods
      );
    }
  });

  for (const methodName in globalMethods) {
    global[methodName] = (...args: any) => {
      const res: any = globalMethods[methodName](...args);
      if (res instanceof Error) {
        Log.error(res.toString());
      }
      return res;
    };
  }
}

const ModulesInfo: Record<string, string[]>[] = [
  {'system.router': ['push', 'replace', 'back', 'clear', 'getLength', 'getState', 'enableAlertBeforeBackPage', 'disableAlertBeforeBackPage', 'getParams']},
  {'system.app': ['getInfo', 'getPackageInfo', 'terminate', 'requestFullWindow', 'screenOnVisible', 'setSwipeToDismiss']},
  {'system.prompt': ['showToast', 'showDialog', 'showActionMenu']},
  {'system.configuration': ['getLocale']},
  {'timer': ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']},
  {'system.image': ['getImage']},
  {'system.offscreenCanvas': ['create']},
  {'system.device': ['getInfo']},
  {'system.grid': ['getSystemLayoutInfo']},
  {'system.mediaquery': ['addListener', 'getDeviceType']},
  {'animation': ['requestAnimationFrame', 'cancelAnimationFrame']},
  {'system.resource': ['readText']},
  {'ohos.animator': ['createAnimator', 'create']}
];

type components<T> = {
  'methods': T[],
  'type': T
}

const CommanMethods: Array<string> = ['focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'];

const ComponentsInfo: components<string>[] = [
  { 'methods': CommanMethods, 'type': 'clock' },
  { 'methods': ['show'], 'type': 'colorpicker' },
  { 'methods': CommanMethods, 'type': 'image' },
  { 'methods': CommanMethods, 'type': 'label' },
  { 'methods': CommanMethods, 'type': 'list-item' },
  { 'methods': CommanMethods, 'type': 'list-item-group' },
  { 'methods': CommanMethods, 'type': 'progress' },
  { 'methods': CommanMethods, 'type': 'rating' },
  { 'methods': CommanMethods, 'type': 'select' },
  { 'methods': CommanMethods, 'type': 'switch' },
  { 'methods': CommanMethods, 'type': 'tabs' },
  { 'methods': CommanMethods, 'type': 'tab-bar' },
  { 'methods': CommanMethods, 'type': 'tab-content' },
  { 'methods': CommanMethods, 'type': 'text' },
  { 'methods': CommanMethods, 'type': 'div' },
  { 'methods': CommanMethods, 'type': 'badge' },
  {
    'methods': ['setProgress', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'button'
  },
  { 'methods': ['append', 'focus', 'addChild', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'], 'type': 'chart' },
  { 'methods': ['goto', 'focus', 'addChild', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'], 'type': 'calendar' },
  {
    'methods': ['getContext', 'toDataURL', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'canvas'
  },
  {
    'methods': ['getXComponentContext', 'createIntersectionObserver', 'addChild', 'getXComponentSurfaceId', 'setXComponentSurfaceSize'],
    'type': 'xcomponent'
  },
  { 'methods': ['show', 'close', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver', 'addChild'], 'type': 'dialog' },
  { 'methods': ['animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver', 'addChild'], 'type': 'divider' },
  {
    'methods': ['getColumns', 'getColumnWidth', 'getGutterWidth', 'getSizeType', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver', 'addChild'],
    'type': 'grid-container'
  },
  {
    'methods': ['start', 'stop', 'pause', 'resume', 'getState', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'image-animator'
  },
  {
    'methods': ['showError', 'insert', 'delete', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'input'
  },
  {
    'methods': ['scrollTo', 'scrollBy', 'focus', 'addChild', 'scrollArrow', 'scrollTop', 'scrollBottom', 'scrollPage', 'collapseGroup', 'expandGroup', 'currentOffset', 'rotation', 'animate', 'chainanimation', 'getBoundingClientRect', 'getInspector', 'getScrollOffset', 'createIntersectionObserver'],
    'type': 'list'
  },
  {
    'methods': ['start', 'stop', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'marquee'
  },
  { 'methods': ['show', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver', 'addChild'], 'type': 'menu' },
  { 'methods': CommanMethods, 'type': 'option' },
  { 'methods': ['show', 'close', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver', 'addChild'], 'type': 'panel' },
  { 'methods': ['show', 'animate', 'focus', 'addChild', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'], 'type': 'picker' },
  {
    'methods': ['rotation', 'animate', 'focus', 'addChild', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'picker-view'
  },
  { 'methods': CommanMethods, 'type': 'piece' },
  { 'methods': ['focus', 'addChild', 'show', 'hide', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'], 'type': 'popup' },
  { 'methods': ['animate', 'focus', 'addChild', 'delete', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'], 'type': 'search' },
  {
    'methods': ['rotation', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'slider'
  },
  { 'methods': ['focus', 'addChild', 'animate', 'getScrollOffset', 'scrollBy', 'getBoundingClientRect', 'getInspector', 'scrollTo', 'createIntersectionObserver'], 'type': 'stack' },
  {
    'methods': ['swipeTo', 'focus', 'addChild', 'showPrevious', 'showNext', 'rotation', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'swiper'
  },
  {
    'methods': ['start', 'pause', 'stop', 'setCurrentTime', 'requestFullscreen', 'exitFullscreen', 'focus', 'addChild', 'animate', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'video'
  },
  {
    'methods': ['setNextButtonStatus', 'focus', 'addChild', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'stepper'
  },
  {
    'methods': ['focus', 'addChild', 'animate', 'delete', 'getBoundingClientRect', 'getInspector', 'scrollBy', 'getScrollOffset', 'scrollTo', 'createIntersectionObserver'],
    'type': 'textarea'
  },
  { 'methods': ['reload', 'createIntersectionObserver', 'addChild'], 'type': 'web' },
  {
    'methods': ['takePhoto', 'startRecorder', 'closeRecorder', 'scrollTo', 'createIntersectionObserver', 'addChild'],
    'type': 'camera'
  },
  { 'methods': ['getInspector'], 'type': 'toolbar' },
  { 'methods': ['getInspector'], 'type': 'toolbar-item' }
];
