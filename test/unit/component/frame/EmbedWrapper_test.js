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

  const hostDocumentFocusSpy = jasmine.createSpy('hostDocumentFocus');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/color/styles': {},
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return {
            querySelector: () => ({
              focus: hostDocumentFocusSpy,
              contentDocument: {
                querySelector: () => ({focus: noop})
              }
            })
          };
        }
      },
      'component/frame/Navigation': noopReactComponent(),
      'lodash': _,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['isRTL'])
      },
      './gardenOverrides': {
        getGardenOverrides: noop
      }
    });

    EmbedWrapper = requireUncached(EmbedWrapperPath).EmbedWrapper;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let instance, styleBlock, rootElem, handleCloseClickMock;

    beforeEach(() => {
      handleCloseClickMock = jasmine.createSpy();
      instance = domRender(
        <EmbedWrapper
          handleCloseClick={handleCloseClickMock}
          baseCSS='.base-css-file {}'>
          <MockChildComponent />
        </EmbedWrapper>
      );

      rootElem = ReactDOM.findDOMNode(instance);
      styleBlock = rootElem.getElementsByTagName('style')[0];
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

    describe('when ESC is pressed', () => {
      it('closes webwidget if focused', () => {
        const target = {
          ownerDocument: {
            defaultView: {
              frameElement: {
                id: 'webWidget'
              }
            }
          }
        };

        TestUtils.Simulate.keyDown(rootElem, { key: 'Escape', keyCode: 27, which: 27, target });
        expect(instance.props.handleCloseClick).toHaveBeenCalled();
      });

      it('does nothing if launcher is focused', () => {
        const target = {
          ownerDocument: {
            defaultView: {
              frameElement: {
                id: 'launcher'
              }
            }
          }
        };

        TestUtils.Simulate.keyDown(rootElem, { key: 'Escape', keyCode: 27, which: 27, target });
        expect(instance.props.handleCloseClick).not.toHaveBeenCalled();
      });
    });

    it('if launcher is focused and TAB is pressed host document receives focus', () => {
      const target = {
        ownerDocument: {
          defaultView: {
            frameElement: {
              id: 'launcher'
            }
          }
        }
      };

      TestUtils.Simulate.keyDown(rootElem, { key: 'Tab', keyCode: 9, which: 9, target });
      expect(hostDocumentFocusSpy).toHaveBeenCalled();
    });
  });
});
