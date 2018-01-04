describe('SearchFieldButton component', () => {
  let SearchFieldButton;

  const searchFieldButtonPath = buildSrcPath('component/button/SearchFieldButton');
  let mockRegistry;

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/button/IconFieldButton': {
        IconFieldButton: noopReactComponent()
      },
      './SearchFieldButton.scss': {
        locals: {
          field: 'fld'
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
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

  it('displays searchTerm when searchTerm is provided', () => {
    const searchFieldButton = domRender(<SearchFieldButton searchTerm="blah"/>);
    const field = ReactDOM.findDOMNode(searchFieldButton).querySelector('span');

    expect(field.textContent).toEqual('blah');
  });

  it('displays placeholder when searchTerm is blank', () => {
    const i18n = mockRegistry['service/i18n'].i18n;

    domRender(<SearchFieldButton />);
    expect(i18n.t).toHaveBeenCalledWith('embeddable_framework.helpCenter.search.label.how_can_we_help');
  });
});
