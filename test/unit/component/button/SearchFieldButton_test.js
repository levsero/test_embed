describe('SearchFieldButton component', () => {
  let SearchFieldButton;

  const searchFieldButtonPath = buildSrcPath('component/button/SearchFieldButton');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/button/IconFieldButton': {
        IconFieldButton: noopReactComponent()
      },
      './SearchFieldButton.sass': {
        locals: {
          field: 'fld'
        }
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
      searchFieldButtonNode.querySelector('.fld'));

    expect(onClick)
      .toHaveBeenCalled();
  });
});
