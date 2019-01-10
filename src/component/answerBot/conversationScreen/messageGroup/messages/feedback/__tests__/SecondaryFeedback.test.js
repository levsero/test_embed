import 'utility/i18nTestHelper';
import _ from 'lodash';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { PureSecondaryFeedback as SecondaryFeedback } from '../SecondaryFeedback';

const actions = Object.freeze({
  articleDismissed: jest.fn(),
  botUserMessage: jest.fn(),
  botFeedbackMessage: jest.fn(),
  inputDisabled: jest.fn(),
  sessionFallback: jest.fn(),
  botFeedbackChannelChoice: jest.fn()
});

const renderComponent = (props = {}) => {
  const componentProps = _.merge({}, { actions }, props);

  return render(<SecondaryFeedback {...componentProps} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent();

  expect(container)
    .toMatchSnapshot();
});

describe('actions', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent();

    fireEvent.click(getByText("It's not related to my question"));

    expect(actions.botUserMessage)
      .toHaveBeenCalledWith("It's not related to my question");
    expect(actions.articleDismissed)
      .toHaveBeenCalledWith(1);
    expect(actions.sessionFallback)
      .toHaveBeenCalled();
    expect(actions.botFeedbackMessage)
      .toHaveBeenNthCalledWith(1, 'I see. Your question is still unresolved.');
    expect(actions.botFeedbackMessage)
      .toHaveBeenNthCalledWith(2, 'You can ask another question.', expect.any(Function));
  });

  it('displays different message if channels are available', () => {
    const { getByText } = renderComponent({ channelAvailable: true });

    fireEvent.click(getByText("It's related, but it didn't answer my question"));

    expect(actions.botUserMessage)
      .toHaveBeenCalledWith("It's related, but it didn't answer my question");
    expect(actions.articleDismissed)
      .toHaveBeenCalledWith(2);
    expect(actions.sessionFallback)
      .toHaveBeenCalled();
    expect(actions.botFeedbackMessage)
      .toHaveBeenNthCalledWith(1, 'I see. Your question is still unresolved.');
    expect(actions.botFeedbackChannelChoice)
      .toHaveBeenCalledWith('Choose a way to get in touch:', true);
    expect(actions.botFeedbackMessage)
      .toHaveBeenNthCalledWith(2, 'Or you can ask another question.', expect.any(Function));
  });
});
