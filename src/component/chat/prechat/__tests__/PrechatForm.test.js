import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { PrechatForm } from '../PrechatForm';

const mockFormProp = {
  name: { name: 'name', required: true },
  email: { name: 'email', required: true },
  phone: { name: 'phone', label: 'Phone Number', required: false, hidden: false },
  message: { name: 'message', label: 'Message', required: false }
};

test('renders a greeting message', () => {
  const { queryByText } = render(
    <PrechatForm
      title='title'
      greetingMessage='Hi there this is a greeting message'
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      form={mockFormProp}
    />
  );

  expect(queryByText('Hi there this is a greeting message'))
    .toBeInTheDocument();
});

test('renders the expected fields', () => {
  const { queryByLabelText } = render(
    <PrechatForm
      title='title'
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      form={mockFormProp}
    />
  );

  expect(queryByLabelText('Name'))
    .toBeInTheDocument();
  expect(queryByLabelText('Email'))
    .toBeInTheDocument();
  expect(queryByLabelText(/Phone Number/))
    .toBeInTheDocument();
  expect(queryByLabelText(/Message/))
    .toBeInTheDocument();
});

test('renders fields as optional if required is false', () => {
  let formProp = {
    name: { name: 'name' },
    email: { name: 'email' },
    phone: { name: 'phone', label: 'Phone Number', required: false, hidden: false },
    message: { name: 'message', required: false }
  };
  const { queryByLabelText } = render(
    <PrechatForm
      title='title'
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      form={formProp}
    />
  );

  expect(queryByLabelText('Name (optional)'))
    .toBeInTheDocument();
  expect(queryByLabelText('Email (optional)'))
    .toBeInTheDocument();
  expect(queryByLabelText('Phone Number (optional)'))
    .toBeInTheDocument();
  expect(queryByLabelText('Message (optional)'))
    .toBeInTheDocument();
});

test('does not render phoneEnabled is true', () => {
  let formProp = {
    ...mockFormProp,
    phone: { name: 'phone', required: false, hidden: true },
  };
  const { queryByLabelText } = render(
    <PrechatForm
      title='title'
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      phoneEnabled={false}
      form={formProp}
    />
  );

  expect(queryByLabelText(/Phone/))
    .not.toBeInTheDocument();
});

test('does not render contact information if loginEnabled is false', () => {
  const { queryByLabelText } = render(
    <PrechatForm
      title='title'
      loginEnabled={false}
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      form={mockFormProp}
    />
  );

  expect(queryByLabelText('Name'))
    .not.toBeInTheDocument();
  expect(queryByLabelText('Email'))
    .not.toBeInTheDocument();
  expect(queryByLabelText(/Phone Number/))
    .not.toBeInTheDocument();
});

describe('validation', () => {
  it('validates required fields', () => {
    const formProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: true },
      phone: { name: 'phone', label: 'Phone Number', required: true },
      message: { name: 'message', label: 'Message', required: true }
    };
    const { getByText, queryByText } = render(
      <PrechatForm
        title='title'
        initiateSocialLogout={() => {}}
        isAuthenticated={false}
        form={formProp}
      />
    );

    fireEvent.click(getByText('Start chat'));

    expect(queryByText('Please enter a valid name.'))
      .toBeInTheDocument();
    expect(queryByText('Please enter a valid email address.'))
      .toBeInTheDocument();
    expect(queryByText('Please enter a valid phone number.'))
      .toBeInTheDocument();
    expect(queryByText('Please enter a valid message.'))
      .toBeInTheDocument();
  });

  it('validates email value is a valid email', () => {
    const formProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: false },
      phone: { name: 'phone', required: false },
      message: { name: 'message', required: false }
    };
    const { getByText, queryByText } = render(
      <PrechatForm
        title='title'
        initiateSocialLogout={() => {}}
        isAuthenticated={false}
        form={formProp}
        formState={
          { email: 'sadfasdfsfd' }
        }
      />
    );

    fireEvent.click(getByText('Start chat'));

    expect(queryByText('Please enter a valid email address.'))
      .toBeInTheDocument();
  });

  it('validates phone number value is a valid phone number', () => {
    const { getByText, queryByText } = render(
      <PrechatForm
        title='title'
        initiateSocialLogout={() => {}}
        isAuthenticated={false}
        form={mockFormProp}
        formState={
          { phone: 'sadfasdfsfd' }
        }
      />
    );

    fireEvent.click(getByText('Start chat'));

    expect(queryByText('Please enter a valid phone number.'))
      .toBeInTheDocument();
  });
});

test('submits expected form data', () => {
  jest.useFakeTimers();
  const formData = {
    email: 'me@zd.com',
    name: 'Homer Simpson',
    phone: '61422111222',
    message: 'This is the message'
  };
  const formHandler = jest.fn();
  const { getByText } = render(
    <PrechatForm
      title='title'
      initiateSocialLogout={() => {}}
      isAuthenticated={false}
      form={mockFormProp}
      formState={formData}
      onFormCompleted={formHandler}
    />
  );

  jest.runAllTimers();

  fireEvent.click(getByText('Start chat'));

  expect(formHandler)
    .toHaveBeenCalledWith(formData);
});
