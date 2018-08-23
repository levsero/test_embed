import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Icon } from 'component/Icon';
import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { Avatar } from 'component/Avatar';

import { i18n } from 'service/i18n';
import { locals as styles } from './UserProfile.scss';
import { CHAT_SOCIAL_LOGIN_SCREENS } from 'constants/chat';

export class UserProfile extends Component {
  static propTypes = {
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    nameField: PropTypes.node,
    emailField: PropTypes.node,
    isAuthenticated: PropTypes.bool.isRequired
  };

  static defaultProps = {
    authUrls: {},
    socialLogin: {},
    visitor: {},
    initiateSocialLogout: () => {},
    nameField: null,
    emailField: null
  };

  renderAuthedProfileField() {
    const { isAuthenticated, socialLogin, visitor } = this.props;
    const { screen, avatarPath } = socialLogin;
    const { display_name: displayName, email } = visitor;
    const profileClasses = isAuthenticated
      ? styles.historyAuthProfileFieldContainer
      : styles.authProfileFieldContainer;
    const logoutButton = (screen !== CHAT_SOCIAL_LOGIN_SCREENS.LOGOUT_PENDING)
      ? <Icon className={styles.logoutIcon}
        type='Icon--trash-fill'
        onClick={this.props.initiateSocialLogout} />
      : <LoadingSpinner className={styles.loadingSpinner} />;

    return (
      <div>
        <p>{i18n.t('embeddable_framework.chat.form.common.field.social_login.title')}</p>
        <div className={styles.authProfileContainer}>
          {!isAuthenticated && <Avatar className={styles.avatar} src={avatarPath} fallbackIcon="Icon--agent-avatar" />}
          <div className={profileClasses}>
            <div className={styles.authProfileName}>{displayName}</div>
            <div>{email}</div>
          </div>
          {!isAuthenticated && logoutButton}
        </div>
      </div>
    );
  }

  renderDefaultProfileFields() {
    return (
      <div className={styles.defaultProfileFieldsContainer}>
        {this.props.nameField}
        {this.renderSocialLoginField()}
        {this.props.emailField}
      </div>
    );
  }

  renderSocialLoginOptions(authUrls) {
    return _.map(authUrls, (loginUrl, loginType) => (
      <a className={styles.socialLoginOptions} title={loginType} key={loginType} href={loginUrl} target='_blank'>
        <Icon type={`Icon--${loginType}`} />
      </a>
    ));
  }

  renderSocialLoginField() {
    const { authUrls } = this.props;

    if (_.size(authUrls) === 0) return null;

    return (
      <div className={styles.socialLoginContainer}>
        {i18n.t('embeddable_framework.chat.form.common.field.social_login.label')}
        {this.renderSocialLoginOptions(authUrls)}
      </div>
    );
  }

  render = () => {
    const { isAuthenticated, socialLogin } = this.props;
    const { authenticated: isSociallyAuthenticated } = socialLogin;

    return (isSociallyAuthenticated || isAuthenticated)
      ? this.renderAuthedProfileField()
      : this.renderDefaultProfileFields();
  }
}
