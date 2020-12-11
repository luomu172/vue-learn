import Dep from "./dep";
import {arrayMethods} from "./array";
import {def} from "./uitls";

//__proto__ 是否可用
const hasProto = '__proto__' in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this);

    if(Array.isArray(value)){
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    }else{
      this.walk(value);
    }
  }

  observeArray(items) {
    for( let i = 0; i < items.length; i++){
      observe(items[i])
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
  let childOb = observe(val);

  let dep = new Dep();
  Object.defineProperty( data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend();

      if(childOb){
        childOb.dep.depend();
      }

      return val;
    },
    set(newVal) {
      if(val === newVal) return;
      val = newVal;
      dep.notify();
    }
  })
}

function protoAugment(target, src, keys) {
  target.__poto__ = src;
}

function copyAugment(target, src, keys) {
  for(let i = 0; i < keys.length; i++){
    const key = keys[i];
    def(target, key, src[key]);

  }
}



function observe(value, asRootData) {
  if(!isObject(value)){
    return
  }
  let ob;
  if(hasOwn(value, '__ob__') && value.__ob__ instanceof Observer){
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}
