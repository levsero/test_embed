import React from 'react/addons';
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

const classSet = React.addons.classSet;

export const NpsMobile = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    npsSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      currentPage: {
        selectingRating: true,
        thankYou: false,
        addingComment: false
      },
      fullscreen: false
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if ((!prevState.fullscreen && this.state.fullscreen) ||
        (!prevState.isEditing && this.state.isEditing)) {
      this.refs.npsComment
        .refs.commentField
        .refs.field
        .getDOMNode().focus();
    }
  },

  setDefaultNpsMobileSize() {
    setTimeout(() => this.props.setFrameSize(
      `${win.innerWidth}px`,
      this.calcHeightPercentage()),
    0);
  },

  goToFullScreen() {
    if (isIos()) {
      this.startScrollHacks();
      setTimeout(() => this.props.setFrameSize(
        `${win.innerWidth}px`,
        `${win.innerHeight}px`,
        false),
      0);
      this.setState({
        fullscreen: true,
      });
    }
  },

  resetFullScreen() {
    if (isIos()) {
      this.stopScrollHacks();
      this.setDefaultNpsMobileSize();
      this.setState({
        fullscreen: false,
      });
    }
  },

  startEditing() {
    if (isIos()) {
      this.goToFullScreen();
    }
    this.setState({
      isEditing: true
    });
  },

  stopEditing() {
    if (isIos()) {
      this.resetFullScreen();
    }
    this.setState({
      isEditing: false
    });
  },

  calcHeightPercentage() {
    const ratio = getSizingRatio();
    const heightThreshold = 450;
    const heightRatio = win.innerHeight / ratio;

    /* jshint laxbreak: true */
    return (heightRatio < heightThreshold)
         ? (this.state.currentPage.thankYou)
           ? '60%'
           : '70%'
         : (this.state.currentPage.thankYou)
           ? '40%'
           : '51%';
  },

  setCurrentPage(page) {
    this.setState({
      currentPage: _.mapValues(
        this.getInitialState().currentPage,
        (_, key) => key === page
      )
    });
  },

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, () => {
      this.stopEditing();
      this.setCurrentPage('thankYou');
    });
  },

  ratingChangeValueHandler(rating) {
    this.props.submitRatingHandler(rating, () => this.setCurrentPage('addingComment'));
  },

  startScrollHacks() {
    setTimeout(() => {
      setWindowScroll(0);
      setScrollKiller(true);
    }, 0);
  },

  stopScrollHacks() {
    setTimeout(() => {
      setScrollKiller(false);
      revertWindowScroll();
    }, 0);
  },

  render() {
    let headingText;
    if (!this.state.fullscreen) {
      this.setDefaultNpsMobileSize();
    }

    if (this.state.currentPage.addingComment) {
      headingText = this.props.survey.youRated;
    } else if (this.state.currentPage.thankYou) {
      headingText = this.props.survey.thankYou;
    }

    const NPS_RATINGS = _.range(11);

    const dropdownClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const headingClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const notificationClasses = `u-inlineBlock u-userTextColor
                                 u-posRelative u-marginTL u-userFillColor`;

    const npsCommentClasses = classSet({
      'u-isHidden': !this.state.currentPage.addingComment
    });

    /* jshint laxbreak: true */
    const npsRatingsList = this.state.currentPage.selectingRating
                         ? <div>
                             <p className='u-textBold u-textCenter SurveyQuestion'>
                               {this.props.survey.question}
                             </p>
                             <NpsRatingsList
                               likelyLabel={this.props.survey.likelyLabel}
                               notLikelyLabel={this.props.survey.notLikelyLabel}
                               ratingsRange={NPS_RATINGS}
                               selectedRating={this.props.response.rating}
                               isSubmittingRating={this.props.isSubmittingRating}
                               highlightColor={this.props.survey.highlightColor}
                               onChangeValue={this.ratingChangeValueHandler} />
                           </div>
                         : null;

    const zendeskLogo = (!this.state.currentPage.addingComment)
                      ? <ZendeskLogo className='ZendeskLogo u-posCenter' />
                      : null;

    const notification = (this.state.currentPage.thankYou)
                       ? <div className='ThankyouTick'>
                           <Icon
                             type='Icon--tick'
                             className={notificationClasses} />
                         </div>
                       : null;

    const heading = (!this.state.currentPage.selectingRating)
                  ? <span className={headingClasses}>
                      {headingText}
                    </span>
                  : null;

    const dropdown = (this.state.currentPage.addingComment)
                   ?  <span className={dropdownClasses}>
                        <NpsSelectList
                          selectedItem={this.props.response.rating}
                          options={NPS_RATINGS}
                          highlightColor={this.props.survey.highlightColor} />
                      </span>
                   : null;

    const npsCommentButton = this.state.currentPage.addingComment
                           ? <NpsCommentButton
                              onClick={this.startEditing}
                              text={this.props.survey.feedbackPlaceholder}
                              commentsQuestion={this.props.survey.commentsQuestion} />
                           : null;

    const containerClassNames = classSet({
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
          {
            this.state.isEditing
              ? <NpsComment
                  ref='npsComment'
                  className={npsCommentClasses}
                  commentsQuestion={this.props.survey.commentsQuestion}
                  comment={this.props.response.comment}
                  feedbackPlaceholder={this.props.survey.feedbackPlaceholder}
                  onChange={this.props.onCommentChangeHandler}
                  onSubmit={this.submitCommentHandler}
                  highlightColor={this.props.survey.highlightColor}
                  isSubmittingComment={this.props.isSubmittingComment}
                />
              : npsCommentButton
          }
          {notification}
        </div>
        <footer>
          {zendeskLogo}
        </footer>
      </Container>
    );
  }
});
