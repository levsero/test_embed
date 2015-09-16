describe('Nps component', function() {
  let Nps,
      mockRegistry;

  const npsPath = buildSrcPath('component/Nps');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'lodash': _,
      'component/NpsDesktop': {
        NpsDesktop: React.createClass({
          render() {
            return (
              <div className='nps-desktop' />
            );
          }
        })
      },
      'component/NpsMobile': {
        NpsMobile: React.createClass({
          render() {
            return (
              <div className='nps-mobile' />
            );
          }
        })
      },
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        }),
      },
      'component/Button': {
        Button: noopReactComponent(),
        ButtonSecondary: noopReactComponent(),
        ButtonGroup: noopReactComponent()
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'component/FormField': {
        Field: noopReactComponent()
      },
      'component/Loading': {
        LoadingElipses: noopReactComponent()
      }
    });
    Nps = requireUncached(npsPath).Nps;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('initializes with state.surveyAvailable set to `null`', function() {
    const nps = React.render(
      <Nps npsSender = {() => {}} />,
      global.document.body
    );

    expect(nps.state.surveyAvailable)
      .toEqual(null);
  });

  it('sends the correct rating', function() {
    const npsSender = jasmine.createSpy('npsSender');
    const nps = React.render(
      <Nps npsSender={npsSender} />,
      global.document.body
    );

    const rating = 5;

    nps.setState({
      response: {
        rating: rating
      }
    });

    nps.sendRating();

    expect(npsSender)
      .toHaveBeenCalled();

    const params = npsSender.calls.mostRecent().args[0];

    expect(params.npsResponse.rating)
      .toEqual(rating);
  });

  it('sends the correct comment', function() {
    const npsSender = jasmine.createSpy('npsSender');
    const nps = React.render(
      <Nps npsSender={npsSender} />,
      global.document.body
    );

    const rating = 5;
    const comment = 'A comment';

    nps.setState({
      response: {
        rating: rating,
        comment: comment
      }
    });

    nps.sendComment();

    expect(npsSender)
      .toHaveBeenCalled();

    const params = npsSender.calls.mostRecent().args[0];

    expect(params.npsResponse.rating)
      .toEqual(rating);

    expect(params.npsResponse.comment)
      .toEqual(comment);
  });

  it('renders NpsMobile when mobile prop is true', function() {
    React.render(
      <Nps mobile={true}/>,
      global.document.body
    );

    expect(document.querySelectorAll('.nps-mobile').length)
      .toEqual(1);
  });

  describe('retry', function() {
    it('should call the provided function if the tries are less than the threshold', function() {
      let component = React.render(
        <Nps />,
        global.document.body
      );
      let spy = jasmine.createSpy();

      component.retry(spy, 0);

      expect(spy)
        .toHaveBeenCalled();
    });

    it(`should not call the provided function
     if the tries are less than the threshold`, function() {
      let component = React.render(
        <Nps />,
        global.document.body
      );
      let spy = jasmine.createSpy();

      component.retry(spy, 1);

      expect(spy)
        .not.toHaveBeenCalled();
    });
  });

  describe('responseFailure', function() {
    let retrySpy,
        callbackSpy,
        component;
    beforeEach(function() {

      retrySpy = jasmine.createSpy();
      callbackSpy = jasmine.createSpy();

      component = React.render(
        <Nps />,
        global.document.body
      );
    });

    it('should call retry if error.timeout is true && tries < the threshold', function() {
      let mockError = { timeout: true };

      component.retry = retrySpy;
      component.responseFailure(0, noop, [])(mockError);

      expect(component.retry)
        .toHaveBeenCalled();
    });

    it('should not call retry if tries >= the threshold', function() {
      let mockError = { timeout: true };

      component.retry = retrySpy;
      component.responseFailure(1, noop, [])(mockError);

      expect(component.retry)
        .not.toHaveBeenCalled();
    });

    it('should not call retry if the error is not a timeout error', function() {
      let mockError = { timeout: false };

      component.retry = retrySpy;
      component.responseFailure(0, noop, [])(mockError);

      expect(component.retry)
        .not.toHaveBeenCalled();
    });

    it('should set isSubmittingRating to false if the error is not a timeout error', function() {
      let mockError = { timeout: false };

      component.responseFailure(0, noop, [])(mockError);

      expect(component.state.isSubmittingRating)
        .toEqual(false);
    });

    it('should set isSubmittingComment to false if the error is not a timeout error', function() {
      let mockError = { timeout: false };

      component.responseFailure(0, noop, [])(mockError);

      expect(component.state.isSubmittingComment)
        .toEqual(false);
    });

    it('should set survey.error to true if the error is not a timeout error', function() {
      let mockError = { timeout: false };

      component.responseFailure(0, noop, [])(mockError);

      expect(component.state.survey.error)
        .toEqual(true);
    });

    it(`should call the provided list of callbacks
     if the error is not a timeout error`, function() {
      let mockError = { timeout: false };

      component.responseFailure(0, noop, [callbackSpy])(mockError);

      expect(callbackSpy)
        .toHaveBeenCalled();
    });
  });
  describe('responseSuccess', function() {
    let component,
        callbackSpy;

    beforeEach(function() {

      callbackSpy = jasmine.createSpy();

      component = React.render(
        <Nps />,
        global.document.body
      );
    });
    it('should set isSubmittingRating to false', function() {
      component.responseSuccess([])();

      expect(component.state.isSubmittingRating)
        .toEqual(false);
    });
    it('should set isSubmittingComment to false', function() {
      component.responseSuccess([])();

      expect(component.state.isSubmittingComment)
        .toEqual(false);
    });
    it('should set call the provided list of callbacks', function() {
      component.responseSuccess([callbackSpy])();

      expect(callbackSpy)
        .toHaveBeenCalled();
    });
  });

  describe('npsSender', function() {
    let component,
        npsSenderSpy;

    beforeEach(function() {

      npsSenderSpy = jasmine.createSpy();

      component = React.render(
        <Nps npsSender={npsSenderSpy} />,
        global.document.body
      );
    });

    it('should set survey.error to false', function() {

      component.npsSender();

      expect(component.state.survey.error)
        .toEqual(false);
    });

    it('should call the this.props.npsSender', function() {

      component.npsSender();

      expect(npsSenderSpy)
        .toHaveBeenCalled();
    });
  });
});
