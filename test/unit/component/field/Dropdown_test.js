describe('dropdown component', () => {
  let Dropdown;
  const dropdownPath = buildSrcPath('component/field/Dropdown');

  beforeAll(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './Dropdown.sass': {
        locals: {}
      },
      'component/field/DropdownMenu': {
        DropdownMenu: noopReactComponent()
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'utility/keyboard': {
        keyCodes: {}
      }
    });

    mockery.registerAllowable(dropdownPath);

    Dropdown = requireUncached(dropdownPath).Dropdown;
  });

  afterAll(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  let dropdown;

  describe('formatDropdownOptions', () => {
    it('should return the options correctly', () => {

    });
  });

  describe('handleFocus', () => {
    beforeEach(() => {
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

    });
  });

  describe('handleBackClick', () => {
    it('sets displayedMenu to the previous menu state', () => {

    });

    it('sets updates the previousMenu state', () => {

    });
  });

  describe('updateMenu', () => {
    it('sets displayedMenu to the new menu', () => {

    });

    it('sets updates the previousMenu state', () => {

    });
  });

  describe('handleContainerClick', () => {
    it('sets containerClicked to true', () => {

    });

    it('sets containerClicked to false on the next tick', () => {

    });
  });

  describe('handleKeyDown', () => {
    describe('when keyCode is TAB', () => {
      it('does nothing', () => {

      });
    });

    describe('when keyCode is DOWN', () => {
      it('opens the menu', () => {

      });

      it('passes the keypress to the child menu', () => {

      });
    });

    describe('when keyCode is ESC', () => {
      it('closes the menu', () => {

      });
    });

    describe('when the keyCode is something else', () => {
      it('does nothing', () => {

      });
    });
  });
});
