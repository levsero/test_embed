describe('ChatHeader component', () => {
  let ChatHeader;
  const chatHeaderPath = buildSrcPath('component/chat/ChatHeader');

  class MockAvatar extends React.Component {
    render() {
      return <div className='Avatar' />;
    }
  }

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/Avatar': {
        Avatar: MockAvatar
      },
      'component/chat/ChatRatingGroup': {
        ChatRatingGroup: noopReactComponent()
      },
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render = () => {
            return (
              <div className={`${this.props.icon} ${this.props.className}`} />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      './ChatHeader.scss': {
        locals: {
          container: 'container',
          textContainer: 'textContainer',
          ratingIconActive: 'ratingIconActive',
          clickable:'clickableClasses'
        }
      }
    });

    mockery.registerAllowable(chatHeaderPath);
    ChatHeader = requireUncached(chatHeaderPath).ChatHeader;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let component;

    beforeEach(() => {
      const props = {
        avatar: 'https://example.com/snake',
        title: 'Luke Skywalker',
        byline: 'Jedi'
      };

      component = domRender(<ChatHeader {...props} />);
    });

    it('renders an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar))
        .not.toThrow();
    });

    describe('props', () => {
      it('uses the agents name as the title', () => {
        const titleElem = document.querySelector('.textContainer').firstChild;

        expect(titleElem.innerHTML)
          .toEqual('Luke Skywalker');
      });

      it('uses the agents title as the subText', () => {
        const subTextElem = document.querySelector('.textContainer').childNodes[1];

        expect(subTextElem.innerHTML)
          .toEqual('Jedi');
      });

      it('passes the avatar_path to the avatar component', () => {
        const avatar = TestUtils.findRenderedComponentWithType(component, MockAvatar);

        expect(avatar.props.src)
          .toEqual('https://example.com/snake');
      });

      it('passes Icon--avatar as the fallback icon to the avatar component', () => {
        const avatar = TestUtils.findRenderedComponentWithType(component, MockAvatar);

        expect(avatar.props.fallbackIcon)
          .toEqual('Icon--avatar');
      });

      describe('onAgentDetailsClick', () => {
        let onClickSpy,
          agentDetailsContainer;

        beforeEach(() => {
          const component = instanceRender(<ChatHeader onAgentDetailsClick={onClickSpy} />);

          agentDetailsContainer = component.render().props.children[0];
        });

        describe('when it is defined', () => {
          beforeAll(() => {
            onClickSpy = jasmine.createSpy();
          });

          it('adds the clickable classNames to the agent details container', () => {
            expect(agentDetailsContainer.props.className)
              .toContain('clickableClasses');
          });

          it('sets the onClick of the agent details container to the prop', () => {
            expect(agentDetailsContainer.props.onClick)
              .toEqual(onClickSpy);
          });
        });

        describe('when it is not defined', () => {
          beforeAll(() => {
            onClickSpy = undefined;
          });

          it('does not add the clickable classNames to the agent details container', () => {
            expect(agentDetailsContainer.props.className)
              .not
              .toContain('clickableClasses');
          });
        });
      });
    });
  });
});
