function test() {
    let a = 0;
    try {
        switch (a) {
            case 0: {
                return 123;
            }
        }
    } catch {} finally {print("Run finally before return");}
}

test();
