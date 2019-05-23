import { render } from 'react-testing-library';
import React from 'react';

import BotTyping from '../index';

test('renders the expected classes', () => {
  const { container } = render(<BotTyping />);

  expect(container)
    .toMatchSnapshot();
});
