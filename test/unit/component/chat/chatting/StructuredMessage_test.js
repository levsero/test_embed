describe('StructuredMessage component', () => {
  let StructuredMessage;

  const structuredMessagePath = buildSrcPath('component/chat/chatting/StructuredMessage');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const ButtonCard = noopReactComponent();
  const PanelCard = noopReactComponent();

  const sendMsgSpy = jasmine.createSpy('sendMsg');
  const openSpy = jasmine.createSpy('open');

  const chatConstants = requireUncached(chatConstantsPath);
  let CHAT_STRUCTURED_MESSAGE_TYPE = chatConstants.CHAT_STRUCTURED_MESSAGE_TYPE;
  let CHAT_STRUCTURED_MESSAGE_ACTION_TYPE = chatConstants.CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './structuredMessage/ButtonCard': { ButtonCard },
      './structuredMessage/PanelCard': { PanelCard },
      'constants/chat': {
        CHAT_STRUCTURED_MESSAGE_TYPE,
        CHAT_STRUCTURED_MESSAGE_ACTION_TYPE
      },
      'src/redux/modules/chat': {
        sendMsg: sendMsgSpy
      },
      'utility/globals': {
        win: {
          open: openSpy
        }
      }
    });

    mockery.registerAllowable(structuredMessagePath);
    StructuredMessage = requireUncached(structuredMessagePath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    sendMsgSpy.calls.reset();
    openSpy.calls.reset();
  });

  describe('#createAction', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<StructuredMessage schema={{}} sendMsg={sendMsgSpy} />);
    });

    it('returns a function that calls sendMsg when action type is quick reply', () => {
      const actionSchema = {
        type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.QUICK_REPLY_ACTION,
        value: 'replied'
      };
      const result = component.createAction(actionSchema);

      result();

      expect(sendMsgSpy)
        .toHaveBeenCalledWith(actionSchema.value);
    });

    it('returns a function that calls win.open when action type is link', () => {
      const actionSchema = {
        type: CHAT_STRUCTURED_MESSAGE_ACTION_TYPE.LINK_ACTION,
        value: 'https://sample.com'
      };
      const result = component.createAction(actionSchema);

      result();

      expect(openSpy)
        .toHaveBeenCalledWith(actionSchema.value);
    });

    it('returns undefined when action type is unknown', () => {
      const actionSchema = {
        type: 'UnknowAnction',
        value: 'oh no'
      };

      const result = component.createAction(actionSchema);

      expect(result)
        .toBeUndefined();
    });
  });

  describe('#render', () => {
    let component,
      result,
      schema;

    beforeEach(() => {
      component = instanceRender(<StructuredMessage schema={schema} />);
      result = component.render();
    });

    describe('schema type is ButtonTemplate', () => {
      beforeAll(() => {
        schema = {
          type: CHAT_STRUCTURED_MESSAGE_TYPE.BUTTON_TEMPLATE,
          buttons: [],
          msg: 'Hello!'
        };
      });

      it('returns a ButtonCard component', () => {
        expect(TestUtils.isElementOfType(result, ButtonCard))
          .toEqual(true);
      });

      it('passes the buttons value', () => {
        expect(result.props.buttons)
          .toEqual(schema.buttons);
      });

      it('passes the msg value', () => {
        expect(result.props.msg)
          .toEqual(schema.msg);
      });

      it('passes the createAction value', () => {
        expect(result.props.createAction)
          .toEqual(component.createAction);
      });
    });

    describe('schema type is PanelTemplate', () => {
      beforeAll(() => {
        schema = {
          type: CHAT_STRUCTURED_MESSAGE_TYPE.PANEL_TEMPLATE,
          buttons: [],
          panel: {
            heading: 'header 1',
            paragraph: 'this is a paragraph'
          }
        };
      });

      it('returns a PanelCard component', () => {
        expect(TestUtils.isElementOfType(result, PanelCard)).toEqual(true);
      });

      it('passes the buttons value', () => {
        expect(result.props.buttons).toEqual(schema.buttons);
      });

      it('passes the panel object', () => {
        expect(result.props.panel).toEqual(schema.panel);
      });

      it('passes the createAction value', () => {
        expect(result.props.createAction).toEqual(component.createAction);
      });
    })
  });
});
