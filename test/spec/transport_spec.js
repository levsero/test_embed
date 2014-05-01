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

    it('should trigger only the done callback upon success', function() {
      var doneCallback = jasmine.createSpy();
      var failCallback = jasmine.createSpy();

      var responseText = 'successful request';
      var responseStatus = 200;
      payload.callbacks.done = doneCallback;
      payload.callbacks.fail = failCallback;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        status: responseStatus,
        responseText: responseText
      });

      expect(doneCallback)
        .toHaveBeenCalledWith(
          responseText, 
          responseStatus, 
          jasmine.Ajax.requests.mostRecent()
        );

      expect(failCallback).not.toHaveBeenCalled();
    });

    it('should trigger only the fail callback upon failure', function() {
      var doneCallback = jasmine.createSpy();
      var failCallback = jasmine.createSpy();

      var responseText = 'failed request';
      var responseStatus = 400;

      payload.callbacks.fail = failCallback;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        status: responseStatus
      });

      expect(failCallback).toHaveBeenCalledWith(
        jasmine.Ajax.requests.mostRecent(),
        responseStatus
      );

      expect(doneCallback).not.toHaveBeenCalled();
    });

  });
});
