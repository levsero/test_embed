import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types';

export const dispatchChatAccountSettings = (store, settings) => {
  store.dispatch({
    type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
    payload: settings
  });
};

export const clearDOM = () => {
  document.getElementsByTagName('html')[0].innerHTML = '';
};

export const noopReactComponent = () => class extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
};
