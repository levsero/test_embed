import React from 'react';
import { render } from 'react-testing-library';

import Checkbox from '../';

const renderComponent = (props = {}) => {
  const defaultProps = {
    title: 'checkbox title',
    description: 'click to toggle',
    renderError: false,
    errorString: 'there is a checkbox error',
    checkboxProps: {
      name: '123',
      onChange: noop,
      checked: false
    }
  };
  const mergedProps = {
    ...defaultProps,
    ...props
  };

  return render(<Checkbox {...mergedProps} />);
};

describe('Checkbox', () => {
  it('renders the expected component', () => {
    const { container } = renderComponent();

    expect(container)
      .toMatchSnapshot();
  });

  describe('with an error', () => {
    it('renders the expected component with an optional tag', () => {
      const { container } = renderComponent({ renderError: true });

      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('with the checkbox ticked', () => {
    it('renders the expected component with an optional tag', () => {
      const { container } = renderComponent({ checked: true });

      expect(container)
        .toMatchSnapshot();
    });
  });
});

