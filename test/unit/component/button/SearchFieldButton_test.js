describe('SearchFieldButton component', function() {
  let SearchFieldButton,
    mockRegistry;

  const searchFieldButtonPath = buildSrcPath('component/button/SearchFieldButton');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/button/IconFieldButton': {
        IconFieldButton: noopReactComponent()
      }
    });

    mockery.registerAllowable(searchFieldButtonPath);

    SearchFieldButton = requireUncached(searchFieldButtonPath).SearchFieldButton;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have a onClick function its div', function() {
    const onClick = jasmine.createSpy();
    const searchFieldButton = domRender(<SearchFieldButton onClick={onClick} />);

    const searchFieldButtonNode = ReactDOM.findDOMNode(searchFieldButton);

    TestUtils.Simulate.click(
      searchFieldButtonNode.querySelector('.Form-field--search'));

    expect(onClick)
      .toHaveBeenCalled();
  });

  describe('disableAutoSearch', function() {
    let Icon,
      IconFieldButton,
      searchFieldButton;

    beforeEach(function() {
      Icon = mockRegistry['component/Icon'].Icon;
      IconFieldButton = mockRegistry['component/button/IconFieldButton'].IconFieldButton;

      searchFieldButton = domRender(<SearchFieldButton disableAutoSearch={true} />);
    });

    it('should display the IconFieldButton component if true', function() {
      expect(TestUtils.scryRenderedComponentsWithType(searchFieldButton, IconFieldButton).length)
        .not.toEqual(0);

      expect(TestUtils.scryRenderedComponentsWithType(searchFieldButton, Icon).length)
        .toEqual(0);
    });

    it('should display the Icon component if false', function() {
      searchFieldButton = domRender(<SearchFieldButton />);

      expect(TestUtils.scryRenderedComponentsWithType(searchFieldButton, Icon).length)
        .not.toEqual(0);

      expect(TestUtils.scryRenderedComponentsWithType(searchFieldButton, IconFieldButton).length)
        .toEqual(0);
    });

    it('should have the correct classes', function() {
      expect(TestUtils.findRenderedDOMComponentWithClass(searchFieldButton, 'u-paddingRN u-paddingVN'))
        .toBeTruthy();
    });
  });
});
