import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KEY_CODES } from '@zendeskgarden/react-selection';

import { getWidgetShown } from 'src/redux/modules/base/base-selectors';

const mapStateToProps = (state) => {
  return {
    widgetShown: getWidgetShown(state)
  };
};

export class Refocus extends Component {
  focusContainer = () => {
    if (!this.props.widgetShown) return;

    if (this.container) {
      const activeElem = this.container.ownerDocument.activeElement;
      const reNode = /input|textarea/i;

      if (!reNode.test(activeElem.nodeName)) {
        this.container.focus();
      }
    }
  }

  onKeyDown = (e) => {
    if (e.keyCode !== KEY_CODES.TAB) {
      return;
    }

    // To avoid FocusJailContainer taking over tabbing duties inside our
    // focus component we stop the event from propagating and for tab
    // to act as expected.
    e.stopPropagation();
  }

  componentDidMount() {
    // Sometimes the whole component gets mounted on page change
    this.focusContainer();
  }

  componentDidUpdate() {
    this.focusContainer();
  }

  render() {
    return (
      <div
        ref={node => this.container = node}
        tabIndex='-1'
        onKeyDown={this.onKeyDown}>
        {this.props.children}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Refocus);
