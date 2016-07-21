describe('SearchField component', function() {
  let onChangeValue,
    mockRegistry,
    SearchField;
  const searchFieldPath = buildSrcPath('component/field/SearchField');

  beforeEach(function() {
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
        SearchInput: React.createClass({
          render: function() {
            return (
              <input onChange={this.props.onChange} />
            );
          }
        })
      },
      'component/Loading': {
        LoadingEllipses: React.createClass({
          render: function() {
            return (
              <div className={`Loading ${this.props.className}`}>
                <div className='Loading-item'></div>
              </div>
            );
          }
        })
      },
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span
                className={this.props.className}
                onClick={this.props.onClick}
                type={`${this.props.type}`}>
                <svg />
              </span>
            );
          }
        })
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(searchFieldPath);

    SearchField = requireUncached(searchFieldPath).SearchField;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('SearchField', function() {
    it('should clear input and call props.onChangeValue when clear icon is clicked', function() {
      const searchField = domRender(<SearchField onChangeValue={onChangeValue} />);
      const searchFieldNode = ReactDOM.findDOMNode(searchField);
      const searchInputNode = searchFieldNode.querySelector('input');

      searchInputNode.value = 'Search string';

      TestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--clearInput'));

      expect(onChangeValue)
        .toHaveBeenCalledWith('');
    });

    it('should display `Loading` component when `this.props.isLoading` is truthy', function() {
      const searchField = domRender(<SearchField isLoading={true} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(true);

      expect(loadingNode.props.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `Loading` component when `this.props.isLoading` is falsy', function() {
      const searchField = domRender(<SearchField isLoading={false} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(false);

      expect(loadingNode.props.className)
        .toMatch('u-isHidden');
    });

    it('should display `clearInput` Icon when the input has text and `this.props.isLoading` is false', function() {
      const searchField = domRender(<SearchField isLoading={false} fullscreen={true} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.props.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when the input has no text', function() {
      const searchField = domRender(<SearchField />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: '' });

      expect(searchField.state.searchInputVal)
        .toEqual('');

      expect(clearInputNode.props.className)
        .toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when `this.props.isLoading` is true', function() {
      const searchField = domRender(<SearchField isLoading={true} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.props.className)
        .toMatch('u-isHidden');
    });
  });

  describe('disableAutoSearch', function() {
    let Icon,
      IconFieldButton,
      searchField;

    beforeEach(function() {
      Icon = mockRegistry['component/Icon'].Icon;
      IconFieldButton = mockRegistry['component/button/IconFieldButton'].IconFieldButton;
    });

    it('should display the IconFieldButton component if true', function() {
      searchField = domRender(<SearchField disableAutoSearch={true} />);

      expect(TestUtils.scryRenderedComponentsWithType(searchField, IconFieldButton).length)
        .not.toEqual(0);

      expect(TestUtils.scryRenderedComponentsWithType(searchField, Icon).length)
        .toEqual(0);
    });

    it('should display the Icon component if false', function() {
      searchField = domRender(<SearchField />);

      expect(TestUtils.scryRenderedComponentsWithType(searchField, Icon).length)
        .not.toEqual(0);

      expect(TestUtils.scryRenderedComponentsWithType(searchField, IconFieldButton).length)
        .toEqual(0);
    });
  });
});

