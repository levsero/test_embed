describe('ChatMessagingChannels component', () => {
  let ChatMessagingChannels;
  const messagingChannelsPath = buildSrcPath('component/chat/ChatMessagingChannels'),
    Icon = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatMessagingChannels.scss': {
        locals: {
          container: 'containerClass',
          channelIcon: 'channelIconClass'
        }
      },
      'component/Icon': { Icon },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      'src/util/fields': {
        renderLabel: () => 'someLabel'
      }
    });

    mockery.registerAllowable(messagingChannelsPath);
    ChatMessagingChannels = requireUncached(messagingChannelsPath).ChatMessagingChannels;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      mockChannels = {},
      result;

    beforeEach(() => {
      component = instanceRender(<ChatMessagingChannels channels={mockChannels} />);
      spyOn(component, 'renderChannelIcon').and.returnValue(noopReactComponent());

      result = component.render();
    });

    it('does not render when channels are empty', () => {
      expect(result).toBe(null);
    });

    describe('when both channels are not allowed', () => {
      beforeAll(() => {
        mockChannels = {
          facebook: { allowed: false },
          twitter: { allowed: false }
        };
      });

      it('does not render', () => {
        expect(result).toBe(null);
      });
    });

    describe('when messenger is allowed', () => {
      beforeAll(() => {
        mockChannels = {
          facebook: { allowed: true, page_id: '123' },
          twitter: { allowed: false }
        };
      });

      it('calls renderChannelIcon with the correct type and pageId', () => {
        expect(component.renderChannelIcon).toHaveBeenCalledWith('messenger', '123');
      });

      it('renders only one icon', () => {
        const icons = result.props.children[1].props.children;

        expect(icons.filter(Boolean).length).toEqual(1);
      });
    });

    describe('when twitter is allowed', () => {
      beforeAll(() => {
        mockChannels = {
          facebook: { allowed: false },
          twitter: { allowed: true, page_id: '456' }
        };
      });

      it('calls renderChannelIcon with the correct type and pageId', () => {
        expect(component.renderChannelIcon).toHaveBeenCalledWith('twitter', '456');
      });

      it('renders only one icon', () => {
        const icons = result.props.children[1].props.children;

        expect(icons.filter(Boolean).length).toEqual(1);
      });
    });

    describe('when both messenger and twitter are allowed', () => {
      beforeAll(() => {
        mockChannels = {
          facebook: { allowed: true, page_id: '123' },
          twitter: { allowed: true, page_id: '456' }
        };
      });

      it('calls renderChannelIcon with the correct type and pageId', () => {
        expect(component.renderChannelIcon.calls.allArgs()).toEqual([['messenger', '123'], ['twitter', '456']]);
      });

      it('renders two icons', () => {
        const icons = result.props.children[1].props.children;

        expect(icons.filter(Boolean).length).toEqual(2);
      });
    });
  });

  describe('renderChannelIcon', () => {
    let component, result, mockType, mockPageId;

    beforeEach(() => {
      component = instanceRender(<ChatMessagingChannels />);
      result = component.renderChannelIcon(mockType, mockPageId);
    });

    describe('when type is messenger', () => {
      beforeAll(() => {
        mockType = 'messenger';
        mockPageId = '123';
      });

      it('renders with the correct URL', () => {
        expect(result.props.href).toEqual('https://m.me/123');
      });

      it('renders with the correct icon type', () => {
        expect(result.props.children.props.type).toEqual('Icon--messenger');
      });
    });

    describe('when type is twitter', () => {
      beforeAll(() => {
        mockType = 'twitter';
        mockPageId = '456';
      });

      it('renders with the correct URL', () => {
        expect(result.props.href).toEqual('https://twitter.com/messages/compose?recipient_id=456');
      });

      it('renders with the correct icon type', () => {
        expect(result.props.children.props.type).toEqual('Icon--twitter');
      });
    });
  });
});
