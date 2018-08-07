describe('Render phone field', () => {
  let TalkCountryDropdown;

  const talkCountryDropdownPath = buildSrcPath('component/talk/TalkCountryDropdown');

  beforeEach(() => {
    mockery.enable();
    initMockRegistry({
      'React': React,
      '@zendeskgarden/react-select': {
        SelectContainer: noopReactComponent(),
        SelectView: noopReactComponent(),
        Dropdown: noopReactComponent(),
        Item: noopReactComponent(),
      },
      'component/Flag': { Flag: noopReactComponent() }
    });

    mockery.registerAllowable(talkCountryDropdownPath);
    TalkCountryDropdown = requireUncached(talkCountryDropdownPath).TalkCountryDropdown;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleStateChanged', () => {
    let countryDropdown;

    beforeEach(() => {
      countryDropdown = instanceRender(
        <TalkCountryDropdown
          document={document}
          getContainerRef={() => {}} />
      );

      countryDropdown.setState({ selectFocused: true });
    });

    describe('when the selectedKey is defined', () => {
      beforeEach(() => {
        countryDropdown.handleStateChange({ selectedKey: 'AU' });
      });

      it('sets state.selectFocused to false', () => {
        expect(countryDropdown.selectFocused())
          .toBe(false);
      });
    });

    describe('when the selectedKey is not defined', () => {
      beforeEach(() => {
        countryDropdown.handleStateChange({});
      });

      it('does not set state.selectFocused to false', () => {
        expect(countryDropdown.selectFocused())
          .toBe(true);
      });
    });
  });
});
