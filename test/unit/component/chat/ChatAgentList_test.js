describe('ChatAgentList component', () => {
  let ChatAgentList;
  const chatAgentListPath = buildSrcPath('component/chat/ChatAgentList');
  const Avatar = noopReactComponent('Avatar');

  const findComponentByType = (components, type) => (
    components.find((el) => TestUtils.isElementOfType(el, type))
  );

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatAgentList.scss': {
        locals: {
          'container': 'containerClasses',
          'avatar': 'avatarClasses',
          'textContainer': 'textContainerClasses',
          'name': 'nameClasses',
          'title': 'titleClasses'
        }
      },
      'component/Avatar': {
        Avatar
      }
    });

    mockery.registerAllowable(chatAgentListPath);
    ChatAgentList = requireUncached(chatAgentListPath).ChatAgentList;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let agents,
      component;

    beforeEach(() => {
      component = instanceRender(<ChatAgentList agents={agents} />);
    });

    describe('when no agents are passed to the prop', () => {
      beforeAll(() => {
        agents = {};
      });

      it('does not render anything', () => {
        expect(component.render())
          .toEqual([]);
      });
    });

    describe('when agents are passed to the prop', () => {
      beforeAll(() => {
        agents = {
          'agent:1234': {
            avatar_path: '1234_avatar_path',
            display_name: '1234_name',
            title: '1234_title'
          },
          'agent:4567': {
            avatar_path: '4567_avatar_path',
            display_name: '4567_name',
            title: '4567_title'
          }
        };
      });

      it('returns an element for each agent', () => {
        expect(component.render().length)
          .toEqual(Object.keys(agents).length);
      });
    });

    describe('avatar', () => {
      let avatar,
        agent;

      beforeAll(() => {
        agent = {
          avatar_path: '1234_avatar_path',
          display_name: '1234_name',
          title: '1234_title'
        };
        agents = { 'agent:1234': agent };
      });

      beforeEach(() => {
        avatar = findComponentByType(
          component.render()[0].props.children,
          Avatar
        );
      });

      it('is rendered with the src set to the avatar_path', () => {
        expect(avatar.props.src)
          .toEqual(agent.avatar_path);
      });

      it('is rendered with the fallbackIcon set to Icon--agent-avatar', () => {
        expect(avatar.props.fallbackIcon)
          .toEqual('Icon--agent-avatar');
      });
    });
  });
});
