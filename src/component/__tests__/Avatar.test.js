import { render } from 'react-testing-library';
import React from 'react';

import { Avatar } from '../Avatar';

test('renders an img when src is provided ', () => {
  const { container } = render(<Avatar src="http://sauce" fallbackIcon="fallback" />);

  expect(container.firstChild)
    .toMatchSnapshot();
});

test('renders a button', () => {
  const { container } = render(<Avatar fallbackIcon="Icon--avatar" />);

  expect(container.firstChild)
    .toMatchSnapshot();
});
