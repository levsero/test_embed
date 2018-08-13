describe('ChannelChoiceMenu component', () => {
  let ChannelChoiceMenu;

  const channelChoiceMenuPath = buildSrcPath('component/channelChoice/ChannelChoiceMenu');

  const ButtonIcon = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChannelChoiceMenu.scss': {
        locals: {
          btn: 'btnClass',
          btnEnabled: 'btnEnabledClass',
          chatBtnDisabled: 'chatBtnDisabledClass',
          iconTalk: 'iconTalkClass',
          newIcon: 'newIconClass',
          newIconDisabled: 'newIconDisabledClass',
          talkBtnDisabled: 'talkBtnDisabledClass'
        }
      },
      'component/button/ButtonIcon': { ButtonIcon },
      'service/i18n': {
        i18n: { t: _.identity }
      }
    });

    ChannelChoiceMenu = requireUncached(channelChoiceMenuPath).ChannelChoiceMenu;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu />);

      spyOn(component, 'renderTalkButton');
      spyOn(component, 'renderChatButton');
      spyOn(component, 'renderSubmitTicketButton');

      component.render();
    });

    it('calls renderTalkButton', () => {
      expect(component.renderTalkButton)
        .toHaveBeenCalled();
    });

    it('calls renderChatButton', () => {
      expect(component.renderChatButton)
        .toHaveBeenCalled();
    });

    it('calls renderSubmitTicketButton', () => {
      expect(component.renderSubmitTicketButton)
        .toHaveBeenCalled();
    });
  });

  describe('renderTalkLabel', () => {
    let result,
      component,
      componentProps;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu {...componentProps} />);

      result = component.renderTalkLabel();
    });

    describe('when talkAvailable is true', () => {
      describe('when callbackEnabled is true', () => {
        beforeAll(() => {
          componentProps = {
            talkAvailable: true,
            callbackEnabled: true
          };
        });

        it('returns the expected string', () => {
          expect(result)
            .toEqual('embeddable_framework.channelChoice.button.label.request_callback');
        });
      });

      describe('when callbackEnabled is false', () => {
        beforeAll(() => {
          componentProps = {
            talkAvailable: true,
            callbackEnabled: false
          };
        });

        it('returns the expected string', () => {
          expect(result)
            .toEqual('embeddable_framework.channelChoice.button.label.call_us');
        });
      });
    });

    describe('when talkAvailable is false', () => {
      beforeAll(() => {
        componentProps = {
          talkAvailable: false
        };
      });

      it('returns a span element with two children', () => {
        expect(result.type)
          .toEqual('span');

        expect(result.props.children.length)
          .toEqual(2);
      });
    });
  });

  describe('renderTalkButton', () => {
    let result,
      children,
      component,
      componentProps,
      mockShowInitialTalkOption;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu {...componentProps} />);
      component.showInitialTalkOption = mockShowInitialTalkOption;

      spyOn(component, 'handleNextClick');
      spyOn(component, 'renderTalkLabel');

      result = component.renderTalkButton();
    });

    describe('when showInitialTalkOption is true', () => {
      beforeEach(() => {
        children = result.props.children;
      });

      beforeAll(() => {
        mockShowInitialTalkOption = true;
      });

      it('passes icon type to props.icon', () => {
        expect(children.props.icon)
          .toContain('Icon--new-channelChoice-talk');
      });

      describe('when called', () => {
        beforeAll(() => {
          componentProps = {
            talkAvailable: true,
            labelClasses: 'talkLabelClass'
          };
        });

        it('returns a list item', () => {
          expect(TestUtils.isElementOfType(result, 'li'))
            .toEqual(true);
        });

        it('returns a child ButtonIcon component', () => {
          expect(TestUtils.isElementOfType(children, ButtonIcon))
            .toEqual(true);
        });

        it('calls handleNextClick with \'talk\'', () => {
          expect(component.handleNextClick)
            .toHaveBeenCalledWith('talk');
        });

        it('calls renderTalkLabel', () => {
          expect(component.renderTalkLabel)
            .toHaveBeenCalled();
        });

        it('passes talkAvailable to props.actionable', () => {
          expect(children.props.actionable)
            .toEqual(componentProps.talkAvailable);
        });

        it('passes labelClasses to props.labelClassName', () => {
          expect(children.props.labelClassName)
            .toEqual(componentProps.labelClasses);
        });
      });

      describe('props.className', () => {
        describe('when talkAvailable is true', () => {
          beforeAll(() => {
            componentProps = {
              talkAvailable: true
            };
          });

          it('has btn class', () => {
            expect(children.props.className)
              .toContain('btnClass');
          });

          it('has btnEnabled class', () => {
            expect(children.props.className)
              .toContain('btnEnabledClass');
          });
        });

        describe('when talkAvailable is false', () => {
          beforeAll(() => {
            componentProps = {
              talkAvailable: false
            };
          });

          it('has btn class', () => {
            expect(children.props.className)
              .toContain('btnClass');
          });

          it('does not have btnEnabled class', () => {
            expect(children.props.className)
              .not.toContain('btnEnabledClass');
          });
        });
      });

      describe('props.iconClasses', () => {
        describe('when talkAvailable is true', () => {
          beforeAll(() => {
            componentProps = {
              talkAvailable: true
            };
          });

          it('has newIcon class', () => {
            expect(children.props.iconClasses)
              .toContain('newIconClass');
          });

          it('does not have newIconDisabled class', () => {
            expect(children.props.iconClasses)
              .not.toContain('newIconDisabledClass');
          });
        });

        describe('when talkAvailable is false', () => {
          beforeAll(() => {
            componentProps = {
              talkAvailable: false
            };
          });

          it('does not have newIcon class', () => {
            expect(children.props.iconClasses)
              .not.toContain('newIconClass');
          });

          it('has newIconDisabled class', () => {
            expect(children.props.iconClasses)
              .toContain('newIconDisabledClass');
          });
        });
      });
    });

    describe('when showInitialTalkOption is false', () => {
      beforeAll(() => {
        mockShowInitialTalkOption = false;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderChatLabel', () => {
    let result,
      component,
      componentProps;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu {...componentProps} />);

      result = component.renderChatLabel();
    });

    describe('when chatAvailable is true', () => {
      beforeAll(() => {
        componentProps = {
          chatAvailable: true
        };
      });

      it('returns the expected string', () => {
        expect(result)
          .toEqual('embeddable_framework.common.button.chat');
      });
    });

    describe('when chatAvailable is false', () => {
      beforeAll(() => {
        componentProps = {
          chatAvailable: false
        };
      });

      it('returns a span element with two children', () => {
        expect(result.type)
          .toEqual('span');

        expect(result.props.children.length)
          .toEqual(2);
      });
    });
  });

  describe('renderChatButton', () => {
    let result,
      children,
      component,
      componentProps,
      mockShowInitialChatOption;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu {...componentProps} />);
      component.showInitialChatOption = mockShowInitialChatOption;

      spyOn(component, 'handleChatClick');
      spyOn(component, 'renderChatLabel');

      result = component.renderChatButton();
    });

    describe('when showInitialChatOption is true', () => {
      beforeEach(() => {
        children = result.props.children;
      });

      beforeAll(() => {
        mockShowInitialChatOption = true;
      });

      it('passes icon type to props.icon', () => {
        expect(children.props.icon)
          .toContain('Icon--new-channelChoice-chat');
      });

      describe('when called', () => {
        beforeAll(() => {
          componentProps = {
            chatAvailable: true,
            labelClasses: 'talkLabelClass'
          };
        });

        it('returns a list item', () => {
          expect(TestUtils.isElementOfType(result, 'li'))
            .toEqual(true);
        });

        it('returns a child ButtonIcon component', () => {
          expect(TestUtils.isElementOfType(children, ButtonIcon))
            .toEqual(true);
        });

        it('calls handleChatClick', () => {
          expect(component.handleChatClick)
            .toHaveBeenCalled();
        });

        it('calls renderChatLabel', () => {
          expect(component.renderChatLabel)
            .toHaveBeenCalled();
        });

        it('passes chatAvailable to props.actionable', () => {
          expect(children.props.actionable)
            .toEqual(componentProps.chatAvailable);
        });

        it('passes labelClasses to props.labelClassName', () => {
          expect(children.props.labelClassName)
            .toEqual(componentProps.labelClasses);
        });
      });

      describe('props.className', () => {
        describe('when chatAvailable is true', () => {
          beforeAll(() => {
            componentProps = {
              chatAvailable: true
            };
          });

          it('has btn class', () => {
            expect(children.props.className)
              .toContain('btnClass');
          });

          it('has btnEnabled class', () => {
            expect(children.props.className)
              .toContain('btnEnabledClass');
          });
        });

        describe('when chatAvailable is false', () => {
          beforeAll(() => {
            componentProps = {
              chatAvailable: false
            };
          });

          it('has btn class', () => {
            expect(children.props.className)
              .toContain('btnClass');
          });

          it('does not have btnEnabled class', () => {
            expect(children.props.className)
              .not.toContain('btnEnabledClass');
          });
        });

        describe('when chatAvailable is true', () => {
          beforeAll(() => {
            componentProps = { chatAvailable: true };
          });

          it('does not have chatBtnDisabled class', () => {
            expect(children.props.className)
              .not.toContain('chatBtnDisabledClass');
          });
        });

        describe('when chatAvailable is false', () => {
          beforeAll(() => {
            componentProps = { chatAvailable: false };
          });

          it('has chatBtnDisabled class', () => {
            expect(children.props.className)
              .toContain('chatBtnDisabledClass');
          });
        });
      });

      describe('props.iconClasses', () => {
        describe('when chatAvailable is true', () => {
          beforeAll(() => {
            componentProps = {
              chatAvailable: true
            };
          });

          it('has newIcon class', () => {
            expect(children.props.iconClasses)
              .toContain('newIconClass');
          });

          it('does not have newIconDisabled class', () => {
            expect(children.props.iconClasses)
              .not.toContain('newIconDisabledClass');
          });
        });

        describe('when chatAvailable is false', () => {
          beforeAll(() => {
            componentProps = {
              chatAvailable: false
            };
          });

          it('does not have newIcon class', () => {
            expect(children.props.iconClasses)
              .not.toContain('newIconClass');
          });

          it('has newIconDisabled class', () => {
            expect(children.props.iconClasses)
              .toContain('newIconDisabledClass');
          });
        });
      });
    });

    describe('when showInitialChatOption is false', () => {
      beforeAll(() => {
        mockShowInitialChatOption = false;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderSubmitTicketButton', () => {
    let result,
      children,
      component,
      componentProps;

    beforeEach(() => {
      component = instanceRender(<ChannelChoiceMenu {...componentProps} />);

      spyOn(component, 'handleNextClick');

      result = component.renderSubmitTicketButton();
    });

    describe('when submitTicketAvailable is true', () => {
      beforeEach(() => {
        children = result.props.children;
      });

      beforeAll(() => {
        componentProps = {
          submitTicketAvailable: true,
          labelClasses: 'labelClass'
        };
      });

      it('returns a list item', () => {
        expect(TestUtils.isElementOfType(result, 'li'))
          .toEqual(true);
      });

      it('returns a child ButtonIcon component', () => {
        expect(TestUtils.isElementOfType(children, ButtonIcon))
          .toEqual(true);
      });

      it('calls handleNextClick', () => {
        expect(component.handleNextClick)
          .toHaveBeenCalledWith('ticketSubmissionForm');
      });

      it('passes the expected string to props.label', () => {
        expect(children.props.label)
          .toEqual('embeddable_framework.channelChoice.button.label.submitTicket');
      });

      it('passes labelClasses to props.labelClassName', () => {
        expect(children.props.labelClassName)
          .toEqual(componentProps.labelClasses);
      });

      it('passes the expected string to props.icon', () => {
        expect(children.props.icon)
          .toEqual('Icon--new-channelChoice-contactForm');
      });
    });

    describe('when submitTicketAvailable is false', () => {
      beforeAll(() => {
        componentProps = {
          submitTicketAvailable: false
        };
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('props.iconClasses', () => {
      it('has newIcon class', () => {
        expect(children.props.iconClasses)
          .toContain('newIconClass');
      });
    });
  });

  describe('handleChatClick', () => {
    let component;

    describe('when chatAvailable is true', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatAvailable={true} />
        );
        spyOn(component, 'handleNextClick');

        component.handleChatClick();
      });

      it('calls handleNextClick with `chat`', () => {
        expect(component.handleNextClick)
          .toHaveBeenCalledWith('chat');
      });
    });

    describe('when chatAvailable is false', () => {
      let handler,
        stopPropagationSpy;

      beforeEach(() => {
        component = instanceRender(
          <ChannelChoiceMenu
            chatAvailable={false} />
        );
        stopPropagationSpy = jasmine.createSpy('stopPropagation');
        spyOn(component, 'handleNextClick');

        handler = component.handleChatClick();
      });

      it('does not call handleNextClick', () => {
        expect(component.handleNextClick)
          .not.toHaveBeenCalled();
      });

      it('returns an anonymous function that calls e.stopPropagation', () => {
        const mockEvent = { stopPropagation: stopPropagationSpy };

        handler(mockEvent);

        expect(stopPropagationSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
