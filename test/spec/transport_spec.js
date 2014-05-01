describe('transport', function() {
  var root      = window.top,
      Zd        = root.Zd,
      transport = Zd.transport;

  describe('init', function() {

    it('should be configured at init() with the api hostname', function() {
      var config = {
        'zendesk_host': 'isaacsu.zendesk.com'
      };
      transport.init(config);
    });

  });

  describe('send', function() {

    var payload;

    beforeEach(function() {
      jasmine.Ajax.install();

      payload = {
        method: 'post',
        path: '/api/ticket_submission',
        parameters: {
          name: 'Awesome J. Customer',
          email: 'awesome@customer.com',
          subject: 'Test Subject',
          description: 'Test description sentence as always.'
        },
        callbacks: {
          done: function() {},
          fail: function() {}
        }
      };

      transport.init({
        'zendesk_host': 'isaacsu.zendesk.com'
      });

    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('should accept a payload', function() {

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        'status': 200
      });

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.params).toBe(payload.parameters);

    });

    it('should trigger the done callback upon success', function() {
      var doneCallback = jasmine.createSpy();

      payload.callbacks.done = doneCallback;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        "status": 200
      });

      expect(doneCallback).toHaveBeenCalled();
    });

    it('should trigger the fail callback upon failure', function() {
      var failCallback = jasmine.createSpy();

      payload.callbacks.fail = failCallback;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        "status": 400
      });

      expect(failCallback).toHaveBeenCalled();
    });


  });
});
