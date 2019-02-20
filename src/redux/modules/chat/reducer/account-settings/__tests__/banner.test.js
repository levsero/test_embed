import reducer from '../banner';
import { UPDATE_PREVIEWER_SETTINGS } from 'src/redux/modules/chat/chat-action-types';

const initialState = () => {
  return reducer(undefined, { type: '' });
};

const reduce = (payload) => {
  return reducer(initialState(), {
    type: UPDATE_PREVIEWER_SETTINGS,
    payload
  });
};

test('initial state', () => {
  expect(initialState())
    .toEqual({
      enabled: false,
      layout: 'image_only',
      image: '',
      text: 'Chat with us'
    });
});

describe('when UPDATE_PREVIEWER_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      banner: {
        layout: 'image_left',
        image_path: 'http://img.com/img.png',
        text: 'chat it up',
        enabled: true
      }
    };

    expect(reduce(payload))
      .toEqual({
        layout: 'image_left',
        image: 'http://img.com/img.png',
        text: 'chat it up',
        enabled: true
      });
  });
});
