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

export function mockIntl() {
  const result = {
    DateTimeFormat: function (...args) {
      console.warn("Intl.DateTimeFormat interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return DateTimeFormatMock;
    },
    NumberFormat: function (...args) {
      console.warn("Intl.NumberFormat interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return NumberFormatMock;
    },
    Locale: function (locale) {
      console.warn("Intl.Locale interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return LocaleMock;
    },
    Collator: function (...args) {
      console.warn("Intl.Collator interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return CollatorMock;
    },
    PluralRules: function (...args) {
      console.warn("Intl.PluralRules interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return PluralRulesMock;
    },
    RelativeTimeFormat: function (...args) {
      console.warn("Intl.RelativeTimeFormat interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
      return RelativeTimeFormatMock;
    }
  }
  const DateTimeFormatMock = {
    format: function (date) {
      console.warn("Intl.DateTimeFormat.format interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    formatRange: function (startDate, endDate) {
      console.warn("Intl.DateTimeFormat.format interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    resolvedOptions: function () {
      console.warn("Intl.DateTimeFormat.resolvedOptions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return DateTimeOptionsMock;
    }
  }
  const NumberFormatMock = {
    format: function (number) {
      console.warn("Intl.NumberFormat.format interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    resolvedOptions: function () {
      console.warn("Intl.NumberFormat.resolvedOptions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return NumberOptionsMock;
    }
  }
  const LocaleMock = {
    language: '[PC preview] unknow language',
    script: '[PC preview] unknow script',
    region: '[PC preview] unknow region',
    baseName: '[PC preview] unknow baseName',
    caseFirst: '[PC preview] unknow caseFirst',
    calendar: '[PC preview] unknow calendar',
    collation: '[PC preview] unknow collation',
    hourCycle: '[PC preview] unknow hourCycle',
    numberingSystem: '[PC preview] unknow numberingSystem',
    numeric: '[PC preview] unknow numeric',
    toString: function () {
      console.warn("Intl.Locale.toString interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    maximize: function () {
      console.warn("Intl.Locale.maximize interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return LocaleMock;
    },
    minimize: function () {
      console.warn("Intl.Locale.minimize interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return LocaleMock;
    }
  }
  const CollatorMock = {
    compare: function (firstString, secondString) {
      console.warn("Intl.Collator.compare interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramNumberMock;
    },
    resolvedOptions: function () {
      console.warn("Intl.Collator.resolvedOptions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return CollatorOptionsMock;
    }
  }
  const PluralRulesMock = {
    select: function (number) {
      console.warn("Intl.PluralRules.select interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    }
  }
  const RelativeTimeFormatMock = {
    format: function (value, unit) {
      console.warn("Intl.RelativeTimeFormat.format interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramStringMock;
    },
    formatToParts: function (value, unit) {
      console.warn("Intl.RelativeTimeFormat.formatToParts interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return paramMock.paramArrayMock;
    },
    resolvedOptions: function () {
      console.warn("Intl.RelativeTimeFormat.resolvedOptions interface mocked in the Previewer. How this interface works on the" +
        " Previewer may be different from that on a real device.");
      return RelativeTimeFormatResolvedOptionsMock;
    }
  }
  const DateTimeOptionsMock = {
    locale: '[PC preview] unknow locale',
    dateStyle: '[PC preview] unknow dateStyle',
    timeStyle: '[PC preview] unknow timeStyle',
    hourCycle: '[PC preview] unknow hourCycle',
    timeZone: '[PC preview] unknow timeZone',
    numberingSystem: '[PC preview] unknow numberingSystem',
    hour12: '[PC preview] unknow hour12',
    weekday: '[PC preview] unknow weekday',
    era: '[PC preview] unknow era',
    year: '[PC preview] unknow year',
    month: '[PC preview] unknow month',
    day: '[PC preview] unknow day',
    hour: '[PC preview] unknow hour',
    minute: '[PC preview] unknow minute',
    second: '[PC preview] unknow second',
    timeZoneName: '[PC preview] unknow timeZoneName',
    dayPeriod: '[PC preview] unknow dayPeriod',
    localeMatcher: '[PC preview] unknow localeMatcher',
    formatMatcher: '[PC preview] unknow formatMatcher',
  }
  const NumberOptionsMock = {
    locale: '[PC preview] unknow locale',
    currency: '[PC preview] unknow currency',
    currencySign: '[PC preview] unknow currencySign',
    currencyDisplay: '[PC preview] unknow currencyDisplay',
    unit: '[PC preview] unknow unit',
    unitDisplay: '[PC preview] unknow unitDisplay',
    unitUsage: '[PC preview] unknow unitUsage',
    signDisplay: '[PC preview] unknow signDisplay',
    compactDisplay: '[PC preview] unknow compactDisplay',
    notation: '[PC preview] unknow notation',
    localeMatcher: '[PC preview] unknow localeMatcher',
    style: '[PC preview] unknow style',
    numberingSystem: '[PC preview] unknow numberingSystem',
    useGrouping: '[PC preview] unknow useGrouping',
    minimumIntegerDigits: '[PC preview] unknow minimumIntegerDigits',
    minimumFractionDigits: '[PC preview] unknow minimumFractionDigits',
    maximumFractionDigits: '[PC preview] unknow maximumFractionDigits',
    minimumSignificantDigits: '[PC preview] unknow minimumSignificantDigits',
    maximumSignificantDigits: '[PC preview] unknow maximumSignificantDigits',
  }
  const CollatorOptionsMock = {
    localeMatcher: '[PC preview] unknow localeMatcher',
    usage: '[PC preview] unknow usage',
    sensitivity: '[PC preview] unknow sensitivity',
    ignorePunctuation: '[PC preview] unknow ignorePunctuation',
    collation: '[PC preview] unknow collation',
    numeric: '[PC preview] unknow numeric',
    caseFirst: '[PC preview] unknow caseFirst',
  }
  const PluralRulesOptionsMock = {
    localeMatcher: '[PC preview] unknow localeMatcher',
    type: '[PC preview] unknow type',
    minimumIntegerDigits: '[PC preview] unknow minimumIntegerDigits',
    minimumFractionDigits: '[PC preview] unknow minimumFractionDigits',
    maximumFractionDigits: '[PC preview] unknow maximumFractionDigits',
    minimumSignificantDigits: '[PC preview] unknow minimumSignificantDigits',
    maximumSignificantDigits: '[PC preview] unknow maximumSignificantDigits',
  }
  const RelativeTimeFormatResolvedOptions = {
    locale: '[PC preview] unknow locale',
    style: '[PC preview] unknow style',
    numeric: '[PC preview] unknow numeric',
    numberingSystem: '[PC preview] unknow numberingSystem',
  }
  const RelativeTimeFormatInputOptions = {
    localeMatcher: '[PC preview] unknow localeMatcher',
    numeric: '[PC preview] unknow numeric',
    style: '[PC preview] unknow style',
  }
  const LocaleOptions = {
    calendar: '[PC preview] unknow calendar',
    collation: '[PC preview] unknow collation',
    hourCycle: '[PC preview] unknow hourCycle',
    numberingSystem: '[PC preview] unknow numberingSystem',
    numeric: '[PC preview] unknow numeric',
    caseFirst: '[PC preview] unknow caseFirst',
  }
  return result;
}