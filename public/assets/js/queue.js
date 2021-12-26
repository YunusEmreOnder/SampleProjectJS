export class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    return this.items.push(element);
  }
  firstenqueue(element) {
      return this.items.unshift(element);
  }
  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }
 

  size() {
    return this.items.length;
  }

}
