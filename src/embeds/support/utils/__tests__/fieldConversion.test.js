import {
  getCheckboxFields,
  getNonCheckboxFields,
  convertFieldValue,
  getSortedFields,
  mapKeyFields,
  getParsedValues,
  getFieldIdFromKeyID
} from '../fieldConversion'

describe('getCheckboxFields', () => {
  it('returns a new list with only checkboxes', () => {
    const result = getCheckboxFields([
      { name: 'checkbox', type: 'checkbox' },
      { name: 'notACheckbox', type: 'text' }
    ])

    expect(result).toEqual([{ name: 'checkbox', type: 'checkbox' }])
  })
})

describe('getNonCheckboxFields', () => {
  it('returns a new list without checkboxes', () => {
    const result = getNonCheckboxFields([
      { name: 'checkbox', type: 'checkbox' },
      { name: 'notACheckbox', type: 'text' }
    ])

    expect(result).toEqual([{ name: 'notACheckbox', type: 'text' }])
  })
})

describe('convertFieldValue', () => {
  describe('checkboxes', () => {
    it('converts values to numbers because checkboxes are weird', () => {
      expect(convertFieldValue('checkbox', '0')).toEqual(0)
      expect(convertFieldValue('checkbox', '1')).toEqual(1)
    })
  })
})

describe('getSortedfields', () => {
  it('sorts fields into the expected order: Non-Checkbox -> CheckBox', () => {
    const result = getSortedFields([
      { name: 'checkboxOne', type: 'checkbox' },
      { name: 'Not1', type: 'text' },
      { name: 'checkboxTwo', type: 'checkbox' },
      { name: 'Not2', type: 'text' }
    ])

    expect(result).toEqual([
      { name: 'Not1', type: 'text' },
      { name: 'Not2', type: 'text' },
      { name: 'checkboxOne', type: 'checkbox' },
      { name: 'checkboxTwo', type: 'checkbox' }
    ])
  })
})

describe('mapKeyFields', () => {
  it(`maps the keyIDs to be '{id}{name}'`, () => {
    const ticketFields = [
      { id: 0, title_in_portal: 'name' },
      { id: 1, title_in_portal: 'email' },
      { id: 100000, title_in_portal: 'Custom field' }
    ]
    const mappedFields = mapKeyFields(ticketFields)

    expect(mappedFields).toEqual([
      { id: 0, title_in_portal: 'name', keyID: '0name' },
      { id: 1, title_in_portal: 'email', keyID: '1email' },
      { id: 100000, title_in_portal: 'Custom field', keyID: '100000Custom field' }
    ])
  })
})

describe('getParsedValues', () => {
  it('returns an object with field values: {id: value} from {keyID: value}', () => {
    const ticketFields = [
      { id: 0, title_in_portal: 'name', keyID: '0name' },
      { id: 1, title_in_portal: 'email', keyID: '1email' },
      { id: 100000, title_in_portal: 'Custom field', keyID: '100000Custom field' }
    ]
    const values = {
      '0name': 'hey a test',
      '1email': 'bob@saget.com',
      '100000Custom field': 'custom text'
    }

    const parsedValues = getParsedValues(values, ticketFields)

    expect(parsedValues).toEqual({
      '0': 'hey a test',
      '1': 'bob@saget.com',
      '100000': 'custom text'
    })
  })
})

describe('getFieldIdFromKeyField', () => {
  it('gets the ID from a field if its keyField matches', () => {
    const ticketFields = [
      { id: 0, title_in_portal: 'name', keyID: '0name' },
      { id: 1, title_in_portal: 'email', keyID: '1email' },
      { id: 100000, title_in_portal: 'Custom field', keyID: '100000Custom field' }
    ]

    const result = getFieldIdFromKeyID(ticketFields, '1email')

    expect(result).toEqual('1')
  })

  it('returns null when no field has a matching keyID', () => {
    const ticketFields = [
      { id: 0, title_in_portal: 'name', keyID: '0name' },
      { id: 1, title_in_portal: 'email', keyID: '1email' },
      { id: 100000, title_in_portal: 'Custom field', keyID: '100000Custom field' }
    ]

    const result = getFieldIdFromKeyID(ticketFields, '200000NonExistenField')

    expect(result).toEqual(null)
  })
})
