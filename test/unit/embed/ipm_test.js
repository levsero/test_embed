import { noop } from 'lodash';

describe('embed.ipm', () => {
  let ipm,
    mockSettingsValue,
    mockRegistry,
    mockApiResponses,
    apiGetSpy,
    apiPostSpy;

  const ipmPath = buildSrcPath('embed/ipm/ipm');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockSettingsValue = {};
    mockApiResponses = {};

    apiGetSpy = jasmine.createSpy('api.get')
      .and.callFake((path, query, resolve = noop) => resolve(mockApiResponses[path] || {}));
    apiPostSpy = jasmine.createSpy('api.post')
      .and.callFake((path, query, resolve = noop) => resolve(mockApiResponses[path] || {}));

    mockRegistry = initMockRegistry({
      'React': React,
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      './ipm.scss': '',
      'component/Avatar.sass': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'embed/ipm/api': {
        api: {
          get: apiGetSpy,
          post: apiPostSpy
        }
      },
      'component/ipm/Ipm': {
        Ipm: class extends Component {
          constructor() {
            super();
            this.state = {
              ipm: {}
            };
          }
          ipmSender() {}
          render() {
            return (
              <div className='mock-ipm' />
            );
          }
        }
      },
      'service/identity': {
        identity: {
          getBuid: () => 'some-buid'
        }
      },
      'service/logging': {
        error: noop
      },
      'service/settings': {
        settings: {
          get: (name) => mockSettingsValue[name]
        }
      },
      'service/transport': {
        transport: {
          send: jasmine.createSpy('transport.send'),
          getZendeskHost: () => 'test.zd-dev.com'
        }
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        },
        location: global.location
      },
      'utility/devices': {
        isMobileBrowser: () => {
          return false;
        }
      },
      'utility/scrollHacks': {
        setScrollKiller: noop,
        setWindowScroll: noop,
        revertWindowScroll: noop
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
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

    describe('desktop', () => {
      it('should provide the desktop transition in configs', () => {
        const upHide = mockRegistry['service/transitionFactory'].transitionFactory.ipm.upHide;
        const downShow = mockRegistry['service/transitionFactory'].transitionFactory.ipm.downShow;

        ipm.create('adam');

        expect(downShow)
          .toHaveBeenCalled();
        expect(upHide)
          .toHaveBeenCalled();
      });
    });

    it('creates an object with "component" and "config" properties', () => {
      expect(result.component)
        .toBeDefined();

      expect(result.config)
        .toBeDefined();
    });

    it('creates a React element for the component', () => {
      expect(TestUtils.isElement(result.component))
        .toBe(true);
    });

    it('sets the component\'s "visible" property to false', () => {
      expect(result.component.props.visible)
        .toEqual(false);
    });

    it('passes through supplied config', () => {
      expect(result.config)
        .toEqual(jasmine.objectContaining(config));
    });
  });

  describe('ipmSender', () => {
    it('calls api.post when called', () => {
      const params = { foo: 'bar' };

      ipm.create('dan');
      ipm.render('dan');

      const embed = ipm.get('dan').instance.getRootComponent();

      embed.props.ipmSender(params);

      expect(apiPostSpy)
        .toHaveBeenCalledWith(ipm.connectApiCampaignEventsPath, params);
    });
  });

  describe('closeFrame', () => {
    it('calls frame.close when called', () => {
      ipm.create('dan');
      ipm.render('dan');

      const frame = ipm.get('dan').instance;
      const embed = frame.getRootComponent();
      const mockFrameClose = spyOn(frame, 'close');

      embed.props.closeFrame();

      expect(mockFrameClose)
        .toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should send a dismissed event if closed via x button', () => {
      ipm.create('dan');
      ipm.render('dan');

      const frame = ipm.get('dan').instance;
      const embed = frame.getRootComponent();
      const mockIpmSender = spyOn(embed, 'ipmSender');

      frame.close();

      expect(mockIpmSender)
        .toHaveBeenCalledWith('dismissed');
    });

    it('should send a clicked event if closed call to action', () => {
      ipm.create('dan');
      ipm.render('dan');

      const frame = ipm.get('dan').instance;
      const embed = frame.getRootComponent();
      const mockIpmSender = spyOn(embed, 'ipmSender');

      frame.close({ eventToEmit: 'clicked' });

      expect(mockIpmSender)
        .toHaveBeenCalledWith('clicked');
    });
  });

  describe('frameStyle', () => {
    let mockFrameFactory,
      mockFrameFactoryCall,
      params;

    beforeEach(() => {
      mockSettingsValue = {
        'offset.horizontal': '50px',
        'offset.vertical': '100px'
      };

      ipm.create('dan');
      ipm.render('dan');

      mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
      params = mockFrameFactoryCall[1];
    });

    it('gets the values for top and right from settings', () => {
      expect(params.frameStyle.top)
        .toEqual('100px');
      expect(params.frameStyle.right)
        .toEqual('50px');
    });
  });

  describe('activateIpm', () => {
    let mockFrameFactory,
      mockMediator,
      dan,
      email,
      config;

    beforeEach(() => {
      mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      mockMediator = mockRegistry['service/mediator'].mediator;
    });

    const createIpm = (name = 'dan') => {
      ipm.create(name, config);
      ipm.render(name);
      dan = ipm.get(name);
      email = 'a@example.com';
    };

    const ipmParams = {
      pendingCampaign: {
        id: 1,
        message: {
          body: 'comments question',
          color: 'red'
        }
      }
    };

    describe('when fetchDirectlyFromConnect config is disabled', () => {
      beforeEach(() => {
        config = { fetchDirectlyFromConnect: false };
        createIpm();
      });

      describe('when ipm is available', () => {
        beforeEach(() => {
          pluckSubscribeCall(mockMediator, 'ipm.identifying')({ email });
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')(ipmParams);
          ipm.activateIpm('dan');
        });

        it('should show an ipm', () => {
          expect(dan.instance.show.__reactBoundMethod)
            .toHaveBeenCalled();
        });
      });

      describe('when ipm is not available', () => {
        beforeEach(() => {
          pluckSubscribeCall(mockMediator, 'ipm.identifying')({ email });
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')({});
          ipm.activateIpm('dan');
        });

        it('should not show an ipm', () => {
          expect(dan.instance.show.__reactBoundMethod)
            .not.toHaveBeenCalled();
        });
      });

      describe('when ipm is already seen', () => {
        beforeEach(() => {
          pluckSubscribeCall(mockMediator, 'ipm.identifying')({ email });
          pluckSubscribeCall(mockMediator, 'ipm.setIpm')(ipmParams);

          const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          const params = mockFrameFactoryCall[1];

          params.onShow(dan.instance);
          // Attempt to activate the ipm a second time
          ipm.activateIpm('dan');
        });

        it('should not show an ipm', () => {
          expect(dan.instance.show.__reactBoundMethod)
            .not.toHaveBeenCalled();
        });
      });

      describe('when user is not identified', () => {
        describe('and an anonymous campaign exists and is allowed in config', () => {
          beforeEach(() => {
            config.anonymousCampaigns = true;
            mockApiResponses[ipm.connectApiPendingCampaignPath] = {
              pendingCampaign: {
                id: 1,
                message: {
                  body: 'comments question',
                  color: 'red'
                }
              }
            };
            createIpm('anon');
            ipm.activateIpm('anon');
          });

          it('checks for anonymous pending campaign', () => {
            expect(apiGetSpy).toHaveBeenCalledWith(ipm.connectApiPendingCampaignPath, {
              anonymousId: 'some-buid'
            }, jasmine.any(Function), jasmine.any(Function));
          });

          it('should show an ipm', () => {
            expect(dan.instance.show.__reactBoundMethod)
              .toHaveBeenCalled();
          });
        });

        describe('and anonymous campaign is not allowed in config', () => {
          beforeEach(() => {
            config.anonymousCampaigns = false;
            createIpm('anon');
          });

          it('does not check for anonymous pending campaign', () => {
            expect(apiGetSpy).not.toHaveBeenCalledWith(ipm.connectApiPendingCampaignPath, {
              anonymousId: 'some-buid'
            });
          });

          it('should not show an ipm', () => {
            expect(dan.instance.show.__reactBoundMethod)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when fetchDirectlyFromConnect config is enabled', () => {
      beforeEach(() => {
        config = { fetchDirectlyFromConnect: true };
      });

      describe('when user has identified with an email address', () => {
        beforeEach(() => {
          createIpm();
          pluckSubscribeCall(mockMediator, 'ipm.identifying')({ email });
          ipm.activateIpm('dan');
        });

        it('checks for pending campaign by email', () => {
          expect(apiGetSpy).toHaveBeenCalledWith(ipm.connectApiPendingCampaignPath, {
            email
          }, jasmine.any(Function), jasmine.any(Function));
        });
      });

      describe('when user has not identified with an email address', () => {
        describe('and anonymous campaign exists and is allowed in config', () => {
          beforeEach(() => {
            config.anonymousCampaigns = true;
            mockApiResponses[ipm.connectApiPendingCampaignPath] = {
              pendingCampaign: {
                id: 1,
                message: {
                  body: 'comments question',
                  color: 'red'
                }
              }
            };
            createIpm('anon');
            ipm.activateIpm('anon');
          });

          it('checks for anonymous pending campaign', () => {
            expect(apiGetSpy).toHaveBeenCalledWith(ipm.connectApiPendingCampaignPath, {
              anonymousId: 'some-buid'
            }, jasmine.any(Function), jasmine.any(Function));
          });

          it('should show an ipm', () => {
            expect(dan.instance.show.__reactBoundMethod)
              .toHaveBeenCalled();
          });
        });

        describe('and anonymous campaign is not allowed in config', () => {
          beforeEach(() => {
            config.anonymousCampaigns = false;
            createIpm('anon');
            ipm.activateIpm('anon');
          });

          it('does not check for anonymous pending campaign', () => {
            expect(apiGetSpy)
              .not.toHaveBeenCalled();
          });

          it('should not show an ipm', () => {
            expect(dan.instance.show.__reactBoundMethod)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('setIpm', () => {
    let dan,
      danIpm;

    const ipmParams = {
      id: 1,
      message: {
        body: 'comments question',
        color: 'red'
      }
    };

    beforeEach(() => {
      ipm.create('dan');
      ipm.render('dan');
      dan = ipm.get('dan');
      danIpm = dan.instance.getChild().refs.rootComponent;
    });

    describe('when no ipm is available', () => {
      beforeEach(() => {
        ipm.setIpm({}, danIpm);
      });

      it('should set state.ipmAvailable to false', () => {
        expect(danIpm.state.ipmAvailable)
          .toEqual(false);
      });
    });

    describe('when an ipm is available', () => {
      beforeEach(() => {
        ipm.setIpm(ipmParams, danIpm);
      });

      it('should set the ipm correctly', () => {
        const ipmKeys = [
          'id',
          'name',
          'type',
          'message'
        ];

        ipmKeys.forEach((key) => {
          expect(danIpm.state.ipm[key])
            .toEqual(ipmParams[key]);
        });

        expect(danIpm.state.ipmAvailable)
          .toEqual(true);
      });
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
        dan;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        ipm.create('dan');
        ipm.render('dan');
        dan = ipm.get('dan');
      });

      describe('subscriptions to ipm.activate', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('ipm.activate', jasmine.any(Function));
        });
      });

      describe('subscription to ipm.setIpm', () => {
        it('should be subscribed', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('ipm.setIpm', jasmine.any(Function));
        });
      });

      it('should subscribe to ipm.hide', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('ipm.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'ipm.hide')();

        expect(dan.instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to ipm.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('ipm.show', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'ipm.show')();

        expect(dan.instance.show.__reactBoundMethod)
          .toHaveBeenCalled();
      });
    });
  });
});
