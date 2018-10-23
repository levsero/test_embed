// Needed for legacy browsers as specified in
// https://reactjs.org/docs/javascript-environment-requirements.html
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StyleSheetManager } from 'styled-components';

import { locals as styles } from './Frame.scss';

import { EmbedWrapper } from 'component/frame/EmbedWrapper';
import { i18n } from 'service/i18n';
import { settings } from 'service/settings';
import { getZoomSizingRatio, isMobileBrowser } from 'utility/devices';
import { win } from 'utility/globals';
import Transition from 'react-transition-group/Transition';
import { updateWidgetShown, widgetHideAnimationComplete } from 'src/redux/modules/base/base-actions';
import { getFixedStyles, getColor, getPosition, getFrameVisible } from 'src/redux/modules/selectors';
import { FONT_SIZE, MAX_WIDGET_HEIGHT, MIN_WIDGET_HEIGHT, WIDGET_WIDTH } from 'constants/shared';

// Unregister lodash from window._
if (!__DEV__) {
  _.noConflict();
}

const mapStateToProps = (state, ownProps) => {
  return {
    fixedStyles: getFixedStyles(state, ownProps.name),
    color: getColor(state),
    position: getPosition(state),
    visible: getFrameVisible(state, ownProps.name)
  };
};

const scrollingStyleDelay = 50; // small delay so that safari has finished rendering
const sizingRatio = FONT_SIZE * getZoomSizingRatio();
const baseFontCSS = `html { font-size: ${sizingRatio}px }`;
const transitionDuration = 250;
const isPositionTop = () => settings.get('position.vertical') === 'top';
const defaultMarginTop = () => isPositionTop() && !isMobileBrowser() ? '15px' : 0;

