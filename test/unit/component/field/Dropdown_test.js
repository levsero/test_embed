describe('dropdown component', () => {
  let Dropdown,
    options = [
      {
        title: 'one',
        value: 1
      },
      {
        title: 'two',
        value: 2
      },
      {
        title: 'foo::baz',
        value: 3,
        default: true
      }
    ],
    mockIsRTL;

  const dropdownPath = buildSrcPath('component/field/Dropdown');
  const keyDownSpy = jasmine.createSpy('keydown');

  class MockMenu extends Component {
    constructor() {
      super();
      this.keyDown = keyDownSpy;
    }
    render() {
      return <div>hi</div>;
    }
  }

  beforeAll(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsRTL = false;

    initMockRegistry({
      'React': React,
      './Dropdown.sass': {
        locals: {
          labelMobile: 'labelMobileClasses',
          labelLandscape: 'labelLandscapeClasses',
          arrowHover: 'arrowHoverClasses',
          menuContainerMobile: 'menuContainerMobileClasses',
          animateRight: 'animateRightClasses',
          animateLeft: 'animateLeftClasses',
          menuUp: 'menuUpClasses',
          inputError: 'inputErrorClasses'
        }
      },
      'component/field/DropdownMenu': {
        DropdownMenu: MockMenu
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          isRTL: () => mockIsRTL
        }
      },
      'utility/keyboard': {
        keyCodes: {
          'DOWN': 40,
          'TAB': 9,
          'ESC': 27
        }
      }
    });

    mockery.registerAllowable(dropdownPath);

    Dropdown = requireUncached(dropdownPath).Dropdown;

    jasmine.clock().install();
  });

  afterAll(() => {
    mockery.deregisterAll();
    mockery.disable();
    jasmine.clock().uninstall();
  });

  let dropdown;

  describe('render', () => {
    describe('when fullscreen is false', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown />);
      });

      it('should not show any mobile classes', () => {
        expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelMobileClasses'))
          .toBeNull();

        expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelLandscapeClasses'))
          .toBeNull();
      });

      it('should not have mobile classes for the menu', () => {
        dropdown.setState({ open: true });

        expect(ReactDOM.findDOMNode(dropdown).querySelector('.menuContainerMobileClasses'))
          .toBeNull();
      });
    });

    describe('when fullscreen is true', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown fullscreen={true} />);
      });

      it('should not have mobile classes for the menu', () => {
        dropdown.setState({ open: true });

        expect(ReactDOM.findDOMNode(dropdown).querySelector('.menuContainerMobileClasses'))
          .not.toBeNull();
      });

      describe('when landscape is false', () => {
        it('should have mobile classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelMobileClasses'))
            .not.toBeNull();
        });

        it('should not have landscape classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelLandscapeClasses'))
            .toBeNull();
        });
      });

      describe('when landscape is true', () => {
        beforeEach(() => {
          dropdown = domRender(<Dropdown fullscreen={true} landscape={true} />);
        });

        it('should have landscape classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelLandscapeClasses'))
            .not.toBeNull();
        });

        it('should not have mobile classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.labelMobileClasses'))
            .toBeNull();
        });
      });
    });

    describe('when hovering on input field', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown />);
        dropdown.handleMouseEnter();
      });

      it('should show hover classes', () => {
        expect(dropdown.renderDropdownArrow().props.className)
          .toContain('arrowHoverClasses');
      });
    });

    describe('when not hovering on input field', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown />);
        dropdown.handleMouseLeave();
      });

      it('should not show hover classes', () => {
        expect(dropdown.renderDropdownArrow().props.className)
          .not.toContain('arrowHoverClasses');
      });
    });

    it('should not show animating classes', () => {
      expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateRightClasses'))
        .toBeNull();

      expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateLeftClasses'))
        .toBeNull();
    });

    describe('when animating next', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown />);
        dropdown.updateMenu();
      });

      describe('when RTL is false', () => {
        it('should show animating right classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateRightClasses'))
            .not.toBeNull();
        });
      });

      describe('when RTL is true', () => {
        beforeEach(() => {
          mockIsRTL = true;
          dropdown.updateMenu();
        });

        it('should show animating left classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateLeftClasses'))
            .not.toBeNull();
        });
      });
    });

    describe('when animating back', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown />);
        dropdown.handleBackClick();
      });

      describe('when RTL is false', () => {
        it('should show animating left classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateLeftClasses'))
            .not.toBeNull();
        });
      });

      describe('when RTL is true', () => {
        beforeEach(() => {
          mockIsRTL = true;
          dropdown.handleBackClick();
        });

        it('should show animating right classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.animateRightClasses'))
            .not.toBeNull();
        });
      });
    });

    describe('when height is < props.frameHeight / 2', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown frameHeight={100} />);
        dropdown.height = 49;
        dropdown.setState({ open: true });
      });

      it('should not have menu up classes', () => {
        expect(ReactDOM.findDOMNode(dropdown).querySelector('.menuUpClasses'))
          .toBeNull();
      });
    });

    describe('when height is > props.frameHeight / 2', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown frameHeight={100} />);
        dropdown.height = 51;
        dropdown.setState({ open: true });
      });

      it('should have menu up classes', () => {
        expect(ReactDOM.findDOMNode(dropdown).querySelector('.menuUpClasses'))
          .not.toBeNull();
      });
    });
  });

  describe('handleKeyDown', () => {
    let preventDefaultSpy;

    beforeAll(() => {
      dropdown = domRender(<Dropdown />);
      preventDefaultSpy = jasmine.createSpy('preventDefault');
    });

    describe('when keyCode is TAB', () => {
      it('does nothing', () => {
        dropdown.handleKeyDown({ keyCode: 9, preventDefault: preventDefaultSpy });

        expect(preventDefaultSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when keyCode is DOWN', () => {
      beforeAll(() => {
        dropdown.handleKeyDown({ keyCode: 40, preventDefault: preventDefaultSpy });
      });

      it('prevents default event', () => {
        expect(preventDefaultSpy)
          .toHaveBeenCalled();
      });

      it('opens the menu', () => {
        expect(dropdown.state.open)
          .toEqual(true);
      });

      it('passes the keypress to the child menu', () => {
        jasmine.clock().tick();

        expect(keyDownSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when keyCode is ESC', () => {
      beforeAll(() => {
        dropdown.handleKeyDown({ keyCode: 27, preventDefault: preventDefaultSpy });
      });

      it('prevents default event', () => {
        expect(preventDefaultSpy)
          .toHaveBeenCalled();
      });

      it('closes the menu', () => {
        expect(dropdown.state.open)
          .toEqual(false);
      });
    });

    describe('when the keyCode is something else', () => {
      beforeAll(() => {
        dropdown.handleKeyDown({ keyCode: 50, preventDefault: preventDefaultSpy });
      });

      it('prevents default event', () => {
        expect(preventDefaultSpy)
          .toHaveBeenCalled();
      });

      it('passes the keypress to the child menu', () => {
        jasmine.clock().tick();

        expect(keyDownSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('formatDropdownOptions', () => {
    let items;

    beforeAll(() => {
      dropdown = domRender(<Dropdown />);

      items = dropdown.formatDropdownOptions(options);
    });

    it('should return the correct number of items', () => {
      expect(items.length)
        .toBe(3);
    });

    describe('for items with no nesting', () => {
      let filteredItems;

      beforeAll(() => {
        filteredItems = _.reject(items, (item) => item.nestedMenu);
      });

      it('should return the correct amount', () => {
        expect(filteredItems.length)
          .toBe(2);
      });

      it('should return them in the correct format', () => {
        expect(_.keys(filteredItems[0]))
          .toEqual(['title', 'onClick', 'value', 'id']);
      });
    });

    describe('for items with nesting', () => {
      let filteredItems;

      beforeAll(() => {
        filteredItems = _.reject(items, (item) => !item.nestedMenu);
      });

      it('should return the correct amount', () => {
        expect(filteredItems.length)
          .toBe(1);
      });

      it('should return them in the correct format', () => {
        expect(_.keys(filteredItems[0]))
          .toEqual(['title', 'nestedMenu', 'updateMenu', 'id']);
      });
    });

    it('sets this.selected to the option if it is the default option', () => {
      expect(dropdown.selected)
        .toEqual({ title: 'baz', value: 3, default: true });
    });
  });

  describe('handleFocus', () => {
    beforeAll(() => {
      dropdown = domRender(<Dropdown />);
    });

    describe('when the container has not been clicked on', () => {
      it('should not change the open state', () => {
        dropdown.containerClicked = false;
        dropdown.handleFocus();

        expect(dropdown.state.open)
          .toBe(false);
      });
    });

    describe('when the container has been clicked on', () => {
      it('should set open state to true', () => {
        dropdown.containerClicked = true;
        dropdown.handleFocus();

        expect(dropdown.state.open)
          .toBe(true);
      });
    });
  });

  describe('handleBlur', () => {
    let inputSpy;

    beforeEach(() => {
      inputSpy = jasmine.createSpy('focus');
      dropdown = domRender(<Dropdown />);

      dropdown.input.focus = inputSpy;
    });

    describe('when the container has been clicked on', () => {
      it('should stay focused on the field', () => {
        dropdown.containerClicked = true;

        dropdown.handleBlur();

        expect(inputSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the container has not been clicked on', () => {
      it('should stay focused on the field', () => {
        dropdown.containerClicked = false;

        dropdown.handleBlur();

        expect(inputSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when a option is not selected', () => {
      describe('when the field is not required', () => {
        beforeEach(() => {
          dropdown = domRender(<Dropdown />);

          dropdown.handleBlur();
        });

        it('should not show input error classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.inputErrorClasses'))
            .toBeNull();
        });
      });

      describe('when the field is required', () => {
        beforeEach(() => {
          dropdown = domRender(<Dropdown required={true} />);

          dropdown.handleBlur();
        });

        it('should show input error classes', () => {
          expect(ReactDOM.findDOMNode(dropdown).querySelector('.inputErrorClasses'))
            .not.toBeNull();
        });
      });
    });
  });

  describe('handleInputClick', () => {
    it('should toggle to open state', () => {
      dropdown = domRender(<Dropdown />);

      expect(dropdown.state.open)
        .toBe(false);

      dropdown.handleInputClick();

      expect(dropdown.state.open)
        .toBe(true);

      dropdown.handleInputClick();

      expect(dropdown.state.open)
        .toBe(false);
    });
  });

  describe('handleBackClick', () => {
    beforeAll(() => {
      dropdown = domRender(<Dropdown />);
    });

    describe('when there is no previous menu', () => {
      it('sets does not change the menu state', () => {
        dropdown.setState({ displayedMenu: <MockMenu ref={1} /> });

        dropdown.handleBackClick();

        expect(dropdown.state.displayedMenu.ref)
          .toEqual(1);
      });
    });

    describe('when there is a previous menu', () => {
      beforeEach(() =>  {
        dropdown.setState({
          previousMenus: [<MockMenu ref={1} />],
          displayedMenu: <MockMenu ref={2} />
        });

        dropdown.handleBackClick();
      });

      it('sets displayedMenu to the previous menu state', () => {
        expect(dropdown.state.displayedMenu.ref)
          .toEqual(1);
      });

      it('sets updates the previousMenu state', () => {
        expect(dropdown.state.previousMenus.length)
          .toEqual(0);
      });

      it('sets animatingBack to true', () => {
        expect(dropdown.state.animatingBack)
          .toEqual(true);
      });

      it('sets animatingBack to false after 200ms', () => {
        jasmine.clock().tick(200);

        expect(dropdown.state.animatingBack)
          .toEqual(false);
      });
    });
  });

  describe('updateMenu', () => {
    beforeEach(() => {
      dropdown = domRender(<Dropdown />);

      dropdown.setState({
        previousMenus: [],
        displayedMenu: <MockMenu ref={1} />
      });

      dropdown.updateMenu(<MockMenu ref={2} />);
    });

    it('sets displayedMenu to the new menu', () => {
      expect(dropdown.state.displayedMenu.ref)
        .toEqual(2);
    });

    it('sets updates the previousMenu state', () => {
      expect(dropdown.state.previousMenus.length)
        .toEqual(1);

      expect(dropdown.state.previousMenus[0].ref)
        .toEqual(1);
    });

    it('sets animatingNext to true', () => {
      expect(dropdown.state.animatingNext)
        .toEqual(true);
    });

    it('sets animatingNext to false after 200ms', () => {
      jasmine.clock().tick(200);

      expect(dropdown.state.animatingNext)
        .toEqual(false);
    });
  });

  describe('handleContainerClick', () => {
    beforeAll(() => {
      dropdown = domRender(<Dropdown />);
      dropdown.handleContainerClick();
    });

    it('sets containerClicked to true', () => {
      expect(dropdown.containerClicked)
        .toEqual(true);
    });

    it('sets containerClicked to false on the next tick', () => {
      jasmine.clock().tick(1);
      expect(dropdown.containerClicked)
        .toEqual(false);
    });
  });
});
