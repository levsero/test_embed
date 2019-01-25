import _ from 'lodash';
import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from 'src/redux/modules/reducer';
import Navigation, { Navigation as NonConnectedNavigation } from '../Navigation';
import * as selectors from 'src/redux/modules/selectors/chat-linked-selectors';
import * as chatUtil from 'src/util/chat';

jest.mock('src/util/chat');

const renderComponent = (props) => {
  const store = createStore(reducer);
  const defaultProps = {
    isMobile: false,
    popoutButtonVisible: true
  };
  const actualProps = _.merge({}, defaultProps, props);

  return render(
    <Provider store={store}>
      <Navigation {...actualProps} />
    </Provider>,
  );
};

const renderPureComponent = (props) => {
  const defaultProps = {
    isMobile: false,
    popoutButtonVisible: true,
    standaloneMobileNotificationVisible: false,
    handleCloseButtonClicked: noop,
    zChat: { getMachineId: () => 'machine id' },
    isPreview: false,
    chatPopoutSettings: {},
    locale: 'en-US'
  };
  const actualProps = _.merge({}, defaultProps, props);

  return render(
    <NonConnectedNavigation {...actualProps} />
  );
};

describe('rendering', () => {
  describe('with default props', () => {
    const { container } = renderPureComponent();

    it('renders correctly',() => {
      expect(container).toMatchSnapshot();
    });
  });
});

describe('actions', () => {
  describe('clicking popout', () => {
    describe('when not preview', () => {
      it('createsTheChatPopout', () => {
        jest.spyOn(chatUtil, 'createChatPopoutWindow');

        const { container } = renderPureComponent();

        fireEvent.click(container.querySelector('.popoutDesktop'));

        expect(chatUtil.createChatPopoutWindow).toHaveBeenCalledWith({}, 'machine id', 'en-US');
      });
    });

    describe('clicking popout', () => {
      describe('when it is preview', () => {
        it('createsTheChatPopout', () => {
          jest.spyOn(chatUtil, 'createChatPopoutWindow');

          const { container } = renderPureComponent({ isPreview: true });

          fireEvent.click(container.querySelector('.popoutDesktop'));

          expect(chatUtil.createChatPopoutWindow).not.toHaveBeenCalled();
        });
      });
    });
  });
});

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
    selectors.getIsPopoutButtonVisible.mockRestore();
  });

  it('can be shown', () => {
    jest.spyOn(selectors, 'getIsPopoutButtonVisible').mockReturnValue(true);

    const { container } = renderComponent();

    expect(container.querySelector('button[aria-label=Popout]')).toBeInTheDocument();
  });

  it('can be hidden', () => {
    jest.spyOn(selectors, 'getIsPopoutButtonVisible')
      .mockImplementation(jest.fn(() => false));

    const { container } = renderComponent({ hideNavigationButtons: true });

    expect(container.querySelector('button[aria-label=Popout]'))
      .not.toBeInTheDocument();
  });
});
