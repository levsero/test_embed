describe('submit ticket form', function() {
  var root = window.top,
      Zd   = root.Zd,
      form = Zd.services.submitTicket;


  describe('create', function() {
    it('should create a form', function() {
      form.create('form1')
        .render('form1');

      expect(typeof form.get('form1').component)
        .toEqual('object');
    });
  });

  afterEach(function() {
    [].slice.call(document.querySelectorAll('body > div')).forEach(function(div) {
      div.parentNode.removeChild(div);
    });
  });

});
