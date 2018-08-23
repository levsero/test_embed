describe('window', () => {
  let initResizeMonitor;

  const windowPath = buildSrcPath('util/window');
  const onZoomSpy = jasmine.createSpy('onZoom');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'service/renderer': {
        renderer: {
          onZoom: onZoomSpy
        }
      }
    });

    initResizeMonitor = require(windowPath).initResizeMonitor;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initResizeMonitor', () => {
    const addEventListenerSpy = jasmine.createSpy('addEventListener');
    const mockWindow = {
      addEventListener: addEventListenerSpy
    };

    beforeEach(() => {
      spyOn(_, 'debounce').and.callFake((cb) => () => cb());
      initResizeMonitor(mockWindow);
    });

    it('calls addEventListers with the correct params', () => {
      expect(addEventListenerSpy)
        .toHaveBeenCalledWith('resize', jasmine.any(Function));
    });

    describe('event listener function', () => {
      let listener;

      beforeEach(() => {
        listener = addEventListenerSpy.calls.mostRecent().args[1];
        listener();
      });

      it('calls lodash debounce', () => {
        expect(_.debounce)
          .toHaveBeenCalled();
      });

      it('calls renderer.onZoom', () => {
        expect(onZoomSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
