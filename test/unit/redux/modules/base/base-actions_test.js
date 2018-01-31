import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  chatActionTypes,
  hideChatNotificationSpy,
  resetNotificationCountSpy,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    hideChatNotificationSpy = jasmine.createSpy('hideChatNotification')
      .and.returnValue({ type: 'widget/chat/HIDE_CHAT_NOTIFICATION' });
    resetNotificationCountSpy = jasmine.createSpy('resetNotificationCount')
      .and.returnValue({ type: 'widget/chat/RESET_NOTIFICATION_COUNT' });

    initMockRegistry({
      'src/redux/modules/chat': {
        hideChatNotification: hideChatNotificationSpy,
        resetNotificationCount: resetNotificationCountSpy
      }
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

      it('calls hideChatNotification()', () => {
        expect(hideChatNotificationSpy)
          .toHaveBeenCalled();
      });

      it('dispatches an action of type HIDE_CHAT_NOTIFICATION', () => {
        expect(actionList[0].type)
          .toEqual(chatActionTypes.HIDE_CHAT_NOTIFICATION);
      });

      it('dispatches an action of type RESET_NOTIFICATION_COUNT', () => {
        expect(actionList[1].type)
          .toEqual(chatActionTypes.RESET_NOTIFICATION_COUNT);
      });

      it('dispatches an action of type UPDATE_ACTIVE_EMBED', () => {
        expect(actionList[2].type)
          .toEqual(actionTypes.UPDATE_ACTIVE_EMBED);
      });

      it('has the embed in the payload', () => {
        expect(actionList[2].payload)
          .toEqual(embed);
      });
    });

    describe('when the new active embed is not chat', () => {
      beforeEach(() => {
        embed = 'helpCenter';
        mockStore.dispatch(actions.updateActiveEmbed(embed));
        action = mockStore.getActions()[0];
      });

      it('does not call hideChatNotification()', () => {
        expect(hideChatNotificationSpy)
          .not.toHaveBeenCalled();
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

  describe('updateEmbedShown', () => {
    let action,
      actionList;

    describe('when activeEmbed is not chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'apoorv' } });
        mockStore.dispatch(actions.updateEmbedShown(true));
        action = mockStore.getActions()[0];
      });

      it('dispatches an action of type UPDATE_EMBED_SHOWN', () => {
        expect(action.type)
          .toEqual(actionTypes.UPDATE_EMBED_SHOWN);
      });

      it('has the value of true in the payload', () => {
        expect(action.payload)
          .toEqual(true);
      });
    });

    describe('when activeEmbed is chat', () => {
      beforeEach(() => {
        mockStore = createMockStore({ base: { activeEmbed: 'chat' } });
        mockStore.dispatch(actions.updateEmbedShown(true));
        actionList = mockStore.getActions();
      });

      it('dispatches an action of type UPDATE_EMBED_SHOWN', () => {
        expect(actionList[0].type)
          .toEqual(actionTypes.UPDATE_EMBED_SHOWN);
      });

      it('has the value of true in the payload', () => {
        expect(actionList[0].payload)
          .toEqual(true);
      });

      it('dispatches an action of RESET_NOTIFICATION_COUNT', () => {
        expect(actionList[1].type)
          .toEqual(chatActionTypes.RESET_NOTIFICATION_COUNT);
      });
    });
  });
});
