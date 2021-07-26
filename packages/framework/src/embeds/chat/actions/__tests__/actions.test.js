import {
  SOUND_ICON_CLICKED,
  UPDATE_CHAT_MENU_VISIBILITY,
} from 'src/embeds/chat/actions/action-types'
import { handleSoundIconClick, updateMenuVisibility } from '../actions'

describe('chat actions', () => {
  describe('updateMenuVisibility', () => {
    it("returns an action to update the menu's visiblity", () => {
      expect(updateMenuVisibility(true)).toEqual({
        type: UPDATE_CHAT_MENU_VISIBILITY,
        payload: true,
      })
    })
  })

  describe('handleSoundIconClick', () => {
    it('returns an action to handle the sound icon being clicked', () => {
      const settings = {
        sound: true,
      }

      expect(handleSoundIconClick(settings)).toEqual({
        type: SOUND_ICON_CLICKED,
        payload: settings,
      })
    })
  })
})
