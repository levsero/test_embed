import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LauncherContainer } from './LauncherContainer';
import { WebWidgetContainer } from './WebWidgetContainer';

import { getPreviewShowWidget } from 'src/redux/modules/preview/preview-selectors';

const mapStateToProps = (state) => {
  return {
    webWidgetVisible: getPreviewShowWidget(state)
  };
};

export class PreviewContainer extends Component {
    static propTypes = {
      store: PropTypes.object.isRequired,
      webWidgetVisible: PropTypes.bool,
      frameStyle: PropTypes.shape({
        position: PropTypes.string,
        float: PropTypes.string,
        marginTop: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        marginRight: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        width: PropTypes.string,
        height: PropTypes.string
      }),
      containerStyle: PropTypes.shape({
        margin: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        width: PropTypes.string,
      })
    };

    static defaultProps = {
      webWidgetVisible: false
    };

    constructor(props) {
      super(props);
      this.launcherContainer = null;
      this.webWidgetContainer = null;
    }

    updateFrameLocale = () => {
      this.launcherContainer.updateFrameLocale();
      this.webWidgetContainer.updateFrameLocale();
    }

    render = () => {
      const {
        store,
        webWidgetVisible,
        frameStyle,
        containerStyle
      } = this.props;

      return (
        <>
          <LauncherContainer
            store={store}
            webWidgetVisible={webWidgetVisible}
            frameStyle={frameStyle}
            ref={(el) => { if (el) this.launcherContainer = el; }} />
          <WebWidgetContainer
            store={store}
            webWidgetVisible={webWidgetVisible}
            frameStyle={frameStyle}
            containerStyle={containerStyle}
            ref={(el) => { if (el) this.webWidgetContainer = el; }} />
        </>
      );
    }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(PreviewContainer);
