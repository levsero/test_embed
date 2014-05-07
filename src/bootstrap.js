/* jshint curly: false */
// Code taken from http://www.lognormal.com/blog/2012/12/12/the-script-loader-pattern/
Zd || (function(url){
// Section 1
  var dom,
      doc,
      where,
      iframe = document.createElement('iframe'),
      iWin = iframe.contentWindow,
      iDoc = iWin.document;

  iframe.src = 'javascript:false';
  iframe.title = ''; iframe.role='presentation';  // a11y
  (iframe.frameElement || iframe).style.cssText = 'width: 0; height: 0; border: 0';
  where = document.getElementsByTagName('script');
  where = where[where.length - 1];
  where.parentNode.insertBefore(iframe, where);

// Section 2
  try {
    doc = iDoc;
  } catch(e) {
    dom = document.domain;
    iframe.src='javascript:var d=document.open();d.domain="'+dom+'";void(0);';
    doc = iDoc;
  }
  doc.open()._l = function() {
    var js = this.createElement('script');
    if(dom) this.domain = dom;
    js.id = 'js-iframe-async';
    js.src = options.url;
    this.zendeskHost = options.zendeskHost;
    this.body.appendChild(js);
  };
  doc.write('<body onload="document._l();">');
  doc.close();
})({
  url: '{{zendeskFrameworkUrl}}',
  zendeskHost: '{{zendeskHost}}'
});

