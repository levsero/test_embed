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

const submitForm = (utils) => fireEvent.click(utils.getByText('Send'));
const updatePhonefield = (utils, number) => {
  const phoneField = utils.getByLabelText('Phone Number');

  fireEvent.change(phoneField, { target: { value: number } });
};

const checkForForm = (utils) => {
  expect(utils.queryByText('Enter your phone number and we\'ll call you back.')).toBeInTheDocument();
};
const checkForErrorMessage = (utils) => {
  expect(utils.queryByText('Please enter a valid phone number.')).toBeInTheDocument();
};
const checkForFlag = (utils) => {
  expect(utils.queryByAltText('US')).toBeInTheDocument();
  expect(utils.queryByAltText('AU')).not.toBeInTheDocument();
};
const checkForSuccessMesage = (utils) => {
  expect(utils.queryByText('Thanks for reaching out.')).toBeInTheDocument();
  expect(utils.queryByText('We\'ll get back to you soon.')).toBeInTheDocument();
};

test('talk callback submission', () => {
  const utils = setUpComponent();

  checkForForm(utils);

  submitForm(utils);
  checkForErrorMessage(utils); // empty phone number error

  updatePhonefield(utils, '12345678');
  submitForm(utils);
  checkForErrorMessage(utils); // incorrect phone number error

  updatePhonefield(utils, '+15417543010');
  checkForFlag(utils);
  submitForm(utils);
  checkForSuccessMesage(utils);
});
