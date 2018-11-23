describe('Launcher', () => {
  let showChatBadgeLauncherValue,
    Launcher,
    component;
  const ChatBadge = noopReactComponent();
  const WidgetLauncher = noopReactComponent();

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'src/component/launcher/ChatBadge': ChatBadge,
      'src/component/launcher/WidgetLauncher': WidgetLauncher,
      'src/redux/modules/selectors': {
        getShowChatBadgeLauncher: noop
      },
      'src/redux/modules/base': {
        launcherClicked: noop
      }
    });

    const path = buildSrcPath('component/launcher/Launcher');

    Launcher = requireUncached(path).default.WrappedComponent;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('showChatBadgeLauncher', () => {
    let result;

    beforeEach(() => {
      component = instanceRender(<Launcher showChatBadgeLauncher={showChatBadgeLauncherValue} />);
      result = component.render();
    });

    describe('when we need to show chat badge', () => {
      beforeAll(() => {
        showChatBadgeLauncherValue = true;
      });

      it('render ChatBadgeLauncher', () => {
        expect(TestUtils.isElementOfType(result, ChatBadge))
          .toEqual(true);
      });
    });

    describe('when we need to show standard launcher pill', () => {
      beforeAll(() => {
        showChatBadgeLauncherValue = false;
      });

      it('render ChatBadgeLauncher', () => {
        expect(TestUtils.isElementOfType(result, WidgetLauncher))
          .toEqual(true);
      });
    });
  });
});
