describe('dropdownOption component', () => {
  let DropdownOption;
  const dropdownOptionPath = buildSrcPath('component/field/DropdownOption');

  beforeAll(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './DropdownOption.sass': {
        locals: {
          arrowBack: 'arrowBackClasses',
          arrowNext: 'arrowNextClasses'
        }
      }
    });

    mockery.registerAllowable(dropdownOptionPath);

    DropdownOption = requireUncached(dropdownOptionPath).DropdownOption;
  });

  afterAll(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('backArrow', () => {
    it('does not display by default', () => {
      const option = domRender(<DropdownOption />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowBackClasses'))
        .toBeNull();
    });

    it('shows when backButton is true', () => {
      const option = domRender(<DropdownOption backButton={true} />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowBackClasses'))
        .not.toBeNull();
    });
  });

  describe('nextArrow', () => {
    it('does not display by default', () => {
      const option = domRender(<DropdownOption />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowNextClasses'))
        .toBeNull();
    });

    it('shows when nestedMenu is not null', () => {
      const option = domRender(<DropdownOption nestedMenu={noopReactComponent()} />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowNextClasses'))
        .not.toBeNull();
    });
  });

  describe('handleDropdownOpen', () => {
    let updateMenuSpy, onClickSpy;

    beforeEach(() => {
      updateMenuSpy = jasmine.createSpy('updateMenu');
      onClickSpy = jasmine.createSpy('onClick');
    });

    describe('when there is a nested menu', () => {
      it('shows when nestedMenu is not null', () => {
        const option = domRender(
          <DropdownOption
            nestedMenu={noopReactComponent()}
            updateMenu={updateMenuSpy}
            onClickSpy={onClickSpy} />
        );

        option.handleDropdownOpen();

        expect(updateMenuSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when there is not a nested menu', () => {
      it('calls the onClick prop', () => {
        const option = domRender(
          <DropdownOption
            updateMenu={updateMenuSpy}
            onClick={onClickSpy} />
        );

        option.handleDropdownOpen();

        expect(onClickSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
