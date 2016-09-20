describe('embed.channelChoice', () => {
  let channelChoice,
    mockRegistry,
    mockSettingsValue,
    mockIsMobileBrowserValue;

  const channelChoicePath = buildSrcPath('embed/channelChoice/channelChoice');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockSettingsValue = { margin: 15 };
    mockIsMobileBrowserValue = false;

    mockRegistry = initMockRegistry({
      'React': React,
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'component/channelChoice/ChannelChoice': {
        ChannelChoice: React.createClass({
          render() {
            return (
              <div className='mock-channelChoice' />
            );
          }
        })
      },
      './channelChoice.scss': '',
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'service/settings': {
        settings: {
          get: (name) => mockSettingsValue[name]
        }
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => document.body
      },
      'lodash': _
    });

    mockery.registerAllowable(channelChoicePath);
    channelChoice = requireUncached(channelChoicePath).channelChoice;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    it('should add a new channel choice component to the channelChoice array', () => {
      expect(_.keys(channelChoice.list()).length)
        .toEqual(0);

      channelChoice.create('erin');

      expect(_.keys(channelChoice.list()).length)
        .toEqual(1);

      const erin = channelChoice.get('erin');

      expect(erin)
        .toBeDefined();

      expect(erin.component)
        .toBeDefined();
    });

    it('overrides config.formTitleKey if formTitleKey is set', () => {
      channelChoice.create('erin', { formTitleKey: 'test_title' });

      const erin = channelChoice.get('erin');

      expect(erin.config.formTitleKey)
        .toEqual('test_title');
    });

    it('overrides config.hideZendeskLogo if hideZendeskLogo is set', () => {
      channelChoice.create('erin', { hideZendeskLogo: true });

      const erin = channelChoice.get('erin');

      expect(erin.config.hideZendeskLogo)
        .toBe(true);
    });

    it('overrides config.color if color is set', () => {
      channelChoice.create('erin', { color: '#00FF00' });

      const erin = channelChoice.get('erin');

      expect(erin.config.color)
        .toEqual('#00FF00');
    });

    describe('frameFactory', function() {
      let mockFrameFactory,
        mockFrameFactoryCall,
        childFn,
        params;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        channelChoice.create('erin');
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
      });

      it('should apply the configs', function() {
        const erin = channelChoice.get('erin');
        const payload = childFn({});

        expect(payload.props.formTitleKey)
          .toEqual(erin.config.formTitleKey);
      });

      it('should broadcast <name>.onClose with onClose', function() {
        const mockMediator = mockRegistry['service/mediator'].mediator;

        params.onClose();

        expect(mockMediator.channel.broadcast)
          .toHaveBeenCalledWith('erin.onClose');
      });
    });
  });

  describe('get', () => {
    beforeEach(() => {
      channelChoice.create('erin');
    });

    it('should return the correct channelChoice embed', () => {
      const erin = channelChoice.get('erin');

      expect(erin)
        .toBeDefined();
    });
  });

  describe('render', () => {
    it('should throw an exception if ChannelChoice does not exist', () => {
      expect(() => channelChoice.render('non_existent_channelChoice'))
        .toThrow();
    });

    it('renders a channelChoice embed to the document', () => {
      channelChoice.create('erin');
      channelChoice.render('erin');

      expect(document.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-channelChoice').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(channelChoice.get('erin').instance))
        .toEqual(true);
    });

    it('should only be allowed to render an channelChoice form once', () => {
      channelChoice.create('erin');

      expect(() => channelChoice.render('erin'))
        .not.toThrow();

      expect(() => channelChoice.render('erin'))
        .toThrow();
    });

    it('applies channelChoice.scss to the frame', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./channelChoice.scss'];

      channelChoice.create('erin');
      channelChoice.render('erin');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });

    describe('mediator subscription', () => {
      let mockMediator,
        erin;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        channelChoice.create('erin');
        channelChoice.render('erin');
        erin = channelChoice.get('erin');
      });

      it('should subscribe to <name>.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('erin.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'erin.show')();

        expect(erin.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.hide', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('erin.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'erin.hide')();

        expect(erin.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });
    });
  });
});
