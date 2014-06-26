/** @jsx React.DOM */

module React from 'react/addons';
import { transport        } from 'service/transport';
import { ZdForm           } from 'component/ZdForm';
import { filter           } from 'mixin/searchFilter';
import { helpCenterSchema } from 'component/HelpCenterSchema';
require('imports?_=lodash!lodash');

export var HelpCenter = React.createClass({
  getInitialState: function() {
    return {
      topics: []
    };
  },

  handleSubmit: function(e, data) {
    e.preventDefault();
    //TODO pass data back to submit ticket form
    return data.value.description;
  },

  handleSearch: function(string) {
    /* jshint camelcase:false */
    transport.send({
      method: 'get',
      path: '/api/proxy',
      query: {
        zendesk_path: '/api/v2/help_center/search.json',
        include: 'translations',
        query: string
      },
      callbacks: {
        done: function(data) {
          this.setState({topics: JSON.parse(data).results.slice(0,3)});
        }.bind(this)
      }
    });
  },

  handleChange: function(event) {
    var str = event.description,
        filteredStr;

    if (str === null) {
      return;
    }

    if (str.length >= 5 && str[str.length-1] === ' ') {
      filteredStr = filter(str);

      if (filteredStr !== '') {
        this.handleSearch(filteredStr);
      }
    }
  },

  render: function() {
    /* jshint quotmark:false */
        var messageClass,
            topics = this.state.topics.map(function(topic) {
              return (
                /* jshint camelcase:false */
                <li key={_.uniqueId('topic_')}>
                  <p>
                    <a href={topic.html_url} target='_blank'>
                      {topic.title}
                    </a>
                  </p>
                </li>
              );
            });

    messageClass = (topics.length !== 0) ? '' : 'u-isHidden';

    return (
      <div className='Container u-nbfc u-posRelative'>
        <ZdForm
          onChange={this.handleChange}
          submit={this.handleSubmit}
          schema={helpCenterSchema}>
          <h3 className={messageClass + ' rf-Field__label'}>
            Are any of these helpful?
          </h3>
          {topics}
          <div className='u-textRight'>
            <input
              type='submit'
              value='Next'
              className='Button Button--default Button--cta Arrange-sizeFit u-textNoWrap'
            />
          </div>
        </ZdForm>
      </div>
    );
  }
});
