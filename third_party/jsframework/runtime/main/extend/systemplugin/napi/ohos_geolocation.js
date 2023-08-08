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

export function mockOhosGeolocation() {
  const Location = {
    latitude: '[PC preview] unknow latitude',
    longitude: '[PC preview] unknow longitude',
    altitude: '[PC preview] unknow altitude',
    accuracy: '[PC preview] unknow accuracy',
    speed: '[PC preview] unknow speed',
    timeStamp: '[PC preview] unknow timeStamp',
    direction: '[PC preview] unknow direction',
    timeSinceBoot: '[PC preview] unknow timeSinceBoot',
    additions: [paramMock.paramStringMock],
    additionSize: '[PC preview] unknow additionSize',
  }
  const GeoAddress = {
    latitude: '[PC preview] unknow latitude',
    longitude: '[PC preview] unknow longitude',
    locale: '[PC preview] unknow locale',
    placeName: '[PC preview] unknow placeName',
    countryCode: '[PC preview] unknow countryCode',
    countryName: '[PC preview] unknow countryName',
    administrativeArea: '[PC preview] unknow administrativeArea',
    subAdministrativeArea: '[PC preview] unknow subAdministrativeArea',
    locality: '[PC preview] unknow locality',
    subLocality: '[PC preview] unknow subLocality',
    roadName: '[PC preview] unknow roadName',
    subRoadName: '[PC preview] unknow subRoadName',
    premises: '[PC preview] unknow premises',
    postalCode: '[PC preview] unknow postalCode',
    phoneNumber: '[PC preview] unknow phoneNumber',
    addressUrl: '[PC preview] unknow addressUrl',
    descriptions: [paramMock.paramStringMock],
    descriptionsSize: '[PC preview] unknow descriptionsSize',
  }
  const SatelliteStatusInfo = {
    satellitesNumber: '[PC preview] unknow satellitesNumber',
    satelliteIds: [paramMock.paramNumberMock],
    carrierToNoiseDensitys: [paramMock.paramNumberMock],
    altitudes: [paramMock.paramNumberMock],
    azimuths: [paramMock.paramNumberMock],
    carrierFrequencies: [paramMock.paramNumberMock],
  }
  const CountryCodeType = {
    COUNTRY_CODE_FROM_LOCALE: 1,
    COUNTRY_CODE_FROM_SIM: 2,
    COUNTRY_CODE_FROM_LOCATION: 3,
    COUNTRY_CODE_FROM_NETWORK: 4,
  }
  const CountryCode = {
    country: '[PC preview] unknow country',
    type: CountryCodeType,
  }
  const geolocation = {
    on: function (...args) {
      console.warn("geolocation.on interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'locationChange') {
            args[len - 1].call(this, Location);
        } else if (args[0] == 'locationServiceState') {
            args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] == 'cachedGnssLocationsReporting') {
            args[len - 1].call(this, [Location]);
        } else if (args[0] == 'gnssStatusChange') {
            args[len - 1].call(this, SatelliteStatusInfo);
        } else if (args[0] == 'nmeaMessageChange') {
            args[len - 1].call(this, paramMock.paramStringMock);
        } else if (args[0] == 'countryCodeChange') {
            args[len - 1].call(this, CountryCode);
        }
      }
    },
    off: function (...args) {
      console.warn("geolocation.off interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        if (args[0] == 'locationChange') {
            args[len - 1].call(this, Location);
        } else if (args[0] == 'locationServiceState') {
            args[len - 1].call(this, paramMock.paramBooleanMock);
        } else if (args[0] == 'cachedGnssLocationsReporting') {
            args[len - 1].call(this, [Location]);
        } else if (args[0] == 'gnssStatusChange') {
            args[len - 1].call(this, SatelliteStatusInfo);
        } else if (args[0] == 'nmeaMessageChange') {
            args[len - 1].call(this, paramMock.paramStringMock);
        } else if (args[0] == 'countryCodeChange') {
            args[len - 1].call(this, CountryCode);
        }
      }
    },
    getCurrentLocation: function (...args) {
      console.warn("geolocation.getCurrentLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Location);
      } else {
        return new Promise((resolve) => {
          resolve(Location);
        });
      }
    },
    getLastLocation: function (...args) {
      console.warn("geolocation.getLastLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, Location);
      } else {
        return new Promise((resolve) => {
          resolve(Location);
        });
      }
    },
    isLocationEnabled: function (...args) {
      console.warn("geolocation.isLocationEnabled interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    requestEnableLocation: function (...args) {
      console.warn("geolocation.requestEnableLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    enableLocation: function (...args) {
      console.warn("geolocation.enableLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    disableLocation: function (...args) {
      console.warn("geolocation.disableLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getAddressesFromLocation: function (...args) {
      console.warn("geolocation.getAddressesFromLocation interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [GeoAddress]);
      } else {
        return new Promise((resolve) => {
          resolve([GeoAddress]);
        });
      }
    },
    getAddressesFromLocationName: function (...args) {
      console.warn("geolocation.getAddressesFromLocationName interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [GeoAddress]);
      } else {
        return new Promise((resolve) => {
          resolve([GeoAddress]);
        });
      }
    },
    isGeoServiceAvailable: function (...args) {
      console.warn("geolocation.isGeoServiceAvailable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock);
        });
      }
    },
    getCachedGnssLocationsSize: function (...args) {
      console.warn("geolocation.getCachedGnssLocationsSize interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock);
      } else {
          return new Promise((resolve) => {
              resolve(paramMock.paramNumberMock);
          });
      }
    },
    flushCachedGnssLocations: function (...args) {
      console.warn("geolocation.flushCachedGnssLocations interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
          return new Promise((resolve) => {
              resolve(paramMock.paramBooleanMock);
          });
      }
    },
    sendCommand: function (...args) {
      console.warn("geolocation.sendCommand interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
          return new Promise((resolve) => {
              resolve(paramMock.paramBooleanMock);
          });
      }
    },
    getCountryCode: function (...args) {
      console.warn("geolocation.getCountryCode interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, CountryCode);
      } else {
          return new Promise((resolve) => {
              resolve(CountryCode);
          });
      }
    },
    enableLocationMock: function (...args) {
      console.warn("geolocation.enableLocationMock interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    disableLocationMock: function (...args) {
      console.warn("geolocation.disableLocationMock interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    setMockedLocations: function (...args) {
      console.warn("geolocation.setMockedLocations interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    enableReverseGeocodingMock: function (...args) {
      console.warn("geolocation.enableReverseGeocodingMock interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    disableReverseGeocodingMock: function (...args) {
      console.warn("geolocation.disableReverseGeocodingMock interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    setReverseGeocodingMockInfo: function (...args) {
      console.warn("geolocation.setReverseGeocodingMockInfo interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
          return new Promise((resolve) => {
              resolve();
          });
      }
    },
    isLocationPrivacyConfirmed: function (...args) {
      console.warn("geolocation.isLocationPrivacyConfirmed interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
          return new Promise((resolve) => {
              resolve(paramMock.paramBooleanMock);
          });
      }
    },
    setLocationPrivacyConfirmStatus: function (...args) {
      console.warn("geolocation.setLocationPrivacyConfirmStatus interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      const len = args.length;
      if (typeof args[len - 1] === 'function') {
          args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
          return new Promise((resolve) => {
              resolve(paramMock.paramBooleanMock);
          });
      }
    },
  }
  return geolocation
}
