describe('EmbedWrapper', () => {
  let EmbedWrapper,
    mockIsRTL;

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

    mockIsRTL = false;

    initMockRegistry({
      'React': React,
      'utility/color': {},
      'component/button/ButtonNav': {
        ButtonNav: class extends Component {
          render() {
            return (
              <div className={this.props.className}>
                {this.props.label}
              </div>
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          isRTL: () => mockIsRTL
        }
      },
      'lodash': _,
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className={this.props.type} />;
          }
        }
      }
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

    describe('close button', () => {
      let embedWrapper,
        embedWrapperComponent;

      beforeEach(() => {
        embedWrapper = domRender(
          <EmbedWrapper childFn={() => <MockChildComponent />} />
        );
        embedWrapperComponent = ReactDOM.findDOMNode(embedWrapper);
      });

      describe('when state.showCloseButton is true', () => {
        beforeEach(() => {
          embedWrapper.showCloseButton(true);
        });

        it('should render the close button', () => {
          expect(embedWrapperComponent.querySelector('.Icon--close'))
            .not.toBeNull();
        });
      });

      describe('when state.showCloseButton is false', () => {
        beforeEach(() => {
          embedWrapper.showCloseButton(false);
        });

        it('should not render the close button', () => {
          expect(embedWrapperComponent.querySelector('.Icon--close'))
            .toBeNull();
        });
      });
    });
  });
});
