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
      },
      './SearchInput.scss': {
        locals: {}
      }
    });

    mockery.registerAllowable(searchInputPath);

    SearchInput = requireUncached(searchInputPath).SearchInput;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('has autoComplete attribute set to false', () => {
    const input = domRender(<SearchInput />);
    const inputNode = ReactDOM.findDOMNode(input);

    expect(inputNode.querySelector('input').getAttribute('autoComplete'))
      .toEqual('off');
  });
});
