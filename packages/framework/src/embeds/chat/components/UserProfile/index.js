import PropTypes from 'prop-types'
import AuthenticatedProfile from 'src/embeds/chat/components/AuthenticatedProfile'
import SocialLogin from 'src/embeds/chat/components/SocialLogin'
import { DefaultProfileContainer } from './styles'

const UserProfile = ({
  isAuthenticated,
  socialLogin,
  visitor,
  nameField,
  authUrls,
  emailField,
  initiateSocialLogout,
  shouldSpaceSocialLogin,
}) => {
  const { authenticated: isSociallyAuthenticated } = socialLogin
  const authenticatedProfile = isSociallyAuthenticated || isAuthenticated

  return (
    <div>
      {authenticatedProfile && (
        <AuthenticatedProfile
          visitor={visitor}
          socialLogin={socialLogin}
          initiateSocialLogout={initiateSocialLogout}
        />
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
    avatarPath: PropTypes.string,
  }),
  visitor: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
}

export default UserProfile
