import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  chatActionTypes,
  chatNotificationDismissedSpy,
  chatOpenedSpy,
  mockEmailValidValue,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    mockEmailValidValue = true;

    chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed')
      .and.returnValue({ type: 'widget/chat/CHAT_NOTIFICATION_DISMISSED' });
    chatOpenedSpy = jasmine.createSpy('chatOpened')
      .and.returnValue({ type: 'widget/chat/CHAT_OPENED' });

    initMockRegistry({
      'src/redux/modules/chat': {
        chatNotificationDismissed: chatNotificationDismissedSpy,
        chatOpened: chatOpenedSpy
      },
      'utility/utils': { emailValid: () => mockEmailValidValue }
    });

    const actionsPath = buildSrcPath('redux/modules/base');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');
    const chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    chatActionTypes = requireUncached(chatActionTypesPath);

    mockStore = createMockStore({ base: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateActiveEmbed', () => {
    let embed,
      action,
      actionList;

    describe('when the new active embed is chat', () => {
      beforeEach(() => {
        embed = 'chat';
        mockStore.dispatch(actions.updateActiveEmbed(embed));
        actionList = mockStore.getActions();
      });

      it('dispatches an action of type CHAT_OPENED', () => {
        expect(actionList[0].type)
          .toEqual(chatActionTypes.CHAT_OPENED);
      });

      it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
        expect(actionList[1].type)
          .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
      });

      it('has the embed in the payload', () => {
        expect(actionList[1].payload)
          .toEqual(embed);
      });
    });

    describe('when the new active embed is not chat', () => {
      beforeEach(() => {
        embed = 'helpCenter';
        mockStore.dispatch(actions.updateActiveEmbed(embed));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
        expect(action.type)
          .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
      });

      it('has the embed in the payload', () => {
        expect(action.payload)
          .toEqual(embed);
      });
    });
  });

  describe('updateEmbedAccessible', () => {
    let embed,
      accessible,
      action;

    beforeEach(() => {
      embed = 'helpCenter';
      accessible = true;
      mockStore.dispatch(actions.updateEmbedAccessible(embed, accessible));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_EMBED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_EMBED);
    });

    it('has a name property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ name: embed }));
    });

    it('has an accessible property in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({ params: { accessible } }));
    });
  });

  describe('updateBackButtonVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateBackButtonVisibility(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_BACK_BUTTON_VISIBILITY', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_BACK_BUTTON_VISIBILITY);
    });

    it('has the value of true in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('updateAuthenticated', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateAuthenticated(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_AUTHENTICATED', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_AUTHENTICATED);
    });

    it('has the value of true in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('updateWidgetShown', () => {
    let action,
      actionList;

    describe('when activeEmbed is not chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'apoorv' } });
        mockStore.dispatch(actions.updateWidgetShown(true));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
        expect(action.type)
          .toEqual(actionTypes.UPDATE_WIDGET_SHOWN);
      });

      it('has the value of true in the payload', () => {
        expect(action.payload)
          .toEqual(true);
      });
    });

    describe('when activeEmbed is chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'chat' } });
      });

      describe('when widget is shown', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.updateWidgetShown(true));
          actionList = mockStore.getActions();
        });

        it('dispatches an action of type UPDATE_WIDGET_SHOWN', () => {
          expect(actionList[0].type)
            .toEqual(actionTypes.UPDATE_WIDGET_SHOWN);
        });

        it('has the value of true in the payload', () => {
          expect(actionList[0].payload)
            .toEqual(true);
        });

        it('dispatches an action of CHAT_OPENED', () => {
          expect(actionList[1].type)
            .toEqual(chatActionTypes.CHAT_OPENED);
        });
      });

      describe('when widget is not shown', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.updateWidgetShown(false));
          actionList = mockStore.getActions();
        });

        it('has the value of false in the payload', () => {
          expect(actionList[0].payload)
            .toEqual(false);
        });

        it('does not dispatch an action of CHAT_OPENED', () => {
          expect(actionList.length)
            .toEqual(1);
        });
      });
    });
  });

  describe('handleIdentifyRecieved', () => {
    let action;
    const mockUser = {
      name: 'Harry Potter',
      email: 'hpotter@hogwarts.edu.uk'
    };

    beforeEach(() => {
      mockStore.dispatch(actions.handleIdentifyRecieved(mockUser));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type IDENTIFY_RECIEVED', () => {
      expect(action.type)
        .toEqual(actionTypes.IDENTIFY_RECIEVED);
    });

    it('passes the value to the payload', () => {
      expect(action.payload)
        .toEqual(mockUser);
    });

    describe('when the email is not valid', () => {
      beforeEach(() => {
        mockUser.email = 'hpotter@hogwarts';
        mockEmailValidValue = false;
        mockStore.dispatch(actions.handleIdentifyRecieved(mockUser));
        action = mockStore.getActions()[1];
      });

      it('does not pass through the email in payload', () => {
        expect(action.payload.email)
          .toBeFalsy();
      });

      it('still passes through the name in payload', () => {
        expect(action.payload.name)
          .toBe(mockUser.name);
      });
    });
  });

  describe('widgetHideAnimationComplete', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.widgetHideAnimationComplete());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type WIDGET_HIDE_ANIMATION_COMPLETE', () => {
      expect(action.type)
        .toEqual(actionTypes.WIDGET_HIDE_ANIMATION_COMPLETE);
    });
  });
});
