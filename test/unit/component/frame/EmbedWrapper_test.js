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
    let instance, styleBlock;

    beforeEach(() => {
      instance = domRender(
        <EmbedWrapper
          baseCSS='.base-css-file {}'>
          <MockChildComponent />
        </EmbedWrapper>
      );

      styleBlock = ReactDOM.findDOMNode(instance).getElementsByTagName('style')[0];
    });

    it('adds a <style> block to the iframe document', () => {
      expect(styleBlock.innerHTML)
        .toContain('.base-css-file {}');
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
});
