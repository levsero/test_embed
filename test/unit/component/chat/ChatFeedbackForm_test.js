describe('ChatFeedbackForm component', () => {
  let ChatFeedbackForm,
    mockChatRatings;

  const ChatFeedbackFormPath = buildSrcPath('component/chat/ChatFeedbackForm');

  beforeEach(() => {
    mockery.enable();

    mockChatRatings = {
      GOOD: 'good',
      BAD: 'bad',
      NOT_SET: null
    };

    initMockRegistry({
      './ChatFeedbackForm.scss': {
        locals: {
          button: 'buttonClasses',
          rightButton: 'rightButtonClasses'
        }
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            return (
              <input disabled={this.props.disabled} className={this.props.className} />
            );
          }
        }
      },
      'component/chat/ChatRatingGroup': {
        ChatRatingGroup: noopReactComponent(),
        ChatRatings: mockChatRatings
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'service/i18n': {
        i18n: {
          t: _.noop
        }
      }
    });

    mockery.registerAllowable(ChatFeedbackFormPath);
    ChatFeedbackForm = requireUncached(ChatFeedbackFormPath).ChatFeedbackForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderActionButtons', () => {
    let rightButton;

    describe('when a rating is not yet chosen', () => {
      beforeEach(() => {
        const component = domRender(<ChatFeedbackForm />);
        const componentNode = ReactDOM.findDOMNode(component);

        rightButton = componentNode.querySelector('.rightButtonClasses');
      });

      it('disables the right action button', () => {
        expect(rightButton.disabled)
          .toEqual(true);
      });
    });

    describe('when a rating is chosen', () => {
      beforeEach(() => {
        const component = domRender(<ChatFeedbackForm rating={mockChatRatings.GOOD} />);
        const componentNode = ReactDOM.findDOMNode(component);

        rightButton = componentNode.querySelector('.rightButtonClasses');
      });

      it('enables the right action button', () => {
        expect(rightButton.disabled)
          .toEqual(false);
      });
    });
  });
});
