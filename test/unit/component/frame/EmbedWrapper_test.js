describe('EmbedWrapper', () => {
  let EmbedWrapper;

  const EmbedWrapperPath = buildSrcPath('component/frame/EmbedWrapper');

  class MockChildComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <div className='mock-component' />;
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/color': {},
      'component/frame/Navigation': noopReactComponent(),
      'lodash': _
    });

    EmbedWrapper = requireUncached(EmbedWrapperPath).EmbedWrapper;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    it('adds a <style> block to the iframe document', () => {
      const instance = domRender(
        <EmbedWrapper
          childFn={noop}
          baseCSS='.base-css-file {}' />
      );
      const styleBlock = ReactDOM.findDOMNode(instance).getElementsByTagName('style')[0];

      expect(styleBlock.innerHTML)
        .toContain('.base-css-file {}');
    });

    describe('when a child prop is passed into it', () => {
      let instance;

      beforeEach(() => {
        instance = domRender(
          <EmbedWrapper><MockChildComponent /></EmbedWrapper>
        );
      });

      it('renders the child in the wrapper', () => {
        expect(instance.embed.firstChild.className)
          .toBe('mock-component');
      });

      it('adds a rootComponent ref to that child', () => {
        expect(instance.refs.rootComponent)
          .toBeDefined();
      });
    });

    describe('when a childFn prop is passed into it', () => {
      let instance;

      beforeEach(() => {
        instance = domRender(
          <EmbedWrapper childFn={() => <MockChildComponent />} />
        );
      });

      it('renders the childFn in the wrapper', () => {
        expect(instance.embed.firstChild.className)
          .toBe('mock-component');
      });

      it('does not add a rootComponent ref to that child', () => {
        expect(instance.refs.rootComponent)
          .toBeUndefined();
      });
    });
  });
});
