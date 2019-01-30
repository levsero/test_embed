import { render } from 'react-testing-library';
import React from 'react';

import { FeedbackButton } from '../FeedbackButton';

test('renders the expected classes', () => {
  const { container } = render(<FeedbackButton label='hello world' />);

  expect(container)
    .toMatchSnapshot();
});

test('allows custom classes', () => {
  const { container } = render(<FeedbackButton label='custom class' className='blah' />);

  expect(container)
    .toMatchSnapshot();
});
