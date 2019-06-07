import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { PrechatForm } from '../PrechatForm';

const mockFormProp = {
  name: { name: 'name', required: true },
  email: { name: 'email', required: true },
  phone: { name: 'phone', label: 'Phone Number', required: false, hidden: false },
  message: { name: 'message', label: 'Message', required: false },
  department: { name: 'department', label: 'department', required: false }
};

const renderPrechatForm = (inProps = {}) => {
  const defaultProps = {
    title: 'title',
    form: mockFormProp,
    hasChatHistory: false,
    greetingMessage: 'Hi there this is a greeting message',
    initiateSocialLogout: () => {},
    isAuthenticated: false,
    openedChatHistory: () => {},
    chatHistoryLabel: 'Chat History here!'
  };

  const combinedProps = {
    ...defaultProps,
    ...inProps
  };

  return render(
    <PrechatForm
      {...combinedProps}
    /> );
};

test('renders a greeting message', () => {
  const { queryByText } = renderPrechatForm();

  expect(queryByText('Hi there this is a greeting message'))
    .toBeInTheDocument();
});

test('renders the expected fields', () => {
  const { queryByLabelText } = renderPrechatForm();

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
  const { queryByLabelText } = renderPrechatForm({
    form: formProp
  });

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
  const { queryByLabelText } = renderPrechatForm( {
    phoneEnabled: false,
    form: formProp
  });

  expect(queryByLabelText(/Phone/))
    .not.toBeInTheDocument();
});

test('does not render contact information if loginEnabled is false', () => {
  const { queryByLabelText } = renderPrechatForm({
    loginEnabled:false
  });

  expect(queryByLabelText('Name'))
    .not.toBeInTheDocument();
  expect(queryByLabelText('Email'))
    .not.toBeInTheDocument();
  expect(queryByLabelText(/Phone Number/))
    .not.toBeInTheDocument();
});

describe('submit button', () => {
  it('has the `Start chat` string when an online department is selected', () => {
    let formProp = {
      ...mockFormProp,
      departments: [{ name: 'department', id: 123, status: 'online' }]
    };

    const { queryByText } = renderPrechatForm({
      form: formProp,
      formState: { department: 123 }
    });

    expect(queryByText('Start chat'))
      .toBeInTheDocument();
  });

  it('has the `Send message` string when an offline department is selected', () => {
    let formProp = {
      ...mockFormProp,
      departments: [{ name: 'department', id: 123, status: 'offline' }],
    };

    const { queryByText } = renderPrechatForm({
      form: formProp,
      formState: { department: 123 }
    });

    expect(queryByText('Send message'))
      .toBeInTheDocument();
  });
});

describe('ChatHistoryLink', () => {
  describe('when Authenticated and Chat History exists', () => {
    it('contains link', () => {
      const { queryByText } = renderPrechatForm({
        isAuthenticated: true,
        hasChatHistory: true
      });

      expect(queryByText('Chat History here!')).toBeInTheDocument();
    });
  });

  describe('when values are false', () => {
    describe('when isAuthenticated is false', () => {
      it('does not contain link', () => {
        const { queryByText } = renderPrechatForm({
          isAuthenticated: false,
          hasChatHistory: true
        });

        expect(queryByText('Chat History here!')).not.toBeInTheDocument();
      });
    });

    describe('when hasChatHistory is false', () => {
      it('does not contain link', () => {
        const { queryByText } = renderPrechatForm({
          isAuthenticated: true,
          hasChatHistory: false
        });

        expect(queryByText('Chat History here!')).not.toBeInTheDocument();
      });
    });
  });
});

describe('validation', () => {
  it('validates required fields', () => {
    const formProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: true },
      phone: { name: 'phone', label: 'Phone Number', required: true },
      message: { name: 'message', label: 'Message', required: true }
    };
    const { getByText, queryByText } = renderPrechatForm({
      form: formProp
    });

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
    const { getByText, queryByText } = renderPrechatForm({
      form: formProp,
      formState:  { email: 'sadfasdfsfd' }
    });

    fireEvent.click(getByText('Start chat'));

    expect(queryByText('Please enter a valid email address.'))
      .toBeInTheDocument();
  });

  it('validates phone number value is a valid phone number', () => {
    const { getByText, queryByText } = renderPrechatForm({
      formState: { phone: 'sadfasdfsfd' }
    });

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
    phone: '555-555-5555',
    message: 'This is the message'
  };
  const formHandler = jest.fn();
  const { getByText } = renderPrechatForm({
    formState: formData,
    onFormCompleted: formHandler
  });

  jest.runAllTimers();

  fireEvent.click(getByText('Start chat'));

  expect(formHandler)
    .toHaveBeenCalledWith(formData);
});

describe('#shouldHideDepartments', () => {
  let mockDepartments,
    mockSettingsDepartments,
    component,
    result;

  beforeEach(() => {

    component = instanceRender(
      <PrechatForm
        settingsDepartmentsEnabled={mockSettingsDepartments}
        form={mockFormProp}
        formState={mockForm} />
    );

    result = component.shouldHideDepartments(mockDepartments);
  });


  describe('when there are no departments', () => {
    beforeAll(() => {
      mockDepartments = [];
    });

    it('returns true', () => {
      expect(result).toEqual(true);
    });
  });

  describe('when there is one department', () => {
    describe('and it is a default, hidden via api', () => {
      beforeAll(() => {
        mockSettingsDepartments = [];
        mockDepartments = [{ id: 1, status: 'online', isDefault: true }];
      });

      it('returns true', () => {
        expect(result).toEqual(true);
      });
    });

    describe('and it is not default', () => {
      beforeAll(() => {
        mockDepartments = [{ id: 1, status: 'online', isDefault: false }];
      });

      it('returns false', () => {
        expect(result).toEqual(false);
      });
    });
  });

  describe('when there are more than one departments', () => {
    beforeAll(() => {
      mockDepartments = [
      { id: 1, status: 'online', isDefault: false },
      { id: 2, status: 'offline', isDefault: true }
      ];
    });

    it('returns false', () => {
      expect(result).toEqual(false);
    });
  });
});
