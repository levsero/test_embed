import React from 'react/addons';
import _     from 'lodash';

import { Button,
         ButtonSecondary,
         ButtonGroup } from 'component/Button';
import { Container } from 'component/Container';
import { Field } from 'component/FormField';
import { Loading } from 'component/Loading';
import { transport } from 'service/transport';

const classSet = React.addons.classSet;

const ScoreButton = React.createClass({
  /* jshint laxbreak: true */
  getDefaultProps() {
    return {
      highlightColor: '',
      selected: false,
      loading: false,
      label: null
    };
  },
  render() {
    const style = (this.props.selected)
                ? {
                    borderColor: this.props.highlightColor,
                    background: this.props.highlightColor,
                    color: '#fff'
                  }
                : {};

    const content = (this.props.loading)
                  ? (<div style={{width:'30px'}}>
                       <Loading  />
                     </div>)
                  : (<ButtonSecondary
                       style={style}
                       label={`${this.props.label}`}
                       onClick={this.props.onClick} />);

    return content;
  }
});

export const Nps = React.createClass({
  propTypes: {
    updateFrameSize: React.PropTypes.func
  },

  getInitialState() {
    return {
      survey: {
        commentsQuestion: '',
        highlightColor: '',
        surveyId: null,
        logoUrl: '',
        question: '',
        recepientId: null
      },
      response: {
        score: null,
        comment: ''
      },
      commentFieldDirty: false,
      isSubmittingScore: false,
      isSubmittingComment: false,
      surveyCompleted: false
    };
  },

  sendScore() {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recepientId: this.state.survey.recepientId,
        score: this.state.response.score
      }
    };
    const payload = {
      path: '/embeddable/nps',
      params: params,
      callbacks: {
        done: () => {
          this.setState({ isSubmittingScore: false });
        },
        fail: () => {}
      }
    };

    transport.sendWithMeta(payload);
  },

  sendComment() {
    const params = {
      npsResponse: {
        surveyId: this.state.survey.surveyId,
        recepientId: this.state.survey.recepientId,
        score: this.state.response.score,
        comment: this.state.response.comment
      }
    };
    const payload = {
      path: '/embeddable/nps',
      params: params,
      callbacks: {
        done: () => {
          this.setState({
            isSubmittingComment: false,
            surveyCompleted: true
          });
        },
        fail: () => {}
      }
    };

    transport.sendWithMeta(payload);
  },

  scoreClickHandler(score) {
    return () => {
      this.setState({
        response: _.extend(this.state.response, { score: score }),
        isSubmittingScore: true
      });
      setTimeout(this.sendScore, 1);
      setTimeout(() => {
        this.refs.commentField.refs.field.getDOMNode().focus();
      }, 10);
    };
  },

  submitCommentHandler() {
    this.setState({ isSubmittingComment: true });
    setTimeout(this.sendComment, 1);
  },

  onChangeHandler(ev) {
    this.setState({
      response: _.extend(this.state.response, { comment: ev.target.value }),
      commentFieldDirty: true
    });
  },

  reset() {
    this.setState(this.getInitialState());
  },

  render() {
    /* jshint laxbreak: true */
    if (this.props.updateFrameSize) {
      setTimeout(() => this.props.updateFrameSize(), 0);
    }

    const commentsClasses = classSet({
      'u-isHidden': this.state.response.score === null
    });

    const sendButtonClasses = classSet({
      'u-isHidden': (!this.state.commentFieldDirty
                     || this.state.isSubmittingComment
                     || this.state.surveyCompleted)
    });

    const submittingCommentLoadingClasses = classSet({
      'u-isHidden': !this.state.isSubmittingComment
    });

    const thankYouClasses = classSet({
      'u-textCenter': true,
      'u-isHidden': !this.state.surveyCompleted
    });

    const scoreListItemTemplate = (score) => {
      const isSelected = this.state.response.score === score;
      const props = {
        label: score,
        loading: isSelected && this.state.isSubmittingScore,
        selected: isSelected,
        highlightColor: this.state.survey.highlightColor,
        onClick: this.scoreClickHandler(score)
      };

      return (
        <li>
          <ScoreButton {...props} />
        </li>
      );
    };

    const scoreListItems = _.range(11) // 0...10
                            .map(scoreListItemTemplate);

    return (
      <Container style={this.props.style}>
        <div style={{padding: '35px 10px 10px' }}>

        <p>{this.state.survey.question}</p>

        <ol className='nps-scores'>
          { scoreListItems }
        </ol>

          <div className={commentsClasses}>
            <form>
              <Field
                ref='commentField'
                placeholder={this.state.survey.commentsQuestion}
                value={this.state.response.comment}
                name='comment'
                input={<textarea rows="2"></textarea>}
                onChange={this.onChangeHandler} />
            </form>
          </div>

          <ButtonGroup rtl={false}>
            <Button
              onClick={this.submitCommentHandler}
              className={sendButtonClasses}
              label='Send' />
          </ButtonGroup>

          <div
            className={submittingCommentLoadingClasses}
            style={{paddingTop: '16px', paddingRight: '35px', height: '21px'}}>
            <Loading className='u-textRight' />
          </div>

          <div
            className={thankYouClasses}
            style={{fontWeight:'bold'}}>
            Thank you for your response!
          </div>
        </div>
      </Container>
    );
  }
});
