export class ChatGroupAvatar {
  constructor(props) {
    this._setProps(props);
  }

  updateProps(props) {
    this._setProps(props);
  }

  path = () => {
    if (this._userWithAvatar()) {
      return this.socialLogin.avatarPath;
    }

    return this.avatarPath;
  }

  shouldDisplay = () => {
    if (!this.showAvatar) {
      return false;
    } else if (this._userWithAvatar() || this.isAgent) {
      return true;
    }

    return false;
  };

  _userWithAvatar = () => {
    return this.isEndUser && this._hasSocialLoginAvatar();
  }

  _hasSocialLoginAvatar = () => {
    return !!this.socialLogin && this.socialLogin.avatarPath !== '';
  }

  _setProps = (props) => {
    this.socialLogin = props.socialLogin;
    this.showAvatar = props.showAvatar;
    this.avatarPath = props.avatarPath;
    this.isAgent = props.isAgent;
    this.isEndUser = !props.isAgent;
  }
}
