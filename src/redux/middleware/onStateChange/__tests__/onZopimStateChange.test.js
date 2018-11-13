import { onZopimChatStateChange } from '../onZopimStateChange';
import * as zopimSelectors from 'src/redux/modules/zopimChat/zopimChat-selectors';
import * as baseSelectors from 'src/redux/modules/selectors';
import { mediator } from 'service/mediator';

jest.mock('service/mediator');
jest.mock('src/redux/modules/zopimChat/zopimChat-selectors');
jest.mock('src/redux/modules/zopimChat');
jest.mock('src/redux/modules/selectors');

const dispatch = jest.fn();

zopimSelectors.getZopimChatStatus = jest.fn((value) => value);

test('all values are correct', () => {
  baseSelectors.getResetToContactFormOnChatOffline = jest.fn(() => true);
  onZopimChatStateChange('online', 'offline', dispatch);

  expect(dispatch)
    .toHaveBeenCalled();
  expect(mediator.channel.broadcast)
    .toHaveBeenCalledWith('zopimChat.hide');
});

test('getResetToContactFormOnChatOffline returns false', () => {
  baseSelectors.getResetToContactFormOnChatOffline = jest.fn(() => false);
  onZopimChatStateChange('online', 'offline', dispatch);

  expect(mediator.channel.broadcast)
    .not.toHaveBeenCalled();
  expect(dispatch)
    .not.toHaveBeenCalled();
});

test('previousState and nextState are identical', () => {
  baseSelectors.getResetToContactFormOnChatOffline = jest.fn(() => true);
  onZopimChatStateChange('online', 'online', dispatch);

  expect(mediator.channel.broadcast)
    .not.toHaveBeenCalled();
  expect(dispatch)
    .not.toHaveBeenCalled();
});
