let robotA = [1, "mower", "mowing"];
let i = undefined;
let nameA = undefined;

for ([, nameA] = robotA, i = 0; i < 1; i++) {
    print(nameA);
}

for ([, nameA = "name"] = robotA, i = 0; i < 1; i++) {
    print(nameA);
}
