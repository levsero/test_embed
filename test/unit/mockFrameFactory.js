const mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide'),
  close: jasmine.createSpy('mockFrameClose'),
  setHighlightColor: jasmine.createSpy('setHighlightColor'),
  reRenderCloseButton: jasmine.createSpy('mockReRenderCloseButton')
};

exports.mockFrameMethods = mockFrameMethods;

var mockFrameFactory = jasmine.createSpy('mockFrameFactory').and.callFake(
  function(childFn, params) {
    const self = this;
    const childParams = _.reduce(params.extend, function(res, val, key) {
      res[key] = val.bind(self);
      return res;
    }, {});
    const Component = React.createClass({
      setHighlightColor() {
        this.setState({
          css: `setHighlightColorCSS { background-color: red; }`
        });
      },

      render: function() {
        return (childFn(childParams));
      }
    });

    const child = React.render(<Component />, global.document.body);

    return _.extend({
      show: mockFrameMethods.show,
      hide: mockFrameMethods.hide,
      close: mockFrameMethods.close,
      setHighlightColor: mockFrameMethods.setHighlightColor,
      reRenderCloseButton: mockFrameMethods.reRenderCloseButton,
      getChild: function() {
        return child;
      },
      getRootComponent: function() {
        return child.refs.rootComponent;
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
