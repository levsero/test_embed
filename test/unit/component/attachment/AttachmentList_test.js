describe('AttachmentList component', () => {
  let AttachmentList,
    component,
    mockUpdateForm,
    mockAttachmentSender,
    mockHandleAttachmentsError;
  const attachmentListPath = buildSrcPath('component/attachment/AttachmentList');
  const maxFileCount = 5;
  const maxFileSize = 5 * 1024 * 1024;

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/attachment/Attachment': {
        Attachment: class Attachment extends Component {
          render() {
            return (
              <div
                handleRemoveAttachment={noop}
                updateAttachmentsList={noop}
                icon='' />
            );
          }
        }
      },
      'component/button/ButtonDropzone': {
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
    mockAttachmentSender = jasmine.createSpy('mockAttachmentSender').and.returnValue({});
    mockHandleAttachmentsError = jasmine.createSpy('handleAttachmentsError');

    component = instanceRender(
      <AttachmentList
        attachmentSender={mockAttachmentSender}
        updateAttachments={noop}
        maxFileCount={maxFileCount}
        maxFileSize={maxFileSize}
        updateForm={mockUpdateForm}
        handleAttachmentsError={mockHandleAttachmentsError} />
    );

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('initializes with an empty object for state.attachments', function() {
    expect(component.state.attachments)
      .toEqual({});
  });

  describe('#render', () => {
    beforeEach(() => {
      component = domRender(
        <AttachmentList
          attachmentSender={mockAttachmentSender}
          updateAttachments={noop}
          maxFileCount={maxFileCount}
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

        jasmine.clock().tick(1);

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

        jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

      const previews = component.renderAttachments();

      expect(previews[0].props.file)
        .toEqual(attachments[0]);
      expect(previews[0].props.icon)
        .toEqual('Icon--preview-txt');
    });

    it('maps pdfs correctly', function() {
      const attachments = [{ name: 'test.pdf' }];

      component.handleOnDrop(attachments);

      jasmine.clock().tick(1);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-pdf');
    });

    it('maps keynotes correctly', function() {
      const attachments = [{ name: 'test.key' }];

      component.handleOnDrop(attachments);

      jasmine.clock().tick(1);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-key');
    });

    it('maps numbers correctly', function() {
      const attachments = [{ name: 'test.numbers' }];

      component.handleOnDrop(attachments);

      jasmine.clock().tick(1);

      const previews = component.renderAttachments();

      expect(previews[0].props.icon)
        .toEqual('Icon--preview-num');
    });

    it('maps pages correctly', function() {
      const attachments = [{ name: 'test.pages' }];

      component.handleOnDrop(attachments);

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

      const previews = component.renderAttachments();

      previews.forEach(function(preview) {
        expect(preview.props.icon)
          .toEqual('Icon--preview-default');
      });
    });
  });

  describe('handleRemoveAttachment', () => {
    let keys;

    beforeEach(() => {
      const attachments = [
        { name: 'foo', size: 1024 },
        { name: 'bar', size: maxFileSize + 1024 }
      ];

      component.handleOnDrop(attachments);
      jasmine.clock().tick(1);

      keys = _.keys(component.state.attachments);
    });

    it('removes the attachment matching the passed in argument', () => {
      const attachmentToRemoveId = keys[0];

      component.handleRemoveAttachment(attachmentToRemoveId);

      expect(_.size(component.state.attachments))
        .toBe(1);

      expect(component.state.attachments[keys[1]].file.name)
        .toBe('bar');
    });

    describe('when the attachment has an error', () => {
      beforeEach(function() {
        const attachmentToRemoveId = keys[1];

        component.handleRemoveAttachment(attachmentToRemoveId);
      });

      it('should call updateForm', () => {
        jasmine.clock().tick(1);

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

      jasmine.clock().tick(1);

      expect(mockUpdateForm)
        .toHaveBeenCalled();
    });

    describe('when there is space for all new attachments', () => {
      it('should add all the attachments', () => {
        component.handleOnDrop(attachments);
        jasmine.clock().tick(1);

        expect(_.size(component.state.attachments))
          .toBe(2);

        const moreAttachments = [
          { name: 'foo', size: 1024 },
          { name: 'bar', size: 1024 },
          { name: 'bob', size: 1024 }
        ];

        component.handleOnDrop(moreAttachments);
        jasmine.clock().tick(1);

        expect(_.size(component.state.attachments))
          .toBe(5);
      });
    });

    describe('when there is not space for all new attachments', () => {
      beforeEach(() => {
        component.handleOnDrop(attachments);
        jasmine.clock().tick(1);

        expect(_.size(component.state.attachments))
          .toBe(2);

        const moreAttachments = [
          { name: 'foo', size: 1024 },
          { name: 'bar', size: 1024 },
          { name: 'bob', size: 1024 },
          { name: 'tim', size: 1024 },
          { name: 'jim', size: 1024 }
        ];

        component.handleOnDrop(moreAttachments);
        jasmine.clock().tick(1);
      });

      it('only adds new attachments up to the max limit of 5', () => {
        expect(_.size(component.state.attachments))
          .toBe(5);
      });

      it('displays an error message', () => {
        expect(component.state.errorMessage)
          .toBe('embeddable_framework.submitTicket.attachments.error.limit_reached');
      });

      it('calls props.handleAttachmentsError', () => {
        expect(mockHandleAttachmentsError)
          .toHaveBeenCalled();
      });
    });

    describe('when there is no space for new attachments', () => {
      beforeEach(() => {
        attachments.push(
          { name: 'bob', size: 1024 },
          { name: 'jim', size: 1024 },
          { name: 'dan', size: 1024 }
        );

        component.handleOnDrop(attachments);
        jasmine.clock().tick(1);

        component.handleOnDrop([{ name: 'fat', size: 1024 }]);
        jasmine.clock().tick(1);
      });

      it('does not add any new attachments', () => {
        expect(_.size(component.state.attachments))
          .toBe(5);
      });

      it('displays an error message', () => {
        expect(component.state.errorMessage)
          .toBe('embeddable_framework.submitTicket.attachments.error.limit_reached');
      });

      it('calls props.handleAttachmentsError', () => {
        expect(mockHandleAttachmentsError)
          .toHaveBeenCalled();
      });
    });

    describe('when an attachment exceeds the maximum filesize', () => {
      it('should add an error to the attachment', () => {
        attachments.push({ name: 'fatty', size: maxFileSize + 1024 });

        component.handleOnDrop(attachments);
        jasmine.clock().tick(1);

        const keys = _.keys(component.state.attachments);

        expect(component.state.attachments[keys[2]].errorMessage)
          .toBeTruthy();
      });
    });
  });

  describe('creating attachments', () => {
    let file;

    describe('when there is no attachment error', () => {
      beforeEach(function() {
        file = { name: 'bob.gif', size: 1024 };

        component.handleOnDrop([file]);
        jasmine.clock().tick(1);
      });

      it('should call attachment sender', () => {
        expect(mockAttachmentSender)
          .toHaveBeenCalled();
      });

      it('should create an attachment object with default state', () => {
        const attachmentId = _.keys(component.state.attachments)[0];

        expect(component.state.attachments[attachmentId])
          .toEqual({
            file: file,
            uploading: true,
            uploadProgress: 0,
            uploadRequestSender: {},
            uploadToken: null,
            errorMessage: null
          });
      });

      it('should create an attachment object with no error', () => {
        const attachmentId = _.keys(component.state.attachments)[0];

        expect(component.state.attachments[attachmentId].errorMessage)
          .toBe(null);
      });
    });

    describe('when there is an attachment error', () => {
      beforeEach(function() {
        file = { name: 'bob.gif', size: maxFileSize + 1024 };

        component.createAttachment(file, 'Some error');
        jasmine.clock().tick(1);
      });

      it('should not call attachment sender', () => {
        expect(mockAttachmentSender)
          .not.toHaveBeenCalled();
      });

      it('should create an attachment object with an error', () => {
        const attachmentId = _.keys(component.state.attachments)[0];

        expect(component.state.attachments[attachmentId].errorMessage)
          .toBe('Some error');
      });
    });
  });

  describe('numUploadedAttachments', () => {
    it('should return the number of uploaded attachments', () => {
      component.handleOnDrop([
        { name: 'foo.txt', size: maxFileSize + 1024 },
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);
      jasmine.clock().tick(1);

      const upload = JSON.stringify({ upload: { token: '12345' } });

      mockAttachmentSender.calls.mostRecent().args[1]({ text: upload });

      expect(component.numUploadedAttachments())
        .toBe(1);
    });
  });

  describe('numValidAttachments', () => {
    it('should return the number of valid attachments', () => {
      component.handleOnDrop([
        { name: 'foo.txt', size: maxFileSize + 1024 },
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);
      jasmine.clock().tick(1);

      const upload = JSON.stringify({ upload: { token: '12345' } });

      mockAttachmentSender.calls.mostRecent().args[1]({ text: upload });

      expect(component.numValidAttachments())
        .toBe(2);
    });
  });

  describe('attachmentsReady', () => {
    it('should return true if there are no attachment errors or uploading attachments', () => {
      component.handleOnDrop([
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);
      jasmine.clock().tick(1);

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
      jasmine.clock().tick(1);

      expect(component.attachmentsReady())
        .toBe(false);
    });

    it('should return false if there are uploading attachments', function() {
      component.handleOnDrop([
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);
      jasmine.clock().tick(1);

      expect(component.attachmentsReady())
        .toBe(false);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      component.handleOnDrop([
        { name: 'jim.png', size: 1024 },
        { name: 'bar.png', size: 1024 }
      ]);
      jasmine.clock().tick(1);
    });

    it('should clear the attachments array', () => {
      component.clear();

      expect(_.size(component.state.attachments))
        .toBe(0);
    });

    describe('when there is an error message', () => {
      beforeEach(() => {
        component.handleOnDrop([
          { name: 'jim.png', size: 1024 },
          { name: 'bar.png', size: 1024 },
          { name: 'bob.png', size: 1024 },
          { name: 'tim.png', size: 1024 },
          { name: 'pat.png', size: 1024 },
          { name: 'reachedlimit.png', size: 1024 }
        ]);
        jasmine.clock().tick(1);
      });

      it('should clear the error message', () => {
        component.clear();

        expect(component.state.errorMessage)
          .toBe(null);
      });
    });
  });

  describe('attachment event handling', () => {
    let attachmentId;

    beforeEach(function() {
      component.handleOnDrop([{ name: 'bob.gif', size: 1024 }]);
      jasmine.clock().tick(1);
      attachmentId = _.keys(component.state.attachments)[0];
    });

    describe('when an attachment is successfully uploaded', () => {
      beforeEach(function() {
        const upload = JSON.stringify({ upload: { token: '12345' } });
        const response = { text: upload };

        mockAttachmentSender.calls.mostRecent().args[1](response);
      });

      it('sets the upload token', () => {
        expect(component.state.attachments[attachmentId].uploadToken)
          .toBe('12345');
      });

      it('sets uploading to false', () => {
        expect(component.state.attachments[attachmentId].uploading)
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
        const response = { message: 'Some error' };

        mockAttachmentSender.calls.mostRecent().args[2](response);
      });

      it('does not set the upload token', () => {
        expect(component.state.attachments[attachmentId].uploadToken)
          .toBeFalsy();
      });

      it('sets the error message to the generic translated error message', () => {
        expect(component.state.attachments[attachmentId].errorMessage)
          .toBe('embeddable_framework.submitTicket.attachments.error.other');
      });

      it('calls updateForm', () => {
        jasmine.clock().tick(1);

        expect(mockUpdateForm)
          .toHaveBeenCalled();
      });
    });

    describe('when an attachment receives an on progress event', () => {
      it('sets the uploadProgress', () => {
        const response = { percent: 20 };

        mockAttachmentSender.calls.mostRecent().args[3](response);

        expect(component.state.attachments[attachmentId].uploadProgress)
          .toBe(20);
      });
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
