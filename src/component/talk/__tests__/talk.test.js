import { render } from 'react-testing-library';
import React from 'react';

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
  describe('rendering the zendesk logo', () => {
    describe('with the logo enabled', () => {
      it('renders the zendesk logo', () => {
        const { queryByText } = renderComponent({ agentAvailability: false });

        expect(queryByText('zendesk'))
          .toBeInTheDocument();
      });
    });

    describe('with logo disabled', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({ agentAvailability: false, isMobile: true });

        expect(queryByText('zendesk'))
          .not.toBeInTheDocument();
      });
    });

    describe('on mobile', () => {
      it('does not render the zendesk logo', () => {
        const { queryByText } = renderComponent({ agentAvailability: false, hideZendeskLogo: true });

        expect(queryByText('zendesk'))
          .not.toBeInTheDocument();
      });
    });
  });

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

    describe('when the fields have values', () => {
      it('renders error messages', () => {
        const { queryByValue, queryByText } = renderComponent({
          screen: CALLBACK_ONLY_SCREEN,
          formState: {
            name: 'taipan',
            description: 'no one is quite sure'
          }
        });

        expect(queryByValue('taipan'))
          .toBeInTheDocument();
        expect(queryByText('no one is quite sure'))
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
      const { queryByText } = renderComponent({ screen: PHONE_ONLY_SCREEN });

      expect(queryByText('Call us at the phone number below to get in contact with us.'))
        .toBeInTheDocument();
      expect(queryByText('12345678'))
        .toBeInTheDocument();
    });

    describe('with an average wait time', () => {
      describe('of 0', () => {
        it('does not display the average wait time', () => {
          const { queryByText } = renderComponent({
            screen: PHONE_ONLY_SCREEN,
            averageWaitTimeEnabled: true,
            averageWaitTime: '0'
          });

          expect(queryByText('Average wait time: 0 minutes'))
            .not.toBeInTheDocument();
        });
      });

      describe('of 1', () => {
        it('display the average wait time in singular', () => {
          const { queryByText } = renderComponent({
            screen: PHONE_ONLY_SCREEN,
            averageWaitTimeEnabled: true,
            averageWaitTime: '1'
          });

          expect(queryByText('Average wait time: 1 minute'))
            .toBeInTheDocument();
        });
      });

      describe('of greater than 1', () => {
        it('display the average wait time in plural', () => {
          const { queryByText } = renderComponent({
            screen: PHONE_ONLY_SCREEN,
            averageWaitTimeEnabled: true,
            averageWaitTime: '10'
          });

          expect(queryByText('Average wait time: 10 minutes'))
            .toBeInTheDocument();
        });
      });
    });
  });

  describe('success notification screen', () => {
    it('displays a phone number and a callback form', () => {
      const { queryByText } = renderComponent({
        screen: SUCCESS_NOTIFICATION_SCREEN
      });

      expect(queryByText('Thanks for reaching out.'))
        .toBeInTheDocument();
      expect(queryByText("We'll get back to you soon."))
        .toBeInTheDocument();
      expect(queryByText('Done'))
        .toBeInTheDocument();
    });
  });

  describe('callback and phone screen', () => {
    it('displays a phone number and a callback form', () => {
      const { queryByText, getByLabelText } = renderComponent({
        screen: CALLBACK_AND_PHONE_SCREEN
      });

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
