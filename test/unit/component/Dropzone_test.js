describe('Dropzone component', () => {
  let Dropzone;
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

  describe('onDragEnter', () => {
    let dropzone;

    beforeEach(() => {
      dropzone = domRender(<Dropzone onDragEnter={jasmine.createSpy()} />);
      dropzone.onDragEnter({ preventDefault: noop });
    });

    it('should increase the enterCounter', () => {
      expect(dropzone.enterCounter)
        .toEqual(1);
    });

    it('should call the onDragEnter prop', () => {
      expect(dropzone.props.onDragEnter)
        .toHaveBeenCalled();
    });

    it('should set dragActive to true', () => {
      expect(dropzone.state.isDragActive)
        .toEqual(true);
    });
  });

  describe('onDragLeave', () => {
    let dropzone;

    beforeEach(() => {
      dropzone = domRender(<Dropzone onDragLeave={jasmine.createSpy()} />);
      dropzone.onDragEnter({ preventDefault: noop });
      dropzone.onDragLeave({ preventDefault: noop });
    });

    it('should decrease the enterCounter', () => {
      expect(dropzone.enterCounter)
        .toEqual(0);
    });

    it('should call the onDragLeave prop', () => {
      expect(dropzone.props.onDragLeave)
        .toHaveBeenCalled();
    });

    it('should set dragActive to false', () => {
      expect(dropzone.state.isDragActive)
        .toEqual(false);
    });

    describe('when there are multiple children entered', () => {
      beforeEach(() => {
        dropzone = domRender(<Dropzone onDragLeave={jasmine.createSpy()} />);
        dropzone.onDragEnter({ preventDefault: noop });
        dropzone.onDragEnter({ preventDefault: noop });
        dropzone.onDragLeave({ preventDefault: noop });
      });

      it('should not call the onDragLeave prop', () => {
        expect(dropzone.props.onDragLeave)
          .not.toHaveBeenCalled();
      });

      it('should not set dragActive to false', () => {
        expect(dropzone.state.isDragActive)
          .toEqual(true);
      });
    });
  });

  describe('onDrop', () => {
    let dropzone, files;

    beforeEach(() => {
      files = [{
        name: 'file1.pdf',
        size: 1111
      }];

      dropzone = domRender(<Dropzone onDrop={jasmine.createSpy()} />);
      dropzone.onDrop({
        preventDefault: noop,
        dataTransfer: { files: files }
      });
    });

    it('should set the enterCounter to 0', () => {
      expect(dropzone.enterCounter)
        .toEqual(0);
    });

    it('should set dragActive to false', () => {
      expect(dropzone.state.isDragActive)
        .toEqual(false);
    });

    it('should call the onDrop prop with the dropped files', () => {
      expect(dropzone.props.onDrop)
        .toHaveBeenCalled();
      expect(dropzone.props.onDrop.calls.mostRecent().args[0])
        .toEqual(files);
    });
  });
});

