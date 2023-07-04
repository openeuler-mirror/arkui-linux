class A {
    constructor(param) {
        this.c = param;
    }

    a(b = this.c) {
        print(b);
    }
}

let aa = new A(1);
aa.a();
aa.a(2);
