/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */

export var ReactLayeredComponentMixin = {
    componentWillUnmount: function() {
        this._unrenderLayer();
        document.body.removeChild(this._target);
    },
    componentDidUpdate: function() {
        this._renderLayer();
    },
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
    },
    _renderLayer: function() {
        // By calling this method in componentDidMount() and componentDidUpdate(), you're
        // effectively creating a "wormhole" that funnels React's hierarchical updates
        // through to a DOM node on an entirely different part of the page.
        React.renderComponent(this.renderLayer(), this._target);
    },
    _unrenderLayer: function() {
        React.unmountComponentAtNode(this._target);
    }
};
