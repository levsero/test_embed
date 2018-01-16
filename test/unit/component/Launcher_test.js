describe('Launcher component', () => {
  let Launcher,
    mockChatSuppressedValue;
  const launcherPath = buildSrcPath('component/Launcher');

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
      './Launcher.scss': {
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
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatSuppress: noop
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
      beforeEach(() => {
        launcher = instanceRender(<Launcher activeEmbed='zopimChat' />);
      });

      it('returns the chat label', () => {
        expect(launcher.getActiveEmbedLabel())
          .toEqual('embeddable_framework.launcher.label.chat');
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
      beforeEach(() => {
        launcher = instanceRender(<Launcher activeEmbed='zopimChat' />);
      });

      it('returns the string Icon--chat', () => {
        expect(launcher.getActiveEmbedIconType())
          .toBe('Icon--chat');
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
});
