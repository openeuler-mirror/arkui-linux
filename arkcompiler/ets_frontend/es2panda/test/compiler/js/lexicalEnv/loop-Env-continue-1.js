"use strict";
{
    let a = [1, 2, 3];

    function aa() {
        print(a);
    }

    function b() {
        for (let i of a) {
            let j = a;
            if (i == 2) {
                continue;
            }

            (() => {
                print(i, j);
            })()
        }
    }
    b();
}
