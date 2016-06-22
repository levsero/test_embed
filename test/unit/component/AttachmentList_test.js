describe('AttachmentList component', () => {
  let AttachmentList,
    component,
    mockUpdateForm,
    mockAttachmentSender;
  const attachmentListPath = buildSrcPath('component/AttachmentList');
  const maxFileLimit = 5;
  const maxFileSize = 5 * 1024 * 1024;

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
    mockAttachmentSender = jasmine.createSpy('mockAttachmentSender');

    component = instanceRender(
      <AttachmentList
        attachmentSender={mockAttachmentSender}
        updateAttachments={noop}
        maxFileLimit={maxFileLimit}
        maxFileSize={maxFileSize}
        updateForm={mockUpdateForm} />
    );

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
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
          attachmentSender={mockAttachmentSender}
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

    describe('when there are no valid attachments', () => {
      it('has a label with the embeddable_framework.submitTicket.attachments.title string', () => {
        component.handleOnDrop([{ name: 'bob.gif', size: maxFileSize + 1024 }]);

        let label = document.querySelector('label.Form-fieldLabel').innerHTML;

        expect(label)
          .toEqual('embeddable_framework.submitTicket.attachments.title');

        component.handleOnDrop([{ name: 'jim.gif', size: 1024 }]);
        mockAttachmentSender.calls.mostRecent().args[2]({ message: 'Some error' });

        label = document.querySelector('label.Form-fieldLabel').innerHTML;

        expect(label)
          .toEqual('embeddable_framework.submitTicket.attachments.title');
      });
    });

    describe('when there are some valid attachments', () => {
      it('has a label with the embeddable_framework.submitTicket.attachments.title_withCount string', () => {
        const upload = JSON.stringify({ upload: { token: '12345' } });

        component.handleOnDrop([{ name: 'bob.gif', size: 1024 }]);
        mockAttachmentSender.calls.mostRecent().args[1]({ text: upload });

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

      expect(previews[0].props.file)
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

        component.handleRemoveAttachment(attachmentToRemove.id);
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

    it('calls updateForm', () => {
      component.handleOnDrop(attachments);

      expect(mockUpdateForm)
        .toHaveBeenCalled();
    });

    describe('when there is space for all new attachments', () => {
      it('should add all the attachments', () => {
        component.handleOnDrop(attachments);

        expect(component.state.attachments.length)
          .toBe(2);

        const moreAttachments = [
          { name: 'foo', size: 1024 },
          { name: 'bar', size: 1024 },
          { name: 'bob', size: 1024 }
        ];

        component.handleOnDrop(moreAttachments);

        expect(component.state.attachments.length)
          .toBe(5);
      });
    });

    describe('when there is not space for all new attachments', () => {
      it('should only add new attachments up to the max limit of 5', () => {
        component.handleOnDrop(attachments);

        expect(component.state.attachments.length)
          .toBe(2);

        const moreAttachments = [
          { name: 'foo', size: 1024 },
          { name: 'bar', size: 1024 },
          { name: 'bob', size: 1024 },
          { name: 'tim', size: 1024 },
          { name: 'jim', size: 1024 }
        ];

        component.handleOnDrop(moreAttachments);

        expect(component.state.attachments.length)
          .toBe(5);

        expect(component.state.errorMessage)
          .toBe('embeddable_framework.submitTicket.attachments.error.limit');
      });
    });

    describe('when there is no space for new attachments', () => {
      it('should not add any new attachments', () => {
        attachments.push(
          { name: 'bob', size: 1024 },
          { name: 'jim', size: 1024 },
          { name: 'dan', size: 1024 }
        );

        component.handleOnDrop(attachments);

        component.handleOnDrop([{ name: 'fat', size: 1024 }]);

        expect(component.state.attachments.length)
          .toBe(5);

        expect(component.state.errorMessage)
          .toBe('embeddable_framework.submitTicket.attachments.error.limit');
      });
    });

    describe('when an attachment exceeds the maximum filesize', () => {
      it('should add an error to the attachment', () => {
        attachments.push({ name: 'fatty', size: maxFileSize + 1024 });

        component.handleOnDrop(attachments);

        expect(component.state.attachments[2].errorMessage)
          .toBeTruthy();
      });
    });
  });

  describe('createAttachment', () => {
    const file = { name: 'bob.gif', size: maxFileSize + 1024 };

    describe('when there is no attachment error', () => {
      it('should call attachment sender', () => {
        component.createAttachment(file);

        expect(mockAttachmentSender)
          .toHaveBeenCalled();
      });

      it('should return an attachment object with no error', () => {
        expect(component.createAttachment(file).errorMessage)
          .toBeFalsy();
      });
    });

    describe('when there is an attachment error', () => {
      it('should not call attachment sender', () => {
        component.createAttachment(file, 'Some error');

        expect(mockAttachmentSender)
          .not.toHaveBeenCalled();
      });

      it('should return an attachment object with an error', () => {
        expect(component.createAttachment(file, 'someError').errorMessage)
          .toBeTruthy();
      });
    });
  });

  describe('numValidAttachments', () => {
    it('should return the number of valid attachments', () => {
      component.handleOnDrop([
        { name: 'foo.txt', size: maxFileSize + 1024 },
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);

      const upload = JSON.stringify({ upload: { token: '12345' } });

      mockAttachmentSender.calls.mostRecent().args[1]({ text: upload });

      expect(component.numValidAttachments())
        .toBe(1);
    });
  });

  describe('attachmentsReady', () => {
    it('should return true if there are no attachment errors or uploading attachments', () => {
      component.handleOnDrop([
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);

      const upload = JSON.stringify({ upload: { token: '12345' } });
      const calls = mockAttachmentSender.calls;

      calls.argsFor(0)[1]({ text: upload });
      calls.argsFor(1)[1]({ text: upload });

      expect(component.attachmentsReady())
        .toBe(true);
    });

    it('should return false if there are attachment errors', () => {
      component.handleOnDrop([
        { name: 'jim.png', size: maxFileSize + 1024 }
      ]);

      expect(component.attachmentsReady())
        .toBe(false);
    });

    it('should return false if there are uploading attachments', function() {
      component.handleOnDrop([
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);

      expect(component.attachmentsReady())
        .toBe(false);
    });
  });

  describe('when an attachment is successfully uploaded', () => {
    beforeEach(function() {
      component.handleOnDrop([{ name: 'bob.gif', size: 1024 }]);

      const upload = JSON.stringify({ upload: { token: '12345' } });
      const response = { text: upload };

      mockAttachmentSender.calls.mostRecent().args[1](response);
    });

    it('sets the upload token', () => {
      expect(component.state.attachments[0].uploadToken)
        .toBe('12345');
    });

    it('sets uploading to false', () => {
      expect(component.state.attachments[0].uploading)
        .toBe(false);
    });

    it('calls updateForm', () => {
      jasmine.clock().tick(1);

      expect(mockUpdateForm)
        .toHaveBeenCalled();
    });
  });

  describe('when an attachment is not successfully uploaded', () => {
    beforeEach(function() {
      component.handleOnDrop([{ name: 'bob.gif', size: 1024 }]);

      const response = { message: 'Some error' };

      mockAttachmentSender.calls.mostRecent().args[2](response);
    });

    it('does not set the upload token', () => {
      expect(component.state.attachments[0].uploadToken)
        .toBeFalsy();
    });

    it('sets the error message', () => {
      expect(component.state.attachments[0].errorMessage)
        .toBe('Some error');
    });

    it('calls updateForm', () => {
      jasmine.clock().tick(1);

      expect(mockUpdateForm)
        .toHaveBeenCalled();
    });
  });

  describe('when an attachment receives an on progress event', () => {
    it('sets the uploadProgress', () => {
      component.handleOnDrop([{ name: 'bob.gif', size: 1024 }]);

      const response = { percent: 20 };

      mockAttachmentSender.calls.mostRecent().args[3](response);

      expect(component.state.attachments[0].uploadProgress)
        .toBe(20);
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
