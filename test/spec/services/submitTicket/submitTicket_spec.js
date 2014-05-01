describe('submit ticket form', function() {
  var root = window.top,
      Zd   = root.Zd,
      form = Zd.services.submitTicket,
      doc  = window.document;

  describe('create', function() {
    it('should create a form', function() {
      form.render()

      expect(typeof form)
        .toEqual("object");
    });
  });

  describe('render', function() {
    it('should add one extra iframe to the document', function () {

      spyOn(doc.body, 'appendChild').andCallThrough();

      var initialIframeCount = doc.body.getElementsByTagName("iframe").length;
      form.render();

      expect(doc.body.appendChild)
        .toHaveBeenCalled();

      expect(doc.body.getElementsByTagName("iframe").length)
        .toEqual(initialIframeCount + 1);
    });
  });

})
