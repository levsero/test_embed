import { render } from 'react-testing-library';
import React from 'react';

import Text from '../';

const renderComponent = (props = {}) => {
  const defaultProps = {
    label: 'this is a label',
    required: true,
    showError: false,
    description: 'description of field',
    onChange: noop,
    name: 'text',
  };
  const mergedProps = {
    ...defaultProps,
    ...props
  };

  return render(<Text {...mergedProps} />);
};

describe('when required', () => {
  it('renders the expected component', () => {
    const { container } = renderComponent();

    expect(container)
      .toMatchSnapshot();
  });
});

describe('when not required', () => {
  it('renders the expected component with an optional tag', () => {
    const { container } = renderComponent({ required: false });

    expect(container)
      .toMatchSnapshot();
  });
});

