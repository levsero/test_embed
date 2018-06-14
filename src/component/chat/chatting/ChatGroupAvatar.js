export class ChatGroupAvatar {
  constructor(props) {
    this.socialLogin = props.socialLogin;
    this.showAvatar = props.showAvatar;
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
    if (!this.showAvatar) {
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
    return !!this.socialLogin && this.socialLogin.avatarPath !== '';
  }
}
