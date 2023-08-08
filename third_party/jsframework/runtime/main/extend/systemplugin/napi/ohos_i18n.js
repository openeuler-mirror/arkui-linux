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

export function mockI18N() {
    const i18n = {
        getDisplayCountry: function(...args) {
            console.warn("I18N.getDisplayCountry interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        getDisplayLanguage: function(...args) {
            console.warn("I18N.getDisplayLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        getSystemLanguages: function() {
            console.warn("I18N.getSystemLanguages interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new Array(paramMock.paramStringMock);
        },
        getSystemCountries: function(...args) {
            console.warn("I18N.getSystemCountries interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new Array(paramMock.paramStringMock);
        },
        isSuggested: function(...args) {
            console.warn("I18N.isSuggested interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getSystemLanguage: function() {
            console.warn("I18N.getSystemLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        setSystemLanguage: function(...args) {
            console.warn("I18N.setSystemLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getSystemRegion: function() {
            console.warn("I18N.getSystemRegion interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        setSystemRegion: function(...args) {
            console.warn("I18N.setSystemRegion interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getSystemLocale: function() {
            console.warn("I18N.getSystemLocale interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        setSystemLocale: function(...args) {
            console.warn("I18N.setSystemLocale interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getCalendar: function(...args) {
            console.warn("I18N.getCalendar interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new CalendarClass();
        },
        isRTL: function(...args) {
            console.warn("I18N.isRTL interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getLineInstance: function(...args) {
            console.warn("I18N.getLineInstance interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new BreakIteratorClass();
        },
        getTimeZone: function(...args) {
            console.warn("I18N.getTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new TimeZoneClass();
        },
        getInstance: function() {
            console.warn("I18N.IndexUtil.getInstance interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new IndexUtilClass();
        },
        Character: CharacterClass,
        is24HourClock: function() {
            console.warn("I18N.is24HourClock interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        set24HourClock: function(...args) {
            console.warn("I18N.set24HourClock interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        addPreferredLanguage: function(...args) {
            console.warn("I18N.addPreferredLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        removePreferredLanguage: function(...args) {
            console.warn("I18N.removePreferredLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getPreferredLanguageList: function() {
            console.warn("I18N.getPreferredLanguageList interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new Array(paramMock.paramStringMock);
        },
        getFirstPreferredLanguage: function() {
            console.warn("I18N.getFirstPreferredLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
        TimeZone: TimeZoneClass,
        setUsingLocalDigit: function(...args) {
            console.warn("I18N.setUsingLocalDigit interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        getUsingLocalDigit: function() {
            console.warn("I18N.getUsingLocalDigit interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        },
        PhoneNumberFormat: PhoneNumberFormatClass,
        Transliterator: TransliteratorClass,
        getAppPreferredLanguage: function() {
            console.warn("I18N.getAppPreferredLanguage interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        },
    }
    const PhoneNumberFormatOptions = {
        type: '[PC preview] unknow type',
    }
    const UnitInfo = {
        unit: '[PC preview] unknow unit',
        measureSystem: '[PC preview] unknow measureSystem',
    }
    return i18n;
}

export const TimeZoneClass = class TimeZone{
    constructor() {
        console.warn("I18N.TimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.getID = function() {
            console.warn("I18N.TimeZone.getID interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.getDisplayName = function(...args) {
            console.warn("I18N.TimeZone.getDisplayName interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.getRawOffset = function() {
            console.warn("I18N.TimeZone.getRawOffset interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.getOffset = function(...args) {
            console.warn("I18N.TimeZone.getOffset interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
    }
}
TimeZoneClass.getAvailableIDs = function() {
    console.warn("I18N.TimeZone.getAvailableIDs interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    return new Array(paramMock.paramStringMock);
};
TimeZoneClass.getAvailableZoneCityIDs = function() {
    console.warn("I18N.TimeZone.getAvailableZoneCityIDs interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    return new Array(paramMock.paramStringMock);
};
TimeZoneClass.getCityDisplayName = function(...args) {
    console.warn("I18N.TimeZone.getCityDisplayName interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    return paramMock.paramStringMock;
};
TimeZoneClass.getTimezoneFromCity = function(...args) {
    console.warn("I18N.TimeZone.getTimezoneFromCity interface mocked in the Previewer. How this interface works on the Previewer" +
        " may be different from that on a real device.")
    return new TimeZoneClass();
};
export const PhoneNumberFormatClass = class PhoneNumberFormat{
    constructor(...args) {
        console.warn("I18N.PhoneNumberFormat.constructor interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.isValidNumber = function(...args) {
            console.warn("I18N.PhoneNumberFormat.isValidNumber interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.format = function(...args) {
            console.warn("I18N.PhoneNumberFormat.format interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.getLocationName = function(...args) {
            console.warn("I18N.PhoneNumberFormat.getLocationName interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
    }
}
export const TransliteratorClass = class Transliterator {
    constructor() {
        console.warn("I18N.Transliterator interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.transform = function(...args) {
            console.warn("I18N.Transliterator.transform interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
    }
}
TransliteratorClass.getAvailableIDs = function() {
    console.warn("I18N.Transliterator.getAvailableIDs interface mocked in the Previewer. How this interface works on the Previewer" +
        "may be different from that on a real device.")
    return new Array(paramMock.paramStringMock);
}
TransliteratorClass.getInstance = function(...args) {
    console.warn("I18N.Transliterator.getInstance interface mocked in the Previewer. How this interface works on the Previewer" +
        "may be different from that on a real device.")
    return new TransliteratorClass();
}
const IndexUtilClass = class IndexUtil {
    constructor() {
        console.warn("I18N.IndexUtil interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.getIndexList = function() {
            console.warn("I18N.IndexUtil.getIndexList interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return new Array(paramMock.paramStringMock);
        };
        this.addLocale = function(...args) {
            console.warn("I18N.IndexUtil.addLocale interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.getIndex = function(...args) {
            console.warn("I18N.IndexUtil.getIndex interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
    }
}
const BreakIteratorClass = class BreakIterator {
    constructor() {
        console.warn("I18N.BreakIterator interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.current = function() {
            console.warn("I18N.BreakIterator.current interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.first = function() {
            console.warn("I18N.BreakIterator.first interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.last = function() {
            console.warn("I18N.BreakIterator.last interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.next = function(...args) {
            console.warn("I18N.BreakIterator.next interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.previous = function() {
            console.warn("I18N.BreakIterator.previous interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.setLineBreakText = function() {
            console.warn("I18N.BreakIterator.setLineBreakText interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.following = function() {
            console.warn("I18N.BreakIterator.following interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.getLineBreakText = function() {
            console.warn("I18N.BreakIterator.getLineBreakText interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.isBoundary = function(...args) {
            console.warn("I18N.BreakIterator.isBoundary interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
    }
}
const CalendarClass = class Calendar {
    constructor() {
        console.warn("I18N.Calendar interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.setTime = function(...args) {
            console.warn("I18N.Calendar.setTime interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.set = function(...args) {
            console.warn("I18N.Calendar.set interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.setTimeZone = function(...args) {
            console.warn("I18N.Calendar.setTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.getTimeZone = function() {
            console.warn("I18N.Calendar.getTimeZone interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.getFirstDayOfWeek = function() {
            console.warn("I18N.Calendar.getFirstDayOfWeek interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.setFirstDayOfWeek = function(...args) {
            console.warn("I18N.Calendar.setFirstDayOfWeek interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.getMinimalDaysInFirstWeek = function() {
            console.warn("I18N.Calendar.getMinimalDaysInFirstWeek interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.setMinimalDaysInFirstWeek = function(...args) {
            console.warn("I18N.Calendar.setMinimalDaysInFirstWeek interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
        };
        this.get = function(...args) {
            console.warn("I18N.Calendar.get interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramNumberMock;
        };
        this.getDisplayName = function(...args) {
            console.warn("I18N.Calendar.getDisplayName interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.isWeekend = function(...args) {
            console.warn("I18N.Calendar.isWeekend interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
    }
}
export const UtilClass = class Util {
    constructor() {
        console.warn("I18N.Util interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.unitConvert = function(...args) {
            console.warn("I18N.Util.unitConvert interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
        this.getDateOrder = function(...args) {
            console.warn("I18N.Util.getDateOrder interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        }
    }
}
export const CharacterClass = class Character {
    constructor() {
        console.warn("I18N.Character interface mocked in the Previewer. How this interface works on the Previewer" +
            " may be different from that on a real device.")
        this.isDigit = function(...args) {
            console.warn("I18N.Character.isDigit interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isSpaceChar = function(...args) {
            console.warn("I18N.Character.isSpaceChar interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isWhitespace = function(...args) {
            console.warn("I18N.Character.isWhitespace interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isRTL = function(...args) {
            console.warn("I18N.Character.isRTL interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isIdeograph = function(...args) {
            console.warn("I18N.Character.isIdeograph interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isLetter = function(...args) {
            console.warn("I18N.Character.isLetter interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isLowerCase = function(...args) {
            console.warn("I18N.Character.isLowerCase interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.isUpperCase = function(...args) {
            console.warn("I18N.Character.isUpperCase interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramBooleanMock;
        };
        this.getType = function(...args) {
            console.warn("I18N.Character.getType interface mocked in the Previewer. How this interface works on the Previewer" +
                " may be different from that on a real device.")
            return paramMock.paramStringMock;
        };
    }
}