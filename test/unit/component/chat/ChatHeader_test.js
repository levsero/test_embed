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
          t: _.identity
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
    let component, componentNode;

    beforeEach(() => {
      const props = {
        concierge: [
          {
            avatar: 'https://example.com/snake',
            display_name: 'Luke Skywalker',
            title: 'Jedi Knight'
          }
        ]
      };

      component = domRender(<ChatHeader {...props} />);
      componentNode = ReactDOM.findDOMNode(component);
    });

    it('renders an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar))
        .not.toThrow();
    });

    describe('title text', () => {
      let titleElem;

      describe('when the prop is passed in', () => {
        beforeEach(() => {
          titleElem = componentNode.querySelector('.textContainer').firstChild;
        });

        it('uses the agents name as the title', () => {
          expect(titleElem.innerHTML)
            .toEqual('Luke Skywalker');
        });
      });

      describe('when it is not passed in', () => {
        beforeEach(() => {
          component = domRender(<ChatHeader />);
          componentNode = ReactDOM.findDOMNode(component);
          titleElem = componentNode.querySelector('.textContainer').firstChild;
        });

        it('uses the default string for the title', () => {
          expect(titleElem.innerHTML)
            .toEqual('embeddable_framework.chat.header.default.title');
        });
      });
    });

    describe('byline text', () => {
      let subTextElem;

      describe('when the prop is passed in', () => {
        beforeEach(() => {
          subTextElem = componentNode.querySelector('.textContainer').childNodes[1];
        });

        it('uses the agents name as the title', () => {
          expect(subTextElem.innerHTML)
            .toEqual('Jedi Knight');
        });
      });

      describe('when it is not passed in', () => {
        beforeEach(() => {
          component = domRender(<ChatHeader />);
          componentNode = ReactDOM.findDOMNode(component);
          subTextElem = componentNode.querySelector('.textContainer').childNodes[1];
        });

        it('uses the default string for the title', () => {
          expect(subTextElem.innerHTML)
            .toEqual('embeddable_framework.chat.header.by_line');
        });
      });
    });

    it('passes Icon--avatar as the fallback icon to the avatar component', () => {
      const avatar = TestUtils.findRenderedComponentWithType(component, MockAvatar);

      expect(avatar.props.fallbackIcon)
        .toEqual('Icon--avatar');
    });
  });

  describe('renderAvatarContainer', () => {
    let component, avatarContainer;
    const avatarDetails = {
      avatar: 'https://example.com/snake',
      display_name: 'Luke Skywalker',
      title: 'Jedi Knight'
    };

    describe('when there is one agent', () => {
      beforeEach(() => {
        const props = {
          concierge: [ avatarDetails ]
        };

        component = domRender(<ChatHeader {...props} />);
        spyOn(component, 'renderAvatars');
        avatarContainer = component.renderAvatarContainer();
      });

      it('sets the style width to 32/12rem', () => {
        expect(avatarContainer.props.style.width)
          .toBe(`${32/12}rem`);
      });

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars)
          .toHaveBeenCalledWith([ avatarDetails ]);
      });
    });

    describe('when there are two agents', () => {
      beforeEach(() => {
        const props = {
          concierge: [ avatarDetails, avatarDetails ]
        };

        component = domRender(<ChatHeader {...props} />);
        spyOn(component, 'renderAvatars');
        avatarContainer = component.renderAvatarContainer();
      });

      it('sets the style width to 52/12rem', () => {
        expect(avatarContainer.props.style.width)
          .toBe(`${52/12}rem`);
      });

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars)
          .toHaveBeenCalledWith([ avatarDetails, avatarDetails ]);
      });
    });

    describe('when there are three agents', () => {
      beforeEach(() => {
        const props = {
          concierge: [ avatarDetails, avatarDetails, avatarDetails ]
        };

        component = domRender(<ChatHeader {...props} />);
        spyOn(component, 'renderAvatars');
        avatarContainer = component.renderAvatarContainer();
      });

      it('sets the style width to 72/12rem', () => {
        expect(avatarContainer.props.style.width)
          .toBe(`${72/12}rem`);
      });

      it('calls renderAvatars with the concierge details', () => {
        expect(component.renderAvatars)
          .toHaveBeenCalledWith([ avatarDetails, avatarDetails, avatarDetails ]);
      });
    });

    describe('when there are more than three agents', () => {
      beforeEach(() => {
        const props = {
          concierge: [ avatarDetails, avatarDetails, avatarDetails, avatarDetails ]
        };

        component = domRender(<ChatHeader {...props} />);
        spyOn(component, 'renderAvatars');
        avatarContainer = component.renderAvatarContainer();
      });

      it('sets the style width to 72/12rem', () => {
        expect(avatarContainer.props.style.width)
          .toBe(`${72/12}rem`);
      });

      it('calls renderAvatars with just the first three avatars', () => {
        expect(component.renderAvatars)
          .toHaveBeenCalledWith([ avatarDetails, avatarDetails, avatarDetails ]);
      });
    });
  });

  describe('renderAvatars', () => {
    let component, avatars;
    const avatarDetails = {
      avatar: 'https://example.com/snake',
      display_name: 'Luke Skywalker',
      title: 'Jedi Knight'
    };

    beforeEach(() => {
      const props = {
        concierge: [ avatarDetails, avatarDetails, avatarDetails ]
      };

      component = domRender(<ChatHeader {...props} />);
      avatars = component.renderAvatars(props.concierge);
    });

    it('returns an array of Avatars', () => {
      avatars.forEach((avatar) => {
        expect(TestUtils.isElementOfType(avatar, MockAvatar))
          .toEqual(true);
      });
    });
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
