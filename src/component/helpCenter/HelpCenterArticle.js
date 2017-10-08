import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { ButtonPill } from 'component/button/ButtonPill';
import { authentication } from 'service/authentication';
import { i18n } from 'service/i18n';
import { parseUrl } from 'utility/utils';

import { locals as styles } from './HelpCenterArticle.sass';

const sanitizeHtml = require('sanitize-html');

const allowedIframeAttribs = [
  'src', 'allowfullscreen', 'mozallowfullscreen', 'webkitallowfullscreen',
  'oallowfullscreen', 'msallowfullscreen', 'name'
];

export class HelpCenterArticle extends Component {
  static propTypes = {
    activeArticle: PropTypes.object.isRequired,
    fullscreen: PropTypes.bool,
    imagesSender: PropTypes.func,
    originalArticleButton: PropTypes.bool,
    handleOriginalArticleClick: PropTypes.func,
    storedImages: PropTypes.array,
    updateFrameSize: PropTypes.func,
    updateStoredImages: PropTypes.func,
    zendeskHost: PropTypes.string
  };

  static defaultProps = {
    fullscreen: false,
    imagesSender: () => {},
    originalArticleButton: true,
    handleOriginalArticleClick: () => {},
    storedImages: [],
    updateFrameSize: () => {},
    updateStoredImages: () => {},
    zendeskHost: ''
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      lastActiveArticleId: null,
      queuedImages: {}
    };
  }

  componentDidMount = () => {
    const doc = ReactDOM.findDOMNode(this).ownerDocument;
    const base = doc.createElement('base');

    base.href = `https://${document.zendeskHost}`;
    doc.head.appendChild(base);
  }

  componentDidUpdate = () => {
    const { activeArticle } = this.props;
    const container = ReactDOM.findDOMNode(this.refs.article);
    const sanitizeHtmlOptions = {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'span',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div',
        'sup', 'sub', 'img', 'iframe', 'table', 'thead', 'tfoot', 'tbody', 'tr',
        'th', 'td', 'pre', 'video', 'source'
      ],
      transformTags: { 'iframe': this.filterVideoEmbed },
      allowedSchemes: ['http', 'https', 'mailto', 'blob'],
      allowedSchemesByTag: {
        'iframe': ['https'],
        'img': ['data', 'http', 'https', 'blob']
      },
      allowedAttributes: {
        'a': ['id', 'href', 'target', 'title', 'name'],
        'span': ['id', 'name'],
        'div': ['id'],
        'img': ['id', 'src', 'alt', 'name'],
        'h1': ['id'],
        'h2': ['id'],
        'h3': ['id'],
        'h4': ['id'],
        'h5': ['id'],
        'h6': ['id'],
        'iframe': allowedIframeAttribs,
        'td': ['id', 'colspan'],
        'th': ['id', 'colspan'],
        'ol': ['id', 'start', 'reversed'],
        'p': ['id'],
        'video': ['src', 'height', 'width', 'controls'],
        'source': ['src', 'type']
      },
      allowedClasses: {
        'span': [
          'wysiwyg-font-size-x-large',
          'wysiwyg-font-size-large',
          'wysiwyg-font-size-small'
        ]
      }
    };

    if (activeArticle.body) {
      const body = this.replaceArticleImages(activeArticle, this.state.lastActiveArticleId);
      let cleanHtml = sanitizeHtml(body, sanitizeHtmlOptions);

      // Inject a table wrapper to allow horizontal scrolling
      cleanHtml = cleanHtml.replace('<table', '<div class="table-wrap"><table');
      cleanHtml = cleanHtml.replace('/table>', '/table></div>');

      // Removes a single newline from start to end tags
      cleanHtml = cleanHtml.replace(/>\n</g, '><');

      container.innerHTML = cleanHtml;

      // When an article has only an image and no body content to resize it,
      // the framesize is updated before the image has fully loaded. This results
      // in the article being cut off from the bottom. We ensure here that
      // `updateFrameSize` is called when each img has loaded and rendered.
      const imgs = container.getElementsByTagName('img');

      _.forEach(imgs, (img) => img.onload = this.props.updateFrameSize);
    } else {
      container.innerHTML = '';
    }

    if (this.state.lastActiveArticleId !== activeArticle.id) {
      const topNode = ReactDOM.findDOMNode(this.refs.userContent);

      topNode.scrollTop = 0;

      /* eslint-disable react/no-did-update-set-state */
      this.setState({ lastActiveArticleId: activeArticle.id });
      /* eslint-enable */
    }
  }

  handleClick = (e) => {
    let target = e.target;
    let href = target.getAttribute('href');
    const doc = target.ownerDocument;
    const isMailLink = () => href && (href.indexOf('mailto://') > -1);
    const isInternalLink = () => href && (href.indexOf('#') === 0);

    // Find parent anchor link
    if (target.nodeName !== 'A') {
      if (target.closest) {
        target = target.closest('a');
      } else {
        target = null;
      }

      // Element.closest is currently not supported in IE
      if (document.documentMode || target === null) {
        e.preventDefault();
        return;
      }

      href = target.getAttribute('href');
    }

    if (isInternalLink()) {
      const anchorId = href.slice(1);

      // You can deep link via an id or name attribute, handle both in the selector
      const inPageElem = doc.querySelector(`[id="${anchorId}"],[name="${anchorId}"]`);

      if (inPageElem) {
        inPageElem.scrollIntoView();
      }
      e.preventDefault();
    } else if (!isMailLink()) {
      target.setAttribute('target', '_blank');
      target.setAttribute('rel', 'noopener noreferrer');
    }
  }

  filterVideoEmbed = (tagName, attribs) => {
    const allowedAttribs = _.pick(attribs, allowedIframeAttribs);

    if (!allowedAttribs.src) return false;

    const allowedDomains = [
      'youtube',
      'player\.vimeo',
      'players\.brightcove',
      'fast\.wistia',
      'content\.jwplatform'
    ];
    const hasMatched = _.some(allowedDomains, (domain) => {
      const validDomainTest = `^(.*?)\/\/(?:www\.)?${domain}(?:-nocookie)?(\.com|\.net)\/`;

      return (allowedAttribs.src.search(validDomainTest) >= 0);
    });

    return hasMatched
         ? { tagName, attribs: allowedAttribs }
         : false;
  }

  replaceArticleImages = (activeArticle, lastActiveArticleId) => {
    const { storedImages } = this.props;
    const { locale, url, body } = activeArticle;
    const domain = parseUrl(url).hostname;
    const parseHtmlString = (htmlStr) => {
      const el = document.createElement('html');

      el.innerHTML = htmlStr;
      return el;
    };

    // In some cases there will be images with relative paths to the lotus/classic attachments.
    // We rewrite these to be absolute to the article domain to avoid 404 requests to parent domain.
    const articleBody = body.replace(/src="\/attachments\//g, `src="//${domain}/attachments/`);

    const htmlEl = parseHtmlString(articleBody);
    const imgEls = this.getArticleImages(htmlEl, domain, locale);

    if (imgEls.length === 0 || !authentication.getToken()) {
      return articleBody;
    }

    // If the image has not already been downloaded, then queue up
    // an async request for it. The src attribute is set to empty so we can
    // still render the image while waiting for the response.
    const pendingImageUrls = _.chain(imgEls)
      .reject((imgEl) => storedImages[imgEl.src])
      .map((imgEl) => imgEl.src)
      .value();

    _.forEach(imgEls, (imgEl) => {
      // '//:0' ensures that the img src is blank on all browsers.
      // http://stackoverflow.com/questions/19126185/setting-an-image-src-to-empty
      imgEl.src = storedImages[imgEl.src] || '//:0';
    });

    if (lastActiveArticleId !== this.props.activeArticle.id) {
      _.chain(pendingImageUrls)
        .filter((src) => !this.state.queuedImages.hasOwnProperty(src))
        .tap(this.queueImageRequests)
        .value();
    }

    return htmlEl.outerHTML;
  }

  queueImageRequests = (imageUrls = []) => {
    const handleSuccess = (src, res) => {
      const url = window.URL.createObjectURL(res.xhr.response);

      this.setState({
        queuedImages: _.omit(this.state.queuedImages, src)
      });
      this.props.updateStoredImages({ [src]: url });
    };

    const imagesQueued = _.transform(imageUrls, (result, url) => {
      // TODO: When we have more stable error reporting setup with Rollbar,
      // we could push this error out.
      this.props.imagesSender(url, (res) => handleSuccess(url, res));
      result[url] = '';
    }, {});

    this.setState({
      queuedImages: _.extend({}, this.state.queuedImages, imagesQueued)
    });
  }

  getArticleImages(htmlEl, domain, locale) {
    const filterHcImages = (img) => {
      const pattern = new RegExp(`(${this.props.zendeskHost}|${domain})/hc/`);

      return pattern.test(img.src);
    };
    const addLocaleToPath = (img) => {
      // Due to HC ommiting the locale for agent only image attachments. We must
      // check if the locale is missing from the URL. If it is, then we manually
      // add it in, otherwise we leave it.
      const localePattern = /\/hc\/([a-z]{2}|[a-z]{2}-[a-z]{2})\//i;

      if (!localePattern.test(img.src)) {
        img.src = img.src.replace('/hc/', `/hc/${locale}/`);
      }
      return img;
    };

    return _.chain(htmlEl.getElementsByTagName('img'))
            .filter(filterHcImages)
            .map(addLocaleToPath)
            .value();
  }

  renderOriginalArticleButton = () => {
    if (!this.props.originalArticleButton) return;

    return (
      <div className={styles.originalArticleButton}>
        <a
          className={styles.link}
          href={this.props.activeArticle.html_url}
          target='_blank'
          onClick={this.props.handleOriginalArticleClick}>
          <ButtonPill
            fullscreen={this.props.fullscreen}
            label={i18n.t('embeddable_framework.helpCenter.article.viewLinkText')} />
        </a>
      </div>
    );
  }

  render = () => {
    const mobileClasses = this.props.fullscreen ? styles.contentMobile : '';

    return (
      <div className={`${styles.content} u-userLinkColor ${mobileClasses}`} ref='userContent'>
        <div className={styles.title}>{this.props.activeArticle.title}</div>
        <div
          ref='article'
          className={styles.article}
          onClick={this.handleClick} />
          {this.renderOriginalArticleButton()}
      </div>
    );
  }
}
