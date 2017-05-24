window.zEmbed || (function(){
  var queue = [];

  window.zEmbed = function() {
    queue.push(arguments);
  }

  window.zE = window.zE || window.zEmbed;
  document.zendeskHost = 'dev.zd-dev.com';
  document.zEQueue = queue;
}());

