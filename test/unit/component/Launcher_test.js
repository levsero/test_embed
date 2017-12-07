describe('Launcher component', () => {
  let Launcher;
  const launcherPath = buildSrcPath('component/Launcher');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

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
      './Launcher.sass': {
        locals: {
          label: 'labelClasses',
          icon: 'iconClasses'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'src/redux/modules/base/selectors': {
        getZopimChatEmbed: noop
      },
      'src/redux/modules/chat/selectors': {
        getChatStatus: noop
      },
      'src/redux/modules/zopimChat/selectors': {
        getZopimChatStatus: noop
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
              <Launcher chatStatus='online' helpCenterAvailable={true} label='help' />
            );
          });

          it('returns the prop label', () => {
            expect(launcher.getLabel())
              .toEqual('help');
          });
        });

        describe('when help center is not of config', () => {
          beforeEach(() => {
            launcher = domRender(<Launcher chatStatus='online' helpCenterAvailable={false} />);
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
            <Launcher chatStatus='offline' label='help' />
          );
        });

        it('returns the prop label', () => {
          expect(launcher.getLabel())
            .toEqual('help');
        });
      });
    });
  });

  describe('render', () => {
    const mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize');
    let launcher;

    beforeEach(() => {
      launcher = domRender(<Launcher updateFrameSize={mockUpdateFrameSize} />);
    });

    it('should call the updateFrameSize prop on render if it exists', () => {
      jasmine.clock().tick(0);

      expect(mockUpdateFrameSize).toHaveBeenCalled();
    });

    describe('when props.chatStatus is online', () => {
      beforeEach(() => {
        launcher = domRender(<Launcher chatStatus='online' />);
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
});
