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
    describe('when the src prop is empty', () => {
      beforeEach(() => {
        domRender(<Avatar />);
      });

      it('should render an Icon', () => {
        expect(document.querySelector('.Avatar'))
          .toBeTruthy();
      });

      it('should not render an img', () => {
        expect(document.querySelector('img'))
          .toBeFalsy();
      });
    });

    describe('when the src prop is not empty', () => {
      beforeEach(() => {
        domRender(<Avatar src='http://mofo.io/img.png' />);
      });

      it('should render an img with the correct src', () => {
        const img = document.querySelector('img');

        expect(img)
          .toBeTruthy();

        expect(img.src)
          .toBe('http://mofo.io/img.png');
      });
    });
  });
});
