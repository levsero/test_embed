import embeddableConfig from '../base-embeddable-config';
import { UPDATE_EMBEDDABLE_CONFIG } from '../../base-action-types';
import { UPDATE_PREVIEWER_SETTINGS } from 'src/redux/modules/chat/chat-action-types';

test('initial state', () => {
  expect(embeddableConfig(undefined, { type: '' })).toMatchSnapshot();
});

test('UPDATE_PREVIEWER_SETTINGS', () => {
  const state = embeddableConfig(undefined, { type: UPDATE_PREVIEWER_SETTINGS });

  expect(state.cp4).toEqual(true);
});

test('UPDATE_EMBEDDABLE_CONFIG', () => {
  const action = {
    type: UPDATE_EMBEDDABLE_CONFIG,
    payload: {
      embeds: {
        helpCenterForm: {
          props: {
            contextualHelpEnabled: true,
            answerBotEnabled: true
          }
        },
        zopimChat: {
          props: {
            zopimId: 'yoloId'
          }
        },
        talk: {
          props: {
            nickname: 'bluey',
            color: '#123123',
            serviceUrl: 'https://example.com'
          }
        },
        ticketSubmissionForm: {
          props: {
            attachmentsEnabled: true
          }
        }
      },
      cp4: true,
      position: 'left',
      color: 'white',
      textColor: 'black',
      hideZendeskLogo: true,
      brand: 'hello',
      brandCount: 2,
      brandLogoUrl: 'helloworld'
    }
  };

  const state = embeddableConfig(undefined, action);

  expect(state).toMatchSnapshot();
});
