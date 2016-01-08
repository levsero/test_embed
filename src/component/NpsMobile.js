import React, { Component, PropTypes } from 'react';
import _     from 'lodash';

import { Container } from 'component/Container';
import { NpsComment } from 'component/NpsComment';
import { NpsCommentButton } from 'component/NpsCommentButton';
import { Icon } from 'component/Icon';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { NpsSelectList } from 'component/NpsSelectList';
import { NpsRatingsList } from 'component/NpsRatingsList';
import { getSizingRatio,
         isIos } from 'utility/devices';
import { win } from 'utility/globals';
import { setScrollKiller,
         setWindowScroll,
         revertWindowScroll } from 'utility/scrollHacks';
import { i18n } from 'service/i18n';
import { Button } from 'component/Button';

const classNames = require('classnames');

class NpsMobile extends Component {
  static propTypes = {
    npsSender: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
    setFrameSize: PropTypes.func.isRequired,
    survey: PropTypes.object.isRequired,
    updateRating: PropTypes.func.isRequired,
    isSubmittingComment: PropTypes.bool,
    isSubmittingRating: PropTypes.bool,
    onCommentChangeHandler: PropTypes.func,
    submitCommentHandler: PropTypes.func,
    submitRatingHandler: PropTypes.func
  };

  static defaultProps = {
    isSubmittingComment: false,
    isSubmittingRating: false,
    onCommentChangeHandler: () => {},
    submitCommentHandler: () => {},
    submitRatingHandler: () => {}
  };

