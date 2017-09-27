describe('ChatFooter component', () => {
  let ChatFooter;
  const chatFooterPath = buildSrcPath('component/chat/ChatFooter');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatFooter.sass': {
        locals: {
          icons: 'icons'
        }
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

  describe('render', () => {
    let componentNode;

    beforeEach(() => {
      const component = domRender(<ChatFooter />);

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('renders the chat footer with styled icons', () => {
      expect(componentNode.querySelector('.icons'))
        .toBeTruthy();
    });
  });

  describe('menuIconClick', () => {
    let component, stopPropagationSpy, toggleMenuSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy();
      toggleMenuSpy = jasmine.createSpy();

      component = domRender(<ChatFooter toggleMenu={toggleMenuSpy} />);
      component.menuIconClick({ stopPropagation: stopPropagationSpy });
    });

    it('should stop call stopPropagation on the event', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('should stop call props.toggleMenu', () => {
      expect(toggleMenuSpy)
        .toHaveBeenCalled();
    });
  });
});
