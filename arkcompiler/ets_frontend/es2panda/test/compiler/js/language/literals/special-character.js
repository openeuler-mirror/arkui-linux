function test() {
    let a = "test\n";
    print(a);
    let b = "test";
    print(`${b}\n`);
    print(`${b}\t`);
    print(`${b}\'`);
    print(`${b}\"`);
    print(`${b}\?`);
    print(`${b}\0`);
}

test();