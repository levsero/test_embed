import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import { Modal } from '@zendeskgarden/react-modals'
import Footer from '../'

const updateContactDetailsVisibility = jest.fn()

const renderComponent = (props = {}) => {
  const defaultProps = {
    isAuthenticated: false,
    submitting: false,
    updateContactDetailsVisibility,
  }
  return render(
    <Modal>
      <Footer {...defaultProps} {...props} />
    </Modal>
  )
}

describe('Contact Details Footer', () => {
  it('contains Cancel button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Cancel')).toBeInTheDocument()
  })

  it('contains Save button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Save')).toBeInTheDocument
  })

  describe('when authenticated', () => {
    it('does not show the Save button', () => {
      const { queryByTestId } = renderComponent({ isAuthenticated: true })

      expect(queryByTestId(TEST_IDS.BUTTON_OK)).toBeNull()
    })
  })

  describe('when is submitting', () => {
    describe('save click', () => {
      it(`shows Dots instead of 'save'`, () => {
        const { getByTestId, queryByText } = renderComponent({ submitting: true })

        expect(queryByText('save')).toBeNull()

        expect(getByTestId(TEST_IDS.DOTS)).toBeInTheDocument()
      })
    })
  })
})
