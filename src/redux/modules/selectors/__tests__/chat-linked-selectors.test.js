/* eslint-disable camelcase */
import * as selectors from '../chat-linked-selectors';
import * as globals from 'utility/globals';
import getModifiedState from 'src/fixtures/chat-reselectors-test-state';

describe('getShowMenu', () => {
  let result;

  test('when values are correct', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false);
    result = selectors.getShowMenu(getModifiedState());

    expect(result).toEqual(true);
    globals.isPopout.mockRestore();
  });

  describe('when a value is false', () => {
    test('when activeEmbed is not chat', () => {
      result = selectors.getShowMenu(getModifiedState({ base: { activeEmbed: 'notChat' } }));

      expect(result).toEqual(false);
    });

    test('when chat screen is not CHATTING_SCREEN', () => {
      result = selectors.getShowMenu(getModifiedState({ chat: { screen: 'ohLookThisIsIncorrect' } }));

      expect(result).toEqual(false);
    });

    test('when isPopout is true', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(true);
      const result = selectors.getShowMenu(getModifiedState());

      expect(result).toEqual(false);
      globals.isPopout.mockRestore();
    });
  });
});

test('getProfileConfig returns the expected value', () => {
  const result = selectors.getProfileConfig(getModifiedState());

  expect(result).toEqual({
    avatar: 'av',
    title: 'ti',
    rating: 'ra'
  });
});

describe('getChatAccountSettingsTitle', () => {
  let result;

  test('returns the expected value when state is correct', () => {
    result = selectors.getChatAccountSettingsTitle(getModifiedState());

    expect(result).toEqual('blorp');
  });

  test('returns i18n\'d title when windowSettings title is undefined', () => {
    result = selectors.getChatAccountSettingsTitle(
      getModifiedState({ chat: { accountSettings: { chatWindow: { title: null } } } })
    );

    expect(result).toEqual('Chat with us');
  });
});

describe('getShowBackButton', () => {
  let result;
  const backButtonState = (showChatHistory, backButtonVisible) => ({
    chat: { showChatHistory },
    base: { backButtonVisible }
  });

  test('when getShowChatHistory is true', () => {
    result = selectors.getShowBackButton(getModifiedState(backButtonState(true, false)));

    expect(result).toEqual(true);
  });

  test('when getBackButtonVisible is true', () => {
    result = selectors.getShowBackButton(getModifiedState(backButtonState(false, true)));

    expect(result).toEqual(true);
  });

  test('when both are true', () => {
    result = selectors.getShowBackButton(getModifiedState(backButtonState(true, true)));

    expect(result).toEqual(true);
  });

  test('when both are false', () => {
    result = selectors.getShowBackButton(getModifiedState(backButtonState(false, false)));

    expect(result).toEqual(false);
  });
});

describe('getChatTitle', () => {
  let result;

  test('returns i18n of settings Chat Title when translations are included', () => {
    result = selectors.getChatTitle(getModifiedState());

    expect(result).toEqual('Hello World');
  });

  test('returns Account Settings Title when translation is not included', () => {
    result = selectors.getChatTitle(getModifiedState({
      settings: { chat: { title: null } }
    }));

    expect(result).toEqual('blorp');
  });
});

describe('getLauncherBadgeSettings aggregates badge and label settings', () => {
  let result;

  test('when label is correctly set', () => {
    result = selectors.getLauncherBadgeSettings(getModifiedState());

    expect(result).toEqual({
      text: 'badgeText',
      image: 'heyLookA.img',
      label: 'badgeLabel',
      layout: 'left, no right... The other left?'
    });
  });

  test('when label is incorrectly set, use badgeText', () => {
    result = selectors.getLauncherBadgeSettings(getModifiedState({
      settings: { launcher : { badge: { label: 'ThisIsTheIncorrectStructure ' } } }
    }));

    expect(result).toEqual({
      text: 'badgeText',
      image: 'heyLookA.img',
      label: 'badgeText',
      layout: 'left, no right... The other left?'
    });
  });
});

describe('getConciergeSettings', () => {
  let result;

  test('overrides chat state with settings', () => {
    result = selectors.getConciergeSettings(getModifiedState());

    expect(result).toEqual({
      avatar_path: 'overrideAvatarPath',
      display_name: 'overrideName',
      title: 'overrideTitle'
    });
  });

  test('when no overrides present, use chat state', () => {
    result = selectors.getConciergeSettings(getModifiedState({
      settings: {
        chat: {
          concierge: null
        }
      }
    }));

    expect(result).toEqual({
      avatar_path: 'regularAvatarPath',
      display_name: 'regularName',
      title: { '*': 'regularTitle' }
    });
  });
});

