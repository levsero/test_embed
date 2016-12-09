describe('SearchFieldButton component', () => {
  let SearchFieldButton,
    mockRegistry;

  const searchFieldButtonPath = buildSrcPath('component/button/SearchFieldButton');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: NoopReactComponent()
      },
      'component/button/IconFieldButton': {
        IconFieldButton: NoopReactComponent()
      }
    });

    mockery.registerAllowable(searchFieldButtonPath);

    SearchFieldButton = requireUncached(searchFieldButtonPath).SearchFieldButton;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have a onClick function its div', () => {
    const onClick = jasmine.createSpy();
    const searchFieldButton = domRender(<SearchFieldButton onClick={onClick} />);

    const searchFieldButtonNode = ReactDOM.findDOMNode(searchFieldButton);

    TestUtils.Simulate.click(
      searchFieldButtonNode.querySelector('.Form-field--search'));

    expect(onClick)
      .toHaveBeenCalled();
  });

  describe('disableAutoSearch', () => {
    let Icon,
      IconFieldButton,
      searchFieldButton;

    beforeEach(() => {
      Icon = mockRegistry['component/Icon'].Icon;
      IconFieldButton = mockRegistry['component/button/IconFieldButton'].IconFieldButton;

      searchFieldButton = domRender(<SearchFieldButton disableAutoSearch={true} />);
    });

    it('should display the IconFieldButton component if true', () => {
      expect(TestUtils.findRenderedComponentWithType(searchFieldButton, IconFieldButton))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedComponentWithType(searchFieldButton, Icon))
        .toThrow();
    });

    it('should display the Icon component if false', () => {
      searchFieldButton = domRender(<SearchFieldButton />);

      expect(TestUtils.findRenderedComponentWithType(searchFieldButton, Icon))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedComponentWithType(searchFieldButton, IconFieldButton))
        .toThrow();
    });

    it('should have the correct classes', () => {
      expect(TestUtils.findRenderedDOMComponentWithClass(searchFieldButton, 'u-paddingRN u-paddingVN'))
        .toBeTruthy();
    });
  });
});
