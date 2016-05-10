describe('Ipm component', function() {
  let Ipm;
  const ipmPath = buildSrcPath('component/Ipm');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/utils': {
        getPageTitle: () => 'Awesome Page'
      },
      'service/i18n': {
        i18n: {
          getLocale: () => 'un-US'
        }
      },
      'service/identity': {
        identity: {
          getBuid: () => '1357911abc'
        }
      },
      'component/IpmDesktop': {
        IpmDesktop: React.createClass({
          render() {
            return (
              <div className='ipm-desktop' />
            );
          }
        })
      }
    });
    Ipm = requireUncached(ipmPath).Ipm;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('initializes with state.ipmAvailable set to `null`', function() {
    const ipm = instanceRender(<Ipm ipmSender={noop} />);

    expect(ipm.state.ipmAvailable)
      .toEqual(null);
  });

  describe('ipmSender', function() {
    it('should call the this.props.ipmSender with event details', function() {
      const ipmSenderSpy = jasmine.createSpy();
      const component = instanceRender(<Ipm ipmSender={ipmSenderSpy} />);
      const ipm = {
        id: 123,
        recipientEmail: 'imissryan@zendesk.com'
      };

      component.setState({ ipm, url: 'https://askjeeves.com' });
      component.ipmSender('clicked');

      expect(ipmSenderSpy)
        .toHaveBeenCalledWith({
          event: {
            campaignId: ipm.id,
            email: ipm.recipientEmail,
            type: 'clicked',
            url: 'https://askjeeves.com',
            title: 'Awesome Page',
            locale: 'un-US',
            'anonymous_id': '1357911abc'
          }
        });
    });
  });
});
