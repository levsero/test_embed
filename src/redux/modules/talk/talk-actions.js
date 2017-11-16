import {
  UPDATE_SCREEN,
  UPDATE_CALL_ME_FORM,
  UPDATE_PHONE_NUMBER
} from './talk-action-types';

export function updateTalkScreen(screen) {
  return {
    type: UPDATE_SCREEN,
    payload: screen
  };
}

export function updateTalkCallMeForm(formState) {
  return {
    type: UPDATE_CALL_ME_FORM,
    payload: formState
  };
}

export function updateTalkPhoneNumber(phoneNumber) {
  return {
    type: UPDATE_PHONE_NUMBER,
    payload: phoneNumber
  };
}
