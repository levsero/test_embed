describe('ChannelChoicePopupMobile component', () => {
  let ChannelChoicePopupMobile,
    channelChoicePopupMobile,
    channelChoicePopupComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoicePopupMobile');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      './ChannelChoicePopupMobile.sass': {
        locals: {
          inner: 'inner',
          innerItem: 'innerItem',
          innerItemLabel: 'innerItemLabel',
          buttonContainer: 'buttonContainer',
          cancelButton: 'cancelButton'
        }
      },
      './ChannelChoice.sass': {
        locals: {}
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            return <div className={this.props.className} />;
          }
        }
      },
      'component/button/ButtonGroup': {
        ButtonGroup: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/channelChoice/ChannelChoiceMenu': {
        ChannelChoiceMenu: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      }
    });

    ChannelChoicePopupMobile = requireUncached(channelChoicePath).ChannelChoicePopupMobile;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    beforeEach(() => {
      channelChoicePopupMobile = domRender(
        <ChannelChoicePopupMobile
          onNextClick={noop}
          onCancelClick={noop} />
      );
      channelChoicePopupComponent = ReactDOM.findDOMNode(channelChoicePopupMobile);
    });

    describe('cancel button', () => {
      it('parent div has a buttonContainer class', () => {
        expect(channelChoicePopupComponent.querySelector('.buttonContainer'))
          .not.toBeNull();
      });

      it('has a cancelButton class', () => {
        expect(channelChoicePopupComponent.querySelector('.cancelButton'))
          .not.toBeNull();
      });

      describe('when showCancelButton prop is false', () => {
        beforeEach(() => {
          channelChoicePopupMobile = domRender(
            <ChannelChoicePopupMobile
              showCancelButton={false}
              onNextClick={noop}
              onCancelClick={noop} />
          );
        });

        it('should not have cancelButton class', () => {
          expect(channelChoicePopupComponent.querySelector('.cancelButton'))
            .toBeNull();
        });
      });
    });
  });

  describe('handleContainerClick', () => {
    let stopPropagationSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy('stopPropagation');
      channelChoicePopupMobile = instanceRender(
        <ChannelChoicePopupMobile
          chatOnline={false}
          onCancelClick={noop}
          handleNextClick={noop} />
      );
      channelChoicePopupMobile.handleContainerClick({ stopPropagation: stopPropagationSpy });
    });

    it('calls e.stopPropagation', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });
  });
});
