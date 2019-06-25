import { render, fireEvent } from 'react-testing-library';
import React from 'react';
import createStore from 'src/redux/createStore';
import { Provider } from 'react-redux';
import libphonenumber from 'libphonenumber-js';

import { updateTalkEmbeddableConfig, handleTalkVendorLoaded } from 'src/redux/modules/talk';
import Talk from '../../Talk';
import { http } from 'service/transport';

jest.mock('service/transport');

const setUpComponent = () => {
  const store = createStore();

  store.dispatch(handleTalkVendorLoaded({ libphonenumber: libphonenumber }));
  store.dispatch(updateTalkEmbeddableConfig({
    averageWaitTimeSetting: null,
    capability: '0',
    enabled: true,
    nickname: 'yolo',
    phoneNumber: '12345678',
    supportedCountries: 'US,AU',
    connected: true,
    agentAvailability: true
  }));
  http.callMeRequest = (__, options) => {
    options.callbacks.done();
    return { 'phone_number': '+15417543010' };
  };

  return render(
    <Provider store={store}>
      <Talk
        getFrameContentDocument={() => document}
        isMobile={false} />
    </Provider>
  );
};

test('talk callback submission', () => {
  const utils = setUpComponent();

  // renders the form
  expect(utils.queryByText('Enter your phone number and we\'ll call you back.'))
    .toBeInTheDocument();

  fireEvent.click(utils.getByText('Send'));

  // shows error message when attempting to submit without a phone number
  expect(utils.queryByText('Please enter a valid phone number.'))
    .toBeInTheDocument();

  const phoneField = utils.getByLabelText('Phone Number');

  fireEvent.change(phoneField, { target: { value: '12345678' } });

  fireEvent.click(utils.getByText('Send'));

  // shows error message when attempting to submit without a phone number
  expect(utils.queryByText('Please enter a valid phone number.'))
    .toBeInTheDocument();

  fireEvent.change(phoneField, { target: { value: '+15417543010' } });

  // Formats the flag to US
  expect(utils.queryByAltText('US'))
    .toBeInTheDocument();
  expect(utils.queryByAltText('AU'))
    .not.toBeInTheDocument();

  fireEvent.click(utils.getByText('Send'));

  // Displays the success message when the phone number is valid
  expect(utils.queryByText('Thanks for reaching out.'))
    .toBeInTheDocument();
  expect(utils.queryByText('We\'ll get back to you soon.'))
    .toBeInTheDocument();
});
