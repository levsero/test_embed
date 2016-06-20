describe('AttachmentList component', () => {
  let AttachmentList,
    component,
    mockUpdateForm,
    mockAttachmentState;
  const attachmentListPath = buildSrcPath('component/AttachmentList');
  const maxFileLimit = 5;
  const maxFileSize = 5 * 1024 * 1024;

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockAttachmentState = {
      uploading: false,
      uploadError: null,
      uploadRequestSender: () => {}
    };

    initMockRegistry({
      'React': React,
      'component/Attachment': {
        Attachment: React.createClass({
          getInitialState: () => mockAttachmentState,
          render: function() {
            return (
              <div
                ref={_.uniqueId()}
                attachment={{}}
                handleRemoveAttachment={noop}
                updateAttachmentsList={noop}
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

    mockUpdateForm = jasmine.createSpy('updateForm');

    component = instanceRender(
      <AttachmentList
        attachmentSender={noop}
        updateAttachments={noop}
        maxFileLimit={maxFileLimit}
        maxFileSize={maxFileSize}
        updateForm={mockUpdateForm} />
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
        <AttachmentList
          attachmentSender={noop}
          updateAttachments={noop}
          maxFileLimit={maxFileLimit}
          maxFileSize={maxFileSize}
          updateForm={noop} />
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

      expect(previews[0].props.attachment.file)
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
        { name: 'foo', size: 1024 },
        { name: 'bar', size: maxFileSize + 1024 }
      ];

      component.handleOnDrop(attachments);
    });

    it('removes the attachment matching the passed in argument', () => {
      const attachmentToRemove = component.state.attachments[0];

      component.handleRemoveAttachment(attachmentToRemove.id);

      expect(component.state.attachments.length)
        .toBe(1);

      expect(component.state.attachments[0].file.name)
        .toBe('bar');
    });

    describe('when the attachment has an error', () => {
      beforeEach(function() {
        const attachmentToRemove = component.state.attachments[1];

        component.handleRemoveAttachment(attachmentToRemove.id, attachmentToRemove.error);
      });

      it('should call updateForm', () => {
        expect(mockUpdateForm)
          .toHaveBeenCalled();
      });
    });
  });

  describe('handleOnDrop', () => {
    let attachments;

    beforeEach(function() {
      attachments = [
        { name: 'foo', size: 1024 },
        { name: 'bar', size: 1024 }
      ];
    });

    it('adds the passed in attachments to state.attachments', () => {
      component.handleOnDrop(attachments);

      expect(component.state.attachments.length)
        .toBe(2);
    });

    it('calls updateForm', () => {
      component.handleOnDrop(attachments);

      expect(mockUpdateForm)
        .toHaveBeenCalled();
    });

    describe('when too many attachments are selected in one go', () => {
      beforeEach(function() {
        attachments.push(
          { name: 'bob', size: 1024 },
          { name: 'jim', size: 1024 },
          { name: 'tim', size: 1024 },
          { name: 'dan', size: 1024 }
        );
      });

      it('only adds the attachments up to the maximum', () => {
        component.handleOnDrop(attachments);

        expect(component.state.attachments.length)
          .toBe(5);
      });
    });

    describe('when too many attachments are selected', () => {
      it('only adds the attachments up to the maximum', () => {
        component.handleOnDrop(attachments);

        expect(component.state.attachments.length)
          .toBe(2);

        const newAttachments = [
          { name: 'foo', size: 1024 },
          { name: 'bar', size: 1024 },
          { name: 'bob', size: 1024 },
          { name: 'jim', size: 1024 }
        ];

        component.handleOnDrop(newAttachments);

        expect(component.state.attachments.length)
          .toBe(5);
      });
    });

    describe('when an attachment exceeds the maximum filesize', () => {
      it('should add an error to the attachment', () => {
        attachments.push({ name: 'fatty', size: maxFileSize + 1024 });

        component.handleOnDrop(attachments);

        expect(component.state.attachments[2].error)
          .toBeTruthy();
      });
    });
  });

  describe('attachmentsReady', () => {
    let attachments;

    beforeEach(function() {
      component = domRender(
        <AttachmentList
          attachmentSender={noop}
          updateAttachments={noop}
          maxFileLimit={maxFileLimit}
          maxFileSize={maxFileSize}
          updateForm={noop} />
      );

      attachments = [
        { name: 'foo.txt', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ];

      component.handleOnDrop(attachments);
    });

    it('should return true if there are no attachment errors or uploading attachments', () => {
      expect(component.attachmentsReady())
        .toBeTruthy();
    });

    it('should return false if there are attachment errors', () => {
      mockAttachmentState.uploadError = 'Some error';

      component.handleOnDrop(attachments);

      expect(component.attachmentsReady())
        .toBeFalsy();
    });

    it('should return false if there are uploading attachments', function() {
      mockAttachmentState.uploadError = null;
      mockAttachmentState.uploading = true;

      component.handleOnDrop(attachments);

      expect(component.attachmentsReady())
        .toBeFalsy();
    });
  });

  describe('handleOnUpload', () => {
    it('updates attachments to include their upload token', () => {
      component.setState({
        attachments: [
          {
            id: 1,
            file: 'foo',
            uploadedToken: null
          }
        ]
      });

      component.handleOnUpload(1, '12345');

      expect(component.state.attachments[0].uploadToken)
        .toBe('12345');
    });
  });

  describe('getAttachmentTokens', () => {
    it('returns an array of the uploaded tokens', () => {
      component.setState({
        attachments: [
          {
            uploadToken: '12345'
          },
          {
            uploadToken: '54321'
          }
        ]
      });

      const uploadArray = component.getAttachmentTokens();

      expect(uploadArray)
        .toContain('12345');

      expect(uploadArray)
        .toContain('54321');
    });
  });
});
