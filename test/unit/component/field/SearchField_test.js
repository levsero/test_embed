describe('SearchField component', function() {
  let onChangeValue,
    SearchField,
    mockIsMobileBrowserValue;
  const searchFieldPath = buildSrcPath('component/field/SearchField');

  beforeEach(function() {
    onChangeValue = jasmine.createSpy('onChangeValue');

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsMobileBrowserValue = false;

    initMockRegistry({
      'React': React,
      'component/button/SearchFieldButton': {
        SearchFieldButton: noopReactComponent()
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
      'utility/devices': {
        isMobileBrowser: function() {
          return mockIsMobileBrowserValue;
        },
        isIos: noop
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL',
          'getLocaleId'
        ])
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

      expect(searchInputNode.value)
        .toEqual('');

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
      mockIsMobileBrowserValue = true;

      const searchField = domRender(<SearchField isLoading={false} />);
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
});

