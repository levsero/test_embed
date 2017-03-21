describe('dropdownOption component', () => {
  let DropdownOption, mockIsRTL;
  const dropdownOptionPath = buildSrcPath('component/field/DropdownOption');

  beforeEach(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsRTL = false;

    initMockRegistry({
      'React': React,
      './DropdownOption.sass': {
        locals: {
          arrowLeft: 'arrowLeftClasses',
          arrowRight: 'arrowRightClasses',
          arrowMobile: 'arrowMobileClasses',
          fieldBorder: 'fieldBorderClasses',
          fieldFocused: 'fieldFocusedClasses'
        }
      },
      'service/i18n': {
        i18n: {
          isRTL: () => mockIsRTL
        }
      }
    });

    mockery.registerAllowable(dropdownOptionPath);

    DropdownOption = requireUncached(dropdownOptionPath).DropdownOption;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('backArrow', () => {
    let option;

    it('does not display by default', () => {
      option = domRender(<DropdownOption />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowBackClasses'))
        .toBeNull();
    });

    describe('when backButton prop is true', () => {
      describe('when rtl is false', () => {
        beforeEach(() => {
          option = domRender(<DropdownOption backButton={true} />);
        });

        it('shows the left arrow', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowLeftClasses'))
            .not.toBeNull();
        });
      });

      describe('when rtl is true', () => {
        beforeEach(() => {
          mockIsRTL = true;
          option = domRender(<DropdownOption backButton={true} />);
        });

        it('shows the right arrow', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowRightClasses'))
            .not.toBeNull();
        });
      });
    });

    describe('when fullscreen is true', () => {
      let option;

      beforeEach(() => {
        option = domRender(<DropdownOption backButton={true} fullscreen={true} />);
      });

      it('should have mobile classes', () => {
        expect(ReactDOM.findDOMNode(option).querySelector('.arrowMobileClasses'))
          .not.toBeNull();
      });
    });

    describe('when fullscreen is true', () => {
      let option;

      beforeEach(() => {
        option = domRender(<DropdownOption backButton={true} />);
      });

      it('should have mobile classes', () => {
        expect(ReactDOM.findDOMNode(option).querySelector('.arrowMobileClasses'))
          .toBeNull();
      });
    });
  });

  describe('nextArrow', () => {
    let option;

    it('does not display by default', () => {
      option = domRender(<DropdownOption />);

      expect(ReactDOM.findDOMNode(option).querySelector('.arrowNextClasses'))
        .toBeNull();
    });

    describe('when nestedMenu is not null', () => {
      describe('when rtl is false', () => {
        beforeEach(() => {
          option = domRender(<DropdownOption nestedMenu={noopReactComponent()} />);
        });

        it('shows the right arrow', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowRightClasses'))
            .not.toBeNull();
        });
      });

      describe('when rtl is true', () => {
        beforeEach(() => {
          mockIsRTL = true;
          option = domRender(<DropdownOption nestedMenu={noopReactComponent()} />);
        });

        it('shows the left arrow', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowLeftClasses'))
            .not.toBeNull();
        });
      });

      describe('when fullscreen is true', () => {
        beforeEach(() => {
          option = domRender(<DropdownOption nestedMenu={noopReactComponent()} fullscreen={true} />);
        });

        it('should have mobile classes', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowMobileClasses'))
            .not.toBeNull();
        });
      });

      describe('when fullscreen is false', () => {
        let option;

        beforeEach(() => {
          option = domRender(<DropdownOption nestedMenu={noopReactComponent()} />);
        });

        it('should not have mobile classes', () => {
          expect(ReactDOM.findDOMNode(option).querySelector('.arrowMobileClasses'))
            .toBeNull();
        });
      });
    });
  });

  describe('handleDropdownOpen', () => {
    let updateMenuSpy, onClickSpy, option;

    beforeEach(() => {
      updateMenuSpy = jasmine.createSpy('updateMenu');
      onClickSpy = jasmine.createSpy('onClick');
    });

    describe('when there is a nested menu', () => {
      beforeEach(() => {
        option = domRender(
          <DropdownOption
            nestedMenu={noopReactComponent()}
            updateMenu={updateMenuSpy}
            onClick={onClickSpy} />
        );

        option.handleDropdownOpen();
      });

      it('calls updateMenu prop', () => {
        expect(updateMenuSpy)
          .toHaveBeenCalled();
      });

      it('does not call onClick prop', () => {
        expect(onClickSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when there is not a nested menu', () => {
      beforeEach(() => {
        option = domRender(
          <DropdownOption
            updateMenu={updateMenuSpy}
            onClick={onClickSpy} />
        );

        option.handleDropdownOpen();
      });

      it('calls the onClick prop', () => {
        expect(onClickSpy)
          .toHaveBeenCalled();
      });

      it('does not call updateMenu prop', () => {
        expect(updateMenuSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('render', () => {
    let option;

    describe('when the field is focused', () => {
      beforeEach(() => {
        option = domRender(<DropdownOption />);

        option.focus();
      });

      it('has focused classes', () => {
        expect(ReactDOM.findDOMNode(option).querySelector('.fieldFocusedClasses'))
          .not.toBeNull();
      });
    });

    describe('when the field is not focused', () => {
      beforeEach(() => {
        option = domRender(<DropdownOption />);

        option.blur();
      });

      it('does not have focused classes', () => {
        expect(ReactDOM.findDOMNode(option).querySelector('.fieldFocusedClasses'))
          .toBeNull();
      });
    });

    describe('when the back button is shown', () => {
      beforeEach(() => {
        option = domRender(<DropdownOption backButton={true} />);
      });

      it('has border classes', () => {
        expect(ReactDOM.findDOMNode(option).className)
          .toContain('fieldBorderClasses');
      });
    });

    describe('when the back button is not shown', () => {
      beforeEach(() => {
        option = domRender(<DropdownOption />);
      });

      it('does not have border classes', () => {
        expect(ReactDOM.findDOMNode(option).className)
          .not.toContain('fieldBorderClasses');
      });
    });
  });
});
