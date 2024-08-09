class Queue {
  constructor() {
    this.items = [];
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  destruct() {
    delete this.items;
    delete this.frontIndex;
    delete this.backIndex;
    delete this;
  }
  queue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    console.log(item + " added to queue");
    return item + " added to queue";
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  shuffle() {
    let currentIndex = this.items.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [this.items[currentIndex], this.items[randomIndex]] = [
        this.items[randomIndex],
        this.items[currentIndex],
      ];
    }
  }
  // nextInLine() {
  //   return this.items[this.frontIndex];
  // }
  get printQueue() {
    return this.items;
  }
  // Real cycle function, should be self-explanatory
  cycle(x, e) {
    let arr = this.items;
    let y;
    let a = arr[0];
    if (x === o1) {
      y = o2;
      o1.src = e.src;
    } else if (x === o2) {
      y = o1;
      o2.src = e.src;
    } else {
      x = o1;
      y = o2;
      o1.src = e.src;
    }
    arr.push(arr.shift());
    let v = arr[0];
    if (arr.length != 1 && a === v) {
      console.error(
        "[CRIT] [QUEU-CLASS] [CYCLE] [SHIFT] The queue was not able to be shifted. Trying again..."
      );
      arr.push(arr.shift());
    }
    let temp = x;
    x = y;
    y = temp;
  }
}

export default queue;