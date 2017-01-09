describe('SearchInput component', () => {
  let SearchInput;
  const searchInputPath = buildSrcPath('component/field/SearchInput');

  beforeEach(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'utility/devices': {
        isIos: noop
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      }
    });

    mockery.registerAllowable(searchInputPath);

    SearchInput = requireUncached(searchInputPath).SearchInput;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('disableAutoComplete', () => {
    it('should be added if it is true', () => {
      const input = domRender(<SearchInput disableAutoComplete={true} />);
      const inputNode = ReactDOM.findDOMNode(input);

      expect(inputNode.querySelector('input').getAttribute('autoComplete'))
        .toEqual('off');
    });

    it('should not be added if it is false', () => {
      const input = domRender(<SearchInput />);
      const inputNode = ReactDOM.findDOMNode(input);

      expect(inputNode.querySelector('input').getAttribute('autoComplete'))
        .toBeFalsy();
    });
  });
});
