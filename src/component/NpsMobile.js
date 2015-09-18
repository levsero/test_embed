import React from 'react/addons';
import _     from 'lodash';

import { Container } from 'component/Container';
import { NpsComment } from 'component/NpsComment';
import { Icon } from 'component/Icon';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { SelectList } from 'component/SelectList';
import { NpsRatingsList } from 'component/NpsRatingsList';
import { getSizingRatio } from 'utility/devices';
import { win } from 'utility/globals';

const npsPageStates = {
  selectingRating: 0,
  addingComment: 1,
  thankYou: 2
};

export const NpsMobile = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    npsSender: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      currentPage: npsPageStates.selectingRating
    };
  },

  calcHeightPercentage() {
    const currentPage = this.state.currentPage;
    const ratio = getSizingRatio(false, false);
    const heightThreshold = 450;
    const heightRatio = win.innerHeight / ratio;

    /* jshint laxbreak: true */
    return (heightRatio < heightThreshold)
         ? (currentPage === npsPageStates.thankYou)
           ? '60%'
           : '70%'
         : (currentPage === npsPageStates.thankYou)
           ? '40%'
           : '51%';
  },

  isCurrentPage(pageEnum) {
    return this.state.currentPage === pageEnum;
  },

  ratingClickHandlerSuccess() {
    this.setState({ currentPage: npsPageStates.addingComment });
  },

  ratingClickHandler(rating) {
    let sendRating = this.props.ratingClickHandler(rating);
    return (ev) => {
      sendRating(ev, this.ratingClickHandlerSuccess);
    };
  },

  submitCommentHandlerSuccess() {
    this.setState({
      currentPage: npsPageStates.thankYou
    });
  },

  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, this.submitCommentHandlerSuccess);
  },

  render() {
    let headingText;

    setTimeout(() => this.props.setFrameSize(this.calcHeightPercentage()), 0);

    if (this.isCurrentPage(npsPageStates.addingComment)) {
      headingText = this.props.survey.youRated;
    } else if (this.isCurrentPage(npsPageStates.thankYou)) {
      headingText = this.props.survey.thankYou;
    }

    const dropdownClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const headingClasses = 'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight';

    const notificationClasses = `u-inlineBlock u-userTextColor
                                 u-posRelative u-marginTL u-userFillColor`;

    /* jshint laxbreak: true */
    const npsRatingsList = this.isCurrentPage(npsPageStates.selectingRating)
                         ? <div>
                             <p className='u-textBold u-textCenter SurveyQuestion'>
                               {this.props.survey.question}
                             </p>
                             <NpsRatingsList
                               likelyLabel={this.props.survey.likelyLabel}
                               notLikelyLabel={this.props.survey.notLikelyLabel}
                               ratingsRange={_.range(11)}
                               selectedRating={this.props.response.rating}
                               isSubmittingRating={this.props.isSubmittingRating}
                               highlightColor={this.props.survey.highlightColor}
                               onClick={this.ratingClickHandler}
                               highlightButton={!this.props.survey.error}/>
                           </div>
                         : null;

    const zendeskLogo = (!this.isCurrentPage(npsPageStates.addingComment))
                      ? <ZendeskLogo className='ZendeskLogo u-posCenter' />
                      : null;

    const notification = (this.isCurrentPage(npsPageStates.thankYou))
                       ? <div className='ThankyouTick'>
                           <Icon
                             type='Icon--tick'
                             className={notificationClasses} />
                         </div>
                       : null;

    const heading = (!this.isCurrentPage(npsPageStates.selectingRating))
                  ? <span className={headingClasses}>
                      {headingText}
                    </span>
                  : null;

    const dropdown = (this.isCurrentPage(npsPageStates.addingComment))
                   ?  <span className={dropdownClasses}>
                        <SelectList
                          selectedItem={this.props.response.rating}
                          options={_.range(11)}
                          highlightColor={this.props.survey.highlightColor}
                          wrapperClassNames='u-inline u-posRelative'
                          selectClassNames='NpsComment-selectlist'
                          iconClassNames='NpsComment-selectlist-icon'
                          iconType='Icon--caret' />
                      </span>
                   : null;
    return (
      <Container
        className='u-borderTop Container--halfscreen'
        fullscreen={true}>
        <header className='Container--halfscreen-heading u-textCenter'>
          {heading}
          {dropdown}
        </header>
        <div className='u-marginHM u-borderTop'>
          {npsRatingsList}
          <NpsComment
            commentsQuestion={this.props.survey.commentsQuestion}
            comment={this.props.response.comment}
            feedbackPlaceholder={this.props.survey.feedbackPlaceholder}
            onChange={this.props.onCommentChangeHandler}
            onSubmit={this.submitCommentHandler}
            highlightColor={this.props.survey.highlightColor}
            hidden={!this.isCurrentPage(npsPageStates.addingComment)}
            isSubmittingComment={this.props.isSubmittingComment}
          />
          {notification}
        </div>
        <footer>
          {zendeskLogo}
        </footer>
      </Container>
    );
  }
});
