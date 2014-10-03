/** @jsx React.DOM */

var mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide')
};

exports.mockFrameMethods = mockFrameMethods;

var mockFrameFactory = jasmine.createSpy('mockFrameFactory').and.callFake(
  function(childFn, params) {
    var child;

    var root = this;
    var childParams = _.reduce(params.extend, function(res, val, key) {
      res[key] = val.bind(root);
      return res;
    }, {});
    var Component = React.createClass({
      render: function() {
        return (childFn(childParams));
      }
    });

    child = React.renderComponent(<Component />, global.document.body);

    return _.extend({
      show: mockFrameMethods.show,
      hide: mockFrameMethods.hide,
      getChild: function() {
        return child;
      },
      render: function() {
        return (
          /* jshint quotmark:false */
          <div ref='frame' className='mock-frame'><Component /></div>
        );
      }
    }, params.extend);
  }
);

exports.mockFrameFactory = mockFrameFactory;
