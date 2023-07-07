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

import { paramMock } from "../../utils"

export function mockWebgl2() {
  const WebGLQuery = {
  }
  const WebGLSampler = {
  }
  const WebGLSync = {
  }
  const WebGLTransformFeedback = {
  }
  const WebGLVertexArrayObject = {
  }
  const WebGLActiveInfo = {
    size: '[PC preview] unknow size',
    type: '[PC preview] unknow type',
    name: '[PC preview] unknow name'
  }
  const glParamMock = {
    paramDoubleMock: '[PC Preview] unknow double',
    paramAnyMock: '[PC Preview] unknow any',
    stringArray: '[PC preview] unknow stringArray',
    uint32Array: '[PC preview] unknow uint32Array',
    glBooleanArray: '[PC preview] unknow glBooleanArray',
    int32Array: '[PC preview] unknow int32Array',
    uintArray: '[PC preview] unknow uintArray'
  }

  const WebGL2RenderingContext = {
      READ_BUFFER: 0x0C02,
      UNPACK_ROW_LENGTH: 0x0CF2,
      UNPACK_SKIP_ROWS: 0x0CF3,
      UNPACK_SKIP_PIXELS: 0x0CF4,
      PACK_ROW_LENGTH: 0x0D02,
      PACK_SKIP_ROWS: 0x0D03,
      PACK_SKIP_PIXELS: 0x0D04,
      COLOR: 0x1800,
      DEPTH: 0x1801,
      STENCIL: 0x1802,
      RED: 0x1903,
      RGB8: 0x8051,
      RGBA8: 0x8058,
      RGB10_A2: 0x8059,
      TEXTURE_BINDING_3D: 0x806A,
      UNPACK_SKIP_IMAGES: 0x806D,
      UNPACK_IMAGE_HEIGHT: 0x806E,
      TEXTURE_3D: 0x806F,
      TEXTURE_WRAP_R: 0x8072,
      MAX_3D_TEXTURE_SIZE: 0x8073,
      UNSIGNED_INT_2_10_10_10_REV: 0x8368,
      MAX_ELEMENTS_VERTICES: 0x80E8,
      MAX_ELEMENTS_INDICES: 0x80E9,
      TEXTURE_MIN_LOD: 0x813A,
      TEXTURE_MAX_LOD: 0x813B,
      TEXTURE_BASE_LEVEL: 0x813C,
      TEXTURE_MAX_LEVEL: 0x813D,
      MIN: 0x8007,
      MAX: 0x8008,
      DEPTH_COMPONENT24: 0x81A6,
      MAX_TEXTURE_LOD_BIAS: 0x84FD,
      TEXTURE_COMPARE_MODE: 0x884C,
      TEXTURE_COMPARE_FUNC: 0x884D,
      CURRENT_QUERY: 0x8865,
      QUERY_RESULT: 0x8866,
      QUERY_RESULT_AVAILABLE: 0x8867,
      STREAM_READ: 0x88E1,
      STREAM_COPY: 0x88E2,
      STATIC_READ: 0x88E5,
      STATIC_COPY: 0x88E6,
      DYNAMIC_READ: 0x88E9,
      DYNAMIC_COPY: 0x88EA,
      MAX_DRAW_BUFFERS: 0x8824,
      DRAW_BUFFER0: 0x8825,
      DRAW_BUFFER1: 0x8826,
      DRAW_BUFFER2: 0x8827,
      DRAW_BUFFER3: 0x8828,
      DRAW_BUFFER4: 0x8829,
      DRAW_BUFFER5: 0x882A,
      DRAW_BUFFER6: 0x882B,
      DRAW_BUFFER7: 0x882C,
      DRAW_BUFFER8: 0x882D,
      DRAW_BUFFER9: 0x882E,
      DRAW_BUFFER10: 0x882F,
      DRAW_BUFFER11: 0x8830,
      DRAW_BUFFER12: 0x8831,
      DRAW_BUFFER13: 0x8832,
      DRAW_BUFFER14: 0x8833,
      DRAW_BUFFER15: 0x8834,
      MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8B49,
      MAX_VERTEX_UNIFORM_COMPONENTS: 0x8B4A,
      SAMPLER_3D: 0x8B5F,
      SAMPLER_2D_SHADOW: 0x8B62,
      FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8B8B,
      PIXEL_PACK_BUFFER: 0x88EB,
      PIXEL_UNPACK_BUFFER: 0x88EC,
      PIXEL_PACK_BUFFER_BINDING: 0x88ED,
      PIXEL_UNPACK_BUFFER_BINDING: 0x88EF,
      FLOAT_MAT2x3: 0x8B65,
      FLOAT_MAT2x4: 0x8B66,
      FLOAT_MAT3x2: 0x8B67,
      FLOAT_MAT3x4: 0x8B68,
      FLOAT_MAT4x2: 0x8B69,
      FLOAT_MAT4x3: 0x8B6A,
      SRGB: 0x8C40,
      SRGB8: 0x8C41,
      SRGB8_ALPHA8: 0x8C43,
      COMPARE_REF_TO_TEXTURE: 0x884E,
      RGBA32F: 0x8814,
      RGB32F: 0x8815,
      RGBA16F: 0x881A,
      RGB16F: 0x881B,
      VERTEX_ATTRIB_ARRAY_INTEGER: 0x88FD,
      MAX_ARRAY_TEXTURE_LAYERS: 0x88FF,
      MIN_PROGRAM_TEXEL_OFFSET: 0x8904,
      MAX_PROGRAM_TEXEL_OFFSET: 0x8905,
      MAX_VARYING_COMPONENTS: 0x8B4B,
      TEXTURE_2D_ARRAY: 0x8C1A,
      TEXTURE_BINDING_2D_ARRAY: 0x8C1D,
      R11F_G11F_B10F: 0x8C3A,
      UNSIGNED_INT_10F_11F_11F_REV: 0x8C3B,
      RGB9_E5: 0x8C3D,
      UNSIGNED_INT_5_9_9_9_REV: 0x8C3E,
      TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8C7F,
      MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8C80,
      TRANSFORM_FEEDBACK_VARYINGS: 0x8C83,
      TRANSFORM_FEEDBACK_BUFFER_START: 0x8C84,
      TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8C85,
      TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8C88,
      RASTERIZER_DISCARD: 0x8C89,
      MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8C8A,
      MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8C8B,
      INTERLEAVED_ATTRIBS: 0x8C8C,
      SEPARATE_ATTRIBS: 0x8C8D,
      TRANSFORM_FEEDBACK_BUFFER: 0x8C8E,
      TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8C8F,
      RGBA32UI: 0x8D70,
      RGB32UI: 0x8D71,
      RGBA16UI: 0x8D76,
      RGB16UI: 0x8D77,
      RGBA8UI: 0x8D7C,
      RGB8UI: 0x8D7D,
      RGBA32I: 0x8D82,
      RGB32I: 0x8D83,
      RGBA16I: 0x8D88,
      RGB16I: 0x8D89,
      RGBA8I: 0x8D8E,
      RGB8I: 0x8D8F,
      RED_INTEGER: 0x8D94,
      RGB_INTEGER: 0x8D98,
      RGBA_INTEGER: 0x8D99,
      SAMPLER_2D_ARRAY: 0x8DC1,
      SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
      SAMPLER_CUBE_SHADOW: 0x8DC5,
      UNSIGNED_INT_VEC2: 0x8DC6,
      UNSIGNED_INT_VEC3: 0x8DC7,
      UNSIGNED_INT_VEC4: 0x8DC8,
      INT_SAMPLER_2D: 0x8DCA,
      INT_SAMPLER_3D: 0x8DCB,
      INT_SAMPLER_CUBE: 0x8DCC,
      INT_SAMPLER_2D_ARRAY: 0x8DCF,
      UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
      UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
      UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
      UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,
      DEPTH_COMPONENT32F: 0x8CAC,
      DEPTH32F_STENCIL8: 0x8CAD,
      FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8DAD,
      FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210,
      FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211,
      FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212,
      FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213,
      FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214,
      FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215,
      FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216,
      FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217,
      FRAMEBUFFER_DEFAULT: 0x8218,
      UNSIGNED_INT_24_8: 0x84FA,
      DEPTH24_STENCIL8: 0x88F0,
      UNSIGNED_NORMALIZED: 0x8C17,
      DRAW_FRAMEBUFFER_BINDING: 0x8CA6,
      READ_FRAMEBUFFER: 0x8CA8,
      DRAW_FRAMEBUFFER: 0x8CA9,
      READ_FRAMEBUFFER_BINDING: 0x8CAA,
      RENDERBUFFER_SAMPLES: 0x8CAB,
      FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8CD4,
      MAX_COLOR_ATTACHMENTS: 0x8CDF,
      COLOR_ATTACHMENT1: 0x8CE1,
      COLOR_ATTACHMENT2: 0x8CE2,
      COLOR_ATTACHMENT3: 0x8CE3,
      COLOR_ATTACHMENT4: 0x8CE4,
      COLOR_ATTACHMENT5: 0x8CE5,
      COLOR_ATTACHMENT6: 0x8CE6,
      COLOR_ATTACHMENT7: 0x8CE7,
      COLOR_ATTACHMENT8: 0x8CE8,
      COLOR_ATTACHMENT9: 0x8CE9,
      COLOR_ATTACHMENT10: 0x8CEA,
      COLOR_ATTACHMENT11: 0x8CEB,
      COLOR_ATTACHMENT12: 0x8CEC,
      COLOR_ATTACHMENT13: 0x8CED,
      COLOR_ATTACHMENT14: 0x8CEE,
      COLOR_ATTACHMENT15: 0x8CEF,
      FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8D56,
      MAX_SAMPLES: 0x8D57,
      HALF_FLOAT: 0x140B,
      RG: 0x8227,
      RG_INTEGER: 0x8228,
      R8: 0x8229,
      RG8: 0x822B,
      R16F: 0x822D,
      R32F: 0x822E,
      RG16F: 0x822F,
      RG32F: 0x8230,
      R8I: 0x8231,
      R8UI: 0x8232,
      R16I: 0x8233,
      R16UI: 0x8234,
      R32I: 0x8235,
      R32UI: 0x8236,
      RG8I: 0x8237,
      RG8UI: 0x8238,
      RG16I: 0x8239,
      RG16UI: 0x823A,
      RG32I: 0x823B,
      RG32UI: 0x823C,
      VERTEX_ARRAY_BINDING: 0x85B5,
      R8_SNORM: 0x8F94,
      RG8_SNORM: 0x8F95,
      RGB8_SNORM: 0x8F96,
      RGBA8_SNORM: 0x8F97,
      SIGNED_NORMALIZED: 0x8F9C,
      COPY_READ_BUFFER: 0x8F36,
      COPY_WRITE_BUFFER: 0x8F37,
      COPY_READ_BUFFER_BINDING: 0x8F36,
      COPY_WRITE_BUFFER_BINDING: 0x8F37,
      UNIFORM_BUFFER: 0x8A11,
      UNIFORM_BUFFER_BINDING: 0x8A28,
      UNIFORM_BUFFER_START: 0x8A29,
      UNIFORM_BUFFER_SIZE: 0x8A2A,
      MAX_VERTEX_UNIFORM_BLOCKS: 0x8A2B,
      MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8A2D,
      MAX_COMBINED_UNIFORM_BLOCKS: 0x8A2E,
      MAX_UNIFORM_BUFFER_BINDINGS: 0x8A2F,
      MAX_UNIFORM_BLOCK_SIZE: 0x8A30,
      MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8A31,
      MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8A33,
      UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8A34,
      ACTIVE_UNIFORM_BLOCKS: 0x8A36,
      UNIFORM_TYPE: 0x8A37,
      UNIFORM_SIZE: 0x8A38,
      UNIFORM_BLOCK_INDEX: 0x8A3A,
      UNIFORM_OFFSET: 0x8A3B,
      UNIFORM_ARRAY_STRIDE: 0x8A3C,
      UNIFORM_MATRIX_STRIDE: 0x8A3D,
      UNIFORM_IS_ROW_MAJOR: 0x8A3E,
      UNIFORM_BLOCK_BINDING: 0x8A3F,
      UNIFORM_BLOCK_DATA_SIZE: 0x8A40,
      UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8A42,
      UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8A43,
      UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8A44,
      UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8A46,
      INVALID_INDEX: 0xFFFFFFFF,
      MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122,
      MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125,
      MAX_SERVER_WAIT_TIMEOUT: 0x9111,
      OBJECT_TYPE: 0x9112,
      SYNC_CONDITION: 0x9113,
      SYNC_STATUS: 0x9114,
      SYNC_FLAGS: 0x9115,
      SYNC_FENCE: 0x9116,
      SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
      UNSIGNALED: 0x9118,
      SIGNALED: 0x9119,
      ALREADY_SIGNALED: 0x911A,
      TIMEOUT_EXPIRED: 0x911B,
      CONDITION_SATISFIED: 0x911C,
      WAIT_FAILED: 0x911D,
      SYNC_FLUSH_COMMANDS_BIT: 0x00000001,
      VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88FE,
      ANY_SAMPLES_PASSED: 0x8C2F,
      ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8D6A,
      SAMPLER_BINDING: 0x8919,
      RGB10_A2UI: 0x906F,
      INT_2_10_10_10_REV: 0x8D9F,
      TRANSFORM_FEEDBACK: 0x8E22,
      TRANSFORM_FEEDBACK_PAUSED: 0x8E23,
      TRANSFORM_FEEDBACK_ACTIVE: 0x8E24,
      TRANSFORM_FEEDBACK_BINDING: 0x8E25,
      TEXTURE_IMMUTABLE_FORMAT: 0x912F,
      MAX_ELEMENT_INDEX: 0x8D6B,
      TEXTURE_IMMUTABLE_LEVELS: 0x82DF,
      TIMEOUT_IGNORED: -1,
      MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 0x9247,
    copyBufferSubData: function (...args) {
      console.warn("WebGL2RenderingContext.copyBufferSubData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getBufferSubData: function (...args) {
      console.warn("WebGL2RenderingContext.getBufferSubData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    blitFramebuffer: function (...args) {
      console.warn("WebGL2RenderingContext.blitFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    framebufferTextureLayer: function (...args) {
      console.warn("WebGL2RenderingContext.framebufferTextureLayer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    invalidateFramebuffer: function (...args) {
      console.warn("WebGL2RenderingContext.invalidateFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    invalidateSubFramebuffer: function (...args) {
      console.warn("WebGL2RenderingContext.invalidateFramebuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    readBuffer: function (...args) {
      console.warn("WebGL2RenderingContext.readBuffer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getInternalformatParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getInternalformatParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[2] == GL_SAMPLES) {
        return glParamMock.int32Array
      }
    },
    renderbufferStorageMultisample: function (...args) {
      console.warn("WebGL2RenderingContext.renderbufferStorageMultisample interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texStorage2D: function (...args) {
      console.warn("WebGL2RenderingContext.texStorage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texStorage3D: function (...args) {
      console.warn("WebGL2RenderingContext.texStorage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texImage3D: function (...args) {
      console.warn("WebGL2RenderingContext.texImage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texSubImage3D: function (...args) {
      console.warn("WebGL2RenderingContext.texSubImage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    copyTexSubImage3D: function (...args) {
      console.warn("WebGL2RenderingContext.copyTexSubImage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexImage3D: function (...args) {
      console.warn("WebGL2RenderingContext.compressedTexImage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexSubImage3D: function (...args) {
      console.warn("WebGL2RenderingContext.compressedTexSubImage3D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getFragDataLocation: function (...args) {
      console.warn("WebGL2RenderingContext.getFragDataLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    uniform1ui: function (...args) {
      console.warn("WebGL2RenderingContext.uniform1ui interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2ui: function (...args) {
      console.warn("WebGL2RenderingContext.uniform2ui interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3ui: function (...args) {
      console.warn("WebGL2RenderingContext.uniform3ui interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4ui: function (...args) {
      console.warn("WebGL2RenderingContext.uniform4ui interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1uiv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform1uiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2uiv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform2uiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3uiv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform3uiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4uiv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform4uiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix3x2fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix3x2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix4x2fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix4x2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix2x3fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix2x3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix4x3fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix4x3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix2x4fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix2x4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix3x4fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix3x4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribI4i: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribI4i interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribI4iv: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribI4iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribI4ui: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribI4ui interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribI4uiv: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribI4uiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribIPointer: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribIPointer interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    vertexAttribDivisor: function (...args) {
      console.warn("WebGL2RenderingContext.vertexAttribDivisor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    drawArraysInstanced: function (...args) {
      console.warn("WebGL2RenderingContext.drawArraysInstanced interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    drawElementsInstanced: function (...args) {
      console.warn("WebGL2RenderingContext.drawElementsInstanced interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    drawRangeElements: function (...args) {
      console.warn("WebGL2RenderingContext.drawRangeElements interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    drawBuffers: function (...args) {
      console.warn("WebGL2RenderingContext.drawBuffers interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearBufferfv: function (...args) {
      console.warn("WebGL2RenderingContext.clearBufferfv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearBufferiv: function (...args) {
      console.warn("WebGL2RenderingContext.clearBufferiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearBufferuiv: function (...args) {
      console.warn("WebGL2RenderingContext.clearBufferuiv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clearBufferfi: function (...args) {
      console.warn("WebGL2RenderingContext.clearBufferfi interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    createQuery: function (...args) {
      console.warn("WebGL2RenderingContext.createQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLQuery;
    },
    deleteQuery: function (...args) {
      console.warn("WebGL2RenderingContext.deleteQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    isQuery: function (...args) {
      console.warn("WebGL2RenderingContext.isQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    beginQuery: function (...args) {
      console.warn("WebGL2RenderingContext.beginQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    endQuery: function (...args) {
      console.warn("WebGL2RenderingContext.endQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getQuery: function (...args) {
      console.warn("WebGL2RenderingContext.getQuery interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLQuery;
    },
    getQueryParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getQueryParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[1] == GL_QUERY_RESULT) {
        return paramMock.paramNumberMock;
      } else if (args[1] == GL_QUERY_RESULT_AVAILABLE) {
        return paramMock.paramBooleanMock;
      }
    },
    createSampler: function (...args) {
      console.warn("WebGL2RenderingContext.createSampler interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLSampler;
    },
    deleteSampler: function (...args) {
      console.warn("WebGL2RenderingContext.deleteSampler interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    isSampler: function (...args) {
      console.warn("WebGL2RenderingContext.isSampler interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },

    bindSampler: function (...args) {
      console.warn("WebGL2RenderingContext.bindSampler interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    samplerParameteri: function (...args) {
      console.warn("WebGL2RenderingContext.samplerParameteri interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    samplerParameterf: function (...args) {
      console.warn("WebGL2RenderingContext.samplerParameterf interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getSamplerParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getSamplerParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      if (args[1] == GL_TEXTURE_MAX_LOD || args[1] == GL_TEXTURE_MIN_LOD) {
        return glParamMock.paramDoubleMock;
      } else {
        return paramMock.paramNumberMock;
      }
    },
    fenceSync: function (...args) {
      console.warn("WebGL2RenderingContext.fenceSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLSync;
    },
    isSync: function (...args) {
      console.warn("WebGL2RenderingContext.isSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    deleteSync: function (...args) {
      console.warn("WebGL2RenderingContext.deleteSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    clientWaitSync: function (...args) {
      console.warn("WebGL2RenderingContext.clientWaitSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    waitSync: function (...args) {
      console.warn("WebGL2RenderingContext.waitSync interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getSyncParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getSyncParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock;
    },
    createTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.createTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLTransformFeedback;
    },
    deleteTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.deleteTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    isTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.isTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    bindTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.bindTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    beginTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.beginTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    endTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.endTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    transformFeedbackVaryings: function (...args) {
      console.warn("WebGL2RenderingContext.transformFeedbackVaryings interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getTransformFeedbackVarying: function (...args) {
      console.warn("WebGL2RenderingContext.getTransformFeedbackVarying interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLActiveInfo;
    },
    pauseTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.pauseTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    resumeTransformFeedback: function (...args) {
      console.warn("WebGL2RenderingContext.resumeTransformFeedback interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindBufferBase: function (...args) {
      console.warn("WebGL2RenderingContext.bindBufferBase interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bindBufferRange: function (...args) {
      console.warn("WebGL2RenderingContext.bindBufferRange interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    getIndexedParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getIndexedParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock;
    },
    getUniformIndices: function (...args) {
      console.warn("WebGL2RenderingContext.getUniformIndices interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.uintArray;
    },
    getActiveUniforms: function (...args) {
      console.warn("WebGL2RenderingContext.getActiveUniforms interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock;
    },
    getUniformBlockIndex: function (...args) {
      console.warn("WebGL2RenderingContext.getUniformBlockIndex interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    },
    getActiveUniformBlockParameter: function (...args) {
      console.warn("WebGL2RenderingContext.getActiveUniformBlockParameter interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return glParamMock.paramAnyMock;
    },
    getActiveUniformBlockName: function (...args) {
      console.warn("WebGL2RenderingContext.getActiveUniformBlockName interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock;
    },
    uniformBlockBinding: function (...args) {
      console.warn("WebGL2RenderingContext.uniformBlockBinding interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    createVertexArray: function (...args) {
      console.warn("WebGL2RenderingContext.createVertexArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return WebGLVertexArrayObject;
    },
    deleteVertexArray: function (...args) {
      console.warn("WebGL2RenderingContext.deleteVertexArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    isVertexArray: function (...args) {
      console.warn("WebGL2RenderingContext.isVertexArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    },
    bindVertexArray: function (...args) {
      console.warn("WebGL2RenderingContext.bindVertexArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bufferData: function (...args) {
      console.warn("WebGL2RenderingContext.bufferData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    bufferSubData: function (...args) {
      console.warn("WebGL2RenderingContext.bufferSubData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texImage2D: function (...args) {
      console.warn("WebGL2RenderingContext.texImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    texSubImage2D: function (...args) {
      console.warn("WebGL2RenderingContext.texSubImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexImage2D: function (...args) {
      console.warn("WebGL2RenderingContext.compressedTexImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    compressedTexSubImage2D: function (...args) {
      console.warn("WebGL2RenderingContext.compressedTexSubImage2D interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform1fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform1iv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform1iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform2iv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform2iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform3iv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform3iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniform4iv: function (...args) {
      console.warn("WebGL2RenderingContext.uniform4iv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix2fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix2fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix3fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix3fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    uniformMatrix4fv: function (...args) {
      console.warn("WebGL2RenderingContext.uniformMatrix4fv interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    },
    readPixels: function (...args) {
      console.warn("WebGL2RenderingContext.readPixels interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    }
  }
  return WebGL2RenderingContext;

}