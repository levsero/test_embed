describe('ChannelChoiceMobile component', () => {
  let ChannelChoiceMobile,
    channelChoiceMobile,
    channelChoiceComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoiceMobile');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'component/channelChoice/ChannelChoicePopupMobile': {
        ChannelChoicePopupMobile: class extends Component {
          render() {
            return <div className='ChannelChoicePopupMobile' />;
          }
        }
      }
    });

    ChannelChoiceMobile = requireUncached(channelChoicePath).ChannelChoiceMobile;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let showCloseButtonSpy;

    beforeEach(() => {
      showCloseButtonSpy = jasmine.createSpy('showCloseButton');

      channelChoiceMobile = domRender(
        <ChannelChoiceMobile
          handleNextClick={noop}
          handleCancelClick={noop}
          showCloseButton={showCloseButtonSpy} />
      );
      channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceMobile);
    });

    describe('when component is mounted', () => {
      it('should call props.showCloseButton with false', () => {
        expect(showCloseButtonSpy)
          .toHaveBeenCalledWith(false);
      });
    });

    it('renders the ChannelChoiceMobilePopup component', () => {
      expect(channelChoiceComponent.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeNull();
    });
  });
});