class Frame extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    afterShowAnimate: PropTypes.func,
    css: PropTypes.string,
    frameStyleModifier: PropTypes.func,
    frameOffsetWidth: PropTypes.number,
    frameOffsetHeight: PropTypes.number,
    frameStyle: PropTypes.object,
    fullscreenable: PropTypes.bool,
    hideCloseButton: PropTypes.bool,
    name: PropTypes.string,
    onBack: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    position: PropTypes.string,
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    transitions: PropTypes.object,
    visible: PropTypes.bool,
    title: PropTypes.string,
    fixedStyles: PropTypes.object,
    updateWidgetShown: PropTypes.func,
    widgetHideAnimationComplete: PropTypes.func,
    color: PropTypes.object,
    generateUserCSS: PropTypes.func
  }

  static defaultProps = {
    afterShowAnimate: () => {},
    css: '',
    frameStyleModifier: () => {},
    frameOffsetWidth: 15,
    frameOffsetHeight: 15,
    frameStyle: { marginTop: defaultMarginTop() },
    fullscreenable: false,
    hideCloseButton: false,
    name: '',
    onBack: () => {},
    onHide: () => {},
    onShow: () => {},
    position: 'right',
    preventClose: false,
    store: { dispatch: () => {} },
    useBackButton: false,
    transitions: {},
    visible: true,
    title: '',
    fixedStyles: {},
    updateWidgetShown: () => {},
    widgetHideAnimationComplete: () => {},
    generateUserCSS: () => {}
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      childRendered: false,
      hiddenByZoom: false
    };

    this.child = null;
    this.iframe = null;
  }

  componentDidMount = () => {
    this.renderFrameContent();
  }

  componentWillReceiveProps = (nextProps) => {
    const prevProps = this.props;

    if (prevProps.visible && !nextProps.visible) {
      this.hide();
    } else if (!prevProps.visible && nextProps.visible) {
      this.show();
    }

    if (!_.isEqual(nextProps.color, prevProps.color)) {
      this.setCustomCSS(this.generateUserCSSWithColor(nextProps.color));
    }
  }

  componentDidUpdate = () => {
    this.renderFrameContent();
  }

  componentWillUnmount = () => {
    ReactDOM.unmountComponentAtNode(this.getContentDocument().body);
  }

  getContentDocument = () => {
    return this.iframe.contentDocument;
  }

  getContentWindow = () => {
    return this.iframe.contentWindow;
  }

  getRootComponentElement = () => {
    return this.child.embed;
  }

  getRootComponent = () => {
    if (this.child) {
      const rootComponent = this.child.refs.rootComponent;

      return rootComponent.getWrappedInstance
        ? rootComponent.getWrappedInstance()
        : rootComponent;
    }
  }

  getChild = () => {
    return this.child;
  }

  getFrameHead = () => {
    return this.getContentDocument().head;
  }

  updateFrameLocale = () => {
    const html = this.getContentDocument().documentElement;
    const direction = i18n.isRTL() ? 'rtl' : 'ltr';

    // Need to defer to the next tick because Firefox renders differently
    setTimeout(() => {
      html.setAttribute('lang', i18n.getLocale());
      html.setAttribute('dir', direction);
    }, 0);

    if (this.child) {
      this.forceUpdateWorld();
    }
  }

  forceUpdateWorld = () => {
    this.child.forceUpdate();
    this.child.nav.forceUpdate();
    const embed = this.getRootComponent();

    if (embed.getActiveComponent) {
      const activeComponent = embed.getActiveComponent();

      if (activeComponent) activeComponent.forceUpdate();
    }

    _.defer(this.forceUpdate.bind(this));
  }

  updateFrameTitle = (title) => {
    const doc = this.getContentDocument();

    this.iframe.title = doc.title = title;
  }

  getDefaultDimensions = () => {
    const { frameOffsetHeight, frameOffsetWidth, fullscreenable } = this.props;
    const fullscreen = isMobileBrowser() && fullscreenable;
    const fullscreenStyle = {
      width: '100%',
      maxWidth: '100%',
      height: '100%'
    };

    const popoverStyle = {
      width: `${WIDGET_WIDTH + frameOffsetWidth}px`,
      height: '100%',
      maxHeight: `${MAX_WIDGET_HEIGHT + frameOffsetHeight}px`,
      minHeight: `${MIN_WIDGET_HEIGHT}px`
    };

    return fullscreen
      ? fullscreenStyle
      : popoverStyle;
  };

  updateBaseFontSize = (fontSize) => {
    const htmlElem = this.getContentDocument().documentElement;

    htmlElem.style.fontSize = fontSize;
  }

  show = () => {
    const frameFirstChild = this.getRootComponentElement();

    setTimeout(() => {
      const existingStyle = frameFirstChild.style;

      if (!existingStyle.webkitOverflowScrolling) {
        existingStyle.webkitOverflowScrolling = 'touch';
      }
    }, scrollingStyleDelay);

    this.props.onShow(this);
    this.props.afterShowAnimate(this);

    if (this.props.name !== 'launcher') {
      this.props.updateWidgetShown(true);
    }
  }

  hide = (options = {}) => {
    const { onHide, updateWidgetShown } = this.props;

    onHide(this);
    if (options.onHide) options.onHide();
    this.props.widgetHideAnimationComplete();

    if (this.props.name !== 'launcher') {
      updateWidgetShown(false);
    }
  }

  back = (e) => {
    e.preventDefault();
    this.props.onBack(this);
  }

  setHiddenByZoom = (hiddenByZoom) => {
    this.setState({ hiddenByZoom });
  }

  setButtonColor = (color) => {
    this.child.setButtonColor(color);
  }

  setCustomCSS = (css) => {
    this.child.setCustomCSS(css);
  }

  applyMobileBodyStyle = () => {
    const frameDoc = this.getContentDocument();
    const fullscreenWidth = `${win.innerWidth}px`;

    const fullscreenStyles = [
      `width: ${fullscreenWidth}`,
      'height: 100%',
      'overflow-x: hidden'
    ].join(';');

    frameDoc.body.firstChild.setAttribute('style', fullscreenStyles);
  }

  computeIframeStyle = () => {
    const { frameStyle } = this.props;
    const modifiedStyles = this.child
      ? this.props.frameStyleModifier(frameStyle, this.getRootComponentElement()) || frameStyle
      : frameStyle;
    const fullscreen = isMobileBrowser() && this.props.fullscreenable;
    const baseStyles = {
      border: 'none',
      background: 'transparent',
      zIndex: settings.get('zIndex'),
      transform: 'translateZ(0)',
      position: 'fixed',
      transition: `all ${transitionDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
      transitionProperty: 'opacity, top, bottom',
      opacity: 0
    };
    const mobileStyles = fullscreen ? {
      left: this.props.visible ? '0px' : '-9999px',
      top: this.props.visible ? '0px' : '-9999px',
      background:'#FFF'
    } : {};

    return _.extend({},
      baseStyles,
      this.getDefaultDimensions(),
      frameStyle,
      modifiedStyles,
      mobileStyles,
      this.props.fixedStyles
    );
  }

  getOffsetPosition = (animationOffset = 0) => {
    const isMobile = isMobileBrowser();

    if (isMobile && this.props.name === 'webWidget') return {};

    const offset = settings.get('offset');
    const mobileOffset = _.get(offset, 'mobile', {});
    const horizontalOffset = isMobile ? _.get(mobileOffset, 'horizontal', 0) : _.get(offset, 'horizontal', 0);
    const verticalOffset = isMobile ? _.get(mobileOffset, 'vertical', 0) : _.get(offset, 'vertical', 0);
    const horizontalPos = settings.get('position.horizontal') || this.props.position;
    const verticalPos = isPositionTop() ? 'top' : 'bottom';

    return {
      [horizontalPos]: horizontalOffset,
      [verticalPos]: parseInt(verticalOffset) + animationOffset
    };
  }

  injectEmbedIntoFrame = (embed) => {
    const doc = this.getContentDocument();

    // element within the iframe to inject the embed into
    const element = doc.body.appendChild(doc.createElement('div'));

    // element styles
    const fullscreen = this.props.fullscreenable && isMobileBrowser();
    const position = settings.get('position.horizontal') || this.props.position;
    const desktopClasses = fullscreen ? '' : styles.desktop;
    const positionClasses = position === 'left' ? styles.left : styles.right;

    element.className = `${positionClasses} ${desktopClasses}`;
    ReactDOM.render(embed, element);
    this.setState({ childRendered: true });

    if (fullscreen) {
      setTimeout(this.applyMobileBodyStyle, 0);
    }
  }

  generateUserCSSWithColor = (color) => {
    return this.props.generateUserCSS(color);
  }

  constructEmbed = () => {
    const newChild = React.cloneElement(this.props.children, {
      forceUpdateWorld: this.forceUpdateWorld,
      onBackButtonClick: this.back,
      getFrameContentDocument: this.getContentDocument
    });

    const wrapper = (
      <StyleSheetManager target={this.getContentDocument().head}>
        <EmbedWrapper
          ref={(el) => { this.child = el; }}
          document={this.getContentDocument()}
          baseCSS={`${this.props.css} ${this.generateUserCSSWithColor(this.props.color)} ${baseFontCSS}`}
          generateUserCSS={this.props.generateUserCSS}
          reduxStore={this.props.store}
          handleBackClick={this.back}
          preventClose={this.props.preventClose}
          useBackButton={this.props.useBackButton}
          hideCloseButton={this.props.hideCloseButton}
          name={this.props.name}
          fullscreen={this.props.fullscreenable && isMobileBrowser()}>
          {newChild}
        </EmbedWrapper>
      </StyleSheetManager>
    );

    this.injectEmbedIntoFrame(wrapper);
  }

  renderFrameContent = () => {
    if (this.state.childRendered) {
      return false;
    }

    const html = this.getContentDocument().documentElement;
    const doc = this.getContentWindow().document;

    // In order for iframe to correctly render in some browsers
    // we need to wait for readyState to be complete
    if (doc.readyState === 'complete') {
      this.updateFrameLocale();
      this.constructEmbed(html, doc);
      if (this.props.title) {
        this.updateFrameTitle(this.props.title);
      }
    } else {
      setTimeout(this.renderFrameContent, 0);
    }
  }

  render = () => {
    const iframeNamespace = 'zEWidget';
    const frameClasses = `${iframeNamespace}-${this.props.name}`;
    const activeClasses = this.props.visible ? `${frameClasses}--active` : '';
    const tabIndex = this.props.visible ? '0' : '-1';
    const transitionStyles = {
      entering: {
        opacity: 0,
        ...this.getOffsetPosition(-20)
      },
      entered:  {
        opacity: 1,
        ...this.getOffsetPosition(0)
      },
      exiting: {
        opacity: 0,
        ...this.getOffsetPosition(-20)
      },
      exited: {
        top: '-9999px'
      }
    };

    return (
      <Transition in={this.props.visible} timeout={transitionDuration}>
        {(status) => (
          <iframe
            title={this.props.title || this.props.name}
            style={{ ...this.computeIframeStyle(), ...transitionStyles[status] }}
            ref={(el) => { this.iframe = el; }}
            id={this.props.name}
            tabIndex={tabIndex}
            className={`${frameClasses} ${activeClasses}`} />
        )}
      </Transition>
    );
  }
}

const actionCreators = {
  updateWidgetShown,
  widgetHideAnimationComplete
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Frame);
