import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { KEY_CODES } from '@zendeskgarden/react-selection';

import { getWidgetShown } from 'src/redux/modules/base/base-selectors';

const mapStateToProps = (state) => {
  return {
    widgetShown: getWidgetShown(state)
  };
};

export class Refocus extends Component {
  static propTypes = {
    widgetShown: PropTypes.bool.isRequired,
    children: PropTypes.node
  };

  componentDidMount() {
    // Sometimes the whole component gets mounted on page change
    this.focusContainer();
  }

  componentDidUpdate() {
    this.focusContainer();
  }

  focusContainer = () => {
    if (!this.props.widgetShown) return;

    if (this.container) {
      const activeElem = this.container.ownerDocument.activeElement;
      const reNode = /input|textarea/i;

      if (!reNode.test(activeElem.nodeName) && activeElem !== this.container) {
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
