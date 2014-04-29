/** @jsx React.DOM */

module React from 'react';
import { Frame } from '../../components/Frame.js';

var SubmitTicket = React.createClass({
  render: function() {
    var base = {
          border: 'solid',
          height: '500px',
          width: '700px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          margin: '-250px 0px 0px -350px',
          background: "white"
      };
    return (
      <Frame style={base}>
         <div class="Container u-nbfc">
          <h1>How can I help you?</h1>
          <form action="https://<%= @host %>/requests/embedded/create/" method="post" class='Form'>
            <div class="Form-container">
              <div class="Grid">
                <div class="Grid-cell Form-field">
                <Input name="Description" placeholder="What do you need help with?"/>
                </div>
              </div>
              <div class="Grid">
                <div class="Grid-cell Form-field">
                  <Message />
                </div>
              </div>
              <div class="Grid Grid--withGutter">
                <div class="Grid-cell u-size1of2 Form-field">
                  <Input name="Name" placeholder=""/>
                </div>
                <div class="Grid-cell u-size1of2 Form-field">
                  <Email />
                </div>
              </div>
            </div>

            <input id="locale_id" name="locale_id" type="hidden" value="1" />
            <input id="set_tags" name="set_tags" type="hidden" value="dropbox buid-<%= @buid %>" />
            <input id="via_id" name="via_id" type="hidden" value="17" />
            <input id="client" name="client" type="hidden" value="" />
            <input id="submitted_from" name="submitted_from" type="hidden" value="" />
            <input id="ticket_from_search" name="ticket_from_search" type="hidden" value="" />

            <input type="submit" class="Button Button--default u-pullRight" />
          </form>
        </div>
      </Frame>
    );
  }
});

function create() {
  //submitTicket = <submitTicket />;
  //this.render();
}

function render() {
    var el = document.body.appendChild(document.createElement('div'));
    React.renderComponent(<SubmitTicket />, el);
  }

var Input = React.createClass ({
    getInitialState: function() {
       return {value: ''};
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function() {
      var value = this.state.value;
    return (
      <div>
      <label class="u-block Form-field-label">{this.props.name}<abbr title="Requied">*</abbr></label>
      <input id="" value={value} onChange={this.handleChange} name="" placeholder={this.props.placeholder} required title="Please fill out this field." type="text" class="u-sizeFull Form-field-element" />
     </div>
    );
  }
});

var Email = React.createClass ({
    getInitialState: function() {
       return {value: ''};
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function() {
      var value = this.state.value;
    return (
      <div>
      <label class="u-block Form-field-label">Email<abbr title="Requied">*</abbr></label>
      <input id="email" value={value} onChange={this.handleChange} name="email" required title="Please fill out this field." type="text" class="u-sizeFull Form-field-element" />
     </div>
    );
  }
});

var Message = React.createClass ({
    getInitialState: function() {
       return {value: ''};
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function() {
      var value = this.state.value;
    return (
      <div>
        <label class="u-block Form-field-label">Message<abbr title="Requied">*</abbr></label>
        <textarea id="description" value={value} onChange={this.handleChange} name="description" placeholder="Give us details here..." required rows="6" title="Please fill out this field." class="u-sizeFull Form-field-element"></textarea>
      </div>
    );
  }
});

export var submitTicket = {
  create: create,
  render: render
};
