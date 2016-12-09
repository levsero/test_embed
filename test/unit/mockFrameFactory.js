const mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide'),
  expand: jasmine.createSpy('mockFrameExpand'),
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

    class Component extends React.Component {
      setHighlightColor() {
        this.setState({
          css: 'setHighlightColorCSS { background-color: red; }'
        });
      }

      showBackButton() {
        this.setState({ showBackButton: true });
      }

      render() {
        return (childFn(childParams));
      }
    }

    const child = domRender(<Component />);

    return React.createClass(
      _.extend({
        show: mockFrameMethods.show,
        hide: mockFrameMethods.hide,
        expand: mockFrameMethods.expand,
        setHighlightColor: mockFrameMethods.setHighlightColor,
        setButtonColor: mockFrameMethods.setButtonColor,
        updateFrameSize: mockFrameMethods.updateFrameSize,
        componentDidUpdate: mockFrameMethods.componentDidUpdate,
        close(options = {}) {
          params.onClose(this, options);
        },
        getChild() {
          return child;
        },
        getRootComponent() {
          return child.refs.rootComponent;
        },
        render() {
          return (
            <div ref='frame' className='mock-frame'><Component /></div>
          );
        }
      }, params.extend)
    );
  }
);

exports.mockFrameFactory = mockFrameFactory;
