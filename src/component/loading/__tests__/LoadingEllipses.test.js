import { render } from 'react-testing-library';
import React from 'react';

import * as devices from 'utility/devices';
import { LoadingEllipses } from '../LoadingEllipses';

beforeEach(() => {
  devices.isDevice = jest.fn(() => false);
});

test('renders the expected classes', () => {
  const { container } = render(<LoadingEllipses />);

  expect(container)
    .toMatchSnapshot();
});

test('`fade` class is there when ios8', () => {
  devices.isDevice = jest.fn(() => true);
  const { container } = render(<LoadingEllipses />);

  expect(container)
    .toMatchSnapshot();
});

test('background color class can be disabled', () => {
  const { container } = render(<LoadingEllipses useUserColor={false} />);

  expect(container)
    .toMatchSnapshot();
});
