import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';
import _ from 'lodash';

import { AttachmentList } from '../AttachmentList';

beforeEach(() => {
  let value = 1;

  _.uniqueId = () => value++;
});

jest.useFakeTimers();

const renderComponent = (props = {}) => {
  const defaultProps = {
    attachmentSender: jest.fn(),
    maxFileCount: 5,
    updateForm: jest.fn(),
    maxFileSize: 5 * 1024 * 1024
  };
  const mergedProps = {...defaultProps, ...props};

  return render(<AttachmentList {...mergedProps} />);
};

test('renders the component', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('renders the component with mobile styles', () => {
  const { container } = renderComponent({ fullscreen: true });

  expect(container)
    .toMatchSnapshot();
});

test('allows attaching file', () => {
  const file = new File(['hello world'], 'some.csv');
  const { getByTestId, container } = renderComponent();
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);

  jest.runAllTimers();

  expect(container)
    .toMatchSnapshot();
});

test('exceed maximum number of files', () => {
  const files = [
    new File(['hello world 1'], '1.csv'),
    new File(['hello world 2'], '2.csv'),
    new File(['hello world 3'], '3.csv'),
    new File(['hello world 4'], '4.csv'),
    new File(['hello world 5'], '5.csv'),
    new File(['hello world 6'], '6.csv'),
    new File(['hello world 7'], '7.csv'),
  ];
  const { getByTestId, container } = renderComponent();
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: files });
  fireEvent.drop(dz);

  jest.runAllTimers();

  expect(container)
    .toMatchSnapshot();
});

test('exceed file size', () => {
  const file = new File(['hello world'], 'some.csv');
  const { getByTestId, container } = renderComponent();
  const dz = getByTestId('dropzone');

  Object.defineProperty(file, 'size', {
    get: () => 1024 * 1024 * 1024
  });

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);

  jest.runAllTimers();

  expect(container)
    .toMatchSnapshot();
});

test('picks the correct icon types', () => {
  const files = [
    new File(['hello world'], 'some.pdf'),
    new File(['hello world'], 'some.rar'),
    new File(['hello world'], 'some.ppt'),
    new File(['hello world'], 'some.zip'),
    new File(['hello world'], 'some.doc'),
    new File(['hello world'], 'some.docx'),
    new File(['hello world'], 'some.pptx'),
    new File(['hello world'], 'some.key'),
    new File(['hello world'], 'some.xls'),
    new File(['hello world'], 'some.xlsx'),
    new File(['hello world'], 'some.numbers'),
    new File(['hello world'], 'some.blah.txt'),
    new File(['hello world'], 'some.rtf'),
    new File(['hello world'], 'some.pag'),
    new File(['hello world'], 'some.pages'),
    new File(['hello world'], 'some.png'),
    new File(['hello world'], 'some.jpg'),
    new File(['hello world'], 'some.jpeg'),
    new File(['hello world'], 'some.gif'),
    new File(['hello world'], 'some.svg'),
    new File(['hello world'], 'some.mp4'),
    new File(['hello world'], 'some.random'),
  ];
  const { getByTestId, container } = renderComponent({ maxFileCount: files.length });
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: files });
  fireEvent.drop(dz);

  jest.runAllTimers();

  expect(container)
    .toMatchSnapshot();
});

test('remove attachment', () => {
  const file = new File(['hello world'], 'some.csv');
  const abort = jest.fn();
  const requestSender = () => ({ abort });
  const { getByTestId, container } = renderComponent({ attachmentSender: requestSender });
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);
  jest.runAllTimers();
  fireEvent.click(container.querySelector('.Icon--close'));

  expect(container)
    .toMatchSnapshot();
  expect(abort)
    .toHaveBeenCalled();
});

test('successful upload', () => {
  const file = new File(['hello world'], 'some.csv');
  let doneFn;
  const requestSender = (_, done) => {
    doneFn = done;
    return {};
  };
  const updateForm = jest.fn();
  const { getByTestId, container } = renderComponent({
    attachmentSender: requestSender,
    updateForm
  });
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);
  jest.runAllTimers();
  doneFn({ text: '{ "upload": { "token": 1234 } }' });
  jest.runAllTimers();

  expect(updateForm)
    .toHaveBeenCalled();
  expect(container)
    .toMatchSnapshot();
});

test('failed upload', () => {
  const file = new File(['hello world'], 'some.csv');
  let failFn;
  const requestSender = (_, _d, fail) => {
    failFn = fail;
    return {};
  };
  const updateForm = jest.fn();
  const { getByTestId, container } = renderComponent({
    attachmentSender: requestSender,
    updateForm
  });
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);
  jest.runAllTimers();
  failFn('this is an error message');
  jest.runAllTimers();

  expect(updateForm)
    .toHaveBeenCalled();
  expect(container)
    .toMatchSnapshot();
});

test('uploading in progress upload', () => {
  const file = new File(['hello world'], 'some.csv');
  let progressFn;
  const requestSender = (_, _d, _f, progress) => {
    progressFn = progress;
    return {};
  };
  const { getByTestId, container } = renderComponent({
    attachmentSender: requestSender
  });
  const dz = getByTestId('dropzone');

  Object.defineProperty(dz, 'files', { value: [file] });
  fireEvent.drop(dz);
  jest.runAllTimers();
  progressFn({ percent: 55 });
  jest.runAllTimers();

  expect(container)
    .toMatchSnapshot();
});
