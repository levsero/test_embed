describe('ChatGroup component', () => {
  let ChatGroup,
    ICONS,
    FILETYPE_ICONS;

  const chatGroupPath = buildSrcPath('component/chat/ChatGroup');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  const Avatar = noopReactComponent();
  const MessageBubble = noopReactComponent();
  const ImageMessage = noopReactComponent();
  const Attachment = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    ICONS = requireUncached(sharedConstantsPath).ICONS;
    FILETYPE_ICONS = requireUncached(sharedConstantsPath).FILETYPE_ICONS;

    initMockRegistry({
      'types/chat': {
        chatMessage: 'chatMessage'
      },
      'component/Avatar': { Avatar },
      'component/shared/MessageBubble': { MessageBubble },
      'component/chat/ImageMessage': { ImageMessage },
      'component/attachment/Attachment': { Attachment },
      'constants/shared': {
        ICONS,
        FILETYPE_ICONS
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
          nameNoAvatar: 'nameNoAvatar'
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

  const getComponentMethod = (methodName) => {
    const component = domRender(<ChatGroup />);

    return component[methodName];
  };

  const avatarPath = 'path://to/avatar';

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
            msg: 'Hello'
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
          });
        });

        describe('when showAvatar is true', () => {
          beforeAll(() => {
            showAvatar = true;
          });

          it('renders with the correct styles', () => {
            expect(result.props.className).toContain('nameAvatar');
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
      result;

    beforeEach(() => {
      renderChatMessages = getComponentMethod('renderChatMessages');
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
              size: 1024
            },
            attachment: 'path://to/file',
            uploading: false
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
            attachment: {
              mime_type: 'application/pdf',
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

      describe('when showAvatar is false', () => {
        beforeAll(() => {
          showAvatar = false;
        });

        it('renders MessageBubble with the messageBubble class', () => {
          const messageBubble = result[0].props.children.props.children;

          expect(messageBubble.props.className).not.toContain('messageBubble');
        });
      });

      describe('when showAvatar is true', () => {
        beforeAll(() => {
          showAvatar = true;
        });

        it('renders MessageBubble with the messageBubble class', () => {
          const messageBubble = result[0].props.children.props.children;

          expect(messageBubble.props.className).toContain('messageBubble');
        });
      });
    });

    describe('when there are options', () => {
      beforeAll(() => {
        messages = [
          {
            msg: 'Hmm why did I forget the actual plan for implementing ChatGroup?',
            display_name: 'bob',
            options: ['yes', 'no']
          }
        ];
        isAgent = true;
      });

      it('passes options related props into MessageBubble', () => {
        result.forEach(messageItem => {
          const messageBubbleItem = messageItem.props.children.props.children;

          expect(TestUtils.isElementOfType(messageBubbleItem, MessageBubble)).toEqual(true);
          expect(messageBubbleItem.props.options).toEqual(['yes', 'no']);
          expect(messageBubbleItem.props.sendMsgFn).toEqual(jasmine.any(Function));
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
            attachment: {
              mime_type: 'application/pdf',
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
            file: chat.attachment,
            isDownloadable: true
          }));
        });
      });

      describe('when the attachment filetype is an image', () => {
        beforeAll(() => {
          chat = {
            type: 'chat.file',
            attachment: {
              mime_type: 'image/jpeg',
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
          expect(result.props.imgSrc).toEqual(chat.attachment.url);
        });

        it('renders the component without a placeholder element', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            placeholderEl: false
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
              mime_type: 'application/pdf',
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
            isDownloadable: false
          }));
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
                size: 1024
              },
              uploading: true
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
                size: 1024
              },
              attachment: 'path://to/file',
              uploading: false
            };
          });

          it('returns an ImageMessage component', () => {
            expect(TestUtils.isElementOfType(result, ImageMessage)).toEqual(true);
          });

          it('passes the correct imgSrc prop to the component', () => {
            expect(result.props.imgSrc).toEqual(chat.attachment);
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
            size: 128
          },
          uploading: true
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
            size: 64
          },
          uploading: true
        };
      });

      it('passes the default preview icon to Attachment', () => {
        expect(result.props.icon).toEqual('Icon--preview-default');
      });
    });
  });

  describe('#renderAvatar', () => {
    let renderAvatar;

    beforeEach(() => {
      renderAvatar = getComponentMethod('renderAvatar');
    });

    describe('when showAvatarAsAgent is false', () => {
      const showAvatarAsAgent = false;

      it('returns nothing', () => {
        const result = renderAvatar(showAvatarAsAgent, avatarPath);

        expect(result).toEqual(null);
      });
    });

    describe('when showAvatarAsAgent is true', () => {
      let result;
      const showAvatarAsAgent = true;

      describe('and provided with a path to an avatar', () => {
        beforeEach(() => {
          result = renderAvatar(showAvatarAsAgent, avatarPath);
        });

        it('returns an Avatar component', () => {
          expect(TestUtils.isElementOfType(result, Avatar)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            className: 'avatarWithSrc',
            src: avatarPath
          }));
        });
      });

      describe('and not provided with a path to an avatar', () => {
        beforeEach(() => {
          result = renderAvatar(showAvatarAsAgent);
        });

        it('returns an Avatar component', () => {
          expect(TestUtils.isElementOfType(result, Avatar)).toEqual(true);
        });

        it('passes the correct props to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            className: 'avatarDefault',
            src: ''
          }));
        });

        it('passes the correct fallback icon prop to the child component', () => {
          expect(result.props).toEqual(jasmine.objectContaining({
            fallbackIcon: 'Icon--agent-avatar'
          }));
        });
      });
    });
  });

  describe('#render', () => {
    let component;
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
      component = domRender(<ChatGroup isAgent={isAgent} showAvatar={showAvatar} messages={messages} avatarPath={avatarPath} />);

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
      expect(component.renderAvatar).toHaveBeenCalledWith(showAvatar && isAgent, avatarPath);
    });
  });
});
