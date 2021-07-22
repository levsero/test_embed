import PropTypes from 'prop-types'
import { CHAT_SOCIAL_LOGIN_SCREENS } from 'src/constants/chat'
import { ICONS, TEST_IDS } from 'src/constants/shared'
import UserProfileDetails from 'src/embeds/chat/components/UserProfileDetails'
import useTranslate from 'src/hooks/useTranslate'
import {
  AuthenticatedProfileContainer,
  LoadingSpinnerIcon,
  LogoutIcon,
  SocialAvatar,
} from './styles'

const AuthenticatedProfile = ({ socialLogin, visitor, initiateSocialLogout }) => {
  const translate = useTranslate()

  const logoutButton =
    socialLogin.screen === CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING ? (
      <LoadingSpinnerIcon />
    ) : (
      <LogoutIcon onClick={initiateSocialLogout} data-testid={TEST_IDS.ICON_LOGOUT} />
    )

  return (
    <>
      <p>{translate('embeddable_framework.chat.form.common.field.social_login.title')}</p>
      <AuthenticatedProfileContainer>
        {socialLogin.authenticated && (
          <SocialAvatar src={socialLogin.avatarPath} fallbackIcon={ICONS.AGENT_AVATAR} />
        )}
        <UserProfileDetails
          isSociallyAuthenticated={socialLogin.authenticated}
          displayName={visitor.display_name}
          email={visitor.email}
        />
        {socialLogin.authenticated && logoutButton}
      </AuthenticatedProfileContainer>
    </>
  )
}

AuthenticatedProfile.propTypes = {
  socialLogin: PropTypes.shape({
    avatarPath: PropTypes.string,
    authenticated: PropTypes.bool,
    screen: PropTypes.oneOf([...Object.values(CHAT_SOCIAL_LOGIN_SCREENS), '']),
  }),
  visitor: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string,
  }),
  initiateSocialLogout: PropTypes.func.isRequired,
}

export default AuthenticatedProfile
