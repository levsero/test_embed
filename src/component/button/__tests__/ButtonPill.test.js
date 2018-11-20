import { render } from 'react-testing-library';
import React from 'react';

import { i18n } from 'service/i18n';
import { ButtonPill } from '../ButtonPill';

beforeEach(() => i18n.isRTL = jest.fn(() => false));

const renderComponent = (props) => {
  return render(<ButtonPill label='mylabel' {...props} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('renders the expected mobile classes when fullscreen is true', () => {
  const { container } = renderComponent({ fullscreen: true });

  expect(container)
    .toMatchSnapshot();
});

test('renders the expected rtl classes when rtl is on', () => {
  i18n.isRTL = jest.fn(() => true);
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

test('icon is rendered when showIcon is true', () => {
  const { container } = renderComponent({ showIcon: true });

  expect(container)
    .toMatchSnapshot();
});
