export class ChatGroupAvatar {
  constructor(props) {
    this.props = props;
    this.socialLogin = props.socialLogin;
    this.avatarPath = props.avatarPath;
    this.isAgent = props.isAgent;
    this.isEndUser = !props.isAgent;
  }

  path = () => {
    if  (this.userWithAvatar()) {
      return this.socialLogin.avatarPath;
    }

    return this.avatarPath;
  }

  shouldDisplay = () => {
    if (!this.props.showAvatar) {
      return false;
    } else if (this.userWithAvatar() || this.isAgent) {
      return true;
    }

    return false;
  };

  userWithAvatar = () => {
    return this.isEndUser && this.hasSocialLoginAvatar();
  }

  hasSocialLoginAvatar = () => {
    return (this.socialLogin && this.socialLogin.avatarPath !== '');
  }
}
