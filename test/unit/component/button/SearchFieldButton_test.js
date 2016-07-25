describe('SearchFieldButton component', function() {
  let SearchFieldButton;

  const searchFieldButtonPath = buildSrcPath('component/button/SearchFieldButton');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
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
});
