import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Frame from 'src/component/frame/Frame';
import { Container } from 'src/component/container/Container';
import { WebWidgetPreview } from './WebWidgetPreview';
import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles';
import { generateUserWidgetCSS } from 'utility/color/styles';

export class WebWidgetContainer extends Component {
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

    this.frame = null;
  }

  updateFrameLocale = () => {
    if (this.frame) this.frame.updateFrameLocale();
  }

  render() {
    const {
      store,
      webWidgetVisible,
      frameStyle,
      containerStyle
    } = this.props;

    if (!webWidgetVisible) return null;

    return (
      <Frame
        ref={(el) => { if (el) this.frame = el.getWrappedInstance(); }}
        css={`${require('globalCSS')} ${webWidgetStyles}`}
        generateUserCSS={generateUserWidgetCSS}
        customFrameStyle={frameStyle}
        name={'webWidget'}
        store={store}
        alwaysShow={true}
        disableOffsetHorizontal={true}
        preventClose={true}
        fullscreen={false}
        isMobile={false}
      >
        <Container style={containerStyle}>
          <WebWidgetPreview />
        </Container>
      </Frame>
    );
  }
}
