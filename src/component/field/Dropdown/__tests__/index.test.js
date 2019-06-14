import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import NestedDropdown from '../';
import { ThemeProvider } from 'styled-components';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {}
      };
    }
  };
});

const mockOptions = [
  {
    name: 'pizzaName',
    value: 'pizza'
  }
];

const renderComponent = (props) => {
  const defaultProps = {
    options: mockOptions,
    required: false,
    label: <div>dropdown label</div>,
    getFrameContentDocument: () => window.document
  };
  const mergedProps = {
    ...defaultProps,
    ...props
  };

  return render(<ThemeProvider theme={{}}><NestedDropdown {...mergedProps} /></ThemeProvider>);
};

describe('Dropdown', () => {
  it('renders the expected options when the field is required', () => {
    const { container, getAllByRole } = renderComponent({ required: true });

    fireEvent.click(container.querySelector('[data-garden-id="select.select_view"]'));

    const options = getAllByRole('menuitemcheckbox');

    expect(options.length)
      .toEqual(1);

    expect(options[0].innerHTML)
      .toEqual('pizzaName');
  });

  it('renders the expected options when the field is not required', () => {
    const { container, getAllByRole } = renderComponent();

    fireEvent.click(container.querySelector('[data-garden-id="select.select_view"]'));

    const options = getAllByRole('menuitemcheckbox');

    expect(options.length)
      .toEqual(2);

    expect(options[0].innerHTML)
      .toEqual('-');

    expect(options[1].innerHTML)
      .toEqual('pizzaName');
  });
});
