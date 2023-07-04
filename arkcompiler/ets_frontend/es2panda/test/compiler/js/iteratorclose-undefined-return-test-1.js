"use strict";
var iterable = {};

iterable[Symbol.iterator] = function() {
  return {
    next: function() {
      return { done: false, value: 1 };
    },
    return: undefined
  };
};

for (let i of iterable) {
    print(i);
    throw "123";
}
