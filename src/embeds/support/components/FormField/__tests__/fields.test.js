import getField from '../fields'
import Text from 'embeds/support/components/FormField/Text'
import Textarea from 'embeds/support/components/FormField/Textarea'
import Integer from 'embeds/support/components/FormField/Integer'
import Decimal from 'embeds/support/components/FormField/Decimal'
import Checkbox from 'embeds/support/components/FormField/Checkbox'
import Dropdown from 'embeds/support/components/FormField/Dropdown'
import LegacyDropdown from 'embeds/support/components/FormField/Dropdown/LegacyDropdown'
import FallbackField from 'embeds/support/components/FormField/FallbackField'

describe('getField', () => {
  const expectedFieldTypes = [
    ['text', Text],
    ['textarea', Textarea],
    ['description', Textarea],
    ['subject', Text],
    ['integer', Integer],
    ['decimal', Decimal],
    ['checkbox', Checkbox],
    ['dropdown', Dropdown],
    ['legacyDropdown', LegacyDropdown],
    ['tagger', Dropdown],
    ['', FallbackField],
    ['some unknown field', FallbackField],
    [null, FallbackField],
    [undefined, FallbackField]
  ]

  expectedFieldTypes.forEach(([fieldType, expectedComponent]) => {
    it(`renders a ${expectedComponent.name} component when field type is ${fieldType}`, () => {
      const Field = getField(fieldType)

      expect(Field).toBe(expectedComponent)
    })
  })
})
