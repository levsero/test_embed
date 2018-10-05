import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
      const reNode = /input|textarea|button/i;
      const gardenId = activeElem.dataset && activeElem.dataset.gardenId;
      const gardenSelect = gardenId && gardenId.indexOf('select') !== -1;

      if (!reNode.test(activeElem.nodeName) && activeElem !== this.container && !gardenSelect) {
        this.container.focus();
      }
    }
  }

  render() {
    return (
      <div
        ref={node => this.container = node}
        tabIndex='-1'>
        {this.props.children}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Refocus);
