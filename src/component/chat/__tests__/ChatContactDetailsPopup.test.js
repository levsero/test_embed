import React from 'react'
import { render } from 'src/util/testHelpers'
import { EDIT_CONTACT_DETAILS_SCREEN } from 'constants/chat'
import { IdManager } from '@zendeskgarden/react-selection'
import { ChatContactDetailsPopup } from '../ChatContactDetailsPopup'

let initiateSocialLogoutSpy = () => {}

const renderComponent = modifiedProps => {
  const defaultProps = {
    authUrls: {},
    socialLogin: {},
    screen: EDIT_CONTACT_DETAILS_SCREEN,
    visitor: {},
    isMobile: false,
    showCta: () => {},
    show: true,
    initiateSocialLogout: initiateSocialLogoutSpy,
    contactDetails: { display_name: 'bob', email: 'bob@saget.com' }
  }

  const props = {
    ...defaultProps,
    ...modifiedProps
  }

  IdManager.setIdCounter(0)
  return render(<ChatContactDetailsPopup {...props} />)
}

describe('render', () => {
  let result

  describe('defaults', () => {
    beforeEach(() => {
      result = renderComponent()
    })

    it('renders name field', () => {
      expect(result.queryByText('Name')).toBeInTheDocument()
    })

    it('renders two optional fields', () => {
      expect(result.queryAllByText('(optional)').length).toEqual(2)
    })

    it('renders email field', () => {
      expect(result.queryByText('Email')).toBeInTheDocument()
    })

    it('renders cancel button', () => {
      expect(result.queryByText('Cancel')).toBeInTheDocument()
    })

    it('renders save button', () => {
      expect(result.queryByText('Save')).toBeInTheDocument()
    })
  })

  describe('with required fields', () => {
    describe('Name required', () => {
      let mockProps

      beforeEach(() => {
        mockProps = {
          requiredFormData: { name: { required: true }, email: { required: false } }
        }
      })

      it('renders one optional field', () => {
        result = renderComponent(mockProps)
        expect(result.queryAllByText('(optional)').length).toEqual(1)
      })

      it('does not disable save', () => {
        result = renderComponent(mockProps)

        expect(result.getByText('Save')).not.toBeDisabled()
      })

      it('does not render an error message', () => {
        result = renderComponent(mockProps)

        expect(result.queryByText('Please enter a valid name.')).not.toBeInTheDocument()
      })

      describe('when name is empty', () => {
        beforeEach(() => {
          mockProps = {
            ...mockProps,
            contactDetails: { display_name: '', email: 'some@valid.email' }
          }
        })

        it('renders an error message', () => {
          result = renderComponent(mockProps)

          expect(result.queryByText('Please enter a valid name.')).toBeInTheDocument()
        })

        it('disables Save', () => {
          result = renderComponent(mockProps)

          expect(result.getByText('Save')).toBeDisabled()
        })
      })
    })

    describe('Email required', () => {
      let mockProps
      beforeEach(() => {
        mockProps = {
          requiredFormData: { name: { required: false }, email: { required: true } }
        }
      })

      it('renders one optional field', () => {
        result = renderComponent(mockProps)
        expect(result.queryAllByText('(optional)').length).toEqual(1)
      })

      it('does not render an error message', () => {
        result = renderComponent(mockProps)

        expect(result.queryByText('Please enter a valid name.')).not.toBeInTheDocument()
      })

      it('enables save', () => {
        result = renderComponent(mockProps)

        expect(result.getByText('Save')).not.toBeDisabled()
      })

      describe('when email is empty', () => {
        beforeEach(() => {
          mockProps = {
            ...mockProps,
            contactDetails: { display_name: 'bob', email: '' }
          }
        })

        it('renders an error message', () => {
          result = renderComponent(mockProps)

          expect(result.queryByText('Please enter a valid email address.')).toBeInTheDocument()
        })

        it('disables Save', () => {
          result = renderComponent(mockProps)

          expect(result.getByText('Save')).toBeDisabled()
        })
      })

      describe('when email is invalid', () => {
        beforeEach(() => {
          mockProps = {
            ...mockProps,
            contactDetails: { display_name: 'bob', email: 'invalid@email' }
          }
        })

        it('renders an error message', () => {
          result = renderComponent(mockProps)

          expect(result.queryByText('Please enter a valid email address.')).toBeInTheDocument()
        })

        it('disables Save', () => {
          result = renderComponent(mockProps)

          expect(result.getByText('Save')).toBeDisabled()
        })
      })
    })

    describe('Name and Email required', () => {
      beforeEach(() => {
        result = renderComponent({
          requiredFormData: { name: { required: true }, email: { required: true } }
        })
      })

      it('renders no optional fields', () => {
        expect(result.queryAllByText('(optional)').length).toEqual(0)
      })
    })
  })
})
