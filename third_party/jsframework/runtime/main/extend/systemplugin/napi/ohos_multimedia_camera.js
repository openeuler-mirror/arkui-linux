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

import { paramMock } from "../utils"

export function mockMultimediaCamera() {
  const Camera = {
    cameraId: '[PC preview] unknow pid',
    cameraPosition: CameraPosition,
    cameraType: CameraType,
    connectionType: ConnectionType
  }
  const multimediaCameraMock = {
    getCameraManager: function (...args) {
      console.warn('camera.getCameraManager interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CameraManager);
      } else {
        return new Promise((resolve) => {
        resolve(CameraManager);
        });
      }
    },
    createCaptureSession: function (...args) {
      console.warn('camera.createCaptureSession interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CaptureSession);
      } else {
        return new Promise((resolve) => {
        resolve(CaptureSession);
        });
      }
    },
    createPreviewOutput: function (...args) {
      console.warn('camera.createPreviewOutput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PreviewOutput);
      } else {
        return new Promise((resolve) => {
        resolve(PreviewOutput);
        });
      }
    },
    createPhotoOutput: function (...args) {
      console.warn('camera.createPhotoOutput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PhotoOutput);
      } else {
        return new Promise((resolve) => {
        resolve(PhotoOutput);
        });
      }
    },
    createVideoOutput: function (...args) {
      console.warn('camera.createVideoOutput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, VideoOutput);
      } else {
        return new Promise((resolve) => {
        resolve(VideoOutput);
        });
      }
    },
  }
  const CameraStatus = {
    CAMERA_STATUS_APPEAR: 0,
    CAMERA_STATUS_DISAPPEAR: 1,
    CAMERA_STATUS_AVAILABLE: 2,
    CAMERA_STATUS_UNAVAILABLE: 3
  }
  const CameraStatusInfo = {
    camera: Camera,
    status: CameraStatus
  }
  const CameraManager = {
    getCameras: function (...args) {
      console.warn('CameraManager.getCameras interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [Camera]);
      } else {
        return new Promise((resolve) => {
        resolve([Camera]);
        });
      }
    },
    createCameraInput: function (...args) {
      console.warn('CameraManager.createCameraInput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, CameraInput);
      } else {
        return new Promise((resolve) => {
        resolve(CameraInput);
        });
      }
    },
    on: function (...args) {
      console.warn('CameraManager.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'cameraStatus'){
          args[len - 1].call(this, paramMock.businessErrorMock, CameraStatusInfo);
        }
      }
    }
  }
  const CameraPosition = {
    CAMERA_POSITION_UNSPECIFIED: 0,
    CAMERA_POSITION_BACK: 1,
    CAMERA_POSITION_FRONT: 2
  }
  const CameraType = {
    CAMERA_TYPE_UNSPECIFIED: 0,
    CAMERA_TYPE_WIDE_ANGLE: 1,
    CAMERA_TYPE_ULTRA_WIDE: 2,
    CAMERA_TYPE_TELEPHOTO: 3,
    CAMERA_TYPE_TRUE_DEPTH: 4
  }
  const ConnectionType = {
    CAMERA_CONNECTION_BUILT_IN: 0,
    CAMERA_CONNECTION_USB_PLUGIN: 1,
    CAMERA_CONNECTION_REMOTE: 2
  }
  const Size = {
    height: '[PC preview] unknow height',
    width: '[PC preview] unknow width'
  }
  const CameraInputErrorCode = {
    ERROR_UNKNOWN: -1
  }
  const CameraInputError = {
    code: CameraInputErrorCode
  }
  const FlashMode = {
    FLASH_MODE_CLOSE: 0,
    FLASH_MODE_OPEN: 1,
    FLASH_MODE_AUTO: 2,
    FLASH_MODE_ALWAYS_OPEN: 3
  }
  const FocusMode = {
    FOCUS_MODE_MANUAL: 0,
    FOCUS_MODE_CONTINUOUS_AUTO: 1,
    FOCUS_MODE_AUTO: 2,
    FOCUS_MODE_LOCKED: 3
  }
  const FocusState = {
    FOCUS_STATE_SCAN: 0,
    FOCUS_STATE_FOCUSED: 1,
    FOCUS_STATE_UNFOCUSED: 2
  }
  const CameraInput = {
    getCameraId: function (...args) {
      console.warn('CameraInput.getCameraId interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve) => {
        resolve(paramMock.paramStringMock);
        });
      }
    },
    hasFlash: function (...args) {
      console.warn('CameraInput.hasFlash interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock);
        });
      }
    },
    isFlashModeSupported: function (...args) {
      console.warn('CameraInput.isFlashModeSupported interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getFlashMode: function (...args) {
      console.warn('CameraInput.getFlashMode interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FlashMode);
      } else {
        return new Promise((resolve) => {
        resolve(FlashMode);
        });
      }
    },
    setFlashMode: function (...args) {
      console.warn('CameraInput.setFlashMode interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    isFocusModeSupported: function (...args) {
      console.warn('CameraInput.isFocusModeSupported interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
        resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getFocusMode: function (...args) {
      console.warn('CameraInput.getFocusMode interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, FocusMode);
      } else {
        return new Promise((resolve) => {
        resolve(FocusMode);
        });
      }
    },
    setFocusMode: function (...args) {
      console.warn('CameraInput.setFocusMode interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    getZoomRatioRange: function (...args) {
      console.warn('CameraInput.getZoomRatioRange interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paramNumberMock]);
      } else {
        return new Promise((resolve) => {
        resolve([paramMock.paramNumberMock]);
        });
      }
    },
    getZoomRatio: function (...args) {
      console.warn('CameraInput.getZoomRatio interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
        return new Promise((resolve) => {
        resolve(paramMock.paramNumberMock);
        });
      }
    },
    setZoomRatio: function (...args) {
      console.warn('CameraInput.setZoomRatio interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    release: function (...args) {
      console.warn('CameraInput.release interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    on: function (...args) {
      console.warn('CameraInput.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'focusStateChange'){
          args[len - 1].call(this, paramMock.businessErrorMock, FocusState);
        } else if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock, CameraInputError);
        }
      }
    }
  }
  const CaptureSessionErrorCode = {
    ERROR_UNKNOWN: -1
  }
  const CaptureSessionError = {
    code: CaptureSessionErrorCode
  }
  const CaptureSession = {
    beginConfig: function (...args) {
      console.warn('CaptureSession.beginConfig interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    commitConfig: function (...args) {
      console.warn('CaptureSession.commitConfig interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    addInput: function (...args) {
      console.warn('CaptureSession.addInput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    addOutput: function (...args) {
      console.warn('CaptureSession.addOutput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    removeInput: function (...args) {
      console.warn('CaptureSession.removeInput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    removeOutput: function (...args) {
      console.warn('CaptureSession.removeOutput interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    start: function (...args) {
      console.warn('CaptureSession.start interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    stop: function (...args) {
      console.warn('CaptureSession.stop interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    release: function (...args) {
      console.warn('CaptureSession.release interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    on: function (...args) {
      console.warn('CaptureSession.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'error'){
          args[len - 1].call(this, paramMock.businessErrorMock, CaptureSessionError);
        }
      }
    }
  }
  const PreviewOutputErrorCode = {
    ERROR_UNKNOWN: -1
  }
  const PreviewOutputError = {
    code: PreviewOutputErrorCode
  }
  const PreviewOutput = {
    release: function (...args) {
      console.warn('PreviewOutput.release interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    on: function (...args) {
      console.warn('PreviewOutput.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'frameStart'){
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'frameEnd') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock, PreviewOutputError);
        }
      }
    },
  }
  const ImageRotation = {
    ROTATION_0: 0,
    ROTATION_90: 90,
    ROTATION_180: 180,
    ROTATION_270: 270
  }
  const QualityLevel = {
    QUALITY_LEVEL_HIGH: 0,
    QUALITY_LEVEL_MEDIUM: 1,
    QUALITY_LEVEL_LOW: 2
  }
  const PhotoCaptureSetting = {
    quality:QualityLevel,
    rotation: ImageRotation
  }
  const FrameShutterInfo = {
    captureId: '[PC preview] unknow captureId',
    timestamp: '[PC preview] unknow timestamp'
  }
  const CaptureEndInfo = {
    captureId: '[PC preview] unknow captureId',
    frameCount: '[PC preview] unknow frameCount'
  }
  const PhotoOutputErrorCode = {
    ERROR_UNKNOWN: -1
  }
  const PhotoOutputError = {
    code: PhotoOutputErrorCode
  }
  const PhotoOutput = {
    capture: function (...args) {
      console.warn('PhotoOutput.capture interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    release: function (...args) {
      console.warn('PhotoOutput.release interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    on: function (...args) {
      console.warn('PhotoOutput.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'captureStart'){
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
        } else if (args[0] == 'frameShutter') {
          args[len - 1].call(this, paramMock.businessErrorMock, FrameShutterInfo);
        } else if (args[0] == 'captureEnd') {
          args[len - 1].call(this, paramMock.businessErrorMock, CaptureEndInfo);
        } else if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock, PhotoOutputError);
        }
      }
    }
  }
  const VideoOutputErrorCode = {
    ERROR_UNKNOWN: -1
  }
  const VideoOutputError = {
    code: VideoOutputErrorCode
  }
  const VideoOutput = {
    start: function (...args) {
      console.warn('VideoOutput.start interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    stop: function (...args) {
      console.warn('VideoOutput.stop interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    release: function (...args) {
      console.warn('VideoOutput.release interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve) => {
        resolve();
        });
      }
    },
    on: function (...args) {
      console.warn('VideoOutput.on interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.');
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if(args[0] == 'frameStart'){
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'frameEnd') {
          args[len - 1].call(this, paramMock.businessErrorMock);
        } else if (args[0] == 'error') {
          args[len - 1].call(this, paramMock.businessErrorMock, VideoOutputError);
        }
      }
    }
  }
  return multimediaCameraMock
}