
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

var regexMatcherCondition = function(regex, type) {
  return {
    test: function(value) {
      return regex.test(value);
    },
    message: 'Not a valid ' + type
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

    return errors;
  }
};

export var Validations = {
  notEmptyCondition: notEmptyCondition,
  maxLengthCondition: maxLengthCondition,
  regexMatcherCondition: regexMatcherCondition,
  ValidationMixin: ValidationMixin
};
