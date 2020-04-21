import React from 'react'
import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import SocialLogin from 'src/embeds/chat/components/SocialLogin'
import UserProfileDetails from 'src/embeds/chat/components/UserProfileDetails'
import { ICONS, TEST_IDS } from 'src/constants/shared'
import { CHAT_SOCIAL_LOGIN_SCREENS } from 'constants/chat'
import {
  LoadingSpinnerIcon,
  AuthenticatedProfileContainer,
  DefaultProfileContainer,
  SocialAvatar,
  LogoutIcon
} from './styles'

const UserProfile = ({
  isAuthenticated,
  socialLogin,
  visitor,
  nameField,
  authUrls,
  emailField,
  initiateSocialLogout,
  shouldSpaceSocialLogin
}) => {
  const translate = useTranslate()
  const { authenticated: isSociallyAuthenticated, screen, avatarPath } = socialLogin
  const authenticatedProfile = isSociallyAuthenticated || isAuthenticated
  const { display_name: displayName, email } = visitor

  const logoutButton =
    screen !== CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING ? (
      <LogoutIcon onClick={initiateSocialLogout} data-testid={TEST_IDS.ICON_LOGOUT} />
    ) : (
      <LoadingSpinnerIcon />
    )

  return (
    <div>
      {authenticatedProfile && (
        <>
          <p>{translate('embeddable_framework.chat.form.common.field.social_login.title')}</p>
          <AuthenticatedProfileContainer>
            {isSociallyAuthenticated && (
              <SocialAvatar src={avatarPath} fallbackIcon={ICONS.AGENT_AVATAR} />
            )}
            <UserProfileDetails
              isSociallyAuthenticated={isSociallyAuthenticated}
              displayName={displayName}
              email={email}
            />
            {isSociallyAuthenticated && logoutButton}
          </AuthenticatedProfileContainer>
        </>
      )}

      {!authenticatedProfile && (
        <DefaultProfileContainer>
          {nameField}
          {<SocialLogin authUrls={authUrls} shouldSpace={shouldSpaceSocialLogin} />}
          {emailField}
        </DefaultProfileContainer>
      )}
    </div>
  )
}

UserProfile.propTypes = {
  authUrls: PropTypes.objectOf(PropTypes.string),
  emailField: PropTypes.node,
  initiateSocialLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  nameField: PropTypes.node,
  shouldSpaceSocialLogin: PropTypes.bool,
  socialLogin: PropTypes.shape({
    authenticated: PropTypes.bool,
    screen: PropTypes.string,
    avatarPath: PropTypes.string
  }),
  visitor: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string
  }).isRequired
}

export default UserProfile
