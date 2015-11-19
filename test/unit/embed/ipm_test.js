describe('embed.ipm', () => {
  let ipm,
      mockRegistry;

  const ipmPath = buildSrcPath('embed/ipm/ipm');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      './ipm.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/Ipm': {
        Ipm: React.createClass({
          getInitialState() {
            return {
              ipm: {}
            };
          },
          render() {
            return (
              <div className='mock-ipm' />
            );
          }
        })
      },
      'service/transport': {
        transport: {
          sendWithMeta: jasmine.createSpy(),
          getZendeskHost: () => 'test.zd-dev.com'
        }
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'utility/scrollHacks': {
        setScrollKiller: noop,
        setWindowScroll: noop,
        revertWindowScroll: noop
      }
    });

    mockery.registerAllowable(ipmPath);

    ipm = requireUncached(ipmPath).ipm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    let result, config;

    beforeEach(() => {
      config = {
        test: 'test',
        thing: 'thing'
      };
      ipm.create('bob', config);

      result = ipm.get('bob');
    });

    it('creates an object with "component" and "config" properties', () => {
      expect(result.component)
        .toBeDefined();

      expect(result.config)
        .toBeDefined();
    });

    it('creates a React element for the component', () => {
      expect(ReactTestUtils.isElement(result.component))
        .toBe(true);
    });

    it('sets the component\'s "visible" property to false', () => {
      ipm.create('bob');
      const bob = ipm.get('bob');

      expect(bob.component.props.visible)
        .toEqual(false);
    });

    it('passes through supplied config', () => {
      const testConfig = {
        test: 'test',
        thing: 'thing'
      };

      ipm.create('bob', testConfig);
      const bob = ipm.get('bob');

      expect(bob.config.test)
        .toEqual(testConfig.test);

      expect(bob.config.thing)
        .toEqual(testConfig.thing);
    });
  });

  describe('get', () => {
    it('should return the correct ipm', () => {
      ipm.create('bob');
      const bob = ipm.get('bob');

      expect(bob)
        .toBeDefined();
    });
  });

  describe('render', () => {

    it('renders an ipm embed the document', () => {
      ipm.create('dan');
      ipm.render('dan');

      expect(document.querySelectorAll('.mock-frame').length)
       .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-ipm').length)
       .toEqual(1);
    });

    describe('mediator subscriptions', () => {
      let mockMediator,
          dan,
          danIpm;

      const ipmParams = {
        ipm: {
          id: 1,
          message: 'comments question',
          signOff: 'question'
        }
      };

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        ipm.create('dan');
        ipm.render('dan');
        dan = ipm.get('dan');
        danIpm = dan.instance.getChild().refs.rootComponent;
      });

      describe('subscriptions to ipm.activate', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('ipm.activate', jasmine.any(Function));
        });

        it('should show if a ipm is available', () => {
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')(ipmParams);
          pluckSubscribeCall(mockMediator, 'ipm.activate')();

          expect(dan.instance.show.__reactBoundMethod)
            .toHaveBeenCalled();
        });

        it('should not show if a ipm is not available', () => {
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')({ ipm: {} });
          pluckSubscribeCall(mockMediator, 'ipm.activate')();

          expect(dan.instance.show.__reactBoundMethod)
            .not.toHaveBeenCalledWith();
        });
      });

      describe('subscription to ipm.setIpm', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('ipm.setIpm', jasmine.any(Function));
        });

        it('should set state.ipmAvailable to false if none is available', () => {
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')({ ipmIpm: {} });

          expect(danIpm.state.ipmAvailable)
            .toEqual(false);
        });

        it('should set the ipm correctly if one is available', () => {
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')(ipmParams);

          const ipmKeys = [
            'id',
            'message',
            'signOff'
          ];

          ipmKeys.forEach((key) => {
            expect(danIpm.state.ipm[key])
              .toEqual(ipmParams.ipm[key]);
          });

          expect(danIpm.state.ipmAvailable)
            .toEqual(true);
        });
      });

      it('should subscribe to ipm.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('ipm.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'ipm.hide')();

        expect(dan.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to ipm.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('ipm.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'ipm.show')();

        expect(dan.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });
    });
  });
});
