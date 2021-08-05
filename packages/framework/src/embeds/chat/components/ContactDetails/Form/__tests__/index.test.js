import { fireEvent } from '@testing-library/react'
import { Modal } from '@zendeskgarden/react-modals'
import { TEST_IDS } from 'src/constants/shared'
import { render } from 'src/util/testHelpers'
import { Component } from '../'

const editContactDetailsSubmitted = jest.fn()
const onSuccess = jest.fn()
const updateContactDetailsVisibility = jest.fn()
const initiateSocialLogout = jest.fn()

const renderComponent = (props = {}, inRender) => {
  const defaultProps = {
    authUrls: {},
    contactDetails: { display_name: 'totally not bob saget', email: 'lookAtThis@email.com' },
    editContactDetailsSubmitted,
    initiateSocialLogout,
    isAuthenticated: false,
    onSuccess,
    requiredFormData: {
      name: { required: true },
      email: { required: true },
    },
    socialLogin: { authenticated: false },
    updateContactDetailsVisibility,
    visitor: { display_name: 'bob saget', email: 'stop@lookingAtMyEmail.com' },
  }

  return render(
    <Modal>
      <Component {...defaultProps} {...props} />
    </Modal>,
    { render: inRender }
  )
}

describe('Contact Details Form', () => {
  describe('default render', () => {
    it('contains Cancel button', () => {
      const { getByText } = renderComponent()
      expect(getByText('Cancel')).toBeInTheDocument()
    })

    it('contains Save button', () => {
      const { getByText } = renderComponent()
      expect(getByText('Save')).toBeInTheDocument()
    })
    it('contains name field', () => {
      const { getByText } = renderComponent()
      expect(getByText('Name')).toBeInTheDocument()
    })
    it('contains email field', () => {
      const { getByText } = renderComponent()
      expect(getByText('Email')).toBeInTheDocument()
    })

    describe('on Cancel click', () => {
      it('closes the Modal', () => {
        const { getByText } = renderComponent()

        fireEvent.click(getByText('Cancel'))

        expect(updateContactDetailsVisibility).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('on Save click', () => {
    describe('when values are valid', () => {
      it('submits with the contactDetails', () => {
        const { getByText } = renderComponent()

        fireEvent.click(getByText('Save'))

        expect(editContactDetailsSubmitted).toHaveBeenCalledWith({
          display_name: 'totally not bob saget',
          email: 'lookAtThis@email.com',
        })
      })
    })

    describe('when values are invalid', () => {
      describe('email is invalid', () => {
        it('does not submit contact details', () => {
          const { getByText } = renderComponent({
            contactDetails: { display_name: 'bob', email: 'abc' },
          })

          fireEvent.click(getByText('Save'))

          expect(editContactDetailsSubmitted).not.toHaveBeenCalled()
        })

        it('displays an email error', () => {
          const { getByText, rerender } = renderComponent({
            contactDetails: { display_name: 'bob', email: 'abc' },
          })

          fireEvent.click(getByText('Save'))

          renderComponent(
            {
              contactDetails: { display_name: 'bob', email: 'abc' },
            },
            rerender
          )

          expect(getByText('Please enter a valid email address.')).toBeInTheDocument()
        })
      })

      describe('name is invalid', () => {
        it('does not submit contact details', () => {
          const { getByText } = renderComponent({
            contactDetails: { display_name: '', email: 'abc@abc.abc' },
            requiredFormData: { name: { required: true }, email: { required: true } },
          })

          fireEvent.click(getByText('Save'))

          expect(editContactDetailsSubmitted).not.toHaveBeenCalled()
        })

        it('displays a name error', () => {
          const { getByText, rerender } = renderComponent({
            contactDetails: { display_name: '', email: 'abc@abc.abc' },
            requiredFormData: { name: { required: true }, email: { required: true } },
          })

          fireEvent.click(getByText('Save'))

          renderComponent(
            {
              contactDetails: { display_name: '', email: 'abc@abc.abc' },
              requiredFormData: { name: { required: true }, email: { required: true } },
            },
            rerender
          )

          expect(getByText('Enter a valid name.')).toBeInTheDocument()
        })
      })
    })
  })

  describe('social login', () => {
    describe('when not socially logged in', () => {
      describe('and facebook is enabled', () => {
        it('renders social sign in space', () => {
          const { getByText } = renderComponent({
            authUrls: {
              facebook: 'facebook link',
            },
          })

          expect(getByText('Or social sign in:')).toBeInTheDocument()
        })

        it('renders facebook login button', () => {
          const { getByTestId } = renderComponent({
            authUrls: {
              facebook: 'facebook link',
            },
          })

          expect(getByTestId(TEST_IDS.ICON_FACEBOOK)).toBeInTheDocument()
        })
      })

      describe('and google is enabled', () => {
        it('renders social sign in space', () => {
          const { getByText } = renderComponent({
            authUrls: {
              google: 'google link',
            },
          })
          expect(getByText('Or social sign in:')).toBeInTheDocument()
        })

        it('renders google login button', () => {
          const { getByTestId } = renderComponent({
            authUrls: {
              google: 'google link',
            },
          })

          expect(getByTestId(TEST_IDS.ICON_GOOGLE)).toBeInTheDocument()
        })
      })

      describe('and neither are enabled', () => {
        it(`doesn't render social sign in space`, () => {
          const { queryByText } = renderComponent()
          expect(queryByText('Or social sign in:')).toBeNull()
        })

        it(`doesn't render either icon`, () => {
          const { queryByTestId } = renderComponent()

          expect(queryByTestId(TEST_IDS.ICON_FACEBOOK)).toBeNull()
          expect(queryByTestId(TEST_IDS.ICON_GOOGLE)).toBeNull()
        })
      })
    })

    describe('when socially logged in', () => {
      it('shows the Your Profile view', () => {
        const { getByText } = renderComponent({
          socialLogin: { authenticated: true },
        })

        expect(getByText('Your profile:')).toBeInTheDocument()
      })

      describe('and the user clicks the logout button', () => {
        it('calls initiateSocialLogout', () => {
          const { getByTestId } = renderComponent({
            socialLogin: { authenticated: true },
          })

          fireEvent.click(getByTestId(TEST_IDS.ICON_LOGOUT))

          expect(initiateSocialLogout).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when fields are optional', () => {
    describe('when name field is optional', () => {
      it(`renders a single 'optional' tag`, () => {
        const { getByText } = renderComponent({
          requiredFormData: { name: { required: false }, email: { required: true } },
        })

        expect(getByText('(optional)')).toBeInTheDocument()
      })
    })

    describe('when email field is optional', () => {
      it(`renders a single 'optional' tag`, () => {
        const { getByText } = renderComponent({
          requiredFormData: { name: { required: true }, email: { required: false } },
        })

        expect(getByText('(optional)')).toBeInTheDocument()
      })
    })

    describe('when both fields are optional', () => {
      it(`renders two 'optional' tags`, () => {
        const { getAllByText } = renderComponent({
          requiredFormData: { name: { required: false }, email: { required: false } },
        })

        expect(getAllByText('(optional)').length).toEqual(2)
      })
    })
  })

  describe('when the user is authenticated', () => {
    it('renders the Authenticated profile view', () => {
      const { getByText } = renderComponent({ isAuthenticated: true })

      expect(getByText('Your profile:')).toBeInTheDocument()
      expect(getByText('bob saget')).toBeInTheDocument()
      expect(getByText('stop@lookingAtMyEmail.com')).toBeInTheDocument()
    })

    it('renders the cancel button', () => {
      const { getByText } = renderComponent({ isAuthenticated: true })

      expect(getByText('Cancel')).toBeInTheDocument()
    })

    it('does not render the Savebutton', () => {
      const { queryByText } = renderComponent({ isAuthenticated: true })

      expect(queryByText('Save')).toBeNull()
    })

    it('shows the Your Profile view', () => {
      const { getByText } = renderComponent({ isAuthenticated: true })

      expect(getByText('Your profile:')).toBeInTheDocument()
    })
  })
})
