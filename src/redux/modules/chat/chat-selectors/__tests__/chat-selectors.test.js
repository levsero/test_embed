import * as selectors from '../chat-selectors';
import getTestState from 'src/fixtures/chat-selectors-test-state';

test('getChats', () => {
  const result = selectors.getChats(getTestState);

  expect(result).toEqual(new Map([
    [1, { timestamp: 1 }],
    [2, { timestamp: 2 }]
  ]));
});

test('isAgent', () => {
  const nonAgentResult = selectors.isAgent('Neo');
  const agentResult = selectors.isAgent('agent:Smith');

  expect(nonAgentResult).toEqual(false);
  expect(agentResult).toEqual(true);
});

test('getThemeMessageType', () => {
  const result = selectors.getThemeMessageType(getTestState);

  expect(result).toEqual('HelloMyNameIsTaipan');
});

test('getOrderedAgents', () => {
  const result = selectors.getOrderedAgents(getTestState);

  expect(result).toEqual(['Bob', 'Charlie', 'Groundskeeper Willie']);
});

test('getShowOperatingHours', () => {
  const result = selectors.getShowOperatingHours(getTestState);

  expect(result).toEqual('foo');
});

test('getForcedStatus', () => {
  const result = selectors.getForcedStatus(getTestState);

  expect(result).toEqual('Caaarrrrrrrrllll, that kills people');
});

test('getInactiveAgents', () => {
  const result = selectors.getInactiveAgents(getTestState);

  expect(result).toEqual('Lois Lane');
});

test('getSocialLogin', () => {
  const result = selectors.getSocialLogin(getTestState);

  expect(result).toEqual(54321);
});

test('getConnection', () => {
  const result = selectors.getConnection(getTestState);

  expect(result).toEqual('emotional');
});

test('getCurrentMessage', () => {
  const result = selectors.getCurrentMessage(getTestState);

  expect(result).toEqual('I can\'t let you do that, Dave');
});

test('getCurrentSessionStartTime', () => {
  const result = selectors.getCurrentSessionStartTime(getTestState);

  expect(result).toEqual('Too Early');
});

test('getChatRating', () => {
  const result = selectors.getChatRating(getTestState);

  expect(result).toEqual(9001);
});

test('getChatRating', () => {
  const result = selectors.getChatScreen(getTestState);

  expect(result).toEqual('blue');
});

test('getChatStatus', () => {
  const result = selectors.getChatStatus(getTestState);

  expect(result).toEqual('Gaming');
});

test('getChatVisitor', () => {
  const result = selectors.getChatVisitor(getTestState);

  expect(result).toEqual('Kerrigan');
});

test('getIsChatting', () => {
  const result = selectors.getIsChatting(getTestState);

  expect(result).toEqual('foo');
});

test('getNotificationCount', () => {
  const result = selectors.getNotificationCount(getTestState);

  expect(result).toEqual(321);
});

test('getPostchatFormSettings', () => {
  const result = selectors.getPostchatFormSettings(getTestState);

  expect(result).toEqual({ hello: 'world' });
});

test('getEmailTranscript', () => {
  const result = selectors.getEmailTranscript(getTestState);

  expect(result).toEqual('Vodka is pretty overrated');
});

test('getAttachmentsEnabled', () => {
  const result = selectors.getAttachmentsEnabled(getTestState);

  expect(result).toEqual('maybe');
});

test('getRatingSettings', () => {
  const result = selectors.getRatingSettings(getTestState);

  expect(result).toEqual('Hawaii Five-Oh');
});

test('getQueuePosition', () => {
  const result = selectors.getQueuePosition(getTestState);

  expect(result).toEqual(1000);
});

test('getUserSoundSettings', () => {
  const result = selectors.getUserSoundSettings(getTestState);

  expect(result).toEqual('boop');
});

test('getReadOnlyState', () => {
  const result = selectors.getReadOnlyState(getTestState);

  expect(result).toEqual('sure thing');
});

test('getChatOfflineForm', () => {
  const result = selectors.getChatOfflineForm(getTestState);

  expect(result).toEqual({ hello: 'charlie' });
});

test('getOfflineMessage', () => {
  const result = selectors.getOfflineMessage(getTestState);

  expect(result).toEqual('Oops, offline!');
});

test('getPreChatFormState', () => {
  const result = selectors.getPreChatFormState(getTestState);

  expect(result).toEqual({ charlie: 'say hello back!' });
});

