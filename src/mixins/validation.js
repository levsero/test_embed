
var notEmptyCondition = {
  test: function (value) { return value !== ''; },
  message: 'Field cannot be empty'
};

var maxLengthCondition = function(length) {
  return {
    test: function(value) {
      return value.length <= length;
    },
    message: 'Value exceeds ' + length + ' characters.'
  };
};

var symbolIncludedCondition = function(symbol) {
  return {
    test: function(value) {
      return value.indexOf(symbol) > -1;
    },
    message: 'Missing ' + symbol + ' symbol'
  };
};

//The validation mixin
var ValidationMixin = {
  getDefaultProps: function () {
    return {
      validate: []
    };
  },
  hasErrors: function () {
    var errors = [];

    this.props.validate.forEach(function (condition) {
      if (!condition.test(this.state.value)) {
        errors.push(condition.message);
      }
    }, this);

    return errors.length ? errors : [];
  }
};

export var validations = {
  notEmptyCondition: notEmptyCondition,
  maxLengthCondition: maxLengthCondition,
  symbolIncludedCondition: symbolIncludedCondition,
  ValidationMixin: ValidationMixin
};
