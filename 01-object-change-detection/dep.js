export default class Dep {

  constructor(props) {
    this.subs = [];
  }

  addSub(sub){
    this.subs.push(sub);
  }

  removeSub(sub){
    remove(this.subs, sub)
  }

  depend(){
    if(window.target){
      this.addSub(window.target)
    }
  }

  notify(){
    const subs = this.subs.slice(); // 得到数组的副本
    for(let i = 0, l = subs.length; i < l ; i++){
      subs[i].update();
    }
  }
}

function remove(arr, item){
  if(arr.length){
    const index = arr.indexOf(item);
    if(index > -1){
      return arr.splice(index, 1);
    }
  }
}
