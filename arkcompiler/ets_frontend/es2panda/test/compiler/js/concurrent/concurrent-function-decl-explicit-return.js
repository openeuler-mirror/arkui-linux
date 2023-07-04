"use strict";

function a() {
    "use concurrent";
    print(111);
    return 1;
}

print(a());