describe('getOfflineFormSettings', () => {
  let result;

  test('when accountSettings is set and greeting is also set', () => {
    result = selectors.getOfflineFormSettings(getModifiedState());

    expect(result).toEqual({
      boop: 'boop2',
      message: 'hello fren',
      form: {
        0: { name: 'name', required: true },
        2: { name: 'phone', label: 'Phone Number', required: true },
        3: { name: 'message', label: 'Message', required: false }
      }
    });
  });

  describe('when accountSettings set and greeting is not set', () => {
    test('returns the chat message', () => {
      result = selectors.getOfflineFormSettings(getModifiedState({
        settings: { chat: { offlineForm: null } }
      }));

      expect(result).toEqual({
        boop: 'boop2',
        message: 'huh...',
        form: {
          0: { name: 'name', required: true },
          2: { name: 'phone', label: 'Phone Number', required: true },
          3: { name: 'message', label: 'Message', required: false }
        }
      });
    });
  });

  describe('when neither the greeting or message is set', () => {
    test('returns the chat message', () => {
      result = selectors.getOfflineFormSettings(getModifiedState({
        settings: {
          chat: {
            offlineForm: null
          }
        },
        chat: {
          accountSettings: {
            offlineForm: null
          }
        }
      }));

      expect(result).toEqual({
        message: 'Sorry, we aren\'t online at the moment. Leave a message and we\'ll get back to you.'
      });
    });
  });
});

describe('getPrechatFormSettings', () => {
  it('returns the expected values', () => {
    const result = selectors.getPrechatFormSettings(getModifiedState());

    expect(result).toEqual({
      greeting: 'accPrechatGreeting',
      departmentLabel: 'accPrechatDeptLabel',
      required: 'burp',
      message: 'accPrechatMessage'
    });
  });

  it('returns override translations in settings', () => {
    const result = selectors.getPrechatFormSettings(getModifiedState({
      settings: {
        chat: {
          prechatForm: {
            departmentLabel: {
              '*': 'prechatTranslatedDeptLabel'
            },
            greeting: {
              '*': 'prechatTranslatedGreeting'
            }
          }
        }
      }
    }));

    expect(result).toEqual({
      required: 'burp',
      message: 'prechatTranslatedGreeting',
      departmentLabel: 'prechatTranslatedDeptLabel',
      greeting: 'accPrechatGreeting'
    });
  });
});

describe('getEnabledDepartments', () => {
  describe('with enabled departments are listed', () => {
    it('returns only enabled departments', () => {
      const result = selectors.getEnabledDepartments(getModifiedState());

      expect(result).toEqual([
        { id: 111, name: 'burgers' },
        { id: 222, name: 'pizza' }
      ]);
    });
  });

  describe('when enabled is an empty array', () => {
    it('returns no department', () => {
      let modifiedState = getModifiedState({});

      modifiedState.settings.chat.departments.enabled = [];
      const result = selectors.getEnabledDepartments(modifiedState);

      expect(result).toEqual([]);
    });
  });

  describe('when a department is not enabled, but it is the default', () => {
    it('returns it', () => {
      let modifiedState = getModifiedState({});

      modifiedState.settings.chat.departments.enabled = [];
      modifiedState.chat.defaultDepartment.id = 333;

      const result = selectors.getEnabledDepartments(modifiedState);

      expect(result).toEqual([
        { id: 333, name: 'thickshakes' }
      ]);
    });
  });

  describe('when enabled is not an array', () => {
    it('returns all departments', () => {
      const result = selectors.getEnabledDepartments(
        getModifiedState({
          settings: { chat: { departments: { enabled: null } } }
        }));

      expect(result).toEqual([
        { id: 111, name: 'burgers' },
        { id: 222, name: 'pizza' },
        { id: 333, name: 'thickshakes' }
      ]);
    });
  });
});

describe('getDefaultSelectedDepartment', () => {
  describe('when the selected default department is not enabled', () => {
    it('returns the department', () => {
      const result = selectors.getDefaultSelectedDepartment(
        getModifiedState({ chat: { defaultDepartment: { id: 333 } } })
      );

      expect(result).toEqual({ 'id': 333, 'name': 'thickshakes' });
    });
  });

  it('in accountSettings, return that department if settings is not set', () => {
    const result = selectors.getDefaultSelectedDepartment(getModifiedState({
      chat: { defaultDepartment: { id: 111 } }
    }));

    expect(result).toEqual({ id: 111, name: 'burgers' });
  });

  it('ID in settings, override the chat dept', () => {
    const result = selectors.getDefaultSelectedDepartment(getModifiedState({
      settings: { chat : { departments: { select: 111 } } },
      chat: { defaultDepartment: { id: 222 } }
    }));

    expect(result).toEqual({
      id: 111,
      name: 'burgers'
    });
  });

  it('name in settings, return that department', () => {
    const result = selectors.getDefaultSelectedDepartment(getModifiedState({
      settings: { chat : { departments: { select: 'burgers' } } },
      chat: { defaultDepartment: { id: 222 } }
    }));

    expect(result).toEqual({
      id: 111,
      name: 'burgers'
    });
  });
});

