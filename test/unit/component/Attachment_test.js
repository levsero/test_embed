describe('Attachment component', function() {
  let Attachment,
    component,
    attachment,
    icon,
    mockAttachmentSender,
    mockHandleRemoveAttachment,
    mockHandleOnUpload,
    mockUploadAbort;
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

    attachment = {
      id: 1,
      file: { name: 'foo.bar' },
      error: { message: 'Some error' }
    };
    icon = 'Icon--preview-default';

    component = domRender(
      <Attachment
        attachment={attachment}
        attachmentSender={mockAttachmentSender}
        handleOnUpload={mockHandleOnUpload}
        addAttachmentError={noop}
        handleRemoveAttachment={mockHandleRemoveAttachment}
        icon={icon} />
    );

    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('when there is no attachment error', () => {
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
          icon={icon} />
      );
    });

    it('calls attachmentSender if the file hasnt been uploaded', () => {
      expect(mockAttachmentSender)
        .toHaveBeenCalled();
    });

    describe('#handleRemoveAttachment', () => {
      it('calls the handleRemoveAttachment prop', () => {
        component.handleRemoveAttachment();

        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalled();
      });
    });

    describe('#handleOnUpload', () => {
      it('gets called after successful upload', () => {
        const upload = JSON.stringify({ upload: { token: '12345' } });
        const response = { text: upload };

        mockAttachmentSender.calls.mostRecent().args[1](response);

        expect(mockHandleOnUpload)
          .toHaveBeenCalledWith(1, '12345');
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

  describe('when there is an attachment error', () => {
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
