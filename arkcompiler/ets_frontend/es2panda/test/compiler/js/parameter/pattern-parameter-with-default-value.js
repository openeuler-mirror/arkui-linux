var a = 0;
var b = {name: "mower", skill: "mowing"};
var nameA = "";
function foo ([a] = "123", {name: nameA} = b) {
    print(a)
    print(nameA)
}
foo();
