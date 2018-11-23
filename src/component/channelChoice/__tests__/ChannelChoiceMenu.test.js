import 'utility/i18nTestHelper';
import React from 'react';
import { i18n } from 'service/i18n';
import { render, fireEvent } from 'react-testing-library';

import { ChannelChoiceMenu } from '../ChannelChoiceMenu';

beforeEach(() => {
  i18n.isRTL = () => false;
});

const click = jest.fn();

describe('rendering', () => {
  const renderComponent = (props = {}, renderer) => {
    const defaultProps = {
      onNextClick: jest.fn(),
      callbackEnabled: false
    };
    const mergedProps = {...defaultProps, ...props};
    const component = <ChannelChoiceMenu {...mergedProps} />;

    if (renderer) {
      return renderer(component);
    } else {
      return render(component);
    }
  };

  describe('renders ChannelChoiceMenu correctly', () => {
    it('with default props', () => {
      const { container } = renderComponent();

      expect(container)
        .toMatchSnapshot();
    });

    describe('talkButton', () => {
      describe('when talkAvailable is true', () => {
        it('when callbackEnabled is true', () => {
          const props = { talkAvailable: true, callbackEnabled: true };
          const { container } = renderComponent(props);

          expect(container)
            .toMatchSnapshot();
        });

        it('when callbackEnabled is false', () => {
          const props = { talkAvailable: true, callbackEnabled: false };
          const { container } = renderComponent(props);

          expect(container)
            .toMatchSnapshot();
        });
      });

      describe('when talkAvailable is false', () => {
        it('and talkAvailableOnMount is false', () => {
          const { container } = renderComponent({ talkAvailable: false });

          expect(container)
            .toMatchSnapshot();
        });

        it('and talkAvailableOnMount is true', () => {
          const { container, rerender } = renderComponent({ talkAvailable: true });

          renderComponent({ talkAvailable: false }, rerender);

          expect(container)
            .toMatchSnapshot();
        });
      });
    });

    describe('chat button', () => {
      it('when chatAvailable & chatOfflineAvailable are true', () => {
        const { container } = renderComponent({ chatAvailable: true, chatOfflineAvailable: true });

        expect(container)
          .toMatchSnapshot();
      });

      it('when chatAvailable is false', () => {
        const { container } = renderComponent({ chatAvailable: false, chatOfflineAvailable: true });

        expect(container)
          .toMatchSnapshot();
      });

      it('and chatOfflineAvailable is false', () => {
        const { container } = renderComponent({ chatAvailable: true, chatOfflineAvailable: false });

        expect(container)
          .toMatchSnapshot();
      });

      describe('when chatOfflineAvailable and chatAvailable are false', () => {
        it('and chatAvailableOnMount is false', () => {
          const { container } = renderComponent({ chatAvailable: false, chatOfflineAvailable: false });

          expect(container)
            .toMatchSnapshot();
        });

        it('and chatAvailableOnMount is true', () => {
          const { container, rerender } = renderComponent({ chatAvailable: true, chatOfflineAvailable: false });

          renderComponent({ chatAvailable: false }, rerender);

          expect(container)
            .toMatchSnapshot();
        });
      });
    });

    describe('submitTicket button', () => {
      it('when submitTicketAvailable is true', () => {
        const { container } = renderComponent({ submitTicketAvailable: true });

        expect(container)
          .toMatchSnapshot();
      });

      it('when submitTicketAvailable is false', () => {
        const { container } = renderComponent({ submitTicketAvailable: true });

        expect(container)
          .toMatchSnapshot();
      });
    });

    describe('when all buttons show', () => {
      it('the css classes are correctly set', () => {
        const { container } = renderComponent({
          submitTicketAvailable: true,
          chatAvailable: true,
          chatOfflineAvailable: true,
          talkAvailable: true,
          callbackEnabled: true,
          labelClasses: 'label-class',
          buttonClasses: 'button-class'
        });

        expect(container)
          .toMatchSnapshot();
      });

      describe('when isRTL returns true', () => {
        it('it adds a css class', () => {
          i18n.isRTL = () => true;
          const { container } = renderComponent({
            submitTicketAvailable: true,
            chatAvailable: true,
            chatOfflineAvailable: true,
            talkAvailable: true,
            callbackEnabled: true,
          });

          expect(container)
            .toMatchSnapshot();
        });
      });
    });
  });
});

describe('dom interaction', () => {
  const component = (props = {}) => {
    const defaultProps = {
      onNextClick: jest.fn(),
      callbackEnabled: false
    };
    const mergedProps = {...defaultProps, ...props};
    const component =  <ChannelChoiceMenu {...mergedProps} />;

    return render(component);
  };

  describe('talk button', () => {
    it('click "talk"', () => {
      const props = { onNextClick: click, talkAvailable: true, callbackEnabled: true };
      const {
        getByText
      } = component(props);

      fireEvent.click(getByText('Request a callback'));

      expect(click.mock.calls.length).toEqual(1);
      expect(click.mock.calls[0]).toEqual(['talk']);
    });

    it('click "Call Us"', () => {
      const props = { onNextClick: click, talkAvailable: true, callbackEnabled: false };
      const {
        getByText
      } = component(props);

      fireEvent.click(getByText('Call us'));

      expect(click.mock.calls.length).toEqual(1);
      expect(click.mock.calls[0]).toEqual(['talk']);
    });
  });

  describe('chat button', () => {
    it('click "Live chat"', () => {
      const props = { onNextClick: click, chatAvailable: true, chatOfflineAvailable: true };
      const {
        getByText
      } = component(props);

      fireEvent.click(getByText('Live chat'));

      expect(click.mock.calls.length).toEqual(1);
      expect(click.mock.calls[0]).toEqual(['chat']);
    });
  });

  describe('submit button', () => {
    it('click "Submit"', () => {
      const props = { onNextClick: click, submitTicketAvailable: true };
      const {
        getByText
      } = component(props);

      fireEvent.click(getByText('Leave a message'));

      expect(click.mock.calls.length).toEqual(1);
      expect(click.mock.calls[0]).toEqual(['ticketSubmissionForm']);
    });
  });
});
