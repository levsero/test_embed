import { render } from 'react-testing-library';
import React from 'react';
import createStore from 'src/redux/createStore';
import { Provider } from 'react-redux';
import { HelpCenterMobile } from '../HelpCenterMobile';

const renderComponent = (props) => {
  const store = createStore();
  const defaultProps = {
    buttonLabel: '',
    chatAvailable: false,
    children: <div />,
    handleNextClick: noop,
    handleOnChangeValue: noop,
    onSearchFieldFocus: noop,
    search: noop,
    callbackEnabled: false,
    isContextualSearchPending: false,
    chatOfflineAvailable: false,
    contextualHelpEnabled: false,
    searchPlaceholder: '',
    title: '',
    contextualHelpRequestNeeded: false
  };

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <Provider store={store}>
      <HelpCenterMobile {...mergedProps}/>
    </Provider>
  );
};

describe('render', () => {
  it('renders button with loading animation', () => {
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true,
      buttonLoading: true
    });

    expect(container.querySelector('footer'))
      .toMatchSnapshot();
  });

  it('renders expected next button', () => {
    const { container } = renderComponent({
      showNextButton: true,
      articleViewActive: true,
      buttonLabel: 'hello world'
    });

    expect(container.querySelector('footer'))
      .toMatchSnapshot();
  });

  describe('show channelChoice options', () => {
    it('show channel choice when channelChoice is true', () => {
      const { container } = renderComponent( { channelChoice: true } );

      expect(container.querySelector('.channelChoiceContainer'))
        .toBeInTheDocument();

      expect(container.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeInTheDocument();
    });

    it('hide channel choice when channelChoice is false', () => {
      const { container } = renderComponent({ channelChoice: false });

      expect(container.querySelector('.channelChoiceContainer'))
        .not.toBeInTheDocument();

      expect(container.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeInTheDocument();
    });
  });

  describe('hide zendesk logo', () => {
    it('hides the zendesk logo when hasSearched is true', () => {
      const { queryByTestId } = renderComponent({ hasSearched: true });

      expect(queryByTestId('Icon--zendesk'))
        .not.toBeInTheDocument();
    });

    it('hide the zendesk logo when hideZendeskLogo is true', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: true });

      expect(queryByTestId('Icon--zendesk'))
        .not.toBeInTheDocument();
    });
  });

  describe('shows zendesk logo', () => {
    it('show the zendesk logo when hasSearched is false', () => {
      const { queryByTestId } = renderComponent({ hasSearched: false });

      expect(queryByTestId('Icon--zendesk'))
        .toBeInTheDocument();
    });

    it('shows the zendesk logo when hideZendeskLogo is false', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: false });

      expect(queryByTestId('Icon--zendesk'))
        .toBeInTheDocument();
    });
  });

  describe('footer content', () => {
    it('renders footer buttons when showNextButton and articleViewActive is true', () => {
      const { container } = renderComponent({
        showNextButton: true,
        articleViewActive: true
      });

      expect(container.querySelector('button.footerButton'))
        .toBeInTheDocument();
    });

    it('does not render footer buttons when showNextButton is false', () => {
      const { container } = renderComponent({
        showNextButton: false
      });

      expect(container.querySelector('button.footerButton'))
        .not.toBeInTheDocument();
    });
  });
});
