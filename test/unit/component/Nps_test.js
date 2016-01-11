describe('Nps component', function() {
  let Nps;
  const npsPath = buildSrcPath('component/Nps');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
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
        })
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
        LoadingEllipses: noopReactComponent()
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
      <Nps mobile={true} />,
      global.document.body
    );

    expect(document.querySelectorAll('.nps-mobile').length)
      .toEqual(1);
  });

  describe('submitRatingHandler', function() {
    let component,
      npsSenderSpy;

    beforeEach(function() {
      npsSenderSpy = jasmine.createSpy();

      component = React.render(
        <Nps npsSender={npsSenderSpy} />,
        global.document.body
      );

      component.sendRating = jasmine.createSpy();
    });

    it('should set `response.rating` to the provided rating', function() {
      const mockRating = 0;

      component.submitRatingHandler(mockRating, noop);

      expect(component.state.response.rating)
        .toEqual(mockRating);
    });
  });

  describe('updateRating', () => {
    it('should update the rating state', () => {
      const component = React.render(
        <Nps mobile={true} />,
        global.document.body
      );

      expect(component.state.response.rating)
        .toEqual(null);

      component.updateRating('7');

      expect(component.state.response.rating)
        .toEqual('7');
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

    describe('done', function() {
      let doneFn;

      beforeEach(function() {
        doneFn = jasmine.createSpy();
      });

      it('should set survey.error to false', function() {
        component.npsSender({}, noop, noop);

        expect(component.state.survey.error)
          .toEqual(false);
      });

      it('should set isSubmittingRating to false', function() {
        component.npsSender({}, noop, noop);

        expect(component.state.isSubmittingRating)
          .toEqual(false);
      });

      it('should set isSubmittingComment to false', function() {
        component.npsSender({}, noop, noop);

        expect(component.state.isSubmittingComment)
          .toEqual(false);
      });

      it('should run the provided doneFn', function() {
        component.npsSender({}, doneFn, noop);

        npsSenderSpy.calls.mostRecent().args[1]();

        expect(doneFn)
          .toHaveBeenCalled();
      });
    });

    describe('fail', function() {
      let failFn;

      beforeEach(function() {
        failFn = jasmine.createSpy();
      });

      it('should set survey.error to true', function() {
        component.npsSender({}, noop, noop);

        npsSenderSpy.calls.mostRecent().args[2]();

        expect(component.state.survey.error)
          .toEqual(true);
      });

      it('should set isSubmittingRating to false', function() {
        component.npsSender({}, noop, noop);

        expect(component.state.isSubmittingRating)
          .toEqual(false);
      });

      it('should set isSubmittingComment to false', function() {
        component.npsSender({}, noop, noop);

        expect(component.state.isSubmittingComment)
          .toEqual(false);
      });

      it('should run the provided failFn', function() {
        component.npsSender({}, noop, failFn);

        npsSenderSpy.calls.mostRecent().args[2]();

        expect(failFn)
          .toHaveBeenCalled();
      });
    });
  });
});