test('getEditContactDetails', () => {
  const result = selectors.getEditContactDetails(getTestState);

  expect(result).toEqual('bad edit');
});

test('getMenuVisible', () => {
  const result = selectors.getMenuVisible(getTestState);

  expect(result).toEqual('sure thang buddy');
});

test('getAgentJoined', () => {
  const result = selectors.getAgentJoined(getTestState);

  expect(result).toEqual('Sam I am');
});

test('getLastReadTimestamp', () => {
  const result = selectors.getLastReadTimestamp(getTestState);

  expect(result).toEqual('Doomsday');
});

test('getOperatingHours', () => {
  const result = selectors.getOperatingHours(getTestState);

  expect(result).toEqual('25/8');
});

test('getLoginSettings', () => {
  const result = selectors.getLoginSettings(getTestState);

  expect(result).toEqual('unsafePassword');
});

test('getStandaloneMobileNotificationVisible', () => {
  const result = selectors.getStandaloneMobileNotificationVisible(getTestState);

  expect(result).toEqual('this is a really long var name');
});

test('getIsAuthenticated', () => {
  const result = selectors.getIsAuthenticated(getTestState);

  expect(result).toEqual('nope');
});

test('getZChatVendor', () => {
  const result = selectors.getZChatVendor(getTestState);

  expect(result).toEqual('mmm... legacy');
});

test('getSliderVendor', () => {
  const result = selectors.getSliderVendor(getTestState);

  expect(result).toEqual('wheeeeeee');
});

test('GetLuxonVendor', () => {
  const result = selectors.getLuxonVendor(getTestState);

  expect(result).toEqual('What am I?');
});

test('getWindowSettings', () => {
  const result = selectors.getWindowSettings(getTestState);

  expect(result).toEqual({ x: 'y' });
});

test('getThemeColor', () => {
  const result = selectors.getThemeColor(getTestState);

  expect(result).toEqual({
    base: 'green',
    text: undefined
  });
});

test('getBadgeColor', () => {
  const result = selectors.getBadgeColor(getTestState);

  expect(result).toEqual('wait, no, blue!');
});

test('getChatAccountSettingsConcierge', () => {
  const result = selectors.getChatAccountSettingsConcierge(getTestState);

  expect(result).toEqual({ yes: 'madame' });
});

test('getChatAccountSettingsOfflineForm', () => {
  const result = selectors.getChatAccountSettingsOfflineForm(getTestState);

  expect(result).toEqual({ ohNo: 'We\'re down!' });
});

test('getChatAccountSettingsPrechatForm', () => {
  const result = selectors.getChatAccountSettingsPrechatForm(getTestState);

  expect(result).toEqual({ Ive: 'been waiting for this' });
});

test('getDepartments', () => {
  const result = selectors.getDepartments(getTestState);

  expect(result).toEqual({ one: 'blah', two: 'heh', three: 'oh' });
});

test('getAccountSettingsLauncherBadge', () => {
  const result = selectors.getAccountSettingsLauncherBadge(getTestState);

  expect(result).toEqual({
    helloThere: 'GENERAL KENOBI!',
    enabled: 'you are a bold one!'
  });
});

test('getChatBadgeEnabled', () => {
  const result = selectors.getChatBadgeEnabled(getTestState);

  expect(result).toEqual('you are a bold one!');
});

test('getHideBranding', () => {
  const result = selectors.getHideBranding(getTestState);

  expect(result).toEqual(true);
});

test('getAccountDefaultDepartmentId', () => {
  const result = selectors.getAccountDefaultDepartmentId(getTestState);

  expect(result).toEqual(123456);
});

test('getDepartmentList', () => {
  const result = selectors.getDepartmentsList(getTestState);

  expect(result).toEqual(['blah', 'heh', 'oh']);
});

test('getIsLoggingOut', () => {
  const result = selectors.getIsLoggingOut(getTestState);

  expect(result).toEqual('eh');
});

test('getFirstMessageTimestamp', () => {
  const result = selectors.getFirstMessageTimestamp(getTestState);

  expect(result).toEqual(1);
});

test('getFirstMessageTimestamp when map is invalid', () => {
  const invalidState = { chat: { chats: new Map([
    [undefined],
    [undefined]
  ]) } };

  jest.spyOn(Date, 'now').mockReturnValue('blarp');

  const result = selectors.getFirstMessageTimestamp(invalidState);

  expect(result).toEqual('blarp');
  Date.now.mockRestore();
  expect(Date.now()).not.toEqual('blarp');
});
