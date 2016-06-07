describe('AttachmentList component', () => {
  let AttachmentList,
    component;
  const attachmentListPath = buildSrcPath('component/AttachmentList');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Attachment': {
        Attachment: React.createClass({
          render: function() {
            return (
              <div
                attachment={{}}
                handleRemoveAttachment={noop}
                attachmentSender={noop}
                icon='' />
            );
          }
        })
      },
      'component/Button': {
        ButtonDropzone: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'lodash': _
    });

    mockery.registerAllowable(attachmentListPath);
    AttachmentList = requireUncached(attachmentListPath).AttachmentList;

    component = instanceRender(
      <AttachmentList attachmentSender={noop} updateAttachments={noop} />
    );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('initializes with an empty array for state.attachments', function() {
    expect(component.state.attachments)
      .toEqual([]);
  });

  describe('#render', () => {
    beforeEach(() => {
      component = domRender(
        <AttachmentList attachmentSender={noop} updateAttachments={noop} />
      );
    });

    describe('when there are no attachments', () => {
      it('has a label that with the embeddable_framework.submitTicket.attachments.title string', () => {
        const label = document.querySelector('label.Form-fieldLabel').innerHTML;

        expect(label)
          .toEqual('embeddable_framework.submitTicket.attachments.title');
      });
    });

    describe('when there are some attachments', () => {
      beforeEach(() => {
        component.handleOnDrop([{ name: 'bob.gif' }]);
      });

      it('has a label with the embeddable_framework.submitTicket.attachments.title_withCount string', () => {
        const label = document.querySelector('label.Form-fieldLabel').innerHTML;

        expect(label)
          .toEqual('embeddable_framework.submitTicket.attachments.title_withCount');
      });
    });
  });

  describe('#renderAttachments', () => {
    it('renders Attachment components with the attachment objects', function() {
      const attachments = [{ name: 'test.foo.txt' }];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      expect(previews[0].props.attachment)
        .toEqual(attachments[0]);
      expect(previews[0].props.icon)
        .toEqual('Icon--preview-txt');
    });

    it('maps pdfs correctly', function() {
      const attachments = [{ name: 'test.pdf' }];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-pdf');
    });

    it('maps keynotes correctly', function() {
      const attachments = [{ name: 'test.key' }];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-key');
    });

    it('maps numbers correctly', function() {
      const attachments = [{ name: 'test.numbers' }];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-num');
    });

    it('maps pages correctly', function() {
      const attachments = [{ name: 'test.pages' }];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-pag');
    });

    it('maps imgs correctly', function() {
      const attachments = [
        { name: 'test.img' },
        { name: 'test.png' },
        { name: 'test.jpeg' },
        { name: 'test.jpg' },
        { name: 'test.gif' }
      ];

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

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

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

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

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

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

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

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

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

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

      component.handleOnDrop(attachments);

      const previews = component.renderAttachments();

      previews.forEach(function(preview) {
        expect(preview.props.icon)
          .toEqual('Icon--preview-default');
      });
    });
  });

  describe('handleRemoveAttachment', () => {
    beforeEach(() => {
      const attachments = [
        'foo',
        'bar'
      ];

      component.handleOnDrop(attachments);
    });

    it('removes the attachment matching the passed in argument', () => {
      component.handleRemoveAttachment('foo');

      expect(component.state.attachments.length)
        .toEqual(1);

      expect(component.state.attachments[0])
        .toEqual('bar');
    });
  });

  describe('handleOnDrop', () => {
    it('adds the passed in attachments to state.attachments', () => {
      const attachments = [
        'foo',
        'bar'
      ];

      component.handleOnDrop(attachments);

      expect(component.state.attachments)
        .toEqual(attachments);
    });
  });
});
