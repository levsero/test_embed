import { updateMenuVisibility } from '../actions'
import { UPDATE_CHAT_MENU_VISIBILITY } from 'embeds/chat/actions/action-types'

describe('chat actions', () => {
  describe('updateMenuVisibility', () => {
    it("returns an action to update the menu's visiblity", () => {
      expect(updateMenuVisibility(true)).toEqual({
        type: UPDATE_CHAT_MENU_VISIBILITY,
        payload: true
      })
    })
  })
})
