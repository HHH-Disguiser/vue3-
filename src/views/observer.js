const obj = {
    a: 1
}

Object.defineProperty(obj, 'a', {
    writable: true,
    enumerable: true,
    configurable: true,  //是否被删除
    get() {
        return 3
    },
    set(val) {
        console.log(`设置值${val}`)
    }
});

