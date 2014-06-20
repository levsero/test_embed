/** @jsx React.DOM */

var mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide')
};

exports.mockFrameMethods = mockFrameMethods;

var mockFrameFactory = jasmine.createSpy('mockFrameFactory').andCallFake(
  function(child, params) {
    return _.extend({
      show: mockFrameMethods.show,
      hide: mockFrameMethods.hide,
      render: function() {
        var root = this;
        var childParams = _.reduce(params.extend, function(res, val, key) {
          res[key] = val.bind(root);
          return res;
        }, {});
        return (
          /* jshint quotmark:false */
            <div ref='frame' className='mock-frame'>
            {child(childParams)}
          </div>);
      }
    }, params.extend);
  }
);

exports.mockFrameFactory = mockFrameFactory;
