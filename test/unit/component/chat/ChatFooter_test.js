describe('ChatFooter component', () => {
  let ChatFooter;
  const chatFooterPath = buildSrcPath('component/chat/ChatFooter');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatFooter.sass': {
        locals: {
          icons: 'iconsClasses'
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
      const component = domRender(<ChatFooter showIcons={true} />);

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('renders the chat footer with styled icons', () => {
      expect(componentNode.querySelector('.iconsClasses'))
        .toBeTruthy();
    });
  });

  describe('renderIcons', () => {
    let component;

    describe('when props.showIcons is false', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter showIcons={false} />);
      });

      it('returns null', () => {
        expect(component.renderIcons())
          .toBeNull();
      });
    });

    describe('when props.showIcons is true', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter showIcons={true} />);
      });

      it('returns a component', () => {
        expect(component.renderIcons())
          .toBeTruthy();
      });
    });
  });

  describe('menuIconClick', () => {
    let component, stopPropagationSpy, toggleMenuSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy();
      toggleMenuSpy = jasmine.createSpy();

      component = domRender(<ChatFooter showIcons={true} toggleMenu={toggleMenuSpy} />);
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
