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

export function mockwebgl() {
  const WebGLContextAttributes = {
    brightness: '[PC preview] unknow brightness',
    alpha: '[PC preview] unknow alpha',
    depth: '[PC preview] unknow depth',
    stencil: '[PC preview] unknow stencil',
    antialias: '[PC preview] unknow antialias',
    premultipliedAlpha: '[PC preview] unknow premultipliedAlpha',
    preserveDrawingBuffer: '[PC preview] unknow preserveDrawingBuffer',
    powerPreference: '[PC preview] unknow powerPreference',
    failIfMajorPerformanceCaveat: '[PC preview] unknow failIfMajorPerformanceCaveat',
    desynchronized: '[PC preview] unknow desynchronized'
  }
  const float32ArrayWith2val = [
    paramMock.paramNumberMock, paramMock.paramNumberMock
  ]

  const float32ArrayWith4val = [
    paramMock.paramNumberMock, paramMock.paramNumberMock, paramMock.paramNumberMock, paramMock.paramNumberMock
  ]
  const int32ArrayWith2ele = [
    paramMock.paramNumberMock, paramMock.paramNumberMock
  ]
  const int32ArrayWith4ele = [
    paramMock.paramNumberMock, paramMock.paramNumberMock, paramMock.paramNumberMock, paramMock.paramNumberMock
  ]
  const WebGLShaderArray = [
    WebGLShader, WebGLShader, WebGLShader
  ]
  const WebGLBuffer = {
  }
  const WebGLFramebuffer = {
  }
  const WebGLProgram = {
  }
  const WebGLRenderbuffer = {
  }
  const WebGLShader = {
  }
  const WebGLTexture = {
  }
  const WebGLUniformLocation = {
  }
  const WebGLActiveInfo = {
    size: '[PC preview] unknow size',
    type: '[PC preview] unknow type',
    name: '[PC preview] unknow name'
  }
  const WebGLShaderPrecisionFormat = {
    rangeMin: '[PC preview] unknow rangeMin',
    rangeMax: '[PC preview] unknow rangeMax',
    precision: '[PC preview] unknow precision'
  }
  const glParamMock = {
    paramDoubleMock: '[PC Preview] unknow double',
    paramAnyMock: '[PC Preview] unknow any',
    stringArray: '[PC preview] unknow stringArray',
    uint32Array: '[PC preview] unknow uint32Array',
    glBooleanArray: '[PC preview] unknow glBooleanArray',
    WebGLShaderArray: '[PC preview] unknow WebGLShaderArray',
  }
  const WebGLRenderingContext = {
      DEPTH_BUFFER_BIT: 0x00000100,
      STENCIL_BUFFER_BIT: 0x00000400,
      COLOR_BUFFER_BIT: 0x00004000,
      POINTS: 0x0000,
      LINES: 0x0001,
      LINE_LOOP: 0x0002,
      LINE_STRIP: 0x0003,
      TRIANGLES: 0x0004,
      TRIANGLE_STRIP: 0x0005,
      TRIANGLE_FAN: 0x0006,
      ZERO: 0,
      ONE: 1,
      SRC_COLOR: 0x0300,
      ONE_MINUS_SRC_COLOR: 0x0301,
      SRC_ALPHA: 0x0302,
      ONE_MINUS_SRC_ALPHA: 0x0303,
      DST_ALPHA: 0x0304,
      ONE_MINUS_DST_ALPHA: 0x0305,
      DST_COLOR: 0x0306,
      ONE_MINUS_DST_COLOR: 0x0307,
      SRC_ALPHA_SATURATE: 0x0308,
      FUNC_ADD: 0x8006,
      BLEND_EQUATION: 0x8009,
      BLEND_EQUATION_RGB: 0x8009,
      BLEND_EQUATION_ALPHA: 0x883D,
      FUNC_SUBTRACT: 0x800A,
      FUNC_REVERSE_SUBTRACT: 0x800B,
      BLEND_DST_RGB: 0x80C8,
      BLEND_SRC_RGB: 0x80C9,
      BLEND_DST_ALPHA: 0x80CA,
      BLEND_SRC_ALPHA: 0x80CB,
      CONSTANT_COLOR: 0x8001,
      ONE_MINUS_CONSTANT_COLOR: 0x8002,
      CONSTANT_ALPHA: 0x8003,
      ONE_MINUS_CONSTANT_ALPHA: 0x8004,
      BLEND_COLOR: 0x8005,
      ARRAY_BUFFER: 0x8892,
      ELEMENT_ARRAY_BUFFER: 0x8893,
      ARRAY_BUFFER_BINDING: 0x8894,
      ELEMENT_ARRAY_BUFFER_BINDING: 0x8895,
      STREAM_DRAW: 0x88E0,
      STATIC_DRAW: 0x88E4,
      DYNAMIC_DRAW: 0x88E8,
      BUFFER_SIZE: 0x8764,
      BUFFER_USAGE: 0x8765,
      CURRENT_VERTEX_ATTRIB: 0x8626,
      FRONT: 0x0404,
      BACK: 0x0405,
      FRONT_AND_BACK: 0x0408,
      CULL_FACE: 0x0B44,
      BLEND: 0x0BE2,
      DITHER: 0x0BD0,
      STENCIL_TEST: 0x0B90,
      DEPTH_TEST: 0x0B71,
      SCISSOR_TEST: 0x0C11,
      POLYGON_OFFSET_FILL: 0x8037,
      SAMPLE_ALPHA_TO_COVERAGE: 0x809E,
      SAMPLE_COVERAGE: 0x80A0,
      NO_ERROR: 0,
      INVALID_ENUM: 0x0500,
      INVALID_VALUE: 0x0501,
      INVALID_OPERATION: 0x0502,
      OUT_OF_MEMORY: 0x0505,
      CW: 0x0900,
      CCW: 0x0901,
      LINE_WIDTH: 0x0B21,
      ALIASED_POINT_SIZE_RANGE: 0x846D,
      ALIASED_LINE_WIDTH_RANGE: 0x846E,
      CULL_FACE_MODE: 0x0B45,
      FRONT_FACE: 0x0B46,
      DEPTH_RANGE: 0x0B70,
      DEPTH_WRITEMASK: 0x0B72,
      DEPTH_CLEAR_VALUE: 0x0B73,
      DEPTH_FUNC: 0x0B74,
      STENCIL_CLEAR_VALUE: 0x0B91,
      STENCIL_FUNC: 0x0B92,
      STENCIL_FAIL: 0x0B94,
      STENCIL_PASS_DEPTH_FAIL: 0x0B95,
      STENCIL_PASS_DEPTH_PASS: 0x0B96,
      STENCIL_REF: 0x0B97,
      STENCIL_VALUE_MASK: 0x0B93,
      STENCIL_WRITEMASK: 0x0B98,
      STENCIL_BACK_FUNC: 0x8800,
      STENCIL_BACK_FAIL: 0x8801,
      STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
      STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
      STENCIL_BACK_REF: 0x8CA3,
      STENCIL_BACK_VALUE_MASK: 0x8CA4,
      STENCIL_BACK_WRITEMASK: 0x8CA5,
      VIEWPORT: 0x0BA2,
      SCISSOR_BOX: 0x0C10,
      COLOR_CLEAR_VALUE: 0x0C22,
      COLOR_WRITEMASK: 0x0C23,
      UNPACK_ALIGNMENT: 0x0CF5,
      PACK_ALIGNMENT: 0x0D05,
      MAX_TEXTURE_SIZE: 0x0D33,
      MAX_VIEWPORT_DIMS: 0x0D3A,
      SUBPIXEL_BITS: 0x0D50,
      RED_BITS: 0x0D52,
      GREEN_BITS: 0x0D53,
      BLUE_BITS: 0x0D54,
      ALPHA_BITS: 0x0D55,
      DEPTH_BITS: 0x0D56,
      STENCIL_BITS: 0x0D57,
      POLYGON_OFFSET_UNITS: 0x2A00,
      POLYGON_OFFSET_FACTOR: 0x8038,
      TEXTURE_BINDING_2D: 0x8069,
      SAMPLE_BUFFERS: 0x80A8,
      SAMPLES: 0x80A9,
      SAMPLE_COVERAGE_VALUE: 0x80AA,
      SAMPLE_COVERAGE_INVERT: 0x80AB,
      COMPRESSED_TEXTURE_FORMATS: 0x86A3,
      DONT_CARE: 0x1100,
      FASTEST: 0x1101,
      NICEST: 0x1102,
      GENERATE_MIPMAP_HINT: 0x8192,
      BYTE: 0x1400,
      UNSIGNED_BYTE: 0x1401,
      SHORT: 0x1402,
      UNSIGNED_SHORT: 0x1403,
      INT: 0x1404,
      UNSIGNED_INT: 0x1405,
      FLOAT: 0x1406,
      DEPTH_COMPONENT: 0x1902,
      ALPHA: 0x1906,
      RGB: 0x1907,
      RGBA: 0x1908,
      LUMINANCE: 0x1909,
      LUMINANCE_ALPHA: 0x190A,
      UNSIGNED_SHORT_4_4_4_4: 0x8033,
      UNSIGNED_SHORT_5_5_5_1: 0x8034,
      UNSIGNED_SHORT_5_6_5: 0x8363,
      FRAGMENT_SHADER: 0x8B30,
      VERTEX_SHADER: 0x8B31,
      MAX_VERTEX_ATTRIBS: 0x8869,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8DFB,
      MAX_VARYING_VECTORS: 0x8DFC,
      MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8B4D,
      MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8B4C,
      MAX_TEXTURE_IMAGE_UNITS: 0x8872,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD,
      SHADER_TYPE: 0x8B4F,
      DELETE_STATUS: 0x8B80,
      LINK_STATUS: 0x8B82,
      VALIDATE_STATUS: 0x8B83,
      ATTACHED_SHADERS: 0x8B85,
      ACTIVE_UNIFORMS: 0x8B86,
      ACTIVE_ATTRIBUTES: 0x8B89,
      SHADING_LANGUAGE_VERSION: 0x8B8C,
      CURRENT_PROGRAM: 0x8B8D,
      NEVER: 0x0200,
      LESS: 0x0201,
      EQUAL: 0x0202,
      LEQUAL: 0x0203,
      GREATER: 0x0204,
      NOTEQUAL: 0x0205,
      GEQUAL: 0x0206,
      ALWAYS: 0x0207,
      KEEP: 0x1E00,
      REPLACE: 0x1E01,
      INCR: 0x1E02,
      DECR: 0x1E03,
      INVERT: 0x150A,
      INCR_WRAP: 0x8507,
      DECR_WRAP: 0x8508,
      VENDOR: 0x1F00,
      RENDERER: 0x1F01,
      VERSION: 0x1F02,
      NEAREST: 0x2600,
      LINEAR: 0x2601,
      NEAREST_MIPMAP_NEAREST: 0x2700,
      LINEAR_MIPMAP_NEAREST: 0x2701,
      NEAREST_MIPMAP_LINEAR: 0x2702,
      LINEAR_MIPMAP_LINEAR: 0x2703,
      TEXTURE_MAG_FILTER: 0x2800,
      TEXTURE_MIN_FILTER: 0x2801,
      TEXTURE_WRAP_S: 0x2802,
      TEXTURE_WRAP_T: 0x2803,
      TEXTURE_2D: 0x0DE1,
      TEXTURE: 0x1702,
      TEXTURE_CUBE_MAP: 0x8513,
      TEXTURE_BINDING_CUBE_MAP: 0x8514,
      TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
      TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
      TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
      TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
      TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
      TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,
      MAX_CUBE_MAP_TEXTURE_SIZE: 0x851C,
      TEXTURE0: 0x84C0,
      TEXTURE1: 0x84C1,
      TEXTURE2: 0x84C2,
      TEXTURE3: 0x84C3,
      TEXTURE4: 0x84C4,
      TEXTURE5: 0x84C5,
      TEXTURE6: 0x84C6,
      TEXTURE7: 0x84C7,
      TEXTURE8: 0x84C8,
      TEXTURE9: 0x84C9,
      TEXTURE10: 0x84CA,
      TEXTURE11: 0x84CB,
      TEXTURE12: 0x84CC,
      TEXTURE13: 0x84CD,
      TEXTURE14: 0x84CE,
      TEXTURE15: 0x84CF,
      TEXTURE16: 0x84D0,
      TEXTURE17: 0x84D1,
      TEXTURE18: 0x84D2,
      TEXTURE19: 0x84D3,
      TEXTURE20: 0x84D4,
      TEXTURE21: 0x84D5,
      TEXTURE22: 0x84D6,
      TEXTURE23: 0x84D7,
      TEXTURE24: 0x84D8,
      TEXTURE25: 0x84D9,
      TEXTURE26: 0x84DA,
      TEXTURE27: 0x84DB,
      TEXTURE28: 0x84DC,
      TEXTURE29: 0x84DD,
      TEXTURE30: 0x84DE,
      TEXTURE31: 0x84DF,
      ACTIVE_TEXTURE: 0x84E0,
      REPEAT: 0x2901,
      CLAMP_TO_EDGE: 0x812F,
      MIRRORED_REPEAT: 0x8370,
      FLOAT_VEC2: 0x8B50,
      FLOAT_VEC3: 0x8B51,
      FLOAT_VEC4: 0x8B52,
      INT_VEC2: 0x8B53,
      INT_VEC3: 0x8B54,
      INT_VEC4: 0x8B55,
      BOOL: 0x8B56,
      BOOL_VEC2: 0x8B57,
      BOOL_VEC3: 0x8B58,
      BOOL_VEC4: 0x8B59,
      FLOAT_MAT2: 0x8B5A,
      FLOAT_MAT3: 0x8B5B,
      FLOAT_MAT4: 0x8B5C,
      SAMPLER_2D: 0x8B5E,
      SAMPLER_CUBE: 0x8B60,
      VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
      VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
      VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
      VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
      VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886A,
      VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
      VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889F,
      IMPLEMENTATION_COLOR_READ_TYPE: 0x8B9A,
      IMPLEMENTATION_COLOR_READ_FORMAT: 0x8B9B,
      COMPILE_STATUS: 0x8B81,
      LOW_FLOAT: 0x8DF0,
      MEDIUM_FLOAT: 0x8DF1,
      HIGH_FLOAT: 0x8DF2,
      LOW_INT: 0x8DF3,
      MEDIUM_INT: 0x8DF4,
      HIGH_INT: 0x8DF5,
      FRAMEBUFFER: 0x8D40,
      RENDERBUFFER: 0x8D41,
      RGBA4: 0x8056,
      RGB5_A1: 0x8057,
      RGB565: 0x8D62,
      DEPTH_COMPONENT16: 0x81A5,
      STENCIL_INDEX8: 0x8D48,
      DEPTH_STENCIL: 0x84F9,
      RENDERBUFFER_WIDTH: 0x8D42,
      RENDERBUFFER_HEIGHT: 0x8D43,
      RENDERBUFFER_INTERNAL_FORMAT: 0x8D44,
      RENDERBUFFER_RED_SIZE: 0x8D50,
      RENDERBUFFER_GREEN_SIZE: 0x8D51,
      RENDERBUFFER_BLUE_SIZE: 0x8D52,
      RENDERBUFFER_ALPHA_SIZE: 0x8D53,
      RENDERBUFFER_DEPTH_SIZE: 0x8D54,
      RENDERBUFFER_STENCIL_SIZE: 0x8D55,
      FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8CD0,
      FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8CD1,
      FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8CD2,
      FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8CD3,
      COLOR_ATTACHMENT0: 0x8CE0,
      DEPTH_ATTACHMENT: 0x8D00,
      STENCIL_ATTACHMENT: 0x8D20,
      DEPTH_STENCIL_ATTACHMENT: 0x821A,
      NONE: 0,
      FRAMEBUFFER_COMPLETE: 0x8CD5,
      FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8CD6,
      FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8CD7,
      FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8CD9,
      FRAMEBUFFER_UNSUPPORTED: 0x8CDD,
      FRAMEBUFFER_BINDING: 0x8CA6,
      RENDERBUFFER_BINDING: 0x8CA7,
      MAX_RENDERBUFFER_SIZE: 0x84E8,
      INVALID_FRAMEBUFFER_OPERATION: 0x0506,
      UNPACK_FLIP_Y_WEBGL: 0x9240,
      UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
      CONTEXT_LOST_WEBGL: 0x9242,
      UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
      BROWSER_DEFAULT_WEBGL: 0x9244,
      canvas: '[PC preview] unknow canvas',
      drawingBufferWidth:'[PC preview] unknow drawingBufferWidth',
      drawingBufferHeight:'[PC preview] unknow drawingBufferHeight',
    getContextAttributes: function (...args) {
      console.warn("WebGLRenderingContext.getContextAttributes interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLContextAttributes
    },
    isContextLost: function (...args) {
      console.warn("WebGLRenderingContext.isContextLost interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    },
    getSupportedExtensions: function (...args) {
      console.warn("WebGLRenderingContext.getSupportedExtensions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.stringArray
    },
    getExtension: function (...args) {
      console.warn("WebGLRenderingContext.getExtension interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock
    },
    activeTexture: function (...args) {
      console.warn("WebGLRenderingContext.activeTexture interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    attachShader: function (...args) {
      console.warn("WebGLRenderingContext.attachShader interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindAttribLocation: function (...args) {
      console.warn("WebGLRenderingContext.bindAttribLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindBuffer: function (...args) {
      console.warn("WebGLRenderingContext.bindBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindFramebuffer: function (...args) {
      console.warn("WebGLRenderingContext.bindFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindRenderbuffer: function (...args) {
      console.warn("WebGLRenderingContext.bindRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindTexture: function (...args) {
      console.warn("WebGLRenderingContext.bindTexture interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    blendColor: function (...args) {
      console.warn("WebGLRenderingContext.blendColor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    blendEquation: function (...args) {
      console.warn("WebGLRenderingContext.blendEquation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    blendEquationSeparate: function (...args) {
      console.warn("WebGLRenderingContext.blendEquationSeparate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    blendFunc: function (...args) {
      console.warn("WebGLRenderingContext.blendFunc interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    blendFuncSeparate: function (...args) {
      console.warn("WebGLRenderingContext.blendFuncSeparate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    checkFramebufferStatus: function (...args) {
      console.warn("WebGLRenderingContext.checkFramebufferStatus interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    clear: function (...args) {
      console.warn("WebGLRenderingContext.clear interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearColor: function (...args) {
      console.warn("WebGLRenderingContext.clearColor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearDepth: function (...args) {
      console.warn("WebGLRenderingContext.clearDepth interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearStencil: function (...args) {
      console.warn("WebGLRenderingContext.clearStencil interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    colorMask: function (...args) {
      console.warn("WebGLRenderingContext.colorMask interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compileShader: function (...args) {
      console.warn("WebGLRenderingContext.compileShader interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    copyTexImage2D: function (...args) {
      console.warn("WebGLRenderingContext.copyTexImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    copyTexSubImage2D: function (...args) {
      console.warn("WebGLRenderingContext.copyTexSubImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    createBuffer: function (...args) {
      console.warn("WebGLRenderingContext.createBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLBuffer;
    },
    createFramebuffer: function (...args) {
      console.warn("WebGLRenderingContext.createFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLFramebuffer;
    },
    createProgram: function (...args) {
      console.warn("WebGLRenderingContext.createProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLProgram;
    },
    createRenderbuffer: function (...args) {
      console.warn("WebGLRenderingContext.createRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLRenderbuffer;
    },
    createShader: function (...args) {
      console.warn("WebGLRenderingContext.createShader interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLShader;
    },
    createTexture: function (...args) {
      console.warn("WebGLRenderingContext.createTexture interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLTexture;
    },
    cullFace: function (...args) {
      console.warn("WebGLRenderingContext.cullFace interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteBuffer: function (...args) {
      console.warn("WebGLRenderingContext.deleteBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteFramebuffer: function (...args) {
      console.warn("WebGLRenderingContext.deleteFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteProgram: function (...args) {
      console.warn("WebGLRenderingContext.deleteProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    deleteRenderbuffer: function (...args) {
      console.warn("WebGLRenderingContext.deleteRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteShader: function (...args) {
      console.warn("WebGLRenderingContext.deleteRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    deleteTexture: function (...args) {
      console.warn("WebGLRenderingContext.deleteRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    depthFunc: function (...args) {
      console.warn("WebGLRenderingContext.deleteRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    depthMask: function (...args) {
      console.warn("WebGLRenderingContext.deleteRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    depthRange: function (...args) {
      console.warn("WebGLRenderingContext.depthRange interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    detachShader: function (...args) {
      console.warn("WebGLRenderingContext.detachShader interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    disable: function (...args) {
      console.warn("WebGLRenderingContext.disable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    disableVertexAttribArray: function (...args) {
      console.warn("WebGLRenderingContext.disableVertexAttribArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    drawArrays: function (...args) {
      console.warn("WebGLRenderingContext.drawArrays interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    drawElements: function (...args) {
      console.warn("WebGLRenderingContext.drawElements interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    enable: function (...args) {
      console.warn("WebGLRenderingContext.enable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    enableVertexAttribArray: function (...args) {
      console.warn("WebGLRenderingContext.enableVertexAttribArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    finish: function (...args) {
      console.warn("WebGLRenderingContext.finish interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    flush: function (...args) {
      console.warn("WebGLRenderingContext.flush interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    framebufferRenderbuffer: function (...args) {
      console.warn("WebGLRenderingContext.framebufferRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    framebufferTexture2D: function (...args) {
      console.warn("WebGLRenderingContext.framebufferTexture2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    frontFace: function (...args) {
      console.warn("WebGLRenderingContext.frontFace interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    generateMipmap: function (...args) {
      console.warn("WebGLRenderingContext.generateMipmap interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getActiveAttrib: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLActiveInfo;
    },
    getActiveUniform: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLActiveInfo;
    },
    getAttachedShaders: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.WebGLShaderArray;
    },
    getAttribLocation: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getBufferParameter: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getParameter: function (...args) {
      console.warn("WebGLRenderingContext.getActiveAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[0] == 0x0B73 || args[0] == 0x0B21 ||
        args[0] == 0x8038 || args[0] == 0x2A00 ||
        args[0] == 0x80AA) {
        return paramMock.paramNumberMock;
      } else if (args[0] == 0x8069 || args[0] == 0x8514) {
        return WebGLTexture;
      } else if (args[0] == 0x1F01 || args[0] == 0x8B8C ||
        args[0] == 0x1F00 || args[0] == 0x1F02) {
        return glParamMock.stringArray;
      } else if (args[0] == 0x8894 || args[0] == 0x8895) {
        return WebGLBuffer;
      } else if (args[0] == 0x8CA6) {
        return WebGLFramebuffer;
      } else if (args[0] == 0x8B8D) {
        return WebGLProgram;
      } else if (args[0] == 0x8CA7) {
        return WebGLRenderbuffer;
      } else if (args[0] == 0x846E || args[0] == 0x846D ||
        args[0] == 0x0B70) {
        return float32ArrayWith2val;
      } else if (args[0] == 0x0C22 || args[0] == 0x8005) {
        return float32ArrayWith4val;
      } else if (args[0] == 0x86A3) {
        return glParamMock.uint32Array;
      } else if (args[0] == 0x0D3A) {
        return int32ArrayWith2ele;
      } else if (args[0] == 0x0C10) {
        return int32ArrayWith4ele;
      } else if (args[0] == 0x0BE2 || args[0] == 0x0B44 || args[0] == 0x0B71 ||
        args[0] == 0x0B72 || args[0] == 0x0BD0 || args[0] == 0x8037 ||
        args[0] == 0x809E || args[0] == 0x80A0 ||
        args[0] == 0x80AB || args[0] == 0x0C11 || args[0] == 0x0B90 ||
        args[0] == 0x9240 ||
        args[0] == 0x9241) {
        return paramMock.paramBooleanMock;
      } else if (args[0] == 0x0C23) {
        return glParamMock.glBooleanArray;
      } else {
        return paramMock.paramNumberMock;
      }
    },
    getError: function (...args) {
      console.warn("WebGLRenderingContext.getError interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getFramebufferAttachmentParameter: function (...args) {
      console.warn("WebGLRenderingContext.getFramebufferAttachmentParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[2] == 0x8CD0 ||
        args[2] == 0x8CD2 ||
        args[2] == 0x8CD3 ||
        args[2] == 0x8215 ||
        args[2] == 0x8214 ||
        args[2] == 0x8210 ||
        args[2] == 0x8211 ||
        args[2] == 0x8216 ||
        args[2] == 0x8213 ||
        args[2] == 0x8212 ||
        args[2] == 0x8217 ||
        args[2] == 0x8CD4) {
        return paramMock.paramNumberMock;
      } else if (args[2] == 0x8CD1) {
        return paramMock.paramObjectMock;
      }
    },
    getProgramParameter: function (...args) {
      console.warn("WebGLRenderingContext.getProgramParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[1] == 0x8B80 || args[1] == 0x8B82 || args[1] == 0x8B83) {
        return paramMock.paramBooleanMock;
      } else {
        return paramMock.paramNumberMock;
      }
    },
    getProgramInfoLog: function (...args) {
      console.warn("WebGLRenderingContext.getProgramInfoLog interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getRenderbufferParameter: function (...args) {
      console.warn("WebGLRenderingContext.getRenderbufferParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },

    getShaderParameter: function (...args) {
      console.warn("WebGLRenderingContext.getShaderParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[1] == 0x8B4F) {
        return paramMock.paramNumberMock;
      } else {
        return paramMock.paramBooleanMock;
      }
    },
    getShaderPrecisionFormat: function (...args) {
      console.warn("WebGLRenderingContext.getShaderPrecisionFormat interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLShaderPrecisionFormat;
    },
    getShaderInfoLog: function (...args) {
      console.warn("WebGLRenderingContext.getShaderInfoLog interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getShaderSource: function (...args) {
      console.warn("WebGLRenderingContext.getShaderSource interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    getTexParameter: function (...args) {
      console.warn("WebGLRenderingContext.getTexParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[1] == 0x84FE) {
        return glParamMock.paramDoubleMock;
      } else {
        return paramMock.paramNumberMock;
      }
    },
    getUniform: function (...args) {
      console.warn("WebGLRenderingContext.getUniform interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock;
    },
    getUniformLocation: function (...args) {
      console.warn("WebGLRenderingContext.getUniformLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLUniformLocation;
    },
    getVertexAttrib: function (...args) {
      console.warn("WebGLRenderingContext.getVertexAttrib interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    getVertexAttribOffset: function (...args) {
      console.warn("WebGLRenderingContext.getVertexAttribOffset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    hint: function (...args) {
      console.warn("WebGLRenderingContext.hint interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    isBuffer: function (...args) {
      console.warn("WebGLRenderingContext.isBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isEnabled: function (...args) {
      console.warn("WebGLRenderingContext.isEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isFramebuffer: function (...args) {
      console.warn("WebGLRenderingContext.isFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isProgram: function (...args) {
      console.warn("WebGLRenderingContext.isProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isRenderbuffer: function (...args) {
      console.warn("WebGLRenderingContext.isRenderbuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    isShader: function (...args) {
      console.warn("WebGLRenderingContext.isShader interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    isTexture: function (...args) {
      console.warn("WebGLRenderingContext.isTexture interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    lineWidth: function (...args) {
      console.warn("WebGLRenderingContext.lineWidth interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    linkProgram: function (...args) {
      console.warn("WebGLRenderingContext.linkProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    pixelStorei: function (...args) {
      console.warn("WebGLRenderingContext.pixelStorei interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    polygonOffset: function (...args) {
      console.warn("WebGLRenderingContext.polygonOffset interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    renderbufferStorage: function (...args) {
      console.warn("WebGLRenderingContext.renderbufferStorage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    sampleCoverage: function (...args) {
      console.warn("WebGLRenderingContext.sampleCoverage interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    scissor: function (...args) {
      console.warn("WebGLRenderingContext.scissor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    shaderSource: function (...args) {
      console.warn("WebGLRenderingContext.shaderSource interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    stencilFunc: function (...args) {
      console.warn("WebGLRenderingContext.stencilFunc interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stencilFuncSeparate: function (...args) {
      console.warn("WebGLRenderingContext.stencilFuncSeparate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stencilMask: function (...args) {
      console.warn("WebGLRenderingContext.stencilMask interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stencilMaskSeparate: function (...args) {
      console.warn("WebGLRenderingContext.stencilMaskSeparate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    stencilOp: function (...args) {
      console.warn("WebGLRenderingContext.stencilOp interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    stencilOpSeparate: function (...args) {
      console.warn("WebGLRenderingContext.stencilOpSeparate interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texParameterf: function (...args) {
      console.warn("WebGLRenderingContext.texParameterf interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texParameteri: function (...args) {
      console.warn("WebGLRenderingContext.texParameteri interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1f: function (...args) {
      console.warn("WebGLRenderingContext.uniform1f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2f: function (...args) {
      console.warn("WebGLRenderingContext.uniform2f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    uniform3f: function (...args) {
      console.warn("WebGLRenderingContext.uniform3f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4f: function (...args) {
      console.warn("WebGLRenderingContext.uniform4f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1i: function (...args) {
      console.warn("WebGLRenderingContext.uniform1i interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2i: function (...args) {
      console.warn("WebGLRenderingContext.uniform2i interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3i: function (...args) {
      console.warn("WebGLRenderingContext.uniform3i interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    uniform4i: function (...args) {
      console.warn("WebGLRenderingContext.uniform4i interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    useProgram: function (...args) {
      console.warn("WebGLRenderingContext.useProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    validateProgram: function (...args) {
      console.warn("WebGLRenderingContext.validateProgram interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib1f: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib1f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib2f: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib2f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    vertexAttrib3f: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib3f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib4f: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib4f interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib1fv: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib1fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib2fv: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttrib3fv: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    vertexAttrib4fv: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribPointer: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttribPointer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    viewport: function (...args) {
      console.warn("WebGLRenderingContext.vertexAttrib3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    bufferData: function (...args) {
      console.warn("WebGLRenderingContext.bufferData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bufferSubData: function (...args) {
      console.warn("WebGLRenderingContext.bufferSubData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexImage2D: function (...args) {
      console.warn("WebGLRenderingContext.compressedTexImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexSubImage2D: function (...args) {
      console.warn("WebGLRenderingContext.compressedTexSubImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    readPixels: function (...args) {
      console.warn("WebGLRenderingContext.readPixels interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    texImage2D: function (...args) {
      console.warn("WebGLRenderingContext.texImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texSubImage2D: function (...args) {
      console.warn("WebGLRenderingContext.texSubImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1fv: function (...args) {
      console.warn("WebGLRenderingContext.uniform1fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2fv: function (...args) {
      console.warn("WebGLRenderingContext.uniform2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3fv: function (...args) {
      console.warn("WebGLRenderingContext.uniform3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    uniform4fv: function (...args) {
      console.warn("WebGLRenderingContext.uniform4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1iv: function (...args) {
      console.warn("WebGLRenderingContext.uniform1iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2iv: function (...args) {
      console.warn("WebGLRenderingContext.uniform2iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3iv: function (...args) {
      console.warn("WebGLRenderingContext.uniform3iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4iv: function (...args) {
      console.warn("WebGLRenderingContext.uniform4iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },

    uniformMatrix2fv: function (...args) {
      console.warn("WebGLRenderingContext.uniformMatrix2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix3fv: function (...args) {
      console.warn("WebGLRenderingContext.uniformMatrix3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix4fv: function (...args) {
      console.warn("WebGLRenderingContext.uniformMatrix4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    }
  }
  return WebGLRenderingContext;
}