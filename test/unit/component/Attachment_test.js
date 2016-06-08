describe('Attachment component', function() {
  let Attachment,
    component,
    attachment,
    icon,
    mockAttachmentSender,
    mockHandleRemoveAttachment,
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
    mockAttachmentSender = jasmine.createSpy('mockAttachmentSender').and.returnValue({
      abort: mockUploadAbort
    });
    mockHandleRemoveAttachment = jasmine.createSpy('mockHandleRemoveAttachment');

    attachment = { name: 'foo.bar' };
    icon = 'Icon--preview-default';

    component = domRender(
      <Attachment
        attachment={attachment}
        attachmentSender={mockAttachmentSender}
        handleRemoveAttachment={mockHandleRemoveAttachment}
        icon={icon} />
    );
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('calls attachmentSender if the file hasnt been uploaded', () => {
    expect(mockAttachmentSender)
      .toHaveBeenCalled();
  });

  it('does not call attachmentSender if the file has been uploaded');

  it('does not call attachmentSender if the file is uploading');

  it('does not call attachmentSender if there was an error uploading the file');

  describe('#handleRemoveAttachment', () => {
    it('calls the handleRemoveAttachment prop', () => {
      component.handleRemoveAttachment();

      expect(mockHandleRemoveAttachment)
        .toHaveBeenCalled();
    });
  });

  describe('#handleStopUpload', () => {
    it('calls the abort method of the attachmentSender object', () => {
      component.handleStopUpload();

      expect(mockUploadAbort)
        .toHaveBeenCalled;
    });
  });
});
