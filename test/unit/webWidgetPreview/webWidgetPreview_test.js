describe('webWidgetPreview entry file', () => {
  const webWidgetPreviewPath = buildSrcPath('webWidgetPreview');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      'react/addons': React,
      'lodash': _,
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      }
    });

    requireUncached(webWidgetPreviewPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('window.zE', () => {
    describe('when window.zE is not already defined', () => {
      it('exposes a new zE global with renderWebWidgetPreview function', () => {
        expect(window.zE)
          .toEqual({ renderWebWidgetPreview: jasmine.any(Function) });
      });
    });

    describe('when window.zE is already defined', () => {
      beforeEach(() => {
        window.zE = () => {};
        requireUncached(webWidgetPreviewPath);
      });

      it('extends it with the renderWebWidgetPreview function', () => {
        expect(window.zE.renderWebWidgetPreview)
          .toEqual(jasmine.any(Function));
      });
    });
  });

  describe('zE.renderWebWidgetPreview', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
    });

    describe('when calling with an element property in options', () => {
      it('should not throw an error', () => {
        expect(() => window.zE.renderWebWidgetPreview({ element }))
          .not.toThrow();
      });

      it('should return an object with setColor and setTitle methods', () => {
        const preview = window.zE.renderWebWidgetPreview({ element });

        expect(preview)
          .toEqual(jasmine.any(Object));

        expect(preview.setColor)
          .toEqual(jasmine.any(Function));

        expect(preview.setTitle)
          .toEqual(jasmine.any(Function));
      });

      it('writes the preview to the DOM', () => {
        window.zE.renderWebWidgetPreview({ element });

        expect(document.body.querySelectorAll('.webwidgetpreview').length)
          .toEqual(1);
      });
    });

    describe('when calling with no element property in options', () => {
      it('should throw an error', () => {
        expect(() => window.zE.renderWebWidgetPreview())
          .toThrow();
      });
    });
  });
});
