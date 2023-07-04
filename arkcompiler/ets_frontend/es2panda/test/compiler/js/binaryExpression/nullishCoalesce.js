let a = 2;
let b = a ?? 3;
print(b);
a = null;
b = a ?? 4;
print(b);
a = undefined;
b = a ?? 5;
print(b);