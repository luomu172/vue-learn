import Dep from "./dep";

export class Observer {
  constructor(value) {
    this.value = value;

    if(!Array.isArray(value)){
      this.walk(value);
    }
  }

  /**
   * walk会将每一个属性都转换成getter/setter的形式来侦测变化
   * 这个方法只在数据类型为object的时被调用
   * @param obj
   */
  walk(obj){
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++){
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }
}


function defineReactive(data, key, val) {
  if(typeof val === 'object'){
    new  Observer(val);
  }

  let dep = new Dep();
  Object.defineProperty( data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend();
      return val;
    },
    set(newVal) {
      if(val === newVal) return;
      val = newVal;
      dep.notify();
    }
  })
}