describe('getCurrentConcierges', () => {
  let result;

  test('when values are correct', () => {
    result = selectors.getCurrentConcierges(getModifiedState({
      chat: { agents: new Map([]) }
    }));

    expect(result).toEqual([{
      avatar_path: 'overrideAvatarPath' ,
      display_name: 'overrideName',
      title: 'overrideTitle'
    }]);
  });

  test('when there are no agents, return default concierge settings', () => {
    result = selectors.getCurrentConcierges(getModifiedState({
      chat: {
        agents: new Map([])
      }
    }));

    expect(result).toEqual([{
      avatar_path: 'overrideAvatarPath',
      display_name: 'overrideName',
      title: 'overrideTitle'
    }]);
  });

  test('when there are no agents and no override concierge settings, returns regular concierge', () => {
    result = selectors.getCurrentConcierges(getModifiedState({
      chat: {
        agents: new Map([])
      },
      settings: {
        chat: {
          concierge: null
        }
      }
    }));

    expect(result).toEqual([{
      avatar_path: 'regularAvatarPath',
      display_name: 'regularName',
      title: {
        '*': 'regularTitle'
      }
    }]);
  });
});

describe('getOfflineFormFields', () => {
  let result;

  test('returns our predefined offline form fields', () => {
    result = selectors.getOfflineFormFields(getModifiedState());

    expect(result).toEqual({
      message: { label: 'Message', required: false, name: 'message' },
      name: { required: true, name: 'name' },
      phone: { label: 'Phone Number', required: true, name: 'phone' }
    });
  });
});

describe('getChatNotification', () => {
  let result;

  it('returns mcbob by default', () => {
    result = selectors.getChatNotification(getModifiedState());

    expect(result).toEqual({
      avatar_path: 'bobPath',
      nick: 'agent:mcbob'
    });
  });

  test('returns the concierge avatar_path if agent has no avatar_path', () => {
    result = selectors.getChatNotification(
      getModifiedState({
        chat: { notification: { nick: 'agent:trigger' } }
      }));

    expect(result).toEqual({
      avatar_path: 'overrideAvatarPath',
      nick: 'agent:trigger'
    });
  });
});

describe('isInChattingScreen', () => {
  let result;

  test('when values are correct', () => {
    result = selectors.isInChattingScreen(getModifiedState());

    expect(result).toEqual(true);
  });

  test('when widget has not been shown', () => {
    result = selectors.isInChattingScreen(getModifiedState({
      base: {
        widgetShown: false
      }
    }));

    expect(result).toEqual(false);
  });

  test('screen is not CHATTING_SCREEN', () => {
    result = selectors.isInChattingScreen(getModifiedState({
      chat: {
        screen: 'notChattingScreen'
      }
    }));

    expect(result).toEqual(false);
  });

  test('activeEmbed is not chat', () => {
    result = selectors.isInChattingScreen(getModifiedState({
      base: {
        activeEmbed: 'notChat'
      }
    }));

    expect(result).toEqual(false);
  });
});

describe('getChatHistoryLabel', () => {
  let result;

  it('returns the expected string', () => {
    result = selectors.getChatHistoryLabel(getModifiedState());

    expect(result).toEqual('View past chats');
  });
});

describe('getIsPopoutButtonVisible', () => {
  let result;

  test('when values are correct', () => {
    jest.spyOn(globals,'isPopout').mockReturnValue(false);

    result = selectors.getIsPopoutButtonVisible(getModifiedState());

    expect(result).toEqual(true);
  });

  describe('when values are incorrect', () => {
    test('when getIsPopoutAvailable returns false', () => {
      result = selectors.getIsPopoutButtonVisible(getModifiedState({ chat: { isAuthenticated: true } }));
      expect(result).toEqual(false);
    });

    test('when activeEmbed is not chat', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(false);
      result = selectors.getIsPopoutButtonVisible(getModifiedState({ base: { activeEmbed: 'notChat' } }));
      expect(result).toEqual(false);
      globals.isPopout.mockRestore();
    });

    test('when popout button is not enabled in settings', () => {
      result = selectors.getIsPopoutButtonVisible(getModifiedState(
        { settings: { navigation: { popoutButton: { enabled: false } } } }
      ));
      expect(result).toEqual(false);
    });
  });
});

describe('getOfflineFormEnabled', () => {
  // TODO
});
