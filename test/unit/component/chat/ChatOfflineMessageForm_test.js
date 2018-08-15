describe('ChatOfflineMessageForm component', () => {
  let ChatOfflineMessageForm;
  const ChatOfflineMessageFormPath = buildSrcPath('component/chat/ChatOfflineMessageForm');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOfflineMessageForm.scss': {
        locals: {
          successContainer: 'successContainer',
          message: 'message',
          info: 'info',
          offlineMessage: 'offlineMessage',
          backButton: 'backButton'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      '@zendeskgarden/react-buttons': {
        Button: noopReactComponent()
      }
    });

    mockery.registerAllowable(ChatOfflineMessageFormPath);
    ChatOfflineMessageForm = requireUncached(ChatOfflineMessageFormPath).ChatOfflineMessageForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    const mockFormValues = {
      name: 'Boromir',
      email: 'Boromir@gondor.nw',
      phone: '12345678',
      message: 'One does not simply walk into Mordor'
    };
    let formResults,
      result;

    beforeEach(() => {
      const component = instanceRender(
        <ChatOfflineMessageForm offlineMessage={{ screen: 'success', details: mockFormValues }} />
      );

      result = component.render();
      formResults = result.props.children[1].props.children;
    });

    it('renders the name value from the form to the screen', () => {
      expect(formResults[0].props.children)
        .toBe(mockFormValues.name);
    });

    it('renders the email value from the form to the screen', () => {
      expect(formResults[1].props.children)
        .toBe(mockFormValues.email);
    });

    it('renders the phone value from the form to the screen', () => {
      expect(formResults[2].props.children)
        .toBe(mockFormValues.phone);
    });

    it('renders the message value from the form to the screen', () => {
      expect(formResults[3].props.children)
        .toBe(mockFormValues.message);
    });
  });
});
