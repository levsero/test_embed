describe('RatingScreen component', () => {
  let RatingScreen;

  const chatPath = buildSrcPath('component/chat/rating/RatingScreen');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const sendChatRatingSpy = jasmine.createSpy('sendChatRating');
  const sendChatCommentSpy = jasmine.createSpy('sendChatComment');
  const endChatSpy = jasmine.createSpy('endChat');

  const FeedbackForm = noopReactComponent('FeedbackForm');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './RatingScreen.scss': {
        locals: {
          scrollContainerContent: 'scrollContainerContentClasses',
          logoFooter: 'logoFooterClasses'
        }
      },
      'component/chat/rating/FeedbackForm': {
        FeedbackForm
      },
      'component/chat/ChatHeader': {
        ChatHeader: noopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        updateChatScreen: updateChatScreenSpy,
        sendChatRating: sendChatRatingSpy,
        sendChatComment: sendChatCommentSpy,
        endChat: endChatSpy,
      },
      'src/redux/modules/chat/chat-selectors': {
        getPostchatFormSettings: noop
      },
      'src/redux/modules/selectors': {

      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'CHATTING_SCREEN'
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      }
    });

    mockery.registerAllowable(chatPath);
    RatingScreen = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component, endChatFromFeedbackForm = false;
    const defaultRating = {
      value: 'default_rating',
      comment: null
    };

    beforeEach(() => {
      component = instanceRender(
        <RatingScreen
          endChatFromFeedbackForm={endChatFromFeedbackForm}
          rating={defaultRating}
          updateChatScreen={updateChatScreenSpy}
          endChat={endChatSpy}
          sendChatRating={sendChatRatingSpy}
          sendChatComment={sendChatCommentSpy}
          isMobile={true}
          fullscreen={true}
        />
      );
    });

    afterEach(() => {
      updateChatScreenSpy.calls.reset();
      sendChatRatingSpy.calls.reset();
      sendChatCommentSpy.calls.reset();
      endChatSpy.calls.reset();
    });

    it('returns a component with the FeedbackForm component as the first child', () => {
      const firstChild = component.render().props.children[0].props.children;

      expect(TestUtils.isElementOfType(firstChild, FeedbackForm)).toEqual(true);
    });

    describe('the scroll container wrapper', () => {
      it('has its containerClasses prop to the scrollContainerContent style', () => {
        expect(component.render().props.children[0].props.containerClasses)
          .toEqual('scrollContainerContentClasses');
      });

      it('has its fullscreen prop to the ScrollContainer style', () => {
        expect(component.render().props.children[0].props.fullscreen)
          .toEqual(true);
      });

      it('has its isMobile prop to the ScrollContainer style', () => {
        expect(component.render().props.children[0].props.isMobile)
          .toEqual(true);
      });
    });

    describe('the sendClickFn passed as a prop to the FeedbackForm', () => {
      beforeEach(() => {
        component.skipClick();
      });

      it('sends the chat rating if it has changed', () => {
        const newRating = { value: 'updated_rating' };

        component.sendClick(newRating);
        expect(sendChatRatingSpy).toHaveBeenCalledWith(newRating);
      });

      it('does not send the chat rating if it is the same', () => {
        component.sendClick(defaultRating.value);
        expect(sendChatRatingSpy).not.toHaveBeenCalled();
      });

      it('sends the comment if one is submitted', () => {
        const chatReviewComment = 'you are nice';

        component.sendClick(defaultRating.value, chatReviewComment);
        expect(sendChatCommentSpy).toHaveBeenCalledWith(chatReviewComment);
      });

      it('does not send the comment if it is not specified', () => {
        component.sendClick(defaultRating.value, null);
        expect(sendChatCommentSpy).not.toHaveBeenCalled();
      });

      it('redirects to the chatting screen', () => {
        component.sendClick(defaultRating.value);
        expect(updateChatScreenSpy).toHaveBeenCalledWith('CHATTING_SCREEN');
      });

      describe('when the components props has endChatFromFeedbackForm set to false', () => {
        beforeAll(() => {
          endChatFromFeedbackForm = false;
        });

        it('does not end the chat', () => {
          component.sendClick(defaultRating.value);
          expect(endChatSpy).not.toHaveBeenCalled();
        });
      });

      describe('when the components props has endChatFromFeedbackForm set to true', () => {
        beforeAll(() => {
          endChatFromFeedbackForm = true;
        });

        it('ends the chat', () => {
          component.sendClick(defaultRating.value);
          expect(endChatSpy).toHaveBeenCalled();
        });
      });
    });

    describe('the skipClickFn passed as a prop to the FeedbackForm', () => {
      beforeEach(() => {
        component.skipClick();
      });

      it('redirects to the chatting screen', () => {
        expect(updateChatScreenSpy).toHaveBeenCalledWith('CHATTING_SCREEN');
      });

      describe('when the components props has endChatFromFeedbackForm set to false', () => {
        beforeAll(() => {
          endChatFromFeedbackForm = false;
        });

        beforeEach(() => {
          component.skipClick();
        });

        it('does not end the chat', () => {
          expect(endChatSpy).not.toHaveBeenCalled();
        });
      });

      describe('when the components props has endChatFromFeedbackForm set to true', () => {
        beforeAll(() => {
          endChatFromFeedbackForm = true;
        });

        beforeEach(() => {
          component.skipClick();
        });

        it('ends the chat', () => {
          expect(endChatSpy).toHaveBeenCalled();
        });
      });
    });

    describe('hideZendeskLogo', () => {
      let result;

      describe('when hideZendeskLogo is false', () => {
        beforeEach(() => {
          component = instanceRender(
            <RatingScreen
              rating={defaultRating}
              updateChatScreen={updateChatScreenSpy}
              endChat={endChatSpy}
              sendChatRating={sendChatRatingSpy}
              sendChatComment={sendChatCommentSpy}
              hideZendeskLogo={false}
            />
          );
          result = component.render();
        });

        it('renders logo in footer', () => {
          expect(TestUtils.isElementOfType(result.props.children[1], ZendeskLogo))
            .toBeTruthy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.children[0].props.footerClasses)
            .toContain('logoFooterClasses');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeEach(() => {
          component = instanceRender(
            <RatingScreen
              rating={defaultRating}
              updateChatScreen={updateChatScreenSpy}
              endChat={endChatSpy}
              sendChatRating={sendChatRatingSpy}
              sendChatComment={sendChatCommentSpy}
              hideZendeskLogo={true}
            />
          );
          result = component.render();
        });

        it('does not render logo in footer', () => {
          expect(result.props.children[1])
            .toBeFalsy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.children[0].props.footerClasses)
            .not.toContain('logoFooterClasses');
        });
      });
    });
  });
});
