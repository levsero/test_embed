describe('SearchField component', () => {
  let onChangeValue,
    mockRegistry,
    SearchField;
  const searchFieldPath = buildSrcPath('component/field/SearchField');

  beforeEach(() => {
    onChangeValue = jasmine.createSpy('onChangeValue');

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockRegistry = initMockRegistry({
      'React': React,
      'component/button/IconFieldButton': {
        IconFieldButton: noopReactComponent()
      },
      'component/field/SearchInput': {
        SearchInput: class extends Component {
          render() {
            return (
              <input onChange={this.props.onChange} />
            );
          }
        }
      },
      'component/loading/Loading': {
        LoadingEllipses: class extends Component {
          render() {
            return (
              <div className={`Loading ${this.props.className}`}>
                <div className='Loading-item'></div>
              </div>
            );
          }
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return (
              <span
                className={this.props.className}
                onClick={this.props.onClick}
                type={`${this.props.type}`}>
                <svg />
              </span>
            );
          }
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(searchFieldPath);

    SearchField = requireUncached(searchFieldPath).SearchField;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('SearchField', () => {
    it('should clear input and call props.onChangeValue when clear icon is clicked', () => {
      const searchField = domRender(<SearchField onChangeValue={onChangeValue} />);
      const searchFieldNode = ReactDOM.findDOMNode(searchField);
      const searchInputNode = searchFieldNode.querySelector('input');

      searchInputNode.value = 'Search string';

      TestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--clearInput'));

      expect(onChangeValue)
        .toHaveBeenCalledWith('');
    });

    it('should display `Loading` component when `this.props.isLoading` is truthy', () => {
      const searchField = domRender(<SearchField isLoading={true} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(true);

      expect(loadingNode.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `Loading` component when `this.props.isLoading` is falsy', () => {
      const searchField = domRender(<SearchField isLoading={false} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(false);

      expect(loadingNode.className)
        .toMatch('u-isHidden');
    });

    it('should display `clearInput` Icon when the input has text and `this.props.isLoading` is false', () => {
      const searchField = domRender(<SearchField isLoading={false} fullscreen={true} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when the input has no text', () => {
      const searchField = domRender(<SearchField />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: '' });

      expect(searchField.state.searchInputVal)
        .toEqual('');

      expect(clearInputNode.className)
        .toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when `this.props.isLoading` is true', () => {
      const searchField = domRender(<SearchField isLoading={true} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.className)
        .toMatch('u-isHidden');
    });
  });

  describe('disableAutoSearch', () => {
    let Icon,
      IconFieldButton,
      searchField;

    beforeEach(() => {
      Icon = mockRegistry['component/Icon'].Icon;
      IconFieldButton = mockRegistry['component/button/IconFieldButton'].IconFieldButton;
    });

    it('should display the IconFieldButton component if true', () => {
      searchField = domRender(<SearchField disableAutoSearch={true} />);

      expect(TestUtils.findRenderedComponentWithType(searchField, IconFieldButton))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedComponentWithType(searchField, Icon))
        .toThrow();
    });

    it('should display the Icon component if false', () => {
      searchField = domRender(<SearchField />);

      expect(TestUtils.scryRenderedComponentsWithType(searchField, Icon).length)
        .not.toEqual(0);

      expect(() => TestUtils.findRenderedComponentWithType(searchField, IconFieldButton))
        .toThrow();
    });
  });
});
