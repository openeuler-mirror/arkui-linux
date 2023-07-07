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

export function mockContact() {
  const ContactClass = class Contact {
    constructor() {
      console.warn('contact.Contact.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.id = "[PC Preview] unknow id";
      this.key = "[PC Preview] unknow key";
      this.contactAttributes = "[PC Preview] unknow contactAttributes";
      this.emails = "[PC Preview] unknow emails";
      this.events = "[PC Preview] unknow events";
      this.groups = "[PC Preview] unknow groups";
      this.imAddresses = "[PC Preview] unknow imAddresses";
      this.phoneNumbers = "[PC Preview] unknow phoneNumbers";
      this.portrait = "[PC Preview] unknow portrait";
      this.postalAddresses = "[PC Preview] unknow postalAddresses";
      this.relations = "[PC Preview] unknow relations";
      this.sipAddresses = "[PC Preview] unknow sipAddresses";
      this.websites = "[PC Preview] unknow websites";
      this.name = "[PC Preview] unknow name";
      this.nickName = "[PC Preview] unknow nickName";
      this.note = "[PC Preview] unknow note";
      this.organization = "[PC Preview] unknow organization";
    }
  }
  ContactClass.INVALID_CONTACT_ID = -1;

  const ContactAttributesClass = class ContactAttributes {
    constructor() {
      console.warn('contact.ContactAttributes.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.attributes = ["[PC Preview] unknow Attribute"]
    }
  }
  const EmailClass = class Email {
    constructor() {
      console.warn('contact.Email.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.EMAIL_HOME = 1;
      this.EMAIL_WORK = 2;
      this.EMAIL_OTHER = 3;
      this.INVALID_LABEL_ID = -1;
      this.email = "[PC Preview] unknow email";
      this.labelName = "[PC Preview] unknow labelName";
      this.displayName = "[PC Preview] unknow displayName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const EventClass = class Event {
    constructor() {
      console.warn('contact.Event.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.EVENT_ANNIVERSARY = 1;
      this.EVENT_OTHER = 2;
      this.EVENT_BIRTHDAY = 3;
      this.INVALID_LABEL_ID = -1;
      this.eventDate = "[PC Preview] unknow eventDate";
      this.labelName = "[PC Preview] unknow labelName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const GroupClass = class Group {
    constructor() {
      console.warn('contact.Group.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.groupId = "[PC Preview] unknow groupId";
      this.title = "[PC Preview] unknow title";
    }
  }
  const HolderClass = class Holder {
    constructor() {
      console.warn('contact.Holder.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.bundleName = "[PC Preview] unknow bundleName";
      this.displayName = "[PC Preview] unknow displayName";
      this.holderId = "[PC Preview] unknow holderId";
    }
  }
  const ImAddressClass = class ImAddress {
    constructor() {
      console.warn('contact.ImAddress.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = -1;
      this.IM_AIM = 0;
      this.IM_MSN = 1;
      this.IM_YAHOO = 2;
      this.IM_SKYPE = 3;
      this.IM_QQ = 4;
      this.IM_ICQ = 6;
      this.IM_JABBER = 7;
      this.INVALID_LABEL_ID = -2;
      this.imAddress = "[PC Preview] unknow imAddress";
      this.labelName = "[PC Preview] unknow labelName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const NameClass = class Name {
    constructor() {
      console.warn('contact.Name.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.familyName = "[PC Preview] unknow familyName";
      this.familyNamePhonetic = "[PC Preview] unknow familyNamePhonetic";
      this.fullName = "[PC Preview] unknow fullName";
      this.givenName = "[PC Preview] unknow givenName";
      this.givenNamePhonetic = "[PC Preview] unknow givenNamePhonetic";
      this.middleNamePhonetic = "[PC Preview] unknow middleNamePhonetic";
      this.namePrefix = "[PC Preview] unknow namePrefix";
      this.nameSuffix = "[PC Preview] unknow nameSuffix";
      this.middleName = "[PC Preview] unknow middleName";
    }
  }
  const NickNameClass = class NickName {
    constructor() {
      console.warn('contact.NickName.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.nickName = "[PC Preview] unknow nickName";
    }
  }
  const NoteClass = class Note {
    constructor() {
      console.warn('contact.Note.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.noteContent = "[PC Preview] unknow noteContent";
    }
  }
  const OrganizationClass = class Organization {
    constructor() {
      console.warn('contact.Organization.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.name = "[PC Preview] unknow name";
      this.title = "[PC Preview] unknow title";
    }
  }
  const PhoneNumberClass = class PhoneNumber {
    constructor() {
      console.warn('contact.PhoneNumber.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.NUM_HOME = 1;
      this.NUM_MOBILE = 2;
      this.NUM_WORK = 3;
      this.NUM_FAX_WORK = 4;
      this.NUM_FAX_HOME = 5;
      this.NUM_PAGER = 6;
      this.NUM_OTHER = 7;
      this.NUM_CALLBACK = 8;
      this.NUM_CAR = 9;
      this.NUM_COMPANY_MAIN = 10;
      this.NUM_ISDN = 11;
      this.NUM_MAIN = 12;
      this.NUM_OTHER_FAX = 13;
      this.NUM_RADIO = 14;
      this.NUM_TELEX = 15;
      this.NUM_TTY_TDD = 16;
      this.NUM_WORK_MOBILE = 17;
      this.NUM_WORK_PAGER = 18;
      this.NUM_ASSISTANT = 19;
      this.NUM_MMS = 20;
      this.INVALID_LABEL_ID = -1;
      this.phoneNumber = "[PC Preview] unknow phoneNumber";
      this.labelName = "[PC Preview] unknow labelName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const PortraitClass = class Portrait {
    constructor() {
      console.warn('contact.Portrait.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.uri = "[PC Preview] unknow uri";
    }
  }
  const PostalAddressClass = class PostalAddress {
    constructor() {
      console.warn('contact.PostalAddress.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.ADDR_HOME = 1;
      this.ADDR_WORK = 2;
      this.ADDR_OTHER = 3;
      this.INVALID_LABEL_ID = -1;
      this.city = "[PC Preview] unknow city";
      this.country = "[PC Preview] unknow country";
      this.labelName = "[PC Preview] unknow labelName";
      this.neighborhood = "[PC Preview] unknow neighborhood";
      this.pobox = "[PC Preview] unknow pobox";
      this.postalAddress = "[PC Preview] unknow postalAddress";
      this.postcode = "[PC Preview] unknow postcode";
      this.region = "[PC Preview] unknow region";
      this.street = "[PC Preview] unknow street";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const RelationClass = class Relation {
    constructor() {
      console.warn('contact.Relation.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.RELATION_ASSISTANT = 1;
      this.RELATION_BROTHER = 2;
      this.RELATION_CHILD = 3;
      this.RELATION_DOMESTIC_PARTNER = 4;
      this.RELATION_FATHER = 5;
      this.RELATION_FRIEND = 6;
      this.RELATION_MANAGER = 7;
      this.RELATION_MOTHER = 8;
      this.RELATION_PARENT = 9;
      this.RELATION_PARTNER = 10;
      this.RELATION_REFERRED_BY = 11;
      this.RELATION_RELATIVE = 12;
      this.RELATION_SISTER = 13;
      this.RELATION_SPOUSE = 14;
      this.INVALID_LABEL_ID = -1;
      this.relationName = "[PC Preview] unknow relationName";
      this.labelName = "[PC Preview] unknow labelName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const SipAddressClass = class SipAddress {
    constructor() {
      console.warn('contact.SipAddress.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.CUSTOM_LABEL = 0;
      this.SIP_HOME = 1;
      this.SIP_WORK = 2;
      this.SIP_OTHER = 3;
      this.INVALID_LABEL_ID = -1;
      this.sipAddress = "[PC Preview] unknow sipAddress";
      this.labelName = "[PC Preview] unknow labelName";
      this.labelId = "[PC Preview] unknow labelId";
    }
  }
  const WebsiteClass = class Website {
    constructor() {
      console.warn('contact.Website.constructor interface mocked in the Previewer. How this interface' +
        ' works on the Previewer may be different from that on a real device.');
      this.website = "[PC Preview] unknow website";
    }
  }
  const contact = {
    Contact: ContactClass,
    ContactAttributes: ContactAttributesClass,
    Email: EmailClass,
    Event: EventClass,
    Group: GroupClass,
    Holder: HolderClass,
    ImAddress: ImAddressClass,
    Name: NameClass,
    NickName: NickNameClass,
    Note: NoteClass,
    Organization: OrganizationClass,
    PhoneNumber: PhoneNumberClass,
    Portrait: PortraitClass,
    PostalAddress: PostalAddressClass,
    Relation: RelationClass,
    SipAddress: SipAddressClass,
    Website: WebsiteClass,
    Attribute:{
      ATTR_CONTACT_EVENT: "[PC Preview] unknow ATTR_CONTACT_EVENT",
      ATTR_EMAIL: "[PC Preview] unknow ATTR_EMAIL",
      ATTR_GROUP_MEMBERSHIP: "[PC Preview] unknow ATTR_GROUP_MEMBERSHIP",
      ATTR_IM: "[PC Preview] unknow ATTR_IM",
      ATTR_NAME: "[PC Preview] unknow ATTR_NAME",
      ATTR_NICKNAME: "[PC Preview] unknow ATTR_NICKNAME",
      ATTR_NOTE: "[PC Preview] unknow ATTR_NOTE",
      ATTR_ORGANIZATION: "[PC Preview] unknow ATTR_ORGANIZATION",
      ATTR_PHONE: "[PC Preview] unknow ATTR_PHONE",
      ATTR_PORTRAIT: "[PC Preview] unknow ATTR_PORTRAIT",
      ATTR_POSTAL_ADDRESS: "[PC Preview] unknow ATTR_POSTAL_ADDRESS",
      ATTR_RELATION: "[PC Preview] unknow ATTR_RELATION",
      ATTR_SIP_ADDRESS: "[PC Preview] unknow ATTR_SIP_ADDRESS",
      ATTR_WEBSITE: "[PC Preview] unknow ATTR_WEBSITE",
    },
    addContact: function (...args) {
      console.warn("contact.addContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramNumberMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramNumberMock)
        });
      }
    },
    selectContact: function (...args) {
      console.warn("contact.selectContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new ContactClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    deleteContact: function (...args) {
      console.warn("contact.deleteContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    queryContact: function (...args) {
      console.warn("contact.queryContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, new ContactClass())
      } else {
        return new Promise((resolve) => {
          resolve(new ContactClass())
        });
      }
    },
    queryContacts: function (...args) {
      console.warn("contact.queryContacts interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new ContactClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    queryContactsByEmail: function (...args) {
      console.warn("contact.queryContactsByEmail interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new ContactClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    queryContactsByPhoneNumber: function (...args) {
      console.warn("contact.queryContactsByPhoneNumber interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new ContactClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    queryGroups: function (...args) {
      console.warn("contact.queryGroups interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new GroupClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    queryHolders: function (...args) {
      console.warn("contact.queryHolders interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new HolderClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    queryKey: function (...args) {
      console.warn("contact.queryKey interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramStringMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramStringMock)
        });
      }
    },
    queryMyCard: function (...args) {
      console.warn("contact.queryMyCard interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      var array = new Array();
      array.push(new ContactClass());
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, array)
      } else {
        return new Promise((resolve) => {
          resolve(array)
        });
      }
    },
    updateContact: function (...args) {
      console.warn("contact.updateContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock)
      } else {
        return new Promise((resolve) => {
          resolve()
        });
      }
    },
    isLocalContact: function (...args) {
      console.warn("contact.isLocalContact interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    },
    isMyCard: function (...args) {
      console.warn("contact.isMyCard interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.")
      const len = args.length
      if (typeof args[len - 1] === 'function') {
        args[len - 1].call(this, paramMock.businessErrorMock, paramMock.paramBooleanMock)
      } else {
        return new Promise((resolve) => {
          resolve(paramMock.paramBooleanMock)
        });
      }
    }
  }
  return contact
}
