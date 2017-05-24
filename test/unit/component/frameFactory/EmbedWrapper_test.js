describe('EmbedWrapper', () => {
  let EmbedWrapper,
    mockIsRTL;

  const EmbedWrapperPath = buildSrcPath('component/frameFactory/EmbedWrapper');

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
            return <div className={this.props.className} />
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
        Icon: noop
      },
      './EmbedWrapper.sass': {
        locals: {
          'closeBtn': 'closeBtn',
          'closeBtnMobile': 'closeBtnMobile',
          'backBtn': 'backBtn',
          'backBtnMobile': 'backBtnMobile'
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
        it('should contain mobile styles', () => {
          result = embedWrapperNode.querySelector('.backBtnMobile');

          expect(result)
            .toBeTruthy();
        });
      });

      describe('close navButton', () => {
        it('should contain mobile styles', () => {
          result = embedWrapperNode.querySelector('.closeBtnMobile');

          expect(result)
            .toBeTruthy();
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
