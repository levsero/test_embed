describe('SearchField component', () => {
  let onChangeValue,
    SearchField;
  const searchFieldPath = buildSrcPath('component/field/SearchField');

  beforeEach(() => {
    onChangeValue = jasmine.createSpy('onChangeValue');
    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './SearchField.scss': {
        locals: {
          hidden: 'hidden',
          clearInput: 'clearInput'
        }
      },
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
      'component/loading/LoadingEllipses': {
        LoadingEllipses: class extends Component {
          render() {
            return (
              <div className={`ellipses ${this.props.className}`} />
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
    it('should display `LoadingEllipses` component when `this.props.isLoading` is truthy', () => {
      const searchField = domRender(<SearchField isLoading={true} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'ellipses');

      expect(searchField.props.isLoading)
        .toEqual(true);

      expect(loadingNode.className)
        .not.toMatch('hidden');
    });

    it('should not display `LoadingEllipses` component when `this.props.isLoading` is falsy', () => {
      const searchField = domRender(<SearchField isLoading={false} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'ellipses');

      expect(searchField.props.isLoading)
        .toEqual(false);

      expect(loadingNode.className)
        .toMatch('hidden');
    });

    describe('on Mobile', () => {
      it('should clear input and call props.onChangeValue when clear icon is clicked', () => {
        const searchField = domRender(<SearchField onChangeValue={onChangeValue} fullscreen={true} />);
        const searchFieldNode = ReactDOM.findDOMNode(searchField);
        const searchInputNode = searchFieldNode.querySelector('input');

        searchInputNode.value = 'Search string';

        TestUtils.Simulate.click(searchFieldNode.querySelector('.clearInput'));

        expect(onChangeValue)
          .toHaveBeenCalledWith('');
      });

      it('should display `clearInput` Icon when the input has text and `this.props.isLoading` is false', () => {
        const searchField = domRender(<SearchField isLoading={false} fullscreen={true} />);
        const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'clearInput');

        searchField.setState({ searchInputVal: 'something' });

        expect(searchField.state.searchInputVal)
          .toEqual('something');

        expect(clearInputNode.className)
          .not.toMatch('hidden');
      });

      it('should not display `clearInput` Icon when the input has no text', () => {
        const searchField = domRender(<SearchField fullscreen={true} />);
        const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'clearInput');

        searchField.setState({ searchInputVal: '' });

        expect(searchField.state.searchInputVal)
          .toEqual('');

        expect(clearInputNode.className)
          .toMatch('hidden');
      });

      it('should not display `clearInput` Icon when `this.props.isLoading` is true', () => {
        const searchField = domRender(<SearchField isLoading={true} fullscreen={true} />);
        const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'clearInput');

        searchField.setState({ searchInputVal: 'something' });

        expect(searchField.state.searchInputVal)
          .toEqual('something');

        expect(clearInputNode.className)
          .toMatch('hidden');
      });
    });

    describe('on Desktop', () => {
      it('should not have a clear input icon', () => {
        const searchField = domRender(<SearchField onChangeValue={onChangeValue} />);
        const searchFieldNode = ReactDOM.findDOMNode(searchField);

        expect(searchFieldNode.querySelector('.clearInput'))
          .toBeNull();
      });
    });
  });
});
