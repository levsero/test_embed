describe('WidgetLauncher component', () => {
  let Launcher,
    mockChatSuppressedValue,
    mockLocale = 'en',
    mockIsRTL = false;
  const launcherPath = buildSrcPath('component/launcher/WidgetLauncher');

  beforeEach(() => {
    mockery.enable();

    mockChatSuppressedValue = false;

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: () => {
          return false;
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className={this.props.className}>{this.props.type}</div>;
          }
        }
      },
      './WidgetLauncher.scss': {
        locals: {
          label: 'labelClasses',
          icon: 'iconClasses'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          getLocale: () => mockLocale,
          isRTL: () => mockIsRTL
        }
      },
      'src/redux/modules/base/base-selectors': {
        getZopimChatEmbed: noop
      },
      'src/redux/modules/selectors': {
        getChatOnline: noop
      },
      'service/settings': {
        settings: {
          get: () => mockChatSuppressedValue
        }
      },
      'src/redux/modules/talk/talk-selectors': {
        isCallbackEnabled: noop
      },
      'src/redux/modules/chat/chat-selectors': {
        getNotification: noop
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatSuppress: noop
      },
      'src/redux/modules/base/': {
        launcherClicked: noop
      },
      'utility/keyboard': {
        keyCodes: {
          'SPACE': 32,
          'ENTER': 13
        }
      }
    });

    Launcher = requireUncached(launcherPath).default.WrappedComponent;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getLabel', () => {
    let launcher;

    describe('when there are unreadMessages', () => {
      beforeEach(() => {
        launcher = domRender(<Launcher />);
      });

      describe('when there is one unread message', () => {
        beforeEach(() => {
          launcher.setState({ unreadMessages: 1 });
        });

        it('returns the single message label', () => {
          expect(launcher.getLabel())
            .toEqual('embeddable_framework.chat.notification');
        });
      });

      describe('when there is more then one unread message', () => {
        beforeEach(() => {
          launcher.setState({ unreadMessages: 2 });
        });

        it('returns the multiple messages label', () => {
          expect(launcher.getLabel())
            .toEqual('embeddable_framework.chat.notification_multiple');
        });
      });
    });

    describe('when there are no unreadMessages', () => {
      describe('when chat is online', () => {
        describe('when help center is part of config', () => {
          beforeEach(() => {
            launcher = domRender(
              <Launcher chatAvailable={true} helpCenterAvailable={true} label='help' />
            );
          });

          it('returns the prop label', () => {
            expect(launcher.getLabel())
              .toEqual('help');
          });
        });

        describe('when help center is not of config', () => {
          beforeEach(() => {
            launcher = domRender(<Launcher chatAvailable={true} helpCenterAvailable={false} />);
          });

          it('returns the chat label', () => {
            expect(launcher.getLabel())
              .toEqual('embeddable_framework.launcher.label.chat');
          });
        });
      });

      describe('when chat is offline', () => {
        beforeEach(() => {
          launcher = domRender(
            <Launcher chatOnline={false} label='help' />
          );
        });

        it('returns the prop label', () => {
          expect(launcher.getLabel())
            .toEqual('help');
        });
      });

      describe('when Talk is available', () => {
        describe('when callback capability is enabled', () => {
          beforeEach(() => {
            launcher = instanceRender(<Launcher talkAvailable={true} callbackEnabled={true} />);
          });

          it('returns a "Request a callback" string', () => {
            expect(launcher.getLabel())
              .toEqual('embeddable_framework.launcher.label.talk.request_callback');
          });
        });

        describe('when callback capability is unavailable', () => {
          beforeEach(() => {
            launcher = instanceRender(<Launcher talkAvailable={true} />);
          });

          it('returns a "Call us" string', () => {
            expect(launcher.getLabel())
              .toEqual('embeddable_framework.launcher.label.talk.call_us');
          });
        });
      });

      describe('when Chat and Talk are available', () => {
        let label;

        describe('when callback capability is enabled', () => {
          beforeEach(() => {
            label = 'Help me Obi Wan Kenobi, you`re my only hope';
            launcher = instanceRender(
              <Launcher
                label={label}
                chatAvailable={true}
                talkAvailable={true} />
            );
          });

          it('returns a string passed from a prop', () => {
            expect(launcher.getLabel())
              .toEqual(label);
          });
        });
      });
    });
  });

  describe('getActiveEmbedLabel', () => {
    let launcher;

    describe('when the active embed is contact form', () => {
      beforeEach(() => {
        launcher = instanceRender(<Launcher label='some-label' activeEmbed='ticketSubmissionForm' />);
      });

      it('returns props.label', () => {
        expect(launcher.getActiveEmbedLabel())
          .toBe('some-label');
      });
    });

    describe('when the active embed is help center', () => {
      beforeEach(() => {
        launcher = instanceRender(<Launcher label='some-label' activeEmbed='helpCenterForm' />);
      });

      it('returns props.label', () => {
        expect(launcher.getActiveEmbedLabel())
          .toBe('some-label');
      });
    });

    describe('when the active embed is chat', () => {
      describe('when chat is available', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='chat' chatAvailable={true}/>);
        });

        it('returns the chat label', () => {
          expect(launcher.getActiveEmbedLabel())
            .toEqual('embeddable_framework.launcher.label.chat');
        });
      });

      describe('when chat is available but chat is offline', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='chat' chatAvailable={true} chatOfflineAvailable={true}  label='some-label' />);
        });

        it('returns props.label', () => {
          expect(launcher.getActiveEmbedLabel())
            .toBe('some-label');
        });
      });

      describe('when chat is not available', () => {
        let getLabelSpy;

        beforeEach(() => {
          getLabelSpy = jasmine.createSpy('getLabel').and.returnValue('get-label-value');
          launcher = instanceRender(<Launcher activeEmbed='chat' chatAvailable={false} />);

          launcher.getLabel = getLabelSpy;
        });

        it('returns the value of getLabel', () => {
          expect(launcher.getActiveEmbedLabel())
            .toBe('get-label-value');
        });
      });
    });

    describe('when the active embed is talk', () => {
      describe('when callback capability is enabled', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='talk' callbackEnabled={true} />);
        });

        it('returns a "Request a callback" string', () => {
          expect(launcher.getActiveEmbedLabel())
            .toEqual('embeddable_framework.launcher.label.talk.request_callback');
        });
      });

      describe('when callback capability is unavailable', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='talk' />);
        });

        it('returns a "Call us" string', () => {
          expect(launcher.getActiveEmbedLabel())
            .toEqual('embeddable_framework.launcher.label.talk.call_us');
        });
      });
    });

    describe('when the active embed is empty', () => {
      let getLabelSpy;

      beforeEach(() => {
        getLabelSpy = jasmine.createSpy('getLabel').and.returnValue('get-label-value');
        launcher = instanceRender(<Launcher activeEmbed='' />);

        launcher.getLabel = getLabelSpy;
      });

      it('returns the value of getLabel', () => {
        expect(launcher.getActiveEmbedLabel())
          .toBe('get-label-value');
      });
    });

    describe('when the active embed is channel choice', () => {
      let getLabelSpy;

      beforeEach(() => {
        getLabelSpy = jasmine.createSpy('getLabel').and.returnValue('get-label-value');
        launcher = instanceRender(<Launcher activeEmbed='channelChoice' />);

        launcher.getLabel = getLabelSpy;
      });

      it('returns the value of getLabel', () => {
        expect(launcher.getActiveEmbedLabel())
          .toBe('get-label-value');
      });
    });
  });

  describe('getIconType', () => {
    let result;

    describe('when chat and talk is available', () => {
      beforeEach(() => {
        const launcher = instanceRender(<Launcher chatAvailable={true} talkAvailable={true} />);

        result = launcher.getIconType();
      });

      it('returns the string Icon', () => {
        expect(result)
          .toEqual('Icon');
      });
    });

    describe('when only chat is available', () => {
      beforeEach(() => {
        const launcher = instanceRender(<Launcher chatAvailable={true} />);

        result = launcher.getIconType();
      });

      it('returns the string Icon--chat', () => {
        expect(result)
          .toEqual('Icon--chat');
      });
    });

    describe('when only chat is available but chat is offline', () => {
      beforeEach(() => {
        const launcher = instanceRender(<Launcher chatAvailable={true} chatOfflineAvailable={true} />);

        result = launcher.getIconType();
      });

      it('returns the string Icon', () => {
        expect(result)
          .toEqual('Icon');
      });
    });

    describe('when only talk is available', () => {
      beforeEach(() => {
        const launcher = instanceRender(<Launcher talkAvailable={true} />);

        result = launcher.getIconType();
      });

      it('returns the string Icon--launcher-talk', () => {
        expect(result)
          .toEqual('Icon--launcher-talk');
      });
    });

    describe('when no embeds are available', () => {
      beforeEach(() => {
        const launcher = instanceRender(<Launcher />);

        result = launcher.getIconType();
      });

      it('returns the string Icon', () => {
        expect(result)
          .toEqual('Icon');
      });
    });
  });

  describe('getActiveEmbedIconType', () => {
    let launcher;

    describe('when the active embed is contact form', () => {
      beforeEach(() => {
        launcher = instanceRender(<Launcher activeEmbed='ticketSubmissionForm' />);
      });

      it('returns the string Icon', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('Icon');
      });
    });

    describe('when the active embed is chat', () => {
      describe('when chat is available', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='zopimChat' chatAvailable={true} />);
        });

        it('returns the string Icon--chat', () => {
          expect(launcher.getActiveEmbedIconType())
            .toBe('Icon--chat');
        });
      });

      describe('when chat is available but chat is offline', () => {
        beforeEach(() => {
          launcher = instanceRender(<Launcher activeEmbed='zopimChat' chatAvailable={true} chatOfflineAvailable={true} />);
        });

        it('returns the value of getIcon', () => {
          expect(launcher.getActiveEmbedIconType())
            .toBe('Icon');
        });
      });

      describe('when chat is not available', () => {
        let getIconTypeSpy;

        beforeEach(() => {
          getIconTypeSpy = jasmine.createSpy('getIcon').and.returnValue('get-icon-value');
          launcher = instanceRender(<Launcher activeEmbed='zopimChat' chatAvailable={false} />);

          launcher.getIconType = getIconTypeSpy;
        });

        it('returns the value of getIcon', () => {
          expect(launcher.getActiveEmbedIconType())
            .toBe('get-icon-value');
        });
      });
    });

    describe('when the active embed is talk', () => {
      beforeEach(() => {
        launcher = instanceRender(<Launcher activeEmbed='talk' />);
      });

      it('returns the string Icon--launcher-talk', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('Icon--launcher-talk');
      });
    });

    describe('when the active embed is empty', () => {
      let getIconTypeSpy;

      beforeEach(() => {
        getIconTypeSpy = jasmine.createSpy('getIcon').and.returnValue('get-icon-value');
        launcher = instanceRender(<Launcher activeEmbed='' />);

        launcher.getIconType = getIconTypeSpy;
      });

      it('returns the value of getIcon', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('get-icon-value');
      });
    });

    describe('when the active embed is channel choice', () => {
      let getIconTypeSpy;

      beforeEach(() => {
        getIconTypeSpy = jasmine.createSpy('getIcon').and.returnValue('get-icon-value');
        launcher = instanceRender(<Launcher activeEmbed='channelChoice' />);

        launcher.getIconType = getIconTypeSpy;
      });

      it('returns the value of getIcon', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('get-icon-value');
      });
    });

    describe('when the active embed is help center', () => {
      let getIconTypeSpy;

      beforeEach(() => {
        getIconTypeSpy = jasmine.createSpy('getIcon').and.returnValue('get-icon-value');
        launcher = instanceRender(<Launcher activeEmbed='helpCenterForm' />);

        launcher.getIconType = getIconTypeSpy;
      });

      it('returns the value of getIcon', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('get-icon-value');
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let launcher, notificationCount, previousNotificationCount;
    const forceUpdateWorldSpy = jasmine.createSpy('forceUpdateWorld');

    beforeEach(() => {
      launcher = domRender(
        <Launcher notificationCount={previousNotificationCount} forceUpdateWorld={forceUpdateWorldSpy} />
      );
      launcher.componentWillReceiveProps({ notificationCount });
    });

    describe('when nextProps.notificationCount is the same as props.notificationCount', () => {
      beforeAll(() => {
        notificationCount = 1;
        previousNotificationCount = 1;
      });

      it('does not call forceUpdateWorld', () => {
        expect(forceUpdateWorldSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when nextProps.notificationCount is different to props.notificationCount', () => {
      beforeAll(() => {
        notificationCount = 1;
        previousNotificationCount = 0;
      });

      it('calls forceUpdateWorld', () => {
        expect(forceUpdateWorldSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('render', () => {
    let launcher;

    describe('when props.chatOnline is online', () => {
      beforeEach(() => {
        launcher = domRender(<Launcher chatAvailable={true} />);
      });

      it('should ignore state and set label to online', () => {
        launcher.setState({ label: 'foo' });

        expect(ReactDOM.findDOMNode(launcher).querySelector('.labelClasses').innerHTML)
          .toContain('chat');
      });

      it('should ignore state and set label to Icon--chat', () => {
        launcher.setState({ icon: 'bar' });

        expect(ReactDOM.findDOMNode(launcher).querySelector('.iconClasses').innerHTML)
          .toEqual('Icon--chat');
      });
    });
  });

  describe('getNotificationCount', () => {
    let result;

    describe('when unread messages is greater than 0', () => {
      beforeEach(() => {
        const launcher = domRender(<Launcher notificationCount={5} />);

        launcher.setState({ unreadMessages: 10 });
        result = launcher.getNotificationCount();
      });

      it('returns the value from the state', () => {
        expect(result)
          .toEqual(10);
      });
    });

    describe('when unread messages is 0 and notification count is greater than 0', () => {
      beforeEach(() => {
        const launcher = domRender(<Launcher notificationCount={5} />);

        result = launcher.getNotificationCount();
      });

      it('returns the value from the props', () => {
        expect(result)
          .toEqual(5);
      });
    });
  });

  describe('flipX', () => {
    let launcher,
      mockIconType,
      rendered;

    beforeEach(() => {
      launcher = instanceRender(<Launcher />);
      launcher.getActiveEmbedIconType = jasmine.createSpy('getActiveEmbedIconType').and.returnValue(mockIconType);
      rendered = launcher.render();
    });

    it('does not renders the launcher with flipped icon', () => {
      const targetElem = rendered.props.children[0];

      expect(targetElem.props.flipX)
        .toBe(false);
    });

    describe('when the icon type is Icon, locale is RTL and not Hebrew', () => {
      beforeAll(() => {
        mockIconType = 'Icon';
        mockIsRTL = true;
        mockLocale = 'ar';
      });

      it('renders the launcher with flipped icon', () => {
        const targetElem = rendered.props.children[0];

        expect(targetElem.props.flipX)
          .toBe(true);
      });
    });

    describe('when the icon type is Icon, locale is Hebrew', () => {
      beforeAll(() => {
        mockIconType = 'Icon';
        mockIsRTL = true;
        mockLocale = 'he';
      });

      it('does not render the launcher with flipped icon', () => {
        const targetElem = rendered.props.children[0];

        expect(targetElem.props.flipX)
          .toBe(false);
      });
    });

    describe('when the icon type is Icon--chat and locale is RTL', () => {
      beforeAll(() => {
        mockIconType = 'Icon--chat';
        mockIsRTL = true;
      });

      it('renders the launcher with flipped icon', () => {
        const targetElem = rendered.props.children[0];

        expect(targetElem.props.flipX)
          .toBe(true);
      });
    });
  });
});