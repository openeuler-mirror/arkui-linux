"use strict";

async function a() {
    "use concurrent";
    await 1;
    print(111);
}

a();
