describe('submit ticket form', function() {
  var root = window.top,
      Zd   = root.Zd,
      form = Zd.services.submitTicket,
      doc  = window.document;

  describe('render', function() {
    it('should add one extra iframe to the document', function () {

      spyOn(doc.body, 'appendChild').andCallThrough();

      expect(doc.getElementById('reactForm'))
         .toBeNull();

      form.render();

      expect(doc.getElementById('reactForm'))
         .toBeDefined();

      expect(doc.body.appendChild)
        .toHaveBeenCalled();

    });
  });

  describe('create', function() {
    it('should create a form', function() {
      form.render();

      expect(typeof form)
        .toEqual('object');
    });
  });

});
