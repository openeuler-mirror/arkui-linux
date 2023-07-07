/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

export function mockSensor() {
    const AccelerometerResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        timestamp: '[PC preview] unknown timestamp'
    }
    const LinearAccelerometerResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        timestamp: '[PC preview] unknown timestamp'
    }
    const AccelerometerUncalibratedResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        biasX: '[PC preview] unknown biasX',
        biasY: '[PC preview] unknown biasY',
        biasZ: '[PC preview] unknown biasZ',
        timestamp: '[PC preview] unknown timestamp'
    }
    const GravityResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        timestamp: '[PC preview] unknown timestamp'
    }
    const OrientationResponse = {
        alpha: '[PC preview] unknown alpha',
        beta: '[PC preview] unknown beta',
        gamma: '[PC preview] unknown gamma',
        timestamp: '[PC preview] unknown timestamp'
    }
    const RotationVectorResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        w: '[PC preview] unknown w',
        timestamp: '[PC preview] unknown timestamp'
    }
    const GyroscopeResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        timestamp: '[PC preview] unknown timestamp'
    }
    const GyroscopeUncalibratedResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        biasX: '[PC preview] unknown biasX',
        biasY: '[PC preview] unknown biasY',
        biasZ: '[PC preview] unknown biasZ',
        timestamp: '[PC preview] unknown timestamp'
    }
    const SignificantMotionResponse = {
        scalar: '[PC preview] unknown scalar',
        timestamp: '[PC preview] unknown timestamp'
    }
    const ProximityResponse = {
        distance: '[PC preview] unknown distance',
        timestamp: '[PC preview] unknown timestamp'
    }
    const LightResponse = {
        intensity: '[PC preview] unknown intensity',
        timestamp: '[PC preview] unknown timestamp'
    }
    const HallResponse = {
        status: '[PC preview] unknown status',
        timestamp: '[PC preview] unknown timestamp'
    }
    const MagneticFieldResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        timestamp: '[PC preview] unknown timestamp'
    }
    const MagneticFieldUncalibratedResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        biasX: '[PC preview] unknown biasX',
        biasY: '[PC preview] unknown biasY',
        biasZ: '[PC preview] unknown biasZ',
        timestamp: '[PC preview] unknown timestamp'
    }
    const PedometerResponse = {
        steps: '[PC preview] unknown steps',
        timestamp: '[PC preview] unknown timestamp'
    }
    const HumidityResponse = {
        humidity: '[PC preview] unknown humidity',
        timestamp: '[PC preview] unknown timestamp'
    }
    const PedometerDetectResponse = {
        scalar: '[PC preview] unknown scalar',
        timestamp: '[PC preview] unknown timestamp'
    }
    const AmbientTemperatureResponse = {
        temperature: '[PC preview] unknown temperature',
        timestamp: '[PC preview] unknown timestamp'
    }
    const BarometerResponse = {
        pressure: '[PC preview] unknown pressure',
        timestamp: '[PC preview] unknown timestamp'
    }
    const HeartRateResponse = {
        heartRate: '[PC preview] unknown heartRate',
        timestamp: '[PC preview] unknown timestamp'
    }
    const WearDetectionResponse = {
        value: '[PC preview] unknown value',
        timestamp: '[PC preview] unknown timestamp'
    }
    const Options = {
        interval: '[PC preview] unknown value'
    }
    const GeomagneticResponse = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y',
        z: '[PC preview] unknown z',
        geomagneticDip: '[PC preview] unknown geomagneticDip',
        deflectionAngle: '[PC preview] unknown deflectionAngle',
        levelIntensity: '[PC preview] unknown levelIntensity',
        totalIntensity: '[PC preview] unknown totalIntensity'
    }
    const PedometerDetectionResponse = {
        scalar: '[PC preview] unknown scalar',
        timestamp: '[PC preview] unknown timestamp'
    }
    const Response  = {
        timestamp: '[PC preview] unknown timestamp'
    }
    const LocationOptions = {
        latitude: '[PC preview] unknown latitude',
        longitude: '[PC preview] unknown longitude',
        altitude: '[PC preview] unknown altitude'
    }
    const CoordinatesOptions = {
        x: '[PC preview] unknown x',
        y: '[PC preview] unknown y'
    }
    const RotationMatrixResponse = {
        rotation: '[PC preview] unknown rotation',
        inclination: '[PC preview] unknown inclination'
    }
    const Sensor = {
        sensorName: '[PC preview] unknown sensorName',
        venderName: '[PC preview] unknown venderName',
        firmwareVersion: '[PC preview] unknown firmwareVersion',
        hardwareVersion: '[PC preview] unknown hardwareVersion',
        sensorTypeId: '[PC preview] unknown sensorTypeId',
        maxRange: '[PC preview] unknown maxRange',
        precision: '[PC preview] unknown precision',
        power: '[PC preview] unknown power'
    }
    const SensorType = {
        SENSOR_TYPE_ID_ACCELEROMETER: 1,
        SENSOR_TYPE_ID_GYROSCOPE: 2,
        SENSOR_TYPE_ID_AMBIENT_LIGHT: 5,
        SENSOR_TYPE_ID_MAGNETIC_FIELD: 6,
        SENSOR_TYPE_ID_BAROMETER: 8,
        SENSOR_TYPE_ID_HALL: 10,
        SENSOR_TYPE_ID_PROXIMITY: 12,
        SENSOR_TYPE_ID_HUMIDITY: 13,
        SENSOR_TYPE_ID_ORIENTATION: 256,
        SENSOR_TYPE_ID_GRAVITY: 257,
        SENSOR_TYPE_ID_LINEAR_ACCELERATION: 258,
        SENSOR_TYPE_ID_LINEAR_ACCELEROMETER: 258,
        SENSOR_TYPE_ID_ROTATION_VECTOR: 259,
        SENSOR_TYPE_ID_AMBIENT_TEMPERATURE: 260,
        SENSOR_TYPE_ID_MAGNETIC_FIELD_UNCALIBRATED: 261,
        SENSOR_TYPE_ID_GYROSCOPE_UNCALIBRATED: 263,
        SENSOR_TYPE_ID_SIGNIFICANT_MOTION: 264,
        SENSOR_TYPE_ID_PEDOMETER_DETECTION: 265,
        SENSOR_TYPE_ID_PEDOMETER: 266,
        SENSOR_TYPE_ID_HEART_RATE: 278,
        SENSOR_TYPE_ID_HEART_BEAT_RATE: 278,
        SENSOR_TYPE_ID_WEAR_DETECTION: 280,
        SENSOR_TYPE_ID_ACCELEROMETER_UNCALIBRATED: 281
    }
    const sensor = {
        Sensor,
        SensorType,
        on: function (...args) {
            console.warn('sensor.on interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length;
            const callback = typeof args[len - 1] === 'function' ? args[len - 1] : args[len - 2];
            if (args[0] == 1) {
                callback.call(this, AccelerometerResponse);
            } else if (args[0] == 2) {
                callback.call(this, GyroscopeResponse);
            } else if (args[0] == 5) {
                callback.call(this, LightResponse);
            } else if (args[0] == 6) {
                callback.call(this, MagneticFieldResponse);
            } else if (args[0] == 8) {
                callback.call(this, BarometerResponse);
            } else if (args[0] == 10) {
                callback.call(this, HallResponse);
            } else if (args[0] == 12) {
                callback.call(this, ProximityResponse);
            } else if (args[0] == 13) {
                callback.call(this, HumidityResponse);
            } else if (args[0] == 256) {
                callback.call(this, OrientationResponse);
            } else if (args[0] == 257) {
                callback.call(this, GravityResponse);
            } else if (args[0] == 258) {
                callback.call(this, LinearAccelerometerResponse);
            } else if (args[0] == 259) {
                callback.call(this, RotationVectorResponse);
            } else if (args[0] == 260) {
                callback.call(this, AmbientTemperatureResponse);
            } else if (args[0] == 261) {
                callback.call(this, MagneticFieldUncalibratedResponse);
            } else if (args[0] == 263) {
                callback.call(this, GyroscopeUncalibratedResponse);
            } else if (args[0] == 264) {
                callback.call(this, SignificantMotionResponse);
            } else if (args[0] == 265) {
                callback.call(this, PedometerDetectResponse);
            } else if (args[0] == 266) {
                callback.call(this, PedometerResponse);
            } else if (args[0] == 278) {
                callback.call(this, HeartRateResponse);
            } else if (args[0] == 280) {
                callback.call(this, WearDetectionResponse);
            } else if (args[0] == 281) {
                callback.call(this, AccelerometerUncalibratedResponse);
            }
        },
        once: function (...args) {
            console.warn('sensor.once interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (args[0] == 1) {
                args[len - 1].call(this, AccelerometerResponse);
            } else if (args[0] == 2) {
                args[len - 1].call(this, GyroscopeResponse);
            } else if (args[0] == 5) {
                args[len - 1].call(this, LightResponse);
            } else if (args[0] == 6) {
                args[len - 1].call(this, MagneticFieldResponse);
            } else if (args[0] == 8) {
                args[len - 1].call(this, BarometerResponse);
            } else if (args[0] == 10) {
                args[len - 1].call(this, HallResponse);
            } else if (args[0] == 12) {
                args[len - 1].call(this, ProximityResponse);
            } else if (args[0] == 13) {
                args[len - 1].call(this, HumidityResponse);
            } else if (args[0] == 256) {
                args[len - 1].call(this, OrientationResponse);
            } else if (args[0] == 257) {
                args[len - 1].call(this, GravityResponse);
            } else if (args[0] == 258) {
                args[len - 1].call(this, LinearAccelerometerResponse);
            } else if (args[0] == 259) {
                args[len - 1].call(this, RotationVectorResponse);
            } else if (args[0] == 260) {
                args[len - 1].call(this, AmbientTemperatureResponse);
            } else if (args[0] == 261) {
                args[len - 1].call(this, MagneticFieldUncalibratedResponse);
            } else if (args[0] == 263) {
                args[len - 1].call(this, GyroscopeUncalibratedResponse);
            } else if (args[0] == 264) {
                args[len - 1].call(this, SignificantMotionResponse);
            } else if (args[0] == 265) {
                args[len - 1].call(this, PedometerDetectResponse);
            } else if (args[0] == 266) {
                args[len - 1].call(this, PedometerResponse);
            } else if (args[0] == 278) {
                args[len - 1].call(this, HeartRateResponse);
            } else if (args[0] == 280) {
                args[len - 1].call(this, WearDetectionResponse);
            } else if (args[0] == 281) {
                args[len - 1].call(this, AccelerometerUncalibratedResponse);
            }
        },
        off: function (...args) {
            console.warn('sensor.off interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
        },
        getGeomagneticField: function (...args) {
            console.warn('sensor.getGeomagneticField interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, GeomagneticResponse);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(GeomagneticResponse);
                });
            }
        },
        getAltitude: function (...args) {
            console.warn('sensor.getAltitude interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                });
            }
        },
        getGeomagneticDip: function (...args) {
            console.warn('sensor.getGeomagneticDip interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramNumberMock);
                });
            }
        },
        getAngleModify: function (...args) {
            console.warn('sensor.getAngleModifiy interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paraNumberMock]);
            } else {
                return new Promise((resolve, reject) => {
                    resolve([paramMock.paraNumberMock]);
                });
            }
        },
        createRotationMatrix: function (...args) {
            console.warn('sensor.createRotationMatrix interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (len == 1) {
                return new Promise((resolve, reject) => {
                    resolve(paramMock.paramArrayMock);
                });
            } else if (len == 2) {
                if (typeof args[len - 1] == 'function') {
                    args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramArrayMock);
                } else {
                    return new Promise((resolve, reject) => {
                        resolve(RotationMatrixResponse);
                    });
                }
            } else if (len == 3) {
                args[len - 1].call(this, paramMock.businessErrorMock, paramMock.RotationMatrixResponse);
            }

        },
        transformCoordinateSystem: function (...args) {
            console.warn('sensor.transformCoordinateSystem interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paraNumberMock]);
            } else {
                return new Promise((resolve, reject) => {
                    resolve([paramMock.paraNumberMock]);
                });
            }
        },
        createQuaternion: function (...args) {
            console.warn('sensor.createQuaternion interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paraNumberMock]);
          } else {
                return new Promise((resolve, reject) => {
                    resolve([paramMock.paraNumberMock]);
                });
            }
        },
        getDirection: function (...args) {
            console.warn('sensor.getDirection interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, [paramMock.paraNumberMock]);
            } else {
                return new Promise((resolve, reject) => {
                    resolve([paramMock.paraNumberMock]);
                });
            }
        },
        getSingleSensor: function (...args) {
            console.warn('sensor.getSingleSensor interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock, Sensor);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(Sensor);
                });
            }
        },
        getSensorLists: function (...args) {
            console.warn('sensor.getSensorLists interface mocked in the Previewer. How this interface works on the'
                + 'Previewer may be different from that on a real device.')
            const len = args.length
            if (typeof args[len - 1] === 'function') {
                args[len - 1].call(this, paramMock.businessErrorMock,new Array(Sensor));
            } else {
                return new Promise((resolve, reject) => {
                    resolve(Array(Sensor));
                });
            }
        }
    };
    return sensor
}