describe('Attachment component', () => {
  let Attachment,
    component,
    i18n,
    sharedPropTypes,
    mockUploadAbort,
    mockUploadRequestSender,
    mockHandleRemoveAttachment;

  const attachmentPath = buildSrcPath('component/attachment/Attachment');
  const sharedTypesPath = buildSrcPath('types/shared');

  const Icon = noopReactComponent();
  const ProgressBar = noopReactComponent();

  const mockProps = {
    attachmentId: '1',
    className: 'className',
    errorMessage: 'An error occured',
    file: {
      lastModified: 1514764800000,
      lastModifiedDate: 'Mon Jan 01 2018 11:00:00 GMT+1100 (AEDT)',
      name: 'attachment.jpg',
      size: 1024,
      type: 'image/jpeg',
      url: 'path://to/file'
    },
    icon: 'Icon--preview-default'
  };

  beforeEach(() => {
    mockery.enable();

    sharedPropTypes = requireUncached(sharedTypesPath).sharedPropTypes;
    i18n = {
      t: jasmine.createSpy().and.callFake((key) => { return key; })
    };

    initMockRegistry({
      'types/shared': {
        sharedPropTypes
      },
      'component/Icon': { Icon },
      'component/attachment/ProgressBar': { ProgressBar },
      'service/i18n': {
        i18n
      },
      './Attachment.scss': {
        locals: {
          container: 'container',
          containerError: 'containerError',
          icon: 'removeIcon',
          iconPreview: 'iconPreview',
          preview: 'preview',
          previewName: 'previewName',
          description: 'description',
          secondaryText: 'secondaryText',
          link: 'link'
        }
      }
    });

    mockUploadAbort = jasmine.createSpy('mockUploadAbort');
    mockUploadRequestSender = { abort: mockUploadAbort };
    mockHandleRemoveAttachment = jasmine.createSpy('mockHandleRemoveAttachment');

    mockery.registerAllowable(attachmentPath);
    Attachment = requireUncached(attachmentPath).Attachment;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#handleIconClick', () => {
    describe('when the attachment is still uploading', () => {
      beforeEach(() => {
        component = instanceRender(
          <Attachment
            attachmentId={mockProps.attachmentId}
            file={mockProps.file}
            uploading={true}
            handleRemoveAttachment={mockHandleRemoveAttachment}
            uploadRequestSender={mockUploadRequestSender}
            icon={mockProps.icon}
          />
        );

        component.handleIconClick();
      });

      it('calls the abort method of the attachmentSender object', () => {
        expect(mockUploadAbort)
          .toHaveBeenCalled();
      });

      it('calls the handleRemoveAttachment prop with the correct arg', () => {
        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalledWith(mockProps.attachmentId);
      });
    });

    describe('when the attachment is not uploading', () => {
      beforeEach(() => {
        component = instanceRender(
          <Attachment
            attachmentId={mockProps.attachmentId}
            file={mockProps.file}
            uploading={false}
            handleRemoveAttachment={mockHandleRemoveAttachment}
            uploadRequestSender={mockUploadRequestSender}
            icon={mockProps.icon}
          />
        );

        component.handleIconClick();
      });

      it('does not call the abort method of the attachmentSender object', () => {
        expect(mockUploadAbort)
          .not.toHaveBeenCalled();
      });

      it('calls the handleRemoveAttachment prop with the correct arg', () => {
        expect(mockHandleRemoveAttachment)
          .toHaveBeenCalledWith(mockProps.attachmentId);
      });
    });
  });

  describe('#formatAttachmentSize', () => {
    beforeEach(() => {
      component = instanceRender(
        <Attachment
          file={mockProps.file}
          icon={mockProps.icon}
        />
      );
    });

    describe('when the file size is greater than or equal to one megabyte', () => {
      it('returns the file size in megabytes to one decimal place precision', () => {
        component.formatAttachmentSize(1000000);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.submitTicket.attachments.size_megabyte',
          { size: 1 }
        );

        component.formatAttachmentSize(1120000);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.submitTicket.attachments.size_megabyte',
          { size: 1.1 }
        );
      });
    });

    describe('when the file size is less than one megabyte', () => {
      it('returns the file size in kilobytes', () => {
        component.formatAttachmentSize(999999);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.submitTicket.attachments.size_kilobyte',
          { size: 999 }
        );
      });
    });

    describe('when the file size is less than one kilobyte', () => {
      it('returns the file size as 1 KB', () => {
        component.formatAttachmentSize(999);

        expect(i18n.t).toHaveBeenCalledWith(
          'embeddable_framework.submitTicket.attachments.size_kilobyte',
          { size: 1 }
        );
      });
    });
  });

  describe('#truncateFilename', () => {
    let filename,
      result;

    beforeEach(() => {
      const component = instanceRender(
        <Attachment
          file={mockProps.file}
          icon={mockProps.icon}
        />
      );

      const fileNameMaxLength = 10;
      const trailingChatsLength = 7;

      result = component.truncateFilename(filename, fileNameMaxLength, trailingChatsLength);
    });

    describe('when the filename is under the maximum allowed display length', () => {
      beforeAll(() => {
        filename = 'apple.jpg';
      });

      it('returns the full filename', () => {
        expect(result).toEqual(filename);
      });
    });

    describe('when the filename is longer than permitted', () => {
      beforeAll(() => {
        filename = 'pomegranate.jpg';
      });

      it('returns a truncated filename of the maximum allowed length', () => {
        expect(result).toEqual('po…ate.jpg');
        expect(result.length).toEqual(10);
      });
    });
  });

  describe('#renderLinkedEl', () => {
    let result;

    const el = <div>Element</div>;
    const url = 'http://link/to/file';

    beforeEach(() => {
      const component = instanceRender(
        <Attachment
          file={mockProps.file}
          icon={mockProps.icon}
        />
      );

      result = component.renderLinkedEl(el, url);
    });

    it('returns a link', () => {
      expect(result.type).toEqual('a');
    });

    it('links to the correct url', () => {
      expect(result.props.href).toEqual(url);
    });

    it('wraps the element passed in', () => {
      expect(result.props.children).toEqual(el);
    });
  });

  describe('#renderSecondaryText', () => {
    let component,
      result,
      errorMessage,
      isDownloadable,
      downloading,
      uploading;

    beforeEach(() => {
      component = instanceRender(
        <Attachment
          file={mockProps.file}
          icon={mockProps.icon}
        />
      );

      spyOn(component, 'renderLinkedEl').and.callFake((...args) => { return args; });
      spyOn(component, 'formatAttachmentSize').and.callFake((...args) => { return args; });

      result = component.renderSecondaryText(
        mockProps.file,
        errorMessage,
        isDownloadable,
        downloading,
        uploading
      );
    });

    afterEach(() => {
      errorMessage = undefined;
      isDownloadable = false;
      downloading = false;
      uploading = false;
    });

    describe('when there is an error message', () => {
      beforeAll(() => {
        errorMessage = mockProps.errorMessage;
      });

      it('returns the error message', () => {
        expect(result).toEqual('An error occured');
      });
    });

    describe('when there is no error message and uploading is true', () => {
      beforeAll(() => {
        uploading = true;
      });

      it('returns the uploading string', () => {
        expect(result).toEqual('embeddable_framework.chat.chatLog.uploading');
      });
    });

    describe('when there is no error, uploading is false, and downloading is true', () => {
      beforeAll(() => {
        downloading = true;
      });

      it('returns the downloading string', () => {
        expect(result).toEqual('embeddable_framework.chat.chatLog.loadingImage');
      });
    });

    describe('when there is no error, uploading is false, downloading is false, and the file is downloadable', () => {
      beforeAll(() => {
        isDownloadable = true;
      });

      it('returns a link to the uploaded file', () => {
        expect(component.renderLinkedEl).toHaveBeenCalled();
      });
    });

    describe('when there is no error, uploading is false, downloading is false, and the file is not downloadable', () => {
      it('returns the attachment size', () => {
        expect(component.formatAttachmentSize).toHaveBeenCalledWith(mockProps.file.size);
        expect(result).toEqual([mockProps.file.size]);
      });
    });
  });

  describe('#render', () => {
    let component,
      componentNode,
      element,
      errorMessage,
      isDownloadable,
      isRemovable,
      uploading;

    beforeEach(() => {
      component = domRender(
        <Attachment
          className={mockProps.className}
          file={mockProps.file}
          errorMessage={errorMessage}
          icon={mockProps.icon}
          isDownloadable={isDownloadable}
          isRemovable={isRemovable}
          uploading={uploading}
        />
      );

      element = component.render();
      componentNode = ReactDOM.findDOMNode(component);
    });

    describe('when there is an initial attachment error', () => {
      beforeAll(() => {
        errorMessage = mockProps.errorMessage;
      });

      afterAll(() => {
        errorMessage = undefined;
      });

      it('sets an error class on the main container', () => {
        expect(element.props.className).toContain('containerError');
      });
    });

    describe('when there is no attachment error', () => {
      it('does not set an error class on the main container', () => {
        expect(element.props.className).not.toContain('containerError');
      });
    });

    describe('by default', () => {
      it('renders a preview block', () => {
        expect(componentNode.querySelectorAll('.preview').length).toEqual(1);
      });

      it('renders a file preview icon', () => {
        expect(componentNode.querySelectorAll('.iconPreview').length).toEqual(1);
      });

      it('renders a file preview name', () => {
        expect(componentNode.querySelectorAll('.previewName').length).toEqual(1);
      });

      it('renders some secondary text', () => {
        expect(componentNode.querySelector('.secondaryText')).not.toBeNull();
      });

      it('does not render any links to the uploaded file', () => {
        expect(componentNode.querySelector('.link')).toBeNull();
      });

      it('does not render an attachment remove button', () => {
        expect(componentNode.querySelector('.removeIcon')).toBeNull();
      });

      it('does not render a progress bar after the preview block', () => {
        const secondChild = element.props.children[1];

        expect(secondChild).toEqual(false);
      });
    });

    describe('when the file is downloadable', () => {
      beforeAll(() => {
        isDownloadable = true;
      });

      afterAll(() => {
        isDownloadable = false;
      });

      it('renders downloadable links to the uploaded file', () => {
        expect(componentNode.querySelectorAll('.link').length).toEqual(3);
      });

      it('wraps the file preview icon in a link to the file', () => {
        const previewIconParent = componentNode.querySelector('.iconPreview').parentNode;

        expect(previewIconParent.className).toEqual('link');
        expect(previewIconParent.href).toEqual(mockProps.file.url);
      });

      it('wraps the file preview name in a link to the file', () => {
        const previewNameWrapper = componentNode.querySelector('.previewName').parentNode;

        expect(previewNameWrapper.className).toEqual('link');
        expect(previewNameWrapper.href).toEqual(mockProps.file.url);
      });
    });

    describe('when the attachment is removable', () => {
      beforeAll(() => {
        isRemovable = true;
      });

      afterAll(() => {
        isRemovable = false;
      });

      it('renders an attachment remove button', () => {
        expect(componentNode.querySelectorAll('.removeIcon').length).toEqual(1);
      });
    });

    describe('when the file is uploading and there is no error', () => {
      beforeAll(() => {
        uploading = true;
      });

      afterAll(() => {
        uploading = false;
      });

      it('renders a progress bar after the preview block', () => {
        const secondChild = element.props.children[1];

        expect(TestUtils.isElementOfType(secondChild, ProgressBar)).toEqual(true);
      });
    });
  });
});
