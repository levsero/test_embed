describe('Ipm component', function() {
  let Ipm;
  let loggingErrorSpy;
  const ipmPath = buildSrcPath('component/Ipm');

  beforeEach(function() {
    resetDOM();

    mockery.enable();
    loggingErrorSpy = jasmine.createSpy();

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
      'service/logging': {
        logging: { error: loggingErrorSpy }
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

  describe('#ipmSender', function() {
    beforeEach(function() {
      this.ipmSenderSpy = jasmine.createSpy();
      this.component = instanceRender(
        <Ipm ipmSender={this.ipmSenderSpy} />
      );
    });
    describe('when there is a campaign', () => {
      it('should call the this.props.ipmSender with event details', function() {
        const ipm = { id: 123, recipientEmail: 'imissryan@zendesk.com' };

        this.component.setState({ ipm: ipm, url: 'https://askjeeves.com' });
        this.component.ipmSender('clicked');

        expect(this.ipmSenderSpy)
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

    describe('when there is no campaign', function() {
      beforeEach(function() {
        this.component.ipmSender('clicked');
      });

      it('does not invoke this.props.ipmSender', function() {
        expect(this.ipmSenderSpy)
          .not.toHaveBeenCalled();
      });

      it('logs error to Airbrake', function() {
        expect(loggingErrorSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
