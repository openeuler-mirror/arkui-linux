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

export const MessageParcelClass = class MessageParcel {
  constructor() {
    console.warn('rpc.MessageParcel.constructor interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.');
    this.reclaim = function () {
      console.warn("MessageParcel.reclaim interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.writeRemoteObject = function (...args) {
      console.warn("MessageParcel.writeRemoteObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.readRemoteObject = function () {
      console.warn("MessageParcel.readRemoteObject interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return IRemoteObjectMock
    };
    this.writeInterfaceToken = function (...args) {
      console.warn("MessageParcel.writeInterfaceToken interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.readInterfaceToken = function () {
      console.warn("MessageParcel.readInterfaceToken interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    };
    this.getSize = function () {
      console.warn("MessageParcel.getSize interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.getCapacity = function () {
      console.warn("MessageParcel.getCapacity interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.setSize = function (...args) {
      console.warn("MessageParcel.setSize interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.setCapacity = function (...args) {
      console.warn("MessageParcel.setCapacity interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.getWritableBytes = function () {
      console.warn("MessageParcel.getWritableBytes interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.getReadableBytes = function () {
      console.warn("MessageParcel.getReadableBytes interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.getReadPosition = function () {
      console.warn("MessageParcel.getReadPosition interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.getWritePosition = function () {
      console.warn("MessageParcel.getWritePosition interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.rewindRead = function (...args) {
      console.warn("MessageParcel.rewindRead interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.rewindWrite = function (...args) {
      console.warn("MessageParcel.rewindWrite interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeNoException = function () {
      console.warn("MessageParcel.writeNoException interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readException = function () {
      console.warn("MessageParcel.readException interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.writeByte = function (...args) {
      console.warn("MessageParcel.writeByte interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeShort = function (...args) {
      console.warn("MessageParcel.writeShort interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeInt = function (...args) {
      console.warn("MessageParcel.writeInt interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeLong = function (...args) {
      console.warn("MessageParcel.writeLong interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeFloat = function (...args) {
      console.warn("MessageParcel.writeFloat interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeDouble = function (...args) {
      console.warn("MessageParcel.writeDouble interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeBoolean = function (...args) {
      console.warn("MessageParcel.writeBoolean interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeChar = function (...args) {
      console.warn("MessageParcel.writeChar interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeString = function (...args) {
      console.warn("MessageParcel.writeString interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeSequenceable = function (...args) {
      console.warn("MessageParcel.writeSequenceable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeByteArray = function (...args) {
      console.warn("MessageParcel.writeByteArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeShortArray = function (...args) {
      console.warn("MessageParcel.writeShortArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeIntArray = function (...args) {
      console.warn("MessageParcel.writeIntArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeLongArray = function (...args) {
      console.warn("MessageParcel.writeLongArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeFloatArray = function (...args) {
      console.warn("MessageParcel.writeFloatArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeDoubleArray = function (...args) {
      console.warn("MessageParcel.writeDoubleArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeBooleanArray = function (...args) {
      console.warn("MessageParcel.writeBooleanArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeCharArray = function (...args) {
      console.warn("MessageParcel.writeCharArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeStringArray = function (...args) {
      console.warn("MessageParcel.writeStringArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeSequenceableArray = function (...args) {
      console.warn("MessageParcel.writeSequenceableArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.writeRemoteObjectArray = function (...args) {
      console.warn("MessageParcel.writeRemoteObjectArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.readByte = function () {
      console.warn("MessageParcel.readByte interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readShort = function () {
      console.warn("MessageParcel.readShort interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readInt = function () {
      console.warn("MessageParcel.readInt interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readLong = function () {
      console.warn("MessageParcel.readLong interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readFloat = function () {
      console.warn("MessageParcel.readFloat interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readDouble = function () {
      console.warn("MessageParcel.readDouble interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readBoolean = function () {
      console.warn("MessageParcel.readBoolean interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.readChar = function () {
      console.warn("MessageParcel.readChar interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.readString = function () {
      console.warn("MessageParcel.readString interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    };
    this.readSequenceable = function (...args) {
      console.warn("MessageParcel.readSequenceable interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.readByteArray = function (...args) {
      console.warn("MessageParcel.readByteArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readByteArray = function () {
      console.warn("MessageParcel.readByteArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readShortArray = function (...args) {
      console.warn("MessageParcel.readShortArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readShortArray = function () {
      console.warn("MessageParcel.readShortArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readIntArray = function (...args) {
      console.warn("MessageParcel.readIntArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readIntArray = function () {
      console.warn("MessageParcel.readIntArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readLongArray = function (...args) {
      console.warn("MessageParcel.readLongArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readLongArray = function () {
      console.warn("MessageParcel.readLongArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readFloatArray = function (...args) {
      console.warn("MessageParcel.readFloatArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readFloatArray = function () {
      console.warn("MessageParcel.readFloatArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readDoubleArray = function (...args) {
      console.warn("MessageParcel.readDoubleArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readDoubleArray = function () {
      console.warn("MessageParcel.readDoubleArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readBooleanArray = function (...args) {
      console.warn("MessageParcel.readBooleanArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readBooleanArray = function () {
      console.warn("MessageParcel.readBooleanArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readCharArray = function (...args) {
      console.warn("MessageParcel.readCharArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readCharArray = function () {
      console.warn("MessageParcel.readCharArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readStringArray = function (...args) {
      console.warn("MessageParcel.readStringArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readStringArray = function () {
      console.warn("MessageParcel.readStringArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.readSequenceableArray = function (...args) {
      console.warn("MessageParcel.readSequenceableArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readRemoteObjectArray = function (...args) {
      console.warn("MessageParcel.readRemoteObjectArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.readRemoteObjectArray = function () {
      console.warn("MessageParcel.readRemoteObjectArray interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
    this.containFileDescriptors = function () {
      console.warn("MessageParcel.containFileDescriptors interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    };
    this.writeFileDescriptor = function (...args) {
      console.warn("MessageParcel.writeFileDescriptor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    };
    this.readFileDescriptor = function () {
      console.warn("MessageParcel.readFileDescriptor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    };
    this.writeAshmem = function (...args) {
      console.warn("MessageParcel.writeAshmem interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    };
    this.readAshmem = function () {
      console.warn("MessageParcel.readAshmem interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return new AshmemClass();
    };
    this.getRawDataCapacity = function () {
      console.warn("MessageParcel.getRawDataCapacity interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock;
    };
    this.writeRawData = function (...args) {
      console.warn("MessageParcel.writeRawData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock;
    };
    this.readRawData = function (...args) {
      console.warn("MessageParcel.readRawData interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramArrayMock;
    };
  }
};
MessageParcelClass.create = function () {
  console.warn("MessageParcel.create interface mocked in the Previewer. How this interface works on the" +
    " Previewer may be different from that on a real device.")
  return new MessageParcelClass()
};
MessageParcelClass.closeFileDescriptor = function (...args) {
  console.warn("MessageParcel.closeFileDescriptor interface mocked in the Previewer. How this interface works on the" +
    " Previewer may be different from that on a real device.")
};
MessageParcelClass.dupFileDescriptor = function (...args) {
  console.warn("MessageParcel.dupFileDescriptor interface mocked in the Previewer. How this interface works on the" +
    " Previewer may be different from that on a real device.")
  return paramMock.paramNumberMock
};
export const MessageOptionClass = class MessageOption {
  constructor(...args) {
    console.warn('rpc.MessageOption constructor interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.')
    this.getFlags = function () {
      console.warn("MessageOption.getFlags interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.setFlags = function (...args) {
      console.warn("MessageOption.setFlags interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.getWaitTime = function () {
      console.warn("MessageOption.getWaitTime interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.setWaitTime = function (...args) {
      console.warn("MessageOption.setWaitTime interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.TF_SYNC = 0;
    this.TF_ASYNC = 1;
    this.TF_ACCEPT_FDS = 0x10;
    this.TF_WAIT_TIME = 4;
  }
};
export const AshmemClass = class Ashmem {
  constructor() {
    console.warn('rpc.Ashmem constructor interface mocked in the Previewer. How this interface works on the' +
      ' Previewer may be different from that on a real device.')
    this.closeAshmem = function () {
      console.warn('Ashmem.closeAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
    };
    this.unmapAshmem = function () {
      console.warn('Ashmem.unmapAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
    };
    this.getAshmemSize = function () {
      console.warn('Ashmem.getAshmemSize interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramNumberMock
    };
    this.mapAshmem = function (...args) {
      console.warn('Ashmem.mapAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramBooleanMock
    };
    this.mapReadAndWriteAshmem = function () {
      console.warn('Ashmem.mapReadAndWriteAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramBooleanMock
    };
    this.mapReadOnlyAshmem = function () {
      console.warn('Ashmem.mapReadOnlyAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramBooleanMock
    };
    this.setProtection = function (...args) {
      console.warn('Ashmem.setProtection interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramBooleanMock
    };
    this.writeToAshmem = function (...args) {
      console.warn('Ashmem.writeToAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramBooleanMock
    };
    this.readFromAshmem = function (...args) {
      console.warn('Ashmem.readFromAshmem interface mocked in the Previewer. How this interface works on the' +
        ' Previewer may be different from that on a real device.')
      return paramMock.paramArrayMock
    };
    this.PROT_EXEC = 4;
    this.PROT_NONE = 0;
    this.PROT_READ = 1;
    this.PROT_WRITE = 2;
  }
};
AshmemClass.createAshmem = function (...args) {
  console.warn('Ashmem.createAshmem interface mocked in the Previewer. How this interface works on the' +
    ' Previewer may be different from that on a real device.')
  return new AshmemClass()
};
AshmemClass.createAshmemFromExisting = function (...args) {
  console.warn('Ashmem.createAshmemFromExisting interface mocked in the Previewer. How this interface works on the' +
    ' Previewer may be different from that on a real device.')
  return new AshmemClass()
};
export const RemoteObjectClass = class RemoteObject {
  constructor(...args) {
    console.warn("rpc.RemoteObject constructor interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    this.queryLocalInterface = function (...args) {
      console.warn("RemoteObject.queryLocalInterface interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return IRemoteBrokerMock
    };
    this.getInterfaceDescriptor = function () {
      console.warn("RemoteObject.getInterfaceDescriptor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    };
    this.onRemoteRequest = function (...args) {
      console.warn("RemoteObject.onRemoteRequest interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.sendRequest = function (...args) {
      console.warn("RemoteObject.sendRequest interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, SendRequestResultMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(SendRequestResultMock)
        })
      }
    };
    this.getCallingPid = function () {
      console.warn("RemoteObject.getCallingPid interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.getCallingUid = function () {
      console.warn("RemoteObject.getCallingUid interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramNumberMock
    };
    this.attachLocalInterface = function (...args) {
      console.warn("RemoteObject.attachLocalInterface interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
    };
    this.addDeathRecipient = function (...args) {
      console.warn("RemoteObject.addDeathRecipient interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.removeDeathRecipient = function (...args) {
      console.warn("RemoteObject.removeDeathRecipient interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.isObjectDead = function () {
      console.warn("RemoteObject.isObjectDead interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
  }
};
export const RemoteProxyClass = class RemoteProxy {
  constructor() {
    console.warn("rpc.RemoteProxy constructor interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    this.queryLocalInterface = function (...args) {
      console.warn("RemoteProxy.queryLocalInterface interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return IRemoteBrokerMock
    };
    this.getInterfaceDescriptor = function () {
      console.warn("RemoteProxy.getInterfaceDescriptor interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramStringMock
    };
    this.addDeathRecipient = function (...args) {
      console.warn("RemoteProxy.addDeathRecipient interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.removeDeathRecipient = function (...args) {
      console.warn("RemoteProxy.removeDeathRecipient interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.isObjectDead = function () {
      console.warn("RemoteProxy.isObjectDead interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      return paramMock.paramBooleanMock
    };
    this.sendRequest = function (...args) {
      console.warn("RemoteProxy.sendRequest mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (len > 0 && typeof args[len - 1] === 'function') {
        args[len - 1].call(this, SendRequestResultMock)
      } else {
        return new Promise((resolve, reject) => {
          resolve(SendRequestResultMock)
        })
      }
    };
    this.PING_TRANSACTION = ('_'.charCodeAt(0) << 24) | ('P'.charCodeAt(0) << 16) |
        ('N'.charCodeAt(0) << 8) | 'G'.charCodeAt(0);
    this.DUMP_TRANSACTION = ('_'.charCodeAt(0) << 24) | ('D'.charCodeAt(0) << 16) |
        ('M'.charCodeAt(0) << 8) | 'P'.charCodeAt(0);
    this.INTERFACE_TRANSACTION = ('_'.charCodeAt(0) << 24) | ('N'.charCodeAt(0) << 16) |
        ('T'.charCodeAt(0) << 8) | 'F'.charCodeAt(0);
    this.MIN_TRANSACTION_ID = 0x1;
    this.MAX_TRANSACTION_ID = 0x00FFFFFF;
  }
};
export const IRemoteObjectMock = {
  queryLocalInterface: function (...args) {
    console.warn("IRemoteObject.queryLocalInterface interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return IRemoteBrokerMock
  },
  sendRequest: function (...args) {
    console.warn("IRemoteObject.sendRequest interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    const len = args.length
    if (len > 0 && typeof args[len - 1] === 'function') {
      args[len - 1].call(this, SendRequestResultMock)
    } else {
      return new Promise((resolve, reject) => {
        resolve(SendRequestResultMock)
      })
    }
  },
  addDeathRecipient: function (...args) {
    console.warn("IRemoteObject.addDeathRecipient interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  },
  removeDeathRecipient: function (...args) {
    console.warn("IRemoteObject.removeDeathRecipient interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  },
  getInterfaceDescriptor: function () {
    console.warn("IRemoteObject.getInterfaceDescriptor interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  isObjectDead: function () {
    console.warn("IRemoteObject.isObjectDead interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  }
};
export const IRemoteBrokerMock = {
  asObject: function () {
    console.warn("IRemoteBroker.asObject interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return IRemoteObjectMock
  }
};
export const SendRequestResultMock = {
  errCode: "[PC Preview]: unknow errCode",
  code: "[PC Preview]: unknow code",
  data: "[PC Preview]: unknow data",
  reply: "[PC Preview]: unknow reply",
};
export const SequenceableMock = {
  marshalling: function (...args) {
    console.warn("Sequenceable.marshalling interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  },

  unmarshalling: function (...args) {
    console.warn("Sequenceable.unmarshalling interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  }
};
export const DeathRecipientMock = {
  onRemoteDied: function () {
    console.warn("DeathRecipient.onRemoteDied interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
  }
};
export const IPCSkeletonMock = {
  getContextObject: function () {
    console.warn("IPCSkeleton.getContextObject interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return IRemoteObjectMock
  },
  getCallingPid: function () {
    console.warn("IPCSkeleton.getCallingPid interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getCallingUid: function () {
    console.warn("IPCSkeleton.getCallingUid interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getCallingTokenId: function () {
    console.warn("IPCSkeleton.getCallingTokenId interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  getCallingDeviceID: function () {
    console.warn("IPCSkeleton.getCallingDeviceID interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  getLocalDeviceID: function () {
    console.warn("IPCSkeleton.getLocalDeviceID interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  isLocalCalling: function () {
    console.warn("IPCSkeleton.isLocalCalling interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  },
  flushCommands: function (...args) {
    console.warn("IPCSkeleton.flushCommands interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramNumberMock
  },
  resetCallingIdentity: function () {
    console.warn("IPCSkeleton.resetCallingIdentity interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramStringMock
  },
  setCallingIdentity: function (...args) {
    console.warn("IPCSkeleton.setCallingIdentity interface mocked in the Previewer. How this interface works on the" +
      " Previewer may be different from that on a real device.")
    return paramMock.paramBooleanMock
  }
};
export function mockRpc() {
  const rpcMock = {
    IRemoteObject: IRemoteObjectMock,
    IRemoteBroker: IRemoteBrokerMock,
    SendRequestResult: SendRequestResultMock,
    Sequenceable: SequenceableMock,
    DeathRecipient: DeathRecipientMock,
    IPCSkeleton: IPCSkeletonMock,
    MessageParcel: MessageParcelClass,
    MessageOption: MessageOptionClass,
    Ashmem: AshmemClass,
    RemoteObject: RemoteObjectClass,
    RemoteProxy: RemoteProxyClass
  };
  return rpcMock
}
