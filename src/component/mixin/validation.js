var reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; // jshint ignore:line

export var validation = {
  validateEmail: function(value) {
    return reEmail.test(value);
  }
};

