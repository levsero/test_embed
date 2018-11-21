import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { Attachment } from '../Attachment';

const file = {
  lastModified: 1514764800000,
  lastModifiedDate: new Date(),
  name: 'attachment.jpg',
  size: 1024,
  type: 'image/jpeg',
  url: 'path://to/file',
  webkitRelativePath: 'what is this'
};

const renderComponent = (props) => {
  const defaultProps = {
    attachmentId: '1234',
    file,
    icon: 'Icon--preview-default'
  };
  const mergedProps = {...defaultProps, ...props};

  return render(<Attachment {...mergedProps} />);
};

test('renders expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

describe('size formatting', () => {
  describe('greater than or equal to 1MB', () => {
    it('displays correctly', () => {
      const { container } = renderComponent({
        file: {...file, size: 1000000 }
      });

      expect(container)
        .toMatchSnapshot();
    });

    it('includes one decimal place precision', () => {
      const { container } = renderComponent({
        file: {...file, size: 1120000 }
      });

      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('when the file size is less than one megabyte', () => {
    it('displays file size in kilobytes', () => {
      const { container } = renderComponent({
        file: {...file, size: 999999 }
      });

      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('when the file size is less than one kilobyte', () => {
    it('displays 1 KB', () => {
      const { container } = renderComponent({
        file: {...file, size: 999 }
      });

      expect(container)
        .toMatchSnapshot();
    });
  });
});

test('filename is truncated when it is more than max', () => {
  const { container } = renderComponent({ filenameMaxLength: 4 });

  expect(container)
    .toMatchSnapshot();
});

test('renders link when it is downloadable', () => {
  const { container } = renderComponent({ isDownloadable: true });

  expect(container)
    .toMatchSnapshot();
});

test('renders uploading text when it is uploading', () => {
  const { container } = renderComponent({ uploading: true });

  expect(container)
    .toMatchSnapshot();
});

test('renders icon when icon is specified and attachment is not downloadable', () => {
  const { container } = renderComponent({ icon: 'myicon', isDownloadable: false });

  expect(container)
    .toMatchSnapshot();
});

test('renders link when icon is specified and attachment is downloadable', () => {
  const { container } = renderComponent({ icon: 'myicon', isDownloadable: true });

  expect(container)
    .toMatchSnapshot();
});

test('renders with custom class name', () => {
  const { container } = renderComponent({ className: 'custom' });

  expect(container)
    .toMatchSnapshot();
});

test('renders with error message', () => {
  const { container } = renderComponent({ errorMessage: 'this is incorrect' });

  expect(container)
    .toMatchSnapshot();
});

test('renders removal button when it is removable', () => {
  const { container } = renderComponent({ isRemovable: true });

  expect(container)
    .toMatchSnapshot();
});

describe('dom interaction', () => {
  it('calls expected handlers on removal if uploading is false', () => {
    const handler = jest.fn();
    const uploadHandler = jest.fn();
    const { container } = renderComponent({
      icon: 'icon',
      isRemovable: true,
      uploading: false,
      uploadRequestSender: { abort: uploadHandler },
      handleRemoveAttachment: handler
    });

    fireEvent.click(container.querySelector('.Icon--close'));
    expect(handler)
      .toHaveBeenCalledWith('1234');
    expect(uploadHandler)
      .not.toHaveBeenCalled();
  });

  it('calls expected handlers on removal if uploading is true', () => {
    const handler = jest.fn();
    const uploadHandler = jest.fn();
    const { container } = renderComponent({
      icon: 'icon',
      isRemovable: true,
      uploading: true,
      uploadRequestSender: { abort: uploadHandler },
      handleRemoveAttachment: handler
    });

    fireEvent.click(container.querySelector('.Icon--close'));
    expect(handler)
      .toHaveBeenCalledWith('1234');
    expect(uploadHandler)
      .toHaveBeenCalled();
  });
});
