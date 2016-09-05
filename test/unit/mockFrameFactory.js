const mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide'),
  setHighlightColor: jasmine.createSpy('setHighlightColor'),
  setButtonColor: jasmine.createSpy('setButtonColor'),
  reRenderCloseButton: jasmine.createSpy('mockReRenderCloseButton'),
  componentDidUpdate: jasmine.createSpy('mockComponentDidUpdate'),
  updateFrameSize: jasmine.createSpy('updateFrameSize')
};

exports.mockFrameMethods = mockFrameMethods;

const mockFrameFactory = jasmine.createSpy('mockFrameFactory').and.callFake(
  function(childFn, params) {
    const self = this;
    const childParams = _.reduce(params.extend, function(res, val, key) {
      res[key] = val.bind(self);
      return res;
    }, {});
    const Component = React.createClass({
      setHighlightColor() {
        this.setState({
          css: 'setHighlightColorCSS { background-color: red; }'
        });
      },

      render: function() {
        return (childFn(childParams));
      }
    });

    const child = domRender(<Component />);

    return _.extend({
      show: mockFrameMethods.show,
      hide: mockFrameMethods.hide,
      setHighlightColor: mockFrameMethods.setHighlightColor,
      setButtonColor: mockFrameMethods.setButtonColor,
      updateFrameSize: mockFrameMethods.updateFrameSize,
      componentDidUpdate: mockFrameMethods.componentDidUpdate,
      close: function(options = {}) {
        params.onClose(this, options);
      },
      getChild: function() {
        return child;
      },
      getRootComponent: function() {
        return child.refs.rootComponent;
      },
      render: function() {
        return (
          <div ref='frame' className='mock-frame'><Component /></div>
        );
      }
    }, params.extend);
  }
);

exports.mockFrameFactory = mockFrameFactory;
