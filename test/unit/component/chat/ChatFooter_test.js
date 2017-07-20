describe('ChatFooter component', () => {
  let ChatFooter;
  const chatFooterPath = buildSrcPath('component/chat/ChatFooter');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatFooter.sass': {
        locals: {}
      },
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    mockery.registerAllowable(chatFooterPath);
    ChatFooter = requireUncached(chatFooterPath).ChatFooter;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('menuIconClick', () => {
    let component, stopPropagationSpy, showMenuSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy();
      showMenuSpy = jasmine.createSpy();

      component = domRender(<ChatFooter showMenu={showMenuSpy} />);
      component.menuIconClick({ stopPropagation: stopPropagationSpy });
    });

    it('should stop call stopPropagation on the event', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('should stop call props.showMenu', () => {
      expect(showMenuSpy)
        .toHaveBeenCalled();
    });
  });
});
