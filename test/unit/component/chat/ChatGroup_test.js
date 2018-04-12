describe('ChatGroup component', () => {
  let ChatGroup,
    ATTACHMENT_ERROR_TYPES,
    ICONS,
    FILETYPE_ICONS,
    i18n;

  const chatGroupPath = buildSrcPath('component/chat/ChatGroup');
  const chatConstantsPath = buildSrcPath('constants/chat');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  const Avatar = noopReactComponent();
  const MessageBubble = noopReactComponent();
  const Attachment = noopReactComponent();
  const MessageError = noopReactComponent();
  const ImageMessage = noopReactComponent();

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
      'component/Avatar': { Avatar },
      'component/shared/MessageBubble': { MessageBubble },
      'component/attachment/Attachment': { Attachment },
      'component/chat/MessageError': { MessageError },
      'component/chat/ImageMessage': { ImageMessage },
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
      './ChatGroup.scss': {
        locals: {
          container: 'container',
          wrapper: 'wrapper',
          message: 'message',
          messageUser: 'messageUser',
          messageAgent: 'messageAgent',
          messageBubble: 'messageBubble',
          attachment: 'attachment',
          userBackground: 'userBackground',
          agentBackground: 'agentBackground',
          avatarDefault: 'avatarDefault',
          avatarWithSrc: 'avatarWithSrc',
          nameAvatar: 'nameAvatar',
          nameNoAvatar: 'nameNoAvatar',
          messageErrorContainer: 'messageErrorContainer',
          fadeIn: 'fadeIn',
          fadeUp: 'fadeUp'
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
            expect(result.props.className).toContain('nameNoAvatar');
            expect(result.props.className).toContain('fadeIn');
          });
        });

        describe('when showAvatar is true', () => {
          beforeAll(() => {
            showAvatar = true;
          });

          it('renders with the correct styles', () => {
            expect(result.props.className).toContain('nameAvatar');
            expect(result.props.className).toContain('fadeIn');
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
            expect(result.props.className).toContain('nameAvatar');
            expect(result.props.className).not.toContain('fadeIn');
          });
        });
      });
    });
  });

  describe('#renderChatMessages', () => {
    let renderChatMessages,
      isAgent,
      showAvatar,
      messages,
      result,
      args;

    beforeEach(() => {
      args = {
        handleSendMsg: () => {}
      };

      renderChatMessages = getComponentMethod('renderChatMessages', args);
      result = renderChatMessages(isAgent, showAvatar, messages);
    });

    describe('when the message group is from a visitor', () => {
      beforeAll(() => {
        isAgent = false;
        messages = [
          {
            type: 'chat.msg',
            nick: 'visitor',
            display_name: 'Visitor 123',
            msg: 'Hello, I would like these pancakes please:'
          },
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

      it('maps over the messages and returns the appropriate components', () => {
        const message1 = result[0].props.children.props.children;
        const message2 = result[1].props.children.props.children;

        expect(TestUtils.isElementOfType(message1, MessageBubble)).toEqual(true);
        expect(TestUtils.isElementOfType(message2, ImageMessage)).toEqual(true);
      });
    });

    describe('when the message group is from an agent', () => {
      beforeAll(() => {
        isAgent = true;
        messages = [
          {
            type: 'chat.msg',
            nick: 'agent:123',
            display_name: 'Agent 123',
            msg: 'Sure. Here is the bill:'
          },
          {
            type: 'chat.file',
            file: {
              type: 'application/pdf',
              name: 'invoice.pdf',
              size: 16,
              url: 'path://to/file'
            }
          }
        ];
      });

      it('maps over the messages and returns the appropriate components', () => {
        const message1 = result[0].props.children.props.children;
        const message2 = result[1].props.children.props.children;

        expect(TestUtils.isElementOfType(message1, MessageBubble)).toEqual(true);
        expect(TestUtils.isElementOfType(message2, Attachment)).toEqual(true);
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

        expect(wrapperClasses).toContain('wrapper');
        expect(wrapperClasses).toContain('fadeUp');
      });
    });

    describe('when the message is old', () => {
      beforeEach(() => {
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

        renderChatMessages = getComponentMethod('renderChatMessages', {
          ...args,
          chatLogCreatedAt: fakeTimestamp + 1
        });
        result = renderChatMessages(isAgent, showAvatar, messages);
      });

      it('render the wrapper with correct classnames', () => {
        const wrapperClasses = result[0].props.className;

        expect(wrapperClasses).toContain('wrapper');
        expect(wrapperClasses).not.toContain('fadeUp');
      });
    });
  });

  describe('#renderMessage', () => {
    let renderMessage,
      isAgent,
      result,
      chat,
      showAvatar,
      handleSendMsgSpy,
      exampleMsg = 'Hmm why did I forget the actual plan for implementing ChatGroup?';

    beforeEach(() => {
      handleSendMsgSpy = jasmine.createSpy('handleSendMsg');
      renderMessage = getComponentMethod('renderMessage', { handleSendMsg: handleSendMsgSpy });
      result = renderMessage(isAgent, chat, showAvatar);
    });

    describe('when chat status is not CHAT_MESSAGE_FAILURE', () => {
      beforeAll(() => {
        chat = {
          msg: exampleMsg,
          display_name: 'bob',
          options: ['yes', 'no'],
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
          numFailedTries: 0,
          timestamp: 123
        };
      });

      it('renders a MessageBubble component', () => {
        expect(TestUtils.isElementOfType(result, MessageBubble))
          .toEqual(true);
      });

      describe('when showAvatar is false', () => {
        beforeAll(() => {
          showAvatar = false;
        });

        it('renders MessageBubble with the messageBubble class', () => {
          expect(result.props.className).not.toContain('messageBubble');
        });
      });

      describe('when showAvatar is true', () => {
        beforeAll(() => {
          showAvatar = true;
        });

        it('renders MessageBubble with the messageBubble class', () => {
          expect(result.props.className).toContain('messageBubble');
        });
      });

      describe('when isAgent is true', () => {
        beforeAll(() => {
          isAgent = true;
        });

        it('renders MessageBubble with the agentBackground class', () => {
          expect(result.props.className).toContain('agentBackground');
        });

        it('renders MessageBubble not with the userBackground class', () => {
          expect(result.props.className).not.toContain('userBackground');
        });
      });

      describe('when isAgent is false', () => {
        beforeAll(() => {
          isAgent = false;
        });

        it('renders MessageBubble not with the agentBackground class', () => {
          expect(result.props.className).not.toContain('agentBackground');
        });

        it('renders MessageBubble with the userBackground class', () => {
          expect(result.props.className).toContain('userBackground');
        });
      });

      it('passes the correct message prop', () => {
        expect(result.props.message)
          .toEqual(exampleMsg);
      });

      it('passes the correct options prop', () => {
        expect(result.props.options)
          .toEqual(['yes', 'no']);
      });

      it('passes the correct handleSendMsg prop', () => {
        expect(result.props.handleSendMsg)
          .toEqual(handleSendMsgSpy);
      });
    });

    describe('when chat status is CHAT_MESSAGE_FAILURE', () => {
      let messageErrorComponent;

      beforeAll(() => {
        chat = {
          msg: exampleMsg,
          display_name: 'bob',
          options: ['yes', 'no'],
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
          numFailedTries: 1,
          timestamp: 123
        };
      });

      beforeEach(() => {
        messageErrorComponent = result.props.children[1].props.children;
      });

      it('renders MessageBubble as first child', () => {
        expect(TestUtils.isElementOfType(result.props.children[0], MessageBubble))
          .toEqual(true);
      });

      it('renders MessageError component', () => {
        expect(TestUtils.isElementOfType(messageErrorComponent, MessageError))
          .toEqual(true);
      });

      describe('when numFailedTries is 1', () => {
        it('renders first attempt error message', () => {
          expect(messageErrorComponent.props.errorMessage)
            .toEqual('embeddable_framework.chat.messagefailed.resend');
        });

        it('renders handleError function prop that does call handleSendMsg prop', () => {
          messageErrorComponent.props.handleError();

          expect(handleSendMsgSpy)
            .toHaveBeenCalledWith(exampleMsg, 123);
        });
      });

      describe('when numFailedTries is more than 1', () => {
        beforeAll(() => {
          chat = {
            msg: exampleMsg,
            display_name: 'bob',
            options: ['yes', 'no'],
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
            numFailedTries: 2
          };
        });

        beforeEach(() => {
          handleSendMsgSpy.calls.reset();
        });

        it('renders second attempt error message', () => {
          expect(messageErrorComponent.props.errorMessage)
            .toEqual('embeddable_framework.chat.messagefailed.failed_twice');
        });

        it('does not pass handleError function prop', () => {
          expect(messageErrorComponent.props.handleError)
            .toBeFalsy();
        });
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

    describe('when showAvatarAsAgent is false', () => {
      const showAvatarAsAgent = false;

      it('returns nothing', () => {
        const result = renderAvatar(showAvatarAsAgent, avatarPath, messages);

        expect(result).toEqual(null);
      });
    });

    describe('when showAvatarAsAgent is true', () => {
      let result;
      const showAvatarAsAgent = true;

      describe('and provided with a path to an avatar', () => {
        beforeEach(() => {
          result = renderAvatar(showAvatarAsAgent, avatarPath, messages);
        });

        it('returns an Avatar component', () => {
          expect(TestUtils.isElementOfType(result, Avatar)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props.className).toContain('avatarWithSrc');
          expect(result.props.src).toEqual(avatarPath);
        });
      });

      describe('and not provided with a path to an avatar', () => {
        beforeEach(() => {
          result = renderAvatar(showAvatarAsAgent, undefined, messages);
        });

        it('returns an Avatar component', () => {
          expect(TestUtils.isElementOfType(result, Avatar)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props.className).toContain('avatarDefault');
          expect(result.props.src).toEqual('');
        });

        it('passes the correct fallback icon prop to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            fallbackIcon: 'Icon--agent-avatar'
          }));
        });
      });

      describe('and avatar belongs to a new chat group', () => {
        beforeEach(() => {
          result = renderAvatar(showAvatarAsAgent, avatarPath, messages);
        });

        it('passes the correct classnames to the child component', () => {
          expect(result.props.className).toContain('avatarWithSrc');
          expect(result.props.className).toContain('fadeIn');
        });
      });

      describe('and avatar belongs to an old chat group', () => {
        beforeEach(() => {
          renderAvatar = getComponentMethod('renderAvatar', {
            chatLogCreatedAt: fakeTimestamp + 1
          });
          result = renderAvatar(showAvatarAsAgent, avatarPath, messages);
        });

        it('passes the correct classnames to the child component', () => {
          expect(result.props.className).toContain('avatarWithSrc');
          expect(result.props.className).not.toContain('fadeIn');
        });
      });
    });
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
      expect(component.renderAvatar).toHaveBeenCalledWith(showAvatar && isAgent, avatarPath, messages);
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
