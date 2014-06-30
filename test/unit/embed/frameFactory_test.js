/** @jsx React.DOM */

describe('frameFactory', function() {

  var frameFactory,
      mockComponent = React.createClass({
        render: function() {
          /* jshint quotmark:false */
          return <div className='mock-component' />;
        }
      }),
      mockChildFn = function() {
        return (
          /* jshint quotmark:false */
          <mockComponent
            ref='mockComponent' />
        );
      },
      frameFactoryPath = buildSrcPath('embed/frameFactory');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockery.registerMock('baseCSS', '.base-css-file {} ');
    mockery.registerMock('mainCSS', '.main-css-file {} ');
    mockery.registerMock('imports?_=lodash!lodash', _);

    frameFactory = require(frameFactoryPath).frameFactory;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('throws if childFn is not a function', function() {
    expect(function() {
      frameFactory({});
    }).toThrow();

    expect(function() {
      frameFactory('1');
    }).toThrow();
  });

  it('throws if childFn does not return a React component', function() {
    expect(function() {
      frameFactory(noop, {});
    }).toThrow();
  });

  describe('getDefaultProps', function() {
    it('has default prop value for `visible` set to true', function() {
      var payload = frameFactory(mockChildFn),
      defaultProps = payload.getDefaultProps();

      expect(defaultProps.visible).toEqual(true);
    });
  });

  describe('getInitialState', function() {
    it('picks up initial state for `visible` from the `visible` prop', function() {
      var Embed = React.createClass(frameFactory(mockChildFn)),
      instance = React.renderComponent(
          <Embed visible={false} />,
        global.document.body
      );
      expect(instance.state.visible).toEqual(false);
    });
  });

  describe('getChild', function() {
    it('stores and exposes the child component via getChild()', function() {
      var Embed = React.createClass(frameFactory(mockChildFn)),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          ),
          children = instance
            .getChild()
            ._renderedComponent
            .props
            .children,
          mockComponentIsPresent;

      // Epic traversal to verify that
      // mockComponent shows up as one
      // of the children inside `instance`
      mockComponentIsPresent = _.some(children, function(child) {
        if (child && child._renderedComponent) {
          return child
            .__realComponentInstance
            ._renderedComponent
            .props
            .className === 'mock-component';
        }
        return false;
      });

      expect(mockComponentIsPresent).toEqual(true);
    });
  });

  describe('updateFrameSize', function() {
    it('reads content dimensions and sets the state', function() {

      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          ),
          iframe = global.document.body.getElementsByTagName('iframe')[0];

      jasmine.Clock.useMock();

      // This is the "dirty" state
      instance.setState({iframeDimensions: {width:999, height: 999}});

      expect(iframe.style.width)
        .toEqual('999px');

      expect(iframe.style.height)
        .toEqual('999px');

      // jsdom doesn't actually attempt to render a document
      // so client*/offset* will give use NaN which then gets ||'ed with 0.
      instance.updateFrameSize();

      jasmine.Clock.tick(10);

      // best we can do is check that that the width and height
      // have been updated from 999 to 0.
      expect(iframe.style.width)
        .toEqual('0px');

      expect(iframe.style.height)
        .toEqual('0px');

      // TODO: real browser tests that work off client*/offset* values.
    });
  });

  describe('show', function() {
    var instance,
        mockOnShow;

    beforeEach(function() {
      var payload,
          Embed;

      mockOnShow = jasmine.createSpy('onShow');

      payload = frameFactory(mockChildFn, {
        onShow: mockOnShow
      }),

      Embed = React.createClass(payload);

      instance = React.renderComponent(
          <Embed />,
        global.document.body
      );
    });

    it('sets `visible` state to true', function() {
      instance.setState({visible: false});

      instance.show();

      expect(instance.state.visible)
        .toEqual(true);
    });

    it('triggers params.onShow if set', function() {
      instance.show();

      expect(mockOnShow).toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    var instance,
        mockOnHide;

    beforeEach(function() {
      var payload,
          Embed;

      mockOnHide = jasmine.createSpy('onHide');

      payload = frameFactory(mockChildFn, {
        onHide: mockOnHide
      });

      Embed = React.createClass(payload);

      instance = React.renderComponent(
          <Embed />,
        global.document.body
      );
    });

    it('sets `visible` state to false', function() {
      instance.setState({visible: true});

      instance.hide();

      expect(instance.state.visible)
        .toEqual(false);
    });

    it('triggers params.onHide if set', function() {
      instance.hide();

      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  describe('render', function() {
    var instance;

    beforeEach(function() {
      var payload = frameFactory(mockChildFn, {
            style: {
              backgroundColor: '#abc',
              display: 'none'
            }
          }),
          Embed = React.createClass(payload);

      instance = React.renderComponent(
          <Embed />,
        global.document.body
      );
    });

    it('renders an iframe to the document', function() {
      expect(global.document.body.getElementsByTagName('iframe').length)
        .toEqual(1);
    });

    it('uses `state.visible` to determine its css `display` rule', function() {
      var iframe = global.document.body.getElementsByTagName('iframe')[0];

      expect(iframe.style.display)
        .toEqual('block');


      instance.setState({visible: false});

      expect(iframe.style.display)
        .toEqual('none');


      instance.setState({visible: true});

      expect(iframe.style.display)
        .toEqual('block');
    });

    it('has `border` css rule set to none', function() {
      var iframe = global.document.body.getElementsByTagName('iframe')[0];

      expect(iframe.style.border)
        .toEqual('none');
    });

    it('merges in css rules from params.style with correct precedence', function() {
      var iframe = global.document.body.getElementsByTagName('iframe')[0];

      expect(iframe.style.backgroundColor)
        .toEqual('#abc');

      expect(iframe.style.display)
        .toEqual('block');

    });

  });

  describe('renderFrameContent', function() {

    it('adds a <style> block with relevant rules to the iframe document', function() {
      var payload = frameFactory(mockChildFn, {
            css: '.params-css {} '
          }),
          Embed = React.createClass(payload);

      var instance = React.renderComponent(
          <Embed />,
        global.document.body
      );

      var child = instance.getChild();

      var styleBlock = child.getDOMNode().getElementsByTagName('style')[0];

      expect(styleBlock.innerHTML.indexOf('.base-css-file {}') >= 0)
        .toBeTruthy();

      expect(styleBlock.innerHTML.indexOf('.main-css-file {}') >= 0)
        .toBeTruthy();

      expect(styleBlock.innerHTML.indexOf('.params-css {}') >= 0)
        .toBeTruthy();
    });

    it('injects params.extend functions into the child component', function() {
      var mockClickHandler = jasmine.createSpy('mockClickHandler'),
          mockSubmitHandler = jasmine.createSpy('mockSubmitHandler'),
          payload = frameFactory(
          function(params) {
            return (
              /* jshint quotmark:false */
              <mockComponent
                ref='mockComponent'
                onClick={params.onClickHandler}
                onSubmit={params.onSubmitHandler} />
            );
          },
          {
            extend: {
              onClickHandler: mockClickHandler,
              onSubmitHandler: mockSubmitHandler
            }
          }),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          ),
          child = instance.getChild().refs.mockComponent;

      child.props.onClick('click param');

      expect(mockClickHandler)
        .toHaveBeenCalledWith('click param');

      child.props.onSubmit('submit param');

      expect(mockSubmitHandler)
        .toHaveBeenCalledWith('submit param');
    });

    it('injects the internal updateFrameSize into the child component', function() {
      var mockUpdateFrameSize = jasmine.createSpy('mockUpdateFrameSize'),
          payload = frameFactory(
          function(params) {
            return (
              /* jshint quotmark:false */
              <mockComponent
                ref='mockComponent'
                updateFrameSize={params.updateFrameSize} />
            );
          },
          {
            extend: {
              updateFrameSize: mockUpdateFrameSize
            }
          }),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          ),
          child = instance.getChild().refs.mockComponent;

      jasmine.Clock.useMock();

      // setup "dirty" state
      instance.setState({
        iframeDimensions: {width: -1, height: -1}
      });

      child.props.updateFrameSize();

      jasmine.Clock.tick(10);

      // shouldn't call the injected updateFrameSize prop
      expect(mockUpdateFrameSize).not.toHaveBeenCalled();

      // should have called the internal updateFrameSize
      // which updates the iframeDimensions state
      expect(instance.state.iframeDimensions)
        .toEqual({width: 0, height: 0});
    });

    it('renders the child component to the document', function() {
      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          );

      expect(instance.getChild().refs.mockComponent)
        .toBeDefined();
    });

    it('updates `state._rendered` at the end', function() {
      var payload = frameFactory(mockChildFn),
          Embed = React.createClass(payload),
          instance = React.renderComponent(
            <Embed />,
            global.document.body
          );

      expect(instance.getInitialState()._rendered)
        .toEqual(false);

      expect(instance.state._rendered)
        .toEqual(true);
    });

  });

});
