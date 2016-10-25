describe('Dropzone component', () => {
  let Dropzone,
    files = [];
  const dropzonePath = buildSrcPath('component/Dropzone');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(dropzonePath);

    Dropzone = requireUncached(dropzonePath).Dropzone;

    files = [{
      name: 'file1.pdf',
      size: 1111
    }];
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('input', () => {
    let input, dropzone;

    beforeEach(() => {
      dropzone = domRender(<Dropzone />);
      input = document.querySelectorAll('input');
    });

    it('renders a input element', () => {
      expect(input.length)
        .toEqual(1);
    });

    it('sets the ref properly', () => {
      expect(dropzone.fileInputEl)
        .toEqual(input[0]);
    });
  });

  describe('classes', () => {
    let dropzone;

    beforeEach(() => {
      dropzone = domRender(<Dropzone className='foo' activeClassName='bar' />);
    });

    describe('when there is no drag active', () => {
      it('Uses classes passed in from the `classNames` prop', () => {
        expect(document.querySelectorAll('.foo').length)
          .not.toEqual(0);
        expect(document.querySelectorAll('.bar').length)
          .toEqual(0);
      });
    });

    describe('when there is a drag active', () => {
      it('Uses classes passed in from the `classNames` and `activeClassName` props', () => {
        dropzone.onDragEnter({ preventDefault: noop });
        expect(document.querySelectorAll('.foo').length)
          .not.toEqual(0);
        expect(document.querySelectorAll('.bar').length)
          .not.toEqual(0);
      });
    });
  });
});

