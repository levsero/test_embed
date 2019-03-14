import { render } from 'react-testing-library';
import React from 'react';
import { Label as ExampleLabel } from '@zendeskgarden/react-textfields';

import Label from '../';

const renderComponent = (props = {}) => {
  const defaultProps = {
    Component: ExampleLabel,
    label: 'this is a label',
    required: true
  };
  const mergedProps = {
    ...defaultProps,
    ...props
  };

  return render(<Label {...mergedProps} />);
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

