'use strict';

module.exports = function convertTo (typedVar, ...args) {
  return {
    'boolean': (v) => v == 'true', // eslint-disable-line eqeqeq
    'function': ([v]) => v,
    'number': Number,
    'object': Array.isArray(typedVar) ? makeArray : createObject.bind({typedVar}),
    'string': String,
    'undefined': () => console.warn('typedVar is undefined')
  }[typeof typedVar](args);
};

function createObject (keysAndValues) {
  // Since JS says typeof null === 'object', it has to be accounted for.
  if (this.typedVar === null) {
    console.warn('typedVar is null');
    return this.typedVar;
  }

  if (keysAndValues.length === 1) {
    if (typeof keysAndValues[0] === 'string') {
      throw new Error('key value *pairs* must be specified');
    }
    return keysAndValues[0];
  }
  return keysAndValues.reduce((result, value, index, array) => {
    if (index % 2 === 0 && value in result) {
      throw new Error(`duplicated key: "${value}"`);
    } else if (index % 2 !== 0) {
      result[array[index - 1]] = value;
    }
    return result;
  }, {});
}

function makeArray (values) {
  return [].concat(...values);
}
