describe('Avatar component', () => {
  let Avatar;
  const avatarPath = buildSrcPath('component/Avatar');

  class MockIcon extends React.Component {
    render() {
      return (
        <div className='Avatar' />
      );
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: MockIcon
      },
      './Avatar.sass': {
        locals: ''
      }
    });

    mockery.registerAllowable(avatarPath);
    Avatar = requireUncached(avatarPath).Avatar;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let component;

    describe('when the src prop is empty', () => {
      beforeEach(() => {
        component = domRender(<Avatar />);
      });

      it('should render an Icon', () => {
        expect(() => TestUtils.findRenderedComponentWithType(component, MockIcon))
          .not.toThrow();
      });

      it('should not render an img', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithTag(component, 'img'))
          .toThrow();
      });
    });

    describe('when the src prop is not empty', () => {
      beforeEach(() => {
        component = domRender(<Avatar src='http://mofo.io/img.png' />);
      });

      it('should render an img with the correct src', () => {
        let img;

        expect(() => img = TestUtils.findRenderedDOMComponentWithTag(component, 'img'))
          .not.toThrow();

        expect(img.src)
          .toBe('http://mofo.io/img.png');
      });
    });
  });
});
