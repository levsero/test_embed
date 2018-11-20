import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { ButtonIcon } from '../ButtonIcon';

const renderComponent = (props) => {
  const label = <span>Label</span>;

  return render(<ButtonIcon label={label} {...props} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('classes are customizable', () => {
  const { container } = renderComponent({
    icon: 'Icon--zendesk',
    actionable: false,
    flipX: true,
    iconClasses: 'here there'
  });

  expect(container)
    .toMatchSnapshot();
});

describe('actionable', () => {
  it('calls handler on click when actionable is true', () => {
    const handler = jest.fn();

    const { container } = renderComponent({ actionable: true, onClick: handler });

    fireEvent.click(container.querySelector('button'));

    expect(handler)
      .toHaveBeenCalled();
  });

  it('does not call handler on click when actionable is false', () => {
    const handler = jest.fn();

    const { container } = renderComponent({ actionable: false, onClick: handler });

    fireEvent.click(container.querySelector('button'));

    expect(handler)
      .not.toHaveBeenCalled();
  });
});
