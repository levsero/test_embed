describe('Ipm component', function() {
  let Ipm;
  let loggingErrorSpy;
  const ipmPath = buildSrcPath('component/ipm/Ipm');
  const referrer = 'http://altavista.com';

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
          getSuid: () => ({ id: '789789xyz' }),
          getBuid: () => '1357911abc'
        }
      },
      'service/logging': {
        logging: { error: loggingErrorSpy }
      },
      'utility/globals': {
        referrer
      },
      'component/ipm/IpmDesktop': {
        IpmDesktop: class {
          render() {
            return (
              <div className='ipm-desktop' />
            );
          }
        }
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
    let ipmSenderSpy,
      component;

    beforeEach(function() {
      ipmSenderSpy = jasmine.createSpy();
      component = instanceRender(
        <Ipm ipmSender={ipmSenderSpy} />
      );
    });

    describe('when there is a campaign', () => {
      let ipm;

      describe('when recipient has an email', () => {
        beforeEach(() => {
          ipm = { id: 123, recipientEmail: 'imissryan@zendesk.com' };
          component.setState({ ipm: ipm, url: 'https://askjeeves.com' });
          component.ipmSender('clicked');
        });

        it('should call the this.props.ipmSender with event details', function() {
          expect(ipmSenderSpy)
            .toHaveBeenCalledWith({
              campaignId: ipm.id,
              recipientEmail: ipm.recipientEmail,
              anonymousSuid: undefined,
              event: {
                anonymousId: '1357911abc',
                locale: 'un-US',
                referrer,
                title: 'Awesome Page',
                type: 'clicked',
                url: 'https://askjeeves.com'
              }
            });
        });
      });

      describe('when recipient does not have an email', () => {
        beforeEach(() => {
          const ipm = { id: 123 };

          component.setState({ ipm: ipm, url: 'https://askjeeves.com' });
          component.ipmSender('clicked');
        });

        it('should call the this.props.ipmSender with anonymous event details', function() {
          expect(ipmSenderSpy)
            .toHaveBeenCalledWith({
              campaignId: ipm.id,
              recipientEmail: undefined,
              anonymousSuid: '789789xyz',
              event: {
                anonymousId: '1357911abc',
                locale: 'un-US',
                referrer,
                title: 'Awesome Page',
                type: 'clicked',
                url: 'https://askjeeves.com'
              }
            });
        });
      });
    });

    describe('when there is no campaign', function() {
      beforeEach(function() {
        component.ipmSender('clicked');
      });

      it('does not invoke this.props.ipmSender', function() {
        expect(ipmSenderSpy)
          .not.toHaveBeenCalled();
      });

      it('logs error to Airbrake', function() {
        expect(loggingErrorSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
