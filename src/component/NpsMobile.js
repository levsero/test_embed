import React from 'react/addons';
import _     from 'lodash';

import { Container }              from 'component/Container';
import { NpsComments }            from 'component/NpsComments';
import { Icon }                   from 'component/Icon';
import { ZendeskLogo }            from 'component/ZendeskLogo';
import { SelectList }             from 'component/SelectList';
import { RatingsList }            from 'component/NpsRatingsList';
import { getSizingRatio }         from 'utility/devices';
import { win }                    from 'utility/globals';
import { i18n }                   from 'service/i18n';

const classSet = React.addons.classSet;

const npsPageStates = {
  selectingRating: 0,
  addingComment: 1,
  thankYou: 2
};

const calcHeightPercentage = (currentPage) => {
  const ratio = getSizingRatio(false, false);
  const heightThreshold = 450;
  const heightRatio = win.innerHeight / ratio;

  if (heightRatio < heightThreshold) {
    if (currentPage && currentPage === npsPageStates.thankYou) {
      return '60%';
    }
    return '70%';
  }
  if (currentPage && currentPage === npsPageStates.thankYou) {
    return '40%';
  }
  return '51%';
};

export const NpsMobile = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func,
    npsSender: React.PropTypes.func.isRequired
  },
  getInitialState() {
    return {
      currentPage: npsPageStates.selectingRating,
    };
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
      sendRating(ev, [this.ratingClickHandlerSuccess]);
    };
  },
  submitCommentHandlerSuccess() {
    this.setState({
      currentPage: npsPageStates.thankYou
    });
  },
  submitCommentHandler(ev) {
    this.props.submitCommentHandler(ev, [this.submitCommentHandlerSuccess]);
  },
  render() {
    /* jshint laxbreak: true */
    let headingText;

    if (this.isCurrentPage(npsPageStates.addingComment)
        || this.isCurrentPage(npsPageStates.thankYou)) {
      setTimeout(() => this.props.setFrameSize(calcHeightPercentage(this.state.currentPage)), 0);
    } else {
      setTimeout(() => this.props.setFrameSize(calcHeightPercentage(this.state.currentPage)), 0);
    }

    if (this.isCurrentPage(npsPageStates.addingComment)) {
      headingText = this.props.survey.youRated;
    } else if (this.isCurrentPage(npsPageStates.thankYou)) {
      headingText = this.props.survey.thankYou;
    }
    const dropdownClasses = classSet({
      'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight': true
    });
    const headingClasses = classSet({
      'u-textSizeMed u-textBold u-extSizeMed u-textCenter u-textXHeight': true
    });
    const notificationClasses = classSet({
      'u-inlineBlock u-userTextColor u-posRelative u-marginTL u-marginBXL u-userFillColor': true
    });

    // rip out to own component
    const ratingsList = this.isCurrentPage(npsPageStates.selectingRating)
                      ? <div>
                          <p className='u-textBold u-textCenter SurveyQuestion'>
                            {this.props.survey.question}
                          </p>
                          <RatingsList
                            likelyLabel={this.props.survey.likelyLabel}
                            notLikelyLabel={this.props.survey.likelyLabel}
                            ratingsRange={_.range(11)}
                            selectedRating={this.props.response.rating}
                            isSubmittingRating={this.props.isSubmittingRating}
                            highlightColor={this.props.survey.highlightColor}
                            onClick={this.ratingClickHandler} />
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

    //WIP FIXME
    const errorHeading = (this.props.survey.error
                          && this.isCurrentPage(npsPageStates.selectingRating))
                       ? <span className={headingClasses}>
                           {i18n.t('embeddable_framework.submitTicket.notify.message.timeout')}
                         </span>
                       : null;

    const dropdown = (this.isCurrentPage(npsPageStates.addingComment))
                   ?  <span className={dropdownClasses}>
                        <SelectList
                          selectedItem={this.props.response.rating}
                          options={_.range(11)}
                          highlightColor={this.props.survey.highlightColor}
                          wrapperClassNames='u-inline u-posRelative'
                          selectClassNames='RatingsDropdown'
                          iconClassNames='RatingsDropdownIcon'
                          iconType='Icon--caret' />
                      </span>
                   : null;
    return (
      <Container
        className='u-borderTop Container--halfScreen is-mobile'
        fullscreen={true}>
        <header className='Heading is-mobile u-textCenter'>
          {errorHeading || heading}
          {dropdown}
        </header>
        <div className='u-marginHM u-borderTop'>
          {ratingsList}
          <NpsComments
            hasError={this.props.survey.error}
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
