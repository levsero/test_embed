import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  hideChatNotificationSpy,
  mockStore;

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('base redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    hideChatNotificationSpy = jasmine.createSpy('hideChatNotification')
      .and
      .returnValue({ type: 'widget/chat/HIDE_CHAT_NOTIFICATION' });

    initMockRegistry({
      'src/redux/modules/chat': { hideChatNotification: hideChatNotificationSpy }
    });

    const actionsPath = buildSrcPath('redux/modules/base');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockStore = createMockStore({ base: {} });
  });

  afterEach(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('updateActiveEmbed', () => {
    let embed,
      action;

    describe('when the new active embed is chat', () => {
      beforeEach(() => {
        embed = 'chat';
        mockStore.dispatch(actions.updateActiveEmbed(embed));
        action = mockStore.getActions()[1];
      });

      it('calls hideChatNotification()', () => {
        expect(hideChatNotificationSpy)
          .toHaveBeenCalled();
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
});
