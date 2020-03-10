import React from 'react'
import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import SocialLogin from 'src/embeds/chat/components/SocialLogin'
import UserProfileDetails from 'src/embeds/chat/components/UserProfileDetails'
import { ICONS } from 'src/constants/shared'
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
  initiateSocialLogout
}) => {
  const translate = useTranslate()
  const { authenticated: isSociallyAuthenticated, screen, avatarPath } = socialLogin
  const authenticatedProfile = isSociallyAuthenticated || isAuthenticated
  const { display_name: displayName, email } = visitor

  const logoutButton =
    screen !== CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING ? (
      <LogoutIcon type="Icon--trash-fill" onClick={initiateSocialLogout} />
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
          {<SocialLogin authUrls={authUrls} />}
          {emailField}
        </DefaultProfileContainer>
      )}
    </div>
  )
}

UserProfile.propTypes = {
  authUrls: PropTypes.objectOf(PropTypes.string),
  socialLogin: PropTypes.shape({
    authenticated: PropTypes.bool,
    screen: PropTypes.string,
    avatarPath: PropTypes.string
  }),
  visitor: PropTypes.object.isRequired,
  initiateSocialLogout: PropTypes.func.isRequired,
  nameField: PropTypes.node,
  emailField: PropTypes.node,
  isAuthenticated: PropTypes.bool.isRequired
}

export default UserProfile
