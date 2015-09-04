/* jshint curly: false */
// Code taken from http://www.lognormal.com/blog/2012/12/12/the-script-loader-pattern/
window.zEmbed || (function(url, host) {

  // Part 1: Creating and appending <iframe /> to the document
  var dom,
      doc,
      where,
      iWin,
      iDoc;
  var queue = [];
  var iframe = document.createElement('iframe');

  window.zEmbed = function() {
    queue.push(arguments);
  };

  window.zE = window.zE || window.zEmbed;

  iframe.src = 'javascript:false';
  iframe.title = ''; iframe.role = 'presentation';  // a11y
  (iframe.frameElement || iframe).style.cssText = 'display: none';
  where = document.getElementsByTagName('script');
  where = where[where.length - 1];
  where.parentNode.insertBefore(iframe, where);

  iWin = iframe.contentWindow;
  iDoc = iWin.document;

  // Part 2: Loading main.js in the <iframe />
  try {
    doc = iDoc;
  } catch (e) {
    dom = document.domain;
    iframe.src = 'javascript:var d=document.open();d.domain="' + dom + '";void(0);';
    doc = iDoc;
  }
  doc.open()._l = function() {
    var js = this.createElement('script');
    if (dom) { this.domain = dom; }
    js.id = 'js-iframe-async';
    js.src = url;
    this.t = +new Date();
    this.zendeskHost = host;
    this.zEQueue = queue;
    this.body.appendChild(js);
  };
  doc.write('<body onload="document._l();">');
  doc.close();
}('{{zendeskFrameworkUrl}}', 'support.zendesk.com'));

