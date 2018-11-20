import { render } from 'react-testing-library';
import React from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

test('renders the expected classes', () => {
  const { container } = render(<LoadingSpinner />);

  expect(container)
    .toMatchSnapshot();
});

test('className can be customized', () => {
  const { container } = render(<LoadingSpinner className='woot' />);

  expect(container)
    .toMatchSnapshot();
});

test('height and width can be customized', () => {
  const { container } = render(<LoadingSpinner height={68} width={42} />);

  expect(container)
    .toMatchSnapshot();
});

test('viewBox can be customized', () => {
  const { container } = render(<LoadingSpinner viewBox={'0 0 100 100'} />);

  expect(container)
    .toMatchSnapshot();
});

test('circle can be customized', () => {
  const { container } = render(<LoadingSpinner circleClasses={'circleStylesClass'} />);

  expect(container)
    .toMatchSnapshot();
});
