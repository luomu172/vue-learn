class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.getter = parsePath(expOrFn);
    this.cb = cb;
    this.value = this.get();
  }


  get(){
    window.target = this;
    let value = this.getter.call(this.vm, this.vm); // 调用对象的get方法触发依赖收集,依赖收集触发获取watcher对象
    window.target = undefined;
    return value;
  }

  update (){
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }


}

/**
 * 解析简单路径
 * 例子: 参数 obj['a']['b']['c'] = 1;
 *  parsePath('a.b.c'); // 结果输出: 1
 */
const bailRE = /[^\w.$]/
function parsePath(path) {
  if(bailRE.test(path)){
    return
  }
  const segmenets = path.split(".");
  return function (obj) {
    for(let i = 0; i < segmenets.length; i++){
      if(!obj) return;
      obj = obj[segmenets[i]]
    }
    return obj;
  }
}

const obj = {
  a: {
    b: {
      c: '数据'
    }
  }
}
const path = 'a.b.c';
const data = parsePath(path)(obj)
console.log(data)
