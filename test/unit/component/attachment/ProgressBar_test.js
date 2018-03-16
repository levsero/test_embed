describe('ProgressBar component', () => {
  let ProgressBar;
  const progressBarPath = buildSrcPath('component/attachment/ProgressBar');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ProgressBar.scss': {
        locals: {
          container: 'container',
          progressBar: 'progressBar',
          fakeProgressAnimation: 'fakeProgressAnimation'
        }
      }
    });

    mockery.registerAllowable(progressBarPath);
    ProgressBar = requireUncached(progressBarPath).ProgressBar;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let component,
      percentLoaded,
      fakeProgress,
      element,
      innerEl;

    beforeEach(() => {
      component = domRender(<ProgressBar
          percentLoaded={percentLoaded}
          fakeProgress={fakeProgress}
      />);
      element = component.render();
      innerEl = element.props.children;
    });

    it('renders a wrapping container', () => {
      expect(element.props.className).toEqual('container');
    });

    it('renders a progress bar inside the wrapping container', () => {
      expect(innerEl.props.className).toEqual('progressBar');
    });

    describe('initially', () => {
      it('defaults to displaying 0%', () => {
        expect(innerEl.props.style.width).toEqual('0%');
      });
    });

    describe('when provided a `percentLoaded` prop', () => {
      beforeAll(() => {
        percentLoaded = 25;
      });

      it('varies the width of the progress bar accordingly', () => {
        expect(innerEl.props.style.width).toEqual(`${percentLoaded}%`);
      });
    });

    describe('when provided a float as the `percentLoaded` value', () => {
      beforeAll(() => {
        percentLoaded = 33.33;
      });

      it('rounds the value down before setting the progress bar width', () => {
        expect(innerEl.props.style.width).toEqual('33%');
      });
    });

    describe('when `fakeProgress` is true', () => {
      beforeAll(() => {
        fakeProgress = true;
      });

      it('applies fake animation styles to the progress bar', () => {
        expect(innerEl.props.className).toContain('fakeProgressAnimation');
      });
    });
  });
});
