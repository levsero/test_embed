import { render } from 'react-testing-library';
import React from 'react';

import { HelpCenterMobile } from '../HelpCenterMobile';

const renderComponent = (props) => {
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
    title: ''
  };

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <HelpCenterMobile {...mergedProps}/>
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
});
