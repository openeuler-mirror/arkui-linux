function foo() {
    let obj = {
       _times: "aaaa",
       _values: "bbbb",
       _xxx: "cccc",
       _yyy: "dddd",
       _zzz: "eeee"
    }

    const {_times: times, _values: values, ...others} = obj;

    for (let prop in others) {
        print("key: ", prop);
        print("value: ", others[prop])
    }
}
foo()