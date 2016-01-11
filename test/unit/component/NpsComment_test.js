describe('NpsComment component', () => {
  let NpsComment,
    mockRegistry,
    npsCommentProps;

  const npsPath = buildSrcPath('component/NpsComment');

  beforeEach(() => {
    npsCommentProps = {
      commentsQuestion: '',
      comment: '',
      hasError: false,
      feedBackPlaceholder:'',
      onChange: noop,
      onSubmit: noop,
      highlightColor: '',
      hidden: false,
      isSubmittingComment: false
    };

    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/FormField': {
        'Field': noopReactComponent()
      },
      'component/Button': {
        'Button': React.createClass({
          render: () => {
            return (
              <div className='Button'></div>
            );
          }
        }),
        'ButtonSecondary': React.createClass({
          render: () => {
            return (
              <div className='ButtonSecondary'></div>
            );
          }
        })
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      },
      'component/Loading': {
        'LoadingSpinner': React.createClass({
          render: () => {
            return (
              <div {...this.props}></div>
            );
          }
        })
      },
      'utility/utils': {
        'generateConstrastColor': jasmine.createSpy()
      }
    });

    NpsComment = requireUncached(npsPath).NpsComment;

    React.render(
        <NpsComment {...npsCommentProps} />,
        global.document.body
      );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('isSubmittingComment', () => {
    describe('is true', () => {
      beforeEach(() => {
        npsCommentProps.isSubmittingComment = true;

        React.render(
          <NpsComment {...npsCommentProps} />,
          global.document.body
        );
      });

      it('should render a secondary button', () => {
        expect(document.querySelectorAll('.ButtonSecondary').length)
          .toEqual(1);
      });
    });

    describe('is false', () => {
      it('should render a button', () => {
        expect(document.querySelectorAll('.Button').length)
          .toEqual(1);
      });
    });
  });

  describe('i18n', () => {
    it('should use the .sendFeedback label and with a fallback of "Send Feedback"', () => {
      expect(mockRegistry['service/i18n'].i18n.t)
        .toHaveBeenCalledWith(
          'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
          { fallback: 'Send Feedback'}
        );
    });
  });
});
