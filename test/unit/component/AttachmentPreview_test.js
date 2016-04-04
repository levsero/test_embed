describe('AttachmentPreview component', function() {
  let getAttachmentPreviews;
  const attachmentPreviewPath = buildSrcPath('component/AttachmentPreview');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    mockery.registerAllowable(attachmentPreviewPath);

    getAttachmentPreviews = requireUncached(attachmentPreviewPath).getAttachmentPreviews;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getAttachmentPreviews', function() {
    it('Creates preview components with the attachment objects', function() {
      const attachments = [{ title: 'test' }];

      const previews = getAttachmentPreviews(attachments, noop);

      expect(previews[0].props.attachment)
        .toEqual(attachments[0]);
    });
  });
});
