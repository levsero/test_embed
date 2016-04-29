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
      const attachments = [{ name: 'test.txt' }];

      const previews = getAttachmentPreviews(attachments, noop);

      expect(previews[0].props.attachment)
        .toEqual(attachments[0]);
    });

    describe('iconMapper', function() {
      it('maps pdfs correctly', function() {
        const attachments = [{ name: 'test.pdf' }];

        const previews = getAttachmentPreviews(attachments, noop);

        expect(previews[0].props.icon)
          .toEqual('Icon--preview-pdf');
      });

      it('maps keynotes correctly', function() {
        const attachments = [{ name: 'test.key' }];

        const previews = getAttachmentPreviews(attachments, noop);

        expect(previews[0].props.icon)
          .toEqual('Icon--preview-key');
      });

      it('maps numbers correctly', function() {
        const attachments = [{ name: 'test.numbers' }];

        const previews = getAttachmentPreviews(attachments, noop);

        expect(previews[0].props.icon)
          .toEqual('Icon--preview-num');
      });

      it('maps pages correctly', function() {
        const attachments = [{ name: 'test.pages' }];

        const previews = getAttachmentPreviews(attachments, noop);

        expect(previews[0].props.icon)
          .toEqual('Icon--preview-pag');
      });

      it('maps imgs correctly', function() {
        const attachments = [
          { name: 'test.img' },
          { name: 'test.png' },
          { name: 'test.jpeg' },
          { name: 'test.gif' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-img');
        });
      });

      it('maps documents correctly', function() {
        const attachments = [
          { name: 'test.doc' },
          { name: 'test.docx' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-doc');
        });
      });

      it('maps powerpoints correctly', function() {
        const attachments = [
          { name: 'test.ppt' },
          { name: 'test.pptx' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-ppt');
        });
      });

      it('maps text files correctly', function() {
        const attachments = [
          { name: 'test.txt' },
          { name: 'test.rtf' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-txt');
        });
      });

      it('maps spreadsheets correctly', function() {
        const attachments = [
          { name: 'test.xls' },
          { name: 'test.xlsx' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-xls');
        });
      });

      it('falls back to default icon if it is not recognised', function() {
        const attachments = [
          { name: 'test.svg' },
          { name: 'test.mp4' },
          { name: 'test.somestrangeextenstioniveneverseen' }
        ];

        const previews = getAttachmentPreviews(attachments, noop);

        previews.forEach(function(preview) {
          expect(preview.props.icon)
            .toEqual('Icon--preview-default');
        });
      });
    });
  });
});
