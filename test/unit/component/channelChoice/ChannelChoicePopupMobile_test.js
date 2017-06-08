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
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render() {
            const { className, labelClassName } = this.props;

            return <div className={`${className} ${labelClassName}`} />;
          }
        }
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

    describe('body', () => {
      it('has an inner container class', () => {
        expect(channelChoicePopupComponent.querySelector('.inner'))
          .not.toBeNull();
      });

      describe('channel choice option items', () => {
        let options;

        beforeEach(() => {
          options = channelChoicePopupComponent.querySelectorAll('.innerItem');
        });

        it('has an innerItem class for each channel choice item', () => {
          expect(options.length)
            .toBe(2);
        });

        it('has an innerItemLabel class for each channel choice item', () => {
          expect(options[0].className)
            .toContain('innerItemLabel');

          expect(options[1].className)
            .toContain('innerItemLabel');
        });
      });
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
    });
  });
});
