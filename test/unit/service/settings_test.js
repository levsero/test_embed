describe('settings', function() {
  let settings,
    mockRegistry;
  const settingsPath = buildSrcPath('service/settings');

  beforeEach(function() {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'service/mediator': {
        mediator: {
          suppress: jasmine.createSpy()
        }
      }
    });

    settings = requireUncached(settingsPath).settings;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    it('should store an authenticate object if it is passed in', function() {
      settings.init({ authenticate: { jwt: 'token' } });

      expect(settings.get('authenticate'))
        .toEqual({ jwt: 'token' });
    });

    it('should call mediator suppress when a suppress object is passed in', function() {
      const mediatorSuppressor = mockRegistry['service/mediator'].mediator.suppress;

      settings.init({ suppress: ['helpCenter', 'chat'] });

      expect(mediatorSuppressor)
        .toHaveBeenCalled();
    });
  });

  describe('#get', function() {
    it('should return a value if it exists in the store', function() {
      settings.init({ authenticate: { jwt: 'token' }});

      expect(settings.get('authenticate'))
        .toEqual({ jwt: 'token' });
    });

    it('should return null if a value does not exist in the store', function() {
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual(null);
    });
  });
});
