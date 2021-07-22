import Checkbox from '../Checkbox'
import Decimal from '../Decimal'
import Dropdown from '../Dropdown'
import FallbackField from '../FallbackField'
import Integer from '../Integer'
import Text from '../Text'
import Textarea from '../Textarea'
import getField from '../fields'

describe('getField', () => {
  const expectedFieldTypes = [
    ['text', Text],
    ['subject', Text],
    ['textarea', Textarea],
    ['description', Textarea],
    ['subject', Text],
    ['integer', Integer],
    ['decimal', Decimal],
    ['checkbox', Checkbox],
    ['dropdown', Dropdown],
    ['tagger', Dropdown],
    ['', FallbackField],
    ['some unknown field', FallbackField],
    [null, FallbackField],
    [undefined, FallbackField],
  ]

  expectedFieldTypes.forEach(([fieldType, expectedComponent]) => {
    it(`renders a ${expectedComponent.name} component when field type is ${fieldType}`, () => {
      const Field = getField(fieldType)

      expect(Field).toBe(expectedComponent)
    })
  })
})
