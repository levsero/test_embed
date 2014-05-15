describe('submit ticket form', function() {
  var root = window.top,
      Zd   = root.Zd,
      form = Zd.services.submitTicket,
      doc  = window.document;

  describe('create', function() {
    it('should create a form', function() {
      form.render();

      expect(typeof form)
        .toEqual('object');
    });
  });

  afterEach(function() {
    [].slice.call(document.querySelectorAll('body > div')).forEach(function(div) {
      div.parentNode.removeChild(div);
    });
  });

});