  constructor(props, context) {
    super(props, context);
    this.handleDropDownBlur = this.handleDropDownBlur.bind(this);
    this.handleDropDownFocus = this.handleDropDownFocus.bind(this);
    this.handleDropDownSelection = this.handleDropDownSelection.bind(this);
    this.ratingChangeValueHandler = this.ratingChangeValueHandler.bind(this);
    this.startEditing = this.startEditing.bind(this);
    this.submitCommentHandler = this.submitCommentHandler.bind(this);
    this.state = {
      currentPage: {
        selectingRating: true,
        thankYou: false,
        addingComment: false
      },
      fullscreen: false,
      isEditing: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.fullscreen && this.state.fullscreen) ||
        (!prevState.isEditing && this.state.isEditing)) {
      this.refs.npsComment.focusField();
    }
  }

  setDefaultNpsMobileSize() {
    setTimeout(() => this.props.setFrameSize(
      `100%`,
      this.calcHeightPercentage()),
    0);
  }

  goToFullScreen() {
    if (isIos()) {
      this.startScrollHacks();
      setTimeout(() => this.props.setFrameSize(
        `100%`,
        `100%`,
        false),
      0);
      this.setState({
        fullscreen: true
      });
    }
  }

  resetFullScreen() {
    if (isIos()) {
      this.stopScrollHacks();
      this.setDefaultNpsMobileSize();
      this.setState({
        fullscreen: false
      });
    }
  }

  startEditing() {
    if (isIos()) {
      this.goToFullScreen();
    }
    this.setState({
      isEditing: true
    });
  }

  stopEditing() {
    if (isIos()) {
      this.resetFullScreen();
    }
    this.setState({
      isEditing: false
    });
  }

  calcHeightPercentage() {
    const ratio = getSizingRatio();
    const heightThreshold = 450;
    const heightRatio = win.innerHeight / ratio;

    return (heightRatio < heightThreshold)
         ? (this.state.currentPage.thankYou)
           ? '60%'
           : '70%'
         : (this.state.currentPage.thankYou)
           ? '40%'
           : '52%';
  }

  setCurrentPage(page) {
    this.setState({
      currentPage: _.mapValues(
        this.getInitialState().currentPage,
        (_, key) => key === page
      )
    });
  }

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, () => {
      this.stopEditing();
      this.setCurrentPage('thankYou');
    });
  }

  ratingChangeValueHandler(rating) {
    this.props.submitRatingHandler(rating, () => this.setCurrentPage('addingComment'));
  }

  handleDropDownBlur() {
    if (isIos()) {
      this.stopScrollHacks();
    }
  }

  handleDropDownSelection(e) {
    this.props.updateRating(e.target.value);
  }

  removeRatingTemplate(ratingText) {
    return ratingText.replace('%{rating}', '').trim();
  }

  handleDropDownFocus() {
    if (isIos()) {
      this.startScrollHacks();
    }
  }

  startScrollHacks() {
    setTimeout(() => {
      setWindowScroll(0);
      setScrollKiller(true);
    }, 0);
  }

  stopScrollHacks() {
    setTimeout(() => {
      setScrollKiller(false);
      revertWindowScroll();
    }, 0);
  }

  render() {
    let headingText;

    if (!this.state.fullscreen) {
      this.setDefaultNpsMobileSize();
    }

    if (this.state.currentPage.addingComment) {
      headingText = this.removeRatingTemplate(this.props.survey.youRated);
    } else if (this.state.currentPage.thankYou) {
      headingText = this.props.survey.thankYou;
    }

    const npsRatings = _.range(11);

    const npsMedText = 'u-textSizeMed u-textBold u-textCenter u-textXHeight';

    const notificationClasses = `u-inlineBlock u-userTextColor
                                 u-posRelative u-marginTL u-userFillColor`;

    const sendFeedbackLabel = i18n.t(
      'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
      { fallback: 'Send Feedback' }
    );

    const npsRatingsList = this.state.currentPage.selectingRating
                         ? <div>
                             <p className='u-textBold u-textCenter SurveyQuestion'>
                               {this.props.survey.question}
                             </p>
                             <NpsRatingsList
                               isMobile={true}
                               className='u-paddingBT'
                               ratingsRange={npsRatings}
                               likelyLabel={this.props.survey.likelyLabel}
                               notLikelyLabel={this.props.survey.notLikelyLabel}
                               selectedRating={this.props.response.rating}
                               isSubmittingRating={this.props.isSubmittingRating}
                               highlightColor={this.props.survey.highlightColor}
                               onChangeValue={this.ratingChangeValueHandler} />
                           </div>
                         : null;

    const zendeskLogo = (this.state.currentPage.thankYou)
                      ? <ZendeskLogo utm='embeddednps' className='ZendeskLogo u-posCenter' />
                      : null;

    const notification = (this.state.currentPage.thankYou)
                       ? <div className='ThankyouTick'>
                           <Icon
                             type='Icon--tick'
                             className={notificationClasses} />
                         </div>
                       : null;

    const heading = (!this.state.currentPage.selectingRating)
                  ? <span className={npsMedText}>
                      {headingText}
                    </span>
                  : null;

    const dropdown = (this.state.currentPage.addingComment)
                   ?  <span className={npsMedText}>
                        <NpsSelectList
                          onFocus={this.handleDropDownFocus}
                          onChange={this.handleDropDownSelection}
                          onBlur={this.handleDropDownBlur}
                          selectedItem={this.props.response.rating}
                          options={npsRatings}
                          highlightColor={this.props.survey.highlightColor} />
                      </span>
                   : null;

    const npsCommentButtonClasses = classNames({
      'u-isHidden': this.state.isEditing || !this.state.currentPage.addingComment
    });

    const npsCommentClasses = classNames({
      'u-isHidden': !this.state.isEditing
    });

    const sendButtonClasses = 'u-marginTS u-marginBM u-sizeFull';

    const containerClassNames = classNames({
      'u-borderTop Container--halfscreen': !this.state.fullscreen,
      'Container--fullscreen--nps': this.state.fullscreen
    });

    return (
      <Container
        className={containerClassNames}
        fullscreen={true}>
        <header className='Container--halfscreen-heading u-textCenter'>
          {heading}
          {dropdown}
        </header>
        <div className='u-marginHM u-borderTop'>
          {npsRatingsList}
           <NpsComment
             ref='npsComment'
             isMobile={true}
             className={npsCommentClasses}
             label={this.props.survey.commentsQuestion}
             comment={this.props.response.comment}
             placeholder={this.props.survey.feedbackPlaceholder}
             onChange={this.props.onCommentChangeHandler}
             onSubmit={this.submitCommentHandler}
             highlightColor={this.props.survey.highlightColor}
             isSubmittingComment={this.props.isSubmittingComment} />
          <div className={npsCommentButtonClasses}>
            <NpsCommentButton
              onClick={this.startEditing}
              placeholder={this.props.survey.feedbackPlaceholder}
              label={this.props.survey.commentsQuestion}
              highlightColor={this.props.survey.highlightColor} />
            <Button
              type='submit'
              className={sendButtonClasses}
              label={sendFeedbackLabel}
              disabled={true} />
          </div>
          {notification}
        </div>
        <footer>
          {zendeskLogo}
        </footer>
      </Container>
    );
  }
}

export { NpsMobile };
