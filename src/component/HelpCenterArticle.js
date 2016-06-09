import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';
import { pick, some } from 'lodash';

import { ButtonPill } from 'component/Button';
import { authentication } from 'service/authentication';
import { i18n } from 'service/i18n';
import { parseUrl } from 'utility/utils';

const sanitizeHtml = require('sanitize-html');

const allowedIframeAttribs = [
  'src', 'allowfullscreen', 'mozallowfullscreen', 'webkitallowfullscreen',
  'oallowfullscreen', 'msallowfullscreen'
];

class HelpCenterArticle extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      queuedImages: {}
    };
  }

  componentDidMount() {
    const doc = ReactDOM.findDOMNode(this).ownerDocument;
    const base = doc.createElement('base');

    base.href = `https://${document.zendeskHost}`;
    doc.head.appendChild(base);
  }

  componentDidUpdate(prevProps) {
    const { activeArticle } = this.props;
    const container = ReactDOM.findDOMNode(this.refs.article);
    const sanitizeHtmlOptions = {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'span',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div',
        'sup', 'sub', 'img', 'iframe', 'table', 'thead', 'tfoot', 'tbody', 'tr', 'th', 'td'
      ],
      transformTags: { 'iframe': this.filterVideoEmbed },
      allowedSchemes: ['http', 'https', 'blob'],
      allowedAttributes: {
        'a': ['href', 'target', 'title', 'name'],
        'span': ['name'],
        'div': ['id'],
        'img': ['src', 'alt'],
        'h1': ['id'],
        'h2': ['id'],
        'h3': ['id'],
        'h4': ['id'],
        'h5': ['id'],
        'h6': ['id'],
        'iframe': allowedIframeAttribs,
        'td': ['colspan'],
        'th': ['colspan']
      },
      allowedClasses: {
        'span': [
          'wysiwyg-font-size-x-large',
          'wysiwyg-font-size-large',
          'wysiwyg-font-size-small'
        ]
      },
      allowedSchemesByTag: { 'iframe': ['https'] }
    };
    const lastActiveArticleId = prevProps.activeArticle.id;

    if (activeArticle.body) {
      const body = this.replaceArticleImages(activeArticle, lastActiveArticleId);
      let cleanHtml = sanitizeHtml(body, sanitizeHtmlOptions);

      // Inject a table wrapper to allow horizontal scrolling
      cleanHtml = cleanHtml.replace('<table', `<div class="table-wrap"><table`);
      cleanHtml = cleanHtml.replace('/table>', '/table></div>');

      container.innerHTML = cleanHtml;
    } else {
      container.innerHTML = '';
    }

    if (lastActiveArticleId !== this.props.activeArticle.id) {
      let topNode = ReactDOM.findDOMNode(this.refs.userContent);

      topNode.scrollTop = 0;
    }
  }

  handleClick(e) {
    const target = e.target;
    const nodeName = target.nodeName;
    const href = target.getAttribute('href');
    const doc = target.ownerDocument;

    if (nodeName === 'A' && href.indexOf('#') === 0) {
      // You can deep link via an id or name attribute, handle both in the selector
      let inPageElem = doc.querySelector(`${href},[name="${href.slice(1)}"]`);

      if (inPageElem) {
        inPageElem.scrollIntoView();
      }
      e.preventDefault();
    } else {
      target.setAttribute('target', '_blank');
    }
  }

  filterVideoEmbed(tagName, attribs) {
    const allowedAttribs = pick(attribs, allowedIframeAttribs);

    if (!allowedAttribs.src) {
      return false;
    }

    const allowedDomains = [
      'youtube',
      'player\.vimeo',
      'fast\.wistia'
    ];
    const hasMatched = some(allowedDomains, (domain) => {
      const validDomainTest = `^(.*?)\/\/(?:www\.)?${domain}(?:-nocookie)?(\.com|\.net)\/`;

      return (allowedAttribs.src.search(validDomainTest) >= 0);
    });

    return hasMatched
         ? { tagName: 'iframe', attribs: allowedAttribs }
         : false;
  }

  replaceArticleImages(activeArticle, lastActiveArticleId) {
    const { storedImages } = this.props;
    const parseHtmlString = (htmlStr) => {
      const el = document.createElement('html');

      el.innerHTML = htmlStr;
      return el;
    };
    const helpCenterImages = (imgEls) => {
      const articleDomain = parseUrl(activeArticle.url).hostname;
      const srcPattern = new RegExp(`${this.props.zendeskHost}|${articleDomain}`);

      return _.filter(imgEls, (img) => srcPattern.test(img.src));
    };

    const htmlEl = parseHtmlString(activeArticle.body);
    const imgEls = helpCenterImages(htmlEl.getElementsByTagName('img'));

    if (imgEls.length === 0 || !authentication.getToken()) {
      return activeArticle.body;
    }

    // If the image has not already been downloaded, then queue up
    // an async request for it. The src attribute is set to empty so we can
    // still render the image while waiting for the response.
    let pendingImageUrls = [];

    _.forEach(imgEls, (imgEl) => {
      if (storedImages[imgEl.src]) {
        imgEl.src = storedImages[imgEl.src];
      } else {
        pendingImageUrls.push(imgEl.src);

        // '//:0' ensures that the img src is blank on all browsers.
        // http://stackoverflow.com/questions/19126185/setting-an-image-src-to-empty
        imgEl.src = '//:0';
      }
    });

    if (lastActiveArticleId !== this.props.activeArticle.id) {
      const urls = _.filter(pendingImageUrls, (src) => !this.state.queuedImages.hasOwnProperty(src));

      this.queueImageRequests(urls);
    }

    return htmlEl.outerHTML;
  }

  queueImageRequests(pendingImageUrls) {
    if (pendingImageUrls.length === 0) {
      return;
    }

    const handleSuccess = (src, res) => {
      const url = window.URL.createObjectURL(res.xhr.response);

      this.setState({
        queuedImages: _.omit(this.state.queuedImages, src)
      });
      this.props.updateStoredImages({ [src]: url });
    };

    const imagesQueued = {};

    _.forEach(pendingImageUrls, (src) => {
      this.props.imagesSender(src, (res) => handleSuccess(src, res));

      imagesQueued[src] = '';
    });

    this.setState({
      queuedImages: _.extend({}, this.state.queuedImages, imagesQueued)
    });
  }

  render() {
    const userContentClasses = classNames({
      'UserContent u-userLinkColor': true,
      'is-mobile': this.props.fullscreen
    });
    const activeArticleTitleClasses = classNames({
      'u-textSizeLrg u-marginBT u-textBold u-textBody': true
    });

    return (
      <div>
        <div className={userContentClasses} ref='userContent'>
          <div className={activeArticleTitleClasses}>{this.props.activeArticle.title}</div>
          <div
            ref='article'
            className='u-marginTM'
            onClick={this.handleClick}
            onTouchStart={this.handleClick} />
          <div className='u-marginBM'>
            <a
              className='u-linkClean'
              href={this.props.activeArticle.html_url}
              target='_blank'>
              <ButtonPill
                fullscreen={this.props.fullscreen}
                label={i18n.t('embeddable_framework.helpCenter.article.viewLinkText')} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

HelpCenterArticle.propTypes = {
  activeArticle: PropTypes.object.isRequired,
  zendeskHost: PropTypes.string,
  storedImages: PropTypes.array,
  imagesSender: PropTypes.func,
  updateStoredImages: PropTypes.func,
  fullscreen: PropTypes.bool
};

HelpCenterArticle.defaultProps = {
  zendeskHost: '',
  storedImages: [],
  imagesSender: () => {},
  updateStoredImages: () => {},
  fullscreen: false
};

export { HelpCenterArticle };
