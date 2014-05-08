describe('transport', function() {
  var root      = window.top,
      Zd        = root.Zd,
      transport = Zd.transport;

  describe('init', function() {

    it('should be configured at init() with the api hostname', function() {
      var config = {
        'zendeskHost': 'isaacsu.zendesk.com'
      };
      transport.init(config);
    });

  });

  describe('send', function() {
    var payload, zendeskHost;

    beforeEach(function() {
      jasmine.Ajax.install();
      payload = {
        method: 'post',
        path: '/api/ticket_submission',
        params: {
          name: 'Awesome J. Customer',
          email: 'awesome@customer.com',
          subject: 'Test Subject',
          description: 'Test description sentence as always.'
        },
        callbacks: {
          done: function(data, status, xhr) {}, /* jshint ignore:line */
          fail: function(data, status, xhr) {}  /* jshint ignore:line */
        }
      };

      zendeskHost = 'test.zendesk.com';

      transport.init({
        zendeskHost: zendeskHost
      });
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it('should append zendeskHost to the payload', function() {
      var request, expectedParams;
      
      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        'status': 200
      });

      request = jasmine.Ajax.requests.mostRecent();
      expectedParams = _.extend(payload.params, {'zendesk_host': zendeskHost});
      expect(request.params).toBe(JSON.stringify(expectedParams));
    });

    it('should trigger only the done callback upon success', function() {
      var doneFn = jasmine.createSpy();
      var failFn = jasmine.createSpy();

      var responseText = 'successful request';
      var responseStatus = 200;
      payload.callbacks.done = doneFn;
      payload.callbacks.fail = failFn;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        status: responseStatus,
        responseText: responseText
      });

      expect(doneFn)
        .toHaveBeenCalledWith(
          responseText,
          responseStatus,
          jasmine.Ajax.requests.mostRecent()
        );

      expect(failFn).not.toHaveBeenCalled();
    });

    it('should trigger only the fail callback upon failure', function() {
      var doneFn = jasmine.createSpy();
      var failFn = jasmine.createSpy();

      var responseText = 'failed request';
      var responseStatus = 400;

      payload.callbacks.fail = failFn;

      transport.send(payload);

      jasmine.Ajax.requests.mostRecent().response({
        status: responseStatus,
        responseText: responseText
      });

      expect(failFn).toHaveBeenCalledWith(
        responseText,
        responseStatus,
        jasmine.Ajax.requests.mostRecent()
      );

      expect(doneFn).not.toHaveBeenCalled();
    });

  });
});
