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
    beforeEach(() => {
      channelChoiceMobile = domRender(
        <ChannelChoiceMobile
          handleNextClick={noop}
          handleCancelClick={noop}
          showCloseButton={noop} />
      );
      channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceMobile);
    });

    it('renders the ChannelChoiceMobilePopup component', () => {
      expect(channelChoiceComponent.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeNull();
    });
  });
});
