describe('Attachment component', function() {
  let Attachment,
    component,
    attachment,
    icon,
    mockAttachmentSender,
    mockHandleRemoveAttachment,
    mockHandleOnUpload,
    mockUploadAbort,
    mockUpdateAttachmentsList;
  const attachmentPath = buildSrcPath('component/Attachment');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span
                className={this.props.className}
                onClick={this.props.onClick}
                type={`${this.props.type}`}>
                <svg />
              </span>
            );
          }
        })
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(attachmentPath);
    Attachment = requireUncached(attachmentPath).Attachment;

    mockUploadAbort = jasmine.createSpy('mockUploadAbort');
    mockAttachmentSender = jasmine.createSpy('mockAttachmentSender').and.returnValue({
      abort: mockUploadAbort
    });
    mockHandleRemoveAttachment = jasmine.createSpy('mockHandleRemoveAttachment');
    mockHandleOnUpload = jasmine.createSpy('mockHandleOnUpload');
    mockUpdateAttachmentsList = jasmine.createSpy('mockUpdateAttachmentsList');

    attachment = {
      id: 1,
      file: { name: 'foo.bar' },
      error: { message: 'Some error' }
    };
    icon = 'Icon--preview-default';

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('when there is no initial attachment error', () => {
    beforeEach(function() {
      attachment = {
        id: 1,
        file: { name: 'foo.bar' }
      };

      component = domRender(
        <Attachment
          attachment={attachment}
          attachmentSender={mockAttachmentSender}
          handleRemoveAttachment={mockHandleRemoveAttachment}
          handleOnUpload={mockHandleOnUpload}
          updateAttachmentsList={mockUpdateAttachmentsList}
          icon={icon} />
      );
    });

    it('calls attachmentSender if the file hasnt been uploaded', () => {
      expect(mockAttachmentSender)
        .toHaveBeenCalled();
    });

    it('calls updateAttachmentsList', () => {
      jasmine.clock().tick(1);

      expect(mockUpdateAttachmentsList)
        .toHaveBeenCalled();
    });

    describe('#handleRemoveAttachment', () => {
      it('calls the handleRemoveAttachment prop', () => {
        component.handleRemoveAttachment();

        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalled();
      });
    });

    describe('when the attachment is successfully uploaded', () => {
      beforeEach(function() {
        const upload = JSON.stringify({ upload: { token: '12345' } });
        const response = { text: upload };

        mockAttachmentSender.calls.mostRecent().args[1](response);
      });

      it('calls handleOnUpload', () => {
        expect(mockHandleOnUpload)
          .toHaveBeenCalledWith(1, '12345');
      });

      it('calls updateAttachmentsList', () => {
        jasmine.clock().tick(1);

        expect(mockUpdateAttachmentsList)
          .toHaveBeenCalled();
      });
    });

    describe('when the attachment is not successfully uploaded', () => {
      let response;

      beforeEach(function() {
        response = { message: 'Some upload error' };
        mockAttachmentSender.calls.mostRecent().args[2](response);
      });

      it('sets the uploadError', () => {
        expect(component.state.uploadError)
          .toBe(response.message);
      });

      it('calls updateAttachmentsList', () => {
        expect(mockUpdateAttachmentsList)
          .toHaveBeenCalled();
      });
    });

    describe('#handleStopUpload', () => {
      it('calls the abort method of the attachmentSender object', () => {
        component.handleStopUpload();

        expect(mockUploadAbort)
          .toHaveBeenCalled();
      });
    });
  });

  describe('when there is an initial attachment error', () => {
    beforeEach(function() {
      attachment = {
        id: 1,
        file: { name: 'foo.bar' },
        error: { message: 'Some error' }
      };

      component = domRender(
        <Attachment
          attachment={attachment}
          attachmentSender={mockAttachmentSender}
          updateAttachmentsList={mockUpdateAttachmentsList}
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
