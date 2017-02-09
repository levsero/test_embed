describe('dropdownMenu component', () => {
  let DropdownMenu,
    options = [
      {
        title: 'not nested',
        onClick: noop,
        value: '123abc',
        id: _.uniqueId('option-')
      },
      {
        title: 'nested',
        nestedMenu: noopReactComponent(),
        updateMenu: noop,
        id: _.uniqueId('option-')
      }
    ];

  const dropdownMenuPath = buildSrcPath('component/field/DropdownMenu');
  const openNestedMenuFromKeyboardSpy = jasmine.createSpy('openNestedMenuFromKeyboard');
  const handleDropdownOpenSpy = jasmine.createSpy('handleDropdownOpen');
  const handleBackClickSpy = jasmine.createSpy('handleBackClick');

  beforeAll(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './DropdownMenu.sass': {
        locals: {}
      },
      'component/field/DropdownOption': {
        DropdownOption: class extends Component {
          constructor() {
            super();
            this.openNestedMenuFromKeyboard = openNestedMenuFromKeyboardSpy;
            this.handleDropdownOpen = handleDropdownOpenSpy;
            this.focus = noop;
            this.blur = noop;
            this.element = { offsetTop: 0 };
          }
          render() {
            return (<div />);
          }
        }
      },
      'service/i18n': {
        i18n: { t: noop }
      },
      'utility/keyboard': {
        keyCodes: {
          'DOWN': 40,
          'UP': 38,
          'RIGHT': 39,
          'LEFT': 37,
          'ENTER': 13
        }
      }
    });

    mockery.registerAllowable(dropdownMenuPath);

    DropdownMenu = requireUncached(dropdownMenuPath).DropdownMenu;
  });

  afterAll(() => {
    mockery.deregisterAll();
    mockery.disable();
    jasmine.clock().uninstall();
  });

  describe('items', () => {
    let menu;

    beforeEach(() => {
      menu = domRender(<DropdownMenu options={options} />);
    });

    it('should render the options correctly based on the options prop', () => {
      expect(menu.element.children.length)
        .toBe(2);
    });

    it('should store them in a items ref', () => {
      expect(menu.items.length)
        .toBe(2);
    });

    it('should should add a back arrow to ref if allowed', () => {
      menu = domRender(<DropdownMenu options={options} backButton={true} />);

      expect(menu.items.length)
        .toBe(3);
    });
  });

  describe('keyDown', () => {
    let menu;

    beforeAll(() => {
      menu = domRender(<DropdownMenu options={options} handleBackClick={handleBackClickSpy} />);
      jasmine.clock().install();
    });

    describe('when focusField is null', () => {
      describe('when any key is passed', () => {
        beforeEach(() => {
          menu.keyDown(40);
        });

        it('should focus on the first field', () => {
          expect(menu.focusedField)
            .toBe(0);
        });
      });
    });

    describe('when focusField is not null', () => {
      describe('when keyCode is DOWN', () => {
        beforeEach(() => {
          menu.focusedField = 0;
          menu.keyDown(40);
          jasmine.clock().tick(0);
        });

        it('should move the focusedField up', () => {
          expect(menu.focusedField)
            .toBe(1);
        });
      });

      describe('when keyCode is UP', () => {
        beforeEach(() => {
          menu.focusedField = 1;
          menu.keyDown(38);
          jasmine.clock().tick(0);
        });

        it('should move the focusedField down', () => {
          expect(menu.focusedField)
            .toBe(0);
        });
      });

      describe('when keyCode is RIGHT', () => {
        beforeEach(() => {
          menu.keyDown(39);
        });

        it('should try to open a nested menu', () => {
          expect(openNestedMenuFromKeyboardSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when keyCode is LEFT', () => {
        beforeEach(() => {
          menu.keyDown(37);
        });

        it('should go back', () => {
          expect(handleBackClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when keyCode is ENTER', () => {
        beforeEach(() => {
          menu.keyDown(13);
        });

        it('should call handleDropdownOpen', () => {
          expect(handleDropdownOpenSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
