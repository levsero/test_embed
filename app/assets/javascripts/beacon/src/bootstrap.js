(function(url){
// Section 1
  var dom,doc,where,iframe = document.createElement('iframe');
  iframe.src = "javascript:false";
  iframe.title = ""; iframe.role="presentation";  // a11y
  (iframe.frameElement || iframe).style.cssText = "width: 0; height: 0; border: 0";
  where = document.getElementsByTagName('script');
  where = where[where.length - 1];
  where.parentNode.insertBefore(iframe, where);

// Section 2
  try {
    doc = iframe.contentWindow.document;
  } catch(e) {
    dom = document.domain;
    iframe.src="javascript:var d=document.open();d.domain='"+dom+"';void(0);";
    doc = iframe.contentWindow.document;
  }
  doc.open()._l = function() {
    var js = this.createElement("script");
    if(dom) this.domain = dom;
    js.id = "js-iframe-async";
    js.src = url;
    this.body.appendChild(js);
  };
  doc.write('<body onload="document._l();">');
  doc.close();
})('http://localhost:1337/dist/main.js');
