import { CHAT_SOCIAL_LOGIN_SCREENS } from 'classicSrc/constants/chat'
import { TEST_IDS } from 'classicSrc/constants/shared'
import AuthenticatedProfile from 'classicSrc/embeds/chat/components/AuthenticatedProfile'
import {
  LoadingSpinnerIcon,
  SocialAvatar,
} from 'classicSrc/embeds/chat/components/AuthenticatedProfile/styles'
import { render } from 'classicSrc/util/testHelpers'
import { find } from 'styled-components/test-utils'

describe('AuthenticatedProfile', () => {
  const defaultProps = {
    socialLogin: {
      avatarPath: 'www.example.com/avatar',
      authenticated: false,
      screen: null,
    },
    visitor: {
      display_name: 'Some visitor',
      email: 'visitor@example.com',
    },
    initiateSocialLogout: jest.fn(),
  }

  const renderComponent = (props = {}) =>
    render(<AuthenticatedProfile {...defaultProps} {...props} />)

  it('displays a title for the profile', () => {
    const { getByText } = renderComponent()

    expect(getByText('Your profile:')).toBeInTheDocument()
  })

  it("displays the user's information", () => {
    const { getByText } = renderComponent()

    expect(getByText('Some visitor')).toBeInTheDocument()
    expect(getByText('visitor@example.com')).toBeInTheDocument()
  })

  describe('when the user is authenticated through a social network', () => {
    it('displays an avatar', () => {
      const { container } = renderComponent({
        socialLogin: {
          ...defaultProps.socialLogin,
          authenticated: true,
        },
      })

      const image = find(container, SocialAvatar)

      expect(image).toHaveAttribute('src', 'www.example.com/avatar')
    })

    it('displays a logout button', () => {
      const { getByTestId } = renderComponent({
        socialLogin: {
          ...defaultProps.socialLogin,
          authenticated: true,
        },
      })

      expect(getByTestId(TEST_IDS.ICON_LOGOUT)).toBeInTheDocument()
    })

    it('displays a loading spinner if the user is currently logging out', () => {
      const { container } = renderComponent({
        socialLogin: {
          ...defaultProps,
          authenticated: true,
          screen: CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING,
        },
      })

      expect(find(container, LoadingSpinnerIcon)).toBeInTheDocument()
    })
  })
})
