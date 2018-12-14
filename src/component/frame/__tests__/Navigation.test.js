import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from 'src/redux/modules/reducer';
import Navigation from '../Navigation';
import * as selectors from 'src/redux/modules/chat/chat-selectors';

const renderComponent = (props) => {
  const store = createStore(reducer);
  const defaultProps = {
    isMobile: false
  };
  const actualProps = {
    ...defaultProps,
    ...props
  };

  return render(
    <Provider store={store}>
      <Navigation {...actualProps} />
    </Provider>,
  );
};

describe('menu button', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getShowMenu').mockReturnValue(true);
  });

  afterEach(() => {
    selectors.getShowMenu.mockRestore();
  });

  it('can be shown', () => {
    const { container } = renderComponent({ isMobile: true });

    expect(container.querySelector('button[aria-label=Menu]'))
      .toBeInTheDocument();
  });

  it('can be hidden', () => {
    const { container } = renderComponent({ isMobile: false });

    expect(container.querySelector('button[aria-label=Menu]'))
      .not.toBeInTheDocument();
  });
});

test('can hide the close button', () => {
  const { container } = renderComponent({ hideNavigationButtons: true });

  expect(container.querySelector('button[aria-label=Close]'))
    .not.toBeInTheDocument();
});

test('renders the close button by default', () => {
  const { container } = renderComponent();

  expect(container.querySelector('button[aria-label=Close]'))
    .toBeInTheDocument();
});

describe('popout button', () => {
  afterEach(() => {
    selectors.getIsPopoutAvailable.mockRestore();
  });

  it('can be shown', () => {
    jest.spyOn(selectors, 'getIsPopoutAvailable').mockReturnValue(true);

    const { container } = renderComponent();

    expect(container.querySelector('button[aria-label=Popout]')).toBeInTheDocument();
  });

  it('can be hidden', () => {
    jest.spyOn(selectors, 'getIsPopoutAvailable')
      .mockImplementation(jest.fn(() => false));

    const { container } = renderComponent({ hideNavigationButtons: true });

    expect(container.querySelector('button[aria-label=Popout]'))
      .not.toBeInTheDocument();
  });
});
