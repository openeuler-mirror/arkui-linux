let robotA = {name: "mower", skill: "mowing"};
let i = undefined;
let nameA = undefined;

for ({name: nameA} = robotA, i = 0; i < 1; i++) {
    print(nameA);
}

for ({name: nameA = "name"} = robotA, i = 0; i < 1; i++) {
    print(nameA);
}
