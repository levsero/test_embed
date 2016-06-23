describe('Attachment component', function() {
  let Attachment,
    component,
    attachment,
    icon,
    mockHandleRemoveAttachment,
    mockUploadRequestSender,
    mockUploadAbort;
  const attachmentPath = buildSrcPath('component/Attachment');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(attachmentPath);
    Attachment = requireUncached(attachmentPath).Attachment;

    mockUploadAbort = jasmine.createSpy('mockUploadAbort');
    mockUploadRequestSender = { abort: mockUploadAbort };
    mockHandleRemoveAttachment = jasmine.createSpy('mockHandleRemoveAttachment');

    attachment = {
      file: { name: 'foo.bar' }
    };

    icon = 'Icon--preview-default';

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleIconClick', () => {
    describe('when the attachment is still uploading', () => {
      beforeEach(function() {
        component = instanceRender(
          <Attachment
            attachmentId='1'
            file={attachment.file}
            uploading={true}
            handleRemoveAttachment={mockHandleRemoveAttachment}
            uploadRequestSender={mockUploadRequestSender}
            icon={icon} />
        );

        component.handleIconClick();
      });

      it('should call the abort method of the attachmentSender object', () => {
        expect(mockUploadAbort)
          .toHaveBeenCalled();
      });

      it('should call the handleRemoveAttachment prop', () => {
        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalled();
      });
    });

    describe('when the attachment is not uploading', () => {
      beforeEach(function() {
        component = instanceRender(
          <Attachment
            attachmentId='1'
            file={attachment.file}
            uploading={false}
            handleRemoveAttachment={mockHandleRemoveAttachment}
            uploadRequestSender={mockUploadRequestSender}
            icon={icon} />
        );

        component.handleIconClick();
      });

      it('should not call the abort method of the attachmentSender object', () => {
        expect(mockUploadAbort)
          .not.toHaveBeenCalled();
      });

      it('should call the handleRemoveAttachment prop', () => {
        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalled();
      });
    });
  });

  describe('when there is an initial attachment error', () => {
    beforeEach(function() {
      attachment = {
        file: { name: 'foo.bar' },
        error: { message: 'Some error' }
      };

      component = domRender(
        <Attachment
          attachmentId='1'
          file={attachment.file}
          errorMessage={attachment.error.message}
          icon={icon} />
      );
    });

    it('should not render the icon', () => {
      expect(() => TestUtils.findRenderedDOMComponentWithClass(component, 'Icon--preview'))
        .toThrow();
    });

    it('should not render the progress bar', () => {
      expect(() => TestUtils.findRenderedDOMComponentWithClass(component, 'Attachment-progress'))
        .toThrow();
    });

    it('should set error classes', () => {
      expect(TestUtils.findRenderedDOMComponentWithClass(component, 'u-borderError'))
        .toBeTruthy();

      expect(TestUtils.findRenderedDOMComponentWithClass(component, 'u-textError'))
        .toBeTruthy();
    });

    it('should set the text body to the error message', () => {
      const secondaryText = TestUtils.findRenderedDOMComponentWithClass(component, 'u-textError').textContent;

      expect(secondaryText)
        .toBe('Some error');
    });
  });
});
