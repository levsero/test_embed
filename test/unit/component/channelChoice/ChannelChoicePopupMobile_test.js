describe('ChannelChoicePopupMobile component', () => {
  let ChannelChoicePopupMobile,
    channelChoicePopupMobile;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoicePopupMobile');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChannelChoicePopupMobile.scss': {
        locals: {
          inner: 'inner',
          innerItem: 'innerItem',
          innerItemLabel: 'innerItemLabel',
          buttonContainer: 'buttonContainer',
          cancelButton: 'cancelButton'
        }
      },
      './ChannelChoice.scss': {
        locals: {}
      },
      'component/channelChoice/ChannelChoiceMenu': {
        ChannelChoiceMenu: noopReactComponent()
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
