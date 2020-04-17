import React from 'react'
import { find } from 'styled-components/test-utils'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'constants/shared'
import SocialLogin from '../'
import { SocialLoginContainer } from 'embeds/chat/components/SocialLogin/styles'

describe('SocialLogin', () => {
  const defaultProps = {
    authUrls: {}
  }

  const renderComponent = (props = {}) => render(<SocialLogin {...defaultProps} {...props} />)

  it('renders nothing when no social services are available', () => {
    const { container } = renderComponent({ authUrls: {} })

    expect(find(container, SocialLoginContainer)).toBeNull()
  })

  beforeEach(() => {
    window.open = jest.fn()
  })

  describe('when facebook is available', () => {
    it('renders a button to log into facebook', () => {
      const { queryByTestId } = renderComponent({
        authUrls: {
          facebook: 'www.facebook.com'
        }
      })

      expect(queryByTestId(TEST_IDS.ICON_FACEBOOK)).toBeInTheDocument()
    })

    it('opens the url to login to facebook when button is clicked', () => {
      const { queryByTestId } = renderComponent({
        authUrls: {
          facebook: 'www.facebook.com'
        }
      })

      fireEvent.click(queryByTestId(TEST_IDS.ICON_FACEBOOK))

      expect(window.open).toHaveBeenCalledWith('www.facebook.com')
    })
  })

  describe('when google is available', () => {
    it('renders a button to log into google', () => {
      const { queryByTestId } = renderComponent({
        authUrls: {
          google: 'www.google.com'
        }
      })

      expect(queryByTestId(TEST_IDS.ICON_GOOGLE)).toBeInTheDocument()
    })

    it('opens the url to login to facebook when button is clicked', () => {
      const { queryByTestId } = renderComponent({
        authUrls: {
          facebook: 'www.google.com'
        }
      })

      fireEvent.click(queryByTestId(TEST_IDS.ICON_FACEBOOK))

      expect(window.open).toHaveBeenCalledWith('www.google.com')
    })
  })
})
