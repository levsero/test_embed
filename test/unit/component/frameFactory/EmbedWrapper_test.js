describe('EmbedWrapper', () => {
  let EmbedWrapper;

  const EmbedWrapperPath = buildSrcPath('component/frameFactory/EmbedWrapper');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/color': {},
      'component/button/ButtonNav': {
        ButtonNav: class extends Component {
          render() {
            return <div className={this.props.className} />
          }
        }
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
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

  describe('styles', () => {
    let embedWrapperNode,
      result;

    it('adds a <style> block to the iframe document', () => {
      const embedWrapper = domRender(
        <EmbedWrapper
          childFn={noop}
          baseCSS='.base-css-file {}' />
      );
      const styleBlock = ReactDOM.findDOMNode(embedWrapper).getElementsByTagName('style')[0];

      expect(styleBlock.innerHTML.indexOf('.base-css-file {}') >= 0)
        .toBeTruthy();
    });

    describe('when i18n locale is RTL', () => {
      beforeEach(() => {
        const embedWrapper = domRender(
          <EmbedWrapper
            childFn={noop}
            isRTL={true} />
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
  });
});
