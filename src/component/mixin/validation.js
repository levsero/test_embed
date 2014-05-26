
var notEmptyCondition = {
  test: function (value) { return value !== ''; },
  message: 'Field cannot be empty'
};

var regexMatcherCondition = function(regex, type) {
  return {
    test: function(value) {
      return regex.test(value);
    },
    message: 'Not a valid ' + type
  };
};

// The validation mixin
var ValidationMixin = {
  getDefaultProps: function () {
    return {
      validate: []
    };
  },
  hasErrors: function () {
    var errors = [];

    this.props.validate.forEach(function (condition) {
      if(!condition.test(this.state.value)) {
        errors.push(condition.message);
      }
    }, this);

    return errors;
  }
};

var baseValidation = [
  notEmptyCondition
];
var emailValidation = [
  notEmptyCondition,
  regexMatcherCondition(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'email address') /* jshint ignore:line */
];

export var validation = {
  baseValidation: baseValidation,
  emailValidation: emailValidation,
  ValidationMixin: ValidationMixin
};
