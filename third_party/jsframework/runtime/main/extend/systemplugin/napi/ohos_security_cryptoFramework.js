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

export function mockCryptoFramework() {
  const DataBlob = {
    data: paramMock.paramArrayMock,
  }
  const DataArray = {
    data: [paramMock.paramArrayMock],
  }
  const EncodingBlob = {
    data: paramMock.paramArrayMock,
    encodingFormat: "[PC Preview] unknow encodingFormat",
  }
  const SymKey = {
    format: "[PC Preview] unknow format",
    algName: "[PC Preview] unknow algName",
    getEncoded: function () {
      console.warn("SymKey.getEncoded interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    clearMem: function () {
      console.warn("SymKey.clearMem interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
    },
  }
  const PriKey = {
    format: "[PC Preview] unknow format",
    algName: "[PC Preview] unknow algName",
    getEncoded: function () {
      console.warn("PriKey.getEncoded interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    clearMem: function () {
      console.warn("PriKey.clearMem interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
    },
  }
  const PubKey = {
    format: "[PC Preview] unknow format",
    algName: "[PC Preview] unknow algName",
    getEncoded: function () {
      console.warn("PubKey.getEncoded interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
  }
  const KeyPair = {
    priKey: PriKey,
    pubKey: PubKey,
  }
  const Random = {
    generateRandom: function (...args) {
      console.warn("Random.generateRandom interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    setSeed: function (...args) {
      console.warn("Random.setSeed interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
  }
  const AsyKeyGenerator = {
    algName: "[PC Preview] unknow algName",
    generateKeyPair: function (...args) {
      console.warn("AsyKeyGenerator.generateKeyPair interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, KeyPair);
      } else {
        return new Promise((resolve, reject) => {
          resolve(KeyPair);
        })
      }
    },
    convertKey: function (...args) {
      console.warn("AsyKeyGenerator.convertKey interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, KeyPair);
      } else {
        return new Promise((resolve, reject) => {
          resolve(KeyPair);
        })
      }
    },
  }
  const SymKeyGenerator = {
    algName: "[PC Preview] unknow algName",
    generateSymKey: function (...args) {
      console.warn("SymKeyGenerator.generateSymKey interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SymKey);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SymKey);
        })
      }
    },
    convertKey: function (...args) {
      console.warn("SymKeyGenerator.convertKey interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, SymKey);
      } else {
        return new Promise((resolve, reject) => {
          resolve(SymKey);
        })
      }
    },
  }
  const Mac = {
    algName: "[PC Preview] unknow algName",
    init: function (...args) {
      console.warn("Mac.init interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    update: function (...args) {
      console.warn("Mac.update interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    doFinal: function (...args) {
      console.warn("Mac.doFinal interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    getMacLength: function () {
      console.warn("Mac.getMacLength interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
  }
  const Md = {
    algName: "[PC Preview] unknow algName",
    update: function (...args) {
      console.warn("Md.update interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    digest: function (...args) {
      console.warn("Md.digest interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    getMdLength: function () {
      console.warn("Md.getMdLength interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
  }
  const Cipher = {
    algName: "[PC Preview] unknow algName",
    init: function (...args) {
      console.warn("Cipher.init interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    update: function (...args) {
      console.warn("Cipher.update interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    doFinal: function (...args) {
      console.warn("Cipher.doFinal interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
  }
  const Sign = {
    algName: "[PC Preview] unknow algName",
    init: function (...args) {
      console.warn("Sign.init interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    update: function (...args) {
      console.warn("Sign.update interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    sign: function (...args) {
      console.warn("Sign.sign interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
  }
  const Verify = {
    algName: "[PC Preview] unknow algName",
    init: function (...args) {
      console.warn("Verify.init interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    update: function (...args) {
      console.warn("Verify.update interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    verify: function (...args) {
      console.warn("Verify.verify interface mocked in the Previewer." +
      " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
  }
  const KeyAgreement = {
    algName: "[PC Preview] unknow algName",
    generateSecret: function (...args) {
      console.warn("KeyAgreement.generateSecret interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
  }
  const X509Cert = {
    verify: function (...args) {
      console.warn("X509Cert.verify interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getEncoded: function (...args) {
      console.warn("X509Cert.getEncoded interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EncodingBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EncodingBlob);
        })
      }
    },
    getPublicKey: function (...args) {
      console.warn("X509Cert.getPublicKey interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, PubKey);
      } else {
        return new Promise((resolve, reject) => {
          resolve(PubKey);
        })
      }
    },
    checkValidityWithDate: function (...args) {
      console.warn("X509Cert.checkValidityWithDate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getVersion: function () {
      console.warn("X509Cert.getVersion interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getSerialNumber: function () {
      console.warn("X509Cert.getSerialNumber interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getIssuerName: function () {
      console.warn("X509Cert.getIssuerName interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getSubjectName: function () {
      console.warn("X509Cert.getSubjectName interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getNotBeforeTime: function () {
      console.warn("X509Cert.getNotBeforeTime interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getNotAfterTime: function () {
      console.warn("X509Cert.getNotAfterTime interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getSignature: function () {
      console.warn("X509Cert.getSignature interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getSignatureAlgName: function () {
      console.warn("X509Cert.getSignatureAlgName interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getSignatureAlgOid: function () {
      console.warn("X509Cert.getSignatureAlgOid interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getSignatureAlgParams: function () {
      console.warn("X509Cert.getSignatureAlgParams interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getKeyUsage: function () {
      console.warn("X509Cert.getKeyUsage interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getExtKeyUsage: function () {
      console.warn("X509Cert.getExtKeyUsage interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataArray
    },
    getBasicConstraints: function () {
      console.warn("X509Cert.getBasicConstraints interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getSubjectAltNames: function () {
      console.warn("X509Cert.getSubjectAltNames interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataArray
    },
    getIssuerAltNames: function () {
      console.warn("X509Cert.getIssuerAltNames interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataArray
    },
  }
  const X509CrlEntry = {
    getEncoded: function (...args) {
      console.warn("X509CrlEntry.getEncoded interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EncodingBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EncodingBlob);
        })
      }
    },
    getSerialNumber: function () {
      console.warn("X509CrlEntry.getSerialNumber interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getCertIssuer: function (...args) {
      console.warn("X509CrlEntry.getCertIssuer interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    getRevocationDate: function (...args) {
      console.warn("X509CrlEntry.getRevocationDate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramStringMock);
        })
      }
    },
  }
  const X509Crl = {
    isRevoked: function (...args) {
      console.warn("X509Crl.isRevoked interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve(paramMock.paramBooleanMock);
        })
      }
    },
    getType: function () {
      console.warn("X509Crl.getType interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getEncoded: function (...args) {
      console.warn("X509Crl.getEncoded interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, EncodingBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(EncodingBlob);
        })
      }
    },
    verify: function (...args) {
      console.warn("X509Crl.verify interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
    getVersion: function () {
      console.warn("X509Crl.getVersion interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    },
    getIssuerName: function () {
      console.warn("X509Crl.getIssuerName interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getLastUpdate: function () {
      console.warn("X509Crl.getLastUpdate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getNextUpdate: function () {
      console.warn("X509Crl.getNextUpdate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getRevokedCert: function (...args) {
      console.warn("X509Crl.getRevokedCert interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, X509CrlEntry);
      } else {
        return new Promise((resolve, reject) => {
          resolve(X509CrlEntry);
        })
      }
    },
    getRevokedCertWithCert: function (...args) {
      console.warn("X509Crl.getRevokedCertWithCert interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, X509CrlEntry);
      } else {
        return new Promise((resolve, reject) => {
          resolve(X509CrlEntry);
        })
      }
    },
    getRevokedCerts: function (...args) {
      console.warn("X509Crl.getRevokedCerts interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, [X509CrlEntry]);
      } else {
        return new Promise((resolve, reject) => {
          resolve([X509CrlEntry]);
        })
      }
    },
    getTbsInfo: function (...args) {
      console.warn("X509Crl.getTbsInfo interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, DataBlob);
      } else {
        return new Promise((resolve, reject) => {
          resolve(DataBlob);
        })
      }
    },
    getSignature: function () {
      console.warn("X509Crl.getSignature interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
    getSignatureAlgName: function () {
      console.warn("X509Crl.getSignatureAlgName interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getSignatureAlgOid: function () {
      console.warn("X509Crl.getSignatureAlgOid interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    },
    getSignatureAlgParams: function () {
      console.warn("X509Crl.getSignatureAlgParams interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return DataBlob
    },
  }
  const CertChainValidator = {
    algorithm: "[PC Preview] unknow algorithm",
    validate: function (...args) {
      console.warn("CertChainValidator.validate interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock);
      } else {
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    },
  }
  const cryptoFramework = {
    Result: {
      INVALID_PARAMS: 401,
      NOT_SUPPORT: 801,
      ERR_OUT_OF_MEMORY: 17620001,
      ERR_INTERNAL_ERROR: 17620002,
      ERR_CRYPTO_OPERATION: 17630001,
      ERR_CERT_SIGNATURE_FAILURE: 17630002,
      ERR_CERT_NOT_YET_VALID: 17630003,
      ERR_CERT_HAS_EXPIRED: 17630004,
      ERR_UNABLE_TO_GET_ISSUER_CERT_LOCALLY: 17630005,
      ERR_KEYUSAGE_NO_CERTSIGN: 17630006,
      ERR_KEYUSAGE_NO_DIGITAL_SIGNATURE: 17630007,
    },
    EncodingFormat: {
      FORMAT_DER: 0,
      FORMAT_PEM: 1,
    },
    CryptoMode: {
      ENCRYPT_MODE: 0,
      DECRYPT_MODE: 1,
    },
    createRandom: function () {
      console.warn("cryptoFramework.createRandom interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Random;
    },
    createAsyKeyGenerator: function (...args) {
      console.warn("cryptoFramework.createAsyKeyGenerator interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return AsyKeyGenerator;
    },
    createSymKeyGenerator: function (...args) {
      console.warn("cryptoFramework.createSymKeyGenerator interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return SymKeyGenerator;
    },
    createMac: function (...args) {
      console.warn("cryptoFramework.createMac interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Mac;
    },
    createMd: function (...args) {
      console.warn("cryptoFramework.createMd interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Md;
    },
    createCipher: function (...args) {
      console.warn("cryptoFramework.createCipher interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Cipher;
    },
    createSign: function (...args) {
      console.warn("cryptoFramework.createSign interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Sign;
    },
    createVerify: function (...args) {
      console.warn("cryptoFramework.createVerify interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return Verify;
    },
    createKeyAgreement: function (...args) {
      console.warn("cryptoFramework.createKeyAgreement interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return KeyAgreement;
    },
    createX509Cert: function (...args) {
      console.warn("cryptoFramework.createX509Cert interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, X509Cert);
      } else {
        return new Promise((resolve, reject) => {
          resolve(X509Cert);
        })
      }
    },
    createX509Crl: function (...args) {
      console.warn("cryptoFramework.createX509Crl interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, X509Crl);
      } else {
        return new Promise((resolve, reject) => {
          resolve(X509Crl);
        })
      }
    },
    createCertChainValidator: function (...args) {
      console.warn("cryptoFramework.createCertChainValidator interface mocked in the Previewer." +
        " How this interface works on the Previewer may be different from that on a real device.")
      return CertChainValidator;
    },
  }
  return cryptoFramework;
}
