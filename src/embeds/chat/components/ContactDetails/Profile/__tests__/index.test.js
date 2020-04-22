import React from 'react'
import { wait } from '@testing-library/dom'
import { render } from 'src/util/testHelpers'
import { Form } from 'react-final-form'

import { TEST_IDS } from 'constants/shared'
import ChatContactDetailsUserProfile from '../'

const initiateSocialLogout = jest.fn()
const renderComponent = async (props = {}) => {
  const defaultProps = {
    authUrls: {},
    contactDetails: {},
    initiateSocialLogout,
    isAuthenticated: false,
    requiredFormData: {
      name: {
        required: true
      },
      email: {
        required: true
      }
    },
    socialLogin: {},
    visitor: { display_name: '', email: '' }
  }

  const combinedVisitor = { ...defaultProps.visitor, ...props.visitor }

  const result = render(
    <Form
      initialValues={{ display_name: combinedVisitor.display_name, email: combinedVisitor.email }}
      onSubmit={() => {}}
      render={() => <ChatContactDetailsUserProfile {...defaultProps} {...props} />}
    />
  )

  await wait(() => expect(result.getByTestId(TEST_IDS.NAME_FIELD)).toBeInTheDocument())

  //We have to use a Form render here as RFF complains if there isn't one in scope
  return result
}

describe('userProfile', () => {
  it('renders emailField', async () => {
    const { getByTestId } = await renderComponent()

    expect(getByTestId(TEST_IDS.EMAIL_FIELD)).toBeInTheDocument()
  })

  it('focuses the name input on first render', async () => {
    const { queryByTestId } = await renderComponent()

    expect(queryByTestId(TEST_IDS.NAME_FIELD)).toHaveFocus()
  })

  it('renders nameField', async () => {
    const { getByTestId } = await renderComponent()

    expect(getByTestId(TEST_IDS.NAME_FIELD)).toBeInTheDocument()
  })

  describe('field labels', () => {
    describe('when name is optional', () => {
      it(`renders additional 'optional' key`, async () => {
        const { getByText } = await renderComponent({
          requiredFormData: { name: { required: false }, email: { required: true } }
        })

        expect(getByText('(optional)')).toBeInTheDocument()
      })
    })

    describe('when email is optional', () => {
      it(`renders additional 'optional' key`, async () => {
        const { getByText } = await renderComponent({
          requiredFormData: { name: { required: true }, email: { required: false } }
        })

        expect(getByText('(optional)')).toBeInTheDocument()
      })
    })

    describe('when both are optional', () => {
      it(`renders two 'optional' keys`, async () => {
        const { getAllByText } = await renderComponent({
          requiredFormData: { name: { required: false }, email: { required: false } }
        })

        expect(getAllByText('(optional)').length).toEqual(2)
      })
    })
  })
})
