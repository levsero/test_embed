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
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: MockIcon
      },
      './Avatar.scss': {
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
    let fallbackIconType = 'Icon-Type';

    describe('when the src prop is empty', () => {
      beforeEach(() => {
        component = domRender(<Avatar fallbackIcon={fallbackIconType} />);
      });

      it('renders the icon', () => {
        expect(() => TestUtils.findRenderedComponentWithType(component, MockIcon))
          .not.toThrow();
      });

      it('the rendered Icon has the type of the fallback icon', () => {
        expect(TestUtils.findRenderedComponentWithType(component, MockIcon).props.type)
          .toEqual(fallbackIconType);
      });

      it('does not render an img', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithTag(component, 'img'))
          .toThrow();
      });
    });

    describe('when the src prop is not empty', () => {
      beforeEach(() => {
        component = domRender(<Avatar src='http://mofo.io/img.png' />);
      });

      it('renders an img with the correct src', () => {
        let img;

        expect(() => img = TestUtils.findRenderedDOMComponentWithTag(component, 'img'))
          .not.toThrow();

        expect(img.src)
          .toBe('http://mofo.io/img.png');
      });
    });
  });
});
