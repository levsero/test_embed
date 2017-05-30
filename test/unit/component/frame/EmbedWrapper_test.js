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
            return <div className={this.props.className} />;
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
        Icon: noopReactComponent()
      },
      './EmbedWrapper.sass': {
        locals: {
          'closeBtn': 'closeBtn',
          'backBtn': 'backBtn'
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
  });

  describe('styles', () => {
    let embedWrapperNode,
      result;

    describe('when i18n locale is RTL', () => {
      beforeEach(() => {
        mockIsRTL = true;

        const embedWrapper = domRender(
          <EmbedWrapper childFn={noop} />
        );

        embedWrapper.showBackButton(true);
        embedWrapperNode = ReactDOM.findDOMNode(embedWrapper);
      });

      describe('back navButton', () => {
        it('should contain backBtn styles', () => {
          result = embedWrapperNode.querySelector('.backBtn');

          expect(result)
            .toBeTruthy();
        });
      });

      describe('close navButton', () => {
        it('should contain closeBtn styles', () => {
          result = embedWrapperNode.querySelector('.closeBtn');

          expect(result)
            .toBeTruthy();
        });
      });
    });

    describe('when i18n locale is LTR', () => {
      beforeEach(() => {
        mockIsRTL = false;

        const embedWrapper = domRender(
          <EmbedWrapper
            childFn={noop}
            isRTL={false} />
        );

        embedWrapper.showBackButton(true);
        embedWrapperNode = ReactDOM.findDOMNode(embedWrapper);
      });

      describe('back navButton', () => {
        it('should not contain backBtn styles', () => {
          result = embedWrapperNode.querySelector('.backBtn');

          expect(result)
            .toBeFalsy();
        });
      });

      describe('close navButton', () => {
        it('should not contain closeBtn styles', () => {
          result = embedWrapperNode.querySelector('.closeBtn');

          expect(result)
            .toBeFalsy();
        });
      });
    });

    describe('when fullscreen is true', () => {
      beforeEach(() => {
        mockIsRTL = true;

        const embedWrapper = domRender(
          <EmbedWrapper
            childFn={noop}
            fullscreen={true} />
        );

        embedWrapper.showBackButton(true);
        embedWrapperNode = ReactDOM.findDOMNode(embedWrapper);
      });

      describe('back navButton', () => {
        it('should not contain styles', () => {
          result = embedWrapperNode.querySelector('.backBtn');

          expect(result)
            .toBeFalsy();
        });
      });

      describe('close navButton', () => {
        it('should not contain styles', () => {
          result = embedWrapperNode.querySelector('.closeBtn');

          expect(result)
            .toBeFalsy();
        });
      });
    });

    describe('when fullscreen is false', () => {
      beforeEach(() => {
        mockIsRTL = true;

        const embedWrapper = domRender(
          <EmbedWrapper
            childFn={noop}
            fullscreen={false} />
        );

        embedWrapper.showBackButton(true);
        embedWrapperNode = ReactDOM.findDOMNode(embedWrapper);
      });

      describe('back navButton', () => {
        it('should contain desktop styles', () => {
          result = embedWrapperNode.querySelector('.backBtn');

          expect(result)
            .toBeTruthy();
        });
      });

      describe('close navButton', () => {
        it('should contain desktop styles', () => {
          result = embedWrapperNode.querySelector('.closeBtn');

          expect(result)
            .toBeTruthy();
        });
      });
    });
  });
});
