import React from 'react';
import { render } from 'react-testing-library';
import snapshotDiff from 'snapshot-diff';
import { IdManager } from '@zendeskgarden/react-selection';

import Checkbox from '../';

const renderComponent = (props = {}, checkboxProps = {}) => {
  const defaultProps = {
    label: 'checkbox title',
    description: 'click to toggle',
    showError: false,
    errorString: 'there is a checkbox error',
    checkboxProps: {
      name: '123',
      onChange: noop,
      checked: 0,
      ...checkboxProps
    }
  };
  const mergedProps = {
    ...defaultProps,
    ...props
  };

  IdManager.setIdCounter(0);
  return render(<Checkbox {...mergedProps} />);
};

describe('Checkbox', () => {
  it('renders the expected component', () => {
    const { container } = renderComponent();

    expect(container)
      .toMatchSnapshot();
  });

  describe('with an error', () => {
    it('renders the error component', () => {
      const defaultComponent = renderComponent();
      const component = renderComponent({ showError: true });

      expect(snapshotDiff(defaultComponent, component, { contextLines: 0 }))
        .toMatchSnapshot();
    });
  });

  describe('with the checkbox ticked', () => {
    it('renders the expected with the checked value', () => {
      const defaultComponent = renderComponent();
      const component = renderComponent({}, { checked: 1 });

      expect(snapshotDiff(defaultComponent, component, { contextLines: 0 }))
        .toMatchSnapshot();
    });
  });
});

