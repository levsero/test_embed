var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i; // jshint ignore:line

export var validation = {
  validateEmail: function(value) {
    /* jshint laxbreak: true */
    return reEmail.test(value)
      ? true
      : 'invalid email format';
  }
};

