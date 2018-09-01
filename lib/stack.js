class Stack {
  constructor(tokens) {
    this.position = 0;
    this.stack = tokens;
  }

  next() {
    if (this.position < this.stack.length) {
      this.position += 1;
    }
  }

  top() {
    return this.stack[this.position];
  }

  last() {
    return this.stack[this.stack.length - 1];
  }

  pop() {
    const [token] = this.stack;
    this.position += 1;
    return token;
  }

  add(item) {
    this.stack.push(item);
  }

  size() {
    return this.stack.length;
  }

  isEmpty() {
    return this.stack.length === 0;
  }
}

module.exports = Stack;
