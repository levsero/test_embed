import { render } from 'react-testing-library';
import React from 'react';
import * as fieldUtils from 'src/util/fields';

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types';

import { Component as Talk } from '../Talk';

const renderComponent = (overrideProps = {}) => {
  const defaultProps = {
    getFrameContentDocument: () => document,
    embeddableConfig: {
      phoneNumber: '12345678',
      supportedCountries: ['US']
    },
    formState: {},
    screen: PHONE_ONLY_SCREEN,
    callback: { error: {} },
    averageWaitTime: '1',
    averageWaitTimeEnabled: false,
    agentAvailability: true,
    isMobile: false,
    libphonenumber: {
      parse: (num) => num,
      format: (num) => num,
      isValidNumber: () => true
    },
    title: 'Talk',
    nickname: '',
    updateTalkCallbackForm: () => {},
    submitTalkCallbackForm: () => {},
    serviceUrl: ''
  };
  const props = { ...defaultProps, ...overrideProps };

  return render(
    <Talk {...props} />
  );
};

describe('talk', () => {
  describe('when no agents are available', () => {
    it('renders the offline screen', () => {
      const { queryByText } = renderComponent({ agentAvailability: false });

      expect(queryByText('Sorry, all agents are currently offline. Try again later.'))
        .toBeInTheDocument();
    });

    describe('and help center is available', () => {
      it('displays a back button to help center', () => {
        const { queryByText } = renderComponent({ agentAvailability: false, helpCenterAvailable: true });

        expect(queryByText('Go back to Help Center'))
          .toBeInTheDocument();
      });
    });

    describe('and channelChoiceAvailable is available', () => {
      it('displays a back button', () => {
        const { queryByText } = renderComponent({ agentAvailability: false, channelChoiceAvailable: true });

        expect(queryByText('Go Back'))
          .toBeInTheDocument();
      });
    });
  });

  describe('callback only screen', () => {
    it('displays a callback form', () => {
      const { queryByText, getByLabelText } = renderComponent({ screen: CALLBACK_ONLY_SCREEN });

      expect(queryByText('Enter your phone number and we\'ll call you back.'))
        .toBeInTheDocument();
      expect(getByLabelText('Phone Number'))
        .toBeInTheDocument();
      expect(getByLabelText('Name (optional)'))
        .toBeInTheDocument();
      expect(getByLabelText('How can we help? (optional)'))
        .toBeInTheDocument();
    });

    describe('when the fields are invalid', () => {
      it('renders error messages', () => {
        jest.spyOn(fieldUtils, 'shouldRenderErrorMessage').mockReturnValue(true);

        const { queryByText } = renderComponent({ screen: CALLBACK_ONLY_SCREEN });

        expect(queryByText('Please enter a valid name.'))
          .toBeInTheDocument();
        expect(queryByText('Please enter a valid message.'))
          .toBeInTheDocument();
      });
    });

    describe('with a callback error', () => {
      describe('already enqueued error', () => {
        it('renders the error message', () => {
          const { queryByText } = renderComponent({
            screen: CALLBACK_ONLY_SCREEN,
            callback: { error: { message: 'phone_number_already_in_queue' } }
          });

          expect(queryByText("You've already submitted a request. We'll get back to you soon."))
            .toBeInTheDocument();
        });
      });

      describe('with a generic error', () => {
        it('renders the error message', () => {
          const { queryByText } = renderComponent({
            screen: CALLBACK_ONLY_SCREEN,
            callback: { error: { message: 'fooBar' } }
          });

          expect(queryByText('There was an error processing your request. Please try again later.'));
        });
      });
    });
  });

  describe('phone only screen', () => {
    it('displays a phone number and a message to call it', () => {
      const { queryByText } = renderComponent();

      expect(queryByText('Call us at the phone number below to get in contact with us.'))
        .toBeInTheDocument();
      expect(queryByText('12345678'))
        .toBeInTheDocument();
    });
  });

  describe('callback and phone screen', () => {
    it('displays a phone number and a callback form', () => {
      const container = renderComponent({ screen: CALLBACK_AND_PHONE_SCREEN });
      const { queryByText, getByLabelText } = container;

      expect(queryByText('Enter your phone number and we\'ll call you back.'))
        .toBeInTheDocument();
      expect(queryByText('Our phone number:'))
        .toBeInTheDocument();
      expect(queryByText('12345678'))
        .toBeInTheDocument();
      expect(getByLabelText('Phone Number'))
        .toBeInTheDocument();
      expect(getByLabelText('Name (optional)'))
        .toBeInTheDocument();
      expect(getByLabelText('How can we help? (optional)'))
        .toBeInTheDocument();
    });
  });
});
