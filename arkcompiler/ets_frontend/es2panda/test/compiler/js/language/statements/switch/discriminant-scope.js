function test() {
    let a = 0;
    switch (a) {
        case 0:
            const a = 0;
            break;
    }

    print("Done");
}

test();