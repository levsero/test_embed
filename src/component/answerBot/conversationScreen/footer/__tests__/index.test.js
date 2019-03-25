import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { Component as Footer } from '../index';

const renderComponent = (props = {}) => {
  const defaultProps = {
    currentMessage: 'string',
    questionValueChanged: noop,
    questionSubmitted: noop
  };

  const componentProps = {
    ...defaultProps,
    ...props
  };

  return render(<Footer {...componentProps} />);
};

describe('desktop', () => {
  it('renders the expected classes', () => {
    const { container } = renderComponent({
      currentMessage: 'desktop message'
    });

    expect(container)
      .toMatchSnapshot();
  });

  it('does the expected thing on chat submit', () => {
    const questionValueChanged = jest.fn(),
      questionSubmitted = jest.fn(),
      scrollToBottom = jest.fn();

    const { getByPlaceholderText } = renderComponent({
      currentMessage: 'send this',
      questionValueChanged,
      questionSubmitted,
      scrollToBottom
    });

    fireEvent.keyDown(
      getByPlaceholderText('Type your question here...'),
      { key: 'Enter', keyCode: 13 }
    );

    expect(questionValueChanged)
      .toHaveBeenCalledWith('');
    expect(questionSubmitted)
      .toHaveBeenCalledWith('send this');
    expect(scrollToBottom)
      .toHaveBeenCalled();
  });
});

describe('mobile', () => {
  it('renders the expected classes', () => {
    const { container } = renderComponent({
      isMobile: true,
      currentMessage: 'mobile message'
    });

    expect(container)
      .toMatchSnapshot();
  });

  it('does the expected thing on chat submit', () => {
    const questionValueChanged = jest.fn(),
      questionSubmitted = jest.fn(),
      scrollToBottom = jest.fn();

    const { container } = renderComponent({
      isMobile: true,
      currentMessage: 'send this',
      questionValueChanged,
      questionSubmitted,
      scrollToBottom
    });

    fireEvent.click(container.querySelector('button'));

    expect(questionValueChanged)
      .toHaveBeenCalledWith('');
    expect(questionSubmitted)
      .toHaveBeenCalledWith('send this');
    expect(scrollToBottom)
      .toHaveBeenCalled();
  });
});
