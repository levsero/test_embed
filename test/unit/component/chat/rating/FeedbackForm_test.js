describe('FeedbackForm component', () => {
  let FeedbackForm,
    mockChatRatings;

  const FeedbackFormPath = buildSrcPath('component/chat/rating/FeedbackForm');

  beforeEach(() => {
    mockery.enable();

    mockChatRatings = {
      GOOD: 'good',
      BAD: 'bad',
      NOT_SET: null
    };

    initMockRegistry({
      './FeedbackForm.scss': {
        locals: {
          button: 'buttonClasses',
          rightButton: 'rightButtonClasses'
        }
      },
      '@zendeskgarden/react-buttons': {
        Button: class extends Component {
          render() {
            return (
              <input disabled={this.props.disabled} className={this.props.className} />
            );
          }
        }
      },
      'component/chat/rating/RatingGroup': {
        RatingGroup: noopReactComponent(),
        ratings: mockChatRatings
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

    mockery.registerAllowable(FeedbackFormPath);
    FeedbackForm = requireUncached(FeedbackFormPath).FeedbackForm;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderActionButtons', () => {
    let rightButton;

    describe('when a rating is not yet chosen', () => {
      beforeEach(() => {
        const component = domRender(<FeedbackForm />);
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
        const component = domRender(<FeedbackForm rating={mockChatRatings.GOOD} />);
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
