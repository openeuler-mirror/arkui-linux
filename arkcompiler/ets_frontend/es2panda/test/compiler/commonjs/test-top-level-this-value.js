let a = 123;
module.exports.a = a;
print(this.a);
print(exports === this);