import PropTypes from 'prop-types'
import { Component } from 'react'
import { CHAT_SOCIAL_LOGIN_SCREENS } from 'constants/chat'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { Avatar } from 'src/component/Avatar'
import { Icon } from 'src/component/Icon'
import { LoadingSpinner } from 'src/component/loading/LoadingSpinner'
import SocialLogin from 'src/embeds/chat/components/SocialLogin'
import { locals as styles } from './UserProfile.scss'

export class UserProfile extends Component {
  static propTypes = {
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    nameField: PropTypes.node,
    emailField: PropTypes.node,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    authUrls: {},
    socialLogin: {},
    visitor: {},
    initiateSocialLogout: () => {},
    nameField: null,
    emailField: null,
  }

  renderAuthedProfileField() {
    const { socialLogin, visitor } = this.props
    const { authenticated: isSociallyAuthenticated, screen, avatarPath } = socialLogin
    const { display_name: displayName, email } = visitor
    const profileClasses = isSociallyAuthenticated
      ? styles.authProfileFieldContainer
      : styles.historyAuthProfileFieldContainer
    const logoutButton =
      screen !== CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING ? (
        <Icon
          className={styles.logoutIcon}
          type="Icon--trash-fill"
          onClick={this.props.initiateSocialLogout}
        />
      ) : (
        <LoadingSpinner className={styles.loadingSpinner} />
      )

    return (
      <div>
        <p>{i18n.t('embeddable_framework.chat.form.common.field.social_login.title')}</p>
        <div className={styles.authProfileContainer}>
          {isSociallyAuthenticated && (
            <Avatar className={styles.avatar} src={avatarPath} fallbackIcon="Icon--agent-avatar" />
          )}
          <div className={profileClasses}>
            <div className={styles.authProfileName}>{displayName}</div>
            <div>{email}</div>
          </div>
          {isSociallyAuthenticated && logoutButton}
        </div>
      </div>
    )
  }

  renderDefaultProfileFields() {
    return (
      <div className={styles.defaultProfileFieldsContainer}>
        {this.props.nameField}
        <SocialLogin authUrls={this.props.authUrls} />
        {this.props.emailField}
      </div>
    )
  }

  render = () => {
    const { isAuthenticated, socialLogin } = this.props
    const { authenticated: isSociallyAuthenticated } = socialLogin

    return isSociallyAuthenticated || isAuthenticated
      ? this.renderAuthedProfileField()
      : this.renderDefaultProfileFields()
  }
}
