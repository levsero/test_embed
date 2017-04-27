import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { helpCenterStyles } from './helpCenterStyles.js';
import { HelpCenter } from 'component/helpCenter/HelpCenter';
import { frameFactory } from 'embed/frameFactory';
import { authentication } from 'service/authentication';
import { beacon } from 'service/beacon';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { transport } from 'service/transport';
import { transitionFactory } from 'service/transitionFactory';
import { generateUserCSS } from 'utility/color';
import { getZoomSizingRatio,
         isIE,
         isMobileBrowser,
         setScaleLock } from 'utility/devices';
import { document,
         getDocumentHost,
         location } from 'utility/globals';
import { mouse } from 'utility/mouse';
import { isOnHelpCenterPage,
         isOnHostMappedDomain } from 'utility/pages';
import { getPageKeywords } from 'utility/utils';

const helpCenterCSS = `${require('./helpCenter.scss')} ${helpCenterStyles}`;

let helpCenters = {};
let hasManuallySetContextualSuggestions = false;
let initialContextualSearch = true;
let hasAuthenticatedSuccessfully = false;
let useMouseDistanceContexualSearch = false;
let contextualSearchOptions = {};
let cancelTargetHandler = null;

function create(name, config, reduxStore) {
  let containerStyle;
  let frameStyle = {};

  const channelChoice = settings.get('channelChoice') && !settings.get('contactForm.suppress');
  const configDefaults = {
    position: 'right',
    contextualHelpEnabled: false,
    buttonLabelKey: 'message',
    formTitleKey: 'help',
    hideZendeskLogo: false,
    signInRequired: false,
    expandable: false,
    disableAutoComplete: false,
    enableMouseDrivenContextualHelp: false,
    color: '#659700'
  };
  const onNextClick = function(embed) {
    mediator.channel.broadcast(name + '.onNextClick', embed);
  };
  const onArticleClick = function(trackPayload) {
    beacon.trackUserAction('helpCenter', 'click', name, trackPayload);
  };
  const onViewOriginalArticleClick = function(trackPayload) {
    beacon.trackUserAction('helpCenter', 'viewOriginalArticle', name, trackPayload);
  };
  const showBackButton = function(show = true) {
    get(name).instance.getChild().setState({
      showBackButton: show
    });
  };
  const onSearch = function(params) {
    beacon.trackUserAction('helpCenter', 'search', name, params.searchTerm);
    mediator.channel.broadcast(name + '.onSearch', params);
  };

  const onShow = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(true);
        setTimeout(() => {
          mediator.channel.broadcast('.updateZoom', getZoomSizingRatio());
        }, 0);
      } else {
        rootComponent.focusField();
      }
    }
  };

  const onHide = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(false);
        rootComponent.resetState();
      }

      frame.getRootComponent().backtrackSearch();
    }
  };

  const senderPayload = (url) => (query, doneFn, failFn) => {
    const token = authentication.getToken();
    const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
    const queryParams = _.extend(query, settings.get('helpCenter.filter'));

    return {
      method: 'get',
      forceHttp: forceHttp,
      path: url,
      query: queryParams,
      authorization: token ? `Bearer ${token}` : '',
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };
  };

  const searchSenderFn = (url) => (query, doneFn, failFn) => {
    const done = (res) => {
      waitForRootComponent(name, (rootComponent) => {
        rootComponent.setLoading(false);
        doneFn(res);
      });
    };
    const payload = senderPayload(url)(query, done, failFn);

    transport.send(payload);
  };

  const imagesSenderFn = (url, doneFn) => {
    const payload = senderPayload(url)(null, doneFn);

    transport.getImage(payload);
  };

  config = _.extend(configDefaults, config);

  const viewMoreEnabled = !!settings.get('helpCenter.viewMore');

  useMouseDistanceContexualSearch = config.enableMouseDrivenContextualHelp;

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    const margin = settings.get('margin');

    frameStyle = _.extend({}, frameStyle, {
      width: 342,
      marginLeft: margin,
      marginRight: margin
    });
    containerStyle = { width: 342 };
  }

  const authSetting = settings.get('authenticate');

  if (config.contextualHelpEnabled
     || authenticationRequired(authSetting, config)) {
    setLoading(name, true);
  }

  const Embed = frameFactory(
    (params) => {
      return (
        <HelpCenter
          ref='rootComponent'
          hideZendeskLogo={config.hideZendeskLogo}
          onNextClick={onNextClick}
          onArticleClick={onArticleClick}
          onViewOriginalArticleClick={onViewOriginalArticleClick}
          onSearch={onSearch}
          position={config.position}
          buttonLabelKey={config.buttonLabelKey}
          formTitleKey={config.formTitleKey}
          showBackButton={showBackButton}
          searchSender={searchSenderFn('/api/v2/help_center/search.json')}
          contextualSearchSender={searchSenderFn('/api/v2/help_center/articles/embeddable_search.json')}
          imagesSender={imagesSenderFn}
          style={containerStyle}
          fullscreen={isMobileBrowser()}
          updateFrameSize={params.updateFrameSize}
          originalArticleButton={settings.get('helpCenter.originalArticleButton')}
          localeFallbacks={settings.get('helpCenter.localeFallbacks')}
          channelChoice={channelChoice}
          disableAutoComplete={config.disableAutoComplete}
          viewMoreEnabled={viewMoreEnabled}
          zendeskHost={transport.getZendeskHost()} />
      );
    },
    {
      frameStyle: frameStyle,
      position: config.position,
      css: helpCenterCSS + generateUserCSS(config.color),
      name: name,
      fullscreenable: true,
      expandable: config.expandable,
      transitions: {
        upClose: transitionFactory.webWidget.upHide(),
        downClose: transitionFactory.webWidget.downHide(),
        upHide: transitionFactory.webWidget.upHide(),
        upShow: transitionFactory.webWidget.upShow(),
        downHide: transitionFactory.webWidget.downHide(),
        downShow: transitionFactory.webWidget.downShow()
      },
      afterShowAnimate(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent && isIE()) {
          rootComponent.focusField();
        }
      },
      onHide,
      onShow,
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent) {
          rootComponent.setState({
            articleViewActive: false
          });
          frame.getChild().setState({
            showBackButton: false
          });
        }
      },
      extend: {}
    },
    reduxStore
  );

  helpCenters[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function render(name) {
  if (helpCenters[name] && helpCenters[name].instance) {
    throw new Error(`HelpCenter ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));
  const config = helpCenters[name].config;

  helpCenters[name].instance = ReactDOM.render(helpCenters[name].component, element);

  mediator.channel.subscribe(name + '.show', (options = {}) => {
    if (useMouseDistanceContexualSearch && options.viaActivate) {
      useMouseDistanceContexualSearch = false;

      if (cancelTargetHandler) {
        cancelTargetHandler();
      }

      helpCenter.keywordsSearch(name, contextualSearchOptions);
    }

    // Stop stupid host page scrolling
    // when trying to focus HelpCenter's search field.
    setTimeout(() => {
      waitForRootComponent(name, () => {
        get(name).instance.show(options);
      });
    }, 0);
  });

  mediator.channel.subscribe(name + '.hide', (options = {}) => {
    waitForRootComponent(name, () => {
      get(name).instance.hide(options);
    });
  });

  mediator.channel.subscribe(name + '.setNextToChat', () => {
    waitForRootComponent(name, (rootComponent) => {
      rootComponent.setChatOnline(true);
    });

    setChatOnline(name, true);
  });

  mediator.channel.subscribe(name + '.setNextToSubmitTicket', () => {
    waitForRootComponent(name, (rootComponent) => {
      rootComponent.setChatOnline(false);
    });

    setChatOnline(name, false);
  });

  mediator.channel.subscribe(name + '.showNextButton', (nextButton = true) => {
    waitForRootComponent(name, (rootComponent) => {
      rootComponent.showNextButton(nextButton);
    });
  });

  mediator.channel.subscribe(name + '.showBackButton', () => {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setHelpCenterSuggestions', (options) => {
    hasManuallySetContextualSuggestions = true;

    if (initialContextualSearch) {
      setLoading(name, true);
      initialContextualSearch = false;
    }

    setTimeout(() => performContextualHelp(name, options), 0);
  });

  mediator.channel.subscribe(name + '.refreshLocale', () => {
    waitForRootComponent(name, (rootComponent) => {
      rootComponent.forceUpdate();
    });
  });

  mediator.channel.subscribe(name + '.isAuthenticated', () => {
    hasAuthenticatedSuccessfully = true;

    if (!(config.contextualHelpEnabled
         || hasManuallySetContextualSuggestions)) {
      setLoading(name, false);
    }
  });
}

function list() {
  return helpCenters;
}

function get(name) {
  return helpCenters[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
}

function waitForRootComponent(name, callback) {
  const rootComponent = get(name) && get(name).instance && getRootComponent(name);

  if (rootComponent) {
    callback(rootComponent);
  } else {
    setTimeout(() => {
      waitForRootComponent(name, callback);
    }, 0);
  }
}

function setChatOnline(name, chatOnline) {
  waitForRootComponent(name, (rootComponent) => {
    rootComponent.setChatOnline(chatOnline);
  });
}

function setLoading(name, loading) {
  waitForRootComponent(name, (rootComponent) => {
    rootComponent.setLoading(loading);
  });
}

function keywordsSearch(name, options) {
  const rootComponent = getRootComponent(name);
  const isAuthenticated = !get(name).config.signInRequired || hasAuthenticatedSuccessfully;

  if (isAuthenticated && rootComponent) {
    if (options.url) {
      options.pageKeywords = getPageKeywords();
    }

    rootComponent.contextualSearch(options);
  } else {
    setTimeout(() => keywordsSearch(name, options), 0);
  }
}

function shouldPerformDefaultContextualHelp(config) {
  return config.contextualHelpEnabled &&
        !hasManuallySetContextualSuggestions &&
        !isOnHelpCenterPage();
}

function performContextualHelp(name, options) {
  contextualSearchOptions = options;

  const onHitFn = (name, options) => () => {
    keywordsSearch(name, options);
    useMouseDistanceContexualSearch = false;
  };

  if (!isMobileBrowser() && useMouseDistanceContexualSearch) {
    const launcherElement = document.getElementById('launcher');

    cancelTargetHandler = mouse.target(launcherElement, onHitFn(name, options));
  } else {
    helpCenter.keywordsSearch(name, options);
  }
}

function authenticationRequired(authSettings, config) {
  return authSettings
       && authSettings.jwt
       && config.signInRequired;
}

function postRender(name) {
  const config = get(name).config;
  const authSetting = settings.get('authenticate');

  if (shouldPerformDefaultContextualHelp(config)) {
    performContextualHelp(name, { url: true });
  }

  if (config.tokensRevokedAt) {
    authentication.revoke(config.tokensRevokedAt);
  }

  if (authSetting && authSetting.jwt) {
    authentication.authenticate(authSetting.jwt);
  }
}

export const helpCenter = {
  create,
  list,
  get,
  keywordsSearch,
  render,
  postRender
};
