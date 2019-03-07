import { render } from 'react-testing-library';
import React from 'react';

import { HelpCenterDesktop } from '../HelpCenterDesktop';

const renderHelpCenterDesktop = (props) => {
  const defaultProps = {
    buttonLabel: '',
    chatAvailable: false,
    children: <div />,
    handleNextClick: noop,
    handleOnChangeValue: noop,
    search: noop,
    callbackEnabled: false,
    isContextualSearchPending: false,
    chatOfflineAvailable: false,
    searchPlaceholder: '',
    title: ''
  };

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <HelpCenterDesktop {...mergedProps}/>
  );
};

describe('render', () => {
  it('renders scrollContainer footer when not on initial screen', () => {
    const { container } = renderHelpCenterDesktop();

    expect(container.querySelector('footer').className)
      .toContain('footerShadow');
  });

  it('renders scrollContainer without footer shadow when on initial screen', () => {
    const { container } = renderHelpCenterDesktop({
      isOnInitialDesktopSearchScreen: true
    });

    expect(container.querySelector('footer').className)
      .not.toContain('footerShadow');
  });

  it('renders scrollContainer without footer shadow when zendesk logo is hidden', () => {
    const { container } = renderHelpCenterDesktop({
      hideZendeskLogo: true
    });

    expect(container.querySelector('footer').className)
      .not.toContain('footerShadow');
  });

  it('renders scrollContainer without footer shadow when showNextButton is false', () => {
    const { container } = renderHelpCenterDesktop({
      showNextButton: false
    });

    expect(container.querySelector('footer').className)
      .not.toContain('footerShadow');
  });

  it('renders button with loading animation', () => {
    const { container } = renderHelpCenterDesktop({
      showNextButton: true,
      buttonLoading: true
    });

    expect(container.querySelector('footer'))
      .toMatchSnapshot();
  });

  it('renders expected next button', () => {
    const { container } = renderHelpCenterDesktop({
      showNextButton: true,
      buttonLabel: 'hello world'
    });

    expect(container.querySelector('footer'))
      .toMatchSnapshot();
  });
});
