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
        value: 3
      }
    ];

  const dropdownPath = buildSrcPath('component/field/Dropdown');
  const keyDownSpy = jasmine.createSpy('keydown');

  beforeAll(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './Dropdown.sass': {
        locals: {
          labelMobile: 'labelMobileClasses',
          labelLandscape: 'labelLandscapeClasses'
        }
      },
      'component/field/DropdownMenu': {
        DropdownMenu: class extends Component {
          constructor() {
            super();
            this.keyDown = keyDownSpy;
          }
          render() {
            return <div>hi</div>;
          }
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
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
        dropdown.setState({ displayedMenu: { ref: 1 } });

        dropdown.handleBackClick();

        expect(dropdown.state.displayedMenu.ref)
          .toEqual(1);
      });
    });

    describe('when there is a previous menu', () => {
      beforeEach(() =>  {
        dropdown.setState({
          previousMenu: [{ ref: 1 }],
          displayedMenu: { ref: 2 }
        });

        dropdown.handleBackClick();
      });

      it('sets displayedMenu to the previous menu state', () => {
        expect(dropdown.state.displayedMenu.ref)
          .toEqual(1);
      });

      it('sets updates the previousMenu state', () => {
        expect(dropdown.state.previousMenu.length)
          .toEqual(0);
      });
    });
  });

  describe('updateMenu', () => {
    beforeEach(() => {
      dropdown = domRender(<Dropdown />);

      dropdown.setState({
        previousMenu: [],
        displayedMenu: { ref: 1 }
      });

      dropdown.updateMenu({ ref: 2 });
    });

    it('sets displayedMenu to the new menu', () => {
      expect(dropdown.state.displayedMenu.ref)
        .toEqual(2);
    });

    it('sets updates the previousMenu state', () => {
      expect(dropdown.state.previousMenu.length)
        .toEqual(1);

      expect(dropdown.state.previousMenu[0].ref)
        .toEqual(1);
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
    });

    describe('when fullscreen is true', () => {
      beforeEach(() => {
        dropdown = domRender(<Dropdown fullscreen={true} />);
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
      });
    });
  });
});
