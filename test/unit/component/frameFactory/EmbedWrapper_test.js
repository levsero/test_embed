describe('EmbedWrapper', () => {
  let EmbedWrapper;

  const EmbedWrapperPath = buildSrcPath('component/frameFactory/EmbedWrapper');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/color': {},
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'isRTL', 'getLocale'])
      },
      'component/button/ButtonNav': {
        ButtonNav: noopReactComponent()
      },
      'lodash': _,
      'component/Icon': {
        Icon: noop
      }
    });

    EmbedWrapper = requireUncached(EmbedWrapperPath).EmbedWrapper;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('adds a <style> block to the iframe document', () => {
    const instance = domRender(
      <EmbedWrapper
        childFn={noop}
        baseCSS='.base-css-file {}' />
    );
    const styleBlock = ReactDOM.findDOMNode(instance).getElementsByTagName('style')[0];

    expect(styleBlock.innerHTML.indexOf('.base-css-file {}') >= 0)
      .toBeTruthy();
  });
});
