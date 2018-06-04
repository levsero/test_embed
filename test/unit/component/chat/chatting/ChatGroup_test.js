import { ChatGroupAvatar } from '../../../../../src/component/chat/chatting/ChatGroupAvatar';

describe('ChatGroup component', () => {
  let ChatGroup,
    ATTACHMENT_ERROR_TYPES,
    ICONS,
    FILETYPE_ICONS,
    i18n;

  const chatGroupPath = buildSrcPath('component/chat/chatting/ChatGroup');
  const chatConstantsPath = buildSrcPath('constants/chat');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  const Avatar = noopReactComponent();
  const MessageBubble = noopReactComponent();
  const Attachment = noopReactComponent();
  const MessageError = noopReactComponent();
  const ImageMessage = noopReactComponent();
  const Icon = noopReactComponent();

  let chatConstants = requireUncached(chatConstantsPath);
  let CHAT_MESSAGE_TYPES = chatConstants.CHAT_MESSAGE_TYPES;

  beforeEach(() => {
    mockery.enable();

    ATTACHMENT_ERROR_TYPES = chatConstants.ATTACHMENT_ERROR_TYPES;
    ICONS = requireUncached(sharedConstantsPath).ICONS;
    FILETYPE_ICONS = requireUncached(sharedConstantsPath).FILETYPE_ICONS;
    i18n = {
      t: jasmine.createSpy().and.callFake((key) => { return key; })
    };

    initMockRegistry({
      'types/chat': {
        chatMessage: 'chatMessage'
      },
      'component/Icon': { Icon },
      'component/Avatar': { Avatar },
      'component/shared/MessageBubble': { MessageBubble },
      'component/attachment/Attachment': { Attachment },
      'component/chat/chatting/MessageError': { MessageError },
      'component/chat/chatting/ImageMessage': { ImageMessage },
      'component/chat/chatting/ChatGroupAvatar': { ChatGroupAvatar },
      'constants/chat': {
        ATTACHMENT_ERROR_TYPES,
        CHAT_MESSAGE_TYPES
      },
      'constants/shared': {
        ICONS,
        FILETYPE_ICONS
      },
      'service/i18n': {
        i18n
      },
      'utility/formatters': {
        dateTime: _.identity
      },
      './ChatGroup.scss': {
        locals: {
          wrapper: 'wrapperClass',
          messageBubble: 'messageBubbleClass',
          userBackground: 'userBackgroundClass',
          agentBackground: 'agentBackgroundClass',
          avatar: 'avatarClass',
          nameAvatar: 'nameAvatarClass',
          nameNoAvatar: 'nameNoAvatarClass',
          fadeIn: 'fadeInClass',
          fadeUp: 'fadeUpClass'
        }
      }
    });

    mockery.registerAllowable(chatGroupPath);
    ChatGroup = requireUncached(chatGroupPath).ChatGroup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  const getComponentMethod = (methodName, args={}) => {
    const component = domRender(<ChatGroup {...args} />);

    return component[methodName];
  };

  const avatarPath = 'path://to/avatar';
  const fakeTimestamp = 123;

  describe('#renderName', () => {
    let renderName,
      isAgent,
      showAvatar,
      messages,
      result;

    beforeEach(() => {
      renderName = getComponentMethod('renderName');
      result = renderName(isAgent, showAvatar, messages);
    });

    describe('when the message group is from a visitor', () => {
      beforeAll(() => {
        isAgent = false;
        showAvatar = true;
        messages = [{
          type: 'chat.msg',
          nick: 'visitor',
          display_name: 'Visitor 123',
          msg: 'Hello'
        }];
      });

      it('returns nothing', () => {
        expect(result).toEqual(null);
      });
    });

    describe('when the message group is from an agent', () => {
      beforeAll(() => {
        isAgent = true;
      });

      describe('and the user has no display name',() => {
        beforeAll(() => {
          messages = [{
            type: 'chat.msg',
            nick: 'agent:123',
            msg: 'Hello'
          }];
        });

        it('returns nothing', () => {
          expect(result).toEqual(null);
        });
      });

      describe('and the user has a display name', () => {
        beforeAll(() => {
          messages = [{
            type: 'chat.msg',
            nick: 'agent:123',
            display_name: 'Agent 123',
            msg: 'Hello',
            timestamp: fakeTimestamp
          }];
        });

        it('returns a div containing the name', () => {
          expect(result.type).toEqual('div');
          expect(result.props.children).toEqual(messages[0].display_name);
        });

        describe('when showAvatar is false', () => {
          beforeAll(() => {
            showAvatar = false;
          });

          it('renders with the correct styles', () => {
            expect(result.props.className).toContain('nameNoAvatarClass');
            expect(result.props.className).toContain('fadeInClass');
          });
        });

        describe('when showAvatar is true', () => {
          beforeAll(() => {
            showAvatar = true;
          });

          it('renders with the correct styles', () => {
            expect(result.props.className).toContain('nameAvatarClass');
            expect(result.props.className).toContain('fadeInClass');
          });
        });

        describe('when the message is an old message', () => {
          beforeEach(() => {
            showAvatar = true;
            renderName = getComponentMethod('renderName', {
              chatLogCreatedAt: fakeTimestamp + 1
            });
            result = renderName(isAgent, showAvatar, messages);
          });

          it('renders with the correct styles', () => {
            expect(result.props.className).toContain('nameAvatarClass');
            expect(result.props.className).not.toContain('fadeInClass');
          });
        });
      });
    });
  });

  describe('#renderMessageBubble', () => {
    let result,
      componentProps,
      chat,
      isAgent,
      showAvatar,
      handleSendMsgSpy;

    beforeEach(() => {
      const component = instanceRender(<ChatGroup {...componentProps} />);

      result = component.renderMessageBubble(chat, isAgent, showAvatar);
    });

    describe('when called', () => {
      beforeAll(() => {
        const handleSendMsgSpy = jasmine.createSpy('handleSendMsg');

        componentProps = {
          handleSendMsg: handleSendMsgSpy
        };
        chat = {
          msg: 'Hello how can I help you today?',
          options: ['foo', 'bar']
        };
      });

      it('returns a MessageBubble component', () => {
        expect(TestUtils.isElementOfType(result, MessageBubble))
          .toEqual(true);
      });

      it('passes the message value', () => {
        expect(result.props.message)
          .toEqual(chat.msg);
      });

      it('passes the options value', () => {
        expect(result.props.options)
          .toEqual(chat.options);
      });

      it('passes the props.handleSendMsg value', () => {
        expect(result.handleSendMsg)
          .toEqual(handleSendMsgSpy);
      });
    });

    describe('when showAvatar is true', () => {
      beforeAll(() => {
        chat = {};
        showAvatar = true;
      });

      it('renders messageBubble class', () => {
        expect(result.props.className)
          .toContain('messageBubbleClass');
      });
    });

    describe('when isAgent is true', () => {
      beforeAll(() => {
        chat = {};
        isAgent = true;
      });

      it('renders agentBackgroundClass class', () => {
        expect(result.props.className)
          .toContain('agentBackgroundClass');
      });
    });

    describe('when isAgent is false', () => {
      beforeAll(() => {
        chat = {};
        isAgent = false;
      });

      it('renders userBackgroundClass class', () => {
        expect(result.props.className)
          .toContain('userBackgroundClass');
      });
    });
  });

  describe('#renderErrorMessage', () => {
    let result,
      component,
      componentArgs,
      chat,
      isAgent,
      showAvatar,
      handleSendMsgSpy;

    beforeEach(() => {
      component = instanceRender(<ChatGroup {...componentArgs} />);

      spyOn(component, 'renderMessageBubble');

      result = component.renderErrorMessage(chat, isAgent, showAvatar);
    });

    describe('when called', () => {
      beforeAll(() => {
        chat = {
          msg: 'An unexpected problem has occurred with your request.',
          options: ['foo']
        };
        isAgent = true;
        showAvatar = true;
      });

      it('calls renderMessageBubble with expected args', () => {
        expect(component.renderMessageBubble)
          .toHaveBeenCalledWith(chat.msg, chat.options, isAgent, showAvatar);
      });
    });

    describe('when number of failed tries is 1', () => {
      describe('MessageError', () => {
        beforeAll(() => {
          handleSendMsgSpy = jasmine.createSpy('handleSendMsg');

          componentArgs = {
            handleSendMsg: handleSendMsgSpy
          };
          chat = {
            numFailedTries: 1,
            msg: 'An unexpected problem has occurred with your request.',
            options: ['foo'],
            timestamp: 1525309837209
          };
        });

        it('passes an expected value to props.errorMessage', () => {
          const messageErrorComponent = result.props.children[1].props.children;

          expect(messageErrorComponent.props.errorMessage)
            .toEqual('embeddable_framework.chat.messagefailed.resend');
        });

        it('passes an expected function to props.handleError', () => {
          const messageErrorComponent = result.props.children[1].props.children;
          const handleErrorFn = messageErrorComponent.props.handleError;

          handleErrorFn();

          expect(handleSendMsgSpy)
            .toHaveBeenCalledWith(chat.msg, chat.timestamp);
        });
      });
    });

    describe('when number of failed tries is not 1', () => {
      describe('MessageError', () => {
        beforeAll(() => {
          handleSendMsgSpy = jasmine.createSpy('handleSendMsg');

          componentArgs = {
            handleSendMsg: handleSendMsgSpy
          };
          chat = {
            numFailedTries: 0,
            msg: 'An unexpected problem has occurred with your request.'
          };
        });

        it('passes an expected value to props.errorMessage', () => {
          const messageErrorComponent = result.props.children[1].props.children;

          expect(messageErrorComponent.props.errorMessage)
            .toEqual('embeddable_framework.chat.messagefailed.failed_twice');
        });

        it('does not pass a function to props.handleError', () => {
          const messageErrorComponent = result.props.children[1].props.children;
          const handleErrorFn = messageErrorComponent.props.handleError;

          expect(handleErrorFn)
            .toBeUndefined();
        });
      });
    });
  });

  describe('#renderDefaultMessage', () => {
    let result,
      component,
      componentArgs,
      chat,
      isAgent,
      showAvatar;

    beforeEach(() => {
      component = instanceRender(<ChatGroup {...componentArgs} />);

      spyOn(component, 'renderMessageBubble');

      result = component.renderDefaultMessage(chat, isAgent, showAvatar);
    });

    describe('when called', () => {
      beforeAll(() => {
        chat = {
          msg: 'An unexpected problem has occurred with your request.',
          options: ['foo']
        };
        isAgent = true;
        showAvatar = true;
      });

      it('calls renderMessageBubble with expected args', () => {
        expect(component.renderMessageBubble)
          .toHaveBeenCalledWith(chat, isAgent, showAvatar);
      });
    });

    describe('when the chat status is successful', () => {
      beforeAll(() => {
        chat = { status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS };
      });

      it('renders an Icon component', () => {
        const firstChild = result.props.children[0];

        expect(TestUtils.isElementOfType(firstChild, Icon))
          .toEqual(true);
      });
    });

    describe('when the chat status is not successful', () => {
      beforeAll(() => {
        chat = { status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE };
      });

      it('does not render an Icon component', () => {
        const firstChild = result.props.children[0];

        expect(TestUtils.isElementOfType(firstChild, Icon))
          .toEqual(false);
      });
    });
  });

  describe('#renderPrintedMessage', () => {
    let component,
      chat,
      isAgent,
      showAvatar;

    beforeEach(() => {
      component = instanceRender(<ChatGroup />);

      spyOn(component, 'renderErrorMessage');
      spyOn(component, 'renderDefaultMessage');

      component.renderPrintedMessage(chat, isAgent, showAvatar);
    });

    describe('when the chat status has failed to sent', () => {
      beforeAll(() => {
        chat = { status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE };
        isAgent = true;
        showAvatar = true;
      });

      it('calls renderErrorMessage with expected args', () => {
        expect(component.renderErrorMessage)
          .toHaveBeenCalledWith(chat, isAgent, showAvatar);
      });

      it('does not call renderDefaultMessage', () => {
        expect(component.renderDefaultMessage)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the chat status has not failed to sent', () => {
      beforeAll(() => {
        chat = { status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS };
        isAgent = true;
        showAvatar = true;
      });

      it('calls renderDefaultMessage with expected args', () => {
        expect(component.renderDefaultMessage)
          .toHaveBeenCalledWith(chat, isAgent, showAvatar);
      });

      it('does not call renderErrorMessage', () => {
        expect(component.renderErrorMessage)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('#renderChatMessages', () => {
    let component,
      componentArgs,
      result,
      isAgent,
      showAvatar,
      messages;

    beforeEach(() => {
      component = instanceRender(<ChatGroup {...componentArgs} />);

      spyOn(component, 'renderPrintedMessage');
      spyOn(component, 'renderInlineAttachment');

      result = component.renderChatMessages(isAgent, showAvatar, messages);
    });

    describe('when messages contain a chat.msg type', () => {
      beforeAll(() => {
        isAgent = false;
        messages = [
          {
            type: 'chat.msg',
            nick: 'visitor',
            display_name: 'Visitor 123',
            msg: 'Hello, I would like these pancakes please:',
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS
          }
        ];
      });

      it('calls renderPrintMessage once with expected args', () => {
        const chatEvent = messages[0];

        expect(component.renderPrintedMessage.calls.count())
          .toEqual(1);

        expect(component.renderPrintedMessage)
          .toHaveBeenCalledWith(chatEvent, isAgent, showAvatar);
      });

      it('does not call renderInlineAttachment', () => {
        expect(component.renderInlineAttachment)
          .not.toHaveBeenCalledWith();
      });
    });

    describe('when messages contain a chat.file type', () => {
      beforeAll(() => {
        isAgent = false;
        messages = [
          {
            type: 'chat.file',
            file: {
              type: 'image/jpeg',
              name: 'pancakes.jpg',
              size: 1024,
              uploading: false,
              url: 'path://to/file'
            }
          }
        ];
      });

      it('calls renderInlineAttachment once with expected args', () => {
        const fileEvent = messages[0];

        expect(component.renderInlineAttachment.calls.count())
          .toEqual(1);

        expect(component.renderInlineAttachment)
          .toHaveBeenCalledWith(isAgent, fileEvent);
      });

      it('does not call renderPrintMessage', () => {
        expect(component.renderPrintedMessage)
          .not.toHaveBeenCalledWith();
      });
    });

    describe('when the message is new', () => {
      beforeAll(() => {
        isAgent = true;
        messages = [
          {
            type: 'chat.msg',
            nick: 'agent:123',
            display_name: 'Agent 123',
            msg: 'Sure. Here is the bill:',
            timestamp: fakeTimestamp
          }
        ];
      });

      it('render the wrapper with correct classnames', () => {
        const wrapperClasses = result[0].props.className;

        expect(wrapperClasses).toContain('wrapperClass');
        expect(wrapperClasses).toContain('fadeUpClass');
      });
    });

    describe('when the message is old', () => {
      beforeAll(() => {
        componentArgs = {
          chatLogCreatedAt: fakeTimestamp + 1
        };
        isAgent = true;
        messages = [
          {
            type: 'chat.msg',
            nick: 'agent:123',
            display_name: 'Agent 123',
            msg: 'Sure. Here is the bill:',
            timestamp: fakeTimestamp
          }
        ];
      });

      it('render the wrapper with correct classnames', () => {
        const wrapperClasses = result[0].props.className;

        expect(wrapperClasses).toContain('wrapperClass');
        expect(wrapperClasses).not.toContain('fadeUpClass');
      });
    });
  });

  describe('#renderInlineAttachment', () => {
    let renderInlineAttachment,
      isAgent,
      chat,
      result;

    beforeEach(() => {
      renderInlineAttachment = getComponentMethod('renderInlineAttachment');
      result = renderInlineAttachment(isAgent, chat);
    });

    describe('when the message group is from an agent', () => {
      beforeAll(() => {
        isAgent = true;
      });

      describe('when the attachment filetype is is not an image', () => {
        beforeAll(() => {
          chat = {
            type: 'chat.file',
            file: {
              type: 'application/pdf',
              name: 'invoice.pdf',
              size: 1024,
              url: 'path://to/file'
            }
          };
        });

        it('returns an Attachment component', () => {
          expect(TestUtils.isElementOfType(result, Attachment)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            downloading: false,
            file: chat.file,
            isDownloadable: true
          }));
        });
      });

      describe('when the attachment filetype is an image', () => {
        beforeAll(() => {
          chat = {
            type: 'chat.file',
            file: {
              type: 'image/jpeg',
              name: 'penguins.jpg',
              size: 1024,
              url: 'path://to/image'
            }
          };
        });

        it('returns an ImageMessage component', () => {
          expect(TestUtils.isElementOfType(result, ImageMessage)).toEqual(true);
        });

        it('passes the correct imgSrc prop to the component', () => {
          expect(result.props.imgSrc).toEqual(chat.file.url);
        });

        it('renders the component without a placeholder element', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            placeholderEl: null
          }));
        });
      });
    });

    describe('when the message group is from a visitor', () => {
      beforeAll(() => {
        isAgent = false;
      });

      describe('when the attachment filetype is is not an image', () => {
        beforeAll(() => {
          chat = {
            type: 'chat.file',
            file: {
              type: 'application/pdf',
              name: 'manual.pdf',
              size: 1024,
              url: 'path://to/file'
            }
          };
        });

        it('returns an Attachment component', () => {
          expect(TestUtils.isElementOfType(result, Attachment)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            downloading: false,
            file: chat.file,
            isDownloadable: true
          }));
        });

        describe('when the file contains a server returned error', () => {
          let children;

          beforeAll(() => {
            chat = {
              type: 'chat.file',
              file: {
                type: 'application/zip',
                name: 'sketchy.zip',
                size: 512,
                error: { message: 'INVALID_EXTENSION' },
                uploading: false
              }
            };
          });

          beforeEach(() => {
            children = result.props.children;
          });

          it('returns a group of components', () => {
            expect(result.props.children).toBeDefined();
          });

          it('returns an Attachment component', () => {
            expect(TestUtils.isElementOfType(children[0], Attachment)).toEqual(true);
          });

          it('passes the correct props to the Attachment component', () => {
            expect(children[0].props).toEqual(jasmine.objectContaining({
              downloading: false,
              file: chat.file,
              isDownloadable: false,
              uploading: false
            }));
          });

          it('returns a wrapped MessageError component', () => {
            expect(TestUtils.isElementOfType(
              children[1].props.children, MessageError)
            ).toEqual(true);
          });

          it('passes the correct props to the MessageError component', () => {
            expect(children[1].props.children.props)
              .toEqual(jasmine.objectContaining({
                errorMessage: 'embeddable_framework.chat.attachments.error.invalid_extension'
              }));
          });
        });
      });

      describe('when the attachment filetype is an image', () => {
        describe('while the file is uploading', () => {
          beforeAll(() => {
            chat = {
              type: 'chat.file',
              file: {
                type: 'image/jpeg',
                name: 'tortoises.jpg',
                size: 1024,
                uploading: true
              }
            };
          });

          it('returns an Attachment component', () => {
            expect(TestUtils.isElementOfType(result, Attachment)).toEqual(true);
          });

          it('passes the correct props to the child component', () => {
            expect(result.props).toEqual(jasmine.objectContaining({
              downloading: false,
              file: chat.file,
              isDownloadable: false,
              uploading: true
            }));
          });
        });

        describe('when the file has finished uploading', () => {
          beforeAll(() => {
            chat = {
              type: 'chat.file',
              file: {
                type: 'image/jpeg',
                name: 'tortoises.jpg',
                size: 1024,
                url: 'path://to/file',
                uploading: false
              }
            };
          });

          it('returns an ImageMessage component', () => {
            expect(TestUtils.isElementOfType(result, ImageMessage)).toEqual(true);
          });

          it('passes the correct imgSrc prop to the component', () => {
            expect(result.props.imgSrc).toEqual(chat.file.url);
          });

          it('renders the component with an Attachment as the placeholder element', () => {
            expect(TestUtils.isElementOfType(result.props.placeholderEl, Attachment))
              .toEqual(true);
          });
        });
      });
    });

    describe('when the filetype has an associated icon', () => {
      beforeAll(() => {
        chat = {
          type: 'chat.file',
          file: {
            name: 'numbers.xls',
            size: 128,
            uploading: true
          }
        };
      });

      it('passes the appropriate preview icon to Attachment', () => {
        expect(result.props.icon).toEqual('Icon--preview-spreadsheet');
      });
    });

    describe('when the filetype has no associated icon', () => {
      beforeAll(() => {
        chat = {
          type: 'chat.file',
          file: {
            name: 'readme.nfo',
            size: 64,
            uploading: true
          }
        };
      });

      it('passes the default preview icon to Attachment', () => {
        expect(result.props.icon).toEqual('Icon--preview-default');
      });
    });
  });

  describe('#renderAvatar', () => {
    const messages = [
      {
        type: 'chat.msg',
        nick: 'agent:123',
        display_name: 'Agent 123',
        msg: 'Sure. Here is the bill:',
        timestamp: fakeTimestamp
      }
    ];
    let renderAvatar;

    beforeEach(() => {
      renderAvatar = getComponentMethod('renderAvatar');
    });

    // New tests to go here
  });

  describe('#render', () => {
    let component,
      children;
    const isAgent = true;
    const showAvatar = true;
    const messages = [{
      timestamp: 100,
      type: 'chat.msg',
      nick: 'agent:123',
      display_name: 'Agent 123',
      msg: 'Hello'
    }];

    beforeEach(() => {
      component = domRender(
        <ChatGroup
          isAgent={isAgent}
          showAvatar={showAvatar}
          messages={messages}
          avatarPath={avatarPath}
        >
          {children}
        </ChatGroup>
      );

      spyOn(component, 'renderName');
      spyOn(component, 'renderChatMessages');
      spyOn(component, 'renderAvatar');

      component.render();
    });

    it('calls renderName with the correct args', () => {
      expect(component.renderName).toHaveBeenCalledWith(isAgent, showAvatar, messages);
    });

    it('calls renderChatMessages with the correct args', () => {
      expect(component.renderChatMessages).toHaveBeenCalledWith(isAgent, showAvatar, messages);
    });

    it('calls renderAvatar with the correct args', () => {
      expect(component.renderAvatar).toHaveBeenCalledWith(messages);
    });

    describe('when passed a child component', () => {
      const childElement = <div id='last-child-element' />;
      let childrenProp;

      beforeAll(() => {
        children = childElement;
      });

      beforeEach(() => {
        childrenProp = component.render().props.children;
      });

      it('is rendered as the last element in the wrapper element', () => {
        expect(childrenProp[childrenProp.length - 1]).toEqual(childElement);
      });
    });
  });
});
