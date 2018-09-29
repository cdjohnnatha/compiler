class Stack {
  constructor({ tokens = [], mark = '$', position = 0 } = {}) {
    this.position = position;
    this.stack = tokens;
    this.mark = mark;
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
    const tmp = Array.from(this.stack);
    let lastElement;
    if (item !== '§') {
      if (tmp[tmp.length - 1] === this.mark) {
        tmp.pop();
      }
      while (tmp.length !== 0) {
        lastElement = tmp.pop();
        if (lastElement.token === item.token) {
          throw new Error(`Element already declared in this scope ${lastElement.line} - ${lastElement.token}`);
        } else if (lastElement === this.mark) {
          break;
        }
      }
    }
    this.stack.push(item);
    this.next();
  }

  fixStack() {
    const tmp = Array.from(this.stack);
    tmp.forEach((item, index) => {
      if (item === '§') {
        this.stack[index - 1].type = this.stack[index + 1].type;
        this.stack.splice(index, 1);
        this.position -= 1;
        return false;
      }
    });
  }

  push(item) {
    this.stack.push(item);
  }

  addMark() {
    this.stack.push(this.mark);
  }

  deleteLast() {
    this.stack.pop();
  }

  removeTillMark() {
    while (this.isEmpty() === false) {
      if (this.last() === this.mark) {
        this.stack.pop();
        break;
      }
      this.stack.pop();
    }
  }

  exist(item) {
    const find = this.stack.find(element => element.token === item.token);
    if (find) {
      return true;
    }
    throw new Error(`Variable ${item.token} not declared`);
  }

  find(item) {
    return this.stack.find(element => element.token === item.token);
  }

  size() {
    return this.stack.length;
  }

  isEmpty() {
    return this.stack.length === 0;
  }
}

module.exports = Stack;
