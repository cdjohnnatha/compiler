const Stack = require('./stack');
const {
  VARIABLE,
} = require('./LanguageDictionary');


class ExpressionRoutine {
  constructor(semanticStack) {
    this.expressionStack = new Stack();
    this.declared = semanticStack;
  }

  Analyze() {
    const { type: classification } = this.declared.find(this.expressionStack.top());
    let element;
    let type;
    while (this.expressionStack.isEmpty() === false) {
      element = this.expressionStack.stack.pop();
      if (element.classification === VARIABLE) {
        ({ type } = this.declared.find(element));
      } else {
        type = element.classification;
      }
      if (type !== classification) {
        throw new Error(`Wrong equation type at line ${element.line}`);
      }
    }
  }
}


module.exports = ExpressionRoutine;
